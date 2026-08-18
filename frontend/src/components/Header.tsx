import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Download } from 'lucide-react';

interface HeaderProps {
  lenis: any;
}

export const Header: React.FC<HeaderProps> = ({ lenis }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      alert("App is already installed or installation is not supported on this browser.");
    }
  };

  // Secret 5-click admin access
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    clickCountRef.current += 1;

    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);

    if (clickCountRef.current >= 5) {
      clickCountRef.current = 0;
      window.location.hash = '#/admin';
      return;
    }

    // Reset counter after 2 seconds of inactivity
    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 2000);

    // Also do the normal scroll-to-top behavior
    handleLinkClick(e, '#');
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      gsap.fromTo('.mobile-nav-link', 
        { x: -30, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out', overwrite: 'auto' }
      );
    }
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const headerOffset = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      if (lenis) {
        lenis.scrollTo(offsetPosition, {
          duration: 1.2,
          immediate: false
        });
      } else {
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <>
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container header-content">
          <a href="#" className="header-logo" onClick={handleLogoClick}>
            <span className="logo-badge">BG</span>
          </a>
          <nav>
            <ul className="nav-list">
              <li><a href="#about" className="nav-link" onClick={(e) => handleLinkClick(e, '#about')}>About</a></li>
              <li><a href="#skills" className="nav-link" onClick={(e) => handleLinkClick(e, '#skills')}>Skills</a></li>
              <li><a href="#projects" className="nav-link" onClick={(e) => handleLinkClick(e, '#projects')}>Projects</a></li>
              <li><a href="#education" className="nav-link" onClick={(e) => handleLinkClick(e, '#education')}>Education</a></li>
              <li><a href="#experience" className="nav-link" onClick={(e) => handleLinkClick(e, '#experience')}>Experience</a></li>
              <li><a href="#certifications" className="nav-link" onClick={(e) => handleLinkClick(e, '#certifications')}>Certifications</a></li>
              <li><a href="#contact" className="nav-link" onClick={(e) => handleLinkClick(e, '#contact')}>Contact</a></li>
            </ul>
          </nav>
          
          <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              className="download-app-btn"
              onClick={handleInstallClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#7C3AED', 
                color: 'white',
                padding: '10px 20px',
                borderRadius: '24px',
                border: 'none',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(124, 58, 237, 0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              <Download size={18} /> Download App
            </button>
            <button className="mobile-menu-btn" aria-label="Toggle menu" onClick={toggleMenu}>
            <span className="menu-icon" style={{ display: isMenuOpen ? 'none' : 'block' }}>
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <line x1="3" y1="12" x2="21" y2="12"></line>
                 <line x1="3" y1="6" x2="21" y2="6"></line>
                 <line x1="3" y1="18" x2="21" y2="18"></line>
               </svg>
             </span>
             <span className="close-icon" style={{ display: isMenuOpen ? 'block' : 'none' }}>
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <line x1="18" y1="6" x2="6" y2="18"></line>
                 <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </span>
            </button>
          </div>
        </div>
      </header>

      <nav className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-nav-list">
          <li><a href="#about" className="mobile-nav-link" onClick={(e) => handleLinkClick(e, '#about')}>About</a></li>
          <li><a href="#skills" className="mobile-nav-link" onClick={(e) => handleLinkClick(e, '#skills')}>Skills</a></li>
          <li><a href="#projects" className="mobile-nav-link" onClick={(e) => handleLinkClick(e, '#projects')}>Projects</a></li>
          <li><a href="#education" className="mobile-nav-link" onClick={(e) => handleLinkClick(e, '#education')}>Education</a></li>
          <li><a href="#experience" className="mobile-nav-link" onClick={(e) => handleLinkClick(e, '#experience')}>Experience</a></li>
          <li><a href="#certifications" className="mobile-nav-link" onClick={(e) => handleLinkClick(e, '#certifications')}>Certifications</a></li>
          <li><a href="#contact" className="mobile-nav-link" onClick={(e) => handleLinkClick(e, '#contact')}>Contact</a></li>
          <li style={{ marginTop: '16px' }}>
            <button 
              onClick={handleInstallClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                backgroundColor: '#7C3AED',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '24px',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer',
                width: '100%',
                boxShadow: '0 4px 6px rgba(124, 58, 237, 0.2)'
              }}
            >
              <Download size={20} /> Download App
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
};
