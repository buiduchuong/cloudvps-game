const contactNavLinks = document.querySelectorAll('.menu a, .footer-links a');
contactNavLinks.forEach(link => {
  if (link.textContent.trim().toLowerCase() === 'liên hệ') link.setAttribute('href', 'contact.html');
});

const smoothStylesheet = document.createElement('link');
smoothStylesheet.rel = 'stylesheet';
smoothStylesheet.href = 'smooth-overrides.css?v=1';
document.head.appendChild(smoothStylesheet);

const faqStylesheet = document.createElement('link');
faqStylesheet.rel = 'stylesheet';
faqStylesheet.href = 'faq-smooth.css?v=3';
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

/*
 * FAQ accordion - FLIP animation.
 * The previous grid-track transition recalculated layout every animation frame.
 * Here layout changes once, while neighbouring cards move with compositor transforms.
 */
const nativeFaqItems = [...document.querySelectorAll('.faq-list details')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (nativeFaqItems.length) {
  const upgradedItems = nativeFaqItems.map((details, index) => {
    const summary = details.querySelector('summary');
    if (!summary) return null;

    const wasOpen = details.open;
    const item = document.createElement('div');
    item.className = `faq-item${wasOpen ? ' is-open' : ''}`;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'faq-question';
    button.setAttribute('aria-expanded', String(wasOpen));

    const answerId = `faq-answer-${index + 1}`;
    button.setAttribute('aria-controls', answerId);

    const questionText = document.createElement('span');
    questionText.textContent = summary.textContent.trim();

    const icon = document.createElement('span');
    icon.className = 'faq-icon';
    icon.setAttribute('aria-hidden', 'true');

    button.append(questionText, icon);

    const answer = document.createElement('div');
    answer.className = 'faq-answer';
    answer.id = answerId;
    answer.setAttribute('role', 'region');
    answer.setAttribute('aria-hidden', String(!wasOpen));
    answer.hidden = !wasOpen;

    const answerContent = document.createElement('div');
    answerContent.className = 'faq-answer-content';

    [...details.children].forEach(child => {
      if (child !== summary) answerContent.appendChild(child);
    });

    answer.appendChild(answerContent);
    item.append(button, answer);
    details.replaceWith(item);

    return { item, button, answer, answerContent, animating: false };
  }).filter(Boolean);

  const duration = 380;
  const easing = 'cubic-bezier(.22,1,.36,1)';

  const setState = (entry, open) => {
    entry.item.classList.toggle('is-open', open);
    entry.button.setAttribute('aria-expanded', String(open));
    entry.answer.setAttribute('aria-hidden', String(!open));
    entry.answer.hidden = !open;
  };

  const getRects = () => upgradedItems.map(entry => entry.item.getBoundingClientRect());

  const animateMovedSiblings = (firstRects, lastRects) => {
    const animations = [];

    upgradedItems.forEach((entry, i) => {
      const dy = firstRects[i].top - lastRects[i].top;
      if (Math.abs(dy) < 0.5) return;

      animations.push(entry.item.animate(
        [
          { transform: `translate3d(0, ${dy}px, 0)` },
          { transform: 'translate3d(0, 0, 0)' }
        ],
        { duration, easing }
      ));
    });

    return animations;
  };

  const openItem = entry => {
    if (entry.animating) return;
    entry.animating = true;
    entry.item.classList.add('is-animating');

    const firstRects = getRects();
    const firstHeight = entry.item.getBoundingClientRect().height;

    setState(entry, true);

    const lastRects = getRects();
    const lastHeight = entry.item.getBoundingClientRect().height;
    const revealHeight = Math.max(0, lastHeight - firstHeight);

    if (reduceMotion) {
      entry.animating = false;
      entry.item.classList.remove('is-animating');
      return;
    }

    const siblingAnimations = animateMovedSiblings(firstRects, lastRects);
    const revealAnimation = entry.item.animate(
      [
        { clipPath: `inset(0 0 ${revealHeight}px 0 round 16px)` },
        { clipPath: 'inset(0 0 0 0 round 16px)' }
      ],
      { duration, easing }
    );

    entry.answerContent.animate(
      [
        { opacity: 0, transform: 'translate3d(0,-5px,0)' },
        { opacity: 1, transform: 'translate3d(0,0,0)' }
      ],
      { duration: 280, delay: 45, easing, fill: 'both' }
    );

    revealAnimation.onfinish = () => {
      entry.animating = false;
      entry.item.classList.remove('is-animating');
      siblingAnimations.forEach(animation => animation.cancel());
    };
  };

  const closeItem = entry => {
    if (entry.animating) return;
    entry.animating = true;
    entry.item.classList.add('is-animating');

    if (reduceMotion) {
      setState(entry, false);
      entry.animating = false;
      entry.item.classList.remove('is-animating');
      return;
    }

    const currentRect = entry.item.getBoundingClientRect();
    const answerHeight = entry.answer.getBoundingClientRect().height;
    const following = upgradedItems.filter(other => other !== entry && other.item.getBoundingClientRect().top > currentRect.top);

    const followingAnimations = following.map(other => other.item.animate(
      [
        { transform: 'translate3d(0,0,0)' },
        { transform: `translate3d(0,-${answerHeight}px,0)` }
      ],
      { duration, easing }
    ));

    const hideAnimation = entry.item.animate(
      [
        { clipPath: 'inset(0 0 0 0 round 16px)' },
        { clipPath: `inset(0 0 ${answerHeight}px 0 round 16px)` }
      ],
      { duration, easing }
    );

    entry.answerContent.animate(
      [
        { opacity: 1, transform: 'translate3d(0,0,0)' },
        { opacity: 0, transform: 'translate3d(0,-4px,0)' }
      ],
      { duration: 220, easing, fill: 'both' }
    );

    hideAnimation.onfinish = () => {
      setState(entry, false);
      followingAnimations.forEach(animation => animation.cancel());
      entry.animating = false;
      entry.item.classList.remove('is-animating');
    };
  };

  upgradedItems.forEach(entry => {
    entry.button.addEventListener('click', () => {
      if (entry.item.classList.contains('is-open')) closeItem(entry);
      else openItem(entry);
    });
  });
}
