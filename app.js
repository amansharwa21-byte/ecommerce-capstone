// TechGear is a front-end store demonstration. Product data and cart state live in the browser.
const products = [
  { id: 1, name: 'Wireless Headphones', category: 'Audio', price: 3499, badge: 'Popular', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=85', description: 'Comfortable over-ear headphones for music, calls and everyday listening.' },
  { id: 2, name: 'Mechanical Keyboard', category: 'Accessories', price: 4299, badge: 'Desk setup', img: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=700&q=85', description: 'A clean keyboard option for a focused desk and typing setup.' },
  { id: 3, name: 'Wireless Mouse', category: 'Accessories', price: 1899, badge: '', img: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=700&q=85', description: 'A compact wireless mouse for work, study and browsing.' },
  { id: 4, name: 'Gaming Monitor', category: 'Displays', price: 15999, badge: 'Featured', img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=700&q=85', description: 'A wide display concept for productivity, entertainment and gaming.' },
  { id: 5, name: 'Portable Speaker', category: 'Audio', price: 2799, badge: '', img: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=700&q=85', description: 'A compact speaker concept for casual listening at home.' },
  { id: 6, name: 'Smart Watch', category: 'Wearables', price: 5999, badge: 'New', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=85', description: 'A simple wearable design for everyday time and activity tracking.' },
  { id: 7, name: 'Laptop Backpack', category: 'Accessories', price: 2199, badge: '', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=85', description: 'A practical bag concept for carrying a laptop and daily essentials.' },
  { id: 8, name: 'Webcam', category: 'Displays', price: 2499, badge: '', img: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=700&q=85', description: 'A webcam for online classes, meetings and video calls.' }
];
const CART_KEY = 'techGearDemoCart';
const appRoot = document.getElementById('app-root');
const cartCount = document.getElementById('cart-count');
const productDialog = document.getElementById('product-dialog');
const dialogContent = document.getElementById('dialog-content');
let activeCategory = 'All';
let searchTerm = '';
let sortMode = 'featured';

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char]);
}
function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    if (!Array.isArray(saved)) return [];
    // Keep the earlier demo cart format compatible: an array of repeated product IDs.
    return saved.map(Number).filter(id => products.some(product => product.id === id));
  } catch (error) { return []; }
}
let cart = loadCart();
function saveCart() {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
  catch (error) { /* Cart interactions continue for the current browser session. */ }
}
function currency(value) { return `₹${Number(value).toLocaleString('en-IN')}`; }
function updateCartCount() { cartCount.textContent = String(cart.length); }
function updateActiveNav() {
  const route = location.hash || '#/';
  document.querySelectorAll('[data-nav]').forEach(link => {
    const active = (route === '#/' && link.dataset.nav === 'catalog') || route === `#/${link.dataset.nav}`;
    link.classList.toggle('active', active);
  });
}
function renderCatalog() {
  const categories = ['All', 'Audio', 'Accessories', 'Displays', 'Wearables'];
  let visible = products.filter(product => (activeCategory === 'All' || product.category === activeCategory) &&
    `${product.name} ${product.category}`.toLowerCase().includes(searchTerm.toLowerCase()));
  if (sortMode === 'price-low') visible.sort((a,b) => a.price - b.price);
  if (sortMode === 'price-high') visible.sort((a,b) => b.price - a.price);
  if (sortMode === 'name') visible.sort((a,b) => a.name.localeCompare(b.name));

  appRoot.innerHTML = `
    <section class="store-hero">
      <div><p class="hero-kicker">TECHGEAR COLLECTION</p><h1>Make your setup<br><span>work better.</span></h1><p class="hero-copy">Explore everyday tech and accessories for work, study and entertainment.</p><a class="hero-button" href="#catalog">Explore the collection <span aria-hidden="true">→</span></a></div>
      <div class="hero-showcase" aria-hidden="true"><div class="showcase-disc">🎧</div><span class="showcase-label">Find your everyday essentials</span></div>
    </section>
    <section id="catalog" class="catalog-section">
      <div class="catalog-heading"><div><p class="eyebrow">SHOP THE COLLECTION</p><h2>Featured products</h2><p>Simple picks for your everyday setup.</p></div><span class="catalog-count">${visible.length} of ${products.length} products</span></div>
      <div class="catalog-tools">
        <label class="search-control" for="product-search"><span aria-hidden="true">⌕</span><input id="product-search" type="search" placeholder="Search products..." value="${escapeHtml(searchTerm)}"></label>
        <label class="sort-control" for="product-sort">Sort by <select id="product-sort"><option value="featured" ${sortMode==='featured'?'selected':''}>Featured</option><option value="price-low" ${sortMode==='price-low'?'selected':''}>Price: low to high</option><option value="price-high" ${sortMode==='price-high'?'selected':''}>Price: high to low</option><option value="name" ${sortMode==='name'?'selected':''}>Name</option></select></label>
      </div>
      <div class="category-row" role="group" aria-label="Filter by category">${categories.map(category => `<button type="button" class="category-btn ${activeCategory===category?'active':''}" data-category="${category}" aria-pressed="${activeCategory===category}">${category}</button>`).join('')}</div>
      <div class="product-grid">${visible.length ? visible.map(product => `
        <article class="product-card">
          <div class="product-image-wrap">${product.badge?`<span class="product-badge">${escapeHtml(product.badge)}</span>`:''}<img class="product-image" src="${product.img}" alt="${escapeHtml(product.name)}" loading="lazy"></div>
          <div class="product-body"><p class="product-category">${escapeHtml(product.category)}</p><h3>${escapeHtml(product.name)}</h3><p class="product-description">${escapeHtml(product.description)}</p><div class="product-bottom"><strong class="product-price">${currency(product.price)}</strong></div><div class="product-actions"><button type="button" data-action="details" data-id="${product.id}">Quick view</button><button type="button" class="add-button" data-action="add" data-id="${product.id}">Add to cart</button></div></div>
        </article>`).join('') : '<div class="empty-results"><strong>No products found</strong><p>Try a different search or category.</p></div>'}</div>
      <p class="store-note">Demo storefront: sample product data and a browser-based cart. No real orders or payments are processed.</p>
    </section>`;
}
function groupedCart() {
  const counts = new Map();
  cart.forEach(id => counts.set(id, (counts.get(id) || 0) + 1));
  return [...counts.entries()].map(([id, quantity]) => ({ product: products.find(item => item.id === id), quantity })).filter(item => item.product);
}
function renderCart() {
  const items = groupedCart();
  const totalQuantity = cart.length;
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  if (!items.length) {
    appRoot.innerHTML = `<section class="section-heading"><p class="eyebrow">YOUR SELECTION</p><h1>Shopping cart</h1><p>Your selected products will appear here.</p></section><div class="empty-cart"><span class="empty-symbol">▢</span><h2>Your cart is empty</h2><p>Browse the collection and add something you like.</p><a class="primary-link" href="#/">Explore products</a></div>`;
    return;
  }
  appRoot.innerHTML = `<section class="section-heading"><p class="eyebrow">YOUR SELECTION</p><h1>Shopping cart</h1><p>${totalQuantity} item${totalQuantity===1?'':'s'} in your cart.</p></section>
    <div class="cart-layout"><div class="cart-list">${items.map(({product,quantity}) => `<article class="cart-item"><img src="${product.img}" alt="${escapeHtml(product.name)}"><div><h3>${escapeHtml(product.name)}</h3><p class="cart-category">${escapeHtml(product.category)}</p><div class="item-price">${currency(product.price)} · Subtotal ${currency(product.price*quantity)}</div></div><div class="cart-controls"><div class="quantity-control"><button type="button" data-action="quantity" data-id="${product.id}" data-change="-1" aria-label="Decrease quantity">−</button><span>${quantity}</span><button type="button" data-action="quantity" data-id="${product.id}" data-change="1" aria-label="Increase quantity">+</button></div><button type="button" class="remove-button" data-action="remove" data-id="${product.id}">Remove</button></div></article>`).join('')}</div>
    <aside class="summary-card"><h2>Order summary</h2><div class="summary-line"><span>Items (${totalQuantity})</span><strong>${currency(total)}</strong></div><div class="summary-line"><span>Delivery</span><strong>Demo only</strong></div><div class="summary-line summary-total"><span>Estimated total</span><strong>${currency(total)}</strong></div><button type="button" class="clear-cart-button" data-action="clear">Clear cart</button><p class="contact-note">This student demo does not accept payments or create real orders.</p></aside></div>`;
}
function renderAbout() {
  appRoot.innerHTML = `<section class="info-layout"><article class="info-card"><p class="eyebrow">ABOUT THE PROJECT</p><h1>About TechGear</h1><p>TechGear is a small electronics storefront created as a web development learning project. It demonstrates how a product catalogue can be displayed and how a user can search, filter and add sample products to a shopping cart.</p><p>The interface is built with HTML for structure, CSS for layout and styling, and JavaScript for product rendering and cart interactions.</p><div class="info-highlight">The project is a front-end demonstration. Product information is stored in JavaScript and cart data is retained in the browser using Local Storage.</div></article><article class="info-card"><p class="eyebrow">PROJECT TECHNOLOGIES</p><h2>What the project demonstrates</h2><p><strong>HTML5</strong> — page structure, navigation and content.</p><p><strong>CSS3</strong> — responsive layout, product cards and visual styling.</p><p><strong>JavaScript</strong> — search, category filtering, sorting and cart updates.</p><p><strong>Local Storage</strong> — keeping cart selections after a page refresh.</p><a class="primary-link" href="#/">Browse the catalogue</a></article></section>`;
}
function renderContact() {
  appRoot.innerHTML = `<section class="info-layout"><article class="info-card"><p class="eyebrow">GET IN TOUCH</p><h1>Contact Us</h1><p>TechGear is a student demonstration project. For questions or feedback about the project, you can contact its creator by email.</p><div class="info-highlight"><h2>Project contact</h2><a class="contact-email" href="mailto:amansharwa21@gmail.com">amansharwa21@gmail.com</a></div><p class="contact-note">This is not a customer-support channel for a commercial store.</p></article><article class="info-card"><p class="eyebrow">PROJECT NOTE</p><h2>About this demonstration</h2><p>The product catalogue uses sample product information. The cart works inside the browser and does not connect to a payment provider or order-management service.</p><p>GitHub Pages is used to publish the static front-end files.</p><a class="primary-link" href="#/">Return to TechGear</a></article></section>`;
}
function openProductDetails(productId) {
  const product = products.find(item => item.id === productId);
  if (!product) return;
  dialogContent.innerHTML = `<div class="dialog-content"><img src="${product.img}" alt="${escapeHtml(product.name)}"><div><p class="product-category">${escapeHtml(product.category)}</p><h2 id="dialog-title">${escapeHtml(product.name)}</h2><p>${escapeHtml(product.description)}</p><strong>${currency(product.price)}</strong><button type="button" data-dialog-add="${product.id}">Add to cart</button></div></div>`;
  productDialog.showModal();
}
function addToCart(productId) {
  if (!products.some(product => product.id === productId)) return;
  cart.push(productId); saveCart(); updateCartCount();
  const button = appRoot.querySelector(`[data-action="add"][data-id="${productId}"]`);
  if (button) { const original = button.textContent; button.textContent = 'Added ✓'; setTimeout(() => { if (button.isConnected) button.textContent = original; }, 900); }
}
appRoot.addEventListener('click', event => {
  const categoryButton = event.target.closest('[data-category]');
  if (categoryButton) { activeCategory = categoryButton.dataset.category; renderCatalog(); return; }
  const actionButton = event.target.closest('[data-action]');
  if (!actionButton) return;
  const id = Number(actionButton.dataset.id);
  if (actionButton.dataset.action === 'add') addToCart(id);
  if (actionButton.dataset.action === 'details') openProductDetails(id);
  if (actionButton.dataset.action === 'quantity') {
    const amount = Number(actionButton.dataset.change);
    if (amount > 0) cart.push(id);
    else { const position = cart.indexOf(id); if (position >= 0) cart.splice(position,1); }
    saveCart(); updateCartCount(); renderCart();
  }
  if (actionButton.dataset.action === 'remove') { cart = cart.filter(item => item !== id); saveCart(); updateCartCount(); renderCart(); }
  if (actionButton.dataset.action === 'clear') { cart = []; saveCart(); updateCartCount(); renderCart(); }
});
appRoot.addEventListener('input', event => {
  if (event.target.id === 'product-search') {
    const position = event.target.selectionStart; searchTerm = event.target.value; renderCatalog();
    const replacement = document.getElementById('product-search'); replacement.focus(); replacement.setSelectionRange(position,position);
  }
});
appRoot.addEventListener('change', event => {
  if (event.target.id === 'product-sort') { sortMode = event.target.value; renderCatalog(); }
});
dialogContent.addEventListener('click', event => {
  const button = event.target.closest('[data-dialog-add]');
  if (!button) return;
  addToCart(Number(button.dataset.dialogAdd)); productDialog.close();
});
function router() {
  const route = location.hash || '#/';
  if (route === '#/cart') renderCart();
  else if (route === '#/about') renderAbout();
  else if (route === '#/contact') renderContact();
  else { activeCategory = 'All'; searchTerm = ''; sortMode = 'featured'; renderCatalog(); }
  updateActiveNav();
  appRoot.focus({preventScroll:true});
}
window.addEventListener('hashchange', router);
updateCartCount(); router();
