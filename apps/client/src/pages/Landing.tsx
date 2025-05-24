import React from 'react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <div className="logo">MindMate</div>
        <nav>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/signup" className="nav-link signup-btn">Sign Up</Link>
        </nav>
      </header>
      
      <main className="landing-main">
        <div className="hero-section">
          <h1>Boost Your Learning with AI</h1>
          <p className="subtitle">
            MindMate helps you organize notes, generate summaries, create quizzes,
            and chat with AI to enhance your study experience.
          </p>
          <div className="cta-buttons">
            <Link to="/signup" className="cta-button primary">Get Started</Link>
            <Link to="/login" className="cta-button secondary">Login</Link>
          </div>
        </div>

        <div className="features-section">
          <div className="feature-card">
            <h3>Organize Notes</h3>
            <p>Create and organize your notes in folders and subfolders.</p>
          </div>
          <div className="feature-card">
            <h3>AI Summaries</h3>
            <p>Generate concise summaries of your notes with AI assistance.</p>
          </div>
          <div className="feature-card">
            <h3>Practice Quizzes</h3>
            <p>Create quizzes based on your notes to test your knowledge.</p>
          </div>
          <div className="feature-card">
            <h3>AI Chat Assistant</h3>
            <p>Chat with an AI assistant to answer your questions.</p>
          </div>
        </div>
      </main>
      
      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} MindMate. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
