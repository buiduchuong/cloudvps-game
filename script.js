const smoothStylesheet = document.createElement('link');
smoothStylesheet.rel = 'stylesheet';
smoothStylesheet.href = 'smooth-overrides.css?v=1';
document.head.appendChild(smoothStylesheet);

const faqStylesheet = document.createElement('link');
faqStylesheet.rel = 'stylesheet';
faqStylesheet.href = 'faq-smooth.css?v=2';
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
 * Ultra-smooth FAQ accordion.
 * Native <details> is progressively enhanced into a grid-track accordion.
 * This avoids animating explicit heights and removes the jump caused by browser details layout.
 */
const nativeFaqItems = [...document.querySelectorAll('.faq-list details')];

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

    const answerInner = document.createElement('div');
    answerInner.className = 'faq-answer-inner';

    const answerContent = document.createElement('div');
    answerContent.className = 'faq-answer-content';

    [...details.children].forEach(child => {
      if (child !== summary) answerContent.appendChild(child);
    });

    answerInner.appendChild(answerContent);
    answer.appendChild(answerInner);
    item.append(button, answer);
    details.replaceWith(item);

    return { item, button, answer };
  }).filter(Boolean);

  const setOpenState = (entry, shouldOpen) => {
    entry.item.classList.toggle('is-open', shouldOpen);
    entry.button.setAttribute('aria-expanded', String(shouldOpen));
    entry.answer.setAttribute('aria-hidden', String(!shouldOpen));
  };

  upgradedItems.forEach(entry => {
    entry.button.addEventListener('click', () => {
      const opening = !entry.item.classList.contains('is-open');

      /* Keep the section calm: only one answer stays open at a time. */
      if (opening) {
        upgradedItems.forEach(other => {
          if (other !== entry && other.item.classList.contains('is-open')) {
            setOpenState(other, false);
          }
        });
      }

      requestAnimationFrame(() => setOpenState(entry, opening));
    });
  });
}
