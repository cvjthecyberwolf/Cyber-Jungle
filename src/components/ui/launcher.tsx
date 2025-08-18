"use client";

import { useState, useEffect, useRef } from 'react';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

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

export function Launcher() {
  const [isVisible, setIsVisible] = useState(true);
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const visibilityTimer = setTimeout(() => {
      setIsVisible(false);
    }, 6000); 

    const taglineTimer = setInterval(() => {
      setCurrentTaglineIndex(prevIndex => (prevIndex + 1) % taglines.length);
    }, 3000); 

    return () => {
        clearTimeout(visibilityTimer);
        clearInterval(taglineTimer);
    };
  }, []);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const alphabet = katakana + latin + nums;

    const fontSize = 16;
    const columns = canvas.width / fontSize;

    const rainDrops: number[] = [];
    for (let x = 0; x < columns; x++) {
      rainDrops[x] = 1;
    }

    let animationFrameId: number;

    const draw = () => {
      ctx.fillStyle = 'rgba(18, 18, 18, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'hsl(var(--primary))';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
      animationFrameId = window.requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-background transition-opacity duration-1000 ease-in-out',
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
    >
      <canvas ref={canvasRef} className="absolute inset-0 -z-10 h-full w-full"></canvas>
      
      <div className="absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 h-[310px] w-[310px] rounded-full bg-primary opacity-20 blur-[100px]"></div>

      <div className="relative z-10 flex flex-col items-center text-center animate-fade-in">
        <Zap className="h-20 w-20 text-primary animate-icon-glow" />
        <h1 className="mt-6 text-2xl font-bold font-headline tracking-widest uppercase animate-text-glow">
          Cyber Jungle
        </h1>
      </div>
      
       <div className="absolute bottom-10 w-full flex justify-center items-center z-10">
         <div className="relative flex items-center justify-center h-48 w-48">
            <div className="rotating-border absolute inset-0 rounded-full"></div>
            {taglines.map((tagline, index) => (
              <div
                key={index}
                className={cn(
                  "absolute transition-opacity duration-1000 ease-in-out text-center w-3/4",
                  currentTaglineIndex === index ? 'opacity-100' : 'opacity-0'
                )}
              >
                <p className={cn("text-sm font-code", tagline.className)}>{tagline.text}</p>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
