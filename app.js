/**
 * Microsite Application Logic — Linktree Minimalis
 */

document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
    initSession();
    initProfile();
    initAuthButton();
    initLinks();
    initLinkEditor();
    initModals();
});

let isAdmin = false;

const LINKS_STORAGE_KEY = 'microsite_custom_links';

/**
 * 0. Session & Data Links (localStorage)
 */
function getSessionUser() {
    try {
        return JSON.parse(localStorage.getItem('microsite_session'));
    } catch (err) {
        return null;
    }
}

function initSession() {
    const user = getSessionUser();
    isAdmin = !!user;

    if (isAdmin && user) {
        setTimeout(() => showToast(`Halo, ${user.name}! Mode admin aktif.`), 500);
    }

    // Muat custom links dari localStorage
    let customLinks = [];
    try {
        customLinks = JSON.parse(localStorage.getItem(LINKS_STORAGE_KEY)) || [];
    } catch (err) {
        customLinks = [];
    }

    if (customLinks.length > 0) {
        siteData.links = customLinks;
    }

    // Tampilkan admin bar jika login
    const adminBar = document.getElementById('admin-bar');
    if (adminBar && isAdmin) {
        adminBar.style.display = 'flex';
    }
}

function persistLinks() {
    localStorage.setItem(LINKS_STORAGE_KEY, JSON.stringify(siteData.links));
}

/**
 * 1. Profil
 */
function initProfile() {
    const { profile } = siteData;
    if (!profile) return;

    const avatarImg = document.getElementById('profile-avatar');
    if (avatarImg) {
        avatarImg.src = profile.avatar;
        avatarImg.onerror = () => {
            avatarImg.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=aac8c0&color=fff&size=200&bold=true`;
        };
    }

    document.getElementById('profile-handle').textContent = profile.handle;
    document.getElementById('profile-bio').textContent = profile.bio;

    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/**
 * 2. Tombol titik-tiga kanan atas (login/logout)
 */
function initAuthButton() {
    const btn = document.getElementById('btn-auth');
    const icon = document.getElementById('btn-auth-icon');
    if (!btn) return;

    if (isAdmin) {
        btn.title = 'Keluar';
        if (icon) icon.className = 'fas fa-right-from-bracket';
        btn.addEventListener('click', () => {
            if (!confirm('Keluar dari mode admin?')) return;
            Auth.logout();
            showToast('Anda telah keluar.');
            setTimeout(() => window.location.reload(), 700);
        });
    } else {
        btn.title = 'Masuk Admin';
        btn.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }
}

/**
 * 3. Render daftar link (pill style)
 */
function initLinks() {
    renderLinks();
}

function renderLinks() {
    const container = document.getElementById('links-container');
    if (!container || !siteData.links) return;

    container.innerHTML = '';

    // Tombol tambah link untuk admin
    if (isAdmin) {
        const addBtn = document.createElement('button');
        addBtn.className = 'btn-add-link';
        addBtn.innerHTML = `<i class="fas fa-plus"></i> Tambah Link Baru`;
        addBtn.addEventListener('click', () => openLinkEditor());
        container.appendChild(addBtn);
    }

    if (siteData.links.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'empty-links';
        empty.innerHTML = `<i class="fas fa-link"></i> Belum ada link. Yuk tambahkan link pertama Anda!`;
        container.appendChild(empty);
        return;
    }

    siteData.links.forEach(link => {
        const pill = document.createElement('div');
        pill.className = `link-pill ${link.highlighted ? 'highlighted' : ''} ${isAdmin ? 'admin-actions' : ''}`;

        // Konten tengah
        const content = document.createElement('div');
        content.className = 'pill-content';
        content.innerHTML = `
            <span class="link-pill-title">${link.title}</span>
            ${link.subtitle ? `<span class="link-pill-subtitle">${link.subtitle}</span>` : ''}
        `;

        // Menu titik-tiga di kanan
        const menu = document.createElement('div');
        menu.className = 'pill-menu';

        // Tombol EDIT & HAPUS langsung terlihat (khusus admin)
        if (isAdmin) {
            const editBtn = document.createElement('button');
            editBtn.className = 'pill-action edit';
            editBtn.title = 'Edit Link';
            editBtn.innerHTML = `<i class="fas fa-pen"></i>`;
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openLinkEditor(link.id);
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'pill-action delete';
            deleteBtn.title = 'Hapus Link';
            deleteBtn.innerHTML = `<i class="fas fa-trash"></i>`;
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteLink(link.id, link.title);
            });

            menu.appendChild(editBtn);
            menu.appendChild(deleteBtn);
        }

        const dotsBtn = document.createElement('button');
        dotsBtn.className = 'pill-dots';
        dotsBtn.title = isAdmin ? 'Menu' : 'Salin Tautan';
        dotsBtn.innerHTML = `<i class="fas fa-ellipsis"></i>`;

        // Dropdown isi menu
        const dropdown = document.createElement('div');
        dropdown.className = 'pill-dropdown';

        let menuHtml = `
            <button data-action="copy"><i class="fas fa-copy"></i> Salin Tautan</button>
            <button data-action="open"><i class="fas fa-arrow-up-right-from-square"></i> Buka Link</button>
        `;

        if (isAdmin) {
            menuHtml += `
                <button data-action="edit"><i class="fas fa-pen"></i> Edit</button>
                <button data-action="delete" class="danger"><i class="fas fa-trash"></i> Hapus</button>
            `;
        }

        dropdown.innerHTML = menuHtml;

        // Klik pill (di luar tombol menu) = buka link
        pill.addEventListener('click', (e) => {
            if (e.target.closest('.pill-dots') || e.target.closest('.pill-dropdown') || e.target.closest('.pill-action')) return;
            window.open(link.url, '_blank', 'noopener,noreferrer');
        });

        // Toggle dropdown
        dotsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const wasOpen = dropdown.classList.contains('open');
            closeAllDropdowns();
            if (!wasOpen) dropdown.classList.add('open');
        });

        // Aksi dropdown
        dropdown.addEventListener('click', (e) => {
            const actionBtn = e.target.closest('button[data-action]');
            if (!actionBtn) return;
            e.stopPropagation();

            const action = actionBtn.getAttribute('data-action');
            closeAllDropdowns();

            if (action === 'open') {
                window.open(link.url, '_blank', 'noopener,noreferrer');
            } else if (action === 'copy') {
                copyToClipboard(link.url, `Tautan "${link.title}" disalin!`);
            } else if (action === 'edit') {
                openLinkEditor(link.id);
            } else if (action === 'delete') {
                deleteLink(link.id, link.title);
            }
        });

        menu.appendChild(dotsBtn);
        menu.appendChild(dropdown);
        pill.appendChild(content);
        pill.appendChild(menu);
        container.appendChild(pill);
    });
}

function closeAllDropdowns() {
    document.querySelectorAll('.pill-dropdown.open').forEach(d => d.classList.remove('open'));
}

// Tutup dropdown saat klik di luar
document.addEventListener('click', (e) => {
    if (!e.target.closest('.pill-menu')) {
        closeAllDropdowns();
    }
});

/**
 * 4. Link Editor — Add / Edit / Delete (Admin)
 */
function initLinkEditor() {
    const form = document.getElementById('link-editor-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        saveLinkFromForm();
    });

    const cancelBtn = document.getElementById('btn-cancel-link');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => closeModal('modal-link-editor'));
    }
}

function openLinkEditor(linkId = null) {
    const modal = document.getElementById('modal-link-editor');
    const form = document.getElementById('link-editor-form');
    if (!modal || !form) return;

    form.reset();

    const titleEl = document.getElementById('link-editor-title');
    const idEl = document.getElementById('link-id');

    if (linkId !== null) {
        const link = siteData.links.find(l => String(l.id) === String(linkId));
        if (!link) return;

        titleEl.innerHTML = `<i class="fas fa-pen"></i> Edit Link`;
        idEl.value = link.id;
        document.getElementById('link-title').value = link.title || '';
        document.getElementById('link-url').value = link.url || '';
        document.getElementById('link-subtitle').value = link.subtitle || '';
        document.getElementById('link-highlighted').checked = !!link.highlighted;
    } else {
        titleEl.innerHTML = `<i class="fas fa-plus"></i> Tambah Link`;
        idEl.value = '';
    }

    openModal('modal-link-editor');
}

function saveLinkFromForm() {
    const idVal = document.getElementById('link-id').value;
    const data = {
        title: document.getElementById('link-title').value.trim(),
        url: document.getElementById('link-url').value.trim(),
        subtitle: document.getElementById('link-subtitle').value.trim(),
        highlighted: document.getElementById('link-highlighted').checked
    };

    if (!data.title || !data.url) {
        showToast('Judul dan URL wajib diisi.');
        return;
    }

    if (idVal) {
        // EDIT
        const index = siteData.links.findIndex(l => String(l.id) === String(idVal));
        if (index !== -1) {
            data.id = siteData.links[index].id;
            data.clicks = siteData.links[index].clicks || 0;
            siteData.links[index] = data;
        }
        showToast(`Link "${data.title}" diperbarui!`);
    } else {
        // ADD
        data.id = Date.now();
        data.clicks = 0;
        siteData.links.push(data);
        showToast(`Link "${data.title}" ditambahkan!`);
    }

    persistLinks();
    renderLinks();
    closeModal('modal-link-editor');
}

function deleteLink(linkId, linkTitle) {
    if (!confirm(`Hapus link "${linkTitle}"?\n\nTindakan ini tidak bisa dibatalkan.`)) return;

    siteData.links = siteData.links.filter(l => String(l.id) !== String(linkId));
    persistLinks();
    renderLinks();
    showToast(`Link "${linkTitle}" dihapus.`);
}

/**
 * 5. Modal
 */
function initModals() {
    document.querySelectorAll('[data-close]').forEach(btn => {
        btn.addEventListener('click', () => closeModal(btn.getAttribute('data-close')));
    });

    document.querySelectorAll('.modal-backdrop').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal.id);
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
            closeAllDropdowns();
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
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
    document.body.style.overflow = '';
}

/**
 * 6. Clipboard & Toast
 */
function copyToClipboard(text, successMessage = 'Disalin!') {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => showToast(successMessage)).catch(() => fallbackCopy(text, successMessage));
    } else {
        fallbackCopy(text, successMessage);
    }
}

function fallbackCopy(text, successMessage) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-999999px';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
        document.execCommand('copy');
        showToast(successMessage);
    } catch (err) {
        showToast('Gagal menyalin');
    }
    document.body.removeChild(ta);
}

function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        if (toast.parentElement) toast.remove();
    }, 3000);
}
