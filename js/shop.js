// =============================================
// VIBEZEE — Shop JS (Products + Filter + Search)
// =============================================

// ── PRODUCT DATA ──
const PRODUCTS = [
  // Sound Cards
  { id: 101, name: 'Creative Sound Blaster X3', cat: 'sound-cards', icon: '🔊', price: 85000, badge: 'HOT', rating: 5, reviews: 48 },
  { id: 102, name: 'ASUS Xonar SE Sound Card', cat: 'sound-cards', icon: '🔊', price: 65000, badge: '', rating: 4, reviews: 32 },
  { id: 103, name: 'StarTech 7.1 USB Audio Card', cat: 'sound-cards', icon: '🔊', price: 28000, badge: 'SALE', rating: 4, reviews: 19 },

  // Microphones
  { id: 201, name: 'HyperX QuadCast USB Mic', cat: 'microphones', icon: '🎙', price: 120000, badge: 'HOT', rating: 5, reviews: 91 },
  { id: 202, name: 'Blue Snowball iCE Condenser', cat: 'microphones', icon: '🎙', price: 55000, badge: '', rating: 4, reviews: 67 },
  { id: 203, name: 'Fifine K678 USB Microphone', cat: 'microphones', icon: '🎙', price: 32000, badge: 'NEW', rating: 4, reviews: 44 },
  { id: 204, name: 'BOYA BY-PM500 Studio Mic', cat: 'microphones', icon: '🎙', price: 48000, badge: '', rating: 4, reviews: 28 },

  // Earphones
  { id: 301, name: 'JBL Quantum 50 Gaming Earbuds', cat: 'earphones', icon: '🎧', price: 35000, badge: '', rating: 5, reviews: 128 },
  { id: 302, name: 'Razer Hammerhead V2', cat: 'earphones', icon: '🎧', price: 45000, badge: 'HOT', rating: 5, reviews: 203 },
  { id: 303, name: 'SteelSeries Tusq Earbuds', cat: 'earphones', icon: '🎧', price: 28000, badge: 'NEW', rating: 4, reviews: 56 },
  { id: 304, name: 'Samsung AKG Wired Earphones', cat: 'earphones', icon: '🎧', price: 18000, badge: 'SALE', rating: 4, reviews: 74 },

  // Keyboards
  { id: 401, name: 'Redragon K552 Mechanical TKL', cat: 'keyboards', icon: '⌨️', price: 55000, badge: 'HOT', rating: 5, reviews: 186 },
  { id: 402, name: 'Havit HV-KB395L RGB Keyboard', cat: 'keyboards', icon: '⌨️', price: 38000, badge: '', rating: 4, reviews: 92 },
  { id: 403, name: 'MechStrike Pro Full-Size RGB', cat: 'keyboards', icon: '⌨️', price: 85000, badge: 'NEW', rating: 5, reviews: 43 },
  { id: 404, name: 'Tecware Phantom TKL Mech', cat: 'keyboards', icon: '⌨️', price: 65000, badge: '', rating: 4, reviews: 61 },

  // Mouse
  { id: 501, name: 'Logitech G302 Gaming Mouse', cat: 'mouse', icon: '🖱', price: 45000, badge: '', rating: 5, reviews: 204 },
  { id: 502, name: 'Razer DeathAdder V3', cat: 'mouse', icon: '🖱', price: 95000, badge: 'HOT', rating: 5, reviews: 318 },
  { id: 503, name: 'Redragon M711 Cobra Mouse', cat: 'mouse', icon: '🖱', price: 25000, badge: 'SALE', rating: 4, reviews: 143 },
  { id: 504, name: 'Havit MS1016 RGB Gaming Mouse', cat: 'mouse', icon: '🖱', price: 20000, badge: '', rating: 4, reviews: 87 },

  // Joysticks
  { id: 601, name: 'Xbox Wireless Controller', cat: 'joysticks', icon: '🕹', price: 85000, badge: 'HOT', rating: 5, reviews: 256 },
  { id: 602, name: 'PS5 DualSense Controller', cat: 'joysticks', icon: '🕹', price: 115000, badge: '', rating: 5, reviews: 198 },
  { id: 603, name: 'Logitech F310 Gamepad', cat: 'joysticks', icon: '🕹', price: 38000, badge: 'SALE', rating: 4, reviews: 76 },

  // Memory Sticks
  { id: 701, name: 'SanDisk Ultra 64GB USB 3.0', cat: 'memory', icon: '💾', price: 18000, badge: '', rating: 5, reviews: 312 },
  { id: 702, name: 'Kingston DataTraveler 128GB', cat: 'memory', icon: '💾', price: 28000, badge: 'HOT', rating: 5, reviews: 224 },
  { id: 703, name: 'Samsung BAR Plus 32GB', cat: 'memory', icon: '💾', price: 12000, badge: '', rating: 4, reviews: 156 },
  { id: 704, name: 'Toshiba TransMemory 256GB', cat: 'memory', icon: '💾', price: 45000, badge: 'NEW', rating: 4, reviews: 38 },

  // Hard Disks
  { id: 801, name: 'Seagate Barracuda 1TB HDD', cat: 'harddisk', icon: '🗄', price: 55000, badge: '', rating: 5, reviews: 187 },
  { id: 802, name: 'WD Blue 2TB Internal HDD', cat: 'harddisk', icon: '🗄', price: 85000, badge: 'HOT', rating: 5, reviews: 143 },
  { id: 803, name: 'Samsung 870 EVO 500GB SSD', cat: 'harddisk', icon: '🗄', price: 95000, badge: 'NEW', rating: 5, reviews: 211 },
  { id: 804, name: 'Kingston A400 240GB SSD', cat: 'harddisk', icon: '🗄', price: 48000, badge: 'SALE', rating: 4, reviews: 96 },
  { id: 805, name: 'Toshiba Canvio 1TB Portable', cat: 'harddisk', icon: '🗄', price: 68000, badge: '', rating: 4, reviews: 74 },

  // USB Type-C
  { id: 901, name: 'Anker 100W USB-C Charging Cable', cat: 'usbc', icon: '🔌', price: 18000, badge: 'HOT', rating: 5, reviews: 445 },
  { id: 902, name: 'Baseus 7-in-1 USB-C Hub', cat: 'usbc', icon: '🔌', price: 45000, badge: '', rating: 5, reviews: 213 },
  { id: 903, name: 'Ugreen USB-C to HDMI Adapter', cat: 'usbc', icon: '🔌', price: 22000, badge: 'NEW', rating: 4, reviews: 87 },
  { id: 904, name: 'Aukey 5-Port USB-C Hub', cat: 'usbc', icon: '🔌', price: 35000, badge: '', rating: 4, reviews: 64 },
];

// ── STATE ──
let activeCategory = 'all';
let activeSort = 'default';
let maxPrice = 500000;
let searchQuery = '';

// ── INIT ──
function init() {
  // Check URL param
  const params = new URLSearchParams(window.location.search);
  const catParam = params.get('cat');
  if (catParam) {
    activeCategory = catParam;
    document.querySelectorAll('.filter-btn[data-cat]').forEach(b => {
      b.classList.toggle('active', b.dataset.cat === catParam);
    });
  }
  updateCounts();
  renderProducts();
  initEvents();
}

// ── COUNT BADGES ──
function updateCounts() {
  const allCount = document.getElementById('count-all');
  if (allCount) allCount.textContent = PRODUCTS.length;
  const cats = ['sound-cards','microphones','earphones','keyboards','mouse','joysticks','memory','harddisk','usbc'];
  cats.forEach(c => {
    const el = document.getElementById('count-' + c);
    if (el) el.textContent = PRODUCTS.filter(p => p.cat === c).length;
  });
}

// ── RENDER ──
function renderProducts() {
  let filtered = [...PRODUCTS];

  // Category
  if (activeCategory !== 'all') {
    filtered = filtered.filter(p => p.cat === activeCategory);
  }

  // Price
  filtered = filtered.filter(p => p.price <= maxPrice);

  // Search
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q));
  }

  // Sort
  if (activeSort === 'price-asc') filtered.sort((a,b) => a.price - b.price);
  else if (activeSort === 'price-desc') filtered.sort((a,b) => b.price - a.price);
  else if (activeSort === 'name-asc') filtered.sort((a,b) => a.name.localeCompare(b.name));

  const grid = document.getElementById('productsGrid');
  const empty = document.getElementById('emptyState');
  const countEl = document.getElementById('resultCount');

  if (countEl) countEl.textContent = filtered.length;

  if (filtered.length === 0) {
    grid.innerHTML = '';
    grid.style.display = 'none';
    empty.style.display = 'block';
    return;
  }
  grid.style.display = 'grid';
  empty.style.display = 'none';

  grid.innerHTML = filtered.map((p, i) => `
    <div class="product-card" style="animation-delay:${i * 0.05}s" data-id="${p.id}">
      ${p.badge ? `<div class="product-badge ${p.badge === 'NEW' ? 'new' : p.badge === 'SALE' ? 'sale' : ''}">${p.badge}</div>` : ''}
      <div class="product-img-wrap">
        <div class="product-img-placeholder">${p.icon}</div>
      </div>
      <div class="product-info">
        <span class="product-cat">${catLabel(p.cat)}</span>
        <h3 class="product-name">${p.name}</h3>
        <div class="product-rating">${stars(p.rating)} <span>(${p.reviews})</span></div>
        <div class="product-price-row">
          <span class="product-price">${p.price.toLocaleString()} MMK</span>
          <button class="btn-cart" onclick="addToCart(${p.id})">+ CART</button>
        </div>
      </div>
      <div class="product-glow"></div>
    </div>
  `).join('');
}

function stars(n) {
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

function catLabel(cat) {
  const map = {
    'sound-cards': 'Sound Cards',
    'microphones': 'Microphones',
    'earphones': 'Earphones',
    'keyboards': 'Keyboards',
    'mouse': 'Mouse',
    'joysticks': 'Joysticks',
    'memory': 'Memory Sticks',
    'harddisk': 'Hard Disks',
    'usbc': 'USB Type-C',
  };
  return map[cat] || cat;
}

// ── EVENTS ──
function initEvents() {
  // Category filter
  document.querySelectorAll('.filter-btn[data-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn[data-cat]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.cat;
      renderProducts();
    });
  });

  // Sort filter
  document.querySelectorAll('.filter-btn[data-sort]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn[data-sort]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeSort = btn.dataset.sort;
      renderProducts();
    });
  });

  // Price slider
  const slider = document.getElementById('priceRange');
  const priceVal = document.getElementById('priceVal');
  if (slider) {
    slider.addEventListener('input', () => {
      maxPrice = parseInt(slider.value);
      priceVal.textContent = maxPrice.toLocaleString() + ' MMK';
      renderProducts();
    });
  }

  // Search
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchQuery = searchInput.value;
      renderProducts();
    });
  }
}

// ── RESET ──
function resetFilters() {
  activeCategory = 'all';
  activeSort = 'default';
  maxPrice = 500000;
  searchQuery = '';

  document.querySelectorAll('.filter-btn[data-cat]').forEach(b => b.classList.toggle('active', b.dataset.cat === 'all'));
  document.querySelectorAll('.filter-btn[data-sort]').forEach(b => b.classList.toggle('active', b.dataset.sort === 'default'));

  const slider = document.getElementById('priceRange');
  const priceVal = document.getElementById('priceVal');
  if (slider) slider.value = 500000;
  if (priceVal) priceVal.textContent = '500,000 MMK';

  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = '';

  renderProducts();
}

// ── SIDEBAR MOBILE TOGGLE ──
function toggleSidebar() {
  document.querySelector('.sidebar').classList.toggle('open');
}

// ── RUN ──
document.addEventListener('DOMContentLoaded', init);
