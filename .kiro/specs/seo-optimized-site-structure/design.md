# Design Document

## Overview

基于现有的Next.js项目基础，我们将扩展为一个多语言的AI提示生成器平台，集成Kari AI优化系统。项目已有完整的shadcn/ui组件库、next-intl国际化支持和基础架构，现在需要添加提示生成器功能和SEO优化。

## Architecture

## 现有项目基础

### 技术栈
- **框架**: Next.js 15.4.5 with App Router
- **UI组件**: shadcn/ui + Radix UI + Tailwind CSS
- **国际化**: next-intl (当前支持 en, ko)
- **认证**: NextAuth.js
- **数据库**: Elasticsearch + Redis
- **部署**: 支持Cloudflare Workers

### 现有功能
- 用户认证系统 (登录/注册/密码重置)
- 多语言支持 (英语/韩语)
- 响应式UI组件库
- 邮件系统
- 速率限制
- 用户账户管理

## Kari AI系统集成策略

基于现有架构，集成Kari AI提示优化系统：

1. **Kari核心引擎**: 
   - 使用Google Gemini 2.5 Flash Lite作为AI后端
   - 集成完整的4-D方法论系统提示词
   - API端点: `/api/kari/optimize`
   
2. **4-D方法论实现**: 
   - **DECONSTRUCT**: 提取核心意图和上下文
   - **DIAGNOSE**: 识别清晰度和完整性问题
   - **DEVELOP**: 选择优化技术和AI角色
   - **DELIVER**: 构建优化提示和指导

3. **多模式支持**:
   - **BASIC模式**: 快速优化，核心技术应用
   - **DETAIL模式**: 深度优化，包含澄清问题

4. **平台特化**:
   - ChatGPT/GPT-4: 结构化对话
   - Claude: 长上下文推理
   - Gemini: 创意任务
   - Midjourney/DALL-E: 图像生成
   - 其他平台: 通用最佳实践

### 网站结构层级

```
主域名/
├── / (语言检测页面，重定向到用户首选语言版本)
└── /[locale]/ (en, zh, ja, ko, fr, es, pt, de)
    ├── / (本地化主页 - "prompt generator" + Kari核心展示)
    ├── /writing-prompt-generator (写作提示生成器 + Kari写作优化)
    ├── /art-prompt-generator (艺术提示生成器 + Kari视觉优化) 
    ├── /ai-prompt-generator (AI提示生成器 + Kari通用优化)
    ├── /chatgpt-prompt-generator (ChatGPT提示生成器 + Kari ChatGPT特化)
    ├── /midjourney-prompt-generator (Midjourney提示生成器 + Kari图像生成特化)
    ├── /drawing-prompt-generator (绘画提示生成器 + Kari创意激发)
    ├── /ai-video-prompt-generator (AI视频提示生成器 + Kari视频优化)
    └── /kari-ai (Kari AI专门介绍页面)

全局页面（不需要本地化）:
├── /privacy (隐私政策)
├── /terms (服务条款)
├── /contact (联系我们)
└── /api/ (API端点)
```

## 扩展计划

### 新增功能
1. **提示生成器页面** (7个核心生成器)
2. **Kari AI优化组件** (KariOptimizer.js)
3. **多语言扩展** (增加6种新语言)
4. **SEO优化** (元数据、结构化数据、sitemap)
5. **API端点** (Kari优化、生成器配置)

### 技术架构更新
- **AI集成**: Google Gemini 2.5 Flash Lite API
- **新组件**: KariOptimizer, GeneratorCard, SEO组件
- **API扩展**: `/api/kari/optimize`, `/api/generators/[type]`
- **国际化**: 扩展到8种语言 (en, ko, zh, ja, fr, es, pt, de)
- **SEO工具**: next-sitemap, 结构化数据, meta标签优化

## 实现状态

### ✅ 已完成
1. **多语言路由扩展** - 从2种语言扩展到8种
2. **主页更新** - 展示提示生成器而非网站画廊
3. **KariOptimizer组件** - 完整的UI组件和交互逻辑
4. **Kari API端点** - `/api/kari/optimize` 包含完整系统提示词
5. **第一个生成器页面** - 写作提示生成器

### 🔄 进行中
1. **其他生成器页面** - art, chatgpt, midjourney等
2. **Gemini API集成** - 替换模拟数据
3. **国际化翻译** - 为新语言添加翻译文件
4. **SEO优化** - 元数据和结构化数据

### 📋 待完成
1. **缺失UI组件** - Textarea, Badge, Card等
2. **用户体验优化** - 加载状态、错误处理、通知
3. **性能优化** - 代码分割、图像优化
4. **测试** - 单元测试、集成测试
5. **部署配置** - 环境变量、Docker配置

## Kari系统架构

```typescript
// API请求接口
interface KariGeneratorRequest {
  prompt: string
  platform: 'chatgpt' | 'claude' | 'gemini' | 'midjourney' | 'dalle' | 'stable-diffusion' | 'runway' | 'pika' | 'other'
  generatorType: 'writing' | 'art' | 'ai' | 'chatgpt' | 'midjourney' | 'drawing' | 'ai-video'
  locale: 'en' | 'zh' | 'ja' | 'ko' | 'fr' | 'es' | 'pt' | 'de'
  mode: 'DETAIL' | 'BASIC'
  options?: GeneratorSpecificOptions
}

// Gemini API集成
interface GeminiPromptRequest {
  systemPrompt: string  // Kari系统提示词
  userPrompt: string    // 构建的用户请求
  model: 'gemini-2.5-flash-lite'
  generationConfig: {
    temperature: number
    maxOutputTokens: number
    topP: number
    topK: number
  }
}

// Kari的4-D方法论核心实现
interface Kari4DMethodology {
  // DECONSTRUCT: 提取核心意图、关键实体和上下文
  deconstruct: (prompt: string, type: GeneratorType, locale: string) => {
    coreIntent: string
    keyEntities: string[]
    context: string
    outputRequirements: string[]
    constraints: string[]
    missingElements: string[]
  }
  
  // DIAGNOSE: 审核清晰度差距和模糊性
  diagnose: (deconstruction: DeconstructionResult, type: GeneratorType, locale: string) => {
    clarityGaps: string[]
    ambiguityIssues: string[]
    specificityLevel: 'low' | 'medium' | 'high'
    completenessScore: number
    structureNeeds: string[]
    complexityAssessment: 'simple' | 'moderate' | 'complex'
  }
  
  // DEVELOP: 选择最优技术并分配AI角色
  develop: (deconstruction: DeconstructionResult, diagnosis: DiagnosisResult, type: GeneratorType, locale: string) => {
    selectedTechniques: OptimizationTechnique[]
    aiRole: string
    enhancedContext: string
    logicalStructure: PromptStructure
    platformSpecificAdjustments: PlatformAdjustment[]
  }
  
  // DELIVER: 构建优化提示并提供实施指导
  deliver: (development: DevelopmentResult, platform: Platform, locale: string) => {
    optimizedPrompt: string
    formatType: 'simple' | 'complex'
    implementationGuidance: string
    keyImprovements: string[]
    techniquesApplied: string[]
    proTip?: string
  }
}

// 优化技术枚举
interface OptimizationTechnique {
  type: 'role-assignment' | 'context-layering' | 'output-specs' | 'task-decomposition' | 
        'chain-of-thought' | 'few-shot-learning' | 'multi-perspective' | 'constraint-optimization'
  category: 'foundation' | 'advanced'
  applicableTypes: GeneratorType[]
  platforms: Platform[]
}

// 多语言SEO优化策略
interface MultiLanguageSEOStrategy {
  locale: string
  primaryKeywords: LocalizedKeyword[]
  contentStrategy: LocalizedContentStrategy
  hreflangTags: HreflangTag[]
  localizedStructuredData: StructuredData
}
```

## 实际项目结构

### 当前目录结构
```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.js (已存在)
│   │   ├── page.js (已更新 - 展示生成器)
│   │   ├── writing-prompt-generator/
│   │   │   └── page.js (✅ 已创建)
│   │   ├── auth/ (已存在 - 认证相关)
│   │   ├── account/ (已存在 - 用户账户)
│   │   └── ... (其他现有页面)
│   └── api/
│       ├── kari/
│       │   └── optimize/
│       │       └── route.js (✅ 已创建)
│       └── ... (其他现有API)
├── components/
│   ├── ui/ (已存在 - shadcn/ui组件)
│   ├── generators/
│   │   └── KariOptimizer.js (✅ 已创建)
│   ├── Header.js (已存在)
│   ├── Footer.js (已存在)
│   └── SiteCard.js (已存在 - 复用为GeneratorCard)
├── i18n/ (已存在)
│   ├── routing.js (✅ 已更新 - 8种语言)
│   └── ... (需要添加新语言翻译)
└── lib/ (已存在 - 工具函数)
```

### 需要创建的页面
```
src/app/[locale]/
├── art-prompt-generator/page.js
├── ai-prompt-generator/page.js  
├── chatgpt-prompt-generator/page.js
├── midjourney-prompt-generator/page.js
├── drawing-prompt-generator/page.js
├── ai-video-prompt-generator/page.js
└── kari-ai/page.js
```

## 组件接口定义

### 已实现的组件
```typescript
// 通用页面模板
interface GeneratorPageProps {
  type: 'writing' | 'art' | 'ai' | 'chatgpt' | 'midjourney' | 'drawing' | 'ai-video'
  seoData: SEOMetadata
  locale: string
}

// SEO元数据接口
interface SEOMetadata {
  title: string
  description: string
  keywords: string[]
  difficulty: 'Easy' | 'Medium' | 'Hard'
  searchVolume: '>10000' | '>1000' | '>100' | '<100'
  structuredData: StructuredData
}
```

#### 1. KariOptimizer组件 (已实现)
```typescript
// KariOptimizer - 已实现的核心组件
interface KariOptimizerProps {
  generatorType: 'writing' | 'art' | 'ai' | 'chatgpt' | 'midjourney' | 'drawing' | 'ai-video'
  defaultMode?: 'DETAIL' | 'BASIC'
}

// 实际实现特点:
// - 使用shadcn/ui组件 (Button, Textarea, Select, Card等)
// - 集成next-intl翻译
// - 状态管理使用React hooks
// - API调用 /api/kari/optimize

// Kari欢迎消息组件
interface KariWelcomeProps {
  onModeSelect: (mode: 'DETAIL' | 'BASIC', platform: Platform) => void
  supportedPlatforms: Platform[]
  locale: string
}

// Kari结果显示组件
interface KariResultProps {
  result: OptimizedPromptResult
  onCopy: () => void
  onSave: () => void
  onRegenerate: () => void
  showTechniques?: boolean
}

// 优化结果接口
interface OptimizedPromptResult {
  originalPrompt: string
  optimizedPrompt: string
  keyImprovements: string[]
  techniquesApplied: OptimizationTechnique[]
  proTip?: string
  platform: Platform
  complexity: 'simple' | 'complex'
  processingTime: number
}
```

#### 3. 生成器组件
```typescript
// Promptify增强的生成器接口
interface PromptifyPromptGenerator {
  type: GeneratorType
  config: PromptifyGeneratorConfig
  generate: (input: PromptifyGeneratorInput) => Promise<PromptifyGeneratorOutput>
  optimize: (prompt: string, mode: 'DETAIL' | 'BASIC') => Promise<OptimizedPromptResult>
}

// Promptify平台特定配置
interface PromptifyGeneratorConfig {
  platform?: Platform
  parameters: PlatformParameters
  templates: PromptifyPromptTemplate[]
  optimizationTechniques: OptimizationTechnique[]
  supportedModes: ('DETAIL' | 'BASIC')[]
}

// Promptify提示模板
interface PromptifyPromptTemplate {
  id: string
  name: string
  category: 'creative' | 'technical' | 'educational' | 'complex'
  platform: Platform
  template: string
  variables: TemplateVariable[]
  optimizationHints: string[]
}

// Promptify生成器输入
interface PromptifyGeneratorInput {
  prompt: string
  platform: Platform
  mode: 'DETAIL' | 'BASIC'
  clarifyingAnswers?: Record<string, string>
  userPreferences?: UserPreferences
}

// Promptify生成器输出
interface PromptifyGeneratorOutput {
  optimizedPrompt: string
  originalPrompt: string
  improvements: PromptImprovement[]
  techniques: OptimizationTechnique[]
  suggestions: string[]
  proTip?: string
  confidence: number
}
```

#### 3. SEO优化组件
```typescript
// 结构化数据组件
interface StructuredDataProps {
  type: 'WebApplication' | 'SoftwareApplication'
  name: string
  description: string
  category: string
  operatingSystem: string
  applicationCategory: string
}

// 面包屑导航
interface BreadcrumbProps {
  items: BreadcrumbItem[]
  locale: string
}
```

### 页面特定设计

#### 1. 主页 (/) - "prompt generator"
- **目标关键词**: prompt generator (Hard, >10,000)
- **设计策略**: 综合导航中心，展示所有子类别
- **内容结构**:
  - Hero区域：主要价值主张
  - 分类网格：9个主要生成器类型
  - 特色功能：最受欢迎的工具预览
  - 用户评价：社会证明
  - FAQ：常见问题解答

#### 2. 写作提示生成器 (/writing-prompt-generator)
- **目标关键词**: writing prompt generator (Hard, >10,000)
- **设计策略**: 专业写作工具，丰富的内容和功能
- **特殊功能**:
  - 类型选择：小说、诗歌、剧本、博客等
  - 难度级别：初学者到专业作家
  - 主题标签：科幻、爱情、悬疑等
  - 长度控制：短篇、中篇、长篇

#### 3. 艺术提示生成器 (/art-prompt-generator)
- **目标关键词**: art prompt generator (Easy, >1000)
- **设计策略**: 视觉导向，易于使用
- **特殊功能**:
  - 艺术风格选择器
  - 颜色调色板
  - 构图建议
  - 艺术家风格模仿

#### 4. ChatGPT提示生成器 (/chatgpt-prompt-generator)
- **目标关键词**: chatgpt prompt generator (Medium, >1000)
- **设计策略**: 针对ChatGPT优化的专业工具
- **特殊功能**:
  - 角色设定模板
  - 对话上下文构建
  - 输出格式指定
  - 温度和创造性参数

#### 5. 绘画提示生成器 (/drawing-prompt-generator)
- **目标关键词**: drawing prompt generator (Easy, >100)
- **设计策略**: 创意激发导向，适合艺术学习者
- **特殊功能**:
  - 绘画技法选择器
  - 主题和情绪标签
  - 难度级别设置
  - 参考图片建议

#### 6. AI视频提示生成器 (/ai-video-prompt-generator)
- **目标关键词**: ai video prompt generator (Medium, >1000)
- **设计策略**: 视频创作专业工具
- **特殊功能**:
  - 视频风格选择
  - 场景描述构建器
  - 时长和节奏控制
  - 平台特定优化（Runway、Pika等）

## Data Models

### 1. Promptify生成器配置模型
```typescript
interface PromptifyGeneratorConfig {
  id: string
  name: string
  type: GeneratorType
  seoData: {
    primaryKeyword: string
    secondaryKeywords: string[]
    difficulty: KeywordDifficulty
    searchVolume: SearchVolume
    contentLength: number // 基于竞争度的推荐内容长度
  }
  promptifySettings: {
    defaultMode: 'DETAIL' | 'BASIC'
    supportedTechniques: OptimizationTechnique[]
    clarifyingQuestions: ClarifyingQuestion[]
    platformSpecializations: PlatformSpecialization[]
  }
  features: GeneratorFeature[]
  templates: PromptifyPromptTemplate[]
  platforms: SupportedPlatform[]
}

// Promptify澄清问题模型
interface ClarifyingQuestion {
  id: string
  question: string
  category: 'context' | 'output' | 'style' | 'constraints'
  applicableTypes: GeneratorType[]
  required: boolean
  options?: string[]
}

// 平台专业化配置
interface PlatformSpecialization {
  platform: Platform
  techniques: OptimizationTechnique[]
  formatRules: FormatRule[]
  bestPractices: string[]
  limitations: string[]
}
```

### 2. SEO数据模型
```typescript
interface SEOData {
  keyword: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  searchVolume: '>10000' | '>1000' | '>100' | '<100'
  lastUpdated: string
  relatedKeywords: RelatedKeyword[]
  contentStrategy: ContentStrategy
}

interface ContentStrategy {
  minWordCount: number
  requiredSections: string[]
  internalLinks: InternalLink[]
  externalLinks: ExternalLink[]
}
```

### 3. Promptify用户交互模型
```typescript
interface PromptifyUserSession {
  id: string
  locale: string
  preferences: PromptifyUserPreferences
  history: PromptifyGenerationHistory[]
  favorites: PromptifySavedPrompt[]
  learningProfile: PromptifyLearningProfile
}

interface PromptifyUserPreferences {
  defaultMode: 'DETAIL' | 'BASIC'
  preferredPlatforms: Platform[]
  optimizationLevel: 'conservative' | 'moderate' | 'aggressive'
  showTechniques: boolean
  autoSave: boolean
  language: string
}

interface PromptifyGenerationHistory {
  timestamp: Date
  generatorType: GeneratorType
  originalPrompt: string
  optimizedPrompt: string
  platform: Platform
  mode: 'DETAIL' | 'BASIC'
  techniques: OptimizationTechnique[]
  userRating?: number
  improvements: PromptImprovement[]
}

interface PromptifySavedPrompt {
  id: string
  name: string
  originalPrompt: string
  optimizedPrompt: string
  platform: Platform
  generatorType: GeneratorType
  tags: string[]
  createdAt: Date
  lastUsed: Date
  useCount: number
}

// Promptify学习档案 - 用于个性化优化
interface PromptifyLearningProfile {
  userId: string
  preferredTechniques: OptimizationTechnique[]
  successfulPatterns: PromptPattern[]
  commonMistakes: string[]
  improvementAreas: string[]
  expertiseLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
}
```

## 实际API实现

### Kari优化API (已实现)

```javascript
// 实际API端点: /api/kari/optimize
// 请求格式:
{
  prompt: string,
  platform: 'chatgpt' | 'claude' | 'gemini' | 'midjourney' | 'dalle' | 'other',
  generatorType: 'writing' | 'art' | 'ai' | 'chatgpt' | 'midjourney' | 'drawing' | 'ai-video',
  mode: 'DETAIL' | 'BASIC',
  locale: string
}

// 响应格式:
{
  success: boolean,
  data: {
    optimizedPrompt: string,
    keyImprovements: string[],
    techniquesApplied: string[],
    proTip?: string,
    processingTime: number
  }
}

// 当前状态: 使用模拟数据，需要集成真实Gemini API
class KariProcessor {
  // 构建发送给Gemini的完整prompt
  async buildGeminiPrompt(userRequest: PromptifyGeneratorRequest): Promise<string> {
    const KariSystemPrompt = this.getKariSystemPrompt()
    const userPrompt = this.formatUserRequest(userRequest)
    return `${KariSystemPrompt}\n\nUser Request: ${userPrompt}`
  }

  // 调用Gemini API
  async callGeminiAPI(fullPrompt: string): Promise<GeminiResponse> {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: fullPrompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
          topP: 0.8,
          topK: 40
        }
      })
    })
    return response.json()
  }

  // DETAIL模式处理流程
  async processDetailMode(input: KariGeneratorInput): Promise<KariGeneratorOutput> {
    // 1. 收集上下文和智能默认值
    const context = await this.gatherContext(input)
    
    // 2. 询问2-3个针对性澄清问题
    const clarifyingQuestions = await this.generateClarifyingQuestions(input, context)
    
    // 3. 等待用户回答或使用智能默认值
    const answers = input.clarifyingAnswers || await this.getSmartDefaults(clarifyingQuestions)
    
    // 4. 执行4-D方法论
    return await this.execute4DMethodology(input, context, answers)
  }

  // BASIC模式处理流程
  async processBasicMode(input: KariGeneratorInput): Promise<KariGeneratorOutput> {
    // 1. 快速修复主要问题
    const quickFixes = await this.identifyQuickFixes(input.prompt, input.platform)
    
    // 2. 应用核心技术
    const coreTechniques = await this.selectCoreTechniques(input.generatorType, input.platform)
    
    // 3. 交付即用提示
    return await this.deliverReadyPrompt(input, quickFixes, coreTechniques)
  }

  // 4-D方法论执行
  async execute4DMethodology(
    input: KariGeneratorInput, 
    context: ContextData, 
    answers: Record<string, string>
  ): Promise<KariGeneratorOutput> {
    // DECONSTRUCT
    const deconstruction = await this.deconstruct(input.prompt, input.generatorType, input.locale)
    
    // DIAGNOSE
    const diagnosis = await this.diagnose(deconstruction, input.generatorType, input.locale)
    
    // DEVELOP
    const development = await this.develop(deconstruction, diagnosis, input.generatorType, input.locale, answers)
    
    // DELIVER
    return await this.deliver(development, input.platform, input.locale)
  }
}

// 复杂性分析器
interface ComplexityAnalysis {
  score: number // 0-1
  factors: ComplexityFactor[]
  reasoning: string
  recommendedMode: 'DETAIL' | 'BASIC'
}

interface ComplexityFactor {
  name: string
  weight: number
  score: number
  description: string
}
```

### 2. Promptify响应格式系统

```typescript
// 简单请求响应格式
interface SimpleResponse {
  optimizedPrompt: string
  keyChanges: string[]
  format: 'simple'
}

// 复杂请求响应格式
interface ComplexResponse {
  optimizedPrompt: string
  keyImprovements: PromptImprovement[]
  techniquesApplied: OptimizationTechnique[]
  proTip: string
  format: 'complex'
  confidence: number
  alternativeVersions?: string[]
}

// 提示改进详情
interface PromptImprovement {
  category: 'clarity' | 'specificity' | 'structure' | 'context' | 'output-format'
  before: string
  after: string
  reasoning: string
  impact: 'low' | 'medium' | 'high'
}
```

### 3. Promptify欢迎消息系统

```typescript
// Promptify欢迎消息配置
interface PromptifyWelcomeConfig {
  message: string
  examples: WelcomeExample[]
  supportedPlatforms: Platform[]
  modeDescriptions: ModeDescription[]
  locale: string
}

interface WelcomeExample {
  mode: 'DETAIL' | 'BASIC'
  platform: Platform
  example: string
  description: string
}

interface ModeDescription {
  mode: 'DETAIL' | 'BASIC'
  description: string
  whenToUse: string
  expectedTime: string
}
```

## Error Handling

### 1. Promptify生成器错误处理
- **输入验证错误**: Promptify提供智能错误分析和具体修正建议
- **4-D方法论执行错误**: 每个阶段的错误都有特定的恢复策略
- **平台特定错误**: 针对不同AI平台的错误提供专门的解决方案
- **模式切换错误**: DETAIL/BASIC模式间的智能降级机制
- **API限制错误**: 实施优雅降级和重试机制，保持Promptify核心功能
- **网络错误**: 离线模式下的基础优化功能和缓存策略

```typescript
// Promptify错误处理系统
interface PromptifyErrorHandler {
  handleDeconstructionError: (error: Error, prompt: string) => DeconstructionFallback
  handleDiagnosisError: (error: Error, deconstruction: any) => DiagnosisFallback
  handleDevelopmentError: (error: Error, context: any) => DevelopmentFallback
  handleDeliveryError: (error: Error, platform: Platform) => DeliveryFallback
  handleModeError: (error: Error, requestedMode: string) => ModeFallback
}

interface PromptifyErrorRecovery {
  errorType: 'deconstruction' | 'diagnosis' | 'development' | 'delivery' | 'mode' | 'platform'
  fallbackStrategy: 'basic-optimization' | 'template-based' | 'rule-based' | 'cached-result'
  userMessage: string
  technicalDetails?: string
  suggestedActions: string[]
}
```

### 2. SEO错误处理
- **404页面**: 智能重定向到相关页面
- **重复内容**: 规范化URL和meta标签
- **加载性能**: 懒加载和代码分割

### 3. 多语言错误处理
- **翻译缺失**: 回退到英语版本
- **区域设置错误**: 自动检测和修正
- **字符编码**: UTF-8支持和特殊字符处理

## 多语言SEO优化策略

### 语言特定的关键词策略

#### 1. 英语 (en) - 全球市场
- **主要关键词**: prompt generator, AI prompt generator, ChatGPT prompts
- **内容策略**: 高质量长篇内容，技术深度，专业术语
- **竞争策略**: 针对高竞争关键词，需要权威性内容

#### 2. 中文 (zh) - 中国大陆/台湾/香港市场
- **主要关键词**: 提示词生成器, AI提示词, ChatGPT中文提示词
- **内容策略**: 实用性导向，案例丰富，本土化应用场景
- **搜索引擎**: 百度、搜狗优化，Google香港/台湾优化

#### 3. 日语 (ja) - 日本市场
- **主要关键词**: プロンプト生成器, AIプロンプト, ChatGPTプロンプト
- **内容策略**: 详细说明，礼貌用语，技术精确性
- **文化适应**: 日式设计美学，细致的用户体验

#### 4. 韩语 (ko) - 韩国市场
- **主要关键词**: 프롬프트 생성기, AI 프롬프트, ChatGPT 프롬프트
- **内容策略**: 创新性强调，视觉吸引力，社交媒体整合
- **搜索引擎**: Naver优化为主，Google Korea为辅

#### 5. 法语 (fr) - 法国/加拿大/比利时/瑞士市场
- **主要关键词**: générateur de prompts, prompts IA, prompts ChatGPT
- **内容策略**: 优雅表达，文化深度，艺术性强调
- **地区差异**: 法国vs加拿大法语的用词差异

#### 6. 西班牙语 (es) - 西班牙/拉美市场
- **主要关键词**: generador de prompts, prompts IA, prompts ChatGPT
- **内容策略**: 热情表达，社区导向，实用性强
- **地区差异**: 西班牙vs拉美西语的表达差异

#### 7. 葡萄牙语 (pt) - 巴西/葡萄牙市场
- **主要关键词**: gerador de prompts, prompts IA, prompts ChatGPT
- **内容策略**: 友好亲切，创意性强，本土案例
- **地区差异**: 巴西vs葡萄牙的语言差异

#### 8. 德语 (de) - 德国/奥地利/瑞士市场
- **主要关键词**: Prompt-Generator, KI-Prompts, ChatGPT-Prompts
- **内容策略**: 技术精确，逻辑清晰，质量导向
- **文化特点**: 严谨性，技术深度，隐私重视

### 技术实现策略

#### 1. URL结构
```
/en/prompt-generator (英语)
/zh/提示词生成器 (中文 - 可选中文URL)
/ja/プロンプト生成器 (日语)
/ko/프롬프트-생성기 (韩语)
/fr/generateur-prompts (法语)
/es/generador-prompts (西班牙语)
/pt/gerador-prompts (葡萄牙语)
/de/prompt-generator (德语)
```

#### 2. Hreflang实现
```html
<link rel="alternate" hreflang="en" href="https://example.com/en/prompt-generator" />
<link rel="alternate" hreflang="zh" href="https://example.com/zh/提示词生成器" />
<link rel="alternate" hreflang="ja" href="https://example.com/ja/プロンプト生成器" />
<!-- 其他语言... -->
<link rel="alternate" hreflang="x-default" href="https://example.com/en/prompt-generator" />
```

#### 3. 本地化结构化数据
每种语言将有独立的结构化数据，包含本地化的名称、描述和关键词。

## Testing Strategy

### 1. SEO测试
- **关键词密度检查**: 确保自然融入目标关键词
- **页面速度测试**: Core Web Vitals监控
- **结构化数据验证**: Google Rich Results测试
- **移动友好性测试**: 响应式设计验证

### 2. 功能测试
- **生成器准确性**: 输出质量评估
- **用户体验测试**: A/B测试不同界面设计
- **跨浏览器兼容性**: 主流浏览器测试
- **性能测试**: 负载测试和压力测试

### 3. 国际化测试
- **多语言显示**: 所有支持语言的界面测试
- **文化适应性**: 本地化内容的适当性检查
- **RTL支持**: 未来阿拉伯语等语言的准备

### 4. 自动化测试
- **单元测试**: 生成器逻辑测试
- **集成测试**: API和数据库交互测试
- **端到端测试**: 用户流程完整性测试
- **SEO回归测试**: 确保SEO优化不被破坏