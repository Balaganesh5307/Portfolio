import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface ScrollButtonsProps {
  lenis: any;
}

export const ScrollButtons: React.FC<ScrollButtonsProps> = ({ lenis }) => {
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      
      // Show top button if scrolled down more than 300px
      setShowTop(scrollY > 300);
      // Show bottom button if there is still more than 300px to scroll
      setShowBottom(maxScroll - scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    // Initial run to set initial visibility states
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToBottom = () => {
    if (lenis) {
      lenis.scrollTo(document.documentElement.scrollHeight, { duration: 1.2 });
    } else {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="scroll-buttons-container">
      <button
        onClick={scrollToTop}
        className={`scroll-btn ${showTop ? 'visible' : ''}`}
        aria-label="Scroll to top"
      >
        <ChevronUp size={24} />
      </button>
      <button
        onClick={scrollToBottom}
        className={`scroll-btn ${showBottom ? 'visible' : ''}`}
        aria-label="Scroll to bottom"
      >
        <ChevronDown size={24} />
      </button>
    </div>
  );
};
