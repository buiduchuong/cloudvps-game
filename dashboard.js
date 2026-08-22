/* CloudVPS customer dashboard demo controller */
(() => {
  const PROFILE_KEY = 'cloudvps_demo_profile_v1';
  const SESSION_KEY = 'cloudvps_demo_session_v1';

  const safeParse = (value, fallback = null) => {
    try { return JSON.parse(value); } catch { return fallback; }
  };

  const session = safeParse(localStorage.getItem(SESSION_KEY));
  const profile = safeParse(localStorage.getItem(PROFILE_KEY));

  if (!session || !profile || !profile.email || session.email !== profile.email) {
    window.location.replace('login.html');
    return;
  }

  const initials = (profile.name || profile.email || 'CV')
    .split(/\s+/)
    .filter(Boolean)
    .slice(-2)
    .map(part => part[0]?.toUpperCase())
    .join('') || 'CV';

  const bindText = (selector, value) => {
    document.querySelectorAll(selector).forEach(el => { el.textContent = value; });
  };

  bindText('[data-user-name]', profile.name || 'Khách hàng');
  bindText('[data-user-email]', profile.email || '');
  bindText('[data-user-phone]', profile.phone || 'Chưa cập nhật');
  bindText('[data-user-initials]', initials);
  bindText('[data-user-plan]', profile.plan || 'Khách hàng');

  const created = profile.createdAt ? new Date(profile.createdAt) : null;
  bindText('[data-user-created]', created && !Number.isNaN(created.getTime())
    ? created.toLocaleDateString('vi-VN')
    : 'Hôm nay');

  document.querySelectorAll('[data-logout]').forEach(button => {
    button.addEventListener('click', () => {
      localStorage.removeItem(SESSION_KEY);
      window.location.href = 'login.html';
    });
  });

  const sidebar = document.getElementById('dashSidebar');
  const backdrop = document.getElementById('dashBackdrop');
  const menuBtn = document.getElementById('dashMenuBtn');

  const closeSidebar = () => {
    sidebar?.classList.remove('open');
    backdrop?.classList.remove('show');
    menuBtn?.setAttribute('aria-expanded', 'false');
  };

  menuBtn?.addEventListener('click', () => {
    const open = !sidebar?.classList.contains('open');
    sidebar?.classList.toggle('open', open);
    backdrop?.classList.toggle('show', open);
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  backdrop?.addEventListener('click', closeSidebar);
  document.querySelectorAll('.dash-nav a').forEach(link => link.addEventListener('click', closeSidebar));

  const editBtn = document.getElementById('editProfileBtn');
  editBtn?.addEventListener('click', () => {
    const name = window.prompt('Họ và tên:', profile.name || '');
    if (name === null) return;
    const phone = window.prompt('Số điện thoại:', profile.phone || '');
    if (phone === null) return;

    const next = { ...profile, name: name.trim() || profile.name, phone: phone.trim() };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
    window.location.reload();
  });

  document.querySelectorAll('[data-demo-disabled]').forEach(el => {
    el.addEventListener('click', event => {
      event.preventDefault();
      window.alert('Tính năng này sẽ hoạt động sau khi nối backend và hệ thống thanh toán.');
    });
  });
})();
