const smoothStylesheet = document.createElement('link');
smoothStylesheet.rel = 'stylesheet';
smoothStylesheet.href = 'smooth-overrides.css?v=1';
document.head.appendChild(smoothStylesheet);

const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');

menuBtn?.addEventListener('click', () => {
  menu.classList.toggle('show');
  menuBtn.textContent = menu.classList.contains('show') ? '✕' : '☰';
});

document.querySelectorAll('.menu a').forEach(link => {
  link.addEventListener('click', () => {
    menu.classList.remove('show');
    menuBtn.textContent = '☰';
    document.querySelectorAll('.menu a').forEach(item => item.classList.remove('active'));
    link.classList.add('active');
  });
});

const tabButtons = document.querySelectorAll('.service-tabs button');
const pricingPanels = document.querySelectorAll('.pricing-panel');

function setTab(tab) {
  tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));
  pricingPanels.forEach(panel => panel.classList.toggle('active', panel.id === `panel-${tab}`));
}

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => setTab(btn.dataset.tab));
});

document.querySelectorAll('[data-tab-target]').forEach(el => {
  el.addEventListener('click', () => setTab(el.dataset.tabTarget));
});

const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

  revealElements.forEach(el => observer.observe(el));
} else {
  revealElements.forEach(el => el.classList.add('is-visible'));
}

const sectionLinks = [...document.querySelectorAll('.menu a[href^="#"]')];
const sections = sectionLinks
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

let scrollTicking = false;
const syncActiveNav = () => {
  const marker = window.scrollY + 130;
  let activeId = 'home';

  sections.forEach(section => {
    if (section.offsetTop <= marker) activeId = section.id;
  });

  sectionLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
  });

  scrollTicking = false;
};

window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    scrollTicking = true;
    requestAnimationFrame(syncActiveNav);
  }
}, { passive: true });

syncActiveNav();
