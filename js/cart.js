// =============================================
// VIBEZEE — Cart JS (Firebase + Delivery Zones)
// =============================================

import { db } from './firebase.js';
import {
  collection, addDoc, serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ── PRODUCTS ──
const PRODUCTS = {
  1: { name:'ProSound X1 Gaming Earphones', price:25000, icon:'🎧' },
  2: { name:'MechStrike TKL Keyboard',       price:85000, icon:'⌨️' },
  3: { name:'VortexClick Pro Gaming Mouse',  price:45000, icon:'🖱' },
  4: { name:'ClearVoice USB Condenser Mic',  price:55000, icon:'🎙' },
};

// ── DELIVERY ZONES ──
const DELIVERY_ZONES = {
  zone1: {
    label: 'Zone 1 — Downtown Yangon',
    fee: 3000,
    townships: [
      'Pabedan', 'Kyauktada', 'Lanmadaw', 'Latha',
      'Botahtaung', 'Mingala Taungnyunt', 'Seikkan',
    ],
  },
  zone2: {
    label: 'Zone 2 — Inner Yangon',
    fee: 4000,
    townships: [
      'Kamaryut', 'Sanchaung', 'Bahan', 'Tamwe',
      'Thingangyun', 'Yankin', 'Pazundaung', 'Dawbon',
    ],
  },
  zone3: {
    label: 'Zone 3 — Mid Yangon',
    fee: 5000,
    townships: [
      'North Okkalapa', 'South Okkalapa', 'Thaketa',
      'Dagon', 'North Dagon', 'South Dagon', 'East Dagon',
      'Dagon Seikkan', 'Ahlon', 'Insein',
    ],
  },
  zone4: {
    label: 'Zone 4 — Outer Yangon',
    fee: 6000,
    townships: [
      'Hlaingthaya', 'Shwepyithar', 'Mingaladon',
      'Hlegu', 'Hmawbi', 'Htantabin',
      'North Dagon Industrial', 'Dala', 'Seikgyikanaungto',
    ],
  },
  zone5: {
    label: 'Zone 5 — Greater Yangon & Suburbs',
    fee: 8000,
    townships: [
      'Thanlyin', 'Kyauktan', 'Kawhmu', 'Kayan',
      'Twantay', 'Cocokyun', 'Kungyangon',
    ],
  },
  zone6: {
    label: 'Zone 6 — Outside Yangon (တစ်ပြည်လုံး)',
    fee: 10000,
    townships: [
      'Mandalay', 'Naypyidaw', 'Bago', 'Mawlamyine',
      'Pathein', 'Monywa', 'Meiktila', 'Taunggyi',
      'Pyay', 'Myeik', 'Dawei', 'Kalay',
      'Loikaw', 'Hakha', 'Sittwe', 'Myitkyina',
      'တခြားမြို့နယ်များ',
    ],
  },
};

// ── BUILD TOWNSHIP → ZONE MAP ──
const TOWNSHIP_ZONE = {};
Object.entries(DELIVERY_ZONES).forEach(([zoneKey, zoneData]) => {
  zoneData.townships.forEach(t => { TOWNSHIP_ZONE[t] = zoneKey; });
});

// ── CART STATE ──
let cart = JSON.parse(localStorage.getItem('vz_cart') || '[]');
let currentStep    = 1;
let selectedPayment = 'cod';
let selectedTownship = '';
let deliveryFee    = 0;

function saveCart() { localStorage.setItem('vz_cart', JSON.stringify(cart)); updateCartCount(); }

function getCartItems() {
  const counts = {};
  cart.forEach(id => counts[id] = (counts[id] || 0) + 1);
  return Object.entries(counts).map(([id, qty]) => ({
    id: Number(id), qty,
    ...(PRODUCTS[id] || { name: 'Product #' + id, price: 0, icon: '📦' }),
  }));
}

function getSubtotal() { return getCartItems().reduce((s, i) => s + i.price * i.qty, 0); }

function calcDeliveryFee(township) {
  const zoneKey = TOWNSHIP_ZONE[township];
  return zoneKey ? DELIVERY_ZONES[zoneKey].fee : 0;
}

// ── RENDER CART ──
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
  const subtotal = getSubtotal();
  const total    = subtotal + deliveryFee;
  const setText  = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  setText('subtotalAmt',  subtotal.toLocaleString()   + ' MMK');
  setText('deliveryAmt',  deliveryFee === 0 ? 'မြို့နယ် ရွေးပါ' : deliveryFee.toLocaleString() + ' MMK');
  setText('totalAmt',     total.toLocaleString()      + ' MMK');
  setText('summaryTotal', total.toLocaleString()      + ' MMK');
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

// ── TOWNSHIP DROPDOWN ──
function buildTownshipDropdown() {
  const select = document.getElementById('checkTownship');
  if (!select) return;

  select.innerHTML = '<option value="">-- မြို့နယ် ရွေးပါ --</option>';

  Object.entries(DELIVERY_ZONES).forEach(([zoneKey, zoneData]) => {
    const group = document.createElement('optgroup');
    group.label = `${zoneData.label} — ${zoneData.fee.toLocaleString()} MMK`;
    zoneData.townships.forEach(t => {
      const opt   = document.createElement('option');
      opt.value   = t;
      opt.textContent = t;
      group.appendChild(opt);
    });
    select.appendChild(group);
  });

  select.addEventListener('change', () => {
    selectedTownship = select.value;
    deliveryFee      = calcDeliveryFee(selectedTownship);
    renderSummary();

    // Zone label ပြ
    const zoneKey  = TOWNSHIP_ZONE[selectedTownship];
    const zoneInfo = document.getElementById('zoneInfo');
    if (zoneInfo && zoneKey) {
      const z = DELIVERY_ZONES[zoneKey];
      zoneInfo.textContent = `📍 ${z.label} — Delivery: ${z.fee.toLocaleString()} MMK`;
      zoneInfo.style.display = 'block';
    } else if (zoneInfo) {
      zoneInfo.style.display = 'none';
    }
  });
}

// ── PAYMENT ──
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
  const name     = document.getElementById('checkName')?.value.trim();
  const phone    = document.getElementById('checkPhone')?.value.trim();
  const address  = document.getElementById('checkAddress')?.value.trim();
  const note     = document.getElementById('checkNote')?.value.trim();

  if (!name || !phone || !address) {
    showToast('⚠ နာမည်၊ ဖုန်းနံပါတ်၊ လိပ်စာ ဖြည့်ပါ'); return;
  }
  if (!selectedTownship) {
    showToast('⚠ မြို့နယ် ရွေးပါ'); return;
  }

  const btn = document.getElementById('btnPlaceOrder');
  if (btn) { btn.disabled = true; btn.textContent = 'PLACING ORDER...'; }

  const items    = getCartItems();
  const subtotal = getSubtotal();
  const total    = subtotal + deliveryFee;
  const orderId  = '#VZ-' + Date.now().toString().slice(-6);
  const zoneKey  = TOWNSHIP_ZONE[selectedTownship];
  const zoneLabel = zoneKey ? DELIVERY_ZONES[zoneKey].label : '';

  const orderData = {
    orderId,
    name, phone, address,
    township:    selectedTownship,
    zone:        zoneLabel,
    note:        note || '',
    payment:     selectedPayment,
    items:       items.map(i => ({ name: i.name, icon: i.icon, qty: i.qty, price: i.price, total: i.price * i.qty })),
    subtotal,
    deliveryFee,
    total,
    status:      'pending',
    createdAt:   serverTimestamp(),
    date:        new Date().toLocaleString('en-GB', { timeZone: 'Asia/Yangon' }),
  };

  try {
    await addDoc(collection(db, 'orders'), orderData);

    const saved = JSON.parse(localStorage.getItem('vz_orders') || '[]');
    saved.push({ ...orderData, createdAt: orderData.date });
    localStorage.setItem('vz_orders', JSON.stringify(saved));

    cart = []; saveCart();
    showConfirm(orderData);
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
    <div class="confirm-row"><span>Township</span><span class="confirm-val">${order.township}</span></div>
    <div class="confirm-row"><span>Zone</span><span class="confirm-val">${order.zone}</span></div>
    <div class="confirm-row"><span>Payment</span><span class="confirm-val">${payLabels[order.payment] || order.payment}</span></div>
    <div class="confirm-row"><span>Subtotal</span><span class="confirm-val">${order.subtotal.toLocaleString()} MMK</span></div>
    <div class="confirm-row"><span>Delivery</span><span class="confirm-val">${order.deliveryFee.toLocaleString()} MMK</span></div>
    <div class="confirm-row"><span>Total</span><span class="confirm-val" style="color:var(--purple);font-family:var(--font-display);font-weight:700;">${order.total.toLocaleString()} MMK</span></div>
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
  buildTownshipDropdown();
  showStep(1);
  selectPayment('cod');
});
