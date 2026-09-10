/**
 * Microsite Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initProfile();
    initSocials();
    initCategories();
    initLinks();
    initThemes();
    initMusicPlayer();
    initSearch();
    initModals();
    initContactForm();
    initShareFeatures();
});

let currentCategory = 'all';
let searchQuery = '';

/**
 * 1. Render Profile Information
 */
function initProfile() {
    const { profile } = siteData;
    if (!profile) return;

    // Avatar
    const avatarImg = document.getElementById('profile-avatar');
    if (avatarImg) {
        avatarImg.src = profile.avatar;
        avatarImg.onerror = () => {
            // Fallback avatar generator
            avatarImg.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=6366f1&color=fff&size=200&bold=true`;
        };
    }

    // Name & Handle
    document.getElementById('profile-name').textContent = profile.name;
    document.getElementById('profile-handle').textContent = profile.handle;
    document.getElementById('footer-name').textContent = profile.name;

    // Status Pill
    const statusText = document.getElementById('status-text');
    const onlineStatus = document.getElementById('online-status');
    if (profile.status) {
        statusText.textContent = profile.status.text;
        if (!profile.status.available && onlineStatus) {
            onlineStatus.style.display = 'none';
        }
    }

    // Bio & Location
    document.getElementById('profile-bio').textContent = profile.bio;
    document.getElementById('profile-location').textContent = profile.location;

    // Stats
    if (profile.stats) {
        document.getElementById('stat-views').textContent = profile.stats.views || '10K+';
        document.getElementById('stat-links').textContent = siteData.links ? siteData.links.length : '0';
        document.getElementById('stat-followers').textContent = profile.stats.followers || '5K+';
    }

    // Year
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/**
 * 2. Render Social Icons
 */
function initSocials() {
    const socialBar = document.getElementById('social-bar');
    if (!socialBar || !siteData.socials) return;

    socialBar.innerHTML = '';
    siteData.socials.forEach(social => {
        const a = document.createElement('a');
        a.href = social.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.className = 'social-icon-btn';
        a.title = social.name;
        a.setAttribute('aria-label', social.name);
        a.innerHTML = `<i class="${social.icon}"></i>`;
        
        // Custom hover color effect
        a.addEventListener('mouseenter', () => {
            a.style.color = social.color;
            a.style.borderColor = social.color;
            a.style.boxShadow = `0 0 15px ${social.color}40`;
        });
        a.addEventListener('mouseleave', () => {
            a.style.color = '';
            a.style.borderColor = '';
            a.style.boxShadow = '';
        });

        socialBar.appendChild(a);
    });
}

/**
 * 3. Render Category Filter Chips
 */
function initCategories() {
    const chipContainer = document.getElementById('category-chips');
    if (!chipContainer || !siteData.categories) return;

    chipContainer.innerHTML = '';
    siteData.categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `chip-btn ${cat.id === currentCategory ? 'active' : ''}`;
        btn.setAttribute('data-category', cat.id);
        btn.innerHTML = `<i class="${cat.icon}"></i> <span>${cat.label}</span>`;
        
        btn.addEventListener('click', () => {
            currentCategory = cat.id;
            // Update active styling
            document.querySelectorAll('.chip-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderLinks();
        });

        chipContainer.appendChild(btn);
    });
}

/**
 * 4. Render Link Cards
 */
function initLinks() {
    renderLinks();
}

function renderLinks() {
    const container = document.getElementById('links-container');
    if (!container || !siteData.links) return;

    container.innerHTML = '';

    // Filter logic
    const filtered = siteData.links.filter(link => {
        const matchCategory = currentCategory === 'all' 
            || link.category === currentCategory 
            || (currentCategory === 'featured' && link.highlighted);
            
        const matchSearch = !searchQuery 
            || link.title.toLowerCase().includes(searchQuery.toLowerCase())
            || (link.subtitle && link.subtitle.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchCategory && matchSearch;
    });

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-links">
                <i class="fas fa-search"></i>
                <p>Tidak ada tautan yang sesuai dengan pencarian atau kategori ini.</p>
            </div>
        `;
        return;
    }

    filtered.forEach(link => {
        const card = document.createElement('div');
        card.className = `link-card ${link.highlighted ? 'highlighted' : ''}`;
        
        // Badge HTML if exists
        let badgeHtml = '';
        if (link.badge) {
            const badgeTypeClass = link.badgeType || 'featured';
            badgeHtml = `<span class="badge-tag ${badgeTypeClass}">${link.badge}</span>`;
        }

        card.innerHTML = `
            <div class="link-icon-box">
                <i class="${link.icon || 'fas fa-link'}"></i>
            </div>
            <div class="link-content">
                <div class="link-title-row">
                    <span class="link-title">${link.title}</span>
                    ${badgeHtml}
                </div>
                ${link.subtitle ? `<div class="link-subtitle">${link.subtitle}</div>` : ''}
            </div>
            <div class="link-actions">
                <button class="btn-card-copy" title="Salin Tautan" data-url="${link.url}">
                    <i class="fas fa-copy"></i>
                </button>
                <div class="link-arrow">
                    <i class="fas fa-arrow-up-right-from-square"></i>
                </div>
            </div>
        `;

        // Click on entire card navigates to URL
        card.addEventListener('click', (e) => {
            // Check if clicked the copy button
            const copyBtn = e.target.closest('.btn-card-copy');
            if (copyBtn) {
                e.stopPropagation();
                copyToClipboard(link.url, `Tautan "${link.title}" disalin!`);
                return;
            }

            // Track clicks locally
            link.clicks = (link.clicks || 0) + 1;
            window.open(link.url, '_blank', 'noopener,noreferrer');
        });

        container.appendChild(card);
    });
}

/**
 * 5. Search Functionality
 */
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchClear = document.getElementById('search-clear');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        if (searchClear) {
            searchClear.style.display = searchQuery ? 'block' : 'none';
        }
        renderLinks();
    });

    if (searchClear) {
        searchClear.addEventListener('click', () => {
            searchInput.value = '';
            searchQuery = '';
            searchClear.style.display = 'none';
            searchInput.focus();
            renderLinks();
        });
    }
}

/**
 * 6. Theme Switcher System
 */
function initThemes() {
    const savedTheme = localStorage.getItem('microsite_theme') || 'midnight';
    setTheme(savedTheme);

    const themeGrid = document.getElementById('theme-grid');
    if (!themeGrid || !siteData.themes) return;

    themeGrid.innerHTML = '';
    siteData.themes.forEach(theme => {
        const card = document.createElement('div');
        card.className = `theme-card ${theme.id === savedTheme ? 'active' : ''}`;
        card.setAttribute('data-theme-id', theme.id);
        
        card.innerHTML = `
            <div class="theme-preview-circle" style="background: ${theme.primary}; color: #fff;">
                ${theme.icon}
            </div>
            <span class="theme-name">${theme.name}</span>
        `;

        card.addEventListener('click', () => {
            setTheme(theme.id);
            document.querySelectorAll('.theme-card').forEach(tc => tc.classList.remove('active'));
            card.classList.add('active');
            showToast(`Tema diubah ke ${theme.name}`);
            closeAllModals();
        });

        themeGrid.appendChild(card);
    });

    // Theme toggle button on top bar opens theme modal
    const themeBtn = document.getElementById('btn-theme');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => openModal('modal-themes'));
    }
}

function setTheme(themeId) {
    document.documentElement.setAttribute('data-theme', themeId);
    localStorage.setItem('microsite_theme', themeId);
}

/**
 * 7. Mini Music Player Widget
 */
function initMusicPlayer() {
    const widget = document.getElementById('music-widget');
    const audio = document.getElementById('bg-audio');
    const toggleBtn = document.getElementById('music-toggle-btn');
    const playIcon = document.getElementById('music-play-icon');
    const topSoundBtn = document.getElementById('btn-sound');
    
    if (!siteData.musicPlayer || !siteData.musicPlayer.enabled) {
        if (widget) widget.style.display = 'none';
        if (topSoundBtn) topSoundBtn.style.display = 'none';
        return;
    }

    const { musicPlayer } = siteData;
    document.getElementById('music-cover').src = musicPlayer.cover;
    document.getElementById('music-track').textContent = musicPlayer.title;
    document.getElementById('music-artist').textContent = musicPlayer.artist;
    audio.src = musicPlayer.audioSrc;

    let isPlaying = false;

    function togglePlayback() {
        if (isPlaying) {
            audio.pause();
            widget.classList.remove('music-playing');
            playIcon.className = 'fas fa-play';
            if (topSoundBtn) topSoundBtn.style.color = '';
            isPlaying = false;
        } else {
            audio.play().then(() => {
                widget.classList.add('music-playing');
                playIcon.className = 'fas fa-pause';
                if (topSoundBtn) topSoundBtn.style.color = 'var(--primary)';
                isPlaying = true;
                showToast(`Memutar: ${musicPlayer.title}`);
            }).catch(() => {
                showToast("Klik tombol untuk memutar audio");
            });
        }
    }

    if (toggleBtn) toggleBtn.addEventListener('click', togglePlayback);
    if (topSoundBtn) topSoundBtn.addEventListener('click', togglePlayback);
    
    audio.addEventListener('ended', () => {
        isPlaying = false;
        widget.classList.remove('music-playing');
        playIcon.className = 'fas fa-play';
        if (topSoundBtn) topSoundBtn.style.color = '';
    });
}

/**
 * 8. Share Features & QR Code Generation
 */
function initShareFeatures() {
    const currentUrl = window.location.href;
    const shareInput = document.getElementById('share-link-input');
    if (shareInput) shareInput.value = currentUrl;

    // Generate Dynamic QR Code using QR Server API
    const qrBox = document.getElementById('qr-code-box');
    if (qrBox) {
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(currentUrl)}&margin=1`;
        qrBox.innerHTML = `<img src="${qrUrl}" alt="QR Code Profil" width="160" height="160">`;
    }

    // Copy share link button
    const copyShareBtn = document.getElementById('btn-copy-share-link');
    if (copyShareBtn) {
        copyShareBtn.addEventListener('click', () => {
            copyToClipboard(currentUrl, 'Tautan profil berhasil disalin!');
        });
    }

    // Top & Footer share buttons
    const btnShare = document.getElementById('btn-share');
    if (btnShare) btnShare.addEventListener('click', () => openModal('modal-share'));

    const footerCopyUrl = document.getElementById('footer-copy-url');
    if (footerCopyUrl) {
        footerCopyUrl.addEventListener('click', () => {
            copyToClipboard(currentUrl, 'URL microsite berhasil disalin ke clipboard!');
        });
    }

    const footerQrCode = document.getElementById('footer-qr-code');
    if (footerQrCode) {
        footerQrCode.addEventListener('click', () => openModal('modal-share'));
    }

    // Social share buttons inside modal
    const shareWa = document.getElementById('share-wa');
    if (shareWa) {
        shareWa.addEventListener('click', () => {
            const text = `Halo! Kunjungi bio link resmi ${siteData.profile.name} di: ${currentUrl}`;
            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
        });
    }

    const shareTg = document.getElementById('share-tg');
    if (shareTg) {
        shareTg.addEventListener('click', () => {
            window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(siteData.profile.name + ' - Official Links')}`, '_blank');
        });
    }

    const shareTw = document.getElementById('share-tw');
    if (shareTw) {
        shareTw.addEventListener('click', () => {
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out ' + siteData.profile.name + ' links: ')}&url=${encodeURIComponent(currentUrl)}`, '_blank');
        });
    }

    const shareNative = document.getElementById('share-native');
    if (shareNative) {
        shareNative.addEventListener('click', () => {
            if (navigator.share) {
                navigator.share({
                    title: `${siteData.profile.name} - Bio Links`,
                    text: siteData.profile.bio,
                    url: currentUrl
                }).catch(() => {});
            } else {
                copyToClipboard(currentUrl, 'Tautan disalin ke clipboard!');
            }
        });
    }
}

/**
 * 9. Contact Modal & Form Handling
 */
function initContactForm() {
    const btnOpenContact = document.getElementById('btn-open-contact');
    if (btnOpenContact) {
        btnOpenContact.addEventListener('click', () => openModal('modal-contact'));
    }

    const contactForm = document.getElementById('quick-contact-form');
    const sendWaBtn = document.getElementById('btn-send-wa');

    // WhatsApp Send
    if (sendWaBtn) {
        sendWaBtn.addEventListener('click', () => {
            const name = document.getElementById('contact-name').value.trim();
            const topic = document.getElementById('contact-topic').value;
            const message = document.getElementById('contact-message').value.trim();

            if (!name || !message) {
                showToast('Mohon isi nama dan pesan Anda terlebih dahulu.');
                return;
            }

            const text = `Halo ${siteData.profile.name},\nSaya *${name}* ingin berdiskusi mengenai: *${topic}*.\n\n*Pesan:*\n${message}`;
            window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(text)}`, '_blank');
            closeAllModals();
            showToast('Membuka WhatsApp...');
        });
    }

    // Email Send
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('contact-name').value.trim();
            const topic = document.getElementById('contact-topic').value;
            const message = document.getElementById('contact-message').value.trim();

            const mailto = `mailto:hello@vincentlie.dev?subject=${encodeURIComponent('[' + topic + '] Pesan dari ' + name)}&body=${encodeURIComponent(message + '\n\n---\nPengirim: ' + name)}`;
            window.location.href = mailto;
            closeAllModals();
            showToast('Membuka aplikasi Email...');
        });
    }
}

/**
 * 10. Generic Modal Management
 */
function initModals() {
    // Close button triggers
    document.querySelectorAll('[data-close]').forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-close');
            closeModal(modalId);
        });
    });

    // Close on backdrop click
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = '';
}

/**
 * 11. Clipboard Utility & Toast System
 */
function copyToClipboard(text, successMessage = 'Disalin ke clipboard!') {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(successMessage);
        }).catch(() => {
            fallbackCopy(text, successMessage);
        });
    } else {
        fallbackCopy(text, successMessage);
    }
}

function fallbackCopy(text, successMessage) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        showToast(successMessage);
    } catch (err) {
        showToast('Gagal menyalin tautan');
    }
    document.body.removeChild(textArea);
}

function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> <span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 3000);
}
