// =============================================
// VIBEZEE — Profile JS
// =============================================

let _db = null;

function getDB() {
  if (!_db) _db = firebase.firestore();
  return _db;
}

// ── LOAD USER ──
function loadUser() {
  const user = JSON.parse(localStorage.getItem('vz_user') || 'null');
  if (!user) { window.location.href = 'login.html'; return null; }

  const el = (id) => document.getElementById(id);
  if (el('profileName'))  el('profileName').textContent  = user.name  || 'User';
  if (el('profileEmail')) el('profileEmail').textContent = user.email || '';
  if (el('profileInitial')) {
    el('profileInitial').textContent = (user.name || 'U').charAt(0).toUpperCase();
  }
  return user;
}

// ── LOAD ORDERS FROM FIRESTORE ──
async function loadOrders(user) {
  const wrap = document.getElementById('ordersList');
  if (!wrap) return;

  wrap.innerHTML = `
    <div class="loading-wrap">
      <span class="loading-spinner">⚙️</span>
      Loading orders...
    </div>`;

  try {
    const db   = getDB();
    const snap = await db.collection('orders')
      .where('phone', '==', user.phone || '')
      .orderBy('createdAt', 'desc')
      .get();

    // Also try by name if phone not found
    let orders = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    // fallback — localStorage orders
    if (orders.length === 0) {
      const local = JSON.parse(localStorage.getItem('vz_orders') || '[]');
      orders = local.reverse();
    }

    renderOrders(orders);
  } catch(err) {
    console.error('Firestore error:', err);
    // fallback localStorage
    const local = JSON.parse(localStorage.getItem('vz_orders') || '[]');
    renderOrders(local.reverse());
  }
}

// ── RENDER ORDERS ──
function renderOrders(orders) {
  const wrap  = document.getElementById('ordersList');
  const count = document.getElementById('ordersCount');
  if (!wrap) return;

  if (count) count.textContent = orders.length;

  if (orders.length === 0) {
    wrap.innerHTML = `
      <div class="orders-empty">
        <div class="orders-empty-icon">🛒</div>
        <div class="orders-empty-title">NO ORDERS YET</div>
        <p class="orders-empty-sub">မှာယူမှု မရှိသေးဘူး</p>
        <a href="shop.html" class="btn-primary">SHOP NOW →</a>
      </div>`;
    return;
  }

  wrap.innerHTML = orders.map(order => {
    const itemsPreview = (order.items || [])
      .map(i => i.icon + ' ' + i.name)
      .slice(0, 2)
      .join(', ') + (order.items?.length > 2 ? ' +' + (order.items.length - 2) + ' more' : '');

    return `
      <div class="order-card" onclick="showOrderDetail('${order.id || ''}', ${JSON.stringify(order).replace(/'/g, '&apos;')})">
        <div class="order-card-left">
          <div class="order-id">${order.orderId || '—'}</div>
          <div class="order-date">📅 ${order.date || '—'}</div>
          <div class="order-items-preview">${itemsPreview}</div>
        </div>
        <div class="order-card-right">
          <div class="order-total">${(order.total || 0).toLocaleString()} MMK</div>
          <span class="status-badge status-${order.status || 'pending'}">
            ${statusLabel(order.status)}
          </span>
          <span class="order-card-arrow">→</span>
        </div>
      </div>`;
  }).join('');
}

// ── STATUS LABEL ──
function statusLabel(s) {
  return { pending:'⏳ PENDING', confirmed:'✅ CONFIRMED', delivered:'📦 DELIVERED', cancelled:'❌ CANCELLED' }[s] || '⏳ PENDING';
}

// ── ORDER DETAIL MODAL ──
function showOrderDetail(id, order) {
  const pl     = { cod:'🚚 Cash on Delivery', kbzpay:'📱 KBZPay', wavepay:'💜 WavePay' };
  const items  = (order.items || []).map(i => `
    <div class="modal-item-row">
      <div class="modal-item-icon">${i.icon || '📦'}</div>
      <div class="modal-item-name">${i.name}</div>
      <div class="modal-item-qty">x${i.qty}</div>
      <div class="modal-item-price">${(i.price * i.qty).toLocaleString()} MMK</div>
    </div>`).join('');

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'orderModal';
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">ORDER DETAILS</div>
        <button class="modal-close" onclick="closeOrderModal()">✕</button>
      </div>

      <div style="text-align:center;margin-bottom:1.2rem;">
        <span class="status-badge status-${order.status || 'pending'}" style="font-size:0.8rem;padding:0.5rem 1.2rem;">
          ${statusLabel(order.status)}
        </span>
      </div>

      <div class="detail-section-title">ORDER INFO</div>
      <div class="detail-row"><span class="detail-key">Order ID</span><span class="detail-val" style="color:var(--green);">${order.orderId || '—'}</span></div>
      <div class="detail-row"><span class="detail-key">Date</span><span class="detail-val">${order.date || '—'}</span></div>
      <div class="detail-row"><span class="detail-key">Payment</span><span class="detail-val">${pl[order.payment] || order.payment || '—'}</span></div>

      <div class="detail-section-title">DELIVERY INFO</div>
      <div class="detail-row"><span class="detail-key">Name</span><span class="detail-val">${order.name || '—'}</span></div>
      <div class="detail-row"><span class="detail-key">Phone</span><span class="detail-val">${order.phone || '—'}</span></div>
      <div class="detail-row"><span class="detail-key">Township</span><span class="detail-val">${order.township || '—'}</span></div>
      <div class="detail-row"><span class="detail-key">Address</span><span class="detail-val">${order.address || '—'}</span></div>
      ${order.note ? `<div class="detail-row"><span class="detail-key">Note</span><span class="detail-val">${order.note}</span></div>` : ''}

      <div class="detail-section-title">ITEMS</div>
      ${items}

      <div class="modal-total-row">
        <div>
          <div class="modal-total-label">SUBTOTAL</div>
          <div style="font-size:0.85rem;color:var(--gray);margin-top:0.2rem;">+ Delivery ${(order.deliveryFee||0).toLocaleString()} MMK</div>
        </div>
        <div class="modal-total-val">${(order.total||0).toLocaleString()} MMK</div>
      </div>
    </div>`;

  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeOrderModal(); });
}
window.showOrderDetail = showOrderDetail;

function closeOrderModal() {
  document.getElementById('orderModal')?.remove();
}
window.closeOrderModal = closeOrderModal;

// ── LOGOUT ──
function logoutUser() {
  localStorage.removeItem('vz_user');
  localStorage.removeItem('vz_token');
  window.location.href = 'login.html';
}
window.logoutUser = logoutUser;

// ── INIT ──
document.addEventListener('DOMContentLoaded', async function() {
  _db = firebase.firestore();
  const user = loadUser();
  if (!user) return;
  await loadOrders(user);

  // cart count
  const cart = JSON.parse(localStorage.getItem('vz_cart') || '[]');
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = cart.length);
});
