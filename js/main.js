// =============================================
// VIBEZEE — Main JS
// =============================================

// ── MOBILE MENU ──
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.toggle('open');
}

// Close menu when clicking outside
document.addEventListener('click', function(e) {
  const menu = document.getElementById('mobileMenu');
  const hamburger = document.querySelector('.nav-hamburger');
  if (menu && hamburger && !menu.contains(e.target) && !hamburger.contains(e.target)) {
    menu.classList.remove('open');
  }
});

// ── CART ──
let cart = JSON.parse(localStorage.getItem('vz_cart') || '[]');
updateCartCount();

function addToCart(id) {
  cart.push(id);
  localStorage.setItem('vz_cart', JSON.stringify(cart));
  updateCartCount();
  showToast('✓ Added to cart!');
}

function updateCartCount() {
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = cart.length;
  });
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

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
