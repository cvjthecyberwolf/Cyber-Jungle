'use client';

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { db, storage } from '@/lib/firebase';
import { addDoc, collection, query, onSnapshot, orderBy, serverTimestamp } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { answerUserQuestions } from '@/ai/flows/answer-questions';
import { createImage } from '@/ai/flows/create-image';
import { generateAnimation } from '@/ai/flows/generate-animation';
import { Download, Loader2, Wand2, Film, Timer, MessageSquare, ImageIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const questionSchema = z.object({
  question: z.string().min(10, { message: 'Please enter a more detailed question.' }),
});
type QuestionFormValues = z.infer<typeof questionSchema>;

const imageSchema = z.object({
  prompt: z.string().min(10, { message: 'Please enter a more detailed description.' }),
});
type ImageFormValues = z.infer<typeof imageSchema>;

const animationSchema = z.object({
  prompt: z.string().min(10, { message: 'Please enter a more detailed animation description.' }),
});
type AnimationFormValues = z.infer<typeof animationSchema>;

interface Conversation {
    id: string;
    question: string;
    answer: string;
    timestamp: any;
}

interface GeneratedImage {
    id: string;
    prompt: string;
    imageUrl: string;
    timestamp: any;
}

export function AiCoreClient() {
  const { toast } = useToast();
  const [qnaIsLoading, setQnaIsLoading] = useState(false);
  const [qnaAnswer, setQnaAnswer] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  
  const [imageIsLoading, setImageIsLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  const [animationIsLoading, setAnimationIsLoading] = useState(false);
  const [animationUrl, setAnimationUrl] = useState<string | null>(null);
  
  const [animationCooldown, setAnimationCooldown] = useState(0);

  // Fetch chat history
  useEffect(() => {
    const q = query(collection(db, 'conversations'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const convos: Conversation[] = [];
      querySnapshot.forEach((doc) => {
        convos.push({ id: doc.id, ...doc.data() } as Conversation);
      });
      setConversations(convos);
    });
    return () => unsubscribe();
  }, []);

  // Fetch image history
  useEffect(() => {
    const q = query(collection(db, 'generatedImages'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const images: GeneratedImage[] = [];
      querySnapshot.forEach((doc) => {
        images.push({ id: doc.id, ...doc.data() } as GeneratedImage);
      });
      setGeneratedImages(images);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (animationCooldown > 0) {
      timer = setInterval(() => {
        setAnimationCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [animationCooldown]);

  const {
    register: registerQuestion,
    handleSubmit: handleQuestionSubmit,
    formState: { errors: questionErrors },
    reset: resetQuestion,
  } = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
  });

  const {
    register: registerImage,
    handleSubmit: handleImageSubmit,
    formState: { errors: imageErrors },
    reset: resetImage,
  } = useForm<ImageFormValues>({
    resolver: zodResolver(imageSchema),
  });
  
  const {
    register: registerAnimation,
    handleSubmit: handleAnimationSubmit,
    formState: { errors: animationErrors },
    reset: resetAnimation,
  } = useForm<AnimationFormValues>({
    resolver: zodResolver(animationSchema),
  });

  
  const onQuestionSubmit: SubmitHandler<QuestionFormValues> = async (data) => {
    setQnaIsLoading(true);
    setQnaAnswer('');
    try {
      const result = await answerUserQuestions({ question: data.question });
      setQnaAnswer(result.answer);
      
      // Save conversation to Firestore
      await addDoc(collection(db, 'conversations'), {
        question: data.question,
        answer: result.answer,
        timestamp: serverTimestamp(),
      });

      resetQuestion();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get an answer. Please try again.',
      });
    } finally {
      setQnaIsLoading(false);
    }
  };

  const onImageSubmit: SubmitHandler<ImageFormValues> = async (data) => {
    setImageIsLoading(true);
    setImageUrls([]);
    setSelectedImageUrl(null);
    setAnimationUrl(null);
    try {
      const result = await createImage({
        prompt: data.prompt,
      });
      setImageUrls(result.imageUrls);
      if (result.imageUrls.length > 0) {
        setSelectedImageUrl(result.imageUrls[0]);
      }
      
      // Upload images and save to Firestore
      for (const url of result.imageUrls) {
        const storageRef = ref(storage, `images/${Date.now()}-${Math.random()}.png`);
        const uploadResult = await uploadString(storageRef, url, 'data_url');
        const downloadUrl = await getDownloadURL(uploadResult.ref);

        await addDoc(collection(db, 'generatedImages'), {
          prompt: data.prompt,
          imageUrl: downloadUrl,
          timestamp: serverTimestamp(),
        });
      }

      resetImage();
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate and save image. Please try again.',
      });
    } finally {
      setImageIsLoading(false);
    }
  };
  
  const handleSelectImage = (url: string) => {
    setSelectedImageUrl(url);
    setAnimationUrl(null); // Reset animation when a new image is selected
  }

  const onAnimationSubmit: SubmitHandler<AnimationFormValues> = async (data) => {
    if (!selectedImageUrl) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select an image to animate.',
      });
      return;
    }
    setAnimationIsLoading(true);
    setAnimationUrl(null);
    try {
      const result = await generateAnimation({
        prompt: data.prompt,
        imageDataUri: selectedImageUrl,
      });
      setAnimationUrl(result.videoUrl ?? null);
      resetAnimation();
    } catch (error: any) {
       console.error(error);
       let description = 'The animation could not be created. This can happen with prompts that are blocked by safety filters. Please try a different animation prompt.';
       if (error.message && (error.message.includes('429') || error.message.includes('RESOURCE_EXHAUSTED'))) {
         description = 'Animation generation is rate limited. Please wait before trying again.';
         setAnimationCooldown(60);
       }
      toast({
        variant: 'destructive',
        title: 'Error Generating Animation',
        description,
      });
    } finally {
      setAnimationIsLoading(false);
    }
  };
  
  const handleDownload = () => {
    if (!selectedImageUrl) return;
    const link = document.createElement("a");
    link.href = selectedImageUrl;
    link.download = "generated-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleAnimationDownload = () => {
    if (!animationUrl) return;
    const link = document.createElement("a");
    link.href = animationUrl;
    link.download = "generated-animation.mp4";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <Tabs defaultValue="qna" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="qna">AI Q&A</TabsTrigger>
        <TabsTrigger value="image">Image Generation</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>
      <TabsContent value="qna">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Ask the AI</CardTitle>
            <CardDescription>Pose any question, and the AI will provide a detailed answer.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleQuestionSubmit(onQuestionSubmit)} className="space-y-4">
              <div className="grid w-full gap-2">
                <Label htmlFor="question">Your Question</Label>
                <Textarea
                  id="question"
                  placeholder="e.g., Explain the concept of quantum computing in simple terms."
                  {...registerQuestion('question')}
                  className="min-h-[120px]"
                />
                {questionErrors.question && (
                  <p className="text-sm text-destructive">{questionErrors.question.message}</p>
                )}
              </div>
              <Button type="submit" disabled={qnaIsLoading} className="font-bold">
                {qnaIsLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Get Answer
              </Button>
            </form>
            {(qnaIsLoading || qnaAnswer) && (
              <div className="mt-6">
                <h3 className="font-bold font-headline mb-2">AI Response:</h3>
                <Card className="bg-background/50">
                  <CardContent className="p-4">
                    {qnaIsLoading ? (
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{qnaAnswer}</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="image">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Generate & Animate</CardTitle>
            <CardDescription>Create stunning visuals with AI. Describe your vision, then bring it to life.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
                <form onSubmit={handleImageSubmit(onImageSubmit)} className="space-y-4">
                  <div className="grid w-full gap-2">
                    <Label htmlFor="prompt">1. Your Detailed Image Prompt</Label>
                    <Textarea
                      id="prompt"
                      placeholder="e.g., A photorealistic image of a majestic lion in the Serengeti, golden hour lighting"
                      {...registerImage('prompt')}
                      className="min-h-[120px]"
                    />
                    {imageErrors.prompt && (
                      <p className="text-sm text-destructive">{imageErrors.prompt.message}</p>
                    )}
                  </div>

                  <Button type="submit" disabled={imageIsLoading} className="font-bold">
                    {imageIsLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Image
                  </Button>
                </form>

              {imageIsLoading && (
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Array(4).fill(null).map((_, i) => (
                    <div key={i} className="w-full aspect-square rounded-lg border border-dashed border-gray-500 flex items-center justify-center bg-background/50">
                       <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ))}
                 </div>
              )}
              
              {!imageIsLoading && imageUrls.length > 0 && (
                <div className='space-y-4'>
                   <div className="relative w-full aspect-square rounded-lg border border-dashed flex items-center justify-center bg-background/50 overflow-hidden">
                      {selectedImageUrl ? (
                        <>
                          <Image src={selectedImageUrl} alt="Selected generated image" layout="fill" className="object-contain" />
                          <Button 
                            onClick={handleDownload}
                            variant="secondary" 
                            size="icon" 
                            className="absolute top-2 right-2 z-10"
                          >
                            <Download className='w-4 h-4' />
                            <span className="sr-only">Download Image</span>
                          </Button>
                        </>
                      ) : (
                         <div className="text-center text-muted-foreground">
                            <Wand2 className="mx-auto h-8 w-8 mb-2" />
                            <p>Select a generated image</p>
                        </div>
                      )}
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {imageUrls.map((url, index) => (
                        <button key={index} onClick={() => handleSelectImage(url)} className={`relative aspect-square rounded-md overflow-hidden border-2 ${selectedImageUrl === url ? 'border-primary' : 'border-transparent'} hover:border-primary transition-all`}>
                           <Image src={url} alt={`Generated image variant ${index + 1}`} layout="fill" className="object-cover" />
                        </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {selectedImageUrl && (
              <div className="mt-6 pt-6 border-t">
                 <Card className='bg-background/50'>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Film className="w-6 h-6 text-primary" />
                            <div>
                                <h3 className="font-headline text-lg">2. Animate Your Image</h3>
                                <CardDescription>Bring your selected image to life.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                       <form onSubmit={handleAnimationSubmit(onAnimationSubmit)} className="space-y-4">
                          <div className="grid w-full gap-2">
                            <Label htmlFor="animation-prompt">Animation Prompt</Label>
                            <Textarea
                              id="animation-prompt"
                              placeholder="e.g., Make the lion roar and shake its mane, cinematic 4k"
                              {...registerAnimation('prompt')}
                              className="min-h-[80px]"
                            />
                            {animationErrors.prompt && (
                              <p className="text-sm text-destructive">{animationErrors.prompt.message}</p>
                            )}
                          </div>
                          <Button type="submit" disabled={animationIsLoading || animationCooldown > 0} className="font-bold">
                            {animationIsLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : animationCooldown > 0 ? (
                                <Timer className="mr-2 h-4 w-4" />
                            ) : (
                                <Film className="mr-2 h-4 w-4" />
                            )}
                             
                            {animationIsLoading ? "Generating..." : animationCooldown > 0 ? `Try again in ${animationCooldown}s` : "Generate Animation"}
                          </Button>
                        </form>
                        
                        {(animationIsLoading || animationUrl) && (
                          <div className="mt-4 space-y-4">
                            <div className="relative w-full aspect-video rounded-lg border flex items-center justify-center bg-background/50 overflow-hidden">
                                {animationIsLoading && !animationUrl && (
                                     <div className="text-center text-muted-foreground">
                                        <Loader2 className="h-8 w-8 animate-spin" />
                                        <p className="mt-2 text-sm">Generating animation... This may take up to a minute.</p>
                                    </div>
                                )}
                                {animationUrl && (
                                  <>
                                    <video controls src={animationUrl} className="w-full h-full object-contain">
                                        Your browser does not support the video element.
                                    </video>
                                    <Button 
                                      onClick={handleAnimationDownload}
                                      variant="secondary" 
                                      size="icon" 
                                      className="absolute top-2 right-2 z-10"
                                    >
                                      <Download className='w-4 h-4' />
                                      <span className="sr-only">Download Animation</span>
                                    </Button>
                                  </>
                                )}
                            </div>
                          </div>
                      )}
                    </CardContent>
                 </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="history">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Your History</CardTitle>
                <CardDescription>Review your past conversations and generated images.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="conversations" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="conversations"><MessageSquare className="mr-2 h-4 w-4" />Conversations</TabsTrigger>
                        <TabsTrigger value="images"><ImageIcon className="mr-2 h-4 w-4" />Image Gallery</TabsTrigger>
                    </TabsList>
                    <TabsContent value="conversations" className="mt-4">
                      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4">
                        {conversations.length > 0 ? conversations.map(convo => (
                            <Card key={convo.id} className="bg-background/50">
                                <CardContent className="p-4">
                                    <p className="font-semibold text-primary">You:</p>
                                    <p className="mb-3 text-sm">{convo.question}</p>
                                    <p className="font-semibold text-accent">AI:</p>
                                    <p className="text-sm whitespace-pre-wrap">{convo.answer}</p>
                                </CardContent>
                            </Card>
                        )) : (
                           <p className="text-muted-foreground text-center">No conversation history yet.</p>
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="images" className="mt-4">
                       <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-4">
                         {generatedImages.length > 0 ? generatedImages.map(image => (
                            <Card key={image.id} className="overflow-hidden group">
                                <div className="relative aspect-square">
                                    <Image src={image.imageUrl} alt={image.prompt} layout="fill" className="object-cover transition-transform group-hover:scale-105" />
                                     <a href={image.imageUrl} target="_blank" rel="noopener noreferrer" download>
                                        <Button variant="secondary" size="icon" className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Download className="w-4 h-4"/>
                                        </Button>
                                    </a>
                                </div>
                                <div className="p-3">
                                    <p className="text-xs text-muted-foreground truncate">{image.prompt}</p>
                                </div>
                            </Card>
                         )) : (
                            <p className="text-muted-foreground text-center col-span-full">No generated images yet.</p>
                         )}
                       </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
