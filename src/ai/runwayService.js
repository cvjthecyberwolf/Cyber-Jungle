import RunwayML from "runwayml";

const runway = new RunwayML({
  apiKey: process.env.RUNWAY_API_KEY,
});

/**
 * Generate video with RunwayML
 * @param {string} prompt - The text-to-video prompt
 * @param {string} model - "gen2" or "gen3-alpha"
 */
export async function generateRunwayVideo(prompt, model = "gen2") {
  try {
    const result = await runway.video.generate({
      prompt,
      model,  // choose "gen2" or "gen3-alpha"
    });

    return result?.output_url;
  } catch (err) {
    console.error("Runway error:", err);
    throw new Error("Failed to generate video with Runway");
  }
}

