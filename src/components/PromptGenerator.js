'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Bot, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { OpenAI, Gemini, Claude, Midjourney } from '@lobehub/icons';
import { toast } from 'sonner';
import { marked } from 'marked';


const replaceSingleNewline = (str) => {
  if (typeof str !== 'string') {
    return '';
  }
  return str.split('\n\n').map(paragraph => {
    return paragraph.replace(/\n/g, '\n\n');
  }).join('\n\n');
}

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
      variant="secondary"
      size="sm"
      className="text-xs cursor-pointer"
      onClick={() => onSelect({ targetAI: 'Gemini', promptStyle: 'Basic' })}
    >
      Gemini
    </Button>
    <Button
      variant="secondary"
      size="sm"
      className="text-xs cursor-pointer"
      onClick={() => onSelect({ targetAI: 'ChatGPT', promptStyle: 'Basic' })}
    >
      ChatGPT
    </Button>
    <Button
      variant="secondary"
      size="sm"
      className="text-xs cursor-pointer"
      onClick={() => onSelect({ targetAI: 'Claude', promptStyle: 'Basic' })}
    >
      Claude
    </Button>
    <Button
      variant="secondary"
      size="sm"
      className="text-xs cursor-pointer"
      onClick={() => onSelect({ targetAI: 'Midjourney', promptStyle: 'Basic' })}
    >
      Midjourney
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
  const MAX_CHARS = 1024;

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

      const lastUserMessage = messages.filter(m => m.sender === 'user').slice(-1)[0];
      const userPrompt = lastUserMessage?.text || '';

      // Visually confirm selection by removing the options selector
      setMessages((prev) =>
        prev.filter((m) => m.component !== 'OptionSelector'),
      );
      addEctroMessage(
        `Okay, using ${options.targetAI} with ${options.promptStyle} style. Optimizing your prompt: "${userPrompt.substring(0, 50)}${userPrompt.length > 50 ? '...' : ''}"`,
      );
      setFlowState('processing');
      setIsLoading(true);

      options['userPrompt'] = userPrompt


      try {
        const response = await fetch('/api/ectro', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(options),
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        const optimizedPrompt = data.message
        addEctroMessage(optimizedPrompt, 'Result');
      } catch (error) {
        console.error('API call failed:', error);
        toast.error('Failed to optimize prompt. Please try again.');
        
      
        addEctroMessage('Sorry, there was an error optimizing your prompt. Please try again.', 'Error');
      }

      setIsLoading(false);
      setFlowState('idle');
    },
    [addEctroMessage, messages], // 添加 messages 到依赖数组
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
          <p>{msg.text}</p>
          <OptionSelector onSelect={handleOptionSelect} />
        </div>
      );
    }
    if (msg.component === 'PlatformLogos') {
      return (
        <div>
          <p>{msg.text}</p>
          <PlatformLogos />
        </div>
      );
    }
    if(msg.component == "Result"){
      const md = replaceSingleNewline(msg.text)
      const htmlText = marked.parse(md)
      return <div dangerouslySetInnerHTML={{ __html: htmlText }} />;
    }
    return <p>{msg.text}</p>;
  };

  return (
    <div className="flex flex-col h-[75vh] w-full max-w-3xl mx-auto bg-white border rounded-lg shadow-lg">
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-6 prose prose-sm max-w-none"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}
          >
            {msg.sender === 'Ectro' && (
              <Avatar className="size-8 border my-4">
                <AvatarFallback>
                  <Bot size={20} />
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={`rounded-lg px-1.5 py-1 max-w-[80%] ${msg.sender === 'user'
                  ? 'bg-secondary text-secondary-foreground'
                  : ''
              }`}
            >
              {renderMessageContent(msg)}
            </div>
            {msg.sender === 'user' && (
              <Avatar className="size-8 my-4 border">
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
          className="w-full border-0 resize-none focus-visible:ring-0 p-4 rounded-none"
          maxLength={MAX_CHARS}
          rows={3}
        />
        <div className="flex items-center justify-between py-2 px-4">
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