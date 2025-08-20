import { NextResponse } from 'next/server';
import { getTranslations } from 'next-intl/server';
import { optimizePrompt } from '@/lib/ectro';
import { getClientRealIp } from "@/lib/request";
import { optimizerRateLimiter } from '@/lib/ratelimiter';

// Safe logging helper to handle missing logger methods
 
export async function POST(request) {

  const ip = getClientRealIp(request);
  const t = await getTranslations('PromptGenerator');

  const { success } = await optimizerRateLimiter.limit(ip); 
  if (!success) {
      return NextResponse.json(
          { error: t("tooManyRequest")},
          { status: 429 }
      );
  }

  const body = await request.json();
  let { userPrompt, targetAI, promptStyle } = body;
  
  // Validate required fields
  if (!userPrompt || typeof userPrompt !== 'string' || userPrompt.trim() === '') {
      return NextResponse.json(
          { error: t("requireProvidePrompt")},
          { status: 400 }
      );
  }
  
  if (!targetAI || typeof targetAI !== 'string') {
      return NextResponse.json(
        { error: t("requireUserSelectAiTarget")},
          { status: 400 }
      );
  }
  
  if (!promptStyle || typeof promptStyle !== 'string' || !['Basic', 'Detail'].includes(promptStyle)) {
    promptStyle = "Basic"
  }

  const responst = await optimizePrompt(userPrompt, targetAI, promptStyle)
  return NextResponse.json({message: responst});
}
