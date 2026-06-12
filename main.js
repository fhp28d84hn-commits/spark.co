/**
 * SPARK.CO — MAIN.JS
 * GSAP 3
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 0. PREFERS REDUCED MOTION CHECK
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. LOADER ANIMATION
    const initLoader = () => {
        if (prefersReducedMotion) {
            const loader = document.getElementById('loader');
            if (loader) loader.style.display = 'none';
            initHeroAnimations();
            return;
        }

        const tl = gsap.timeline();
        
        // Chevron drawing (0.6s)
        tl.fromTo("#loader-chevron", 
            { strokeDasharray: "200", strokeDashoffset: "200" },
            { strokeDashoffset: "0", duration: 0.6, ease: "power2.inOut" }
        );

        // Text stagger (30ms stagger)
        tl.to(".loader-text .letter", {
            opacity: 1,
            y: 0,
            duration: 0.3,
            stagger: 0.03,
            ease: "power2.out"
        }, "-=0.1");

        // Fade out (0.3s) - Total time ~1.2s
        tl.to("#loader", {
            opacity: 0,
            duration: 0.3,
            delay: 0.2,
            onComplete: () => {
                const loader = document.getElementById('loader');
                if (loader) loader.style.display = 'none';
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
                duration: 1.4,
                ease: "expo.out",
                onUpdate: () => {
                    counter.textContent = Math.round(obj.val);
                }
            });
        });
    };

    // 3. CURSOR TRAIL (Desktop Only)
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
            // Lerp factor 0.08 as specified
            dotX = lerp(dotX, mouseX, 0.08);
            dotY = lerp(dotY, mouseY, 0.08);
            
            dot.style.left = `${dotX}px`;
            dot.style.top = `${dotY}px`;
            
            requestAnimationFrame(animateCursor);
        };

        animateCursor();
    };

    // 4. SCROLL REVEAL (IntersectionObserver)
    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('[data-reveal]');
        
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.getAttribute('data-delay') || 0;
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, delay * 1000);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(el => revealObserver.observe(el));
    };

    // Initialize components
    initLoader();
    initCursor();
    initScrollReveal();
});
