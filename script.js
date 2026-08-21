const fontSizeStylesheet = document.createElement('link');
fontSizeStylesheet.rel = 'stylesheet';
fontSizeStylesheet.href = 'font-size-overrides.css?v=2';
document.head.appendChild(fontSizeStylesheet);

const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');

menuBtn?.addEventListener('click', () => {
  menu.classList.toggle('show');
});

document.querySelectorAll('.menu a').forEach(link => {
  link.addEventListener('click', () => {
    menu.classList.remove('show');
    document.querySelectorAll('.menu a').forEach(x => x.classList.remove('active'));
    link.classList.add('active');
  });
});

const tabButtons = document.querySelectorAll('.service-tabs button');
const panels = document.querySelectorAll('.pricing-panel');
const billingTabs = document.getElementById('billingTabs');

function setTab(tab) {
  tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));
  panels.forEach(panel => panel.classList.toggle('active', panel.id === `panel-${tab}`));
  billingTabs.style.display = tab === 'vps' ? 'flex' : 'none';
}

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => setTab(btn.dataset.tab));
});

document.querySelectorAll('[data-tab-target]').forEach(el => {
  el.addEventListener('click', () => setTab(el.dataset.tabTarget));
});

document.querySelectorAll('.billing-tabs button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.billing-tabs button').forEach(x => x.classList.remove('active'));
    btn.classList.add('active');

    const mode = btn.dataset.billing;
    document.querySelectorAll('.price b[data-month]').forEach(price => {
      price.textContent = price.dataset[mode];
    });
  });
});
