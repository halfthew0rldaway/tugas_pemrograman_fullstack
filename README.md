# Tugas Pemrograman Fullstack

### Persyaratan
Pastikan perangkat sudah terpasang:
* **Node.js** (versi 16 atau lebih baru)
* **MySQL** (via XAMPP, Laragon, atau instalasi mandiri)
* **npm** (biasanya otomatis terpasang bersama Node.js)

### Persiapan Database
1. Buka MySQL atau phpMyAdmin.
2. Buat database baru dengan nama `fullstack`.
3. Import file `setup.sql` yang tersedia di root folder untuk membuat tabel yang diperlukan.

### Instalasi
Lakukan clone atau unduh repositori ini, kemudian masuk ke direktori proyek melalui terminal atau CMD:

```bash
# Instalasi dependensi
npm install
```

### Konfigurasi
Sesuaikan konfigurasi database pada file `config/db.js` (host, user, password, dan database).

### Cara Menjalankan
Pastikan layanan MySQL sudah aktif, kemudian jalankan perintah berikut:

```bash
# Mode development (menggunakan nodemon)
npm run dev

# Mode produksi / standar
npm start
```

Aplikasi dapat diakses melalui `http://localhost:3000` atau sesuai dengan port yang dikonfigurasi.
