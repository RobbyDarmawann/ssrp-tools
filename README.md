# SSRP Studio

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

SSRP Studio adalah aplikasi web *client-side* untuk membuat dan mengedit *Screenshot Roleplay* (SSRP) GTA: San Andreas Multiplayer (SAMP) langsung di browser. Aplikasi ini dirancang agar proses penyusunan chat roleplay, pengaturan posisi teks, dan ekspor gambar bisa dilakukan dengan cepat tanpa perlu software edit gambar tambahan.

**Live Demo:** [https://tools-ssrp.vercel.app/](https://tools-ssrp.vercel.app/)

## Fitur Utama

- Upload screenshot dari file lokal sebagai kanvas kerja.
- Tambah beberapa *text layer* untuk menyusun dialog atau narasi roleplay.
- Drag-and-drop teks di atas kanvas dengan koordinat yang presisi.
- Atur ukuran font, posisi X/Y, dan warna tiap baris teks secara manual.
- Preset konteks roleplay bawaan untuk `chat`, `/me`, `/do`, `OOC`, `Radio`, dan `Low`.
- Render teks bergaya SAMP dengan font Arial/Tahoma, teks tebal, dan *text shadow* 8 arah.
- Ubah ukuran kanvas agar cocok dengan resolusi screenshot asli.
- Mode gelap/terang untuk kenyamanan saat mengedit.
- Dukungan bahasa Indonesia dan Inggris.
- Ekspor hasil akhir ke PNG langsung dari browser menggunakan `html-to-image`.
- Seluruh proses berjalan lokal di sisi klien, tanpa backend dan tanpa upload ke server.

## Teknologi

- **Framework:** Next.js 16 dengan App Router
- **Frontend:** React 19
- **Styling:** Tailwind CSS 4
- **Drag and Drop:** `react-draggable`
- **Ekspor Gambar:** `html-to-image`
- **Icon:** `lucide-react`

## Prasyarat

Pastikan komputer Anda sudah memiliki:

- Node.js 18 atau lebih baru
- npm

## Instalasi

```bash
git clone https://github.com/RobbyDarmawann/ssrp-tools.git
cd ssrp-tools
npm install
```

## Menjalankan Aplikasi

```bash
npm run dev
```

Setelah itu, buka [http://localhost:3000](http://localhost:3000) di browser.

## Script Tersedia

```bash
npm run dev
npm run build
npm run start
npm run lint
```

- `dev` menjalankan server pengembangan.
- `build` membuat build produksi.
- `start` menjalankan hasil build.
- `lint` memeriksa kualitas kode dengan ESLint.

## Alur Penggunaan

1. Upload screenshot yang ingin dijadikan basis SSRP.
2. Sesuaikan ukuran kanvas bila resolusi gambar perlu diubah.
3. Tambahkan *text layer* baru untuk setiap blok dialog atau aksi.
4. Pilih preset tipe teks yang sesuai, misalnya `chat`, `/me`, atau `Radio`.
5. Geser teks langsung di kanvas atau isi nilai X/Y dari panel properti.
6. Ubah isi teks dan warna jika diperlukan.
7. Klik *Export Image* untuk mengunduh hasil komposit dalam format PNG.

## Struktur Proyek

```text
app/
  layout.tsx
  page.tsx
  globals.css
public/
```

## Deployment

Proyek ini cocok dideploy ke Vercel karena seluruh logika berjalan di sisi klien dan sudah mengikuti struktur standar Next.js.

Langkah umum deployment:

1. Push repository ke GitHub.
2. Hubungkan repository ke Vercel.
3. Gunakan perintah build default dari Next.js.
4. Deploy.

## Catatan

- SSRP Studio adalah utilitas independen dan tidak berafiliasi dengan pengelola server SAMP tertentu.
- Hasil akhir sangat bergantung pada resolusi screenshot sumber dan penempatan teks yang Anda atur.

## Kontribusi

Jika ingin menambahkan fitur baru, lakukan fork lalu kirim pull request dengan perubahan yang terfokus dan konsisten dengan gaya proyek ini.

## Lisensi

Belum ditentukan.
