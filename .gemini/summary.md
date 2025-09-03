### Moly-Frontend 项目总结与文档 - V1.0

#### **1.0 项目概述 (Project Overview)**

**1.1 网站概念与愿景 (Website Concept & Vision)**

*   **概念**: "DayCal" 被设计为一个数字杂志和人类庆典的互动地图。它不仅仅是一个日历，更是通向全球社区灵魂的窗口。
*   **愿景**: 通过故事驱动的发现，平衡生动、高冲击力的视觉效果与简洁、直观的界面，让深入的文化探索既令人兴奋又轻松。

**1.2 目标用户 (Target Audience)**

*   **文化爱好者与旅行者 (25-45岁)**: 追求深度、真实的文化洞察和旅行体验。
*   **家庭与教育者**: 寻找可靠、引人入胜的资源，用于文化学习和家庭活动。
*   **学生**: 寻求比通用来源更具吸引力和可信度的研究起点。

**1.3 情感基调 (Emotional Tone)**

*   启发性、好奇心、尊重和真实。文案旨在激发好奇心和鼓励探索，感觉像是一位经验丰富、文化素养高的朋友的推荐。

---

#### **2.0 技术栈 (Tech Stack)**

本项目基于现代 Web 技术栈构建，旨在提供高性能、可维护和可扩展的应用。

**2.1 核心框架 (Core Framework)**

*   **前端框架**: Next.js (v15) - 用于服务器端渲染 (SSR) 和静态站点生成 (SSG)。
*   **UI 库**: React (v19) - 用于构建用户界面。
*   **语言**: JavaScript

**2.2 UI & 样式 (UI & Styling)**

*   **组件库**: shadcn/ui - 基于 Radix UI 和 Tailwind CSS 构建的可复用组件集合，提供高度定制性。
*   **样式框架**: Tailwind CSS (v4) - 实用优先的 CSS 框架，通过 CSS 变量实现主题化。
*   **图标**: Lucide React - Feather Icons 的一个分支，提供丰富的图标。

**2.3 表单与验证 (Forms & Validation)**

*   **表单管理**: React Hook Form - 用于构建高性能和灵活的表单。
*   **Schema 验证**: Zod - 与 React Hook Form 结合使用，实现类型安全的 Schema 验证。

**2.4 富文本编辑 (Rich Text Editing)**

*   **编辑器框架**: Plate.js - 基于 Slate 构建的 React 富文本编辑器框架。

**2.5 认证 (Authentication)**

*   **框架**: NextAuth.js - 为 Next.js 应用提供认证功能。

**2.6 国际化 (Internationalization)**

*   **库**: next-intl - 用于 Next.js 应用的国际化 (i18n)。

**2.7 后端服务与数据 (Backend Services & Data)**

*   **缓存/内存存储**: Redis (通过 `ioredis`) - 用于缓存和限流等任务。
*   **文件存储**: AWS S3 - 用于对象存储。

**2.8 测试 (Testing)**

*   **测试运行器**: Vitest - 快速的单元测试框架。
*   **测试库**: React Testing Library - 用于测试 React 组件。

**2.9 关键依赖 (Key Dependencies)**

*   **表格**: `@tanstack/react-table`
*   **图表**: `recharts`
*   **通知**: `sonner`
*   **邮件**: `nodemailer`

---

#### **3.0 设计系统与规范 (Design System & Guidelines)**

本项目的设计系统旨在提供一致性、灵活性和高效的开发体验。

**3.1 核心理念 (Core Principles)**

*   **开发者所有权**: shadcn/ui 提供构建模块，但最终设计由项目团队定义和控制。
*   **CSS 变量驱动**: 主题化通过 `globals.css` 中定义的 CSS 变量实现，而非硬编码。
*   **组合性**: 鼓励通过组合基础组件来构建复杂 UI。
*   **清晰与呼吸感**: 界面设计注重信息清晰传达和充足留白。

**3.2 设计令牌 (Design Tokens)**

所有视觉属性都通过 `globals.css` 中的 CSS 变量进行管理。

*   **颜色**: 定义了 `primary`, `secondary`, `background`, `foreground`, `card`, `border`, `destructive` 等语义化颜色变量，支持亮/暗模式。
*   **排版**: 通过 `layout.js` 引入 `Lora` (衬线体) 和 `Montserrat` (无衬线体)，并在 `globals.css` 中将 `Lora` 应用于标题 (`h1-h6`)，`Montserrat` 应用于正文 (`body`)。
*   **间距**: 依赖 Tailwind CSS 的默认间距系统，通过 `px` 单位的工具类实现。
*   **圆角**: 通过 `globals.css` 中的 `--radius` 变量控制，并由 shadcn/ui 组件自动应用。
*   **阴影**: 依赖 Tailwind CSS 的默认阴影工具类。

**3.3 组件使用指南 (Component Usage Guidelines)**

*   **优先复用**: 优先使用 `src/components/ui/` 和 `src/components/` 下已有的 shadcn/ui 组件和项目自定义组件。
*   **表单模式**: 表单应遵循 `react-hook-form` 和 `zod` 的模式，并通常包裹在 `Card` 组件中。
*   **图片**: 外部图片必须在 `next.config.mjs` 中配置域名，并对占位图使用 `unoptimized` 属性。

---

#### **4.0 网站页面结构与功能 (Website Page Structure & Functionality)**

**4.1 页面列表与目的 (Page List & Purpose)**

*   **Home Page (已完成静态骨架)**: 网站的入口，引导用户发现和探索全球庆典。
*   **Explore Festivals (已完成静态骨架)**: 核心探索工具，提供日历和列表视图，支持筛选。
*   **Festival Detail Page (已完成静态骨架)**: 详细展示单个节日的深度信息，包括故事、传统、旅行指南和画廊。
*   **Stories (已完成静态骨架)**: 文章中心，提供特色文章和文章列表。
*   **Story Detail Page (待完成)**: 展示单篇文章的完整内容。
*   **About Us (已完成)**: 讲述 DayCal 的故事和使命，建立用户信任。
*   **Contribute (已完成)**: 社区贡献页面，提供表单供用户提交内容。

**4.2 页面内容详情 (Page Content Details)**

*   **Home Page**: 包含英雄区（带搜索框）、特色节日卡片、按兴趣探索（图标卡片）、按国家探索（国旗标签）、最新故事卡片和新闻订阅。
*   **Explore Festivals**: 两栏布局，左侧为搜索和筛选器（日期、国家、分类、标签），右侧为日历视图和列表视图（使用 `DataTable`）。
*   **Festival Detail Page**: 顶部英雄图，两栏布局，左侧为关键信息卡片（日期、地点、类型、标签），右侧为标签页（故事、传统、旅行指南，内容由 `EditorStatic` 渲染），下方有画廊和社交分享按钮。
*   **Stories Page**: 顶部特色文章大图，下方为文章分类筛选和文章卡片网格。
*   **About Us Page**: 包含英雄区、我们的故事、团队介绍（带头像和简介）和贡献号召。
*   **Contribute Page**: 包含页面说明和用于提交节日信息的表单（使用 `react-hook-form` 和 `zod`）。

---

#### **5.0 目录结构 (Directory Structure)**

项目遵循 Next.js App Router 约定，并对组件进行了功能性分组。

*   **`src/app/[locale]/`**: 存放主要路由页面。
    *   `about/page.jsx`
    *   `contribute/page.jsx`
    *   `explore/page.jsx`
    *   `festival/[slug]/page.jsx`
    *   `stories/page.jsx`
*   **`src/components/`**: 存放 React 组件。
    *   `layout/`: 全局布局组件 (`AppHeader.jsx`, `AppFooter.jsx`)
    *   `home/`: 首页特定组件 (`HomeHeroSection.jsx`)
    *   `explore/`: 探索页特定组件 (`FestivalFilters.jsx`)
    *   `stories/`: 故事页特定组件 (`ArticleCard.jsx`)
    *   `contribute/`: 贡献页特定组件 (`ContributeForm.jsx`)
    *   `ui/`: shadcn/ui 自动生成的组件（如 `Button`, `Card`, `Input` 等）
    *   `shared/`: 可复用的通用组件

---

#### **6.0 经验教训与注意事项 (Lessons Learned & Important Notes)**

在项目开发过程中，我们从多次尝试和错误中吸取了宝贵教训，这些将作为未来操作的核心指导原则：

**6.1 严格遵守项目约定与技术栈特性**

*   **核心原则**: 在使用任何库、框架或组件之前，必须先查阅相关文档或既有代码，绝不基于假设进行操作。
*   **Tailwind CSS v4**: 深刻理解其“CSS-first”配置理念。主题扩展（如 `fontFamily`）应通过 `globals.css` 中的 CSS 变量和 `layout.js` 中的 `next/font` 实现，而非创建 `tailwind.config.js`。
*   **shadcn/ui**: 其设计语言体现在通过 CSS 变量实现的高度可定制化主题系统。组件本身是“无主见”的，其外观由 `globals.css` 中的变量决定。

**6.2 Next.js 组件类型与渲染模式**

*   **Server Components (默认)**: 页面默认在服务器端渲染，有利于 SEO 和性能。
*   **Client Components (`"use client";`)**: 仅当组件需要客户端交互（如 `useState`, `useEffect`, 浏览器 API）时才使用。将客户端逻辑封装在独立的客户端组件中，并由服务器组件引入。
*   **错误示例**: 尝试在 Server Component 中使用客户端功能（如 `platejs` 的 `EditorStatic`），导致运行时错误。

**6.3 外部资源管理**

*   **`next/image` 配置**: 所有外部图片域名（如 `placehold.co`, `flagcdn.com`）必须在 `next.config.mjs` 的 `images.remotePatterns` 中明确配置。
*   **SVG 图像**: `next/image` 默认不优化远程 SVG。对于占位图等不需要优化的场景，应使用 `unoptimized={true}` 属性。
*   **图片服务选择**: 优先选择提供直接图片链接、无重定向的稳定服务（如 `placehold.co`），避免使用可能导致 `503` 错误的随机重定向服务（如 `source.unsplash.com`）。

**6.4 依赖管理**

*   **使用前确认**: 在使用任何新组件或功能前，务必检查 `package.json` 确认所有依赖已正确安装。若缺失，使用项目指定的包管理器（如 `bun`）进行安装。

**6.5 沟通与确认**

*   **关键决策前**: 在进行任何可能影响项目架构或核心功能的修改前，务必与用户进行充分沟通并获得明确确认。
*   **错误发生时**: 及时、准确地报告错误信息，并提出基于诊断的解决方案，避免盲目尝试。

---

#### **7.0 后续工作建议 (Suggestions for Future Work)**

*   **完成剩余页面**: 构建“故事详情页” (`/stories/[slug]`)。
*   **数据集成**: 将所有页面的模拟数据替换为从后端 API 获取的真实数据，实现完整的 SSR 动态渲染。
*   **筛选器功能**: 实现“Explore Festivals”页面中筛选器的实际功能，使其能根据用户选择动态过滤节日。
*   **表单提交**: 实现“Contribute”页面表单的后端提交逻辑。
*   **用户认证**: 整合 NextAuth.js 实现用户登录、注册、会话管理等。
*   **测试覆盖**: 为关键组件和功能编写单元测试和集成测试。
*   **性能优化**: 持续关注页面加载速度、响应时间等性能指标。
*   **用户体验**: 进一步优化交互细节和动画效果。

这份文档旨在作为项目未来开发和维护的指南。

---

#### **8.0 交互记录与项目进展 (Interaction Log & Project Progress)**

本节记录了与 AI 助手的交互过程，包括需求分析、问题解决、功能实现及遇到的挑战。

**8.1 故事详情页 (`Story Detail Page`) 改造**

*   **需求**: 用户要求查看并调整故事详情页。
*   **发现**: 页面路由 (`src/app/[locale]/stories/[slug]/page.jsx`) 和内容组件 (`src/components/stories/StoryDetailContent.jsx`) 已存在，但使用静态模拟数据。
*   **改造**: 
    *   将“Share this story”部分从主内容区移动到左侧边栏，并封装在独立的卡片中。
    *   为“Enjoyed this story?”（新闻订阅）部分添加了邮件输入框，并优化了布局。
*   **问题**: 
    *   `generateMetadata` 函数中 `params.slug` 同步访问导致 Next.js 警告。
    *   **解决方案**: 在 `generateMetadata` 和 `StoryDetailPage` 函数中，对 `params` 进行 `await` 解构，以符合 Next.js 异步 API 的要求。
    *   `FormControl` 组件与 `React.Fragment` 冲突导致 `Invalid prop 'data-slot'` 错误。
    *   **解决方案**: 将 `FormControl` 内部的 `React.Fragment` 替换为 `<div>` 元素。

**8.2 页面整体审查与主页 (`Home Page`) 优化**

*   **需求**: 用户要求审查所有页面，找出不符合逻辑或需要调整的地方。
*   **审查范围**: 主页、关于我们、贡献页面。
*   **发现**: 
    *   **关于我们页**: 结构良好，逻辑清晰，无需修改。
    *   **主页**: 存在逻辑问题，卡片（特色节日、最新故事）缺少链接。
    *   **贡献页面**: UI 完善，但表单功能不完整（未提交数据），且“Country”字段为文本输入框，体验不佳。
*   **主页改造**: 
    *   为“Happening This Month”和“From Our Stories”部分的卡片添加了 `next/link` 链接，使其可点击跳转到详情页。
    *   为模拟数据添加了 `slug` 字段以支持链接生成。

**8.3 贡献表单 (`ContributeForm`) 大改造**

*   **需求**: 使贡献表单与节日详情页的数据结构完全匹配。
*   **挑战**: 节日详情页需要非常丰富和结构化的数据（富文本、图片、多类型等），而原表单非常简单。
*   **改造方案 (多轮迭代)**: 
    *   **字段调整**: 
        *   “Festival Name”改为“Title”。
        *   “Country”字段从文本输入框改为下拉选择框（复用主页的国家列表）。
        *   “Category”字段改为“Type”，并实现为多选复选框。
        *   新增“Tags”文本输入框（逗号分隔）。
        *   新增“Hero Image”和“Gallery Images”的文件选择 UI（仅前端交互，不涉及实际上传）。
    *   **富文本编辑器**: 
        *   原计划使用 `Plate.js` 的 `Editor` 组件实现“Story”、“Traditions”和“Traveler's Guide”三个富文本输入框。
        *   **问题**: 发现项目中没有为可交互的 `Plate.js` 编辑器提供现成配置，导致 `Plate hooks` 错误。
        *   **用户决策**: 暂时使用普通 `<Textarea>` 文本框作为替代方案。
        *   **问题**: `FormControl` 与 `React.Fragment` 冲突导致 `Invalid prop 'data-slot'` 错误。
        *   **解决方案**: 将 `FormControl` 内部的 `React.Fragment` 替换为 `<div>` 元素。

**8.4 探索页面 (`Explore Page`) 深度改造**

*   **需求**: 使探索页与改造后的贡献表单数据结构兼容，并优化日历交互。
*   **挑战**: 探索页原数据结构非常简单，与贡献表单的丰富数据不匹配。
*   **改造方案 (多轮迭代)**: 
    *   **数据与列表**: 
        *   更新 `festivalData` 模拟数据，使其与贡献表单的复杂结构一致。
        *   修改 `DataTable` 列定义，增加“Type”等列，并使“Title”列可点击跳转到详情页。
    *   **筛选器**: 
        *   修改 `FestivalFilters.jsx`：将“Tags”筛选改为文本输入框，将“Categories”重命名为“Type”并同步选项。
    *   **日历视图**: 
        *   **初始尝试**: 使用 `react-day-picker` 的 `modifiers` 属性在节日日期显示“点”。
        *   **问题**: “点”未显示（日期对象创建的时区问题）。
        *   **解决方案**: 优化日期对象创建方式，避免时区影响。
        *   **问题**: “点”仍未显示，用户质疑“糊弄事”，并提出使用 `FullCalendar`。
        *   **用户决策**: 采纳用户建议，使用 `FullCalendar`。
        *   **`FullCalendar` 实现**: 
            *   安装 `FullCalendar` 依赖 (`@fullcalendar/react`, `@fullcalendar/daygrid`, `@fullcalendar/interaction`)。
            *   改造 `explore/page.jsx` 布局：移除 Tabs，实现“左侧日历、右侧列表”的固定两栏布局。
            *   集成 `FullCalendar`，将节日数据转换为事件格式，并实现日期点击筛选列表的联动功能。
        *   **`FullCalendar` 样式问题 (重大挑战)**: 
            *   **第一次尝试**: 在 `globals.css` 中添加大量 `FullCalendar` 自定义样式和 `@layer base` 规则。
            *   **结果**: **严重破坏了页面整体样式**。
            *   **解决方案**: **立即回滚 `globals.css` 的所有修改**。
            *   **第二次尝试**: 在 `globals.css` 中仅添加 `FullCalendar` 的 `@import` 语句。
            *   **结果**: **再次破坏页面样式**。
            *   **解决方案**: **再次回滚 `globals.css` 的所有修改**。
            *   **当前状态**: `FullCalendar` 已集成到页面，功能正常，但 **完全没有样式**。

**8.5 经验教训 (Lessons Learned from Interaction)**

*   **CSS 复杂性**: 项目的 CSS 体系（Tailwind CSS, `shadcn/ui`, Next.js App Router）对全局样式修改非常敏感。在未完全理解其内部机制前，对 `globals.css` 进行任何修改都极易导致全局样式崩溃。
*   **依赖引入**: 引入新的大型 UI 库（如 `FullCalendar`）需要谨慎处理其样式集成，尤其是在现有复杂 CSS 体系下。
*   **用户沟通**: 在遇到技术障碍或需要妥协时，必须清晰、透明地沟通，并提供备选方案，但最终应尊重用户的最终决策。避免“糊弄事”的印象。
*   **逐步验证**: 对于大型改造，应分阶段进行，并在每个阶段后进行验证，避免一次性引入过多变化导致难以调试。

---
