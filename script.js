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
   TYPING EFFECT
═══════════════════════════════════════════ */
const phrases = [
  'AI Engineer',
  'Computer Vision Developer',
  'Full-Stack Developer',
  'Deep Learning Enthusiast',
  'Teaching Assistant',
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
    ctx.fillStyle = `rgba(56,189,248,${p.a * 0.6})`;
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
        ctx.strokeStyle = `rgba(56,189,248,${alpha})`;
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
document.getElementById('contact-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const btn  = this.querySelector('button[type="submit"]');
  const orig = btn.textContent;

  btn.textContent = 'Sending...';
  btn.disabled = true;

  const data = new FormData(this);

  fetch('/', { method: 'POST', body: data })
    .then(() => {
      btn.textContent = 'Message Sent! ✓';
      btn.style.background = 'linear-gradient(135deg, #34d399, #059669)';
      this.reset();
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
        btn.disabled = false;
      }, 4000);
    })
    .catch(() => {
      btn.textContent = 'Failed — try WhatsApp';
      btn.style.background = 'linear-gradient(135deg, #f87171, #dc2626)';
      btn.disabled = false;
    });
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
        a.style.color = a.getAttribute('href') === `#${e.target.id}` ? '#38bdf8' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObs.observe(s));
