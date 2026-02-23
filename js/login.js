// =============================================
// VIBEZEE — Login JS
// =============================================

// ── TAB SWITCH ──
function switchTab(tab) {
  const loginForm  = document.getElementById('formLogin');
  const regForm    = document.getElementById('formRegister');
  const tabLogin   = document.getElementById('tabLogin');
  const tabReg     = document.getElementById('tabRegister');
  const indicator  = document.getElementById('tabIndicator');

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

// Check URL hash on load (#register)
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.hash === '#register') switchTab('register');
  spawnParticles();
  updateCartCount();
});

// ── LOGIN ──
async function handleLogin() {
  const email    = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const btn      = document.getElementById('btnLogin');

  clearMessage();
  clearErrors(['loginEmail', 'loginPassword']);

  // Validate
  let valid = true;
  if (!email || !isValidEmail(email)) {
    setError('loginEmail', true);
    valid = false;
  }
  if (!password || password.length < 6) {
    setError('loginPassword', true);
    valid = false;
  }
  if (!valid) {
    showMessage('Please check your email and password.', 'error');
    return;
  }

  setLoading(btn, true);

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('vz_token', data.token);
      localStorage.setItem('vz_user', JSON.stringify(data.user));
      showMessage('✓ Login successful! Redirecting...', 'success');
      setTimeout(() => window.location.href = 'index.html', 1200);
    } else {
      const err = await res.json();
      showMessage(err.message || 'Invalid email or password.', 'error');
    }
  } catch (e) {
    // Demo mode — backend not connected
    demoLogin(email);
  } finally {
    setLoading(btn, false);
  }
}

function demoLogin(email) {
  // Demo mode for frontend testing
  const demoUser = { name: 'Demo User', email, role: 'customer' };
  localStorage.setItem('vz_token', 'demo-token-123');
  localStorage.setItem('vz_user', JSON.stringify(demoUser));
  showMessage('✓ Welcome back! Redirecting...', 'success');
  setTimeout(() => window.location.href = 'index.html', 1200);
}

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

  if (!name || name.length < 2) { setError('regName', true); valid = false; }
  if (!email || !isValidEmail(email)) { setError('regEmail', true); valid = false; }
  if (!phone || phone.length < 9) { setError('regPhone', true); valid = false; }
  if (!password || password.length < 8) { setError('regPassword', true); valid = false; }
  if (password !== confirm) {
    setError('regConfirm', true);
    showMessage('Passwords do not match.', 'error');
    return;
  }
  if (!agreed) {
    showMessage('Please agree to Terms & Conditions.', 'error');
    return;
  }
  if (!valid) {
    showMessage('Please fill in all required fields correctly.', 'error');
    return;
  }

  setLoading(btn, true);

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password }),
    });

    if (res.ok) {
      showMessage('✓ Account created! Please login.', 'success');
      setTimeout(() => switchTab('login'), 1500);
    } else {
      const err = await res.json();
      showMessage(err.message || 'Registration failed. Try again.', 'error');
    }
  } catch (e) {
    // Demo mode
    showMessage('✓ Account created! Please login.', 'success');
    setTimeout(() => switchTab('login'), 1500);
  } finally {
    setLoading(btn, false);
  }
}

// ── PASSWORD STRENGTH ──
function checkPasswordStrength(val) {
  const bar   = document.getElementById('pwBar');
  const label = document.getElementById('pwLabel');
  if (!bar || !label) return;

  bar.className = 'pw-bar';

  if (!val) { label.textContent = ''; return; }

  const hasUpper  = /[A-Z]/.test(val);
  const hasNum    = /[0-9]/.test(val);
  const hasSymbol = /[^A-Za-z0-9]/.test(val);
  const long      = val.length >= 8;

  const score = [long, hasUpper, hasNum, hasSymbol].filter(Boolean).length;

  if (score <= 1) {
    bar.classList.add('weak');
    label.textContent = 'Weak';
    label.style.color = '#ef4444';
  } else if (score <= 2) {
    bar.classList.add('medium');
    label.textContent = 'Medium';
    label.style.color = '#f59e0b';
  } else {
    bar.classList.add('strong');
    label.textContent = 'Strong ✓';
    label.style.color = '#22c55e';
  }
}

// ── TOGGLE PASSWORD VISIBILITY ──
function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🙈';
  } else {
    input.type = 'password';
    btn.textContent = '👁';
  }
}

// ── HELPERS ──
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setError(id, hasError) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle('error', hasError);
  el.classList.toggle('success', !hasError);
}

function clearErrors(ids) {
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.classList.remove('error', 'success'); }
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
  const text   = btn.querySelector('.btn-text');
  const loader = btn.querySelector('.btn-loader');
  const arrow  = btn.querySelector('.btn-arrow');
  btn.disabled = loading;
  if (text)   text.style.display   = loading ? 'none' : 'inline';
  if (loader) loader.style.display = loading ? 'inline' : 'none';
  if (arrow)  arrow.style.display  = loading ? 'none' : 'inline';
}

// ── MOBILE MENU ──
function toggleMenu() {
  document.getElementById('mobileMenu')?.classList.toggle('open');
}

// ── PARTICLES ──
function spawnParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.animationDuration = (Math.random() * 8 + 6) + 's';
    p.style.animationDelay = (Math.random() * 8) + 's';
    p.style.width = p.style.height = (Math.random() * 2 + 1) + 'px';
    container.appendChild(p);
  }
}

// Enter key support
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const loginVisible = document.getElementById('formLogin')?.style.display !== 'none';
  if (loginVisible) handleLogin();
  else handleRegister();
});
