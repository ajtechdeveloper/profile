import React, { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { soundEngine } from '../../audio/soundEngine';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('INITIALIZING SPATIAL ENGINE...');
  const [isReady, setIsReady] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsReady(true);
          setStatusText('SPATIAL ENGINE CALIBRATED · READY');
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 18) + 12;
        if (next > 35 && next < 75) {
          setStatusText('CALIBRATING 3D ORBITAL COORDINATES...');
        } else if (next >= 75) {
          setStatusText('SPATIAL ENGINE READY');
        }
        return Math.min(next, 100);
      });
    }, 70);

    return () => clearInterval(interval);
  }, []);

  const handleEnter = () => {
    soundEngine.playClick();
    soundEngine.startAudio();
    soundEngine.playVoiceover();
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 450);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        background: '#06090e',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        opacity: isExiting ? 0 : 1,
        transition: 'opacity 0.45s ease-out',
        pointerEvents: isExiting ? 'none' : 'auto'
      }}
    >
      {/* Central Monogram */}
      <div
        style={{
          width: '70px',
          height: '70px',
          borderRadius: '16px',
          background: 'rgba(0, 240, 255, 0.08)',
          border: '1px solid var(--border-cyan)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2rem',
          boxShadow: '0 0 35px rgba(0, 240, 255, 0.3)'
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            fontWeight: 800,
            color: 'var(--accent-cyan)'
          }}
        >
          GN
        </span>
      </div>

      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.6rem',
          fontWeight: 700,
          color: '#ffffff',
          marginBottom: '0.4rem',
          letterSpacing: '0.04em'
        }}
      >
        GEORGE NINAN
      </h1>
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          color: 'var(--accent-cyan)',
          letterSpacing: '0.08em',
          marginBottom: '2.5rem'
        }}
      >
        SPATIAL TIMELINE PORTFOLIO · 3D FLIGHT PATH
      </p>

      {/* Futuristic Progress Bar */}
      <div
        style={{
          maxWidth: '380px',
          width: '100%',
          marginBottom: '1rem'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            marginBottom: '0.5rem'
          }}
        >
          <span>{statusText}</span>
          <span style={{ color: 'var(--accent-cyan)' }}>{progress}%</span>
        </div>

        <div
          style={{
            width: '100%',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '2px',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #0ea5e9, #00f0ff)',
              boxShadow: '0 0 12px var(--accent-cyan)',
              transition: 'width 0.2s ease-out'
            }}
          />
        </div>
      </div>

      {/* Enter Action Button Container */}
      <div
        style={{
          minHeight: '60px',
          marginTop: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {isReady ? (
          <button
            onClick={handleEnter}
            onMouseEnter={() => soundEngine.playHover()}
            className="cyber-btn"
            style={{
              padding: '0.9rem 2.4rem',
              fontSize: '0.92rem',
              letterSpacing: '0.08em',
              animation: 'pulseGlow 2s infinite ease-in-out',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}
          >
            <span>ENTER</span>
            <ChevronRight size={18} />
          </button>
        ) : (
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.74rem',
              color: 'var(--text-dim)',
              letterSpacing: '0.05em'
            }}
          >
            INITIALIZING SPATIAL ENGINE...
          </div>
        )}
      </div>
    </div>
  );
}
