// Global variables needed across both pages (user/cart data, language)
let currentLanguage = 'ml';
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
let userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
const MAIN_NAV_ID = 'main-bottom-nav';

// =================================================================
// 0. GLOBAL PLACEHOLDER FUNCTIONS (Accessible from index.html inline 'onclick')
// =================================================================
function showBookDetails(title, price, category, id) { 
    // Calls showScreen (now globally defined in Section 1)
    showScreen('book-details'); 
}
function addToCart() { 
    // Placeholder - implementation needed later
}
function buyNow() {
    // Placeholder - implementation needed later
}


// =================================================================
// 1. SHARED/GLOBAL FUNCTIONS (Core utilities available everywhere)
// =================================================================

// Function to show/hide the main bottom navigation bar
function showMainNavigationBar() {
    const navBar = document.getElementById(MAIN_NAV_ID);
    if (navBar) {
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
        // Use 'flex' since most screens are display: flex in the CSS
        targetScreen.style.display = 'flex'; 
    }
    
    // Update navigation bar active state
    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
        item.classList.remove('active');
    });
    if (navButton) {
        navButton.classList.add('active');
    } else if (['home', 'cart', 'profile'].includes(targetId)) {
        const targetNav = document.querySelector(`.bottom-nav .nav-item[data-target="${targetId}"]`);
        if (targetNav) targetNav.classList.add('active');
    }
}

function updateCartCount() {
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('#cart-count');
    cartCountElements.forEach(el => {
        el.textContent = totalQty;
        el.style.display = totalQty > 0 ? 'block' : 'none';
    });
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.dark-mode-toggle').forEach(button => {
        button.addEventListener('click', toggleDarkMode);
    });
    updateCartCount(); 
});


// =================================================================
// 2. MAIN APPLICATION LOGIC (Only runs when index.html is loaded)
// =================================================================
const pathname = window.location.pathname;

// Check if the current page is index.html or the root path
if (pathname.includes('index.html') || pathname === '/') {
    
    // --- Index-Specific Functions ---
    
    function switchLanguage(lang) {
        currentLanguage = lang;
        localStorage.setItem('language', lang);
        document.querySelectorAll('.lang-button').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`lang-${lang}`).classList.add('active');
        // --- (Add full language translation logic here) ---
    }

    function handleContinueBtn() {
        const nameInput = document.getElementById('name').value.trim();
        const phoneInput = document.getElementById('phone').value.trim();

        if (nameInput === "" || phoneInput.length !== 10) {
            alert("ദയവായി സാധുവായ പേരും 10 അക്ക ഫോൺ നമ്പറും നൽകുക.");
            return;
        }

        userInfo = { name: nameInput, phone: phoneInput };
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        // Use global functions: showScreen and showMainNavigationBar
        showScreen('home');
        showMainNavigationBar(); 
    }

    function loadInitialState() {
        // Check for language preference
        currentLanguage = localStorage.getItem('language') || 'ml';
        switchLanguage(currentLanguage);

        // Check for user login info
        if (userInfo && userInfo.name && userInfo.phone) {
            showScreen('home');
            showMainNavigationBar(); 
        } else {
            showScreen('login');
        }
    }
    
    // --- Event Listeners for index.html ---
    document.addEventListener('DOMContentLoaded', () => {
        
        loadInitialState();
        
        // ACTIVATE LANGUAGE AND CONTINUE BUTTONS
        const langEnBtn = document.getElementById('lang-en');
        const langMlBtn = document.getElementById('lang-ml');
        const continueBtn = document.getElementById('continue-btn'); 

        if (langEnBtn) {
             langEnBtn.addEventListener('click', () => switchLanguage('en'));
        }
        if (langMlBtn) {
             langMlBtn.addEventListener('click', () => switchLanguage('ml'));
        }
        
        if (continueBtn) {
            continueBtn.addEventListener('click', handleContinueBtn);
        }
    });
}
// =================================================================
// 3. CHECKOUT LOGIC (Only runs when checkout.html is loaded)
// =================================================================
else if (pathname.includes('checkout.html')) {
    
    // ... (rest of your checkout.html logic, which would be added here) ...
}