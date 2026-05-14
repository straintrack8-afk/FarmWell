# FarmGuide Data Package
## For Claude in FarmWell Project

---

## Struktur File

```
public/data/poultry/farmguide/
├── README.md                          ← File ini
├── breeds/
│   ├── ps_standards.json              ← Parent Stock BW: Female/Male, 3 breed, Week 0–64
│   ├── layer_standards.json           ← Layer rearing BW + EP% + egg weight Week 19–100
│   └── color_chicken_standards.json   ← Color Chicken Male/Female, 2 variant, Day 1–126
├── management/
│   ├── environment_params.json        ← Suhu, RH, ventilasi, cahaya per minggu (broiler)
│   ├── feed_program.json              ← Feed phases, konsumsi referensi, water:feed ratio
│   └── weekly_checklist.json          ← Checklist mingguan broiler Week 1–8 (Bahasa Indonesia)
├── app_config/
│   └── modules.json                   ← Module definitions, screens, navigation flow, product matrix
└── flock_saya/
    └── schema.json                    ← Data model, entry fields, history, AI advisory logic
```

---

## Konvensi Penamaan Breed

Sesuai **Locked V6 Decision #1 & #2**: tidak ada nama breed atau brand di UI.
JSON menyimpan breed sebagai enum internal:

| Kode Internal  | Keterangan                     | Digunakan Di  |
|----------------|--------------------------------|---------------|
| `breed_a`      | Breed broiler PS tipe A        | ps_standards  |
| `breed_b`      | Breed broiler PS tipe B        | ps_standards  |
| `breed_c`      | Breed broiler PS tipe C        | ps_standards  |
| `variant_a`    | Color Chicken Tipe A           | color_chicken |
| `variant_b`    | Color Chicken Tipe B           | color_chicken |
| `commercial_layer` | Layer komersial            | layer_standards |

**Penting:** Mapping `breed_code → label tampil di UI` harus dikontrol di `app_config/modules.json` saja, bukan di JSON data.

---

## Data Granularity

| Modul         | Granularitas BW | Periode           |
|---------------|-----------------|-------------------|
| Broiler PS    | Weekly          | Week 0–64         |
| Layer         | Weekly rearing  | Week 1–19 rearing, Week 19–100 production |
| Color Chicken | **Daily**       | Day 1–126         |

---

## Cara Pakai di React

### Load JSON statis:
```javascript
// public/data/poultry/farmguide/breeds/ps_standards.json
const res = await fetch('/data/poultry/farmguide/breeds/ps_standards.json');
const psData = await res.json();

// Ambil BW female breed_a di week 10
const week10 = psData.female_bw_in_season.breed_a.find(row => row[1] === 10);
// week10 = [70, 10, 1105, 100, 53, 149]
// Kolom: [age_days, age_weeks, bw_g, weekly_gain_g, feed_g, energy_kcal]
```

### Color Chicken daily lookup:
```javascript
const ccData = await fetch('/data/poultry/farmguide/breeds/color_chicken_standards.json').then(r => r.json());
const day35Male = ccData.male.variant_a.daily_data.find(row => row[0] === 35);
// [35, 57, 1142, 1.857, 3.00, 615, 22.0]
// Kolom: [day, fc_g_bird_day, cum_feed_g, fcr, cum_dep_pct, bw_g, adg_g]
```

### Checklist (dengan localStorage):
```javascript
const checklist = await fetch('/data/poultry/farmguide/management/weekly_checklist.json').then(r => r.json());
const week1Items = checklist.checklists.week_1.items;
// localStorage key: farmguide_checklist_{flock_id}_week1
```

---

## Locked V6 Decisions (Referensi)

1. **Zero breed reference di screens** — breed dipilih sekali saat flow start
2. **No brand attribution** — tidak ada nama dagang, perusahaan, atau breed manufacturer di UI
3. **Flock Saya** — 5 minggu history + AI projection via Anthropic API
4. **Color Chicken** — raising period s/d 126 hari; ♂/♀ selector wajib
5. **Daily BW broiler** — data harian tersedia (Day 1–56+)
6. **Layer Flock Saya** — tambah field EP% dan Egg Weight

---

## Notes untuk Claude (FarmWell)

- Semua data dalam satuan **metric** (gram, °C, kcal)
- BW PS diukur **4–6 jam setelah pemberian pakan**
- Layer BW rearing: **ad libitum selalu**, jangan dibatasi
- Color Chicken: `variant_a` = tipe lebih besar/berat, `variant_b` = tipe medium
- `weekly_checklist.json` sudah dalam **Bahasa Indonesia** — siap render langsung
- `ai_advisory.api_prompt_template` adalah template untuk Anthropic API call dari screen AI Advisory
