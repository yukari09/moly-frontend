# 快速开始指南

## 立即可以做的事情

### 1. 安装Gemini SDK
```bash
npm install @google/generative-ai
# 或
bun add @google/generative-ai
```

### 2. 配置环境变量
在 `.env.local` 中添加：
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. 测试Kari优化器
1. 启动开发服务器: `npm run dev`
2. 访问: `http://localhost:3000/en/writing-prompt-generator`
3. 输入一个简单的提示，比如: "Write a story"
4. 选择平台和模式，点击优化

### 4. 检查缺失的UI组件
KariOptimizer组件需要以下shadcn/ui组件：
- [x] Button ✅ (应该已存在)
- [ ] Textarea ❌ (需要检查)
- [ ] Select ❌ (需要检查)
- [ ] Card ❌ (需要检查)
- [ ] Tabs ❌ (需要检查)
- [ ] Badge ❌ (需要检查)

检查命令：
```bash
# 检查是否存在这些组件
ls src/components/ui/textarea.jsx
ls src/components/ui/select.jsx
ls src/components/ui/card.jsx
ls src/components/ui/tabs.jsx
ls src/components/ui/badge.jsx
```

如果缺失，使用shadcn/ui CLI添加：
```bash
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add select
npx shadcn-ui@latest add card
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add badge
```

## 下一步优先任务

### 第一优先级 (本周)
1. **补充缺失UI组件** - 确保KariOptimizer正常工作
2. **测试Gemini API集成** - 验证真实API调用
3. **创建art-prompt-generator页面** - 复制writing-prompt-generator

### 第二优先级 (下周)
1. **添加基础翻译文件** - 至少支持中文和日语
2. **创建其他生成器页面** - chatgpt, midjourney, ai, drawing, ai-video
3. **添加错误处理** - 改善用户体验

### 第三优先级 (后续)
1. **SEO优化** - 元数据和结构化数据
2. **性能优化** - 加载速度和响应时间
3. **用户体验改进** - 动画、通知、历史记录

## 快速验证清单

### ✅ 基础功能测试
- [ ] 主页显示7个生成器卡片
- [ ] 点击"Writing Prompt Generator"进入对应页面
- [ ] KariOptimizer组件正常渲染
- [ ] 可以输入文本和选择选项
- [ ] 点击优化按钮有响应（即使是模拟数据）

### ✅ API测试
- [ ] `/api/kari/optimize` 端点响应正常
- [ ] 返回正确的JSON格式
- [ ] 错误处理正常工作

### ✅ 多语言测试
- [ ] `/en/writing-prompt-generator` 正常访问
- [ ] `/ko/writing-prompt-generator` 正常访问
- [ ] 语言切换功能正常（如果已实现）

## 常见问题解决

### Q: KariOptimizer组件报错缺少UI组件
A: 使用 `npx shadcn-ui@latest add [component-name]` 添加缺失组件

### Q: Gemini API调用失败
A: 检查环境变量是否正确设置，API密钥是否有效

### Q: 页面404错误
A: 确保文件路径正确，检查 `src/app/[locale]/[page]/page.js` 是否存在

### Q: 翻译文件缺失
A: 暂时可以复制英语翻译文件，后续再本地化

## 开发建议

### 代码组织
- 每个生成器页面使用相同的结构
- 复用KariOptimizer组件，只传递不同的generatorType
- 保持一致的错误处理和加载状态

### 测试策略
- 先确保基础功能正常
- 逐步添加新功能
- 每个生成器页面都要测试

### 性能考虑
- Gemini API调用可能较慢，需要好的加载状态
- 考虑添加请求缓存
- 图片使用Next.js Image组件优化