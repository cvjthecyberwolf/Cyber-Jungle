"use client"
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap } from 'lucide-react';
import { DigitalRain } from '@/components/ui/digital-rain';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

const taglines = [
  {
    text: "Powered By CVJ Alpha Technologies",
    className: "text-yellow-400",
  },
  {
    text: "Proudly Developed By CVJ The Cyber Wolf",
    className: "text-green-400",
  },
];


export default function HomePage() {
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);

  useEffect(() => {
    const taglineTimer = setInterval(() => {
      setCurrentTaglineIndex(prevIndex => (prevIndex + 1) % taglines.length);
    }, 3000); 

    return () => {
        clearInterval(taglineTimer);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
       <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-lg">Cyber Jungle</span>
          </Link>
          <nav className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/login" passHref>
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup" passHref>
              <Button>Sign Up <ArrowRight className="ml-2 h-4 w-4 hidden sm:inline-flex" /></Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center relative overflow-hidden">
        <DigitalRain />
         <div className="absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[450px] rounded-full bg-primary opacity-20 blur-[150px]"></div>
         <div className="relative z-10 flex flex-col items-center text-center">
            <Zap className="h-20 w-20 text-primary animate-icon-glow" />
            <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-bold font-headline tracking-widest uppercase animate-text-glow">
              Cyber Jungle
            </h1>
             <div className="relative flex items-center justify-center h-48 w-48 sm:h-56 sm:w-56 mt-4">
                <div className="rotating-border absolute inset-0 rounded-full"></div>
                {taglines.map((tagline, index) => (
                  <div
                    key={index}
                    className={cn(
                      "absolute transition-opacity duration-1000 ease-in-out text-center w-3/4",
                      currentTaglineIndex === index ? 'opacity-100' : 'opacity-0'
                    )}
                  >
                    <p className={cn("text-sm sm:text-base font-code", tagline.className)}>{tagline.text}</p>
                  </div>
                ))}
             </div>
             <div className="mt-8 flex justify-center gap-4">
              <Link href="/dashboard" passHref>
                <Button size="lg" className="font-bold">Enter the Jungle</Button>
              </Link>
            </div>
          </div>
      </main>
    </div>
  );
}
