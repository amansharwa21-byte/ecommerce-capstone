// Sample product data for this front-end demonstration store.
const products = [
    { id: 1, name: "Sony WH-1000XM5 Headphones", price: 349.99, img: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=300&q=80" },
    { id: 2, name: "Mechanical Keyboard", price: 129.99, img: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=300&q=80" },
    { id: 3, name: "Logitech MX Master 3S", price: 99.99, img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=300&q=80" },
    { id: 4, name: "4K Gaming Monitor", price: 450.00, img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=300&q=80" }
];

const CART_STORAGE_KEY = 'techGearDemoCart';
const appRoot = document.getElementById('app-root');
const cartCount = document.getElementById('cart-count');

function loadCart() {
    try {
        const saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
        if (!Array.isArray(saved)) return [];
        return saved.filter(id => products.some(product => product.id === id));
    } catch (error) {
        return [];
    }
}

let cart = loadCart();

function saveCart() {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
        // The cart still works during this page session if storage is unavailable.
    }
}

function updateCartCounter() {
    cartCount.textContent = String(cart.length);
}

function renderCatalog(searchTerm = '') {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const visibleProducts = products.filter(product => product.name.toLowerCase().includes(normalizedSearch));

    let html = `
        <h1>Featured Products</h1>
        <div class="catalog-tools">
            <label for="product-search">Search products</label>
            <input id="product-search" type="search" placeholder="Search by product name" value="${escapeHtml(searchTerm)}">
        </div>
    `;

    if (visibleProducts.length === 0) {
        html += `<p class="empty-cart">No products match your search. Try another name.</p>`;
    } else {
        html += `<div class="grid">`;
        visibleProducts.forEach(product => {
            html += `
                <article class="card">
                    <img src="${product.img}" alt="${escapeHtml(product.name)}" loading="lazy">
                    <h3>${escapeHtml(product.name)}</h3>
                    <p>$${product.price.toFixed(2)}</p>
                    <button type="button" onclick="addToCart(${product.id})">Add to Cart</button>
                </article>
            `;
        });
        html += `</div>`;
    }
    appRoot.innerHTML = html;

    const searchInput = document.getElementById('product-search');
    searchInput.addEventListener('input', event => {
        const currentValue = event.target.value;
        const cursorPosition = event.target.selectionStart;
        renderCatalog(currentValue);
        const nextInput = document.getElementById('product-search');
        nextInput.focus();
        nextInput.setSelectionRange(cursorPosition, cursorPosition);
    });
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
}

function renderCart() {
    const grouped = new Map();
    cart.forEach(id => grouped.set(id, (grouped.get(id) || 0) + 1));
    let total = 0;
    let html = `<h1>Your Shopping Cart</h1>`;

    if (grouped.size === 0) {
        html += `<p class="empty-cart">Your cart is currently empty.</p><p class="cart-back"><a class="text-link" href="#/">Browse the catalog</a></p>`;
    } else {
        html += `<ul class="cart-list">`;
        grouped.forEach((quantity, productId) => {
            const product = products.find(item => item.id === productId);
            const subtotal = product.price * quantity;
            total += subtotal;
            html += `
                <li class="cart-item">
                    <div class="cart-product-info">
                        <strong>${escapeHtml(product.name)}</strong>
                        <span>$${product.price.toFixed(2)} each</span>
                        <span>Subtotal: $${subtotal.toFixed(2)}</span>
                    </div>
                    <div class="cart-actions">
                        <button class="quantity-button" type="button" aria-label="Decrease ${escapeHtml(product.name)} quantity" onclick="changeQuantity(${productId}, -1)">−</button>
                        <span class="quantity-value">${quantity}</span>
                        <button class="quantity-button" type="button" aria-label="Increase ${escapeHtml(product.name)} quantity" onclick="changeQuantity(${productId}, 1)">+</button>
                        <button class="remove-button" type="button" onclick="removeFromCart(${productId})">Remove</button>
                    </div>
                </li>
            `;
        });
        html += `</ul>
            <div class="cart-summary">
                <strong>Total: $${total.toFixed(2)}</strong>
                <button class="clear-button" type="button" onclick="clearCart()">Clear Cart</button>
            </div>
            <p class="notice">This is a front-end demonstration cart. It does not place orders or process payments.</p>`;
    }
    appRoot.innerHTML = html;
}

function renderAbout() {
    appRoot.innerHTML = `
        <section class="info-page">
            <h1>About TechGear</h1>
            <p>TechGear is a demonstration e-commerce storefront created as a web development project. It presents a small catalogue of technology accessories and demonstrates product search, browsing and cart management in a browser.</p>
            <p>This project uses HTML, CSS and JavaScript. Product information is held in a sample JavaScript array, while the cart is managed on the client side and saved in browser Local Storage.</p>
            <p class="notice">This is a front-end student project. It does not process real orders or payments.</p>
            <a class="text-link" href="#/">Browse the catalog</a>
        </section>`;
}

function renderContact() {
    appRoot.innerHTML = `
        <section class="info-page">
            <h1>Contact Us</h1>
            <p>For questions about this demonstration project, you can contact the project creator by email.</p>
            <div class="contact-card">
                <h2>Project contact</h2>
                <p><a href="mailto:amansharwa21@gmail.com">amansharwa21@gmail.com</a></p>
            </div>
            <p class="notice">TechGear is a student project demonstration, not a live online store.</p>
            <a class="text-link" href="#/">Return to catalog</a>
        </section>`;
}

window.addToCart = function(productId) {
    const product = products.find(item => item.id === productId);
    if (!product) return;
    cart.push(productId);
    saveCart();
    updateCartCounter();
    if (window.location.hash === '#/cart') renderCart();
};

window.changeQuantity = function(productId, change) {
    const currentQuantity = cart.filter(id => id === productId).length;
    if (change > 0) {
        cart.push(productId);
    } else if (currentQuantity > 0) {
        const index = cart.indexOf(productId);
        cart.splice(index, 1);
    }
    saveCart();
    updateCartCounter();
    renderCart();
};

window.removeFromCart = function(productId) {
    cart = cart.filter(id => id !== productId);
    saveCart();
    updateCartCounter();
    renderCart();
};

window.clearCart = function() {
    cart = [];
    saveCart();
    updateCartCounter();
    renderCart();
};

function router() {
    const hash = window.location.hash;
    if (hash === '#/cart') renderCart();
    else if (hash === '#/about') renderAbout();
    else if (hash === '#/contact') renderContact();
    else renderCatalog();
}

updateCartCounter();
window.addEventListener('hashchange', router);
router();
