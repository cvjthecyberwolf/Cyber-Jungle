'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { generateContent } from '@/ai/flows/generate-content';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { generateVideo } from '@/ai/flows/generate-video';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Mic, Video, Upload, Download } from 'lucide-react';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const contentSchema = z.object({
  prompt: z.string().min(10, { message: 'Please provide a more detailed prompt.' }),
});
type ContentFormValues = z.infer<typeof contentSchema>;

const videoSchema = z.object({
  prompt: z.string().min(10, { message: 'Please provide a more detailed prompt.' }),
  image: z.any().optional(),
});
type VideoFormValues = z.infer<typeof videoSchema>;

const voices = [
    { value: 'Algenib', label: 'Male 1' },
    { value: 'Auriga', label: 'Female 1' },
    { value: 'Sirius', label: 'Male 2' },
    { value: 'Vega', label: 'Female 2' },
    { value: 'Canopus', label: 'Male 3' },
    { value: 'Rigel', label: 'Female 3' },
]

export function ContentGeneratorClient() {
  const { toast } = useToast();
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [articleTitle, setArticleTitle] = useState('Untitled Article');
  const [audioUrl, setAudioUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState('Algenib');

  const {
    register: registerContent,
    handleSubmit: handleContentSubmit,
    formState: { errors: contentErrors },
  } = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema),
  });
  
  const {
    register: registerVideo,
    handleSubmit: handleVideoSubmit,
    formState: { errors: videoErrors },
    setValue: setVideoValue,
    reset: resetVideo,
  } = useForm<VideoFormValues>({
    resolver: zodResolver(videoSchema),
  });

  const onContentSubmit: SubmitHandler<ContentFormValues> = async (data) => {
    setIsContentLoading(true);
    setAudioUrl('');
    try {
      const result = await generateContent({ prompt: data.prompt });
      setGeneratedContent(result.content);
      // Simple logic to extract a title
      setArticleTitle(data.prompt.length > 50 ? data.prompt.substring(0, 50) + '...' : data.prompt);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate content. Please try again.',
      });
    } finally {
      setIsContentLoading(false);
    }
  };
  
  const onTextToSpeechSubmit = async () => {
    if (!generatedContent) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please generate or enter some content before converting to speech.',
      });
      return;
    }
    setIsAudioLoading(true);
    setAudioUrl('');
    try {
      const result = await textToSpeech({ text: generatedContent, voice: selectedVoice });
      setAudioUrl(result.audioUrl);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate audio. Please try again.',
      });
    } finally {
      setIsAudioLoading(false);
    }
  };
  
  const handleVideoImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setVideoPreview(null);
    }
  };
  
  const onVideoSubmit: SubmitHandler<VideoFormValues> = async (data) => {
    setIsVideoLoading(true);
    setVideoUrl(null);
    try {
      let imageDataUri: string | undefined = undefined;
      if (data.image && data.image[0]) {
        imageDataUri = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = (e) => reject(e);
          reader.readAsDataURL(data.image[0]);
        });
      }
      
      const result = await generateVideo({ prompt: data.prompt, imageDataUri });
      setVideoUrl(result.videoUrl);
      resetVideo();
      setVideoPreview(null);
    } catch (error: any) {
      console.error(error);
      let description = 'Failed to generate video. Please try again.';
      if (error.message && (error.message.includes('429') || error.message.includes('RESOURCE_EXHAUSTED'))) {
        description = 'Video generation is rate limited. Please wait a minute before trying again.';
      }
      toast({
        variant: 'destructive',
        title: 'Error',
        description,
      });
    } finally {
      setIsVideoLoading(false);
    }
  };
  
  const handleVideoDownload = () => {
    if (!videoUrl) return;
    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = "generated-video.mp4";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="font-headline">AI Content Studio</CardTitle>
            <CardDescription>Generate articles, scripts, or any text-based content with a simple prompt.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleContentSubmit(onContentSubmit)} className="space-y-4">
              <div className="grid w-full gap-2">
                <Label htmlFor="content-prompt">Your Prompt</Label>
                <Input
                  id="content-prompt"
                  placeholder="e.g., A blog post about the future of AI in creative industries"
                  {...registerContent('prompt')}
                />
                {contentErrors.prompt && (
                  <p className="text-sm text-destructive">{contentErrors.prompt.message}</p>
                )}
              </div>
              <Button type="submit" disabled={isContentLoading} className="font-bold">
                {isContentLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Content
              </Button>
            </form>

            <div className="mt-6 border-t pt-6">
              <Input 
                value={articleTitle} 
                onChange={(e) => setArticleTitle(e.target.value)}
                className="text-2xl font-bold font-headline border-0 shadow-none focus-visible:ring-0 px-0 h-auto mb-4 bg-transparent"
              />
              <Textarea
                placeholder="Your generated content will appear here... For multi-speaker audio, use the format 'Speaker1: ...' and 'Speaker2: ...' on new lines."
                value={generatedContent}
                onChange={(e) => setGeneratedContent(e.target.value)}
                className="min-h-[400px] text-base border-dashed bg-transparent"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="font-headline">Media Tools</CardTitle>
            <CardDescription>Bring your content to life.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex flex-col items-start gap-4 p-4 rounded-lg bg-background/50">
                <div className='flex items-center gap-4'>
                    <Mic className="w-6 h-6 text-primary" />
                    <div>
                        <h3 className="font-semibold">Text-to-Speech</h3>
                        <p className="text-sm text-muted-foreground">Convert your text into realistic audio.</p>
                    </div>
                </div>
                 <div className="w-full space-y-2">
                     <Label>Voice Selection</Label>
                    <Select onValueChange={setSelectedVoice} defaultValue={selectedVoice}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a voice" />
                        </SelectTrigger>
                        <SelectContent>
                            {voices.map(voice => (
                                <SelectItem key={voice.value} value={voice.value}>
                                    {voice.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                 </div>
                 <Button onClick={onTextToSpeechSubmit} disabled={isAudioLoading || !generatedContent} className="font-bold mt-2 w-full">
                    {isAudioLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Generate Audio
                </Button>
                {isAudioLoading && (
                    <div className="w-full flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <p>Generating... this may take a moment.</p>
                    </div>
                )}
                {audioUrl && (
                    <audio controls src={audioUrl} className="w-full mt-2">
                        Your browser does not support the audio element.
                    </audio>
                )}
            </div>
            
            <div className="flex flex-col items-start gap-4 p-4 rounded-lg bg-background/50">
              <div className='flex items-center gap-4'>
                  <Video className="w-6 h-6 text-primary" />
                  <div>
                      <h3 className="font-semibold">Text-to-Video</h3>
                      <p className="text-sm text-muted-foreground">Create a video from a text prompt and an optional image.</p>
                  </div>
              </div>
              <form onSubmit={handleVideoSubmit(onVideoSubmit)} className="space-y-4 w-full">
                <div className="grid w-full gap-2">
                  <Label htmlFor="video-prompt">Prompt</Label>
                  <Textarea
                    id="video-prompt"
                    placeholder="e.g., A majestic dragon soaring over a mystical forest"
                    {...registerVideo('prompt')}
                    className="min-h-[80px]"
                  />
                  {videoErrors.prompt && (
                    <p className="text-sm text-destructive">{videoErrors.prompt.message}</p>
                  )}
                </div>
                <div className="grid w-full gap-2">
                  <Label htmlFor="image">Reference Image (Optional)</Label>
                  <Input id="image" type="file" accept="image/*" {...registerVideo('image')} onChange={handleVideoImageChange} />
                </div>
                {videoPreview && (
                  <div className="w-full aspect-video rounded-lg border border-dashed flex items-center justify-center bg-background/50 overflow-hidden">
                     <Image src={videoPreview} alt="Image preview" width={200} height={112} className="object-contain" />
                  </div>
                )}

                <Button type="submit" disabled={isVideoLoading} className="font-bold w-full">
                  {isVideoLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Video
                </Button>
              </form>
               {(isVideoLoading || videoUrl) && (
                  <div className="mt-4 space-y-4">
                    <div className="relative w-full aspect-video rounded-lg border flex items-center justify-center bg-background/50 overflow-hidden">
                        {isVideoLoading && !videoUrl && (
                             <div className="text-center text-muted-foreground">
                                <Loader2 className="h-8 w-8 animate-spin" />
                                <p className="mt-2 text-sm">Generating video...</p>
                            </div>
                        )}
                        {videoUrl && (
                          <>
                            <video controls src={videoUrl} className="w-full h-full object-contain">
                                Your browser does not support the video element.
                            </video>
                            <Button 
                              onClick={handleVideoDownload}
                              variant="secondary" 
                              size="icon" 
                              className="absolute top-2 right-2 z-10"
                            >
                              <Download className='w-4 h-4' />
                              <span className="sr-only">Download Video</span>
                            </Button>
                          </>
                        )}
                    </div>
                  </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
