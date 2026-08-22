/*
 * CloudVPS demo auth for GitHub Pages preview only.
 * IMPORTANT: passwords are never persisted or verified here.
 * Replace this file's demo session calls with real HTTPS backend auth before production.
 */
(() => {
  const PROFILE_KEY = 'cloudvps_demo_profile_v1';
  const SESSION_KEY = 'cloudvps_demo_session_v1';

  const $ = selector => document.querySelector(selector);
  const status = $('#authStatus');

  const setStatus = (message = '', type = '') => {
    if (!status) return;
    status.textContent = message;
    status.className = `auth-status${type ? ` ${type}` : ''}`;
  };

  const readProfile = () => {
    try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null'); }
    catch { return null; }
  };

  const saveProfile = profile => localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  const createSession = email => localStorage.setItem(SESSION_KEY, JSON.stringify({ email, createdAt: Date.now() }));

  const normalizeEmail = value => (value || '').trim().toLowerCase();
  const validEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  document.querySelectorAll('[data-password-toggle]').forEach(button => {
    button.addEventListener('click', () => {
      const input = document.getElementById(button.dataset.passwordToggle);
      if (!input) return;
      input.type = input.type === 'password' ? 'text' : 'password';
      button.textContent = input.type === 'password' ? 'Hiện' : 'Ẩn';
      button.setAttribute('aria-pressed', String(input.type !== 'password'));
    });
  });

  const registerForm = $('#registerForm');
  registerForm?.addEventListener('submit', event => {
    event.preventDefault();
    setStatus();

    const name = $('#name')?.value.trim() || '';
    const email = normalizeEmail($('#email')?.value);
    const phone = $('#phone')?.value.trim() || '';
    const password = $('#password')?.value || '';
    const confirm = $('#confirmPassword')?.value || '';
    const terms = $('#terms')?.checked;

    let ok = true;
    document.querySelectorAll('.auth-field input').forEach(input => input.removeAttribute('aria-invalid'));

    if (name.length < 2) { $('#name')?.setAttribute('aria-invalid', 'true'); ok = false; }
    if (!validEmail(email)) { $('#email')?.setAttribute('aria-invalid', 'true'); ok = false; }
    if (password.length < 6) { $('#password')?.setAttribute('aria-invalid', 'true'); ok = false; }
    if (confirm !== password || !confirm) { $('#confirmPassword')?.setAttribute('aria-invalid', 'true'); ok = false; }
    if (!terms) ok = false;

    if (!ok) {
      setStatus('Vui lòng kiểm tra lại thông tin. Mật khẩu demo cần ít nhất 6 ký tự.', 'error');
      return;
    }

    const profile = {
      name,
      email,
      phone,
      createdAt: new Date().toISOString(),
      plan: 'Khách hàng mới'
    };

    // Password is intentionally discarded; this is only a UI preview session.
    saveProfile(profile);
    createSession(email);
    setStatus('Đã tạo tài khoản demo. Đang mở Dashboard...', 'success');
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 420);
  });

  const loginForm = $('#loginForm');
  loginForm?.addEventListener('submit', event => {
    event.preventDefault();
    setStatus();

    const email = normalizeEmail($('#email')?.value);
    const password = $('#password')?.value || '';
    const profile = readProfile();

    if (!validEmail(email) || password.length < 6) {
      setStatus('Nhập email hợp lệ và mật khẩu demo ít nhất 6 ký tự.', 'error');
      return;
    }

    if (!profile || normalizeEmail(profile.email) !== email) {
      setStatus('Thiết bị này chưa có tài khoản demo với email đó. Hãy Đăng ký hoặc dùng nút Tài khoản demo.', 'error');
      return;
    }

    // No password verification in static demo mode.
    createSession(email);
    setStatus('Đăng nhập demo thành công. Đang mở Dashboard...', 'success');
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 420);
  });

  $('#demoLogin')?.addEventListener('click', () => {
    const profile = {
      name: 'Khách hàng Demo',
      email: 'demo@cloudvps.vn',
      phone: '0900 000 000',
      createdAt: new Date().toISOString(),
      plan: 'Demo Account'
    };
    saveProfile(profile);
    createSession(profile.email);
    setStatus('Đang mở tài khoản demo...', 'success');
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 320);
  });

  // If already signed in, keep auth pages useful but offer quick dashboard access.
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    if (session && $('.auth-switch')) {
      const quick = document.createElement('p');
      quick.className = 'auth-switch';
      quick.innerHTML = 'Bạn đang có phiên demo. <a href="dashboard.html">Mở Dashboard →</a>';
      $('.auth-card')?.appendChild(quick);
    }
  } catch (_) {}
})();
