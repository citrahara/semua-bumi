# Kronik Atlas · RPG 3D Peta Dalam Buku Tanpa Akhir

RPG 3D peta pop-up di dalam buku antologi kulit antik (Three.js WebGL dengan *fallback* 2D otomatis) yang menggabungkan sistem progresi **endless berisiko tinggi**, relik pengetahuan, duel taktis, dan UX minimalis yang lapang.

## Sistem Endless RPG yang Menantang

- **HP Persisten & Istirahat Penanda Bab**: sisa HP terbawa antar-duel. Pulihkan HP dengan istirahat di Penanda Bab atau membeli **Tinta Pemulih** (`+45% HP` tanpa menghabiskan giliran).
- **Menu Tempa (`[U]`)**: tingkatkan `ATK`, `DEF / Perisai`, `Max HP`, dan `Kritikal` tanpa batas menggunakan Koin dari duel, peti, dan Segel Matematika.
- **5 Relik Ilmu (Sinergi Belajar & Tempur)**: menyelesaikan Arsip Sastra (Orwell, Huxley, Austen, Sherlock, Pramoedya), Stasiun Korea (Hangul + audio), Paviliun Poliglot (Jepang & Inggris), Pusat SOC (`/berita-terkini`), dan Balai Retorika memberikan *buff* tempur permanen (`+18% Strike`, `+25 HP & Regen`, `+1 Energi awal`, `+25% Perisai`, `+35% Counter/Overdrive`).
- **Duel Taktis Berwaktu**: musuh Bab III–VI dan Jilid lanjutan memiliki **Armor/Perisai**. Gunakan **Overdrive (2 Energi, 10 detik)** untuk serangan tembus armor `2.35x DMG` dan **Counter Taktis (12 detik)** untuk membatalkan Ultimate musuh.
- **Segel Matematika Ketat**: 3 rune berwaktu (25 detik per rune, menyusut di Jilid tinggi) dengan batas maksimal 2 kesalahan.
- **Eskalasi Jilid Tanpa Akhir (`Jilid I -> II -> III -> ∞`)**: setelah menumbangkan Dalang Deepfake di Bab VI, buka Jilid berikutnya lewat menu **Tempa `[U]`** agar seluruh musuh, armor, dan segel bangkit jauh lebih tangguh sambil mempertahankan Level, Tempaan, Codex (`78` kartu), dan 5 Relik Ilmu.

## Kontrol

- **Gerak**: `WASD` / tombol panah / klik singkat di tanah (`Shift` untuk lari).
- **POV 3D**: tarik kursor di mana saja (360° & atas-bawah), *scroll* untuk zoom, atau tekan `V` untuk POV bebas.
- **Aksi**: `E` interaksi, `F` Strike Ambush (`-18% HP` musuh), `U` Tempa, `M` Atlas, `C` Codex, `H` Harian, `?` panduan ringkas.

## Menjalankan Lokal

```bash
python -m http.server 8090
```

Buka `http://localhost:8090`. Statis murni tanpa *build step*, siap tayang di GitHub Pages.
