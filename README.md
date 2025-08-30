# 🚀 AI提示词优化器

一个现代化的Web应用，专门用于优化和改进AI提示词，提升与AI模型的对话效果。

## ✨ 功能特色

- **智能优化**: 自动分析并优化提示词结构
- **实时分析**: 提供详细的提示词质量分析
- **多维度评估**: 从清晰度、具体性、结构完整性等角度评估
- **个性化选项**: 支持不同受众、风格和语调的定制
- **现代化UI**: 响应式设计，支持移动端访问

## 🛠️ 技术栈

### 前端
- React 18 + TypeScript
- 现代化CSS3动画
- 响应式设计

### 后端
- Node.js + Express
- RESTful API设计
- 智能提示词处理算法

## 🚀 快速开始

### 安装依赖

```bash
# 安装项目依赖
npm run install-all
```

### 开发模式

```bash
# 启动开发服务器（前后端同时启动）
npm run dev
```

### 生产部署

```bash
# 构建前端
npm run build

# 启动生产服务器
npm start
```

## 📋 API接口

### 优化提示词
```
POST /api/optimize-prompt
Content-Type: application/json

{
  "prompt": "您的提示词",
  "targetAudience": "general|technical|creative",
  "style": "structured|conversational|detailed|concise",
  "tone": "professional|friendly|formal|casual"
}
```

### 分析提示词
```
POST /api/analyze-prompt
Content-Type: application/json

{
  "prompt": "您的提示词"
}
```

### 获取建议
```
POST /api/suggestions
Content-Type: application/json

{
  "prompt": "您的提示词",
  "category": "clarity|structure|effectiveness"
}
```

## 🎯 使用方法

1. **输入提示词**: 在左侧输入框中输入您想要优化的提示词
2. **选择选项**: 根据需要选择目标受众、风格和语调
3. **优化分析**: 点击"优化提示词"或"分析提示词"按钮
4. **查看结果**: 在右侧查看优化结果和详细分析
5. **复制使用**: 点击复制按钮将优化后的提示词复制到剪贴板

## 🔧 优化算法

本应用采用多维度优化算法：

1. **结构化处理**: 自动添加任务定义、背景信息、输出格式等结构元素
2. **受众适配**: 根据目标受众调整语言复杂度和专业术语使用
3. **语调调整**: 根据所选语调修改表达方式
4. **清晰度优化**: 简化复杂句式，提高表达清晰度
5. **具体性增强**: 添加限定条件和具体要求

## 📊 评估维度

- **清晰度**: 提示词表达的清晰程度
- **具体性**: 要求的具体和明确程度
- **结构完整性**: 是否包含完整的提示词结构要素
- **整体评分**: 综合各维度的总体质量评分

## 🌟 最佳实践

1. **明确任务**: 清楚说明您希望AI完成的具体任务
2. **提供背景**: 给出必要的上下文信息
3. **指定格式**: 明确期望的输出格式
4. **举例说明**: 在适当时候提供示例
5. **设定约束**: 添加必要的限制条件

## 📱 浏览器支持

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- 移动端浏览器

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进这个项目！

## 📄 许可证

MIT License