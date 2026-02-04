/**
 * blog.js
 * Premium editorial rendering for TechGear Blog Listing - Aurora Theme
 */

document.addEventListener('DOMContentLoaded', () => {
    renderBlog();
    setupBlogControls();
});

function renderBlog(filter = 'all', searchQuery = '') {
    const grid = document.getElementById('blog-grid');
    const noResults = document.getElementById('no-results');
    if (!grid) return;

    let posts = TechGearData.blog;

    // Apply Filter
    if (filter !== 'all') {
        posts = posts.filter(post => post.type === filter);
    }

    // Apply Search
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        posts = posts.filter(post =>
            post.title.toLowerCase().includes(query) ||
            post.shortDescription.toLowerCase().includes(query)
        );
    }

    // Show/Hide No Results
    if (posts.length === 0) {
        grid.innerHTML = '';
        noResults.classList.remove('hidden');
    } else {
        noResults.classList.add('hidden');
        grid.innerHTML = posts.map((post, index) => {
            const categoryLabel = getCategoryLabel(post.relatedProducts);
            const guideTypeColor = getGuideTypeColor(post.type);

            return `
                <article class="glass-card group flex flex-col h-full overflow-hidden reveal-up border-white/5 hover:border-accent/30 transition-all duration-500 glow-hover" style="animation-delay: ${index * 0.1}s">
                    <div class="relative overflow-hidden aspect-video bg-gradient-to-br from-white/5 to-transparent">
                        <img src="../../${post.image}" alt="${post.title}"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter drop-shadow-[0_0_20px_rgba(0,255,255,0.1)]">
                        
                        <!-- Guide Type Badge - Prominent -->
                        <div class="absolute bottom-4 left-4 flex items-center gap-2">
                            <div class="badge-accent uppercase tracking-[0.2em] text-[9px] font-black shadow-lg px-3 py-1.5 ${guideTypeColor}">
                                ${getGuideTypeIcon(post.type)} ${post.type}
                            </div>
                        </div>

                        <!-- Category Label -->
                        <div class="absolute top-4 right-4">
                            <span class="px-3 py-1.5 bg-dark-deep/85 backdrop-blur-sm rounded-lg border border-accent/30 text-[8px] font-black uppercase tracking-wider text-accent shadow-lg">
                                ${categoryLabel}
                            </span>
                        </div>
                    </div>

                    <div class="p-6 flex flex-col flex-grow">
                        <div class="flex items-center justify-between text-[8px] font-outfit uppercase tracking-[0.3em] text-secondary/50 mb-3">
                            <span>${formatDate(post.date)}</span>
                            <span class="text-muted/40">•</span>
                            <span>${post.readTime}</span>
                        </div>
                        
                        <h2 class="text-lg font-black mb-3 tracking-tight group-hover:text-accent transition-colors duration-300 leading-snug">
                            <a href="blog-details.html?id=${post.id}" onclick="logBlogClick('${post.id}', '${post.title}')">${post.title}</a>
                        </h2>
                        
                        <p class="text-secondary/70 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                            ${post.shortDescription}
                        </p>

                        <div class="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                            <div class="flex items-center gap-2">
                                <div class="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center text-accent text-[9px] font-black border border-accent/20">
                                    ${post.author.charAt(0)}
                                </div>
                                <span class="text-[8px] font-outfit font-bold uppercase tracking-wide text-secondary/60 truncate max-w-[120px]">${post.author}</span>
                            </div>
                            
                            <a href="blog-details.html?id=${post.id}" 
                               class="text-accent text-[9px] font-black uppercase tracking-[0.15em] group-hover:tracking-[0.25em] transition-all duration-300 flex items-center gap-1 whitespace-nowrap" 
                               onclick="logBlogClick('${post.id}', '${post.title}')">
                                READ <span class="text-xs">→</span>
                            </a>
                        </div>
                    </div>
                </article>
            `;
        }).join('');
    }
}

function getCategoryLabel(relatedProducts) {
    if (!relatedProducts || relatedProducts.length === 0) return 'General Tech';
    
    // Map product IDs to friendly category names
    const categoryMap = {
        'gaming-gear': 'Gaming Gear',
        'office-essentials': 'Office Essentials',
        'streaming-accessories': 'Streaming Gear',
        'connectivity-tools': 'Connectivity'
    };
    
    return categoryMap[relatedProducts[0]] || 'General Tech';
}

function getGuideTypeIcon(type) {
    const iconMap = {
        'Buying Guide': '🛍️',
        'Setup & Desk Guide': '🏗️',
        'Performance & Comfort Guide': '⚡',
        'Product / Category Comparison': '⚖️'
    };
    return iconMap[type] || '📖';
}

function getGuideTypeColor(type) {
    const colorMap = {
        'Buying Guide': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        'Setup & Desk Guide': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        'Performance & Comfort Guide': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
        'Product / Category Comparison': 'bg-pink-500/20 text-pink-300 border-pink-500/30'
    };
    return colorMap[type] || 'bg-accent/20 text-accent border-accent/30';
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function setupBlogControls() {
    const searchInput = document.getElementById('blog-search');
    const categoryFilter = document.getElementById('category-filter');

    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            renderBlog(categoryFilter.value, e.target.value);
        }, 300));
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            renderBlog(e.target.value, searchInput.value);
        });
    }
}

function logBlogClick(id, title) {
    ActivityLogger.log('Open Blog Post', { blogId: id, blogTitle: title });
}

// Utility debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
