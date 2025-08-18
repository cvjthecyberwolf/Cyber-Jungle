import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BrainCircuit, Clapperboard, AreaChart, Users } from 'lucide-react';

export default function DashboardPage() {
  const features = [
    {
      title: "AI Core",
      description: "Engage with our multi-modal AI. Ask questions, generate content, and create stunning visuals.",
      href: "/dashboard/ai-core",
      icon: <BrainCircuit className="w-8 h-8 text-primary" />,
      cta: "Access AI Core"
    },
    {
      title: "Content Suite",
      description: "Produce professional-level videos, podcasts, and articles with a full suite of AI-powered tools.",
      href: "/dashboard/content-suite",
      icon: <Clapperboard className="w-8 h-8 text-primary" />,
      cta: "Open Suite"
    },
    {
      title: "Trading Hub",
      description: "Analyze market data with high-accuracy signals and advanced chart analysis.",
      href: "/dashboard/trading-hub",
      icon: <AreaChart className="w-8 h-8 text-primary" />,
      cta: "View Hub"
    },
    {
      title: "Virtual Lounge",
      description: "Connect with fellow creators, share projects, and join immersive learning experiences.",
      href: "/dashboard/virtual-lounge",
      icon: <Users className="w-8 h-8 text-primary" />,
      cta: "Enter Lounge"
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Command Center</h1>
        <p className="text-muted-foreground">Welcome back, operative. Your cyber ecosystem is online and ready.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <Card key={feature.title} className="flex flex-col justify-between bg-card/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  {feature.icon}
                </div>
                <CardTitle className="font-headline">{feature.title}</CardTitle>
              </div>
              <CardDescription className="pt-2">{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={feature.href}>
                <Button className="w-full font-semibold">
                  {feature.cta} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="font-headline">System Status</CardTitle>
          <CardDescription>Real-time status of all system modules.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm">
            <div className="flex justify-between items-center">
                <span>AI Intelligence Core</span>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-green-400">Online</span>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <span>Content Generation APIs</span>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-green-400">Operational</span>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <span>Trading Data Feed</span>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-green-400">Stable</span>
                </div>
            </div>
             <div className="flex justify-between items-center">
                <span>Network Security</span>
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-green-400">Encrypted</span>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
