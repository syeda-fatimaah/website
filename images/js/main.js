/**
 * PIONEER DEVELOPER — MAIN JAVASCRIPT
 * main.js | All shared interactive functionality
 */

/* ================================================================
   1. NAVIGATION — Hamburger, Scroll Class, Active Page
   ================================================================ */
(function initNav() {
  const nav         = document.querySelector('.site-nav');
  const hamburger   = document.querySelector('.nav-hamburger');
  const mobileMenu  = document.querySelector('.nav-mobile');

  // Active page highlight
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a[data-page]').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentFile || (currentFile === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Scroll class for nav shadow
  window.addEventListener('scroll', () => {
    if (!nav) return;
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });

  // Hamburger toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on mobile link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
})();

/* ================================================================
   2. SCROLL REVEAL — Intersection Observer for .reveal elements
   ================================================================ */
(function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  // Stagger children with data-delay
  document.querySelectorAll('.reveal').forEach((el, i) => {
    const delay = el.dataset.delay || (i % 4) * 80;
    el.style.transitionDelay = `${delay}ms`;
    observer.observe(el);
  });
})();

/* ================================================================
   3. FAQ ACCORDION
   ================================================================ */
(function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item   = question.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));

      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
})();

/* ================================================================
   4. PORTFOLIO & BLOG FILTER
   ================================================================ */
(function initFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter cards
      document.querySelectorAll('[data-category]').forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        if (match) {
          card.style.opacity    = '1';
          card.style.transform  = 'scale(1)';
          card.style.display    = '';
          setTimeout(() => {
            card.style.opacity   = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity   = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
})();

/* ================================================================
   5. SMOOTH SCROLL for anchor links
   ================================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navHeight = document.querySelector('.site-nav')?.offsetHeight || 68;
      const top       = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ================================================================
   6. CONTACT FORM — Validation + Success State
   ================================================================ */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;

    // Clear previous errors
    form.querySelectorAll('.form-error').forEach(el => el.textContent = '');
    form.querySelectorAll('.form-control').forEach(el => el.style.borderColor = '');

    // Validate required fields
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        valid = false;
        showFieldError(field, 'This field is required.');
      }
    });

    // Validate email
    const emailField = form.querySelector('#contact-email');
    if (emailField && emailField.value && !isValidEmail(emailField.value)) {
      valid = false;
      showFieldError(emailField, 'Please enter a valid email address.');
    }

    // Validate checkbox
    const checkbox = form.querySelector('#contact-agree');
    if (checkbox && !checkbox.checked) {
      valid = false;
      const label = checkbox.closest('.checkbox-group');
      if (label) {
        const err = label.querySelector('.form-error') || createError(label);
        err.textContent = 'Please agree to be contacted.';
      }
    }

    if (!valid) return;

    // Show success
    const formBody = document.getElementById('contact-form-body');
    const success  = document.getElementById('contact-success');
    if (formBody) formBody.style.display = 'none';
    if (success)  success.classList.add('show');

    // Scroll to success
    success?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  function showFieldError(field, msg) {
    field.style.borderColor = '#EF4444';
    let errEl = field.parentElement.querySelector('.form-error');
    if (!errEl) {
      errEl = document.createElement('span');
      errEl.className = 'form-error';
      field.parentElement.appendChild(errEl);
    }
    errEl.textContent = msg;
  }

  function createError(parent) {
    const el = document.createElement('span');
    el.className = 'form-error';
    parent.appendChild(el);
    return el;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
})();

/* ================================================================
   7. NEWSLETTER FORM — Prevent default + show thank you
   ================================================================ */
(function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const emailInput = form.querySelector('input[type="email"]');
    if (!emailInput?.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
      emailInput.style.outline = '2px solid red';
      return;
    }
    emailInput.style.outline = '';
    form.innerHTML = '<p style="color:#fff;font-weight:600;font-size:16px;text-align:center;">✅ Thanks! You\'re subscribed. We\'ll be in touch soon.</p>';
  });
})();

/* ================================================================
   8. COUNT-UP ANIMATION for stats on homepage hero
   ================================================================ */
(function initCountUp() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      let current  = 0;
      const step   = Math.ceil(target / 60);
      const timer  = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = prefix + current + suffix;
      }, 25);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => countObserver.observe(counter));
})();

/* ================================================================
  9. HERO TYPING — Animated side panel on homepage
  ================================================================ */
(function initHeroTyping() {
  const textEl = document.getElementById('hero-typing-text');
  if (!textEl) return;

  const cursorEl = document.getElementById('hero-typing-cursor');
  const fullText = textEl.dataset.typing || '';
  const speedMs  = Math.max(10, parseInt(textEl.dataset.typingSpeed || '22', 10));

  // Respect reduced motion preferences
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  if (reduceMotion) {
    textEl.textContent = fullText;
    cursorEl?.classList.add('hero-typing-cursor--static');
    return;
  }

  // Reset (in case of bfcache navigation)
  textEl.textContent = '';
  let i = 0;

  function tick() {
    textEl.textContent = fullText.slice(0, i);
    i += 1;
    if (i <= fullText.length) {
      window.setTimeout(tick, speedMs);
    } else {
      // Stop typing; cursor remains blinking at final position
      textEl.textContent = fullText;
    }
  }

  // Start after a tiny delay so layout is ready
  window.setTimeout(tick, 350);
})();
