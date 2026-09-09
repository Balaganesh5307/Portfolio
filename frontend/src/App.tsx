import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// Portfolio Components
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Highlights } from './components/Highlights';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Education } from './components/Education';
import { Experience } from './components/Experience';
import { Certifications } from './components/Certifications';
import { Platforms } from './components/Platforms';
import { Declaration } from './components/Declaration';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ScrollButtons } from './components/ScrollButtons';

// Admin Components
import { AdminLayout } from './admin/AdminLayout';
import { Dashboard } from './admin/Dashboard';
import { BlogList } from './admin/BlogList';
import { BlogEditor } from './admin/BlogEditor';
import { CertManager } from './admin/CertManager';
import { ResumeManager } from './admin/ResumeManager';
import { ExperienceManager } from './admin/ExperienceManager';

// GSAP registration
gsap.registerPlugin(ScrollTrigger);

// ==================== PORTFOLIO PAGE ====================
const Portfolio: React.FC = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);

  // Database Data States
  const [aboutData, setAboutData] = useState<any>(null);
  const [highlights, setHighlights] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [educationList, setEducationList] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [platforms, setPlatforms] = useState<any[]>([]);

  // 1. Fetch data from MERN APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          aboutRes,
          highlightsRes,
          skillsRes,
          projectsRes,
          educationRes,
          experienceRes,
          certificationsRes,
          platformsRes
        ] = await Promise.all([
          fetch('/api/about'),
          fetch('/api/highlights'),
          fetch('/api/skills'),
          fetch('/api/projects'),
          fetch('/api/education'),
          fetch('/api/experience'),
          fetch('/api/certifications'),
          fetch('/api/platforms')
        ]);

        const aboutJson = await aboutRes.json();
        const highlightsJson = await highlightsRes.json();
        const skillsJson = await skillsRes.json();
        const projectsJson = await projectsRes.json();
        const educationJson = await educationRes.json();
        const experienceJson = await experienceRes.json();
        const certificationsJson = await certificationsRes.json();
        const platformsJson = await platformsRes.json();

        setAboutData(aboutJson);
        setHighlights(highlightsJson);
        setSkills(skillsJson);
        setProjects(projectsJson);
        setEducationList(educationJson);
        setExperiences(experienceJson);
        setCertifications(certificationsJson);
        setPlatforms(platformsJson);

        setDataLoaded(true);
      } catch (err) {
        console.error('Error fetching data from API:', err);
        setDataLoaded(true);
      }
    };

    fetchData();
  }, []);

  // 2. Simulated Loader Progress Bar
  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        if (dataLoaded) {
          triggerEntranceAnimation();
        }
      }
      setLoadingProgress(progress);
    }, 80);

    return () => clearInterval(interval);
  }, [dataLoaded]);

  // Handle entrance animations after loader hides
  const triggerEntranceAnimation = () => {
    const loaderWrapper = document.querySelector('.loader-wrapper');
    if (!loaderWrapper) {
      setIsLoading(false);
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setIsLoading(false);
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 300);
      }
    });

    tl.to(loaderWrapper, {
      opacity: 0,
      y: -50,
      duration: 0.8,
      ease: 'power4.inOut'
    });

    tl.from('.hero-badge', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.4');

    tl.from('.reveal-name', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power4.out'
    }, '-=0.4');

    tl.from('.hero-title', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.5');

    tl.from('.hero-summary', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.5');

    tl.from('.hero-actions', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.5');

    tl.from('.hero-contact', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.4');

    tl.from('.header-logo', {
      opacity: 0,
      x: -20,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.8');

    tl.from('.nav-list li', {
      opacity: 0,
      y: -10,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power3.out'
    }, '-=0.8');
  };

  // 3. Initialize Animations & scrolling when page finishes loading
  useEffect(() => {
    if (isLoading) return;

    const isMobile = window.innerWidth <= 768;

    // A. Lenis Smooth Scroll
    let lenis: Lenis | null = null;
    if (!isMobile) {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        autoRaf: true,
      });

      setLenisInstance(lenis);

      // Connect Lenis to ScrollTrigger
      lenis.on('scroll', ScrollTrigger.update);
    }


    // C. Active Link Highlight Indicator
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const highlightNavLink = () => {
      const scrollY = window.pageYOffset;
      sections.forEach(current => {
        const sectionHeight = (current as HTMLElement).offsetHeight;
        const sectionTop = (current as HTMLElement).offsetTop - 120;
        const sectionId = current.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    };

    window.addEventListener('scroll', highlightNavLink);

    // Injected active link styling
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      .nav-link.active {
        color: var(--color-accent) !important;
      }
      .nav-link.active::after {
        width: 100% !important;
      }
    `;
    document.head.appendChild(styleEl);

    // D. Cyber Scramble Text Decode Effect
    class TextScrambler {
      el: HTMLElement;
      chars: string;
      oldText: string;
      newText: string;
      promise: Promise<void> | null;
      resolve: any;
      queue: any[];
      frame: number;
      frameId: number;

      constructor(el: HTMLElement) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________01010101';
        this.oldText = '';
        this.newText = '';
        this.promise = null;
        this.queue = [];
        this.frame = 0;
        this.frameId = 0;
        this.update = this.update.bind(this);
      }
      setText(newText: string) {
        this.oldText = this.el.innerText;
        this.newText = newText;
        this.promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < this.newText.length; i++) {
          const from = this.oldText[i] || '';
          const to = this.newText[i] || '';
          const start = Math.floor(Math.random() * 16);
          const end = start + Math.floor(Math.random() * 16);
          this.queue.push({ from, to, start, end, char: '' });
        }
        cancelAnimationFrame(this.frameId);
        this.frame = 0;
        this.update();
        return this.promise;
      }
      update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
          let { from, to, start, end, char } = this.queue[i];
          if (this.frame >= end) {
            complete++;
            output += to;
          } else if (this.frame >= start) {
            if (!char || Math.random() < 0.28) {
              char = this.randomChar();
              this.queue[i].char = char;
            }
            output += `<span style="color: var(--color-accent); text-shadow: 0 0 8px var(--color-accent);">${char}</span>`;
          } else {
            output += from;
          }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
          this.resolve();
        } else {
          this.frameId = requestAnimationFrame(this.update);
          this.frame++;
        }
      }
      randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
      }
    }

    const scrambleElements = document.querySelectorAll('.section-title, .reveal-name');
    const scrambleCleanups: (() => void)[] = [];

    scrambleElements.forEach(element => {
      const el = element as HTMLElement;
      const scrambler = new TextScrambler(el);
      const originalText = el.textContent?.trim() || '';
      let isScrambling = false;

      const triggerScramble = () => {
        if (isScrambling) return;
        isScrambling = true;
        scrambler.setText(originalText).then(() => {
          isScrambling = false;
        });
      };

      el.addEventListener('mouseenter', triggerScramble);
      scrambleCleanups.push(() => el.removeEventListener('mouseenter', triggerScramble));

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: triggerScramble
      });
    });

    // E. Smooth Scroll Reveal Animations
    // Using CSS classes instead of gsap.from() to avoid elements being invisible before trigger fires
    const revealElements = document.querySelectorAll(
      '.section-header, .highlight-item, .skill-group, .platform-card, .declaration-card, .contact-detail-item, .social-link, .footer'
    );

    // Set initial hidden state via CSS class
    revealElements.forEach(el => {
      (el as HTMLElement).style.opacity = '0';
      (el as HTMLElement).style.transform = 'translateY(25px)';
    });

    const revealTriggers: ScrollTrigger[] = [];

    // Stagger groups: elements that should animate together with stagger
    const staggerGroups: { selector: string; triggerSelector: string; stagger: number; fromX?: number }[] = [
      { selector: '.highlight-item', triggerSelector: '.highlights-grid', stagger: 0.08 },
      { selector: '.skill-group', triggerSelector: '.skills-simple-grid', stagger: 0.1 },
      { selector: '.platform-card', triggerSelector: '.platforms-grid', stagger: 0.12 },
      { selector: '.contact-detail-item', triggerSelector: '.contact-details', stagger: 0.08, fromX: -15 },
      { selector: '.social-link', triggerSelector: '.social-links', stagger: 0.08, fromX: 15 },
    ];

    staggerGroups.forEach(group => {
      const items = document.querySelectorAll(group.selector);
      const triggerEl = document.querySelector(group.triggerSelector);
      if (items.length > 0 && triggerEl) {
        const trigger = ScrollTrigger.create({
          trigger: triggerEl,
          start: 'top 88%',
          once: true,
          onEnter: () => {
            gsap.to(items, {
              opacity: 1,
              y: 0,
              x: 0,
              duration: 0.6,
              stagger: group.stagger,
              ease: 'power3.out',
              overwrite: 'auto'
            });
          }
        });
        revealTriggers.push(trigger);

        // Set initial X offset if specified
        if (group.fromX) {
          items.forEach(el => {
            (el as HTMLElement).style.transform = `translate(${group.fromX}px, 0px)`;
          });
        }
      }
    });

    // Individual reveals: section headers, declaration, footer
    gsap.utils.toArray('.section-header').forEach((header: any) => {
      const trigger = ScrollTrigger.create({
        trigger: header,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.to(header, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            overwrite: 'auto'
          });
        }
      });
      revealTriggers.push(trigger);
    });

    const declarationCard = document.querySelector('.declaration-card');
    if (declarationCard) {
      (declarationCard as HTMLElement).style.opacity = '0';
      (declarationCard as HTMLElement).style.transform = 'translateY(25px)';
      const trigger = ScrollTrigger.create({
        trigger: '.declaration-section',
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(declarationCard, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        }
      });
      revealTriggers.push(trigger);
    }

    const footerEl = document.querySelector('.footer');
    if (footerEl) {
      (footerEl as HTMLElement).style.opacity = '0';
      (footerEl as HTMLElement).style.transform = 'translateY(15px)';
      const trigger = ScrollTrigger.create({
        trigger: footerEl,
        start: 'top 95%',
        once: true,
        onEnter: () => {
          gsap.to(footerEl, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        }
      });
      revealTriggers.push(trigger);
    }

    // F. Direction-Aware Header Auto-Hide
    let lastScrollY = 0;
    let headerHidden = false;
    const headerEl = document.querySelector('.header') as HTMLElement;

    const handleHeaderScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 300) {
        if (currentScrollY > lastScrollY && !headerHidden) {
          headerHidden = true;
          gsap.to(headerEl, { y: -80, duration: 0.3, ease: 'power2.inOut', overwrite: 'auto' });
        } else if (currentScrollY < lastScrollY && headerHidden) {
          headerHidden = false;
          gsap.to(headerEl, { y: 0, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
        }
      } else if (headerHidden) {
        headerHidden = false;
        gsap.to(headerEl, { y: 0, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });

    // G. Extra safety scroll trigger refresh
    const refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1000);

    return () => {
      if (lenis) lenis.destroy();

      window.removeEventListener('scroll', highlightNavLink);
      window.removeEventListener('scroll', handleHeaderScroll);
      document.head.removeChild(styleEl);
      scrambleCleanups.forEach(c => c());
      revealTriggers.forEach(t => t.kill());
      clearTimeout(refreshTimeout);
    };
  }, [isLoading]);

  return (
    <div className="app">

      {/* Simulated BG Loading Screen */}
      {isLoading && (
        <div className="loader-wrapper">
          <img src="/logo.png" alt="Loading Logo" className="loader-logo" />
          <div className="loader-bar">
            <div className="loader-progress" style={{ width: `${loadingProgress}%` }}></div>
          </div>
        </div>
      )}

      {/* Main Pages Setup once loaded */}
      {aboutData && (
        <>
          <Header lenis={lenisInstance} />
          
          <main>
            <Hero aboutData={aboutData} />
            <Highlights highlights={highlights} />
            <About 
              aboutTextDesktop={aboutData.aboutTextDesktop} 
              aboutTextMobile={aboutData.aboutTextMobile} 
              quickInfo={aboutData.quickInfo} 
            />
            <Skills skills={skills} />
            <Projects projects={projects} />
            <Education educationList={educationList} />
            <Experience experiences={experiences} />
            <Certifications certifications={certifications} />
            <Platforms platforms={platforms} />
            <Declaration 
              declarationText={aboutData.declarationText}
              signatureName={aboutData.signatureName}
              signatureLocation={aboutData.signatureLocation}
              signatureAvatar={aboutData.signatureAvatar}
            />
            <Contact 
              email={aboutData.email}
              phone={aboutData.phone}
              location={aboutData.location}
            />
          </main>

          <Footer lenis={lenisInstance} />
          <ScrollButtons lenis={lenisInstance} />
        </>
      )}
    </div>
  );
};

// ==================== APP ROOT WITH ROUTER ====================
export const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Portfolio */}
        <Route path="/" element={<Portfolio />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="blogs" element={<BlogList />} />
          <Route path="blogs/new" element={<BlogEditor />} />
          <Route path="blogs/edit/:id" element={<BlogEditor />} />
          <Route path="certifications" element={<CertManager />} />
          <Route path="resume" element={<ResumeManager />} />
          <Route path="experience" element={<ExperienceManager />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
