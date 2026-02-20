/**
 * blog-details.js
 * Premium dynamic rendering for TechGear Blog Details - Aurora Theme
 */

document.addEventListener('DOMContentLoaded', () => {
    const blogId = URLHelper.getParam('id');

    if (!blogId) {
        window.location.href = 'blog.html';
        return;
    }

    const post = TechGearData.blog.find(p => p.id === blogId);

    if (!post) {
        window.location.href = '404.html';
        return;
    }

    // Update Page Title
    document.title = `${post.title} - TechGear Editorial`;

    renderBlogPost(post);
    renderRelatedGear(post);
    renderRelatedPosts(post);

    // Log Activity
    ActivityLogger.log('View Blog Post', { blogId: post.id, blogTitle: post.title });
});

function renderBlogPost(post) {
    const container = document.getElementById('blog-details-container');
    if (!container) return;

    container.innerHTML = `
        <article class="pt-40 pb-20 px-4 reveal-up">
            <div class="max-w-4xl mx-auto">
                
                <!-- Editorial Header -->
                <div class="text-center mb-16 space-y-8">
                    <span class="badge-accent uppercase tracking-[0.3em] text-[10px]">${post.type}</span>
                    <h1 class="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95]">
                        <span class="text-gradient">${post.title.split(' ').slice(0, 2).join(' ')}</span><br>
                        ${post.title.split(' ').slice(2).join(' ')}
                    </h1>
                    <div class="flex items-center justify-center gap-6 pt-4">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                                ${post.author.charAt(0)}
                            </div>
                            <div class="text-left">
                                <div class="text-xs font-black uppercase tracking-widest text-white">${post.author}</div>
                                <div class="text-[10px] text-muted font-outfit uppercase tracking-widest">VoltGear Resident</div>
                            </div>
                        </div>
                        <div class="h-8 w-px bg-white/10"></div>
                        <div class="text-left">
                            <div class="text-xs font-black uppercase tracking-widest text-white">${post.date}</div>
                            <div class="text-[10px] text-muted font-outfit uppercase tracking-widest">${post.readTime} Read</div>
                        </div>
                    </div>
                </div>

                <!-- Featured Image -->
                <div class="glass-panel p-2 mb-20 overflow-hidden group">
                    <img src="../../${post.image}" alt="${post.title}"
                        class="w-full h-auto rounded-xl grayscale group-hover:grayscale-0 transition-all duration-1000 object-cover aspect-video">
                </div>

                <!-- Content Body -->
                <div class="glass-panel p-8 md:p-16 space-y-10 text-secondary leading-[1.8] text-lg">
                    <p class="text-2xl text-white font-medium leading-relaxed italic border-l-4 border-accent pl-8 py-2">
                        ${post.shortDescription}
                    </p>
                    
                    <div class="space-y-8">
                        <p>${post.content}</p>
                        <p>In the rapidly evolving landscape of consumer technology, the distinction between high-end gear and entry-level peripherals has never been more pronounced. At TechGear, our mission is to illuminate these differences, providing you with the technical depth required to make informed decisions for your setup.</p>
                        
                        <h2 class="text-3xl font-black text-white tracking-tight pt-8 border-t border-white/5">The Technical Perspective</h2>
                        <p>Our analysis suggests that the ${post.category} series represents a significant leap in ergonomic and performance standards. Through rigorous testing, we've identified the core metrics that place this collection in the elite tier of modern tech.</p>
                        
                        <blockquote class="bg-white/5 p-10 rounded-2xl border border-white/5 relative group">
                            <span class="absolute top-4 left-6 text-6xl text-accent opacity-20 font-serif">"</span>
                            <p class="relative z-10 text-white italic text-xl">The future of technology isn't just about faster chips; it's about more intuitive interactions. ${post.title} exemplifies this shift perfectly.</p>
                        </blockquote>

                        <p>Whether you're prioritizing millisecond response times or long-term ergonomic comfort, our deep dive into ${post.title} confirms that standard industry benchmarks are no longer sufficient to describe the premium user experience.</p>
                    </div>

                    <!-- Article Meta Tags -->
                    <div class="pt-20 flex flex-wrap gap-4">
                        <span class="text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 bg-white/5 rounded-full text-accent shadow-accent">#${post.type.replace(/\s+/g, '')}</span>
                        <span class="text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 bg-white/5 rounded-full text-secondary">#VOLTGEARLABS</span>
                        <span class="text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 bg-white/5 rounded-full text-secondary">#SETUPGUIDE</span>
                    </div>
                </div>
            </div>
        </article>
    `;
}

function renderRelatedGear(post) {
    const container = document.getElementById('related-gear-categories');
    if (!container || !post.relatedProducts) return;

    const relatedCategories = TechGearData.services.filter(s => post.relatedProducts.includes(s.id));

    if (relatedCategories.length === 0) return;

    container.innerHTML = `
        <div class="max-w-4xl mx-auto py-20 px-4 border-t border-white/5 reveal-up">
            <h2 class="text-3xl font-black mb-10 tracking-tighter uppercase">RELATED <span class="text-gradient">GEAR CATEGORIES</span></h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${relatedCategories.map(cat => `
                    <a href="service-details.html?id=${cat.id}" class="glass-card p-8 flex items-center justify-between group">
                        <div>
                            <h3 class="text-lg font-black uppercase tracking-tight group-hover:text-accent transition-colors">${cat.title}</h3>
                            <p class="text-xs text-muted font-mono uppercase mt-1">Explore Collection →</p>
                        </div>
                        <div class="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                             <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </div>
                    </a>
                `).join('')}
            </div>
        </div>
    `;
}

function renderRelatedPosts(currentPost) {
    const container = document.getElementById('related-articles-container');
    if (!container) return;

    const related = TechGearData.blog
        .filter(p => p.id !== currentPost.id)
        .slice(0, 3);

    if (related.length === 0) return;

    container.innerHTML = related.map((p, index) => `
        <article class="glass-card group flex flex-col h-full overflow-hidden reveal-up" style="animation-delay: ${index * 0.15}s">
            <a href="blog-details.html?id=${p.id}" class="block h-full flex flex-col" onclick="ActivityLogger.log('Open Related Blog', { blogId: '${p.id}' })">
                <div class="relative overflow-hidden aspect-video bg-white/5">
                    <img src="../../${p.image}" alt="${p.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0">
                    <div class="absolute top-4 left-4">
                        <span class="badge-accent uppercase tracking-[0.2em] text-[10px]">${p.type}</span>
                    </div>
                </div>
                <div class="p-8 flex flex-col flex-grow border-t border-white/5">
                    <h3 class="text-xl font-black mb-4 tracking-tighter group-hover:text-accent transition-colors duration-300 line-clamp-2">${p.title}</h3>
                    <div class="mt-auto flex items-center justify-between text-[10px] font-outfit uppercase tracking-[0.2em] text-muted">
                        <span>Read Time: ${p.readTime}</span>
                        <span class="text-accent group-hover:gap-2 transition-all">READ →</span>
                    </div>
                </div>
            </a>
        </article>
    `).join('');
}
