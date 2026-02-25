// =============================================
// VIBEZEE — Cart JS (Fixed & Final)
// =============================================

// ── TELEGRAM CONFIG ── (ဒီမှာ သင့် Bot Token နဲ့ Chat ID ထည့်ပါ)
const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE';
const TELEGRAM_CHAT_ID   = 'YOUR_GROUP_ID_HERE';

// ── PRODUCTS ──
const PRODUCTS = {
  101: { name:'Creative Sound Blaster X3',       price:85000,  icon:'🔊' },
  102: { name:'ASUS Xonar SE Sound Card',         price:65000,  icon:'🔊' },
  103: { name:'StarTech 7.1 USB Audio Card',      price:28000,  icon:'🔊' },
  201: { name:'HyperX QuadCast USB Mic',          price:120000, icon:'🎙' },
  202: { name:'Blue Snowball iCE Condenser',      price:55000,  icon:'🎙' },
  203: { name:'Fifine K678 USB Microphone',       price:32000,  icon:'🎙' },
  204: { name:'BOYA BY-PM500 Studio Mic',         price:48000,  icon:'🎙' },
  301: { name:'JBL Quantum 50 Gaming Earbuds',    price:35000,  icon:'🎧' },
  302: { name:'Razer Hammerhead V2',              price:45000,  icon:'🎧' },
  303: { name:'SteelSeries Tusq Earbuds',         price:28000,  icon:'🎧' },
  304: { name:'Samsung AKG Wired Earphones',      price:18000,  icon:'🎧' },
  401: { name:'Redragon K552 Mechanical TKL',     price:55000,  icon:'⌨️' },
  402: { name:'Havit HV-KB395L RGB Keyboard',     price:38000,  icon:'⌨️' },
  403: { name:'MechStrike Pro Full-Size RGB',     price:85000,  icon:'⌨️' },
  404: { name:'Tecware Phantom TKL Mech',         price:65000,  icon:'⌨️' },
  501: { name:'Logitech G302 Gaming Mouse',       price:45000,  icon:'🖱' },
  502: { name:'Razer DeathAdder V3',              price:95000,  icon:'🖱' },
  503: { name:'Redragon M711 Cobra Mouse',        price:25000,  icon:'🖱' },
  504: { name:'Havit MS1016 RGB Gaming Mouse',    price:20000,  icon:'🖱' },
  601: { name:'Xbox Wireless Controller',         price:85000,  icon:'🕹' },
  602: { name:'PS5 DualSense Controller',         price:115000, icon:'🕹' },
  603: { name:'Logitech F310 Gamepad',            price:38000,  icon:'🕹' },
  701: { name:'SanDisk Ultra 64GB USB 3.0',       price:18000,  icon:'💾' },
  702: { name:'Kingston DataTraveler 128GB',      price:28000,  icon:'💾' },
  703: { name:'Samsung BAR Plus 32GB',            price:12000,  icon:'💾' },
  704: { name:'Toshiba TransMemory 256GB',        price:45000,  icon:'💾' },
  801: { name:'Seagate Barracuda 1TB HDD',        price:55000,  icon:'🗄' },
  802: { name:'WD Blue 2TB Internal HDD',         price:85000,  icon:'🗄' },
  803: { name:'Samsung 870 EVO 500GB SSD',        price:95000,  icon:'🗄' },
  804: { name:'Kingston A400 240GB SSD',          price:48000,  icon:'🗄' },
  805: { name:'Toshiba Canvio 1TB Portable',      price:68000,  icon:'🗄' },
  901: { name:'Anker 100W USB-C Charging Cable',  price:18000,  icon:'🔌' },
  902: { name:'Baseus 7-in-1 USB-C Hub',          price:45000,  icon:'🔌' },
  903: { name:'Ugreen USB-C to HDMI Adapter',     price:22000,  icon:'🔌' },
  904: { name:'Aukey 5-Port USB-C Hub',           price:35000,  icon:'🔌' },
};

// ── DELIVERY ZONES ──
const DELIVERY_ZONES = {
  zone1: { label: 'Zone 1 — Downtown Yangon', fee: 3000, townships: ['Pabedan','Kyauktada','Lanmadaw','Latha','Botahtaung','Mingala Taungnyunt','Seikkan'] },
  zone2: { label: 'Zone 2 — Inner Yangon', fee: 4000, townships: ['Kamaryut','Sanchaung','Bahan','Tamwe','Thingangyun','Yankin','Pazundaung','Dawbon'] },
  zone3: { label: 'Zone 3 — Mid Yangon', fee: 5000, townships: ['North Okkalapa','South Okkalapa','Thaketa','Dagon','North Dagon','South Dagon','East Dagon','Dagon Seikkan','Ahlon','Insein'] },
  zone4: { label: 'Zone 4 — Outer Yangon', fee: 6000, townships: ['Hlaingthaya','Shwepyithar','Mingaladon','Hlegu','Hmawbi','Htantabin','Dala','Seikgyikanaungto'] },
  zone5: { label: 'Zone 5 — Greater Yangon', fee: 8000, townships: ['Thanlyin','Kyauktan','Kawhmu','Kayan','Twantay','Cocokyun','Kungyangon'] },
  zone6: { label: 'Zone 6 — Outside Yangon', fee: 10000, townships: ['Mandalay','Naypyidaw','Bago','Mawlamyine','Pathein','Monywa','Meiktila','Taunggyi','Pyay','Myeik','Dawei','Kalay','Loikaw','Hakha','Sittwe','Myitkyina','တခြားမြို့နယ်များ'] },
};

const TOWNSHIP_ZONE = {};
Object.entries(DELIVERY_ZONES).forEach(([key, z]) => {
  z.townships.forEach(t => { TOWNSHIP_ZONE[t] = key; });
});

// ── STATE ──
// အရေးကြီးသည်: cart ကို let နဲ့ ကြေညာရပါမယ်
let cart = JSON.parse(localStorage.getItem('vz_cart') || '[]').map(Number);
let currentStep     = 1;
let selectedPayment = 'cod';
let selectedTownship = '';
let deliveryFee     = 0;

function saveCart() {
  localStorage.setItem('vz_cart', JSON.stringify(cart));
  updateCartCount();
}

function getCartItems() {
  const counts = {};
  cart.forEach(id => counts[id] = (counts[id] || 0) + 1);
  return Object.entries(counts).map(([id, qty]) => ({
    id: Number(id), qty,
    ...(PRODUCTS[id] || { name:'Product #'+id, price:0, icon:'📦' }),
  }));
}

function getSubtotal() {
  return getCartItems().reduce((s, i) => s + i.price * i.qty, 0);
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
    if (count) count.textContent = '(0)';
    renderSummary();
    return;
  }

  if (empty) empty.style.display = 'none';
  if (count) count.textContent = `(${items.length})`;

  wrap.innerHTML = items.map(item => `
    <div class="cart-item">
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
  const s = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  
  s('subtotalAmt',  subtotal.toLocaleString() + ' MMK');
  s('deliveryAmt',  selectedTownship ? deliveryFee.toLocaleString() + ' MMK' : 'မြို့နယ် ရွေးပါ');
  s('totalAmt',     total.toLocaleString() + ' MMK');
  s('summaryTotal', total.toLocaleString() + ' MMK');
}

function changeQty(id, delta) {
  if (delta > 0) {
    cart.push(id);
  } else {
    const idx = cart.lastIndexOf(id);
    if (idx > -1) cart.splice(idx, 1);
  }
  saveCart(); renderCart();
}

function removeItem(id) {
  cart = cart.filter(i => i !== id);
  saveCart(); renderCart();
}

function clearCart() {
  if (!confirm('Cart ကို အကုန် ဖျက်မှာ သေချာပါသလား?')) return;
  cart = []; saveCart(); renderCart();
}

// ── TOWNSHIP DROPDOWN ──
function buildTownshipDropdown() {
  const select = document.getElementById('checkTownship');
  if (!select) return;

  select.innerHTML = '<option value="">-- မြို့နယ် ရွေးပါ --</option>';
  Object.entries(DELIVERY_ZONES).forEach(([key, z]) => {
    const group = document.createElement('optgroup');
    group.label = z.label + ' — ' + z.fee.toLocaleString() + ' MMK';
    z.townships.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t;
      opt.textContent = t;
      group.appendChild(opt);
    });
    select.appendChild(group);
  });

  select.addEventListener('change', function() {
    selectedTownship = this.value;
    const zoneKey = TOWNSHIP_ZONE[selectedTownship];
    deliveryFee = zoneKey ? DELIVERY_ZONES[zoneKey].fee : 0;
    renderSummary();

    const zoneInfo = document.getElementById('zoneInfo');
    if (zoneInfo && zoneKey) {
      zoneInfo.textContent = '📍 ' + DELIVERY_ZONES[zoneKey].label + ' — ' + deliveryFee.toLocaleString() + ' MMK';
      zoneInfo.style.display = 'block';
    } else if (zoneInfo) {
      zoneInfo.style.display = 'none';
    }
  });
}

// ── PAYMENT ──
function selectPayment(method) {
  selectedPayment = method;
  document.querySelectorAll('.payment-card').forEach(c => c.classList.remove('active'));
  const el = document.querySelector(`[data-payment="${method}"]`);
  if (el) el.classList.add('active');
}

// ── STEPS ──
function goToCheckout() {
  if (cart.length === 0) { showToast('⚠ Cart ထဲ ပစ္စည်း မရှိဘူး'); return; }
  showStep(2);
}

function goBackToCart() { showStep(1); }

function showStep(n) {
  currentStep = n;
  document.querySelectorAll('.checkout-step').forEach((s, i) => {
    s.style.display = (i + 1 === n) ? 'block' : 'none';
  });
  // Indicators
  const indicators = ['step-1-indicator', 'step-2-indicator', 'step-3-indicator'];
  indicators.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.toggle('active', i + 1 === n);
      el.classList.toggle('completed', i + 1 < n);
    }
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── PLACE ORDER ──
async function placeOrder() {
  const name    = document.getElementById('checkName')?.value.trim();
  const phone   = document.getElementById('checkPhone')?.value.trim();
  const address = document.getElementById('checkAddress')?.value.trim();
  const note    = document.getElementById('checkNote')?.value.trim();

  if (!name || !phone || !address) { showToast('⚠ နာမည်၊ ဖုန်းနံပါတ်၊ လိပ်စာ ဖြည့်ပါ'); return; }
  if (!selectedTownship)           { showToast('⚠ မြို့နယ် ရွေးပါ'); return; }

  const btn = document.getElementById('btnPlaceOrder');
  if (btn) { btn.disabled = true; btn.textContent = 'PLACING ORDER...'; }

  const items    = getCartItems();
  const subtotal = getSubtotal();
  const total    = subtotal + deliveryFee;
  const orderId  = '#VZ-' + Math.floor(100000 + Math.random() * 900000);
  const zoneKey  = TOWNSHIP_ZONE[selectedTownship];
  const date     = new Date().toLocaleString();

  const orderData = {
    orderId, name, phone, address,
    township:    selectedTownship,
    zone:        zoneKey ? DELIVERY_ZONES[zoneKey].label : '',
    note:        note || '',
    payment:     selectedPayment,
    items:       items.map(i => ({ name:i.name, icon:i.icon, qty:i.qty, price:i.price, total:i.price*i.qty })),
    subtotal, deliveryFee, total,
    status:      'pending',
    date,
  };

  try {
    const db = firebase.firestore();
    await db.collection('orders').add({
      ...orderData,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    sendTelegramNotification(orderData);
    cart = []; saveCart();
    showConfirm(orderData);
    showStep(3);
  } catch (err) {
    console.error('Order error:', err);
    // Fallback: Telegram only if Firebase fails
    sendTelegramNotification(orderData);
    cart = []; saveCart();
    showConfirm(orderData);
    showStep(3);
  }
}

// ── TELEGRAM ──
async function sendTelegramNotification(order) {
  if (TELEGRAM_BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE') return;
  const payLabels = { cod:'Cash on Delivery 🚚', kbzpay:'KBZPay 📱', wavepay:'WavePay 💜' };
  const itemsList = order.items.map(i => ` • ${i.icon} ${i.name} x${i.qty}`).join('\n');
  const msg = `🛒 *NEW ORDER — VibeZee*\n━━━━━━━━━━━━━━━━━━━\n📦 Order ID: ${order.orderId}\n\n👤 *Customer*\n• ${order.name}\n• ${order.phone}\n• ${order.address}\n• ${order.township}\n\n🛍 *Items*\n${itemsList}\n\n💰 *Total: ${order.total.toLocaleString()} MMK*\n• Method: ${payLabels[order.payment] || order.payment}\n━━━━━━━━━━━━━━━━━━━`;
  
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: msg, parse_mode: 'Markdown' }),
    });
  } catch (e) { console.warn('Telegram failed:', e); }
}

// ── CONFIRM PAGE ──
function showConfirm(order) {
  const payLabels = { cod:'Cash on Delivery', kbzpay:'KBZPay', wavepay:'WavePay' };
  const el = document.getElementById('confirmDetails');
  if (!el) return;
  el.innerHTML = `
    <div style="display:flex; justify-content:space-between; margin-bottom:8px;"><span>Order ID:</span><strong>${order.orderId}</strong></div>
    <div style="display:flex; justify-content:space-between; margin-bottom:8px;"><span>Total:</span><strong>${order.total.toLocaleString()} MMK</strong></div>
    <div style="display:flex; justify-content:space-between; margin-bottom:8px;"><span>Payment:</span><strong>${payLabels[order.payment]||order.payment}</strong></div>
    <hr style="margin:10px 0; border:0; border-top:1px solid #eee;">
    <p style="font-size:0.9rem; color:#666;">ပို့ဆောင်မည့်လိပ်စာ: ${order.address}, ${order.township}</p>
  `;
}

// ── HELPERS ──
function updateCartCount() {
  const c = JSON.parse(localStorage.getItem('vz_cart') || '[]');
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = c.length);
}

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

function toggleMenu() {
  document.getElementById('mobileMenu')?.classList.toggle('open');
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', function() {
  renderCart();
  updateCartCount();
  buildTownshipDropdown();
  showStep(1);
});
