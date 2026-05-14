import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import PoultryTopNav from '../components/common/PoultryTopNav';

const translations = {
  en: {
    pageTitle: 'Comparing Diseases',
    pageSubtitle: 'Select two diseases to compare their characteristics, symptoms, and treatments',
    disease1: 'Disease 1',
    disease2: 'Disease 2',
    searchDisease: 'Search Disease',
    searchPlaceholder: 'Search by name...',
    category: 'Category',
    allCategories: 'All Categories',
    severity: 'Severity',
    allSeverities: 'All Severities',
    selectDisease: 'Select Disease',
    selectDiseasePrompt: 'Select two diseases above to see detailed comparison',
    selectDiseasePlaceholder: '-- Select a disease --',
    results: 'results',
    symptomOverlap: 'Similar Symptom',
    commonSymptoms: 'common symptoms',
    uniqueSymptoms: 'Unique Symptom(s)',
    common: 'Common',
    description: 'Description',
    clinicalSigns: 'Clinical Signs',
    transmission: 'Transmission',
    diagnosis: 'Diagnosis',
    treatment: 'Treatment',
    preventionControl: 'Prevention & Control',
    noInformation: 'No information',
    zoonotic: 'Zoonotic'
  },
  id: {
    pageTitle: 'Membandingkan Penyakit',
    pageSubtitle: 'Pilih dua penyakit untuk membandingkan karakteristik, gejala, dan pengobatan',
    disease1: 'Penyakit 1',
    disease2: 'Penyakit 2',
    searchDisease: 'Cari Penyakit',
    searchPlaceholder: 'Cari berdasarkan nama...',
    category: 'Kategori',
    allCategories: 'Semua Kategori',
    severity: 'Tingkat Keparahan',
    allSeverities: 'Semua Tingkat',
    selectDisease: 'Pilih Penyakit',
    selectDiseasePrompt: 'Pilih dua penyakit di atas untuk melihat perbandingan detail',
    selectDiseasePlaceholder: '-- Pilih penyakit --',
    results: 'hasil',
    symptomOverlap: 'Symptom yang Sama',
    commonSymptoms: 'gejala umum',
    uniqueSymptoms: 'Gejala Unik',
    common: 'Umum',
    description: 'Deskripsi',
    clinicalSigns: 'Gejala Klinis',
    transmission: 'Transmisi',
    diagnosis: 'Diagnosis',
    treatment: 'Pengobatan',
    preventionControl: 'Pencegahan & Kontrol',
    noInformation: 'Tidak ada informasi',
    zoonotic: 'Zoonotik'
  },
  vi: {
    pageTitle: 'So Sánh Bệnh',
    pageSubtitle: 'Chọn hai bệnh để so sánh đặc điểm, triệu chứng và phương pháp điều trị',
    disease1: 'Bệnh 1',
    disease2: 'Bệnh 2',
    searchDisease: 'Tìm Kiếm Bệnh',
    searchPlaceholder: 'Tìm theo tên...',
    category: 'Danh Mục',
    allCategories: 'Tất Cả Danh Mục',
    severity: 'Mức Độ Nghiêm Trọng',
    allSeverities: 'Tất Cả Mức Độ',
    selectDisease: 'Chọn Bệnh',
    selectDiseasePrompt: 'Chọn hai bệnh ở trên để xem so sánh chi tiết',
    selectDiseasePlaceholder: '-- Chọn bệnh --',
    results: 'kết quả',
    symptomOverlap: 'Triệu Chứng Tương Tự',
    commonSymptoms: 'triệu chứng chung',
    uniqueSymptoms: 'Triệu Chứng Độc Nhất',
    common: 'Chung',
    description: 'Mô Tả',
    clinicalSigns: 'Dấu Hiệu Lâm Sàng',
    transmission: 'Lây Truyền',
    diagnosis: 'Chẩn Đoán',
    treatment: 'Điều Trị',
    preventionControl: 'Phòng Ngừa & Kiểm Soát',
    noInformation: 'Không có thông tin',
    zoonotic: 'Zoonotic'
  }
};

const DiseaseComparison = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const normalizedLang = (language === 'vt' || language === 'vn') ? 'vi' : language;
  const t = translations[normalizedLang] || translations.en;
  
  const [allDiseases, setAllDiseases] = useState([]);
  const [selectedDisease1, setSelectedDisease1] = useState(null);
  const [selectedDisease2, setSelectedDisease2] = useState(null);
  
  const [search1, setSearch1] = useState('');
  const [category1, setCategory1] = useState('');
  const [severity1, setSeverity1] = useState('');
  
  const [search2, setSearch2] = useState('');
  const [category2, setCategory2] = useState('');
  const [severity2, setSeverity2] = useState('');
  
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  useEffect(() => {
    // Store current disease IDs before loading new language
    const disease1Id = selectedDisease1?.id;
    const disease2Id = selectedDisease2?.id;
    
    const langCode = language === 'id' ? 'id' : (language === 'vi' || language === 'vn' || language === 'vt') ? 'vi' : 'en';
    fetch(`/data/poultry/diseases_COMPLETE_129_v4.1_ENRICHED_${langCode}.json`)
      .then(res => res.json())
      .then(data => {
        const diseases = data.diseases || data.penyakit || [];
        setAllDiseases(diseases);
        
        // Restore selected diseases by ID in new language
        if (disease1Id) {
          const newDisease1 = diseases.find(d => d.id === disease1Id);
          setSelectedDisease1(newDisease1 || null);
        }
        if (disease2Id) {
          const newDisease2 = diseases.find(d => d.id === disease2Id);
          setSelectedDisease2(newDisease2 || null);
        }
        
        console.log('✅ Loaded', diseases.length, 'diseases');
      })
      .catch(err => console.error('Error loading diseases:', err));
  }, [language]);
  
  const filtered1 = allDiseases.filter(d => {
    const name = (d.name || d.nama || '').toLowerCase();
    const cat = d.category || d.kategori || '';
    const sev = d.severity || d.tingkat_keparahan || '';
    
    const nameMatch = name.includes(search1.toLowerCase());
    const catMatch = !category1 || cat === category1;
    const sevMatch = !severity1 || sev === severity1;
    
    return nameMatch && catMatch && sevMatch;
  });
  
  const filtered2 = allDiseases.filter(d => {
    const name = (d.name || d.nama || '').toLowerCase();
    const cat = d.category || d.kategori || '';
    const sev = d.severity || d.tingkat_keparahan || '';
    
    const nameMatch = name.includes(search2.toLowerCase());
    const catMatch = !category2 || cat === category2;
    const sevMatch = !severity2 || sev === severity2;
    
    return nameMatch && catMatch && sevMatch;
  });
  
  return (
    <div className="fw-module-page">
      <PoultryTopNav title={t.pageTitle} />
      <div className="fw-mod-card">
        <div className="fw-mod-content">
          <p className="fw-mod-subtitle">{t.pageSubtitle}</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <SelectionBox
              title={t.disease1}
              translations={t}
              search={search1}
              setSearch={setSearch1}
              category={category1}
              setCategory={setCategory1}
              severity={severity1}
              setSeverity={setSeverity1}
              filteredDiseases={filtered1}
              selected={selectedDisease1}
              setSelected={setSelectedDisease1}
            />

            <SelectionBox
              title={t.disease2}
              translations={t}
              search={search2}
              setSearch={setSearch2}
              category={category2}
              setCategory={setCategory2}
              severity={severity2}
              setSeverity={setSeverity2}
              filteredDiseases={filtered2}
              selected={selectedDisease2}
              setSelected={setSelectedDisease2}
            />
          </div>

          {selectedDisease1 && selectedDisease2 ? (
            <ComparisonDisplay
              disease1={selectedDisease1}
              disease2={selectedDisease2}
              translations={t}
            />
          ) : (
            <div className="fw-compare-box" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '2.5rem 1rem' }}>
              <svg style={{ width: 36, height: 36, stroke: '#C8E8D4', fill: 'none', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', marginBottom: 12 }} viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              <p style={{ color: 'var(--fw-muted)', fontSize: '12px', fontWeight: 600 }}>
                {t.selectDiseasePrompt}
              </p>
            </div>
          )}
        </div>

        <div className="fw-mod-bnav">
          <button className="fw-mod-bnav-home" onClick={() => navigate('/')}>
            <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span>Home</span>
          </button>
          <button className="fw-mod-bnav-alerts" onClick={() => navigate('/poultry/diagnostic')}>
            <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, stroke: 'white', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><path d="M11 8v6M8 11h6"/></svg>
            <span>Diagnostic</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const SelectionBox = ({
  title,
  translations,
  search,
  setSearch,
  category,
  setCategory,
  severity,
  setSeverity,
  filteredDiseases,
  selected,
  setSelected
}) => {
  const CATEGORIES = ['Viral', 'Bacterial', 'Parasitic', 'Fungal', 'Nutritional', 'Other'];
  const SEVERITIES = ['High', 'Medium', 'Low'];

  return (
    <div className="fw-compare-box">
      <div className="fw-compare-box-label">{title}</div>

      <div className="fw-compare-search">
        <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input
          type="text"
          placeholder={translations.searchPlaceholder}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="fw-compare-filter-row">
        <select className="fw-compare-select" value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">{translations.category}</option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select className="fw-compare-select" value={severity} onChange={e => setSeverity(e.target.value)}>
          <option value="">{translations.severity}</option>
          {SEVERITIES.map(sev => (
            <option key={sev} value={sev}>{sev}</option>
          ))}
        </select>
      </div>

      <select
        className="fw-compare-dropdown"
        value={selected?.id || ''}
        onChange={e => {
          const diseaseId = e.target.value ? parseInt(e.target.value) : null;
          const disease = filteredDiseases.find(d => d.id === diseaseId);
          setSelected(disease || null);
        }}
      >
        <option value="">{translations.selectDisease} ({filteredDiseases.length} {translations.results})</option>
        {filteredDiseases.map(disease => (
          <option key={disease.id} value={disease.id}>
            {disease.name || disease.nama}
          </option>
        ))}
      </select>

      {selected && (
        <div className="fw-compare-selected-card">
          <div className="fw-compare-selected-name">{selected.name || selected.nama}</div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '9px', padding: '2px 7px', background: '#E2E8F0', color: '#334155', borderRadius: '10px', fontWeight: 600 }}>
              {selected.category || selected.kategori}
            </span>
            <span style={{
              fontSize: '9px',
              padding: '2px 7px',
              borderRadius: '10px',
              fontWeight: 600,
              background: (selected.severity || selected.tingkat_keparahan) === 'High' ? '#FEE2E2' :
                          (selected.severity || selected.tingkat_keparahan) === 'Medium' ? '#FFF7ED' : '#F0FDF4',
              color: (selected.severity || selected.tingkat_keparahan) === 'High' ? '#991B1B' :
                     (selected.severity || selected.tingkat_keparahan) === 'Medium' ? '#C2410C' : '#166534'
            }}>
              {selected.severity || selected.tingkat_keparahan}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const ComparisonDisplay = ({ disease1, disease2, translations }) => {
  const symptoms1 = (disease1.symptomsEnhanced || disease1.gejala_lengkap || []).map(s => s.id);
  const symptoms2 = (disease2.symptomsEnhanced || disease2.gejala_lengkap || []).map(s => s.id);
  const common = symptoms1.filter(id => symptoms2.includes(id));
  const unique1 = symptoms1.filter(id => !symptoms2.includes(id));
  const unique2 = symptoms2.filter(id => !symptoms1.includes(id));
  const total = new Set([...symptoms1, ...symptoms2]).size;
  const overlapPct = total > 0 ? Math.round((common.length / total) * 100) : 0;

  const getSymptomName = (id) => {
    const s1 = (disease1.symptomsEnhanced || disease1.gejala_lengkap || []).find(s => s.id === id);
    const s2 = (disease2.symptomsEnhanced || disease2.gejala_lengkap || []).find(s => s.id === id);
    return (s1 || s2)?.name || (s1 || s2)?.nama || id;
  };

  const sevBg = (sev) => sev === 'High' ? '#FEE2E2' : sev === 'Medium' ? '#FFF7ED' : '#F0FDF4';
  const sevCol = (sev) => sev === 'High' ? '#991B1B' : sev === 'Medium' ? '#C2410C' : '#166534';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

      {/* Disease headers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div className="fw-compare-selected-card">
          <div className="fw-compare-selected-name">{disease1.name || disease1.nama}</div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '9px', padding: '2px 7px', background: '#E2E8F0', color: '#334155', borderRadius: '10px', fontWeight: 600 }}>
              {disease1.category || disease1.kategori}
            </span>
            <span style={{ fontSize: '9px', padding: '2px 7px', borderRadius: '10px', fontWeight: 600, background: sevBg(disease1.severity || disease1.tingkat_keparahan), color: sevCol(disease1.severity || disease1.tingkat_keparahan) }}>
              {disease1.severity || disease1.tingkat_keparahan}
            </span>
            {(disease1.zoonotic || disease1.zoonotik) && (
              <span style={{ fontSize: '9px', padding: '2px 7px', background: '#DDF2E8', color: '#1E7A42', borderRadius: '10px', fontWeight: 600 }}>
                {translations.zoonotic}
              </span>
            )}
          </div>
        </div>
        <div className="fw-compare-selected-card">
          <div className="fw-compare-selected-name">{disease2.name || disease2.nama}</div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '9px', padding: '2px 7px', background: '#E2E8F0', color: '#334155', borderRadius: '10px', fontWeight: 600 }}>
              {disease2.category || disease2.kategori}
            </span>
            <span style={{ fontSize: '9px', padding: '2px 7px', borderRadius: '10px', fontWeight: 600, background: sevBg(disease2.severity || disease2.tingkat_keparahan), color: sevCol(disease2.severity || disease2.tingkat_keparahan) }}>
              {disease2.severity || disease2.tingkat_keparahan}
            </span>
            {(disease2.zoonotic || disease2.zoonotik) && (
              <span style={{ fontSize: '9px', padding: '2px 7px', background: '#DDF2E8', color: '#1E7A42', borderRadius: '10px', fontWeight: 600 }}>
                {translations.zoonotic}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Similarity Score */}
      <div className="fw-sim-card">
        <div className="fw-sim-title">
          <svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          {translations.symptomOverlap}
        </div>
        <div className="fw-sim-pct">{overlapPct}%</div>
        <div className="fw-sim-sub">{common.length} {translations.commonSymptoms}</div>
        <div className="fw-sim-bar-wrap">
          <div className="fw-sim-bar" style={{ width: `${overlapPct}%` }}></div>
        </div>
      </div>

      {/* Symptom breakdown */}
      <div className="fw-cmp-section">
        <div className="fw-cmp-section-title">
          <svg viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          {translations.clinicalSigns}
        </div>
        <div className="fw-cmp-cols">
          <div className="fw-cmp-col">
            <div className="fw-cmp-col-title">{translations.uniqueSymptoms}</div>
            {unique1.map((id, i) => (
              <div key={i} style={{ marginBottom: '3px' }}>• {getSymptomName(id)}</div>
            ))}
          </div>
          <div className="fw-cmp-col-common">
            <div className="fw-cmp-col-title">{translations.common} ({common.length})</div>
            {common.map((id, i) => (
              <div key={i} style={{ marginBottom: '3px' }}>• {getSymptomName(id)}</div>
            ))}
          </div>
          <div className="fw-cmp-col">
            <div className="fw-cmp-col-title">{translations.uniqueSymptoms}</div>
            {unique2.map((id, i) => (
              <div key={i} style={{ marginBottom: '3px' }}>• {getSymptomName(id)}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Description */}
      <SideBySideSection
        title={translations.description}
        icon={<svg viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/><path d="M9 12h6M9 16h4"/></svg>}
        translations={translations}
        content1={disease1.description || disease1.deskripsi}
        content2={disease2.description || disease2.deskripsi}
      />

      {/* Transmission */}
      <SideBySideList
        title={translations.transmission}
        icon={<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5.64 5.64l2.12 2.12M16.24 16.24l2.12 2.12M5.64 18.36l2.12-2.12M16.24 7.76l2.12-2.12"/></svg>}
        translations={translations}
        list1={disease1.transmission || disease1.transmisi || []}
        list2={disease2.transmission || disease2.transmisi || []}
      />

      {/* Diagnosis */}
      <SideBySideList
        title={translations.diagnosis}
        icon={<svg viewBox="0 0 24 24"><path d="M6 3h12M6 8h12M6 13h12M6 18h12"/></svg>}
        translations={translations}
        list1={disease1.diagnosis || disease1.diagnosa || []}
        list2={disease2.diagnosis || disease2.diagnosa || []}
      />

      {/* Treatment */}
      <SideBySideList
        title={translations.treatment}
        icon={<svg viewBox="0 0 24 24"><path d="M10.5 20H4a2 2 0 01-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 011.66.9l.82 1.2a2 2 0 001.66.9H20a2 2 0 012 2v3"/><path d="M16 19h6M19 16v6"/></svg>}
        translations={translations}
        list1={disease1.treatment || disease1.pengobatan || []}
        list2={disease2.treatment || disease2.pengobatan || []}
      />

      {/* Prevention & Control */}
      <SideBySideList
        title={translations.preventionControl}
        icon={<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
        translations={translations}
        list1={disease1.control || disease1.pengendalian || disease1.pencegahan || []}
        list2={disease2.control || disease2.pengendalian || disease2.pencegahan || []}
      />

    </div>
  );
};

const SideBySideSection = ({ title, icon, translations, content1, content2 }) => (
  <div className="fw-cmp-section">
    <div className="fw-cmp-section-title">{icon}{title}</div>
    <div className="fw-cmp-cols">
      <div className="fw-cmp-col">{content1 || translations.noInformation}</div>
      <div className="fw-cmp-col">{content2 || translations.noInformation}</div>
    </div>
  </div>
);

const SideBySideList = ({ title, icon, translations, list1, list2 }) => (
  <div className="fw-cmp-section">
    <div className="fw-cmp-section-title">{icon}{title}</div>
    <div className="fw-cmp-cols">
      <div className="fw-cmp-col">
        {list1.length > 0 ? list1.map((item, i) => (
          <div key={i} style={{ marginBottom: '3px', display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
            <span style={{ color: '#2EAA5E', fontWeight: 700 }}>•</span>
            <span>{item}</span>
          </div>
        )) : (
          <span style={{ fontStyle: 'italic', color: 'var(--fw-muted)' }}>{translations.noInformation}</span>
        )}
      </div>
      <div className="fw-cmp-col">
        {list2.length > 0 ? list2.map((item, i) => (
          <div key={i} style={{ marginBottom: '3px', display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
            <span style={{ color: '#2EAA5E', fontWeight: 700 }}>•</span>
            <span>{item}</span>
          </div>
        )) : (
          <span style={{ fontStyle: 'italic', color: 'var(--fw-muted)' }}>{translations.noInformation}</span>
        )}
      </div>
    </div>
  </div>
);

export default DiseaseComparison;
