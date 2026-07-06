// ---------- Nav scroll state ----------
const nav = document.querySelector('.site-nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll);
  onScroll();
}

// ---------- Mobile drawer ----------
const burger = document.getElementById('burgerBtn');
const drawer = document.getElementById('mobileDrawer');
if (burger && drawer) {
  const closeBtn = drawer.querySelector('.close');
  const open = () => drawer.classList.add('open');
  const close = () => drawer.classList.remove('open');
  burger.addEventListener('click', open);
  closeBtn && closeBtn.addEventListener('click', close);
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
}

// ---------- Reveal on scroll ----------
const revealIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); }
  });
}, { threshold: 0.14 });
document.querySelectorAll('.reveal').forEach(el => revealIO.observe(el));

// ---------- Linework draw-in ----------
function prepDraw(svg) {
  svg.querySelectorAll('path').forEach(path => {
    const len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
  });
}
document.querySelectorAll('.linework').forEach(prepDraw);

const drawIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('draw');
      requestAnimationFrame(() => {
        e.target.querySelectorAll('path').forEach(p => { p.style.strokeDashoffset = 0; });
      });
      drawIO.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.linework').forEach(el => drawIO.observe(el));

// ---------- Active category link on products page ----------
const catLinks = document.querySelectorAll('.cat-nav a');
if (catLinks.length) {
  const catSections = [...catLinks].map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const catIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        catLinks.forEach(l => l.classList.remove('active'));
        const link = document.querySelector(`.cat-nav a[href="#${e.target.id}"]`);
        link && link.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });
  catSections.forEach(s => catIO.observe(s));
}

// ---------- Theme Toggle ----------
const themeToggleBtn = document.getElementById('themeToggleBtn');
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  });
}
