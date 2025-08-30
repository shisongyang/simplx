import React, { useState } from 'react';
import './App.css';
import PromptInput from './components/PromptInput';
import OptimizationResults from './components/OptimizationResults';
import AnalysisPanel from './components/AnalysisPanel';
import Header from './components/Header';

interface OptimizationResult {
  original: string;
  optimized: string;
  improvements: string[];
  score: number;
}

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

function App() {
  const [prompt, setPrompt] = useState('');
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleOptimize = async (promptText: string, options: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/optimize-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: promptText,
          ...options
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setOptimizationResult(data);
      }
    } catch (error) {
      console.error('优化失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async (promptText: string) => {
    try {
      const response = await fetch('/api/analyze-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: promptText }),
      });
      
      const data = await response.json();
      if (data.success) {
        setAnalysisResult(data.analysis);
      }
    } catch (error) {
      console.error('分析失败:', error);
    }
  };

  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <div className="container">
          <div className="grid">
            <div className="input-section">
              <PromptInput
                prompt={prompt}
                setPrompt={setPrompt}
                onOptimize={handleOptimize}
                onAnalyze={handleAnalyze}
                loading={loading}
              />
            </div>
            
            <div className="results-section">
              {optimizationResult && (
                <OptimizationResults result={optimizationResult} />
              )}
              
              {analysisResult && (
                <AnalysisPanel analysis={analysisResult} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;