import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ExperienceItem {
  _id: string;
  startDate: string;
  endDate: string | null;
  role: string;
  company: string;
  description: string;
  certificatePath?: string;
  certificateName?: string;
}

interface ExperienceProps {
  experiences: ExperienceItem[];
}

const formatDate = (iso: string | null | undefined) => {
  if (!iso) return 'Present';
  return new Date(iso).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
};

export const Experience: React.FC<ExperienceProps> = ({ experiences }) => {
  useEffect(() => {
    if (experiences.length === 0) return;

    const timeline = document.querySelector('.experience-timeline');
    const timelineFill = document.querySelector('.experience-timeline-fill');
    const timelineSpark = document.querySelector('.experience-spark');
    const timelineItems = document.querySelectorAll('.experience-item');

    if (!timeline || !timelineFill) return;

    const fillTween = gsap.to(timelineFill, {
      height: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: timeline,
        start: 'top 60%',
        end: 'bottom 40%',
        scrub: true
      }
    });

    let sparkTween: gsap.core.Tween | null = null;
    if (timelineSpark) {
      sparkTween = gsap.to(timelineSpark, {
        top: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: timeline,
          start: 'top 60%',
          end: 'bottom 40%',
          scrub: true,
          onEnter: () => gsap.to(timelineSpark, { opacity: 1, duration: 0.2 }),
          onLeave: () => gsap.to(timelineSpark, { opacity: 0, duration: 0.2 }),
          onEnterBack: () => gsap.to(timelineSpark, { opacity: 1, duration: 0.2 }),
          onLeaveBack: () => gsap.to(timelineSpark, { opacity: 0, duration: 0.2 })
        }
      });
    }

    const itemTriggers: ScrollTrigger[] = [];
    timelineItems.forEach(item => {
      const trigger = ScrollTrigger.create({
        trigger: item,
        start: 'top 55%',
        end: 'bottom 45%',
        onEnter: () => item.classList.add('active'),
        onLeaveBack: () => item.classList.remove('active')
      });
      itemTriggers.push(trigger);
    });

    return () => {
      if (fillTween.scrollTrigger) fillTween.scrollTrigger.kill();
      fillTween.kill();
      if (sparkTween) {
        if (sparkTween.scrollTrigger) sparkTween.scrollTrigger.kill();
        sparkTween.kill();
      }
      itemTriggers.forEach(t => t.kill());
    };
  }, [experiences]);

  if (experiences.length === 0) return null;

  return (
    <section id="experience" className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Work Experience</h2>
          <p className="section-subtitle">My professional journey and internships</p>
        </div>

        <div className="experience-timeline">
          <div className="experience-timeline-fill"></div>
          <div className="experience-spark"></div>

          {experiences.map((exp) => (
            <div key={exp._id} className="experience-item">
              <span className="experience-date">
                {formatDate(exp.startDate)} — {formatDate(exp.endDate)}
              </span>
              <div className="experience-card">
                <div className="experience-card-header">
                  <div>
                    <h3 className="experience-role">{exp.role}</h3>
                    <p className="experience-company">{exp.company}</p>
                  </div>
                  {exp.certificatePath && (
                    <a
                      href={exp.certificatePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="experience-cert-badge"
                      title="View Certificate"
                    >
                      🏅 Certificate
                    </a>
                  )}
                </div>
                <p className="experience-description">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
