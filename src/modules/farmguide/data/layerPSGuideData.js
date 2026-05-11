// layerPSGuideData.js
// Layer Parent Stock management guide data
// Source: Layer PS Management Handbook (generic PS standards)
// Phases: Rearing W1–W18, Production W19–W75

export const LAYER_PS_GUIDE = [
  {
    week: 1,
    phase: 'rearing',
    phaseRange: {
      en: 'W1–W4 · Brooding & Early Rearing',
      id: 'M1–M4 · Brooding & Awal Pemeliharaan',
      vi: 'T1–T4 · Úm & Nuôi Giai Đoạn Đầu',
    },
    environment: {
      temperature: { en: '33–35°C (brooder area)', id: '33–35°C (area brooder)', vi: '33–35°C (khu vực úm)' },
      humidity: { en: '60–70%', id: '60–70%', vi: '60–70%' },
      lighting: { en: '23 hrs light, 1 hr dark — high intensity', id: '23 jam terang, 1 jam gelap — intensitas tinggi', vi: '23 giờ sáng, 1 giờ tối — cường độ cao' },
      lightIntensity: { en: '30–40 lux at chick level', id: '30–40 lux di level anak ayam', vi: '30–40 lux ở mức gà con' },
      ventilation: { en: 'Minimum ventilation — avoid drafts on chicks', id: 'Ventilasi minimum — hindari angin pada anak ayam', vi: 'Thông gió tối thiểu — tránh gió lùa vào gà con' },
    },
    feedProgram: {
      feedType: { en: 'Chick Starter (high protein 18–20%)', id: 'Starter Anak Ayam (protein tinggi 18–20%)', vi: 'Thức ăn Khởi đầu (protein cao 18–20%)' },
      feedIntake: { en: 'Ad libitum (free access)', id: 'Ad libitum (akses bebas)', vi: 'Tự do (tiếp cận tự do)' },
      notes: { en: 'Ensure 100% crop fill within 24 hrs of placement', id: 'Pastikan 100% crop fill dalam 24 jam penempatan', vi: 'Đảm bảo 100% diều đầy trong vòng 24 giờ đặt gà' },
    },
    checklist: [
      { en: 'Check brooder temperature at chick level', id: 'Periksa suhu brooder di level anak ayam', vi: 'Kiểm tra nhiệt độ úm ở mức gà con' },
      { en: 'Verify crop fill at 24 hrs — target 100%', id: 'Periksa crop fill di 24 jam — target 100%', vi: 'Kiểm tra diều đầy lúc 24 giờ — mục tiêu 100%' },
      { en: 'Check water access and nipple flow rate', id: 'Periksa akses air dan laju nipple', vi: 'Kiểm tra tiếp cận nước và lưu lượng núm uống' },
      { en: 'Record daily mortality', id: 'Catat mortalitas harian', vi: 'Ghi chép tỷ lệ chết hàng ngày' },
      { en: 'Observe chick behavior and distribution', id: 'Amati perilaku dan distribusi anak ayam', vi: 'Quan sát hành vi và phân bổ gà con' },
    ],
  },
  {
    week: 5,
    phase: 'rearing',
    phaseRange: {
      en: 'W5–W10 · Frame Development',
      id: 'M5–M10 · Pengembangan Rangka',
      vi: 'T5–T10 · Phát Triển Khung Xương',
    },
    environment: {
      temperature: { en: '20–22°C (house temperature)', id: '20–22°C (suhu kandang)', vi: '20–22°C (nhiệt độ chuồng)' },
      humidity: { en: '50–70%', id: '50–70%', vi: '50–70%' },
      lighting: { en: 'Reduce to 10–12 hrs — step-down program', id: 'Kurangi ke 10–12 jam — program step-down', vi: 'Giảm xuống 10–12 giờ — chương trình giảm dần' },
      lightIntensity: { en: '5–10 lux', id: '5–10 lux', vi: '5–10 lux' },
      ventilation: { en: 'Increase ventilation as birds grow', id: 'Tingkatkan ventilasi seiring pertumbuhan ayam', vi: 'Tăng thông gió khi gà lớn dần' },
    },
    feedProgram: {
      feedType: { en: 'Pullet Grower (protein 15–16%)', id: 'Pullet Grower (protein 15–16%)', vi: 'Thức ăn Tăng trưởng (protein 15–16%)' },
      feedIntake: { en: 'Controlled feeding — match to BW targets', id: 'Pemberian pakan terkontrol — sesuai target BW', vi: 'Cho ăn kiểm soát — theo mục tiêu BW' },
      notes: { en: 'Weekly weighing essential — adjust feed to maintain BW target', id: 'Penimbangan mingguan penting — sesuaikan pakan untuk target BW', vi: 'Cân nặng hàng tuần quan trọng — điều chỉnh thức ăn để duy trì mục tiêu BW' },
    },
    checklist: [
      { en: 'Weigh 5% of flock weekly — check uniformity CV%', id: 'Timbang 5% flock per minggu — periksa keseragaman CV%', vi: 'Cân 5% đàn hàng tuần — kiểm tra độ đồng đều CV%' },
      { en: 'Adjust feed allocation based on BW vs target', id: 'Sesuaikan alokasi pakan berdasarkan BW vs target', vi: 'Điều chỉnh lượng thức ăn dựa trên BW so với mục tiêu' },
      { en: 'Monitor lighting hours strictly', id: 'Pantau jam pencahayaan secara ketat', vi: 'Giám sát giờ chiếu sáng nghiêm ngặt' },
      { en: 'Check feeder and drinker space adequacy', id: 'Periksa kecukupan ruang feeder dan drinker', vi: 'Kiểm tra không gian máng ăn và máng uống' },
      { en: 'Record feed consumption per bird', id: 'Catat konsumsi pakan per ekor', vi: 'Ghi chép lượng thức ăn tiêu thụ mỗi con' },
    ],
  },
  {
    week: 11,
    phase: 'rearing',
    phaseRange: {
      en: 'W11–W16 · Gut & Feed Intake Development',
      id: 'M11–M16 · Pengembangan Saluran Cerna & Asupan Pakan',
      vi: 'T11–T16 · Phát Triển Đường Tiêu Hóa & Lượng Thức Ăn',
    },
    environment: {
      temperature: { en: '18–22°C', id: '18–22°C', vi: '18–22°C' },
      humidity: { en: '50–70%', id: '50–70%', vi: '50–70%' },
      lighting: { en: '8–10 hrs constant — stimulatory light withheld', id: '8–10 jam konstan — cahaya stimulasi ditahan', vi: '8–10 giờ ổn định — ánh sáng kích thích bị giữ lại' },
      lightIntensity: { en: '5–10 lux', id: '5–10 lux', vi: '5–10 lux' },
      ventilation: { en: 'Adequate air exchange — 0.7–1.0 m³/hr/kg bodyweight', id: 'Pertukaran udara cukup — 0.7–1.0 m³/jam/kg bobot', vi: 'Trao đổi không khí đủ — 0.7–1.0 m³/giờ/kg thể trọng' },
    },
    feedProgram: {
      feedType: { en: 'Developer feed (protein 14–15%, high fibre 5–6%)', id: 'Pakan Developer (protein 14–15%, serat tinggi 5–6%)', vi: 'Thức ăn Phát triển (protein 14–15%, xơ cao 5–6%)' },
      feedIntake: { en: 'Strictly controlled — use skip-a-day or 5/2 program', id: 'Sangat terkontrol — gunakan program skip-a-day atau 5/2', vi: 'Kiểm soát nghiêm ngặt — dùng chương trình cách ngày hoặc 5/2' },
      notes: { en: 'High-fibre diet supports gut development and reduces feather pecking', id: 'Pakan serat tinggi mendukung perkembangan saluran cerna dan mengurangi feather pecking', vi: 'Chế độ ăn nhiều xơ hỗ trợ phát triển đường ruột và giảm mổ lông' },
    },
    checklist: [
      { en: 'Maintain strict 8-hr lighting — no light leaks', id: 'Pertahankan pencahayaan 8 jam ketat — tidak ada kebocoran cahaya', vi: 'Duy trì chiếu sáng 8 giờ nghiêm ngặt — không rò rỉ ánh sáng' },
      { en: 'Weigh flock weekly — target CV% < 8%', id: 'Timbang flock mingguan — target CV% < 8%', vi: 'Cân đàn hàng tuần — mục tiêu CV% < 8%' },
      { en: 'Check feather condition — monitor pecking behavior', id: 'Periksa kondisi bulu — pantau perilaku pecking', vi: 'Kiểm tra tình trạng lông — theo dõi hành vi mổ' },
      { en: 'Provide insoluble fibre supplement if needed', id: 'Berikan suplemen serat tidak larut jika diperlukan', vi: 'Cung cấp chất xơ không hòa tan nếu cần' },
      { en: 'Record mortality and culls', id: 'Catat mortalitas dan culling', vi: 'Ghi chép tỷ lệ chết và loại thải' },
    ],
  },
  {
    week: 17,
    phase: 'rearing',
    phaseRange: {
      en: 'W17–W18 · Pre-Lay Preparation',
      id: 'M17–M18 · Persiapan Pra-Bertelur',
      vi: 'T17–T18 · Chuẩn Bị Trước Đẻ',
    },
    environment: {
      temperature: { en: '18–22°C', id: '18–22°C', vi: '18–22°C' },
      humidity: { en: '50–70%', id: '50–70%', vi: '50–70%' },
      lighting: { en: 'Increase to 14–16 hrs — photostimulation', id: 'Tingkatkan ke 14–16 jam — fotostimulasi', vi: 'Tăng lên 14–16 giờ — kích thích quang học' },
      lightIntensity: { en: 'Increase to 20–40 lux', id: 'Tingkatkan ke 20–40 lux', vi: 'Tăng lên 20–40 lux' },
      ventilation: { en: 'Maintain good air quality — reduce NH₃ < 20 ppm', id: 'Pertahankan kualitas udara baik — NH₃ < 20 ppm', vi: 'Duy trì chất lượng không khí tốt — NH₃ < 20 ppm' },
    },
    feedProgram: {
      feedType: { en: 'Pre-lay feed (Ca 2.0–2.5%, protein 16–17%)', id: 'Pakan Pre-lay (Ca 2.0–2.5%, protein 16–17%)', vi: 'Thức ăn Tiền đẻ (Ca 2.0–2.5%, protein 16–17%)' },
      feedIntake: { en: 'Increase feed gradually — 80–90 g/day', id: 'Tingkatkan pakan secara bertahap — 80–90 g/hari', vi: 'Tăng thức ăn dần dần — 80–90 g/ngày' },
      notes: { en: 'Pre-lay diet for 10 days before first egg — increases calcium reserve', id: 'Pakan pre-lay selama 10 hari sebelum telur pertama — meningkatkan cadangan kalsium', vi: 'Thức ăn tiền đẻ 10 ngày trước trứng đầu tiên — tăng dự trữ canxi' },
    },
    checklist: [
      { en: 'Apply photostimulation lighting program', id: 'Terapkan program pencahayaan fotostimulasi', vi: 'Áp dụng chương trình chiếu sáng kích thích quang học' },
      { en: 'Switch to pre-lay feed 10 days before expected first egg', id: 'Ganti ke pakan pre-lay 10 hari sebelum perkiraan telur pertama', vi: 'Chuyển sang thức ăn tiền đẻ 10 ngày trước dự kiến trứng đầu tiên' },
      { en: 'Prepare nesting boxes — 1 nest per 5 hens', id: 'Siapkan kotak sarang — 1 sarang per 5 betina', vi: 'Chuẩn bị ổ đẻ — 1 ổ cho 5 mái' },
      { en: 'Final uniformity check — cull underweight birds', id: 'Pemeriksaan keseragaman akhir — afkir ayam kurus', vi: 'Kiểm tra độ đồng đều cuối — loại gà nhẹ cân' },
      { en: 'Verify male:female ratio — target 1:8–10', id: 'Periksa rasio jantan:betina — target 1:8–10', vi: 'Kiểm tra tỷ lệ trống:mái — mục tiêu 1:8–10' },
    ],
  },
  {
    week: 19,
    phase: 'production',
    phaseRange: {
      en: 'W19–W30 · Early Production & Peak Lay',
      id: 'M19–M30 · Awal Produksi & Puncak Bertelur',
      vi: 'T19–T30 · Sản Xuất Đầu & Đỉnh Đẻ',
    },
    environment: {
      temperature: { en: '18–22°C', id: '18–22°C', vi: '18–22°C' },
      humidity: { en: '50–70%', id: '50–70%', vi: '50–70%' },
      lighting: { en: '16 hrs light — maintain constant', id: '16 jam terang — pertahankan konstan', vi: '16 giờ sáng — duy trì ổn định' },
      lightIntensity: { en: '20–40 lux', id: '20–40 lux', vi: '20–40 lux' },
      ventilation: { en: 'Good air exchange — NH₃ < 15 ppm, CO₂ < 3000 ppm', id: 'Pertukaran udara baik — NH₃ < 15 ppm, CO₂ < 3000 ppm', vi: 'Trao đổi không khí tốt — NH₃ < 15 ppm, CO₂ < 3000 ppm' },
    },
    feedProgram: {
      feedType: { en: 'Layer Breeder Phase 1 (protein 17–18%, Ca 3.5–4.0%)', id: 'Breeder Layer Fase 1 (protein 17–18%, Ca 3.5–4.0%)', vi: 'Breeder Đẻ Giai đoạn 1 (protein 17–18%, Ca 3.5–4.0%)' },
      feedIntake: { en: '110–120 g/day — adjust to maintain BW', id: '110–120 g/hari — sesuaikan untuk mempertahankan BW', vi: '110–120 g/ngày — điều chỉnh để duy trì BW' },
      notes: { en: 'Increase feed as EP% rises toward peak — monitor BW weekly', id: 'Tingkatkan pakan seiring EP% naik ke puncak — pantau BW mingguan', vi: 'Tăng thức ăn khi EP% tăng đến đỉnh — theo dõi BW hàng tuần' },
    },
    checklist: [
      { en: 'Collect hatching eggs minimum 4× per day', id: 'Kumpulkan telur tetas minimum 4× per hari', vi: 'Thu gom trứng ấp tối thiểu 4× mỗi ngày' },
      { en: 'Record EP% daily — compare to standard', id: 'Catat EP% harian — bandingkan dengan standar', vi: 'Ghi EP% hàng ngày — so sánh với tiêu chuẩn' },
      { en: 'Monitor male:female ratio — target 1:8–10', id: 'Pantau rasio jantan:betina — target 1:8–10', vi: 'Theo dõi tỷ lệ trống:mái — mục tiêu 1:8–10' },
      { en: 'Weigh males and females weekly', id: 'Timbang jantan dan betina mingguan', vi: 'Cân trống và mái hàng tuần' },
      { en: 'Monitor fertility — target > 95% by W30', id: 'Pantau fertilitas — target > 95% pada M30', vi: 'Theo dõi tỷ lệ thụ tinh — mục tiêu > 95% đến T30' },
    ],
  },
  {
    week: 31,
    phase: 'production',
    phaseRange: {
      en: 'W31–W50 · Mid Production',
      id: 'M31–M50 · Produksi Pertengahan',
      vi: 'T31–T50 · Sản Xuất Giữa Kỳ',
    },
    environment: {
      temperature: { en: '18–22°C', id: '18–22°C', vi: '18–22°C' },
      humidity: { en: '50–70%', id: '50–70%', vi: '50–70%' },
      lighting: { en: '16 hrs — no changes during production', id: '16 jam — tidak ada perubahan selama produksi', vi: '16 giờ — không thay đổi trong suốt sản xuất' },
      lightIntensity: { en: '20–40 lux', id: '20–40 lux', vi: '20–40 lux' },
      ventilation: { en: 'Maintain NH₃ < 15 ppm — increase in hot weather', id: 'Pertahankan NH₃ < 15 ppm — tingkatkan saat cuaca panas', vi: 'Duy trì NH₃ < 15 ppm — tăng cường khi thời tiết nóng' },
    },
    feedProgram: {
      feedType: { en: 'Layer Breeder Phase 2 (protein 16–17%, Ca 4.0–4.5%)', id: 'Breeder Layer Fase 2 (protein 16–17%, Ca 4.0–4.5%)', vi: 'Breeder Đẻ Giai đoạn 2 (protein 16–17%, Ca 4.0–4.5%)' },
      feedIntake: { en: '105–115 g/day — reduce slightly as EP% declines', id: '105–115 g/hari — kurangi sedikit seiring EP% menurun', vi: '105–115 g/ngày — giảm nhẹ khi EP% giảm' },
      notes: { en: 'Increase Ca intake to maintain eggshell quality as hens age', id: 'Tingkatkan asupan Ca untuk menjaga kualitas kerabang seiring bertambahnya usia', vi: 'Tăng lượng Ca để duy trì chất lượng vỏ trứng khi gà già hơn' },
    },
    checklist: [
      { en: 'Collect hatching eggs minimum 4× per day', id: 'Kumpulkan telur tetas minimum 4× per hari', vi: 'Thu gom trứng ấp tối thiểu 4× mỗi ngày' },
      { en: 'Monitor eggshell quality — check for thin shells', id: 'Pantau kualitas kerabang — periksa kerabang tipis', vi: 'Theo dõi chất lượng vỏ trứng — kiểm tra vỏ mỏng' },
      { en: 'Check spiking males if fertility drops below 90%', id: 'Periksa spiking jantan jika fertilitas turun di bawah 90%', vi: 'Kiểm tra ghép thêm trống nếu tỷ lệ thụ tinh giảm dưới 90%' },
      { en: 'Weigh sample birds weekly', id: 'Timbang sampel ayam mingguan', vi: 'Cân mẫu gà hàng tuần' },
      { en: 'Record floor eggs — target < 2%', id: 'Catat telur lantai — target < 2%', vi: 'Ghi chép trứng sàn — mục tiêu < 2%' },
    ],
  },
  {
    week: 51,
    phase: 'production',
    phaseRange: {
      en: 'W51–W75 · Late Production',
      id: 'M51–M75 · Produksi Akhir',
      vi: 'T51–T75 · Sản Xuất Cuối Kỳ',
    },
    environment: {
      temperature: { en: '18–22°C', id: '18–22°C', vi: '18–22°C' },
      humidity: { en: '50–70%', id: '50–70%', vi: '50–70%' },
      lighting: { en: '16 hrs — maintain constant to end of cycle', id: '16 jam — pertahankan konstan hingga akhir siklus', vi: '16 giờ — duy trì ổn định đến cuối chu kỳ' },
      lightIntensity: { en: '20–40 lux', id: '20–40 lux', vi: '20–40 lux' },
      ventilation: { en: 'Adequate ventilation — focus on litter quality', id: 'Ventilasi cukup — fokus pada kualitas litter', vi: 'Thông gió đủ — tập trung vào chất lượng độn chuồng' },
    },
    feedProgram: {
      feedType: { en: 'Layer Breeder Phase 3 (protein 15–16%, Ca 4.5–5.0%)', id: 'Breeder Layer Fase 3 (protein 15–16%, Ca 4.5–5.0%)', vi: 'Breeder Đẻ Giai đoạn 3 (protein 15–16%, Ca 4.5–5.0%)' },
      feedIntake: { en: '100–110 g/day', id: '100–110 g/hari', vi: '100–110 g/ngày' },
      notes: { en: 'High Ca critical for eggshell quality in late lay — consider limestone grit supplementation', id: 'Ca tinggi kritis untuk kualitas kerabang di akhir lay — pertimbangkan suplemen limestone grit', vi: 'Ca cao quan trọng cho chất lượng vỏ trứng cuối kỳ — xem xét bổ sung đá vôi thô' },
    },
    checklist: [
      { en: 'Monitor EP% decline rate — compare to standard curve', id: 'Pantau laju penurunan EP% — bandingkan dengan kurva standar', vi: 'Theo dõi tốc độ giảm EP% — so sánh với đường chuẩn' },
      { en: 'Assess eggshell quality weekly', id: 'Nilai kualitas kerabang mingguan', vi: 'Đánh giá chất lượng vỏ trứng hàng tuần' },
      { en: 'Plan flock depletion schedule', id: 'Rencanakan jadwal deplesi flock', vi: 'Lập kế hoạch lịch trình loại thải đàn' },
      { en: 'Check male condition and replace if needed', id: 'Periksa kondisi jantan dan ganti jika diperlukan', vi: 'Kiểm tra tình trạng trống và thay thế nếu cần' },
      { en: 'Maintain hatching egg hygiene standards', id: 'Pertahankan standar kebersihan telur tetas', vi: 'Duy trì tiêu chuẩn vệ sinh trứng ấp' },
    ],
  },
];
