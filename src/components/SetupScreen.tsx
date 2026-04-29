import { useState } from 'react';
import { useStore } from '../store';
import { KeyRound, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const SetupScreen = () => {
  const { setGithubToken, setGeminiToken } = useStore();
  const [ghToken, setGhToken] = useState('');
  const [gmToken, setGmToken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ghToken.trim()) {
      setGithubToken(ghToken.trim());
      if (gmToken.trim()) {
        setGeminiToken(gmToken.trim());
      }
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass"
        style={{
          padding: '3rem',
          borderRadius: '24px',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'var(--accent-glow)',
            color: 'var(--accent-primary)',
            marginBottom: '1rem'
          }}>
            <Sparkles size={32} />
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome to Knowhere</h1>
          <p>Your intelligent GitHub project tracker. All data is stored locally.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 500 }}>
              <span style={{ fontSize: '18px' }}>GH</span> GitHub Personal Access Token
            </label>
            <input 
              type="password" 
              required
              placeholder="github_pat_..."
              value={ghToken}
              onChange={(e) => setGhToken(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-main)',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
            <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Needed to fetch your repositories. Select "All repositories" with read-only access.</p>
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 500 }}>
              <KeyRound size={18} /> Google Gemini API Key <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>(Optional)</span>
            </label>
            <input 
              type="password" 
              placeholder="AI Studio API Key"
              value={gmToken}
              onChange={(e) => setGmToken(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-main)',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
            <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Required if you want to use the "Auto-Organize" magic button.</p>
          </div>

          <button 
            type="submit"
            style={{
              marginTop: '1rem',
              padding: '1rem',
              borderRadius: '8px',
              background: 'var(--accent-primary)',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'background 0.2s, transform 0.1s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#818cf8'}
            onMouseOut={(e) => e.currentTarget.style.background = 'var(--accent-primary)'}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Enter Knowhere <ArrowRight size={20} />
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default SetupScreen;
