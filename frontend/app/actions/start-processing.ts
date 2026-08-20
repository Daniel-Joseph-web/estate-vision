"use server";

import fs from "fs";
import os from "os";
import path from "path";
import { getAdminDb, requireUser } from "@/lib/firebase/admin";
import { getPlaybackUrl } from "@/app/actions/get-playback-url";
import { withGeminiFailover } from "@/lib/gemini/client";
import type { Part } from "@google/genai";

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

export async function startProcessing(input: {
  idToken: string;
  videoId: string;
}) {
  let tempFilePath = "";

  try {
    if (USE_MOCKS) return { ok: true };

    const user = await requireUser(input.idToken);
    const db = getAdminDb();
    const videoRef = db.collection("videos").doc(input.videoId);
    const videoSnap = await videoRef.get();

    if (!videoSnap.exists) return { ok: false, message: "Video not found." };
    const videoData = videoSnap.data();

    // 1. Get the video from storage
    const playback = await getPlaybackUrl({
      idToken: input.idToken,
      storageKey: videoData?.storage_key,
    });

    if (!playback.ok || !playback.url) throw new Error("Could not access video.");

    // 2. Download to local temp file for Gemini upload
    tempFilePath = path.join(os.tmpdir(), `${input.videoId}-process.mp4`);
    const response = await fetch(playback.url);
    
    if (!response.ok) {
      throw new Error(`Failed to download video: ${response.status} ${response.statusText}`);
    }
    
    const fileStream = fs.createWriteStream(tempFilePath);
    
    // Cast to AsyncIterable to satisfy TS
    const stream = response.body as unknown as AsyncIterable<Uint8Array>;
    for await (const chunk of stream) {
      fileStream.write(Buffer.from(chunk));
    }
    await new Promise<void>((resolve, reject) => {
      fileStream.on("finish", resolve);
      fileStream.on("error", reject);
      fileStream.end();
    });

    // Verify file was downloaded successfully
    const stats = fs.statSync(tempFilePath);
    if (stats.size === 0) {
      throw new Error("Downloaded video file is empty");
    }

    // 3. Send to Gemini for initial audit
    const promptText = `
      Analyze this CCTV footage and provide a structured security audit.
      Return ONLY a valid JSON object with exactly these keys:
      {
        "summary_report": "A detailed, chronological text report of what transpires in the video. Include MM:SS timestamps in the text for key events.",
        "threat_detected": boolean (true if there is suspicious, dangerous, or unauthorized activity, false otherwise)
      }
    `;

    const result = await withGeminiFailover(async (ai) => {
      let uploadedFileName: string | undefined;
      try {
        let fileInfo = await ai.files.upload({
          file: tempFilePath,
          config: { mimeType: "video/mp4" },
        });
        uploadedFileName = fileInfo.name;

        // Wait for Gemini to process the video file
        while (fileInfo.state === "PROCESSING") {
          await new Promise((resolve) => setTimeout(resolve, 3000));
          fileInfo = await ai.files.get({ name: uploadedFileName! });
        }

        if (fileInfo.state === "FAILED") {
          throw new Error("Gemini failed to process the video file");
        }

        const requestContents: Array<string | Part> = [
          promptText,
          { fileData: { fileUri: fileInfo.uri, mimeType: "video/mp4" } }
        ];

        const aiResponse = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: requestContents,
          config: { responseMimeType: "application/json" },
        });

        if (!aiResponse.text) {
          throw new Error("Gemini returned empty response");
        }

        try {
          const parsed = JSON.parse(aiResponse.text);
          return {
            summary_report: typeof parsed.summary_report === 'string' 
              ? parsed.summary_report 
              : "Audit completed. No significant events noted.",
            threat_detected: typeof parsed.threat_detected === 'boolean' 
              ? parsed.threat_detected 
              : false
          };
        } catch (parseError) {
          console.error("Failed to parse Gemini response:", parseError);
          throw new Error("Invalid JSON response from Gemini");
        }
      } finally {
        if (uploadedFileName) {
          await ai.files.delete({ name: uploadedFileName }).catch(() => {});
        }
      }
    });

    // 4. Update Firestore with the AI results
    await videoRef.update({
      status: "complete",
      summary_report: result.summary_report,
      threat_detected: result.threat_detected,
      error_message: null,
    });

    return { ok: true };
  } catch (error) {
    console.error("Processing error:", error);
    
    try {
      const db = getAdminDb();
      await db.collection("videos").doc(input.videoId).update({
        status: "failed",
        error_message: error instanceof Error ? error.message : "AI processing failed.",
      });
    } catch (updateError) {
      console.error("Failed to update error status:", updateError);
    }
    
    return { 
      ok: false, 
      message: error instanceof Error ? error.message : "Processing failed." 
    };
  } finally {
    // Clean up temp file
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (cleanupError) {
        console.error("Failed to clean up temp file:", cleanupError);
      }
    }
  }
}