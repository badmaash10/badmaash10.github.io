import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';

const Hero = ({ profile }) => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    if (titleRef.current && subtitleRef.current) {
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out'
      });
      
      gsap.from(subtitleRef.current, {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out'
      });
    }
  }, [profile]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)'
      }}
      data-testid="hero-section"
    >
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-20 left-20 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)'
          }}
        />
        <div 
          className="absolute bottom-20 right-20 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)'
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {profile?.avatar_url && (
          <div className="mb-8 flex justify-center" data-testid="hero-avatar">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-xl opacity-50 animate-pulse" />
              <img 
                src={profile.avatar_url} 
                alt={profile.name}
                className="relative w-32 h-32 rounded-full object-cover border-4 border-white/10"
              />
            </div>
          </div>
        )}

        <h1 
          ref={titleRef}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6"
          style={{
            background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #60a5fa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundSize: '200% 100%',
            animation: 'gradient-shift 3s ease infinite'
          }}
          data-testid="hero-name"
        >
          {profile?.name || 'Charchit Singh Sahay'}
        </h1>

        <p 
          ref={subtitleRef}
          className="text-xl sm:text-2xl text-gray-400 mb-8 max-w-2xl mx-auto"
          data-testid="hero-title"
        >
          {profile?.title || 'Full Stack Developer & Creative Technologist'}
        </p>

        {profile?.bio && (
          <p className="text-base sm:text-lg text-gray-500 mb-12 max-w-3xl mx-auto" data-testid="hero-bio">
            {profile.bio}
          </p>
        )}

        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <button 
            onClick={() => scrollToSection('projects')}
            className="btn-primary"
            data-testid="hero-view-work-btn"
          >
            View My Work
          </button>
          <button 
            onClick={() => scrollToSection('contact')}
            className="btn-secondary"
            data-testid="hero-contact-btn"
          >
            Get In Touch
          </button>
        </div>

        {/* Social links */}
        {(profile?.github || profile?.linkedin || profile?.email) && (
          <div className="flex gap-6 justify-center" data-testid="hero-social-links">
            {profile.github && (
              <a 
                href={profile.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                data-testid="hero-github-link"
              >
                <Github size={24} />
              </a>
            )}
            {profile.linkedin && (
              <a 
                href={profile.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                data-testid="hero-linkedin-link"
              >
                <Linkedin size={24} />
              </a>
            )}
            {profile.email && (
              <a 
                href={`mailto:${profile.email}`}
                className="text-gray-400 hover:text-blue-400 transition-colors"
                data-testid="hero-email-link"
              >
                <Mail size={24} />
              </a>
            )}
          </div>
        )}

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce" data-testid="hero-scroll-indicator">
          <ArrowDown className="text-gray-500" size={32} />
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default Hero;
