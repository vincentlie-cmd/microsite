/**
 * Konfigurasi Data Microsite
 * Anda dapat dengan mudah mengubah data di bawah ini untuk menyesuaikan profil, tautan, dan konten lainnya!
 */

const siteData = {
    profile: {
        name: "Vincent Lie",
        handle: "@vincentlie",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        avatarFallback: "VL",
        badge: "Verified Creator",
        status: {
            text: "Open for Collaborations 🚀",
            available: true
        },
        bio: "Tech Enthusiast, Fullstack Developer & Digital Content Creator. Membangun produk digital yang berdampak dan berbagi wawasan seputar teknologi & desain.",
        location: "Jakarta, Indonesia",
        stats: {
            views: "12.4K",
            followers: "8.5K",
            linksCount: 10
        }
    },
    
    // Media Sosial di bagian Header
    socials: [
        { name: "Instagram", icon: "fab fa-instagram", url: "https://instagram.com", color: "#E1306C" },
        { name: "GitHub", icon: "fab fa-github", url: "https://github.com", color: "#ffffff" },
        { name: "LinkedIn", icon: "fab fa-linkedin", url: "https://linkedin.com", color: "#0A66C2" },
        { name: "Twitter / X", icon: "fab fa-x-twitter", url: "https://twitter.com", color: "#ffffff" },
        { name: "YouTube", icon: "fab fa-youtube", url: "https://youtube.com", color: "#FF0000" },
        { name: "TikTok", icon: "fab fa-tiktok", url: "https://tiktok.com", color: "#00f2fe" },
        { name: "WhatsApp", icon: "fab fa-whatsapp", url: "https://wa.me/6281234567890", color: "#25D366" },
        { name: "Email", icon: "fas fa-envelope", url: "mailto:hello@vincentlie.dev", color: "#FFA500" }
    ],

    // Kategori Filter Link
    categories: [
        { id: "all", label: "Semua", icon: "fas fa-th-large" },
        { id: "portfolio", label: "Portofolio", icon: "fas fa-briefcase" },
        { id: "products", label: "Produk & Jasa", icon: "fas fa-store" },
        { id: "community", label: "Komunitas", icon: "fas fa-users" },
        { id: "featured", label: "Pilihan", icon: "fas fa-star" }
    ],

    // Daftar Tautan (Links)
    links: [
        {
            id: 1,
            title: "Website Portofolio Resmi",
            subtitle: "Jelajahi project terbaru, studi kasus UI/UX & Web Apps",
            url: "https://vincentlie.dev",
            icon: "fas fa-globe",
            category: "portfolio",
            badge: "Featured",
            badgeType: "featured", // 'featured', 'hot', 'new', 'discount'
            highlighted: true,
            clicks: 1420
        },
        {
            id: 2,
            title: "Konsultasi 1-on-1 Web Development",
            subtitle: "Booking jadwal konsultasi teknologi & karir developer",
            url: "https://cal.com/vincentlie",
            icon: "fas fa-calendar-check",
            category: "products",
            badge: "Slot Terbatas",
            badgeType: "hot",
            highlighted: false,
            clicks: 890
        },
        {
            id: 3,
            title: "Template Notion All-In-One Developer",
            subtitle: "Tingkatkan produktivitas coding & manajemen proyek Anda",
            url: "https://gumroad.com",
            icon: "fas fa-box-open",
            category: "products",
            badge: "Diskon 30%",
            badgeType: "discount",
            highlighted: false,
            clicks: 654
        },
        {
            id: 4,
            title: "Gabung Komunitas Discord 'Code & Create'",
            subtitle: "Tempat diskusi 3,000+ developer & desainer Indonesia",
            url: "https://discord.gg",
            icon: "fab fa-discord",
            category: "community",
            badge: "Gratis",
            badgeType: "new",
            highlighted: false,
            clicks: 2130
        },
        {
            id: 5,
            title: "Artikel & Tutorial Terbaru di Medium",
            subtitle: "Tips arsitektur web modern, clean code, dan AI tools",
            url: "https://medium.com",
            icon: "fab fa-medium",
            category: "portfolio",
            badge: null,
            badgeType: null,
            highlighted: false,
            clicks: 432
        },
        {
            id: 6,
            title: "Kanal YouTube Tech & Coding",
            subtitle: "Video tutorial mingguan seputar Javascript, React & AI",
            url: "https://youtube.com",
            icon: "fab fa-youtube",
            category: "community",
            badge: "Video Baru!",
            badgeType: "new",
            highlighted: false,
            clicks: 1780
        },
        {
            id: 7,
            title: "Dukung Karya Saya di Saweria / Trakteer",
            subtitle: "Secangkir kopi untuk terus membuat konten open source",
            url: "https://saweria.co",
            icon: "fas fa-coffee",
            category: "products",
            badge: "Support",
            badgeType: "hot",
            highlighted: false,
            clicks: 345
        }
    ],

    // Mini Audio / Music Player Widget
    musicPlayer: {
        enabled: true,
        title: "Midnight City Groove",
        artist: "Vincent's Playlist",
        cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=150&q=80",
        audioSrc: "https://actions.google.com/sounds/v1/ambiences/rain_heavy.ogg" // Sample soothing ambient
    },

    // Pilihan Tema
    themes: [
        { id: "midnight", name: "Midnight Aurora", icon: "🌌", primary: "#6366f1", bg: "#090d16" },
        { id: "cyberpunk", name: "Cyberpunk Neon", icon: "⚡", primary: "#00f2fe", bg: "#0d0221" },
        { id: "sunset", name: "Sunset Rose", icon: "🌅", primary: "#f43f5e", bg: "#180d19" },
        { id: "emerald", name: "Emerald Forest", icon: "🌿", primary: "#10b981", bg: "#041711" },
        { id: "light", name: "Clean Porcelain", icon: "☀️", primary: "#4f46e5", bg: "#f8fafc" }
    ]
};
