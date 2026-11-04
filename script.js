/* ==========================================================
   TECK XEDI — shared behaviour (v2)
   No libraries. Every feature fails safely if its markup is absent.
   ========================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Navbar: scroll shadow + mobile menu ---------- */
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');

  var progressEl = document.querySelector('.progress');
  var ticking = false;
  function onScroll() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 8);
    if (progressEl) {
      var max = root.scrollHeight - root.clientHeight;
      progressEl.style.transform = 'scaleX(' + (max > 0 ? Math.min(window.scrollY / max, 1) : 0) + ')';
    }
    ticking = false;
  }
  onScroll();
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });

  function setMenu(open) {
    if (!links || !toggle) return;
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      setMenu(!links.classList.contains('open'));
    });
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
    document.addEventListener('click', function (e) {
      if (nav && !nav.contains(e.target)) setMenu(false);
    });
  }

  /* ---------- Dark mode (initial theme is set by a tiny script in <head>) ---------- */
  var themeBtn = document.querySelector('.theme-toggle');
  function setTheme(t) {
    root.setAttribute('data-theme', t);
    try { localStorage.setItem('tx-theme', t); } catch (e) {}
    if (themeBtn) themeBtn.setAttribute('aria-pressed', String(t === 'dark'));
  }
  if (themeBtn) {
    themeBtn.setAttribute('aria-pressed', String(root.getAttribute('data-theme') === 'dark'));
    themeBtn.addEventListener('click', function () {
      setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  }

  /* ---------- Scroll reveal ---------- */
  var items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Logo fallback: show a text wordmark if assets/logo.jpg is missing ---------- */
  document.querySelectorAll('.brand img').forEach(function (img) {
    function swap() {
      var s = document.createElement('span');
      s.className = 'wordmark';
      s.innerHTML = 'Teck<b>Xedi</b>';
      img.replaceWith(s);
    }
    if (img.complete && img.naturalWidth === 0) swap();
    else img.addEventListener('error', swap);
  });

  /* ---------- Founder slideshow: photos pop in one at a time, then loop ---------- */
  (function () {
    var box = document.getElementById('founder-slideshow');
    if (!box) return;

    var dotsWrap = box.querySelector('.dots');
    var INTERVAL = 3500; // milliseconds each photo stays on screen
    var slides = Array.prototype.slice.call(box.querySelectorAll('.slide'));
    var index = 0, timer = null, inView = false, paused = false;

    function show(i) {
      if (!slides.length) return;
      index = (i + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('is-active', k === index); });
      Array.prototype.forEach.call(dotsWrap.children, function (d, k) {
        d.classList.toggle('active', k === index);
        d.setAttribute('aria-current', k === index ? 'true' : 'false');
      });
    }
    function buildDots() {
      dotsWrap.innerHTML = '';
      slides.forEach(function (s, k) {
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Show photo ' + (k + 1) + ' of ' + slides.length);
        b.addEventListener('click', function () { show(k); restart(); });
        dotsWrap.appendChild(b);
      });
      dotsWrap.style.display = slides.length > 1 ? 'flex' : 'none';
    }
    function stop() { clearInterval(timer); timer = null; }
    function start() {
      if (timer || paused || !inView || slides.length < 2) return;
      timer = setInterval(function () { show(index + 1); }, INTERVAL);
    }
    function restart() { stop(); start(); }

    function dropSlide(slide) {
      slides = slides.filter(function (s) { return s !== slide; });
      slide.remove();
      buildDots(); show(index); restart();
    }
    slides.slice().forEach(function (slide) {
      var img = slide.querySelector('img');
      if (!img) return;
      if (img.complete && img.naturalWidth === 0) {
        slides = slides.filter(function (s) { return s !== slide; });
        slide.remove();
      } else {
        img.addEventListener('error', function () { dropSlide(slide); });
      }
    });
    buildDots();
    show(0);

    box.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { paused = true; stop(); } });
    box.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') { paused = false; start(); } });
    box.addEventListener('focusin', function (e) { if (e.target.matches(':focus-visible')) { paused = true; stop(); } });
    box.addEventListener('focusout', function () { paused = false; start(); });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        if (inView) start(); else stop();
      }, { threshold: 0.35 }).observe(box);
    } else {
      inView = true; start();
    }
  })();

  /* ---------- Products: category filter ---------- */
  var bar = document.querySelector('.filters');
  if (bar) {
    var btns = Array.prototype.slice.call(bar.querySelectorAll('button'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-category]'));
    var count = document.querySelector('.filter-count');
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        btns.forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        var f = b.getAttribute('data-filter'), n = 0;
        var bento = document.getElementById('bento');
        if (bento) bento.classList.toggle('is-filtered', f !== 'all');
        cards.forEach(function (c) {
          var show = f === 'all' || c.getAttribute('data-category') === f;
          c.hidden = !show;
          if (show) n++;
        });
        if (count) count.textContent = n + (n === 1 ? ' product' : ' products');
      });
    });
  }

  /* ---------- Contact form: static site, so it opens a pre-filled email ---------- */
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      function val(id) { return form.querySelector(id).value.trim(); }
      var type = val('#cf-type');
      var body = encodeURIComponent(
        'Name: ' + val('#cf-name') + '\nEmail: ' + val('#cf-email') +
        '\nType of support: ' + type + '\n\n' + val('#cf-message')
      );
      window.location.href = 'mailto:gilbertkatuwa2006@gmail.com?subject=' +
        encodeURIComponent('Teck Xedi — ' + type) + '&body=' + body;
    });
  }

  /* ---------- Card spotlight: soft gold glow follows the mouse ---------- */
  document.querySelectorAll('.card, .p-card, .tile-cta').forEach(function (el) {
    el.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ---------- Footer year ---------- */
  document.querySelectorAll('.js-year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
