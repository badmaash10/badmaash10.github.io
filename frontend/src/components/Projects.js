import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Github, Star, Layers } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Projects = ({ projects }) => {
    const sectionRef = useRef(null);
    const [activeFilter, setActiveFilter] = useState('all');

    const allTags = ['all', ...new Set(projects.flatMap((p) => p.tags))];

    const filteredProjects = activeFilter === 'all' ? projects : projects.filter((p) => p.tags.includes(activeFilter));

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.projects-header',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: '.projects-header', start: 'top 85%' } }
            );

            gsap.utils.toArray('.project-card').forEach((card, i) => {
                gsap.fromTo(
                    card,
                    { y: 60, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.6,
                        delay: i * 0.1,
                        ease: 'power3.out',
                        scrollTrigger: { trigger: card, start: 'top 90%' },
                    }
                );
            });
        }, sectionRef);

        return () => ctx.revert();
    }, [activeFilter]);

    return (
        <section id="projects" ref={sectionRef} className="section">
            <div className="section-inner">
                <div className="section-header projects-header">
                    <h2>
                        Featured <span className="gradient-text">Projects</span>
                    </h2>
                    <p>Products and platforms I've architected from zero to production.</p>
                </div>

                {/* Filter Tags */}
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 8,
                        justifyContent: 'center',
                        marginBottom: 48,
                    }}
                >
                    {allTags.map((tag) => (
                        <button
                            key={tag}
                            className={`tag ${activeFilter === tag ? 'active' : ''}`}
                            onClick={() => setActiveFilter(tag)}
                        >
                            {tag === 'all' ? 'All Projects' : tag.charAt(0).toUpperCase() + tag.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Project Grid */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350, 1fr))',
                        gap: 24,
                    }}
                    className="project-grid"
                >
                    {filteredProjects.map((project) => (
                        <div key={project.id} className="card project-card" style={{ cursor: 'default' }}>
                            {/* Featured Badge */}
                            {project.featured && (
                                <div
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 6,
                                        padding: '4px 12px',
                                        background: 'rgba(245, 158, 11, 0.1)',
                                        border: '1px solid rgba(245, 158, 11, 0.25)',
                                        borderRadius: 9999,
                                        fontSize: 12,
                                        fontWeight: 600,
                                        color: '#f59e0b',
                                        marginBottom: 16,
                                    }}
                                >
                                    <Star size={12} />
                                    Featured
                                </div>
                            )}

                            <h3
                                style={{
                                    fontSize: '1.25rem',
                                    fontWeight: 700,
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    marginBottom: 10,
                                    lineHeight: 1.3,
                                }}
                            >
                                {project.title}
                            </h3>

                            <p
                                style={{
                                    fontSize: 14,
                                    color: 'var(--text-secondary)',
                                    lineHeight: 1.7,
                                    marginBottom: 16,
                                }}
                            >
                                {project.description}
                            </p>

                            {/* Long description */}
                            {project.long_description && (
                                <p
                                    style={{
                                        fontSize: 13,
                                        color: 'var(--text-muted)',
                                        lineHeight: 1.6,
                                        marginBottom: 20,
                                        borderLeft: '2px solid var(--accent-blue)',
                                        paddingLeft: 12,
                                    }}
                                >
                                    {project.long_description}
                                </p>
                            )}

                            {/* Tech Stack */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
                                {project.tech_stack.map((tech) => (
                                    <span
                                        key={tech}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 4,
                                            padding: '4px 12px',
                                            fontSize: 12,
                                            fontWeight: 500,
                                            background: 'rgba(59,130,246,0.08)',
                                            color: 'var(--accent-blue)',
                                            borderRadius: 9999,
                                            border: '1px solid rgba(59,130,246,0.15)',
                                        }}
                                    >
                                        <Layers size={10} />
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            {/* Links */}
                            <div style={{ display: 'flex', gap: 12, marginTop: 'auto' }}>
                                {project.github_url && (
                                    <a
                                        href={project.github_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-outline"
                                        style={{ padding: '8px 20px', fontSize: 13 }}
                                    >
                                        <Github size={16} />
                                        Code
                                    </a>
                                )}
                                {project.live_url && (
                                    <a
                                        href={project.live_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-primary"
                                        style={{ padding: '8px 20px', fontSize: 13 }}
                                    >
                                        <ExternalLink size={16} />
                                        Live
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
        .project-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 24px;
        }
        @media (max-width: 768px) {
          .project-grid { grid-template-columns: 1fr; }
        }
      `}</style>
        </section>
    );
};

export default Projects;
