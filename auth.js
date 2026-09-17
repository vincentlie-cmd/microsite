/**
 * Auth Module — Login & Register sederhana berbasis localStorage.
 * CATATAN: Ini adalah demo tanpa backend. Hash password di sini sederhana,
 * bukan untuk keamanan tingkat produksi.
 */

const Auth = (() => {
    const USERS_KEY = 'microsite_users';
    const SESSION_KEY = 'microsite_session';

    function getUsers() {
        try {
            return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
        } catch (err) {
            return [];
        }
    }

    function saveUsers(users) {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    function makeSalt() {
        return Math.random().toString(36).slice(2, 12) + Date.now().toString(36);
    }

    // Hash sederhana (bukan kriptografi produksi)
    function hashPassword(password, salt) {
        let h1 = 0xdeadbeef;
        let h2 = 0x41c6ce57;
        const str = salt + '::' + password + '::' + salt;
        for (let round = 0; round < 64; round++) {
            for (let i = 0; i < str.length; i++) {
                const ch = str.charCodeAt(i) + round;
                h1 = Math.imul(h1 ^ ch, 2654435761);
                h2 = Math.imul(h2 ^ ch, 1597334677);
            }
        }
        h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
        h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
        return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16) + '-' + (h2 >>> 0).toString(16);
    }

    function createSession(user) {
        const session = {
            username: user.username,
            name: user.name,
            loginAt: new Date().toISOString()
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        return session;
    }

    function init() {
        // Tidak ada akun bawaan — pengguna harus mendaftar sendiri lewat halaman Daftar
    }

    function register(input) {
        const name = (input.name || '').trim();
        const username = (input.username || '').trim().toLowerCase();
        const password = input.password || '';

        if (!username || !password) {
            return { ok: false, message: 'Username dan password wajib diisi.' };
        }

        const users = getUsers();
        if (users.some(u => u.username === username)) {
            return { ok: false, message: 'Username "' + username + '" sudah terdaftar. Coba yang lain.' };
        }

        const salt = makeSalt();
        const user = {
            name: name || username,
            username: username,
            salt: salt,
            passwordHash: hashPassword(password, salt),
            createdAt: new Date().toISOString()
        };
        users.push(user);
        saveUsers(users);
        createSession(user); // Auto login setelah daftar
        return { ok: true };
    }

    function login(username, password) {
        const users = getUsers();
        const cleanUsername = (username || '').trim().toLowerCase();
        const user = users.find(u => u.username === cleanUsername);

        if (!user) {
            return { ok: false, message: 'Username tidak ditemukan.' };
        }
        if (user.passwordHash !== hashPassword(password || '', user.salt)) {
            return { ok: false, message: 'Password salah. Silakan coba lagi.' };
        }

        createSession(user);
        return { ok: true };
    }

    function logout() {
        localStorage.removeItem(SESSION_KEY);
    }

    function currentUser() {
        try {
            return JSON.parse(localStorage.getItem(SESSION_KEY));
        } catch (err) {
            return null;
        }
    }

    return { init: init, register: register, login: login, logout: logout, currentUser: currentUser };
})();

/**
 * Logika halaman login.html (form login, register & tab switching).
 * Tidak berjalan di index.html karena form-nya tidak ada di sana.
 */
document.addEventListener('DOMContentLoaded', () => {
    Auth.init();

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    if (!loginForm || !registerForm) return; // Bukan halaman login

    // Sudah login? Langsung ke halaman utama
    if (Auth.currentUser()) {
        window.location.replace('index.html');
        return;
    }

    function showError(form, message) {
        const err = form.querySelector('.auth-error');
        if (err) {
            err.textContent = message;
            err.classList.add('show');
        }
    }

    function hideError(form) {
        const err = form.querySelector('.auth-error');
        if (err) err.classList.remove('show');
    }

    // Tab switching (Masuk / Daftar)
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const target = tab.getAttribute('data-tab');
            loginForm.classList.toggle('active', target === 'login');
            registerForm.classList.toggle('active', target === 'register');
            hideError(loginForm);
            hideError(registerForm);
        });
    });

    // Toggle tampil/sembunyi password
    document.querySelectorAll('.toggle-pass').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = document.getElementById(btn.getAttribute('data-target'));
            if (!input) return;
            const isHidden = input.type === 'password';
            input.type = isHidden ? 'text' : 'password';
            btn.innerHTML = isHidden ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
        });
    });

    // Submit Login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        hideError(loginForm);

        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        const result = Auth.login(username, password);

        if (result.ok) {
            window.location.href = 'index.html';
        } else {
            showError(loginForm, result.message);
        }
    });

    // Submit Register
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        hideError(registerForm);

        const name = document.getElementById('register-name').value;
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        const confirm = document.getElementById('register-confirm').value;

        if (username.trim().length < 3) {
            showError(registerForm, 'Username minimal 3 karakter.');
            return;
        }
        if (password.length < 6) {
            showError(registerForm, 'Password minimal 6 karakter.');
            return;
        }
        if (password !== confirm) {
            showError(registerForm, 'Konfirmasi password tidak cocok.');
            return;
        }

        const result = Auth.register({ name: name, username: username, password: password });
        if (result.ok) {
            window.location.href = 'index.html';
        } else {
            showError(registerForm, result.message);
        }
    });
});
