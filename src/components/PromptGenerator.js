'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Bot, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { OpenAI, Gemini, Claude, Midjourney } from '@lobehub/icons';
import { toast } from 'sonner';

const generateUniqueId = () =>
  `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

const PlatformLogos = () => (
  <div className="mt-4 border-t pt-4">
    <p className="text-xs text-muted-foreground mb-2">Supports:</p>
    <div className="flex items-center gap-x-4">
      <OpenAI className="h-5 w-auto text-gray-500" />
      <Gemini className="h-5 w-auto text-gray-500" />
      <Claude className="h-5 w-auto text-gray-500" />
      <Midjourney className="h-5 w-auto text-gray-500" />
    </div>
  </div>
);

const OptionSelector = ({ onSelect }) => (
  <div className="flex flex-wrap gap-2 mt-2">
    <Button
      variant="outline"
      onClick={() => onSelect({ targetAI: 'Gemini', promptStyle: 'Basic' })}
    >
      Gemini (Basic)
    </Button>
    <Button
      variant="outline"
      onClick={() => onSelect({ targetAI: 'ChatGPT', promptStyle: 'Basic' })}
    >
      ChatGPT (Basic)
    </Button>
    <Button
      variant="outline"
      onClick={() => onSelect({ targetAI: 'Claude', promptStyle: 'Detail' })}
    >
      Claude (Detail)
    </Button>
    <Button
      variant="outline"
      onClick={() => onSelect({ targetAI: 'Other', promptStyle: 'Detail' })}
    >
      Other (Detail)
    </Button>
  </div>
);

export const PromptGenerator = () => {
  const t = useTranslations('PromptGenerator');
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // 'idle', 'awaiting_options', 'processing'
  const [flowState, setFlowState] = useState('idle');

  const chatContainerRef = useRef(null);
  const MAX_CHARS = 255;

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.length > MAX_CHARS) {
      toast.error(t('characterLimitToast', { count: MAX_CHARS }));
      setUserInput(value.substring(0, MAX_CHARS));
    } else {
      setUserInput(value);
    }
  };

  const addUserMessage = useCallback((text) => {
    setMessages((prev) => [
      ...prev,
      { id: generateUniqueId(), sender: 'user', text },
    ]);
  }, []);

  const addEctroMessage = useCallback((text, component = null) => {
    setMessages((prev) => [
      ...prev,
      { id: generateUniqueId(), sender: 'Ectro', text, component },
    ]);
  }, []);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Set initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      addEctroMessage(t('welcomeMessage'), 'PlatformLogos');
    }
  }, [messages.length, addEctroMessage, t]);

  const handleOptionSelect = useCallback(
    async (options) => {
      // Visually confirm selection by removing the options selector
      setMessages((prev) =>
        prev.filter((m) => m.component !== 'OptionSelector'),
      );
      addEctroMessage(
        `Okay, using ${options.targetAI} with ${options.promptStyle} style. Optimizing...`,
      );
      setFlowState('processing');
      setIsLoading(true);

      // --- Mock API Call ---
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const mockOptimizedPrompt = `Craft a compelling narrative about a lone astronaut who discovers a sentient, crystalline lifeform on a desolate moon of Jupiter.\n\n**Key Elements:**\n- **Character:** Dr. Aris Thorne...`;
      const mockExplanation = `• **Role Assignment:** Cast the AI as a master storyteller...`;
      // --- End Mock API Call ---

      addEctroMessage(mockOptimizedPrompt, 'Result');
      addEctroMessage(mockExplanation, 'Explanation');

      setIsLoading(false);
      setFlowState('idle');
    },
    [addEctroMessage],
  );

  const handleSend = useCallback(() => {
    if (!userInput.trim()) return;

    addUserMessage(userInput);
    setUserInput('');
    setFlowState('awaiting_options');
    addEctroMessage(t('optionSelectMessage'), 'OptionSelector');
  }, [addUserMessage, addEctroMessage, userInput, t]);

  const renderMessageContent = (msg) => {
    if (msg.component === 'OptionSelector') {
      return (
        <div>
          <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
          <OptionSelector onSelect={handleOptionSelect} />
        </div>
      );
    }
    if (msg.component === 'PlatformLogos') {
      return (
        <div>
          <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
          <PlatformLogos />
        </div>
      );
    }
    return <p className="whitespace-pre-wrap text-sm">{msg.text}</p>;
  };

  return (
    <div className="flex flex-col h-[75vh] w-full max-w-3xl mx-auto bg-white border rounded-lg shadow-lg">
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-6"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}
          >
            {msg.sender === 'Ectro' && (
              <Avatar className="w-9 h-9 border">
                <AvatarFallback>
                  <Bot size={20} />
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={`rounded-lg px-1.5 py-1 max-w-[80%] ${msg.sender === 'user'
                  ? 'bg-secondary text-secondary-foreground'
                  : 'bg-muted'
              }`}
            >
              {renderMessageContent(msg)}
            </div>
            {msg.sender === 'user' && (
              <Avatar className="w-9 h-9 border">
                <AvatarFallback>
                  <User size={20} />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        {isLoading && flowState === 'processing' && (
          <div className="flex items-start gap-4">
            <Avatar className="w-9 h-9 border">
              <AvatarFallback>
                <Bot size={20} />
              </AvatarFallback>
            </Avatar>
            <div className="rounded-lg p-4 max-w-[80%] bg-muted">
              <div className="h-2 w-6 animate-pulse rounded-full bg-gray-300"></div>
            </div>
          </div>
        )}
      </div>
      <div className="border rounded-lg mx-4 mb-2">
        <Textarea
          placeholder={t('inputPlaceholder')}
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          disabled={flowState !== 'idle'}
          className="w-full border-0 resize-none focus-visible:ring-0 p-4"
          maxLength={MAX_CHARS}
          rows={3}
        />
        <div className="flex items-center justify-between py-1 px-4">
          <span className="text-xs text-muted-foreground">
            {userInput.length} / {MAX_CHARS}
          </span>
          <Button
            type="submit"
            size="sm"
            onClick={handleSend}
            disabled={flowState !== 'idle' || !userInput.trim()}
          >
            <Send className="icon" />
          </Button>
        </div>
      </div>
    </div>
  );
};
