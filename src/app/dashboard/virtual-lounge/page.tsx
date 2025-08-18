import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Dot } from "lucide-react";
import { Badge } from '@/components/ui/badge';

const projects = [
  {
    title: 'Project Cybershield',
    author: '@neon_ninja',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'cyberpunk shield',
    description: 'A decentralized firewall solution for Web3 applications.',
  },
  {
    title: 'LuxeTrader AI',
    author: '@gold_finger',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'gold trading',
    description: 'An AI-powered bot for high-frequency crypto trading.',
  },
  {
    title: 'Synthwave Dreams',
    author: '@retro_coder',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'synthwave sunset',
    description: 'A collection of generative art inspired by 80s aesthetics.',
  },
   {
    title: 'Jungle Runner',
    author: '@dev_dani',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'jungle ruins',
    description: 'A gamified learning platform for mastering Python.',
  },
];

const chatMessages = [
  { user: 'Admin', message: 'Welcome to the Virtual Lounge. Be respectful and share your work!', time: '10:00 AM' },
  { user: '@neon_ninja', message: 'Just pushed an update for Project Cybershield. Check it out!', time: '10:02 AM' },
  { user: '@gold_finger', message: 'Nice! Is the source code available on GitHub?', time: '10:03 AM' },
];

const liveStreams = [
  { title: 'Live Coding: Building a Trading Bot', user: '@code_master', viewers: '1.2k' },
  { title: 'AMA: Monetizing your Creative Content', user: '@biz_wiz', viewers: '876' },
]

export default function VirtualLoungePage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <div className="lg:col-span-2 space-y-6">
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="font-headline">Project Showcase</CardTitle>
            <CardDescription>Discover what others are building in the jungle.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            {projects.map(p => (
              <Card key={p.title} className="overflow-hidden group">
                <Image src={p.image} data-ai-hint={p.aiHint} alt={p.title} width={600} height={400} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="p-4">
                  <h3 className="font-bold">{p.title}</h3>
                  <p className="text-sm text-muted-foreground">{p.author}</p>
                  <p className="text-sm mt-2">{p.description}</p>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>
        
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="font-headline">Live Streams</CardTitle>
            <CardDescription>Tune into live sessions from creators and experts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {liveStreams.map(stream => (
              <div key={stream.title} className="flex items-center justify-between p-3 rounded-md bg-background/50">
                <div>
                  <h3 className="font-semibold">{stream.title}</h3>
                  <p className="text-sm text-muted-foreground">{stream.user}</p>
                </div>
                <Badge variant="destructive" className="flex items-center">
                  <Dot className="text-white w-5 h-5 -ml-1 animate-pulse" />
                  {stream.viewers} Viewers
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="lg:col-span-1 flex flex-col h-full bg-card/50">
        <CardHeader>
          <CardTitle className="font-headline">Live Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between">
          <div className="space-y-4 flex-1 overflow-y-auto pr-2">
            {chatMessages.map((msg, i) => (
              <div key={i} className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-primary text-sm">{msg.user}</span>
                  <span className="text-xs text-muted-foreground">{msg.time}</span>
                </div>
                <p className="text-sm">{msg.message}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <Input placeholder="Type a message..." />
            <Button><Send className="w-4 h-4" /></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
