// =============================================
// VIBEZEE — Main JS
// =============================================

// ── MOBILE MENU ──
function toggleMenu() {
  document.getElementById('mobileMenu')?.classList.toggle('open');
}
window.toggleMenu = toggleMenu;

document.addEventListener('click', function(e) {
  const menu      = document.getElementById('mobileMenu');
  const hamburger = document.querySelector('.nav-hamburger');
  if (menu && hamburger && !menu.contains(e.target) && !hamburger.contains(e.target)) {
    menu.classList.remove('open');
  }
});

// ── CART ──
function addToCart(id) {
  const user = localStorage.getItem('vz_user');
  if (!user) {
    showToast('⚠ Login ဝင်မှ cart ထည့်နိုင်သည်');
    setTimeout(() => window.location.href = 'login.html', 1500);
    return;
  }
  const cart = JSON.parse(localStorage.getItem('vz_cart') || '[]');
  cart.push(Number(id));
  localStorage.setItem('vz_cart', JSON.stringify(cart));
  updateCartCount();
  showToast('✓ Added to cart!');
}
window.addToCart = addToCart;

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('vz_cart') || '[]');
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = cart.length);
}

// ── AUTH NAV ──
function updateNavAuth() {
  const user = JSON.parse(localStorage.getItem('vz_user') || 'null');
  const navLink    = document.getElementById('navAuthLink');
  const mobileLink = document.getElementById('mobileAuthLink');
  if (user) {
    if (navLink) {
      navLink.textContent = user.name || 'PROFILE';
      navLink.href = 'profile.html';
      navLink.onclick = null;
    }
    if (mobileLink) {
      mobileLink.textContent = user.name || 'PROFILE';
      mobileLink.href = 'profile.html';
    }
  }
}

function showLogoutMenu(e) {
  if (e) e.preventDefault();
  const existing = document.getElementById('logoutMenu');
  if (existing) { existing.remove(); return; }

  const menu = document.createElement('div');
  menu.id = 'logoutMenu';
  menu.style.cssText = [
    'position:fixed', 'top:68px', 'right:20px', 'z-index:999',
    'background:#0f2235', 'border:1px solid rgba(0,230,118,0.2)',
    'border-radius:10px', 'padding:0.5rem',
    'box-shadow:0 8px 24px rgba(0,0,0,0.4)', 'min-width:160px'
  ].join(';');

  const user = JSON.parse(localStorage.getItem('vz_user') || '{}');
  menu.innerHTML = `
    <div style="padding:0.6rem 1rem;font-size:0.8rem;color:#8899aa;border-bottom:1px solid rgba(0,230,118,0.1);margin-bottom:0.3rem;">
      ${user.email || ''}
    </div>
    <a href="#" onclick="logoutUser()" style="display:block;padding:0.6rem 1rem;font-size:0.85rem;color:#ff5252;font-weight:600;text-decoration:none;font-family:'Orbitron',sans-serif;letter-spacing:1px;">
      🚪 LOGOUT
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

// ── TOAST ──
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}
window.showToast = showToast;

// ── INIT ──
document.addEventListener('DOMContentLoaded', function() {
  updateCartCount();
  updateNavAuth();
});
