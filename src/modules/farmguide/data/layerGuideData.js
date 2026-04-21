// layerGuideData.js
// Layer Management Guide W1–W80 (Cage Housing)
// W1–W18: Rearing phase (full detail)
// W19–W45: Production early/peak (full detail)
// W46–W80: Production late (condensed, grouped)
// All text fields: { en, id, vi } multilingual objects

export const LAYER_GUIDE = [
  // ─── REARING PHASE W1–W18 ──────────────────────────────────────────────────
  {
    week: 1, phase: 'Rearing', title: 'DOC Placement & Early Brooding', titleKey: 'layW1Title', emoji: '🐣',
    tags: {
      en: ['DOC Arrival', 'Temp 35°C', 'Light: 24 hrs', 'Ad lib feed'],
      id: ['Kedatangan DOC', 'Suhu 35°C', 'Cahaya: 24 jam', 'Pakan ad lib'],
      vi: ['Gà con về', 'Nhiệt độ 35°C', 'Sáng: 24 giờ', 'Thức ăn tự do'],
    },
    alert: {
      title: { en: 'Critical: First 48 Hours', id: 'Kritis: 48 Jam Pertama', vi: 'Quan trọng: 48 giờ đầu' },
      text: {
        en: 'Day 1–2: 24 hrs light at 20–40 lux. Day 3–6: switch to 18 hrs light. Pre-heat house to 35°C at bird level BEFORE chicks arrive. Use intermittent lighting (4h light / 2h dark) as alternative for D1–D7 to synchronize chick activity.',
        id: 'H1–2: 24 jam cahaya 20–40 lux. H3–6: beralih ke 18 jam cahaya. Panaskan kandang ke 35°C di level unggas SEBELUM DOC tiba. Gunakan pencahayaan intermiten (4j terang / 2j gelap) sebagai alternatif H1–H7.',
        vi: 'N1–2: 24 giờ sáng 20–40 lux. N3–6: chuyển sang 18 giờ sáng. Làm nóng chuồng đến 35°C ở mức chim TRƯỚC khi gà về. Dùng chiếu sáng gián đoạn (4 giờ sáng / 2 giờ tối) cho N1–N7.',
      },
    },
    environment: {
      temp: { en: '35°C (bird level)', id: '35°C (level unggas)', vi: '35°C (mức chim)' },
      rh: '60–70%',
      light: { en: '24 hrs (D1–2) → 18 hrs (D3–6)', id: '24 jam (H1–2) → 18 jam (H3–6)', vi: '24 giờ (N1–2) → 18 giờ (N3–6)' },
      light_lux: '20–40 lux',
      nh3: '< 10 ppm', co2: '< 2,500 ppm',
      ventilation: 'Minimum', ventKey: 'ventMinActive',
    },
    specs: [
      { icon: '🌡️', label: 'House temp at bird level', labelKey: 'specHouseTemp', value: '35°C' },
      { icon: '💡', label: 'Light intensity', labelKey: 'specLightIntensity', value: '20–40 lux' },
      { icon: '💧', label: 'Nipple flow rate', labelKey: 'specNippleFlow', value: '15–25 ml/min' },
      { icon: '💨', label: 'Air speed', labelKey: 'specAirspeed', value: '0.1–0.2 m/s' },
      { icon: '📊', label: 'Target CV% uniformity', labelKey: 'specCVTarget', value: '< 10%' },
      { icon: '🏠', label: 'Cage stocking density', labelKey: 'specDensity', value: '< 450 cm²/bird' },
    ],
    feed: { phase: 'Starter', form: 'Crumble', size: '1–2 mm', duration: 'W1–W8', intake: 'Ad libitum', water: 'Ad lib — 15–25 ml/min' },
    checklist: [
      { id: 'lay_w1_01', text: { en: 'Pre-heat house to 35°C at bird level min. 24 hrs before DOC arrival', id: 'Panaskan kandang ke 35°C level unggas min. 24 jam sebelum DOC tiba', vi: 'Làm nóng chuồng đến 35°C ít nhất 24 giờ trước khi gà về' }, priority: 'critical' },
      { id: 'lay_w1_02', text: { en: 'Set lighting: 24 hrs at 20–40 lux for D1–2', id: 'Atur pencahayaan: 24 jam 20–40 lux untuk H1–2', vi: 'Cài đặt chiếu sáng: 24 giờ 20–40 lux cho N1–2' }, priority: 'critical' },
      { id: 'lay_w1_03', text: { en: 'Ensure feed and water ready BEFORE chicks arrive', id: 'Pastikan pakan dan air siap SEBELUM DOC tiba', vi: 'Đảm bảo thức ăn và nước sẵn sàng TRƯỚC khi gà về' }, priority: 'critical' },
      { id: 'lay_w1_04', text: { en: 'Check crop fill 75–80% within 2–4 hrs of placement', id: 'Periksa pengisian tembolok 75–80% dalam 2–4 jam', vi: 'Kiểm tra độ đầy diều 75–80% trong 2–4 giờ' }, priority: 'critical' },
      { id: 'lay_w1_05', text: { en: 'Observe chick distribution — spread evenly = correct temperature', id: 'Amati distribusi DOC — merata = suhu benar', vi: 'Quan sát phân bố gà — đều = nhiệt độ đúng' }, priority: 'high' },
      { id: 'lay_w1_06', text: { en: 'Switch to 18 hrs light from D3–6, reduce intensity to 20–30 lux', id: 'Beralih ke 18 jam cahaya mulai H3–6, kurangi intensitas ke 20–30 lux', vi: 'Chuyển sang 18 giờ sáng từ N3–6, giảm cường độ xuống 20–30 lux' }, priority: 'high' },
      { id: 'lay_w1_07', text: { en: 'Record DOA, weak chicks, and initial flock quality', id: 'Catat DOA, DOC lemah, dan kualitas awal flock', vi: 'Ghi nhận DOA, gà con yếu và chất lượng đàn ban đầu' }, priority: 'high' },
      { id: 'lay_w1_08', text: { en: 'Weigh 1–2% sample for initial BW', id: 'Timbang sampel 1–2% untuk BB awal', vi: 'Cân 1–2% mẫu để lấy KL ban đầu' }, priority: 'high' },
    ],
    key_points: [
      { icon: '🌡️', text: { en: 'Use chick behaviour as thermometer: spread evenly = correct temp. Huddling = too cold. Panting at edges = too hot.', id: 'Gunakan perilaku anak ayam sebagai termometer: menyebar = suhu benar. Berkerumun = terlalu dingin. Terengah di pinggir = terlalu panas.', vi: 'Dùng hành vi gà con làm nhiệt kế: phân bố đều = nhiệt độ đúng. Tụ lại = quá lạnh. Thở gấp ở rìa = quá nóng.' } },
      { icon: '💡', text: { en: 'Intermittent lighting (4h on/2h off) for D1–D7 synchronizes flock activity and reduces mortality.', id: 'Pencahayaan intermiten (4j nyala/2j mati) H1–H7 menyinkronkan aktivitas flock dan mengurangi mortalitas.', vi: 'Chiếu sáng gián đoạn (4 giờ sáng/2 giờ tối) N1–N7 đồng bộ hoạt động đàn và giảm tỷ lệ chết.' } },
      { icon: '⚡', text: { en: 'NEVER increase light hours during rearing (W1–W16). Step-down programme is critical for controlling onset of lay.', id: 'JANGAN PERNAH tambah jam cahaya saat pembesaran (W1–W16). Program step-down sangat penting untuk mengontrol awal bertelur.', vi: 'KHÔNG BAO GIỜ tăng giờ sáng trong giai đoạn hậu bị (W1–W16). Chương trình giảm dần rất quan trọng.' } },
    ],
  },
  {
    week: 2, phase: 'Rearing', title: 'Early Rearing — Step Down Lighting Begins', titleKey: 'layW2Title', emoji: '🐥',
    tags: {
      en: ['Temp 28°C', 'Light: 16 hrs', 'BW Check W2'],
      id: ['Suhu 28°C', 'Cahaya: 16 jam', 'Cek BB M2'],
      vi: ['Nhiệt độ 28°C', 'Sáng: 16 giờ', 'Kiểm tra KL T2'],
    },
    alert: null,
    environment: {
      temp: '28°C', rh: '60–70%',
      light: { en: '16 hrs/day', id: '16 jam/hari', vi: '16 giờ/ngày' },
      light_lux: '10–20 lux', nh3: '< 10 ppm', co2: '< 2,500 ppm',
      ventilation: 'Gradually increase', ventKey: 'ventGradual',
    },
    specs: [
      { icon: '🌡️', label: 'House temperature', labelKey: 'specHouseTemp', value: '28°C' },
      { icon: '💡', label: 'Light intensity', labelKey: 'specLightIntensity', value: '10–20 lux' },
      { icon: '📊', label: 'Target BW W2', labelKey: 'specBWTarget', value: '130g (126–134g)' },
      { icon: '📊', label: 'Target CV% uniformity', labelKey: 'specCVTarget', value: '< 10%' },
      { icon: '💨', label: 'Air speed', labelKey: 'specAirspeed', value: '0.2–0.4 m/s' },
      { icon: '💧', label: 'Nipple flow rate', labelKey: 'specNippleFlow', value: '20–30 ml/min' },
    ],
    feed: { phase: 'Starter', form: 'Crumble', size: '1–2 mm', duration: 'W1–W8', intake: 'Ad libitum', water: 'Ad lib' },
    checklist: [
      { id: 'lay_w2_01', text: { en: 'Weekly BW weighing — min. 1% flock or 100 birds', id: 'Penimbangan BB mingguan — min 1% flock atau 100 ekor', vi: 'Cân KL hàng tuần — tối thiểu 1% đàn hoặc 100 con' }, priority: 'critical' },
      { id: 'lay_w2_02', text: { en: 'Calculate CV% — alert if > 10%', id: 'Hitung CV% — waspada jika > 10%', vi: 'Tính CV% — cảnh báo nếu > 10%' }, priority: 'critical' },
      { id: 'lay_w2_03', text: { en: 'Reduce temperature gradually — target 28°C by W2', id: 'Kurangi suhu bertahap — target 28°C di M2', vi: 'Giảm nhiệt độ dần — mục tiêu 28°C ở T2' }, priority: 'high' },
      { id: 'lay_w2_04', text: { en: 'Step down lighting: 16 hrs at 10–20 lux', id: 'Step down pencahayaan: 16 jam 10–20 lux', vi: 'Giảm dần chiếu sáng: 16 giờ 10–20 lux' }, priority: 'critical' },
      { id: 'lay_w2_05', text: { en: 'Monitor water:feed ratio — target 2:1', id: 'Pantau rasio air:pakan — target 2:1', vi: 'Theo dõi tỷ lệ nước:thức ăn — mục tiêu 2:1' }, priority: 'high' },
    ],
    key_points: [
      { icon: '📉', text: { en: 'Step-down lighting is mandatory: W1=24h → W2=16h → W3=14h → W4=12h → W5=11h → W6=10h → W7-16=9h. NEVER increase hours during rearing.', id: 'Pencahayaan step-down wajib: M1=24j → M2=16j → M3=14j → M4=12j → M5=11j → M6=10j → M7-16=9j. JANGAN PERNAH tambah jam saat pembesaran.', vi: 'Chiếu sáng giảm dần bắt buộc: T1=24g → T2=16g → T3=14g → T4=12g → T5=11g → T6=10g → T7-16=9g.' } },
    ],
  },
  {
    week: 3, phase: 'Rearing', title: 'Rearing — Uniform Growth Focus', titleKey: 'layW3Title', emoji: '🐓',
    tags: {
      en: ['Temp 26°C', 'Light: 14 hrs', 'BW W3: 195g'],
      id: ['Suhu 26°C', 'Cahaya: 14 jam', 'BB M3: 195g'],
      vi: ['Nhiệt độ 26°C', 'Sáng: 14 giờ', 'KL T3: 195g'],
    },
    alert: null,
    environment: {
      temp: '26°C', rh: '60–70%',
      light: { en: '14 hrs/day', id: '14 jam/hari', vi: '14 giờ/ngày' },
      light_lux: '10–20 lux', nh3: '< 10 ppm', co2: '< 2,500 ppm',
      ventilation: 'Gradually increase', ventKey: 'ventGradual',
    },
    specs: [
      { icon: '🌡️', label: 'House temperature', labelKey: 'specHouseTemp', value: '26°C' },
      { icon: '💡', label: 'Light hours', labelKey: 'specLightIntensity', value: '14 hrs / 10–20 lux' },
      { icon: '📊', label: 'Target BW W3', labelKey: 'specBWTarget', value: '195g (189–201g)' },
      { icon: '📊', label: 'Target CV%', labelKey: 'specCVTarget', value: '< 10%' },
      { icon: '💨', label: 'Air speed', labelKey: 'specAirspeed', value: '0.3–0.5 m/s' },
      { icon: '💧', label: 'Nipple flow rate', labelKey: 'specNippleFlow', value: '25–35 ml/min' },
    ],
    feed: { phase: 'Starter', form: 'Crumble', size: '1–2 mm', duration: 'W1–W8', intake: 'Ad libitum', water: 'Ad lib' },
    checklist: [
      { id: 'lay_w3_01', text: { en: 'Weekly BW weighing — compare vs 195g target', id: 'Penimbangan BB mingguan — bandingkan vs target 195g', vi: 'Cân KL hàng tuần — so sánh với mục tiêu 195g' }, priority: 'critical' },
      { id: 'lay_w3_02', text: { en: 'Calculate CV% for uniformity', id: 'Hitung CV% untuk keseragaman', vi: 'Tính CV% để đánh giá độ đồng đều' }, priority: 'critical' },
      { id: 'lay_w3_03', text: { en: 'Check feeder and drinker height — adjust to bird size', id: 'Periksa tinggi tempat pakan dan minum — sesuaikan dengan ukuran', vi: 'Kiểm tra cao máng ăn và uống — điều chỉnh theo kích thước gà' }, priority: 'high' },
      { id: 'lay_w3_04', text: { en: 'Set lighting: 14 hrs at 10–20 lux', id: 'Atur pencahayaan: 14 jam 10–20 lux', vi: 'Cài đặt chiếu sáng: 14 giờ 10–20 lux' }, priority: 'critical' },
    ],
    key_points: [
      { icon: '⚖️', text: { en: 'BW at W3 ±5% of 195g target = good start. Below: check feed quality, feeder space, and flock uniformity.', id: 'BB di M3 ±5% dari target 195g = awal yang baik. Di bawah: periksa kualitas pakan, ruang tempat pakan, dan keseragaman flock.', vi: 'KL ở T3 ±5% mục tiêu 195g = khởi đầu tốt. Dưới mức: kiểm tra chất lượng thức ăn, không gian máng ăn và độ đồng đều.' } },
    ],
  },
  {
    week: 4, phase: 'Rearing', title: 'Rearing — Skeletal Development', titleKey: 'layW4Title', emoji: '🦴',
    tags: {
      en: ['Temp 22°C', 'Light: 12 hrs', 'BW W4: 273g'],
      id: ['Suhu 22°C', 'Cahaya: 12 jam', 'BB M4: 273g'],
      vi: ['Nhiệt độ 22°C', 'Sáng: 12 giờ', 'KL T4: 273g'],
    },
    alert: null,
    environment: {
      temp: '22°C', rh: '60–70%',
      light: { en: '12 hrs/day', id: '12 jam/hari', vi: '12 giờ/ngày' },
      light_lux: '4–6 lux', nh3: '< 10 ppm', co2: '< 2,500 ppm',
      ventilation: 'Transitional', ventKey: 'ventTransitional',
    },
    specs: [
      { icon: '🌡️', label: 'House temperature', labelKey: 'specHouseTemp', value: '22°C' },
      { icon: '💡', label: 'Light hours', labelKey: 'specLightIntensity', value: '12 hrs / 4–6 lux' },
      { icon: '📊', label: 'Target BW W4', labelKey: 'specBWTarget', value: '273g (265–281g)' },
      { icon: '💨', label: 'Air speed', labelKey: 'specAirspeed', value: '0.4–0.6 m/s' },
      { icon: '📊', label: 'Target CV%', labelKey: 'specCVTarget', value: '< 8%' },
      { icon: '💧', label: 'Nipple flow rate', labelKey: 'specNippleFlow', value: '30–40 ml/min' },
    ],
    feed: { phase: 'Starter', form: 'Crumble', size: '1–2 mm', duration: 'W1–W8', intake: 'Ad libitum', water: 'Ad lib' },
    checklist: [
      { id: 'lay_w4_01', text: { en: 'Weekly BW weighing — target 273g', id: 'Penimbangan BB mingguan — target 273g', vi: 'Cân KL hàng tuần — mục tiêu 273g' }, priority: 'critical' },
      { id: 'lay_w4_02', text: { en: 'Reduce light intensity to 4–6 lux from W4', id: 'Kurangi intensitas cahaya ke 4–6 lux mulai M4', vi: 'Giảm cường độ sáng xuống 4–6 lux từ T4' }, priority: 'critical' },
      { id: 'lay_w4_03', text: { en: 'Evaluate ventilation — CO₂ <2,500 ppm, NH₃ <10 ppm', id: 'Evaluasi ventilasi — CO₂ <2.500 ppm, NH₃ <10 ppm', vi: 'Đánh giá thông khí — CO₂ <2.500 ppm, NH₃ <10 ppm' }, priority: 'high' },
    ],
    key_points: [
      { icon: '🦴', text: { en: 'W3–W6 is the critical period for skeletal and muscular development. Feed quality and uniformity are most important here.', id: 'M3–M6 adalah periode kritis untuk perkembangan tulang dan otot. Kualitas pakan dan keseragaman paling penting di sini.', vi: 'T3–T6 là giai đoạn quan trọng cho phát triển xương và cơ bắp. Chất lượng thức ăn và độ đồng đều quan trọng nhất.' } },
      { icon: '💡', text: { en: 'From W4: maintain 4–6 lux. Low intensity reduces stress and prevents pecking problems in cages.', id: 'Dari M4: pertahankan 4–6 lux. Intensitas rendah mengurangi stres dan mencegah masalah patukan di kandang.', vi: 'Từ T4: duy trì 4–6 lux. Cường độ thấp giảm stress và ngăn ngừa vấn đề mổ nhau trong lồng.' } },
    ],
  },
  {
    week: 5, phase: 'Rearing', title: 'Rearing — Step Down Continues', titleKey: 'layW5Title', emoji: '📉',
    tags: {
      en: ['Temp 18–20°C', 'Light: 11 hrs', 'BW W5: 366g'],
      id: ['Suhu 18–20°C', 'Cahaya: 11 jam', 'BB M5: 366g'],
      vi: ['Nhiệt độ 18–20°C', 'Sáng: 11 giờ', 'KL T5: 366g'],
    },
    alert: null,
    environment: {
      temp: '18–20°C', rh: '60–70%',
      light: { en: '11 hrs/day', id: '11 jam/hari', vi: '11 giờ/ngày' },
      light_lux: '4–6 lux', nh3: '< 10 ppm', co2: '< 2,500 ppm',
      ventilation: 'Transitional', ventKey: 'ventTransitional',
    },
    specs: [
      { icon: '🌡️', label: 'House temperature', labelKey: 'specHouseTemp', value: '18–20°C' },
      { icon: '💡', label: 'Light hours', labelKey: 'specLightIntensity', value: '11 hrs / 4–6 lux' },
      { icon: '📊', label: 'Target BW W5', labelKey: 'specBWTarget', value: '366g (355–377g)' },
      { icon: '💨', label: 'Air speed', labelKey: 'specAirspeed', value: '0.5–0.8 m/s' },
      { icon: '📊', label: 'Target CV%', labelKey: 'specCVTarget', value: '< 8%' },
      { icon: '💧', label: 'Nipple flow rate', labelKey: 'specNippleFlow', value: '35–45 ml/min' },
    ],
    feed: { phase: 'Starter', form: 'Crumble', size: '1–2 mm', duration: 'W1–W8', intake: 'Ad libitum', water: 'Ad lib' },
    checklist: [
      { id: 'lay_w5_01', text: { en: 'Weekly BW — target 366g. If below: check feeder space and feed quality', id: 'BB Mingguan — target 366g. Jika di bawah: cek ruang pakan dan kualitas pakan', vi: 'KL hàng tuần — mục tiêu 366g. Dưới mức: kiểm tra không gian máng và chất lượng thức ăn' }, priority: 'critical' },
      { id: 'lay_w5_02', text: { en: 'Set lighting: 11 hrs at 4–6 lux', id: 'Atur pencahayaan: 11 jam 4–6 lux', vi: 'Cài đặt chiếu sáng: 11 giờ 4–6 lux' }, priority: 'critical' },
      { id: 'lay_w5_03', text: { en: 'Monitor flock uniformity weekly — CV% target <8%', id: 'Pantau keseragaman flock mingguan — CV% target <8%', vi: 'Theo dõi độ đồng đều đàn hàng tuần — CV% mục tiêu <8%' }, priority: 'high' },
    ],
    key_points: [
      { icon: '📐', text: { en: 'Target uniformity ≥85% of birds within ±10% mean BW. CV% <8%. Poor uniformity = uneven production onset.', id: 'Target keseragaman ≥85% unggas dalam ±10% BB rata-rata. CV% <8%. Keseragaman buruk = awal produksi tidak merata.', vi: 'Mục tiêu đồng đều ≥85% gà trong ±10% KL trung bình. CV% <8%. Độ đồng đều kém = bắt đầu đẻ không đồng đều.' } },
    ],
  },
  {
    week: 6, phase: 'Rearing', title: 'Rearing — Minimum Light Programme', titleKey: 'layW6Title', emoji: '🌑',
    tags: {
      en: ['Temp 18–20°C', 'Light: 10 hrs', 'BW W6: 469g'],
      id: ['Suhu 18–20°C', 'Cahaya: 10 jam', 'BB M6: 469g'],
      vi: ['Nhiệt độ 18–20°C', 'Sáng: 10 giờ', 'KL T6: 469g'],
    },
    alert: null,
    environment: {
      temp: '18–20°C', rh: '60–70%',
      light: { en: '10 hrs/day', id: '10 jam/hari', vi: '10 giờ/ngày' },
      light_lux: '4–6 lux', nh3: '< 10 ppm', co2: '< 2,500 ppm',
      ventilation: 'Transitional', ventKey: 'ventTransitional',
    },
    specs: [
      { icon: '🌡️', label: 'House temperature', labelKey: 'specHouseTemp', value: '18–20°C' },
      { icon: '💡', label: 'Light hours', labelKey: 'specLightIntensity', value: '10 hrs / 4–6 lux' },
      { icon: '📊', label: 'Target BW W6', labelKey: 'specBWTarget', value: '469g (455–483g)' },
      { icon: '💨', label: 'Air speed', labelKey: 'specAirspeed', value: '0.6–0.9 m/s' },
      { icon: '📊', label: 'Target CV%', labelKey: 'specCVTarget', value: '< 8%' },
      { icon: '💧', label: 'Nipple flow rate', labelKey: 'specNippleFlow', value: '40–50 ml/min' },
    ],
    feed: { phase: 'Starter', form: 'Crumble', size: '1–2 mm', duration: 'W1–W8', intake: 'Ad libitum', water: 'Ad lib' },
    checklist: [
      { id: 'lay_w6_01', text: { en: 'Weekly BW — target 469g', id: 'BB Mingguan — target 469g', vi: 'KL hàng tuần — mục tiêu 469g' }, priority: 'critical' },
      { id: 'lay_w6_02', text: { en: 'Set lighting: 10 hrs at 4–6 lux', id: 'Atur pencahayaan: 10 jam 4–6 lux', vi: 'Cài đặt chiếu sáng: 10 giờ 4–6 lux' }, priority: 'critical' },
      { id: 'lay_w6_03', text: { en: 'Consider grading birds if CV% >10%', id: 'Pertimbangkan grading jika CV% >10%', vi: 'Cân nhắc phân loại gà nếu CV% >10%' }, priority: 'high' },
    ],
    key_points: [
      { icon: '🌑', text: { en: 'From W6, maintain 9 hrs minimum lighting until W16. This minimum light period is critical — prevents early sexual maturity.', id: 'Dari M6, pertahankan minimum 9 jam pencahayaan sampai M16. Periode cahaya minimum ini kritis — mencegah kematangan seksual dini.', vi: 'Từ T6, duy trì tối thiểu 9 giờ chiếu sáng đến T16. Giai đoạn ánh sáng tối thiểu này quan trọng — ngăn trưởng thành sinh dục sớm.' } },
    ],
  },
  {
    week: 7, phase: 'Rearing', title: 'Rearing — Minimum Light (9 hrs)', titleKey: 'layW7Title', emoji: '🔒',
    tags: {
      en: ['Temp 18–20°C', 'Light: 9 hrs', 'BW W7: 573g'],
      id: ['Suhu 18–20°C', 'Cahaya: 9 jam', 'BB M7: 573g'],
      vi: ['Nhiệt độ 18–20°C', 'Sáng: 9 giờ', 'KL T7: 573g'],
    },
    alert: {
      title: { en: 'Minimum Light Locked: 9 hrs until W16', id: 'Cahaya Minimum Terkunci: 9 jam sampai M16', vi: 'Ánh sáng tối thiểu cố định: 9 giờ đến T16' },
      text: {
        en: 'From W7 to W16: LOCK at 9 hrs light / 4–6 lux. DO NOT change. Any increase in light hours before W17 will trigger premature laying — smaller eggs, reduced lifetime performance.',
        id: 'Dari M7 ke M16: KUNCI di 9 jam cahaya / 4–6 lux. JANGAN ubah. Peningkatan jam cahaya sebelum M17 akan memicu bertelur prematur — telur lebih kecil, performa seumur hidup berkurang.',
        vi: 'Từ T7 đến T16: CỐ ĐỊNH 9 giờ sáng / 4–6 lux. KHÔNG thay đổi. Tăng giờ sáng trước T17 sẽ kích thích đẻ sớm — trứng nhỏ hơn, hiệu suất cả đời giảm.',
      },
    },
    environment: {
      temp: '18–20°C', rh: '60–70%',
      light: { en: '9 hrs/day — LOCKED', id: '9 jam/hari — TERKUNCI', vi: '9 giờ/ngày — CỐ ĐỊNH' },
      light_lux: '4–6 lux', nh3: '< 10 ppm', co2: '< 2,500 ppm',
      ventilation: 'Full tunnel start', ventKey: 'ventTunnelFull',
    },
    specs: [
      { icon: '🔒', label: 'Light hours LOCKED', labelKey: 'specLightIntensity', value: '9 hrs / 4–6 lux' },
      { icon: '📊', label: 'Target BW W7', labelKey: 'specBWTarget', value: '573g (556–590g)' },
      { icon: '🌡️', label: 'House temperature', labelKey: 'specHouseTemp', value: '18–20°C' },
      { icon: '💨', label: 'Air speed', labelKey: 'specAirspeed', value: '0.6–1.0 m/s' },
      { icon: '📊', label: 'Target CV%', labelKey: 'specCVTarget', value: '< 8%' },
      { icon: '💧', label: 'Nipple flow rate', labelKey: 'specNippleFlow', value: '45–55 ml/min' },
    ],
    feed: { phase: 'Starter', form: 'Crumble/Pellet', size: '2–3 mm', duration: 'W1–W8', intake: 'Ad libitum', water: 'Ad lib' },
    checklist: [
      { id: 'lay_w7_01', text: { en: 'Weekly BW — target 573g', id: 'BB Mingguan — target 573g', vi: 'KL hàng tuần — mục tiêu 573g' }, priority: 'critical' },
      { id: 'lay_w7_02', text: { en: 'CONFIRM: Light hours = 9 hrs exactly', id: 'KONFIRMASI: Jam cahaya = 9 jam tepat', vi: 'XÁC NHẬN: Giờ sáng = 9 giờ chính xác' }, priority: 'critical' },
      { id: 'lay_w7_03', text: { en: 'Monitor uniformity — CV% weekly', id: 'Pantau keseragaman — CV% mingguan', vi: 'Theo dõi độ đồng đều — CV% hàng tuần' }, priority: 'high' },
    ],
    key_points: [
      { icon: '⚠️', text: { en: 'Premature stimulation with extra light is the #1 management error in layer production. Stick to 9 hrs until W17.', id: 'Stimulasi prematur dengan cahaya ekstra adalah kesalahan manajemen #1 dalam produksi layer. Pertahankan 9 jam sampai M17.', vi: 'Kích thích sớm bằng ánh sáng thêm là lỗi quản lý #1 trong sản xuất layer. Giữ 9 giờ đến T17.' } },
    ],
  },
  {
    week: 8, phase: 'Rearing', title: 'Rearing — Starter → Developer Transition', titleKey: 'layW8Title', emoji: '🔄',
    tags: {
      en: ['Light: 9 hrs', 'Feed: Developer', 'BW W8: 677g'],
      id: ['Cahaya: 9 jam', 'Pakan: Developer', 'BB M8: 677g'],
      vi: ['Sáng: 9 giờ', 'Thức ăn: Developer', 'KL T8: 677g'],
    },
    alert: {
      title: { en: 'Starter → Developer Feed Transition (W8–W9)', id: 'Transisi Starter → Developer (M8–M9)', vi: 'Chuyển đổi Starter → Developer (T8–T9)' },
      text: {
        en: 'Switch from Starter to Developer feed when BW reaches ~677–750g (W8–W9). The correct switch time is based on BW, not age. Mix 50:50 for 3–5 days. Developer feed has lower protein (15–16%) to control BW gain rate.',
        id: 'Ganti dari Starter ke Developer saat BB mencapai ~677–750g (M8–M9). Waktu ganti yang benar berdasarkan BB, bukan umur. Campur 50:50 selama 3–5 hari. Pakan Developer memiliki protein lebih rendah (15–16%) untuk mengontrol laju pertambahan BB.',
        vi: 'Chuyển từ Starter sang Developer khi KL đạt ~677–750g (T8–T9). Thời điểm chuyển đổi đúng dựa trên KL, không phải tuổi. Trộn 50:50 trong 3–5 ngày. Thức ăn Developer có protein thấp hơn (15–16%).',
      },
    },
    environment: {
      temp: '18–20°C', rh: '60–70%',
      light: { en: '9 hrs/day', id: '9 jam/hari', vi: '9 giờ/ngày' },
      light_lux: '4–6 lux', nh3: '< 10 ppm', co2: '< 2,500 ppm',
      ventilation: 'Full tunnel', ventKey: 'ventTunnelFull',
    },
    specs: [
      { icon: '📊', label: 'Target BW W8', labelKey: 'specBWTarget', value: '677g (657–697g)' },
      { icon: '🌾', label: 'Feed switch threshold', labelKey: 'specFeedSwitch', value: '≥ 677g BW' },
      { icon: '💡', label: 'Light hours', labelKey: 'specLightIntensity', value: '9 hrs / 4–6 lux' },
      { icon: '🌡️', label: 'House temperature', labelKey: 'specHouseTemp', value: '18–20°C' },
      { icon: '💨', label: 'Air speed', labelKey: 'specAirspeed', value: '0.8–1.2 m/s' },
      { icon: '📊', label: 'Target CV%', labelKey: 'specCVTarget', value: '< 8%' },
    ],
    feed: { phase: 'Starter → Developer', form: 'Pellet', size: '2–3 mm', duration: 'Switch based on BW ≥677g', intake: 'Ad libitum', water: 'Ad lib' },
    checklist: [
      { id: 'lay_w8_01', text: { en: 'Weekly BW — if ≥677g, begin switch to Developer feed', id: 'BB Mingguan — jika ≥677g, mulai ganti ke Developer', vi: 'KL hàng tuần — nếu ≥677g, bắt đầu chuyển sang Developer' }, priority: 'critical' },
      { id: 'lay_w8_02', text: { en: 'Mix Starter + Developer 50:50 for 3–5 days during transition', id: 'Campur Starter + Developer 50:50 selama 3–5 hari', vi: 'Trộn Starter + Developer 50:50 trong 3–5 ngày chuyển đổi' }, priority: 'critical' },
      { id: 'lay_w8_03', text: { en: 'Continue 9 hrs lighting — do not change', id: 'Lanjutkan 9 jam pencahayaan — jangan ubah', vi: 'Tiếp tục 9 giờ chiếu sáng — không thay đổi' }, priority: 'critical' },
    ],
    key_points: [
      { icon: '⚖️', text: { en: 'Feed transition is BW-based, not age-based. The correct time to switch is determined by body weight.', id: 'Transisi pakan berbasis BB, bukan umur. Waktu yang tepat untuk ganti ditentukan oleh berat badan.', vi: 'Chuyển đổi thức ăn dựa trên KL, không phải tuổi. Thời điểm đúng để chuyển đổi được xác định bởi trọng lượng cơ thể.' } },
    ],
  },
  {
    week: 9, phase: 'Rearing', title: 'Developer Phase — Uniform Growth', titleKey: 'layW9Title', emoji: '📈',
    tags: {
      en: ['Light: 9 hrs', 'Feed: Developer', 'BW W9: 777g'],
      id: ['Cahaya: 9 jam', 'Pakan: Developer', 'BB M9: 777g'],
      vi: ['Sáng: 9 giờ', 'Thức ăn: Developer', 'KL T9: 777g'],
    },
    alert: null,
    environment: {
      temp: '18–20°C', rh: '60–70%',
      light: { en: '9 hrs/day', id: '9 jam/hari', vi: '9 giờ/ngày' },
      light_lux: '4–6 lux', nh3: '< 10 ppm', co2: '< 2,500 ppm',
      ventilation: 'Full tunnel', ventKey: 'ventTunnelFull',
    },
    specs: [
      { icon: '📊', label: 'Target BW W9', labelKey: 'specBWTarget', value: '777g (754–800g)' },
      { icon: '💡', label: 'Light hours', labelKey: 'specLightIntensity', value: '9 hrs / 4–6 lux' },
      { icon: '🌡️', label: 'House temperature', labelKey: 'specHouseTemp', value: '18–20°C' },
      { icon: '💨', label: 'Air speed', labelKey: 'specAirspeed', value: '0.8–1.2 m/s' },
      { icon: '📊', label: 'Target CV%', labelKey: 'specCVTarget', value: '< 8%' },
      { icon: '💧', label: 'Nipple flow rate', labelKey: 'specNippleFlow', value: '50–65 ml/min' },
    ],
    feed: { phase: 'Developer', form: 'Pellet', size: '2–3 mm', duration: 'W9–W16 (BW-based)', intake: 'Ad libitum', water: 'Ad lib' },
    checklist: [
      { id: 'lay_w9_01', text: { en: 'Weekly BW — target 777g', id: 'BB Mingguan — target 777g', vi: 'KL hàng tuần — mục tiêu 777g' }, priority: 'critical' },
      { id: 'lay_w9_02', text: { en: 'Confirm 9 hrs lighting — no changes allowed', id: 'Konfirmasi 9 jam pencahayaan — tidak boleh ada perubahan', vi: 'Xác nhận 9 giờ chiếu sáng — không được thay đổi' }, priority: 'critical' },
      { id: 'lay_w9_03', text: { en: 'Weigh and record uniformity weekly — target CV% <8%', id: 'Timbang dan catat keseragaman mingguan — target CV% <8%', vi: 'Cân và ghi nhận độ đồng đều hàng tuần — mục tiêu CV% <8%' }, priority: 'high' },
    ],
    key_points: [
      { icon: '📊', text: { en: 'Consistent weekly weighing W9–W16 is the key management task. Any BW deviation >5% needs investigation.', id: 'Penimbangan mingguan konsisten M9–M16 adalah tugas manajemen kunci. Deviasi BB >5% perlu investigasi.', vi: 'Cân hàng tuần nhất quán T9–T16 là nhiệm vụ quản lý chính. Sai lệch KL >5% cần điều tra.' } },
    ],
  },
  // W10–W16: Same pattern as W9 — 9 hrs light, developer feed, BW tracking
  {
    week: 10, phase: 'Rearing', title: 'Developer — BW Tracking', titleKey: 'layW10Title', emoji: '📊',
    tags: { en: ['Light: 9 hrs', 'BW W10: 873g'], id: ['Cahaya: 9 jam', 'BB M10: 873g'], vi: ['Sáng: 9 giờ', 'KL T10: 873g'] },
    alert: null,
    environment: { temp: '18–20°C', rh: '60–70%', light: { en: '9 hrs/day', id: '9 jam/hari', vi: '9 giờ/ngày' }, light_lux: '4–6 lux', nh3: '< 10 ppm', co2: '< 2,500 ppm', ventilation: 'Full tunnel', ventKey: 'ventTunnelFull' },
    specs: [
      { icon: '📊', label: 'Target BW W10', labelKey: 'specBWTarget', value: '873g (847–899g)' },
      { icon: '💡', label: 'Light hours', labelKey: 'specLightIntensity', value: '9 hrs / 4–6 lux' },
      { icon: '🌡️', label: 'House temperature', labelKey: 'specHouseTemp', value: '18–20°C' },
      { icon: '💨', label: 'Air speed', labelKey: 'specAirspeed', value: '0.8–1.2 m/s' },
      { icon: '📊', label: 'Target CV%', labelKey: 'specCVTarget', value: '< 8%' },
      { icon: '💧', label: 'Nipple flow rate', labelKey: 'specNippleFlow', value: '55–70 ml/min' },
    ],
    feed: { phase: 'Developer', form: 'Pellet', size: '2–3 mm', duration: 'Continue W9–W16', intake: 'Ad libitum', water: 'Ad lib' },
    checklist: [
      { id: 'lay_w10_01', text: { en: 'Weekly BW — target 873g', id: 'BB Mingguan — target 873g', vi: 'KL hàng tuần — mục tiêu 873g' }, priority: 'critical' },
      { id: 'lay_w10_02', text: { en: 'Confirm 9 hrs lighting unchanged', id: 'Konfirmasi 9 jam pencahayaan tidak berubah', vi: 'Xác nhận 9 giờ chiếu sáng không thay đổi' }, priority: 'critical' },
    ],
    key_points: [
      { icon: '📈', text: { en: 'Target weekly BW gain W9–W16: ~90–100g/week. Below this consistently means underfeeding or health issue.', id: 'Target pertambahan BB mingguan M9–M16: ~90–100g/minggu. Di bawah ini secara konsisten berarti kurang pakan atau masalah kesehatan.', vi: 'Mục tiêu tăng KL hàng tuần T9–T16: ~90–100g/tuần. Dưới mức này liên tục có nghĩa là thiếu thức ăn hoặc vấn đề sức khỏe.' } },
    ],
  },
  {
    week: 11, phase: 'Rearing', title: 'Developer — Mid Rearing', titleKey: 'layW11Title', emoji: '📊',
    tags: { en: ['Light: 9 hrs', 'BW W11: 963g'], id: ['Cahaya: 9 jam', 'BB M11: 963g'], vi: ['Sáng: 9 giờ', 'KL T11: 963g'] },
    alert: null,
    environment: { temp: '18–20°C', rh: '60–70%', light: { en: '9 hrs/day', id: '9 jam/hari', vi: '9 giờ/ngày' }, light_lux: '4–6 lux', nh3: '< 10 ppm', co2: '< 2,500 ppm', ventilation: 'Full tunnel', ventKey: 'ventTunnelFull' },
    specs: [
      { icon: '📊', label: 'Target BW W11', labelKey: 'specBWTarget', value: '963g (934–992g)' },
      { icon: '💡', label: 'Light hours', labelKey: 'specLightIntensity', value: '9 hrs / 4–6 lux' },
      { icon: '🌡️', label: 'House temperature', labelKey: 'specHouseTemp', value: '18–20°C' },
      { icon: '💨', label: 'Air speed', labelKey: 'specAirspeed', value: '0.8–1.5 m/s' },
      { icon: '📊', label: 'Target CV%', labelKey: 'specCVTarget', value: '< 8%' },
      { icon: '💧', label: 'Nipple flow rate', labelKey: 'specNippleFlow', value: '60–75 ml/min' },
    ],
    feed: { phase: 'Developer', form: 'Pellet', size: '2–3 mm', duration: 'Continue W9–W16', intake: 'Ad libitum', water: 'Ad lib' },
    checklist: [
      { id: 'lay_w11_01', text: { en: 'Weekly BW — target 963g', id: 'BB Mingguan — target 963g', vi: 'KL hàng tuần — mục tiêu 963g' }, priority: 'critical' },
      { id: 'lay_w11_02', text: { en: 'Confirm 9 hrs lighting', id: 'Konfirmasi 9 jam pencahayaan', vi: 'Xác nhận 9 giờ chiếu sáng' }, priority: 'critical' },
      { id: 'lay_w11_03', text: { en: 'Check feeder and drinker condition', id: 'Periksa kondisi tempat pakan dan minum', vi: 'Kiểm tra tình trạng máng ăn và uống' }, priority: 'high' },
    ],
    key_points: [
      { icon: '🏥', text: { en: 'Good health and uniform BW at W11–W14 = strong foundation for production. Address any disease issues immediately.', id: 'Kesehatan baik dan BB seragam di M11–M14 = fondasi kuat untuk produksi. Tangani masalah penyakit segera.', vi: 'Sức khỏe tốt và KL đồng đều ở T11–T14 = nền tảng vững cho sản xuất. Xử lý vấn đề bệnh ngay lập tức.' } },
    ],
  },
  {
    week: 12, phase: 'Rearing', title: 'Developer — BW 1,000g Milestone', titleKey: 'layW12Title', emoji: '🎯',
    tags: { en: ['Light: 9 hrs', 'BW W12: 1047g'], id: ['Cahaya: 9 jam', 'BB M12: 1047g'], vi: ['Sáng: 9 giờ', 'KL T12: 1047g'] },
    alert: null,
    environment: { temp: '18–20°C', rh: '60–70%', light: { en: '9 hrs/day', id: '9 jam/hari', vi: '9 giờ/ngày' }, light_lux: '4–6 lux', nh3: '< 10 ppm', co2: '< 2,500 ppm', ventilation: 'Full tunnel', ventKey: 'ventTunnelFull' },
    specs: [
      { icon: '📊', label: 'Target BW W12', labelKey: 'specBWTarget', value: '1,047g (1016–1078g)' },
      { icon: '💡', label: 'Light hours', labelKey: 'specLightIntensity', value: '9 hrs / 4–6 lux' },
      { icon: '🌡️', label: 'House temperature', labelKey: 'specHouseTemp', value: '18–20°C' },
      { icon: '💨', label: 'Air speed', labelKey: 'specAirspeed', value: '1.0–1.5 m/s' },
      { icon: '📊', label: 'Target CV%', labelKey: 'specCVTarget', value: '< 8%' },
      { icon: '💧', label: 'Nipple flow rate', labelKey: 'specNippleFlow', value: '65–80 ml/min' },
    ],
    feed: { phase: 'Developer', form: 'Pellet', size: '2–3 mm', duration: 'Continue W9–W16', intake: 'Ad libitum', water: 'Ad lib' },
    checklist: [
      { id: 'lay_w12_01', text: { en: 'Weekly BW — target 1,047g', id: 'BB Mingguan — target 1.047g', vi: 'KL hàng tuần — mục tiêu 1.047g' }, priority: 'critical' },
      { id: 'lay_w12_02', text: { en: 'Confirm 9 hrs lighting', id: 'Konfirmasi 9 jam pencahayaan', vi: 'Xác nhận 9 giờ chiếu sáng' }, priority: 'critical' },
      { id: 'lay_w12_03', text: { en: 'Assess uniformity — CV% <8%, ≥85% birds in ±10% range', id: 'Nilai keseragaman — CV% <8%, ≥85% dalam ±10%', vi: 'Đánh giá độ đồng đều — CV% <8%, ≥85% trong ±10%' }, priority: 'high' },
    ],
    key_points: [
      { icon: '🎯', text: { en: 'Reaching 1,000g+ at W12 = flock is on track. If behind: increase feed access and check for competition at feeders.', id: 'Mencapai 1.000g+ di M12 = flock on track. Jika tertinggal: tingkatkan akses pakan dan periksa kompetisi di tempat pakan.', vi: 'Đạt 1.000g+ ở T12 = đàn đúng hướng. Nếu chậm: tăng tiếp cận thức ăn và kiểm tra cạnh tranh ở máng ăn.' } },
    ],
  },
  {
    week: 13, phase: 'Rearing', title: 'Developer — Approaching 1.1 kg', titleKey: 'layW13Title', emoji: '📊',
    tags: { en: ['Light: 9 hrs', 'BW W13: 1128g'], id: ['Cahaya: 9 jam', 'BB M13: 1128g'], vi: ['Sáng: 9 giờ', 'KL T13: 1128g'] },
    alert: null,
    environment: { temp: '18–20°C', rh: '60–70%', light: { en: '9 hrs/day', id: '9 jam/hari', vi: '9 giờ/ngày' }, light_lux: '4–6 lux', nh3: '< 10 ppm', co2: '< 2,500 ppm', ventilation: 'Full tunnel', ventKey: 'ventTunnelFull' },
    specs: [
      { icon: '📊', label: 'Target BW W13', labelKey: 'specBWTarget', value: '1,128g (1094–1162g)' },
      { icon: '💡', label: 'Light hours', labelKey: 'specLightIntensity', value: '9 hrs / 4–6 lux' },
      { icon: '🌡️', label: 'House temperature', labelKey: 'specHouseTemp', value: '18–20°C' },
      { icon: '💨', label: 'Air speed', labelKey: 'specAirspeed', value: '1.0–1.5 m/s' },
      { icon: '📊', label: 'Target CV%', labelKey: 'specCVTarget', value: '< 8%' },
      { icon: '💧', label: 'Nipple flow rate', labelKey: 'specNippleFlow', value: '70–85 ml/min' },
    ],
    feed: { phase: 'Developer', form: 'Pellet', size: '2–3 mm', duration: 'Continue W9–W16', intake: 'Ad libitum', water: 'Ad lib' },
    checklist: [
      { id: 'lay_w13_01', text: { en: 'Weekly BW — target 1,128g', id: 'BB Mingguan — target 1.128g', vi: 'KL hàng tuần — mục tiêu 1.128g' }, priority: 'critical' },
      { id: 'lay_w13_02', text: { en: 'Confirm 9 hrs lighting unchanged', id: 'Konfirmasi 9 jam pencahayaan tidak berubah', vi: 'Xác nhận 9 giờ chiếu sáng không thay đổi' }, priority: 'critical' },
    ],
    key_points: [
      { icon: '📋', text: { en: 'At W13–W14, begin planning light stimulation schedule. Stimulation at W17 requires advance preparation.', id: 'Di M13–M14, mulai rencanakan jadwal stimulasi cahaya. Stimulasi di M17 memerlukan persiapan awal.', vi: 'Ở T13–T14, bắt đầu lên kế hoạch lịch kích thích ánh sáng. Kích thích ở T17 cần chuẩn bị trước.' } },
    ],
  },
  {
    week: 14, phase: 'Rearing', title: 'Developer — Final Growth Phase', titleKey: 'layW14Title', emoji: '🏗️',
    tags: { en: ['Light: 9 hrs', 'BW W14: 1205g'], id: ['Cahaya: 9 jam', 'BB M14: 1205g'], vi: ['Sáng: 9 giờ', 'KL T14: 1205g'] },
    alert: null,
    environment: { temp: '18–20°C', rh: '60–70%', light: { en: '9 hrs/day', id: '9 jam/hari', vi: '9 giờ/ngày' }, light_lux: '4–6 lux', nh3: '< 10 ppm', co2: '< 2,500 ppm', ventilation: 'Full tunnel', ventKey: 'ventTunnelFull' },
    specs: [
      { icon: '📊', label: 'Target BW W14', labelKey: 'specBWTarget', value: '1,205g (1169–1241g)' },
      { icon: '💡', label: 'Light hours', labelKey: 'specLightIntensity', value: '9 hrs / 4–6 lux' },
      { icon: '🌡️', label: 'House temperature', labelKey: 'specHouseTemp', value: '18–20°C' },
      { icon: '💨', label: 'Air speed', labelKey: 'specAirspeed', value: '1.0–1.5 m/s' },
      { icon: '📊', label: 'Target uniformity', labelKey: 'specCVTarget', value: '≥85% in ±10% BW' },
      { icon: '💧', label: 'Nipple flow rate', labelKey: 'specNippleFlow', value: '75–90 ml/min' },
    ],
    feed: { phase: 'Developer', form: 'Pellet', size: '2–3 mm', duration: 'Continue W9–W16', intake: 'Ad libitum', water: 'Ad lib' },
    checklist: [
      { id: 'lay_w14_01', text: { en: 'Weekly BW — target 1,205g', id: 'BB Mingguan — target 1.205g', vi: 'KL hàng tuần — mục tiêu 1.205g' }, priority: 'critical' },
      { id: 'lay_w14_02', text: { en: 'Confirm 9 hrs lighting', id: 'Konfirmasi 9 jam pencahayaan', vi: 'Xác nhận 9 giờ chiếu sáng' }, priority: 'critical' },
      { id: 'lay_w14_03', text: { en: 'Evaluate flock uniformity — last chance for corrective action', id: 'Evaluasi keseragaman flock — kesempatan terakhir untuk tindakan korektif', vi: 'Đánh giá độ đồng đều — cơ hội cuối để khắc phục' }, priority: 'high' },
    ],
    key_points: [
      { icon: '🏗️', text: { en: 'W14–W16 = last window to correct uniformity problems. After W17 stimulation, uniformity cannot be improved.', id: 'M14–M16 = jendela terakhir untuk memperbaiki masalah keseragaman. Setelah stimulasi M17, keseragaman tidak bisa diperbaiki.', vi: 'T14–T16 = cửa sổ cuối để sửa vấn đề đồng đều. Sau kích thích T17, không thể cải thiện được nữa.' } },
    ],
  },
  {
    week: 15, phase: 'Rearing', title: 'Developer — Pre-Stimulation Preparation', titleKey: 'layW15Title', emoji: '⚙️',
    tags: { en: ['Light: 9 hrs', 'BW W15: 1279g', 'Pre-stim prep'], id: ['Cahaya: 9 jam', 'BB M15: 1279g', 'Persiapan pra-stimulasi'], vi: ['Sáng: 9 giờ', 'KL T15: 1279g', 'Chuẩn bị trước kích thích'] },
    alert: null,
    environment: { temp: '18–20°C', rh: '60–70%', light: { en: '9 hrs/day', id: '9 jam/hari', vi: '9 giờ/ngày' }, light_lux: '4–6 lux', nh3: '< 10 ppm', co2: '< 2,500 ppm', ventilation: 'Full tunnel', ventKey: 'ventTunnelFull' },
    specs: [
      { icon: '📊', label: 'Target BW W15', labelKey: 'specBWTarget', value: '1,279g (1241–1317g)' },
      { icon: '💡', label: 'Light hours', labelKey: 'specLightIntensity', value: '9 hrs / 4–6 lux' },
      { icon: '🌡️', label: 'House temperature', labelKey: 'specHouseTemp', value: '18–20°C' },
      { icon: '💨', label: 'Air speed', labelKey: 'specAirspeed', value: '1.0–1.5 m/s' },
      { icon: '📊', label: 'Target uniformity', labelKey: 'specCVTarget', value: '≥85% in ±10% BW' },
      { icon: '💧', label: 'Nipple flow rate', labelKey: 'specNippleFlow', value: '80–95 ml/min' },
    ],
    feed: { phase: 'Developer', form: 'Pellet', size: '2–3 mm', duration: 'W9–W16', intake: 'Ad libitum', water: 'Ad lib' },
    checklist: [
      { id: 'lay_w15_01', text: { en: 'Weekly BW — target 1,279g', id: 'BB Mingguan — target 1.279g', vi: 'KL hàng tuần — mục tiêu 1.279g' }, priority: 'critical' },
      { id: 'lay_w15_02', text: { en: 'Confirm 9 hrs lighting', id: 'Konfirmasi 9 jam pencahayaan', vi: 'Xác nhận 9 giờ chiếu sáng' }, priority: 'critical' },
      { id: 'lay_w15_03', text: { en: 'Prepare Pre-Layer feed for transition at W17–W18', id: 'Siapkan pakan Pre-Layer untuk transisi di M17–M18', vi: 'Chuẩn bị thức ăn Tiền đẻ cho chuyển đổi ở T17–T18' }, priority: 'high' },
      { id: 'lay_w15_04', text: { en: 'Plan light stimulation: confirm increase to 10 hrs at W17', id: 'Rencanakan stimulasi cahaya: konfirmasi peningkatan ke 10 jam di M17', vi: 'Lên kế hoạch kích thích ánh sáng: xác nhận tăng lên 10 giờ ở T17' }, priority: 'high' },
    ],
    key_points: [
      { icon: '⚙️', text: { en: 'Prepare Pre-Layer feed now. Correct calcium level (3.5–4.0%) must be in place BEFORE first egg. Switch to Pre-Layer at W17.', id: 'Siapkan pakan Pre-Layer sekarang. Kadar kalsium yang benar (3,5–4,0%) harus ada SEBELUM telur pertama. Ganti ke Pre-Layer di M17.', vi: 'Chuẩn bị thức ăn Tiền đẻ ngay. Mức canxi đúng (3,5–4,0%) phải có TRƯỚC quả trứng đầu tiên. Chuyển sang Tiền đẻ ở T17.' } },
    ],
  },
  {
    week: 16, phase: 'Rearing', title: 'Developer — Final Week Before Stimulation', titleKey: 'layW16Title', emoji: '🔔',
    tags: { en: ['Light: 9 hrs', 'BW W16: 1351g', 'Last 9h week'], id: ['Cahaya: 9 jam', 'BB M16: 1351g', 'Minggu 9j terakhir'], vi: ['Sáng: 9 giờ', 'KL T16: 1351g', 'Tuần 9g cuối'] },
    alert: {
      title: { en: 'Last Week at 9 hrs — Stimulation Next Week', id: 'Minggu Terakhir 9 jam — Stimulasi Minggu Depan', vi: 'Tuần cuối 9 giờ — Kích thích tuần sau' },
      text: {
        en: 'Confirm flock is ready: BW ≥1,351g, uniformity ≥85%, health status excellent. At W17: increase light to 10 hrs + switch to Pre-Layer feed. This triggers onset of lay.',
        id: 'Konfirmasi flock siap: BB ≥1.351g, keseragaman ≥85%, status kesehatan sangat baik. Di M17: tingkatkan cahaya ke 10 jam + ganti ke pakan Pre-Layer. Ini memicu awal bertelur.',
        vi: 'Xác nhận đàn sẵn sàng: KL ≥1.351g, đồng đều ≥85%, tình trạng sức khỏe xuất sắc. Ở T17: tăng sáng lên 10 giờ + chuyển sang thức ăn Tiền đẻ.',
      },
    },
    environment: { temp: '18–20°C', rh: '60–70%', light: { en: '9 hrs/day — LAST WEEK', id: '9 jam/hari — MINGGU TERAKHIR', vi: '9 giờ/ngày — TUẦN CUỐI' }, light_lux: '4–6 lux', nh3: '< 10 ppm', co2: '< 2,500 ppm', ventilation: 'Full tunnel', ventKey: 'ventTunnelFull' },
    specs: [
      { icon: '📊', label: 'Target BW W16', labelKey: 'specBWTarget', value: '1,351g (1310–1392g)' },
      { icon: '💡', label: 'Light hours', labelKey: 'specLightIntensity', value: '9 hrs — LAST WEEK' },
      { icon: '🌡️', label: 'House temperature', labelKey: 'specHouseTemp', value: '18–20°C' },
      { icon: '📊', label: 'Required uniformity', labelKey: 'specCVTarget', value: '≥85% in ±10% BW' },
      { icon: '💨', label: 'Air speed', labelKey: 'specAirspeed', value: '1.0–1.5 m/s' },
      { icon: '💧', label: 'Nipple flow rate', labelKey: 'specNippleFlow', value: '85–100 ml/min' },
    ],
    feed: { phase: 'Developer', form: 'Pellet', size: '2–3 mm', duration: 'Last week — switch to Pre-Layer at W17', intake: 'Ad libitum', water: 'Ad lib' },
    checklist: [
      { id: 'lay_w16_01', text: { en: 'Final BW check before stimulation — target 1,351g', id: 'Cek BB akhir sebelum stimulasi — target 1.351g', vi: 'Kiểm tra KL cuối trước kích thích — mục tiêu 1.351g' }, priority: 'critical' },
      { id: 'lay_w16_02', text: { en: 'Confirm uniformity ≥85%', id: 'Konfirmasi keseragaman ≥85%', vi: 'Xác nhận độ đồng đều ≥85%' }, priority: 'critical' },
      { id: 'lay_w16_03', text: { en: 'Confirm Pre-Layer feed is ready', id: 'Konfirmasi pakan Pre-Layer siap', vi: 'Xác nhận thức ăn Tiền đẻ sẵn sàng' }, priority: 'critical' },
      { id: 'lay_w16_04', text: { en: 'Set timer: W17 = increase light to 10 hrs', id: 'Atur timer: M17 = tingkatkan cahaya ke 10 jam', vi: 'Đặt hẹn giờ: T17 = tăng sáng lên 10 giờ' }, priority: 'critical' },
    ],
    key_points: [
      { icon: '🔔', text: { en: 'Flock ready criteria: BW ≥1,351g + uniformity ≥85% + health excellent. If not ready, delay stimulation 1 week.', id: 'Kriteria flock siap: BB ≥1.351g + keseragaman ≥85% + kesehatan sangat baik. Jika belum siap, tunda stimulasi 1 minggu.', vi: 'Tiêu chí đàn sẵn sàng: KL ≥1.351g + đồng đều ≥85% + sức khỏe xuất sắc. Nếu chưa sẵn sàng, trì hoãn kích thích 1 tuần.' } },
    ],
  },
  {
    week: 17, phase: 'Rearing', title: 'Light Stimulation — Onset of Lay Begins', titleKey: 'layW17Title', emoji: '💡',
    tags: {
      en: ['Light: 10 hrs ↑', 'Feed: Pre-Layer', 'BW W17: 1421g'],
      id: ['Cahaya: 10 jam ↑', 'Pakan: Pre-Layer', 'BB M17: 1421g'],
      vi: ['Sáng: 10 giờ ↑', 'Thức ăn: Tiền đẻ', 'KL T17: 1421g'],
    },
    alert: {
      title: { en: '⚡ Light Stimulation Begins! Switch to Pre-Layer Feed', id: '⚡ Stimulasi Cahaya Dimulai! Ganti ke Pakan Pre-Layer', vi: '⚡ Bắt đầu kích thích ánh sáng! Chuyển sang thức ăn Tiền đẻ' },
      text: {
        en: 'Increase light to 10 hrs at 5–7 lux. Simultaneously switch to Pre-Layer feed (higher Ca 3.5–4.0%). This triggers reproductive development. First eggs expected around D140–145 (W20–21). NEVER decrease light hours after this point.',
        id: 'Tingkatkan cahaya ke 10 jam 5–7 lux. Bersamaan ganti ke pakan Pre-Layer (Ca lebih tinggi 3,5–4,0%). Ini memicu perkembangan reproduksi. Telur pertama diharapkan sekitar H140–145 (M20–21). JANGAN PERNAH kurangi jam cahaya setelah titik ini.',
        vi: 'Tăng sáng lên 10 giờ 5–7 lux. Đồng thời chuyển sang thức ăn Tiền đẻ (Ca cao hơn 3,5–4,0%). Điều này kích thích phát triển sinh sản. Trứng đầu tiên dự kiến khoảng N140–145 (T20–21). KHÔNG BAO GIỜ giảm giờ sáng sau thời điểm này.',
      },
    },
    environment: {
      temp: '18–20°C', rh: '60–70%',
      light: { en: '10 hrs/day — STIMULATION', id: '10 jam/hari — STIMULASI', vi: '10 giờ/ngày — KÍCH THÍCH' },
      light_lux: '5–7 lux', nh3: '< 10 ppm', co2: '< 2,500 ppm',
      ventilation: 'Full tunnel', ventKey: 'ventTunnelFull',
    },
    specs: [
      { icon: '💡', label: 'Light hours — STIMULATION', labelKey: 'specLightIntensity', value: '10 hrs / 5–7 lux' },
      { icon: '📊', label: 'Target BW W17', labelKey: 'specBWTarget', value: '1,421g (1378–1464g)' },
      { icon: '🌾', label: 'Switch to Pre-Layer feed', labelKey: 'specFeedSwitch', value: 'Ca 3.5–4.0%' },
      { icon: '🌡️', label: 'House temperature', labelKey: 'specHouseTemp', value: '18–20°C' },
      { icon: '💨', label: 'Air speed', labelKey: 'specAirspeed', value: '1.0–1.5 m/s' },
      { icon: '💧', label: 'Nipple flow rate', labelKey: 'specNippleFlow', value: '90–110 ml/min' },
    ],
    feed: { phase: 'Pre-Layer', form: 'Pellet', size: '3 mm', duration: 'W17–W18 (until 5% lay)', intake: 'Ad libitum — NEVER restrict', water: 'Unlimited' },
    checklist: [
      { id: 'lay_w17_01', text: { en: 'INCREASE light to 10 hrs exactly — check timer setting', id: 'TINGKATKAN cahaya ke 10 jam tepat — periksa pengaturan timer', vi: 'TĂNG sáng lên 10 giờ chính xác — kiểm tra cài đặt hẹn giờ' }, priority: 'critical' },
      { id: 'lay_w17_02', text: { en: 'Switch to Pre-Layer feed — mix Developer + Pre-Layer 50:50 for 3 days', id: 'Ganti ke pakan Pre-Layer — campur Developer + Pre-Layer 50:50 selama 3 hari', vi: 'Chuyển sang thức ăn Tiền đẻ — trộn Developer + Tiền đẻ 50:50 trong 3 ngày' }, priority: 'critical' },
      { id: 'lay_w17_03', text: { en: 'Weekly BW — target 1,421g', id: 'BB Mingguan — target 1.421g', vi: 'KL hàng tuần — mục tiêu 1.421g' }, priority: 'critical' },
      { id: 'lay_w17_04', text: { en: 'Monitor water intake — increases significantly after light stimulation', id: 'Pantau konsumsi air — meningkat signifikan setelah stimulasi cahaya', vi: 'Theo dõi lượng nước uống — tăng đáng kể sau kích thích ánh sáng' }, priority: 'high' },
    ],
    key_points: [
      { icon: '⚡', text: { en: 'Light stimulation is the single most important management event in layer production. Timing and flock readiness determine lifetime performance.', id: 'Stimulasi cahaya adalah event manajemen terpenting dalam produksi layer. Timing dan kesiapan flock menentukan performa seumur hidup.', vi: 'Kích thích ánh sáng là sự kiện quản lý quan trọng nhất trong sản xuất layer. Thời điểm và sự sẵn sàng của đàn quyết định hiệu suất cả đời.' } },
      { icon: '🦴', text: { en: 'Pre-Layer feed MUST have high Ca (3.5–4.0%) to prepare bone Ca reserves before first egg. Insufficient Ca = soft-shelled eggs.', id: 'Pakan Pre-Layer HARUS memiliki Ca tinggi (3,5–4,0%) untuk mempersiapkan cadangan Ca tulang sebelum telur pertama. Ca kurang = telur cangkang lembut.', vi: 'Thức ăn Tiền đẻ PHẢI có Ca cao (3,5–4,0%) để chuẩn bị dự trữ Ca xương trước quả trứng đầu tiên.' } },
    ],
  },
  {
    week: 18, phase: 'Rearing', title: 'Pre-Layer — Approaching First Egg', titleKey: 'layW18Title', emoji: '🥚',
    tags: {
      en: ['Light: 11 hrs', 'Feed: Pre-Layer', 'BW W18: 1493g'],
      id: ['Cahaya: 11 jam', 'Pakan: Pre-Layer', 'BB M18: 1493g'],
      vi: ['Sáng: 11 giờ', 'Thức ăn: Tiền đẻ', 'KL T18: 1493g'],
    },
    alert: null,
    environment: {
      temp: '18–20°C', rh: '60–70%',
      light: { en: '11 hrs/day', id: '11 jam/hari', vi: '11 giờ/ngày' },
      light_lux: '5–7 lux', nh3: '< 10 ppm', co2: '< 2,500 ppm',
      ventilation: 'Full tunnel', ventKey: 'ventTunnelFull',
    },
    specs: [
      { icon: '💡', label: 'Light hours', labelKey: 'specLightIntensity', value: '11 hrs / 5–7 lux' },
      { icon: '📊', label: 'Target BW W18', labelKey: 'specBWTarget', value: '1,493g (1448–1538g)' },
      { icon: '🥚', label: 'Expected first eggs', labelKey: 'specFirstEgg', value: 'D140–145 (W20–21)' },
      { icon: '🌡️', label: 'House temperature', labelKey: 'specHouseTemp', value: '18–20°C' },
      { icon: '💨', label: 'Air speed', labelKey: 'specAirspeed', value: '1.0–1.5 m/s' },
      { icon: '💧', label: 'Nipple flow rate', labelKey: 'specNippleFlow', value: '90–110 ml/min' },
    ],
    feed: { phase: 'Pre-Layer', form: 'Pellet', size: '3 mm', duration: 'Continue until 5% lay rate', intake: 'Ad libitum — NEVER restrict', water: 'Unlimited' },
    checklist: [
      { id: 'lay_w18_01', text: { en: 'Weekly BW — target 1,493g', id: 'BB Mingguan — target 1.493g', vi: 'KL hàng tuần — mục tiêu 1.493g' }, priority: 'critical' },
      { id: 'lay_w18_02', text: { en: 'Set lighting: 11 hrs at 5–7 lux', id: 'Atur pencahayaan: 11 jam 5–7 lux', vi: 'Cài đặt chiếu sáng: 11 giờ 5–7 lux' }, priority: 'critical' },
      { id: 'lay_w18_03', text: { en: 'Continue Pre-Layer feed — NEVER restrict feed intake', id: 'Lanjutkan pakan Pre-Layer — JANGAN PERNAH batasi konsumsi pakan', vi: 'Tiếp tục thức ăn Tiền đẻ — KHÔNG BAO GIỜ hạn chế lượng ăn' }, priority: 'critical' },
      { id: 'lay_w18_04', text: { en: 'Inspect nest boxes and egg collection system', id: 'Periksa kotak sarang dan sistem pengumpulan telur', vi: 'Kiểm tra ổ đẻ và hệ thống thu trứng' }, priority: 'high' },
    ],
    key_points: [
      { icon: '🥚', text: { en: 'First eggs expected D140–145 (W20–21). EP% rises from <1% at W19 to ~50% at W20. Be ready to switch to Layer feed when EP >5%.', id: 'Telur pertama diharapkan H140–145 (M20–21). EP% naik dari <1% di M19 ke ~50% di M20. Siap ganti ke pakan Layer saat EP >5%.', vi: 'Trứng đầu tiên dự kiến N140–145 (T20–21). EP% tăng từ <1% ở T19 lên ~50% ở T20. Sẵn sàng chuyển sang thức ăn Đẻ khi EP >5%.' } },
    ],
  },

  // ─── PRODUCTION PHASE W19–W45 (Full detail) ─────────────────────────────────
  {
    week: 19, phase: 'Pre-Layer', title: 'Production Begins — First Eggs', titleKey: 'layW19Title', emoji: '🥚',
    tags: {
      en: ['Light: 12 hrs', 'First eggs', 'EP% ~9%'],
      id: ['Cahaya: 12 jam', 'Telur pertama', 'EP% ~9%'],
      vi: ['Sáng: 12 giờ', 'Trứng đầu tiên', 'EP% ~9%'],
    },
    alert: {
      title: { en: 'Switch to Layer Feed when EP% >5%', id: 'Ganti ke Pakan Layer saat EP% >5%', vi: 'Chuyển sang thức ăn Đẻ khi EP% >5%' },
      text: {
        en: 'When egg production reaches 5%, switch from Pre-Layer to Layer feed. Layer feed has higher protein (17–18%) and optimized Ca (4.0–4.5g/day). Mix 50:50 for 3 days. Never restrict feed or water.',
        id: 'Saat produksi telur mencapai 5%, ganti dari Pre-Layer ke pakan Layer. Pakan Layer memiliki protein lebih tinggi (17–18%) dan Ca teroptimalkan (4,0–4,5g/hari). Campur 50:50 selama 3 hari. Jangan pernah batasi pakan atau air.',
        vi: 'Khi sản lượng trứng đạt 5%, chuyển từ Tiền đẻ sang thức ăn Đẻ. Thức ăn Đẻ có protein cao hơn (17–18%) và Ca tối ưu hóa (4,0–4,5g/ngày). Trộn 50:50 trong 3 ngày.',
      },
    },
    environment: {
      temp: '18–22°C', rh: '60–70%',
      light: { en: '12 hrs/day', id: '12 jam/hari', vi: '12 giờ/ngày' },
      light_lux: '5–7 lux', nh3: '< 10 ppm', co2: '< 2,500 ppm',
      ventilation: 'Optimized', ventKey: 'ventOptimal',
    },
    specs: [
      { icon: '💡', label: 'Light hours', labelKey: 'specLightIntensity', value: '12 hrs / 5–7 lux' },
      { icon: '🥚', label: 'Target EP% W19', labelKey: 'specEPTarget', value: '~9% (H.D.)' },
      { icon: '📊', label: 'Target BW W19', labelKey: 'specBWTarget', value: '1,565g (1518–1612g)' },
      { icon: '🌡️', label: 'House temperature', labelKey: 'specHouseTemp', value: '18–22°C' },
      { icon: '💨', label: 'Air speed', labelKey: 'specAirspeed', value: '1.0–1.5 m/s' },
      { icon: '🌾', label: 'Switch to Layer feed at', labelKey: 'specFeedSwitch', value: 'EP% > 5%' },
    ],
    feed: { phase: 'Pre-Layer → Layer', form: 'Pellet/Mash', size: '3 mm', duration: 'Switch at EP >5%', intake: 'Ad libitum — NEVER restrict', water: 'Unlimited' },
    checklist: [
      { id: 'lay_w19_01', text: { en: 'Record first egg date — milestone for flock records', id: 'Catat tanggal telur pertama — tonggak catatan flock', vi: 'Ghi nhận ngày trứng đầu tiên — cột mốc hồ sơ đàn' }, priority: 'critical' },
      { id: 'lay_w19_02', text: { en: 'Monitor EP% daily — switch to Layer feed when EP >5%', id: 'Pantau EP% harian — ganti ke pakan Layer saat EP >5%', vi: 'Theo dõi EP% hàng ngày — chuyển sang thức ăn Đẻ khi EP >5%' }, priority: 'critical' },
      { id: 'lay_w19_03', text: { en: 'Set lighting: 12 hrs at 5–7 lux', id: 'Atur pencahayaan: 12 jam 5–7 lux', vi: 'Cài đặt chiếu sáng: 12 giờ 5–7 lux' }, priority: 'critical' },
      { id: 'lay_w19_04', text: { en: 'Ensure adequate water — consumption increases sharply at production onset', id: 'Pastikan air cukup — konsumsi meningkat tajam saat awal produksi', vi: 'Đảm bảo đủ nước — tiêu thụ tăng mạnh khi bắt đầu đẻ' }, priority: 'critical' },
    ],
    key_points: [
      { icon: '🥚', text: { en: 'Age at 50% production: D140–145. If behind, check BW at stimulation, lighting program, and Pre-Layer feed quality.', id: 'Umur saat 50% produksi: H140–145. Jika tertinggal, periksa BB saat stimulasi, program pencahayaan, dan kualitas pakan Pre-Layer.', vi: 'Tuổi đạt 50% sản lượng: N140–145. Nếu chậm, kiểm tra KL khi kích thích, chương trình chiếu sáng và chất lượng thức ăn Tiền đẻ.' } },
    ],
  },
  {
    week: 20, phase: 'Layer', title: 'Production Ramping Up', titleKey: 'layW20Title', emoji: '📈',
    tags: {
      en: ['Light: 13 hrs', 'EP% ~36%', 'Egg weight rising'],
      id: ['Cahaya: 13 jam', 'EP% ~36%', 'Bobot telur naik'],
      vi: ['Sáng: 13 giờ', 'EP% ~36%', 'KL trứng tăng'],
    },
    alert: null,
    environment: {
      temp: '18–22°C', rh: '60–70%',
      light: { en: '13 hrs/day', id: '13 jam/hari', vi: '13 giờ/ngày' },
      light_lux: '10–15 lux', nh3: '< 10 ppm', co2: '< 2,500 ppm',
      ventilation: 'Optimized', ventKey: 'ventOptimal',
    },
    specs: [
      { icon: '💡', label: 'Light hours', labelKey: 'specLightIntensity', value: '13 hrs / 10–15 lux' },
      { icon: '🥚', label: 'Target EP% W20', labelKey: 'specEPTarget', value: '~36% (H.D.)' },
      { icon: '🥚', label: 'Target egg weight W20', labelKey: 'specEggWeight', value: '~46g' },
      { icon: '📊', label: 'Target BW W20', labelKey: 'specBWTarget', value: '1,635g' },
      { icon: '🌡️', label: 'House temperature', labelKey: 'specHouseTemp', value: '18–22°C' },
      { icon: '💨', label: 'Air speed', labelKey: 'specAirspeed', value: '1.0–1.5 m/s' },
    ],
    feed: { phase: 'Layer', form: 'Pellet/Mash', size: '3 mm', duration: 'W20 onward', intake: 'Ad libitum — NEVER restrict', water: 'Unlimited' },
    checklist: [
      { id: 'lay_w20_01', text: { en: 'Weekly EP% — target ~36%', id: 'EP% Mingguan — target ~36%', vi: 'EP% hàng tuần — mục tiêu ~36%' }, priority: 'critical' },
      { id: 'lay_w20_02', text: { en: 'Measure egg weight — target ~46g', id: 'Ukur bobot telur — target ~46g', vi: 'Đo KL trứng — mục tiêu ~46g' }, priority: 'high' },
      { id: 'lay_w20_03', text: { en: 'Increase light to 13 hrs at 10–15 lux', id: 'Tingkatkan cahaya ke 13 jam 10–15 lux', vi: 'Tăng sáng lên 13 giờ 10–15 lux' }, priority: 'critical' },
      { id: 'lay_w20_04', text: { en: 'Monitor feed and water intake — consumption increases rapidly', id: 'Pantau konsumsi pakan dan air — konsumsi meningkat cepat', vi: 'Theo dõi lượng ăn và uống — tiêu thụ tăng nhanh' }, priority: 'high' },
    ],
    key_points: [
      { icon: '📈', text: { en: 'EP% increases ~18–20% per week during W19–W25. BW also increases by 30–50g/week. Both need adequate nutrition support.', id: 'EP% meningkat ~18–20% per minggu selama M19–M25. BB juga meningkat 30–50g/minggu. Keduanya butuh dukungan nutrisi yang cukup.', vi: 'EP% tăng ~18–20% mỗi tuần trong T19–T25. KL cũng tăng 30–50g/tuần. Cả hai cần hỗ trợ dinh dưỡng đầy đủ.' } },
    ],
  },
  {
    week: 25, phase: 'Layer', title: 'Peak Production Approaching', titleKey: 'layW25Title', emoji: '🏆',
    tags: {
      en: ['Light: 14 hrs', 'EP% ~91%', 'Near peak'],
      id: ['Cahaya: 14 jam', 'EP% ~91%', 'Mendekati puncak'],
      vi: ['Sáng: 14 giờ', 'EP% ~91%', 'Gần đỉnh'],
    },
    alert: {
      title: { en: 'Approaching Peak Production — 14 hrs LOCKED', id: 'Mendekati Produksi Puncak — 14 jam TERKUNCI', vi: 'Tiếp cận đỉnh sản xuất — 14 giờ CỐ ĐỊNH' },
      text: {
        en: 'At W21+, maintain 14 hrs light at 10–15 lux until end of production. NEVER decrease. Feed intake reaches maximum (~115–120 g/bird/day). Water:Feed ratio = 2:1.',
        id: 'Di M21+, pertahankan 14 jam cahaya 10–15 lux sampai akhir produksi. JANGAN PERNAH kurangi. Konsumsi pakan mencapai maksimum (~115–120 g/ekor/hari). Rasio Air:Pakan = 2:1.',
        vi: 'Từ T21+, duy trì 14 giờ sáng 10–15 lux đến cuối sản xuất. KHÔNG BAO GIỜ giảm. Lượng ăn đạt tối đa (~115–120 g/con/ngày). Tỷ lệ Nước:Thức ăn = 2:1.',
      },
    },
    environment: {
      temp: '18–22°C', rh: '60–70%',
      light: { en: '14 hrs/day — LOCKED', id: '14 jam/hari — TERKUNCI', vi: '14 giờ/ngày — CỐ ĐỊNH' },
      light_lux: '10–15 lux', nh3: '< 10 ppm', co2: '< 2,500 ppm',
      ventilation: 'Optimized', ventKey: 'ventOptimal',
    },
    specs: [
      { icon: '💡', label: 'Light hours — LOCKED', labelKey: 'specLightIntensity', value: '14 hrs / 10–15 lux' },
      { icon: '🥚', label: 'Target EP% W25', labelKey: 'specEPTarget', value: '~91% (H.D.)' },
      { icon: '🥚', label: 'Target egg weight W25', labelKey: 'specEggWeight', value: '~57g' },
      { icon: '📊', label: 'Target BW W25', labelKey: 'specBWTarget', value: '1,874g' },
      { icon: '🌡️', label: 'House temperature', labelKey: 'specHouseTemp', value: '18–22°C' },
      { icon: '💧', label: 'Water:Feed ratio', labelKey: 'specWaterFeed', value: '~2:1' },
    ],
    feed: { phase: 'Layer (peak nutrition)', form: 'Pellet/Mash', size: '3 mm', duration: 'Ongoing', intake: 'Ad libitum — max ~120 g/bird/day', water: 'Unlimited — 2× feed intake' },
    checklist: [
      { id: 'lay_w25_01', text: { en: 'Weekly EP% — target ≥91%', id: 'EP% Mingguan — target ≥91%', vi: 'EP% hàng tuần — mục tiêu ≥91%' }, priority: 'critical' },
      { id: 'lay_w25_02', text: { en: 'Weigh eggs weekly — target ~57g average', id: 'Timbang telur mingguan — target rata-rata ~57g', vi: 'Cân trứng hàng tuần — mục tiêu trung bình ~57g' }, priority: 'high' },
      { id: 'lay_w25_03', text: { en: 'BW check — target 1,874g', id: 'Cek BB — target 1.874g', vi: 'Kiểm tra KL — mục tiêu 1.874g' }, priority: 'high' },
      { id: 'lay_w25_04', text: { en: 'Confirm 14 hrs lighting — DO NOT change until end of production', id: 'Konfirmasi 14 jam pencahayaan — JANGAN ubah sampai akhir produksi', vi: 'Xác nhận 14 giờ chiếu sáng — KHÔNG thay đổi đến cuối sản xuất' }, priority: 'critical' },
    ],
    key_points: [
      { icon: '🏆', text: { en: 'Peak production W27–W35: target EP% 94–96%. Maintain perfect nutrition, lighting, and water supply to sustain peak.', id: 'Produksi puncak M27–M35: target EP% 94–96%. Pertahankan nutrisi, pencahayaan, dan pasokan air yang sempurna untuk mempertahankan puncak.', vi: 'Đỉnh sản lượng T27–T35: mục tiêu EP% 94–96%. Duy trì dinh dưỡng, chiếu sáng và cung cấp nước hoàn hảo.' } },
    ],
  },
  {
    week: 30, phase: 'Layer', title: 'Peak Production — Sustained Performance', titleKey: 'layW30Title', emoji: '🏆',
    tags: {
      en: ['Light: 14 hrs', 'EP% ~95%', 'Peak maintained'],
      id: ['Cahaya: 14 jam', 'EP% ~95%', 'Puncak dipertahankan'],
      vi: ['Sáng: 14 giờ', 'EP% ~95%', 'Duy trì đỉnh'],
    },
    alert: null,
    environment: {
      temp: '18–22°C', rh: '60–70%',
      light: { en: '14 hrs/day', id: '14 jam/hari', vi: '14 giờ/ngày' },
      light_lux: '10–15 lux', nh3: '< 10 ppm', co2: '< 2,500 ppm',
      ventilation: 'Optimized', ventKey: 'ventOptimal',
    },
    specs: [
      { icon: '🥚', label: 'Target EP% W30', labelKey: 'specEPTarget', value: '~95% (H.D.)' },
      { icon: '🥚', label: 'Target egg weight W30', labelKey: 'specEggWeight', value: '~62g' },
      { icon: '📊', label: 'Target BW W30', labelKey: 'specBWTarget', value: '~1,921g' },
      { icon: '💡', label: 'Light hours', labelKey: 'specLightIntensity', value: '14 hrs / 10–15 lux' },
      { icon: '🌡️', label: 'House temperature', labelKey: 'specHouseTemp', value: '18–22°C' },
      { icon: '💧', label: 'Water:Feed ratio', labelKey: 'specWaterFeed', value: '~2:1' },
    ],
    feed: { phase: 'Layer', form: 'Pellet/Mash', size: '3 mm', duration: 'Ongoing', intake: 'Ad libitum', water: 'Unlimited' },
    checklist: [
      { id: 'lay_w30_01', text: { en: 'Weekly EP% — target ~95%', id: 'EP% Mingguan — target ~95%', vi: 'EP% hàng tuần — mục tiêu ~95%' }, priority: 'critical' },
      { id: 'lay_w30_02', text: { en: 'Monthly BW check — target ~1,921g', id: 'Cek BB bulanan — target ~1.921g', vi: 'Kiểm tra KL hàng tháng — mục tiêu ~1.921g' }, priority: 'high' },
      { id: 'lay_w30_03', text: { en: 'Monitor egg quality: shell strength, dirty egg %', id: 'Pantau kualitas telur: kekuatan cangkang, % telur kotor', vi: 'Theo dõi chất lượng trứng: độ bền vỏ, % trứng bẩn' }, priority: 'high' },
      { id: 'lay_w30_04', text: { en: 'Check water nipples — adequate flow critical for peak production', id: 'Periksa nipple air — aliran yang cukup sangat penting untuk produksi puncak', vi: 'Kiểm tra nipple nước — lưu lượng đầy đủ quan trọng cho đỉnh sản lượng' }, priority: 'high' },
    ],
    key_points: [
      { icon: '💧', text: { en: 'Water restriction even for 2–3 hours can drop EP% by 3–5%. Never restrict water in production.', id: 'Pembatasan air bahkan 2–3 jam bisa menurunkan EP% sebesar 3–5%. Jangan pernah batasi air dalam produksi.', vi: 'Hạn chế nước dù chỉ 2–3 giờ có thể giảm EP% 3–5%. Không bao giờ hạn chế nước trong sản xuất.' } },
    ],
  },
  {
    week: 35, phase: 'Layer', title: 'Post-Peak — Gradual Decline', titleKey: 'layW35Title', emoji: '📉',
    tags: {
      en: ['EP% ~95%', 'Egg weight ~64g', 'Monitor quality'],
      id: ['EP% ~95%', 'Bobot telur ~64g', 'Pantau kualitas'],
      vi: ['EP% ~95%', 'KL trứng ~64g', 'Theo dõi chất lượng'],
    },
    alert: null,
    environment: {
      temp: '18–22°C', rh: '60–70%',
      light: { en: '14 hrs/day', id: '14 jam/hari', vi: '14 giờ/ngày' },
      light_lux: '10–15 lux', nh3: '< 10 ppm', co2: '< 2,500 ppm',
      ventilation: 'Optimized', ventKey: 'ventOptimal',
    },
    specs: [
      { icon: '🥚', label: 'Target EP% W35', labelKey: 'specEPTarget', value: '~95% (H.D.)' },
      { icon: '🥚', label: 'Target egg weight W35', labelKey: 'specEggWeight', value: '~64g' },
      { icon: '📊', label: 'Target BW W35', labelKey: 'specBWTarget', value: '~1,934g' },
      { icon: '💡', label: 'Light hours', labelKey: 'specLightIntensity', value: '14 hrs / 10–15 lux' },
      { icon: '🌡️', label: 'House temperature', labelKey: 'specHouseTemp', value: '18–22°C' },
      { icon: '💧', label: 'Water:Feed ratio', labelKey: 'specWaterFeed', value: '~2:1' },
    ],
    feed: { phase: 'Layer', form: 'Pellet/Mash', size: '3 mm', duration: 'Ongoing', intake: 'Ad libitum', water: 'Unlimited' },
    checklist: [
      { id: 'lay_w35_01', text: { en: 'Weekly EP% — target ≥94%', id: 'EP% Mingguan — target ≥94%', vi: 'EP% hàng tuần — mục tiêu ≥94%' }, priority: 'critical' },
      { id: 'lay_w35_02', text: { en: 'Egg weight check — target ~64g', id: 'Cek bobot telur — target ~64g', vi: 'Kiểm tra KL trứng — mục tiêu ~64g' }, priority: 'high' },
      { id: 'lay_w35_03', text: { en: 'Monitor shell quality — crack rate target <1%', id: 'Pantau kualitas cangkang — target tingkat retak <1%', vi: 'Theo dõi chất lượng vỏ — mục tiêu tỷ lệ nứt <1%' }, priority: 'high' },
    ],
    key_points: [
      { icon: '🥚', text: { en: 'Egg weight stabilizes at 63–65g from W35+. Shell quality focus becomes important — check Ca supply and bone reserves.', id: 'Bobot telur stabil di 63–65g dari M35+. Fokus kualitas cangkang menjadi penting — periksa pasokan Ca dan cadangan tulang.', vi: 'KL trứng ổn định ở 63–65g từ T35+. Tập trung chất lượng vỏ trở nên quan trọng — kiểm tra nguồn cung Ca và dự trữ xương.' } },
    ],
  },
  {
    week: 40, phase: 'Layer', title: 'Mid Production — Quality Focus', titleKey: 'layW40Title', emoji: '🔍',
    tags: {
      en: ['EP% ~94%', 'Egg weight ~65g', 'Quality check'],
      id: ['EP% ~94%', 'Bobot telur ~65g', 'Cek kualitas'],
      vi: ['EP% ~94%', 'KL trứng ~65g', 'Kiểm tra chất lượng'],
    },
    alert: null,
    environment: {
      temp: '18–22°C', rh: '60–70%',
      light: { en: '14 hrs/day', id: '14 jam/hari', vi: '14 giờ/ngày' },
      light_lux: '10–15 lux', nh3: '< 10 ppm', co2: '< 2,500 ppm',
      ventilation: 'Optimized', ventKey: 'ventOptimal',
    },
    specs: [
      { icon: '🥚', label: 'Target EP% W40', labelKey: 'specEPTarget', value: '~94% (H.D.)' },
      { icon: '🥚', label: 'Target egg weight W40', labelKey: 'specEggWeight', value: '~65g' },
      { icon: '📊', label: 'Target BW W40', labelKey: 'specBWTarget', value: '~1,946g' },
      { icon: '💡', label: 'Light hours', labelKey: 'specLightIntensity', value: '14 hrs / 10–15 lux' },
      { icon: '🌡️', label: 'House temperature', labelKey: 'specHouseTemp', value: '18–22°C' },
      { icon: '💧', label: 'Water:Feed ratio', labelKey: 'specWaterFeed', value: '~2:1' },
    ],
    feed: { phase: 'Layer', form: 'Pellet/Mash', size: '3 mm', duration: 'Ongoing', intake: 'Ad libitum', water: 'Unlimited' },
    checklist: [
      { id: 'lay_w40_01', text: { en: 'Weekly EP% — target ~94%', id: 'EP% Mingguan — target ~94%', vi: 'EP% hàng tuần — mục tiêu ~94%' }, priority: 'critical' },
      { id: 'lay_w40_02', text: { en: 'Monthly BW check', id: 'Cek BB bulanan', vi: 'Kiểm tra KL hàng tháng' }, priority: 'high' },
      { id: 'lay_w40_03', text: { en: 'Egg quality audit: shell strength, crack %, dirty %', id: 'Audit kualitas telur: kekuatan cangkang, % retak, % kotor', vi: 'Kiểm tra chất lượng trứng: độ bền vỏ, % nứt, % bẩn' }, priority: 'high' },
    ],
    key_points: [
      { icon: '🔍', text: { en: 'From W40+, begin monitoring for gradual EP% decline. <0.5%/week decline = normal. >1%/week = investigate disease, nutrition, stress.', id: 'Dari M40+, mulai pantau penurunan EP% bertahap. <0,5%/minggu = normal. >1%/minggu = selidiki penyakit, nutrisi, stres.', vi: 'Từ T40+, bắt đầu theo dõi suy giảm EP% dần dần. <0,5%/tuần = bình thường. >1%/tuần = điều tra bệnh, dinh dưỡng, stress.' } },
    ],
  },
  {
    week: 45, phase: 'Layer', title: 'Late Production — Sustained Quality', titleKey: 'layW45Title', emoji: '📊',
    tags: {
      en: ['EP% ~93%', 'Egg weight ~65g', 'Late production'],
      id: ['EP% ~93%', 'Bobot telur ~65g', 'Produksi akhir'],
      vi: ['EP% ~93%', 'KL trứng ~65g', 'Sản xuất cuối'],
    },
    alert: null,
    environment: {
      temp: '18–22°C', rh: '60–70%',
      light: { en: '14 hrs/day', id: '14 jam/hari', vi: '14 giờ/ngày' },
      light_lux: '10–15 lux', nh3: '< 10 ppm', co2: '< 2,500 ppm',
      ventilation: 'Optimized', ventKey: 'ventOptimal',
    },
    specs: [
      { icon: '🥚', label: 'Target EP% W45', labelKey: 'specEPTarget', value: '~93% (H.D.)' },
      { icon: '🥚', label: 'Target egg weight W45', labelKey: 'specEggWeight', value: '~65g' },
      { icon: '📊', label: 'Target BW W45', labelKey: 'specBWTarget', value: '~1,959g' },
      { icon: '💡', label: 'Light hours', labelKey: 'specLightIntensity', value: '14 hrs / 10–15 lux' },
      { icon: '🌡️', label: 'House temperature', labelKey: 'specHouseTemp', value: '18–22°C' },
      { icon: '💧', label: 'Water:Feed ratio', labelKey: 'specWaterFeed', value: '~2:1' },
    ],
    feed: { phase: 'Layer', form: 'Pellet/Mash', size: '3 mm', duration: 'Ongoing', intake: 'Ad libitum', water: 'Unlimited' },
    checklist: [
      { id: 'lay_w45_01', text: { en: 'Weekly EP% — track trend vs previous weeks', id: 'EP% Mingguan — lacak tren vs minggu sebelumnya', vi: 'EP% hàng tuần — theo dõi xu hướng so với các tuần trước' }, priority: 'critical' },
      { id: 'lay_w45_02', text: { en: 'Check shell quality — increase oyster shell if cracking increases', id: 'Periksa kualitas cangkang — tambahkan cangkang tiram jika retak meningkat', vi: 'Kiểm tra chất lượng vỏ — tăng vỏ hàu nếu nứt tăng' }, priority: 'high' },
    ],
    key_points: [
      { icon: '📊', text: { en: 'Cumulative eggs/hen by W45: ~160 eggs. On track for 324 at W72 and 367 at W80.', id: 'Telur kumulatif/ekor pada M45: ~160 telur. On track untuk 324 di M72 dan 367 di M80.', vi: 'Trứng tích lũy/con ở T45: ~160 trứng. Đúng hướng cho 324 ở T72 và 367 ở T80.' } },
    ],
  },

  // ─── PRODUCTION LATE W46–W80 (Condensed, grouped) ────────────────────────────
  {
    week: 50, phase: 'Layer', title: 'Late Production W46–W55', titleKey: 'layW50Title', emoji: '📉',
    tags: {
      en: ['EP% ~90%', 'Egg weight ~66g', 'W46–W55 window'],
      id: ['EP% ~90%', 'Bobot telur ~66g', 'Jendela M46–M55'],
      vi: ['EP% ~90%', 'KL trứng ~66g', 'Cửa sổ T46–T55'],
    },
    alert: null,
    environment: {
      temp: '18–22°C', rh: '60–70%',
      light: { en: '14 hrs/day', id: '14 jam/hari', vi: '14 giờ/ngày' },
      light_lux: '10–15 lux', nh3: '< 10 ppm', co2: '< 2,500 ppm',
      ventilation: 'Optimized', ventKey: 'ventOptimal',
    },
    specs: [
      { icon: '🥚', label: 'EP% range W46–W55', labelKey: 'specEPTarget', value: '90–93% (H.D.)' },
      { icon: '🥚', label: 'Egg weight W46–W55', labelKey: 'specEggWeight', value: '65–66g' },
      { icon: '📊', label: 'BW range W46–W55', labelKey: 'specBWTarget', value: '1,961–1,983g' },
      { icon: '💡', label: 'Light hours', labelKey: 'specLightIntensity', value: '14 hrs / 10–15 lux' },
      { icon: '🌡️', label: 'House temperature', labelKey: 'specHouseTemp', value: '18–22°C' },
      { icon: '💧', label: 'Water:Feed ratio', labelKey: 'specWaterFeed', value: '~2:1' },
    ],
    feed: { phase: 'Layer', form: 'Pellet/Mash', size: '3 mm', duration: 'Ongoing', intake: 'Ad libitum', water: 'Unlimited' },
    checklist: [
      { id: 'lay_w50_01', text: { en: 'Weekly EP% — track decline trend (<0.5%/week = normal)', id: 'EP% Mingguan — lacak tren penurunan (<0,5%/minggu = normal)', vi: 'EP% hàng tuần — theo dõi xu hướng giảm (<0,5%/tuần = bình thường)' }, priority: 'critical' },
      { id: 'lay_w50_02', text: { en: 'Monthly BW check — target stability around 1,960–1,985g', id: 'Cek BB bulanan — target stabil sekitar 1.960–1.985g', vi: 'Kiểm tra KL hàng tháng — mục tiêu ổn định khoảng 1.960–1.985g' }, priority: 'high' },
      { id: 'lay_w50_03', text: { en: 'Egg quality audit: shell quality, crack rate, dirty egg rate', id: 'Audit kualitas telur: kualitas cangkang, tingkat retak, tingkat telur kotor', vi: 'Kiểm tra chất lượng trứng: chất lượng vỏ, tỷ lệ nứt, tỷ lệ trứng bẩn' }, priority: 'high' },
    ],
    key_points: [
      { icon: '📉', text: { en: 'Normal EP% decline: ~0.5%/week from peak. At W50, cumulative ~193 eggs/hen. Actual performance can be compared to standard data.', id: 'Penurunan EP% normal: ~0,5%/minggu dari puncak. Di M50, kumulatif ~193 telur/ekor. Performa aktual dapat dibandingkan dengan data standar.', vi: 'Suy giảm EP% bình thường: ~0,5%/tuần từ đỉnh. Ở T50, tích lũy ~193 trứng/con. Hiệu suất thực tế có thể so sánh với dữ liệu tiêu chuẩn.' } },
    ],
  },
  {
    week: 60, phase: 'Layer', title: 'Late Production W56–W65', titleKey: 'layW60Title', emoji: '📊',
    tags: {
      en: ['EP% ~88%', 'Egg weight ~66g', 'W56–W65 window'],
      id: ['EP% ~88%', 'Bobot telur ~66g', 'Jendela M56–M65'],
      vi: ['EP% ~88%', 'KL trứng ~66g', 'Cửa sổ T56–T65'],
    },
    alert: null,
    environment: {
      temp: '18–22°C', rh: '60–70%',
      light: { en: '14 hrs/day', id: '14 jam/hari', vi: '14 giờ/ngày' },
      light_lux: '10–15 lux', nh3: '< 10 ppm', co2: '< 2,500 ppm',
      ventilation: 'Optimized', ventKey: 'ventOptimal',
    },
    specs: [
      { icon: '🥚', label: 'EP% range W56–W65', labelKey: 'specEPTarget', value: '86–90% (H.D.)' },
      { icon: '🥚', label: 'Egg weight W56–W65', labelKey: 'specEggWeight', value: '66–67g' },
      { icon: '📊', label: 'BW range W56–W65', labelKey: 'specBWTarget', value: '1,985–2,004g' },
      { icon: '💡', label: 'Light hours', labelKey: 'specLightIntensity', value: '14 hrs / 10–15 lux' },
      { icon: '🌡️', label: 'House temperature', labelKey: 'specHouseTemp', value: '18–22°C' },
      { icon: '💧', label: 'Water:Feed ratio', labelKey: 'specWaterFeed', value: '~2:1' },
    ],
    feed: { phase: 'Layer', form: 'Pellet/Mash', size: '3 mm', duration: 'Ongoing', intake: 'Ad libitum', water: 'Unlimited' },
    checklist: [
      { id: 'lay_w60_01', text: { en: 'Weekly EP% tracking', id: 'Pelacakan EP% Mingguan', vi: 'Theo dõi EP% hàng tuần' }, priority: 'critical' },
      { id: 'lay_w60_02', text: { en: 'Monthly BW — target ~2,000g', id: 'BB Bulanan — target ~2.000g', vi: 'KL hàng tháng — mục tiêu ~2.000g' }, priority: 'high' },
      { id: 'lay_w60_03', text: { en: 'Evaluate cost-benefit of continuation vs culling', id: 'Evaluasi biaya-manfaat lanjut vs afkir', vi: 'Đánh giá chi phí-lợi ích tiếp tục vs loại thải' }, priority: 'high' },
    ],
    key_points: [
      { icon: '💰', text: { en: 'From W60+, evaluate economics monthly: (egg income) vs (feed cost + overhead). Decision point for early culling vs continuing to W80.', id: 'Dari M60+, evaluasi ekonomi bulanan: (pendapatan telur) vs (biaya pakan + overhead). Titik keputusan untuk afkir dini vs lanjut ke M80.', vi: 'Từ T60+, đánh giá kinh tế hàng tháng: (thu nhập trứng) vs (chi phí thức ăn + chi phí chung). Điểm quyết định loại thải sớm vs tiếp tục đến T80.' } },
    ],
  },
  {
    week: 70, phase: 'Layer', title: 'Extended Production W66–W75', titleKey: 'layW70Title', emoji: '⏰',
    tags: {
      en: ['EP% ~84%', 'Egg weight ~67g', 'W66–W75 window'],
      id: ['EP% ~84%', 'Bobot telur ~67g', 'Jendela M66–M75'],
      vi: ['EP% ~84%', 'KL trứng ~67g', 'Cửa sổ T66–T75'],
    },
    alert: null,
    environment: {
      temp: '18–22°C', rh: '60–70%',
      light: { en: '14 hrs/day', id: '14 jam/hari', vi: '14 giờ/ngày' },
      light_lux: '10–15 lux', nh3: '< 10 ppm', co2: '< 2,500 ppm',
      ventilation: 'Optimized', ventKey: 'ventOptimal',
    },
    specs: [
      { icon: '🥚', label: 'EP% range W66–W75', labelKey: 'specEPTarget', value: '82–86% (H.D.)' },
      { icon: '🥚', label: 'Egg weight W66–W75', labelKey: 'specEggWeight', value: '67–67.2g' },
      { icon: '📊', label: 'BW range W66–W75', labelKey: 'specBWTarget', value: '2,006–2,024g' },
      { icon: '💡', label: 'Light hours', labelKey: 'specLightIntensity', value: '14 hrs / 10–15 lux' },
      { icon: '🌡️', label: 'House temperature', labelKey: 'specHouseTemp', value: '18–22°C' },
      { icon: '🏁', label: 'Cumulative eggs W72', labelKey: 'specCumEggs', value: '~324 eggs/HH' },
    ],
    feed: { phase: 'Layer', form: 'Pellet/Mash', size: '3 mm', duration: 'Until target W80', intake: 'Ad libitum', water: 'Unlimited' },
    checklist: [
      { id: 'lay_w70_01', text: { en: 'Weekly EP% tracking', id: 'Pelacakan EP% Mingguan', vi: 'Theo dõi EP% hàng tuần' }, priority: 'critical' },
      { id: 'lay_w70_02', text: { en: 'Cumulative eggs check vs target (324 at W72)', id: 'Cek telur kumulatif vs target (324 di M72)', vi: 'Kiểm tra trứng tích lũy vs mục tiêu (324 ở T72)' }, priority: 'high' },
      { id: 'lay_w70_03', text: { en: 'Shell quality monitoring — cracking increases with age', id: 'Pemantauan kualitas cangkang — keretakan meningkat seiring usia', vi: 'Theo dõi chất lượng vỏ — nứt tăng theo tuổi' }, priority: 'high' },
    ],
    key_points: [
      { icon: '🏁', text: { en: 'Standard target: 324 eggs/HH by W72. If on track, continuation to W80 (367 eggs/HH) is economically justified.', id: 'Target standar: 324 telur/HH pada M72. Jika on track, kelanjutan ke M80 (367 telur/HH) secara ekonomi terjustifikasi.', vi: 'Mục tiêu tiêu chuẩn: 324 trứng/HH ở T72. Nếu đúng hướng, tiếp tục đến T80 (367 trứng/HH) được biện hộ về kinh tế.' } },
    ],
  },
  {
    week: 80, phase: 'Layer', title: 'End of Production Cycle', titleKey: 'layW80Title', emoji: '🏁',
    tags: {
      en: ['EP% ~79%', 'Egg weight ~67.5g', 'Cycle complete'],
      id: ['EP% ~79%', 'Bobot telur ~67,5g', 'Siklus selesai'],
      vi: ['EP% ~79%', 'KL trứng ~67,5g', 'Kết thúc chu kỳ'],
    },
    alert: {
      title: { en: 'End of Production Cycle — W80 Target', id: 'Akhir Siklus Produksi — Target M80', vi: 'Kết thúc Chu kỳ Sản xuất — Mục tiêu T80' },
      text: {
        en: 'Standard targets at W80: 367 eggs/HH cumulative, EP% ~79% H.D., egg weight 67.5g, BW ~2,034g. Record all final KPIs for next cycle planning.',
        id: 'Target standar di M80: 367 telur/HH kumulatif, EP% ~79% H.D., bobot telur 67,5g, BB ~2.034g. Catat semua KPI akhir untuk perencanaan siklus berikutnya.',
        vi: 'Mục tiêu tiêu chuẩn ở T80: 367 trứng/HH tích lũy, EP% ~79% H.D., KL trứng 67,5g, KL ~2.034g. Ghi nhận tất cả KPI cuối cho kế hoạch chu kỳ tiếp theo.',
      },
    },
    environment: {
      temp: '18–22°C', rh: '60–70%',
      light: { en: '14 hrs/day', id: '14 jam/hari', vi: '14 giờ/ngày' },
      light_lux: '10–15 lux', nh3: '< 10 ppm', co2: '< 2,500 ppm',
      ventilation: 'Optimized', ventKey: 'ventOptimal',
    },
    specs: [
      { icon: '🥚', label: 'Target EP% W80', labelKey: 'specEPTarget', value: '~79% (H.D.)' },
      { icon: '🥚', label: 'Target egg weight W80', labelKey: 'specEggWeight', value: '~67.5g' },
      { icon: '📊', label: 'Target cumulative eggs', labelKey: 'specCumEggs', value: '367 eggs/HH' },
      { icon: '📊', label: 'Target BW W80', labelKey: 'specBWTarget', value: '~2,034g' },
      { icon: '💡', label: 'Light hours', labelKey: 'specLightIntensity', value: '14 hrs / 10–15 lux' },
      { icon: '🌡️', label: 'House temperature', labelKey: 'specHouseTemp', value: '18–22°C' },
    ],
    feed: { phase: 'Layer', form: 'Pellet/Mash', size: '3 mm', duration: 'Until depopulation', intake: 'Ad libitum', water: 'Unlimited' },
    checklist: [
      { id: 'lay_w80_01', text: { en: 'Confirm cumulative eggs/HH vs 367 target', id: 'Konfirmasi telur kumulatif/HH vs target 367', vi: 'Xác nhận trứng tích lũy/HH vs mục tiêu 367' }, priority: 'critical' },
      { id: 'lay_w80_02', text: { en: 'Record final performance: EP%, egg weight, BW, livability, total feed consumed', id: 'Catat performa akhir: EP%, bobot telur, BB, daya hidup, total pakan', vi: 'Ghi nhận hiệu suất cuối: EP%, KL trứng, KL, tỷ lệ sống, tổng thức ăn' }, priority: 'critical' },
      { id: 'lay_w80_03', text: { en: 'Plan depopulation schedule', id: 'Rencanakan jadwal depopulasi', vi: 'Lên kế hoạch lịch loại thải' }, priority: 'high' },
      { id: 'lay_w80_04', text: { en: 'Prepare house for cleanout and next cycle', id: 'Persiapkan kandang untuk pembersihan dan siklus berikutnya', vi: 'Chuẩn bị chuồng để vệ sinh và chu kỳ tiếp theo' }, priority: 'high' },
    ],
    key_points: [
      { icon: '📋', text: { en: 'Final cycle KPIs: cumulative eggs/HH, total egg mass (kg), FCR (kg feed/kg egg mass), livability%, avg egg weight. Use for next cycle benchmarking.', id: 'KPI siklus akhir: telur kumulatif/HH, total egg mass (kg), FCR (kg pakan/kg egg mass), daya hidup%, rata-rata bobot telur. Gunakan untuk benchmarking siklus berikutnya.', vi: 'KPI chu kỳ cuối: trứng tích lũy/HH, tổng khối lượng trứng (kg), FCR (kg thức ăn/kg khối lượng trứng), tỷ lệ sống%, KL trứng TB. Dùng để so sánh chu kỳ tiếp theo.' } },
    ],
  },
];
