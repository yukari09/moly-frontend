'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { Copy, Sparkles, Zap, Loader2, AlertCircle, RefreshCw, CheckCircle, Save, Share2, RotateCcw, Heart, Trash2, HelpCircle, History, ChevronDown, ChevronUp } from 'lucide-react';

import { conversionTracking } from '@/lib/monitoring';

export function KariOptimizer({ generatorType, defaultMode = 'BASIC' }) {
  const t = useTranslations('KariOptimizer');
  const locale = useLocale();
  const [prompt, setPrompt] = useState('');
  const [platform, setPlatform] = useState('chatgpt');
  const [mode, setMode] = useState(defaultMode);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const [savedResults, setSavedResults] = useState([]);
  const [showSavedResults, setShowSavedResults] = useState(false);
  
  // Initialize monitoring hooks
  const { startTiming, endTiming, logError, monitorApiCall, trackConversion } = useMonitoring('KariOptimizer');
  const { trackFormStart, trackFormSubmit, trackFieldInteraction } = useFormMonitoring('kari_optimizer');
  
  // Advanced features state
  const [clarifyingQuestions, setClarifyingQuestions] = useState([]);
  const [clarifyingAnswers, setClarifyingAnswers] = useState({});
  const [showClarifyingQuestions, setShowClarifyingQuestions] = useState(false);
  const [optimizationHistory, setOptimizationHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [smartDefaults, setSmartDefaults] = useState({});

  // Load saved results and optimization history from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('kari-saved-results');
    if (saved) {
      try {
        setSavedResults(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load saved results:', error);
      }
    }
    
    const history = localStorage.getItem('kari-optimization-history');
    if (history) {
      try {
        setOptimizationHistory(JSON.parse(history));
      } catch (error) {
        console.error('Failed to load optimization history:', error);
      }
    }
  }, []);

  // Set smart defaults based on generator type
  useEffect(() => {
    const defaults = getSmartDefaults(generatorType);
    setSmartDefaults(defaults);
    
    // Auto-set platform if not already set
    if (defaults.recommendedPlatform && platform === 'chatgpt') {
      setPlatform(defaults.recommendedPlatform);
    }
  }, [generatorType]);

  // Generate smart defaults based on generator type
  const getSmartDefaults = (type) => {
    const defaults = {
      writing: {
        recommendedPlatform: 'chatgpt',
        recommendedMode: 'DETAIL',
        commonTechniques: ['Role Assignment', 'Context Layering', 'Output Specification'],
        clarifyingQuestions: [
          { id: 'genre', question: 'What genre or style are you aiming for?', category: 'style', options: ['Fiction', 'Non-fiction', 'Academic', 'Creative', 'Technical'] },
          { id: 'audience', question: 'Who is your target audience?', category: 'context', options: ['General public', 'Professionals', 'Students', 'Children', 'Experts'] },
          { id: 'length', question: 'What length are you targeting?', category: 'output', options: ['Short (< 500 words)', 'Medium (500-2000 words)', 'Long (> 2000 words)', 'Variable'] }
        ]
      },
      art: {
        recommendedPlatform: 'midjourney',
        recommendedMode: 'BASIC',
        commonTechniques: ['Style Specification', 'Composition Guidance', 'Color Direction'],
        clarifyingQuestions: [
          { id: 'style', question: 'What artistic style do you prefer?', category: 'style', options: ['Realistic', 'Abstract', 'Cartoon', 'Photographic', 'Painterly'] },
          { id: 'mood', question: 'What mood should the artwork convey?', category: 'context', options: ['Cheerful', 'Dramatic', 'Peaceful', 'Energetic', 'Mysterious'] },
          { id: 'composition', question: 'Any specific composition preferences?', category: 'output', options: ['Portrait', 'Landscape', 'Close-up', 'Wide shot', 'No preference'] }
        ]
      },
      ai: {
        recommendedPlatform: 'chatgpt',
        recommendedMode: 'DETAIL',
        commonTechniques: ['Multi-perspective Analysis', 'Chain-of-thought', 'Constraint Optimization'],
        clarifyingQuestions: [
          { id: 'complexity', question: 'How complex should the response be?', category: 'output', options: ['Simple explanation', 'Detailed analysis', 'Expert level', 'Step-by-step'] },
          { id: 'format', question: 'What format do you prefer?', category: 'output', options: ['Paragraph', 'Bullet points', 'Numbered list', 'Table', 'Mixed'] },
          { id: 'perspective', question: 'Any specific perspective needed?', category: 'context', options: ['Neutral', 'Critical', 'Supportive', 'Comparative', 'Historical'] }
        ]
      },
      chatgpt: {
        recommendedPlatform: 'chatgpt',
        recommendedMode: 'DETAIL',
        commonTechniques: ['Role Assignment', 'Conversation Structure', 'Context Building'],
        clarifyingQuestions: [
          { id: 'role', question: 'What role should ChatGPT assume?', category: 'context', options: ['Expert advisor', 'Teacher', 'Assistant', 'Analyst', 'Creative partner'] },
          { id: 'interaction', question: 'What type of interaction do you want?', category: 'style', options: ['Q&A session', 'Brainstorming', 'Problem solving', 'Learning', 'Creative collaboration'] },
          { id: 'depth', question: 'How detailed should responses be?', category: 'output', options: ['Brief and concise', 'Moderately detailed', 'Comprehensive', 'Exhaustive'] }
        ]
      },
      midjourney: {
        recommendedPlatform: 'midjourney',
        recommendedMode: 'BASIC',
        commonTechniques: ['Parameter Optimization', 'Style References', 'Aspect Ratio Control'],
        clarifyingQuestions: [
          { id: 'aspect', question: 'What aspect ratio do you need?', category: 'output', options: ['Square (1:1)', 'Portrait (3:4)', 'Landscape (4:3)', 'Wide (16:9)', 'Custom'] },
          { id: 'quality', question: 'What quality level?', category: 'output', options: ['Standard', 'High quality', 'Ultra high', 'Raw style'] },
          { id: 'reference', question: 'Any specific artistic references?', category: 'style', options: ['Photography', 'Painting', 'Digital art', 'Vintage', 'Modern'] }
        ]
      },
      drawing: {
        recommendedPlatform: 'chatgpt',
        recommendedMode: 'BASIC',
        commonTechniques: ['Technique Guidance', 'Inspiration Building', 'Skill Level Adaptation'],
        clarifyingQuestions: [
          { id: 'skill', question: 'What is your drawing skill level?', category: 'context', options: ['Beginner', 'Intermediate', 'Advanced', 'Professional'] },
          { id: 'medium', question: 'What drawing medium will you use?', category: 'context', options: ['Pencil', 'Digital', 'Pen & ink', 'Charcoal', 'Mixed media'] },
          { id: 'time', question: 'How much time do you have?', category: 'constraints', options: ['Quick sketch (< 30 min)', 'Short session (1-2 hours)', 'Long project (> 2 hours)', 'Multiple sessions'] }
        ]
      },
      'ai-video': {
        recommendedPlatform: 'other',
        recommendedMode: 'DETAIL',
        commonTechniques: ['Scene Description', 'Motion Specification', 'Style Consistency'],
        clarifyingQuestions: [
          { id: 'platform', question: 'Which video AI platform will you use?', category: 'context', options: ['Runway', 'Pika Labs', 'Stable Video', 'Other'] },
          { id: 'duration', question: 'What video duration do you need?', category: 'output', options: ['Short clip (< 5s)', 'Medium (5-15s)', 'Long (> 15s)', 'Variable'] },
          { id: 'motion', question: 'What type of motion do you want?', category: 'style', options: ['Subtle movement', 'Dynamic action', 'Camera movement', 'Object transformation'] }
        ]
      }
    };
    
    return defaults[type] || defaults.ai;
  };

  const platforms = [
    { value: 'chatgpt', label: 'ChatGPT' },
    { value: 'claude', label: 'Claude' },
    { value: 'gemini', label: 'Gemini' },
    { value: 'midjourney', label: 'Midjourney' },
    { value: 'dalle', label: 'DALL-E' },
    { value: 'other', label: 'Other' }
  ];

  // Input validation
  const validateInput = () => {
    const errors = {};
    
    if (!prompt.trim()) {
      errors.prompt = t('errors.emptyPrompt');
    } else if (prompt.trim().length < 10) {
      errors.prompt = t('errors.promptTooShort');
    } else if (prompt.trim().length > 2000) {
      errors.prompt = t('errors.promptTooLong');
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOptimize = async (isRetry = false) => {
    // Clear previous errors
    setError(null);
    
    // Validate input
    if (!validateInput()) {
      return;
    }

    // Track form submission start
    if (!isRetry) {
      trackFormSubmit(false); // Track attempt
      trackConversion.trackGeneratorStart(generatorType, platform);
    }

    // For DETAIL mode, show clarifying questions first if not already answered
    if (mode === 'DETAIL' && !isRetry && Object.keys(clarifyingAnswers).length === 0 && smartDefaults.clarifyingQuestions && smartDefaults.clarifyingQuestions.length > 0) {
      setClarifyingQuestions(smartDefaults.clarifyingQuestions);
      setShowClarifyingQuestions(true);
      return;
    }
    
    setIsLoading(true);
    startTiming('optimization_request');
    
    try {
      const optimizationData = {
        prompt: prompt.trim(),
        platform,
        generatorType,
        mode,
        locale: locale,
        clarifyingAnswers: mode === 'DETAIL' ? clarifyingAnswers : undefined
      };

      const result = await monitorApiCall('/api/kari/optimize', async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        const response = await fetch('/api/kari/optimize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(optimizationData),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          if (response.status === 429) {
            throw new Error('Rate limit exceeded. Please try again in a few minutes.');
          } else if (response.status >= 500) {
            throw new Error('Server error. Please try again later.');
          } else {
            throw new Error(`Request failed with status ${response.status}`);
          }
        }
        
        return response.json();
      }, {
        generatorType,
        platform,
        mode,
        promptLength: prompt.trim().length
      });
      
      const processingTime = endTiming('optimization_request');
      
      if (result.success) {
        const optimizationResult = {
          ...result.data,
          processingTime: processingTime || result.data.processingTime
        };
        
        setResult(optimizationResult);
        setRetryCount(0);
        
        // Track successful optimization
        trackFormSubmit(true);
        trackConversion.trackOptimizationSuccess({
          generatorType,
          platform,
          mode,
          originalPrompt: prompt.trim(),
          processingTime: optimizationResult.processingTime,
          techniquesApplied: optimizationResult.techniquesApplied || []
        });
        
        // Add to optimization history
        addToHistory({
          timestamp: new Date().toISOString(),
          originalPrompt: prompt.trim(),
          optimizedPrompt: optimizationResult.optimizedPrompt,
          platform,
          mode,
          generatorType,
          clarifyingAnswers: mode === 'DETAIL' ? clarifyingAnswers : undefined,
          keyImprovements: optimizationResult.keyImprovements || [],
          techniquesApplied: optimizationResult.techniquesApplied || [],
          processingTime: optimizationResult.processingTime
        });
        
        toast.success(t('success.optimized'));
      } else {
        throw new Error(result.error || 'Optimization failed');
      }
      
    } catch (error) {
      endTiming('optimization_request'); // End timing even on error
      
      // Log error with monitoring
      logError(error, {
        action: 'optimization_request',
        generatorType,
        platform,
        mode,
        promptLength: prompt.trim().length,
        retryCount,
        isRetry
      });
      
      // Track failed form submission
      trackFormSubmit(false, error.message);
      
      let errorMessage = t('errors.optimizationFailed');
      
      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out. Please try again.';
      } else if (error.message.includes('fetch')) {
        errorMessage = t('errors.networkError');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      
      // Show error toast
      toast.error(errorMessage);
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    handleOptimize(true);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t('success.copied'));
      
      // Track copy action
      trackConversion.trackPromptCopy(generatorType, platform);
    } catch (error) {
      // Log copy error
      logError(error, {
        action: 'copy_to_clipboard',
        textLength: text?.length || 0
      });
      
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        toast.success(t('success.copied'));
        
        // Track successful fallback copy
        trackConversion.trackPromptCopy(generatorType, platform);
      } catch (fallbackError) {
        logError(fallbackError, {
          action: 'copy_to_clipboard_fallback',
          textLength: text?.length || 0
        });
        toast.error('Failed to copy to clipboard');
      }
      document.body.removeChild(textArea);
    }
  };

  // Save result to localStorage
  const saveResult = (resultToSave = result) => {
    if (!resultToSave) return;
    
    try {
      const savedResult = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        originalPrompt: prompt,
        optimizedPrompt: resultToSave.optimizedPrompt,
        platform,
        mode,
        generatorType,
        keyImprovements: resultToSave.keyImprovements || [],
        techniquesApplied: resultToSave.techniquesApplied || [],
        proTip: resultToSave.proTip
      };
      
      // Track save action
      if (typeof trackConversion !== 'undefined' && trackConversion.trackPromptSave) {
        trackConversion.trackPromptSave(generatorType, platform);
      }
      
      // Keep only 20 most recent results
      const updatedSaved = [savedResult, ...savedResults.slice(0, 19)];
      setSavedResults(updatedSaved);
      
      // Save to localStorage with error handling
      try {
        localStorage.setItem('kari-saved-results', JSON.stringify(updatedSaved));
        toast.success(t('success.saved'));
      } catch (storageError) {
        console.error('Failed to save to localStorage:', storageError);
        toast.error(t('errors.saveFailed'));
      }
      
    } catch (error) {
      console.error('Failed to save result:', error);
      toast.error(t('errors.saveFailed'));
    }
  };

  // Delete saved result
  const deleteSavedResult = (id) => {
    const updatedSaved = savedResults.filter(saved => saved.id !== id);
    setSavedResults(updatedSaved);
    
    try {
      localStorage.setItem('kari-saved-results', JSON.stringify(updatedSaved));
      toast.success(t('success.deleted'));
    } catch (error) {
      console.error('Failed to delete saved result:', error);
    }
  };

  // Load saved result
  const loadSavedResult = (savedResult) => {
    setPrompt(savedResult.originalPrompt);
    setPlatform(savedResult.platform);
    setMode(savedResult.mode);
    setResult({
      optimizedPrompt: savedResult.optimizedPrompt,
      keyImprovements: savedResult.keyImprovements,
      techniquesApplied: savedResult.techniquesApplied,
      proTip: savedResult.proTip
    });
    setShowSavedResults(false);
    toast.success(t('success.loaded'));
  };

  // Share result
  const shareResult = async () => {
    if (!result) return;
    
    const shareData = {
      title: `Optimized Prompt - ${generatorType}`,
      text: `Original: ${prompt}\n\nOptimized: ${result.optimizedPrompt}`,
      url: window.location.href
    };
    
    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast.success(t('success.shared'));
      } else {
        // Fallback: copy share text to clipboard
        const shareText = `${shareData.title}\n\n${shareData.text}\n\nGenerated at: ${shareData.url}`;
        await copyToClipboard(shareText);
        toast.success(t('success.shareLink'));
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Failed to share:', error);
        toast.error(t('errors.shareFailed'));
      }
    }
  };

  // Regenerate with same parameters
  const regeneratePrompt = () => {
    if (!prompt.trim()) {
      toast.error(t('errors.emptyPrompt'));
      return;
    }
    handleOptimize(false);
  };

  // Add to optimization history
  const addToHistory = (historyItem) => {
    const updatedHistory = [historyItem, ...optimizationHistory.slice(0, 49)]; // Keep only 50 most recent
    setOptimizationHistory(updatedHistory);
    
    try {
      localStorage.setItem('kari-optimization-history', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Failed to save optimization history:', error);
    }
  };

  // Clear optimization history
  const clearHistory = () => {
    setOptimizationHistory([]);
    try {
      localStorage.removeItem('kari-optimization-history');
      toast.success(t('success.historyCleared'));
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  // Handle clarifying questions submission
  const handleClarifyingSubmit = () => {
    setShowClarifyingQuestions(false);
    handleOptimize(false);
  };

  // Skip clarifying questions and use smart defaults
  const skipClarifyingQuestions = () => {
    // Set smart default answers
    const defaultAnswers = {};
    smartDefaults.clarifyingQuestions?.forEach(q => {
      if (q.options && q.options.length > 0) {
        defaultAnswers[q.id] = q.options[0]; // Use first option as default
      }
    });
    setClarifyingAnswers(defaultAnswers);
    setShowClarifyingQuestions(false);
    handleOptimize(false);
  };

  // Get technique explanation
  const getTechniqueExplanation = (technique) => {
    const explanations = {
      'Role Assignment': 'Assigns a specific expert role or persona to the AI to improve response quality and relevance.',
      'Context Layering': 'Provides multiple layers of context to help the AI understand the full scope and requirements.',
      'Output Specification': 'Clearly defines the desired format, length, and structure of the expected response.',
      'Task Decomposition': 'Breaks down complex requests into smaller, manageable sub-tasks for better results.',
      'Chain-of-thought': 'Encourages step-by-step reasoning to improve logical consistency and accuracy.',
      'Few-shot Learning': 'Provides examples to guide the AI toward the desired output style and format.',
      'Multi-perspective': 'Considers multiple viewpoints or approaches to provide comprehensive responses.',
      'Constraint Optimization': 'Applies specific constraints and parameters to fine-tune the output.',
      'Style Specification': 'Defines the artistic or writing style for creative tasks.',
      'Composition Guidance': 'Provides direction on visual or structural composition.',
      'Color Direction': 'Specifies color schemes, palettes, or color-related preferences.',
      'Parameter Optimization': 'Fine-tunes platform-specific parameters for optimal results.',
      'Style References': 'Uses artistic or stylistic references to guide the output.',
      'Aspect Ratio Control': 'Manages dimensional aspects for visual content.',
      'Technique Guidance': 'Provides specific technical guidance for skill-based tasks.',
      'Inspiration Building': 'Develops creative inspiration and ideation frameworks.',
      'Skill Level Adaptation': 'Adapts content complexity to match user skill level.',
      'Scene Description': 'Provides detailed scene and environmental descriptions.',
      'Motion Specification': 'Defines movement, animation, or dynamic elements.',
      'Style Consistency': 'Maintains consistent style throughout the output.'
    };
    
    return explanations[technique] || 'Advanced optimization technique applied to improve prompt effectiveness.';
  };

  return (
    <div className="space-y-6">
      {/* Kari欢迎消息 */}
      {!result && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              {t('welcome.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">{t('welcome.message')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-white rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-green-600" />
                  <span className="font-medium">BASIC Mode</span>
                </div>
                <p className="text-sm text-gray-600">{t('welcome.basicMode')}</p>
              </div>
              <div className="p-3 bg-white rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span className="font-medium">DETAIL Mode</span>
                </div>
                <p className="text-sm text-gray-600">{t('welcome.detailMode')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 输入区域 */}
      <Card>
        <CardHeader>
          <CardTitle>{t('input.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Textarea
              id="prompt-input"
              placeholder={t('input.placeholder')}
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                // Clear validation errors when user starts typing
                if (validationErrors.prompt) {
                  setValidationErrors(prev => ({ ...prev, prompt: null }));
                }
              }}
              onFocus={() => {
                trackFieldInteraction('prompt_input', 'focus');
                if (!prompt) {
                  trackFormStart();
                }
              }}
              onBlur={() => trackFieldInteraction('prompt_input', 'blur')}
              className={`min-h-[120px] text-base ${validationErrors.prompt ? 'border-red-500' : ''}`}
              maxLength={2000}
              disabled={isLoading}
              aria-label={t('input.placeholder')}
            />
            {validationErrors.prompt && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {validationErrors.prompt}
              </p>
            )}
            <div className="text-xs text-gray-500 text-right">
              {prompt.length}/2000 characters
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="platform-select" className="text-sm font-medium mb-2 block">{t('input.platform')}</label>
              <Select value={platform} onValueChange={(value) => {
                setPlatform(value);
                trackFieldInteraction('platform_select', 'change');
              }} disabled={isLoading}>
                <SelectTrigger id="platform-select" className="min-h-[44px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label htmlFor="mode-tabs" className="text-sm font-medium mb-2 block">{t('input.mode')}</label>
              <Tabs value={mode} onValueChange={(value) => {
                setMode(value);
                trackFieldInteraction('mode_select', 'change');
              }} id="mode-tabs">
                <TabsList className="grid w-full grid-cols-2 min-h-[44px]">
                  <TabsTrigger value="BASIC" disabled={isLoading} className="min-h-[40px]">BASIC</TabsTrigger>
                  <TabsTrigger value="DETAIL" disabled={isLoading} className="min-h-[40px]">DETAIL</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={() => handleOptimize(false)} 
              disabled={!prompt.trim() || isLoading || Object.keys(validationErrors).length > 0}
              className="flex-1 min-h-[44px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t('input.optimizing')}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {t('input.optimize')}
                </>
              )}
            </Button>
            
            {savedResults.length > 0 && (
              <Button
                variant="outline"
                onClick={() => setShowSavedResults(!showSavedResults)}
                disabled={isLoading}
                className="min-h-[44px] min-w-[44px]"
                aria-label="Show saved results"
              >
                <Save className="w-4 h-4" />
              </Button>
            )}
            
            {optimizationHistory.length > 0 && (
              <Button
                variant="outline"
                onClick={() => setShowHistory(!showHistory)}
                disabled={isLoading}
                className="min-h-[44px] min-w-[44px]"
                aria-label="Show optimization history"
              >
                <History className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{error}</span>
                {retryCount < 3 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRetry}
                    disabled={isLoading}
                    className="ml-2"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Retry
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </div>
            </CardContent>
          </Card>
          <div className="text-center text-sm text-gray-500 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Kari is optimizing your prompt...
          </div>
        </div>
      )}

      {/* Clarifying Questions Dialog */}
      <Dialog open={showClarifyingQuestions} onOpenChange={setShowClarifyingQuestions}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              {t('clarifying.title')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">{t('clarifying.description')}</p>
            
            {clarifyingQuestions.map((question) => (
              <div key={question.id} className="space-y-2">
                <label className="text-sm font-medium">{question.question}</label>
                <Select
                  value={clarifyingAnswers[question.id] || ''}
                  onValueChange={(value) => setClarifyingAnswers(prev => ({ ...prev, [question.id]: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('clarifying.selectOption')} />
                  </SelectTrigger>
                  <SelectContent>
                    {question.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
            
            <div className="flex gap-2 pt-4">
              <Button onClick={handleClarifyingSubmit} className="flex-1">
                <Sparkles className="w-4 h-4 mr-2" />
                {t('clarifying.optimize')}
              </Button>
              <Button variant="outline" onClick={skipClarifyingQuestions} className="flex-1">
                <Zap className="w-4 h-4 mr-2" />
                {t('clarifying.useDefaults')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 结果区域 */}
      {result && !isLoading && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span>{t('result.optimizedPrompt')}</span>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(result.optimizedPrompt)}
                    className="min-h-[44px] flex-1 sm:flex-none"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    <span className="sm:inline hidden">{t('result.copy')}</span>
                    <span className="sm:hidden inline">Copy</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => saveResult()}
                    className="min-h-[44px] flex-1 sm:flex-none"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    <span className="sm:inline hidden">{t('result.save')}</span>
                    <span className="sm:hidden inline">Save</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={shareResult}
                    className="min-h-[44px] flex-1 sm:flex-none"
                  >
                    <Share2 className="w-4 h-4 mr-1" />
                    <span className="sm:inline hidden">{t('result.share')}</span>
                    <span className="sm:hidden inline">Share</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={regeneratePrompt}
                    disabled={isLoading}
                    className="min-h-[44px] flex-1 sm:flex-none"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    <span className="sm:inline hidden">{t('result.regenerate')}</span>
                    <span className="sm:hidden inline">Retry</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setResult(null);
                      setError(null);
                    }}
                    className="min-h-[44px] flex-1 sm:flex-none"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    <span className="sm:inline hidden">{t('result.newPrompt')}</span>
                    <span className="sm:hidden inline">New</span>
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="whitespace-pre-wrap">{result.optimizedPrompt}</p>
              </div>
            </CardContent>
          </Card>

          {result.keyImprovements && result.keyImprovements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t('result.improvements')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.keyImprovements.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {result.techniquesApplied && result.techniquesApplied.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {t('result.techniques')}
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TooltipProvider>
                  <div className="flex flex-wrap gap-2">
                    {result.techniquesApplied.map((technique, index) => (
                      <Tooltip key={index}>
                        <TooltipTrigger asChild>
                          <Badge variant="secondary" className="cursor-help">
                            {technique}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>{getTechniqueExplanation(technique)}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </TooltipProvider>
              </CardContent>
            </Card>
          )}

          {result.proTip && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="text-yellow-800">{t('result.proTip')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-yellow-700">{result.proTip}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Optimization History Section */}
      {showHistory && optimizationHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5" />
                {t('history.title')}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearHistory}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  {t('history.clear')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHistory(false)}
                >
                  ×
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {optimizationHistory.map((item, index) => (
                <div key={index} className="border rounded-lg p-3 hover:bg-gray-50">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{item.platform}</span>
                        <span>•</span>
                        <span>{item.mode}</span>
                        {item.processingTime && (
                          <>
                            <span>•</span>
                            <span>{item.processingTime.toFixed(1)}s</span>
                          </>
                        )}
                      </div>
                      <div className="text-sm font-medium truncate mb-1">
                        {item.originalPrompt}
                      </div>
                      <div className="text-xs text-gray-600 line-clamp-2 mb-2">
                        {item.optimizedPrompt}
                      </div>
                      {item.techniquesApplied && item.techniquesApplied.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.techniquesApplied.slice(0, 3).map((technique, techIndex) => (
                            <Badge key={techIndex} variant="outline" className="text-xs">
                              {technique}
                            </Badge>
                          ))}
                          {item.techniquesApplied.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{item.techniquesApplied.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setPrompt(item.originalPrompt);
                          setPlatform(item.platform);
                          setMode(item.mode);
                          if (item.clarifyingAnswers) {
                            setClarifyingAnswers(item.clarifyingAnswers);
                          }
                          setResult({
                            optimizedPrompt: item.optimizedPrompt,
                            keyImprovements: item.keyImprovements,
                            techniquesApplied: item.techniquesApplied
                          });
                          setShowHistory(false);
                          toast.success(t('success.loaded'));
                        }}
                        title={t('history.load')}
                        className="min-h-[44px] min-w-[44px]"
                        aria-label={t('history.load')}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(item.optimizedPrompt)}
                        title={t('result.copy')}
                        className="min-h-[44px] min-w-[44px]"
                        aria-label={t('result.copy')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {optimizationHistory.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                {t('history.empty')}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Saved Results Section */}
      {showSavedResults && savedResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {t('saved.title')}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSavedResults(false)}
              >
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {savedResults.map((saved) => (
                <div key={saved.id} className="border rounded-lg p-3 hover:bg-gray-50">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 mb-1">
                        {new Date(saved.timestamp).toLocaleDateString()} • {saved.platform} • {saved.mode}
                      </div>
                      <div className="text-sm font-medium truncate mb-1">
                        {saved.originalPrompt}
                      </div>
                      <div className="text-xs text-gray-600 line-clamp-2">
                        {saved.optimizedPrompt}
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => loadSavedResult(saved)}
                        title={t('saved.load')}
                        className="min-h-[44px] min-w-[44px]"
                        aria-label={t('saved.load')}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(saved.optimizedPrompt)}
                        title={t('result.copy')}
                        className="min-h-[44px] min-w-[44px]"
                        aria-label={t('result.copy')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteSavedResult(saved.id)}
                        title={t('saved.delete')}
                        className="text-red-500 hover:text-red-700 min-h-[44px] min-w-[44px]"
                        aria-label={t('saved.delete')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {savedResults.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                {t('saved.empty')}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}