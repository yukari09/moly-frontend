# UI/UX 设计规范

## 设计系统

### 色彩方案 (Zinc主题)
```css
:root {
  /* 主色调 - Zinc */
  --zinc-50: #fafafa;
  --zinc-100: #f4f4f5;
  --zinc-200: #e4e4e7;
  --zinc-300: #d4d4d8;
  --zinc-400: #a1a1aa;
  --zinc-500: #71717a;
  --zinc-600: #52525b;
  --zinc-700: #3f3f46;
  --zinc-800: #27272a;
  --zinc-900: #18181b;
  --zinc-950: #09090b;

  /* 强调色 */
  --primary: #3b82f6; /* Blue-500 */
  --primary-foreground: #ffffff;
  
  /* 成功色 */
  --success: #10b981; /* Emerald-500 */
  
  /* 警告色 */
  --warning: #f59e0b; /* Amber-500 */
  
  /* 错误色 */
  --error: #ef4444; /* Red-500 */
}
```

### 字体系统
```css
/* 主字体 */
.font-primary {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* 代码字体 */
.font-mono {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}

/* 字体大小 */
.text-xs { font-size: 0.75rem; }    /* 12px */
.text-sm { font-size: 0.875rem; }   /* 14px */
.text-base { font-size: 1rem; }     /* 16px */
.text-lg { font-size: 1.125rem; }   /* 18px */
.text-xl { font-size: 1.25rem; }    /* 20px */
.text-2xl { font-size: 1.5rem; }    /* 24px */
.text-3xl { font-size: 1.875rem; }  /* 30px */
.text-4xl { font-size: 2.25rem; }   /* 36px */
```

## 组件设计规范

### Kari优化器界面
```typescript
interface KariOptimizerUI {
  // 欢迎界面
  welcome: {
    title: string
    subtitle: string
    modeSelector: {
      detail: ModeOption
      basic: ModeOption
    }
    platformSelector: PlatformOption[]
    examples: WelcomeExample[]
  }
  
  // 输入界面
  input: {
    promptTextarea: {
      placeholder: string
      minHeight: '120px'
      maxLength: 2000
    }
    platformSelect: PlatformSelectProps
    modeToggle: ModeToggleProps
    submitButton: ButtonProps
  }
  
  // 结果界面
  result: {
    originalPrompt: DisplayCard
    optimizedPrompt: DisplayCard
    improvements: ImprovementList
    techniques: TechniqueList
    actions: {
      copy: ButtonProps
      save: ButtonProps
      regenerate: ButtonProps
      share: ButtonProps
    }
  }
}
```

### 响应式设计断点
```css
/* 移动设备 */
@media (max-width: 640px) {
  .container { padding: 1rem; }
  .grid-cols-auto { grid-template-columns: 1fr; }
}

/* 平板设备 */
@media (min-width: 641px) and (max-width: 1024px) {
  .container { padding: 2rem; }
  .grid-cols-auto { grid-template-columns: repeat(2, 1fr); }
}

/* 桌面设备 */
@media (min-width: 1025px) {
  .container { padding: 3rem; }
  .grid-cols-auto { grid-template-columns: repeat(3, 1fr); }
}
```

## 页面布局规范

### 主页布局
```typescript
interface HomePageLayout {
  header: {
    navigation: NavigationProps
    languageSwitcher: LanguageSwitcherProps
    logo: LogoProps
  }
  
  hero: {
    title: string
    subtitle: string
    cta: ButtonProps
    demo: KariDemoProps
  }
  
  generators: {
    title: string
    grid: GeneratorCardProps[]
    layout: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
  }
  
  features: {
    title: string
    items: FeatureItemProps[]
    layout: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  }
  
  testimonials: {
    title: string
    items: TestimonialProps[]
    carousel: CarouselProps
  }
  
  faq: {
    title: string
    items: FAQItemProps[]
    accordion: AccordionProps
  }
  
  footer: FooterProps
}
```

### 生成器页面布局
```typescript
interface GeneratorPageLayout {
  header: HeaderProps
  
  breadcrumbs: BreadcrumbProps
  
  hero: {
    title: string
    description: string
    generator: KariOptimizerProps
  }
  
  features: {
    title: string
    items: FeatureItemProps[]
  }
  
  examples: {
    title: string
    items: ExamplePromptProps[]
    tabs: TabsProps
  }
  
  guide: {
    title: string
    steps: GuideStepProps[]
  }
  
  relatedTools: {
    title: string
    items: RelatedToolProps[]
  }
  
  footer: FooterProps
}
```

## 交互设计规范

### 动画和过渡
```css
/* 标准过渡 */
.transition-standard {
  transition: all 0.2s ease-in-out;
}

/* 慢速过渡 */
.transition-slow {
  transition: all 0.3s ease-in-out;
}

/* 悬停效果 */
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 加载动画 */
.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

### 状态反馈
```typescript
interface StateIndicators {
  loading: {
    spinner: boolean
    text: string
    disableInteraction: boolean
  }
  
  success: {
    icon: 'check-circle'
    color: 'success'
    duration: 3000
  }
  
  error: {
    icon: 'x-circle'
    color: 'error'
    duration: 5000
    dismissible: boolean
  }
  
  warning: {
    icon: 'alert-triangle'
    color: 'warning'
    duration: 4000
  }
}
```

## 可访问性规范

### WCAG 2.1 AA 合规
```typescript
interface AccessibilityFeatures {
  // 键盘导航
  keyboardNavigation: {
    tabIndex: number
    focusVisible: boolean
    skipLinks: boolean
  }
  
  // 屏幕阅读器
  screenReader: {
    ariaLabels: boolean
    ariaDescriptions: boolean
    semanticHTML: boolean
  }
  
  // 颜色对比
  colorContrast: {
    textBackground: 4.5 // AA级别
    largeTextBackground: 3.0 // AA级别
  }
  
  // 字体大小
  fontSize: {
    minimum: '16px'
    scalable: boolean
    maxScale: '200%'
  }
}
```

### 多语言UI适配
```typescript
interface MultiLanguageUI {
  // 文本方向
  textDirection: {
    ltr: ['en', 'zh', 'ja', 'ko', 'fr', 'es', 'pt', 'de']
    rtl: [] // 未来支持阿拉伯语等
  }
  
  // 字体适配
  fontFamilies: {
    en: 'Inter, sans-serif'
    zh: 'Inter, "Noto Sans SC", sans-serif'
    ja: 'Inter, "Noto Sans JP", sans-serif'
    ko: 'Inter, "Noto Sans KR", sans-serif'
    // ... 其他语言
  }
  
  // 布局调整
  layoutAdjustments: {
    zh: { lineHeight: 1.6 } // 中文需要更大行高
    ja: { letterSpacing: '0.02em' } // 日文需要字间距
    // ... 其他调整
  }
}
```

## 性能优化UI

### 图像优化
```typescript
interface ImageOptimization {
  formats: ['webp', 'avif', 'jpg', 'png']
  sizes: {
    thumbnail: '150x150'
    small: '300x300'
    medium: '600x600'
    large: '1200x1200'
  }
  lazyLoading: boolean
  placeholder: 'blur' | 'empty'
}
```

### 组件懒加载
```typescript
// 非关键组件懒加载
const LazyTestimonials = lazy(() => import('./Testimonials'))
const LazyFAQ = lazy(() => import('./FAQ'))
const LazyFooter = lazy(() => import('./Footer'))

// 使用Suspense包装
<Suspense fallback={<LoadingSkeleton />}>
  <LazyTestimonials />
</Suspense>
```