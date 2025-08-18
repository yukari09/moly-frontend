'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Sparkles, Bot, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// This is a simplified unique ID generator for keys
let messageId = 0;

export const PromptGenerator = () => {
  const t = useTranslations('PromptGenerator');
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // 'idle', 'awaiting_options', 'processing'
  const [flowState, setFlowState] = useState('idle'); 

  const chatContainerRef = useRef(null);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
    // Set initial welcome message
    if (messages.length === 0) {
        setMessages([{ 
            id: messageId++, 
            sender: 'lyra',
            text: t('welcomeMessage')
        }]);
    }
  }, [messages, t]);

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { id: messageId++, sender: 'user', text }]);
  };

  const addLyraMessage = (text, component = null) => {
    setMessages(prev => [...prev, { id: messageId++, sender: 'lyra', text, component }]);
  };

  const handleSend = () => {
    if (!userInput.trim()) return;
    
    addUserMessage(userInput);
    setUserInput('');
    setFlowState('awaiting_options');
    addLyraMessage(t('optionSelectMessage'), 'OptionSelector');
  };

  const handleOptionSelect = async (options) => {
    // Visually confirm selection by removing the options selector
    setMessages(prev => prev.filter(m => m.component !== 'OptionSelector'));
    addLyraMessage(`Okay, using ${options.targetAI} with ${options.promptStyle} style. Optimizing...`);
    setFlowState('processing');
    setIsLoading(true);

    // --- Mock API Call ---
    await new Promise(resolve => setTimeout(resolve, 1500));
    const mockOptimizedPrompt = `Craft a compelling narrative about a lone astronaut who discovers a sentient, crystalline lifeform on a desolate moon of Jupiter.\n\n**Key Elements:**\n- **Character:** Dr. Aris Thorne...`;
    const mockExplanation = `• **Role Assignment:** Cast the AI as a master storyteller...`;
    // --- End Mock API Call ---

    addLyraMessage(mockOptimizedPrompt, 'Result');
    addLyraMessage(mockExplanation, 'Explanation');

    setIsLoading(false);
    setFlowState('idle');
  };

  const OptionSelector = () => (
    <div className="flex flex-wrap gap-2 mt-2">
        <Button variant="outline" onClick={() => handleOptionSelect({targetAI: 'Gemini', promptStyle: 'Basic'})}>Gemini (Basic)</Button>
        <Button variant="outline" onClick={() => handleOptionSelect({targetAI: 'ChatGPT', promptStyle: 'Basic'})}>ChatGPT (Basic)</Button>
        <Button variant="outline" onClick={() => handleOptionSelect({targetAI: 'Claude', promptStyle: 'Detail'})}>Claude (Detail)</Button>
        <Button variant="outline" onClick={() => handleOptionSelect({targetAI: 'Other', promptStyle: 'Detail'})}>Other (Detail)</Button>
    </div>
  );

  const renderMessageContent = (msg) => {
    if (msg.component === 'OptionSelector') return <OptionSelector />;
    return <p className="whitespace-pre-wrap">{msg.text}</p>;
  }

  return (
    <div className="flex flex-col h-[75vh] w-full max-w-3xl mx-auto bg-white border rounded-lg shadow-lg">
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map(msg => (
          <div key={msg.id} className={`flex items-start gap-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'lyra' && (
              <Avatar className="w-9 h-9 border">
                <AvatarFallback><Bot size={20} /></AvatarFallback>
              </Avatar>
            )}
            <div className={`rounded-lg p-4 max-w-[80%] ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                {renderMessageContent(msg)}
            </div>
            {msg.sender === 'user' && (
                 <Avatar className="w-9 h-9 border">
                    <AvatarFallback><User size={20} /></AvatarFallback>
                </Avatar>
            )}
          </div>
        ))}
        {isLoading && flowState === 'processing' && (
             <div className="flex items-start gap-4">
                <Avatar className="w-9 h-9 border">
                    <AvatarFallback><Bot size={20} /></AvatarFallback>
                </Avatar>
                <div className="rounded-lg p-4 max-w-[80%] bg-muted">
                    <div className="h-2 w-6 animate-pulse rounded-full bg-gray-300"></div>
                </div>
            </div>
        )}
      </div>
      <div className="border-t p-4 bg-background">
        <div className="relative">
          <Textarea
            placeholder={t('inputPlaceholder')}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            disabled={flowState !== 'idle'}
            className="pr-20 min-h-[50px] resize-none"
          />
          <Button 
            type="submit" 
            size="icon" 
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={handleSend}
            disabled={flowState !== 'idle' || !userInput.trim()}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};