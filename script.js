// DATA PRODUK
const productsData = [
    {
        id: 1,
        name: "Mobile Legends 86 Diamond",
        price: 25000,
        originalPrice: 30000,
        category: "mobile-legends",
        icon: "fas fa-gem",
        badge: "TERLARIS",
        sold: 1250
    },
    {
        id: 2,
        name: "Free Fire 70 Diamond",
        price: 12000,
        originalPrice: 15000,
        category: "free-fire",
        icon: "fas fa-fire",
        badge: "PROMO",
        sold: 890
    },
    {
        id: 3,
        name: "PUBG Mobile 60 UC",
        price: 15000,
        originalPrice: 18000,
        category: "pubg",
        icon: "fas fa-crosshairs",
        badge: "BARU",
        sold: 450
    },
    {
        id: 4,
        name: "Valorant 125 VP",
        price: 40000,
        originalPrice: 45000,
        category: "valorant",
        icon: "fas fa-bomb",
        badge: "",
        sold: 320
    },
    {
        id: 5,
        name: "Steam Wallet Rp 50.000",
        price: 48000,
        originalPrice: 50000,
        category: "voucher",
        icon: "fas fa-steam",
        badge: "HEMAT",
        sold: 760
    },
    {
        id: 6,
        name: "Google Play Voucher Rp 100.000",
        price: 95000,
        originalPrice: 100000,
        category: "voucher",
        icon: "fab fa-google-play",
        badge: "",
        sold: 540
    },
    {
        id: 7,
        name: "Mobile Legends 172 Diamond",
        price: 50000,
        originalPrice: 55000,
        category: "mobile-legends",
        icon: "fas fa-gem",
        badge: "TERLARIS",
        sold: 980
    },
    {
        id: 8,
        name: "Akun Valorant Rank Gold",
        price: 120000,
        originalPrice: 150000,
        category: "valorant",
        icon: "fas fa-user-secret",
        badge: "DISKON",
        sold: 45
    },
    {
        id: 9,
        name: "Genshin Impact 330 Genesis Crystal",
        price: 80000,
        originalPrice: 90000,
        category: "voucher",
        icon: "fas fa-cloud",
        badge: "BARU",
        sold: 210
    },
    {
        id: 10,
        name: "Spotify Premium 3 Bulan",
        price: 45000,
        originalPrice: 60000,
        category: "voucher",
        icon: "fab fa-spotify",
        badge: "HEMAT",
        sold: 320
    },
    {
        id: 11,
        name: "Call of Duty Mobile 80 CP",
        price: 20000,
        originalPrice: 25000,
        category: "mobile-legends",
        icon: "fas fa-crosshairs",
        badge: "",
        sold: 180
    },
    {
        id: 12,
        name: "Netflix Premium 1 Bulan",
        price: 55000,
        originalPrice: 65000,
        category: "voucher",
        icon: "fas fa-film",
        badge: "TERLARIS",
        sold: 420
    }
];

// VARIABLES
let cart = JSON.parse(localStorage.getItem('jevannCart')) || [];
let currentFilter = 'all';

// INITIALIZE
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    updateCartDisplay();
    setupEventListeners();
    setupNavigation();
});

// LOAD PRODUCTS
function loadProducts(filter = 'all') {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    currentFilter = filter;
    const filteredProducts = filter === 'all' 
        ? productsData 
        : productsData.filter(p => p.category === filter);
    
    productsGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #888;">
                <i class="fas fa-gamepad" style="font-size: 48px; margin-bottom: 20px;"></i>
                <h3>Tidak ada produk</h3>
            </div>
        `;
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            <div class="product-image">
                <i class="${product.icon}"></i>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">
                    <span class="current-price">Rp ${product.price.toLocaleString('id-ID')}</span>
                    ${product.originalPrice ? 
                        `<span class="original-price">Rp ${product.originalPrice.toLocaleString('id-ID')}</span>` : 
                        ''}
                </div>
                <div class="product-meta">
                    <span><i class="fas fa-tag"></i> ${formatCategory(product.category)}</span>
                    <span><i class="fas fa-shopping-cart"></i> ${product.sold} terjual</span>
                </div>
                <ID')}`);
    
    // Reset cart
    cart = [];
    updateCart();
}

// SETUP EVENT LISTENERS
function setupEventListeners() {
    // Cart open/close
    document.addEventListener('click', function(event) {
        if (event.target.closest('#openCart') || event.target.closest('.cart-gaming')) {
            document.getElementById('cartModal').style.display = 'block';
        }
        
        if (event.target.closest('#closeCart') || event.target.closest('.close-cart')) {
            document.getElementById('cartModal').style.display = 'none';
        }
    });
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
    
    // Close modal on outside click
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('cartModal');
        if (modal && event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Filter tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Filter products
            const filter = this.getAttribute('data-filter');
            renderProducts(filter);
        });
    });
    
    // Search functionality
    const searchInput = document.querySelector('.gaming-search input');
    if (searchInput) {
        searchInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                searchProducts(this.value);
            }
        });
    }
}

// SEARCH PRODUCTS
function searchProducts(query) {
    if (!query.trim()) {
        renderProducts('all');
        return;
    }
    
    const filteredProducts = allProducts.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );
    
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: rgba(224, 224, 255, 0.6);">
                <i class="fas fa-search" style="font-size: 50px; margin-bottom: 15px;"></i>
                <p>Tidak ditemukan produk dengan kata kunci "${query}"</p>
            </div>
        `;
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card-gaming';
        productCard.innerHTML = `
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            <div class="product-image-gaming">
                <i class="${product.icon}"></i>
            </div>
            <div class="product-info-gaming">
                <h3 class="product-title-gaming">${product.name}</h3>
                <div class="product-price-gaming">
                    <div class="current-price">Rp ${product.price.toLocaleString('id-ID')}</div>
                    ${product.originalPrice ? `<div class="original-price">Rp ${product.originalPrice.toLocaleString('id-ID')}</div>` : ''}
                </div>
                <div class="product-meta">
                    <div><i class="fas fa-tag"></i> ${formatCategory(product.category)}</div>
                    <div><i class="fas fa-shopping-cart"></i> ${product.sold} terjual</div>
                </div>
                <button class="buy-button-gaming" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> TAMBAH KE KERANJANG
                </button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// INITIALIZE
document.addEventListener('DOMContentLoaded', async function() {
    await loadComponents();
    await loadProducts();
    updateCart();
    
    // Typewriter effect for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        
        setTimeout(typeWriter, 1000);
    }
});
