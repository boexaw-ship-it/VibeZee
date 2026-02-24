// =============================================
// VIBEZEE — Cart JS (Firebase Firestore Orders)
// =============================================

import { db } from './firebase.js';
import {
  collection, addDoc, serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ── CART STATE ──
let cart = JSON.parse(localStorage.getItem('vz_cart') || '[]');
let currentStep = 1;
let selectedPayment = 'cod';

const PRODUCTS = {
  1: { name:'ProSound X1 Gaming Earphones', price:25000, icon:'🎧' },
  2: { name:'MechStrike TKL Keyboard',       price:85000, icon:'⌨️' },
  3: { name:'VortexClick Pro Gaming Mouse',  price:45000, icon:'🖱' },
  4: { name:'ClearVoice USB Condenser Mic',  price:55000, icon:'🎙' },
};

function saveCart() { localStorage.setItem('vz_cart', JSON.stringify(cart)); updateCartCount(); }

function getCartItems() {
  const counts = {};
  cart.forEach(id => counts[id] = (counts[id] || 0) + 1);
  return Object.entries(counts).map(([id, qty]) => ({
    id: Number(id), qty,
    ...(PRODUCTS[id] || { name:'Product #'+id, price:0, icon:'📦' }),
  }));
}

function getTotal() {
  return getCartItems().reduce((s, i) => s + i.price * i.qty, 0);
}

function getDelivery() { return getTotal() >= 50000 ? 0 : 3000; }

// ── RENDER ──
function renderCart() {
  const items = getCartItems();
  const wrap  = document.getElementById('cartItems');
  const empty = document.getElementById('cartEmpty');
  const count = document.getElementById('cartItemCount');
  if (!wrap) return;

  if (items.length === 0) {
    wrap.innerHTML = '';
    if (empty) empty.style.display = 'flex';
    return;
  }
  if (empty) empty.style.display = 'none';
  if (count) count.textContent = items.length + ' item' + (items.length > 1 ? 's' : '');

  wrap.innerHTML = items.map(item => `
    <div class="cart-item" id="item-${item.id}">
      <div class="cart-item-img">${item.icon}</div>
      <div class="cart-item-info">
        <h3 class="cart-item-name">${item.name}</h3>
        <div class="cart-item-price">${item.price.toLocaleString()} MMK</div>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
      </div>
      <button class="remove-btn" onclick="removeItem(${item.id})">✕</button>
    </div>
  `).join('');

  renderSummary();
}

function renderSummary() {
  const subtotal  = getTotal();
  const delivery  = getDelivery();
  const total     = subtotal + delivery;
  const setText   = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  setText('subtotalAmt',  subtotal.toLocaleString()  + ' MMK');
  setText('deliveryAmt',  delivery === 0 ? 'FREE' : delivery.toLocaleString() + ' MMK');
  setText('totalAmt',     total.toLocaleString()     + ' MMK');
  setText('summaryTotal', total.toLocaleString()     + ' MMK');
}

window.changeQty = function(id, delta) {
  const idx = cart.lastIndexOf(id);
  if (delta > 0) { cart.push(id); }
  else { if (idx > -1) cart.splice(idx, 1); }
  saveCart(); renderCart();
};

window.removeItem = function(id) {
  cart = cart.filter(i => i !== id);
  saveCart(); renderCart();
};

window.clearCart = function() {
  if (!confirm('Cart ကို အကုန် ဖျက်မှာ သေချာပါသလား?')) return;
  cart = []; saveCart(); renderCart();
};

// ── PAYMENT SELECT ──
window.selectPayment = function(method) {
  selectedPayment = method;
  document.querySelectorAll('.payment-card').forEach(c => c.classList.remove('active'));
  const el = document.querySelector(`[data-payment="${method}"]`);
  if (el) el.classList.add('active');
  const info = {
    cod:     '🚚 Cash on Delivery — အိမ်ရောက်မှ ငွေပေးရမည်',
    kbzpay:  '📱 KBZPay — 09xxxxxxxxx သို့ လွှဲပါ',
    wavepay: '💜 WavePay — 09xxxxxxxxx သို့ လွှဲပါ',
  };
  const infoEl = document.getElementById('paymentInfo');
  if (infoEl) { infoEl.textContent = info[method] || ''; infoEl.style.display = 'block'; }
};

// ── STEPS ──
window.goToCheckout = function() {
  if (getCartItems().length === 0) { showToast('Cart ထဲ ပစ္စည်း မရှိဘူး'); return; }
  showStep(2);
};

window.goBackToCart = function() { showStep(1); };

function showStep(n) {
  currentStep = n;
  document.querySelectorAll('.checkout-step').forEach((s, i) => {
    s.style.display = (i + 1 === n) ? 'block' : 'none';
  });
  document.querySelectorAll('.step-item').forEach((s, i) => {
    s.classList.toggle('active',    i + 1 === n);
    s.classList.toggle('completed', i + 1 < n);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── PLACE ORDER ──
window.placeOrder = async function() {
  const name    = document.getElementById('checkName')?.value.trim();
  const phone   = document.getElementById('checkPhone')?.value.trim();
  const address = document.getElementById('checkAddress')?.value.trim();
  const city    = document.getElementById('checkCity')?.value;
  const note    = document.getElementById('checkNote')?.value.trim();

  if (!name || !phone || !address || !city) {
    showToast('⚠ အချက်အလက်တွေ ပြည့်ပြည့်ဖြည့်ပါ'); return;
  }

  const btn = document.getElementById('btnPlaceOrder');
  if (btn) { btn.disabled = true; btn.textContent = 'PLACING ORDER...'; }

  const items   = getCartItems();
  const subtotal = getTotal();
  const delivery = getDelivery();
  const total    = subtotal + delivery;
  const orderId  = '#VZ-' + Date.now().toString().slice(-6);
  const dateStr  = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Yangon' });

  const orderData = {
    orderId, name, phone, address, city,
    note:    note || '',
    payment: selectedPayment,
    items:   items.map(i => ({ name: i.name, icon: i.icon, qty: i.qty, price: i.price, total: i.price * i.qty })),
    subtotal, delivery, total,
    status:  'pending',
    createdAt: serverTimestamp(),
    date: dateStr,
  };

  try {
    // Firestore မှာ order သိမ်း
    await addDoc(collection(db, 'orders'), orderData);

    // localStorage မှာ backup သိမ်း
    const saved = JSON.parse(localStorage.getItem('vz_orders') || '[]');
    saved.push({ ...orderData, createdAt: dateStr });
    localStorage.setItem('vz_orders', JSON.stringify(saved));

    // Cart ရှင်းပစ်
    cart = []; saveCart();

    // Confirm step ပြ
    showConfirm({ ...orderData, date: dateStr });
    showStep(3);

  } catch (err) {
    console.error('Order error:', err);
    showToast('⚠ Order တင်ရာမှာ ပြဿနာ ရှိသည်');
    if (btn) { btn.disabled = false; btn.textContent = 'PLACE ORDER →'; }
  }
};

function showConfirm(order) {
  const payLabels = { cod:'Cash on Delivery', kbzpay:'KBZPay', wavepay:'WavePay' };
  const el = document.getElementById('confirmDetails');
  if (!el) return;
  el.innerHTML = `
    <div class="confirm-row"><span>Order ID</span><span class="confirm-val">${order.orderId}</span></div>
    <div class="confirm-row"><span>Name</span><span class="confirm-val">${order.name}</span></div>
    <div class="confirm-row"><span>Phone</span><span class="confirm-val">${order.phone}</span></div>
    <div class="confirm-row"><span>City</span><span class="confirm-val">${order.city}</span></div>
    <div class="confirm-row"><span>Payment</span><span class="confirm-val">${payLabels[order.payment] || order.payment}</span></div>
    <div class="confirm-row"><span>Total</span><span class="confirm-val" style="color:var(--purple);font-family:var(--font-display);">${order.total.toLocaleString()} MMK</span></div>
    <div class="confirm-row"><span>Status</span><span class="order-status status-pending">PENDING</span></div>
  `;
  const msgEl = document.getElementById('confirmMessage');
  if (msgEl) msgEl.textContent = 'မှာယူမှု အောင်မြင်ပါသည်။ မကြာမီ ဆက်သွယ်ပေးပါမည်။ ကျေးဇူးတင်ပါသည်! 🙏';
}

// ── HELPERS ──
function updateCartCount() {
  const c = JSON.parse(localStorage.getItem('vz_cart') || '[]');
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = c.length);
}

function showToast(msg) {
  const t = document.getElementById('toast'); if (!t) return;
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

function toggleMenu() { document.getElementById('mobileMenu')?.classList.toggle('open'); }
window.toggleMenu = toggleMenu;

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  updateCartCount();
  showStep(1);
  selectPayment('cod');
});
