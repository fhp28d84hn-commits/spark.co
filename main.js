/**
 * SPARK.CO — MAIN.JS
 * GSAP 3
 */

// 0. PREFERS REDUCED MOTION CHECK
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 1. LOADER ANIMATION
const initLoader = () => {
    const loader = document.getElementById('loader');
    if (!loader) {
        initHeroAnimations();
        return;
    }

    if (prefersReducedMotion) {
        loader.style.display = 'none';
        initHeroAnimations();
        return;
    }

    const tl = gsap.timeline();
    
    // Chevron drawing
    tl.fromTo("#chevron", 
        { strokeDasharray: "200", strokeDashoffset: "200" },
        { strokeDashoffset: "0", duration: 0.8, ease: "power2.inOut" }
    );

    // Text stagger
    tl.to(".loader-text .letter", {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: "back.out(1.7)"
    }, "-=0.2");

    // Fade out
    tl.to("#loader", {
        opacity: 0,
        duration: 0.5,
        delay: 0.3,
        onComplete: () => {
            loader.style.display = 'none';
            initHeroAnimations();
        }
    });
};

// 2. HERO COUNTERS
const initHeroAnimations = () => {
    const counters = document.querySelectorAll('[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const obj = { val: 0 };
        
        if (prefersReducedMotion) {
            counter.textContent = target;
            return;
        }

        gsap.to(obj, {
            val: target,
            duration: 2,
            ease: "expo.out",
            onUpdate: () => {
                counter.textContent = Math.round(obj.val);
            }
        });
    });

    // Parallax effects
    if (!prefersReducedMotion) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;

            // Hero content
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                heroContent.style.opacity = 1 - (scrolled / 700);
            }

            // Sublte cards parallax
            document.querySelectorAll('.glass-card').forEach(card => {
                const rect = card.getBoundingClientRect();
                const viewHeight = window.innerHeight;
                if (rect.top < viewHeight && rect.bottom > 0) {
                    const offset = (rect.top - viewHeight / 2) * 0.05;
                    card.style.transform = card.matches(':hover') ? `translateY(${offset - 8}px)` : `translateY(${offset}px)`;
                }
            });
        });
    }
};

// 3. CURSOR TRAIL
const initCursor = () => {
    const dot = document.getElementById('cursor-dot');
    if (!dot || prefersReducedMotion || 'ontouchstart' in window) return;

    dot.style.display = 'block';

    let mouseX = 0;
    let mouseY = 0;
    let dotX = 0;
    let dotY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const lerp = (start, end, factor) => start + (end - start) * factor;

    const animateCursor = () => {
        dotX = lerp(dotX, mouseX, 0.1);
        dotY = lerp(dotY, mouseY, 0.1);
        
        dot.style.left = `${dotX}px`;
        dot.style.top = `${dotY}px`;
        
        requestAnimationFrame(animateCursor);
    };

    animateCursor();

    // Hover effect
    document.addEventListener('mouseover', (e) => {
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
            gsap.to(dot, { scale: 3, backgroundColor: 'rgba(255, 69, 0, 0.3)', duration: 0.3 });
        }
    });
    
    document.addEventListener('mouseout', (e) => {
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
            gsap.to(dot, { scale: 1, backgroundColor: '#FF4500', duration: 0.3 });
        }
    });
};

// 4. SCROLL REVEAL
const initScrollReveal = () => {
    const revealElements = document.querySelectorAll('[data-reveal]:not(.revealed)');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = el.getAttribute('data-delay') || 0;
                
                el.classList.add('revealed');
                
                gsap.fromTo(el, 
                    { opacity: 0, y: 30 },
                    { 
                        opacity: 1, 
                        y: 0, 
                        duration: 0.8, 
                        delay: parseFloat(delay), 
                        ease: "power2.out"
                    }
                );
                observer.unobserve(el);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
};

// 5. PARTICLE BACKGROUND
const initParticles = () => {
    const hero = document.querySelector('.hero');
    if (!hero || prefersReducedMotion) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '0';
    canvas.style.pointerEvents = 'none';
    hero.appendChild(canvas);

    let width, height, particles;

    const resize = () => {
        width = canvas.width = hero.offsetWidth;
        height = canvas.height = hero.offsetHeight;
    };

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > width) this.x = 0;
            else if (this.x < 0) this.x = width;
            if (this.y > height) this.y = 0;
            else if (this.y < 0) this.y = height;
        }
        draw() {
            ctx.fillStyle = `rgba(255, 69, 0, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const init = () => {
        resize();
        particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle());
        }
    };

    const animate = () => {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    init();
    animate();
};

// GLOBAL INIT
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('page-loaded');
    initLoader();
    initCursor();
    initScrollReveal();
    initParticles();
});

// EXPORTS
window.sparkAnim = {
    initScrollReveal,
    initHeroAnimations
};
