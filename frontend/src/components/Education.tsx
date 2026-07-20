import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface EducationItem {
  _id: string;
  date: string;
  degree: string;
  institution: string;
  details: string;
}

interface EducationProps {
  educationList: EducationItem[];
}

export const Education: React.FC<EducationProps> = ({ educationList }) => {
  useEffect(() => {
    if (educationList.length === 0) return;

    const timeline = document.querySelector('.education-timeline');
    const timelineFill = document.querySelector('.education-timeline-fill');
    const timelineSpark = document.querySelector('.timeline-spark');
    const timelineItems = document.querySelectorAll('.education-item');

    if (!timeline || !timelineFill) return;

    // Timeline fill height maps directly to scroll percentage
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

    // Activate timeline items
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
  }, [educationList]);

  return (
    <section id="education" className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Education</h2>
          <p className="section-subtitle">My academic journey</p>
        </div>
        <div className="education-timeline">
          <div className="education-timeline-fill"></div>
          <div className="timeline-spark"></div>
          {educationList.map((edu) => (
            <div key={edu._id} className="education-item">
              <span className="education-date">{edu.date}</span>
              <h3 className="education-degree">{edu.degree}</h3>
              <p className="education-institution">{edu.institution}</p>
              <p className="education-details">{edu.details}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
