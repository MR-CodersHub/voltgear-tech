/**
 * product-detail.js
 * Handles dynamic content loading for the VoltGear product detail page - Aurora Theme
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Dependency & Data Check
    if (typeof TechGearData === 'undefined' || typeof TechGearData.products === 'undefined') {
        console.error('TechGearData.products not found.');
        showNotFound('System Error', 'Product database failed to load. Please try again later.');
        return;
    }

    // 2. Get Product ID from URL
    const productId = (typeof URLHelper !== 'undefined')
        ? URLHelper.getParam('id')
        : new URLSearchParams(window.location.search).get('id');

    if (!productId) {
        showNotFound('Missing Product ID', 'No product was specified for viewing.');
        return;
    }

    // 3. Find Product in Data
    const product = TechGearData.products.find(p => p.id === productId);

    if (!product) {
        showNotFound('Product Not Found', `We couldn't find a product with the ID "${productId}". it may have been renamed or removed.`);
        return;
    }

    // 4. Render Product Info
    try {
        renderProduct(product);
        initPurchaseControls(product);

        // Log Activity
        if (typeof ActivityLogger !== 'undefined') {
            ActivityLogger.log('View Product Details', { productId: product.id, productName: product.name });
        }
    } catch (err) {
        console.error('Error rendering product:', err);
        showNotFound('Display Error', 'An error occurred while building the product page.');
    }
});

function renderProduct(product) {
    // Basic Text Fields
    setText('product-name', product.name);
    setText('breadcrumb-product-name', product.name);
    setText('product-category', product.category);
    setText('product-rating', product.rating || '4.8');
    setText('product-reviews', `${product.reviews || '48'} Reviews`);
    setText('product-stock', product.stock || 'In Stock');
    setText('product-short-desc', product.shortDescription);
    setText('product-price', `$${product.price}`);
    setText('product-description', product.description || 'Premium high-performance gear engineered for professional workflows and competitive gaming sessions.');
    setText('product-delivery', product.delivery || 'Free delivery on orders over $100');

    // Page Title
    document.title = `${product.name} - VoltGear`;

    // Image with error handling
    const imgEl = document.getElementById('product-image');
    if (imgEl) {
        imgEl.src = product.image.startsWith('assets') ? `../../${product.image}` : product.image;
        imgEl.alt = product.name;
        imgEl.onerror = () => { imgEl.src = '../../assets/img/gaming-headset.png'; };
    }

    // Tag (Badge)
    const tagEl = document.getElementById('product-tag');
    if (tagEl) {
        if (product.tag) {
            tagEl.textContent = product.tag;
            tagEl.classList.remove('hidden');
        } else {
            tagEl.classList.add('hidden');
        }
    }

    // Features List
    const featuresContainer = document.getElementById('product-features');
    if (featuresContainer && product.features) {
        featuresContainer.innerHTML = product.features.map(feature => `
            <li class="flex items-start text-secondary animate-reveal" style="transition-delay: 200ms">
                <span class="mr-3 text-accent font-bold">✓</span>
                <span class="text-sm leading-relaxed">${feature}</span>
            </li>
        `).join('');
    }

    // Stock Color Logic
    const stockEl = document.getElementById('product-stock');
    if (stockEl) {
        const stockStatus = (product.stock || 'In Stock').toLowerCase();
        if (stockStatus.includes('out')) {
            stockEl.className = 'text-red-500 font-bold text-sm';
        } else if (stockStatus.includes('low')) {
            stockEl.className = 'text-yellow-500 font-bold text-sm';
        } else {
            stockEl.className = 'text-accent font-bold text-sm';
        }
    }

    // Ensure content is visible (in case it was hidden by 404 previously)
    const content = document.getElementById('product-content');
    const notFound = document.getElementById('not-found-state');
    if (content) content.classList.remove('hidden');
    if (notFound) notFound.classList.add('hidden');
}

function showNotFound(title, message) {
    const content = document.getElementById('product-content');
    const notFound = document.getElementById('not-found-state');

    if (content) content.classList.add('hidden');
    if (notFound) {
        notFound.classList.remove('hidden');
        notFound.innerHTML = `
            <div class="max-w-2xl mx-auto text-center py-20 px-4">
                <div class="inline-block mb-6">
                    <span class="px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-[0.2em]">Product Status</span>
                </div>
                <h2 class="text-4xl md:text-5xl font-black mb-6 tracking-tighter uppercase">${title}</h2>
                <p class="text-secondary text-lg mb-10">${message}</p>
                <div class="flex flex-wrap justify-center gap-4">
                    <a href="services.html" class="btn-primary py-4 px-10 text-xs tracking-widest">CONTINUE SHOPPING</a>
                    <a href="home2.html" class="btn-outline py-4 px-10 text-xs tracking-widest">GO HOME</a>
                </div>
            </div>
        `;
    }
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
    if (currentQuantity > 10) currentQuantity = 10;

    setText('quantity-display', currentQuantity);
}

// Expose to global scope for HTML onclick
window.updateQuantity = updateQuantity;

function initPurchaseControls(product) {
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const buyNowBtn = document.getElementById('buy-now-btn');

    if (addToCartBtn) {
        // Clone and replace to clear existing listeners
        const newBtn = addToCartBtn.cloneNode(true);
        addToCartBtn.parentNode.replaceChild(newBtn, addToCartBtn);

        newBtn.addEventListener('click', () => {
            handleAddToCart(product, currentQuantity);
            showBtnFeedback(newBtn, '✓ ADDED');
        });
    }

    if (buyNowBtn) {
        const newBuyBtn = buyNowBtn.cloneNode(true);
        buyNowBtn.parentNode.replaceChild(newBuyBtn, buyNowBtn);

        newBuyBtn.addEventListener('click', () => {
            const cartProduct = {
                id: product.id,
                title: product.name,
                price: product.price,
                image: product.image
            };

            if (window.PurchaseManager) {
                window.PurchaseManager.buyNow(cartProduct, currentQuantity);
            } else {
                handleAddToCart(product, currentQuantity, false);
                window.location.href = 'checkout.html';
            }
        });
    }
}

function showBtnFeedback(btn, tempText) {
    const originalContent = btn.innerHTML;
    btn.innerHTML = `<span>${tempText}</span>`;
    btn.classList.add('opacity-50', 'pointer-events-none');
    setTimeout(() => {
        btn.innerHTML = originalContent;
        btn.classList.remove('opacity-50', 'pointer-events-none');
    }, 1500);
}

function handleAddToCart(product, qty, showToast = true) {
    if (!window.Cart) {
        console.error('Cart manager not loaded');
        return;
    }

    const cartProduct = {
        id: product.id,
        title: product.name,
        price: product.price,
        image: product.image
    };

    window.Cart.addToCart(cartProduct, qty);

    if (showToast) {
        if (window.Toast) {
            window.Toast.success(`${qty} x ${product.name} added to cart!`);
        }
    }
}
