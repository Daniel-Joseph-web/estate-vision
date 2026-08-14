import { ApiError, GoogleGenAI } from "@google/genai";

/**
 * Wraps every Gemini call the app makes. Reads 2+ API keys (ideally from
 * separate Google accounts, each with its own free-tier quota) and, when one
 * key is rate-limited or invalid, retries the *entire* operation on the next
 * key rather than trying to patch a new key into a half-finished sequence.
 *
 * This matters specifically because a Gemini File API upload is scoped to
 * the key that created it — key 2 can't resume a poll loop or generateContent
 * call against a file key 1 uploaded. So `withGeminiFailover` re-runs the
 * whole callback (upload → poll → generate) from scratch on the next key.
 */

/** Reads configured keys in priority order, de-duplicated, empty ones dropped. */
export function readGeminiApiKeys(): string[] {
  const candidates = [
    process.env.GEMINI_API_KEY_1,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY, // back-compat with a single-key setup
  ];

  return [...new Set(candidates.filter((key): key is string => Boolean(key?.trim())))];
}

/**
 * True for errors specific to *this* key — rate limits, quota exhaustion, or
 * the key itself being invalid/revoked — where a different key is likely to
 * succeed. False for everything else (a malformed request, a Google-side
 * outage), where switching keys wouldn't help and the error should surface
 * immediately instead of being masked by a pointless retry.
 */
function isKeyLevelError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.status === 429 || error.status === 401 || error.status === 403;
  }

  // Fallback for errors that don't arrive as a structured ApiError.
  const message = error instanceof Error ? error.message : String(error);
  return /RESOURCE_EXHAUSTED|rate limit|quota|API key not valid|PERMISSION_DENIED/i.test(
    message
  );
}

export async function withGeminiFailover<T>(
  operation: (ai: GoogleGenAI) => Promise<T>
): Promise<T> {
  const keys = readGeminiApiKeys();

  if (keys.length === 0) {
    throw new Error(
      "No Gemini API key configured. Set GEMINI_API_KEY_1 (and ideally GEMINI_API_KEY_2) in .env.local."
    );
  }

  for (let i = 0; i < keys.length; i++) {
    const ai = new GoogleGenAI({ apiKey: keys[i] });
    try {
      return await operation(ai);
    } catch (error) {
      const isLastKey = i === keys.length - 1;
      if (isLastKey || !isKeyLevelError(error)) {
        throw error;
      }

      console.warn(
        `[gemini] Key ${i + 1}/${keys.length} failed (${
          error instanceof Error ? error.message : String(error)
        }). Retrying with the next key.`
      );
    }
  }

  // Unreachable given keys.length >= 1 checked above — keeps TS satisfied
  // about the return type without an unsafe assertion.
  throw new Error("No Gemini API keys were attempted.");
}