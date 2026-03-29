"use client"

import { useState, useRef, useEffect } from "react"
import { Bot, Loader2, Send, User } from "lucide-react"

import type { ChatMessage, PredictionResult } from "@/lib/types"
import { askChatbotAction } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface ChatbotProps {
  predictionResult: PredictionResult | null;
}

export function Chatbot({ predictionResult }: ChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isLoading]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const result = await askChatbotAction({
      question: input,
      diabetesRiskResult: predictionResult?.assessment,
    });

    setIsLoading(false);

    if (result.success && result.data) {
      const botMessage: ChatMessage = { id: (Date.now() + 1).toString(), role: 'bot', content: result.data };
      setMessages(prev => [...prev, botMessage]);
    } else {
      toast({
        variant: "destructive",
        title: "Chatbot Error",
        description: result.error || "An unknown error occurred.",
      });
      setMessages(prev => prev.filter(m => m.id !== userMessage.id));
    }
  };

  return (
    <Card className="flex flex-col h-[500px]">
      <CardHeader>
        <CardTitle>Diabe-Bot</CardTitle>
        <CardDescription>Ask questions about diabetes or your results.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start gap-3",
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'bot' && <Bot className="h-8 w-8 text-primary flex-shrink-0" />}
                <div
                  className={cn(
                    "max-w-xs rounded-lg p-3 text-sm shadow-md",
                    message.role === 'user'
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  )}
                >
                  {message.content}
                </div>
                {message.role === 'user' && <User className="h-8 w-8 rounded-full bg-accent text-accent-foreground p-1.5 flex-shrink-0" />}
              </div>
            ))}
             {isLoading && (
              <div className="flex items-start gap-3 justify-start">
                  <Bot className="h-8 w-8 text-primary flex-shrink-0" />
                  <div className="bg-muted rounded-lg p-3 text-sm flex items-center shadow-md">
                    <Loader2 className="h-4 w-4 animate-spin"/>
                  </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            disabled={isLoading}
            className="bg-gray-100 text-black"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
