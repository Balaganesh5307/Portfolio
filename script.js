document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------------------------
    // 1. MOBILE RESPONSIVENESS AND UTILITIES
    // --------------------------------------------------------------------------
    const isMobile = window.innerWidth <= 768;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger, TextPlugin);

    // --------------------------------------------------------------------------
    // 2. LENIS SMOOTH SCROLLING
    // --------------------------------------------------------------------------
    let lenis;
    if (!isMobile) {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            touchMultiplier: 1.5
        });

        // Connect Lenis scroll events to GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    }

    // --------------------------------------------------------------------------
    // 3. LOADER & PAGE ENTRANCE TIMELINE
    // --------------------------------------------------------------------------
    const loaderWrapper = document.querySelector('.loader-wrapper');
    const loaderProgress = document.querySelector('.loader-progress');
    
    // Simulate loading progress
    let loadPercent = 0;
    const progressInterval = setInterval(() => {
        loadPercent += Math.floor(Math.random() * 15) + 5;
        if (loadPercent >= 100) {
            loadPercent = 100;
            clearInterval(progressInterval);
            startEntranceAnimation();
        }
        if (loaderProgress) {
            loaderProgress.style.width = loadPercent + '%';
        }
    }, 80);

    function startEntranceAnimation() {
        const tl = gsap.timeline();
        
        // Hide loader
        tl.to(loaderWrapper, {
            opacity: 0,
            y: -50,
            duration: 0.8,
            ease: 'power4.inOut',
            onComplete: () => {
                loaderWrapper.style.display = 'none';
                if (lenis) lenis.start();
                ScrollTrigger.refresh();
                // Extra safety refresh after elements finish layout settling
                setTimeout(() => {
                    ScrollTrigger.refresh();
                }, 200);
            }
        });

        // Stagger reveal of hero components
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

        // Reveal navbar elements
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
    }

    // Pause scroll initially
    if (lenis) lenis.stop();

    // --------------------------------------------------------------------------
    // 4. SCROLL PROGRESS BAR
    // --------------------------------------------------------------------------
    gsap.to('.scroll-progress-bar', {
        width: '100%',
        ease: 'none',
        scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.3
        }
    });

    // --------------------------------------------------------------------------
    // 5. HERO DYNAMIC TYPING
    // --------------------------------------------------------------------------
    const typedRole = document.querySelector('.typed-role');
    if (typedRole) {
        const roles = [
            "AI & Data Science Student",
            "Full-Stack Developer",
            "Competitive Programmer",
            "Problem Solver"
        ];
        let currentRoleIndex = 0;

        function typeNextRole() {
            currentRoleIndex = (currentRoleIndex + 1) % roles.length;
            // Delete text
            gsap.to(typedRole, {
                duration: 0.6,
                text: "",
                delay: 2.5,
                ease: "power2.inOut",
                onComplete: () => {
                    // Type new text
                    gsap.to(typedRole, {
                        duration: 1.0,
                        text: roles[currentRoleIndex],
                        ease: "power2.inOut",
                        onComplete: typeNextRole
                    });
                }
            });
        }
        
        // Start typing loop
        setTimeout(typeNextRole, 2000);
    }

    // --------------------------------------------------------------------------
    // 6. MOUSE-FOLLOW GRADIENT GLOW (HERO)
    // --------------------------------------------------------------------------
    const hero = document.querySelector('.hero');
    const glow = document.querySelector('.hero-glow');
    if (hero && glow) {
        // Smoothly fade in glow opacity initially
        gsap.to(glow, { opacity: 1, duration: 1.5, delay: 1 });

        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            gsap.to(glow, {
                x: x,
                y: y,
                duration: 0.6,
                ease: 'power2.out'
            });
        });
    }

    // --------------------------------------------------------------------------
    // 7. CANVAS PARTICLES BACKGROUND
    // --------------------------------------------------------------------------
    const canvas = document.getElementById('hero-particles');
    if (canvas && !isMobile) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null, radius: 140 }; // Increased radius for better gravitational influence

        function resizeCanvas() {
            canvas.width = hero.offsetWidth;
            canvas.height = hero.offsetHeight;
            initParticles();
        }

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1.2;
                this.vx = (Math.random() * 0.4) - 0.2;
                this.vy = (Math.random() * 0.4) - 0.2;
                this.color = 'rgba(99, 102, 241, 0.4)';
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }

            update() {
                // Regular float
                this.x += this.vx;
                this.y += this.vy;

                // Wall collision
                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

                // Neural-Mesh Gravitation Attraction towards Cursor
                if (mouse.x !== null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        let force = (mouse.radius - distance) / mouse.radius;
                        let directionX = dx / distance;
                        let directionY = dy / distance;
                        
                        // Pull particles gently towards cursor
                        this.x += directionX * force * 1.6;
                        this.y += directionY * force * 1.6;
                    }
                }
            }
        }

        function initParticles() {
            particles = [];
            const particleCount = Math.floor((canvas.width * canvas.height) / 16000);
            for (let i = 0; i < Math.min(particleCount, 130); i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw & connect particles
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
                        
                        // Synaptic amplification near cursor
                        if (mouse.x !== null) {
                            let midX = (particles[i].x + particles[j].x) / 2;
                            let midY = (particles[i].y + particles[j].y) / 2;
                            let mDx = mouse.x - midX;
                            let mDy = mouse.y - midY;
                            let mDist = Math.sqrt(mDx * mDx + mDy * mDy);
                            if (mDist < 130) {
                                nearMouse = true;
                                alpha = alpha * (2.2 - (mDist / 130)); // Brighten connections closer to cursor
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
            requestAnimationFrame(animateParticles);
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        animateParticles();

        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        hero.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });
    }

    // --------------------------------------------------------------------------
    // 8. FLOATING HERO ASSETS
    // --------------------------------------------------------------------------
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

    // --------------------------------------------------------------------------
    // 9. NAVBAR BACKDROP SCROLL EFFECTS
    // --------------------------------------------------------------------------
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --------------------------------------------------------------------------
    // 10. ACTIVE LINK INDICATOR ON SCROLL
    // --------------------------------------------------------------------------
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightNavLink() {
        let scrollY = window.pageYOffset;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
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
    }
    window.addEventListener('scroll', highlightNavLink);

    // Add CSS style to highlight active link
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

    // --------------------------------------------------------------------------
    // 11. ABOUT: FADE, SLIDE, AND COUNTERS
    // --------------------------------------------------------------------------
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

    // Counters: animate .highlight-value
    const counters = document.querySelectorAll('.highlight-value');
    counters.forEach(counter => {
        const targetText = counter.textContent.trim();
        const isPercent = targetText.includes('%');
        const isPlus = targetText.includes('+');
        const targetVal = parseFloat(targetText.replace(/[^0-9.]/g, ''));
        
        let startVal = 0;
        if (targetVal === 2028) startVal = 2000; // Start closer for years

        const countObj = { val: startVal };
        gsap.to(countObj, {
            val: targetVal,
            duration: 2.2,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: counter,
                start: 'top 90%'
            },
            onUpdate: () => {
                let formatted = Math.floor(countObj.val);
                if (isPlus) formatted += '+';
                if (isPercent) formatted += '%';
                counter.textContent = formatted;
            }
        });
    });

    // --------------------------------------------------------------------------
    // 12. SKILLS STAGGER AND HOVER EFFECTS
    // --------------------------------------------------------------------------
    ScrollTrigger.create({
        trigger: '#skills',
        start: 'top 85%',
        once: true,
        onEnter: () => {
            const grid = document.querySelector('.skills-simple-grid');
            if (grid) grid.classList.add('active');
        }
    });

    // Fallback in case ScrollTrigger doesn't fire immediately
    setTimeout(() => {
        const grid = document.querySelector('.skills-simple-grid');
        if (grid && !grid.classList.contains('active')) {
            grid.classList.add('active');
        }
    }, 2000);

    // Pills floating animation
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach((tag, idx) => {
        tag.classList.add('premium-animate');
        // Gentle staggered float
        if (!isMobile) {
            gsap.to(tag, {
                y: -5,
                duration: 2 + Math.random() * 2,
                ease: 'power1.inOut',
                yoyo: true,
                repeat: -1,
                delay: idx * 0.05
            });
        }
    });

    // --------------------------------------------------------------------------
    // 13. PROJECTS CARD 3D TILT & BUTTONS SLIDE
    // --------------------------------------------------------------------------
    const projectCards = document.querySelectorAll('.project-card');
    
    // Stagger reveal project cards
    gsap.from(projectCards, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '#projects',
            start: 'top 80%'
        }
    });

    projectCards.forEach(card => {
        // Tilt animation on desktop
        if (!isTouchDevice) {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                // Rotation angles
                const rotateX = -y * 0.07;
                const rotateY = x * 0.07;

                gsap.to(card, {
                    rotateX: rotateX,
                    rotateY: rotateY,
                    transformPerspective: 1000,
                    ease: 'power2.out',
                    duration: 0.5
                });

                // Glare sheen reflection effect
                const glare = card.querySelector('.project-glare');
                if (glare) {
                    const percentX = (e.clientX - rect.left) / rect.width * 100;
                    const percentY = (e.clientY - rect.top) / rect.height * 100;
                    glare.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(99, 102, 241, 0.15) 0%, rgba(255, 255, 255, 0.15) 30%, transparent 65%)`;
                    gsap.to(glare, { opacity: 1, duration: 0.3 });
                }
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotateX: 0,
                    rotateY: 0,
                    ease: 'power2.out',
                    duration: 0.5
                });

                const glare = card.querySelector('.project-glare');
                if (glare) {
                    gsap.to(glare, { opacity: 0, duration: 0.5 });
                }
            });
        }

        // Animate project links inside card on hover
        const links = card.querySelectorAll('.project-link');
        card.addEventListener('mouseenter', () => {
            gsap.fromTo(links, {
                y: 10,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 0.3,
                stagger: 0.05,
                ease: 'back.out(1.7)'
            });
        });
    });

    // --------------------------------------------------------------------------
    // 14. EDUCATION TIMELINE FILL & PULSE NODES
    // --------------------------------------------------------------------------
    const timeline = document.querySelector('.education-timeline');
    const timelineFill = document.querySelector('.education-timeline-fill');
    const timelineItems = document.querySelectorAll('.education-item');
    const timelineSpark = document.querySelector('.timeline-spark');

    if (timeline && timelineFill) {
        // Timeline fill height maps directly to scroll percentage
        gsap.to(timelineFill, {
            height: '100%',
            ease: 'none',
            scrollTrigger: {
                trigger: timeline,
                start: 'top 60%',
                end: 'bottom 40%',
                scrub: true
            }
        });

        if (timelineSpark) {
            gsap.to(timelineSpark, {
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
        timelineItems.forEach(item => {
            ScrollTrigger.create({
                trigger: item,
                start: 'top 55%',
                end: 'bottom 45%',
                onEnter: () => item.classList.add('active'),
                onLeaveBack: () => item.classList.remove('active')
            });
        });
    }

    // --------------------------------------------------------------------------
    // 15. PREMIUM 3D COVERFLOW CERTIFICATE SLIDER
    // --------------------------------------------------------------------------
    
    // Initialize 3D Coverflow Certificate Slider
    function initCoverflowSlider() {
        const slider = document.getElementById('coverflowSlider');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (!slider || !prevBtn || !nextBtn) {
            console.log('Coverflow elements not found');
            return;
        }
        
        if (slider.dataset.initialized === 'true') {
            console.log('Coverflow already initialized');
            return;
        }
        slider.dataset.initialized = 'true';
        
        const cards = Array.from(slider.querySelectorAll('.certificate-card-3d'));
        if (cards.length === 0) {
            console.log('No certificate cards found');
            return;
        }
        
        let currentIndex = Math.floor(cards.length / 2); // Start with middle card
        let autoSlideInterval;
        
        // Position cards initially
        function updateCardPositions() {
            cards.forEach((card, index) => {
                // Remove all position classes
                card.classList.remove('active', 'left', 'right', 'left-far', 'right-far', 'hidden');
                
                const diff = index - currentIndex;
                
                if (diff === 0) {
                    card.classList.add('active');
                } else if (diff === -1 || (currentIndex === 0 && index === cards.length - 1)) {
                    card.classList.add('left');
                } else if (diff === 1 || (currentIndex === cards.length - 1 && index === 0)) {
                    card.classList.add('right');
                } else if (diff === -2 || (currentIndex <= 1 && index >= cards.length - 2)) {
                    card.classList.add('left-far');
                } else if (diff === 2 || (currentIndex >= cards.length - 2 && index <= 1)) {
                    card.classList.add('right-far');
                } else {
                    card.classList.add('hidden');
                }
            });
        }
        
        // Navigate to specific slide
        function goToSlide(index) {
            currentIndex = index;
            if (currentIndex < 0) currentIndex = cards.length - 1;
            if (currentIndex >= cards.length) currentIndex = 0;
            updateCardPositions();
        }
        
        // Next slide
        function nextSlide() {
            goToSlide(currentIndex + 1);
        }
        
        // Previous slide
        function prevSlide() {
            goToSlide(currentIndex - 1);
        }
        
        // Auto slide functionality
        function startAutoSlide() {
            if (autoSlideInterval) clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(nextSlide, 4000);
        }
        
        function stopAutoSlide() {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
                autoSlideInterval = null;
            }
        }
        
        // Event listeners
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoSlide();
            setTimeout(startAutoSlide, 8000);
        });
        
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoSlide();
            setTimeout(startAutoSlide, 8000);
        });

        // Touch swipe support for mobile devices
        let touchStartX = 0;
        let touchEndX = 0;
        
        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeDistance = touchEndX - touchStartX;
            const threshold = 50; // swipe threshold in px
            if (swipeDistance < -threshold) {
                nextSlide();
                stopAutoSlide();
                setTimeout(startAutoSlide, 8000);
            } else if (swipeDistance > threshold) {
                prevSlide();
                stopAutoSlide();
                setTimeout(startAutoSlide, 8000);
            }
        }
        
        // Pause auto-slide on hover
        slider.addEventListener('mouseenter', stopAutoSlide);
        slider.addEventListener('mouseleave', startAutoSlide);
        
        // Initialize positions and start auto-slide
        updateCardPositions();
        startAutoSlide();
        
        console.log(`Coverflow initialized with ${cards.length} cards, starting at index ${currentIndex}`);
        
        return { goToSlide, nextSlide, prevSlide, updateCardPositions };
    }
    
    // Certificate section scroll animations
    gsap.from('.coverflow-container', {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '#certifications',
            start: 'top 80%',
            onEnter: () => {
                const coverflowContainer = document.querySelector('.coverflow-container');
                if (coverflowContainer && !coverflowContainer.classList.contains('initialized')) {
                    coverflowContainer.classList.add('initialized');
                    // Initialize coverflow immediately
                    setTimeout(() => {
                        const coverflowInstance = initCoverflowSlider();
                        if (coverflowInstance) {
                            // Force initial positioning
                            setTimeout(() => {
                                coverflowInstance.updateCardPositions();
                            }, 100);
                        }
                    }, 200);
                }
            }
        }
    });
    
    // Enhanced hover effects for navigation buttons
    const navButtons = document.querySelectorAll('.coverflow-nav-btn');
    navButtons.forEach(btn => {
        if (!isMobile) {
            btn.addEventListener('mouseenter', () => {
                gsap.to(btn, {
                    scale: 1.1,
                    boxShadow: `0 12px 35px rgba(99, 102, 241, 0.4), 
                               0 0 0 4px rgba(99, 102, 241, 0.2)`,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    scale: 1,
                    boxShadow: `0 8px 25px rgba(99, 102, 241, 0.3)`,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        }
    });
    
    // Floating particles animation
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
        gsap.to(particle, {
            y: -30,
            opacity: 0,
            duration: 8,
            repeat: -1,
            ease: 'none',
            delay: index * 1.6
        });
    });

    // Fallback initialization for coverflow (in case scroll trigger fails)
    setTimeout(() => {
        const coverflowContainer = document.querySelector('.coverflow-container');
        if (coverflowContainer && !coverflowContainer.classList.contains('initialized')) {
            coverflowContainer.classList.add('initialized');
            initCoverflowSlider();
        }
    }, 2000);

    // --------------------------------------------------------------------------
    // 16. LEGACY CERTIFICATIONS HOVER ELEVATION (Preserved Safely)
    // --------------------------------------------------------------------------
    const legacyCertCards = document.querySelectorAll('.certification-card');
    if (legacyCertCards.length > 0) {
        gsap.from(legacyCertCards, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '#certifications',
                start: 'top 80%'
            }
        });
    }

    // --------------------------------------------------------------------------
    // 17. CONTACT BUTTONS AND DRIFTING BLOBS (Preserved Safely)
    // --------------------------------------------------------------------------
    // Blob movement - Target specifically to avoid missing targets or wrong selection
    if (document.querySelectorAll('.contact-blob').length > 0 && !isMobile) {
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

    // Contact cards reveal
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

    // Button pulse animation for primary buttons
    gsap.to('.btn-primary', {
        scale: 1.03,
        duration: 1.2,
        yoyo: true,
        repeat: -1,
        ease: 'power1.inOut'
    });

    // --------------------------------------------------------------------------
    // 18. PRESERVED ORIGINAL FUNCTIONALITY: MOBILE NAVIGATION & MODAL
    // --------------------------------------------------------------------------
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const menuIcon = mobileMenuBtn.querySelector('.menu-icon');
    const closeIcon = mobileMenuBtn.querySelector('.close-icon');

    function toggleMenu() {
        mobileNav.classList.toggle('open');
        const isOpen = mobileNav.classList.contains('open');

        if (isOpen) {
            menuIcon.style.display = 'none';
            closeIcon.style.display = 'block';
            gsap.fromTo('.mobile-nav-link', {
                x: -30,
                opacity: 0
            }, {
                x: 0,
                opacity: 1,
                duration: 0.4,
                stagger: 0.05,
                ease: 'power2.out',
                overwrite: 'auto'
            });
        } else {
            menuIcon.style.display = 'block';
            closeIcon.style.display = 'none';
        }
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMenu);
    }

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNav.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    // Smooth scroll for nav link anchors (preserving layout & spacing offsets)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

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
        });
    });

    // Certification popup modal triggers (preserved with added GSAP animations)
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("img01");
    const captionText = document.getElementById("caption");
    const closeBtn = document.querySelector(".close");

    // Handle both old and new certificate card clicks
    document.querySelectorAll('.certification-card, .certificate-card-premium, .certificate-card-3d').forEach(card => {
        card.addEventListener('click', function () {
            const imgSrc = this.getAttribute('data-image');
            const title = this.querySelector('.certification-name, .certificate-title, .certificate-title-3d').textContent;

            if (imgSrc) {
                modal.style.display = "block";
                modalImg.src = imgSrc;
                captionText.innerHTML = title;
                document.body.style.overflow = "hidden";

                if (lenis) lenis.stop();

                gsap.fromTo(modal, 
                    { opacity: 0 }, 
                    { opacity: 1, duration: 0.3 }
                );
                
                gsap.fromTo(modalImg, 
                    { scale: 0.8, y: 50 }, 
                    { scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.2)' }
                );
            }
        });
    });

    function closeModal() {
        gsap.to(modal, {
            opacity: 0,
            duration: 0.25,
            onComplete: () => {
                modal.style.display = "none";
                document.body.style.overflow = "auto";
                if (lenis) lenis.start();
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    window.addEventListener('click', function (event) {
        if (event.target == modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === "Escape" && modal.style.display === "block") {
            closeModal();
        }
    });

    // --------------------------------------------------------------------------
    // 19. PREMIUM ANIMATIONS ADDITIONS & UPGRADES
    // --------------------------------------------------------------------------

    

    // B. Upgraded Elastic Magnetic Buttons & Links
    const magneticButtons = document.querySelectorAll('.btn-primary, .btn-outline, .coverflow-nav-btn, .social-link, .nav-link, .project-link, .mobile-menu-btn');
    if (magneticButtons.length > 0 && !isTouchDevice) {
        magneticButtons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                // Pull the button toward cursor by 35%
                gsap.to(btn, {
                    x: x * 0.35,
                    y: y * 0.35,
                    rotateX: -y * 0.05,
                    rotateY: x * 0.05,
                    duration: 0.3,
                    ease: "power2.out"
                });

                // Pull the inner text/elements slightly less for parallax depth
                const innerText = btn.querySelector('.social-link-text, span, svg');
                if (innerText) {
                    gsap.to(innerText, {
                        x: x * 0.15,
                        y: y * 0.15,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            });

            btn.addEventListener('mouseleave', () => {
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
            });
        });
    }

    // C. Cyber Scramble Text Decode Effect (AI & Data Science Theme)
    class TextScrambler {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#________01010101';
            this.update = this.update.bind(this);
        }
        setText(newText) {
            this.oldText = this.el.innerText;
            this.newText = newText;
            this.promise = new Promise((resolve) => this.resolve = resolve);
            this.queue = [];
            for (let i = 0; i < this.newText.length; i++) {
                const from = this.oldText[i] || '';
                const to = this.newText[i] || '';
                const start = Math.floor(Math.random() * 16);
                const end = start + Math.floor(Math.random() * 16);
                this.queue.push({ from, to, start, end });
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

    // Attach scramble animations
    const scrambleElements = document.querySelectorAll('.section-title, .hero-name, .logo-badge');
    scrambleElements.forEach(el => {
        const scrambler = new TextScrambler(el);
        const originalText = el.textContent.trim();
        let isScrambling = false;

        const triggerScramble = () => {
            if (isScrambling) return;
            isScrambling = true;
            scrambler.setText(originalText).then(() => {
                isScrambling = false;
            });
        };

        // Scramble on hover
        el.addEventListener('mouseenter', triggerScramble);

        // Scramble once on viewport entrance via ScrollTrigger
        ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            once: true,
            onEnter: triggerScramble
        });
    });

    // D. Liquid Morphing Blobs with Scroll Velocity Response
    if (lenis && !isMobile) {
        const morphBlobs = document.querySelectorAll('.floating-blob, .contact-blob, .hero-glow');
        lenis.on('scroll', () => {
            const velocity = Math.abs(lenis.velocity);
            const stretch = Math.min(1 + velocity * 0.0003, 1.25);
            const squash = Math.max(1 - velocity * 0.00015, 0.8);
            
            morphBlobs.forEach(blob => {
                gsap.to(blob, {
                    scaleY: stretch,
                    scaleX: squash,
                    duration: 0.4,
                    overwrite: "auto",
                    ease: "power2.out"
                });
            });
        });
    }

    // E. 3D Bento-Box Grid Parallax & Mouse Shift
    if (lenis && !isMobile) {
        const grids = document.querySelectorAll('.projects-grid, .skills-simple-grid');
        grids.forEach(grid => {
            gsap.set(grid, { transformPerspective: 1200, transformStyle: "preserve-3d" });
            
            ScrollTrigger.create({
                trigger: grid,
                start: "top bottom",
                end: "bottom top",
                onUpdate: (self) => {
                    const velocity = self.getVelocity() || 0;
                    const rotationX = gsap.utils.clamp(-6, 6, velocity * -0.003);
                    
                    gsap.to(grid, {
                        rotateX: rotationX,
                        duration: 0.6,
                        ease: "power2.out",
                        overwrite: "auto"
                    });
                }
            });
            
            // Add grid mouse parallax
            grid.addEventListener('mousemove', (e) => {
                const rect = grid.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                
                gsap.to(grid, {
                    rotateY: x * 5,
                    rotateX: -y * 5,
                    duration: 0.8,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            });
            
            grid.addEventListener('mouseleave', () => {
                gsap.to(grid, {
                    rotateY: 0,
                    rotateX: 0,
                    duration: 1,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            });
        });
    }
});
