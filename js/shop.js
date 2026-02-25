// =============================================
// VIBEZEE — Shop JS
// =============================================

// ── PRODUCT DATA ──
const PRODUCTS = [
  { id:101, name:'Creative Sound Blaster X3',       cat:'sound-cards', icon:'🔊', price:85000,  badge:'HOT',  rating:5, reviews:48  },
  { id:102, name:'ASUS Xonar SE Sound Card',         cat:'sound-cards', icon:'🔊', price:65000,  badge:'',     rating:4, reviews:32  },
  { id:103, name:'StarTech 7.1 USB Audio Card',      cat:'sound-cards', icon:'🔊', price:28000,  badge:'SALE', rating:4, reviews:19  },
  { id:201, name:'HyperX QuadCast USB Mic',          cat:'microphones', icon:'🎙', price:120000, badge:'HOT',  rating:5, reviews:91  },
  { id:202, name:'Blue Snowball iCE Condenser',      cat:'microphones', icon:'🎙', price:55000,  badge:'',     rating:4, reviews:67  },
  { id:203, name:'Fifine K678 USB Microphone',       cat:'microphones', icon:'🎙', price:32000,  badge:'NEW',  rating:4, reviews:44  },
  { id:204, name:'BOYA BY-PM500 Studio Mic',         cat:'microphones', icon:'🎙', price:48000,  badge:'',     rating:4, reviews:28  },
  { id:301, name:'JBL Quantum 50 Gaming Earbuds',    cat:'earphones',   icon:'🎧', price:35000,  badge:'',     rating:5, reviews:128 },
  { id:302, name:'Razer Hammerhead V2',              cat:'earphones',   icon:'🎧', price:45000,  badge:'HOT',  rating:5, reviews:203 },
  { id:303, name:'SteelSeries Tusq Earbuds',         cat:'earphones',   icon:'🎧', price:28000,  badge:'NEW',  rating:4, reviews:56  },
  { id:304, name:'Samsung AKG Wired Earphones',      cat:'earphones',   icon:'🎧', price:18000,  badge:'SALE', rating:4, reviews:74  },
  { id:401, name:'Redragon K552 Mechanical TKL',     cat:'keyboards',   icon:'⌨️', price:55000,  badge:'HOT',  rating:5, reviews:186 },
  { id:402, name:'Havit HV-KB395L RGB Keyboard',     cat:'keyboards',   icon:'⌨️', price:38000,  badge:'',     rating:4, reviews:92  },
  { id:403, name:'MechStrike Pro Full-Size RGB',     cat:'keyboards',   icon:'⌨️', price:85000,  badge:'NEW',  rating:5, reviews:43  },
  { id:404, name:'Tecware Phantom TKL Mech',         cat:'keyboards',   icon:'⌨️', price:65000,  badge:'',     rating:4, reviews:61  },
  { id:501, name:'Logitech G302 Gaming Mouse',       cat:'mouse',       icon:'🖱', price:45000,  badge:'',     rating:5, reviews:204 },
  { id:502, name:'Razer DeathAdder V3',              cat:'mouse',       icon:'🖱', price:95000,  badge:'HOT',  rating:5, reviews:318 },
  { id:503, name:'Redragon M711 Cobra Mouse',        cat:'mouse',       icon:'🖱', price:25000,  badge:'SALE', rating:4, reviews:143 },
  { id:504, name:'Havit MS1016 RGB Gaming Mouse',    cat:'mouse',       icon:'🖱', price:20000,  badge:'',     rating:4, reviews:87  },
  { id:601, name:'Xbox Wireless Controller',         cat:'joysticks',   icon:'🕹', price:85000,  badge:'HOT',  rating:5, reviews:256 },
  { id:602, name:'PS5 DualSense Controller',         cat:'joysticks',   icon:'🕹', price:115000, badge:'',     rating:5, reviews:198 },
  { id:603, name:'Logitech F310 Gamepad',            cat:'joysticks',   icon:'🕹', price:38000,  badge:'SALE', rating:4, reviews:76  },
  { id:701, name:'SanDisk Ultra 64GB USB 3.0',       cat:'memory',      icon:'💾', price:18000,  badge:'',     rating:5, reviews:312 },
  { id:702, name:'Kingston DataTraveler 128GB',      cat:'memory',      icon:'💾', price:28000,  badge:'HOT',  rating:5, reviews:224 },
  { id:703, name:'Samsung BAR Plus 32GB',            cat:'memory',      icon:'💾', price:12000,  badge:'',     rating:4, reviews:156 },
  { id:704, name:'Toshiba TransMemory 256GB',        cat:'memory',      icon:'💾', price:45000,  badge:'NEW',  rating:4, reviews:38  },
  { id:801, name:'Seagate Barracuda 1TB HDD',        cat:'harddisk',    icon:'🗄', price:55000,  badge:'',     rating:5, reviews:187 },
  { id:802, name:'WD Blue 2TB Internal HDD',         cat:'harddisk',    icon:'🗄', price:85000,  badge:'',     rating:5, reviews:143 },
  { id:803, name:'Samsung 870 EVO 500GB SSD',        cat:'harddisk',    icon:'🗄', price:95000,  badge:'HOT',  rating:5, reviews:276 },
  { id:804, name:'Kingston A400 240GB SSD',          cat:'harddisk',    icon:'🗄', price:48000,  badge:'SALE', rating:4, reviews:198 },
  { id:805, name:'Toshiba Canvio 1TB Portable HDD',  cat:'harddisk',    icon:'🗄', price:68000,  badge:'',     rating:4, reviews:112 },
  { id:901, name:'Anker 100W USB-C Charging Cable',  cat:'usbc',        icon:'🔌', price:18000,  badge:'',     rating:5, reviews:421 },
  { id:902, name:'Baseus 7-in-1 USB-C Hub',          cat:'usbc',        icon:'🔌', price:45000,  badge:'HOT',  rating:5, reviews:167 },
  { id:903, name:'Ugreen USB-C to HDMI Adapter',     cat:'usbc',        icon:'🔌', price:22000,  badge:'',     rating:4, reviews:89  },
  { id:904, name:'Aukey 5-Port USB-C Hub',           cat:'usbc',        icon:'🔌', price:35000,  badge:'NEW',  rating:4, reviews:54  },
];

// ── STATE ──
let activeCategory = 'all';
let activeSort     = 'default';
let maxPrice       = 500000;
let searchQuery    = '';

// ── RENDER ──
function renderProducts() {
  let list = [...PRODUCTS];

  if (activeCategory !== 'all') list = list.filter(p => p.cat === activeCategory);
  if (searchQuery) list = list.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  list = list.filter(p => p.price <= maxPrice);

  if (activeSort === 'price-asc')  list.sort((a,b) => a.price - b.price);
  if (activeSort === 'price-desc') list.sort((a,b) => b.price - a.price);
  if (activeSort === 'rating')     list.sort((a,b) => b.rating - a.rating || b.reviews - a.reviews);

  const grid  = document.getElementById('productsGrid');
  const count = document.getElementById('productCount');
  if (!grid) return;

  if (count) count.textContent = list.length;

  if (list.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <div class="no-icon">🔍</div>
        <p>No products found. Try a different filter.</p>
      </div>`;
    return;
  }

  const stars = n => '★'.repeat(n) + '☆'.repeat(5 - n);
  const badgeClass = b => b === 'NEW' ? 'new' : b === 'SALE' ? 'sale' : '';

  grid.innerHTML = list.map(p => `
    <div class="product-card">
      ${p.badge ? `<div class="product-badge ${badgeClass(p.badge)}">${p.badge}</div>` : ''}
      <div class="product-img-wrap">
        <div class="product-img-placeholder">${p.icon}</div>
      </div>
      <div class="product-info">
        <span class="product-cat">${p.cat.replace('-',' ').toUpperCase()}</span>
        <h3 class="product-name">${p.name}</h3>
        <div class="product-rating">${stars(p.rating)} <span>(${p.reviews})</span></div>
        <div class="product-price-row">
          <span class="product-price">${p.price.toLocaleString()} MMK</span>
          <button class="btn-cart" onclick="addToCart(${p.id})">+ CART</button>
        </div>
      </div>
    </div>
  `).join('');
}

// ── FILTER BUTTONS ──
function setCategory(cat, btn) {
  activeCategory = cat;
  document.querySelectorAll('.filter-btn[data-cat]').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderProducts();
}

function setSort(sort, btn) {
  activeSort = sort;
  document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderProducts();
}

function resetFilters() {
  activeCategory = 'all';
  activeSort     = 'default';
  maxPrice       = 500000;
  searchQuery    = '';

  document.querySelectorAll('.filter-btn[data-cat]').forEach(b => b.classList.toggle('active', b.dataset.cat === 'all'));
  document.querySelectorAll('.sort-btn').forEach(b => b.classList.toggle('active', b.dataset.sort === 'default'));

  const slider   = document.getElementById('priceRange');
  const priceVal = document.getElementById('priceVal');
  const search   = document.getElementById('searchInput');
  if (slider)   slider.value = 500000;
  if (priceVal) priceVal.textContent = '500,000 MMK';
  if (search)   search.value = '';

  renderProducts();
}

// ── SIDEBAR TOGGLE (mobile) ──
function toggleSidebar() {
  document.getElementById('shopSidebar')?.classList.toggle('open');
}
window.toggleSidebar = toggleSidebar;

// ── INIT ──
function init() {
  // URL param category
  const params = new URLSearchParams(window.location.search);
  const urlCat = params.get('cat');
  if (urlCat) {
    activeCategory = urlCat;
    const btn = document.querySelector(`.filter-btn[data-cat="${urlCat}"]`);
    if (btn) {
      document.querySelectorAll('.filter-btn[data-cat]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
  }

  // Price range
  const slider   = document.getElementById('priceRange');
  const priceVal = document.getElementById('priceVal');
  if (slider) {
    slider.addEventListener('input', function() {
      maxPrice = Number(this.value);
      if (priceVal) priceVal.textContent = Number(this.value).toLocaleString() + ' MMK';
      renderProducts();
    });
  }

  // Search
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      searchQuery = this.value;
      renderProducts();
    });
  }

  // Filter buttons
  document.querySelectorAll('.filter-btn[data-cat]').forEach(btn => {
    btn.addEventListener('click', function() {
      setCategory(this.dataset.cat, this);
    });
  });

  // Sort buttons
  document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      setSort(this.dataset.sort, this);
    });
  });

  renderProducts();
}

document.addEventListener('DOMContentLoaded', init);
