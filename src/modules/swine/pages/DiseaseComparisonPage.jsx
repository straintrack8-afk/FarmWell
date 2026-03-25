import { useState, useEffect } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { 
  translations, 
  SelectionBox, 
  ComparisonDisplay 
} from '../components/comparison/ComparisonHelpers';

const DiseaseComparisonPage = () => {
  const { language } = useLanguage();
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
    
    fetch(`/data/swine/pig_diseases_COMPLETE_104_v1.0_ENRICHED_${langCode}.json`)
      .then(res => res.json())
      .then(data => {
        const diseases = data.diseases || [];
        setAllDiseases(diseases);
        if (disease1Id) setSelectedDisease1(diseases.find(d => d.id === disease1Id) || null);
        if (disease2Id) setSelectedDisease2(diseases.find(d => d.id === disease2Id) || null);
      })
      .catch(err => console.error('Error:', err));
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
    <div style={{ minHeight: '100vh', background: '#F9FAFB', padding: '2rem 0' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
            🔬 {t.pageTitle}
          </h1>
          <p style={{ color: '#6B7280' }}>{t.pageSubtitle}</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
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
          <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '3rem', textAlign: 'center' }}>
            <div style={{ color: '#D1D5DB', marginBottom: '0.5rem', fontSize: '3rem' }}>⚖️</div>
            <p style={{ color: '#6B7280' }}>{t.selectDiseasePrompt}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiseaseComparisonPage;
