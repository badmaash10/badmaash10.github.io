import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Github, Linkedin, Mail, ArrowDown, MapPin } from 'lucide-react';

const Hero = ({ profile }) => {
    const heroRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            tl.fromTo('.hero-orb', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.5, stagger: 0.2 })
                .fromTo('.hero-avatar', { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8 }, 0.3)
                .fromTo('.hero-badge', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.6)
                .fromTo('.hero-name', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.7)
                .fromTo('.hero-title', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.9)
                .fromTo('.hero-bio', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 1.1)
                .fromTo('.hero-actions', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 1.3)
                .fromTo('.hero-socials', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 1.4)
                .fromTo('.hero-scroll', { opacity: 0 }, { opacity: 1, duration: 0.6 }, 1.6);
        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="hero"
            ref={heroRef}
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                background: 'var(--gradient-hero)',
                padding: '120px 24px 80px',
            }}
        >
            {/* Animated Background Orbs */}
            <div
                className="hero-orb"
                style={{
                    position: 'absolute',
                    top: '10%',
                    left: '10%',
                    width: 500,
                    height: 500,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
                    animation: 'float 8s ease-in-out infinite',
                    pointerEvents: 'none',
                }}
            />
            <div
                className="hero-orb"
                style={{
                    position: 'absolute',
                    bottom: '10%',
                    right: '5%',
                    width: 400,
                    height: 400,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
                    animation: 'float 10s ease-in-out infinite reverse',
                    pointerEvents: 'none',
                }}
            />
            <div
                className="hero-orb"
                style={{
                    position: 'absolute',
                    top: '50%',
                    right: '25%',
                    width: 250,
                    height: 250,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)',
                    animation: 'float 12s ease-in-out infinite 2s',
                    pointerEvents: 'none',
                }}
            />

            <div
                ref={contentRef}
                style={{
                    maxWidth: 800,
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 2,
                }}
            >
                {/* Profile Picture */}
                <div
                    className="hero-avatar"
                    style={{
                        width: 160,
                        height: 160,
                        margin: '0 auto 28px',
                        borderRadius: '50%',
                        padding: 4,
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4)',
                        position: 'relative',
                    }}
                >
                    <img
                        src={process.env.PUBLIC_URL + '/Charchit_linkedin_profile.jpeg'}
                        alt={profile.name}
                        style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '4px solid var(--bg-primary)',
                        }}
                    />
                    {/* Glow ring */}
                    <div
                        style={{
                            position: 'absolute',
                            inset: -8,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(139,92,246,0.3))',
                            filter: 'blur(20px)',
                            zIndex: -1,
                            animation: 'pulse-glow 3s ease-in-out infinite',
                        }}
                    />
                </div>

                {/* Status Badge */}
                <div
                    className="hero-badge"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '8px 20px',
                        borderRadius: 9999,
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                        marginBottom: 24,
                        fontSize: 14,
                        fontWeight: 500,
                        color: '#10b981',
                    }}
                >
                    <span
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: '#10b981',
                            boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)',
                            animation: 'pulse-glow 2s ease-in-out infinite',
                        }}
                    />
                    Available for Opportunities
                </div>

                {/* Name */}
                <h1
                    className="hero-name"
                    style={{
                        fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
                        fontWeight: 800,
                        marginBottom: 12,
                        lineHeight: 1.1,
                        background: 'linear-gradient(135deg, #f1f5f9 0%, #94a3b8 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    {profile.name}
                </h1>

                {/* Title */}
                <p
                    className="hero-title"
                    style={{
                        fontSize: 'clamp(1.1rem, 3vw, 1.6rem)',
                        fontWeight: 600,
                        marginBottom: 20,
                        fontFamily: "'Space Grotesk', sans-serif",
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    {profile.title}
                </p>

                {/* Location */}
                <div
                    className="hero-bio"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        marginBottom: 12,
                        color: 'var(--text-muted)',
                        fontSize: 15,
                    }}
                >
                    <MapPin size={16} />
                    {profile.location}
                </div>

                {/* Bio */}
                <p
                    className="hero-bio"
                    style={{
                        fontSize: '1.05rem',
                        color: 'var(--text-secondary)',
                        maxWidth: 620,
                        margin: '0 auto 36px',
                        lineHeight: 1.7,
                    }}
                >
                    {profile.bio}
                </p>

                {/* Action Buttons */}
                <div
                    className="hero-actions"
                    style={{
                        display: 'flex',
                        gap: 16,
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        marginBottom: 32,
                    }}
                >
                    <a href="#projects" className="btn-primary" onClick={(e) => { e.preventDefault(); document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }); }}>
                        View My Work
                        <ArrowDown size={18} />
                    </a>
                    <a href="#contact" className="btn-outline" onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }}>
                        Get In Touch
                    </a>
                </div>

                {/* Social Links */}
                <div
                    className="hero-socials"
                    style={{
                        display: 'flex',
                        gap: 16,
                        justifyContent: 'center',
                    }}
                >
                    {profile.github && (
                        <SocialIcon href={profile.github} label="GitHub">
                            <Github size={20} />
                        </SocialIcon>
                    )}
                    {profile.linkedin && (
                        <SocialIcon href={profile.linkedin} label="LinkedIn">
                            <Linkedin size={20} />
                        </SocialIcon>
                    )}
                    {profile.email && (
                        <SocialIcon href={`mailto:${profile.email}`} label="Email">
                            <Mail size={20} />
                        </SocialIcon>
                    )}
                </div>
            </div>

            {/* Scroll Indicator */}
            <div
                className="hero-scroll"
                style={{
                    position: 'absolute',
                    bottom: 32,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    color: 'var(--text-muted)',
                    fontSize: 12,
                    animation: 'bounce-subtle 2s ease-in-out infinite',
                }}
            >
                <span>Scroll</span>
                <div
                    style={{
                        width: 24,
                        height: 40,
                        borderRadius: 12,
                        border: '2px solid var(--text-muted)',
                        position: 'relative',
                    }}
                >
                    <div
                        style={{
                            width: 4,
                            height: 8,
                            borderRadius: 2,
                            background: 'var(--accent-blue)',
                            position: 'absolute',
                            top: 6,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            animation: 'float 1.5s ease-in-out infinite',
                        }}
                    />
                </div>
            </div>
        </section>
    );
};

const SocialIcon = ({ href, label, children }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'var(--text-secondary)',
            transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(59,130,246,0.15)';
            e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)';
            e.currentTarget.style.color = '#3b82f6';
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(59,130,246,0.2)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
        }}
    >
        {children}
    </a>
);

export default Hero;
