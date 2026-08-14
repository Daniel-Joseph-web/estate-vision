"use server";

import fs from "fs";
import os from "os";
import path from "path";
import type { Part } from "@google/genai";

import { requireUser } from "@/lib/firebase/admin";
import { getPlaybackUrl } from "@/app/actions/get-playback-url";
import { withGeminiFailover } from "@/lib/gemini/client";

export interface ChatAnalystResult {
  ok: boolean;
  answer?: string;
  events?: Array<{ seconds: number; description: string }>;
  message?: string;
}

export async function analyzeVideoSubject(input: {
  idToken: string;
  videoId: string;
  storageKey: string;
  userPrompt: string;
  screenshotBase64?: string; // Completely optional
}): Promise<ChatAnalystResult> {
  let tempFilePath = "";

  try {
    // 1. Verify the caller owns this video session
    await requireUser(input.idToken);

    // 2. Fetch the secure R2 stream URL
    const playback = await getPlaybackUrl({
      idToken: input.idToken,
      storageKey: input.storageKey,
    });

    if (!playback.ok || !playback.url) {
      return { ok: false, message: "Could not access the video file." };
    }

    // 3. Download the video buffer to a local temporary file
    tempFilePath = path.join(os.tmpdir(), `${input.videoId}-${Date.now()}.mp4`);
    const response = await fetch(playback.url);

    if (!response.ok) {
      throw new Error(`Storage returned an error: ${response.status}. Could not download video.`);
    }

    const fileStream = fs.createWriteStream(tempFilePath);
    if (response.body) {
      // Cast the ReadableStream to an AsyncIterable to strictly satisfy TypeScript
      const stream = response.body as unknown as AsyncIterable<Uint8Array>;
      for await (const chunk of stream) {
        fileStream.write(Buffer.from(chunk));
      }
      
      // Force Node to wait for the file to completely save and close on disk
      await new Promise<void>((resolve, reject) => {
        fileStream.on("finish", () => resolve());
        fileStream.on("error", reject);
        fileStream.end();
      });
    } else {
      throw new Error("Empty video stream received from storage.");
    }

    // 4. Safely parse Base64, accounting for prefixes
    const promptText = `
      You are an expert CCTV security analyst. 
      The user asked: "${input.userPrompt}"
      Analyze the provided video to answer their question.
      If they attached a screenshot, use it as a reference for what they are looking for.
      Return ONLY a valid JSON object matching this exact schema:
      {
        "answer": "Your detailed text response answering the user's question.",
        "events": [ { "seconds": 12, "description": "Brief description of the event here." } ]
      }
      If there are no specific timestamps relevant to the answer, leave the "events" array empty.
    `;

    // 5. Use strict typing with the Part type from @google/genai
    const requestContents: Array<string | Part> = [
      promptText,
    ];

    if (input.screenshotBase64) {
      const base64Data = input.screenshotBase64.includes(",")
        ? input.screenshotBase64.split(",")[1]
        : input.screenshotBase64;
      requestContents.push({ inlineData: { data: base64Data, mimeType: "image/jpeg" } });
    }

    // 6. Upload + poll + generate
    const result = await withGeminiFailover(async (ai) => {
      let uploadedFileName: string | undefined;

      try {
        let fileInfo = await ai.files.upload({
          file: tempFilePath,
          config: { mimeType: "video/mp4" },
        });

        if (!fileInfo.name) throw new Error("Failed to upload video.");
        uploadedFileName = fileInfo.name;
        let fileName = fileInfo.name;

        // Wait for Google to process the video frames
        while (fileInfo.state === "PROCESSING") {
          await new Promise((resolve) => setTimeout(resolve, 3000));
          fileInfo = await ai.files.get({ name: fileName });
          if (!fileInfo.name) throw new Error("Video file name missing.");
          fileName = fileInfo.name;
        }

        if (fileInfo.state === "FAILED") {
          throw new Error("The AI engine could not process this video format.");
        }

        // Add the processed video to the request payload safely
        requestContents.push({
          fileData: {
            fileUri: fileInfo.uri,
            mimeType: fileInfo.mimeType || "video/mp4",
          },
        });

        const aiResponse = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: requestContents,
          config: { responseMimeType: "application/json" },
        });

        if (!aiResponse.text) throw new Error("No response from AI.");

        return JSON.parse(aiResponse.text);
      } finally {
        if (uploadedFileName) {
          await ai.files.delete({ name: uploadedFileName }).catch(() => {});
        }
      }
    });

    return { ok: true, answer: result.answer, events: result.events };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Analysis failed.",
    };
  } finally {
    // 8. Local temp file cleanup
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  }
}