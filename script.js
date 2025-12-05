// =======================================================
// 1. GLOBAL STATE AND HELPER DATA
// =======================================================

const APP_SCREENS = [
    'home', 'cart', 'profile', 'book-details', 'checkout', 'thank-you', 'login'
];

const bookData = [
    {id: 'WOH001', title: 'ഹൃദയത്തിന്റെ മന്ത്രണങ്ങൾ', price: 299, author: 'NIK', category: 'Poetry', lang: 'ml', description: 'ആത്മാവിൻ്റെ സ്പർശമുള്ള പ്രണയ കവിതകളുടെ സമാഹാരം.'},
    {id: 'ADVE002', title: 'സഹ്യാദ്രിയിലെ നിഴലുകൾ', price: 450, author: 'NIK', category: 'Adventure', lang: 'ml', description: 'സഹ്യപർവത നിരകളിലൂടെയുള്ള ഒരു സാഹസിക യാത്ര.'},
    // Add more book objects here as needed
];

let cart = JSON.parse(localStorage.getItem('cart')) || []; 
let currentBookId = null; 

// =======================================================
// 2. INITIALIZATION AND CORE NAVIGATION
// =======================================================

// Function to handle internal screen switching (CRITICAL FIX)
function showScreen(screenId) {
    const bottomNav = document.getElementById('main-bottom-nav');
    const bottomActionsBar = document.querySelector('.bottom-actions-bar');
    
    // 1. Hide all screens (Ensures only one is visible)
    APP_SCREENS.forEach(id => {
        const screen = document.getElementById(id + '-screen');
        if (screen) screen.style.display = 'none';
    });
    
    // 2. Show the target screen
    const targetScreen = document.getElementById(screenId + '-screen');
    if (targetScreen) targetScreen.style.display = 'flex';

    // 3. Update Nav and Actions Bar visibility
    const isMainScreen = ['home', 'cart', 'profile'].includes(screenId);
    
    if (bottomNav) bottomNav.style.display = isMainScreen ? 'flex' : 'none'; 
    if (bottomActionsBar) bottomActionsBar.style.display = screenId === 'book-details' ? 'flex' : 'none';

    // 4. Update Nav active state
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    if (isMainScreen) {
        const targetNav = document.querySelector(`.nav-item[data-target="${screenId}"]`);
        if (targetNav) targetNav.classList.add('active');
    }

    // 5. Run screen-specific rendering
    if (screenId === 'cart') {
        renderCart();
    }
    if (screenId === 'profile') {
        renderProfile();
    }
}

/**
 * Runs when the DOM is fully loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Check if the current page is index.html
    if (document.getElementById('login-screen')) {
        handleLoginInit();
    } else {
        handleHomeInit();
    }
    
    // Set initial dark mode state
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    // Attach dark mode toggle listener 
    document.querySelectorAll('.dark-mode-toggle').forEach(btn => {
        btn.addEventListener('click', toggleDarkMode);
    });
    
    updateCartBadge();
});

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// =======================================================
// 3. LOGIN LOGIC (index.html)
// =======================================================

function validateAndRedirect() {
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();

    if (name === "" || phone.length !== 10 || isNaN(phone)) {
        alert("ദയവായി സാധുവായ പേരും 10 അക്ക ഫോൺ നമ്പറും നൽകുക.");
        return;
    }

    localStorage.setItem('userName', name);
    localStorage.setItem('userPhone', phone);
    localStorage.setItem('isLoggedIn', 'true');

    // Assuming home.html is the main entry point after login
    window.location.href = 'home.html';
}

function handleLoginInit() {
    // Language toggle visual effect
    document.querySelectorAll('.lang-button').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.lang-button').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Auto-redirect if already logged in (good practice)
    if (localStorage.getItem('isLoggedIn') === 'true') {
         window.location.href = 'home.html';
    }
}

// =======================================================
// 4. HOME & NAVIGATION LOGIC (home.html)
// =======================================================

function handleHomeInit() {
    // Check if user is logged in
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'index.html';
        return;
    }
    
    // Start on the home screen
    showScreen('home'); 
}

function showBookDetails(title, price, category, id) {
    currentBookId = id; 
    const book = bookData.find(b => b.id === id);

    const detailsContent = document.querySelector('.book-details-content');
    if (!book) {
        detailsContent.innerHTML = `<p>Error: Book details not found.</p>`;
        showScreen('book-details');
        return;
    }
    
    detailsContent.innerHTML = `
        <img src="images/placeholder.png" alt="${book.title} Cover" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">
        <h3 style="margin-top: 15px;">${book.title}</h3>
        <p>രചന: ${book.author}</p>
        <p>വിഭാഗം: ${book.category}</p>
        <p style="font-size: 1.5em; font-weight: bold; color: var(--primary-color);">വില: ₹${book.price}</p>
        <p style="margin-top: 15px;">${book.description}</p>
    `;

    showScreen('book-details');
}

function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cart-count');
    if (badge) {
        badge.innerText = totalItems;
        badge.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

function addToCart() {
    if (!currentBookId) return;
    
    const book = bookData.find(b => b.id === currentBookId);
    if (!book) return;

    const existingItem = cart.find(item => item.id === currentBookId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({...book, quantity: 1});
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    
    const addButton = document.getElementById('add-to-cart-btn');
    const newQuantity = (existingItem ? existingItem.quantity : 1);
    
    addButton.innerHTML = `🛒 കാർട്ടിലേക്ക് ചേർത്തു! (${newQuantity})`;
    setTimeout(() => {
        addButton.innerHTML = '🛒 കാർട്ടിലേക്ക് ചേർക്കുക';
    }, 1500);
}

function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartBadge();
        renderCart(); 
    }
}

function renderCart() {
    const cartScreen = document.getElementById('cart-screen');
    let itemsList = cartScreen.querySelector('.cart-items-list');

    if (!itemsList) {
        itemsList = document.createElement('div');
        itemsList.classList.add('cart-items-list');
        // Insert before the cart-actions element
        const cartActions = document.querySelector('.cart-actions');
        if(cartActions) cartScreen.insertBefore(itemsList, cartActions);
    }

    let cartHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartHTML = `<p style="text-align: center; margin-top: 50px;">കാർട്ടിൽ നിലവിൽ പുസ്തകങ്ങളൊന്നും ചേർത്തിട്ടില്ല.</p>`;
        // Hide checkout button if cart is empty
        document.querySelector('.checkout-btn').style.display = 'none';
    } else {
        document.querySelector('.checkout-btn').style.display = 'block';
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            cartHTML += `
                <div class="book-card cart-item" style="margin-bottom: 15px;">
                    <img src="images/placeholder.png" alt="Cover" class="book-cover" style="width: 60px; height: 90px;">
                    <div class="book-details" style="flex-grow: 1;">
                        <div class="book-title-ml">${item.title}</div>
                        <div class="book-author">വില: ₹${item.price} x ${item.quantity}</div>
                        <div class="book-category" style="font-weight: bold;">ആകെ: ₹${itemTotal}</div>
                    </div>
                    <button onclick="removeFromCart(${index})" class="add-to-cart-btn" style="background: red; padding: 5px 10px; font-size: 0.9em; flex: unset;">-</button>
                </div>
            `;
        });
        cartHTML += `<h3 style="text-align: right; padding: 10px; margin-top: 15px; border-top: 1px solid var(--border-color);">മൊത്തം തുക: ₹${total}</h3>`;
    }

    itemsList.innerHTML = cartHTML;
}

function buyNow() {
    if (!currentBookId) return;
    const book = bookData.find(b => b.id === currentBookId);
    cart = [{...book, quantity: 1}]; // Clear cart, add only current book
    localStorage.setItem('cart', JSON.stringify(cart));
    window.location.href = 'checkout.html';
}

function renderProfile() {
    // Implementation for rendering profile data
    const profileContent = document.querySelector('#profile-screen .profile-content');
    const name = localStorage.getItem('userName') || 'ഉപയോക്താവ്';
    const phone = localStorage.getItem('userPhone') || 'ലഭ്യമല്ല';
    
    profileContent.innerHTML = `
        <div class="info-section" style="text-align: left;">
            <p><strong>പേര്:</strong> ${name}</p>
            <p><strong>ഫോൺ:</strong> +91 ${phone}</p>
            <p style="margin-top: 15px; color: #7f8c8d;">നിങ്ങളുടെ ഓർഡർ വിവരങ്ങളും വിലാസങ്ങളും ഇവിടെ കാണാം.</p>
        </div>
        <button class="continue-button" onclick="logout()">ലോഗ് ഔട്ട്</button>
    `;
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('cart');
    window.location.href = 'index.html';
}

// =======================================================
// 5. CHECKOUT LOGIC (checkout.html)
// =======================================================

function renderCheckoutSummary() {
    const summaryItems = document.getElementById('summary-items');
    const totalAmountSpan = document.getElementById('total-amount');
    const payBtnText = document.getElementById('pay-btn-text');
    
    let total = 0;
    summaryItems.innerHTML = '';

    if (cart.length === 0) {
        summaryItems.innerHTML = '<p>കാർട്ടിൽ പുസ്തകങ്ങൾ ഇല്ല.</p>';
        totalAmountSpan.innerText = `₹0`;
        payBtnText.parentNode.disabled = true;
        return;
    } 

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        summaryItems.innerHTML += `
            <div class="summary-line">
                <span>${item.title} (x${item.quantity})</span>
                <span>₹${itemTotal}</span>
            </div>
        `;
    });

    totalAmountSpan.innerText = `₹${total}`;
    payBtnText.innerText = `₹${total} അടയ്ക്കുക`;
    payBtnText.parentNode.disabled = false;
}

function processPayment() {
    const address = document.getElementById('address').value.trim();
    const pincode = document.getElementById('pincode').value.trim();
    let isValid = true;

    // Validation
    const addressError = document.getElementById('address-error');
    const pincodeError = document.getElementById('pincode-error');

    if (address.length < 10) {
        addressError.innerText = "ദയവായി പൂർണ്ണമായ വിലാസം നൽകുക.";
        addressError.style.display = 'block';
        isValid = false;
    } else {
        addressError.style.display = 'none';
    }

    if (pincode.length !== 6 || isNaN(pincode)) {
        pincodeError.innerText = "ദയവായി 6 അക്ക പിൻ കോഡ് നൽകുക.";
        pincodeError.style.display = 'block';
        isValid = false;
    } else {
        pincodeError.style.display = 'none';
    }

    if (isValid) {
        // Successful order placement simulation
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Show thank you screen
        document.getElementById('checkout-screen').style.display = 'none';
        document.getElementById('thank-you-screen').style.display = 'flex';
        window.scrollTo(0, 0); 
    }
}

function handleCheckoutInit() {
    // This runs if the page is checkout.html
    document.getElementById('checkout-screen').style.display = 'flex';
    document.getElementById('thank-you-screen').style.display = 'none';
    renderCheckoutSummary();
}