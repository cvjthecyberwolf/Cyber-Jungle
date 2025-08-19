import { generateVideo } from "../generate-video";
import { textToSpeech } from "../text-to-speech";

/**
 * Full media generation flow:
 * 1. Generate narration from text (TTS).
 * 2. Generate video visuals from the same prompt (Runway).
 * 3. Return both assets (audio + video).
 */
export async function mediaFlow(prompt: string) {
  try {
    console.log("🎙️ Generating narration...");
    const audioUrl = await textToSpeech(prompt);

    console.log("🎬 Generating video...");
    const videoUrl = await generateVideo(prompt, "gen2"); // or "gen3-alpha"

    return {
      prompt,
      audioUrl,
      videoUrl,
    };
  } catch (err) {
    console.error("❌ Media flow failed:", err);
    throw err;
  }
}
