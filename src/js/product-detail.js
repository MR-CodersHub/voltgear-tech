/**
 * product-detail.js
 * Handles dynamic content loading for the product detail page
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Get Product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // 2. Find Product in Data
    // Ensure TechGearData is loaded
    if (!window.TechGearData || !window.TechGearData.products) {
        console.error('TechGearData.products not found.');
        showNotFound();
        return;
    }

    const product = window.TechGearData.products.find(p => p.id === productId);

    if (!product) {
        showNotFound();
        return;
    }

    // 3. Render Product Info
    renderProduct(product);

    // 4. Initialize Event Listeners
    initPurchaseControls(product);
});

function renderProduct(product) {
    // Basics
    setText('product-name', product.name);
    setText('breadcrumb-product-name', product.name);
    setText('product-category', product.category);
    setText('product-rating', product.rating);
    setText('product-reviews', `${product.reviews} Reviews`);
    setText('product-stock', product.stock);
    setText('product-short-desc', product.shortDescription);
    setText('product-price', `$${product.price}`);
    setText('product-description', product.description);
    setText('product-delivery', product.delivery);

    // Image
    const imgEl = document.getElementById('product-image');
    if (imgEl) {
        imgEl.src = product.image;
        imgEl.alt = product.name;
    }

    // Tag (Badge)
    const tagEl = document.getElementById('product-tag');
    if (tagEl && product.tag) {
        tagEl.textContent = product.tag;
        tagEl.classList.remove('hidden');
    } else if (tagEl) {
        tagEl.classList.add('hidden');
    }

    // Features List
    const featuresContainer = document.getElementById('product-features');
    if (featuresContainer && product.features) {
        featuresContainer.innerHTML = product.features.map(feature => `
            <li class="flex items-start text-secondary">
                <span class="mr-2 text-accent">✓</span>
                ${feature}
            </li>
        `).join('');
    }

    // Stock Color Logic
    const stockEl = document.getElementById('product-stock');
    if (stockEl) {
        if (product.stock === 'Out of Stock') {
            stockEl.className = 'text-red-500 font-medium';
        } else if (product.stock === 'Low Stock') {
            stockEl.className = 'text-yellow-500 font-medium';
        } else {
            stockEl.className = 'text-green-400 font-medium';
        }
    }
}

function showNotFound() {
    const content = document.getElementById('product-content');
    const notFound = document.getElementById('not-found-state');

    if (content) content.classList.add('hidden');
    if (notFound) notFound.classList.remove('hidden');
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

// Purchase Controls
let currentQuantity = 1;

function updateQuantity(change) {
    currentQuantity += change;
    if (currentQuantity < 1) currentQuantity = 1;
    // Max limit check could be added here based on stock
    if (currentQuantity > 10) currentQuantity = 10;

    setText('quantity-display', currentQuantity);
}

// Expose updateQuantity to global scope for HTML onclick
window.updateQuantity = updateQuantity;

function initPurchaseControls(product) {
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const buyNowBtn = document.getElementById('buy-now-btn');

    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            addToCart(product, currentQuantity);
        });
    }

    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', () => {
            // Simplified "Buy Now" - Add to cart and go to checkout
            addToCart(product, currentQuantity, false); // Don't show toast if redirecting immediately? 
            // Actually, showing toast is fine, but let's just redirect for "Buy Now"
            window.location.href = 'checkout.html';
        });
    }
}

function addToCart(product, qty, showToast = true) {
    if (!window.Cart) {
        console.error('Cart manager not loaded');
        return;
    }

    // Map product data to cart format (CartManager expects 'title', we have 'name')
    const cartProduct = {
        id: product.id,
        title: product.name,
        price: product.price,
        image: product.image
    };

    const cartItem = window.Cart.getCartItem(product.id);

    if (cartItem) {
        window.Cart.updateQuantity(product.id, cartItem.quantity + qty);
    } else {
        // Add first item
        window.Cart.addToCart(cartProduct);
        // Update to desired quantity if > 1
        if (qty > 1) {
            window.Cart.updateQuantity(product.id, qty);
        }
    }

    if (showToast) {
        if (window.Toast) {
            window.Toast.success(`${qty} x ${product.name} added to cart!`);
        } else {
            alert(`${qty} x ${product.name} added to cart!`);
        }
    }
}
