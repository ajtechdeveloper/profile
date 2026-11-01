import React, { useState, useEffect, useRef, useCallback } from 'react';
import SceneCanvas from './components/Canvas/SceneCanvas';
import Navbar from './components/HUD/Navbar';
import ScrollIndicator from './components/HUD/ScrollIndicator';
import MilestoneModal from './components/UI/MilestoneModal';
import LoadingScreen from './components/UI/LoadingScreen';
import TextPortfolioView from './components/TextMode/TextPortfolioView';
import { profileData } from './data/profileData';
import { soundEngine } from './audio/soundEngine';
import {
  ArrowDown,
  ExternalLink,
  Mail,
  Copy,
  Check,
  Award,
  GraduationCap,
  Sparkles,
  Terminal,
  Layers,
  Cpu,
  Shield,
  ChevronRight,
  Globe,
  Radio,
  FileText,
  BookOpen
} from 'lucide-react';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);
  const [activeStage, setActiveStage] = useState('hero');
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [hoveredSkillName, setHoveredSkillName] = useState(null);
  const [isOrbitActive, setIsOrbitActive] = useState(true);
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [isTextMode, setIsTextMode] = useState(false);

  const handleToggleOrbit = () => {
    soundEngine.playClick();
    setIsOrbitActive((prev) => !prev);
  };

  const handleToggleTextMode = () => {
    soundEngine.playClick();
    setIsTextMode((prev) => {
      const next = !prev;
      if (next) {
        // Silences background synth audio when switching to calm reader mode
        soundEngine.stopAudio();
      }
      return next;
    });
  };

  const handleToggleVoiceover = () => {
    soundEngine.toggleVoiceover();
  };

  // Subscribe to sound engine state (audio playing & voiceover state)
  useEffect(() => {
    return soundEngine.subscribe(({ isVoicePlaying }) => {
      setIsVoicePlaying(Boolean(isVoicePlaying));
    });
  }, []);

  // Initialize sound engine on mount so user gesture immediately unlocks audio
  useEffect(() => {
    soundEngine.init();
  }, []);

  // ── Intersection Observer for scroll reveal ───────────────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Stagger badge-chip children
            const chips = entry.target.querySelectorAll('.badge-chip');
            chips.forEach((chip, i) => {
              setTimeout(() => chip.classList.add('visible'), i * 55);
            });
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    // Observe all reveal targets after a short mount delay
    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal, .reveal-fade').forEach((el) => observer.observe(el));
    }, 300);

    return () => { clearTimeout(timer); observer.disconnect(); };
  }, []);

  // Jump to section with audio feedback
  const jumpToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      soundEngine.playStageTransition();
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Track active section during scroll
  useEffect(() => {
    const sectionIds = [
      'hero',
      'sage',
      'apptio',
      'jpmorgan-sr',
      'ola',
      'fico',
      'metabyte',
      'jpmorgan-bpm',
      'satyam',
      'skills',
      'posts',
      'terminal'
    ];

    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.45;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && scrollPos >= el.offsetTop) {
          setActiveSectionIndex(i);
          if (i === 0) setActiveStage('hero');
          else if (i >= 1 && i <= 8) setActiveStage('timeline');
          else if (i === 9) setActiveStage('skills');
          else if (i === 10) setActiveStage('posts');
          else if (i === 11) setActiveStage('terminal');
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profileData.contact.email);
    setCopiedEmail(true);
    soundEngine.playClick();
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', backgroundColor: '#050811' }}>
      {/* Loading Overlay */}
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {/* Cinematic Spatial Vignette (Transparent over real space environment) */}
      {!isTextMode && <div className="cyber-vignette" />}

      {/* 3D WebGL Canvas Layer (Real Earth Orbit, Deep-Space Nebulae & Lunar Platform) */}
      {!isTextMode && (
        <SceneCanvas onHoverSkill={setHoveredSkillName} isOrbitActive={isOrbitActive} />
      )}

      {/* Floating HUD Elements */}
      <Navbar
        activeStage={activeStage}
        onNavigateStage={jumpToSection}
        isOrbitActive={isOrbitActive}
        onToggleOrbit={handleToggleOrbit}
        isTextMode={isTextMode}
        onToggleTextMode={handleToggleTextMode}
      />

      {!isTextMode && (
        <ScrollIndicator
          activeSectionIndex={activeSectionIndex}
          totalSections={12}
          onJumpToSection={jumpToSection}
        />
      )}

      {/* Detailed Milestone Modal */}
      {!isTextMode && selectedRole && (
        <MilestoneModal role={selectedRole} onClose={() => setSelectedRole(null)} />
      )}

      {/* Accessible Text Mode Portfolio View */}
      {isTextMode && (
        <TextPortfolioView
          onSwitchTo3D={() => {
            soundEngine.playClick();
            setIsTextMode(false);
          }}
        />
      )}

      {/* Foreground Content Scroller (3D Mode) */}
      {!isTextMode && (
        <main className="content-scroller">
        {/* ========================================================
            STAGE 1: THE PRESENT - HERO LANDING (REAL SPATIAL)
           ======================================================== */}
        <section
          id="hero"
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 'clamp(5.5rem, 10vh, 7rem) 6% 4rem 6%',
            position: 'relative'
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
              gap: '2.5rem',
              alignItems: 'center',
              maxWidth: '1200px',
              width: '100%'
            }}
          >
            {/* Left Column: Text & Metrics */}
            <div>
              <div className="telemetry-tag">
                <span className="pulse-dot" />
                <span>ENGINEERING LEADERSHIP · AI & DISTRIBUTED SYSTEMS</span>
              </div>

              <h1
                style={{
                  fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif",
                  fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  lineHeight: 1.3,
                  paddingBottom: '0.12em',
                  marginBottom: '0.85rem',
                  color: '#ffffff',
                  textShadow: '0 0 30px rgba(56, 189, 248, 0.28), 0 4px 20px rgba(0, 0, 0, 0.9)',
                  overflow: 'visible'
                }}
              >
                {profileData.hero.name}
              </h1>

              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(0.95rem, 1.6vw, 1.2rem)',
                  color: 'var(--accent-orbit)',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  marginBottom: '1.4rem'
                }}
              >
                {profileData.hero.title} · {profileData.hero.company}
              </div>

              <p
                style={{
                  fontSize: 'clamp(0.95rem, 1.3vw, 1.12rem)',
                  color: 'var(--text-muted)',
                  lineHeight: '1.7',
                  marginBottom: '2.4rem',
                  maxWidth: '620px'
                }}
              >
                {profileData.hero.summary}
              </p>

              {/* Quick Metrics Bar */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 130px), 1fr))',
                  gap: '0.75rem',
                  marginBottom: '2.5rem',
                  maxWidth: '640px'
                }}
              >
                {profileData.hero.quickMetrics.map((metric, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'rgba(15, 23, 42, 0.75)',
                      border: '1px solid rgba(56, 189, 248, 0.25)',
                      backdropFilter: 'blur(16px)',
                      padding: '0.9rem 0.95rem',
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      minHeight: '94px',
                      overflow: 'visible'
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: metric.value.length > 14 ? '0.95rem' : metric.value.length > 8 ? '1.15rem' : '1.35rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        lineHeight: '1.3',
                        letterSpacing: '-0.01em',
                        marginBottom: '0.35rem',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        overflow: 'visible'
                      }}
                    >
                      {metric.value}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.68rem',
                        color: 'var(--accent-orbit)',
                        letterSpacing: '0.04em',
                        lineHeight: '1.3'
                      }}
                    >
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.2rem', alignItems: 'center' }}>
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    jumpToSection('sage');
                  }}
                  onMouseEnter={() => soundEngine.playHover()}
                  className="cyber-btn"
                >
                  <span>Explore Journey</span>
                  <ArrowDown size={16} />
                </button>

                <button
                  onClick={() => {
                    soundEngine.playClick();
                    jumpToSection('terminal');
                  }}
                  onMouseEnter={() => soundEngine.playHover()}
                  className="cyber-btn cyber-btn-outline"
                >
                  <span>Get in Touch</span>
                  <ChevronRight size={16} />
                </button>

                <button
                  onClick={handleToggleVoiceover}
                  onMouseEnter={() => soundEngine.playHover()}
                  className={`cyber-btn ${isVoicePlaying ? '' : 'cyber-btn-outline'}`}
                  style={{
                    background: isVoicePlaying ? 'rgba(0, 240, 255, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                    borderColor: isVoicePlaying ? 'var(--accent-cyan)' : 'rgba(56, 189, 248, 0.4)',
                    color: isVoicePlaying ? 'var(--accent-cyan)' : 'var(--accent-orbit)',
                    boxShadow: isVoicePlaying ? '0 0 18px rgba(0, 240, 255, 0.35)' : 'none'
                  }}
                  title="Listen to George Ninan's Audio Introduction"
                >
                  <Radio size={16} />
                  <span>{isVoicePlaying ? 'Audio Playing' : 'Audio Intro'}</span>
                  {isVoicePlaying && (
                    <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '12px', marginLeft: '0.2rem' }}>
                      <span className="eq-bar eq-bar-1" />
                      <span className="eq-bar eq-bar-2" />
                      <span className="eq-bar eq-bar-3" />
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Right Column: Real Executive Spatial Portrait Card */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <div
                style={{
                  position: 'relative',
                  maxWidth: '340px',
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  borderRadius: '20px',
                  padding: '1rem',
                  boxShadow: '0 30px 80px rgba(0, 0, 0, 0.9), 0 0 35px rgba(56, 189, 248, 0.25)'
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: '100%',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    marginBottom: '1rem',
                    border: '1px solid rgba(255, 255, 255, 0.15)'
                  }}
                >
                  <img
                    src="./textures/george_ninan_portrait.jpg?v=4"
                    alt="George Ninan - Director of Software Engineering"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center 20%'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '0.8rem',
                      left: '0.8rem',
                      background: 'rgba(5, 8, 17, 0.85)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(56, 189, 248, 0.4)',
                      padding: '0.3rem 0.7rem',
                      borderRadius: '8px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      color: 'var(--accent-orbit)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#10b981',
                        boxShadow: '0 0 6px #10b981'
                      }}
                    />
                    SAGE INTACCT · BENGALURU
                  </div>
                </div>

                <div style={{ padding: '0 0.5rem 0.5rem 0.5rem' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      color: '#ffffff',
                      marginBottom: '0.2rem'
                    }}
                  >
                    George Ninan
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: 'var(--accent-orbit)'
                    }}
                  >
                    AI Transformation & Cloud Systems Leader
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            STAGE 2: THE CHRONOLOGICAL JOURNEY (8 REAL SPATIAL STOPS)
           ======================================================== */}
        <div id="timeline">
          {profileData.roles.map((role, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <section
                key={role.id}
                id={role.id}
                className={`timeline-section ${isEven ? '' : 'left-aligned'}`}
              >
                <div
                  className="timeline-card reveal"
                  style={{
                    borderLeft: `4px solid ${role.accent || 'var(--accent-orbit)'}`,
                    '--card-accent': role.accent
                  }}
                >
                  {/* Stage Sequence Header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.8rem'
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        color: role.accent,
                        letterSpacing: '0.1em'
                      }}
                    >
                      STAGE 0{role.step} · {role.period}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        color: 'var(--text-dim)'
                      }}
                    >
                      {role.period}
                    </span>
                  </div>

                  {/* Company & Title */}
                  <h2
                    className="heading-display"
                    style={{
                      fontSize: '1.85rem',
                      color: '#ffffff',
                      lineHeight: 1.25,
                      marginBottom: '0.35rem',
                      overflow: 'visible'
                    }}
                  >
                    {role.company}
                  </h2>

                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.92rem',
                      color: role.accent,
                      fontWeight: 600,
                      lineHeight: 1.35,
                      marginBottom: '0.8rem',
                      overflow: 'visible'
                    }}
                  >
                    {role.title} · {role.duration}
                  </div>

                  <div
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-muted)',
                      fontStyle: 'italic',
                      marginBottom: '1.2rem'
                    }}
                  >
                    {role.domain}
                  </div>

                  {/* Bullet Points */}
                  <ul
                    style={{
                      listStyle: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.65rem',
                      marginBottom: '1.4rem'
                    }}
                  >
                    {role.highlights.slice(0, 3).map((bullet, bIdx) => (
                      <li
                        key={bIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.6rem',
                          fontSize: '0.88rem',
                          color: 'var(--text-main)',
                          lineHeight: '1.5'
                        }}
                      >
                        <span
                          style={{
                            color: role.accent,
                            fontSize: '0.9rem',
                            marginTop: '2px'
                          }}
                        >
                          ▹
                        </span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Technology Tags */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.45rem',
                      marginBottom: '1.6rem'
                    }}
                  >
                    {role.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.72rem',
                          color: hoveredSkillName === skill ? '#ffffff' : 'var(--text-muted)',
                          background:
                            hoveredSkillName === skill
                              ? role.accent
                              : 'rgba(255, 255, 255, 0.05)',
                          border: `1px solid ${hoveredSkillName === skill
                              ? '#ffffff'
                              : 'rgba(255, 255, 255, 0.12)'
                            }`,
                          padding: '0.25rem 0.65rem',
                          borderRadius: '4px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Deep Dive Action */}
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      setSelectedRole(role);
                    }}
                    onMouseEnter={() => soundEngine.playHover()}
                    style={{
                      width: '100%',
                      background: 'rgba(56, 189, 248, 0.08)',
                      border: `1px solid ${role.accent}55`,
                      borderRadius: '8px',
                      padding: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      color: role.accent,
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      letterSpacing: '0.08em',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = `${role.accent}20`;
                      e.currentTarget.style.borderColor = role.accent;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'rgba(56, 189, 248, 0.08)';
                      e.currentTarget.style.borderColor = `${role.accent}55`;
                    }}
                  >
                    <span>View Details</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </section>
            );
          })}
        </div>

        {/* ========================================================
            STAGE 3: THE SKILL CONSTELLATION & CREDENTIALS
           ======================================================== */}
        <section
          id="skills"
          className="timeline-section left-aligned"
          style={{ minHeight: '140vh', padding: '6rem 8%' }}
        >
          <div
            style={{
              maxWidth: '560px',
              width: '100%',
              pointerEvents: 'auto'
            }}
          >
            <div style={{ textAlign: 'left', marginBottom: '2.5rem' }}>
              <div className="telemetry-tag">
                <span className="pulse-dot" />
                <span>STAGE 03 · CORE EXPERTISE & CONSTELLATION</span>
              </div>
              <h2
                className="heading-display"
                style={{
                  fontSize: 'clamp(2rem, 3.8vw, 2.8rem)',
                  color: '#ffffff',
                  marginBottom: '0.8rem',
                  overflow: 'visible'
                }}
              >
                Core Expertise
              </h2>
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.92rem',
                  lineHeight: '1.6'
                }}
              >
                20+ years of engineering leadership across AI, distributed systems,
                cloud architecture, and enterprise-scale product delivery.
              </p>
            </div>

            {/* Categorized Skills Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.2rem',
                marginBottom: '2rem'
              }}
            >
              {profileData.skillCategories.map((cat, i) => (
                <div
                  key={i}
                  className="reveal"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    background: 'var(--bg-glass)',
                    backdropFilter: 'blur(22px) saturate(160%)',
                    border: `1px solid ${cat.color}30`,
                    borderRadius: '14px',
                    padding: '1.6rem',
                    boxShadow: `0 12px 35px rgba(0, 0, 0, 0.6), 0 0 20px ${cat.color}10`
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: cat.color,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      marginBottom: '1.2rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '2px',
                        backgroundColor: cat.color
                      }}
                    />
                    {cat.category}
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                    {cat.skills.map((skill, sIdx) => {
                      const skillName = typeof skill === 'string' ? skill : skill.name;
                      const isHovered = hoveredSkillName === skillName;
                      return (
                        <div
                          key={sIdx}
                          className="badge-chip"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 0.85rem',
                            borderRadius: '8px',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.8rem',
                            color: isHovered ? '#ffffff' : 'var(--text-main)',
                            backgroundColor: isHovered
                              ? 'rgba(255, 255, 255, 0.12)'
                              : 'rgba(15, 23, 42, 0.65)',
                            border: `1px solid ${isHovered ? cat.color : 'rgba(255, 255, 255, 0.08)'
                              }`,
                            boxShadow: isHovered
                              ? `0 0 14px ${cat.color}40`
                              : '0 2px 5px rgba(0, 0, 0, 0.25)',
                            cursor: 'default'
                          }}
                        >
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: cat.color,
                              boxShadow: `0 0 6px ${cat.color}`,
                              flexShrink: 0
                            }}
                          />
                          <span>{skillName}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Certifications & Education Split Banner */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.2rem'
              }}
            >
              {/* Certifications */}
              <div
                style={{
                  background: 'var(--bg-glass)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '14px',
                  padding: '1.6rem'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    marginBottom: '1.2rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    color: 'var(--accent-orbit)'
                  }}
                >
                  <Award size={18} />
                  <span>CREDENTIALS & CERTIFICATIONS</span>
                </div>
                <ul
                  style={{
                    listStyle: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}
                >
                  {profileData.certifications.map((cert, idx) => (
                    <li
                      key={idx}
                      style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-main)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.5rem'
                      }}
                    >
                      <span style={{ color: 'var(--accent-orbit)' }}>✔</span>
                      <div>
                        <div style={{ fontWeight: 600 }}>{cert.title}</div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                          {cert.issuer}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Education */}
              <div
                style={{
                  background: 'var(--bg-glass)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '14px',
                  padding: '1.6rem'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    marginBottom: '1.2rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    color: '#10b981'
                  }}
                >
                  <GraduationCap size={18} />
                  <span>ACADEMIC FOUNDATION</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  {profileData.education.map((edu, idx) => (
                    <div key={idx}>
                      <div
                        style={{
                          fontSize: '0.92rem',
                          fontWeight: 700,
                          color: '#ffffff',
                          marginBottom: '0.2rem'
                        }}
                      >
                        {edu.institution}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#10b981' }}>
                        {edu.degree} · {edu.field}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            STAGE 4: PUBLICATIONS & POSTS (THOUGHT LEADERSHIP)
           ======================================================== */}
        <section
          id="posts"
          className="timeline-section center-aligned"
          style={{ minHeight: '120vh', padding: '6rem 8% 4rem 8%' }}
        >
          <div
            style={{
              maxWidth: '960px',
              width: '100%',
              pointerEvents: 'auto'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <div className="telemetry-tag">
                <span className="pulse-dot" />
                <span>STAGE 04 · THOUGHT LEADERSHIP & POSTS</span>
              </div>
              <h2
                className="heading-display"
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  color: '#ffffff',
                  marginBottom: '0.8rem',
                  overflow: 'visible'
                }}
              >
                Published Frameworks & White Papers
              </h2>
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.95rem',
                  maxWidth: '680px',
                  margin: '0 auto',
                  lineHeight: '1.6'
                }}
              >
                Technical white papers and engineering architectures authored on enterprise AI security, autonomous agentic workflows, and cloud-native systems.
              </p>
            </div>

            {/* Posts Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
                gap: '1.8rem'
              }}
            >
              {profileData.posts.map((post) => (
                <article
                  key={post.id}
                  className="timeline-card reveal"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderLeft: `4px solid ${post.accent}`,
                    '--card-accent': post.accent,
                    padding: '2.4rem',
                    minHeight: '380px'
                  }}
                >
                  <div>
                    {/* Header: Category Badge + Read Time */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.8rem',
                        marginBottom: '1.4rem'
                      }}
                    >
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.72rem',
                          color: post.accent,
                          background: `${post.accent}14`,
                          border: `1px solid ${post.accent}40`,
                          padding: '0.3rem 0.75rem',
                          borderRadius: '16px',
                          letterSpacing: '0.06em'
                        }}
                      >
                        <FileText size={13} />
                        <span>{post.category}</span>
                      </div>

                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.72rem',
                          color: 'var(--text-dim)',
                          letterSpacing: '0.04em'
                        }}
                      >
                        {post.readTime}
                      </span>
                    </div>

                    {/* Post Title */}
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.28rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        lineHeight: 1.38,
                        marginBottom: '1rem',
                        overflow: 'visible'
                      }}
                    >
                      {post.title}
                    </h3>

                    {/* Post Summary */}
                    <p
                      style={{
                        fontSize: '0.88rem',
                        color: 'var(--text-muted)',
                        lineHeight: '1.65',
                        marginBottom: '1.4rem'
                      }}
                    >
                      {post.summary}
                    </p>

                    {/* Topics / Tags */}
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        marginBottom: '1.8rem'
                      }}
                    >
                      {post.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.68rem',
                            color: 'var(--text-dim)',
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '4px'
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Read Article Direct Hyperlink Button */}
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundEngine.playClick()}
                    onMouseEnter={() => soundEngine.playHover()}
                    className="cyber-btn cyber-btn-outline"
                    style={{
                      width: '100%',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.6rem',
                      padding: '0.85rem 1.4rem',
                      fontSize: '0.82rem',
                      textDecoration: 'none'
                    }}
                  >
                    <span>Read on LinkedIn</span>
                    <ExternalLink size={15} />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            STAGE 5: THE TERMINAL - LUNAR LANDING PAD
           ======================================================== */}
        <section
          id="terminal"
          className="timeline-section center-aligned"
          style={{ minHeight: '120vh', padding: '6rem 8% 4rem 8%' }}
        >
          <div
            style={{
              maxWidth: '680px',
              width: '100%',
              background: 'rgba(13, 21, 38, 0.88)',
              backdropFilter: 'blur(24px)',
              border: '1px solid var(--border-spatial)',
              borderRadius: '20px',
              padding: '3rem 2.4rem',
              boxShadow: '0 30px 90px rgba(0, 0, 0, 0.9), 0 0 50px rgba(56, 189, 248, 0.2)',
              pointerEvents: 'auto',
              textAlign: 'center',
              position: 'relative'
            }}
          >
            <div className="telemetry-tag" style={{ margin: '0 auto 1.5rem auto' }}>
              <span className="pulse-dot" />
              <span>STAGE 05 · CONTACT</span>
            </div>

            <h2
              className="heading-display"
              style={{
                fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                color: '#ffffff',
                marginBottom: '0.8rem'
              }}
            >
              CONNECT
            </h2>

            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                marginBottom: '2rem',
                maxWidth: '520px',
                margin: '0 auto 2.2rem auto'
              }}
            >
              Feel free to reach out via email or connect on LinkedIn.
            </p>

            {/* Direct Email Display with Copy Action */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap',
                maxWidth: '100%',
                gap: '0.8rem',
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                borderRadius: '8px',
                padding: '0.65rem 1.2rem',
                marginBottom: '2rem'
              }}
            >
              <Mail size={16} color="var(--accent-orbit)" />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.9rem',
                  color: '#ffffff'
                }}
              >
                {profileData.contact.email}
              </span>
              <button
                onClick={handleCopyEmail}
                onMouseEnter={() => soundEngine.playHover()}
                style={{
                  background: 'none',
                  border: 'none',
                  color: copiedEmail ? '#10b981' : 'var(--accent-orbit)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px'
                }}
              >
                {copiedEmail ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedEmail ? 'COPIED' : 'COPY'}</span>
              </button>
            </div>

            {/* Outbound Transmission Buttons */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                justifyContent: 'center',
                marginBottom: '2.5rem'
              }}
            >
              <a
                href={`mailto:${profileData.contact.email}`}
                onClick={() => soundEngine.playClick()}
                onMouseEnter={() => soundEngine.playHover()}
                className="cyber-btn"
              >
                <Mail size={16} />
                <span>SEND DIRECT EMAIL</span>
              </a>

              <a
                href={profileData.contact.linkedin}
                target="_blank"
                rel="noreferrer"
                onClick={() => soundEngine.playClick()}
                onMouseEnter={() => soundEngine.playHover()}
                className="cyber-btn cyber-btn-outline"
              >
                <ExternalLink size={16} />
                <span>LINKEDIN PROFILE</span>
              </a>
            </div>

            {/* Status Footer */}
            <div
              style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '1.6rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: 'var(--text-dim)'
              }}
            >
              <div>{profileData.contact.location} · {profileData.contact.status}</div>
              <div>
                BUILT WITH THREE.JS · REACT THREE FIBER · HOSTED ON GITHUB PAGES
              </div>
            </div>
          </div>
        </section>
      </main>
      )}
    </div>
  );
}
