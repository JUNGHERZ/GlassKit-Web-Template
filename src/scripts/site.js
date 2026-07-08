/* LUMEN — GlassKit Web-Layer: Interaktion (Theme, Zielgruppe, Reveal, Tilt) */
(function () {
  'use strict';

  var root = document.documentElement;
  var reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  /* ---- Theme-Umschalter ------------------------------------- */
  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
    });
  }

  /* ---- Zielgruppen-Umschalter (B2C / B2B) -------------------- */
  var segBtns = document.querySelectorAll('[data-audience-btn]');
  segBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var audience = btn.getAttribute('data-audience-btn');
      if (root.getAttribute('data-audience') === audience) return;
      root.setAttribute('data-audience', audience);
      segBtns.forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === btn));
      });
      if (!reducedMotion.matches) {
        var visible = document.querySelectorAll('.only-' + audience);
        visible.forEach(function (el) {
          el.classList.remove('glw-aud-fade');
          void el.offsetWidth; /* Reflow: Animation neu starten */
          el.classList.add('glw-aud-fade');
        });
      }
    });
  });

  /* ---- Header: Glas-Fläche nach dem ersten Scroll ------------ */
  var header = document.querySelector('.glw-header');
  var onScroll = function () {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Scroll-Reveal ----------------------------------------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Spatial-Fenster: sanfter Parallax-Tilt ----------------- */
  var tiltEl = document.getElementById('tiltWindow');
  if (tiltEl && matchMedia('(pointer: fine)').matches && !reducedMotion.matches) {
    var stage = tiltEl.closest('.glw-stage') || tiltEl;
    stage.addEventListener('pointermove', function (e) {
      var r = tiltEl.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      tiltEl.style.setProperty('--tilt-x', (3 + y * -5).toFixed(2) + 'deg');
      tiltEl.style.setProperty('--tilt-y', (-5 + x * 7).toFixed(2) + 'deg');
    });
    stage.addEventListener('pointerleave', function () {
      tiltEl.style.removeProperty('--tilt-x');
      tiltEl.style.removeProperty('--tilt-y');
    });
  }
})();
