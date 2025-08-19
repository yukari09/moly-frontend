import { NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { getTranslations } from 'next-intl/server';
import { optimizePrompt } from '@/lib/ectro'

// Safe logging helper to handle missing logger methods
 

export async function POST(request) {
    
  const t = await getTranslations('PromptGenerator');
  const body = await request.json();
  const { userPrompt, targetAI, promptStyle } = body;
  
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

  console.log(responst)
  
  return NextResponse.json({message: responst});
}
