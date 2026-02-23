// =============================================
// VIBEZEE — Admin JS
// =============================================

// ── ADMIN CREDENTIALS (change before deploy) ──
const ADMIN_EMAIL    = 'admin@vibezee.com';
const ADMIN_PASSWORD = 'vibezee@2025';

// ── PRODUCT DATA ──
let PRODUCTS = [
  { id: 101, name: 'Creative Sound Blaster X3',      cat: 'sound-cards', icon: '🔊', price: 85000,  badge: 'HOT',  rating: 5, reviews: 48 },
  { id: 102, name: 'ASUS Xonar SE Sound Card',       cat: 'sound-cards', icon: '🔊', price: 65000,  badge: '',     rating: 4, reviews: 32 },
  { id: 103, name: 'StarTech 7.1 USB Audio Card',    cat: 'sound-cards', icon: '🔊', price: 28000,  badge: 'SALE', rating: 4, reviews: 19 },
  { id: 201, name: 'HyperX QuadCast USB Mic',        cat: 'microphones', icon: '🎙', price: 120000, badge: 'HOT',  rating: 5, reviews: 91 },
  { id: 202, name: 'Blue Snowball iCE Condenser',    cat: 'microphones', icon: '🎙', price: 55000,  badge: '',     rating: 4, reviews: 67 },
  { id: 203, name: 'Fifine K678 USB Microphone',     cat: 'microphones', icon: '🎙', price: 32000,  badge: 'NEW',  rating: 4, reviews: 44 },
  { id: 204, name: 'BOYA BY-PM500 Studio Mic',       cat: 'microphones', icon: '🎙', price: 48000,  badge: '',     rating: 4, reviews: 28 },
  { id: 301, name: 'JBL Quantum 50 Gaming Earbuds',  cat: 'earphones',   icon: '🎧', price: 35000,  badge: '',     rating: 5, reviews: 128 },
  { id: 302, name: 'Razer Hammerhead V2',            cat: 'earphones',   icon: '🎧', price: 45000,  badge: 'HOT',  rating: 5, reviews: 203 },
  { id: 303, name: 'SteelSeries Tusq Earbuds',       cat: 'earphones',   icon: '🎧', price: 28000,  badge: 'NEW',  rating: 4, reviews: 56 },
  { id: 304, name: 'Samsung AKG Wired Earphones',    cat: 'earphones',   icon: '🎧', price: 18000,  badge: 'SALE', rating: 4, reviews: 74 },
  { id: 401, name: 'Redragon K552 Mechanical TKL',   cat: 'keyboards',   icon: '⌨️', price: 55000,  badge: 'HOT',  rating: 5, reviews: 186 },
  { id: 402, name: 'Havit HV-KB395L RGB Keyboard',  cat: 'keyboards',   icon: '⌨️', price: 38000,  badge: '',     rating: 4, reviews: 92 },
  { id: 403, name: 'MechStrike Pro Full-Size RGB',   cat: 'keyboards',   icon: '⌨️', price: 85000,  badge: 'NEW',  rating: 5, reviews: 43 },
  { id: 404, name: 'Tecware Phantom TKL Mech',       cat: 'keyboards',   icon: '⌨️', price: 65000,  badge: '',     rating: 4, reviews: 61 },
  { id: 501, name: 'Logitech G302 Gaming Mouse',     cat: 'mouse',       icon: '🖱', price: 45000,  badge: '',     rating: 5, reviews: 204 },
  { id: 502, name: 'Razer DeathAdder V3',            cat: 'mouse',       icon: '🖱', price: 95000,  badge: 'HOT',  rating: 5, reviews: 318 },
  { id: 503, name: 'Redragon M711 Cobra Mouse',      cat: 'mouse',       icon: '🖱', price: 25000,  badge: 'SALE', rating: 4, reviews: 143 },
  { id: 504, name: 'Havit MS1016 RGB Gaming Mouse',  cat: 'mouse',       icon: '🖱', price: 20000,  badge: '',     rating: 4, reviews: 87 },
  { id: 601, name: 'Xbox Wireless Controller',       cat: 'joysticks',   icon: '🕹', price: 85000,  badge: 'HOT',  rating: 5, reviews: 256 },
  { id: 602, name: 'PS5 DualSense Controller',       cat: 'joysticks',   icon: '🕹', price: 115000, badge: '',     rating: 5, reviews: 198 },
  { id: 603, name: 'Logitech F310 Gamepad',          cat: 'joysticks',   icon: '🕹', price: 38000,  badge: 'SALE', rating: 4, reviews: 76 },
  { id: 701, name: 'SanDisk Ultra 64GB USB 3.0',     cat: 'memory',      icon: '💾', price: 18000,  badge: '',     rating: 5, reviews: 312 },
  { id: 702, name: 'Kingston DataTraveler 128GB',    cat: 'memory',      icon: '💾', price: 28000,  badge: 'HOT',  rating: 5, reviews: 224 },
  { id: 703, name: 'Samsung BAR Plus 32GB',          cat: 'memory',      icon: '💾', price: 12000,  badge: '',     rating: 4, reviews: 156 },
  { id: 704, name: 'Toshiba TransMemory 256GB',      cat: 'memory',      icon: '💾', price: 45000,  badge: 'NEW',  rating: 4, reviews: 38 },
  { id: 801, name: 'Seagate Barracuda 1TB HDD',      cat: 'harddisk',    icon: '🗄', price: 55000,  badge: '',     rating: 5, reviews: 187 },
  { id: 802, name: 'WD Blue 2TB Internal HDD',       cat: 'harddisk',    icon: '🗄', price: 85000,  badge: 'HOT',  rating: 5, reviews: 143 },
  { id: 803, name: 'Samsung 870 EVO 500GB SSD',      cat: 'harddisk',    icon: '🗄', price: 95000,  badge: 'NEW',  rating: 5, reviews: 211 },
  { id: 804, name: 'Kingston A400 240GB SSD',        cat: 'harddisk',    icon: '🗄', price: 48000,  badge: 'SALE', rating: 4, reviews: 96 },
  { id: 805, name: 'Toshiba Canvio 1TB Portable',    cat: 'harddisk',    icon: '🗄', price: 68000,  badge: '',     rating: 4, reviews: 74 },
  { id: 901, name: 'Anker 100W USB-C Cable',         cat: 'usbc',        icon: '🔌', price: 18000,  badge: 'HOT',  rating: 5, reviews: 445 },
  { id: 902, name: 'Baseus 7-in-1 USB-C Hub',        cat: 'usbc',        icon: '🔌', price: 45000,  badge: '',     rating: 5, reviews: 213 },
  { id: 903, name: 'Ugreen USB-C to HDMI Adapter',   cat: 'usbc',        icon: '🔌', price: 22000,  badge: 'NEW',  rating: 4, reviews: 87 },
  { id: 904, name: 'Aukey 5-Port USB-C Hub',         cat: 'usbc',        icon: '🔌', price: 35000,  badge: '',     rating: 4, reviews: 64 },
];

const CAT_LABELS = {
  'sound-cards':'Sound Cards','microphones':'Microphones','earphones':'Earphones',
  'keyboards':'Keyboards','mouse':'Mouse','joysticks':'Joysticks',
  'memory':'Memory Sticks','harddisk':'Hard Disks','usbc':'USB Type-C',
};

// ── DEMO ORDERS ──
const DEMO_ORDERS = [
  { id:'#VZ-001', name:'Ko Aung', phone:'09111111111', city:'Yangon', payment:'kbzpay', status:'pending',    total:85000, date:'23/02/2025', items:[{icon:'🔊',name:'Creative Sound Blaster X3',qty:1,price:85000}] },
  { id:'#VZ-002', name:'Ma Thida', phone:'09222222222', city:'Mandalay', payment:'cod', status:'processing', total:55000, date:'22/02/2025', items:[{icon:'⌨️',name:'Redragon K552 Mechanical TKL',qty:1,price:55000}] },
  { id:'#VZ-003', name:'Ko Zaw', phone:'09333333333', city:'Yangon', payment:'wavepay', status:'delivered', total:140000, date:'21/02/2025', items:[{icon:'🖱',name:'Razer DeathAdder V3',qty:1,price:95000},{icon:'🎧',name:'Razer Hammerhead V2',qty:1,price:45000}] },
  { id:'#VZ-004', name:'Mg Mg', phone:'09444444444', city:'Bago', payment:'cod', status:'pending',          total:28000, date:'20/02/2025', items:[{icon:'💾',name:'SanDisk Ultra 64GB',qty:1,price:18000},{icon:'🔌',name:'Anker USB-C Cable',qty:1,price:10000}] },
  { id:'#VZ-005', name:'Su Su', phone:'09555555555', city:'Naypyidaw', payment:'kbzpay', status:'cancelled',total:35000, date:'19/02/2025', items:[{icon:'🎧',name:'JBL Quantum 50',qty:1,price:35000}] },
];

// ── DEMO USERS ──
const DEMO_USERS = [
  { name:'Ko Aung',  phone:'09111111111', city:'Yangon',    orders:3, spent:240000 },
  { name:'Ma Thida', phone:'09222222222', city:'Mandalay',  orders:1, spent:55000  },
  { name:'Ko Zaw',   phone:'09333333333', city:'Yangon',    orders:5, spent:480000 },
  { name:'Mg Mg',    phone:'09444444444', city:'Bago',      orders:2, spent:63000  },
  { name:'Su Su',    phone:'09555555555', city:'Naypyidaw', orders:1, spent:35000  },
];

let orders = [];
let adminLoggedIn = false;
let editingProductId = null;

// ── ADMIN LOGIN ──
function adminLogin() {
  const email    = document.getElementById('gateEmail').value.trim();
  const password = document.getElementById('gatePassword').value;
  const msgEl    = document.getElementById('gateMessage');
  const btn      = document.getElementById('btnGate');

  if (!email || !password) {
    showGateMsg('Please fill in all fields.'); return;
  }

  btn.textContent = 'VERIFYING...';
  btn.disabled = true;

  setTimeout(async () => {
    let success = false;

    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('vz_admin_token', data.token);
        success = true;
      }
    } catch (e) {
      // Demo mode fallback
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        localStorage.setItem('vz_admin_token', 'admin-demo-token');
        success = true;
      }
    }

    if (success) {
      document.getElementById('adminGate').style.display = 'none';
      document.getElementById('adminDashboard').style.display = 'grid';
      adminLoggedIn = true;
      initDashboard();
    } else {
      showGateMsg('Invalid credentials.');
      btn.textContent = 'ENTER DASHBOARD →';
      btn.disabled = false;
    }
  }, 800);
}

function showGateMsg(msg) {
  const el = document.getElementById('gateMessage');
  el.textContent = msg;
  el.className = 'gate-message error';
  el.style.display = 'block';
}

// ── INIT DASHBOARD ──
function initDashboard() {
  // Load orders from localStorage + demo
  const stored = JSON.parse(localStorage.getItem('vz_orders') || '[]');
  orders = [...DEMO_ORDERS, ...stored.map(o => ({
    ...o,
    status: o.status || 'pending',
  }))];

  updateStats();
  renderRecentOrders();
  renderTopCategories();
  startClock();
  updateNewOrdersBadge();
}

// ── STATS ──
function updateStats() {
  const totalRev = orders.reduce((s,o) => s + (o.total||0), 0);
  animateNum('statOrders', orders.length);
  animateNum('statRevenue', totalRev, true);
  animateNum('statUsers', DEMO_USERS.length + Math.floor(Math.random() * 5));
  document.getElementById('statProducts').textContent = PRODUCTS.length;
}

function animateNum(id, target, isMoney = false) {
  const el = document.getElementById(id);
  if (!el) return;
  let cur = 0;
  const step = target / 40;
  const timer = setInterval(() => {
    cur = Math.min(cur + step, target);
    el.textContent = isMoney
      ? Math.floor(cur).toLocaleString()
      : Math.floor(cur);
    if (cur >= target) clearInterval(timer);
  }, 30);
}

// ── RECENT ORDERS ──
function renderRecentOrders() {
  const el = document.getElementById('recentOrdersList');
  if (!el) return;
  const recent = [...orders].slice(0, 5);
  el.innerHTML = recent.map(o => `
    <div class="recent-order-row">
      <div>
        <div class="recent-order-id">${o.id}</div>
        <div class="recent-order-name">${o.name}</div>
      </div>
      <div class="recent-order-price">${(o.total||0).toLocaleString()} MMK</div>
      <div class="order-status status-${o.status}">${o.status.toUpperCase()}</div>
    </div>
  `).join('');
}

// ── TOP CATEGORIES ──
function renderTopCategories() {
  const el = document.getElementById('topCategories');
  if (!el) return;
  const cats = [
    { name:'⌨️ Keyboards', count: 4 },
    { name:'🖱 Mouse',      count: 4 },
    { name:'🎧 Earphones',  count: 4 },
    { name:'🎙 Microphones', count: 4 },
    { name:'🗄 Hard Disks', count: 5 },
  ];
  const max = Math.max(...cats.map(c => c.count));
  el.innerHTML = cats.map(c => `
    <div class="cat-stat-row">
      <div class="cat-stat-top">
        <span class="cat-stat-name">${c.name}</span>
        <span class="cat-stat-count">${c.count} products</span>
      </div>
      <div class="cat-bar-wrap">
        <div class="cat-bar" style="width:${(c.count/max)*100}%"></div>
      </div>
    </div>
  `).join('');
}

// ── ORDERS TABLE ──
function renderOrders() {
  const tbody  = document.getElementById('ordersTableBody');
  const empty  = document.getElementById('ordersEmpty');
  const filter = document.getElementById('orderStatusFilter')?.value || 'all';

  let filtered = orders;
  if (filter !== 'all') filtered = orders.filter(o => o.status === filter);

  if (!tbody) return;
  if (filtered.length === 0) {
    tbody.innerHTML = '';
    empty.style.display = 'block'; return;
  }
  empty.style.display = 'none';

  tbody.innerHTML = filtered.map(o => `
    <tr>
      <td><span style="font-family:var(--font-display);font-size:0.7rem;color:var(--cyan);">${o.id}</span></td>
      <td>
        <div style="font-weight:600;">${o.name}</div>
        <div style="font-size:0.75rem;color:var(--gray);">${o.phone}</div>
      </td>
      <td style="color:var(--gray);">${o.items?.length || 1} item(s)</td>
      <td><span style="font-family:var(--font-display);font-size:0.8rem;color:var(--cyan);">${(o.total||0).toLocaleString()}</span></td>
      <td><span style="font-size:0.8rem;color:var(--gray);">${o.payment || 'COD'}</span></td>
      <td>
        <select class="status-select" onchange="updateOrderStatus('${o.id}', this.value)">
          ${['pending','processing','delivered','cancelled'].map(s =>
            `<option value="${s}" ${o.status===s?'selected':''}>${s.charAt(0).toUpperCase()+s.slice(1)}</option>`
          ).join('')}
        </select>
      </td>
      <td>
        <button class="tbl-btn tbl-btn-view" onclick="viewOrder('${o.id}')">VIEW</button>
      </td>
    </tr>
  `).join('');
}

function updateOrderStatus(orderId, newStatus) {
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = newStatus;
    updateNewOrdersBadge();
    showToast('✓ Status updated');
  }
}

function updateNewOrdersBadge() {
  const count = orders.filter(o => o.status === 'pending').length;
  const el = document.getElementById('newOrdersBadge');
  if (el) el.textContent = count || '';
}

function viewOrder(orderId) {
  const o = orders.find(x => x.id === orderId);
  if (!o) return;
  const body = document.getElementById('orderModalBody');
  const payLabels = { cod:'Cash on Delivery', kbzpay:'KBZPay', wavepay:'WavePay' };
  body.innerHTML = `
    <div class="order-detail-row"><span>Order ID</span><span>${o.id}</span></div>
    <div class="order-detail-row"><span>Customer</span><span>${o.name}</span></div>
    <div class="order-detail-row"><span>Phone</span><span>${o.phone}</span></div>
    <div class="order-detail-row"><span>City</span><span>${o.city}</span></div>
    <div class="order-detail-row"><span>Payment</span><span>${payLabels[o.payment]||o.payment}</span></div>
    <div class="order-detail-row"><span>Status</span><span class="order-status status-${o.status}">${o.status.toUpperCase()}</span></div>
    <div class="order-detail-row"><span>Date</span><span>${o.date||'—'}</span></div>
    <div class="order-detail-row"><span>Total</span><span style="color:var(--cyan);font-family:var(--font-display);">${(o.total||0).toLocaleString()} MMK</span></div>
    <div class="order-detail-items">
      ${(o.items||[]).map(item => `
        <div class="order-detail-item">
          <span style="font-size:1.4rem;">${item.icon||'📦'}</span>
          <span style="flex:1;">${item.name}</span>
          <span style="color:var(--gray);">×${item.qty||1}</span>
          <span style="font-family:var(--font-display);color:var(--cyan);">${(item.price*(item.qty||1)).toLocaleString()} MMK</span>
        </div>
      `).join('')}
    </div>
  `;
  document.getElementById('orderModal').style.display = 'flex';
}
function closeOrderModal() {
  document.getElementById('orderModal').style.display = 'none';
}

// ── PRODUCTS TABLE ──
function renderProducts() {
  const tbody   = document.getElementById('productsTableBody');
  const search  = document.getElementById('productSearch')?.value.toLowerCase() || '';
  const catFilt = document.getElementById('productCatFilter')?.value || 'all';

  let list = [...PRODUCTS];
  if (catFilt !== 'all') list = list.filter(p => p.cat === catFilt);
  if (search) list = list.filter(p => p.name.toLowerCase().includes(search));

  if (!tbody) return;
  tbody.innerHTML = list.map(p => `
    <tr>
      <td style="font-size:1.5rem;">${p.icon}</td>
      <td>
        <div style="font-weight:600;">${p.name}</div>
        <div style="font-size:0.7rem;color:var(--gray);">ID: ${p.id}</div>
      </td>
      <td><span style="color:var(--purple-light);font-size:0.8rem;">${CAT_LABELS[p.cat]||p.cat}</span></td>
      <td><span style="font-family:var(--font-display);color:var(--cyan);">${p.price.toLocaleString()} MMK</span></td>
      <td>
        ${p.badge
          ? `<span class="order-status ${p.badge==='HOT'?'status-processing':p.badge==='NEW'?'status-delivered':'status-pending'}">${p.badge}</span>`
          : '<span style="color:var(--gray);">—</span>'}
      </td>
      <td>
        <button class="tbl-btn tbl-btn-edit" onclick="editProduct(${p.id})">EDIT</button>
        <button class="tbl-btn tbl-btn-del"  onclick="deleteProduct(${p.id})">DEL</button>
      </td>
    </tr>
  `).join('');
}

// ── PRODUCT MODAL ──
function openProductModal(id = null) {
  editingProductId = id;
  const modal = document.getElementById('productModal');
  const title = document.getElementById('modalTitle');

  if (id) {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;
    title.textContent = 'EDIT PRODUCT';
    document.getElementById('modalProductId').value = id;
    document.getElementById('modalName').value   = p.name;
    document.getElementById('modalCat').value    = p.cat;
    document.getElementById('modalPrice').value  = p.price;
    document.getElementById('modalIcon').value   = p.icon;
    document.getElementById('modalBadge').value  = p.badge || '';
  } else {
    title.textContent = 'ADD PRODUCT';
    document.getElementById('modalProductId').value = '';
    document.getElementById('modalName').value  = '';
    document.getElementById('modalCat').value   = '';
    document.getElementById('modalPrice').value = '';
    document.getElementById('modalIcon').value  = '';
    document.getElementById('modalBadge').value = '';
  }
  modal.style.display = 'flex';
}

function editProduct(id) { openProductModal(id); }

function closeProductModal() {
  document.getElementById('productModal').style.display = 'none';
}

function saveProduct() {
  const name  = document.getElementById('modalName').value.trim();
  const cat   = document.getElementById('modalCat').value;
  const price = parseInt(document.getElementById('modalPrice').value);
  const icon  = document.getElementById('modalIcon').value.trim() || '📦';
  const badge = document.getElementById('modalBadge').value;

  if (!name || !cat || !price) {
    showToast('⚠ Fill in required fields'); return;
  }

  const id = editingProductId;
  if (id) {
    const idx = PRODUCTS.findIndex(p => p.id === id);
    if (idx !== -1) {
      PRODUCTS[idx] = { ...PRODUCTS[idx], name, cat, price, icon, badge };
    }
    showToast('✓ Product updated');
  } else {
    const newId = Math.max(...PRODUCTS.map(p => p.id)) + 1;
    PRODUCTS.push({ id: newId, name, cat, price, icon, badge, rating: 5, reviews: 0 });
    document.getElementById('statProducts').textContent = PRODUCTS.length;
    showToast('✓ Product added');
  }

  closeProductModal();
  renderProducts();
}

function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;
  PRODUCTS = PRODUCTS.filter(p => p.id !== id);
  renderProducts();
  document.getElementById('statProducts').textContent = PRODUCTS.length;
  showToast('✓ Product deleted');
}

// ── USERS TABLE ──
function renderUsers() {
  const tbody  = document.getElementById('usersTableBody');
  const empty  = document.getElementById('usersEmpty');
  const search = document.getElementById('userSearch')?.value.toLowerCase() || '';

  // Combine demo users + orders-derived users
  const orderUsers = orders.map(o => ({
    name: o.name, phone: o.phone, city: o.city,
    orders: orders.filter(x => x.phone === o.phone).length,
    spent: orders.filter(x => x.phone === o.phone).reduce((s,x)=>s+(x.total||0),0),
  }));
  const seen = new Set();
  const allUsers = [...DEMO_USERS, ...orderUsers].filter(u => {
    if (seen.has(u.phone)) return false;
    seen.add(u.phone); return true;
  });

  let filtered = allUsers;
  if (search) filtered = allUsers.filter(u =>
    u.name.toLowerCase().includes(search) || u.phone.includes(search)
  );

  if (!tbody) return;
  if (filtered.length === 0) { empty.style.display = 'block'; tbody.innerHTML=''; return; }
  empty.style.display = 'none';

  tbody.innerHTML = filtered.map(u => `
    <tr>
      <td>
        <div style="font-weight:600;">${u.name}</div>
      </td>
      <td style="color:var(--gray);">${u.phone}</td>
      <td style="color:var(--gray);">${u.city}</td>
      <td><span style="font-family:var(--font-display);color:var(--purple-light);">${u.orders}</span></td>
      <td><span style="font-family:var(--font-display);color:var(--cyan);">${u.spent.toLocaleString()} MMK</span></td>
      <td>
        <button class="tbl-btn tbl-btn-view" onclick="showToast('👤 ${u.name} — ${u.phone}')">VIEW</button>
      </td>
    </tr>
  `).join('');
}

// ── CHARTS ──
let chartsInitialized = false;

function initCharts() {
  if (chartsInitialized) return;
  chartsInitialized = true;

  const chartDefaults = {
    color: '#8888aa',
    font: { family: 'Rajdhani', size: 12 },
  };
  Chart.defaults.color = chartDefaults.color;
  Chart.defaults.font  = chartDefaults.font;

  // Revenue Chart
  new Chart(document.getElementById('revenueChart'), {
    type: 'line',
    data: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      datasets: [{
        label: 'Revenue (MMK)',
        data: [320000,480000,390000,650000,720000,580000,810000,760000,890000,1020000,940000,1150000],
        borderColor: '#7c3aed',
        backgroundColor: 'rgba(124,58,237,0.08)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#00fff7',
        pointBorderColor: '#00fff7',
        pointRadius: 4,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: 'rgba(51,51,85,0.4)' } },
        y: { grid: { color: 'rgba(51,51,85,0.4)' },
             ticks: { callback: v => (v/1000)+'K' } },
      }
    }
  });

  // Category Chart
  new Chart(document.getElementById('categoryChart'), {
    type: 'doughnut',
    data: {
      labels: ['Keyboards','Mouse','Earphones','Microphones','Hard Disks','Others'],
      datasets: [{
        data: [28, 24, 19, 15, 9, 5],
        backgroundColor: ['#7c3aed','#00fff7','#9d5cff','#5b21b6','#3b82f6','#333355'],
        borderColor: '#0d0d1a',
        borderWidth: 3,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { padding: 16, usePointStyle: true, pointStyle: 'circle' }
        }
      }
    }
  });

  // Weekly Chart
  new Chart(document.getElementById('weeklyChart'), {
    type: 'bar',
    data: {
      labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      datasets: [{
        label: 'Orders',
        data: [8, 12, 7, 15, 18, 24, 20],
        backgroundColor: 'rgba(124,58,237,0.6)',
        borderColor: '#7c3aed',
        borderWidth: 1,
        borderRadius: 4,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: 'rgba(51,51,85,0.4)' } },
        y: { grid: { color: 'rgba(51,51,85,0.4)' } },
      }
    }
  });
}

// ── SECTION SWITCH ──
function showSection(name, el) {
  document.querySelectorAll('.admin-section').forEach(s => s.style.display = 'none');
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));

  document.getElementById('section-' + name).style.display = 'block';
  if (el) el.classList.add('active');

  const titles = { overview:'Overview', orders:'Orders', products:'Products', users:'Users', analytics:'Sales Chart' };
  document.getElementById('topbarTitle').textContent = titles[name] || name;

  if (name === 'orders')    renderOrders();
  if (name === 'products')  renderProducts();
  if (name === 'users')     renderUsers();
  if (name === 'analytics') { initCharts(); }
}

// ── SIDEBAR TOGGLE ──
function toggleAdminSidebar() {
  document.getElementById('adminSidebar').classList.toggle('open');
}

// ── CLOCK ──
function startClock() {
  const el = document.getElementById('topbarTime');
  function update() {
    if (el) el.textContent = new Date().toLocaleTimeString('en-GB');
  }
  update();
  setInterval(update, 1000);
}

// ── LOGOUT ──
function adminLogout() {
  if (!confirm('Logout from admin panel?')) return;
  localStorage.removeItem('vz_admin_token');
  window.location.href = 'index.html';
}

// ── MODAL OUTSIDE CLICK ──
function closeModalOutside(e) {
  if (e.target.classList.contains('modal-overlay')) {
    closeProductModal();
    closeOrderModal();
  }
}

// ── TOAST ──
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ── ENTER KEY (gate) ──
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !adminLoggedIn) adminLogin();
});

// ── AUTO-LOGIN if token exists ──
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('vz_admin_token');
  if (token) {
    document.getElementById('adminGate').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'grid';
    adminLoggedIn = true;
    initDashboard();
  }
});
