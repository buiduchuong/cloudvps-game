(() => {
  let session = null;
  let profile = null;
  try {
    session = JSON.parse(localStorage.getItem('cloudvps_demo_session_v1') || 'null');
    profile = JSON.parse(localStorage.getItem('cloudvps_demo_profile_v1') || 'null');
  } catch (_) {}
  document.querySelectorAll('.login').forEach(link => {
    const signedIn = session && profile && session.email === profile.email;
    link.href = signedIn ? 'dashboard.html' : 'login.html';
    link.textContent = signedIn ? 'Tài khoản' : 'Đăng nhập';
  });
})();

const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');

menuBtn?.addEventListener('click', () => {
  menu?.classList.toggle('show');
  menuBtn.textContent = menu?.classList.contains('show') ? '✕' : '☰';
});

document.querySelectorAll('.menu a').forEach(link => {
  link.addEventListener('click', () => {
    menu?.classList.remove('show');
    if (menuBtn) menuBtn.textContent = '☰';
  });
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
  }, { threshold: 0.1, rootMargin: '0px 0px -25px 0px' });
  revealElements.forEach(el => observer.observe(el));
} else {
  revealElements.forEach(el => el.classList.add('is-visible'));
}

const searchInput = document.getElementById('blogSearch');
const categoryButtons = document.querySelectorAll('[data-category-filter]');
const postCards = document.querySelectorAll('[data-post-card]');
const emptyState = document.getElementById('emptyState');
let activeCategory = 'all';

const normalize = value => (value || '')
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/đ/g, 'd');

function filterPosts() {
  if (!postCards.length) return;
  const query = normalize(searchInput?.value.trim());
  let visible = 0;

  postCards.forEach(card => {
    const title = normalize(card.dataset.title);
    const excerpt = normalize(card.dataset.excerpt);
    const category = card.dataset.category || '';
    const matchesQuery = !query || title.includes(query) || excerpt.includes(query);
    const matchesCategory = activeCategory === 'all' || category === activeCategory;
    const show = matchesQuery && matchesCategory;
    card.hidden = !show;
    if (show) visible += 1;
  });

  emptyState?.classList.toggle('show', visible === 0);
}

searchInput?.addEventListener('input', filterPosts);
categoryButtons.forEach(button => {
  button.addEventListener('click', () => {
    activeCategory = button.dataset.categoryFilter || 'all';
    categoryButtons.forEach(item => item.classList.toggle('active', item === button));
    filterPosts();
  });
});

const progress = document.getElementById('articleProgress');
if (progress) {
  let ticking = false;
  const updateProgress = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const value = max > 0 ? (window.scrollY / max) * 100 : 0;
    progress.style.width = `${Math.min(100, Math.max(0, value))}%`;
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateProgress);
    }
  }, { passive: true });
  updateProgress();
}

const tocLinks = [...document.querySelectorAll('.article-toc a[href^="#"]')];
const tocSections = tocLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
if (tocLinks.length && tocSections.length) {
  let ticking = false;
  const syncToc = () => {
    const marker = window.scrollY + 160;
    let active = tocSections[0]?.id;
    tocSections.forEach(section => {
      if (section.offsetTop <= marker) active = section.id;
    });
    tocLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${active}`));
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(syncToc);
    }
  }, { passive: true });
  syncToc();
}

document.querySelectorAll('[data-copy-link]').forEach(button => {
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      const old = button.textContent;
      button.textContent = '✓';
      setTimeout(() => { button.textContent = old; }, 1300);
    } catch (_) {
      window.prompt('Sao chép liên kết:', window.location.href);
    }
  });
});
