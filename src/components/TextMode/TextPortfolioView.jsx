import React, { useState } from 'react';
import {
  Mail,
  Copy,
  Check,
  ExternalLink,
  Award,
  GraduationCap,
  Sparkles,
  FileText,
  Briefcase,
  Layers,
  ArrowUpRight,
  Printer
} from 'lucide-react';
import { profileData } from '../../data/profileData';
import { soundEngine } from '../../audio/soundEngine';

export default function TextPortfolioView({ onSwitchTo3D }) {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    soundEngine.playClick();
    navigator.clipboard.writeText(profileData.contact.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const handlePrint = () => {
    soundEngine.playClick();
    window.print();
  };

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 10,
        minHeight: '100vh',
        background: '#070b14',
        color: '#f8fafc',
        padding: '7rem 2rem 5rem 2rem',
        maxWidth: '940px',
        margin: '0 auto',
        fontFamily: "var(--font-body, 'Space Grotesk', sans-serif)",
        lineHeight: 1.65
      }}
      className="text-mode-container"
    >
      {/* ── Top Executive Banner ────────────────────────────────────────── */}
      <header
        style={{
          borderBottom: '1px solid rgba(56, 189, 248, 0.2)',
          paddingBottom: '2.5rem',
          marginBottom: '3rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2.5rem',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ flex: '1 1 480px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: 'var(--accent-orbit, #38bdf8)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '0.8rem',
              background: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              padding: '0.3rem 0.75rem',
              borderRadius: '20px'
            }}
          >
            <span>EXECUTIVE PROFILE · TEXT READER MODE</span>
          </div>

          <h1
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              marginBottom: '0.5rem'
            }}
          >
            {profileData.hero.name}
          </h1>

          <div
            style={{
              fontSize: '1.2rem',
              fontWeight: 600,
              color: 'var(--accent-cyan, #00f0ff)',
              marginBottom: '0.4rem'
            }}
          >
            {profileData.hero.title} · {profileData.hero.company}
          </div>

          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.84rem',
              color: 'var(--text-dim, #94a3b8)',
              marginBottom: '1.5rem'
            }}
          >
            {profileData.hero.location} · {profileData.contact.status}
          </p>

          {/* Quick Actions (Email, LinkedIn, Print, Switch to 3D) */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', alignItems: 'center' }}>
            <button
              onClick={handleCopyEmail}
              className="cyber-btn cyber-btn-outline"
              style={{ fontSize: '0.78rem', padding: '0.55rem 1.1rem' }}
            >
              {copiedEmail ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedEmail ? 'Email Copied!' : profileData.contact.email}</span>
            </button>

            <a
              href={profileData.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundEngine.playClick()}
              className="cyber-btn cyber-btn-outline"
              style={{ fontSize: '0.78rem', padding: '0.55rem 1.1rem', textDecoration: 'none' }}
            >
              <span>LinkedIn</span>
              <ExternalLink size={14} />
            </a>

            <button
              onClick={handlePrint}
              className="cyber-btn cyber-btn-outline no-print"
              style={{ fontSize: '0.78rem', padding: '0.55rem 1rem' }}
              title="Print or Save as PDF"
            >
              <Printer size={14} />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onSwitchTo3D}
              className="cyber-btn no-print"
              style={{ fontSize: '0.78rem', padding: '0.55rem 1.2rem', background: '#38bdf8', color: '#030712' }}
            >
              <Sparkles size={14} />
              <span>Switch to 3D View</span>
            </button>
          </div>
        </div>

        {/* Executive Portrait Thumbnail */}
        <div
          style={{
            width: '160px',
            height: '160px',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '2px solid rgba(56, 189, 248, 0.3)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
            flexShrink: 0
          }}
        >
          <img
            src="./textures/george_ninan_portrait.jpg"
            alt={profileData.hero.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </header>

      {/* ── Executive Summary ───────────────────────────────────────────── */}
      <section style={{ marginBottom: '3rem' }}>
        <h2
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            color: 'var(--accent-orbit, #38bdf8)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '0.8rem'
          }}
        >
          // 01 · Executive Summary
        </h2>
        <p
          style={{
            fontSize: '1.05rem',
            color: 'var(--text-main, #f8fafc)',
            lineHeight: 1.7,
            maxWidth: '820px'
          }}
        >
          {profileData.hero.summary}
        </p>

        {/* Quick Highlights Metrics */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            marginTop: '1.5rem'
          }}
        >
          {profileData.hero.quickMetrics.map((m, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(15, 23, 42, 0.65)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                borderRadius: '10px',
                padding: '1rem 1.2rem'
              }}
            >
              <div
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginBottom: '0.2rem'
                }}
              >
                {m.value}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: 'var(--accent-orbit, #38bdf8)'
                }}
              >
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Chronological Leadership Experience ─────────────────────────── */}
      <section style={{ marginBottom: '3.5rem' }}>
        <h2
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            color: 'var(--accent-orbit, #38bdf8)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            paddingBottom: '0.5rem'
          }}
        >
          // 02 · Leadership Chronicle (20+ Years)
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {profileData.roles.map((role) => (
            <article
              key={role.id}
              style={{
                background: 'rgba(13, 21, 38, 0.6)',
                borderLeft: `4px solid ${role.accent || 'var(--accent-orbit)'}`,
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                borderRight: '1px solid rgba(255, 255, 255, 0.06)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '8px',
                padding: '1.6rem'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  marginBottom: '0.4rem'
                }}
              >
                <h3
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    color: '#ffffff'
                  }}
                >
                  {role.company}
                </h3>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    color: 'var(--text-dim, #94a3b8)'
                  }}
                >
                  {role.period} ({role.duration})
                </span>
              </div>

              <div
                style={{
                  fontSize: '0.96rem',
                  fontWeight: 600,
                  color: role.accent,
                  marginBottom: '0.3rem'
                }}
              >
                {role.title} · {role.location}
              </div>

              <div
                style={{
                  fontSize: '0.86rem',
                  color: 'var(--text-muted, #cbd5e1)',
                  fontStyle: 'italic',
                  marginBottom: '1rem'
                }}
              >
                Domain: {role.domain}
              </div>

              <ul style={{ paddingLeft: '1.2rem', marginBottom: '1.2rem' }}>
                {role.highlights.map((bullet, bIdx) => (
                  <li
                    key={bIdx}
                    style={{
                      fontSize: '0.92rem',
                      color: 'var(--text-main, #f8fafc)',
                      marginBottom: '0.45rem',
                      lineHeight: 1.6
                    }}
                  >
                    {bullet}
                  </li>
                ))}
              </ul>

              {/* Skills Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                {role.skills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      color: 'var(--text-dim, #94a3b8)',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '4px'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Published White Papers & Frameworks ─────────────────────────── */}
      {profileData.posts && profileData.posts.length > 0 && (
        <section style={{ marginBottom: '3.5rem' }}>
          <h2
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              color: 'var(--accent-orbit, #38bdf8)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              paddingBottom: '0.5rem'
            }}
          >
            // 03 · Published Frameworks & White Papers
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.4rem' }}>
            {profileData.posts.map((post) => (
              <article
                key={post.id}
                style={{
                  background: 'rgba(13, 21, 38, 0.6)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  borderLeft: `4px solid ${post.accent}`,
                  borderRadius: '10px',
                  padding: '1.6rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      color: post.accent,
                      textTransform: 'uppercase',
                      marginBottom: '0.5rem'
                    }}
                  >
                    {post.category} · {post.readTime}
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: '#ffffff',
                      marginBottom: '0.8rem',
                      lineHeight: 1.4
                    }}
                  >
                    {post.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.88rem',
                      color: 'var(--text-muted, #cbd5e1)',
                      lineHeight: 1.6,
                      marginBottom: '1rem'
                    }}
                  >
                    {post.summary}
                  </p>
                </div>

                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cyber-btn cyber-btn-outline"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.78rem',
                    textDecoration: 'none',
                    padding: '0.6rem 1rem'
                  }}
                >
                  <span>Read Publication on LinkedIn</span>
                  <ExternalLink size={14} />
                </a>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ── Core Technical Expertise ────────────────────────────────────── */}
      <section style={{ marginBottom: '3.5rem' }}>
        <h2
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            color: 'var(--accent-orbit, #38bdf8)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            paddingBottom: '0.5rem'
          }}
        >
          // 04 · Core Technical & Leadership Expertise
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem' }}>
          {profileData.skillCategories.map((cat, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(13, 21, 38, 0.6)',
                border: `1px solid ${cat.color}35`,
                borderRadius: '8px',
                padding: '1.3rem'
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: cat.color,
                  marginBottom: '0.8rem',
                  textTransform: 'uppercase'
                }}
              >
                {cat.category}
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {cat.skills.map((skill, sIdx) => (
                  <li
                    key={sIdx}
                    style={{
                      fontSize: '0.86rem',
                      color: 'var(--text-main, #f8fafc)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <span style={{ color: cat.color }}>▹</span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Credentials & Education Split ───────────────────────────────── */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          marginBottom: '4rem'
        }}
      >
        {/* Credentials */}
        <div
          style={{
            background: 'rgba(13, 21, 38, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '1.6rem'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              color: 'var(--accent-orbit, #38bdf8)',
              marginBottom: '1rem',
              textTransform: 'uppercase'
            }}
          >
            <Award size={16} />
            <span>Credentials & Certifications</span>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {profileData.certifications.map((cert, idx) => (
              <li key={idx} style={{ fontSize: '0.86rem' }}>
                <div style={{ fontWeight: 600, color: '#ffffff' }}>{cert.title}</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-dim, #94a3b8)' }}>{cert.issuer}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* Academic Foundation */}
        <div
          style={{
            background: 'rgba(13, 21, 38, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '1.6rem'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              color: '#10b981',
              marginBottom: '1rem',
              textTransform: 'uppercase'
            }}
          >
            <GraduationCap size={16} />
            <span>Academic Foundation</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {profileData.education.map((edu, idx) => (
              <div key={idx}>
                <div style={{ fontSize: '0.94rem', fontWeight: 600, color: '#ffffff' }}>{edu.institution}</div>
                <div style={{ fontSize: '0.82rem', color: '#10b981' }}>
                  {edu.degree} · {edu.field}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.78rem',
          color: 'var(--text-dim, #94a3b8)'
        }}
      >
        <div>© {new Date().getFullYear()} George Ninan · Bengaluru, India</div>
        <button
          onClick={onSwitchTo3D}
          className="cyber-btn"
          style={{ padding: '0.5rem 1.2rem', fontSize: '0.75rem', background: '#38bdf8', color: '#030712' }}
        >
          <Sparkles size={14} />
          <span>Switch Back to 3D View</span>
        </button>
      </footer>
    </div>
  );
}

