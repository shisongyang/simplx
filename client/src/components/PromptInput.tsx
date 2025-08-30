import React, { useState } from 'react';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onOptimize: (prompt: string, options: any) => void;
  onAnalyze: (prompt: string) => void;
  loading: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({
  prompt,
  setPrompt,
  onOptimize,
  onAnalyze,
  loading
}) => {
  const [targetAudience, setTargetAudience] = useState('general');
  const [style, setStyle] = useState('structured');
  const [tone, setTone] = useState('professional');

  const handleOptimize = () => {
    if (prompt.trim()) {
      onOptimize(prompt, { targetAudience, style, tone });
    }
  };

  const handleAnalyze = () => {
    if (prompt.trim()) {
      onAnalyze(prompt);
    }
  };

  const handleExample = (examplePrompt: string) => {
    setPrompt(examplePrompt);
  };

  const examples = [
    "帮我写一个关于机器学习的文章",
    "解释一下区块链技术的工作原理",
    "设计一个用户注册流程",
    "分析这个数据集的特征"
  ];

  return (
    <div className="prompt-input-container">
      <div className="card">
        <h3>📝 输入您的提示词</h3>
        
        <div className="form-group">
          <label className="form-label">提示词内容</label>
          <textarea
            className="form-control textarea"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="请输入您想要优化的提示词..."
            rows={6}
          />
        </div>

        <div className="options-grid">
          <div className="form-group">
            <label className="form-label">目标受众</label>
            <select
              className="form-control select"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
            >
              <option value="general">普通用户</option>
              <option value="technical">技术专家</option>
              <option value="creative">创意工作者</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">风格</label>
            <select
              className="form-control select"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
            >
              <option value="structured">结构化</option>
              <option value="conversational">对话式</option>
              <option value="detailed">详细说明</option>
              <option value="concise">简洁明了</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">语调</label>
            <select
              className="form-control select"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              <option value="professional">专业</option>
              <option value="friendly">友好</option>
              <option value="formal">正式</option>
              <option value="casual">随意</option>
            </select>
          </div>
        </div>

        <div className="button-group">
          <button
            className="btn"
            onClick={handleOptimize}
            disabled={!prompt.trim() || loading}
          >
            {loading ? (
              <span className="loading">
                <span className="spinner"></span>
                优化中...
              </span>
            ) : (
              '🎯 优化提示词'
            )}
          </button>
          
          <button
            className="btn btn-secondary"
            onClick={handleAnalyze}
            disabled={!prompt.trim() || loading}
          >
            📊 分析提示词
          </button>
        </div>
      </div>

      <div className="card">
        <h3>💡 示例提示词</h3>
        <p style={{ marginBottom: '1rem', color: '#6c757d' }}>
          点击下方示例快速开始：
        </p>
        <div className="examples-grid">
          {examples.map((example, index) => (
            <button
              key={index}
              className="example-btn"
              onClick={() => handleExample(example)}
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .button-group {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        
        .examples-grid {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .example-btn {
          background: #f8f9fa;
          border: 1px solid #e1e5e9;
          padding: 0.75rem;
          border-radius: 6px;
          cursor: pointer;
          text-align: left;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }
        
        .example-btn:hover {
          background: #e9ecef;
          border-color: #667eea;
          transform: translateX(4px);
        }
      `}</style>
    </div>
  );
};

export default PromptInput;