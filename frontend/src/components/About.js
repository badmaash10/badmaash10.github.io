import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Download } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const About = ({ profile }) => {
  const aboutRef = useRef(null);
  const contentRef = useRef(null);
  const skillsRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      gsap.from(contentRef.current, {
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top bottom-=100',
          toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out'
      });
    }

    if (skillsRef.current) {
      const skills = skillsRef.current.children;
      gsap.from(skills, {
        scrollTrigger: {
          trigger: skillsRef.current,
          start: 'top bottom-=100',
          toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out'
      });
    }
  }, [profile]);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="about-empty">
        <p className="text-gray-500 text-lg">Loading about section...</p>
      </div>
    );
  }

  return (
    <div 
      ref={aboutRef}
      className="min-h-screen py-20 px-6"
      style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 100%)' }}
      data-testid="about-section"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-4" data-testid="about-heading">
            About Me
          </h2>
          <p className="text-gray-400 text-lg">
            Get to know me better
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left column - Bio */}
          <div ref={contentRef} className="space-y-6">
            {profile.avatar_url && (
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden" data-testid="about-avatar">
                <img 
                  src={profile.avatar_url} 
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            )}

            {profile.bio && (
              <div className="card" data-testid="about-bio">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {profile.bio}
                </p>
              </div>
            )}

            {profile.resume_url && (
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 btn-primary"
                data-testid="about-resume-btn"
              >
                <Download size={20} />
                Download Resume
              </a>
            )}
          </div>

          {/* Right column - Details */}
          <div className="space-y-8">
            <div className="card" data-testid="about-details">
              <h3 className="text-2xl font-semibold text-white mb-6">Details</h3>
              <div className="space-y-4">
                {profile.email && (
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Email</p>
                    <p className="text-white" data-testid="about-email">{profile.email}</p>
                  </div>
                )}
                {profile.phone && (
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Phone</p>
                    <p className="text-white" data-testid="about-phone">{profile.phone}</p>
                  </div>
                )}
                {profile.location && (
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Location</p>
                    <p className="text-white" data-testid="about-location">{profile.location}</p>
                  </div>
                )}
              </div>
            </div>

            {profile.skills && profile.skills.length > 0 && (
              <div className="card" data-testid="about-skills">
                <h3 className="text-2xl font-semibold text-white mb-6">Skills</h3>
                <div ref={skillsRef} className="flex flex-wrap gap-3">
                  {profile.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30"
                      data-testid={`skill-${index}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(profile.github || profile.linkedin || profile.twitter || profile.website) && (
              <div className="card" data-testid="about-links">
                <h3 className="text-2xl font-semibold text-white mb-6">Connect</h3>
                <div className="space-y-3">
                  {profile.github && (
                    <a href={profile.github} target="_blank" rel="noopener noreferrer" className="block text-blue-400 hover:text-blue-300 transition-colors" data-testid="about-github">
                      GitHub →
                    </a>
                  )}
                  {profile.linkedin && (
                    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="block text-blue-400 hover:text-blue-300 transition-colors" data-testid="about-linkedin">
                      LinkedIn →
                    </a>
                  )}
                  {profile.twitter && (
                    <a href={profile.twitter} target="_blank" rel="noopener noreferrer" className="block text-blue-400 hover:text-blue-300 transition-colors" data-testid="about-twitter">
                      Twitter →
                    </a>
                  )}
                  {profile.website && (
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="block text-blue-400 hover:text-blue-300 transition-colors" data-testid="about-website">
                      Website →
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
