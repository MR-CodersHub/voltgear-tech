/**
 * data.js
 * Centralized data source for services and blog posts
 */

const SERVICES_DATA = [
    {
        id: 'gaming-gear',
        title: 'Gaming Gear',
        shortDescription: 'High-performance peripherals for competitive gaming.',
        description: 'Elevate your gaming experience with our professional-grade peripherals. Engineered for speed, precision, and durability, our gaming gear gives you the competitive edge you need.',
        image: 'assets/img/gaming-headset.png',
        icon: 'lightning',
        audience: 'Pro Gamers & Enthusiasts',
        isFeatured: true,
        features: [
            'Ultra-low latency wireless technology',
            'High-precision optical sensors up to 25K DPI',
            'Customizable RGB lighting with 16.8M colors',
            'Mechanical switches rated for 80M clicks',
            'Programmable macro keys and profiles'
        ],
        pricing: [
            { name: 'Basic', price: '$99', features: ['Core features', '1-year warranty', 'Email support'] },
            { name: 'Pro', price: '$149', features: ['All features', '2-year warranty', 'Priority support', 'Free carrying case'] },
            { name: 'Elite', price: '$199', features: ['All Pro features', 'Lifetime warranty', '24/7 support', 'Custom engraving'] }
        ],
        faqs: [
            { q: 'Is the wireless connection lag-free?', a: 'Yes, our Apex Pro technology ensures a sub-1ms response time, identical to wired performance.' },
            { q: 'How long does the battery last?', a: 'The battery lasts up to 70 hours with RGB on and up to 120 hours with RGB off.' }
        ]
    },
    {
        id: 'office-essentials',
        title: 'Office Essentials',
        shortDescription: 'Essential accessories for maximum productivity.',
        description: 'Transform your workspace into a productivity powerhouse. Our office essentials are designed for comfort, reliability, and seamless integration into your professional workflow.',
        image: 'assets/img/wireless-mouse-office.png',
        icon: 'briefcase',
        audience: 'Developers & Busy Professionals',
        isFeatured: false,
        features: [
            'Ergonomic designs to reduce strain',
            'Silent-click technology for quiet environments',
            'Multi-device pairing and seamless switching',
            'Long-lasting battery life (up to 2 years)',
            'Sustainable and eco-friendly materials'
        ],
        pricing: [
            { name: 'Standard', price: '$49', features: ['Essential tools', 'Comfort design', '1-year warranty'] },
            { name: 'Business', price: '$89', features: ['Multi-device support', 'Premium materials', '2-year warranty'] },
            { name: 'Enterprise', price: '$129', features: ['Bulk pricing', 'Custom branding', 'Fleet management tools'] }
        ],
        faqs: [
            { q: 'Can I use these on multiple computers?', a: 'Yes, our Ergo series supports up to 3 devices via Bluetooth or Logi Bolt receiver.' },
            { q: 'Are the products compatible with Mac and Windows?', a: 'Absolutely, all our office gear is fully compatible with Windows, macOS, ChromeOS, and Linux.' }
        ]
    },
    {
        id: 'streaming-accessories',
        title: 'Streaming Accessories',
        shortDescription: 'Pro-grade tools for content creators and streamers.',
        description: 'Capture every detail and engage your audience with crystal-clear audio and video. Our streaming accessories are built for creators who demand the best.',
        image: 'assets/img/webcam-pro.png',
        icon: 'camera',
        audience: 'Streamers & Video Creators',
        isFeatured: false,
        features: [
            '4K Ultra HD video at 30fps or 1080p at 60fps',
            'Studios-quality condenser microphones',
            'Adjustable ring lights for perfect illumination',
            'Green screen and background removal technology',
            'Integrated software for easy stream management'
        ],
        pricing: [
            { name: 'Creator', price: '$159', features: ['1080p Webcam', 'USB Mic', 'Ring Light'] },
            { name: 'Influencer', price: '$299', features: ['4K Pro Webcam', 'XLR Mic', 'Key Light'] },
            { name: 'Studio', price: '$499', features: ['Dual 4K Setup', 'Pro Mixer', 'Full Lighting Kit'] }
        ],
        faqs: [
            { q: 'Do I need a separate mixer for the mic?', a: 'For the Creator tier, no. For Influencer and Studio tiers, we provide a compact mixer or interface.' },
            { q: 'Is the software free?', a: 'Yes, TechGear Stream Studio is free for all owners of our streaming hardware.' }
        ]
    },
    {
        id: 'connectivity-tools',
        title: 'Connectivity Tools',
        shortDescription: 'Stay connected with high-speed hubs and adapters.',
        description: 'Expand your laptop\'s capabilities with our range of high-performance hubs and adapters. Fast data transfer and multiple ports at your fingertips.',
        image: 'assets/img/usb-hub.png',
        icon: 'plug',
        audience: 'Remote Workers & Hybrid Teams',
        isFeatured: false,
        features: [
            'Thunderbolt 4 and USB-C compatibility',
            'Up to 40Gbps data transfer speeds',
            '4K @ 120Hz or Dual 4K @ 60Hz HDMI support',
            '100W Power Delivery (PD) charging',
            'Compact and durable aluminum housing'
        ],
        pricing: [
            { name: 'Travel', price: '$59', features: ['5-in-1 Hub', 'Ultra-portable', '1-year warranty'] },
            { name: 'Desktop', price: '$119', features: ['11-in-1 Dock', 'Power delivery', '2-year warranty'] },
            { name: 'Workstation', price: '$199', features: ['Thunderbolt 4', 'Triple display', 'Professional grade'] }
        ],
        faqs: [
            { q: 'Can this charge my laptop?', a: 'Yes, our Desktop and Workstation models support up to 100W Power Delivery to keep your laptop charged.' },
            { q: 'Does it support external displays?', a: 'Yes, all our hubs support at least one 4K HDMI output, with higher models supporting up to three displays.' }
        ]
    }
];

const BLOG_DATA = [
    {
        id: 'ergonomic-productivity-guide',
        title: 'The Ultimate Ergonomic Setup for Peak Productivity',
        author: 'VoltGear Engineering',
        date: '2024-06-12',
        type: 'Performance & Comfort Guide',
        shortDescription: 'Discover how the right desk height and peripheral alignment can eliminate fatigue.',
        content: `Ergonomics isn't just a buzzword—it's the foundation of sustained performance. Research shows that a properly aligned workstation can increase typing speed by up to 15% while reducing repetitive strain risks.

        In this guide, we break down the '90-degree rule' for elbows and knees, the importance of monitor eye-level placement, and how vertical mice like our Ergo series can save your wrists.`,
        image: 'assets/img/wireless-mouse-office.png',
        readTime: '6 min read',
        relatedProducts: ['office-essentials', 'connectivity-tools']
    },
    {
        id: 'mechanical-v-membrane-guide',
        title: 'Mechanical vs. Membrane: Which Switch Wins for You?',
        author: 'Setup Lab',
        date: '2024-06-05',
        type: 'Product / Category Comparison',
        shortDescription: 'Tactile feedback or silent operation? We compare the core technologies of modern keyboards.',
        content: `Choosing a keyboard is the most personal decision in any tech setup. While mechanical switches offer unrivaled longevity and specific 'feels', modern membrane technologies provide silent operation ideal for shared offices.

        We test both categories against latency, durability, and user preference to help you decide which path to take for your next upgrade.`,
        image: 'assets/img/rgb-keyboard.png',
        readTime: '8 min read',
        relatedProducts: ['gaming-gear', 'office-essentials']
    },
    {
        id: 'streaming-setup-blueprint',
        title: 'The 2024 Streaming Setup Blueprint',
        author: 'VoltGear Lab',
        date: '2024-05-28',
        type: 'Setup & Desk Guide',
        shortDescription: 'How to build a studio-quality broadcast station from scratch.',
        content: `Creating high-quality content requires more than just a camera. It's about lighting, audio isolation, and signal management. This blueprint covers the essential hardware stack for every serious streamer.

        From 4K capture cards to XLR audio interfaces, we list the exact components needed to achieve a professional look on any platform.`,
        image: 'assets/img/webcam-pro.png',
        readTime: '12 min read',
        relatedProducts: ['streaming-accessories', 'connectivity-tools']
    },
    {
        id: 'gaming-peripherals-buying-guide',
        title: 'Buying Guide: Choosing the Right Gaming Gear',
        author: 'Tech Guides',
        date: '2024-05-20',
        type: 'Buying Guide',
        shortDescription: 'A comprehensive look at DPI, polling rates, and latency in gaming peripherals.',
        content: `Not all gaming gear is created equal. When milliseconds matter, understanding the difference between optical and laser sensors, or knowing why a 1000Hz polling rate is standard, becomes critical.

        This guide helps you navigate the technical specs of modern gaming mice and keyboards.`,
        image: 'assets/img/gaming-headset.png',
        readTime: '10 min read',
        relatedProducts: ['gaming-gear']
    }
];

// Export for browser
window.TechGearData = {
    services: SERVICES_DATA,
    blog: BLOG_DATA
};
