import { NextResponse } from 'next/server';
import { generateContentWithConfig } from '@/lib/gemini';
import { performanceMonitor, errorMonitor } from '@/lib/monitoring';

// Kari系统提示词
const KARI_SYSTEM_PROMPT = `You are Kari, a master-level AI prompt optimization specialist. Your mission: transform any user input into precision-crafted prompts that unlock AI's full potential across all platforms.

## THE 4-D METHODOLOGY
### 1. DECONSTRUCT
- Extract core intent, key entities, and context
- Identify output requirements and constraints
- Map what's provided vs. what's missing

### 2. DIAGNOSE
- Audit for clarity gaps and ambiguity
- Check specificity and completeness
- Assess structure and complexity needs

### 3. DEVELOP
- Select optimal techniques based on request type:
- **Creative** → Multi-perspective + tone emphasis
- **Technical** → Constraint-based + precision focus
- **Educational** → Few-shot examples + clear structure
- **Complex** → Chain-of-thought + systematic frameworks
- Assign appropriate AI role/expertise
- Enhance context and implement logical structure

### 4. DELIVER
- Construct optimized prompt
- Format based on complexity
- Provide implementation guidance

## OPTIMIZATION TECHNIQUES
**Foundation:** Role assignment, context layering, output specs, task decomposition
**Advanced:** Chain-of-thought, few-shot learning, multi-perspective analysis, constraint optimization

## PLATFORM NOTES:
- **ChatGPT/GPT-4:** Structured sections, conversation starters
- **Claude:** Longer context, reasoning frameworks
- **Gemini:** Creative tasks, comparative analysis
- **Others:** Apply universal best practices

## RESPONSE FORMATS
**Simple Requests:**
\`\`\`
**Your Optimized Prompt:**
[Improved prompt]

**What Changed:** [Key improvements]
\`\`\`

**Complex Requests:**
\`\`\`
**Your Optimized Prompt:**
[Improved prompt]

**Key Improvements:**
• [Primary changes and benefits]

**Techniques Applied:** [Brief mention]

**Pro Tip:** [Usage guidance]
\`\`\``;

export async function POST(request) {
  const startTime = Date.now();
  
  try {
    // Parse request body with error handling
    let requestData;
    try {
      requestData = await request.json();
    } catch (parseError) {
      errorMonitor.logError(parseError, {
        component: 'kari_api',
        action: 'parse_request_body',
        endpoint: '/api/kari/optimize'
      });
      
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { prompt, platform, generatorType, mode, locale, clarifyingAnswers } = requestData;

    // Enhanced input validation
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Prompt is required and must be a string' },
        { status: 400 }
      );
    }

    if (prompt.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'Prompt must be at least 10 characters long' },
        { status: 400 }
      );
    }

    if (prompt.trim().length > 2000) {
      return NextResponse.json(
        { success: false, error: 'Prompt must be less than 2000 characters' },
        { status: 400 }
      );
    }

    if (!platform || !generatorType) {
      return NextResponse.json(
        { success: false, error: 'Platform and generator type are required' },
        { status: 400 }
      );
    }

    const validPlatforms = ['chatgpt', 'claude', 'gemini', 'midjourney', 'dalle', 'other'];
    const validGeneratorTypes = ['writing', 'art', 'ai', 'chatgpt', 'midjourney', 'drawing', 'ai-video'];
    const validModes = ['BASIC', 'DETAIL'];

    if (!validPlatforms.includes(platform)) {
      return NextResponse.json(
        { success: false, error: 'Invalid platform specified' },
        { status: 400 }
      );
    }

    if (!validGeneratorTypes.includes(generatorType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid generator type specified' },
        { status: 400 }
      );
    }

    if (mode && !validModes.includes(mode)) {
      return NextResponse.json(
        { success: false, error: 'Invalid mode specified' },
        { status: 400 }
      );
    }

    // 构建用户请求
    let userRequest = `${mode} using ${platform} — ${prompt}

Generator Type: ${generatorType}
Language: ${locale}`;

    // Add clarifying answers if provided (DETAIL mode)
    if (clarifyingAnswers && Object.keys(clarifyingAnswers).length > 0) {
      userRequest += '\n\nAdditional Context:';
      Object.entries(clarifyingAnswers).forEach(([key, value]) => {
        userRequest += `\n- ${key}: ${value}`;
      });
    }

    // 调用Gemini API进行实际优化
    const geminiStartTime = Date.now();
    const fullPrompt = `${KARI_SYSTEM_PROMPT}

User Request: ${userRequest}`;

    let geminiResponse;
    try {
      geminiResponse = await generateContentWithConfig(fullPrompt, {
        temperature: 0.7,
        maxOutputTokens: 2048,
        topP: 0.8,
        topK: 40
      });
      
      // Track successful Gemini API call
      const geminiResponseTime = Date.now() - geminiStartTime;
      console.log(`✅ Gemini API success: ${geminiResponseTime}ms`);
      
    } catch (geminiError) {
      const geminiResponseTime = Date.now() - geminiStartTime;
      
      // Log Gemini API error with monitoring
      errorMonitor.logError(geminiError, {
        component: 'kari_api',
        action: 'gemini_api_call',
        endpoint: '/api/kari/optimize',
        platform,
        generatorType,
        mode,
        promptLength: prompt.trim().length,
        responseTime: geminiResponseTime
      });
      
      console.error(`❌ Gemini API error: ${geminiResponseTime}ms`, geminiError);
      
      // Handle specific Gemini API errors
      if (geminiError.message?.includes('quota')) {
        return NextResponse.json(
          { success: false, error: 'API quota exceeded. Please try again later.' },
          { status: 429 }
        );
      } else if (geminiError.message?.includes('timeout')) {
        return NextResponse.json(
          { success: false, error: 'Request timed out. Please try again.' },
          { status: 408 }
        );
      } else {
        return NextResponse.json(
          { success: false, error: 'AI service temporarily unavailable. Please try again.' },
          { status: 503 }
        );
      }
    }

    const processingTime = Date.now() - startTime;

    // 解析Gemini响应
    const result = parseKariResponse(geminiResponse, processingTime / 1000);

    // Log successful optimization
    console.log(`✅ Kari optimization success: ${processingTime}ms`, {
      platform,
      generatorType,
      mode,
      promptLength: prompt.trim().length,
      responseLength: result.optimizedPrompt?.length || 0,
      techniquesCount: result.techniquesApplied?.length || 0
    });

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    
    // Log error with monitoring
    errorMonitor.logError(error, {
      component: 'kari_api',
      action: 'optimization_request',
      endpoint: '/api/kari/optimize',
      platform: requestData?.platform,
      generatorType: requestData?.generatorType,
      mode: requestData?.mode,
      locale: requestData?.locale,
      promptLength: requestData?.prompt?.length,
      processingTime
    });
    
    console.error(`❌ Kari optimization error: ${processingTime}ms`, error);
    
    // Return appropriate error response
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    } else if (error.name === 'TimeoutError') {
      return NextResponse.json(
        { success: false, error: 'Request timed out. Please try again.' },
        { status: 408 }
      );
    } else {
      return NextResponse.json(
        { success: false, error: 'Internal server error. Please try again later.' },
        { status: 500 }
      );
    }
  }
}

// 解析Kari响应格式
function parseKariResponse(geminiResponse, processingTime) {
  try {
    // 提取优化后的提示词
    const optimizedPromptMatch = geminiResponse.match(/\*\*Your Optimized Prompt:\*\*\s*([\s\S]*?)(?=\*\*|$)/);
    const optimizedPrompt = optimizedPromptMatch ? optimizedPromptMatch[1].trim() : geminiResponse;

    // 提取关键改进
    const improvementsMatch = geminiResponse.match(/\*\*(?:Key Improvements|What Changed):\*\*\s*([\s\S]*?)(?=\*\*|$)/);
    let keyImprovements = [];
    if (improvementsMatch) {
      keyImprovements = improvementsMatch[1]
        .split(/[•\-\n]/)
        .map(item => item.trim())
        .filter(item => item.length > 0);
    }

    // 提取应用的技术
    const techniquesMatch = geminiResponse.match(/\*\*Techniques Applied:\*\*\s*([\s\S]*?)(?=\*\*|$)/);
    let techniquesApplied = [];
    if (techniquesMatch) {
      techniquesApplied = techniquesMatch[1]
        .split(/[,\n]/)
        .map(item => item.trim())
        .filter(item => item.length > 0);
    }

    // 提取专业提示
    const proTipMatch = geminiResponse.match(/\*\*Pro Tip:\*\*\s*([\s\S]*?)(?=\*\*|$)/);
    const proTip = proTipMatch ? proTipMatch[1].trim() : undefined;

    return {
      optimizedPrompt,
      keyImprovements: keyImprovements.length > 0 ? keyImprovements : [
        'Enhanced clarity and specificity',
        'Improved structure and organization',
        'Added context and guidance'
      ],
      techniquesApplied: techniquesApplied.length > 0 ? techniquesApplied : [
        'Role Assignment',
        'Context Enhancement',
        'Output Specification'
      ],
      proTip,
      processingTime
    };
  } catch (error) {
    console.error('Error parsing Kari response:', error);
    // 返回基本格式的响应
    return {
      optimizedPrompt: geminiResponse,
      keyImprovements: ['AI-powered optimization applied'],
      techniquesApplied: ['Kari 4-D Methodology'],
      processingTime
    };
  }
}