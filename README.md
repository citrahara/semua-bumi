# Warkop Impact

Game RPG 2D dunia terbuka (*open-world*) di peramban yang menggabungkan loket pendaftaran akun ber-ujian masuk, 4 jenis karakter RPG, jelajah peta, sistem *quest* ala Genshin Impact, kuis wawasan lintas bidang, ketajaman diksi bahasa Indonesia (KBBI VI dan EYD V), duel sesat pikir, panggung orasi 30 detik, dan **Segel Matematika** untuk membuka tiap level wilayah baru.

## Alur Pendaftaran Akun & 4 Jenis Karakter

1. **Buat Username**: pilih *username* unik (3 sampai 16 karakter) atau pakai tombol acak.
2. **Ujian Masuk Akun (3 Tes Kilat)**: lulus 3 tantangan beruntun (Cek Bahasa KBBI/EYD V, Hitung Kasir, Cek Wawasan/Nalar) dengan batas 20 detik per tes. Salah satu soal atau kehabisan waktu membuat akun ditolak beserta penjelasan dan *cooldown* 5 detik sebelum bisa mengulang dengan soal baru.
3. **Pilih Jenis Karakter**:
   - **Orator Api**: lari +12% lebih cepat dan +15% XP Panggung Orasi.
   - **Pujangga Senja**: +20% XP dan Koin dari Quest Bahasa dan Diksi.
   - **Detektif Logika**: +20% XP dan Koin dari Duel Fakta dan Sesat Pikir.
   - **Alkemis Angka**: +25% XP dan Koin saat memecahkan Segel Matematika dan membuka peti harta.

## Empat Wilayah & Segel Matematika

1. **Desa Warkop (Lv. 1)**: bantu Bang Jaja, Kang Deden, dan Pak Budi memisahkan fakta sains, sejarah, dan budaya dari mitos populer.
2. **Segel Matematika #1 -> Kota Bahasa (Lv. 2)**: pecahkan 3 Rune Aritmetika, Persentase, dan Pola Bilangan untuk membuka jembatan menuju Taman Sastra (Teh Rina & Mbak Siska).
3. **Segel Matematika #2 -> Lembah Logika (Lv. 3)**: pecahkan 3 Rune Aljabar, Rasio, dan Geometri Sudut untuk masuk ke Benteng Debat (duel sesat pikir lawan Mas Fikri & Hakim Nalar).
4. **Segel Matematika #3 -> Puncak Orator (Lv. 4)**: pecahkan 3 Rune Kecepatan, Sistem Persamaan, dan Kombinasi untuk naik ke Amfiteater Langit dan menghadapi Boss Maestro Lidah Emas dalam ujian orasi 30 detik (Mikrofon lokal atau Ketik Kilat).

## Kontrol

- **Desktop**: `WASD` atau tombol panah (atau klik langsung di peta untuk berjalan), `Shift` untuk lari, `E` untuk berinteraksi, `M` untuk Peta Dunia & Teleportasi Waypoint, `C` untuk Codex Wawasan.
- **Ponsel**: D-Pad sentuh di kiri bawah, tombol `AKSI` dan `LARI` di kanan bawah, atau ketuk langsung di peta.

## Menjalankan Lokal

```bash
python -m http.server 8090
```

Buka `http://localhost:8090` di *browser*. Tanpa *build step*, siap tayang langsung di GitHub Pages.
