const smoothStylesheet = document.createElement('link');
smoothStylesheet.rel = 'stylesheet';
smoothStylesheet.href = 'smooth-overrides.css?v=1';
document.head.appendChild(smoothStylesheet);

const faqStylesheet = document.createElement('link');
faqStylesheet.rel = 'stylesheet';
faqStylesheet.href = 'faq-smooth.css?v=1';
document.head.appendChild(faqStylesheet);

const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');

menuBtn?.addEventListener('click', () => {
  menu.classList.toggle('show');
  menuBtn.textContent = menu.classList.contains('show') ? '✕' : '☰';
});

document.querySelectorAll('.menu a').forEach(link => {
  link.addEventListener('click', () => {
    menu?.classList.remove('show');
    if (menuBtn) menuBtn.textContent = '☰';
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

// Smooth FAQ accordion animation for native <details> elements.
const faqDetails = document.querySelectorAll('.faq-list details');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion) {
  faqDetails.forEach(details => {
    const summary = details.querySelector('summary');
    if (!summary) return;

    let animation = null;
    let isClosing = false;
    let isExpanding = false;

    const borderHeight = () => {
      const styles = getComputedStyle(details);
      return (parseFloat(styles.borderTopWidth) || 0) + (parseFloat(styles.borderBottomWidth) || 0);
    };

    const finishAnimation = open => {
      details.open = open;
      animation = null;
      isClosing = false;
      isExpanding = false;
      details.style.height = '';
      details.style.overflow = '';
      details.classList.remove('is-animating');
    };

    const shrink = () => {
      const startHeight = `${details.getBoundingClientRect().height}px`;
      const endHeight = `${summary.getBoundingClientRect().height + borderHeight()}px`;

      if (animation) animation.cancel();
      isClosing = true;
      details.classList.add('is-animating');
      details.style.overflow = 'hidden';

      animation = details.animate(
        { height: [startHeight, endHeight] },
        { duration: 320, easing: 'cubic-bezier(.2,.8,.2,1)' }
      );

      animation.onfinish = () => finishAnimation(false);
      animation.oncancel = () => { isClosing = false; };
    };

    const expand = () => {
      const startHeight = `${details.getBoundingClientRect().height}px`;
      const endHeight = `${details.scrollHeight + borderHeight()}px`;

      if (animation) animation.cancel();
      isExpanding = true;
      details.classList.add('is-animating');
      details.style.overflow = 'hidden';

      animation = details.animate(
        { height: [startHeight, endHeight] },
        { duration: 340, easing: 'cubic-bezier(.2,.8,.2,1)' }
      );

      animation.onfinish = () => finishAnimation(true);
      animation.oncancel = () => { isExpanding = false; };
    };

    const openDetails = () => {
      details.style.height = `${details.getBoundingClientRect().height}px`;
      details.open = true;
      requestAnimationFrame(expand);
    };

    summary.addEventListener('click', event => {
      event.preventDefault();

      if (isClosing || !details.open) {
        openDetails();
      } else if (isExpanding || details.open) {
        shrink();
      }
    });
  });
}
