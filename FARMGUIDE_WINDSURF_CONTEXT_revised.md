# FarmGuide — Windsurf Build Context
> Dokumen ini dibuat untuk Windsurf. Baca seluruh dokumen sebelum menulis satu baris kode pun.

---

## 1. Gambaran Proyek FarmWell

FarmWell adalah platform manajemen kesehatan ternak multilingual (EN/ID/VI), deployed di `farmwell.vercel.app`. Dikembangkan dengan React + vanilla CSS untuk core/dashboard, dan React + Tailwind CSS v4 untuk PigFarmCalculator (di-embed via iframe).

**Project path:** `A:\Projects\FarmWell\FarmWell\`

**Modul yang sudah ada:**
- PoultryWell — diagnosis penyakit unggas, biosecurity, feeding program
- PigWell — diagnosis penyakit babi, biosecurity
- PigFarmCalculator — farm calculator (iframe dari GitHub Pages)
- Feed Module — kalkulator dosage feed additives
- FarmWell Dashboard — landing utama dengan card navigasi ke modul

**FarmGuide** adalah modul baru yang akan dibangun dari nol.

> **Apa itu FarmGuide?**
> FarmGuide adalah **production monitor dan reference tool** untuk peternakan unggas.
> Fungsi utama: membandingkan performa flock aktual (bobot badan, FCR, EP%) terhadap standar
> handbook, menampilkan growth curve, dan memberikan AI advisory berbasis data history.
> Ini BUKAN content browser/artikel — ini adalah tool performa ternak.

---

## 2. Arsitektur yang Sudah Ada — WAJIB IKUTI

### 2.1 Pola Data: `public/data/`

Semua data konten disimpan sebagai JSON statis di folder `public/data/`. FarmGuide mengikuti pola yang sama dan datanya **sudah tersedia** di:

```
public/
  data/
    poultry/                    ← data PoultryWell (sudah ada)
    swine/                      ← data PigWell (sudah ada)
    farmguide_data/         ← [SUDAH ADA] data FarmGuide — JANGAN BUAT ULANG
      README.md                 ← baca ini dulu sebelum menyentuh data apapun
      breeds/
        ps_standards.json       ← Parent Stock: BW female/male, 3 breed, Week 0–64
        layer_standards.json    ← Layer: rearing BW + EP% + egg weight Week 19–100
        color_chicken_standards.json ← Color Chicken: male/female, 2 varian, Day 1–126
      management/
        environment_params.json ← suhu, RH, ventilasi, cahaya per minggu (broiler)
        feed_program.json       ← feed phases, konsumsi referensi, water:feed ratio
        weekly_checklist.json   ← checklist mingguan broiler Week 1–8 (Bahasa Indonesia)
      app_config/
        modules.json            ← definisi modul, 11 screens, navigation flow, product matrix
      flock_saya/
        schema.json             ← data model entry, history logic, AI advisory triggers
```

**⚠️ PENTING: Folder datanya adalah `public/data/farmguide_data/` — BUKAN `public/data/farmguide/` atau `public/data/poultry/farmguide/`.

**Aksi wajib sebelum mulai:** Hapus folder `{breeds,management,app_config,flock_saya}` yang ada di dalam `farmguide_data/` — itu artefak zip extraction yang salah, bukan folder valid.
Data sudah lengkap dan real (dari handbook resmi). Jangan buat data dummy — gunakan yang sudah ada.

**Aturan JSON yang wajib diikuti:**
- Enum/identifier logika selalu dalam bahasa Inggris, tidak boleh diterjemahkan
- Display string UI disediakan dalam 3 bahasa: `en`, `id`, `vi`
- Gunakan kode bahasa: `en`, `id`, `vi` — BUKAN `vn`, `vt`, `in`, atau uppercase
- Konten data (nilai numerik, field name JSON) tetap dalam bahasa Inggris

### 2.2 Cara Fetch Data dari Komponen

```js
// Base path untuk semua data FarmGuide
const BASE = '/data/farmguide_data';

// Contoh: load daftar modul
const config = await fetch(`${BASE}/app_config/modules.json`).then(r => r.json());

// Contoh: load BW standar layer
const layer = await fetch(`${BASE}/breeds/layer_standards.json`).then(r => r.json());
// layer.rearing_bw.data = array [week, bw_avg, bw_min, bw_max, feed_phase]

// Contoh: load BW harian color chicken jantan varian_a hari ke-35
const cc = await fetch(`${BASE}/breeds/color_chicken_standards.json`).then(r => r.json());
const day35 = cc.male.variant_a.daily_data.find(row => row[0] === 35);
// → [35, 57, 1142, 1.857, 3.00, 615, 22.0]
// Kolom: [day, fc_g_bird_day, cum_feed_g, fcr, cum_dep_pct, bw_g, adg_g]
```

### 2.3 Breed — Aturan Kritis (Locked V6 Decision)

**JANGAN PERNAH tampilkan nama breed atau brand di UI.**
Data JSON menyimpan breed sebagai kode internal:

| Kode Internal     | Digunakan Di          |
|-------------------|-----------------------|
| `breed_a`         | ps_standards.json     |
| `breed_b`         | ps_standards.json     |
| `breed_c`         | ps_standards.json     |
| `variant_a`       | color_chicken         |
| `variant_b`       | color_chicken         |
| `commercial_layer`| layer_standards       |

Label yang ditampilkan di UI cukup: "Tipe A", "Tipe B", "Tipe C" — tanpa nama dagang apapun.

### 2.4 Struktur Komponen React

Ikuti pola yang sudah ada di modul lain:

```
src/
  modules/
    farmguide/                    ← [BARU — buat folder ini]
      FarmGuideApp.jsx            ← sub-router root untuk /farmguide/*
      pages/
        FarmGuideHome.jsx         ← module selector (Screen 1 — bangun ini dulu)
        BreedSelector.jsx         ← pilih breed/tipe (Screen 2)
        SexSelector.jsx           ← pilih jantan/betina — hanya Color Chicken & PS (Screen 3)
        ManagementGuide.jsx       ← panduan mingguan + checklist (Screen 4)
        GrowthChart.jsx           ← grafik BW aktual vs standar (Screen 5)
        FlockSaya.jsx             ← input & history performa flock (Screen 6)
        AIAdvisory.jsx            ← proyeksi AI (Screen 7)
      hooks/
        useFarmGuideData.js       ← hook generik untuk fetch JSON
        useFlockContext.js        ← context: breed, sex, week yang dipilih user
      utils/
        farmguide.utils.js        ← getBWStandard(), getStatusLabel(), dll.
      components/
        ModuleCard.jsx            ← card per modul di Home
        BWTable.jsx               ← tabel BW aktual vs standar + selisih
        ChecklistItem.jsx         ← item checklist interaktif (dengan localStorage)
  i18n/
    translations.js               ← [SUDAH ADA] tambahkan key FarmGuide di sini
```

### 2.5 Sistem Terjemahan

FarmWell punya dua lapis terjemahan:

1. **Global** (`src/i18n/translations.js`) — label UI umum (tombol, navigasi, error states)
2. **Module-level** (`src/modules/farmguide/translations.js`) — string spesifik FarmGuide

**Cara penggunaan (konsisten dengan modul lain):**
```jsx
const { t, language } = useLanguage(); // dari context yang sudah ada
// Gunakan: t('farmguide.moduleSelector') untuk UI labels
// Untuk data dari JSON: nilai numerik tidak perlu diterjemahkan
```

---

## 3. Design System — WAJIB MATCH FarmWell

> **PERINGATAN:** FarmWell core menggunakan **vanilla CSS**, BUKAN Tailwind. FarmGuide ikuti vanilla CSS yang sama agar match dengan dashboard dan modul lain.

### 3.1 Langkah Pertama Sebelum Styling

**Sebelum menulis CSS apapun**, buka dan baca file berikut untuk ekstrak nilai desain yang sudah ada:
1. `src/index.css` atau file CSS global utama — cari CSS variables (`:root { --color-... }`)
2. Salah satu komponen modul yang sudah ada, misalnya `src/modules/PoultryWell/` — amati class dan pattern yang digunakan
3. Dashboard utama (`src/App.jsx` atau `src/Dashboard.jsx`) — amati card, header, navigasi

**Ekstrak dan gunakan:**
- Warna (`--color-primary`, `--color-secondary`, dll.)
- Border radius
- Shadow
- Spacing scale
- Font family dan font size scale
- Transition/animation yang dipakai

### 3.2 Prinsip Styling FarmGuide

- Gunakan CSS variables yang sama seperti modul lain — jangan hardcode warna baru
- Card style harus identik dengan card di FarmWell Dashboard
- Header/navigation style harus konsisten dengan PoultryWell/PigWell
- Jika modul lain punya komponen `<ModuleHeader />` atau `<BackButton />`, gunakan yang sama — jangan buat ulang
- Responsive: mobile-first, grid layout untuk module cards

### 3.3 Status Badge

Setiap module card punya badge status yang diambil dari `modules.json`:
```jsx
const badge = module.status === 'active'
  ? { label: { en: 'Active', id: 'Aktif', vi: 'Hoạt động' }, color: '--color-success' }
  : { label: { en: 'New', id: 'Baru', vi: 'Mới' }, color: '--color-accent' };
```

---

## 4. Navigasi & Routing

### 4.1 Entry Point

User masuk ke FarmGuide dari **FarmWell Dashboard** via card navigasi. Pastikan:
- Route FarmGuide sudah terdaftar di router utama (cek `src/App.jsx` atau file routing)
- Card FarmGuide di Dashboard sudah ada atau perlu ditambahkan — cek dulu sebelum tambah

### 4.2 Struktur Route FarmGuide

```
/farmguide                              ← FarmGuideHome: module selector
/farmguide/:module/pilih-jenis          ← BreedSelector
/farmguide/:module/pilih-kelamin        ← SexSelector (color_chicken & parent_stock saja)
/farmguide/:module/panduan              ← ManagementGuide: panduan mingguan + checklist
/farmguide/:module/grafik               ← GrowthChart: BW aktual vs standar
/farmguide/:module/flock-saya           ← FlockSaya: input & history
/farmguide/:module/flock-saya/ai        ← AIAdvisory: proyeksi AI
```

`:module` adalah salah satu dari: `broiler`, `layer`, `color_chicken`, `parent_stock`

### 4.3 Flow Navigasi per Modul

```
broiler:        Home → BreedSelector → ManagementGuide / GrowthChart / FlockSaya
layer:          Home → BreedSelector → ManagementGuide / GrowthChart / FlockSaya
color_chicken:  Home → BreedSelector → SexSelector → ManagementGuide / GrowthChart / FlockSaya
parent_stock:   Home → BreedSelector → SexSelector → ManagementGuide / GrowthChart / FlockSaya
```

### 4.4 Flock Context — State Antar Screen

Breed dan sex yang dipilih user di awal flow harus disimpan dan tersedia di semua screen berikutnya.
Gunakan localStorage atau React context — jangan di-pass lewat URL params.

```js
// Simpan di localStorage dengan key dari schema.json:
localStorage.setItem('farmguide_active_flock', JSON.stringify({
  module_id: 'broiler',
  breed_code: 'breed_a',
  sex: null,
  placement_date: '2025-03-01',
  initial_pop: 10000
}));
```

### 4.5 Navigasi Internal

- Setiap halaman punya tombol "Back" ke screen sebelumnya dalam flow
- Gunakan `useNavigate()` dari React Router (sudah digunakan di modul lain)
- JANGAN render `navigate()` di dalam render function — panggil hanya dari event handler atau useEffect

---

## 5. Screen yang Dibangun (Prioritas Urut)

Bangun screen berikut secara berurutan. **Mulai dari Screen 1 dulu — jangan lompat.**

### Screen 1: FarmGuide Home — Module Selector (`/farmguide`)

**Tujuan:** User memilih modul unggas yang ingin diakses

**Data source:**
```js
fetch('/data/farmguide_data/app_config/modules.json')
// Gunakan: data.modules (array)
```

**Elemen wajib:**
- Header: judul "FarmGuide" + subtitle (multilingual)
- Label section: "SEMUA MODUL" (atau terjemahannya)
- Grid 2 kolom (1 kolom di mobile) berisi card per modul
- Setiap card menampilkan:
  - Icon modul
  - Badge status (Aktif / Baru)
  - Nama modul
  - Deskripsi singkat (multilingual — buat string di translations.js)
  - Tag fitur (dari `module.features`, map ke label)
  - CTA: "Buka Modul →"
- Back button ke FarmWell Dashboard (`/`)

**Tag fitur — mapping `module.features` ke label:**
```js
const featureLabels = {
  management_guide: { en: 'Weekly Guide',   id: 'Panduan Mingguan', vi: 'Hướng dẫn' },
  growth_chart:     { en: 'Growth Chart',   id: 'Grafik Tumbuh',   vi: 'Biểu đồ tăng trưởng' },
  flock_saya:       { en: 'My Flock',       id: 'Flock Saya',      vi: 'Đàn của tôi' },
  vaccine_schedule: { en: 'Vaccine',        id: 'Vaksin',          vi: 'Vaccine' },
  ai_advisory:      { en: 'AI Advisory',    id: 'AI Advisory',     vi: 'AI Tư vấn' },
};
// Tambahkan tag 'JANTAN / BETINA' untuk modul color_chicken dan parent_stock
```

**CTA behavior:**
```jsx
// Navigasi ke breed selector sebagai langkah berikutnya
navigate(`/farmguide/${module.module_id}/pilih-jenis`);
```

---

### Screen 2: Breed Selector (`/farmguide/:module/pilih-jenis`)

**Tujuan:** User memilih tipe/breed sebelum masuk ke data

**Penting:** Breed selector hanya tampil SEKALI di awal flow. Setelah dipilih, kode breed
disimpan di context/localStorage — TIDAK PERNAH ditampilkan lagi di dalam screen manapun.

**Pilihan breed per modul** (label UI tanpa nama brand):

| Modul          | Pilihan yang ditampilkan          | Kode yang disimpan |
|----------------|-----------------------------------|--------------------|
| broiler PS     | Tipe A / Tipe B / Tipe C          | breed_a/b/c        |
| layer          | (langsung lanjut, 1 pilihan)      | commercial_layer   |
| color_chicken  | Tipe A / Tipe B                   | variant_a/b        |
| parent_stock   | Tipe A / Tipe B / Tipe C          | breed_a/b/c        |

**Setelah pilih breed:**
- Simpan ke localStorage key `farmguide_active_flock`
- Jika modul memerlukan sex selector (`sex_selector_required: true` di modules.json): navigate ke `/farmguide/:module/pilih-kelamin`
- Jika tidak: navigate ke `/farmguide/:module/panduan`

---

### Screen 3: Sex Selector (`/farmguide/:module/pilih-kelamin`)

**Tujuan:** Pilih jantan atau betina — **hanya untuk `color_chicken` dan `parent_stock`**

**Elemen:**
- Dua pilihan: Jantan (♂) / Betina (♀)
- Setelah pilih: simpan ke localStorage, navigate ke `/farmguide/:module/panduan`

---

### Screen 4: Management Guide (`/farmguide/:module/panduan`)

**Tujuan:** Panduan mingguan — parameter lingkungan, program pakan, perbandingan BW, checklist interaktif

**Data source:**
```js
// Checklist (broiler):
fetch('/data/farmguide_data/management/weekly_checklist.json')

// Environment:
fetch('/data/farmguide_data/management/environment_params.json')

// Feed program:
fetch('/data/farmguide_data/management/feed_program.json')

// BW standar — sesuai modul yang aktif:
fetch('/data/farmguide_data/breeds/layer_standards.json')      // untuk layer
fetch('/data/farmguide_data/breeds/ps_standards.json')         // untuk PS
fetch('/data/farmguide_data/breeds/color_chicken_standards.json') // untuk color chicken
```

**Elemen wajib:**
- Week selector (minggu 1–8 untuk broiler, sesuaikan per modul)
- Tab: Parameter Lingkungan | Program Pakan | Bobot Badan | Checklist
- Tab **Parameter Lingkungan**: suhu target, RH, cahaya dari `environment_params.json`
- Tab **Program Pakan**: fase pakan aktif untuk minggu tersebut dari `feed_program.json`
- Tab **Bobot Badan**: tabel BW standar untuk minggu tersebut (dari breeds JSON)
- Tab **Checklist**: daftar item dari `weekly_checklist.json` dengan checkbox interaktif
  - State checklist disimpan di localStorage: key `farmguide_checklist_{flock_id}_week{n}`
  - Checkbox persist antar session

---

### Screen 5: Growth Chart (`/farmguide/:module/grafik`)

**Tujuan:** Visualisasi BW aktual vs standar dalam bentuk grafik garis

**Elemen wajib:**
- Dual-line SVG chart: garis standar (putus-putus) vs garis aktual (solid)
- Status banner: "On Track ✓" atau "Di Bawah Target ⚠" — threshold: aktual < 95% standar = below target
- Tabel di bawah grafik: kolom Minggu | BW Standar | BW Aktual | Selisih (g) | Selisih (%)
- Tab kedua: Feed Reference (data konsumsi pakan standar)
- Input BW aktual per minggu — disimpan ke localStorage Flock Saya

---

### Screen 6: Flock Saya (`/farmguide/:module/flock-saya`)

**Tujuan:** Input data performa flock mingguan dan lihat history 5 minggu

**Data model:** Ikuti `flock_saya/schema.json` secara penuh — baca file ini sebelum implementasi.

**Elemen wajib:**
- Form input per minggu: BW aktual, mortalitas, konsumsi pakan
- Untuk layer: tambah field EP% dan Egg Weight (g)
- Tabel history 5 minggu: BW Aktual | BW Standar | Selisih | Status
- Tombol ke AI Advisory jika sudah ada ≥ 2 data points
- Semua data disimpan di localStorage (key pattern dari schema.json)

---

### Screen 7: AI Advisory (`/farmguide/:module/flock-saya/ai`)

**Tujuan:** Proyeksi performa dan rekomendasi berbasis AI dari history Flock Saya

**Implementasi:** Gunakan Anthropic API (`/v1/messages`) dengan prompt template dari
`flock_saya/schema.json` → `ai_advisory.api_prompt_template`.

**Elemen wajib:**
- Tampilkan ringkasan tren dari history (tabel mini)
- Proyeksi BW panen dan estimasi hari panen
- 2–3 rekomendasi spesifik dalam bahasa Indonesia
- Loading state saat API call berlangsung
- Error state jika API gagal

---

## 6. Data — Sudah Tersedia, Tidak Perlu Dummy

Semua data sudah real dan lengkap di `public/data/farmguide_data/`.
**Jangan buat file JSON baru atau data dummy** — gunakan yang sudah ada.

Sebelum implementasi screen apapun yang membutuhkan data, baca dulu:
1. `public/data/farmguide_data/README.md` — konvensi dan cara pakai
2. JSON file yang relevan untuk screen tersebut

---

## 7. i18n — Tambahan Key untuk FarmGuide

Tambahkan key berikut ke `src/i18n/translations.js` (sesuaikan dengan struktur yang sudah ada di file tersebut):

```javascript
// FarmGuide UI strings
'farmguide.title':        { en: 'FarmGuide', id: 'FarmGuide', vi: 'FarmGuide' },
'farmguide.subtitle': {
  en: 'Production monitor and management reference for poultry farming',
  id: 'Monitor produksi dan panduan manajemen peternakan unggas',
  vi: 'Theo dõi sản xuất và hướng dẫn quản lý chăn nuôi gia cầm'
},
'farmguide.allModules':   { en: 'All Modules', id: 'Semua Modul', vi: 'Tất cả mô-đun' },
'farmguide.openModule':   { en: 'Open Module', id: 'Buka Modul',  vi: 'Mở mô-đun' },
'farmguide.selectBreed':  { en: 'Select Type', id: 'Pilih Tipe',  vi: 'Chọn loại' },
'farmguide.selectSex':    { en: 'Select Sex',  id: 'Pilih Jenis Kelamin', vi: 'Chọn giới tính' },
'farmguide.male':         { en: 'Male ♂',      id: 'Jantan ♂',   vi: 'Đực ♂' },
'farmguide.female':       { en: 'Female ♀',    id: 'Betina ♀',   vi: 'Cái ♀' },
'farmguide.weeklyGuide':  { en: 'Weekly Guide',id: 'Panduan Mingguan', vi: 'Hướng dẫn tuần' },
'farmguide.growthChart':  { en: 'Growth Chart',id: 'Grafik Tumbuh', vi: 'Biểu đồ tăng trưởng' },
'farmguide.flockSaya':    { en: 'My Flock',    id: 'Flock Saya', vi: 'Đàn của tôi' },
'farmguide.aiAdvisory':   { en: 'AI Advisory', id: 'AI Advisory',vi: 'AI Tư vấn' },
'farmguide.onTrack':      { en: 'On Track ✓',  id: 'On Track ✓', vi: 'Đúng tiến độ ✓' },
'farmguide.belowTarget':  { en: 'Below Target ⚠', id: 'Di Bawah Target ⚠', vi: 'Dưới mục tiêu ⚠' },
'farmguide.aboveTarget':  { en: 'Above Target', id: 'Di Atas Target', vi: 'Trên mục tiêu' },
'farmguide.standardBW':   { en: 'Standard BW', id: 'BW Standar', vi: 'KL chuẩn' },
'farmguide.actualBW':     { en: 'Actual BW',   id: 'BW Aktual',  vi: 'KL thực tế' },
'farmguide.difference':   { en: 'Difference',  id: 'Selisih',    vi: 'Chênh lệch' },
'farmguide.week':         { en: 'Week',        id: 'Minggu',     vi: 'Tuần' },
'farmguide.backToDashboard': { en: 'Back to FarmWell', id: 'Kembali ke FarmWell', vi: 'Về FarmWell' },
'farmguide.backToModules':   { en: 'Back to Modules',  id: 'Kembali ke Modul',   vi: 'Về danh sách' },
'farmguide.noData':       { en: 'No data yet. Enter your flock data to start.', id: 'Belum ada data. Masukkan data flock untuk memulai.', vi: 'Chưa có dữ liệu. Nhập dữ liệu đàn để bắt đầu.' },
'farmguide.aiLoading':    { en: 'Analyzing flock data...', id: 'Menganalisis data flock...', vi: 'Đang phân tích dữ liệu...' },
'farmguide.aiError':      { en: 'Analysis failed. Please try again.', id: 'Analisis gagal. Coba lagi.', vi: 'Phân tích thất bại. Vui lòng thử lại.' },
'farmguide.checklist':    { en: 'Checklist',   id: 'Checklist',  vi: 'Danh sách kiểm tra' },
'farmguide.environment':  { en: 'Environment', id: 'Lingkungan', vi: 'Môi trường' },
'farmguide.feedProgram':  { en: 'Feed Program',id: 'Program Pakan', vi: 'Chương trình thức ăn' },
'farmguide.bodyWeight':   { en: 'Body Weight', id: 'Bobot Badan', vi: 'Khối lượng' },
```

---

## 8. Checklist Sebelum Selesai

Sebelum lapor selesai, verifikasi setiap item:

- [ ] Route `/farmguide` dan semua sub-route terdaftar di router utama
- [ ] Card FarmGuide ada di FarmWell Dashboard (tambah jika belum ada)
- [ ] Screen 1 (Home/Module Selector) bisa diakses dan menampilkan 4 modul dari JSON
- [ ] Screen 2 (Breed Selector) muncul setelah klik modul, pilihan sesuai modul
- [ ] Screen 3 (Sex Selector) hanya muncul untuk `color_chicken` dan `parent_stock`
- [ ] Screen 4 (Management Guide) menampilkan data dari JSON — bukan hardcoded
- [ ] Screen 5 (Growth Chart) menampilkan grafik SVG dual-line dan tabel BW
- [ ] Screen 6 (Flock Saya) menyimpan data ke localStorage dan menampilkan history 5 minggu
- [ ] Screen 7 (AI Advisory) melakukan API call ke Anthropic dan menampilkan hasil
- [ ] Checklist di Screen 4 persist di localStorage antar session
- [ ] Breed code tidak pernah muncul di UI (hanya "Tipe A", "Tipe B", dll.)
- [ ] Nama brand/perusahaan tidak muncul di UI manapun
- [ ] CSS variables diambil dari file CSS yang sudah ada — tidak ada warna hardcoded baru
- [ ] Bahasa bisa di-switch (EN/ID/VI) dan semua UI label ikut berubah
- [ ] Back button di semua screen berfungsi dan mengarah ke screen yang benar
- [ ] Tidak ada console error di browser
- [ ] Tampilan mobile tidak broken (test di 375px width)

---

## 9. Yang JANGAN Dilakukan

- ❌ JANGAN gunakan Tailwind CSS — FarmWell core pakai vanilla CSS
- ❌ JANGAN hardcode warna — selalu pakai CSS variables yang sudah ada
- ❌ JANGAN buat komponen navigasi/header baru jika sudah ada yang reusable di modul lain
- ❌ JANGAN buat data JSON baru atau dummy — data sudah lengkap di `public/data/farmguide_data/`
- ❌ JANGAN ubah file di luar `src/modules/farmguide/` dan penambahan key di `src/i18n/translations.js`
- ❌ JANGAN ubah routing yang sudah ada — hanya tambahkan route baru
- ❌ JANGAN gunakan kode bahasa selain `en`, `id`, `vi`
- ❌ JANGAN render `navigate()` atau `useNavigate()` langsung di render — hanya dalam event handler
- ❌ JANGAN tampilkan nama breed, nama perusahaan, atau nama dagang apapun di UI
- ❌ JANGAN fetch data yang belum dibutuhkan — load lazy sesuai screen yang aktif

---

## 10. Referensi File yang Harus Dibaca Windsurf Sebelum Mulai

Baca file-file ini **sebelum menulis satu baris kode pun**:

1. `public/data/farmguide_data/README.md` — konvensi data, cara fetch, V6 decisions
2. `public/data/farmguide_data/app_config/modules.json` — struktur modul dan screen
3. `public/data/farmguide_data/flock_saya/schema.json` — data model Flock Saya
4. `src/App.jsx` — routing dan struktur global FarmWell
5. `src/index.css` (atau CSS global utama) — CSS variables dan design tokens
6. Satu komponen dari `src/modules/PoultryWell/` — pattern komponen yang sudah ada
7. `src/i18n/translations.js` — struktur key terjemahan yang sudah ada
8. FarmWell Dashboard component — card style dan navigasi

---

*Dokumen ini dibuat oleh Claude untuk sesi build FarmGuide di FarmWell. Versi revisi — diselaraskan dengan data JSON yang sudah tersedia dan spesifikasi screen V6.*
