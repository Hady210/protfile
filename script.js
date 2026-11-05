/* ═══════════════════════════════════════════
   NAVBAR SCROLL EFFECT
═══════════════════════════════════════════ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* ═══════════════════════════════════════════
   HAMBURGER MENU
═══════════════════════════════════════════ */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ═══════════════════════════════════════════
   THEME TOGGLE (dark / light)
═══════════════════════════════════════════ */
const root        = document.documentElement;
const themeBtn    = document.getElementById('theme-toggle');
const themeMeta   = document.querySelector('meta[name="theme-color"]');
let particleRGB   = '56,189,248';

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  const light = theme === 'light';
  themeBtn.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
  if (themeMeta) themeMeta.setAttribute('content', light ? '#f8fafc' : '#050a12');
  particleRGB = getComputedStyle(root).getPropertyValue('--particle').trim() || particleRGB;
}
applyTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

themeBtn.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  applyTheme(next);
  try { localStorage.setItem('theme', next); } catch (e) {}
});

/* ═══════════════════════════════════════════
   TYPING EFFECT
═══════════════════════════════════════════ */
const phrases = [
  'Full-Stack Web Developer',
  'Next.js & React Developer',
  'Frontend Engineer',
  'Backend & APIs',
  'AI Engineer',
  'Problem Solver',
];
let pi = 0, ci = 0, deleting = false;
const typedEl = document.getElementById('typed-text');

function type() {
  const current = phrases[pi];
  if (!deleting) {
    typedEl.textContent = current.slice(0, ++ci);
    if (ci === current.length) {
      deleting = true;
      setTimeout(type, 1800);
      return;
    }
    setTimeout(type, 80);
  } else {
    typedEl.textContent = current.slice(0, --ci);
    if (ci === 0) {
      deleting = false;
      pi = (pi + 1) % phrases.length;
      setTimeout(type, 300);
      return;
    }
    setTimeout(type, 40);
  }
}
setTimeout(type, 1000);

/* ═══════════════════════════════════════════
   PARTICLES CANVAS
═══════════════════════════════════════════ */
const canvas = document.getElementById('particles');
const ctx    = canvas.getContext('2d');

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const NUM = 80;
const particles = Array.from({ length: NUM }, () => ({
  x:   Math.random() * window.innerWidth,
  y:   Math.random() * window.innerHeight,
  r:   Math.random() * 1.5 + 0.4,
  vx:  (Math.random() - 0.5) * 0.25,
  vy:  (Math.random() - 0.5) * 0.25,
  a:   Math.random(),
}));

const CONNECT_DIST = 140;

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < NUM; i++) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${particleRGB},${p.a * 0.6})`;
    ctx.fill();

    for (let j = i + 1; j < NUM; j++) {
      const q  = particles[j];
      const dx = p.x - q.x, dy = p.y - q.y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < CONNECT_DIST) {
        const alpha = (1 - d / CONNECT_DIST) * 0.12;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(${particleRGB},${alpha})`;
        ctx.lineWidth   = 0.8;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ═══════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════ */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ═══════════════════════════════════════════
   CONTACT FORM
═══════════════════════════════════════════ */
const FORM_ENDPOINT = 'https://formsubmit.co/ajax/joniurabdelhady@gmail.com';

document.getElementById('contact-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const form   = this;
  const btn    = form.querySelector('button[type="submit"]');
  const status = document.getElementById('form-status');
  const orig   = btn.textContent;

  btn.textContent = 'Sending...';
  btn.disabled = true;
  status.textContent = '';
  status.className = 'form-status';

  try {
    const res  = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || String(data.success) !== 'true') {
      throw new Error(data.message || `HTTP ${res.status}`);
    }

    btn.textContent = 'Message Sent! ✓';
    btn.style.background = 'linear-gradient(135deg, #34d399, #059669)';
    status.textContent = "Thanks — I'll get back to you soon.";
    status.classList.add('ok');
    form.reset();
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
      btn.disabled = false;
    }, 4000);
  } catch (err) {
    console.error('Contact form failed:', err);
    btn.textContent = orig;
    btn.disabled = false;
    status.innerHTML = 'Couldn\'t send right now — please email <a href="mailto:joniurabdelhady@gmail.com">joniurabdelhady@gmail.com</a> or message me on <a href="https://wa.me/201001307376" target="_blank" rel="noopener">WhatsApp</a>.';
    status.classList.add('error');
  }
});

/* ═══════════════════════════════════════════
   ACTIVE NAV LINK ON SCROLL
═══════════════════════════════════════════ */
const sections = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('.nav-links a:not(.btn-nav)');

const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAs.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${e.target.id}` ? 'var(--accent)' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObs.observe(s));
