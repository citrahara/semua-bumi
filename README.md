# Taman Kronik

Game puzzle Match-3 bertingkat dengan renovasi taman 3D dalam buku terbuka.

## Fitur Utama

- **Pendaftaran Akun 2 Langkah**: Buat username lalu selesaikan 3 soal seleksi singkat (bahasa, hitung, dan nalar) tanpa pemilihan karakter.
- **Papan Match-3 Bertahap**: Dimulai dari ukuran `5x5` di Level 1 lalu membesar sampai `8x8` pada level lanjutan, dilengkapi aset buah dan Power-Up 3D realistis (`assets/tiles/*.png`), animasi geser dan pantul halus, serta Power-Up yang sepenuhnya menunggu kendali pemain.
- **Micro-Quest Ringkas**: Satu soal singkat (Bahasa Korea dengan suara `ko-KR`, Sastra Klasik, Diksi KBBI VI, Keamanan Siber, Fakta, Logika, atau Hitung) muncul saat membuka Segel Ilmu, mengaktifkan Booster gratis, menambah `+5 Langkah`, atau mengisi nyawa (`♥`).
- **Pratinjau Renovasi 3D Langsung**: Memilih salah satu dari 12 area taman mengarahkan kamera 3D ke lokasi objek dan menampilkan 3 pilihan gaya secara langsung sebelum memakai bintang (`★`).
- **Peta Taman Interaktif**: Menampilkan posisi pemain saat ini serta status seluruh 12 area (`Siap`, `Kunci`, dan `Buka`) dengan penanda gembok 3D di taman.

## Menjalankan Secara Lokal

```bash
python -m http.server 8090
```

Buka `http://localhost:8090` di browser.
