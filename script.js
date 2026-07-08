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

// ---------- Loader & Reveal on scroll ----------
function startReveal() {
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); }
    });
  }, { threshold: 0.14 });
  document.querySelectorAll('.reveal').forEach(el => revealIO.observe(el));
}

const loader = document.getElementById('site-loader');
if (loader) {

  const texts = [
    "Honey is being cultivated...",
    "Stone-grinding the Lakadong turmeric...",
    "Sourcing raw ingredients...",
    "Journeying from the hills...",
    "Gathering heirloom seeds..."
  ];
  const textEl = document.getElementById('loader-text');
  if (textEl) {
    textEl.textContent = texts[Math.floor(Math.random() * texts.length)];
  }

  setTimeout(() => {
    loader.classList.add('slide-up');
    setTimeout(startReveal, 400); // Start revealing as the curtain opens
  }, 2900);
} else {
  startReveal();
}

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

// ---------- Animated Roadmap ----------
const roadmapContainer = document.querySelector('.roadmap-container');
const desktopPath = document.querySelector('.desktop-path');
const mobilePath = document.querySelector('.mobile-path');
const roadmapNodes = document.querySelectorAll('.roadmap-node');
const bee = document.getElementById('flying-bee');

if (roadmapContainer && desktopPath && mobilePath) {
  // Prep both paths
  const desktopLen = desktopPath.getTotalLength();
  desktopPath.style.strokeDasharray = desktopLen;
  desktopPath.style.strokeDashoffset = desktopLen;

  const mobileLen = mobilePath.getTotalLength();
  mobilePath.style.strokeDasharray = mobileLen;
  mobilePath.style.strokeDashoffset = mobileLen;

  const updateRoadmap = () => {
    const isMobile = window.innerWidth <= 640;
    const activePath = isMobile ? mobilePath : desktopPath;
    const activeLen = isMobile ? mobileLen : desktopLen;
    
    // Ensure the inactive path is hidden
    const inactivePath = isMobile ? desktopPath : mobilePath;
    inactivePath.style.strokeDashoffset = isMobile ? desktopLen : mobileLen;

    const rect = roadmapContainer.getBoundingClientRect();
    const scrollPercent = (window.innerHeight * 0.8 - rect.top) / (rect.height * 0.8);
    const clamped = Math.min(Math.max(scrollPercent, 0), 1);
    
    // Draw the path
    const drawLength = activeLen * clamped;
    activePath.style.strokeDashoffset = activeLen - drawLength;
    
    // Move the bee
    if (bee) {
      if (clamped > 0 && clamped < 1) {
        bee.style.opacity = 1;
        const point = activePath.getPointAtLength(drawLength);
        
        // Calculate rotation by looking slightly ahead
        let angle = 90; // default facing down
        if (drawLength + 1 < activeLen) {
          const nextPoint = activePath.getPointAtLength(drawLength + 1);
          // atan2(dy, dx) returns radians.
          // Note: coordinates are 0-100 in viewBox. dy is positive downwards.
          angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI);
        }
        
        bee.style.left = point.x + '%';
        bee.style.top = point.y + '%';
        // Add 90 degrees because our bee SVG is drawn facing right (0 deg)
        // Wait, if atan2 returns 0 for (1,0) which is right, and bee is facing right, no addition needed!
        bee.style.transform = `rotate(${angle}deg)`;
      } else {
        bee.style.opacity = 0;
      }
    }
    
    // Activate nodes based on their Y position relative to the scroll progress
    roadmapNodes.forEach(node => {
      const topStr = node.style.top || getComputedStyle(node).top;
      if (topStr) {
        // If computed style is px, we need percentage.
        // It's safer to use the dataset step.
        // Nodes are at 25%, 50%, 75%, 95%
        const step = parseInt(node.getAttribute('data-step'));
        const percents = {1: 0.25, 2: 0.50, 3: 0.75, 4: 0.95};
        const topPercent = percents[step];
        
        if (clamped >= topPercent - 0.05) {
          node.classList.add('active');
        } else {
          node.classList.remove('active');
        }
      }
    });
  };

  window.addEventListener('scroll', updateRoadmap);
  window.addEventListener('resize', updateRoadmap);
  // initial check
  updateRoadmap();
}
