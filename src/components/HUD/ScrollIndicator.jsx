import React from 'react';
import { soundEngine } from '../../audio/soundEngine';

export default function ScrollIndicator({ activeSectionIndex, totalSections, onJumpToSection }) {
  const stages = [
    { label: '01 HERO', shortLabel: '01 HERO', id: 'hero' },
    { label: '02 SAGE', shortLabel: '02 SAGE', id: 'sage' },
    { label: '03 APPTIO', shortLabel: '03 APPTIO', id: 'apptio' },
    { label: '04 JPMC', shortLabel: '04 JPMC', id: 'jpmorgan-sr' },
    { label: '05 OLA', shortLabel: '05 OLA', id: 'ola' },
    { label: '06 FICO', shortLabel: '06 FICO', id: 'fico' },
    { label: '07 METABYTE', shortLabel: '07 META', id: 'metabyte' },
    { label: '08 JP MORGAN', shortLabel: '08 JPMC', id: 'jpmorgan-bpm' },
    { label: '09 SATYAM', shortLabel: '09 SATYAM', id: 'satyam' },
    { label: '10 SKILLS', shortLabel: '10 SKILLS', id: 'skills' },
    { label: '11 POSTS', shortLabel: '11 POSTS', id: 'posts' },
    { label: '12 CONTACT', shortLabel: '12 CONTACT', id: 'terminal' }
  ];

  return (
    <aside
      className="scroll-indicator-dock"
      style={{
        position: 'fixed',
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '0.55rem',
        pointerEvents: 'none'
      }}
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
              gap: '0.5rem',
              cursor: 'pointer',
              pointerEvents: 'auto',
              padding: '2px 4px',
              position: 'relative',
              transition: 'all 0.2s ease'
            }}
            title={stage.label}
          >
            {/* Desktop Label (always visible) & Mobile Active Floating Badge */}
            <span
              className={`scroll-indicator-label ${isActive ? 'is-active' : ''}`}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                color: isActive ? 'var(--accent-cyan)' : 'var(--text-dim)',
                letterSpacing: '0.06em',
                opacity: isActive ? 1 : 0.6,
                transform: isActive ? 'translateX(-3px)' : 'none',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {stage.label}
            </span>

            {/* Indicator Dot / Pill */}
            <div
              className={`scroll-indicator-pip ${isActive ? 'is-active' : ''}`}
              style={{
                width: isActive ? '18px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: isActive ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.25)',
                boxShadow: isActive ? '0 0 10px var(--accent-cyan)' : 'none',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                flexShrink: 0
              }}
            />
          </div>
        );
      })}

      <style>{`
        /* Desktop Positioning */
        .scroll-indicator-dock {
          right: 2rem;
          top: 50%;
          transform: translateY(-50%);
        }

        /* Mobile / Tablet Responsive Dock */
        @media (max-width: 900px) {
          .scroll-indicator-dock {
            right: 0.35rem;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(6, 9, 14, 0.72);
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
            border: 1px solid rgba(56, 189, 248, 0.25);
            border-radius: 20px;
            padding: 0.5rem 0.2rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
            gap: 0.4rem;
          }

          /* Hide non-active labels on mobile to keep screen uncluttered */
          .scroll-indicator-label {
            display: none !important;
          }

          /* Show floating tooltip badge ONLY for the currently active stage on mobile */
          .scroll-indicator-label.is-active {
            display: block !important;
            position: absolute;
            right: 18px;
            background: rgba(6, 9, 14, 0.95);
            border: 1px solid var(--accent-cyan);
            border-radius: 4px;
            padding: 0.2rem 0.45rem;
            box-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
            font-size: 0.6rem;
            color: var(--accent-cyan);
          }

          /* Mobile Pip Sizes */
          .scroll-indicator-pip {
            width: 5px !important;
            height: 5px !important;
            border-radius: 50% !important;
          }

          .scroll-indicator-pip.is-active {
            width: 5px !important;
            height: 16px !important;
            border-radius: 3px !important;
          }
        }
      `}</style>
    </aside>
  );
}
