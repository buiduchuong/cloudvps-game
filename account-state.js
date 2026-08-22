/* Shared customer account link state for public pages. */
(() => {
  const SESSION_KEY = 'cloudvps_demo_session_v1';
  const PROFILE_KEY = 'cloudvps_demo_profile_v1';
  let session = null;
  let profile = null;
  try {
    session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    profile = JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null');
  } catch (_) {}

  document.querySelectorAll('.login').forEach(link => {
    if (session && profile && session.email === profile.email) {
      link.href = 'dashboard.html';
      link.textContent = 'Tài khoản';
      link.setAttribute('aria-label', 'Mở Dashboard khách hàng');
    } else {
      link.href = 'login.html';
      link.textContent = 'Đăng nhập';
      link.setAttribute('aria-label', 'Đăng nhập khách hàng');
    }
  });
})();
