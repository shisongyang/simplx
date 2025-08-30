const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 静态文件服务
app.use(express.static(path.join(__dirname, 'client/build')));

// 提示词优化API
app.post('/api/optimize-prompt', async (req, res) => {
  try {
    const { prompt, targetAudience, style, tone } = req.body;
    
    // 提示词优化逻辑
    const optimizedPrompt = optimizePrompt(prompt, { targetAudience, style, tone });
    
    res.json({
      success: true,
      original: prompt,
      optimized: optimizedPrompt,
      improvements: getImprovements(prompt, optimizedPrompt),
      score: calculateScore(optimizedPrompt)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 提示词分析API
app.post('/api/analyze-prompt', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    const analysis = analyzePrompt(prompt);
    
    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 获取优化建议API
app.post('/api/suggestions', async (req, res) => {
  try {
    const { prompt, category } = req.body;
    
    const suggestions = getSuggestions(prompt, category);
    
    res.json({
      success: true,
      suggestions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 提示词优化核心函数
function optimizePrompt(prompt, options = {}) {
  let optimized = prompt;
  
  // 1. 清理和格式化
  optimized = optimized.trim();
  
  // 2. 添加结构化格式
  if (!optimized.includes('任务:') && !optimized.includes('Task:')) {
    optimized = `任务: ${optimized}`;
  }
  
  // 3. 根据目标受众调整
  if (options.targetAudience) {
    switch (options.targetAudience) {
      case 'technical':
        optimized = addTechnicalContext(optimized);
        break;
      case 'general':
        optimized = simplifyLanguage(optimized);
        break;
      case 'creative':
        optimized = addCreativeElements(optimized);
        break;
    }
  }
  
  // 4. 调整语调
  if (options.tone) {
    optimized = adjustTone(optimized, options.tone);
  }
  
  // 5. 添加输出格式要求
  if (!optimized.includes('格式:') && !optimized.includes('Format:')) {
    optimized += '\n\n格式: 请提供清晰、结构化的回答。';
  }
  
  return optimized;
}

// 提示词分析函数
function analyzePrompt(prompt) {
  const analysis = {
    length: prompt.length,
    wordCount: prompt.split(/\s+/).length,
    clarity: calculateClarity(prompt),
    specificity: calculateSpecificity(prompt),
    structure: analyzeStructure(prompt),
    suggestions: []
  };
  
  // 生成改进建议
  if (analysis.length < 10) {
    analysis.suggestions.push('提示词过短，建议添加更多细节');
  }
  
  if (analysis.length > 1000) {
    analysis.suggestions.push('提示词过长，建议简化和重点突出');
  }
  
  if (analysis.clarity < 0.7) {
    analysis.suggestions.push('提示词不够清晰，建议使用更具体的语言');
  }
  
  if (analysis.specificity < 0.6) {
    analysis.suggestions.push('提示词不够具体，建议添加更多限定条件');
  }
  
  return analysis;
}

// 辅助函数
function addTechnicalContext(prompt) {
  return `${prompt}\n\n背景: 请以技术专家的角度回答，包含具体的技术细节和实现方案。`;
}

function simplifyLanguage(prompt) {
  return prompt.replace(/复杂的技术术语/g, '简单易懂的语言');
}

function addCreativeElements(prompt) {
  return `${prompt}\n\n要求: 请发挥创意，提供新颖独特的想法和解决方案。`;
}

function adjustTone(prompt, tone) {
  const toneMap = {
    formal: '请使用正式、专业的语调',
    casual: '请使用轻松、友好的语调',
    enthusiastic: '请使用热情、积极的语调',
    analytical: '请使用客观、分析性的语调'
  };
  
  return `${prompt}\n\n语调: ${toneMap[tone] || ''}`;
}

function calculateClarity(prompt) {
  // 简单的清晰度计算
  const sentences = prompt.split(/[.!?]/).filter(s => s.trim());
  const avgLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;
  return Math.max(0, Math.min(1, 1 - (avgLength - 50) / 100));
}

function calculateSpecificity(prompt) {
  // 检查具体性指标
  const specificWords = ['具体', '详细', '精确', '明确', '特定', '例如', '比如'];
  const count = specificWords.reduce((sum, word) => sum + (prompt.includes(word) ? 1 : 0), 0);
  return Math.min(1, count / 3);
}

function analyzeStructure(prompt) {
  const hasTask = prompt.includes('任务') || prompt.includes('Task');
  const hasContext = prompt.includes('背景') || prompt.includes('Context');
  const hasFormat = prompt.includes('格式') || prompt.includes('Format');
  const hasExample = prompt.includes('例子') || prompt.includes('Example');
  
  return {
    hasTask,
    hasContext,
    hasFormat,
    hasExample,
    score: [hasTask, hasContext, hasFormat, hasExample].filter(Boolean).length / 4
  };
}

function getImprovements(original, optimized) {
  const improvements = [];
  
  if (optimized.length > original.length) {
    improvements.push('添加了更多结构化信息');
  }
  
  if (optimized.includes('任务:') && !original.includes('任务:')) {
    improvements.push('明确了任务定义');
  }
  
  if (optimized.includes('格式:') && !original.includes('格式:')) {
    improvements.push('添加了输出格式要求');
  }
  
  return improvements;
}

function calculateScore(prompt) {
  const analysis = analyzePrompt(prompt);
  return Math.round((analysis.clarity + analysis.specificity + analysis.structure.score) / 3 * 100);
}

function getSuggestions(prompt, category) {
  const suggestions = {
    clarity: [
      '使用更具体的动词替代模糊词汇',
      '添加明确的限定条件',
      '避免使用歧义表达',
      '使用主动语态'
    ],
    structure: [
      '添加任务定义部分',
      '包含背景信息',
      '指定输出格式',
      '提供示例'
    ],
    effectiveness: [
      '明确目标受众',
      '设定清晰的成功标准',
      '添加约束条件',
      '包含评估维度'
    ]
  };
  
  return suggestions[category] || suggestions.clarity;
}

// 默认路由
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});