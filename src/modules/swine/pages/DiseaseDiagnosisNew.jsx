import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDiagnosis } from '../contexts/DiagnosisContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import '../styles/DiseaseDiagnosis.css';

const SYMPTOM_CATEGORIES = [
  {
    id: 'respiratory',
    emoji: '🫁',
    name: { en: 'Respiratory', id: 'Pernapasan', vi: 'Hô hấp' },
    symptoms: [
      { en: 'Dry cough', id: 'Batuk kering', vi: 'Ho khan' },
      { en: 'Wet cough', id: 'Batuk basah', vi: 'Ho có đờm' },
      { en: 'Open-mouth breathing', id: 'Bernapas dengan mulut terbuka', vi: 'Thở hở miệng' },
      { en: 'Nasal discharge', id: 'Keluar cairan hidung', vi: 'Chảy nước mũi' },
      { en: 'Sneezing', id: 'Bersin', vi: 'Hắt hơi' },
      { en: 'Labored breathing', id: 'Kesulitan bernapas', vi: 'Khó thở' },
      { en: 'Tachypnea', id: 'Napas cepat', vi: 'Thở nhanh' },
      { en: 'Dyspnea', id: 'Sesak napas', vi: 'Khó thở' },
      { en: 'Cyanosis (ears/lips)', id: 'Sianosis (telinga/bibir)', vi: 'Tím tái (tai/môi)' },
      { en: 'Wheezing', id: 'Mengi', vi: 'Thở khò khè' },
      { en: 'Abnormal lung sounds', id: 'Suara paru abnormal', vi: 'Tiếng phổi bất thường' },
      { en: 'Pleuritis signs', id: 'Tanda pleuritis', vi: 'Dấu hiệu viêm màng phổi' }
    ]
  },
  {
    id: 'digestive',
    emoji: '🦠',
    name: { en: 'Digestive', id: 'Pencernaan', vi: 'Tiêu hóa' },
    symptoms: [
      { en: 'Watery diarrhea', id: 'Diare berair', vi: 'Tiêu chảy nước' },
      { en: 'Bloody diarrhea', id: 'Diare berdarah', vi: 'Tiêu chảy có máu' },
      { en: 'Yellow-grey feces', id: 'Feses kuning-abu', vi: 'Phân vàng xám' },
      { en: 'Vomiting', id: 'Muntah', vi: 'Nôn mửa' },
      { en: 'Anorexia', id: 'Anoreksia', vi: 'Chán ăn' },
      { en: 'Weight loss', id: 'Penurunan berat badan', vi: 'Sụt cân' },
      { en: 'Dehydration', id: 'Dehidrasi', vi: 'Mất nước' },
      { en: 'Distended abdomen', id: 'Perut kembung', vi: 'Bụng phình' },
      { en: 'Melena', id: 'Melena', vi: 'Phân đen' },
      { en: 'Rectal prolapse', id: 'Prolaps rektum', vi: 'Sa trực tràng' },
      { en: 'Reduced feed intake', id: 'Asupan pakan berkurang', vi: 'Giảm ăn' },
      { en: 'White scour', id: 'Diare putih', vi: 'Tiêu chảy trắng' }
    ]
  },
  {
    id: 'mortality',
    emoji: '💀',
    name: { en: 'Mortality', id: 'Kematian', vi: 'Tử vong' },
    symptoms: [
      { en: 'Sudden death', id: 'Kematian mendadak', vi: 'Chết đột ngột' },
      { en: 'Mass mortality', id: 'Kematian massal', vi: 'Chết hàng loạt' },
      { en: 'Piglet death (<7d)', id: 'Kematian anak babi (<7h)', vi: 'Chết lợn con (<7 ngày)' },
      { en: 'Pre-weaning death', id: 'Kematian pra-sapih', vi: 'Chết trước cai sữa' },
      { en: 'Post-weaning death', id: 'Kematian pasca-sapih', vi: 'Chết sau cai sữa' },
      { en: 'Sow death', id: 'Kematian induk', vi: 'Chết lợn nái' },
      { en: 'Grower/finisher death', id: 'Kematian grower/finisher', vi: 'Chết lợn thịt' },
      { en: 'Perinatal death', id: 'Kematian perinatal', vi: 'Chết quanh sinh' },
      { en: 'Mummified fetus', id: 'Fetus mumifikasi', vi: 'Thai xác ướp' },
      { en: 'Stillbirth', id: 'Lahir mati', vi: 'Sinh non' }
    ]
  },
  {
    id: 'fever',
    emoji: '🌡️',
    name: { en: 'Fever', id: 'Demam', vi: 'Sốt' },
    symptoms: [
      { en: 'Temp >40°C', id: 'Suhu >40°C', vi: 'Nhiệt độ >40°C' },
      { en: 'Temp >41°C', id: 'Suhu >41°C', vi: 'Nhiệt độ >41°C' },
      { en: 'Prolonged fever (>3d)', id: 'Demam berkepanjangan (>3h)', vi: 'Sốt kéo dài (>3 ngày)' },
      { en: 'Intermittent fever', id: 'Demam intermiten', vi: 'Sốt từng đợt' },
      { en: 'Fever + ear cyanosis', id: 'Demam + sianosis telinga', vi: 'Sốt + tai tím' },
      { en: 'Fever + skin lesions', id: 'Demam + lesi kulit', vi: 'Sốt + tổn thương da' },
      { en: 'Afebrile collapse', id: 'Kolaps tanpa demam', vi: 'Suy sụp không sốt' },
      { en: 'Shivering', id: 'Menggigil', vi: 'Run rẩy' },
      { en: 'Subnormal temperature', id: 'Suhu di bawah normal', vi: 'Nhiệt độ thấp' }
    ]
  },
  {
    id: 'skin',
    emoji: '🔬',
    name: { en: 'Skin', id: 'Kulit', vi: 'Da' },
    symptoms: [
      { en: 'Diffuse redness', id: 'Kemerahan difus', vi: 'Đỏ lan tỏa' },
      { en: 'Diamond-skin lesions', id: 'Lesi kulit berlian', vi: 'Tổn thương da hình thoi' },
      { en: 'Vesicular lesions', id: 'Lesi vesikuler', vi: 'Tổn thương dạng bọng nước' },
      { en: 'Petechiae (pinpoint bleed)', id: 'Petechiae (perdarahan titik)', vi: 'Xuất huyết điểm' },
      { en: 'Ecchymoses (bruising)', id: 'Ekimosis (memar)', vi: 'Bầm tím' },
      { en: 'Ear necrosis/tip', id: 'Nekrosis telinga/ujung', vi: 'Hoại tử tai/đầu' },
      { en: 'Tail wounds', id: 'Luka ekor', vi: 'Vết thương đuôi' },
      { en: 'Pustules', id: 'Pustula', vi: 'Mụn mủ' },
      { en: 'Mange lesions', id: 'Lesi kudis', vi: 'Tổn thương ghẻ' },
      { en: 'Erythema', id: 'Eritema', vi: 'Ban đỏ' },
      { en: 'Foot & mouth lesions', id: 'Lesi kaki & mulut', vi: 'Tổn thương chân tay miệng' },
      { en: 'Swollen snout', id: 'Moncong bengkak', vi: 'Sưng mõm' }
    ]
  },
  {
    id: 'nervous',
    emoji: '🧠',
    name: { en: 'Nervous', id: 'Saraf', vi: 'Thần kinh' },
    symptoms: [
      { en: 'Convulsions/seizures', id: 'Kejang', vi: 'Co giật' },
      { en: 'Muscle tremors', id: 'Tremor otot', vi: 'Run cơ' },
      { en: 'Lateral recumbency', id: 'Berbaring lateral', vi: 'Nằm nghiêng' },
      { en: 'Paddling movements', id: 'Gerakan mengayuh', vi: 'Động tác chèo thuyền' },
      { en: 'Head tilt/pressing', id: 'Kepala miring/menekan', vi: 'Nghiêng đầu/ép đầu' },
      { en: 'Ataxia (wobbling)', id: 'Ataksia (goyah)', vi: 'Mất thăng bằng' },
      { en: 'Hindlimb paresis', id: 'Paresis kaki belakang', vi: 'Liệt chân sau' },
      { en: 'Circling', id: 'Berputar-putar', vi: 'Đi vòng tròn' },
      { en: 'Opisthotonus', id: 'Opistotonus', vi: 'Cong lưng' },
      { en: 'Nystagmus', id: 'Nistagmus', vi: 'Rung giật nhãn cầu' }
    ]
  },
  {
    id: 'reproductive',
    emoji: '🐣',
    name: { en: 'Reproductive', id: 'Reproduksi', vi: 'Sinh sản' },
    symptoms: [
      { en: 'Abortion (any stage)', id: 'Aborsi (semua tahap)', vi: 'Sẩy thai (mọi giai đoạn)' },
      { en: 'Mummified fetuses', id: 'Fetus mumifikasi', vi: 'Thai xác ướp' },
      { en: 'Small litter size', id: 'Ukuran kelahiran kecil', vi: 'Ít con/lứa' },
      { en: 'Agalactia (no milk)', id: 'Agalaksia (tidak ada susu)', vi: 'Không có sữa' },
      { en: 'Return to estrus', id: 'Kembali birahi', vi: 'Động dục lại' },
      { en: 'Vulvar discharge', id: 'Keluaran vulva', vi: 'Tiết âm đạo' },
      { en: 'Endometritis', id: 'Endometritis', vi: 'Viêm nội mạc tử cung' },
      { en: 'Boar infertility', id: 'Infertilitas babi jantan', vi: 'Lợn đực vô sinh' },
      { en: 'Reduced conception rate', id: 'Tingkat konsepsi rendah', vi: 'Tỷ lệ thụ thai thấp' }
    ]
  },
  {
    id: 'systemic',
    emoji: '⚡',
    name: { en: 'Systemic', id: 'Sistemik', vi: 'Toàn thân' },
    symptoms: [
      { en: 'Pallor (pale mucous)', id: 'Pucat (mukosa pucat)', vi: 'Nhợt nhạt (niêm mạc)' },
      { en: 'Jaundice', id: 'Jaundis', vi: 'Vàng da' },
      { en: 'Progressive wasting', id: 'Kurus progresif', vi: 'Gầy dần' },
      { en: 'Reduced growth rate', id: 'Pertumbuhan lambat', vi: 'Chậm lớn' },
      { en: 'Pot-belly appearance', id: 'Perut buncit', vi: 'Bụng phệ' },
      { en: 'Rough/dull hair coat', id: 'Bulu kasar/kusam', vi: 'Lông xù/xỉn' },
      { en: 'Lameness', id: 'Pincang', vi: 'Khập khiễng' },
      { en: 'Joint swelling', id: 'Pembengkakan sendi', vi: 'Sưng khớp' },
      { en: 'Lymph node enlargement', id: 'Pembesaran kelenjar getah bening', vi: 'Hạch to' },
      { en: 'Oedema (legs/face)', id: 'Edema (kaki/wajah)', vi: 'Phù (chân/mặt)' },
      { en: 'Ascites', id: 'Asites', vi: 'Cổ trướng' }
    ]
  }
];

const DiseaseDiagnosisNew = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { selectedAge, diseases, filterDiseasesByAge } = useDiagnosis();

  const [currentStep, setCurrentStep] = useState(2);
  const [selectedSymptoms, setSelectedSymptoms] = useState(new Set());
  const [activeCategory, setActiveCategory] = useState('respiratory');
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileTab, setMobileTab] = useState('symptoms');

  const t = (key, obj) => obj?.[language] || obj?.en || key;

  const ageLabel = selectedAge || 'All ages';

  const toggleSymptom = (symptomName) => {
    const newSelected = new Set(selectedSymptoms);
    if (newSelected.has(symptomName)) {
      newSelected.delete(symptomName);
    } else {
      newSelected.add(symptomName);
    }
    setSelectedSymptoms(newSelected);
  };

  const clearAllSymptoms = () => {
    setSelectedSymptoms(new Set());
  };

  const removeSymptom = (symptomName) => {
    const newSelected = new Set(selectedSymptoms);
    newSelected.delete(symptomName);
    setSelectedSymptoms(newSelected);
  };

  const selectCategory = (catId) => {
    setActiveCategory(catId);
    setSearchTerm('');
    if (window.innerWidth <= 640) {
      setMobileTab('symptoms');
    }
  };

  const matchedDiseases = useMemo(() => {
    if (selectedSymptoms.size === 0 || !diseases) return [];
    
    let filtered = diseases;
    if (selectedAge && selectedAge !== 'All ages' && filterDiseasesByAge) {
      filtered = filterDiseasesByAge(diseases, selectedAge);
    }

    const selectedArray = Array.from(selectedSymptoms);
    
    const scored = filtered.map(disease => {
      const symptomsArray = disease.symptomsEnhanced || disease.symptoms || [];
      const matched = symptomsArray.filter(s => {
        const symptomName = typeof s === 'string' ? s : s.name;
        return selectedArray.some(sel => 
          symptomName.toLowerCase().includes(sel.toLowerCase()) ||
          sel.toLowerCase().includes(symptomName.toLowerCase())
        );
      });
      
      if (matched.length === 0) return null;
      
      const matchWeight = matched.reduce((sum, s) => 
        sum + (typeof s === 'object' ? (s.weight || 0.5) : 0.5), 0
      );
      const totalWeight = symptomsArray.reduce((sum, s) => 
        sum + (typeof s === 'object' ? (s.weight || 0.5) : 0.5), 0
      );
      
      const confidence = totalWeight > 0 ? Math.round((matchWeight / totalWeight) * 1000) / 10 : 0;
      
      return {
        ...disease,
        matchCount: matched.length,
        confidence
      };
    }).filter(d => d);

    return scored.sort((a, b) => b.confidence - a.confidence).slice(0, 8);
  }, [selectedSymptoms, diseases, selectedAge, filterDiseasesByAge]);

  const activeSymptoms = useMemo(() => {
    if (searchTerm) {
      const allSymptoms = SYMPTOM_CATEGORIES.flatMap(cat => 
        cat.symptoms.map(s => ({ ...s, categoryId: cat.id }))
      );
      return allSymptoms.filter(s => 
        t('', s).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    const cat = SYMPTOM_CATEGORIES.find(c => c.id === activeCategory);
    return cat ? cat.symptoms : [];
  }, [activeCategory, searchTerm, language]);

  const getCategorySelectedCount = (catId) => {
    const cat = SYMPTOM_CATEGORIES.find(c => c.id === catId);
    if (!cat) return 0;
    return cat.symptoms.filter(s => selectedSymptoms.has(t('', s))).length;
  };

  const activeCategoryName = useMemo(() => {
    if (searchTerm) {
      return `🔍 ${language === 'en' ? 'Search' : language === 'id' ? 'Pencarian' : 'Tìm kiếm'}: "${searchTerm}"`;
    }
    const cat = SYMPTOM_CATEGORIES.find(c => c.id === activeCategory);
    return cat ? `${cat.emoji} ${t('', cat.name)}` : '';
  }, [activeCategory, searchTerm, language]);

  const selectedInActiveCategory = useMemo(() => {
    return activeSymptoms.filter(s => selectedSymptoms.has(t('', s))).length;
  }, [activeSymptoms, selectedSymptoms, language]);

  return (
    <div className="diagnosis-page">
      {/* Step Progress Bar */}
      <div className="dd-step-bar">
        <div className="dd-step-inner">
          <div className={`dd-step ${currentStep >= 1 ? 'done' : ''}`} onClick={() => navigate('/swine/diagnosis/age')}>
            <div className="dd-step-circle">{currentStep > 1 ? '✓' : '1'}</div>
            <div className="dd-step-text">
              <span className="dd-step-num">Step 1</span>
              <span className="dd-step-name">{language === 'en' ? 'Age' : language === 'id' ? 'Umur' : 'Tuổi'}</span>
            </div>
          </div>
          <div className={`dd-step-connector ${currentStep >= 2 ? 'done' : ''}`}></div>
          <div className={`dd-step ${currentStep === 2 ? 'now' : currentStep > 2 ? 'done' : ''}`}>
            <div className="dd-step-circle">{currentStep > 2 ? '✓' : '2'}</div>
            <div className="dd-step-text">
              <span className="dd-step-num">Step 2</span>
              <span className="dd-step-name">{language === 'en' ? 'Symptoms' : language === 'id' ? 'Gejala' : 'Triệu chứng'}</span>
            </div>
          </div>
          <div className={`dd-step-connector ${currentStep >= 3 ? 'done' : ''}`}></div>
          <div className={`dd-step ${currentStep === 3 ? 'now' : ''}`}>
            <div className="dd-step-circle">3</div>
            <div className="dd-step-text">
              <span className="dd-step-num">Step 3</span>
              <span className="dd-step-name">{language === 'en' ? 'Results' : language === 'id' ? 'Hasil' : 'Kết quả'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="dd-main">
        {/* Hero */}
        <div className="dd-hero">
          <div className="dd-hero-badge">
            🐖 {ageLabel} · {selectedSymptoms.size} {language === 'en' ? 'symptom' : language === 'id' ? 'gejala' : 'triệu chứng'}{selectedSymptoms.size !== 1 ? 's' : ''} {language === 'en' ? 'selected' : language === 'id' ? 'dipilih' : 'đã chọn'}
          </div>
          <h1>{language === 'en' ? 'What symptoms do you observe?' : language === 'id' ? 'Gejala apa yang Anda amati?' : 'Bạn quan sát thấy triệu chứng gì?'}</h1>
          <p>{language === 'en' ? 'Choose a body system below, then select every symptom you can see.' : language === 'id' ? 'Pilih sistem tubuh di bawah, lalu pilih setiap gejala yang Anda lihat.' : 'Chọn hệ thống cơ thể bên dưới, sau đó chọn mọi triệu chứng bạn thấy.'}</p>
        </div>

        {/* Search */}
        <div className="dd-search-row">
          <div className="dd-search-wrap">
            <span className="dd-search-ico">🔍</span>
            <input
              className="dd-search-input"
              type="text"
              placeholder={language === 'en' ? 'Search symptoms…' : language === 'id' ? 'Cari gejala…' : 'Tìm triệu chứng…'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className={`dd-search-clear ${searchTerm ? 'show' : ''}`}
            onClick={() => setSearchTerm('')}
          >
            ✕ {language === 'en' ? 'Clear' : language === 'id' ? 'Hapus' : 'Xóa'}
          </button>
        </div>

        {/* Mobile Tabs */}
        <div className="dd-mobile-tabs">
          <button
            className={`dd-mobile-tab ${mobileTab === 'symptoms' ? 'on' : ''}`}
            onClick={() => setMobileTab('symptoms')}
          >
            <span className="tab-icon">🩺</span>
            {language === 'en' ? 'Symptoms' : language === 'id' ? 'Gejala' : 'Triệu chứng'}
          </button>
          <button
            className={`dd-mobile-tab ${mobileTab === 'selected' ? 'on' : ''}`}
            onClick={() => setMobileTab('selected')}
          >
            <span className="tab-icon">📋</span>
            {language === 'en' ? 'Selected' : language === 'id' ? 'Dipilih' : 'Đã chọn'}
            <span className="tab-badge">{selectedSymptoms.size}</span>
          </button>
          <button
            className={`dd-mobile-tab ${mobileTab === 'results' ? 'on' : ''}`}
            onClick={() => setMobileTab('results')}
          >
            <span className="tab-icon">📊</span>
            {language === 'en' ? 'Results' : language === 'id' ? 'Hasil' : 'Kết quả'}
          </button>
        </div>

        {/* Symptoms Panel */}
        <div className={`dd-mobile-panel ${mobileTab === 'symptoms' ? 'on' : ''}`}>
          <div className="dd-sec-label">{language === 'en' ? 'Body System' : language === 'id' ? 'Sistem Tubuh' : 'Hệ thống cơ thể'}</div>
          
          {/* Category Grid */}
          <div className="dd-cat-grid">
            {SYMPTOM_CATEGORIES.map(cat => {
              const selCount = getCategorySelectedCount(cat.id);
              return (
                <div
                  key={cat.id}
                  className={`dd-cat-card ${activeCategory === cat.id ? 'active' : ''} ${selCount > 0 ? 'has-sel' : ''}`}
                  onClick={() => selectCategory(cat.id)}
                >
                  <div className="dd-cat-sel-badge">{selCount}</div>
                  <div className="dd-cat-emoji-wrap">{cat.emoji}</div>
                  <span className="dd-cat-name">{t('', cat.name)}</span>
                  <span className="dd-cat-pill">
                    {selCount > 0 ? `${selCount} ${language === 'en' ? 'selected' : language === 'id' ? 'dipilih' : 'đã chọn'}` : `${cat.symptoms.length} ${language === 'en' ? 'symp.' : language === 'id' ? 'gej.' : 'tc.'}`}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Symptom Panel */}
          <div className="dd-sym-panel">
            <div className="dd-sym-panel-head">
              <div className="dd-sym-panel-title">{activeCategoryName}</div>
              <div className={`dd-sym-count-badge ${selectedInActiveCategory > 0 ? 'show' : ''}`}>
                {selectedInActiveCategory} {language === 'en' ? 'selected' : language === 'id' ? 'dipilih' : 'đã chọn'}
              </div>
            </div>
            <div className="dd-sym-panel-body">
              {activeSymptoms.length === 0 ? (
                <div className="dd-empty-chips">
                  <div className="dd-empty-chips-icon">😔</div>
                  <div className="dd-empty-chips-msg">
                    {language === 'en' ? 'No symptoms match your search' : language === 'id' ? 'Tidak ada gejala yang cocok dengan pencarian Anda' : 'Không có triệu chứng nào khớp với tìm kiếm của bạn'}
                  </div>
                </div>
              ) : (
                <div className="dd-sym-chips">
                  {activeSymptoms.map((symptom, idx) => {
                    const symptomName = t('', symptom);
                    return (
                      <div
                        key={idx}
                        className={`dd-sym-chip ${selectedSymptoms.has(symptomName) ? 'selected' : ''}`}
                        onClick={() => toggleSymptom(symptomName)}
                      >
                        <span>{symptomName}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Selected Panel */}
        <div className={`dd-mobile-panel ${mobileTab === 'selected' ? 'on' : ''}`}>
          <div className="dd-sel-bar">
            <div className="dd-sel-bar-top">
              <div className="dd-sel-bar-label">
                {language === 'en' ? 'Selected symptoms' : language === 'id' ? 'Gejala yang dipilih' : 'Triệu chứng đã chọn'}
                <span className="dd-sel-count-pill">{selectedSymptoms.size}</span>
              </div>
              <div className="dd-sel-bar-actions">
                <button className="dd-btn-clear-all" onClick={clearAllSymptoms}>
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                  {language === 'en' ? 'Clear all' : language === 'id' ? 'Hapus semua' : 'Xóa tất cả'}
                </button>
              </div>
            </div>
            <div className="dd-sel-pills">
              {selectedSymptoms.size === 0 ? (
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,.35)', padding: '4px 0' }}>
                  {language === 'en' ? 'No symptoms selected yet' : language === 'id' ? 'Belum ada gejala yang dipilih' : 'Chưa chọn triệu chứng nào'}
                </span>
              ) : (
                Array.from(selectedSymptoms).map((symptom, idx) => (
                  <div key={idx} className="dd-sel-pill">
                    {symptom}
                    <button className="dd-sel-pill-del" onClick={() => removeSymptom(symptom)}>
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className={`dd-mobile-panel ${mobileTab === 'results' ? 'on' : ''}`}>
          <div className="dd-results-section">
            <div className="dd-results-head">
              {language === 'en' ? 'Possible Conditions' : language === 'id' ? 'Kondisi yang Mungkin' : 'Tình trạng có thể'}
            </div>
            <div>
              {matchedDiseases.length === 0 ? (
                <div className="dd-empty-results">
                  <div className="dd-empty-results-icon">🔬</div>
                  <div className="dd-empty-results-msg">
                    {language === 'en' ? 'Select symptoms to see possible conditions' : language === 'id' ? 'Pilih gejala untuk melihat kondisi yang mungkin' : 'Chọn triệu chứng để xem tình trạng có thể'}
                  </div>
                </div>
              ) : (
                matchedDiseases.map((disease, idx) => {
                  const diseaseType = disease.type || 'viral';
                  const isNotifiable = disease.notifiable || false;
                  
                  return (
                    <div
                      key={idx}
                      className={`dd-disease-card ${idx === 0 ? 'rank-1' : ''}`}
                      onClick={() => navigate(`/swine/disease/${disease.id}`)}
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      <div className="dd-d-rank">{idx + 1}</div>
                      <div className="dd-d-body">
                        <div className="dd-d-name">{disease.name}</div>
                        <div className="dd-d-bar">
                          <div className="dd-d-fill" style={{ width: `${disease.confidence}%` }}></div>
                        </div>
                        <div className="dd-d-tags">
                          <span className={`dd-d-tag ${diseaseType === 'viral' ? 'viral' : diseaseType === 'bacterial' ? 'bact' : ''}`}>
                            {diseaseType === 'viral' ? (language === 'en' ? 'Viral' : language === 'id' ? 'Virus' : 'Vi-rút') : diseaseType === 'bacterial' ? (language === 'en' ? 'Bacterial' : language === 'id' ? 'Bakteri' : 'Vi khuẩn') : diseaseType}
                          </span>
                          {isNotifiable && (
                            <span className="dd-d-tag notif">
                              {language === 'en' ? 'Notifiable' : language === 'id' ? 'Wajib Lapor' : 'Báo cáo bắt buộc'}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="dd-d-score">
                        <div className="dd-d-pct">
                          {disease.confidence}<span className="dd-d-pct-unit">%</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Action Bar */}
      <div className="dd-action-bar">
        <div className="dd-action-inner">
          <button className="dd-btn-back" onClick={() => navigate('/swine/diagnosis/age')}>
            ← {language === 'en' ? 'Back to Age' : language === 'id' ? 'Kembali ke Umur' : 'Quay lại Tuổi'}
          </button>
          <button className="dd-btn-all" onClick={() => navigate('/swine/diseases')}>
            {language === 'en' ? 'All Diseases' : language === 'id' ? 'Semua Penyakit' : 'Tất cả bệnh'}
          </button>
          <button
            className="dd-btn-diagnose"
            disabled={selectedSymptoms.size === 0}
            onClick={() => {
              if (window.innerWidth <= 640) {
                setMobileTab('results');
              } else {
                document.querySelector('.dd-results-section')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            {language === 'en' ? 'See Results' : language === 'id' ? 'Lihat Hasil' : 'Xem kết quả'} →
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiseaseDiagnosisNew;
