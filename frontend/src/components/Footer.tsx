import React from 'react';

interface FooterProps {
  lenis: any;
}

export const Footer: React.FC<FooterProps> = ({ lenis }) => {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
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
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <p className="footer-text">
            © {new Date().getFullYear()} Designed by Balaganesh.
          </p>
          <div className="footer-links">
            <a href="#about" className="footer-link" onClick={(e) => handleLinkClick(e, '#about')}>About</a>
            <a href="#projects" className="footer-link" onClick={(e) => handleLinkClick(e, '#projects')}>Projects</a>
            <a href="#contact" className="footer-link" onClick={(e) => handleLinkClick(e, '#contact')}>Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
