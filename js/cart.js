// =============================================
// VIBEZEE — Cart JS
// =============================================

// ── TELEGRAM CONFIG ──
const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE';  // ← ဒီနေရာ token ထည့်
const TELEGRAM_CHAT_ID   = 'YOUR_GROUP_ID_HERE';   // ← ဒီနေရာ group id ထည့်

// ── PRODUCTS ──
const PRODUCTS = {
  101:{ name:'Creative Sound Blaster X3',       price:85000,  icon:'🔊' },
  102:{ name:'ASUS Xonar SE Sound Card',         price:65000,  icon:'🔊' },
  103:{ name:'StarTech 7.1 USB Audio Card',      price:28000,  icon:'🔊' },
  201:{ name:'HyperX QuadCast USB Mic',          price:120000, icon:'🎙' },
  202:{ name:'Blue Snowball iCE Condenser',      price:55000,  icon:'🎙' },
  203:{ name:'Fifine K678 USB Microphone',       price:32000,  icon:'🎙' },
  204:{ name:'BOYA BY-PM500 Studio Mic',         price:48000,  icon:'🎙' },
  301:{ name:'JBL Quantum 50 Gaming Earbuds',    price:35000,  icon:'🎧' },
  302:{ name:'Razer Hammerhead V2',              price:45000,  icon:'🎧' },
  303:{ name:'SteelSeries Tusq Earbuds',         price:28000,  icon:'🎧' },
  304:{ name:'Samsung AKG Wired Earphones',      price:18000,  icon:'🎧' },
  401:{ name:'Redragon K552 Mechanical TKL',     price:55000,  icon:'⌨️' },
  402:{ name:'Havit HV-KB395L RGB Keyboard',     price:38000,  icon:'⌨️' },
  403:{ name:'MechStrike Pro Full-Size RGB',     price:85000,  icon:'⌨️' },
  404:{ name:'Tecware Phantom TKL Mech',         price:65000,  icon:'⌨️' },
  501:{ name:'Logitech G302 Gaming Mouse',       price:45000,  icon:'🖱' },
  502:{ name:'Razer DeathAdder V3',              price:95000,  icon:'🖱' },
  503:{ name:'Redragon M711 Cobra Mouse',        price:25000,  icon:'🖱' },
  504:{ name:'Havit MS1016 RGB Gaming Mouse',    price:20000,  icon:'🖱' },
  601:{ name:'Xbox Wireless Controller',         price:85000,  icon:'🕹' },
  602:{ name:'PS5 DualSense Controller',         price:115000, icon:'🕹' },
  603:{ name:'Logitech F310 Gamepad',            price:38000,  icon:'🕹' },
  701:{ name:'SanDisk Ultra 64GB USB 3.0',       price:18000,  icon:'💾' },
  702:{ name:'Kingston DataTraveler 128GB',      price:28000,  icon:'💾' },
  703:{ name:'Samsung BAR Plus 32GB',            price:12000,  icon:'💾' },
  704:{ name:'Toshiba TransMemory 256GB',        price:45000,  icon:'💾' },
  801:{ name:'Seagate Barracuda 1TB HDD',        price:55000,  icon:'🗄' },
  802:{ name:'WD Blue 2TB Internal HDD',         price:85000,  icon:'🗄' },
  803:{ name:'Samsung 870 EVO 500GB SSD',        price:95000,  icon:'🗄' },
  804:{ name:'Kingston A400 240GB SSD',          price:48000,  icon:'🗄' },
  805:{ name:'Toshiba Canvio 1TB Portable',      price:68000,  icon:'🗄' },
  901:{ name:'Anker 100W USB-C Charging Cable',  price:18000,  icon:'🔌' },
  902:{ name:'Baseus 7-in-1 USB-C Hub',          price:45000,  icon:'🔌' },
  903:{ name:'Ugreen USB-C to HDMI Adapter',     price:22000,  icon:'🔌' },
  904:{ name:'Aukey 5-Port USB-C Hub',           price:35000,  icon:'🔌' },
};

// ── DELIVERY ZONES ──
const DELIVERY_ZONES = {
  zone1:{ label:'Zone 1 — Downtown Yangon', fee:3000,
    townships:['Pabedan','Kyauktada','Lanmadaw','Latha','Botahtaung','Mingala Taungnyunt','Seikkan'] },
  zone2:{ label:'Zone 2 — Inner Yangon', fee:4000,
    townships:['Kamaryut','Sanchaung','Bahan','Tamwe','Thingangyun','Yankin','Pazundaung','Dawbon'] },
  zone3:{ label:'Zone 3 — Mid Yangon', fee:5000,
    townships:['North Okkalapa','South Okkalapa','Thaketa','Dagon','North Dagon','South Dagon','East Dagon','Dagon Seikkan','Ahlon','Insein'] },
  zone4:{ label:'Zone 4 — Outer Yangon', fee:6000,
    townships:['Hlaingthaya','Shwepyithar','Mingaladon','Hlegu','Hmawbi','Htantabin','Dala','Seikgyikanaungto'] },
  zone5:{ label:'Zone 5 — Greater Yangon', fee:8000,
    townships:['Thanlyin','Kyauktan','Kawhmu','Kayan','Twantay','Cocokyun','Kungyangon'] },
  zone6:{ label:'Zone 6 — Outside Yangon', fee:10000,
    townships:['Mandalay','Naypyidaw','Bago','Mawlamyine','Pathein','Monywa','Meiktila','Taunggyi','Pyay','Myeik','Dawei','Kalay','Loikaw','Hakha','Sittwe','Myitkyina','တခြားမြို့နယ်များ'] },
};

const TOWNSHIP_ZONE = {};
Object.entries(DELIVERY_ZONES).forEach(([k,z]) => z.townships.forEach(t => TOWNSHIP_ZONE[t] = k));

// ── STATE ──
let cart             = JSON.parse(localStorage.getItem('vz_cart') || '[]').map(Number);
let selectedPayment  = 'cod';
let selectedTownship = '';
let deliveryFee      = 0;

function saveCart() {
  localStorage.setItem('vz_cart', JSON.stringify(cart));
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = cart.length);
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
  return getCartItems().reduce((s,i) => s + i.price * i.qty, 0);
}

// ── RENDER CART ──
function renderCart() {
  const items   = getCartItems();
  const wrap    = document.getElementById('cartItems');
  const empty   = document.getElementById('cartEmpty');
  const counter = document.getElementById('cartItemCount');
  if (!wrap) return;

  if (items.length === 0) {
    wrap.innerHTML = '';
    if (empty)   { empty.classList.add('show'); }
    if (counter) counter.textContent = '0 items';
    renderSummary();
    return;
  }

  if (empty)   empty.classList.remove('show');
  if (counter) counter.textContent = items.length + (items.length > 1 ? ' items' : ' item');

  wrap.innerHTML = items.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">${item.icon}</div>
      <div class="cart-item-info">
        <h3 class="cart-item-name">${item.name}</h3>
        <div class="cart-item-price">${item.price.toLocaleString()} MMK</div>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
      </div>
      <button class="remove-btn" onclick="removeItem(${item.id})">✕</button>
    </div>
  `).join('');

  renderSummary();
}

function renderSummary() {
  const subtotal = getSubtotal();
  const total    = subtotal + deliveryFee;
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('subtotalAmt',   subtotal.toLocaleString()  + ' MMK');
  set('deliveryAmt',   deliveryFee === 0 ? (selectedTownship ? 'FREE' : '—') : deliveryFee.toLocaleString() + ' MMK');
  set('totalAmt',      total.toLocaleString()     + ' MMK');
  set('summaryTotal',  total.toLocaleString()     + ' MMK');
}

// ── QTY & REMOVE ──
function changeQty(id, delta) {
  if (delta > 0) {
    cart.push(id);
  } else {
    const idx = cart.lastIndexOf(id);
    if (idx > -1) cart.splice(idx, 1);
  }
  saveCart(); renderCart();
}
window.changeQty = changeQty;

function removeItem(id) {
  cart = cart.filter(i => i !== id);
  saveCart(); renderCart();
}
window.removeItem = removeItem;

function clearCart() {
  if (!confirm('Cart ကို အကုန် ဖျက်မှာ သေချာပါသလား?')) return;
  cart = []; saveCart(); renderCart();
}
window.clearCart = clearCart;

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
      opt.value = t; opt.textContent = t;
      group.appendChild(opt);
    });
    select.appendChild(group);
  });
  select.addEventListener('change', function() {
    selectedTownship = this.value;
    const zk = TOWNSHIP_ZONE[selectedTownship];
    deliveryFee = zk ? DELIVERY_ZONES[zk].fee : 0;
    renderSummary();
    const zi = document.getElementById('zoneInfo');
    if (zi && zk) {
      zi.textContent = '📍 ' + DELIVERY_ZONES[zk].label + ' — ' + deliveryFee.toLocaleString() + ' MMK';
      zi.style.display = 'block';
    }
  });
}

// ── PAYMENT ──
function selectPayment(method) {
  selectedPayment = method;
  document.querySelectorAll('.payment-card').forEach(c => c.classList.remove('active'));
  const el = document.querySelector('[data-payment="' + method + '"]');
  if (el) el.classList.add('active');
}
window.selectPayment = selectPayment;

// ── STEPS ──
function showStep(n) {
  document.querySelectorAll('.checkout-step').forEach((s, i) => {
    s.classList.toggle('active', i + 1 === n);
  });
  document.querySelectorAll('.step-item').forEach((s, i) => {
    s.classList.toggle('active',    i + 1 === n);
    s.classList.toggle('completed', i + 1 <  n);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToCheckout() {
  if (getCartItems().length === 0) { showToast('⚠ Cart ထဲ ပစ္စည်း မရှိဘူး'); return; }
  showStep(2);
}
window.goToCheckout = goToCheckout;

function goBackToCart() { showStep(1); }
window.goBackToCart = goBackToCart;

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
  const orderId  = '#VZ-' + Date.now().toString().slice(-6);
  const zk       = TOWNSHIP_ZONE[selectedTownship];
  const date     = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Yangon' });

  const orderData = {
    orderId, name, phone, address,
    township: selectedTownship,
    zone:     zk ? DELIVERY_ZONES[zk].label : '',
    note:     note || '',
    payment:  selectedPayment,
    items:    items.map(i => ({ name:i.name, icon:i.icon, qty:i.qty, price:i.price, total:i.price*i.qty })),
    subtotal, deliveryFee, total,
    status:   'pending',
    date,
  };

  try {
    // Firebase Firestore
    const db = firebase.firestore();
    await db.collection('orders').add({
      ...orderData,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  } catch(e) {
    console.warn('Firestore error:', e);
  }

  // localStorage backup
  const saved = JSON.parse(localStorage.getItem('vz_orders') || '[]');
  saved.push(orderData);
  localStorage.setItem('vz_orders', JSON.stringify(saved));

  // Telegram notify
  sendTelegram(orderData);

  cart = []; saveCart();
  showConfirm(orderData);
  showStep(3);
}
window.placeOrder = placeOrder;

// ── TELEGRAM ──
async function sendTelegram(order) {
  if (TELEGRAM_BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE') return;
  const pl = { cod:'Cash on Delivery 🚚', kbzpay:'KBZPay 📱', wavepay:'WavePay 💜' };
  const items = order.items.map(i => '  • ' + i.icon + ' ' + i.name + ' x' + i.qty + ' — ' + (i.price * i.qty).toLocaleString() + ' MMK').join('\n');
  const msg = [
    '🛒 *NEW ORDER — VibeZee*',
    '━━━━━━━━━━━━━━━━━━━',
    '📦 Order: `' + order.orderId + '`',
    '📅 ' + order.date,
    '',
    '👤 *Customer*',
    '• ' + order.name,
    '• ' + order.phone,
    '• ' + order.address,
    '• ' + order.township + ' (' + order.zone + ')',
    '',
    '🛍 *Items*',
    items,
    '',
    '💰 *Payment*',
    '• Subtotal: ' + order.subtotal.toLocaleString() + ' MMK',
    '• Delivery: ' + order.deliveryFee.toLocaleString() + ' MMK',
    '• *Total: ' + order.total.toLocaleString() + ' MMK*',
    '• ' + (pl[order.payment] || order.payment),
    order.note ? '\n📝 ' + order.note : '',
    '━━━━━━━━━━━━━━━━━━━',
    '✅ PENDING',
  ].join('\n');

  try {
    await fetch('https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: msg, parse_mode: 'Markdown' }),
    });
  } catch(e) { console.warn('Telegram failed:', e); }
}

// ── CONFIRM ──
function showConfirm(order) {
  const pl = { cod:'Cash on Delivery', kbzpay:'KBZPay', wavepay:'WavePay' };
  const el = document.getElementById('confirmDetails');
  if (!el) return;
  el.innerHTML = [
    ['Order ID', order.orderId],
    ['Name',     order.name],
    ['Phone',    order.phone],
    ['Township', order.township],
    ['Zone',     order.zone],
    ['Payment',  pl[order.payment] || order.payment],
    ['Subtotal', order.subtotal.toLocaleString() + ' MMK'],
    ['Delivery', order.deliveryFee.toLocaleString() + ' MMK'],
    ['Total',    '<span style="color:var(--green);font-weight:700;">' + order.total.toLocaleString() + ' MMK</span>'],
    ['Status',   '<span class="status-pending">PENDING</span>'],
  ].map(([k,v]) => `<div class="confirm-row"><span>${k}</span><span class="confirm-val">${v}</span></div>`).join('');

  const msg = document.getElementById('confirmMsg');
  if (msg) msg.textContent = 'မှာယူမှု အောင်မြင်ပါသည်။ မကြာမီ ဆက်သွယ်ပေးပါမည်။ ကျေးဇူးတင်ပါသည်! 🙏';
}

// ── TOAST ──
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', function() {
  const user = localStorage.getItem('vz_user');
  if (!user) { window.location.href = 'login.html'; return; }

  renderCart();
  buildTownshipDropdown();
  showStep(1);
  selectPayment('cod');

  document.querySelectorAll('.cart-count').forEach(el => el.textContent = cart.length);
});
