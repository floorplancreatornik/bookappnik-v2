// Global variables needed across both pages (user/cart data, language)
let currentLanguage = 'ml';
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
let userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
const MAIN_NAV_ID = 'main-bottom-nav';

// =================================================================
// 0. GLOBAL PLACEHOLDER/UTILITY FUNCTIONS (Available everywhere via inline onclick)
// =================================================================
function showBookDetails(title, price, category, id) { 
    // This is called from index.html -> book-card
    showScreen('book-details'); 
}
function addToCart() { 
    // Placeholder for actual cart logic
    alert('Item added to cart!');
    // Recalculate cart count and update badge
    updateCartCount(); 
}
function buyNow() {
    // Navigates directly to the checkout page
    location.href = 'checkout.html';
}
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}


// =================================================================
// 1. SHARED/GLOBAL FUNCTIONS (Core screen/state management utilities)
// =================================================================

// Function to show/hide the main bottom navigation bar
function showMainNavigationBar() {
    const navBar = document.getElementById(MAIN_NAV_ID);
    if (navBar) {
        // Overrides the CSS 'display: none !important' when needed
        navBar.style.display = 'flex'; 
    }
}

// Function to switch between app screens 
function showScreen(targetId, navButton = null) {
    const screens = document.querySelectorAll('.app-screen');
    screens.forEach(screen => {
        screen.style.display = 'none';
    });
    const targetScreen = document.getElementById(targetId + '-screen');
    if (targetScreen) {
        targetScreen.style.display = 'flex'; 
    }
    
    // Update navigation bar active state
    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
        item.classList.remove('active');
    });
    // Set active class on the relevant nav item
    if (navButton) {
        navButton.classList.add('active');
    } else if (['home', 'cart', 'profile'].includes(targetId)) {
        const targetNav = document.querySelector(`.bottom-nav .nav-item[data-target="${targetId}"]`);
        if (targetNav) targetNav.classList.add('active');
    }
}

function updateCartCount() {
    // For demonstration, let's assume 1 item is always in cart after successful login
    const totalQty = 1; // cart.reduce((sum, item) => sum + item.quantity, 0); 
    const cartCountElements = document.querySelectorAll('#cart-count');
    cartCountElements.forEach(el => {
        el.textContent = totalQty;
        el.style.display = totalQty > 0 ? 'block' : 'none';
    });
}


// =================================================================
// 2. MAIN APPLICATION LOGIC (index.html: Login, Home, Cart, Profile)
// =================================================================
const pathname = window.location.pathname;

if (pathname.includes('index.html') || pathname === '/') {
    
    function switchLanguage(lang) {
        currentLanguage = lang;
        localStorage.setItem('language', lang);
        document.querySelectorAll('.lang-button').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`lang-${lang}`).classList.add('active');
        // --- (Full language translation logic would go here) ---
    }

    function handleContinueBtn() {
        const nameInput = document.getElementById('name').value.trim();
        const phoneInput = document.getElementById('phone').value.trim();

        if (nameInput === "" || phoneInput.length !== 10 || isNaN(phoneInput)) {
            alert("ദയവായി സാധുവായ പേരും 10 അക്ക ഫോൺ നമ്പറും നൽകുക.");
            return;
        }

        userInfo = { name: nameInput, phone: phoneInput };
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        
        // Success: Show home screen and navigation
        showScreen('home');
        showMainNavigationBar(); 
    }

    function loadInitialState() {
        // 1. Check for language preference
        currentLanguage = localStorage.getItem('language') || 'ml';
        switchLanguage(currentLanguage);

        // 2. Check for user login info
        if (userInfo && userInfo.name && userInfo.phone) {
            // Logged in: Go straight to home and show nav
            showScreen('home');
            showMainNavigationBar(); 
        } else {
            // Not logged in: Show login screen
            showScreen('login');
        }
        
        // 3. Handle query parameter screen changes (e.g., from cart/checkout links)
        const params = new URLSearchParams(window.location.search);
        const targetScreen = params.get('screen');
        if (targetScreen) {
             showScreen(targetScreen);
             showMainNavigationBar(); // Make sure nav bar is visible on all core app screens
        }
    }
    
    // --- Event Listeners for index.html ---
    document.addEventListener('DOMContentLoaded', () => {
        
        loadInitialState();
        updateCartCount();
        
        // Activate Language Buttons
        document.getElementById('lang-en')?.addEventListener('click', () => switchLanguage('en'));
        document.getElementById('lang-ml')?.addEventListener('click', () => switchLanguage('ml'));
        
        // ACTIVATE CONTINUE BUTTON
        document.getElementById('continue-btn')?.addEventListener('click', handleContinueBtn);
    });
}

// =================================================================
// 3. CHECKOUT LOGIC (checkout.html)
// =================================================================
else if (pathname.includes('checkout.html')) {
    
    function validateAndPay() {
        const address = document.getElementById('full-address').value.trim();
        const pincode = document.getElementById('pincode').value.trim();
        let valid = true;

        const addressError = document.getElementById('address-error');
        const pincodeError = document.getElementById('pincode-error');

        // Simple validation
        if (address.length < 15) {
            addressError.style.display = 'block';
            valid = false;
        } else {
            addressError.style.display = 'none';
        }

        if (pincode.length !== 6 || isNaN(pincode)) {
            pincodeError.style.display = 'block';
            valid = false;
        } else {
            pincodeError.style.display = 'none';
        }

        if (valid) {
            // Simulate payment success and navigate to thank-you screen
            showScreen('thank-you');
        }
    }
    
    document.addEventListener('DOMContentLoaded', () => {
        // Load user info onto checkout fields
        document.getElementById('checkout-name').value = userInfo.name || 'N/A';
        document.getElementById('checkout-phone').value = userInfo.phone ? `+91 ${userInfo.phone}` : 'N/A';

        // ACTIVATE PAY NOW BUTTON
        document.getElementById('pay-now-btn')?.addEventListener('click', validateAndPay);
        updateCartCount();
    });
}