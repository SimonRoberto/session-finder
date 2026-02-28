/* ═══════════════════════════════════════════════════════════════
   FAM NAV JS  —  fam-nav.js
   Shared navigation behaviour for all FAM pages.
   Handles: mobile toggle, active link highlighting, alert helper.
   Hosted at: https://simonroberto.github.io/session-finder/assets/fam-nav.js
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Auto-mark active nav link based on current page ──────────
  function highlightActiveLink() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.fam-nav__links a, .fam-nav__mobile a').forEach(a => {
      const href = a.getAttribute('href')?.split('/').pop() || '';
      if (href && (href === path || (path === '' && href === 'index.html'))) {
        a.classList.add('active');
      }
    });
  }

  // ── Mobile hamburger toggle ───────────────────────────────────
  function initMobileNav() {
    const hamburger = document.querySelector('.fam-nav__hamburger');
    const mobileMenu = document.querySelector('.fam-nav__mobile');
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      // Animate hamburger → X
      const spans = hamburger.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'translateY(6px) rotate(45deg)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'translateY(-6px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      }
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(s => {
          s.style.transform = ''; s.style.opacity = '';
        });
      }
    });

    // Close on mobile link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
  }

  // ── Alert / toast helper ─────────────────────────────────────
  // Usage: window.FAM.alert('Your message', 'success' | 'error' | 'info' | 'warning')
  function initAlerts() {
    // Ensure the alert container exists
    if (!document.getElementById('fam-alerts')) {
      const div = document.createElement('div');
      div.id = 'fam-alerts';
      document.body.appendChild(div);
    }
  }

  const ALERT_ICONS = {
    success: '✅',
    error:   '❌',
    info:    'ℹ️',
    warning: '⚠️',
  };

  function showAlert(msg, type = 'info', duration = 5000) {
    const container = document.getElementById('fam-alerts');
    if (!container) return;

    const div = document.createElement('div');
    div.className = `fam-alert fam-alert--${type}`;
    div.innerHTML = `
      <span class="fam-alert__icon">${ALERT_ICONS[type] || 'ℹ️'}</span>
      <span>${msg}</span>
      <button class="fam-alert__close" aria-label="Dismiss">×</button>
    `;

    div.querySelector('.fam-alert__close').addEventListener('click', () => dismiss(div));
    container.appendChild(div);

    const timer = setTimeout(() => dismiss(div), duration);

    function dismiss(el) {
      clearTimeout(timer);
      el.style.transition = 'opacity 200ms, transform 200ms';
      el.style.opacity    = '0';
      el.style.transform  = 'translateX(12px)';
      setTimeout(() => el.remove(), 220);
    }
  }

  // ── Nav scroll shadow ─────────────────────────────────────────
  function initNavShadow() {
    const nav = document.querySelector('.fam-nav');
    if (!nav) return;
    const update = () => {
      nav.style.boxShadow = window.scrollY > 4
        ? '0 2px 12px rgba(0,0,0,0.1)'
        : '';
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  // ── Init ─────────────────────────────────────────────────────
  function init() {
    highlightActiveLink();
    initMobileNav();
    initAlerts();
    initNavShadow();

    // Expose globally
    window.FAM = window.FAM || {};
    window.FAM.alert = showAlert;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
