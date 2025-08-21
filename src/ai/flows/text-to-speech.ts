'use server';
/**
 * @fileOverview A text-to-speech AI agent.
 *
 * - textToSpeech - A function that handles the text to speech conversion.
 * - TextToSpeechInput - The input type for the textToSpeech function.
 * - TextToSpeechOutput - The return type for the textToSpeech function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
// 'wav' has no types; import as any
// eslint-disable-next-line @typescript-eslint/no-var-requires
const wav: any = require('wav');
import type {ModelArgument} from 'genkit/model';

const TextToSpeechInputSchema = z.object({
  text: z.string().describe('The text to be converted to speech.'),
  voice: z.string().optional().describe('The selected voice for the speech.'),
});
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

const TextToSpeechOutputSchema = z.object({
  audioUrl: z.string().describe("The generated audio's data URI."),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;

export async function textToSpeech(input: TextToSpeechInput): Promise<TextToSpeechOutput> {
  return textToSpeechFlow(input);
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', function (d: Buffer) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: TextToSpeechInputSchema,
    outputSchema: TextToSpeechOutputSchema,
  },
  async input => {
    const isMultiSpeaker = /Speaker\s*[12]:/.test(input.text);

    // Using a loose type here to avoid dependency on internal generic constraints
    let speechConfig: any;

    if (isMultiSpeaker) {
      speechConfig = {
        multiSpeakerVoiceConfig: {
          speakerVoiceConfigs: [
            {speaker: 'Speaker1', voiceConfig: {prebuiltVoiceConfig: {voiceName: 'Algenib'}}}, // Male
            {speaker: 'Speaker2', voiceConfig: {prebuiltVoiceConfig: {voiceName: 'Auriga'}}}, // Female
          ],
        },
      };
    } else {
      speechConfig = {
        voiceConfig: {
          prebuiltVoiceConfig: {voiceName: input.voice || 'Algenib'},
        },
      };
    }

    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: speechConfig,
      },
      prompt: input.text,
    });

    if (!media || !media.url) {
      throw new Error('Failed to generate audio.');
    }

    const audioBuffer = Buffer.from(media.url.substring(media.url.indexOf(',') + 1), 'base64');

    const wavBase64 = await toWav(audioBuffer);

    return {audioUrl: `data:audio/wav;base64,${wavBase64}`};
  }
);
