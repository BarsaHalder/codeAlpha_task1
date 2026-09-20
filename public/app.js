// State Management
let products = [];
let cart = [];
let currentUser = null;
let registeredUsers = []; // In-memory registered user storage

// Views & Navigation Elements
const catalogView = document.getElementById('catalog-view');
const detailsView = document.getElementById('details-view');
const cartView = document.getElementById('cart-view');
const aboutView = document.getElementById('about-view');
const authView = document.getElementById('auth-view');

const navProductsBtn = document.getElementById('nav-products-btn');
const navAboutBtn = document.getElementById('nav-about-btn');
const navCartBtn = document.getElementById('nav-cart-btn');
const logoBtn = document.getElementById('logo-btn');
const authContainer = document.getElementById('auth-container');

// View Router
function navigateTo(targetView) {
  [catalogView, detailsView, cartView, aboutView, authView].forEach(view => {
    view.classList.add('hidden');
  });
  targetView.classList.remove('hidden');
}

// Navigation Event Listeners
navProductsBtn.addEventListener('click', () => navigateTo(catalogView));
logoBtn.addEventListener('click', () => navigateTo(catalogView));
navAboutBtn.addEventListener('click', () => navigateTo(aboutView));
navCartBtn.addEventListener('click', () => navigateTo(cartView));
document.getElementById('back-to-products').addEventListener('click', () => navigateTo(catalogView));

// Fetch Products from Server
async function fetchProducts() {
  try {
    const res = await fetch('/api/products');
    products = await res.json();
    renderCatalog();
  } catch (err) {
    console.error('Failed to load products:', err);
  }
}

// Render Product Catalog
function renderCatalog() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  grid.innerHTML = products.map(product => `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p class="price">₹${product.price.toLocaleString('en-IN')}</p>
      <div class="card-actions">
        <button class="btn secondary-btn" onclick="showProductDetails(${product.id})">Details</button>
        <button class="btn" onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    </div>
  `).join('');
}

// Show Product Details View
function showProductDetails(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const detailCard = document.getElementById('product-detail-card');
  detailCard.innerHTML = `
    <div class="detail-wrapper">
      <div class="detail-image-container">
        <img src="${product.image}" alt="${product.name}" />
      </div>
      <div class="detail-info">
        <h2>${product.name}</h2>
        <p class="price">₹${product.price.toLocaleString('en-IN')}</p>
        <p class="desc">${product.description}</p>
        <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    </div>
  `;
  navigateTo(detailsView);
}

// Add to Cart with Auth Guard
function addToCart(productId) {
  if (!currentUser) {
    alert('Please log in or register to add items to your cart.');
    navigateTo(authView);
    return;
  }

  const product = products.find(p => p.id === productId);
  if (product) {
    cart.push(product);
    updateCartUI();
    alert(`${product.name} added to cart!`);
  }
}

// Update Cart Count & Total
function updateCartUI() {
  document.getElementById('cart-count').textContent = cart.length;
  const list = document.getElementById('cart-items-list');

  if (cart.length === 0) {
    list.innerHTML = `<p class="empty-msg">Your cart is empty.</p>`;
    document.getElementById('cart-total-price').textContent = '₹0';
    return;
  }

  let total = 0;
  list.innerHTML = cart.map((item, index) => {
    total += item.price;
    return `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" />
        <div class="item-info">
          <h4>${item.name}</h4>
          <p>₹${item.price.toLocaleString('en-IN')}</p>
        </div>
        <button class="btn delete-btn" onclick="removeFromCart(${index})">Remove</button>
      </div>
    `;
  }).join('');

  document.getElementById('cart-total-price').textContent = `₹${total.toLocaleString('en-IN')}`;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

// Form Switchers
const loginFormContainer = document.getElementById('login-form-container');
const registerFormContainer = document.getElementById('register-form-container');

document.getElementById('switch-to-register').addEventListener('click', (e) => {
  e.preventDefault();
  loginFormContainer.classList.add('hidden');
  registerFormContainer.classList.remove('hidden');
});

document.getElementById('switch-to-login').addEventListener('click', (e) => {
  e.preventDefault();
  registerFormContainer.classList.add('hidden');
  loginFormContainer.classList.remove('hidden');
});

// Registration Logic
document.getElementById('register-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('reg-username').value.trim();
  const email = document.getElementById('reg-email').value.trim().toLowerCase();
  const password = document.getElementById('reg-password').value;

  const existingUser = registeredUsers.find(user => user.email === email);
  if (existingUser) {
    alert('Account already exists! Please log in.');
    registerFormContainer.classList.add('hidden');
    loginFormContainer.classList.remove('hidden');
    return;
  }

  registeredUsers.push({ username, email, password });
  alert('Registration successful! Please log in with your credentials.');

  document.getElementById('register-form').reset();
  registerFormContainer.classList.add('hidden');
  loginFormContainer.classList.remove('hidden');
});

// Login Logic (Requires Registration)
document.getElementById('login-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value;

  const user = registeredUsers.find(u => u.email === email);

  if (!user) {
    alert('No account found with this email. Please register first.');
    loginFormContainer.classList.add('hidden');
    registerFormContainer.classList.remove('hidden');
    return;
  }

  if (user.password !== password) {
    alert('Incorrect password. Please try again.');
    return;
  }

  currentUser = { email: user.email, name: user.username };
  document.getElementById('login-form').reset();
  renderAuthHeader();
  navigateTo(catalogView);
  alert(`Welcome back, ${user.username}!`);
});

// User Avatar Dropdown & Logout Logic
function renderAuthHeader() {
  if (currentUser) {
    const initial = currentUser.name.charAt(0).toUpperCase();
    authContainer.innerHTML = `
      <div class="user-menu-container">
        <div class="user-avatar" id="avatar-btn" title="${currentUser.name}">${initial}</div>
        <div class="dropdown-menu hidden" id="user-dropdown">
          <button class="dropdown-item" id="logout-btn">Logout</button>
        </div>
      </div>
    `;

    const avatarBtn = document.getElementById('avatar-btn');
    const dropdown = document.getElementById('user-dropdown');
    const logoutBtn = document.getElementById('logout-btn');

    avatarBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('hidden');
    });

    logoutBtn.addEventListener('click', () => {
      logoutUser();
    });
  } else {
    authContainer.innerHTML = `<button id="nav-login-btn" class="nav-btn">Login / Register</button>`;
    document.getElementById('nav-login-btn').addEventListener('click', () => navigateTo(authView));
  }
}

function logoutUser() {
  currentUser = null;
  cart = [];
  updateCartUI();
  renderAuthHeader();
  navigateTo(catalogView);
  alert('You have been logged out.');
}

// Close dropdown menu when clicking outside
window.addEventListener('click', () => {
  const dropdown = document.getElementById('user-dropdown');
  if (dropdown && !dropdown.classList.contains('hidden')) {
    dropdown.classList.add('hidden');
  }
});

// Initial Load
fetchProducts();
renderAuthHeader();