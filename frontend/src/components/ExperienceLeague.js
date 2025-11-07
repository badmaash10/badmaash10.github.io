import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase, Award, Code } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const ExperienceLeague = ({ experiences }) => {
  const containerRef = useRef(null);
  const timelineRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    if (!experiences || experiences.length === 0) return;

    const items = itemsRef.current.filter(Boolean);
    
    items.forEach((item, index) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top bottom-=100',
          end: 'bottom center',
          toggleActions: 'play none none reverse',
          scrub: 1
        },
        opacity: 0,
        x: index % 2 === 0 ? -100 : 100,
        duration: 1,
        ease: 'power3.out'
      });
    });

    // Timeline line animation
    if (timelineRef.current) {
      gsap.from(timelineRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top center',
          end: 'bottom center',
          scrub: 1
        },
        scaleY: 0,
        transformOrigin: 'top',
        duration: 1
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [experiences]);

  const getIcon = (type) => {
    switch (type) {
      case 'job':
        return <Briefcase size={24} />;
      case 'internship':
        return <Award size={24} />;
      case 'freelance':
        return <Code size={24} />;
      default:
        return <Briefcase size={24} />;
    }
  };

  if (!experiences || experiences.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="experience-empty">
        <p className="text-gray-500 text-lg">No experience data available yet.</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="min-h-screen py-20 px-6 relative"
      style={{ background: 'linear-gradient(180deg, #1a1a2e 0%, #0a0a0f 100%)' }}
      data-testid="experience-league"
    >
      {/* Glassmorphic panel */}
      <div 
        className="absolute inset-0 glass"
        style={{
          margin: '5%',
          borderRadius: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-4" data-testid="experience-heading">
            Experience League
          </h2>
          <p className="text-gray-400 text-lg">
            My professional journey and key milestones
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Center line */}
          <div 
            ref={timelineRef}
            className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-600 transform -translate-x-1/2"
            style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' }}
            data-testid="experience-timeline"
          />

          {/* Experience items */}
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div
                key={exp.id}
                ref={el => itemsRef.current[index] = el}
                className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                data-testid={`experience-item-${exp.id}`}
              >
                {/* Content */}
                <div className="w-5/12">
                  <div className="card p-6">
                    {exp.logo_url && (
                      <img 
                        src={exp.logo_url} 
                        alt={exp.company}
                        className="w-12 h-12 rounded-lg mb-4 object-cover"
                        data-testid={`exp-logo-${exp.id}`}
                      />
                    )}
                    <h3 className="text-xl font-semibold text-white mb-2" data-testid={`exp-title-${exp.id}`}>
                      {exp.title}
                    </h3>
                    <p className="text-blue-400 font-medium mb-1" data-testid={`exp-company-${exp.id}`}>
                      {exp.company}
                    </p>
                    <p className="text-sm text-gray-500 mb-3" data-testid={`exp-date-${exp.id}`}>
                      {exp.start_date} - {exp.current ? 'Present' : exp.end_date}
                    </p>
                    <p className="text-gray-400 text-sm mb-4" data-testid={`exp-description-${exp.id}`}>
                      {exp.description}
                    </p>
                    {exp.skills && exp.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2" data-testid={`exp-skills-${exp.id}`}>
                        {exp.skills.slice(0, 5).map((skill, i) => (
                          <span 
                            key={i}
                            className="text-xs px-2 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Center badge */}
                <div className="w-2/12 flex justify-center">
                  <div 
                    className="w-16 h-16 rounded-full glass flex items-center justify-center text-blue-400"
                    style={{
                      boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)'
                    }}
                    data-testid={`exp-badge-${exp.id}`}
                  >
                    {getIcon(exp.type)}
                  </div>
                </div>

                {/* Empty space for alternating layout */}
                <div className="w-5/12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceLeague;
