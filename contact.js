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
  }, { threshold: 0.12, rootMargin: '0px 0px -28px 0px' });
  revealElements.forEach(el => observer.observe(el));
} else {
  revealElements.forEach(el => el.classList.add('is-visible'));
}

const form = document.getElementById('supportForm');
const formStatus = document.getElementById('formStatus');
const copyRequest = document.getElementById('copyRequest');

const fields = {
  name: document.getElementById('name'),
  email: document.getElementById('email'),
  phone: document.getElementById('phone'),
  service: document.getElementById('service'),
  subject: document.getElementById('subject'),
  message: document.getElementById('message')
};

function setStatus(message, type = '') {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.className = `form-status${type ? ` ${type}` : ''}`;
}

function clearInvalid() {
  document.querySelectorAll('.field.is-invalid').forEach(el => el.classList.remove('is-invalid'));
}

function markInvalid(input) {
  input?.closest('.field')?.classList.add('is-invalid');
}

function validateForm() {
  clearInvalid();
  let valid = true;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!fields.name.value.trim()) { markInvalid(fields.name); valid = false; }
  if (!emailPattern.test(fields.email.value.trim())) { markInvalid(fields.email); valid = false; }
  if (!fields.subject.value.trim()) { markInvalid(fields.subject); valid = false; }
  if (!fields.message.value.trim()) { markInvalid(fields.message); valid = false; }

  if (!valid) setStatus('Vui lòng kiểm tra lại các trường bắt buộc.', 'error');
  return valid;
}

function buildRequestText() {
  return [
    `Họ tên: ${fields.name.value.trim() || '-'}`,
    `Email: ${fields.email.value.trim() || '-'}`,
    `Số điện thoại: ${fields.phone.value.trim() || '-'}`,
    `Dịch vụ: ${fields.service.value || '-'}`,
    `Tiêu đề: ${fields.subject.value.trim() || '-'}`,
    '',
    'Nội dung:',
    fields.message.value.trim() || '-'
  ].join('\n');
}

form?.addEventListener('submit', event => {
  event.preventDefault();
  if (!validateForm()) return;

  const subject = `[CloudVPS] ${fields.service.value} - ${fields.subject.value.trim()}`;
  const body = buildRequestText();
  const mailto = `mailto:support@cloudvps.vn?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  setStatus('Đang mở ứng dụng email để gửi yêu cầu...', 'success');
  window.location.href = mailto;
});

copyRequest?.addEventListener('click', async () => {
  const text = buildRequestText();
  try {
    await navigator.clipboard.writeText(text);
    setStatus('Đã sao chép nội dung yêu cầu.', 'success');
  } catch {
    const temp = document.createElement('textarea');
    temp.value = text;
    temp.style.position = 'fixed';
    temp.style.opacity = '0';
    document.body.appendChild(temp);
    temp.select();
    document.execCommand('copy');
    temp.remove();
    setStatus('Đã sao chép nội dung yêu cầu.', 'success');
  }
});
