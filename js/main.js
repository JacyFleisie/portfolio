// ============================================
// MOBILE NAVIGATION
// ============================================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
    });
});

// ============================================
// NAV SCROLL EFFECT
// ============================================
const nav = document.getElementById('nav');
let scrollTicking = false;

window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        requestAnimationFrame(() => {
            if (window.scrollY > 50) {
                nav.classList.add('nav--scrolled');
            } else {
                nav.classList.remove('nav--scrolled');
            }
            scrollTicking = false;
        });
        scrollTicking = true;
    }
}, { passive: true });

// ============================================
// SCROLL REVEAL
// ============================================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
});

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

// ============================================
// RANDOMIZE ABOUT TITLE
// ============================================
const aboutPhrases = [
    "Me",
    "Quality Code",
    "Affordable Prices",
    "Your Vision",
    "Smart Solutions",
    "Competitive Rates",
    "Real Results",
    "No Middlemen",
    "Direct Communication",
    "Clean Code",
    "Fast Delivery",
    "Fair Pricing"
];

const aboutTitleEl = document.getElementById('about-title-dynamic');
let currentPhraseIndex = Math.floor(Math.random() * aboutPhrases.length);
aboutTitleEl.textContent = aboutPhrases[currentPhraseIndex];

function rotateAboutTitle() {
    currentPhraseIndex = (currentPhraseIndex + 1) % aboutPhrases.length;
    aboutTitleEl.style.opacity = '0';
    aboutTitleEl.style.transform = 'translateY(-10px)';
    setTimeout(() => {
        aboutTitleEl.textContent = aboutPhrases[currentPhraseIndex];
        aboutTitleEl.style.opacity = '1';
        aboutTitleEl.style.transform = 'translateY(0)';
    }, 600);
}

setInterval(rotateAboutTitle, 3000);

// ============================================
// SCROLL INDICATOR FADE
// ============================================
const scrollIndicator = document.querySelector('.hero__scroll');
let fadeTicking = false;

window.addEventListener('scroll', () => {
    if (!fadeTicking) {
        requestAnimationFrame(() => {
            scrollIndicator.style.opacity = window.scrollY > 100 ? '0' : '1';
            fadeTicking = false;
        });
        fadeTicking = true;
    }
}, { passive: true });

// ============================================
// FOOTER YEAR
// ============================================
document.getElementById('year').textContent = new Date().getFullYear();

// ============================================
// DETECT WEBGL SUPPORT
// ============================================
(function() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        document.body.classList.add('no-webgl');
        return;
    }
    
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        if (!gl) {
            document.body.classList.add('no-webgl');
        }
    } catch (e) {
        document.body.classList.add('no-webgl');
    }
})();
