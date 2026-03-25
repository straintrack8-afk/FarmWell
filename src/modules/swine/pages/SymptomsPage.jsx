import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDiagnosis } from '../contexts/DiagnosisContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { swineTranslations } from '../translations';
import { DiagnosisWrapper } from '../components/disease-diagnosis/DiagnosisWrapper';

// Age groups for display
const AGE_GROUPS = {
  'All ages': { label: 'All Ages' },
  'Newborn': { label: 'Newborn (0-7 days)' },
  'Suckling': { label: 'Suckling (0-3 weeks)' },
  'Weaned': { label: 'Weaned (3-8 weeks)' },
  'Growers': { label: 'Growers (2-4 months)' },
  'Finishers': { label: 'Finishers (4-6 months)' },
  'Sows': { label: 'Sows / Gilts' },
  'Boars': { label: 'Boars' }
};

function SymptomsPage() {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const t = (key) => swineTranslations[language]?.[key] || swineTranslations['en'][key];
    
    const {
        selectedAge,
        selectedSymptoms,
        toggleSymptom,
        clearSymptoms,
        symptomCategories,
        diseases,
        filterDiseasesByAge
    } = useDiagnosis();

    const [searchTerm, setSearchTerm] = useState('');
    const [expandedCategories, setExpandedCategories] = useState({
        mortality: false,
        fever: false,
        respiratory: false,
        digestive: false,
        nervous: false,
        skin: false,
        reproductive: false,
        systemic: false
    });

    useEffect(() => {
        if (!selectedAge) {
            navigate('/swine/diagnosis/age');
        }
    }, [selectedAge, navigate]);

    const matchedDiseases = useMemo(() => {
        if (selectedSymptoms.length === 0 || !diseases) return [];
        let filtered = diseases;
        if (selectedAge && selectedAge !== 'All ages' && filterDiseasesByAge) {
            filtered = filterDiseasesByAge(diseases, selectedAge);
        }
        const scored = filtered.map(disease => {
            const symptomsArray = disease.symptomsEnhanced || [];
            const matched = symptomsArray.filter(s => selectedSymptoms.includes(typeof s === 'string' ? s : s.name));
            if (matched.length === 0) return null;
            const mw = matched.reduce((sum, s) => sum + (typeof s === 'object' ? (s.weight || 0.5) : 0.5), 0);
            const tw = symptomsArray.reduce((sum, s) => sum + (typeof s === 'object' ? (s.weight || 0.5) : 0.5), 0);
            return { ...disease, matchCount: matched.length, confidence: Math.round((mw / tw) * 1000) / 10 };
        }).filter(d => d);
        return scored.sort((a, b) => b.confidence - a.confidence).slice(0, 10);
    }, [selectedSymptoms, diseases, selectedAge, filterDiseasesByAge]);

    if (!selectedAge) return null;

    const toggleCategory = (cat) => setExpandedCategories(p => ({ ...p, [cat]: !p[cat] }));

    const ProgressBar = ({ step }) => (
        <div style={{
            background: 'white',
            padding: '1rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                {[1, 2, 3].map(s => (
                    <div key={s} style={{ flex: 1, textAlign: 'center', padding: '0 2px' }}>
                        <div style={{
                            width: 'clamp(28px, 8vw, 40px)',
                            height: 'clamp(28px, 8vw, 40px)',
                            borderRadius: '50%',
                            background: step >= s ? '#10b981' : '#e5e7eb',
                            color: 'white',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            fontSize: 'clamp(0.75rem, 3vw, 1rem)',
                            marginBottom: '0.35rem'
                        }}>
                            {s}
                        </div>
                        <div style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.875rem)', color: '#6b7280', lineHeight: 1.2 }}>
                            {s === 1 && t('stepAge')}
                            {s === 2 && t('stepSymptoms')}
                            {s === 3 && t('stepResults')}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <DiagnosisWrapper>
            <div style={{ padding: '2rem 1rem', maxWidth: '1400px', margin: '0 auto' }}>
                {/* Progress Bar */}
                <ProgressBar step={2} />

                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: '800',
                        marginBottom: '1rem',
                        background: 'var(--primary)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        {t('selectSymptoms')}
                    </h1>
                    <p style={{ fontSize: '1.125rem', color: '#6B7280' }}>
                        Age: <strong>{selectedAge ? (AGE_GROUPS[selectedAge]?.label || selectedAge) : 'Not selected'}</strong>
                    </p>
                </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                
                {/* COLUMN 1: Symptom Selection */}
                <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', maxHeight: '600px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ background: '#10B981', color: 'white', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontWeight: '600' }}>
                        1️⃣ {t('searchSymptoms')}
                    </div>
                    <input type='text' placeholder={t('searchSymptoms')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: '0.75rem', border: '1px solid #E5E7EB', borderRadius: '8px', marginBottom: '1rem' }} />
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {symptomCategories && Object.entries(symptomCategories).map(([key, cat]) => {
                            const symptoms = cat.symptoms || [];
                            const filtered = symptoms.filter(s => !searchTerm || s.toLowerCase().includes(searchTerm.toLowerCase()));
                            if (filtered.length === 0 && searchTerm) return null;
                            return (
                                <div key={key} style={{ marginBottom: '0.5rem' }}>
                                    <div onClick={() => toggleCategory(key)} style={{ padding: '0.75rem', background: expandedCategories[key] ? '#F0FDF4' : '#F9FAFB', border: '1px solid', borderColor: expandedCategories[key] ? '#10B981' : '#E5E7EB', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>{cat.label} ({filtered.length})</span>
                                        <span>{expandedCategories[key] ? '🔼' : '🔽'}</span>
                                    </div>
                                    {expandedCategories[key] && (
                                        <div style={{ paddingLeft: '0.5rem', marginTop: '0.5rem' }}>
                                            {filtered.map((symptom, idx) => {
                                                const isSelected = selectedSymptoms.includes(symptom);
                                                return (
                                                    <div key={idx} onClick={() => toggleSymptom(symptom)} style={{ padding: '0.5rem 0.75rem', marginBottom: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '6px', background: isSelected ? '#F0FDF4' : 'transparent' }}>
                                                        <span style={{ fontSize: '0.8125rem', color: isSelected ? '#059669' : '#374151', fontWeight: isSelected ? '500' : '400' }}>{symptom}</span>
                                                        <button onClick={(e) => { e.stopPropagation(); toggleSymptom(symptom); }} style={{ width: '24px', height: '24px', borderRadius: '50%', background: isSelected ? '#10B981' : '#10B981', border: 'none', color: 'white', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '700' }}>{isSelected ? '✓' : '+'}</button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* COLUMN 2: Selected Symptoms */}
                <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', maxHeight: '600px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ background: '#10B981', color: 'white', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontWeight: '600', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>2️⃣ {t('selectedSymptoms')} ({selectedSymptoms.length})</span>
                        {selectedSymptoms.length > 0 && <button onClick={clearSymptoms} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '600' }}>{t('clearAll')}</button>}
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {selectedSymptoms.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#9CA3AF' }}>
                                <p style={{ fontSize: '0.875rem' }}>{t('noSymptomsSelected')}</p>
                            </div>
                        ) : (
                            selectedSymptoms.map((symptom, idx) => (
                                <div key={idx} style={{ padding: '0.75rem', marginBottom: '0.5rem', background: '#F0FDF4', border: '1px solid #10B981', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '0.8125rem', color: '#059669', fontWeight: '500', flex: 1 }}>{symptom}</span>
                                    <button onClick={() => toggleSymptom(symptom)} style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#EF4444', border: 'none', color: 'white', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '700' }}>✕</button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* COLUMN 3: Disease Results */}
                <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', maxHeight: '600px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ background: '#10B981', color: 'white', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontWeight: '600' }}>
                        3️⃣ {t('possibleDiseases')} ({matchedDiseases.length})
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {matchedDiseases.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#9CA3AF' }}>
                                <p style={{ fontSize: '0.875rem' }}>{t('selectSymptomsToSee')}</p>
                            </div>
                        ) : (
                            matchedDiseases.map((disease, idx) => {
                                const getConfColor = (c) => c >= 80 ? '#10B981' : c >= 60 ? '#F59E0B' : '#EF4444';
                                return (
                                    <div key={disease.id} onClick={() => navigate(`/swine/diagnosis/disease/${disease.id}`)} style={{ padding: '0.75rem', marginBottom: '0.75rem', background: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                            <span style={{ fontSize: '1.25rem' }}>{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}</span>
                                            <h3 style={{ fontSize: '0.875rem', fontWeight: '700', color: '#111827', margin: 0, lineHeight: '1.3', flex: 1 }}>{disease.name}</h3>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                            <div style={{ flex: 1, background: '#E5E7EB', borderRadius: '9999px', height: '8px', overflow: 'hidden' }}>
                                                <div style={{ width: `${Math.min(disease.confidence, 100)}%`, height: '100%', background: getConfColor(disease.confidence), borderRadius: '9999px', transition: 'width 0.5s' }} />
                                            </div>
                                            <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#374151', minWidth: '45px', textAlign: 'right' }}>{disease.confidence}%</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                                            <span style={{ fontSize: '0.625rem', padding: '0.125rem 0.5rem', background: '#DBEAFE', color: '#1E40AF', borderRadius: '4px', fontWeight: '600' }}>🦠 {disease.category}</span>
                                            <span style={{ fontSize: '0.625rem', padding: '0.125rem 0.5rem', background: '#FEE2E2', color: '#DC2626', borderRadius: '4px', fontWeight: '600' }}>{disease.matchCount} symptoms</span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button onClick={() => navigate('/swine/diagnosis/age')} style={{ padding: '0.75rem 1.5rem', background: '#6B7280', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>← Back to Age Selection</button>
            </div>
            </div>
        </DiagnosisWrapper>
    );
}

export default SymptomsPage;
