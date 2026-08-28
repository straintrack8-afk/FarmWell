import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import {
  translations,
  SelectionBox,
  ComparisonDisplay
} from '../components/comparison/ComparisonHelpers';
import PigWellTopNav from '../components/common/PigWellTopNav';

const DiseaseComparisonPage = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const t = translations[language] || translations.en;

  const [allDiseases, setAllDiseases] = useState([]);
  const [selectedDisease1, setSelectedDisease1] = useState(null);
  const [selectedDisease2, setSelectedDisease2] = useState(null);
  const [search1, setSearch1] = useState('');
  const [category1, setCategory1] = useState('');
  const [search2, setSearch2] = useState('');
  const [category2, setCategory2] = useState('');

  useEffect(() => {
    const disease1Id = selectedDisease1?.id;
    const disease2Id = selectedDisease2?.id;
    const langCode = language === 'id' ? 'id' : (language === 'vi' || language === 'vn') ? 'vi' : 'en';

    fetch('/data/swine/pig_diseases_COMPLETE_104_v1.0_ENRICHED_' + langCode + '.json')
      .then(res => res.json())
      .then(data => {
        const diseases = data.diseases || [];
        setAllDiseases(diseases);
        if (disease1Id) setSelectedDisease1(diseases.find(d => d.id === disease1Id) || null);
        if (disease2Id) setSelectedDisease2(diseases.find(d => d.id === disease2Id) || null);
      })
      .catch(err => console.error('Failed to load diseases:', err));
  }, [language]);

  const filtered1 = allDiseases.filter(d => {
    const name = (d.name || '').toLowerCase();
    return name.includes(search1.toLowerCase()) &&
           (!category1 || d.category === category1);
  });

  const filtered2 = allDiseases.filter(d => {
    const name = (d.name || '').toLowerCase();
    return name.includes(search2.toLowerCase()) &&
           (!category2 || d.category === category2);
  });

  return (
    <div className="fw-module-page">
      <PigWellTopNav title={t.pageTitle || 'Compare Diseases'} backPath="/swine/diagnostic" />
      <div className="fw-mod-card" style={{ marginTop: -18, borderRadius: '16px 16px 12px 12px' }}>
        <div className="fw-mod-content">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <SelectionBox
              title={t.disease1}
              translations={t}
              search={search1}
              setSearch={setSearch1}
              category={category1}
              setCategory={setCategory1}
              filteredDiseases={filtered1}
              selected={selectedDisease1}
              setSelected={setSelectedDisease1}
              module="swine"
            />
            <SelectionBox
              title={t.disease2}
              translations={t}
              search={search2}
              setSearch={setSearch2}
              category={category2}
              setCategory={setCategory2}
              filteredDiseases={filtered2}
              selected={selectedDisease2}
              setSelected={setSelectedDisease2}
              module="swine"
            />
          </div>

          {selectedDisease1 && selectedDisease2 ? (
            <ComparisonDisplay
              disease1={selectedDisease1}
              disease2={selectedDisease2}
              translations={t}
              module="swine"
            />
          ) : (
            <div style={{ background: '#F9FAFB', borderRadius: 12, padding: '3rem', textAlign: 'center' }}>
              <div style={{ color: '#D1D5DB', marginBottom: '0.5rem', fontSize: '3rem' }}>⚖️</div>
              <p style={{ color: '#6B7280' }}>{t.selectDiseasePrompt}</p>
            </div>
          )}
        </div>
      </div>
      <div className="fw-mod-bnav">
        <button className="fw-mod-bnav-home" onClick={() => navigate('/swine')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span>PigWell</span>
        </button>
        <button className="fw-mod-bnav-home" onClick={() => navigate('/swine/diagnostic')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          <span>Diagnostic</span>
        </button>
      </div>
    </div>
  );
};

export default DiseaseComparisonPage;
