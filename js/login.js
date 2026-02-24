// =============================================
// VIBEZEE — Login JS (Firebase Auth)
// =============================================

import { auth, db } from './firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc, setDoc, serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ── TAB SWITCH ──
function switchTab(tab) {
  const loginForm = document.getElementById('formLogin');
  const regForm   = document.getElementById('formRegister');
  const tabLogin  = document.getElementById('tabLogin');
  const tabReg    = document.getElementById('tabRegister');
  const indicator = document.getElementById('tabIndicator');
  clearMessage();
  if (tab === 'login') {
    loginForm.style.display = 'flex'; regForm.style.display = 'none';
    tabLogin.classList.add('active'); tabReg.classList.remove('active');
    indicator.classList.remove('right');
  } else {
    loginForm.style.display = 'none'; regForm.style.display = 'flex';
    tabLogin.classList.remove('active'); tabReg.classList.add('active');
    indicator.classList.add('right');
  }
}
window.switchTab = switchTab;

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.hash === '#register') switchTab('register');
  updateCartCount();
});

// ── LOGIN ──
async function handleLogin() {
  const email    = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const btn      = document.getElementById('btnLogin');
  clearMessage(); clearErrors(['loginEmail','loginPassword']);
  if (!email || !isValidEmail(email)) { setError('loginEmail', true); return; }
  if (!password || password.length < 6) { setError('loginPassword', true); return; }
  setLoading(btn, true);
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const user = userCred.user;
    localStorage.setItem('vz_user', JSON.stringify({ uid: user.uid, name: user.displayName || 'User', email: user.email, role: 'customer' }));
    showMessage('✓ Login successful! Redirecting...', 'success');
    setTimeout(() => window.location.href = 'index.html', 1200);
  } catch (err) {
    showMessage(firebaseError(err.code), 'error');
  } finally {
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
  clearMessage(); clearErrors(['regName','regEmail','regPhone','regPassword','regConfirm']);
  let valid = true;
  if (!name || name.length < 2)         { setError('regName', true);     valid = false; }
  if (!email || !isValidEmail(email))    { setError('regEmail', true);    valid = false; }
  if (!phone || phone.length < 9)        { setError('regPhone', true);    valid = false; }
  if (!password || password.length < 8)  { setError('regPassword', true); valid = false; }
  if (password !== confirm) { setError('regConfirm', true); showMessage('Passwords do not match.', 'error'); return; }
  if (!agreed) { showMessage('Please agree to Terms & Conditions.', 'error'); return; }
  if (!valid)  { showMessage('Please fill in all fields correctly.', 'error'); return; }
  setLoading(btn, true);
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCred.user;
    await updateProfile(user, { displayName: name });
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid, name, email, phone, role: 'customer', createdAt: serverTimestamp(),
    });
    showMessage('✓ Account created! Please login.', 'success');
    setTimeout(() => switchTab('login'), 1500);
  } catch (err) {
    showMessage(firebaseError(err.code), 'error');
  } finally {
    setLoading(btn, false);
  }
}
window.handleRegister = handleRegister;

// ── FIREBASE ERROR MESSAGES ──
function firebaseError(code) {
  const errors = {
    'auth/user-not-found':         'Email မှတ်ပုံတင်မထားဘူး။',
    'auth/wrong-password':         'Password မှားနေတယ်။',
    'auth/email-already-in-use':   'Email အသုံးပြုပြီးသား။ Login ဝင်ပါ။',
    'auth/weak-password':          'Password အနည်းဆုံး 8 လုံး ထည့်ပါ။',
    'auth/invalid-email':          'Email format မမှန်ဘူး။',
    'auth/invalid-credential':     'Email သို့မဟုတ် Password မှားနေတယ်။',
    'auth/too-many-requests':      'ကြိုးစားမှု အများကြီး။ နောက်မှ ပြန်ကြိုးစားပါ။',
    'auth/network-request-failed': 'Network ချိတ်ဆက်မှု ပြဿနာ ရှိသည်။',
  };
  return errors[code] || 'တစ်ခုခု မှားသွားတယ်။ ထပ်ကြိုးစားပါ။';
}

// ── PASSWORD STRENGTH ──
function checkPasswordStrength(val) {
  const bar = document.getElementById('pwBar'); const label = document.getElementById('pwLabel');
  if (!bar || !label) return;
  bar.className = 'pw-bar';
  if (!val) { label.textContent = ''; return; }
  const score = [val.length >= 8, /[A-Z]/.test(val), /[0-9]/.test(val), /[^A-Za-z0-9]/.test(val)].filter(Boolean).length;
  if (score <= 1)      { bar.classList.add('weak');   label.textContent = 'Weak';     label.style.color = '#ef4444'; }
  else if (score <= 2) { bar.classList.add('medium'); label.textContent = 'Medium';   label.style.color = '#f59e0b'; }
  else                 { bar.classList.add('strong'); label.textContent = 'Strong ✓'; label.style.color = '#22c55e'; }
}
window.checkPasswordStrength = checkPasswordStrength;

function togglePassword(id, btn) {
  const input = document.getElementById(id); if (!input) return;
  input.type = input.type === 'password' ? 'text' : 'password';
  btn.textContent = input.type === 'password' ? '👁' : '🙈';
}
window.togglePassword = togglePassword;

function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function setError(id, h) { const el = document.getElementById(id); if (el) { el.classList.toggle('error', h); el.classList.toggle('success', !h); } }
function clearErrors(ids) { ids.forEach(id => { const el = document.getElementById(id); if (el) el.classList.remove('error','success'); }); }
function showMessage(msg, type) { const el = document.getElementById('authMessage'); if (!el) return; el.textContent = msg; el.className = 'auth-message ' + type; el.style.display = 'block'; }
function clearMessage() { const el = document.getElementById('authMessage'); if (el) el.style.display = 'none'; }
function setLoading(btn, loading) {
  if (!btn) return; btn.disabled = loading;
  const t = btn.querySelector('.btn-text'); const l = btn.querySelector('.btn-loader'); const a = btn.querySelector('.btn-arrow');
  if (t) t.style.display = loading ? 'none' : 'inline';
  if (l) l.style.display = loading ? 'inline' : 'none';
  if (a) a.style.display = loading ? 'none' : 'inline';
}
function updateCartCount() { const cart = JSON.parse(localStorage.getItem('vz_cart') || '[]'); document.querySelectorAll('.cart-count').forEach(el => el.textContent = cart.length); }
function toggleMenu() { document.getElementById('mobileMenu')?.classList.toggle('open'); }
window.toggleMenu = toggleMenu;

document.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const loginVisible = document.getElementById('formLogin')?.style.display !== 'none';
  if (loginVisible) handleLogin(); else handleRegister();
});
