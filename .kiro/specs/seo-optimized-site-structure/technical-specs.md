# 技术实现规范 (基于现有项目)

## 当前项目结构分析

### 现有结构 (已存在)
```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.js ✅
│   │   ├── page.js ✅ (已更新为生成器展示)
│   │   ├── auth/ ✅ (认证相关页面)
│   │   ├── account/ ✅ (用户账户管理)
│   │   ├── login/ ✅
│   │   ├── register/ ✅
│   │   └── ... (其他认证页面)
│   └── api/ ✅ (现有API端点)
├── components/
│   ├── ui/ ✅ (完整的shadcn/ui组件库)
│   ├── Header.js ✅
│   ├── Footer.js ✅
│   ├── SiteCard.js ✅ (可复用为GeneratorCard)
│   └── AuthProvider.js ✅
├── i18n/ ✅
│   ├── routing.js ✅ (已更新支持8种语言)
│   ├── navigation.js ✅
│   └── request.js ✅
├── lib/ ✅
│   ├── auth.js ✅
│   ├── utils.js ✅
│   └── ... (其他工具函数)
└── middleware.js ✅
```

### 需要添加的结构
```
src/
├── app/
│   ├── [locale]/
│   │   ├── writing-prompt-generator/page.js ✅ (已创建)
│   │   ├── art-prompt-generator/page.js ❌
│   │   ├── ai-prompt-generator/page.js ❌
│   │   ├── chatgpt-prompt-generator/page.js ❌
│   │   ├── midjourney-prompt-generator/page.js ❌
│   │   ├── drawing-prompt-generator/page.js ❌
│   │   ├── ai-video-prompt-generator/page.js ❌
│   │   ├── kari-ai/page.js ❌
│   │   └── tools/
│   │       ├── free/page.js ❌
│   │       ├── best/page.js ❌
│   │       └── online/page.js ❌
│   └── api/
│       └── kari/
│           └── optimize/route.js ✅ (已创建)
├── components/
│   └── generators/
│       └── KariOptimizer.js ✅ (已创建)
└── i18n/
    └── messages/ (需要为新语言添加翻译文件)
        ├── zh.json ❌
        ├── ja.json ❌
        ├── fr.json ❌
        ├── es.json ❌
        ├── pt.json ❌
        └── de.json ❌
```

## API 端点设计

### /api/kari/optimize
```typescript
// POST /api/kari/optimize
interface KariOptimizeRequest {
  prompt: string
  platform: Platform
  generatorType: GeneratorType
  locale: string
  mode: 'DETAIL' | 'BASIC'
  clarifyingAnswers?: Record<string, string>
}

interface KariOptimizeResponse {
  success: boolean
  data?: {
    optimizedPrompt: string
    originalPrompt: string
    improvements: PromptImprovement[]
    techniques: OptimizationTechnique[]
    proTip?: string
    processingTime: number
  }
  error?: string
}
```

### /api/generators/[type]
```typescript
// GET /api/generators/writing
interface GeneratorConfigResponse {
  config: GeneratorConfig
  templates: PromptTemplate[]
  examples: GeneratorExample[]
  seoData: SEOMetadata
}
```

## SEO 技术实现

### 元数据生成
```typescript
// lib/seo/metadata.ts
export function generateMetadata(
  type: GeneratorType,
  locale: string
): Metadata {
  const seoData = getSEOData(type, locale)
  
  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords.join(', '),
    openGraph: {
      title: seoData.title,
      description: seoData.description,
      type: 'website',
      locale: locale,
      alternateLocale: getSupportedLocales().filter(l => l !== locale)
    },
    twitter: {
      card: 'summary_large_image',
      title: seoData.title,
      description: seoData.description
    },
    alternates: {
      languages: generateHreflangAlternates(type)
    }
  }
}
```

### 结构化数据
```typescript
// components/seo/StructuredData.tsx
export function StructuredData({ type, locale }: StructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": getLocalizedName(type, locale),
    "description": getLocalizedDescription(type, locale),
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "1250"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
```

## 性能优化

### Core Web Vitals 目标
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### 优化策略
1. **代码分割**: 按页面和功能分割
2. **图像优化**: Next.js Image组件 + WebP格式
3. **字体优化**: 字体预加载和fallback
4. **缓存策略**: API响应缓存和静态资源缓存
5. **懒加载**: 非关键组件懒加载

## 国际化配置

### next-intl 配置
```typescript
// lib/i18n/config.ts
export const locales = ['en', 'zh', 'ja', 'ko', 'fr', 'es', 'pt', 'de'] as const
export const defaultLocale = 'en' as const

export const pathnames = {
  '/': '/',
  '/writing-prompt-generator': {
    en: '/writing-prompt-generator',
    zh: '/写作提示生成器',
    ja: '/ライティングプロンプト生成器',
    // ... 其他语言
  },
  // ... 其他路径
} satisfies Pathnames<typeof locales>
```

### 中间件配置
```typescript
// middleware.ts
import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale, pathnames } from './lib/i18n/config'

export default createMiddleware({
  locales,
  defaultLocale,
  pathnames,
  localeDetection: true
})

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
    '/([\\w-]+)?/users/(.+)'
  ]
}
```

## 部署配置

### Docker 配置
```dockerfile
# Dockerfile
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM base AS build
COPY . .
RUN npm run build

FROM base AS runtime
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["npm", "start"]
```

### 环境变量
```env
# .env.local
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```