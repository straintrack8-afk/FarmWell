import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';

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
  vn: {
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
  const normalizedLang = language === 'vt' ? 'vn' : language;
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
    
    const langCode = language === 'id' ? 'id' : (language === 'vn' || language === 'vt') ? 'vn' : 'en';
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
    <div style={{ minHeight: '100vh', background: '#F9FAFB', padding: '2rem 0' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
            🔬 {t.pageTitle}
          </h1>
          <p style={{ color: '#6B7280' }}>
            {t.pageSubtitle}
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
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
          <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '3rem', textAlign: 'center' }}>
            <div style={{ color: '#D1D5DB', marginBottom: '0.5rem', fontSize: '3rem' }}>⚖️</div>
            <p style={{ color: '#6B7280' }}>
              {t.selectDiseasePrompt}
            </p>
          </div>
        )}
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
    <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>{title}</h2>
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
          🔍 {translations.searchDisease}
        </label>
        <input
          type="text"
          placeholder={translations.searchPlaceholder}
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem 1rem',
            border: '1px solid #D1D5DB',
            borderRadius: '8px',
            fontSize: '0.875rem'
          }}
        />
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
          📁 {translations.category}
        </label>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem 1rem',
            border: '1px solid #D1D5DB',
            borderRadius: '8px',
            fontSize: '0.875rem',
            background: 'white',
            cursor: 'pointer'
          }}
        >
          <option value="">{translations.allCategories}</option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
          ⚡ {translations.severity}
        </label>
        <select
          value={severity}
          onChange={e => setSeverity(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem 1rem',
            border: '1px solid #D1D5DB',
            borderRadius: '8px',
            fontSize: '0.875rem',
            background: 'white',
            cursor: 'pointer'
          }}
        >
          <option value="">{translations.allSeverities}</option>
          {SEVERITIES.map(sev => (
            <option key={sev} value={sev}>{sev}</option>
          ))}
        </select>
      </div>
      
      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '1rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
          📋 {translations.selectDisease} ({filteredDiseases.length} {translations.results})
        </label>
        <select
          value={selected?.id || ''}
          onChange={e => {
            const diseaseId = e.target.value ? parseInt(e.target.value) : null;
            const disease = filteredDiseases.find(d => d.id === diseaseId);
            setSelected(disease || null);
          }}
          style={{
            width: '100%',
            padding: '0.5rem 1rem',
            border: '1px solid #D1D5DB',
            borderRadius: '8px',
            fontSize: '0.875rem',
            background: 'white',
            cursor: 'pointer'
          }}
        >
          <option value="">{translations.selectDiseasePlaceholder}</option>
          {filteredDiseases.map(disease => (
            <option key={disease.id} value={disease.id}>
              {disease.name || disease.nama}
            </option>
          ))}
        </select>
        
        {selected && (
          <div style={{
            marginTop: '0.75rem',
            padding: '0.75rem',
            background: '#D1FAE5',
            border: '2px solid #10B981',
            borderRadius: '8px'
          }}>
            <h3 style={{ fontWeight: '600', fontSize: '0.875rem', color: '#111827', marginBottom: '0.5rem' }}>
              {selected.name || selected.nama}
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#DBEAFE', color: '#1E40AF', borderRadius: '4px' }}>
                {selected.category || selected.kategori}
              </span>
              <span style={{
                fontSize: '0.75rem',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                background: (selected.severity || selected.tingkat_keparahan) === 'High' ? '#FEE2E2' :
                            (selected.severity || selected.tingkat_keparahan) === 'Medium' ? '#FEF3C7' : '#D1FAE5',
                color: (selected.severity || selected.tingkat_keparahan) === 'High' ? '#991B1B' :
                       (selected.severity || selected.tingkat_keparahan) === 'Medium' ? '#92400E' : '#065F46'
              }}>
                {selected.severity || selected.tingkat_keparahan}
              </span>
            </div>
          </div>
        )}
      </div>
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
  
  return (
    <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
            {disease1.name || disease1.nama}
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', background: '#DBEAFE', color: '#1E40AF', borderRadius: '4px' }}>
              {disease1.category || disease1.kategori}
            </span>
            <span style={{
              fontSize: '0.75rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '4px',
              background: (disease1.severity || disease1.tingkat_keparahan) === 'High' ? '#FEE2E2' : '#FEF3C7',
              color: (disease1.severity || disease1.tingkat_keparahan) === 'High' ? '#991B1B' : '#92400E'
            }}>
              {disease1.severity || disease1.tingkat_keparahan}
            </span>
            {(disease1.zoonotic || disease1.zoonotik) && (
              <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', background: '#FED7AA', color: '#9A3412', borderRadius: '4px' }}>
                {translations.zoonotic}
              </span>
            )}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
            {disease2.name || disease2.nama}
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', background: '#DBEAFE', color: '#1E40AF', borderRadius: '4px' }}>
              {disease2.category || disease2.kategori}
            </span>
            <span style={{
              fontSize: '0.75rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '4px',
              background: (disease2.severity || disease2.tingkat_keparahan) === 'High' ? '#FEE2E2' : '#FEF3C7',
              color: (disease2.severity || disease2.tingkat_keparahan) === 'High' ? '#991B1B' : '#92400E'
            }}>
              {disease2.severity || disease2.tingkat_keparahan}
            </span>
            {(disease2.zoonotic || disease2.zoonotik) && (
              <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', background: '#FED7AA', color: '#9A3412', borderRadius: '4px' }}>
                {translations.zoonotic}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div style={{ background: 'linear-gradient(to right, #D1FAE5, #A7F3D0)', borderRadius: '8px', padding: '1rem', marginTop: '1.5rem', border: '2px solid #10B981' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>📊 {translations.symptomOverlap}</h3>
        <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669' }}>{overlapPct}%</div>
          <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>{common.length} {translations.commonSymptoms}</div>
        </div>
        <div style={{ width: '100%', background: '#E5E7EB', borderRadius: '9999px', height: '12px', marginBottom: '1rem' }}>
          <div style={{ background: '#10B981', height: '12px', borderRadius: '9999px', width: `${overlapPct}%` }}></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem', fontSize: '0.875rem' }}>
          <div style={{ padding: '0.75rem', background: 'white', borderRadius: '6px', border: '1px solid #D1D5DB' }}>
            <h4 style={{ fontWeight: '600', color: '#059669', marginBottom: '0.5rem' }}>
              {translations.uniqueSymptoms}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {unique1.map((id, i) => (
                <li key={i} style={{ color: '#6B7280', fontSize: '0.75rem', marginBottom: '0.125rem' }}>
                  • {getSymptomName(id)}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ padding: '0.75rem', background: 'white', borderRadius: '6px', border: '1px solid #D1D5DB' }}>
            <h4 style={{ fontWeight: '600', color: '#047857', marginBottom: '0.5rem' }}>{translations.common}</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {common.map((id, i) => (
                <li key={i} style={{ color: '#6B7280', fontSize: '0.75rem', marginBottom: '0.125rem' }}>
                  • {getSymptomName(id)}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ padding: '0.75rem', background: 'white', borderRadius: '6px', border: '1px solid #D1D5DB' }}>
            <h4 style={{ fontWeight: '600', color: '#059669', marginBottom: '0.5rem' }}>
              {translations.uniqueSymptoms}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {unique2.map((id, i) => (
                <li key={i} style={{ color: '#6B7280', fontSize: '0.75rem', marginBottom: '0.125rem' }}>
                  • {getSymptomName(id)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: '1.5rem' }}>
        <SideBySideSection title={`📝 ${translations.description}`}
          translations={translations} 
          content1={disease1.description || disease1.deskripsi}
          content2={disease2.description || disease2.deskripsi}
        />
      </div>
      
      <div style={{ marginTop: '1.5rem' }}>
        <SideBySideList title={`🩺 ${translations.clinicalSigns}`}
          translations={translations}
          list1={disease1.clinicalSigns || disease1.tanda_klinis || []}
          list2={disease2.clinicalSigns || disease2.tanda_klinis || []}
        />
      </div>
      
      <div style={{ marginTop: '1.5rem' }}>
        <SideBySideList title={`🦠 ${translations.transmission}`}
          translations={translations}
          list1={disease1.transmission || disease1.transmisi || []}
          list2={disease2.transmission || disease2.transmisi || []}
        />
      </div>
      
      <div style={{ marginTop: '1.5rem' }}>
        <SideBySideList title={`🔬 ${translations.diagnosis}`}
          translations={translations}
          list1={disease1.diagnosis || disease1.diagnosa || []}
          list2={disease2.diagnosis || disease2.diagnosa || []}
        />
      </div>
      
      <div style={{ marginTop: '1.5rem' }}>
        <SideBySideList title={`💊 ${translations.treatment}`}
          translations={translations}
          list1={disease1.treatment || disease1.pengobatan || []}
          list2={disease2.treatment || disease2.pengobatan || []}
        />
      </div>
      
      <div style={{ marginTop: '1.5rem' }}>
        <SideBySideList title={`🛡️ ${translations.preventionControl}`}
          translations={translations}
          list1={disease1.control || disease1.pencegahan || []}
          list2={disease2.control || disease2.pencegahan || []}
        />
      </div>
      
    </div>
  );
};

const SideBySideSection = ({ title, translations, content1, content2 }) => (
  <div style={{ border: '2px solid #10B981', borderRadius: '8px', padding: '1rem', background: '#F0FDF4' }}>
    <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#059669', marginBottom: '0.75rem' }}>{title}</h3>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', border: '1px solid #D1D5DB', borderRadius: '6px', overflow: 'hidden' }}>
      <div style={{ padding: '1rem', background: 'white', borderRight: '2px solid #10B981' }}>
        <p style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: '1.5', margin: 0 }}>
          {content1 || translations.noInformation}
        </p>
      </div>
      <div style={{ padding: '1rem', background: 'white' }}>
        <p style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: '1.5', margin: 0 }}>
          {content2 || translations.noInformation}
        </p>
      </div>
    </div>
  </div>
);

const SideBySideList = ({ title, translations, list1, list2 }) => (
  <div style={{ border: '2px solid #10B981', borderRadius: '8px', padding: '1rem', background: '#F0FDF4' }}>
    <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#059669', marginBottom: '0.75rem' }}>{title}</h3>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', border: '1px solid #D1D5DB', borderRadius: '6px', overflow: 'hidden' }}>
      <div style={{ padding: '1rem', background: 'white', borderRight: '2px solid #10B981' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {list1.length > 0 ? list1.map((item, i) => (
            <li key={i} style={{ fontSize: '0.875rem', color: '#6B7280', display: 'flex', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <span style={{ marginRight: '0.5rem', color: '#10B981', fontWeight: 'bold' }}>•</span>
              <span>{item}</span>
            </li>
          )) : (
            <li style={{ fontSize: '0.875rem', color: '#9CA3AF', fontStyle: 'italic' }}>{translations.noInformation}</li>
          )}
        </ul>
      </div>
      <div style={{ padding: '1rem', background: 'white' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {list2.length > 0 ? list2.map((item, i) => (
            <li key={i} style={{ fontSize: '0.875rem', color: '#6B7280', display: 'flex', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <span style={{ marginRight: '0.5rem', color: '#10B981', fontWeight: 'bold' }}>•</span>
              <span>{item}</span>
            </li>
          )) : (
            <li style={{ fontSize: '0.875rem', color: '#9CA3AF', fontStyle: 'italic' }}>{translations.noInformation}</li>
          )}
        </ul>
      </div>
    </div>
  </div>
);

export default DiseaseComparison;
