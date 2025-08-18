'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle } from 'lucide-react';

const courses = [
  {
    title: 'AI & Machine Learning Fundamentals',
    category: 'Technology',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'ai brain',
    description: 'An introduction to the core concepts of artificial intelligence and machine learning.',
    duration: '8 Weeks',
  },
  {
    title: 'Advanced Cybersecurity Defense',
    category: 'Security',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'cyber security',
    description: 'Learn to protect networks and data from advanced cyber threats with hands-on labs.',
    duration: '12 Weeks',
  },
  {
    title: 'Forex Trading: From Beginner to Pro',
    category: 'Finance',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'forex chart',
    description: 'Master the art of forex trading, from technical analysis to risk management.',
    duration: '10 Weeks',
  },
  {
    title: 'Video Podcasting Masterclass',
    category: 'Creative',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'podcast microphone',
    description: 'Learn how to produce, record, and market a professional-quality video podcast.',
    duration: '6 Weeks',
  },
    {
    title: 'Blockchain & Decentralized Apps',
    category: 'Technology',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'blockchain network',
    description: 'Dive deep into blockchain technology and learn to build your own DApps.',
    duration: '16 Weeks',
  },
  {
    title: 'Generative Art & Creative Coding',
    category: 'Creative',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'generative art',
    description: 'Explore the intersection of art and code to create stunning visual experiences.',
    duration: '8 Weeks',
  },
];

export function CoursesClient() {
  const { toast } = useToast();
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);

  const handleEnroll = (courseTitle: string) => {
    setEnrolledCourses([...enrolledCourses, courseTitle]);
    toast({
      title: 'Successfully Enrolled!',
      description: `You have been enrolled in "${courseTitle}".`,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Course Catalog</h1>
        <p className="text-muted-foreground">Expand your skills. Join a course and master new technologies.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => {
          const isEnrolled = enrolledCourses.includes(course.title);
          return (
            <Card key={course.title} className="flex flex-col bg-card/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
              <CardHeader className="p-0">
                <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                  <Image src={course.image} data-ai-hint={course.aiHint} alt={course.title} layout="fill" className="object-cover" />
                </div>
                <div className="p-6">
                    <Badge variant="secondary" className="mb-2">{course.category}</Badge>
                    <CardTitle className="font-headline text-xl">{course.title}</CardTitle>
                    <CardDescription className="pt-2">{course.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                 <p className="text-sm text-muted-foreground">{course.duration}</p>
              </CardContent>
              <CardFooter>
                 <Button 
                    className="w-full font-semibold"
                    onClick={() => handleEnroll(course.title)}
                    disabled={isEnrolled}
                 >
                    {isEnrolled ? (
                        <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Enrolled
                        </>
                    ) : (
                        'Enroll Now'
                    )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
