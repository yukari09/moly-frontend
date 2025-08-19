'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { Copy, Sparkles, Zap, Loader2, AlertCircle, RefreshCw, CheckCircle, Save, Share2, RotateCcw, Trash2, HelpCircle, History, Lightbulb } from 'lucide-react';
import { useMonitoring, useFormMonitoring } from '@/hooks/useMonitoring';
import { Label } from '@/components/ui/label';
import { JetBrains_Mono } from 'next/font/google';

const jetBrainsMono = JetBrains_Mono({ subsets: ['latin'] });

export default function WorkSpacePage() {
  const generatorType = 'ai';
  const defaultMode = 'BASIC';
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
  const [optimizationHistory, setOptimizationHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('result');

  const { startTiming, endTiming, logError, monitorApiCall, trackConversion } = useMonitoring('KariOptimizer');
  const { trackFormStart, trackFormSubmit, trackFieldInteraction } = useFormMonitoring('kari_optimizer');
  
  const [clarifyingQuestions, setClarifyingQuestions] = useState([]);
  const [clarifyingAnswers, setClarifyingAnswers] = useState({});
  const [showClarifyingQuestions, setShowClarifyingQuestions] = useState(false);
  const [smartDefaults, setSmartDefaults] = useState({});

  // Smartly restore state from localStorage on initial load
  useEffect(() => {
    const lastResultStr = localStorage.getItem('kari-last-result');
    const historyStr = localStorage.getItem('kari-optimization-history');
    const savedStr = localStorage.getItem('kari-saved-results');

    let activeResult = null;
    if (lastResultStr) {
      try {
        activeResult = JSON.parse(lastResultStr);
        setResult(activeResult);
        setPrompt(activeResult.originalPrompt || ''); // Restore prompt
      } catch (e) {
        console.error('Failed to load last result:', e);
        localStorage.removeItem('kari-last-result'); // Clear corrupted data
      }
    }

    const history = historyStr ? JSON.parse(historyStr) : [];
    const saved = savedStr ? JSON.parse(savedStr) : [];
    setOptimizationHistory(history);
    setSavedResults(saved);

    // Set initial tab based on restored state priority: Result > History > Saved
    if (activeResult) {
      setActiveTab('result');
    } else if (history.length > 0) {
      setActiveTab('history');
    } else if (saved.length > 0) {
      setActiveTab('saved');
    } else {
      setActiveTab('result');
    }
  }, []);

  useEffect(() => {
    const defaults = getSmartDefaults(generatorType);
    setSmartDefaults(defaults);
    if (defaults.recommendedPlatform && platform === 'chatgpt') {
      setPlatform(defaults.recommendedPlatform);
    }
  }, [generatorType]);

  const getSmartDefaults = (type) => {
    const defaults = {
      writing: { recommendedPlatform: 'chatgpt', recommendedMode: 'DETAIL', commonTechniques: ['Role Assignment', 'Context Layering', 'Output Specification'], clarifyingQuestions: [{ id: 'genre', question: 'What genre or style are you aiming for?', options: ['Fiction', 'Non-fiction', 'Academic'] }, { id: 'audience', question: 'Who is your target audience?', options: ['General public', 'Professionals', 'Students'] }]}, 
      art: { recommendedPlatform: 'midjourney', recommendedMode: 'BASIC', commonTechniques: ['Style Specification', 'Composition Guidance', 'Color Direction'], clarifyingQuestions: [{ id: 'style', question: 'What artistic style do you prefer?', options: ['Realistic', 'Abstract', 'Cartoon'] }, { id: 'mood', question: 'What mood should the artwork convey?', options: ['Cheerful', 'Dramatic', 'Peaceful'] }]}, 
      ai: { recommendedPlatform: 'chatgpt', recommendedMode: 'DETAIL', commonTechniques: ['Multi-perspective Analysis', 'Chain-of-thought', 'Constraint Optimization'], clarifyingQuestions: [{ id: 'complexity', question: 'How complex should the response be?', options: ['Simple', 'Detailed', 'Expert'] }, { id: 'format', question: 'What format do you prefer?', options: ['Paragraph', 'Bullet points', 'Table'] }]}, 
      // other types omitted for brevity
    };
    return defaults[type] || defaults.ai;
  };

  const platforms = [
    { value: 'chatgpt', label: 'ChatGPT' }, { value: 'claude', label: 'Claude' }, { value: 'gemini', label: 'Gemini' },
    { value: 'midjourney', label: 'Midjourney' }, { value: 'dalle', label: 'DALL-E' }, { value: 'other', label: 'Other' }
  ];

  const validateInput = () => {
    const errors = {};
    if (!prompt.trim()) errors.prompt = t('errors.emptyPrompt');
    else if (prompt.trim().length < 10) errors.prompt = t('errors.promptTooShort');
    else if (prompt.trim().length > 2000) errors.prompt = t('errors.promptTooLong');
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOptimize = async (isRetry = false) => {
    setError(null);
    if (!validateInput()) return;

    if (!isRetry) {
      trackFormSubmit(false);
      trackConversion.trackGeneratorStart(generatorType, platform);
    }

    if (mode === 'DETAIL' && !isRetry && Object.keys(clarifyingAnswers).length === 0 && smartDefaults.clarifyingQuestions?.length > 0) {
      setClarifyingQuestions(smartDefaults.clarifyingQuestions);
      setShowClarifyingQuestions(true);
      return;
    }
    
    setIsLoading(true);
    startTiming('optimization_request');
    
    try {
      const optimizationData = { prompt: prompt.trim(), platform, generatorType, mode, locale, clarifyingAnswers: mode === 'DETAIL' ? clarifyingAnswers : undefined };
      const apiResult = await monitorApiCall('/api/kari/optimize', async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        const response = await fetch('/api/kari/optimize', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(optimizationData), signal: controller.signal });
        clearTimeout(timeoutId);
        if (!response.ok) throw new Error(response.status === 429 ? 'Rate limit exceeded' : response.status >= 500 ? 'Server error' : `Request failed: ${response.status}`);
        return response.json();
      }, { generatorType, platform, mode, promptLength: prompt.trim().length });
      
      const processingTime = endTiming('optimization_request');
      
      if (apiResult.success) {
        const optimizationResult = { ...apiResult.data, processingTime: processingTime || apiResult.data.processingTime };
        const resultToStore = { ...optimizationResult, originalPrompt: prompt.trim() };
        setResult(resultToStore);
        localStorage.setItem('kari-last-result', JSON.stringify(resultToStore));
        setRetryCount(0);
        setActiveTab('result');
        trackFormSubmit(true);
        trackConversion.trackOptimizationSuccess({ generatorType, platform, mode, processingTime: optimizationResult.processingTime, techniquesApplied: optimizationResult.techniquesApplied || [] });
        addToHistory({ timestamp: new Date().toISOString(), originalPrompt: prompt.trim(), optimizedPrompt: optimizationResult.optimizedPrompt, platform, mode, generatorType, clarifyingAnswers: mode === 'DETAIL' ? clarifyingAnswers : undefined, keyImprovements: optimizationResult.keyImprovements || [], techniquesApplied: optimizationResult.techniquesApplied || [], processingTime: optimizationResult.processingTime });
        toast.success(t('success.optimized'));
      } else {
        throw new Error(apiResult.error || 'Optimization failed');
      }
    } catch (err) {
      endTiming('optimization_request');
      logError(err, { action: 'optimization_request', retryCount, isRetry });
      trackFormSubmit(false, err.message);
      const errorMessage = err.name === 'AbortError' ? 'Request timed out' : err.message.includes('fetch') ? t('errors.networkError') : err.message;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => { setRetryCount(prev => prev + 1); handleOptimize(true); };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t('success.copied'));
      trackConversion.trackPromptCopy(generatorType, platform);
    } catch (err) {
      logError(err, { action: 'copy_to_clipboard' });
      toast.error('Failed to copy');
    }
  };

  const saveResult = (resultToSave = result) => {
    if (!resultToSave) return;
    try {
      const saved = { id: Date.now().toString(), timestamp: new Date().toISOString(), originalPrompt: prompt, ...resultToSave };
      if (trackConversion.trackPromptSave) trackConversion.trackPromptSave(generatorType, platform);
      const updatedSaved = [saved, ...savedResults.slice(0, 19)];
      setSavedResults(updatedSaved);
      localStorage.setItem('kari-saved-results', JSON.stringify(updatedSaved));
      toast.success(t('success.saved'));
    } catch (e) {
      console.error('Failed to save result:', e);
      toast.error(t('errors.saveFailed'));
    }
  };

  const deleteSavedResult = (id) => {
    const updatedSaved = savedResults.filter(s => s.id !== id);
    setSavedResults(updatedSaved);
    localStorage.setItem('kari-saved-results', JSON.stringify(updatedSaved));
    toast.success(t('success.deleted'));
  };

  const loadSavedResult = (savedResult) => {
    setPrompt(savedResult.originalPrompt);
    setPlatform(savedResult.platform);
    setMode(savedResult.mode);
    setResult(savedResult);
    setActiveTab('result');
    toast.success(t('success.loaded'));
  };

  const shareResult = async () => {
    if (!result) return;
    const shareData = { title: `Optimized Prompt - ${generatorType}`, text: `Original: ${prompt}\n\nOptimized: ${result.optimizedPrompt}`, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(shareData);
      else { await copyToClipboard(`${shareData.title}\n\n${shareData.text}`); toast.success(t('success.shareLink')); }
    } catch (err) { if (err.name !== 'AbortError') toast.error(t('errors.shareFailed')); }
  };

  const regeneratePrompt = () => { if (!prompt.trim()) { toast.error(t('errors.emptyPrompt')); return; } handleOptimize(false); };

  const addToHistory = (item) => {
    const updated = [item, ...optimizationHistory.slice(0, 49)];
    setOptimizationHistory(updated);
    localStorage.setItem('kari-optimization-history', JSON.stringify(updated));
  };

  const clearHistory = () => {
    setOptimizationHistory([]);
    localStorage.removeItem('kari-optimization-history');
    toast.success(t('success.historyCleared'));
  };

  const handleClarifyingSubmit = () => { setShowClarifyingQuestions(false); handleOptimize(false); };

  const skipClarifyingQuestions = () => {
    const defaultAnswers = smartDefaults.clarifyingQuestions?.reduce((acc, q) => ({ ...acc, [q.id]: q.options?.[0] }), {});
    setClarifyingAnswers(defaultAnswers || {});
    setShowClarifyingQuestions(false);
    handleOptimize(false);
  };

  const getTechniqueExplanation = (technique) => ({ 'Role Assignment': 'Assigns a specific expert role to the AI.', 'Context Layering': 'Provides multiple layers of context.' }[technique] || 'Advanced optimization technique.');

  const hasContent = result || optimizationHistory.length > 0 || savedResults.length > 0;

  return (

    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start p-4 md:p-6 my-20">
      <div className="lg:col-span-2 space-y-6 h-full">
        <Card className="">
          <CardHeader>
            <CardTitle>{t('input.title')}</CardTitle>
            <CardDescription>{t('welcome.message')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <div><Tabs value={mode} onValueChange={(v) => { setMode(v); trackFieldInteraction('mode_select', 'change'); }} id="mode-tabs"><TabsList className="grid w-full grid-cols-2"><TabsTrigger value="BASIC" disabled={isLoading}>Basic</TabsTrigger><TabsTrigger value="DETAIL" disabled={isLoading}>Detail</TabsTrigger></TabsList></Tabs></div>
              <div>
                <Select size="sm" value={platform} onValueChange={(v) => { setPlatform(v); trackFieldInteraction('platform_select', 'change'); }} disabled={isLoading}>
                <SelectTrigger id="platform-select"><SelectValue /></SelectTrigger><SelectContent>{platforms.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Textarea id="prompt-input"  placeholder={t('input.placeholder')} value={prompt} onChange={(e) => { setPrompt(e.target.value); if (validationErrors.prompt) setValidationErrors(p => ({ ...p, prompt: null })); }} onFocus={() => { trackFieldInteraction('prompt_input', 'focus'); if (!prompt) trackFormStart(); }} onBlur={() => trackFieldInteraction('prompt_input', 'blur')} className={`min-h-[180px] text-base !field-sizing-fixed ${validationErrors.prompt ? 'border-red-500' : ''}`} maxLength={2000} disabled={isLoading} aria-label={t('input.placeholder')} />
              {validationErrors.prompt && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{validationErrors.prompt}</p>}
              <div className="text-xs text-gray-500 flex justify-between">
                <span>{t('input.platform')}: {platform}</span>
                <span>{prompt.length}/2000</span>
              </div>
            </div>
            <Button onClick={() => handleOptimize(false)} disabled={!prompt.trim() || isLoading || !!validationErrors.prompt} className="w-full">{isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t('input.optimizing')}</> : <><Sparkles className="w-4 h-4 mr-2" />{t('input.optimize')}</>}</Button>
            {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription className="flex items-center justify-between"><span>{error}</span>{retryCount < 3 && <Button variant="outline" size="sm" onClick={handleRetry} disabled={isLoading} className="ml-2"><RefreshCw className="w-4 h-4 mr-1" />Retry</Button>}</AlertDescription></Alert>}
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-3">
        {isLoading ? (
          <Card><CardHeader><div className="h-8 bg-gray-200 rounded animate-pulse w-1/2"></div></CardHeader><CardContent className="space-y-4"><div className="h-24 bg-gray-200 rounded animate-pulse"></div><div className="h-16 bg-gray-200 rounded animate-pulse"></div></CardContent></Card>
        ) : hasContent ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3"><TabsTrigger value="result">{t('result.title')}</TabsTrigger><TabsTrigger value="history">{t('history.title')}{optimizationHistory.length > 0 && <Badge variant="secondary" className="ml-2">{optimizationHistory.length}</Badge>}</TabsTrigger><TabsTrigger value="saved">{t('saved.title')}{savedResults.length > 0 && <Badge variant="secondary" className="ml-2">{savedResults.length}</Badge>}</TabsTrigger></TabsList>
            <TabsContent value="result" className="mt-4 space-y-4">
              {result ? (<>
                <Card>
                  <CardHeader><CardTitle className="flex items-center justify-between">{t('result.optimizedPrompt')}<div className="flex items-center gap-2"><Button variant="outline" size="sm" onClick={regeneratePrompt} disabled={isLoading}><RotateCcw className="w-4 h-4 mr-1" />{t('result.regenerate')}</Button><Button variant="outline" size="sm" onClick={() => { setResult(null); setError(null); setPrompt(''); localStorage.removeItem('kari-last-result'); }}><RefreshCw className="w-4 h-4 mr-1" />{t('result.newPrompt')}</Button></div></CardTitle></CardHeader>
                  <CardContent>
                    <div className={"relative bg-[#282c34] text-[0.875rem] text-[#abb2bf] p-4 rounded-lg text-sm "}><Button size="icon" variant="ghost" className="absolute top-2 right-2 h-8 w-8" onClick={() => copyToClipboard(result.optimizedPrompt)}><Copy className="h-4 w-4" /></Button><pre className={"whitespace-pre-wrap " + jetBrainsMono.className}>{result.optimizedPrompt}</pre></div>
                    <div className="flex items-center gap-2 mt-4"><Button variant="secondary" size="sm" onClick={() => saveResult()}><Save className="w-4 h-4 mr-1" />{t('result.save')}</Button><Button variant="ghost" size="sm" onClick={shareResult}><Share2 className="w-4 h-4 mr-1" />{t('result.share')}</Button></div>
                  </CardContent>
                </Card>
                {result.keyImprovements?.length > 0 && <Card><CardHeader><CardTitle>{t('result.improvements')}</CardTitle></CardHeader><CardContent><ul className="space-y-3">{result.keyImprovements.map((imp, i) => <li key={i} className="flex items-start gap-3 text-sm"><CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" /><span>{imp}</span></li>)}</ul></CardContent></Card>}
                {result.techniquesApplied?.length > 0 && <Card><CardHeader><CardTitle className="flex items-center gap-2">{t('result.techniques')}</CardTitle></CardHeader><CardContent><TooltipProvider><div className="flex flex-wrap gap-2">{result.techniquesApplied.map((tech, i) => <Tooltip key={i}><TooltipTrigger asChild><Badge variant="secondary" className="cursor-help">{tech}</Badge></TooltipTrigger><TooltipContent className="max-w-xs"><p>{getTechniqueExplanation(tech)}</p></TooltipContent></Tooltip>)}</div></TooltipProvider></CardContent></Card>}
                {result.proTip && <Card className="border-yellow-300 bg-yellow-50/50"><CardHeader><CardTitle className="flex items-center gap-2 text-yellow-800"><Lightbulb className="w-5 h-5" />{t('result.proTip')}</CardTitle></CardHeader><CardContent><p className="text-yellow-900 text-sm">{result.proTip}</p></CardContent></Card>}
              </>) : (
                <div className="text-center py-12">
                  <p>{t('result.noResult')}</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="history" className="mt-4"><Card><CardHeader><CardTitle className="flex items-center justify-between">{t('history.title')}<Button variant="outline" size="sm" onClick={clearHistory} className="text-red-600 hover:text-red-700"><Trash2 className="w-4 h-4 mr-1" />{t('history.clear')}</Button></CardTitle></CardHeader><CardContent>{optimizationHistory.length > 0 ? <div className="space-y-3 max-h-[60vh] overflow-y-auto">{optimizationHistory.map(item => <div key={item.timestamp} className="border rounded-lg p-3 text-sm"><div className="flex items-center justify-between"><div className={"text-xs text-gray-500"}>{new Date(item.timestamp).toLocaleString()} &bull; {item.platform} &bull; {item.mode}</div><div className="flex gap-1"><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setPrompt(item.originalPrompt); setPlatform(item.platform); setMode(item.mode); if(item.clarifyingAnswers) setClarifyingAnswers(item.clarifyingAnswers); setResult({ optimizedPrompt: item.optimizedPrompt, keyImprovements: item.keyImprovements, techniquesApplied: item.techniquesApplied }); setActiveTab('result'); toast.success(t('success.loaded'));}}><RefreshCw className="w-4 h-4" /></Button><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(item.optimizedPrompt)}><Copy className="w-4 h-4" /></Button></div></div><p className="font-semibold mt-2 truncate">{item.originalPrompt}</p></div>)}</div> : <div className="text-center py-12"><History className="mx-auto h-12 w-12 text-gray-400" /><h3 className="mt-2 text-sm font-medium text-gray-900">{t('history.empty')}</h3><p className="mt-1 text-sm text-gray-500">Your past optimizations will appear here.</p></div>}</CardContent></Card></TabsContent>
            <TabsContent value="saved" className="mt-4"><Card><CardHeader><CardTitle>{t('saved.title')}</CardTitle></CardHeader><CardContent>{savedResults.length > 0 ? <div className="space-y-3 max-h-[60vh] overflow-y-auto">{savedResults.map(saved => <div key={saved.id} className="border rounded-lg p-3 text-sm"><div className="flex items-center justify-between"><div className="font-mono text-xs text-gray-500">{new Date(saved.timestamp).toLocaleString()} &bull; {saved.platform} &bull; {saved.mode}</div><div className="flex gap-1"><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => loadSavedResult(saved)}><RefreshCw className="w-4 h-4" /></Button><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(saved.optimizedPrompt)}><Copy className="w-4 h-4" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700" onClick={() => deleteSavedResult(saved.id)}><Trash2 className="w-4 h-4" /></Button></div></div><p className="font-semibold mt-2 truncate">{saved.originalPrompt}</p></div>)}</div> : <div className="text-center py-12"><Save className="mx-auto h-12 w-12 text-gray-400" /><h3 className="mt-2 text-sm font-medium text-gray-900">{t('saved.empty')}</h3><p className="mt-1 text-sm text-gray-500">Save your favorite results to find them here.</p></div>}</CardContent></Card></TabsContent>
          </Tabs>
        ) : (
          <Card className="flex flex-col items-center justify-center text-center p-12 h-full min-h-[60vh] border-dashed">
            <Sparkles className="h-16 w-16 text-gray-300" />
            <CardTitle className="mt-4">Your Optimized Prompt Awaits</CardTitle>
            <CardDescription className="mt-2 max-w-xs mx-auto">Enter a prompt on the left, choose your target platform and mode, and let Kari work its magic!</CardDescription>
          </Card>
        )}
      </div>

      <Dialog open={showClarifyingQuestions} onOpenChange={setShowClarifyingQuestions}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-purple-600" />{t('clarifying.title')}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">{t('clarifying.description')}</p>
            {clarifyingQuestions.map((q) => (
              <div key={q.id} className="space-y-2"><label className="text-sm font-medium">{q.question}</label><Select value={clarifyingAnswers[q.id] || ''} onValueChange={(v) => setClarifyingAnswers(p => ({ ...p, [q.id]: v }))}><SelectTrigger><SelectValue placeholder={t('clarifying.selectOption')} /></SelectTrigger><SelectContent>{q.options?.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></div>
            ))}
            <div className="flex gap-2 pt-4"><Button onClick={handleClarifyingSubmit} className="flex-1"><Sparkles className="w-4 h-4 mr-2" />{t('clarifying.optimize')}</Button><Button variant="outline" onClick={skipClarifyingQuestions} className="flex-1"><Zap className="w-4 h-4 mr-2" />{t('clarifying.useDefaults')}</Button></div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}