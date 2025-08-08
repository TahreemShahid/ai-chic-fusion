import React from 'react';
import { Brain, FileText, Zap, Shield, MessageSquare, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Brain,
    title: 'Intelligent AI Chat',
    description: 'Engage in natural conversations with contextual memory and agentic reasoning',
    gradient: 'from-ai-primary to-ai-accent',
  },
  {
    icon: FileText,
    title: 'Document Analysis',
    description: 'Upload PDFs and ask intelligent questions with source citations',
    gradient: 'from-ai-accent to-purple-500',
  },
  {
    icon: MessageSquare,
    title: 'Contextual Memory',
    description: 'AI remembers conversation history and maintains context across interactions',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Zap,
    title: 'Real-time Streaming',
    description: 'Get instant, streaming responses for a dynamic chat experience',
    gradient: 'from-pink-500 to-red-500',
  },
  {
    icon: Search,
    title: 'Source Citations',
    description: 'Get supporting excerpts and evidence with every response',
    gradient: 'from-red-500 to-orange-500',
  },
  {
    icon: Shield,
    title: 'Agentic Capabilities',
    description: 'AI that can reason, plan, and take actions autonomously',
    gradient: 'from-orange-500 to-ai-primary',
  },
];

export function FeatureCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {features.map((feature, index) => (
        <Card
          key={index}
          className="chat-container hover:scale-105 transition-all duration-300 glow-effect group"
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center animate-pulse-glow`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg">{feature.title}</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {feature.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}