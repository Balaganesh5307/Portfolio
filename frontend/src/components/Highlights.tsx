import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Icon } from './Icon';

gsap.registerPlugin(ScrollTrigger);

interface HighlightItem {
  _id: string;
  value: string;
  label: string;
  iconName: string;
}

interface HighlightsProps {
  highlights: HighlightItem[];
}

export const Highlights: React.FC<HighlightsProps> = ({ highlights }) => {
  useEffect(() => {
    if (highlights.length === 0) return;

    const values = document.querySelectorAll('.highlight-value');
    const animations: gsap.core.Tween[] = [];

    values.forEach(counter => {
      const targetText = counter.textContent?.trim() || '';
      const isPercent = targetText.includes('%');
      const isPlus = targetText.includes('+');
      const targetVal = parseFloat(targetText.replace(/[^0-9.]/g, ''));
      
      if (isNaN(targetVal)) return;

      let startVal = 0;
      if (targetVal === 2028) startVal = 2000;

      const countObj = { val: startVal };
      const anim = gsap.to(countObj, {
        val: targetVal,
        duration: 2.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: counter,
          start: 'top 90%'
        },
        onUpdate: () => {
          let formatted = Math.floor(countObj.val).toString();
          if (isPlus) formatted += '+';
          if (isPercent) formatted += '%';
          counter.textContent = formatted;
        }
      });
      animations.push(anim);
    });

    return () => {
      animations.forEach(anim => {
        if (anim.scrollTrigger) anim.scrollTrigger.kill();
        anim.kill();
      });
    };
  }, [highlights]);

  return (
    <section className="highlights-section">
      <div className="container">
        <div className="highlights-grid">
          {highlights.map((item) => (
            <div key={item._id} className="highlight-item">
              <div className="highlight-icon">
                <Icon name={item.iconName} />
              </div>
              <span className="highlight-value">{item.value}</span>
              <span className="highlight-label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
