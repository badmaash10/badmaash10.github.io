import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase, GraduationCap, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Experience = ({ experiences }) => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.exp-header',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: '.exp-header', start: 'top 85%' } }
            );

            gsap.utils.toArray('.exp-card').forEach((card, i) => {
                gsap.fromTo(
                    card,
                    { x: i % 2 === 0 ? -60 : 60, opacity: 0 },
                    {
                        x: 0,
                        opacity: 1,
                        duration: 0.7,
                        ease: 'power3.out',
                        scrollTrigger: { trigger: card, start: 'top 85%' },
                    }
                );
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="experience" ref={sectionRef} className="section" style={{ background: 'var(--bg-secondary)' }}>
            <div className="section-inner">
                <div className="section-header exp-header">
                    <h2>
                        Career <span className="gradient-text">Journey</span>
                    </h2>
                    <p>From data analytics to architecting production-grade platforms — in under a year.</p>
                </div>

                <div
                    style={{
                        position: 'relative',
                        maxWidth: 800,
                        margin: '0 auto',
                    }}
                >
                    {/* Timeline Line */}
                    <div
                        style={{
                            position: 'absolute',
                            left: '50%',
                            top: 0,
                            bottom: 0,
                            width: 2,
                            background: 'linear-gradient(180deg, var(--accent-blue), var(--accent-violet), transparent)',
                            transform: 'translateX(-50%)',
                        }}
                        className="timeline-line"
                    />

                    {experiences.map((exp, index) => (
                        <div
                            key={exp.id}
                            className="exp-card"
                            style={{
                                display: 'flex',
                                justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end',
                                marginBottom: 48,
                                position: 'relative',
                            }}
                        >
                            {/* Timeline Node */}
                            <div
                                style={{
                                    position: 'absolute',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: 48,
                                    height: 48,
                                    borderRadius: '50%',
                                    background: 'var(--bg-primary)',
                                    border: '3px solid var(--accent-blue)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 2,
                                    boxShadow: '0 0 20px rgba(59,130,246,0.3)',
                                }}
                            >
                                {exp.type === 'internship' ? (
                                    <GraduationCap size={20} style={{ color: 'var(--accent-blue)' }} />
                                ) : (
                                    <Briefcase size={20} style={{ color: 'var(--accent-blue)' }} />
                                )}
                            </div>

                            {/* Card */}
                            <div
                                className="card"
                                style={{
                                    width: 'calc(50% - 48px)',
                                    cursor: 'default',
                                }}
                            >
                                {/* Date */}
                                <div
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 4,
                                        fontSize: 13,
                                        fontWeight: 600,
                                        color: 'var(--accent-blue)',
                                        marginBottom: 12,
                                        padding: '4px 12px',
                                        background: 'rgba(59,130,246,0.1)',
                                        borderRadius: 9999,
                                    }}
                                >
                                    {exp.start_date} — {exp.current ? 'Present' : exp.end_date}
                                </div>

                                <h3
                                    style={{
                                        fontSize: '1.2rem',
                                        fontWeight: 700,
                                        marginBottom: 4,
                                        fontFamily: "'Space Grotesk', sans-serif",
                                    }}
                                >
                                    {exp.title}
                                </h3>

                                <p
                                    style={{
                                        fontSize: 15,
                                        color: 'var(--accent-violet)',
                                        fontWeight: 600,
                                        marginBottom: 12,
                                    }}
                                >
                                    {exp.company}
                                </p>

                                <p
                                    style={{
                                        fontSize: 14,
                                        color: 'var(--text-secondary)',
                                        lineHeight: 1.6,
                                        marginBottom: 16,
                                    }}
                                >
                                    {exp.description}
                                </p>

                                {/* Key Responsibilities */}
                                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px 0' }}>
                                    {exp.responsibilities.slice(0, 4).map((resp, i) => (
                                        <li
                                            key={i}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: 8,
                                                fontSize: 13,
                                                color: 'var(--text-secondary)',
                                                marginBottom: 6,
                                                lineHeight: 1.5,
                                            }}
                                        >
                                            <ChevronRight size={14} style={{ color: 'var(--accent-blue)', flexShrink: 0, marginTop: 3 }} />
                                            {resp}
                                        </li>
                                    ))}
                                </ul>

                                {/* Skills */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                    {exp.skills.map((skill) => (
                                        <span
                                            key={skill}
                                            style={{
                                                padding: '4px 12px',
                                                fontSize: 12,
                                                fontWeight: 500,
                                                background: 'rgba(139,92,246,0.1)',
                                                color: 'var(--accent-violet)',
                                                borderRadius: 9999,
                                                border: '1px solid rgba(139,92,246,0.2)',
                                            }}
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
        @media (max-width: 768px) {
          .timeline-line { left: 24px !important; }
          .exp-card { justify-content: flex-end !important; }
          .exp-card .card { width: calc(100% - 60px) !important; }
          .exp-card > div:first-child { left: 24px !important; width: 36px !important; height: 36px !important; }
        }
      `}</style>
        </section>
    );
};

export default Experience;
