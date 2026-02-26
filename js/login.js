// =============================================
// VIBEZEE — Login JS (Firebase Auth Compat)
// =============================================

// ── TAB SWITCH ──
function switchTab(tab) {
  const loginForm = document.getElementById('formLogin');
  const regForm   = document.getElementById('formRegister');
  const tabLogin  = document.getElementById('tabLogin');
  const tabReg    = document.getElementById('tabRegister');
  const indicator = document.getElementById('tabIndicator');
  clearMessage();
  if (tab === 'login') {
    loginForm.style.display = 'flex';
    regForm.style.display   = 'none';
    tabLogin.classList.add('active');
    tabReg.classList.remove('active');
    indicator.classList.remove('right');
  } else {
    loginForm.style.display = 'none';
    regForm.style.display   = 'flex';
    tabLogin.classList.remove('active');
    tabReg.classList.add('active');
    indicator.classList.add('right');
  }
}
window.switchTab = switchTab;

// ── LOGIN ──
async function handleLogin() {
  const email    = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const btn      = document.getElementById('btnLogin');

  clearMessage();
  clearErrors(['loginEmail','loginPassword']);

  if (!email || !isValidEmail(email)) { setError('loginEmail', true); showMessage('Email မှန်မှန် ထည့်ပါ။', 'error'); return; }
  if (!password || password.length < 6) { setError('loginPassword', true); showMessage('Password အနည်းဆုံး 6 လုံး ထည့်ပါ။', 'error'); return; }

  setLoading(btn, true);
  try {
    const userCred = await firebase.auth().signInWithEmailAndPassword(email, password);
    const user = userCred.user;
    const name = user.displayName || email.split('@')[0] || 'User';
    localStorage.setItem('vz_user', JSON.stringify({
      uid: user.uid, name, email: user.email, role: 'customer'
    }));
    showMessage('✓ Login အောင်မြင်သည်! Redirecting...', 'success');
    setTimeout(() => window.location.href = 'index.html', 1200);
  } catch (err) {
    showMessage(firebaseError(err.code), 'error');
    setLoading(btn, false);
  }
}
window.handleLogin = handleLogin;

// ── REGISTER ──
async function handleRegister() {
  const name     = document.getElementById('regName').value.trim();
  const email    = document.getElementById('regEmail').value.trim();
  const phone    = document.getElementById('regPhone').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirm  = document.getElementById('regConfirm').value;
  const agreed   = document.getElementById('agreeTerms').checked;
  const btn      = document.getElementById('btnRegister');

  clearMessage();
  clearErrors(['regName','regEmail','regPhone','regPassword','regConfirm']);

  let valid = true;
  if (!name || name.length < 2)        { setError('regName', true);     valid = false; }
  if (!email || !isValidEmail(email))   { setError('regEmail', true);    valid = false; }
  if (!phone || phone.length < 9)       { setError('regPhone', true);    valid = false; }
  if (!password || password.length < 8) { setError('regPassword', true); valid = false; }
  if (password !== confirm)             { setError('regConfirm', true);  valid = false; showMessage('Password တွေ မတူဘူး။', 'error'); return; }
  if (!agreed) { showMessage('Terms & Conditions သဘောတူပါ။', 'error'); return; }
  if (!valid)  { showMessage('Fields အားလုံး မှန်မှန်ကန်ကန် ဖြည့်ပါ။', 'error'); return; }

  setLoading(btn, true);
  try {
    const userCred = await firebase.auth().createUserWithEmailAndPassword(email, password);
    const user = userCred.user;
    await user.updateProfile({ displayName: name });
    await firebase.firestore().collection('users').doc(user.uid).set({
      uid: user.uid, name, email, phone, role: 'customer',
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    showMessage('✓ Account ဖွင့်ပြီးပါပြီ! Login ဝင်ပါ။', 'success');
    setTimeout(() => switchTab('login'), 1500);
  } catch (err) {
    showMessage(firebaseError(err.code), 'error');
    setLoading(btn, false);
  }
}
window.handleRegister = handleRegister;

// ── PASSWORD STRENGTH ──
function checkPasswordStrength(val) {
  const bar   = document.getElementById('pwBar');
  const label = document.getElementById('pwLabel');
  if (!bar || !label) return;
  bar.className = 'pw-bar';
  if (!val) { label.textContent = ''; return; }
  const score = [
    val.length >= 8,
    /[A-Z]/.test(val),
    /[0-9]/.test(val),
    /[^A-Za-z0-9]/.test(val),
  ].filter(Boolean).length;
  if (score <= 1)      { bar.classList.add('weak');   label.textContent = 'Weak ✗';   label.style.color = '#ff5252'; }
  else if (score <= 2) { bar.classList.add('medium'); label.textContent = 'Medium';   label.style.color = '#ffd740'; }
  else                 { bar.classList.add('strong'); label.textContent = 'Strong ✓'; label.style.color = '#00e676'; }
}
window.checkPasswordStrength = checkPasswordStrength;

function togglePassword(id, btn) {
  const input = document.getElementById(id);
  if (!input) return;
  input.type = input.type === 'password' ? 'text' : 'password';
  btn.textContent = input.type === 'password' ? '👁' : '🙈';
}
window.togglePassword = togglePassword;

// ── FIREBASE ERRORS ──
function firebaseError(code) {
  const map = {
    'auth/user-not-found':         'Email မှတ်ပုံတင်မထားဘူး။',
    'auth/wrong-password':         'Password မှားနေတယ်။',
    'auth/email-already-in-use':   'Email သုံးပြီးသား ရှိတယ်။ Login ဝင်ပါ။',
    'auth/weak-password':          'Password အနည်းဆုံး 8 လုံး ထည့်ပါ။',
    'auth/invalid-email':          'Email format မမှန်ဘူး။',
    'auth/invalid-credential':     'Email သို့မဟုတ် Password မှားနေတယ်။',
    'auth/too-many-requests':      'ကြိုးစားမှု အများကြီး။ နောက်မှ ပြန်ကြိုးစားပါ။',
    'auth/network-request-failed': 'Network ပြဿနာ ရှိသည်။',
  };
  return map[code] || 'တစ်ခုခု မှားသွားတယ်။ ထပ်ကြိုးစားပါ။';
}

// ── HELPERS ──
function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

function setError(id, isError) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle('error',   isError);
  el.classList.toggle('success', !isError);
}
function clearErrors(ids) {
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('error', 'success');
  });
}
function showMessage(msg, type) {
  const el = document.getElementById('authMessage');
  if (!el) return;
  el.textContent = msg;
  el.className = 'auth-message ' + type;
  el.style.display = 'block';
}
function clearMessage() {
  const el = document.getElementById('authMessage');
  if (el) el.style.display = 'none';
}
function setLoading(btn, loading) {
  if (!btn) return;
  btn.disabled = loading;
  const t = btn.querySelector('.btn-text');
  const l = btn.querySelector('.btn-loader');
  const a = btn.querySelector('.btn-arrow');
  if (t) t.style.display = loading ? 'none' : 'inline';
  if (l) l.style.display = loading ? 'inline' : 'none';
  if (a) a.style.display = loading ? 'none'   : 'inline';
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', function() {
  if (window.location.hash === '#register') switchTab('register');
  const cart = JSON.parse(localStorage.getItem('vz_cart') || '[]');
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = cart.length);
});

// Enter key
document.addEventListener('keydown', function(e) {
  if (e.key !== 'Enter') return;
  const loginVisible = document.getElementById('formLogin')?.style.display !== 'none';
  if (loginVisible) handleLogin(); else handleRegister();
});
