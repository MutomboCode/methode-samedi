/* =============================================
   MÉTHODE SAMEDI — main.js
   Navbar mobile
   ============================================= */

(function () {
  'use strict';

  /* ===== NAVBAR MOBILE ===== */
  const toggle = document.querySelector('.navbar__toggle');
  const nav    = document.getElementById('primary-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('navbar__nav--open');
      toggle.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) closeMenu();
    });

    function closeMenu() {
      nav.classList.remove('navbar__nav--open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  }

})();
