import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface QuickInfoItem {
  _id: string;
  label: string;
  value: string;
}

interface AboutProps {
  aboutTextDesktop: string[];
  aboutTextMobile: string[];
  quickInfo: QuickInfoItem[];
}

export const About: React.FC<AboutProps> = ({ aboutTextDesktop, aboutTextMobile, quickInfo }) => {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Text container & quick info slide up
      gsap.from('.about-text', {
        x: -40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#about',
          start: 'top 80%'
        }
      });

      gsap.from('.about-info', {
        x: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#about',
          start: 'top 80%'
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">About Me</h2>
          <p className="section-subtitle">Get to know my background and interests</p>
        </div>
        <div className="about-grid">
          <div className="about-text">
            <div className="about-desktop">
              {aboutTextDesktop.map((paragraph, index) => (
                <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
              ))}
            </div>
            <div className="about-mobile">
              {aboutTextMobile.map((paragraph, index) => (
                <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
              ))}
            </div>
          </div>

          <div className="about-info">
            <h3 className="about-info-title">Quick Info</h3>
            <div className="about-info-list">
              {quickInfo.map((item) => (
                <div key={item._id} className="about-info-item">
                  <span className="about-info-label">{item.label}</span>
                  <span className="about-info-value">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
