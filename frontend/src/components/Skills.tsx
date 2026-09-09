import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Section3DCanvas } from './Section3DCanvas';

gsap.registerPlugin(ScrollTrigger);

interface SkillItem {
  _id: string;
  category: string;
  tags: string[];
}

interface SkillsProps {
  skills: SkillItem[];
}

export const Skills: React.FC<SkillsProps> = ({ skills }) => {
  useEffect(() => {
    if (skills.length === 0) return;

    // Trigger skills simple grid active class on scroll
    const trigger = ScrollTrigger.create({
      trigger: '#skills',
      start: 'top 85%',
      once: true,
      onEnter: () => {
        const grid = document.querySelector('.skills-simple-grid');
        if (grid) grid.classList.add('active');
      }
    });

    // Add premium-animate class for CSS-based hover effects (no infinite JS tweens)
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach((tag) => {
      tag.classList.add('premium-animate');
    });

    return () => {
      trigger.kill();
    };
  }, [skills]);

  return (
    <section id="skills" className="section" style={{ position: 'relative', overflow: 'hidden' }}>
      <Section3DCanvas variant="skills" />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="section-header">
          <h2 className="section-title">Skills & Technologies</h2>
          <p className="section-subtitle">What I work with</p>
        </div>

        <div className="skills-simple-grid">
          {skills.map((skill) => (
            <div key={skill._id} className="skill-group">
              <h3 className="skill-group-title">{skill.category}</h3>
              <div className="skill-tags">
                {skill.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="skill-tag">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
