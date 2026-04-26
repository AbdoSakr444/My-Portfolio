/* ============================================
   PORTFOLIO JAVASCRIPT
   Author: Abdulrahman Amr
   ============================================ */

// ============================================
// DOM ELEMENTS
// ============================================
const DOM = {
  loader: document.getElementById('loader'),
  navbar: document.getElementById('navbar'),
  navLinks: document.getElementById('navLinks'),
  navOverlay: document.getElementById('navOverlay'),
  menuToggle: document.getElementById('menuToggle'),
  themeToggle: document.getElementById('themeToggle'),
  themeIcon: document.getElementById('themeIcon'),
  typingText: document.getElementById('typingText'),
  backToTop: document.getElementById('backToTop'),
  contactForm: document.getElementById('contactForm'),
  cursorGlow: document.getElementById('cursorGlow'),
  particles: document.getElementById('particles'),
};

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
  typingTexts: [
    'Full Stack Developer',
    '.NET Developer',
    'ASP.NET Core Specialist',
    'Problem Solver',
    'Software Engineer',
  ],
  typingSpeed: 80,
  deletingSpeed: 50,
  pauseDuration: 2000,
  particleCount: 12,
  contactEmail: 'abdulrahmanamrsakr@gmail.com',
};

// ============================================
// LOADING SCREEN
// ============================================
function initLoader() {
  window.addEventListener('load', () => {
    setTimeout(() => {
      DOM.loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 1200);
  });

  // Fallback: hide loader after 4 seconds no matter what
  setTimeout(() => {
    DOM.loader.classList.add('hidden');
    document.body.style.overflow = '';
  }, 4000);
}

// ============================================
// THEME MANAGEMENT
// ============================================
function initTheme() {
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  applyTheme(savedTheme);

  DOM.themeToggle.addEventListener('click', toggleTheme);
  DOM.themeToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleTheme();
    }
  });
}

function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
  localStorage.setItem('portfolio-theme', newTheme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  DOM.themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
}

// ============================================
// MOBILE NAVIGATION
// ============================================
function initMobileNav() {
  DOM.menuToggle.addEventListener('click', toggleMobileMenu);
  DOM.navOverlay.addEventListener('click', closeMobileMenu);

  // Close menu on link click
  DOM.navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });
}

function toggleMobileMenu() {
  DOM.menuToggle.classList.toggle('active');
  DOM.navLinks.classList.toggle('active');
  DOM.navOverlay.classList.toggle('active');
  document.body.style.overflow = DOM.navLinks.classList.contains('active') ? 'hidden' : '';
}

function closeMobileMenu() {
  DOM.menuToggle.classList.remove('active');
  DOM.navLinks.classList.remove('active');
  DOM.navOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

// ============================================
// STICKY NAVBAR + ACTIVE SECTION HIGHLIGHTING
// ============================================
function initNavbar() {
  const sections = document.querySelectorAll('section[id]');
  const navLinkElements = DOM.navLinks.querySelectorAll('a[data-section]');

  function updateNavbar() {
    const scrollY = window.scrollY;

    // Toggle scrolled state
    DOM.navbar.classList.toggle('scrolled', scrollY > 50);

    // Highlight active section
    let currentSection = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinkElements.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === currentSection) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', throttle(updateNavbar, 80), { passive: true });
  updateNavbar();
}

// ============================================
// TYPING EFFECT
// ============================================
function initTypingEffect() {
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentText = CONFIG.typingTexts[textIndex];

    if (isDeleting) {
      DOM.typingText.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      DOM.typingText.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? CONFIG.deletingSpeed : CONFIG.typingSpeed;

    if (!isDeleting && charIndex === currentText.length) {
      delay = CONFIG.pauseDuration;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % CONFIG.typingTexts.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  type();
}

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  revealElements.forEach((el) => observer.observe(el));
}

// ============================================
// COUNTER ANIMATION (About Stats)
// ============================================
function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-number[data-count]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-count'));
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  function update() {
    current += step;
    if (current >= target) {
      element.textContent = target + '+';
      return;
    }
    element.textContent = Math.floor(current);
    requestAnimationFrame(update);
  }

  update();
}

// ============================================
// BACK TO TOP BUTTON
// ============================================
function initBackToTop() {
  function checkScroll() {
    DOM.backToTop.classList.toggle('visible', window.scrollY > 500);
  }

  window.addEventListener('scroll', throttle(checkScroll, 80), { passive: true });

  DOM.backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================
// CONTACT FORM (Gmail Compose)
// ============================================
function initContactForm() {
  DOM.contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    if (!name || !email || !message) return;

    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${CONFIG.contactEmail}&su=${subject}&body=${body}`;

    window.open(gmailUrl, '_blank');

    // Reset form
    DOM.contactForm.reset();
  });
}

// ============================================
// PARTICLES BACKGROUND
// ============================================
function initParticles() {
  for (let i = 0; i < CONFIG.particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 8 + 's';
    particle.style.animationDuration = (Math.random() * 6 + 6) + 's';
    particle.style.width = (Math.random() * 3 + 1) + 'px';
    particle.style.height = particle.style.width;
    DOM.particles.appendChild(particle);
  }
}

// ============================================
// CURSOR GLOW EFFECT
// ============================================
function initCursorGlow() {
  // Only on devices with hover capability
  if (!window.matchMedia('(hover: hover)').matches) return;

  let mouseX = 0;
  let mouseY = 0;
  let glowX = 0;
  let glowY = 0;
  let rafId = null;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;
    DOM.cursorGlow.style.transform = `translate(${glowX - 150}px, ${glowY - 150}px)`;
    rafId = requestAnimationFrame(animateGlow);
  }

  // Pause when tab is not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    } else if (!document.hidden && !rafId) {
      animateGlow();
    }
  });

  animateGlow();
}

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ============================================
// SKILL TAGS STAGGER ANIMATION
// ============================================
function initSkillStagger() {
  const categories = document.querySelectorAll('.skill-category');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const tags = entry.target.querySelectorAll('.skill-tag');
          tags.forEach((tag, index) => {
            tag.style.opacity = '0';
            tag.style.transform = 'translateY(10px) scale(0.95)';
            tag.style.transition = `opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${index * 0.05}s, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${index * 0.05}s`;
            setTimeout(() => {
              tag.style.opacity = '1';
              tag.style.transform = 'translateY(0) scale(1)';
            }, 50);
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  categories.forEach((cat) => observer.observe(cat));
}

// ============================================
// TILT EFFECT ON PROJECT CARDS
// ============================================
function initTiltEffect() {
  if (!window.matchMedia('(hover: hover)').matches) return;

  const cards = document.querySelectorAll('.project-card');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ============================================
// INITIALIZE ALL
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initTheme();
  initMobileNav();
  initNavbar();
  initTypingEffect();
  initScrollReveal();
  initCounterAnimation();
  initBackToTop();
  initContactForm();
  initParticles();
  initCursorGlow();
  initSmoothScroll();
  initSkillStagger();
  initTiltEffect();
});
