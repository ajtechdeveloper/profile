import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Compass, Terminal, Shield, ChevronRight, FileText, Sparkles } from 'lucide-react';
import { soundEngine } from '../../audio/soundEngine';

export default function Navbar({
  activeStage,
  onNavigateStage,
  isOrbitActive = true,
  onToggleOrbit,
  isTextMode = false,
  onToggleTextMode
}) {
  const [isAudioActive, setIsAudioActive] = useState(false);

  useEffect(() => {
    return soundEngine.subscribe(({ isPlaying }) => {
      setIsAudioActive(isPlaying);
    });
  }, []);

  const handleAudioToggle = () => {
    const isActive = soundEngine.toggleMute();
    setIsAudioActive(isActive);
  };

  const navItems = [
    { id: 'hero', label: '01 · PRESENT' },
    { id: 'timeline', label: '02 · TIMELINE' },
    { id: 'skills', label: '03 · SKILLS' },
    { id: 'posts', label: '04 · POSTS' },
    { id: 'terminal', label: '05 · CONTACT' }
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 50,
        padding: '1.2rem 2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(180deg, rgba(6, 9, 14, 0.85) 0%, rgba(6, 9, 14, 0) 100%)',
        backdropFilter: 'blur(8px)',
        pointerEvents: 'none'
      }}
    >
      {/* Brand Monogram */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.9rem',
          pointerEvents: 'auto',
          cursor: 'pointer'
        }}
        onClick={() => {
          soundEngine.playClick();
          onNavigateStage('hero');
        }}
        onMouseEnter={() => soundEngine.playHover()}
      >
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            background: 'rgba(0, 240, 255, 0.08)',
            border: '1px solid var(--border-cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(0, 240, 255, 0.2)'
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.1rem',
              color: 'var(--accent-cyan)'
            }}
          >
            GN
          </span>
        </div>
        <div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              fontWeight: 700,
              letterSpacing: '0.02em',
              color: '#ffffff'
            }}
          >
            GEORGE NINAN
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              color: 'var(--accent-cyan)',
              letterSpacing: '0.08em'
            }}
          >
            DIRECTOR // AI & DISTRIBUTED SYSTEMS
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.8rem',
          pointerEvents: 'auto'
        }}
        className="hidden-mobile"
      >
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              soundEngine.playClick();
              onNavigateStage(item.id);
            }}
            onMouseEnter={() => soundEngine.playHover()}
            style={{
              background: 'transparent',
              border: 'none',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              color: activeStage === item.id ? 'var(--accent-cyan)' : 'var(--text-muted)',
              cursor: 'pointer',
              letterSpacing: '0.08em',
              transition: 'all 0.2s ease',
              padding: '0.4rem 0.6rem',
              borderRadius: '4px',
              borderBottom: activeStage === item.id ? '2px solid var(--accent-cyan)' : '2px solid transparent'
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Controls on Top Right: Text/3D Mode, Audio, Orbit */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          pointerEvents: 'auto'
        }}
      >
        {/* Toggle 3D vs Text Portfolio View */}
        <button
          onClick={onToggleTextMode}
          onMouseEnter={() => soundEngine.playHover()}
          title={isTextMode ? 'Switch to Immersive 3D Space Experience' : 'Switch to Clean Text / Reader Version'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem',
            background: isTextMode
              ? 'rgba(56, 189, 248, 0.22)'
              : 'rgba(255, 255, 255, 0.08)',
            border: isTextMode
              ? '1px solid var(--accent-orbit, #38bdf8)'
              : '1px solid rgba(255, 255, 255, 0.28)',
            borderRadius: '20px',
            padding: '0.45rem 0.95rem',
            cursor: 'pointer',
            color: isTextMode ? 'var(--accent-orbit, #38bdf8)' : '#ffffff',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.74rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            transition: 'all 0.25s ease',
            boxShadow: isTextMode
              ? '0 0 16px rgba(56, 189, 248, 0.4)'
              : '0 2px 8px rgba(0, 0, 0, 0.3)'
          }}
        >
          {isTextMode ? <Sparkles size={14} /> : <FileText size={14} />}
          <span>{isTextMode ? '3D VERSION' : 'TEXT VERSION'}</span>
        </button>

        {/* Procedural Web Audio Synthesizer Toggle */}
        {!isTextMode && (
          <button
            onClick={handleAudioToggle}
            onMouseEnter={() => soundEngine.playHover()}
            title={isAudioActive ? 'Mute Procedural Ambient Audio' : 'Enable Procedural Sci-Fi Audio'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: isAudioActive ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 255, 255, 0.04)',
              border: `1px solid ${isAudioActive ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.15)'}`,
              borderRadius: '20px',
              padding: '0.45rem 0.9rem',
              cursor: 'pointer',
              color: isAudioActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              transition: 'all 0.25s ease',
              boxShadow: isAudioActive ? '0 0 15px rgba(0, 240, 255, 0.3)' : 'none'
            }}
          >
            {isAudioActive ? <Volume2 size={15} /> : <VolumeX size={15} />}
            <span>{isAudioActive ? 'AUDIO · PLAYING' : 'AUDIO · MUTED'}</span>

            {/* Equalizer Bars when audio is running */}
            {isAudioActive && (
              <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '12px' }}>
                <span className="eq-bar eq-bar-1" />
                <span className="eq-bar eq-bar-2" />
                <span className="eq-bar eq-bar-3" />
              </div>
            )}
          </button>
        )}

        {/* Orbit Telemetry Interactive Control Button */}
        {!isTextMode && (
          <button
            onClick={onToggleOrbit}
            onMouseEnter={() => soundEngine.playHover()}
            title={isOrbitActive ? 'Pause 3D Orbital Simulation' : 'Resume 3D Orbital Simulation'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: isOrbitActive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
              border: `1px solid ${isOrbitActive ? 'rgba(16, 185, 129, 0.45)' : 'rgba(245, 158, 11, 0.45)'}`,
              borderRadius: '20px',
              padding: '0.45rem 0.85rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: isOrbitActive ? 'var(--accent-emerald)' : '#fbbf24',
              letterSpacing: '0.06em',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              boxShadow: isOrbitActive ? '0 0 12px rgba(16, 185, 129, 0.25)' : '0 0 12px rgba(245, 158, 11, 0.25)'
            }}
            className="hidden-mobile"
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: isOrbitActive ? 'var(--accent-emerald)' : '#fbbf24',
                boxShadow: isOrbitActive ? '0 0 8px var(--accent-emerald)' : '0 0 8px #fbbf24'
              }}
            />
            {isOrbitActive ? 'ORBIT ACTIVE' : 'ORBIT PAUSED'}
          </button>
        )}
      </div>

      <style>{`
        @keyframes eq1 { 0%, 100% { height: 3px; } 50% { height: 11px; } }
        @keyframes eq2 { 0%, 100% { height: 9px; } 50% { height: 4px; } }
        @keyframes eq3 { 0%, 100% { height: 4px; } 50% { height: 12px; } }
        .eq-bar { width: 2px; background: var(--accent-cyan); display: inline-block; }
        .eq-bar-1 { animation: eq1 0.7s infinite ease-in-out; }
        .eq-bar-2 { animation: eq2 0.5s infinite ease-in-out; }
        .eq-bar-3 { animation: eq3 0.8s infinite ease-in-out; }

        @media (max-width: 820px) {
          .hidden-mobile { display: none !important; }
        }
      `}</style>
    </header>
  );
}
