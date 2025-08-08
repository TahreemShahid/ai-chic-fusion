import React, { useState } from 'react';
import { ChatInterface } from '@/components/ChatInterface';
import { FeatureCards } from '@/components/FeatureCards';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Bot, Sparkles, ArrowRight } from 'lucide-react';

const Index = () => {
  const [showChat, setShowChat] = useState(false);

  if (showChat) {
    return (
      <div className="min-h-screen p-4 bg-chat-background">
        <ChatInterface />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-chat-background">
      <div className="max-w-6xl mx-auto">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-6">
          <ThemeToggle />
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl hero-gradient flex items-center justify-center animate-pulse-glow">
              <Bot className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-ai-primary to-ai-accent bg-clip-text text-transparent">
            AI Assistant
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Intelligent Chatbot with Document Analysis, Contextual Memory, and Real-time Streaming Responses
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => setShowChat(true)}
              size="lg"
              className="hero-gradient text-white px-8 py-6 text-lg font-semibold group hover:animate-pulse-glow transition-all duration-300"
            >
              <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              Start Chatting
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>AI Assistant is online and ready</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <FeatureCards />

        {/* Additional Info */}
        <div className="text-center">
          <div className="chat-container rounded-2xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Experience the Future of AI</h2>
            <p className="text-muted-foreground mb-6">
              Our AI Assistant combines cutting-edge language models with advanced document processing capabilities.
              Upload documents, engage in meaningful conversations, and get intelligent responses backed by source citations.
            </p>
            <Button
              onClick={() => setShowChat(true)}
              variant="outline"
              className="border-ai-primary text-ai-primary hover:bg-ai-primary hover:text-white transition-all duration-300 glow-effect"
            >
              Try It Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;