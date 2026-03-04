/**
 * service-details.js
 * Premium dynamic rendering for VoltGear Service Details - Aurora Theme
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial State: Check for dependencies
    if (typeof TechGearData === 'undefined' || typeof URLHelper === 'undefined') {
        console.error('Core dependencies (data.js or utils.js) not loaded.');
        showFallback('Critical System Error', 'Required data modules failed to load. Please refresh the page.', true);
        return;
    }

    const serviceId = URLHelper.getParam('id');

    if (!serviceId) {
        showFallback('Missing Collection ID', 'No collection was specified in the request.');
        return;
    }

    // 2. Find Service in Data
    const service = TechGearData.services.find(s => s.id === serviceId);

    if (!service) {
        showFallback('Collection Not Found', `The gear collection with ID "${serviceId}" does not exist or has been discontinued.`);
        return;
    }

    // 3. Render Page
    try {
        // Update Page Title
        document.title = `${service.title} - VoltGear`;

        renderHero(service);
        renderFeatures(service);
        renderModels(service);
        renderFAQs(service);
        renderRelatedGuides(service.id);

        // Notify reveal observer
        setTimeout(() => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-reveal');
                        if (entry.target.classList.contains('stagger-child')) {
                            entry.target.setAttribute('data-active', 'true');
                        }
                    }
                });
            }, { threshold: 0.1 });
            document.querySelectorAll('.reveal-up, .stagger-child').forEach(el => observer.observe(el));
        }, 100);

        // Log Activity
        if (typeof ActivityLogger !== 'undefined') {
            ActivityLogger.log('View Gear Details', { categoryId: service.id, categoryName: service.title });
        }
    } catch (err) {
        console.error('Error rendering service details:', err);
        showFallback('Rendering Error', 'Something went wrong while building the page content.');
    }
});

function showFallback(title, message, isCritical = false) {
    const hero = document.getElementById('service-hero');
    if (hero) {
        hero.innerHTML = `
            <section class="min-h-[70vh] flex items-center pt-32 pb-20 px-4 relative overflow-hidden bg-dark-deep">
                <div class="absolute inset-0 bg-red-500/5 blur-[150px] rounded-full"></div>
                <div class="max-w-4xl mx-auto w-full text-center relative z-10">
                    <div class="inline-block mb-6">
                        <span class="px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-[0.2em]">System Status</span>
                    </div>
                    <h1 class="text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase">${title}</h1>
                    <p class="text-secondary text-lg mb-10 max-w-xl mx-auto">${message}</p>
                    <div class="flex flex-wrap justify-center gap-4">
                        <a href="services.html" class="btn-primary py-4 px-10 text-xs tracking-widest">BACK TO PRODUCTS</a>
                        ${!isCritical ? '<a href="home2.html" class="btn-outline py-4 px-10 text-xs tracking-widest">GO HOME</a>' : ''}
                    </div>
                </div>
            </section>
        `;
    }

    // Hide other sections to prevent weird empty containers
    ['service-features', 'service-models', 'service-faqs', 'related-guides'].forEach(id => {
        const el = document.getElementById(id);
        if (el && el.closest('section')) {
            el.closest('section').classList.add('hidden');
        }
    });
}

function renderHero(service) {
    const container = document.getElementById('service-hero');
    if (!container) return;

    // Use a default image if none provided
    const imgUrl = service.image ? `../../${service.image}` : '../../assets/img/gaming-headset.png';

    container.innerHTML = `
        <section class="min-h-[85vh] flex items-center pt-32 pb-20 px-4 relative overflow-hidden">
            <div class="absolute inset-0 bg-accent/5 blur-[150px] rounded-full animate-aurora"></div>
            <div class="max-w-7xl mx-auto w-full relative z-10">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div class="reveal-up">
                        <div class="inline-block mb-6">
                            <span class="badge-accent tracking-widest text-[10px] uppercase">Elite Series</span>
                        </div>
                        <h1 class="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter uppercase">
                            ${service.title.split(' ')[0]} <br> <span class="text-gradient">${service.title.split(' ').slice(1).join(' ')}</span>
                        </h1>
                        <p class="text-xl text-secondary mb-10 max-w-lg leading-relaxed">
                            ${service.description}
                        </p>
                        <div class="flex flex-wrap gap-6">
                             <button class="btn-primary py-4 px-10 text-xs tracking-widest add-to-cart-btn" data-product-data='{"id":"${service.id}","title":"${service.title}","image":"${service.image}","price":${service.pricing[0].price.replace('$', '')}}'>ADD TO CART</button>
                             <button class="btn-outline py-4 px-10 text-xs tracking-widest uppercase">Specifications</button>
                        </div>
                    </div>
                    <div class="relative group reveal-up" style="animation-delay: 0.2s">
                        <div class="absolute inset-0 bg-accent/20 blur-[100px] rounded-full group-hover:bg-accent/30 transition-all duration-700"></div>
                        <img src="${imgUrl}" alt="${service.title}"
                            onerror="this.src='../../assets/img/gaming-headset.png'"
                            class="relative z-10 max-w-full h-auto animate-float filter drop-shadow-[0_0_50px_rgba(0,255,255,0.2)]">
                    </div>
                </div>
            </div>
        </section>
    `;

    setupAddToCartListeners();
}

function renderFeatures(service) {
    const container = document.getElementById('service-features');
    if (!container) return;

    if (!service.features || service.features.length === 0) {
        container.closest('section').classList.add('hidden');
        return;
    }

    container.innerHTML = service.features.map((feature, index) => `
        <div class="glass-card p-10 group transition-all duration-500 reveal-up" style="animation-delay: ${index * 0.1}s">
            <div class="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-8 text-accent group-hover:bg-accent group-hover:text-black group-hover:rotate-6 transition-all duration-300">
                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
            </div>
            <h3 class="text-xl font-black mb-4 uppercase tracking-tighter">${feature.split(' ').slice(0, 2).join(' ')}</h3>
            <p class="text-secondary text-sm leading-relaxed">${feature}</p>
        </div>
    `).join('');
}

function renderModels(service) {
    const container = document.getElementById('service-models');
    if (!container) return;

    if (!service.pricing || service.pricing.length === 0) {
        container.closest('section').classList.add('hidden');
        return;
    }

    container.innerHTML = service.pricing.map((tier, index) => {
        const basePrice = tier.price.replace('$', '');
        return `
        <div class="glass-card p-10 flex flex-col items-center text-center transition-all duration-500 reveal-up ${index === 1 ? 'border-accent/40 bg-accent/[0.02] shadow-[0_0_50px_rgba(0,255,255,0.1)]' : ''}" style="animation-delay: ${index * 0.15}s">
            ${index === 1 ? '<span class="badge-accent text-[10px] mb-8 tracking-[0.3em] uppercase">Signature Edition</span>' : ''}
            <div class="mb-4">
                <h3 class="text-2xl font-black mb-1 uppercase tracking-tighter">${tier.name}</h3>
                <div class="h-1 w-12 bg-accent/30 mx-auto rounded-full"></div>
            </div>
            <div class="text-5xl font-black text-white font-outfit mb-10 tracking-tight">${tier.price}<span class="text-sm text-secondary tracking-widest font-bold ml-1">.00</span></div>
            
            <ul class="space-y-5 mb-12 w-full">
                ${tier.features.map(f => `
                    <li class="flex items-center justify-center gap-3 text-[13px] text-secondary">
                        <svg class="w-4 h-4 text-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                        <span>${f}</span>
                    </li>
                `).join('')}
            </ul>
            <button class="${index === 1 ? 'btn-primary' : 'btn-outline'} w-full uppercase tracking-[0.2em] text-[10px] py-4 font-black add-to-cart-btn" 
                    data-product-data='{"id":"${service.id}","title":"${service.title} - ${tier.name}","image":"${service.image}","price":${basePrice}}'>
                ORDER ${tier.name}
            </button>
        </div>
        `;
    }).join('');

    setupAddToCartListeners();
}

function renderFAQs(service) {
    const container = document.getElementById('service-faqs');
    if (!container) return;

    if (!service.faqs || service.faqs.length === 0) {
        container.closest('section').classList.add('hidden');
        return;
    }

    container.innerHTML = service.faqs.map((faq, index) => `
        <div class="glass-panel p-1 border-white/5 reveal-up mb-4" style="animation-delay: ${index * 0.1}s">
            <div class="faq-item p-6 cursor-pointer group rounded-xl transition-all duration-300 hover:bg-white/[0.03]" 
                 onclick="this.classList.toggle('active'); this.querySelector('.faq-answer').classList.toggle('hidden')">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-bold tracking-tight text-secondary group-[.active]:text-white transition-colors">${faq.q}</h3>
                    <div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-accent transition-all duration-500 group-[.active]:rotate-180 group-[.active]:bg-accent group-[.active]:text-black">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </div>
                </div>
                <div class="faq-answer mt-6 text-secondary text-sm leading-relaxed hidden animate-fade-in-up">
                    ${faq.a}
                </div>
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
                        onerror="this.src='../../assets/img/rgb-keyboard.png'"
                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0">
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
                        <span>${post.readTime} Read</span>
                        <span class="text-accent group-hover:translate-x-1 transition-all duration-300 inline-block">READ GUIDE →</span>
                    </div>
                </div>
            </a>
        </article>
    `).join('');
}

function setupAddToCartListeners() {
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        // Remove existing listeners to prevent duplicates
        const newBtn = button.cloneNode(true);
        button.parentNode.replaceChild(newBtn, button);

        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            try {
                const productData = JSON.parse(newBtn.getAttribute('data-product-data'));
                if (window.Cart) {
                    window.Cart.addToCart(productData);
                    showAddToCartFeedback(newBtn);
                }
            } catch (err) {
                console.error('Error adding to cart:', err);
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