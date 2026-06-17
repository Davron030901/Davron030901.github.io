// ── NAVBAR SCROLL ─────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ── HAMBURGER ─────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── NEURAL CANVAS ─────────────────────────────────────────────
const canvas = document.getElementById('neural-canvas');
const ctx    = canvas.getContext('2d');
let nodes    = [];
let W, H;

function resize() {
  W = canvas.width  = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}
resize();
window.addEventListener('resize', () => { resize(); initNodes(); });

function initNodes() {
  const count = Math.floor((W * H) / 18000);
  nodes = Array.from({ length: count }, () => ({
    x:  Math.random() * W,
    y:  Math.random() * H,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r:  Math.random() * 1.5 + 0.5,
  }));
}
initNodes();

function drawNeural() {
  ctx.clearRect(0, 0, W, H);
  const maxDist = 160;

  nodes.forEach(n => {
    n.x += n.vx;
    n.y += n.vy;
    if (n.x < 0 || n.x > W) n.vx *= -1;
    if (n.y < 0 || n.y > H) n.vy *= -1;
  });

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < maxDist) {
        const alpha = (1 - d / maxDist) * 0.4;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(99,102,241,${alpha})`;
        ctx.lineWidth   = 0.6;
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }

  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(129,140,248,0.7)';
    ctx.fill();
  });

  requestAnimationFrame(drawNeural);
}
drawNeural();

// ── SCROLL REVEAL ─────────────────────────────────────────────
const revealEls = document.querySelectorAll(
  '.skill-card, .project-card, .timeline-item, .edu-card, .contact-item, .about-grid, .hero-stats'
);
revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

// Stagger cards
document.querySelectorAll('.skills-grid .skill-card, .projects-grid .project-card').forEach((el, i) => {
  el.style.transitionDelay = `${i * 80}ms`;
});

// ── ACTIVE NAV LINK ───────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const links    = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  links.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current
      ? 'var(--text)'
      : '';
  });
}, { passive: true });

// ── SMOOTH COUNTER ANIMATION ───────────────────────────────────
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.textContent);
    if (isNaN(target)) return;
    let current = 0;
    const step  = Math.ceil(target / 40);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current + (el.dataset.suffix || '+');
      if (current >= target) clearInterval(timer);
    }, 30);
  });
}

// Add suffix data
document.querySelectorAll('.stat-num').forEach(el => {
  const txt = el.textContent;
  if (txt.includes('+')) {
    el.dataset.suffix = '+';
    el.textContent = txt.replace('+', '');
  }
});

const heroObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    setTimeout(animateCounters, 600);
    heroObserver.disconnect();
  }
}, { threshold: 0.3 });
heroObserver.observe(document.getElementById('hero'));
