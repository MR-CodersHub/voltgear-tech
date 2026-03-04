/**
 * blog-details.js
 * Premium editorial renderer for VoltGear Blog Details — Aurora Theme
 */

document.addEventListener('DOMContentLoaded', () => {
    const blogId = URLHelper.getParam('id');

    if (!blogId) {
        window.location.href = 'blog.html';
        return;
    }

    const post = TechGearData.blog.find(p => p.id === blogId);

    if (!post) {
        renderNotFound();
        return;
    }

    // Update Page Meta
    document.title = `${post.title} - VoltGear Editorial`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', post.shortDescription);

    renderBlogArticle(post);
    renderRelatedGear(post);
    renderRelatedPosts(post);

    ActivityLogger.log('View Blog Post', { blogId: post.id, blogTitle: post.title });
});

/* ============================================================
   NOT FOUND RENDERER
   ============================================================ */
function renderNotFound() {
    const container = document.getElementById('blog-details-container');
    if (!container) return;

    container.innerHTML = `
        <div class="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-dark-deep reveal-up">
            <div class="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-8 border border-red-500/20">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
            </div>
            <h1 class="text-4xl md:text-5xl font-black mb-6 tracking-tighter uppercase">Article Not Found</h1>
            <p class="text-secondary text-lg mb-10 max-w-md mx-auto">The editorial you are looking for has been archived or moved to a different sector of the Lab.</p>
            <a href="blog.html" class="btn-primary py-4 px-10 text-xs tracking-widest uppercase">Explore All Articles</a>
        </div>
    `;
}

/* ============================================================
   ARTICLE RENDERER
   ============================================================ */
function renderBlogArticle(post) {
    const container = document.getElementById('blog-details-container');
    if (!container) return;

    const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    const heroImage = `../../${post.image}`;

    container.innerHTML = `
        <!-- ===== HERO ===== -->
        <div class="blog-hero-wrapper reveal-up">
            <div class="max-w-4xl mx-auto px-4 text-center">
                <!-- Back Link -->
                <a href="blog.html" class="inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-10 hover:gap-2 transition-all">
                    <svg class="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    Back to Blog
                </a>

                <!-- Category Badge -->
                <div class="mb-6">
                    <span class="badge-accent uppercase tracking-[0.3em] text-[10px]">${post.type}</span>
                </div>

                <!-- Title -->
                <h1 class="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-[0.92] mt-6 mb-8 text-white">
                    <span class="text-gradient">${post.title.split(' ').slice(0, 3).join(' ')}</span>
                    ${post.title.split(' ').length > 3 ? '<br>' + post.title.split(' ').slice(3).join(' ') : ''}
                </h1>

                <!-- Subtitle -->
                <p class="text-lg md:text-xl text-secondary leading-relaxed max-w-2xl mx-auto mb-10">
                    ${post.shortDescription}
                </p>

                <!-- Meta Row -->
                <div class="blog-hero-meta">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-black text-sm border border-accent/30">
                            ${post.author.charAt(0).toUpperCase()}
                        </div>
                        <div class="text-left">
                            <div class="text-xs font-black uppercase tracking-widest text-white">${post.author}</div>
                            <div class="text-[10px] text-muted font-outfit uppercase tracking-widest">VoltGear Editorial</div>
                        </div>
                    </div>
                    <div class="blog-meta-divider"></div>
                    <div class="text-left">
                        <div class="text-xs font-black text-white">${formattedDate}</div>
                        <div class="text-[10px] text-muted font-outfit uppercase tracking-widest">Published</div>
                    </div>
                    <div class="blog-meta-divider"></div>
                    <div class="text-left">
                        <div class="text-xs font-black text-accent">${post.readTime}</div>
                        <div class="text-[10px] text-muted font-outfit uppercase tracking-widest">Read Time</div>
                    </div>
                </div>
            </div>

            <!-- Featured Image -->
            <div class="blog-featured-image max-w-5xl mx-auto px-4 mt-12">
                <img src="${heroImage}" alt="${post.title}" onerror="this.src='../../assets/img/rgb-keyboard.png'">
            </div>
        </div>

        <!-- ===== ARTICLE LAYOUT ===== -->
        <div class="blog-article-layout">
            <!-- Sidebar (TOC) -->
            <aside class="hidden xl:block py-14 px-8">
                <div class="toc-wrapper">
                    <h5 class="toc-title">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
                        Contents
                    </h5>
                    <nav id="toc-container" class="toc-list">
                        <!-- Populated by JS -->
                    </nav>
                </div>
            </aside>

            <!-- Body -->
            <div class="blog-article-body reveal-up">
                
                <!-- Share / Save Row -->
                <div class="article-actions">
                    <div class="action-group">
                        <button class="action-btn" onclick="Toast.info('Link copied to clipboard')">
                            <svg fill="currentColor" viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>
                            Share
                        </button>
                        <button class="action-btn" onclick="Toast.success('Saved to Reading List')">
                            <svg fill="currentColor" viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"/></svg>
                            Save
                        </button>
                    </div>
                    <div class="action-group">
                        <button class="action-btn" onclick="window.print()">
                            <svg fill="currentColor" viewBox="0 0 24 24"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg>
                        </button>
                    </div>
                </div>

                <!-- Opening Pull Quote -->
                <div class="article-blockquote mb-10">
                    <span class="quote-mark">"</span>
                    <p>"At VoltGear, we believe the interface is the primary bridge between human intent and digital execution. This editorial explores the technical nuances of that bridge."</p>
                </div>

                <!-- Article Prose -->
                <div id="article-content" class="article-prose">
                    <h2 id="overview">The Editorial Perspective</h2>
                    <p>${post.content}</p>

                    <p>In the rapidly evolving landscape of consumer technology, the gap between high-end gear and entry-level peripherals has never been more pronounced. At VoltGear, our mission is to illuminate these differences and give you the technical depth needed to make confident decisions for your setup.</p>

                    <!-- Key Takeaways -->
                    <div class="key-takeaways">
                        <h4>⚡ Key Takeaways</h4>
                        <ul>
                            <li>Performance benchmarks that exceed industry averages by 30–60%</li>
                            <li>Ergonomic considerations specifically validated for 8–12 hour use sessions</li>
                            <li>Value proposition that delivers premium UX at a competitive price point</li>
                            <li>Seamless cross-platform firmware updates and macro management</li>
                        </ul>
                    </div>

                    <h2 id="technical">The Technical Perspective</h2>
                    <p>Our analysis indicates that the products covered in this editorial represent a significant leap in ergonomic and performance standards. Through rigorous real-world testing, we've identified the core metrics that place these collections firmly in the elite tier of modern tech peripherals.</p>

                    <h3 id="sensor-lat">Sensor & Response Analysis</h3>
                    <p>Latency is the invisible killer of performance. At sub-1ms response rates, the hardware we've reviewed effectively eliminates perceptible input delay — a critical factor in both competitive gaming and professional design workflows. Our oscilloscope measurements confirmed consistent polling rates across multiple test environments.</p>

                    <pre class="code-block">
// Sample Connection Test Utility
const optimizeLatency = (device) => {
    return device.setPollingRate('1000Hz')
        .then(() => device.activateHyperSpeed())
        .catch(err => console.error("Optimization Failed", err));
};</pre>

                    <p>Whether you're prioritizing millisecond response times for competitive play, or long-duration ergonomic comfort for creative work, our deep dive confirms that simply meeting industry benchmarks is no longer sufficient. True premium hardware exceeds them — consistently, measurably, and without caveats.</p>

                    <h2 id="quality">Build Quality & Materials</h2>
                    <p>Premium materials aren't just about aesthetics — they're about durability and long-term value. The specimens we tested used aerospace-grade aluminum alloys for structural frames, CNC-machined scroll wheels, and POM switch housings rated for 80 million actuation cycles.</p>

                    <p>In stress-testing that included 72-hour continuous operation cycles, temperature variance simulations, and drop tests from 1.2m, every unit performed without failure, registering no functional degradation across all measured metrics.</p>

                    <h2 id="recommendation">Expert Recommendation</h2>
                    <div class="article-blockquote">
                        <span class="quote-mark">"</span>
                        <p>"The future of technology isn't just about faster chips — it's about more intuitive human-machine interactions. The hardware explored in ${post.title} exemplifies this shift perfectly."</p>
                    </div>

                    <p>Based on our multi-phasic testing, we recommend these solutions for users who prioritize <strong>zero signal degradation</strong> and <strong>high-fidelity tactile feedback</strong>. For the budget-conscious, we suggest looking at our Essentials line, but for those seeking peak efficiency, this is the definitive path.</p>

                    <!-- Tags -->
                    <div class="tags-row">
                        <span class="tag-pill accent">#${post.type.replace(/\s+/g, '')}</span>
                        <span class="tag-pill">#VOLTGEARLABS</span>
                        <span class="tag-pill">#SETUPGUIDE</span>
                        <span class="tag-pill">#GAMINGGEAR</span>
                        <span class="tag-pill">#PERFORMANCE</span>
                    </div>
                </div>

                <!-- Footer Actions -->
                <div class="flex items-center justify-center gap-4 py-12">
                    <a href="blog.html" class="btn-outline py-3 px-8 text-[10px] tracking-widest font-black uppercase">View More From Editorial</a>
                </div>

                <!-- ===== AUTHOR BIO ===== -->
                <div class="author-bio-card reveal-up">
                    <div class="author-avatar">${post.author.charAt(0).toUpperCase()}</div>
                    <div>
                        <div class="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-1">Written By</div>
                        <h4 class="text-xl font-black text-white mb-1 uppercase tracking-tighter">${post.author}</h4>
                        <p class="text-[10px] font-outfit uppercase tracking-widest text-muted mb-3 italic">Senior Technical Strategist · VoltGear Editorial</p>
                        <p class="text-base text-secondary leading-relaxed font-inter">
                            ${post.author} is a veteran hardware analyst with over a decade of experience in electrical engineering and ergonomics. Their research focuses on sub-millisecond input latency and the psychology of tactile interfaces.
                        </p>
                    </div>
                </div>

                <!-- Prev/Next -->
                <div id="article-nav" class="article-nav reveal-up"></div>

                <!-- Comments -->
                <div class="reveal-up mt-12 bg-white/[0.02] p-8 md:p-12 rounded-[2rem] border border-white/5">
                    <div class="mb-8">
                        <span class="text-accent font-outfit font-black uppercase tracking-[0.3em] text-[10px] mb-2 block">Community Hub</span>
                        <h3 class="text-3xl font-black tracking-tighter uppercase">Join the <span class="text-gradient">Discussion</span></h3>
                    </div>
                    <form class="comment-form space-y-6" onsubmit="handleCommentSubmit(event)">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-3">Identification</label>
                                <input type="text" id="comment-name" placeholder="Name or Callsign" required class="bg-dark-deep!">
                            </div>
                            <div>
                                <label class="block text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-3">Transmission Link</label>
                                <input type="email" id="comment-email" placeholder="email@nexus.com" required class="bg-dark-deep!">
                            </div>
                        </div>
                        <div>
                            <label class="block text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-3">Message Content</label>
                            <textarea id="comment-body" placeholder="Share your professional feedback..." required class="bg-dark-deep!"></textarea>
                        </div>
                        <div class="flex items-center gap-6 pt-2">
                            <button type="submit" class="btn-primary py-4 px-10 text-[10px] tracking-widest font-black">TRANSMIT COMMENT</button>
                            <p id="comment-feedback" class="text-[10px] text-accent font-black uppercase tracking-[0.2em] hidden">✓ Transmission Received</p>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Mobile Spare -->
            <div class="xl:hidden py-14 px-8"></div>
        </div>
    `;

    generateTOC();
    renderArticleNav(post);
}

/* ============================================================
   TOC GENERATOR
   ============================================================ */
function generateTOC() {
    const tocContainer = document.getElementById('toc-container');
    const article = document.getElementById('article-content');
    if (!tocContainer || !article) return;

    const headings = article.querySelectorAll('h2, h3');
    if (headings.length === 0) {
        tocContainer.closest('aside')?.classList.add('hidden');
        return;
    }

    tocContainer.innerHTML = Array.from(headings).map(h => {
        const id = h.id || h.textContent.toLowerCase().replace(/\s+/g, '-');
        h.id = id;
        const level = h.tagName === 'H3' ? 'pl-8' : 'pl-4';
        return `<li><a href="#${id}" class="toc-link ${level}">${h.textContent}</a></li>`;
    }).join('');

    // Smooth scroll for TOC links
    tocContainer.querySelectorAll('a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function renderArticleNav(currentPost) {
    const navEl = document.getElementById('article-nav');
    if (!navEl) return;

    const allPosts = TechGearData.blog;
    const currentIndex = allPosts.findIndex(p => p.id === currentPost.id);
    const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
    const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

    navEl.innerHTML = `
        ${prevPost ? `
        <a href="blog-details.html?id=${prevPost.id}" class="article-nav-item prev group">
            <div class="text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-2 group-hover:text-accent transition-colors">← DECRYPT PREVIOUS</div>
            <div class="text-sm font-bold text-white leading-tight line-clamp-2">${prevPost.title}</div>
        </a>
        ` : '<div></div>'}
        ${nextPost ? `
        <a href="blog-details.html?id=${nextPost.id}" class="article-nav-item next group text-right">
            <div class="text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-2 group-hover:text-accent transition-colors">DECRYPT NEXT →</div>
            <div class="text-sm font-bold text-white leading-tight line-clamp-2">${nextPost.title}</div>
        </a>
        ` : '<div></div>'}
    `;
}

function renderRelatedGear(post) {
    const container = document.getElementById('related-gear-categories');
    if (!container || !post.relatedProducts) return;

    const relatedCategories = TechGearData.services.filter(s => post.relatedProducts.includes(s.id));
    if (relatedCategories.length === 0) return;

    container.innerHTML = `
        <div class="max-w-5xl mx-auto py-20 px-4 reveal-up border-t border-white/5">
            <div class="mb-10 text-center">
                <span class="text-accent font-outfit font-black uppercase tracking-[0.3em] text-[10px] mb-3 block">Field Equipment</span>
                <h2 class="text-4xl font-black tracking-tighter uppercase">Shop The <span class="text-gradient">Story</span></h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${relatedCategories.map(cat => `
                    <a href="service-details.html?id=${cat.id}" class="glass-card p-8 flex items-center justify-between group">
                        <div>
                            <p class="text-[10px] font-black uppercase tracking-widest text-muted mb-2">${cat.audience || 'Pro Gear'}</p>
                            <h3 class="text-xl font-black uppercase tracking-tighter group-hover:text-accent transition-colors duration-300">${cat.title}</h3>
                            <p class="text-sm text-secondary mt-2 line-clamp-1">${cat.shortDescription}</p>
                        </div>
                        <div class="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-black group-hover:scale-110 transition-all duration-300 ml-4 flex-shrink-0">
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

    if (related.length === 0) {
        container.closest('section').style.display = 'none';
        return;
    }

    container.innerHTML = related.map((p, index) => `
        <article class="glass-card group flex flex-col h-full overflow-hidden reveal-up" style="animation-delay: ${index * 0.1}s">
            <a href="blog-details.html?id=${p.id}" class="block h-full flex flex-col">
                <div class="relative overflow-hidden aspect-video bg-white/5">
                    <img
                        src="../../${p.image}"
                        alt="${p.title}"
                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0"
                        onerror="this.src='../../assets/img/rgb-keyboard.png'"
                    >
                    <div class="absolute inset-0 bg-gradient-to-t from-dark-deep/80 to-transparent"></div>
                    <div class="absolute top-4 left-4">
                        <span class="badge-accent uppercase tracking-[0.2em] text-[10px]">${p.type}</span>
                    </div>
                </div>
                <div class="p-8 flex flex-col flex-grow border-t border-white/5">
                    <h3 class="text-xl font-black mb-4 tracking-tighter group-hover:text-accent transition-colors duration-300 leading-snug line-clamp-2 uppercase">${p.title}</h3>
                    <p class="text-sm text-secondary leading-relaxed mb-6 line-clamp-2">${p.shortDescription}</p>
                    <div class="mt-auto flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-black text-xs border border-accent/20">${p.author.charAt(0)}</div>
                            <span class="text-[10px] font-outfit uppercase tracking-widest text-muted">${p.author}</span>
                        </div>
                        <div class="flex items-center gap-3 text-[10px] font-outfit uppercase tracking-widest text-muted">
                            <span class="text-accent group-hover:translate-x-1 inline-block transition-transform duration-200">DECRYPT →</span>
                        </div>
                    </div>
                </div>
            </a>
        </article>
    `).join('');
}

function handleCommentSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('comment-name')?.value || 'Guest';
    const feedback = document.getElementById('comment-feedback');
    if (feedback) {
        feedback.textContent = `✓ Transmission received, ${name}! Your feedback is being processed.`;
        feedback.classList.remove('hidden');
        e.target.reset();
        setTimeout(() => feedback.classList.add('hidden'), 5000);
    }
}
