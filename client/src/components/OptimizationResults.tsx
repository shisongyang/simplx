import React, { useState } from 'react';

interface OptimizationResult {
  original: string;
  optimized: string;
  improvements: string[];
  score: number;
}

interface OptimizationResultsProps {
  result: OptimizationResult;
}

const OptimizationResults: React.FC<OptimizationResultsProps> = ({ result }) => {
  const [activeTab, setActiveTab] = useState<'comparison' | 'improvements'>('comparison');

  const getScoreClass = (score: number) => {
    if (score >= 90) return 'score-excellent';
    if (score >= 75) return 'score-good';
    if (score >= 60) return 'score-fair';
    return 'score-poor';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return '优秀';
    if (score >= 75) return '良好';
    if (score >= 60) return '一般';
    return '需改进';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // 可以添加复制成功的提示
    });
  };

  return (
    <div className="optimization-results fade-in">
      <div className="card">
        <div className="results-header">
          <h3>✨ 优化结果</h3>
          <div className={`score-badge ${getScoreClass(result.score)}`}>
            {result.score}分 - {getScoreLabel(result.score)}
          </div>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'comparison' ? 'active' : ''}`}
            onClick={() => setActiveTab('comparison')}
          >
            📋 对比结果
          </button>
          <button
            className={`tab ${activeTab === 'improvements' ? 'active' : ''}`}
            onClick={() => setActiveTab('improvements')}
          >
            🔧 改进点
          </button>
        </div>

        {activeTab === 'comparison' && (
          <div className="tab-content">
            <div className="prompt-comparison">
              <div className="prompt-section">
                <div className="prompt-header">
                  <h4>原始提示词</h4>
                  <button
                    className="copy-btn"
                    onClick={() => copyToClipboard(result.original)}
                    title="复制原始提示词"
                  >
                    📋
                  </button>
                </div>
                <div className="prompt-display prompt-original">
                  {result.original}
                </div>
              </div>

              <div className="prompt-section">
                <div className="prompt-header">
                  <h4>优化后提示词</h4>
                  <button
                    className="copy-btn"
                    onClick={() => copyToClipboard(result.optimized)}
                    title="复制优化后提示词"
                  >
                    📋
                  </button>
                </div>
                <div className="prompt-display prompt-optimized">
                  {result.optimized}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'improvements' && (
          <div className="tab-content">
            <h4 style={{ marginBottom: '1rem' }}>主要改进点：</h4>
            {result.improvements.length > 0 ? (
              <ul className="improvement-list">
                {result.improvements.map((improvement, index) => (
                  <li key={index} className="improvement-item">
                    <span className="improvement-icon">✓</span>
                    {improvement}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: '#6c757d', fontStyle: 'italic' }}>
                您的提示词已经很优秀了！
              </p>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .tabs {
          display: flex;
          border-bottom: 2px solid #e1e5e9;
          margin-bottom: 1.5rem;
        }
        
        .tab {
          background: none;
          border: none;
          padding: 0.75rem 1rem;
          cursor: pointer;
          font-size: 1rem;
          color: #6c757d;
          border-bottom: 2px solid transparent;
          transition: all 0.3s ease;
        }
        
        .tab.active {
          color: #667eea;
          border-bottom-color: #667eea;
        }
        
        .tab:hover {
          color: #667eea;
        }
        
        .tab-content {
          animation: fadeIn 0.3s ease-in;
        }
        
        .prompt-comparison {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .prompt-section h4 {
          margin-bottom: 0.5rem;
          color: #2c3e50;
        }
        
        .prompt-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        
        .copy-btn {
          background: #f8f9fa;
          border: 1px solid #e1e5e9;
          border-radius: 4px;
          padding: 0.25rem 0.5rem;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }
        
        .copy-btn:hover {
          background: #e9ecef;
          border-color: #667eea;
        }
        
        @media (max-width: 768px) {
          .tabs {
            flex-direction: column;
          }
          
          .tab {
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
};

export default OptimizationResults;