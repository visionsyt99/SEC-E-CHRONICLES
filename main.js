/* ═══════════════════════════════════════
   THE E CHRONICLES — SHARED JS
═══════════════════════════════════════ */

// ── Active nav link
(function() {
  const links = document.querySelectorAll('.nav-links a, .mobile-menu a');
  const current = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === current) a.classList.add('active');
  });
})();

// ── Mobile hamburger
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
    }
  });
}

// ── Theme toggle
(function() {
  const html = document.documentElement;
  function isDark() {
    if (html.classList.contains('dark')) return true;
    if (html.classList.contains('light')) return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function applyTheme(dark) {
    html.classList.remove('dark','light');
    html.classList.add(dark ? 'dark' : 'light');
    const btn = document.getElementById('themeToggle');
    if (btn) { btn.textContent = dark ? '☀️' : '🌙'; btn.title = dark ? 'Switch to light' : 'Switch to dark'; }
    localStorage.setItem('ec_theme', dark ? 'dark' : 'light');
  }
  const saved = localStorage.getItem('ec_theme');
  if (saved) applyTheme(saved === 'dark');
  document.addEventListener('click', e => {
    if (e.target.closest('#themeToggle')) applyTheme(!isDark());
  });
})();

// ── Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.08 });
revealEls.forEach(el => revealObs.observe(el));

// ── Modal helpers (shared)
function openModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('open');
  document.body.style.overflow = '';
}
// Close on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
});
