import React, { useEffect } from 'react';
import { X, CheckCircle2, Cpu, Calendar, MapPin, Briefcase } from 'lucide-react';
import { soundEngine } from '../../audio/soundEngine';

export default function MilestoneModal({ role, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!role) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background: 'rgba(6, 9, 14, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)'
      }}
      onClick={onClose}
    >
      <div
        style={{
          maxWidth: '680px',
          width: '100%',
          maxHeight: '85vh',
          overflowY: 'auto',
          background: 'rgba(11, 18, 30, 0.95)',
          border: `1px solid ${role.accent || 'var(--accent-cyan)'}`,
          borderRadius: '16px',
          padding: '2.4rem',
          position: 'relative',
          boxShadow: `0 25px 70px rgba(0, 0, 0, 0.9), 0 0 40px ${role.accent}33`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          onMouseEnter={() => soundEngine.playHover()}
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <X size={18} />
        </button>

        {/* Header Telemetry */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: role.accent,
              background: `${role.accent}15`,
              border: `1px solid ${role.accent}44`,
              padding: '0.25rem 0.7rem',
              borderRadius: '4px'
            }}
          >
            STAGE 0{role.step} // MISSION ARCHIVE
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            CHRONICLE SPECIFICATION
          </span>
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.85rem',
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.25,
            marginBottom: '0.4rem',
            overflow: 'visible'
          }}
        >
          {role.company}
        </h2>

        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.15rem',
            fontWeight: 600,
            color: role.accent,
            marginBottom: '1.2rem'
          }}
        >
          {role.title}
        </div>

        {/* Metadata Badges */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.2rem',
            padding: '1rem 0',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '1.6rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <Calendar size={15} color={role.accent} />
            <span>{role.period} ({role.duration})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <MapPin size={15} color={role.accent} />
            <span>{role.location}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <Briefcase size={15} color={role.accent} />
            <span>{role.domain}</span>
          </div>
        </div>

        {/* Detailed Chronicle Bullet Points */}
        <div style={{ marginBottom: '1.8rem' }}>
          <h4
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '1rem'
            }}
          >
            Engineering Outcomes & Architectural Deliverables
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {role.highlights.map((item, idx) => (
              <li
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  fontSize: '0.92rem',
                  lineHeight: '1.6',
                  color: 'var(--text-main)'
                }}
              >
                <CheckCircle2 size={16} color={role.accent} style={{ flexShrink: 0, marginTop: '4px' }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Technology & Core Competency Tags */}
        <div>
          <h4
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '0.8rem'
            }}
          >
            Domain Stack & Systems
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {role.skills.map((skill, idx) => (
              <span
                key={idx}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  color: '#ffffff',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '6px',
                  padding: '0.3rem 0.75rem'
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
