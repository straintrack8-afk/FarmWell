export const translations = {
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
    symptomOverlap: 'Gejala yang Sama',
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

export const SelectionBox = ({
  title, translations, search, setSearch, category, setCategory,
  severity, setSeverity, filteredDiseases, selected, setSelected, module
}) => {
  const CATEGORIES = ['Viral', 'Bacterial', 'Parasitic', 'Nutritional'];
  
  return (
    <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>{title}</h2>
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
          🔍 {translations.searchDisease}
        </label>
        <input type="text" placeholder={translations.searchPlaceholder} value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: '0.5rem 1rem', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '0.875rem' }} />
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
          📁 {translations.category}
        </label>
        <select value={category} onChange={e => setCategory(e.target.value)}
          style={{ width: '100%', padding: '0.5rem 1rem', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '0.875rem', background: 'white', cursor: 'pointer' }}>
          <option value="">{translations.allCategories}</option>
          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>
      
      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '1rem', marginTop: '1rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
          📋 {translations.selectDisease} ({filteredDiseases.length} {translations.results})
        </label>
        <select value={selected?.id || ''} onChange={e => {
            const diseaseId = e.target.value ? parseInt(e.target.value) : null;
            setSelected(filteredDiseases.find(d => d.id === diseaseId) || null);
          }}
          style={{ width: '100%', padding: '0.5rem 1rem', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '0.875rem', background: 'white', cursor: 'pointer' }}>
          <option value="">{translations.selectDiseasePlaceholder}</option>
          {[...filteredDiseases].sort((a, b) => a.name.localeCompare(b.name)).map(disease => <option key={disease.id} value={disease.id}>{disease.name}</option>)}
        </select>
        
        {selected && (
          <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#D1FAE5', border: '2px solid #10B981', borderRadius: '8px' }}>
            <h3 style={{ fontWeight: '600', fontSize: '0.875rem', color: '#111827', marginBottom: '0.5rem' }}>{selected.name}</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#DBEAFE', color: '#1E40AF', borderRadius: '4px' }}>
                {selected.category}
              </span>
              <span style={{
                fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '4px',
                background: selected.mortalityLevel === 'High' ? '#FEE2E2' : selected.mortalityLevel === 'Moderate' ? '#FEF3C7' : '#D1FAE5',
                color: selected.mortalityLevel === 'High' ? '#991B1B' : selected.mortalityLevel === 'Moderate' ? '#92400E' : '#065F46'
              }}>
                {selected.mortalityLevel}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const ComparisonDisplay = ({ disease1, disease2, translations, module }) => {
  const symptoms1 = (disease1.symptomsEnhanced || []).map(s => s.id);
  const symptoms2 = (disease2.symptomsEnhanced || []).map(s => s.id);
  const common = symptoms1.filter(id => symptoms2.includes(id));
  const unique1 = symptoms1.filter(id => !symptoms2.includes(id));
  const unique2 = symptoms2.filter(id => !symptoms1.includes(id));
  const total = new Set([...symptoms1, ...symptoms2]).size;
  const overlapPct = total > 0 ? Math.round((common.length / total) * 100) : 0;
  
  const getSymptomName = (id) => {
    const s1 = (disease1.symptomsEnhanced || []).find(s => s.id === id);
    const s2 = (disease2.symptomsEnhanced || []).find(s => s.id === id);
    return (s1 || s2)?.name || id;
  };
  
  return (
    <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid #E5E7EB' }}>
        <DiseaseHeader disease={disease1} translations={translations} />
        <DiseaseHeader disease={disease2} translations={translations} />
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
          <SymptomList title={translations.uniqueSymptoms} symptoms={unique1.map(getSymptomName)} />
          <SymptomList title={translations.common} symptoms={common.map(getSymptomName)} />
          <SymptomList title={translations.uniqueSymptoms} symptoms={unique2.map(getSymptomName)} />
        </div>
      </div>
      
      <SideBySideSection title={`📝 ${translations.description}`} translations={translations}
        content1={disease1.description} content2={disease2.description} />
      <SideBySideList title={`🩺 ${translations.clinicalSigns}`} translations={translations}
        list1={disease1.clinicalSigns || []} list2={disease2.clinicalSigns || []} />
      <SideBySideList title={`🦠 ${translations.transmission}`} translations={translations}
        list1={disease1.transmission || []} list2={disease2.transmission || []} />
      <SideBySideList title={`🔬 ${translations.diagnosis}`} translations={translations}
        list1={disease1.diagnosisMethod || []} list2={disease2.diagnosisMethod || []} />
      <SideBySideList title={`💊 ${translations.treatment}`} translations={translations}
        list1={disease1.treatmentOptions || []} list2={disease2.treatmentOptions || []} />
      <SideBySideList title={`🛡️ ${translations.preventionControl}`} translations={translations}
        list1={disease1.controlPrevention || []} list2={disease2.controlPrevention || []} />
    </div>
  );
};

const DiseaseHeader = ({ disease, translations }) => (
  <div style={{ textAlign: 'center' }}>
    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>{disease.name}</h2>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
      <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', background: '#DBEAFE', color: '#1E40AF', borderRadius: '4px' }}>
        {disease.category}
      </span>
      <span style={{
        fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '4px',
        background: disease.mortalityLevel === 'High' ? '#FEE2E2' : '#FEF3C7',
        color: disease.mortalityLevel === 'High' ? '#991B1B' : '#92400E'
      }}>
        {disease.mortalityLevel}
      </span>
      {disease.zoonoticRisk && (
        <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', background: '#FED7AA', color: '#9A3412', borderRadius: '4px' }}>
          {translations.zoonotic}
        </span>
      )}
    </div>
  </div>
);

const SymptomList = ({ title, symptoms }) => (
  <div style={{ padding: '0.75rem', background: 'white', borderRadius: '6px', border: '1px solid #D1D5DB' }}>
    <h4 style={{ fontWeight: '600', color: '#059669', marginBottom: '0.5rem' }}>{title}</h4>
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {symptoms.map((s, i) => (
        <li key={i} style={{ color: '#6B7280', fontSize: '0.75rem', marginBottom: '0.125rem' }}>• {s}</li>
      ))}
    </ul>
  </div>
);

const SideBySideSection = ({ title, translations, content1, content2 }) => (
  <div style={{ border: '2px solid #10B981', borderRadius: '8px', padding: '1rem', background: '#F0FDF4', marginTop: '1.5rem' }}>
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
  <div style={{ border: '2px solid #10B981', borderRadius: '8px', padding: '1rem', background: '#F0FDF4', marginTop: '1.5rem' }}>
    <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#059669', marginBottom: '0.75rem' }}>{title}</h3>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', border: '1px solid #D1D5DB', borderRadius: '6px', overflow: 'hidden' }}>
      <div style={{ padding: '1rem', background: 'white', borderRight: '2px solid #10B981' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {list1.length > 0 ? list1.map((item, i) => (
            <li key={i} style={{ fontSize: '0.875rem', color: '#6B7280', display: 'flex', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <span style={{ marginRight: '0.5rem', color: '#10B981', fontWeight: 'bold' }}>•</span>
              <span>{item}</span>
            </li>
          )) : <li style={{ fontSize: '0.875rem', color: '#9CA3AF', fontStyle: 'italic' }}>{translations.noInformation}</li>}
        </ul>
      </div>
      <div style={{ padding: '1rem', background: 'white' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {list2.length > 0 ? list2.map((item, i) => (
            <li key={i} style={{ fontSize: '0.875rem', color: '#6B7280', display: 'flex', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <span style={{ marginRight: '0.5rem', color: '#10B981', fontWeight: 'bold' }}>•</span>
              <span>{item}</span>
            </li>
          )) : <li style={{ fontSize: '0.875rem', color: '#9CA3AF', fontStyle: 'italic' }}>{translations.noInformation}</li>}
        </ul>
      </div>
    </div>
  </div>
);
