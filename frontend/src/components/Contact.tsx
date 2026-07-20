import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Github, Linkedin } from './Icon';

gsap.registerPlugin(ScrollTrigger);


interface ContactProps {
  email: string;
  phone: string;
  location: string;
}

export const Contact: React.FC<ContactProps> = ({ email, phone, location }) => {
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;

    const ctx = gsap.context(() => {
      // Contact animations
      gsap.from('.contact-info', {
        x: -30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#contact',
          start: 'top 80%'
        }
      });

      gsap.from('.contact-social-grid', {
        x: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#contact',
          start: 'top 80%'
        }
      });

      // Blob movement animation
      if (!isMobile) {
        const contactBlob1 = document.querySelector('.contact-blob.blob-1');
        if (contactBlob1) {
          gsap.to(contactBlob1, {
            x: 'random(-50, 50)',
            y: 'random(-50, 50)',
            duration: 8,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          });
        }

        const contactBlob2 = document.querySelector('.contact-blob.blob-2');
        if (contactBlob2) {
          gsap.to(contactBlob2, {
            x: 'random(-60, 60)',
            y: 'random(-60, 60)',
            duration: 10,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          });
        }
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" className="section">
      <div className="contact-blob blob-1"></div>
      <div className="contact-blob blob-2"></div>
      <div className="container">
        <div className="contact-grid">
          <div className="contact-info">
            <h2 className="contact-title">Let's Connect</h2>
            <p className="contact-text">
              I'm currently open to internship opportunities, collaborative projects, and learning
              experiences. Feel free to reach out if you'd like to work together or just say hello!
            </p>
            <div className="contact-details">
              <div className="contact-detail-item">
                <div className="contact-detail-icon">
                  <Mail size={20} />
                </div>
                <div className="contact-detail-content">
                  <span className="contact-detail-label">Email</span>
                  <span className="contact-detail-value">{email}</span>
                </div>
              </div>
              <div className="contact-detail-item">
                <div className="contact-detail-icon">
                  <Phone size={20} />
                </div>
                <div className="contact-detail-content">
                  <span className="contact-detail-label">Phone</span>
                  <span className="contact-detail-value">{phone}</span>
                </div>
              </div>
              <div className="contact-detail-item">
                <div className="contact-detail-icon">
                  <MapPin size={20} />
                </div>
                <div className="contact-detail-content">
                  <span className="contact-detail-label">Location</span>
                  <span className="contact-detail-value">{location}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-social-grid">
            <h3 className="social-title">Connect With Me</h3>
            <div className="social-links">
              <a href="https://github.com/Balaganesh5307/" className="social-link" target="_blank"
                rel="noopener noreferrer">
                <Github size={20} />
                <span className="social-link-text">GitHub</span>
                <span className="social-link-arrow">
                  <Send size={16} />
                </span>
              </a>
              <a href="https://www.linkedin.com/in/balaganesh-p-4b3057328/" className="social-link"
                target="_blank" rel="noopener noreferrer">
                <Linkedin size={20} />
                <span className="social-link-text">LinkedIn</span>
                <span className="social-link-arrow">
                  <Send size={16} />
                </span>
              </a>
              <a href={`mailto:${email}`} className="social-link">
                <Mail size={20} />
                <span className="social-link-text">Send Email</span>
                <span className="social-link-arrow">
                  <Send size={16} />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
