/**
 * service-details.js
 * Premium dynamic rendering for TechGear Service Details - Aurora Theme
 */

document.addEventListener('DOMContentLoaded', () => {
    const serviceId = URLHelper.getParam('id');

    if (!serviceId) {
        window.location.href = 'services.html';
        return;
    }

    const service = TechGearData.services.find(s => s.id === serviceId);

    if (!service) {
        window.location.href = '404.html';
        return;
    }

    // Update Page Title
    document.title = `${service.title} - TechGear`;

    renderHero(service);
    renderFeatures(service);
    renderModels(service);
    renderFAQs(service);
    renderRelatedGuides(service.id);

    // Log Activity
    ActivityLogger.log('View Product Details', { productId: service.id, productName: service.title });
});

function renderHero(service) {
    const container = document.getElementById('service-hero');
    if (!container) return;

    container.innerHTML = `
        <section class="min-h-[80vh] flex items-center pt-32 pb-20 px-4 relative overflow-hidden">
            <div class="absolute inset-0 bg-accent/5 blur-[150px] rounded-full animate-aurora"></div>
            <div class="max-w-7xl mx-auto w-full relative z-10">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div class="reveal-up">
                        <div class="inline-block mb-6">
                            <span class="badge-accent tracking-widest text-[10px] uppercase">Elite Series</span>
                        </div>
                        <h1 class="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter">
                            ${service.title.split(' ')[0]} <br> <span class="text-gradient">${service.title.split(' ').slice(1).join(' ')}</span>
                        </h1>
                        <p class="text-xl text-secondary mb-10 max-w-lg leading-relaxed">
                            ${service.description}
                        </p>
                        <div class="flex flex-wrap gap-6">
                             <button class="btn-primary add-to-cart-btn" data-product-data='{"id":"${service.id}","title":"${service.title}","image":"${service.image}","price":${service.pricing[0].price.replace('$', '')}}'>ADD TO CART</button>
                             <button class="btn-outline">SPECS SHEET</button>
                        </div>
                    </div>
                    <div class="relative group reveal-up" style="animation-delay: 0.2s">
                        <div class="absolute inset-0 bg-accent/20 blur-[100px] rounded-full group-hover:bg-accent/30 transition-all"></div>
                        <img src="../../${service.image}" alt="${service.title}"
                            class="relative z-10 max-w-full h-auto animate-float filter drop-shadow-[0_0_50px_rgba(0,255,255,0.2)]">
                    </div>
                </div>
            </div>
        </section>
    `;

    // Setup add to cart listener
    setupAddToCartListeners();
}

function renderFeatures(service) {
    const container = document.getElementById('service-features');
    if (!container) return;

    container.innerHTML = service.features.map((feature, index) => `
        <div class="glass-card p-8 group transition-all duration-500 reveal-up" style="animation-delay: ${index * 0.1}s">
            <div class="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-6 text-accent group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
            </div>
            <h3 class="text-xl font-bold mb-3 uppercase tracking-tight">${feature.split(' ').slice(0, 2).join(' ')}</h3>
            <p class="text-secondary text-sm leading-relaxed">${feature}</p>
        </div>
    `).join('');
}

function renderModels(service) {
    const container = document.getElementById('service-models');
    if (!container) return;

    container.innerHTML = service.pricing.map((tier, index) => {
        const basePrice = tier.price.replace('$', '');
        return `
        <div class="glass-card p-10 flex flex-col items-center text-center transition-all duration-500 reveal-up ${index === 1 ? 'border-accent/40 shadow-[0_0_40px_rgba(0,255,255,0.1)]' : ''}" style="animation-delay: ${index * 0.15}s">
            ${index === 1 ? '<span class="badge-accent text-[10px] mb-6 tracking-widest uppercase">Signature Edition</span>' : ''}
            <h3 class="text-2xl font-black mb-2 uppercase tracking-tighter">${tier.name}</h3>
            <div class="text-5xl font-black text-white font-outfit mb-8">${tier.price}</div>
            
            <ul class="space-y-4 mb-10 w-full">
                ${tier.features.map(f => `
                    <li class="flex items-center justify-center gap-3 text-sm text-secondary">
                        <span class="text-accent text-xs">✓</span>
                        ${f}
                    </li>
                `).join('')}
            </ul>
            <button class="${index === 1 ? 'btn-primary' : 'btn-outline'} w-full uppercase tracking-widest text-[10px] py-4 add-to-cart-btn" 
                    data-product-data='{"id":"${service.id}","title":"${service.title} - ${tier.name}","image":"${service.image}","price":${basePrice}}'>
                ORDER ${tier.name}
            </button>
        </div>
        `;
    }).join('');

    // Setup add to cart listeners
    setupAddToCartListeners();
}

function renderFAQs(service) {
    const container = document.getElementById('service-faqs');
    if (!container) return;

    container.innerHTML = service.faqs.map((faq, index) => `
        <div class="glass-card p-6 cursor-pointer group transition-all duration-300 reveal-up" 
             style="animation-delay: ${index * 0.1}s"
             onclick="this.classList.toggle('bg-white/5')">
            <div class="flex justify-between items-center">
                <h3 class="text-lg font-bold tracking-tight">${faq.q}</h3>
                <svg class="w-5 h-5 text-accent group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </div>
            <div class="mt-6 text-secondary text-sm leading-relaxed hidden group-[.bg-white\/5]:block animate-reveal">
                ${faq.a}
            </div>
        </div>
    `).join('');
}

function renderRelatedGuides(categoryId) {
    const container = document.getElementById('related-guides');
    if (!container) return;

    const relatedPosts = TechGearData.blog.filter(post =>
        post.relatedProducts && post.relatedProducts.includes(categoryId)
    ).slice(0, 3);

    if (relatedPosts.length === 0) {
        container.closest('section').classList.add('hidden');
        return;
    }

    container.innerHTML = relatedPosts.map((post, index) => `
        <article class="glass-card group flex flex-col h-full overflow-hidden reveal-up" style="animation-delay: ${index * 0.1}s">
            <a href="blog-details.html?id=${post.id}" class="block h-full flex flex-col">
                <div class="relative aspect-video overflow-hidden bg-white/5">
                    <img src="../../${post.image}" alt="${post.title}" 
                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                    <div class="absolute top-4 left-4">
                        <span class="badge-accent uppercase tracking-[0.3em] text-[10px]">${post.type}</span>
                    </div>
                </div>
                <div class="p-8 flex flex-col flex-grow border-t border-white/5">
                    <h3 class="text-xl font-black mb-4 tracking-tighter group-hover:text-accent transition-colors duration-300">
                        ${post.title}
                    </h3>
                    <p class="text-secondary text-sm mb-6 line-clamp-2">${post.shortDescription}</p>
                    <div class="mt-auto flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted">
                        <span>${post.readTime}</span>
                        <span class="text-accent group-hover:gap-2 transition-all">READ GUIDE →</span>
                    </div>
                </div>
            </a>
        </article>
    `).join('');
}
// ===== ADD TO CART FUNCTIONALITY =====
function setupAddToCartListeners() {
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productData = button.getAttribute('data-product-data');
            if (productData) {
                const product = JSON.parse(productData);
                if (window.Cart) {
                    window.Cart.addToCart(product);
                    showAddToCartFeedback(button);
                }
            }
        });
    });
}

function showAddToCartFeedback(button) {
    const originalText = button.textContent;
    button.textContent = '✓ ADDED';
    button.classList.add('opacity-50');
    
    setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('opacity-50');
    }, 1500);
}