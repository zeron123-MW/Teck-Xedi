// ============================================================
// Teck Xedi — shared behaviour across all pages
// ============================================================

// --- Navbar scroll state + mobile toggle ---
const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  if (!nav) return;
  nav.classList.toggle('scrolled', window.scrollY > 12);
}, { passive: true });

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
  }));
}

// --- Dark mode ---
const themeToggle = document.querySelector('.theme-toggle');
const root = document.documentElement;
function applyTheme(t) {
  if (t === 'dark') root.setAttribute('data-theme', 'dark');
  else root.setAttribute('data-theme', 'light');
}
try {
  const saved = localStorage.getItem('tx-theme');
  if (saved) applyTheme(saved);
  else if (window.matchMedia('(prefers-color-scheme: dark)').matches) applyTheme('dark');
} catch (e) {}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    applyTheme(isDark ? 'light' : 'dark');
    try { localStorage.setItem('tx-theme', isDark ? 'light' : 'dark'); } catch (e) {}
  });
}

// --- Scroll reveal ---
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in'));
}

// --- Hero parallax (three portrait frames at different speeds) ---
const parallaxLayers = document.querySelectorAll('[data-parallax]');
if (parallaxLayers.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      parallaxLayers.forEach(layer => {
        const speed = parseFloat(layer.dataset.parallax) || 0.2;
        layer.style.transform = `translateY(${y * speed}px)`;
      });
      ticking = false;
    });
  }, { passive: true });
}

// --- Photo slots ---
// Photos are now fixed image files (assets/founder-main.jpg, assets/product-1.jpg, etc).
// Only whoever can push files to the project's GitHub repo can change them —
// visitors cannot upload or alter photos on the live site.
document.querySelectorAll('.upload-slot.photo-fixed img').forEach(img => {
  if (img.complete && img.naturalWidth > 0) img.closest('.upload-slot').classList.add('has-image');
  img.addEventListener('load', () => img.closest('.upload-slot').classList.add('has-image'));
});

// --- Product filter bar (Products page) ---
const filterBar = document.querySelector('.filter-bar');
if (filterBar) {
  const buttons = filterBar.querySelectorAll('button');
  const cards = document.querySelectorAll('.product-card');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      cards.forEach(card => {
        const show = cat === 'all' || card.dataset.category === cat;
        card.style.display = show ? '' : 'none';
      });
    });
  });
}

// --- Learn More expand (Products page) ---
document.querySelectorAll('.learn-more').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const card = btn.closest('.product-card');
    if (card) card.classList.toggle('expanded');
    btn.textContent = card && card.classList.contains('expanded') ? '' : '';
    const label = btn.querySelector('.lm-text');
    if (label) label.textContent = card.classList.contains('expanded') ? 'Show less' : 'Learn More';
  });
});

// --- Contact form (static site: no backend, so hand off to mailto) ---
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = contactForm.querySelector('#cf-name').value.trim();
    const email = contactForm.querySelector('#cf-email').value.trim();
    const type = contactForm.querySelector('#cf-type').value;
    const message = contactForm.querySelector('#cf-message').value.trim();
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nType of support: ${type}\n\n${message}`
    );
    window.location.href = `mailto:gilbertkatuwa2006@gmail.com?subject=${encodeURIComponent('Teck Xedi — ' + type)}&body=${body}`;
  });
}

// --- Footer year ---
document.querySelectorAll('.js-year').forEach(el => { el.textContent = new Date().getFullYear(); });
