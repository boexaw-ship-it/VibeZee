// =============================================
// VIBEZEE — Admin JS
// =============================================

const ADMIN_EMAILS = ['admin@vibezee.com']; // ← admin email ထည့်ပါ

let currentPanel = 'dashboard';
let editingProductId = null;
let db, auth;

// ── INIT ──
document.addEventListener('DOMContentLoaded', function() {
  db   = firebase.firestore();
  auth = firebase.auth();

  auth.onAuthStateChanged(function(user) {
    if (user && ADMIN_EMAILS.includes(user.email)) {
      document.getElementById('adminLogin').style.display  = 'none';
      document.getElementById('adminApp').style.display    = 'flex';
      document.getElementById('adminUserEmail').textContent = user.email;
      loadDashboard();
      showPanel('dashboard');
    } else if (user) {
      // logged in but not admin
      showAdminToast('Admin access မရှိဘူး!', 'error');
      auth.signOut();
    } else {
      document.getElementById('adminLogin').style.display  = 'flex';
      document.getElementById('adminApp').style.display    = 'none';
    }
  });
});

// ── ADMIN LOGIN ──
async function adminLogin() {
  const email = document.getElementById('adminEmail').value.trim();
  const pass  = document.getElementById('adminPass').value;
  const btn   = document.getElementById('btnAdminLogin');
  if (!email || !pass) { showAdminToast('Email နှင့် Password ထည့်ပါ', 'error'); return; }
  btn.disabled = true; btn.textContent = 'LOGGING IN...';
  try {
    await auth.signInWithEmailAndPassword(email, pass);
  } catch(e) {
    showAdminToast('Email သို့မဟုတ် Password မှားသည်', 'error');
    btn.disabled = false; btn.textContent = 'LOGIN →';
  }
}
window.adminLogin = adminLogin;

async function adminLogout() {
  await auth.signOut();
}
window.adminLogout = adminLogout;

// ── PANEL NAVIGATION ──
function showPanel(name) {
  currentPanel = name;
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('panel-' + name)?.classList.add('active');
  document.querySelector('[data-panel="' + name + '"]')?.classList.add('active');

  const titles = {
    dashboard: ['DASHBOARD', 'Overview & Stats'],
    products:  ['PRODUCTS',  'Add, Edit, Delete products'],
    orders:    ['ORDERS',    'View & manage orders'],
  };
  const [t, s] = titles[name] || ['ADMIN', ''];
  document.getElementById('panelTitle').textContent = t;
  document.getElementById('panelSub').textContent   = s;

  if (name === 'dashboard') loadDashboard();
  if (name === 'products')  loadProducts();
  if (name === 'orders')    loadOrders();

  // close mobile sidebar
  document.getElementById('adminSidebar').classList.remove('open');
}
window.showPanel = showPanel;

function toggleSidebar() {
  document.getElementById('adminSidebar').classList.toggle('open');
}
window.toggleSidebar = toggleSidebar;

// ── DASHBOARD ──
async function loadDashboard() {
  try {
    const [ordersSnap, productsSnap] = await Promise.all([
      db.collection('orders').get(),
      db.collection('products').get(),
    ]);

    const orders   = ordersSnap.docs.map(d => d.data());
    const revenue  = orders.reduce((s, o) => s + (o.total || 0), 0);
    const pending  = orders.filter(o => o.status === 'pending').length;
    const delivered= orders.filter(o => o.status === 'delivered').length;

    setEl('statOrders',    orders.length);
    setEl('statRevenue',   revenue.toLocaleString() + ' MMK');
    setEl('statPending',   pending);
    setEl('statProducts',  productsSnap.size);
    setEl('statDelivered', delivered);

    // Recent orders
    const recent = ordersSnap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .sort((a,b) => (b.createdAt?.seconds||0) - (a.createdAt?.seconds||0))
      .slice(0, 5);
    renderRecentOrders(recent);
  } catch(e) {
    console.error(e);
  }
}

function renderRecentOrders(orders) {
  const tbody = document.getElementById('recentOrdersBody');
  if (!tbody) return;
  if (!orders.length) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--gray);padding:2rem;">Orders မရှိသေးဘူး</td></tr>';
    return;
  }
  tbody.innerHTML = orders.map(o => `
    <tr>
      <td><span style="font-family:var(--font-display);font-size:0.8rem;color:var(--green);">${o.orderId||'—'}</span></td>
      <td>${o.name||'—'}</td>
      <td style="font-family:var(--font-display);color:var(--green);">${(o.total||0).toLocaleString()} MMK</td>
      <td><span class="badge badge-${o.status||'pending'}">${(o.status||'PENDING').toUpperCase()}</span></td>
      <td><button class="btn-sm btn-view" onclick="viewOrder('${o.id}')">VIEW</button></td>
    </tr>
  `).join('');
}

// ── PRODUCTS ──
async function loadProducts(search = '') {
  const tbody = document.getElementById('productsBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:2rem;color:var(--gray);">Loading...</td></tr>';
  try {
    const snap = await db.collection('products').orderBy('name').get();
    let products = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    if (search) products = products.filter(p =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.cat?.toLowerCase().includes(search.toLowerCase())
    );
    if (!products.length) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:2rem;color:var(--gray);">Products မရှိသေးဘူး</td></tr>';
      return;
    }
    tbody.innerHTML = products.map(p => `
      <tr>
        <td style="font-size:1.5rem;">${p.icon||'📦'}</td>
        <td>
          <div style="font-family:var(--font-display);font-size:0.82rem;font-weight:700;color:var(--white);">${p.name||'—'}</div>
          <div style="font-size:0.8rem;color:var(--gray);">${p.cat||'—'}</div>
        </td>
        <td style="font-family:var(--font-display);color:var(--green);font-weight:700;">${(p.price||0).toLocaleString()} MMK</td>
        <td><span class="badge badge-${(p.badge||'').toLowerCase()}">${p.badge||'—'}</span></td>
        <td>
          <div style="color:#ffd740;font-size:0.9rem;">${'★'.repeat(p.rating||5)}</div>
          <div style="font-size:0.8rem;color:var(--gray);">(${p.reviews||0})</div>
        </td>
        <td>
          <div style="display:flex;gap:0.5rem;">
            <button class="btn-sm btn-edit"   onclick="editProduct('${p.id}')">EDIT</button>
            <button class="btn-sm btn-delete" onclick="deleteProduct('${p.id}','${p.name}')">DEL</button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch(e) {
    console.error(e);
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:2rem;color:#ff5252;">Error loading products</td></tr>';
  }
}
window.loadProducts = loadProducts;

function openAddProduct() {
  editingProductId = null;
  document.getElementById('productModalTitle').textContent = 'ADD PRODUCT';
  document.getElementById('productForm').reset();
  document.getElementById('productModal').style.display = 'flex';
}
window.openAddProduct = openAddProduct;

async function editProduct(id) {
  try {
    const doc = await db.collection('products').doc(id).get();
    const p   = doc.data();
    editingProductId = id;
    document.getElementById('productModalTitle').textContent = 'EDIT PRODUCT';
    setVal('pName',    p.name    || '');
    setVal('pCat',     p.cat     || '');
    setVal('pIcon',    p.icon    || '');
    setVal('pPrice',   p.price   || '');
    setVal('pBadge',   p.badge   || '');
    setVal('pRating',  p.rating  || 5);
    setVal('pReviews', p.reviews || 0);
    setVal('pDesc',    p.desc    || '');
    document.getElementById('productModal').style.display = 'flex';
  } catch(e) { showAdminToast('Error loading product', 'error'); }
}
window.editProduct = editProduct;

async function saveProduct() {
  const data = {
    name:    document.getElementById('pName').value.trim(),
    cat:     document.getElementById('pCat').value,
    icon:    document.getElementById('pIcon').value.trim() || '📦',
    price:   Number(document.getElementById('pPrice').value),
    badge:   document.getElementById('pBadge').value,
    rating:  Number(document.getElementById('pRating').value),
    reviews: Number(document.getElementById('pReviews').value),
    desc:    document.getElementById('pDesc').value.trim(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  };
  if (!data.name || !data.price || !data.cat) {
    showAdminToast('Name, Category, Price ဖြည့်ပါ', 'error'); return;
  }
  const btn = document.getElementById('btnSaveProduct');
  btn.disabled = true; btn.textContent = 'SAVING...';
  try {
    if (editingProductId) {
      await db.collection('products').doc(editingProductId).update(data);
      showAdminToast('✓ Product updated!');
    } else {
      data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      await db.collection('products').add(data);
      showAdminToast('✓ Product added!');
    }
    closeProductModal();
    loadProducts();
  } catch(e) {
    showAdminToast('Error saving product', 'error');
  } finally {
    btn.disabled = false; btn.textContent = 'SAVE';
  }
}
window.saveProduct = saveProduct;

function deleteProduct(id, name) {
  showVzConfirm('🗑️', 'DELETE PRODUCT', '"' + name + '" ကို ဖျက်မှာ သေချာပါသလား?', 'DELETE', async () => {
    try {
      await db.collection('products').doc(id).delete();
      showAdminToast('✓ Product deleted!');
      loadProducts();
    } catch(e) { showAdminToast('Error deleting', 'error'); }
  });
}
window.deleteProduct = deleteProduct;

function closeProductModal() {
  document.getElementById('productModal').style.display = 'none';
  editingProductId = null;
}
window.closeProductModal = closeProductModal;

// ── ORDERS ──
async function loadOrders(statusFilter = '', search = '') {
  const tbody = document.getElementById('ordersBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--gray);">Loading...</td></tr>';
  try {
    let query = db.collection('orders').orderBy('createdAt', 'desc');
    const snap = await query.get();
    let orders = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    if (statusFilter) orders = orders.filter(o => o.status === statusFilter);
    if (search) orders = orders.filter(o =>
      o.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.orderId?.toLowerCase().includes(search.toLowerCase()) ||
      o.phone?.includes(search)
    );
    if (!orders.length) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--gray);">Orders မရှိသေးဘူး</td></tr>';
      return;
    }
    tbody.innerHTML = orders.map(o => `
      <tr>
        <td><span style="font-family:var(--font-display);font-size:0.8rem;color:var(--green);">${o.orderId||'—'}</span></td>
        <td>
          <div style="font-weight:600;">${o.name||'—'}</div>
          <div style="font-size:0.8rem;color:var(--gray);">${o.phone||''}</div>
        </td>
        <td style="font-size:0.85rem;color:var(--gray);">${o.township||'—'}</td>
        <td style="font-family:var(--font-display);color:var(--green);font-weight:700;">${(o.total||0).toLocaleString()} MMK</td>
        <td>${paymentLabel(o.payment)}</td>
        <td><span class="badge badge-${o.status||'pending'}">${(o.status||'PENDING').toUpperCase()}</span></td>
        <td>
          <div style="display:flex;gap:0.5rem;">
            <button class="btn-sm btn-view"   onclick="viewOrder('${o.id}')">VIEW</button>
            <button class="btn-sm btn-edit"   onclick="updateOrderStatus('${o.id}','${o.status||'pending'}')">STATUS</button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch(e) {
    console.error(e);
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:2rem;color:#ff5252;">Error loading orders</td></tr>';
  }
}
window.loadOrders = loadOrders;

async function viewOrder(id) {
  try {
    const doc  = await db.collection('orders').doc(id).get();
    const o    = doc.data();
    const items = (o.items || []).map(i => `
      <div class="order-item-row">
        <div class="order-item-icon">${i.icon||'📦'}</div>
        <div class="order-item-name">${i.name}</div>
        <div class="order-item-qty">x${i.qty}</div>
        <div class="order-item-price">${(i.price*i.qty).toLocaleString()} MMK</div>
      </div>
    `).join('');

    document.getElementById('orderDetailContent').innerHTML = `
      <div class="order-detail-row"><span class="order-detail-key">Order ID</span><span class="order-detail-val">${o.orderId||'—'}</span></div>
      <div class="order-detail-row"><span class="order-detail-key">Date</span><span class="order-detail-val">${o.date||'—'}</span></div>
      <div class="order-detail-row"><span class="order-detail-key">Name</span><span class="order-detail-val">${o.name||'—'}</span></div>
      <div class="order-detail-row"><span class="order-detail-key">Phone</span><span class="order-detail-val">${o.phone||'—'}</span></div>
      <div class="order-detail-row"><span class="order-detail-key">Township</span><span class="order-detail-val">${o.township||'—'}</span></div>
      <div class="order-detail-row"><span class="order-detail-key">Zone</span><span class="order-detail-val">${o.zone||'—'}</span></div>
      <div class="order-detail-row"><span class="order-detail-key">Address</span><span class="order-detail-val">${o.address||'—'}</span></div>
      ${o.note ? `<div class="order-detail-row"><span class="order-detail-key">Note</span><span class="order-detail-val">${o.note}</span></div>` : ''}
      <div class="order-detail-row"><span class="order-detail-key">Payment</span><span class="order-detail-val">${paymentLabel(o.payment)}</span></div>
      <div style="margin:1rem 0;padding:0.5rem 0;border-top:1px solid var(--border);">
        <div style="font-family:var(--font-display);font-size:0.7rem;color:var(--green);letter-spacing:2px;margin-bottom:0.5rem;">ITEMS</div>
        <div class="order-items-list">${items}</div>
      </div>
      <div class="order-detail-row"><span class="order-detail-key">Subtotal</span><span class="order-detail-val">${(o.subtotal||0).toLocaleString()} MMK</span></div>
      <div class="order-detail-row"><span class="order-detail-key">Delivery</span><span class="order-detail-val">${(o.deliveryFee||0).toLocaleString()} MMK</span></div>
      <div class="order-detail-row"><span class="order-detail-key" style="color:var(--white);font-weight:700;">TOTAL</span><span class="order-detail-val" style="color:var(--green);font-size:1.1rem;">${(o.total||0).toLocaleString()} MMK</span></div>
      <div class="status-select-wrap">
        <select class="admin-select" id="statusSelect" style="flex:1;">
          <option value="pending"   ${o.status==='pending'   ?'selected':''}>PENDING</option>
          <option value="confirmed" ${o.status==='confirmed' ?'selected':''}>CONFIRMED</option>
          <option value="delivered" ${o.status==='delivered' ?'selected':''}>DELIVERED</option>
          <option value="cancelled" ${o.status==='cancelled' ?'selected':''}>CANCELLED</option>
        </select>
        <button class="btn-status-update" onclick="saveOrderStatus('${id}')">UPDATE STATUS</button>
      </div>
    `;
    document.getElementById('orderDetailModal').style.display = 'flex';
  } catch(e) { showAdminToast('Error loading order', 'error'); }
}
window.viewOrder = viewOrder;

async function saveOrderStatus(id) {
  const status = document.getElementById('statusSelect').value;
  try {
    await db.collection('orders').doc(id).update({ status });
    showAdminToast('✓ Status updated to ' + status.toUpperCase());
    closeOrderModal();
    loadOrders();
    loadDashboard();
  } catch(e) { showAdminToast('Error updating status', 'error'); }
}
window.saveOrderStatus = saveOrderStatus;

async function updateOrderStatus(id, current) {
  await viewOrder(id);
}
window.updateOrderStatus = updateOrderStatus;

function closeOrderModal() {
  document.getElementById('orderDetailModal').style.display = 'none';
}
window.closeOrderModal = closeOrderModal;

// ── HELPERS ──
function setEl(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }
function setVal(id, val) { const el = document.getElementById(id); if (el) el.value = val; }
function paymentLabel(p) {
  return { cod:'🚚 COD', kbzpay:'📱 KBZPay', wavepay:'💜 WavePay' }[p] || p || '—';
}

function showAdminToast(msg, type = '') {
  const t = document.getElementById('adminToast');
  if (!t) return;
  t.textContent = msg;
  t.className   = 'admin-toast' + (type ? ' ' + type : '') + ' show';
  setTimeout(() => t.classList.remove('show'), 2800);
}

function showVzConfirm(icon, title, msg, confirmText, onConfirm) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.style.zIndex = '300';
  overlay.innerHTML = `
    <div class="modal" style="max-width:340px;text-align:center;">
      <div style="font-size:2.5rem;margin-bottom:1rem;">${icon}</div>
      <div style="font-family:var(--font-display);font-size:1rem;font-weight:700;color:var(--white);margin-bottom:0.5rem;">${title}</div>
      <div style="font-size:0.95rem;color:var(--gray);margin-bottom:1.5rem;">${msg}</div>
      <div style="display:flex;gap:0.8rem;">
        <button id="vzNo"  style="flex:1;background:transparent;border:1px solid var(--border);border-radius:8px;padding:0.8rem;color:var(--gray);font-family:var(--font-display);font-size:0.75rem;font-weight:600;letter-spacing:1px;cursor:pointer;">CANCEL</button>
        <button id="vzYes" style="flex:1;background:#ff5252;border:none;border-radius:8px;padding:0.8rem;color:#fff;font-family:var(--font-display);font-size:0.75rem;font-weight:700;letter-spacing:1px;cursor:pointer;">${confirmText}</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelector('#vzNo').onclick  = () => overlay.remove();
  overlay.querySelector('#vzYes').onclick = () => { overlay.remove(); onConfirm(); };
}

// Order search/filter
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('orderSearch')?.addEventListener('input', function() {
    const statusFilter = document.getElementById('orderStatusFilter')?.value || '';
    loadOrders(statusFilter, this.value);
  });
  document.getElementById('orderStatusFilter')?.addEventListener('change', function() {
    const search = document.getElementById('orderSearch')?.value || '';
    loadOrders(this.value, search);
  });
  document.getElementById('productSearch')?.addEventListener('input', function() {
    loadProducts(this.value);
  });
});
