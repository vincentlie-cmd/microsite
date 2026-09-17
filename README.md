# 🌸 Microsite Bio Links — Linktree Style

Website bio link pribadi (seperti Linktree) dengan login admin dan fitur **Add / Edit / Delete** link.

## 📂 File

| File | Fungsi |
|------|--------|
| `index.html` | Halaman utama (daftar link) |
| `login.html` | Halaman masuk / daftar akun admin |
| `auth.js` | Logika login, register & session |
| `app.js` | Logika tampilan + CRUD link |
| `data.js` | Data profil & link default |
| `flower.svg` | Gambar bunga untuk foto profil |
| `style.css` | Desain pastel glassmorphism |

## 🚀 Cara Hosting di GitHub Pages

1. **Buat repository baru** di GitHub, misalnya `microsite` (public).
2. **Upload semua file** ini ke repository tersebut (`index.html`, `login.html`, `auth.js`, `app.js`, `data.js`, `style.css`, `flower.svg`).
3. Buka **Settings** → menu **Pages** (di sidebar kiri).
4. Pada bagian **Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: **main** (atau `master`), folder: **/ (root)**
   - Klik **Save**.
5. Tunggu 1–2 menit, lalu website aktif di:
   ```
   https://USERNAME.github.io/microsite/
   ```
6. Halaman login ada di:
   ```
   https://USERNAME.github.io/microsite/login.html
   ```

> ✅ Semua path di kode sudah relatif, jadi tidak perlu ada perubahan apa pun saat di-hosting.

## 🔐 Akun Admin

- Tidak ada akun bawaan. Buka `login.html` → tab **Daftar** untuk membuat akun admin pertama.
- Setelah login, tombol "Tambah Link" dan menu Edit/Hapus di titik-tiga (⋯) akan aktif.

## 💾 Catatan Penyimpanan Data

- Data link & akun disimpan di **localStorage browser** (per perangkat/per-browser).
- Menambah/mengedit link di komputer A tidak akan terlihat di komputer B.
- Jika ingin data tersama untuk semua pengunjung, dibutuhkan backend/database.

## 🎨 Kustomisasi

Edit bagian `profile` di `data.js`:

```js
profile: {
    name: "Nama Anda",
    handle: "@username",
    avatar: "flower.png",   // ganti dengan foto Anda
    bio: "Deskripsi singkat Anda"
}
```
