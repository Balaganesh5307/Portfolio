import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Icon } from './Icon';

gsap.registerPlugin(ScrollTrigger);

interface CertificationItem {
  _id: string;
  title: string;
  provider: string;
  image: string;
  iconName: string;
}

interface CertificationsProps {
  certifications: CertificationItem[];
}

export const Certifications: React.FC<CertificationsProps> = ({ certifications }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeCert, setActiveCert] = useState<CertificationItem | null>(null);
  const autoSlideRef = useRef<any>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalImgRef = useRef<HTMLImageElement>(null);

  // Setup Coverflow entrance animation
  useEffect(() => {
    if (certifications.length === 0) return;

    // Set initial middle card
    setCurrentIndex(Math.floor(certifications.length / 2));

    const particles = document.querySelectorAll('.particle');
    const navButtons = document.querySelectorAll('.coverflow-nav-btn');
    const btnCleanups: (() => void)[] = [];

    const ctx = gsap.context(() => {
      gsap.from('.coverflow-container', {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#certifications',
          start: 'top 80%'
        }
      });

      // floating background particles
      Array.from(particles).forEach((particle, index) => {
        gsap.to(particle, {
          y: -30,
          opacity: 0,
          duration: 8,
          repeat: -1,
          ease: 'none',
          delay: index * 1.6
        });
      });

      // Nav buttons hover shadows
      navButtons.forEach(btnElement => {
        const btn = btnElement as HTMLElement;
        const onEnter = () => {
          gsap.to(btn, {
            scale: 1.1,
            boxShadow: `0 12px 35px rgba(99, 102, 241, 0.4), 0 0 0 4px rgba(99, 102, 241, 0.2)`,
            duration: 0.3,
            ease: 'power2.out'
          });
        };
        const onLeave = () => {
          gsap.to(btn, {
            scale: 1,
            boxShadow: `0 8px 25px rgba(99, 102, 241, 0.3)`,
            duration: 0.3,
            ease: 'power2.out'
          });
        };
        btn.addEventListener('mouseenter', onEnter);
        btn.addEventListener('mouseleave', onLeave);
        btnCleanups.push(() => {
          btn.removeEventListener('mouseenter', onEnter);
          btn.removeEventListener('mouseleave', onLeave);
        });
      });
    });

    return () => {
      ctx.revert();
      btnCleanups.forEach(c => c());
    };
  }, [certifications]);

  // Handle Autoplay Slider
  const startAutoSlide = () => {
    stopAutoSlide();
    autoSlideRef.current = setInterval(() => {
      handleNext();
    }, 4000);
  };

  const stopAutoSlide = () => {
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
      autoSlideRef.current = null;
    }
  };

  useEffect(() => {
    if (certifications.length > 0) {
      startAutoSlide();
    }
    return () => stopAutoSlide();
  }, [certifications, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? certifications.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === certifications.length - 1 ? 0 : prev + 1));
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      handleNext();
    } else {
      handlePrev();
    }
  };

  // Touch handlers
  let touchStartX = 0;
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.changedTouches[0].screenX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].screenX;
    const distance = touchEndX - touchStartX;
    if (Math.abs(distance) > 50) {
      handleSwipe(distance < 0 ? 'left' : 'right');
    }
  };

  // Get dynamic coverflow slide class
  const getSlideClass = (index: number) => {
    const len = certifications.length;
    if (len === 0) return 'hidden';

    const diff = index - currentIndex;

    // Normal slide positions
    if (diff === 0) return 'active';
    if (diff === -1 || (currentIndex === 0 && index === len - 1)) return 'left';
    if (diff === 1 || (currentIndex === len - 1 && index === 0)) return 'right';
    if (diff === -2 || (currentIndex === 0 && index === len - 2) || (currentIndex === 1 && index === len - 1)) return 'left-far';
    if (diff === 2 || (currentIndex === len - 1 && index === 1) || (currentIndex === len - 2 && index === 0)) return 'right-far';

    return 'hidden';
  };

  // Modal Open Animation
  const handleCardClick = (cert: CertificationItem) => {
    setActiveCert(cert);
    document.body.style.overflow = "hidden";

    // Wait for modal to render in DOM
    setTimeout(() => {
      if (modalRef.current && modalImgRef.current) {
        gsap.fromTo(modalRef.current, 
          { opacity: 0 }, 
          { opacity: 1, duration: 0.3 }
        );
        gsap.fromTo(modalImgRef.current, 
          { scale: 0.8, y: 50 }, 
          { scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.2)' }
        );
      }
    }, 10);
  };

  // Modal Close Animation
  const handleCloseModal = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0,
        duration: 0.25,
        onComplete: () => {
          setActiveCert(null);
          document.body.style.overflow = "auto";
        }
      });
    } else {
      setActiveCert(null);
      document.body.style.overflow = "auto";
    }
  };

  // Escape key close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeCert) {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCert]);

  return (
    <section id="certifications" className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Certifications</h2>
          <p className="section-subtitle">Professional credentials and courses</p>
        </div>

        <div className="coverflow-container"
             onMouseEnter={stopAutoSlide}
             onMouseLeave={startAutoSlide}>
          {/* Background Effects */}
          <div className="coverflow-bg-effects">
            <div className="floating-blob blob-1"></div>
            <div className="floating-blob blob-2"></div>
            <div className="floating-blob blob-3"></div>
          </div>

          {/* Floating Particles */}
          <div className="floating-particles">
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
          </div>

          {/* Navigation Buttons */}
          <button className="coverflow-nav-btn coverflow-prev" id="prevBtn" onClick={handlePrev}>
            <Icon name="chevron-left" />
          </button>
          
          <button className="coverflow-nav-btn coverflow-next" id="nextBtn" onClick={handleNext}>
            <Icon name="chevron-right" />
          </button>

          {/* Certificate Slider */}
          <div className="coverflow-slider" 
               id="coverflowSlider"
               onTouchStart={onTouchStart}
               onTouchEnd={onTouchEnd}>
            {certifications.map((cert, index) => {
              const slideClass = getSlideClass(index);
              return (
                <div 
                  key={cert._id}
                  className={`certificate-card-3d ${slideClass}`} 
                  onClick={() => handleCardClick(cert)}
                >
                  <div className="certificate-icon-3d">
                    <Icon name={cert.iconName} size={24} />
                  </div>
                  <div className="certificate-content-3d">
                    <h4 className="certificate-title-3d">{cert.title}</h4>
                    <div className="certificate-provider-3d">
                      <span className="provider-badge-3d">{cert.provider}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <a href="https://drive.google.com/drive/folders/10X2owoHypmtirvrw0bGKIrd1-JY4Xb7V?usp=drive_link"
            className="btn btn-primary" target="_blank" rel="noopener noreferrer">View All Certificates</a>
        </div>
      </div>

      {/* Image Modal */}
      {activeCert && (
        <div ref={modalRef} id="image-modal" className="modal" style={{ display: 'block' }} onClick={handleCloseModal}>
          <span className="close" onClick={handleCloseModal}>&times;</span>
          <img ref={modalImgRef} className="modal-content" id="img01" src={activeCert.image} alt={activeCert.title} onClick={(e) => e.stopPropagation()} />
          <div id="caption">{activeCert.title}</div>
        </div>
      )}
    </section>
  );
};
