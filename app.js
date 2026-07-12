// 1. Mock Database (E-commerce Product Catalog)
const products = [
    { id: 1, name: "Sony WH-1000XM5 Headphones", price: 349.99, img: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=300&q=80" },
    { id: 2, name: "Mechanical Keyboard", price: 129.99, img: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=300&q=80" },
    { id: 3, name: "Logitech MX Master 3S", price: 99.99, img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=300&q=80" },
    { id: 4, name: "4K Gaming Monitor", price: 450.00, img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=300&q=80" }
];

// State Management
let cart = [];

// DOM Elements
const appRoot = document.getElementById('app-root');
const cartCount = document.getElementById('cart-count');

// 2. View Functions (Modular Frontend Architecture)
function renderCatalog() {
    let html = `<h1>Featured Products</h1><div class="grid">`;
    
    // Notice the 'loading="lazy"' attribute for image asset optimization
    products.forEach(p => {
        html += `
            <div class="card">
                <img src="${p.img}" alt="${p.name}" loading="lazy">
                <h3>${p.name}</h3>
                <p>$${p.price.toFixed(2)}</p>
                <button onclick="addToCart(${p.id})">Add to Cart</button>
            </div>
        `;
    });
    
    html += `</div>`;
    appRoot.innerHTML = html;
}

function renderCart() {
    let html = `<h1>Your Shopping Cart</h1>`;
    
    if (cart.length === 0) {
        html += `<p class="empty-cart">Your cart is currently empty.</p>`;
    } else {
        html += `<ul class="cart-list">`;
        let total = 0;
        cart.forEach(item => {
            html += `
                <li class="cart-item">
                    <span>${item.name}</span>
                    <strong>$${item.price.toFixed(2)}</strong>
                </li>
            `;
            total += item.price;
        });
        html += `
            <li class="cart-item" style="background: transparent; border-top: 2px solid #cbd5e1; box-shadow: none;">
                <span><strong>Total:</strong></span>
                <strong>$${total.toFixed(2)}</strong>
            </li>
        </ul>`;
    }
    appRoot.innerHTML = html;
}

// Logic to handle adding items to the cart
window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    cart.push(product);
    cartCount.innerText = cart.length;
    alert(`${product.name} has been added to your cart!`);
};

// 3. Client-Side Routing for Seamless Navigation
function router() {
    const hash = window.location.hash;
    
    // Clear current view
    appRoot.innerHTML = '';

    // Route to appropriate view based on URL hash
    if (hash === '#/cart') {
        renderCart();
    } else {
        renderCatalog(); // Default route
    }
}

// Listen for URL changes without reloading the browser
window.addEventListener('hashchange', router);

// Trigger the router on initial page load
window.addEventListener('load', router);