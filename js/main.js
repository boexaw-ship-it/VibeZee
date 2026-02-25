// =============================================
// VIBEZEE — Main JS
// =============================================

// ── MOBILE MENU ──
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.toggle('open');
}
window.toggleMenu = toggleMenu;

document.addEventListener('click', function(e) {
  const menu = document.querySelector('.mobile-menu');
  const hamburger = document.querySelector('.nav-hamburger');
  if (menu && hamburger && !menu.contains(e.target) && !hamburger.contains(e.target)) {
    menu.classList.remove('open');
  }
});

// ── CART ──
let cart = JSON.parse(localStorage.getItem('vz_cart') || '[]').map(Number);
updateCartCount();

function addToCart(id) {
  // Login စစ်တယ်
  const userStr = localStorage.getItem('vz_user');
  if (!userStr) {
    showToast('⚠ Login ဝင်မှ cart ထည့်နိုင်သည်');
    setTimeout(() => { window.location.href = 'login.html'; }, 1500);
    return;
  }

  const numId = Number(id);
  cart.push(numId);
  localStorage.setItem('vz_cart', JSON.stringify(cart));
  updateCartCount();
  showToast('✓ Added to cart!');
}
window.addToCart = addToCart;

function updateCartCount() {
  const c = JSON.parse(localStorage.getItem('vz_cart') || '[]');
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = c.length;
  });
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ── NAV — Login/Logout state ──
function updateNavAuth() {
  const user = JSON.parse(localStorage.getItem('vz_user') || 'null');
  const loginLinks = document.querySelectorAll('.btn-nav, .nav-login-link');
  const mobileLoginLinks = document.querySelectorAll('.mobile-menu a[href="login.html"]');

  if (user) {
    // Login ဝင်ထားရင် — name ပြပြီး logout button ပြ
    loginLinks.forEach(el => {
      el.textContent = (user.name || 'PROFILE').toUpperCase();
      el.href = '#';
      el.onclick = (e) => { e.preventDefault(); showLogoutMenu(); };
    });
    mobileLoginLinks.forEach(el => {
      el.textContent = (user.name || 'PROFILE').toUpperCase();
    });
  }
}

function showLogoutMenu() {
  const existing = document.getElementById('logoutMenu');
  if (existing) { existing.remove(); return; }

  const menu = document.createElement('div');
  menu.id = 'logoutMenu';
  menu.style.cssText = `
    position:fixed; top:60px; right:20px; z-index:999;
    background:#fff; border:1px solid rgba(37,99,235,0.2);
    border-radius:10px; padding:0.5rem;
    box-shadow:0 8px 24px rgba(0,0,0,0.12); min-width:150px;
  `;

  const user = JSON.parse(localStorage.getItem('vz_user') || '{}');

  menu.innerHTML = `
    <div style="padding:0.6rem 1rem;font-size:0.75rem;color:#64748b;border-bottom:1px solid #e2e8f0;margin-bottom:0.3rem;">
      ${user.email || ''}
    </div>
    <a href="#" onclick="logoutUser()" style="display:block;padding:0.6rem 1rem;font-size:0.8rem;color:#ef4444;font-weight:600;text-decoration:none;">
      🚪 Logout
    </a>
  `;

  document.body.appendChild(menu);
  setTimeout(() => document.addEventListener('click', () => menu.remove(), { once: true }), 100);
}

function logoutUser() {
  localStorage.removeItem('vz_user');
  localStorage.removeItem('vz_token');
  window.location.href = 'login.html';
}
window.logoutUser = logoutUser;

// ── SCROLL ANIMATION ──
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.animation = 'fadeUp 0.6s ease forwards';
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.cat-card, .product-card, .why-card').forEach(el => {
  el.style.opacity = '0';
  observer.observe(el);
});

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  updateNavAuth();
  updateCartCount();
});
