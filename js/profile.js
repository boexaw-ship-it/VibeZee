// =============================================
// VIBEZEE — Profile JS (Simple + Clean)
// =============================================

let _db          = null;
let _unsubscribe = null;

function getDB() {
  if (!_db) _db = firebase.firestore();
  return _db;
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', function() {
  _db = firebase.firestore();

  const user = JSON.parse(localStorage.getItem('vz_user') || 'null');
  if (!user) { window.location.href = 'login.html'; return; }

  // show name initial
  const el = id => document.getElementById(id);
  if (el('profileInitial')) el('profileInitial').textContent = (user.name||'U').charAt(0).toUpperCase();
  if (el('profileName'))    el('profileName').textContent    = user.name  || 'User';
  if (el('profileEmail'))   el('profileEmail').textContent   = user.email || '';

  // cart count
  const cart = JSON.parse(localStorage.getItem('vz_cart')||'[]');
  document.querySelectorAll('.cart-count').forEach(e => e.textContent = cart.length);

  // load orders
  listenOrders(user.uid || '');

  window.addEventListener('beforeunload', () => { if (_unsubscribe) _unsubscribe(); });
});

// ── REAL-TIME ORDERS ──
function listenOrders(uid) {
  const wrap = document.getElementById('ordersList');
  if (!wrap) return;
  wrap.innerHTML = '<div style="text-align:center;padding:3rem;color:var(--gray);">⚙️ Loading...</div>';

  if (_unsubscribe) _unsubscribe();

  _unsubscribe = getDB().collection('orders')
    .where('uid', '==', uid)
    .orderBy('createdAt', 'desc')
    .onSnapshot(snap => {
      const orders = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      renderOrders(orders);
    }, err => {
      console.error('Firestore error:', err.code, err.message);
      if (err.code === 'failed-precondition') {
        // index မရှိသေးဘူး — index link ပြမည်
        const wrap = document.getElementById('ordersList');
        if (wrap) wrap.innerHTML = `
          <div style="text-align:center;padding:2rem;background:var(--card);border:1px solid var(--border);border-radius:14px;">
            <div style="font-size:2rem;margin-bottom:0.8rem;">⚠️</div>
            <div style="font-family:var(--font-display);font-size:0.85rem;color:var(--white);margin-bottom:0.5rem;">INDEX လိုအပ်သည်</div>
            <p style="font-size:0.9rem;color:var(--gray);margin-bottom:1rem;">Firebase Console → Firestore → Indexes မှာ<br><strong style="color:var(--green);">uid + createdAt</strong> index ဆောက်ပါ</p>
            <p style="font-size:0.8rem;color:var(--gray);">Console error ထဲမှာ link ပေးထားသည် — ထို link နှိပ်ပြီး Create Index နှိပ်ပါ</p>
          </div>`;
      } else {
        // တခြား error — uid ဖြင့် filter မလုပ်ဘဲ ကိုယ့် uid နဲ့ match တာပဲ ပြ
        getDB().collection('orders')
          .where('uid', '==', uid)
          .get()
          .then(snap => {
            const orders = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            renderOrders(orders);
          })
          .catch(() => renderOrders([]));
      }
    });
}

// ── RENDER ORDER CARDS ──
function renderOrders(orders) {
  const wrap  = document.getElementById('ordersList');
  const count = document.getElementById('ordersCount');
  if (!wrap) return;
  if (count) count.textContent = orders.length;

  if (!orders.length) {
    wrap.innerHTML = `
      <div style="text-align:center;padding:4rem 2rem;background:var(--card);border:1px solid var(--border);border-radius:14px;">
        <div style="font-size:3rem;margin-bottom:1rem;">🛒</div>
        <div style="font-family:var(--font-display);font-size:1rem;color:var(--white);letter-spacing:2px;margin-bottom:0.5rem;">NO ORDERS YET</div>
        <p style="color:var(--gray);margin-bottom:1.5rem;">မှာယူမှု မရှိသေးဘူး</p>
        <a href="shop.html" class="btn-primary">SHOP NOW →</a>
      </div>`;
    return;
  }

  wrap.innerHTML = orders.map(o => {
    const preview = (o.items||[]).slice(0,2).map(i => i.icon+' '+i.name).join(', ')
      + (o.items?.length > 2 ? ' +' + (o.items.length-2) + ' more' : '');
    const encoded = encodeURIComponent(JSON.stringify(o));
    const canCancel = o.status === 'pending' || !o.status;
    const canDelete = o.status === 'delivered' || o.status === 'cancelled';

    return `
      <div class="order-card">
        <div class="order-card-body" onclick="showModal('${encoded}')" style="flex:1;cursor:pointer;">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;">
            <div>
              <div class="order-id">${o.orderId||'—'}</div>
              <div class="order-date">📅 ${o.date||'—'}</div>
              <div class="order-items-preview">${preview}</div>
            </div>
            <div style="text-align:right;">
              <div class="order-total">${(o.total||0).toLocaleString()} MMK</div>
              <span class="status-badge status-${o.status||'pending'}">${statusLabel(o.status)}</span>
            </div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:0.4rem;margin-left:0.5rem;">
          ${canCancel ? `<button class="card-action-btn cancel-btn" onclick="cancelOrder('${o.id}')">❌</button>` : ''}
          ${canDelete ? `<button class="card-action-btn delete-btn" onclick="deleteOrder('${o.id}')">🗑</button>` : ''}
        </div>
      </div>`;
  }).join('');
}

// ── STATUS ──
function statusLabel(s) {
  return { pending:'⏳ PENDING', confirmed:'✅ CONFIRMED', delivered:'📦 DELIVERED', cancelled:'❌ CANCELLED' }[s] || '⏳ PENDING';
}

// ── CANCEL ORDER ──
function cancelOrder(id) {
  vzConfirm('❌', 'CANCEL ORDER', 'Order ကို cancel လုပ်မှာ သေချာပါသလား?', 'YES, CANCEL', async () => {
    try {
      await getDB().collection('orders').doc(id).update({ status: 'cancelled' });
      showToast('✓ Order cancelled');
    } catch(e) {
      console.error(e);
      showToast('Error: ' + (e.message||'failed'));
    }
  });
}
window.cancelOrder = cancelOrder;

// ── DELETE ORDER ──
function deleteOrder(id) {
  vzConfirm('🗑️', 'DELETE ORDER', 'History ကနေ ဖျက်မှာ သေချာပါသလား?', 'DELETE', async () => {
    try {
      await getDB().collection('orders').doc(id).delete();
      showToast('✓ Order deleted');
    } catch(e) {
      console.error(e);
      showToast('Error: ' + (e.message||'failed'));
    }
  });
}
window.deleteOrder = deleteOrder;

// ── ORDER DETAIL MODAL ──
function showModal(encoded) {
  const o  = JSON.parse(decodeURIComponent(encoded));
  const pl = { cod:'🚚 Cash on Delivery', kbzpay:'📱 KBZPay', wavepay:'💜 WavePay' };

  const items = (o.items||[]).map(i => `
    <div style="display:flex;align-items:center;gap:0.8rem;padding:0.7rem 0;border-bottom:1px solid rgba(0,230,118,0.06);">
      <span style="font-size:1.4rem;">${i.icon||'📦'}</span>
      <span style="flex:1;font-size:0.9rem;color:var(--white);">${i.name}</span>
      <span style="font-size:0.85rem;color:var(--gray);">x${i.qty}</span>
      <span style="font-family:var(--font-display);font-size:0.85rem;font-weight:700;color:var(--green);">${(i.price*i.qty).toLocaleString()} MMK</span>
    </div>`).join('');

  const row = (k,v) => `
    <div style="display:flex;justify-content:space-between;padding:0.6rem 0;border-bottom:1px solid rgba(0,230,118,0.06);font-size:0.95rem;">
      <span style="color:var(--gray);">${k}</span>
      <span style="color:var(--white);font-weight:600;text-align:right;">${v}</span>
    </div>`;

  const overlay = document.createElement('div');
  overlay.id = 'orderModal';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.78);backdrop-filter:blur(5px);z-index:200;display:flex;align-items:center;justify-content:center;padding:1.5rem;animation:fadeIn 0.2s ease;';

  overlay.innerHTML = `
    <div style="background:var(--card);border:1px solid var(--border);border-radius:18px;padding:2rem;width:100%;max-width:460px;max-height:88vh;overflow-y:auto;animation:slideUp 0.25s ease;box-shadow:0 24px 64px rgba(0,0,0,0.5);">

      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.2rem;padding-bottom:1rem;border-bottom:1px solid var(--border);">
        <span style="font-family:var(--font-display);font-size:0.85rem;font-weight:700;letter-spacing:2px;color:var(--green);">ORDER DETAILS</span>
        <button onclick="closeModal()" style="background:transparent;border:none;color:var(--gray);font-size:1.3rem;cursor:pointer;padding:4px 8px;border-radius:6px;">✕</button>
      </div>

      <div style="text-align:center;margin-bottom:1.2rem;">
        <span class="status-badge status-${o.status||'pending'}" style="font-size:0.8rem;padding:0.5rem 1.4rem;">${statusLabel(o.status)}</span>
      </div>

      <div style="font-family:var(--font-display);font-size:0.65rem;font-weight:700;letter-spacing:2px;color:var(--gray);margin:1rem 0 0.5rem;">ORDER INFO</div>
      ${row('Order ID','<span style="color:var(--green);">'+( o.orderId||'—')+'</span>')}
      ${row('Date', o.date||'—')}
      ${row('Payment', pl[o.payment]||o.payment||'—')}

      <div style="font-family:var(--font-display);font-size:0.65rem;font-weight:700;letter-spacing:2px;color:var(--gray);margin:1rem 0 0.5rem;">DELIVERY</div>
      ${row('Name', o.name||'—')}
      ${row('Phone', o.phone||'—')}
      ${row('Township', o.township||'—')}
      ${row('Address', o.address||'—')}
      ${o.note ? row('Note', o.note) : ''}

      <div style="font-family:var(--font-display);font-size:0.65rem;font-weight:700;letter-spacing:2px;color:var(--gray);margin:1rem 0 0.5rem;">ITEMS</div>
      ${items}

      <div style="display:flex;justify-content:space-between;align-items:center;padding:1rem 0 0;margin-top:0.5rem;border-top:1px solid var(--border);">
        <div>
          <div style="font-family:var(--font-display);font-size:0.85rem;font-weight:700;color:var(--white);">TOTAL</div>
          <div style="font-size:0.82rem;color:var(--gray);margin-top:0.2rem;">Subtotal ${(o.subtotal||0).toLocaleString()} + Delivery ${(o.deliveryFee||0).toLocaleString()} MMK</div>
        </div>
        <div style="font-family:var(--font-display);font-size:1.2rem;font-weight:900;color:var(--green);">${(o.total||0).toLocaleString()} MMK</div>
      </div>
    </div>`;

  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
}
window.showModal = showModal;

function closeModal() { document.getElementById('orderModal')?.remove(); }
window.closeModal = closeModal;

// ── LOGOUT ──
function logoutUser() {
  if (_unsubscribe) _unsubscribe();
  localStorage.removeItem('vz_user');
  localStorage.removeItem('vz_token');
  window.location.href = 'login.html';
}
window.logoutUser = logoutUser;

// ── CONFIRM DIALOG ──
function vzConfirm(icon, title, msg, confirmText, onConfirm) {
  const o = document.createElement('div');
  o.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.8);backdrop-filter:blur(4px);z-index:300;display:flex;align-items:center;justify-content:center;padding:1.5rem;';
  o.innerHTML = `
    <div style="background:var(--card);border:1px solid var(--border);border-radius:16px;padding:2rem;max-width:300px;width:100%;text-align:center;box-shadow:0 24px 48px rgba(0,0,0,0.5);">
      <div style="font-size:2.5rem;margin-bottom:0.8rem;">${icon}</div>
      <div style="font-family:var(--font-display);font-size:0.95rem;font-weight:700;color:var(--white);margin-bottom:0.5rem;">${title}</div>
      <div style="font-size:0.9rem;color:var(--gray);margin-bottom:1.5rem;line-height:1.5;">${msg}</div>
      <div style="display:flex;gap:0.8rem;">
        <button id="vNo"  style="flex:1;background:transparent;border:1px solid var(--border);border-radius:8px;padding:0.8rem;color:var(--gray);font-family:var(--font-display);font-size:0.72rem;font-weight:600;letter-spacing:1px;cursor:pointer;">BACK</button>
        <button id="vYes" style="flex:1;background:#ff5252;border:none;border-radius:8px;padding:0.8rem;color:#fff;font-family:var(--font-display);font-size:0.72rem;font-weight:700;letter-spacing:1px;cursor:pointer;">${confirmText}</button>
      </div>
    </div>`;
  document.body.appendChild(o);
  o.querySelector('#vNo').onclick  = () => o.remove();
  o.querySelector('#vYes').onclick = () => { o.remove(); onConfirm(); };
}

// ── TOAST ──
function showToast(msg) {
  const ex = document.getElementById('pToast');
  if (ex) ex.remove();
  const t = document.createElement('div');
  t.id = 'pToast';
  t.textContent = msg;
  t.style.cssText = 'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%) translateY(80px);background:var(--card);border:1px solid var(--green);color:var(--green);font-family:var(--font-display);font-size:0.8rem;font-weight:600;letter-spacing:1px;padding:0.8rem 1.5rem;border-radius:10px;z-index:999;transition:transform 0.3s,opacity 0.3s;opacity:0;white-space:nowrap;';
  document.body.appendChild(t);
  requestAnimationFrame(() => { t.style.transform='translateX(-50%) translateY(0)'; t.style.opacity='1'; });
  setTimeout(() => { t.style.transform='translateX(-50%) translateY(80px)'; t.style.opacity='0'; setTimeout(()=>t.remove(),300); }, 2500);
}
