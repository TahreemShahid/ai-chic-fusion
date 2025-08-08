import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Bot, User, FileText, Settings, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useToast } from '@/hooks/use-toast';
import { KeyManager } from '@/utils/keyManager';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isTyping?: boolean;
  sources?: string[];
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI Assistant. I can help you with questions, analyze documents, and provide intelligent responses with source citations. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [keysLoaded, setKeysLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load keys on component mount
    KeyManager.loadKeys()
      .then(() => {
        setKeysLoaded(true);
        console.log('Keys loaded successfully');
      })
      .catch((error) => {
        console.error('Failed to load keys:', error);
        toast({
          title: "Configuration Error",
          description: "Could not load keys.txt file. Please check if it exists and has valid API keys.",
          variant: "destructive"
        });
      });
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const callAIAPI = async (message: string): Promise<string> => {
    // Get API key from keys.txt file
    const openaiKey = await KeyManager.getOpenAIKey();
    
    if (!openaiKey) {
      throw new Error('No OpenAI API key found in keys.txt. Please add OPENAI_API_KEY to your keys.txt file.');
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful AI assistant. Provide clear, accurate, and helpful responses.'
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'API request failed');
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      const aiResponse = await callAIAPI(currentInput);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        sources: ['OpenAI GPT-3.5'],
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Error: ${error instanceof Error ? error.message : 'Failed to get AI response. Please check your API key in settings.'}`,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "API Error",
        description: error instanceof Error ? error.message : 'Failed to get AI response',
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileMessage: Message = {
        id: Date.now().toString(),
        text: `📄 Uploaded: ${file.name}`,
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, fileMessage]);
      
      toast({
        title: "File Uploaded",
        description: `${file.name} has been uploaded successfully`,
      });
    }
  };

  const KeysStatusCard = () => {
    const [loadedKeys, setLoadedKeys] = useState<Record<string, string>>({});

    useEffect(() => {
      if (keysLoaded) {
        setLoadedKeys(KeyManager.getAllLoadedKeys());
      }
    }, [keysLoaded]);

    return (
      <Card className="chat-container p-4 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <Key className="w-5 h-5 text-ai-primary" />
          <h3 className="font-semibold">API Keys Status</h3>
        </div>
        <div className="space-y-2 text-sm">
          {Object.keys(loadedKeys).length > 0 ? (
            Object.keys(loadedKeys).map(key => (
              <div key={key} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>{key}: ••••••••</span>
              </div>
            ))
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span>No API keys loaded from keys.txt</span>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Keys are loaded from <code>public/keys.txt</code> file
        </p>
      </Card>
    );
  };

  if (showSettings) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="outline" 
              onClick={() => setShowSettings(false)}
              className="glow-effect"
            >
              ← Back to Chat
            </Button>
            <ThemeToggle />
          </div>
          <KeysStatusCard />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto">
      {/* Header */}
      <Card className="chat-container rounded-b-none border-b-0 p-4 mb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full hero-gradient flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">AI Assistant</h1>
              <p className="text-sm text-muted-foreground">Intelligent Chat with Document Analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowSettings(true)}
              className="glow-effect"
            >
              <Settings className="w-4 h-4" />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </Card>

      {/* Messages */}
      <Card className="chat-container flex-1 rounded-t-none rounded-b-none border-t-0 border-b-0">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
              >
                <div
                  className={`flex gap-3 max-w-[80%] ${
                    message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'user'
                        ? 'hero-gradient'
                        : 'bg-muted'
                    }`}
                  >
                    {message.sender === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.sender === 'user'
                        ? 'chat-bubble-user'
                        : 'chat-bubble-ai'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>

                    {/* Sources */}
                    {message.sources && (
                      <div className="mt-2 pt-2 border-t border-chat-border">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <FileText className="w-3 h-3" />
                          <span>Sources: {message.sources.join(', ')}</span>
                        </div>
                      </div>
                    )}

                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-fade-in-up">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Bot className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="chat-bubble-ai rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-typing"></div>
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-typing" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-typing" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>
      </Card>

      {/* Input Area */}
      <Card className="chat-container rounded-t-none p-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleFileUpload}
            className="shrink-0 glow-effect"
          >
            <Paperclip className="w-4 h-4" />
          </Button>

          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything or upload a document..."
              className="pr-12 bg-chat-input border-chat-border focus:border-ai-primary focus:ring-ai-primary/20"
            />
            <Button
              onClick={handleSendMessage}
              size="icon"
              className="absolute right-1 top-1 h-8 w-8 hero-gradient text-white hover:animate-pulse-glow"
              disabled={!inputValue.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileChange}
          className="hidden"
        />

        <p className="text-xs text-muted-foreground mt-2 text-center">
          AI Assistant can make mistakes. Consider checking important information.
        </p>
      </Card>
    </div>
  );
}