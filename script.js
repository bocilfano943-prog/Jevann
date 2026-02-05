// DATA KERANJANG
let cart = [];
let cartTotal = 0;
let allProducts = [];

// LOAD COMPONENTS
async function loadComponents() {
    // Load header
    const headerResponse = await fetch('components/header.html');
    const headerHTML = await headerResponse.text();
    document.getElementById('header-container').innerHTML = headerHTML;
    
    // Load cart modal
    const cartResponse = await fetch('components/cart-modal.html');
    const cartHTML = await cartResponse.text();
    document.getElementById('cart-container').innerHTML = cartHTML;
    
    // Load footer
    const footerResponse = await fetch('components/footer.html');
    const footerHTML = await footerResponse.text();
    document.getElementById('footer-container').innerHTML = footerHTML;
    
    // Setup event listeners setelah components loaded
    setupEventListeners();
}

// LOAD PRODUCTS
async function loadProducts() {
    try {
        const response = await fetch('data/products.json');
        allProducts = await response.json();
        renderProducts('all');
    } catch (error) {
        console.error('Error loading products:', error);
        // Fallback data
        allProducts = [
            {id: 1, name: "Mobile Legends 86 Diamond", price: 25000, originalPrice: 30000, category: "mobile-legends", icon: "fas fa-gem", badge: "TERLARIS", sold: 1250},
            {id: 2, name: "Free Fire 70 Diamond", price: 12000, originalPrice: 15000, category: "free-fire", icon: "fas fa-fire", badge: "PROMO", sold: 890},
            {id: 3, name: "PUBG Mobile 60 UC", price: 15000, originalPrice: 18000, category: "pubg", icon: "fas fa-crosshairs", badge: "BARU", sold: 450},
            {id: 4, name: "Valorant 125 VP", price: 40000, originalPrice: 45000, category: "valorant", icon: "fas fa-bomb", badge: "", sold: 320},
            {id: 5, name: "Steam Wallet Rp 50.000", price: 48000, originalPrice: 50000, category: "voucher", icon: "fas fa-steam", badge: "HEMAT", sold: 760},
            {id: 6, name: "Google Play Voucher Rp 100.000", price: 95000, originalPrice: 100000, category: "voucher", icon: "fab fa-google-play", badge: "", sold: 540},
            {id: 7, name: "Mobile Legends 172 Diamond", price: 50000, originalPrice: 55000, category: "mobile-legends", icon: "fas fa-gem", badge: "TERLARIS", sold: 980},
            {id: 8, name: "Akun Valorant Rank Gold", price: 120000, originalPrice: 150000, category: "valorant", icon: "fas fa-user-secret", badge: "DISKON", sold: 45}
        ];
        renderProducts('all');
    }
}

// RENDER PRODUCTS
function renderProducts(filter = 'all') {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';
    
    const filteredProducts = filter === 'all' 
        ? allProducts 
        : allProducts.filter(product => product.category === filter);
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: rgba(224, 224, 255, 0.6);">
                <i class="fas fa-gamepad" style="font-size: 50px; margin-bottom: 15px;"></i>
                <p>Tidak ada produk dalam kategori ini</p>
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

// FORMAT CATEGORY NAME
function formatCategory(category) {
    const categoryMap = {
        'mobile-legends': 'Mobile Legends',
        'free-fire': 'Free Fire',
        'pubg': 'PUBG',
        'valorant': 'Valorant',
        'voucher': 'Voucher',
        'akun-game': 'Akun Game'
    };
    return categoryMap[category] || category;
}

// ADD TO CART
function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            icon: product.icon,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification(`${product.name} ditambahkan ke keranjang!`);
}

// UPDATE CART DISPLAY
function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.querySelector('.cart-count');
    const cartTotalElement = document.getElementById('cartTotal');
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
    
    // Render cart items
    cartItems.innerHTML = '';
    cartTotal = 0;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: rgba(224, 224, 255, 0.6);">
                <i class="fas fa-shopping-cart" style="font-size: 50px; margin-bottom: 15px;"></i>
                <p>Keranjang belanja kosong</p>
            </div>
        `;
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            cartTotal += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <i class="${item.icon}"></i>
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">Rp ${item.price.toLocaleString('id-ID')}</div>
                    <div class="cart-item-actions">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        <button class="remove-item" onclick="removeFromCart(${item.id})">Hapus</button>
                    </div>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
    }
    
    // Update total
    if (cartTotalElement) {
        cartTotalElement.textContent = `Rp ${cartTotal.toLocaleString('id-ID')}`;
    }
}

// UPDATE QUANTITY
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    if (item.quantity < 1) {
        removeFromCart(productId);
    } else {
        updateCart();
    }
}

// REMOVE FROM CART
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// SHOW NOTIFICATION
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(to right, var(--gaming-primary), var(--gaming-secondary));
        color: var(--gaming-dark);
        padding: 15px 25px;
        border-radius: 10px;
        font-weight: 600;
        z-index: 3000;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add animation style
    if (!document.querySelector('#notification-style')) {
        const style = document.createElement('style');
        style.id = 'notification-style';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// CHECKOUT FUNCTION
function checkout() {
    if (cart.length === 0) {
        showNotification("Keranjang belanja kosong!");
        return;
    }
    
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.style.display = 'none';
    }
    
    showNotification(`Pembayaran berhasil! Total: Rp ${cartTotal.toLocaleString('id-ID')}`);
    
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