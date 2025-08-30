import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <h1 className="logo">
            <span className="logo-icon">🚀</span>
            提示词优化器
          </h1>
          <p className="subtitle">
            智能优化您的AI提示词，提升对话效果
          </p>
        </div>
      </div>
      <style jsx>{`
        .header {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          padding: 2rem 0;
        }
        
        .header-content {
          text-align: center;
          color: white;
        }
        
        .logo {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .logo-icon {
          font-size: 2rem;
        }
        
        .subtitle {
          font-size: 1.1rem;
          opacity: 0.9;
          max-width: 600px;
          margin: 0 auto;
        }
        
        @media (max-width: 768px) {
          .logo {
            font-size: 2rem;
          }
          
          .subtitle {
            font-size: 1rem;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;