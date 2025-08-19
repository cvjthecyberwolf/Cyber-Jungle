import axios from "axios";

const runwayKey = process.env.RUNWAY_API_KEY;

export async function generateVideo(prompt: string) {
  const response = await axios.post(
    "https://api.runwayml.com/v1/video/generate",
    { prompt },
    {
      headers: {
        Authorization: `Bearer ${runwayKey}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}
