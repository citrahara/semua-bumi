# Warkop Impact: Kronik 1894 (3D Open-World RPG)

Game RPG **3D dunia terbuka** (Three.js WebGL dengan *fallback* 2D otomatis) yang memadukan **storyline vintage tahun 1894**, **Panggung Open-Mic Stand-Up Comedy**, **sistem tanpa tamat (Endless RPG)**, loket pendaftaran akun ber-ujian masuk, 4 jenis karakter 3D, 6 wilayah alam 3D, duel **Attack & Defense** melawan ancaman dunia siber, **Ruang Belajar Bahasa** (Korea, Jepang, Inggris, Indonesia, Retorika) lengkap dengan suara pelafalan, **Pusat Komando Siber & Radar `/berita-terkini`**, serta **5 Segel Matematika** untuk membuka tiap level wilayah baru.

## Sistem Tanpa Tamat (Endless Playability)

- **Komisi Harian (WIB)**: 4 misi baru yang reset otomatis tiap hari (Stand-Up, Duel Siber, Menara Abadi, Ruang Belajar) beserta *Daily Streak*.
- **Menara Kronik Abadi (Lantai 1 sampai Tak Terbatas)**: lantai ganjil menghadirkan duel *Attack & Defense* melawan musuh siber yang terus berevolusi, sedangkan lantai genap menghadirkan ujian campuran Matematika dan Bahasa.
- **Ascension (Era Dunia I, II, III...)**: setelah menaklukkan seluruh wilayah, pemain bisa menaikkan Era Dunia agar semua peti harta dan musuh bangkit lagi sambil mempertahankan Level, Codex, Lencana, dan rekor Menara.
- **Panggung Open-Mic Stand-Up Comedy 1894**: mode Rakit Bit 3 ketukan (*Setup*, *Twist*, *Punchline*) dengan *Laugh-O-Meter* plus generator premis *vintage* x siber acak tanpa batas (Mikrofon lokal atau Ketik Kilat).

## Alur Pendaftaran Akun & 4 Jenis Karakter

1. **Buat Username**: pilih *username* unik (3 sampai 16 karakter) atau pakai tombol acak.
2. **Ujian Masuk Akun (3 Tes Kilat)**: lulus 3 tantangan beruntun (Cek Bahasa KBBI/EYD V, Hitung Kasir, Cek Wawasan/Nalar) dengan batas 20 detik per tes. Salah satu soal atau kehabisan waktu membuat akun ditolak beserta penjelasan dan *cooldown* 5 detik sebelum bisa mengulang dengan soal baru.
3. **Pilih Jenis Karakter**:
   - **Orator Api**: lari +12% lebih cepat dan +15% XP Panggung Orasi.
   - **Pujangga Senja**: +20% XP dan Koin dari Quest Bahasa dan Diksi.
   - **Detektif Logika**: +20% XP dan Koin dari Duel Fakta dan Sesat Pikir.
   - **Alkemis Angka**: +25% XP dan Koin saat memecahkan Segel Matematika dan membuka peti harta.

## Enam Wilayah, Akademi Belajar & Segel Matematika

1. **Desa Warkop (Lv. 1)**: misi Bang Jaja, Kang Deden, Pak Budi, dan latihan tempur *Attack & Defense* melawan Slime Hoaks Berantai.
2. **Segel Matematika #1 -> Distrik Bahasa & Akademi (Lv. 2)**:
   - **Akademi Korea (Sora-ssi)**: belajar Hangul dasar, 8 frasa sopan santun dengan tombol pelafalan suara (`ko-KR`), dan praktik kafe Seoul.
   - **Paviliun Poliglot (Kenji-san)**: belajar konsep budaya Jepang (`ja-JP`) dan idiom bahasa Inggris elegan (`en-US`).
   - **Balai Pustaka (Teh Rina)** & **Guild Startup (Mbak Siska)**: audit KBBI VI / EYD V dan diksi tajam.
3. **Segel Matematika #2 -> Distrik Siber & AI Lab (Lv. 3)**:
   - **Pusat Komando SOC (Komandan Vega)**: 8 terobosan baru dunia siber (Post-Quantum Cryptography NIST FIPS 203/204, Prompt Injection, ICS/OT/SCADA IIV, Passkeys/FIDO2, Zero-Trust, C2PA Deepfake, SBOM, AI SOC), peta 21 sumber `/berita-terkini`, dan simulasi analis.
   - Duel *Attack & Defense* melawan **Phishing Botnet Drone** dan **Prompt-Injection Wyrm**.
4. **Segel Matematika #3 -> Benteng IIV / SCADA Grid (Lv. 4)**: lindungi gardu energi bersama Insinyur Bima dengan menumbangkan **Ransomware Titan** dan **SCADA Worm Sentinel**.
5. **Segel Matematika #4 -> Lembah Logika & Debat (Lv. 5)**: ruang belajar kerangka retorika PREP (Hakim Nalar), duel sesat pikir Mas Fikri, dan **Golem Sesat Pikir**.
6. **Segel Matematika #5 -> Puncak Amfiteater Orator (Lv. 6)**: hadapi Boss **Overlord Deepfake** lalu taklukkan ujian orasi 30 detik bersama **Maestro Lidah Emas** (Mikrofon lokal atau Ketik Kilat).

## Kontrol

- **Desktop**: `WASD` atau tombol panah (atau klik langsung di peta untuk berjalan), `Shift` untuk lari, `E` untuk berinteraksi, `M` untuk Peta Dunia & Teleportasi Waypoint, `C` untuk Codex Wawasan & Intel Siber.
- **Ponsel**: D-Pad sentuh di kiri bawah, tombol `AKSI` dan `LARI` di kanan bawah, atau ketuk langsung di peta.

## Menjalankan Lokal

```bash
python -m http.server 8090
```

Buka `http://localhost:8090` di *browser*. Tanpa *build step*, siap tayang langsung di GitHub Pages.
