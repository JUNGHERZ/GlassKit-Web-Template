/* LUMEN — GlassKit Web-Layer: Interaktion (Theme, Zielgruppe, Reveal, Tilt) */
(function () {
  'use strict';

  var root = document.documentElement;
  var reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  /* ---- Theme-Umschalter (alle Instanzen) ---------------------- */
  document.querySelectorAll('.glass-theme-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
    });
  });

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

  /* ---- Mobile-Navigation (details/summary) --------------------
     Auf-/Zuklappen funktioniert nativ ohne JS; hier nur Komfort:
     Scroll-Lock, Fokus-Trap im Header, ESC, Schließen nach Klick. */
  var mnav = document.getElementById('mobileNav');
  if (mnav && header) {
    var mnavSummary = mnav.querySelector('summary');
    var mnavPanel = mnav.querySelector('.glw-mobilenav__panel');

    mnav.addEventListener('toggle', function () {
      root.classList.toggle('glw-nav-open', mnav.open);
      if (mnav.open) {
        var first = mnavPanel.querySelector('a, button');
        if (first) first.focus();
      }
    });

    mnavPanel.addEventListener('click', function (e) {
      if (e.target.closest('a')) mnav.open = false;
    });

    document.addEventListener('keydown', function (e) {
      if (!mnav.open) return;
      if (e.key === 'Escape') {
        mnav.open = false;
        mnavSummary.focus();
        return;
      }
      if (e.key === 'Tab') {
        var focusables = [].slice
          .call(header.querySelectorAll('a, button, summary'))
          .filter(function (el) { return el.offsetParent !== null; });
        if (!focusables.length) return;
        var i = focusables.indexOf(document.activeElement);
        var last = focusables.length - 1;
        if (e.shiftKey && i <= 0) {
          e.preventDefault();
          focusables[last].focus();
        } else if (!e.shiftKey && i === last) {
          e.preventDefault();
          focusables[0].focus();
        }
      }
    });
  }

  /* ---- Accordion (FAQ) ----------------------------------------
     GlassKit steuert das Accordion über is-open auf dem Item;
     hier Klick-Toggle + aria-expanded. Ohne JS zeigt ein CSS-Fallback
     alle Antworten aufgeklappt (site.css). */
  document.querySelectorAll('.glass-accordion__trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var open = trigger.parentElement.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', String(open));
    });
  });

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
