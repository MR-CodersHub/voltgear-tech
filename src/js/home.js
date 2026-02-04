/**
 * home.js
 * Premium rendering logic for TechGear Homepage - Aurora Theme
 */

document.addEventListener('DOMContentLoaded', () => {
    renderCategories();
    renderFeaturedProducts();
    renderHomeBlog();
});

function renderCategories() {
    const container = document.getElementById('categories-container');
    if (!container) return;

    const categories = TechGearData.services.slice(0, 3);

    container.innerHTML = categories.map((category, index) => `
        <a href="public/pages/service-details.html?id=${category.id}" 
           class="glass-card group flex flex-col h-full overflow-hidden reveal-up" 
           style="animation-delay: ${index * 0.15}s">
            <div class="relative h-64 bg-white/5 flex items-center justify-center p-12 overflow-hidden">
                <div class="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <img src="${category.image}" alt="${category.title}"
                    class="w-full h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-700">
            </div>
            <div class="p-8 flex-grow flex flex-col border-t border-white/5">
                <span class="text-[10px] font-outfit font-black uppercase tracking-[0.2em] text-accent mb-3 block">Category</span>
                <h3 class="text-2xl font-black mb-3 tracking-tighter group-hover:text-accent transition-colors duration-300">
                    ${category.title}
                </h3>
                <p class="text-secondary text-sm leading-relaxed mb-6 flex-grow">
                    ${category.shortDescription}
                </p>
                <div class="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest mt-auto group-hover:gap-4 transition-all duration-300">
                    Discover Collection <span class="text-accent text-lg">→</span>
                </div>
            </div>
        </a>
    `).join('');
}

function renderFeaturedProducts() {
    const container = document.getElementById('featured-container');
    if (!container) return;

    const featured = TechGearData.services;

    container.innerHTML = featured.map((item, index) => {
        const startPrice = item.pricing ? item.pricing[0].price : '$0';
        const basePrice = item.pricing ? parseFloat(item.pricing[0].price.replace('$', '')) : 0;
        return `
            <div class="glass-card flex flex-col h-full group reveal-up" style="animation-delay: ${index * 0.1}s">
                <div class="relative aspect-square bg-white/5 flex items-center justify-center p-8 cursor-pointer overflow-hidden" 
                     onclick="window.location.href='public/pages/service-details.html?id=${item.id}'">
                    <img src="${item.image}" alt="${item.title}"
                        class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700">
                    <div class="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                        <button class="quick-add-btn w-full btn-primary text-[10px] py-3 tracking-[0.2em]" 
                                data-product-data='${JSON.stringify({
                                    id: item.id,
                                    title: item.title,
                                    image: item.image,
                                    price: basePrice
                                })}'
                                onclick="event.stopPropagation();">
                            QUICK ADD
                        </button>
                    </div>
                </div>
                <div class="p-6 flex flex-col flex-grow border-t border-white/5">
                    <h3 class="font-bold text-lg mb-2 uppercase tracking-tight">${item.title}</h3>
                    <div class="flex justify-between items-center mt-auto">
                        <span class="text-xl font-black text-white font-outfit">${startPrice}</span>
                        <span class="text-[10px] text-muted font-bold tracking-widest uppercase">Premium Gear</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Setup quick add listeners
    setupQuickAddListeners();
}

function renderHomeBlog() {
    const container = document.getElementById('home-blog-container');
    if (!container) return;

    const latestPosts = TechGearData.blog.slice(0, 3);

    container.innerHTML = latestPosts.map((post, index) => `
        <article class="glass-card group flex flex-col h-full overflow-hidden reveal-up" style="animation-delay: ${index * 0.15}s">
            <a href="public/pages/blog-details.html?id=${post.id}" class="block h-full flex flex-col">
                <div class="relative aspect-video overflow-hidden bg-white/5">
                    <img src="${post.image}" alt="${post.title}" 
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
// ===== QUICK ADD FUNCTIONALITY =====
function setupQuickAddListeners() {
    document.querySelectorAll('.quick-add-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const productData = JSON.parse(btn.getAttribute('data-product-data'));

            if (window.Cart) {
                window.Cart.addToCart(productData);
                showQuickAddFeedback(btn);
            }
        });
    });
}

function showQuickAddFeedback(button) {
    const originalText = button.textContent;
    button.textContent = '✓ ADDED';
    button.classList.add('opacity-70');

    setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('opacity-70');
    }, 1500);
}