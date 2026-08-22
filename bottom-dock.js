(() => {
  if (document.querySelector('.bottom-dock')) return;

  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = 'bottom-dock.css?v=1';
  document.head.appendChild(css);

  const icons = {
    home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 10.5 12 3.8l8.5 6.7"/><path d="M5.5 9.8v9.4h13V9.8"/><path d="M9.5 19.2v-5.5h5v5.5"/></svg>',
    vps: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4.5" width="16" height="6" rx="2"/><rect x="4" y="13.5" width="16" height="6" rx="2"/><path d="M8 7.5h.01M8 16.5h.01M12 7.5h5M12 16.5h5"/></svg>',
    proxy: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="7" cy="12" r="3"/><circle cx="17" cy="7" r="3"/><circle cx="17" cy="17" r="3"/><path d="m9.7 10.7 4.5-2.3M9.7 13.3l4.5 2.3"/></svg>',
    blog: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4.5h11a3 3 0 0 1 3 3v12H8a3 3 0 0 1-3-3z"/><path d="M8.5 8h7M8.5 11.5h7M8.5 15h4.5"/></svg>',
    contact: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5h16v11H8l-4 3z"/><path d="M8 9h8M8 12.5h5"/></svg>'
  };

  const items = [
    { key: 'home', label: 'Trang chủ', href: 'index.html' },
    { key: 'vps', label: 'VPS', href: 'vps.html' },
    { key: 'proxy', label: 'Proxy', href: 'proxy.html' },
    { key: 'blog', label: 'Blog', href: 'blog.html' },
    { key: 'contact', label: 'Liên hệ', href: 'contact.html' }
  ];

  const file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const activeKey = file === 'vps.html' ? 'vps'
    : file === 'proxy.html' ? 'proxy'
    : file === 'blog.html' || file === 'blog-detail.html' ? 'blog'
    : file === 'contact.html' ? 'contact'
    : 'home';

  const nav = document.createElement('nav');
  nav.className = 'bottom-dock';
  nav.setAttribute('aria-label', 'Điều hướng nhanh');

  const inner = document.createElement('div');
  inner.className = 'bottom-dock__inner';

  items.forEach(item => {
    const link = document.createElement('a');
    link.className = `bottom-dock__item${item.key === activeKey ? ' is-active' : ''}`;
    link.href = item.href;
    if (item.key === activeKey) link.setAttribute('aria-current', 'page');
    link.innerHTML = `<span class="bottom-dock__icon">${icons[item.key]}</span><span class="bottom-dock__label">${item.label}</span>`;
    inner.appendChild(link);
  });

  nav.appendChild(inner);
  document.body.appendChild(nav);
  document.body.classList.add('bottom-dock-enabled');
})();
