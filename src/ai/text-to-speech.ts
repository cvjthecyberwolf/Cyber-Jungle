import axios from "axios";

const elevenLabsKey = process.env.ELEVENLABS_API_KEY;

export async function textToSpeech(text: string) {
  const response = await axios.post(
    "https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL",
    {
      text,
      voice_settings: { stability: 0.5, similarity_boost: 0.5 }
    },
    {
      headers: {
        "xi-api-key": elevenLabsKey,
        "Content-Type": "application/json"
      },
      responseType: "arraybuffer"
    }
  );

  return response.data; // This is the audio buffer
}
