import React from 'react';
import { soundEngine } from '../../audio/soundEngine';

export default function ScrollIndicator({ activeSectionIndex, totalSections, onJumpToSection }) {
  const stages = [
    { label: '01 HERO', id: 'hero' },
    { label: '02 SAGE', id: 'sage' },
    { label: '03 APPTIO', id: 'apptio' },
    { label: '04 JPMC', id: 'jpmorgan-sr' },
    { label: '05 OLA', id: 'ola' },
    { label: '06 FICO', id: 'fico' },
    { label: '07 METABYTE', id: 'metabyte' },
    { label: '08 JP MORGAN', id: 'jpmorgan-bpm' },
    { label: '09 SATYAM', id: 'satyam' },
    { label: '10 SKILLS', id: 'skills' },
    { label: '11 POSTS', id: 'posts' },
    { label: '12 CONTACT', id: 'terminal' }
  ];

  return (
    <aside
      style={{
        position: 'fixed',
        right: '2rem',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '0.6rem',
        pointerEvents: 'none'
      }}
      className="hidden-mobile-aside"
    >
      {stages.map((stage, idx) => {
        const isActive = activeSectionIndex === idx;
        return (
          <div
            key={stage.id}
            onClick={() => {
              soundEngine.playClick();
              onJumpToSection(stage.id);
            }}
            onMouseEnter={() => soundEngine.playHover()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              cursor: 'pointer',
              pointerEvents: 'auto',
              transition: 'all 0.2s ease'
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                color: isActive ? 'var(--accent-cyan)' : 'var(--text-dim)',
                letterSpacing: '0.06em',
                opacity: isActive ? 1 : 0.6,
                transform: isActive ? 'translateX(-4px)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              {stage.label}
            </span>
            <div
              style={{
                width: isActive ? '18px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: isActive ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.2)',
                boxShadow: isActive ? '0 0 10px var(--accent-cyan)' : 'none',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            />
          </div>
        );
      })}

      <style>{`
        @media (max-width: 900px) {
          .hidden-mobile-aside { display: none !important; }
        }
      `}</style>
    </aside>
  );
}
