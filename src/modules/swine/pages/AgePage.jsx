import { useNavigate } from 'react-router-dom';
import { useDiagnosis } from '../contexts/DiagnosisContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { swineTranslations } from '../translations';
import { DiagnosisWrapper } from '../components/disease-diagnosis/DiagnosisWrapper';
import PigWellTopNav from '../components/common/PigWellTopNav';

const SwineIcon = () => (
    <svg viewBox="0 0 24 24" style={{width:22,height:22,stroke:'#2EAA5E',fill:'none',strokeWidth:1.8,strokeLinecap:'round',strokeLinejoin:'round'}}>
        <path d="M18 8h1a4 4 0 010 8h-1"/>
        <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/>
        <line x1="6" y1="1" x2="6" y2="4"/>
        <line x1="10" y1="1" x2="10" y2="4"/>
        <line x1="14" y1="1" x2="14" y2="4"/>
    </svg>
);

const AGE_LABEL_KEYS = {
    'All ages':  { labelKey: 'all',       descKey: 'allDesc'      },
    'Newborn':   { labelKey: 'newborn',   descKey: 'newbornDesc'  },
    'Suckling':  { labelKey: 'suckling',  descKey: 'sucklingDesc' },
    'Weaned':    { labelKey: 'weaned',    descKey: 'weanedDesc'   },
    'Growers':   { labelKey: 'growers',   descKey: 'growersDesc'  },
    'Finishers': { labelKey: 'finishers', descKey: 'finishersDesc'},
    'Sows':      { labelKey: 'sows',      descKey: 'sowsDesc'     },
    'Boars':     { labelKey: 'boars',     descKey: 'boarsDesc'    },
};

function AgePage() {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const t = (key) => swineTranslations[language]?.[key] || swineTranslations['en'][key];
    const { selectedAge, setSelectedAge, ageGroups } = useDiagnosis();

    const handleContinue = () => {
        if (selectedAge) navigate('/swine/diagnosis/symptoms');
    };

    return (
        <DiagnosisWrapper>
            <div className="fw-module-page">
                <PigWellTopNav title={t('selectAgeGroup') || 'Select Age Group'} />

                <div className="fw-mod-card" style={{ marginTop: -18, borderRadius: '16px 16px 12px 12px' }}>
                    {/* Step indicator */}
                    <div style={{ display: 'flex', gap: 8, padding: '12px 16px 0', justifyContent: 'center' }}>
                        {[
                            { n: 1, label: t('stepAge') || 'Age' },
                            { n: 2, label: t('stepSymptoms') || 'Symptoms' },
                            { n: 3, label: t('stepResults') || 'Results' },
                        ].map(s => (
                            <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <div style={{
                                    width: 24, height: 24, borderRadius: '50%',
                                    background: s.n === 1 ? '#2EAA5E' : '#E5E7EB',
                                    color: s.n === 1 ? 'white' : '#9CA3AF',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 11, fontWeight: 700
                                }}>{s.n}</div>
                                <span style={{ fontSize: 11, color: s.n === 1 ? '#2EAA5E' : '#9CA3AF', fontWeight: s.n === 1 ? 700 : 400 }}>
                                    {s.label}
                                </span>
                                {s.n < 3 && <span style={{ color: '#E5E7EB', marginLeft: 4 }}>—</span>}
                            </div>
                        ))}
                    </div>

                    <div className="fw-mod-content">
                        <div style={{ textAlign: 'center', marginBottom: 16 }}>
                            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--fw-text)' }}>{t('selectAgeGroup') || 'Select Age Group'}</div>
                            <div style={{ fontSize: 11, color: 'var(--fw-sub)', marginTop: 4 }}>{t('chooseAgeGroup') || 'Choose the age group of the affected pigs'}</div>
                        </div>

                        <div className="fw-module-grid-2">
                            {ageGroups && ageGroups.map((age) => {
                                const keys = AGE_LABEL_KEYS[age.id];
                                const label = keys ? t(keys.labelKey) : (age.label || age.id);
                                const desc = keys ? t(keys.descKey) : (age.description || '');
                                const parenIdx = label.indexOf(' (');
                                const namePart = parenIdx >= 0 ? label.slice(0, parenIdx) : label;
                                const agePart = parenIdx >= 0 ? label.slice(parenIdx + 1) : null;
                                const isSelected = selectedAge === age.id;

                                return (
                                    <div
                                        key={age.id}
                                        className="fw-mod-item-card"
                                        onClick={() => setSelectedAge(age.id)}
                                        style={{
                                            cursor: 'pointer',
                                            border: isSelected ? '2px solid #2EAA5E' : '2px solid #E5E7EB',
                                            background: isSelected ? '#F0FDF4' : 'white',
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        <div className="fw-mod-item-icon-wrap" style={{ background: isSelected ? '#2EAA5E' : '#E8F5EE' }}>
                                            <SwineIcon />
                                        </div>
                                        <div className="fw-mod-item-name" style={{ color: isSelected ? '#2EAA5E' : 'var(--fw-text)' }}>
                                            {namePart}
                                            {agePart && <span style={{ fontSize: 11, fontWeight: 500, display: 'block', marginTop: 2 }}>{agePart}</span>}
                                        </div>
                                        <div className="fw-mod-item-tag">{desc}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="fw-mod-bnav">
                    <button className="fw-mod-bnav-home" onClick={() => navigate('/swine/diagnostic')}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                        Back
                    </button>
                    <button
                        className="fw-mod-bnav-alerts"
                        onClick={handleContinue}
                        disabled={!selectedAge}
                        style={{ opacity: selectedAge ? 1 : 0.4 }}
                    >
                        {t('continueButton') || 'Continue'}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                </div>
            </div>
        </DiagnosisWrapper>
    );
}

export default AgePage;
