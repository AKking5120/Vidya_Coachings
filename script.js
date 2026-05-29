/* ==========================================
   VIDYA COACHINGS - JAVASCRIPT
   ========================================== */

document.addEventListener('DOMContentLoaded', function() {

    // ===== MOBILE MENU =====
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });

        mobileMenu.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            });
        });
    }

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ===== COUNTER ANIMATION =====
    const counters = document.querySelectorAll('.counter');
    let counterAnimated = false;
    const statsSection = document.querySelector('.stats-section');

    function animateCounters() {
        counters.forEach(function(counter) {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            const duration = 2000;
            const steps = 60;
            const increment = target / steps;
            let current = 0;

            const timer = setInterval(function() {
                current += increment;
                if (current >= target) {
                    counter.textContent = target;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current);
                }
            }, duration / steps);
        });
    }

    if (statsSection) {
        new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting && !counterAnimated) {
                    animateCounters();
                    counterAnimated = true;
                }
            });
        }, { threshold: 0.5 }).observe(statsSection);
    }

    // ===== HEADER SCROLL EFFECT =====
    const header = document.getElementById('header');
    const scrollTopBtn = document.getElementById('scrollTop');

    function onScroll() {
        if (header) {
            header.style.boxShadow = window.scrollY > 50
                ? '0 4px 24px rgba(0, 0, 0, 0.45)'
                : '0 2px 20px rgba(0, 0, 0, 0.35)';
        }
        if (scrollTopBtn) {
            scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== FADE IN ON SCROLL =====
    document.querySelectorAll('.section').forEach(function(el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    const fadeObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.08 });

    document.querySelectorAll('.hero, .section').forEach(function(el) {
        fadeObserver.observe(el);
    });

    // ===== ACTIVE NAV LINK =====
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href*="#"]');

    if (sections.length && navLinks.length) {
        window.addEventListener('scroll', function() {
            let current = '';
            sections.forEach(function(section) {
                if (window.scrollY >= section.offsetTop - 120) {
                    current = section.getAttribute('id');
                }
            });
            navLinks.forEach(function(link) {
                link.classList.remove('active');
                if (link.getAttribute('href').includes('#' + current)) {
                    link.classList.add('active');
                }
            });
        });
    }

    // ===== ABOUT IMAGE SLIDER =====
    const slides = document.querySelectorAll('.slider-img');
    const dots = document.querySelectorAll('.dot');
    let slideIndex = 0;
    let slideTimer = null;

    function goToSlide(n) {
        if (!slides.length) return;
        slideIndex = ((n - 1) + slides.length) % slides.length;
        slides.forEach(function(s) { s.classList.remove('active'); });
        dots.forEach(function(d) { d.classList.remove('active'); });
        slides[slideIndex].classList.add('active');
        if (dots[slideIndex]) dots[slideIndex].classList.add('active');
    }

    function nextSlide() {
        goToSlide(slideIndex + 2);
    }

    function startSlider() {
        if (!slides.length) return;
        clearInterval(slideTimer);
        slideTimer = setInterval(nextSlide, 5000);
    }

    dots.forEach(function(dot, i) {
        dot.addEventListener('click', function() {
            goToSlide(i + 1);
            startSlider();
        });
    });

    if (slides.length) {
        goToSlide(1);
        startSlider();
    }
});
