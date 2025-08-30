import React from 'react';

interface AnalysisResult {
  length: number;
  wordCount: number;
  clarity: number;
  specificity: number;
  structure: {
    hasTask: boolean;
    hasContext: boolean;
    hasFormat: boolean;
    hasExample: boolean;
    score: number;
  };
  suggestions: string[];
}

interface AnalysisPanelProps {
  analysis: AnalysisResult;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ analysis }) => {
  const formatPercentage = (value: number) => Math.round(value * 100);

  const getProgressBarClass = (value: number) => {
    if (value >= 0.8) return 'progress-excellent';
    if (value >= 0.6) return 'progress-good';
    if (value >= 0.4) return 'progress-fair';
    return 'progress-poor';
  };

  return (
    <div className="analysis-panel fade-in">
      <div className="card">
        <h3>📊 提示词分析</h3>
        
        <div className="analysis-grid">
          <div className="metric-card">
            <div className="metric-value">{analysis.length}</div>
            <div className="metric-label">字符数</div>
          </div>
          
          <div className="metric-card">
            <div className="metric-value">{analysis.wordCount}</div>
            <div className="metric-label">词汇数</div>
          </div>
          
          <div className="metric-card">
            <div className="metric-value">{formatPercentage(analysis.clarity)}%</div>
            <div className="metric-label">清晰度</div>
          </div>
          
          <div className="metric-card">
            <div className="metric-value">{formatPercentage(analysis.specificity)}%</div>
            <div className="metric-label">具体性</div>
          </div>
        </div>

        <div className="progress-section">
          <h4>质量指标</h4>
          
          <div className="progress-item">
            <div className="progress-label">
              <span>清晰度</span>
              <span>{formatPercentage(analysis.clarity)}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className={`progress-fill ${getProgressBarClass(analysis.clarity)}`}
                style={{ width: `${formatPercentage(analysis.clarity)}%` }}
              ></div>
            </div>
          </div>
          
          <div className="progress-item">
            <div className="progress-label">
              <span>具体性</span>
              <span>{formatPercentage(analysis.specificity)}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className={`progress-fill ${getProgressBarClass(analysis.specificity)}`}
                style={{ width: `${formatPercentage(analysis.specificity)}%` }}
              ></div>
            </div>
          </div>
          
          <div className="progress-item">
            <div className="progress-label">
              <span>结构完整性</span>
              <span>{formatPercentage(analysis.structure.score)}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className={`progress-fill ${getProgressBarClass(analysis.structure.score)}`}
                style={{ width: `${formatPercentage(analysis.structure.score)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="structure-analysis">
          <h4>结构分析</h4>
          <div className="structure-grid">
            <div className={`structure-item ${analysis.structure.hasTask ? 'has-feature' : 'missing-feature'}`}>
              <span className="structure-icon">{analysis.structure.hasTask ? '✅' : '❌'}</span>
              <span>任务定义</span>
            </div>
            <div className={`structure-item ${analysis.structure.hasContext ? 'has-feature' : 'missing-feature'}`}>
              <span className="structure-icon">{analysis.structure.hasContext ? '✅' : '❌'}</span>
              <span>背景信息</span>
            </div>
            <div className={`structure-item ${analysis.structure.hasFormat ? 'has-feature' : 'missing-feature'}`}>
              <span className="structure-icon">{analysis.structure.hasFormat ? '✅' : '❌'}</span>
              <span>输出格式</span>
            </div>
            <div className={`structure-item ${analysis.structure.hasExample ? 'has-feature' : 'missing-feature'}`}>
              <span className="structure-icon">{analysis.structure.hasExample ? '✅' : '❌'}</span>
              <span>示例说明</span>
            </div>
          </div>
        </div>

        {analysis.suggestions.length > 0 && (
          <div className="suggestions-section">
            <h4>💡 改进建议</h4>
            <ul className="suggestions-list">
              {analysis.suggestions.map((suggestion, index) => (
                <li key={index} className="suggestion-item">
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <style jsx>{`
        .progress-section {
          margin: 1.5rem 0;
        }
        
        .progress-section h4 {
          margin-bottom: 1rem;
          color: #2c3e50;
        }
        
        .progress-item {
          margin-bottom: 1rem;
        }
        
        .progress-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          color: #495057;
        }
        
        .progress-bar {
          height: 8px;
          background: #e9ecef;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          transition: width 0.5s ease;
          border-radius: 4px;
        }
        
        .progress-excellent {
          background: linear-gradient(90deg, #28a745, #20c997);
        }
        
        .progress-good {
          background: linear-gradient(90deg, #17a2b8, #20c997);
        }
        
        .progress-fair {
          background: linear-gradient(90deg, #ffc107, #fd7e14);
        }
        
        .progress-poor {
          background: linear-gradient(90deg, #dc3545, #e83e8c);
        }
        
        .structure-analysis {
          margin: 1.5rem 0;
        }
        
        .structure-analysis h4 {
          margin-bottom: 1rem;
          color: #2c3e50;
        }
        
        .structure-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 0.5rem;
        }
        
        .structure-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          border-radius: 6px;
          font-size: 0.9rem;
        }
        
        .has-feature {
          background: #d4edda;
          color: #155724;
        }
        
        .missing-feature {
          background: #f8d7da;
          color: #721c24;
        }
        
        .structure-icon {
          font-size: 0.875rem;
        }
        
        .suggestions-section {
          margin-top: 1.5rem;
        }
        
        .suggestions-section h4 {
          margin-bottom: 1rem;
          color: #2c3e50;
        }
      `}</style>
    </div>
  );
};

export default OptimizationResults;