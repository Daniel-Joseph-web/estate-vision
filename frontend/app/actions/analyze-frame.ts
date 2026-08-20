"use server";

import { withGeminiFailover } from "@/lib/gemini/client";

export interface AnalyzeFrameResult {
  ok: boolean;
  text?: string;
  message?: string;
}

/**
 * Analyzes a single still frame captured from a live camera feed and returns
 * one short line describing what's visible. Used by the Live Operations
 * page's polling loop — not the full-video pipeline in start-processing.ts.
 */
export async function analyzeFrame(input: {
  image: string; // data URL: "data:image/jpeg;base64,...."
  cameraName: string;
}): Promise<AnalyzeFrameResult> {
  try {
    const match = /^data:(image\/\w+);base64,(.+)$/.exec(input.image);
    if (!match) {
      return { ok: false, message: "Invalid image format." };
    }
    const [, mimeType, base64Data] = match;

    const text = await withGeminiFailover(async (ai) => {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash", // matches the model used elsewhere in this app
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `You are a CCTV security AI analyzing a single still frame from camera "${input.cameraName}". In ONE short sentence (under 15 words), report what's visible — people, vehicles, movement, anything unusual. If nothing notable, say the scene looks normal. Start the sentence with "WARNING:" only if something is genuinely concerning (e.g. loitering, forced entry, unattended items). Respond with plain text only, no markdown.`,
              },
              {
                inlineData: {
                  mimeType,
                  data: base64Data,
                },
              },
            ],
          },
        ],
      });

      return response.text ?? "No response from model.";
    });

    return { ok: true, text: text.trim() };
  } catch (error) {
    console.error("[analyze-frame] error", error);
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Analysis failed.",
    };
  }
}