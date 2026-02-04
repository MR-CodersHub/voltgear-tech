/**
 * services.js
 * Premium rendering logic for TechGear Services (Products) Listing - Aurora Theme
 */

document.addEventListener('DOMContentLoaded', () => {
    renderServices();
});

function renderServices() {
    const container = document.getElementById('services-container');
    if (!container) return;

    const services = TechGearData.services;
    
    // Separate featured and secondary services
    const featuredService = services.find(s => s.isFeatured);
    const secondaryServices = services.filter(s => !s.isFeatured);
    
    // Render featured first
    let html = '';
    if (featuredService) {
        html += renderFeaturedService(featuredService, 0);
    }
    
    // Then render secondary services
    secondaryServices.forEach((service, index) => {
        html += renderSecondaryService(service, index + 1);
    });
    
    container.innerHTML = html;
    setupAddToCartListeners();
}

function renderFeaturedService(service, index) {
    // Get the price from the first pricing tier
    const basePrice = parseFloat(service.pricing[0].price.replace('$', ''));
    
    return `
        <div class="group block overflow-hidden reveal-up relative md:col-span-2 lg:col-span-4" 
             style="animation-delay: ${index * 0.1}s">
            
            <div class="glass-panel h-full flex flex-col lg:flex-row border-white/5 hover:border-accent/30 transition-all duration-700 overflow-hidden glow-hover">
                <!-- Product Visual -->
                <div class="relative bg-gradient-to-br from-white/5 to-transparent lg:w-1/2 p-12 lg:p-16 flex items-center justify-center overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-tr from-accent/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <img src="../../${service.image}" alt="${service.title}"
                        class="w-full h-80 lg:h-96 object-contain relative z-10 group-hover:scale-110 transition-transform duration-700 filter drop-shadow-[0_0_40px_rgba(0,255,255,0.15)] group-hover:drop-shadow-[0_0_60px_rgba(0,255,255,0.25)]">
                    
                    <div class="absolute top-8 left-8 flex flex-col gap-2 z-20">
                        <span class="badge-accent uppercase tracking-widest text-[9px] bg-accent/25 text-accent font-black px-4 py-2">FOR: ${service.audience || 'Tech Enthusiasts'}</span>
                        <span class="text-[9px] font-black text-accent/60 uppercase tracking-[0.3em] font-outfit">★ Featured Collection</span>
                    </div>
                </div>

                <!-- Product Details -->
                <div class="p-10 lg:p-16 flex flex-col justify-center flex-grow lg:w-1/2">
                    <div class="mb-6">
                        <h2 class="text-5xl lg:text-7xl font-black mb-4 tracking-tighter group-hover:text-accent transition-colors duration-500">
                            ${service.title}
                        </h2>
                        <p class="text-secondary text-lg leading-relaxed max-w-lg">
                            ${service.description}
                        </p>
                    </div>
                    
                    <div class="flex flex-wrap gap-6 mb-12">
                        ${service.features.slice(0, 2).map(feature => `
                            <div class="flex items-start gap-3">
                                <span class="text-accent text-xl leading-none mt-1">◈</span>
                                <div>
                                    <p class="text-sm font-medium text-secondary">${feature}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="mt-auto flex gap-4">
                        <button class="add-to-cart btn-primary px-10 py-4 text-lg" data-product-id="${service.id}" data-product-data='${JSON.stringify({
                            id: service.id,
                            title: service.title,
                            image: service.image,
                            price: basePrice
                        })}'>
                            ADD TO CART
                        </button>
                        <a href="service-details.html?id=${service.id}" 
                           class="btn-outline px-10 py-4 text-lg" 
                           onclick="logServiceView('${service.id}', '${service.title}')">
                            DETAILS →
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderSecondaryService(service, index) {
    // Get the price from the first pricing tier
    const basePrice = parseFloat(service.pricing[0].price.replace('$', ''));
    
    return `
        <div class="group block overflow-hidden reveal-up relative" 
             style="animation-delay: ${index * 0.1}s">
            
            <div class="glass-panel h-full flex flex-col border-white/5 hover:border-accent/30 transition-all duration-700 overflow-hidden glow-hover">
                <!-- Product Visual - Compact -->
                <div class="relative bg-gradient-to-br from-white/5 to-transparent p-8 flex items-center justify-center overflow-hidden aspect-square">
                    <div class="absolute inset-0 bg-gradient-to-tr from-accent/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <img src="../../${service.image}" alt="${service.title}"
                        class="w-full h-full object-contain relative z-10 group-hover:scale-105 transition-transform duration-500 filter drop-shadow-[0_0_30px_rgba(0,255,255,0.1)] group-hover:drop-shadow-[0_0_40px_rgba(0,255,255,0.2)]">
                    
                    <div class="absolute top-4 left-4 z-20">
                        <span class="badge-accent uppercase tracking-widest text-[8px] bg-accent/20 text-accent font-black px-3 py-1">
                            ${service.audience.split(' ')[0]}
                        </span>
                    </div>
                </div>

                <!-- Product Details - Compact -->
                <div class="p-6 flex flex-col flex-grow">
                    <h3 class="text-xl font-black mb-2 tracking-tighter group-hover:text-accent transition-colors duration-300">
                        ${service.title}
                    </h3>
                    <p class="text-secondary/80 text-sm leading-relaxed mb-4 line-clamp-2">
                        ${service.shortDescription}
                    </p>
                    
                    <div class="flex flex-col gap-2 mb-4 flex-grow">
                        ${service.features.slice(0, 2).map(feature => `
                            <div class="flex items-start gap-2 text-[11px] text-secondary/70">
                                <span class="text-accent text-xs leading-none mt-0.5">◆</span>
                                <span>${feature}</span>
                            </div>
                        `).join('')}
                    </div>

                    <div class="mt-auto pt-4 border-t border-white/5 space-y-2">
                        <button class="add-to-cart w-full px-4 py-2 bg-accent/20 hover:bg-accent/30 text-accent font-bold text-xs uppercase tracking-wider rounded-lg transition-all" 
                                data-product-id="${service.id}" 
                                data-product-data='${JSON.stringify({
                                    id: service.id,
                                    title: service.title,
                                    image: service.image,
                                    price: basePrice
                                })}'>
                            ADD TO CART
                        </button>
                        <a href="service-details.html?id=${service.id}" 
                           class="block text-accent text-xs font-black uppercase tracking-[0.2em] text-center hover:text-accent/80 transition" 
                           onclick="logServiceView('${service.id}', '${service.title}')">
                            VIEW DETAILS →
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function setupAddToCartListeners() {
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const productData = JSON.parse(btn.dataset.productData);

            if (window.Cart) {
                window.Cart.addToCart(productData);
                showAddToCartFeedback(btn);
            }
        });
    });
}

function showAddToCartFeedback(button) {
    const originalText = button.textContent;
    button.textContent = '✓ ADDED';
    button.classList.add('bg-accent/30');

    setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('bg-accent/30');
    }, 1500);
}

function logServiceView(id, title) {
    ActivityLogger.log('View Product Listing', { productId: id, productName: title });
}

