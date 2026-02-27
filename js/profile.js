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
  // action buttons based on status
  const status = order.status || 'pending';
  let actionBtn = '';
  if (status === 'pending') {
    actionBtn = `
      <button onclick="cancelOrder('${order.id}')" style="
        width:100%;margin-top:1.2rem;
        background:transparent;border:1px solid rgba(255,82,82,0.4);
        border-radius:10px;padding:0.9rem;color:#ff5252;
        font-family:var(--font-display);font-size:0.78rem;
        font-weight:700;letter-spacing:1px;cursor:pointer;
        transition:background 0.2s;">
        ❌ CANCEL ORDER
      </button>`;
  } else if (status === 'delivered') {
    actionBtn = `
      <button onclick="deleteOrder('${order.id}')" style="
        width:100%;margin-top:1.2rem;
        background:transparent;border:1px solid rgba(255,82,82,0.3);
        border-radius:10px;padding:0.9rem;color:#ff5252;
        font-family:var(--font-display);font-size:0.78rem;
        font-weight:700;letter-spacing:1px;cursor:pointer;
        transition:background 0.2s;">
        🗑 DELETE ORDER
      </button>`;
  }

  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">ORDER DETAILS</div>
        <button class="modal-close" onclick="closeOrderModal()">✕</button>
      </div>

      <div style="text-align:center;margin-bottom:1.2rem;">
        <span class="status-badge status-${status}"
              style="font-size:0.8rem;padding:0.5rem 1.4rem;">
          ${statusLabel(status)}
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

      ${actionBtn}
    </div>`;

  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeOrderModal(); });
}
window.showOrderDetail = showOrderDetail;

function closeOrderModal() {
  document.getElementById('orderModal')?.remove();
}
window.closeOrderModal = closeOrderModal;

// ── CANCEL PENDING ORDER ──
function cancelOrder(id) {
  if (!id) return;
  vzConfirm('❌', 'CANCEL ORDER', 'Order ကို cancel လုပ်မှာ သေချာပါသလား?', 'CANCEL ORDER', async () => {
    try {
      await getDB().collection('orders').doc(id).update({ status: 'cancelled' });
      closeOrderModal();
      showToast('Order cancelled ✓');
    } catch(e) {
      console.error(e);
      showToast('Error: ' + e.message);
    }
  });
}
window.cancelOrder = cancelOrder;

// ── DELETE DELIVERED ORDER ──
function deleteOrder(id) {
  if (!id) return;
  vzConfirm('🗑️', 'DELETE ORDER', 'Order history ကနေ ဖျက်မှာ သေချာပါသလား?', 'DELETE', async () => {
    try {
      await getDB().collection('orders').doc(id).delete();
      closeOrderModal();
      showToast('Order deleted ✓');
    } catch(e) {
      console.error(e);
      showToast('Error: ' + e.message);
    }
  });
}
window.deleteOrder = deleteOrder;

// ── CUSTOM CONFIRM ──
function vzConfirm(icon, title, msg, confirmText, onConfirm) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.style.zIndex = '300';
  overlay.innerHTML = `
    <div class="modal" style="max-width:320px;text-align:center;">
      <div style="font-size:2.5rem;margin-bottom:1rem;">${icon}</div>
      <div style="font-family:var(--font-display);font-size:1rem;font-weight:700;color:var(--white);margin-bottom:0.5rem;">${title}</div>
      <div style="font-size:0.95rem;color:var(--gray);margin-bottom:1.5rem;line-height:1.5;">${msg}</div>
      <div style="display:flex;gap:0.8rem;">
        <button id="vzNo"  style="flex:1;background:transparent;border:1px solid var(--border);border-radius:8px;padding:0.85rem;color:var(--gray);font-family:var(--font-display);font-size:0.75rem;font-weight:600;letter-spacing:1px;cursor:pointer;">BACK</button>
        <button id="vzYes" style="flex:1;background:#ff5252;border:none;border-radius:8px;padding:0.85rem;color:#fff;font-family:var(--font-display);font-size:0.75rem;font-weight:700;letter-spacing:1px;cursor:pointer;">${confirmText}</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.querySelector('#vzNo').onclick  = () => overlay.remove();
  overlay.querySelector('#vzYes').onclick = () => { overlay.remove(); onConfirm(); };
}

// ── TOAST ──
function showToast(msg) {
  const existing = document.getElementById('profileToast');
  if (existing) existing.remove();
  const t = document.createElement('div');
  t.id = 'profileToast';
  t.textContent = msg;
  t.style.cssText = `
    position:fixed;bottom:2rem;left:50%;transform:translateX(-50%) translateY(80px);
    background:var(--card);border:1px solid var(--green);color:var(--green);
    font-family:var(--font-display);font-size:0.8rem;font-weight:600;letter-spacing:1px;
    padding:0.8rem 1.5rem;border-radius:10px;z-index:999;
    transition:transform 0.3s,opacity 0.3s;opacity:0;`;
  document.body.appendChild(t);
  requestAnimationFrame(() => {
    t.style.transform = 'translateX(-50%) translateY(0)';
    t.style.opacity   = '1';
  });
  setTimeout(() => {
    t.style.transform = 'translateX(-50%) translateY(80px)';
    t.style.opacity   = '0';
    setTimeout(() => t.remove(), 300);
  }, 2500);
}

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
