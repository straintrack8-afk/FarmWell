import { useNavigate } from 'react-router-dom';
import { useDiagnosis } from '../contexts/DiagnosisContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { swineTranslations } from '../translations';
import { DiagnosisWrapper } from '../components/disease-diagnosis/DiagnosisWrapper';
import PigWellTopNav from '../components/common/PigWellTopNav';

const AgeIcon = ({ ageId, color }) => {
    const s = { width:22, height:22, stroke: color || '#2EAA5E', fill:'none', strokeWidth:1.8, strokeLinecap:'round', strokeLinejoin:'round' };
    if (ageId === 'Newborn') return (
        <svg viewBox="0 0 24 24" style={s}>
            <ellipse cx="12" cy="13" rx="7" ry="6"/>
            <path d="M9 10c0-1.5 6-1.5 6 0"/>
            <circle cx="9.5" cy="13" r="0.5" fill={color||'#2EAA5E'}/>
            <circle cx="14.5" cy="13" r="0.5" fill={color||'#2EAA5E'}/>
            <path d="M10 16.5c.5.5 3.5.5 4 0"/>
            <path d="M5 10c-1-2 0-5 2-5"/>
            <path d="M19 10c1-2 0-5-2-5"/>
        </svg>
    );
    if (ageId === 'Suckling') return (
        <svg viewBox="0 0 24 24" style={s}>
            <ellipse cx="12" cy="13" rx="7" ry="5.5"/>
            <circle cx="9.5" cy="12.5" r="0.5" fill={color||'#2EAA5E'}/>
            <circle cx="14.5" cy="12.5" r="0.5" fill={color||'#2EAA5E'}/>
            <path d="M10 15.5c.5.5 3.5.5 4 0"/>
            <path d="M5 10c-1-2 0-4 2-4"/>
            <path d="M19 10c1-2 0-4-2-4"/>
            <path d="M8 18l-2 3M16 18l2 3"/>
        </svg>
    );
    if (ageId === 'Weaned') return (
        <svg viewBox="0 0 24 24" style={s}>
            <ellipse cx="12" cy="13" rx="7.5" ry="5.5"/>
            <circle cx="9.5" cy="12.5" r="0.5" fill={color||'#2EAA5E'}/>
            <circle cx="14.5" cy="12.5" r="0.5" fill={color||'#2EAA5E'}/>
            <path d="M10 15.5c.5.5 3.5.5 4 0"/>
            <path d="M5 10c-1-2 0-4 2-4"/>
            <path d="M19 10c1-2 0-4-2-4"/>
            <path d="M7 18.5l-1 2.5M17 18.5l1 2.5"/>
            <path d="M10 18.5l0 2.5M14 18.5l0 2.5"/>
        </svg>
    );
    if (ageId === 'Growers') return (
        <svg viewBox="0 0 24 24" style={s}>
            <ellipse cx="12" cy="12" rx="8" ry="6"/>
            <circle cx="9.5" cy="11.5" r="0.5" fill={color||'#2EAA5E'}/>
            <circle cx="14.5" cy="11.5" r="0.5" fill={color||'#2EAA5E'}/>
            <path d="M10 14.5c.5.5 3.5.5 4 0"/>
            <path d="M4 9c-1-2.5 0-5 3-5"/>
            <path d="M20 9c1-2.5 0-5-3-5"/>
            <path d="M6 18l-1 3M10 18.5v2.5M14 18.5v2.5M18 18l1 3"/>
        </svg>
    );
    if (ageId === 'Finishers') return (
        <svg viewBox="0 0 24 24" style={s}>
            <ellipse cx="12" cy="12" rx="9" ry="6.5"/>
            <circle cx="9.5" cy="11" r="0.6" fill={color||'#2EAA5E'}/>
            <circle cx="14.5" cy="11" r="0.6" fill={color||'#2EAA5E'}/>
            <path d="M10 14c.5.6 3.5.6 4 0"/>
            <path d="M3 9c-1-3 0-5.5 3-5.5"/>
            <path d="M21 9c1-3 0-5.5-3-5.5"/>
            <path d="M5 18.5l-1 3M9 19v2.5M15 19v2.5M19 18.5l1 3"/>
        </svg>
    );
    if (ageId === 'Sows / Gilts') return (
        <svg viewBox="0 0 24 24" style={s}>
            <ellipse cx="11" cy="12" rx="8" ry="6"/>
            <circle cx="8.5" cy="11" r="0.6" fill={color||'#2EAA5E'}/>
            <circle cx="13.5" cy="11" r="0.6" fill={color||'#2EAA5E'}/>
            <path d="M9 14c.5.6 3.5.6 4 0"/>
            <path d="M3 9c-1-2.5 0-5 2-5"/>
            <circle cx="20" cy="8" r="3"/>
            <path d="M20 11v2M18.5 9.5l-1 1"/>
            <path d="M5 18.5l-1 2.5M9 19v2.5M13 19v2.5"/>
        </svg>
    );
    if (ageId === 'Boars') return (
        <svg viewBox="0 0 24 24" style={s}>
            <ellipse cx="11" cy="13" rx="8" ry="6"/>
            <circle cx="8.5" cy="12" r="0.6" fill={color||'#2EAA5E'}/>
            <circle cx="13.5" cy="12" r="0.6" fill={color||'#2EAA5E'}/>
            <path d="M9 15c.5.6 3.5.6 4 0"/>
            <path d="M3 10c-1-2.5 0-5 2-5"/>
            <path d="M19 5l3-3M19 5h3M19 5v3"/>
            <path d="M5 19.5l-1 2.5M9 20v2M13 20v2"/>
        </svg>
    );
    // Default: All Ages
    return (
        <svg viewBox="0 0 24 24" style={s}>
            <ellipse cx="12" cy="12" rx="8" ry="6"/>
            <circle cx="9.5" cy="11" r="0.6" fill={color||'#2EAA5E'}/>
            <circle cx="14.5" cy="11" r="0.6" fill={color||'#2EAA5E'}/>
            <path d="M10 14c.5.6 3.5.6 4 0"/>
            <path d="M4 9c-1-2.5 0-5 2-5"/>
            <path d="M20 9c1-2.5 0-5-2-5"/>
            <path d="M6 18.5l-1 3M10 19v2.5M14 19v2.5M18 18.5l1 3"/>
        </svg>
    );
};

function AgePage() {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const t = (key) => swineTranslations[language]?.[key] || swineTranslations['en'][key];

    const getAgeLabel = (ageId) => {
        const map = {
            'All ages': t('allAges'),
            'Newborn': t('newborn'),
            'Suckling': t('suckling'),
            'Weaned': t('weaned'),
            'Growers': t('growers'),
            'Finishers': t('finishers'),
            'Sows / Gilts': t('sows'),
            'Boars': t('boars'),
        };
        return map[ageId] || ageId;
    };

    const getAgeDesc = (ageId) => {
        const map = {
            'All ages': t('allAgesDesc'),
            'Newborn': t('newbornDesc'),
            'Suckling': t('sucklingDesc'),
            'Weaned': t('weanedDesc'),
            'Growers': t('growersDesc'),
            'Finishers': t('finishersDesc'),
            'Sows / Gilts': t('sowsDesc'),
            'Boars': t('boarsDesc'),
        };
        return map[ageId] || '';
    };
    const { selectedAge, setSelectedAge, ageGroups } = useDiagnosis();

    const handleContinue = () => {
        if (selectedAge) navigate('/swine/diagnosis/symptoms');
    };

    return (
        <DiagnosisWrapper>
            <div className="fw-module-page">
                <PigWellTopNav title={t('selectAgeGroup') || 'Select Age Group'} />
                <div className="fw-mod-card" style={{ marginTop: -18, borderRadius: '16px 16px 12px 12px' }}>
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
                                            <AgeIcon ageId={age.id} color={isSelected ? 'white' : '#2EAA5E'} />
                                        </div>
                                        <div className="fw-mod-item-name" style={{ color: isSelected ? '#2EAA5E' : 'var(--fw-text)' }}>
                                            {getAgeLabel(age.id)}
                                        </div>
                                        <div className="fw-mod-item-tag">{getAgeDesc(age.id)}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="fw-mod-bnav">
                    <button className="fw-mod-bnav-home" onClick={() => navigate('/swine/diagnostic')}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                        <span>Diagnostic</span>
                    </button>
                    <button
                        className="fw-mod-bnav-alerts"
                        onClick={handleContinue}
                        disabled={!selectedAge}
                        style={{ opacity: selectedAge ? 1 : 0.4 }}
                    >
                        <span>{t('continueButton') || 'Continue'}</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                </div>
            </div>
        </DiagnosisWrapper>
    );
}

export default AgePage;
