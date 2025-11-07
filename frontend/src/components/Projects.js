import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, ExternalLink, Filter } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Projects = ({ projects }) => {
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [selectedTag, setSelectedTag] = useState('all');
  const [allTags, setAllTags] = useState(['all']);
  const projectsRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    if (projects && projects.length > 0) {
      const tags = ['all'];
      projects.forEach(project => {
        if (project.tags) {
          project.tags.forEach(tag => {
            if (!tags.includes(tag)) tags.push(tag);
          });
        }
      });
      setAllTags(tags);
      setFilteredProjects(projects);
    }
  }, [projects]);

  useEffect(() => {
    if (selectedTag === 'all') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => p.tags && p.tags.includes(selectedTag)));
    }
  }, [selectedTag, projects]);

  useEffect(() => {
    if (cardsRef.current.length > 0) {
      cardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: 'top bottom-=100',
              toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power3.out'
          });
        }
      });
    }
  }, [filteredProjects]);

  if (!projects || projects.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="projects-empty">
        <p className="text-gray-500 text-lg">No projects to display yet.</p>
      </div>
    );
  }

  return (
    <div 
      ref={projectsRef}
      className="min-h-screen py-20 px-6"
      style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 100%)' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-4" data-testid="projects-heading">
            Featured Projects
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A showcase of my recent work and passion projects
          </p>
        </div>

        {/* Filter tags */}
        {allTags.length > 1 && (
          <div className="flex flex-wrap gap-3 justify-center mb-12" data-testid="projects-filters">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`tag ${
                  selectedTag === tag ? 'bg-blue-500/30 border-blue-400' : ''
                }`}
                data-testid={`filter-tag-${tag}`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              ref={el => cardsRef.current[index] = el}
              className="card group cursor-pointer"
              data-testid={`project-card-${project.id}`}
            >
              {project.image_url && (
                <div className="relative overflow-hidden rounded-lg mb-4 h-48">
                  <img 
                    src={project.image_url} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    data-testid={`project-image-${project.id}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              )}

              <h3 className="text-xl font-semibold text-white mb-2" data-testid={`project-title-${project.id}`}>
                {project.title}
              </h3>
              <p className="text-gray-400 text-sm mb-4" data-testid={`project-description-${project.id}`}>
                {project.description}
              </p>

              {project.tech_stack && project.tech_stack.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4" data-testid={`project-tech-${project.id}`}>
                  {project.tech_stack.slice(0, 4).map((tech, i) => (
                    <span 
                      key={i}
                      className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-3 mt-4">
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                    data-testid={`project-github-${project.id}`}
                  >
                    <Github size={20} />
                  </a>
                )}
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                    data-testid={`project-live-${project.id}`}
                  >
                    <ExternalLink size={20} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
