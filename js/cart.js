// =============================================
// VIBEZEE — Cart JS
// =============================================

// ── PRODUCT DATA (same as shop.js) ──
const ALL_PRODUCTS = [
  { id: 101, name: 'Creative Sound Blaster X3', cat: 'sound-cards', icon: '🔊', price: 85000 },
  { id: 102, name: 'ASUS Xonar SE Sound Card', cat: 'sound-cards', icon: '🔊', price: 65000 },
  { id: 103, name: 'StarTech 7.1 USB Audio Card', cat: 'sound-cards', icon: '🔊', price: 28000 },
  { id: 201, name: 'HyperX QuadCast USB Mic', cat: 'microphones', icon: '🎙', price: 120000 },
  { id: 202, name: 'Blue Snowball iCE Condenser', cat: 'microphones', icon: '🎙', price: 55000 },
  { id: 203, name: 'Fifine K678 USB Microphone', cat: 'microphones', icon: '🎙', price: 32000 },
  { id: 204, name: 'BOYA BY-PM500 Studio Mic', cat: 'microphones', icon: '🎙', price: 48000 },
  { id: 301, name: 'JBL Quantum 50 Gaming Earbuds', cat: 'earphones', icon: '🎧', price: 35000 },
  { id: 302, name: 'Razer Hammerhead V2', cat: 'earphones', icon: '🎧', price: 45000 },
  { id: 303, name: 'SteelSeries Tusq Earbuds', cat: 'earphones', icon: '🎧', price: 28000 },
  { id: 304, name: 'Samsung AKG Wired Earphones', cat: 'earphones', icon: '🎧', price: 18000 },
  { id: 401, name: 'Redragon K552 Mechanical TKL', cat: 'keyboards', icon: '⌨️', price: 55000 },
  { id: 402, name: 'Havit HV-KB395L RGB Keyboard', cat: 'keyboards', icon: '⌨️', price: 38000 },
  { id: 403, name: 'MechStrike Pro Full-Size RGB', cat: 'keyboards', icon: '⌨️', price: 85000 },
  { id: 404, name: 'Tecware Phantom TKL Mech', cat: 'keyboards', icon: '⌨️', price: 65000 },
  { id: 501, name: 'Logitech G302 Gaming Mouse', cat: 'mouse', icon: '🖱', price: 45000 },
  { id: 502, name: 'Razer DeathAdder V3', cat: 'mouse', icon: '🖱', price: 95000 },
  { id: 503, name: 'Redragon M711 Cobra Mouse', cat: 'mouse', icon: '🖱', price: 25000 },
  { id: 504, name: 'Havit MS1016 RGB Gaming Mouse', cat: 'mouse', icon: '🖱', price: 20000 },
  { id: 601, name: 'Xbox Wireless Controller', cat: 'joysticks', icon: '🕹', price: 85000 },
  { id: 602, name: 'PS5 DualSense Controller', cat: 'joysticks', icon: '🕹', price: 115000 },
  { id: 603, name: 'Logitech F310 Gamepad', cat: 'joysticks', icon: '🕹', price: 38000 },
  { id: 701, name: 'SanDisk Ultra 64GB USB 3.0', cat: 'memory', icon: '💾', price: 18000 },
  { id: 702, name: 'Kingston DataTraveler 128GB', cat: 'memory', icon: '💾', price: 28000 },
  { id: 703, name: 'Samsung BAR Plus 32GB', cat: 'memory', icon: '💾', price: 12000 },
  { id: 704, name: 'Toshiba TransMemory 256GB', cat: 'memory', icon: '💾', price: 45000 },
  { id: 801, name: 'Seagate Barracuda 1TB HDD', cat: 'harddisk', icon: '🗄', price: 55000 },
  { id: 802, name: 'WD Blue 2TB Internal HDD', cat: 'harddisk', icon: '🗄', price: 85000 },
  { id: 803, name: 'Samsung 870 EVO 500GB SSD', cat: 'harddisk', icon: '🗄', price: 95000 },
  { id: 804, name: 'Kingston A400 240GB SSD', cat: 'harddisk', icon: '🗄', price: 48000 },
  { id: 805, name: 'Toshiba Canvio 1TB Portable', cat: 'harddisk', icon: '🗄', price: 68000 },
  { id: 901, name: 'Anker 100W USB-C Charging Cable', cat: 'usbc', icon: '🔌', price: 18000 },
  { id: 902, name: 'Baseus 7-in-1 USB-C Hub', cat: 'usbc', icon: '🔌', price: 45000 },
  { id: 903, name: 'Ugreen USB-C to HDMI Adapter', cat: 'usbc', icon: '🔌', price: 22000 },
  { id: 904, name: 'Aukey 5-Port USB-C Hub', cat: 'usbc', icon: '🔌', price: 35000 },
];

const CAT_LABELS = {
  'sound-cards': 'Sound Cards', 'microphones': 'Microphones', 'earphones': 'Earphones',
  'keyboards': 'Keyboards', 'mouse': 'Mouse', 'joysticks': 'Joysticks',
  'memory': 'Memory Sticks', 'harddisk': 'Hard Disks', 'usbc': 'USB Type-C',
};

// ── CART STATE ──
let cartItems = []; // [{id, qty}]

function loadCart() {
  const raw = localStorage.getItem('vz_cart');
  if (!raw) return;
  const ids = JSON.parse(raw); // array of ids (may repeat)
  const map = {};
  ids.forEach(id => { map[id] = (map[id] || 0) + 1; });
  cartItems = Object.entries(map).map(([id, qty]) => ({ id: parseInt(id), qty }));
}

function saveCart() {
  const ids = [];
  cartItems.forEach(item => {
    for (let i = 0; i < item.qty; i++) ids.push(item.id);
  });
  localStorage.setItem('vz_cart', JSON.stringify(ids));
  updateCartCount();
}

function getProduct(id) {
  return ALL_PRODUCTS.find(p => p.id === id);
}

function getTotal() {
  return cartItems.reduce((sum, item) => {
    const p = getProduct(item.id);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);
}

// ── RENDER CART ──
function renderCart() {
  const container = document.getElementById('cartItems');
  const empty = document.getElementById('cartEmpty');
  const summary = document.getElementById('orderSummary');
  const itemCount = document.getElementById('itemCount');

  if (!container) return;

  const totalItems = cartItems.reduce((s, i) => s + i.qty, 0);
  if (itemCount) itemCount.textContent = `(${totalItems})`;

  if (cartItems.length === 0) {
    container.innerHTML = '';
    if (empty) empty.style.display = 'block';
    if (summary) summary.style.display = 'none';
    return;
  }
  if (empty) empty.style.display = 'none';
  if (summary) summary.style.display = 'block';

  container.innerHTML = cartItems.map((item, idx) => {
    const p = getProduct(item.id);
    if (!p) return '';
    return `
      <div class="cart-item" style="animation-delay:${idx * 0.08}s">
        <div class="cart-item-img">${p.icon}</div>
        <div class="cart-item-info">
          <span class="cart-item-cat">${CAT_LABELS[p.cat] || p.cat}</span>
          <div class="cart-item-name">${p.name}</div>
          <div class="cart-item-price">${(p.price * item.qty).toLocaleString()} MMK</div>
        </div>
        <div class="cart-item-controls">
          <div class="qty-wrap">
            <button class="qty-btn" onclick="changeQty(${p.id}, -1)">−</button>
            <div class="qty-num">${item.qty}</div>
            <button class="qty-btn" onclick="changeQty(${p.id}, 1)">+</button>
          </div>
          <button class="btn-remove" onclick="removeItem(${p.id})">✕ REMOVE</button>
        </div>
      </div>
    `;
  }).join('');

  renderSummary();
}

function renderSummary() {
  const total = getTotal();
  const sub = document.getElementById('subtotal');
  const tot = document.getElementById('totalPrice');
  const delivery = document.getElementById('deliveryFee');
  if (sub) sub.textContent = total.toLocaleString() + ' MMK';
  if (tot) tot.textContent = total.toLocaleString() + ' MMK';
  if (delivery) delivery.textContent = total >= 50000 ? 'Free' : '3,000 MMK';
}

// ── CART ACTIONS ──
function changeQty(id, delta) {
  const item = cartItems.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cartItems = cartItems.filter(i => i.id !== id);
  }
  saveCart();
  renderCart();
}

function removeItem(id) {
  cartItems = cartItems.filter(i => i.id !== id);
  saveCart();
  renderCart();
  showToast('✕ Item removed');
}

function clearCart() {
  if (cartItems.length === 0) return;
  cartItems = [];
  saveCart();
  renderCart();
  showToast('Cart cleared');
}

// ── STEP NAVIGATION ──
function goToCheckout() {
  if (cartItems.length === 0) return;

  // Update steps
  setStep(2);

  // Render mini order
  renderMiniOrder();

  // Payment reminder
  const method = document.querySelector('input[name="payment"]:checked')?.value || 'cod';
  renderPaymentReminder(method);
}

function backToCart() {
  setStep(1);
}

function setStep(num) {
  document.getElementById('step-cart').style.display = num === 1 ? 'block' : 'none';
  document.getElementById('step-checkout').style.display = num === 2 ? 'block' : 'none';
  document.getElementById('step-confirm').style.display = num === 3 ? 'block' : 'none';

  document.querySelectorAll('.step').forEach((el, i) => {
    el.classList.remove('active', 'done');
    if (i + 1 === num) el.classList.add('active');
    else if (i + 1 < num) el.classList.add('done');
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderMiniOrder() {
  const container = document.getElementById('miniOrderList');
  const tot2 = document.getElementById('totalPrice2');
  if (!container) return;

  container.innerHTML = cartItems.map(item => {
    const p = getProduct(item.id);
    if (!p) return '';
    return `
      <div class="mini-item">
        <div class="mini-item-icon">${p.icon}</div>
        <div class="mini-item-name">${p.name}</div>
        <div class="mini-item-qty">×${item.qty}</div>
        <div class="mini-item-price">${(p.price * item.qty).toLocaleString()} MMK</div>
      </div>
    `;
  }).join('');

  if (tot2) tot2.textContent = getTotal().toLocaleString() + ' MMK';
}

function renderPaymentReminder(method) {
  const el = document.getElementById('paymentReminder');
  if (!el) return;
  const msgs = {
    cod: { title: '🚚 Cash on Delivery', body: 'Order confirm ဖြစ်ပြီးနောက် delivery မှာ ငွေပေးရမည်ဖြစ်ပါသည်။' },
    kbzpay: { title: '📱 KBZPay Transfer', body: '<strong>09xxxxxxxx</strong> သို့ total amount လွှဲပြောင်းပြီး screenshot ကို Telegram ပေးပို့ပါ။' },
    wavepay: { title: '💜 WavePay Transfer', body: '<strong>09xxxxxxxx</strong> သို့ total amount လွှဲပြောင်းပြီး screenshot ကို Telegram ပေးပို့ပါ။' },
  };
  const m = msgs[method] || msgs.cod;
  el.innerHTML = `<h4>${m.title}</h4><p>${m.body}</p>`;
}

// ── PLACE ORDER ──
function placeOrder() {
  const name = document.getElementById('fname')?.value.trim();
  const phone = document.getElementById('fphone')?.value.trim();
  const address = document.getElementById('faddress')?.value.trim();
  const city = document.getElementById('fcity')?.value;

  if (!name || !phone || !address || !city) {
    showToast('⚠ Please fill all required fields');
    return;
  }

  const method = document.querySelector('input[name="payment"]:checked')?.value || 'cod';
  const orderId = '#VZ-' + Date.now().toString().slice(-6);
  const total = getTotal();

  // Build order object
  const order = {
    id: orderId,
    name, phone, address, city,
    payment: method,
    items: cartItems.map(item => {
      const p = getProduct(item.id);
      return { name: p?.name, qty: item.qty, price: p?.price, total: (p?.price || 0) * item.qty };
    }),
    total,
    date: new Date().toLocaleString('en-GB'),
  };

  // Save order locally
  const orders = JSON.parse(localStorage.getItem('vz_orders') || '[]');
  orders.push(order);
  localStorage.setItem('vz_orders', JSON.stringify(orders));

  // Send to backend (Telegram notification)
  sendOrderToBackend(order);

  // Show confirm
  showConfirm(order);

  // Clear cart
  cartItems = [];
  saveCart();
}

async function sendOrderToBackend(order) {
  try {
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
  } catch (e) {
    console.log('Backend not connected yet:', e.message);
  }
}

function showConfirm(order) {
  setStep(3);

  const idEl = document.getElementById('confirmOrderId');
  if (idEl) idEl.textContent = order.id;

  const details = document.getElementById('confirmDetails');
  if (!details) return;

  const payLabels = { cod: 'Cash on Delivery', kbzpay: 'KBZPay', wavepay: 'WavePay' };

  details.innerHTML = `
    <div class="confirm-row"><span>Name</span><span>${order.name}</span></div>
    <div class="confirm-row"><span>Phone</span><span>${order.phone}</span></div>
    <div class="confirm-row"><span>City</span><span>${order.city}</span></div>
    <div class="confirm-row"><span>Payment</span><span>${payLabels[order.payment] || order.payment}</span></div>
    <div class="confirm-row"><span>Items</span><span>${order.items.length} item(s)</span></div>
    <div class="confirm-row"><span>Total</span><span style="color:var(--cyan)">${order.total.toLocaleString()} MMK</span></div>
    <div class="confirm-row"><span>Date</span><span>${order.date}</span></div>
  `;
}

// ── TOAST ──
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg || '✓ Done!';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ── MOBILE MENU ──
function toggleMenu() {
  document.getElementById('mobileMenu')?.classList.toggle('open');
}

// ── PAYMENT METHOD CHANGE ──
function initPaymentListeners() {
  document.querySelectorAll('input[name="payment"]').forEach(radio => {
    radio.addEventListener('change', () => {
      renderPaymentReminder(radio.value);
    });
  });
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  renderCart();
  initPaymentListeners();
});
