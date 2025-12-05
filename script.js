// =======================================================
// 1. GLOBAL STATE AND HELPER FUNCTIONS
// =======================================================

const APP_SCREENS = ['home-screen', 'cart-screen', 'profile-screen', 'book-details-screen', 'checkout-screen', 'thank-you-screen'];

// Data structure to simulate cart items
let cart = JSON.parse(localStorage.getItem('cart')) || []; 
let bookData = [
    {id: 'WOH001', title: 'ഹൃദയത്തിന്റെ മന്ത്രണങ്ങൾ', price: 299, author: 'NIK', category: 'Poetry', lang: 'ml'},
    // Add more book objects here as needed
];

// Helper to get the current page name
function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('checkout.html')) return 'checkout';
    if (path.includes('home.html')) return 'home';
    return 'index'; // Default is index.html
}

// =======================================================
// 2. INDEX.HTML (Login/Redirect Logic)
// =======================================================

function validateAndRedirect() {
    if (getCurrentPage() !== 'index') return; // Only run on index.html
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;

    if (name.trim() === "" || phone.length !== 10) {
        alert("Please enter a valid name and a 10-digit phone number.");
        return;
    }

    // 1. Store user data
    localStorage.setItem('userName', name);
    localStorage.setItem('userPhone', phone);
    localStorage.setItem('isLoggedIn', 'true');

    // 2. Redirect to the main app page
    window.location.href = 'home.html';
}

function handleIndexInit() {
    if (getCurrentPage() === 'index' && localStorage.getItem('isLoggedIn') === 'true') {
        // Auto-redirect if already logged in
        window.location.href = 'home.html';
    }

    // Language toggle for visual effect (only on index)
    document.querySelectorAll('.lang-button').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.lang-button').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// =======================================================
// 3. HOME.HTML (Internal Navigation and Cart Management)
// =======================================================

// Function to handle internal screen switching within home.html
function showScreen(screenId, navElement = null) {
    if (getCurrentPage() !== 'home') return; 

    // Hide all screens
    APP_SCREENS.forEach(id => {
        const screen = document.getElementById(id);
        if (screen) screen.style.display = 'none';
    });
    
    // Show the target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) targetScreen.style.display = 'flex'; // Use flex for layout

    // Update bottom nav active state
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    if (navElement) {
        navElement.classList.add('active');
        // Hide bottom-actions-bar when navigating to main screens
        document.querySelector('.bottom-actions-bar').style.display = 'none';
    }

    // Special handling for the details screen to show the action bar
    if (screenId === 'book-details-screen') {
        document.querySelector('.bottom-actions-bar').style.display = 'flex';
    }

    // Update cart screen data if navigating to it
    if (screenId === 'cart-screen') {
        renderCart();
    }
}

function showBookDetails(title, price, category, id) {
    if (getCurrentPage() !== 'home') return;

    // Logic to render the book details goes here
    const detailsContent = document.querySelector('.book-details-content');
    detailsContent.innerHTML = `
        <img src="images/placeholder.png" alt="Book Cover" style="width: 100%; height: auto; border-radius: 8px;">
        <h3 style="margin-top: 15px;">${title}</h3>
        <p>Author: NIK</p>
        <p>Category: ${category}</p>
        <p style="font-size: 1.5em; font-weight: bold; color: var(--primary-color);">Price: ₹${price}</p>
        <p style="margin-top: 15px;">Detailed description of the book goes here...</p>
    `;
    // Hide the main nav bar when showing details (it will reappear when returning home)
    document.getElementById('main-bottom-nav').style.display = 'none'; 
    showScreen('book-details-screen');
}

function addToCart() {
    if (getCurrentPage() !== 'home') return;
    
    // Simple mock logic: get the current book from the details screen
    const bookTitle = document.querySelector('.book-details-content h3').innerText;
    const existingItem = cart.find(item => item.title === bookTitle);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        const book = bookData.find(b => b.title === bookTitle);
        if (book) {
            cart.push({...book, quantity: 1});
        }
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    alert(`${bookTitle} added to cart!`);
}

function updateCartBadge() {
    if (getCurrentPage() === 'home') {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const badge = document.getElementById('cart-count');
        if (badge) {
            badge.innerText = totalItems;
            badge.style.display = totalItems > 0 ? 'block' : 'none';
        }
    }
}

function renderCart() {
    // Renders cart items on cart-screen (implementation omitted for brevity)
}

function buyNow() {
    // Clear cart and add only the current book, then redirect to checkout.html
    alert("Buy Now clicked! Redirecting to checkout.");
    // Implementation needed here
    window.location.href = 'checkout.html';
}

function handleHomeInit() {
    if (getCurrentPage() !== 'home') return;
    
    // Check if user is logged in, if not, redirect to index.html
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'index.html';
        return;
    }
    
    // Initial setup: Show the home screen and hide others
    showScreen('home-screen', document.querySelector('.nav-item[data-target="home"]'));
    document.getElementById('main-bottom-nav').style.display = 'flex'; // Ensure nav is visible on the home page
    document.querySelector('.bottom-actions-bar').style.display = 'none'; 
    updateCartBadge();

    // Dark mode toggle listener
    document.querySelector('.dark-mode-toggle').addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
    });
}

// =======================================================
// 4. CHECKOUT.HTML (Validation and Payment Logic)
// =======================================================

function calculateTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return total;
}

function renderCheckoutSummary() {
    if (getCurrentPage() !== 'checkout') return;
    
    const summaryItems = document.getElementById('summary-items');
    let total = 0;
    summaryItems.innerHTML = '';

    if (cart.length === 0) {
        summaryItems.innerHTML = '<p>Your cart is empty.</p>';
        document.getElementById('pay-now-btn').disabled = true;
    } else {
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
    }

    document.getElementById('total-amount').innerText = `₹${total}`;
    document.getElementById('pay-btn-text').innerText = `₹${total} അടയ്ക്കുക`;
}

function processPayment() {
    if (getCurrentPage() !== 'checkout') return;

    const address = document.getElementById('address').value.trim();
    const pincode = document.getElementById('pincode').value.trim();
    let isValid = true;

    // Basic Validation
    if (address.length < 10) {
        document.getElementById('address-error').innerText = "Please enter a complete address.";
        document.getElementById('address-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('address-error').style.display = 'none';
    }

    if (pincode.length !== 6 || isNaN(pincode)) {
        document.getElementById('pincode-error').innerText = "Please enter a 6-digit PIN code.";
        document.getElementById('pincode-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('pincode-error').style.display = 'none';
    }

    if (isValid) {
        // Clear cart after successful order
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Show thank you screen
        document.getElementById('checkout-screen').style.display = 'none';
        document.getElementById('thank-you-screen').style.display = 'flex';
        window.scrollTo(0, 0); // Scroll to top
    }
}

function handleCheckoutInit() {
    if (getCurrentPage() !== 'checkout') return;
    
    // Initial display setup
    document.getElementById('checkout-screen').style.display = 'flex';
    document.getElementById('thank-you-screen').style.display = 'none';
    renderCheckoutSummary();
}

// =======================================================
// 5. INITIALIZATION LOGIC (Runs on every page load)
// =======================================================

window.addEventListener('load', () => {
    const page = getCurrentPage();

    if (page === 'index') {
        handleIndexInit();
    } else if (page === 'home') {
        handleHomeInit();
    } else if (page === 'checkout') {
        handleCheckoutInit();
    }
});