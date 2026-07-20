import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink } from 'lucide-react';
import { Github } from './Icon';

gsap.registerPlugin(ScrollTrigger);

interface ProjectItem {
  _id: string;
  title: string;
  number: string;
  description: string;
  githubLink: string;
  liveLink?: string;
  tags: string[];
}

interface ProjectsProps {
  projects: ProjectItem[];
}

export const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  useEffect(() => {
    if (projects.length === 0) return;

    const projectCards = document.querySelectorAll('.project-card');
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const cardCleanups: (() => void)[] = [];

    const ctx = gsap.context(() => {
      // Stagger reveal project cards
      gsap.from(projectCards, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#projects',
          start: 'top 80%'
        }
      });

      projectCards.forEach(cardElement => {
        const card = cardElement as HTMLElement;

        // Mouse Move Tilt Animation (Desktop Only)
        if (!isTouchDevice) {
          const handleMouseMove = (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const rotateX = -y * 0.07;
            const rotateY = x * 0.07;

            gsap.to(card, {
              rotateX: rotateX,
              rotateY: rotateY,
              transformPerspective: 1000,
              ease: 'power2.out',
              duration: 0.5
            });

            const glare = card.querySelector('.project-glare') as HTMLElement;
            if (glare) {
              const percentX = ((e.clientX - rect.left) / rect.width) * 100;
              const percentY = ((e.clientY - rect.top) / rect.height) * 100;
              glare.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(99, 102, 241, 0.15) 0%, rgba(255, 255, 255, 0.15) 30%, transparent 65%)`;
              gsap.to(glare, { opacity: 1, duration: 0.3 });
            }
          };

          const handleMouseLeave = () => {
            gsap.to(card, {
              rotateX: 0,
              rotateY: 0,
              ease: 'power2.out',
              duration: 0.5
            });

            const glare = card.querySelector('.project-glare') as HTMLElement;
            if (glare) {
              gsap.to(glare, { opacity: 0, duration: 0.5 });
            }
          };

          card.addEventListener('mousemove', handleMouseMove);
          card.addEventListener('mouseleave', handleMouseLeave);

          cardCleanups.push(() => {
            card.removeEventListener('mousemove', handleMouseMove);
            card.removeEventListener('mouseleave', handleMouseLeave);
          });
        }

        // Project links hover reveal animation inside card
        const links = card.querySelectorAll('.project-link');
        const handleMouseEnter = () => {
          gsap.fromTo(links, {
            y: 10,
            opacity: 0
          }, {
            y: 0,
            opacity: 1,
            duration: 0.3,
            stagger: 0.05,
            ease: 'back.out(1.7)'
          });
        };

        card.addEventListener('mouseenter', handleMouseEnter);
        cardCleanups.push(() => {
          card.removeEventListener('mouseenter', handleMouseEnter);
        });
      });
    });

    return () => {
      ctx.revert();
      cardCleanups.forEach(cleanup => cleanup());
    };
  }, [projects]);

  return (
    <section id="projects" className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">Some of my recent work</p>
        </div>
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project._id} className="project-card">
              <div className="project-glare"></div>
              <span className="project-number">{project.number}</span>
              <div className="project-header">
                <h3 className="project-title">{project.title}</h3>
                <div className="project-links">
                  <a href={project.githubLink}
                    className="project-link" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
                    <Github size={20} />
                  </a>
                  {project.liveLink && (
                    <a href={project.liveLink} className="project-link" aria-label="Live Demo"
                      target="_blank" rel="noopener noreferrer">
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>
              <p className="project-description">{project.description}</p>
              <div className="project-tech">
                {project.tags.map((tag, idx) => (
                  <span key={idx} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
