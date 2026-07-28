import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { Mail, Phone, MapPin, Download } from 'lucide-react';

gsap.registerPlugin(TextPlugin);

interface HeroProps {
  aboutData: {
    name: string;
    highlightedName: string;
    title: string;
    summary: string;
    resumeUrl: string;
    email: string;
    phone: string;
    location: string;
  };
}

export const Hero: React.FC<HeroProps> = ({ aboutData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const typedRoleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const glow = glowRef.current;
    const canvas = canvasRef.current;
    const typedRole = typedRoleRef.current;

    if (!hero || !glow || !canvas) return;

    // 1. Mouse Follow Gradient Glow
    const isMobile = window.innerWidth <= 768;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    gsap.to(glow, { opacity: 1, duration: 1.5, delay: 1 });

    const handleMouseMoveGlow = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      gsap.to(glow, {
        x: x,
        y: y,
        duration: 0.6,
        ease: 'power2.out'
      });
    };

    hero.addEventListener('mousemove', handleMouseMoveGlow);

    // 2. Typing Role Loop
    let typingTween: gsap.core.Tween;
    let typingTimeout: any;
    if (typedRole) {
      const roles = [
        "AI & Data Science Student",
        "Full-Stack Developer",
        "Competitive Programmer",
        "Problem Solver"
      ];
      let currentRoleIndex = 0;

      const typeNextRole = () => {
        currentRoleIndex = (currentRoleIndex + 1) % roles.length;
        // Delete text
        gsap.to(typedRole, {
          duration: 0.6,
          text: "",
          delay: 2.5,
          ease: "power2.inOut",
          onComplete: () => {
            // Type new text
            typingTween = gsap.to(typedRole, {
              duration: 1.0,
              text: roles[currentRoleIndex],
              ease: "power2.inOut",
              onComplete: typeNextRole
            });
          }
        });
      };
      
      typingTimeout = setTimeout(typeNextRole, 2000);
    }

    // 3. Canvas Neural Particles Background
    let animationFrameId: number;
    let resizeListener: () => void;
    let handleMouseMoveParticles: (e: MouseEvent) => void;
    let handleMouseLeaveParticles: () => void;

    if (!isMobile) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        let particles: Particle[] = [];
        let mouse: { x: number | null; y: number | null; radius: number } = { x: null, y: null, radius: 140 };

        const resizeCanvas = () => {
          canvas.width = hero.offsetWidth;
          canvas.height = hero.offsetHeight;
          initParticles();
        };

        class Particle {
          x: number;
          y: number;
          size: number;
          vx: number;
          vy: number;
          color: string;

          constructor() {
            this.x = Math.random() * canvas!.width;
            this.y = Math.random() * canvas!.height;
            this.size = Math.random() * 2 + 1.2;
            this.vx = (Math.random() * 0.4) - 0.2;
            this.vy = (Math.random() * 0.4) - 0.2;
            this.color = 'rgba(99, 102, 241, 0.4)';
          }

          draw() {
            ctx!.fillStyle = this.color;
            ctx!.beginPath();
            ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx!.closePath();
            ctx!.fill();
          }

          update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas!.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas!.height) this.vy = -this.vy;

            if (mouse.x !== null && mouse.y !== null) {
              let dx = mouse.x - this.x;
              let dy = mouse.y - this.y;
              let distance = Math.sqrt(dx * dx + dy * dy);
              if (distance < mouse.radius) {
                let force = (mouse.radius - distance) / mouse.radius;
                let directionX = dx / distance;
                let directionY = dy / distance;
                this.x += directionX * force * 1.6;
                this.y += directionY * force * 1.6;
              }
            }
          }
        }

        const initParticles = () => {
          particles = [];
          const particleCount = Math.floor((canvas.width * canvas.height) / 16000);
          for (let i = 0; i < Math.min(particleCount, 75); i++) {
            particles.push(new Particle());
          }
        };

        const animateParticles = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          for (let i = 0; i < particles.length; i++) {
            particles[i].draw();
            particles[i].update();

            for (let j = i + 1; j < particles.length; j++) {
              const dx = particles[i].x - particles[j].x;
              const dy = particles[i].y - particles[j].y;
              const dist = Math.sqrt(dx * dx + dy * dy);

              if (dist < 115) {
                let alpha = (115 - dist) / 115 * 0.18;
                let nearMouse = false;
                
                if (mouse.x !== null && mouse.y !== null) {
                  let midX = (particles[i].x + particles[j].x) / 2;
                  let midY = (particles[i].y + particles[j].y) / 2;
                  let mDx = mouse.x - midX;
                  let mDy = mouse.y - midY;
                  let mDist = Math.sqrt(mDx * mDx + mDy * mDy);
                  if (mDist < 130) {
                    nearMouse = true;
                    alpha = alpha * (2.2 - (mDist / 130));
                  }
                }

                ctx.strokeStyle = nearMouse ? `rgba(99, 102, 241, ${alpha * 1.5})` : `rgba(99, 102, 241, ${alpha})`;
                ctx.lineWidth = nearMouse ? 1.6 : 1;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
                ctx.closePath();
              }
            }
          }
          animationFrameId = requestAnimationFrame(animateParticles);
        };

        resizeCanvas();
        resizeListener = () => resizeCanvas();
        window.addEventListener('resize', resizeListener);
        animateParticles();

        handleMouseMoveParticles = (e: MouseEvent) => {
          const rect = hero.getBoundingClientRect();
          mouse.x = e.clientX - rect.left;
          mouse.y = e.clientY - rect.top;
        };

        handleMouseLeaveParticles = () => {
          mouse.x = null;
          mouse.y = null;
        };

        hero.addEventListener('mousemove', handleMouseMoveParticles);
        hero.addEventListener('mouseleave', handleMouseLeaveParticles);
      }
    }

    // 4. Elastic Magnetic Buttons Hover depth
    const magneticButtons = hero.querySelectorAll('.btn-primary, .btn-outline, .social-link, .nav-link, .project-link, .mobile-menu-btn');
    const magneticCleanups: (() => void)[] = [];

    if (magneticButtons.length > 0 && !isTouchDevice) {
      magneticButtons.forEach((btnElement) => {
        const btn = btnElement as HTMLElement;
        const handleMouseMoveBtn = (e: MouseEvent) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;

          gsap.to(btn, {
            x: x * 0.35,
            y: y * 0.35,
            rotateX: -y * 0.05,
            rotateY: x * 0.05,
            duration: 0.3,
            ease: "power2.out"
          });

          const innerText = btn.querySelector('.social-link-text, span, svg');
          if (innerText) {
            gsap.to(innerText, {
              x: x * 0.15,
              y: y * 0.15,
              duration: 0.3,
              ease: "power2.out"
            });
          }
        };

        const handleMouseLeaveBtn = () => {
          gsap.to(btn, {
            x: 0,
            y: 0,
            rotateX: 0,
            rotateY: 0,
            duration: 0.5,
            ease: "elastic.out(1.1, 0.6)"
          });
          const innerText = btn.querySelector('.social-link-text, span, svg');
          if (innerText) {
            gsap.to(innerText, {
              x: 0,
              y: 0,
              duration: 0.5,
              ease: "elastic.out(1.1, 0.6)"
            });
          }
        };

        btn.addEventListener('mousemove', handleMouseMoveBtn);
        btn.addEventListener('mouseleave', handleMouseLeaveBtn);

        magneticCleanups.push(() => {
          btn.removeEventListener('mousemove', handleMouseMoveBtn);
          btn.removeEventListener('mouseleave', handleMouseLeaveBtn);
        });
      });
    }

    // Main Cleanup
    return () => {
      hero.removeEventListener('mousemove', handleMouseMoveGlow);
      if (resizeListener) window.removeEventListener('resize', resizeListener);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (handleMouseMoveParticles) hero.removeEventListener('mousemove', handleMouseMoveParticles);
      if (handleMouseLeaveParticles) hero.removeEventListener('mouseleave', handleMouseLeaveParticles);
      magneticCleanups.forEach(cleanup => cleanup());
      
      if (typingTimeout) clearTimeout(typingTimeout);
      if (typingTween) typingTween.kill();
    };
  }, [aboutData]);

  // Floating animations for badge and summary
  useEffect(() => {
    gsap.to('.hero-badge', {
      y: -10,
      duration: 2.2,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1
    });

    gsap.to('.hero-summary', {
      y: -4,
      duration: 3,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1
    });

    gsap.to('.btn-primary', {
      scale: 1.03,
      duration: 1.2,
      yoyo: true,
      repeat: -1,
      ease: 'power1.inOut'
    });
  }, []);

  return (
    <section ref={heroRef} className="hero">
      <canvas ref={canvasRef} id="hero-particles"></canvas>
      <div ref={glowRef} className="hero-glow"></div>
      <div className="container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            <span className="hero-badge-text">Open to Opportunities</span>
          </div>

          <h1 className="hero-name reveal-name">
            {aboutData.name} <span className="hero-name-highlight">{aboutData.highlightedName}</span>
          </h1>

          <p className="hero-title">
            <span className="hero-title-divider"></span>
            <span ref={typedRoleRef} className="typed-role">{aboutData.title}</span>
          </p>

          <p className="hero-summary">{aboutData.summary}</p>

          <div className="hero-actions">
            <a href="#contact" className="btn btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                strokeLinejoin="round" style={{ marginRight: '8px' }}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg> Get in Touch
            </a>
            <a href={aboutData.resumeUrl} className="btn btn-outline" target="_blank" rel="noopener noreferrer">
              <Download size={16} style={{ marginRight: '8px' }} /> Download Resume
            </a>
          </div>

          <div className="hero-contact">
            <div className="contact-row">
              <div className="contact-item">
                <Mail size={20} style={{ marginRight: '8px' }} />
                <span>{aboutData.email}</span>
              </div>
              <div className="contact-item">
                <Phone size={20} style={{ marginRight: '8px' }} />
                <span>{aboutData.phone}</span>
              </div>
              <div className="contact-item">
                <MapPin size={20} style={{ marginRight: '8px' }} />
                <span>{aboutData.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
