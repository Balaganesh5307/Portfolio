import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

    // Staggered float animation for skills
    const isMobile = window.innerWidth <= 768;
    const skillTags = document.querySelectorAll('.skill-tag');
    const animations: gsap.core.Tween[] = [];

    skillTags.forEach((tag, idx) => {
      tag.classList.add('premium-animate');
      if (!isMobile) {
        const anim = gsap.to(tag, {
          y: -5,
          duration: 2 + Math.random() * 2,
          ease: 'power1.inOut',
          yoyo: true,
          repeat: -1,
          delay: idx * 0.05
        });
        animations.push(anim);
      }
    });

    return () => {
      trigger.kill();
      animations.forEach(anim => anim.kill());
    };
  }, [skills]);

  return (
    <section id="skills" className="section">
      <div className="container">
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
