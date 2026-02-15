import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code2, Database, Cloud, Terminal, Wrench, Brain } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const skillCategories = [
    {
        icon: <Code2 size={20} />,
        title: 'Languages',
        skills: ['Python', 'JavaScript', 'TypeScript', 'HTML/CSS'],
        color: '#3b82f6',
    },
    {
        icon: <Database size={20} />,
        title: 'Databases',
        skills: ['MongoDB', 'PostgreSQL'],
        color: '#8b5cf6',
    },
    {
        icon: <Cloud size={20} />,
        title: 'Architecture',
        skills: ['Microservices', 'RESTful APIs', 'Multi-tenant Systems', 'System Design'],
        color: '#06b6d4',
    },
    {
        icon: <Terminal size={20} />,
        title: 'Frameworks',
        skills: ['React', 'FastAPI', 'Vite'],
        color: '#10b981',
    },
    {
        icon: <Wrench size={20} />,
        title: 'DevOps & Tools',
        skills: ['Docker', 'Git', 'Linux', 'AWS S3', 'CI/CD', 'Postman'],
        color: '#f59e0b',
    },
    {
        icon: <Brain size={20} />,
        title: 'Soft Skills',
        skills: ['Technical Leadership', 'Client Strategy', 'Agile', 'Problem Solving'],
        color: '#ec4899',
    },
];

const About = ({ profile }) => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.about-header',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: '.about-header', start: 'top 85%' } }
            );

            gsap.utils.toArray('.skill-category-card').forEach((card, i) => {
                gsap.fromTo(
                    card,
                    { y: 50, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.6,
                        delay: i * 0.08,
                        ease: 'power3.out',
                        scrollTrigger: { trigger: card, start: 'top 90%' },
                    }
                );
            });

            gsap.fromTo(
                '.about-stats',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.7, scrollTrigger: { trigger: '.about-stats', start: 'top 85%' } }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="about" ref={sectionRef} className="section" style={{ background: 'var(--bg-secondary)' }}>
            <div className="section-inner">
                <div className="section-header about-header">
                    <h2>
                        Skills & <span className="gradient-text">Expertise</span>
                    </h2>
                    <p>A versatile toolkit built through real-world product engineering, not just tutorials.</p>
                </div>

                {/* Stats Bar */}
                <div
                    className="about-stats"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: 16,
                        marginBottom: 56,
                    }}
                >
                    <StatCard number="6+" label="Months Industry Experience" color="#3b82f6" />
                    <StatCard number="5+" label="Production Projects" color="#8b5cf6" />
                    <StatCard number="2" label="Enterprise Clients" color="#06b6d4" />
                    <StatCard number="30%" label="Revenue Impact" color="#10b981" />
                </div>

                {/* Skills Grid */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: 20,
                    }}
                    className="skills-grid"
                >
                    {skillCategories.map((category) => (
                        <div
                            key={category.title}
                            className="card skill-category-card"
                            style={{ cursor: 'default' }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    marginBottom: 16,
                                }}
                            >
                                <div
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 10,
                                        background: `${category.color}15`,
                                        border: `1px solid ${category.color}30`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: category.color,
                                    }}
                                >
                                    {category.icon}
                                </div>
                                <h3
                                    style={{
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        fontFamily: "'Space Grotesk', sans-serif",
                                    }}
                                >
                                    {category.title}
                                </h3>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {category.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="skill-badge"
                                        style={{
                                            borderColor: `${category.color}25`,
                                            background: `${category.color}08`,
                                        }}
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
        @media (max-width: 768px) {
          .skills-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </section>
    );
};

const StatCard = ({ number, label, color }) => (
    <div
        className="card"
        style={{
            textAlign: 'center',
            cursor: 'default',
            padding: '24px 16px',
        }}
    >
        <div
            style={{
                fontSize: '2rem',
                fontWeight: 800,
                fontFamily: "'Space Grotesk', sans-serif",
                color: color,
                marginBottom: 4,
            }}
        >
            {number}
        </div>
        <div
            style={{
                fontSize: 13,
                color: 'var(--text-secondary)',
                fontWeight: 500,
            }}
        >
            {label}
        </div>
    </div>
);

export default About;
