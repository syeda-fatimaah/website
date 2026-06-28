/* =====================================================
   Pioneer Developer — main.js
   Shared JS for all pages
   ===================================================== */

'use strict';

/* ── 1. HAMBURGER / MOBILE MENU ─────────────────────── */
(function () {
  var hamburger  = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;

  function openMenu() {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close menu');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
  });

  /* Close on any link click inside menu */
  mobileMenu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });

  /* Close on Escape */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
      hamburger.focus();
    }
  });

  /* Close when clicking outside menu */
  document.addEventListener('click', function (e) {
    if (
      mobileMenu.classList.contains('open') &&
      !mobileMenu.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeMenu();
    }
  });

  /* Close on resize to desktop */
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) closeMenu();
  });
})();

/* ── 2. NAV SCROLL-SPY ──────────────────────────────── */
(function () {
  var nav = document.querySelector('.site-nav');
  if (!nav) return;

  function tick() {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', tick, { passive: true });
  tick();
})();

/* ── 3. REVEAL ON SCROLL ────────────────────────────── */
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Show immediately for users who prefer no motion */
  if (reduced) {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('revealed');
    });
    return;
  }

  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('revealed');
    });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var delay = parseInt(entry.target.dataset.delay || 0, 10);
      setTimeout(function () {
        entry.target.classList.add('revealed');
      }, delay);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

  document.querySelectorAll('.reveal').forEach(function (el) {
    io.observe(el);
  });
})();

/* ── 4. SMOOTH ANCHOR SCROLL ────────────────────────── */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var offset = 76; /* nav height + a little breathing room */
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();

/* ── 5. HERO BUILD CONSOLE TYPING ANIMATION ─────────── */
(function () {
  var el     = document.getElementById('hero-typing-text');
  var cursor = document.getElementById('hero-typing-cursor');
  if (!el) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    /* Show full text immediately */
    el.textContent = (el.dataset.typing || '').replace(/&#10;/g, '\n');
    return;
  }

  var raw   = el.dataset.typing || '';
  /* Decode HTML entities that may be in the data attribute */
  var tmp   = document.createElement('textarea');
  tmp.innerHTML = raw;
  var text  = tmp.value;
  var speed = parseInt(el.dataset.typingSpeed || '20', 10);
  var idx   = 0;

  el.textContent = '';

  function type() {
    if (idx < text.length) {
      el.textContent += text[idx++];
      setTimeout(type, speed);
    } else {
      /* Blink cursor after typing finishes */
      if (cursor) cursor.style.animation = 'blink 1s step-end infinite';
    }
  }

  /* Small initial delay so the page renders first */
  setTimeout(type, 400);
})();

/* ── 6. FAQ ACCORDION ───────────────────────────────── */
(function () {
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    /* Keyboard support */
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
    });

    btn.addEventListener('click', function () {
      var item   = btn.closest('.faq-item');
      var answer = item.querySelector('.faq-answer');
      var isOpen = item.classList.contains('open');

      /* Collapse all */
      document.querySelectorAll('.faq-item.open').forEach(function (o) {
        o.classList.remove('open');
        var a = o.querySelector('.faq-answer');
        if (a) a.style.maxHeight = null;
        var q = o.querySelector('.faq-question');
        if (q) q.setAttribute('aria-expanded', 'false');
      });

      /* Expand clicked */
      if (!isOpen && answer) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();

/* ── 7. PORTFOLIO FILTER ────────────────────────────── */
(function () {
  var btns  = document.querySelectorAll('.filter-btn');
  var cards = document.querySelectorAll('.project-card');
  if (!btns.length) return;

  btns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      btns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var filter = btn.dataset.filter;
      cards.forEach(function (card) {
        var show = (filter === 'all' || card.dataset.category === filter);
        card.style.display   = show ? '' : 'none';
        card.style.opacity   = show ? '1' : '0';
      });
    });
  });
})();

/* ── 8. CONTACT FORM ────────────────────────────────── */
(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var valid = true;

    form.querySelectorAll('[required]').forEach(function (field) {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = '#EF4444';
        valid = false;
      }
    });

    var emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      emailField.style.borderColor = '#EF4444';
      valid = false;
    }

    if (valid) {
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.textContent = 'Message Sent! ✓'; btn.disabled = true; }
    }
  });
})();

/* ── 9. NEWSLETTER FORM ─────────────────────────────── */
(function () {
  var form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var input = form.querySelector('input[type="email"]');
    var btn   = form.querySelector('button[type="submit"]');
    if (input && !input.value.trim()) {
      input.style.borderColor = '#EF4444';
      return;
    }
    if (btn) { btn.textContent = 'Subscribed! ✓'; btn.disabled = true; }
  });
})();

/* ── 9. WHATSAPP FLOATING BUTTON ─────────────────────── */
(function () {
  /* Inject CSS */
  var style = document.createElement('style');
  style.textContent = [
    '.wa-float{',
      'position:fixed;',
      'bottom:28px;',
      'right:28px;',
      'z-index:9999;',
      'display:flex;',
      'align-items:center;',
      'gap:10px;',
      'text-decoration:none;',
    '}',
    '.wa-btn{',
      'width:56px;',
      'height:56px;',
      'border-radius:50%;',
      'background:#25D366;',
      'display:flex;',
      'align-items:center;',
      'justify-content:center;',
      'box-shadow:0 4px 18px rgba(37,211,102,0.45);',
      'transition:transform .2s,box-shadow .2s;',
      'position:relative;',
      'flex-shrink:0;',
    '}',
    '.wa-btn svg{width:28px;height:28px;fill:#fff;}',
    '.wa-btn::before{',
      'content:"";',
      'position:absolute;',
      'inset:-4px;',
      'border-radius:50%;',
      'border:2px solid rgba(37,211,102,0.5);',
      'animation:waPulse 2s ease-out infinite;',
    '}',
    '@keyframes waPulse{',
      '0%{transform:scale(1);opacity:.8}',
      '70%{transform:scale(1.35);opacity:0}',
      '100%{transform:scale(1.35);opacity:0}',
    '}',
    '.wa-float:hover .wa-btn{transform:scale(1.1);box-shadow:0 6px 24px rgba(37,211,102,0.6);}',
    '.wa-tooltip{',
      'background:#1a1a1a;',
      'color:#fff;',
      'font-size:13px;',
      'font-weight:600;',
      'padding:7px 14px;',
      'border-radius:8px;',
      'white-space:nowrap;',
      'opacity:0;',
      'transform:translateX(8px);',
      'transition:opacity .2s,transform .2s;',
      'pointer-events:none;',
      'box-shadow:0 4px 14px rgba(0,0,0,0.25);',
    '}',
    '.wa-float:hover .wa-tooltip{opacity:1;transform:translateX(0);}',
    '@media(max-width:480px){',
      '.wa-float{bottom:20px;right:16px;}',
      '.wa-tooltip{display:none;}',
    '}'
  ].join('');
  document.head.appendChild(style);

  /* Inject HTML */
  var a = document.createElement('a');
  a.className   = 'wa-float';
  a.href        = 'https://wa.me/923294146450?text=Hi%2C%20I%27d%20like%20to%20discuss%20a%20project.';
  a.target      = '_blank';
  a.rel         = 'noopener noreferrer';
  a.setAttribute('aria-label', 'Chat on WhatsApp');

  a.innerHTML = [
    '<span class="wa-tooltip">Chat on WhatsApp</span>',
    '<span class="wa-btn">',
      /* WhatsApp SVG icon */
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true">',
        '<path d="M16 2C8.268 2 2 8.268 2 16c0 2.43.65 4.71 1.785 6.68L2 30l7.52-1.752A13.94 13.94 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6a11.55 11.55 0 0 1-5.88-1.607l-.42-.25-4.462 1.04 1.064-4.35-.276-.448A11.56 11.56 0 0 1 4.4 16C4.4 9.59 9.59 4.4 16 4.4S27.6 9.59 27.6 16 22.41 27.6 16 27.6zm6.36-8.64c-.35-.175-2.07-1.02-2.39-1.136-.32-.117-.553-.175-.786.175-.233.35-.9 1.136-1.103 1.37-.203.233-.407.262-.757.087-.35-.175-1.477-.544-2.813-1.736-1.04-.928-1.742-2.074-1.945-2.424-.204-.35-.022-.54.153-.714.157-.157.35-.408.524-.612.175-.204.233-.35.35-.583.116-.233.058-.437-.029-.612-.088-.175-.787-1.896-1.078-2.596-.284-.682-.573-.59-.786-.6-.204-.01-.437-.012-.67-.012-.233 0-.612.087-.932.437-.32.35-1.223 1.194-1.223 2.914s1.252 3.38 1.427 3.612c.175.234 2.462 3.76 5.966 5.272.834.36 1.484.574 1.99.735.837.266 1.598.228 2.2.138.671-.1 2.07-.847 2.362-1.665.29-.816.29-1.515.203-1.663-.087-.146-.32-.233-.67-.408z"/>',
      '</svg>',
    '</span>'
  ].join('');

  document.body.appendChild(a);
})();
