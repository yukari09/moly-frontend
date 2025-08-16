# 需求总结 (基于现有项目)

## 项目目标
将现有的Next.js网站扩展为多语言AI提示生成器平台，集成Kari AI优化系统，实现SEO优化的提示生成器工具集。

## 核心功能需求

### 1. Kari AI提示优化系统 ✅ (部分完成)
- **4-D方法论**: DECONSTRUCT → DIAGNOSE → DEVELOP → DELIVER
- **双模式**: BASIC (快速优化) + DETAIL (深度优化)
- **多平台支持**: ChatGPT, Claude, Gemini, Midjourney, DALL-E等
- **状态**: API端点已创建，UI组件已实现，需要集成真实Gemini API

### 2. 提示生成器页面
- **写作提示生成器** ✅ (已完成)
- **艺术提示生成器** ❌ (待创建)
- **ChatGPT提示生成器** ❌ (待创建)
- **Midjourney提示生成器** ❌ (待创建)
- **AI视频提示生成器** ❌ (待创建)
- **绘画提示生成器** ❌ (待创建)
- **AI提示生成器** ❌ (待创建)

### 3. 多语言支持 ✅ (路由已完成)
- **当前**: 英语 (en), 韩语 (ko)
- **扩展**: 中文 (zh), 日语 (ja), 法语 (fr), 西班牙语 (es), 葡萄牙语 (pt), 德语 (de)
- **状态**: 路由已配置，需要添加翻译文件

### 4. SEO优化 ❌ (待实现)
- **目标关键词**: prompt generator, writing prompt generator, art prompt generator等
- **元数据优化**: 每个页面的title, description, keywords
- **结构化数据**: WebApplication schema
- **Sitemap**: 多语言sitemap生成

## 技术需求

### 现有技术栈 ✅
- Next.js 15.4.5 with App Router
- shadcn/ui + Radix UI + Tailwind CSS
- next-intl (国际化)
- NextAuth.js (认证)
- Elasticsearch + Redis (数据存储)

### 需要集成的技术
- **Google Gemini API** ❌ (需要安装 `@google/generative-ai`)
- **SEO工具** ❌ (next-sitemap, 结构化数据)
- **性能优化** ❌ (图像优化, 代码分割)

## 用户体验需求

### 核心用户流程
1. **访问生成器页面** → 看到Kari欢迎消息和功能介绍
2. **输入原始提示** → 选择目标平台和优化模式
3. **点击优化** → Kari执行4-D方法论优化
4. **查看结果** → 优化后的提示 + 改进说明 + 应用技术
5. **使用结果** → 一键复制, 保存, 分享

### 界面需求
- **响应式设计** ✅ (基于现有Tailwind CSS)
- **深色/浅色主题** ✅ (已有next-themes)
- **加载状态** ❌ (需要添加)
- **错误处理** ❌ (需要添加)
- **通知系统** ❌ (需要添加)

## 内容需求

### 页面内容结构
每个生成器页面需要包含:
1. **Hero区域** - 标题, 描述, 主要CTA
2. **Kari优化器** - 核心功能组件
3. **功能介绍** - 3-4个主要特性
4. **使用指南** - 如何获得最佳结果
5. **示例展示** - 优化前后对比
6. **FAQ** - 常见问题解答

### SEO内容要求
- **主页**: 2500+ 字，涵盖所有生成器类型
- **高竞争页面**: 2000+ 字 (writing, ai-prompt-generator)
- **中等竞争页面**: 1500+ 字 (chatgpt, midjourney, ai-video)
- **低竞争页面**: 1000+ 字 (art, drawing)

## 性能需求

### Core Web Vitals目标
- **LCP (Largest Contentful Paint)**: < 2.5秒
- **FID (First Input Delay)**: < 100毫秒
- **CLS (Cumulative Layout Shift)**: < 0.1

### API性能
- **Kari优化响应时间**: < 5秒
- **页面加载时间**: < 2秒
- **API可用性**: 99.9%

## 安全和合规需求

### API安全
- **速率限制** ✅ (已有ratelimiter)
- **输入验证** ❌ (需要添加)
- **API密钥保护** ❌ (需要配置)

### 用户隐私
- **GDPR合规** ❌ (需要隐私政策更新)
- **数据最小化** ❌ (不存储敏感提示内容)
- **用户同意** ❌ (Cookie同意机制)

## 部署和运维需求

### 环境配置
```env
# 新增环境变量
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

### 监控需求
- **错误监控** ❌ (Sentry或类似)
- **性能监控** ❌ (Web Vitals追踪)
- **API监控** ❌ (响应时间和错误率)
- **SEO监控** ❌ (排名和流量追踪)

## 成功标准

### 技术指标
- [ ] 所有7个生成器页面正常运行
- [ ] Kari AI优化功能正常工作
- [ ] 8种语言完整支持
- [ ] Core Web Vitals达标
- [ ] SEO基础设施完整

### 业务指标
- [ ] 主要关键词搜索排名进入前3页
- [ ] 月活跃用户 > 1000
- [ ] 提示优化完成率 > 80%
- [ ] 用户满意度 > 4.0/5.0

## 优先级排序

### P0 (必须完成)
1. Gemini API集成
2. 缺失UI组件补充
3. 基础翻译文件
4. 其他生成器页面创建

### P1 (重要)
1. SEO元数据和结构化数据
2. 错误处理和加载状态
3. 性能优化
4. 用户体验改进

### P2 (可选)
1. 高级Kari功能 (澄清问题)
2. 用户账户集成
3. 分析和监控
4. A/B测试框架