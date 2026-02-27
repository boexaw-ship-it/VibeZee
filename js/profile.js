// =============================================
// VIBEZEE — Profile JS (Real-time Firestore)
// =============================================

let _db         = null;
let _unsubscribe = null; // real-time listener cleanup

function getDB() {
  if (!_db) _db = firebase.firestore();
  return _db;
}

// ── LOAD USER ──
function loadUser() {
  const user = JSON.parse(localStorage.getItem('vz_user') || 'null');
  if (!user) { window.location.href = 'login.html'; return null; }

  const el = id => document.getElementById(id);
  if (el('profileName'))    el('profileName').textContent    = user.name  || 'User';
  if (el('profileEmail'))   el('profileEmail').textContent   = user.email || '';
  if (el('profileInitial')) el('profileInitial').textContent = (user.name || 'U').charAt(0).toUpperCase();
  return user;
}

// ── REAL-TIME ORDERS LISTENER ──
function listenOrders(uid) {
  const wrap = document.getElementById('ordersList');
  if (!wrap) return;

  wrap.innerHTML = `
    <div class="loading-wrap">
      <span class="loading-spinner">⚙️</span>
      Loading orders...
    </div>`;

  const db = getDB();

  // unsubscribe previous listener
  if (_unsubscribe) _unsubscribe();

  // real-time listener by uid
  _unsubscribe = db.collection('orders')
    .where('uid', '==', uid)
    .orderBy('createdAt', 'desc')
    .onSnapshot(
      snap => {
        let orders = snap.docs.map(d => ({ id: d.id, ...d.data() }));

        // fallback: if no orders by uid, try localStorage
        if (orders.length === 0) {
          const local = JSON.parse(localStorage.getItem('vz_orders') || '[]');
          orders = local.reverse();
        }
        renderOrders(orders);
      },
      err => {
        console.error('Firestore listener error:', err);
        // fallback localStorage
        const local = JSON.parse(localStorage.getItem('vz_orders') || '[]');
        renderOrders(local.reverse());
      }
    );
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
    const preview = (order.items || [])
      .map(i => i.icon + ' ' + i.name)
      .slice(0, 2)
      .join(', ')
      + (order.items?.length > 2 ? ' +' + (order.items.length - 2) + ' more' : '');

    const orderJson = encodeURIComponent(JSON.stringify(order));

    return `
      <div class="order-card" onclick="showOrderDetail('${orderJson}')">
        <div class="order-card-left">
          <div class="order-id">${order.orderId || '—'}</div>
          <div class="order-date">📅 ${order.date || '—'}</div>
          <div class="order-items-preview">${preview}</div>
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
  const map = {
    pending:   '⏳ PENDING',
    confirmed: '✅ CONFIRMED',
    delivered: '📦 DELIVERED',
    cancelled: '❌ CANCELLED',
  };
  return map[s] || '⏳ PENDING';
}

// ── ORDER DETAIL MODAL ──
function showOrderDetail(orderJson) {
  const order = JSON.parse(decodeURIComponent(orderJson));
  const pl    = { cod:'🚚 Cash on Delivery', kbzpay:'📱 KBZPay', wavepay:'💜 WavePay' };

  const items = (order.items || []).map(i => `
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
        <span class="status-badge status-${order.status || 'pending'}"
              style="font-size:0.8rem;padding:0.5rem 1.4rem;">
          ${statusLabel(order.status)}
        </span>
      </div>

      <div class="detail-section-title">ORDER INFO</div>
      <div class="detail-row">
        <span class="detail-key">Order ID</span>
        <span class="detail-val" style="color:var(--green);">${order.orderId || '—'}</span>
      </div>
      <div class="detail-row">
        <span class="detail-key">Date</span>
        <span class="detail-val">${order.date || '—'}</span>
      </div>
      <div class="detail-row">
        <span class="detail-key">Payment</span>
        <span class="detail-val">${pl[order.payment] || order.payment || '—'}</span>
      </div>

      <div class="detail-section-title">DELIVERY INFO</div>
      <div class="detail-row">
        <span class="detail-key">Name</span>
        <span class="detail-val">${order.name || '—'}</span>
      </div>
      <div class="detail-row">
        <span class="detail-key">Phone</span>
        <span class="detail-val">${order.phone || '—'}</span>
      </div>
      <div class="detail-row">
        <span class="detail-key">Township</span>
        <span class="detail-val">${order.township || '—'}</span>
      </div>
      <div class="detail-row">
        <span class="detail-key">Address</span>
        <span class="detail-val">${order.address || '—'}</span>
      </div>
      ${order.note ? `
      <div class="detail-row">
        <span class="detail-key">Note</span>
        <span class="detail-val">${order.note}</span>
      </div>` : ''}

      <div class="detail-section-title">ITEMS</div>
      ${items}

      <div class="modal-total-row">
        <div>
          <div class="modal-total-label">TOTAL</div>
          <div style="font-size:0.85rem;color:var(--gray);margin-top:0.2rem;">
            Subtotal ${(order.subtotal||0).toLocaleString()} + Delivery ${(order.deliveryFee||0).toLocaleString()} MMK
          </div>
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
  if (_unsubscribe) _unsubscribe(); // stop listener
  localStorage.removeItem('vz_user');
  localStorage.removeItem('vz_token');
  window.location.href = 'login.html';
}
window.logoutUser = logoutUser;

// ── INIT ──
document.addEventListener('DOMContentLoaded', function() {
  _db = firebase.firestore();
  const user = loadUser();
  if (!user) return;

  // cart count
  const cart = JSON.parse(localStorage.getItem('vz_cart') || '[]');
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = cart.length);

  // start real-time listener
  if (user.uid) {
    listenOrders(user.uid);
  } else {
    // no uid — fallback localStorage
    const local = JSON.parse(localStorage.getItem('vz_orders') || '[]');
    renderOrders(local.reverse());
  }

  // cleanup on leave
  window.addEventListener('beforeunload', () => {
    if (_unsubscribe) _unsubscribe();
  });
});
