// Custom Cursor
const cursor = document.querySelector('.cursor');
const trail = document.querySelector('.cursor-trail');
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  setTimeout(() => {
    trail.style.left = e.clientX + 'px';
    trail.style.top = e.clientY + 'px';
  }, 80);
});

// Cart
let cart = JSON.parse(localStorage.getItem('vz_cart') || '[]');
updateCartCount();

function addToCart(id) {
  cart.push(id);
  localStorage.setItem('vz_cart', JSON.stringify(cart));
  updateCartCount();
  showToast();
}

function updateCartCount() {
  const el = document.querySelector('.cart-count');
  if (el) el.textContent = cart.length;
}

function showToast() {
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// Scroll animation
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
