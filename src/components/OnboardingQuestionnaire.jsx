// src/components/OnboardingQuestionnaire.jsx
import { useState, useCallback } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import './OnboardingQuestionnaire.css';

// ── Data wilayah ────────────────────────────────────────────────
const ID_PROVINCES = [
  'Aceh','Bali','Banten','Bengkulu','D.I. Yogyakarta','D.K.I. Jakarta',
  'Gorontalo','Jambi','Jawa Barat','Jawa Tengah','Jawa Timur',
  'Kalimantan Barat','Kalimantan Selatan','Kalimantan Tengah',
  'Kalimantan Timur','Kalimantan Utara','Kepulauan Bangka Belitung',
  'Kepulauan Riau','Lampung','Maluku','Maluku Utara',
  'Nusa Tenggara Barat','Nusa Tenggara Timur','Papua','Papua Barat',
  'Papua Barat Daya','Papua Pegunungan','Papua Selatan','Papua Tengah',
  'Riau','Sulawesi Barat','Sulawesi Selatan','Sulawesi Tengah',
  'Sulawesi Tenggara','Sulawesi Utara','Sumatera Barat',
  'Sumatera Selatan','Sumatera Utara',
];

const VN_PROVINCES = [
  'An Giang','Bà Rịa–Vũng Tàu','Bắc Giang','Bắc Kạn','Bạc Liêu',
  'Bắc Ninh','Bến Tre','Bình Định','Bình Dương','Bình Phước',
  'Bình Thuận','Cà Mau','Cần Thơ','Cao Bằng','Đà Nẵng','Đắk Lắk',
  'Đắk Nông','Điện Biên','Đồng Nai','Đồng Tháp','Gia Lai','Hà Giang',
  'Hà Nam','Hà Nội','Hà Tĩnh','Hải Dương','Hải Phòng','Hậu Giang',
  'Hòa Bình','Hưng Yên','Khánh Hòa','Kiên Giang','Kon Tum','Lai Châu',
  'Lạng Sơn','Lào Cai','Lâm Đồng','Long An','Nam Định','Nghệ An',
  'Ninh Bình','Ninh Thuận','Phú Thọ','Phú Yên','Quảng Bình',
  'Quảng Nam','Quảng Ngãi','Quảng Ninh','Quảng Trị','Sóc Trăng',
  'Sơn La','Tây Ninh','Thái Bình','Thái Nguyên','Thanh Hóa',
  'Thừa Thiên Huế','Tiền Giang','TP. Hồ Chí Minh','Trà Vinh',
  'Tuyên Quang','Vĩnh Long','Vĩnh Phúc','Yên Bái',
];

const RANGE_LABELS = {
  en: ['< 500','1,000–5,000','5,000–20,000','20,000–100,000','100,000–500,000','> 500,000'],
  id: ['< 500 ekor','1.000–5.000 ekor','5.000–20.000 ekor','20.000–100.000 ekor','100.000–500.000 ekor','> 500.000 ekor'],
  vi: ['< 500 con','1.000–5.000 con','5.000–20.000 con','20.000–100.000 con','100.000–500.000 con','> 500.000 con'],
};

const RANGE_VALUES = ['<500','1000-5000','5000-20000','20000-100000','100000-500000','>500000'];

// ── Web3Forms notification ──────────────────────────────────────
const WEB3FORMS_KEY = '4d168932-50a6-4445-8527-ebd8a98eba33';

async function notifyDeveloper(data, lang) {
  const langLabel = { en: 'English', id: 'Indonesian', vi: 'Vietnamese' }[lang] || lang;
  const subject = `[FarmWell] New User: ${data.role} — ${data.country} (${data.livestock}${data.subtype ? '/' + data.subtype : ''})`;
  const message = [
    '🐾 NEW FARMWELL USER REGISTERED',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    `📅 Time     : ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB`,
    `🌐 Language : ${langLabel}`,
    '',
    'QUESTIONNAIRE RESULTS',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    `🐔 Livestock  : ${data.livestock}${data.subtype ? ' → ' + data.subtype : ''}`,
    `🏭 Operation  : ${data.operation}`,
    `📊 Population : ${data.populationLabel}`,
    `👤 Role       : ${data.role}`,
    `📍 Location   : ${data.country} — ${data.province}`,
    '',
    'RAW JSON',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    JSON.stringify(data, null, 2),
  ].join('\n');

  try {
    await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject,
        message,
        from_name: 'FarmWell App',
        livestock: data.livestock,
        subtype: data.subtype || '-',
        operation: data.operation,
        population: data.population,
        populationLabel: data.populationLabel,
        role: data.role,
        country: data.country,
        province: data.province,
        completed_at: data.completedAt,
        app_language: langLabel,
      }),
    });
  } catch (err) {
    console.warn('[FarmWell] Notification skipped:', err);
  }
}

// ── Total steps helper ──────────────────────────────────────────
// Poultry: Q1 → Q2(sub) → Q3 → Q4 → Q5 → Q6 → Q7  = 7 steps
// Swine  : Q1 → Q3 → Q4 → Q5 → Q6 → Q7            = 6 steps
const TOTAL_STEPS_POULTRY = 7;
const TOTAL_STEPS_SWINE   = 6;

export default function OnboardingQuestionnaire({ onComplete }) {
  const { t, language } = useTranslation();
  const lang = language; // 'en' | 'id' | 'vi'

  const [step, setStep]       = useState(1);  // 1-based, 8 = complete
  const [answers, setAnswers] = useState({
    livestock: '',   // 'Poultry' | 'Swine'
    subtype: '',     // 'Broiler' | 'Layer' | 'Color'  (only if Poultry)
    operation: '',   // 'Breeding' | 'Commercial' | 'Integrated'
    population: RANGE_VALUES[1],
    populationLabel: '',
    role: '',        // 'Owner' | 'Farm Manager' | 'Technical Service' | 'Veterinarian'
    country: '',     // 'Indonesia' | 'Vietnam'
    province: '',
  });
  const [rangeIdx, setRangeIdx] = useState(1);

  const isPoultry = answers.livestock === 'Poultry';
  const totalSteps = isPoultry ? TOTAL_STEPS_POULTRY : TOTAL_STEPS_SWINE;

  // Step numbers differ between Poultry/Swine — map to a "display" step number
  const displayStep = useCallback(() => {
    if (isPoultry) return step;
    // Swine skips step 2 (subtype)
    if (step >= 3) return step - 1;
    return step;
  }, [step, isPoultry]);

  const progress = Math.round((displayStep() / totalSteps) * 100);

  // ── Helper: set answer field ──
  const set = (field, val) => setAnswers(prev => ({ ...prev, [field]: val }));

  // ── Navigation helpers ──
  const nextStep = () => {
    if (step === 1 && answers.livestock === 'Swine') { setStep(3); return; }
    if (step === 7) { handleComplete(); return; }
    setStep(s => s + 1);
  };

  const prevStep = () => {
    if (step === 3 && answers.livestock === 'Swine') { setStep(1); return; }
    setStep(s => s - 1);
  };

  const handleComplete = () => {
    const payload = {
      livestock: answers.livestock,
      subtype: answers.subtype || null,
      operation: answers.operation,
      population: answers.population,
      populationLabel: RANGE_LABELS[lang]?.[rangeIdx] ?? RANGE_LABELS.en[rangeIdx],
      role: answers.role,
      country: answers.country,
      province: answers.province,
      completedAt: new Date().toISOString(),
    };
    
    // Kirim notifikasi ke developer (non-blocking)
    notifyDeveloper(payload, lang);
    
    // Simpan ke localStorage
    onComplete(payload);
    setStep(8);
  };

  // ── Province list based on country ──
  const provinces = answers.country === 'Indonesia' ? ID_PROVINCES : VN_PROVINCES;

  // ── Step-specific "can proceed" logic ──
  const canNext = () => {
    if (step === 1) return !!answers.livestock;
    if (step === 2) return !!answers.subtype;
    if (step === 3) return !!answers.operation;
    if (step === 4) return true;  // range always has a value
    if (step === 5) return !!answers.role;
    if (step === 6) return !!answers.country;
    if (step === 7) return !!answers.province;
    return false;
  };

  const stepLabel = t('onboarding.stepOf')
    .replace('{current}', displayStep())
    .replace('{total}', totalSteps);

  // ── Render ──────────────────────────────────────────────────
  return (
    <div className="oq-container">
        {/* Progress bar */}
        {step < 8 && (
          <div className="oq-progress-bar">
            <div className="oq-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        )}

        {/* ── STEP 1 : Livestock type ── */}
        {step === 1 && (
          <div className="oq-step">
            <p className="oq-step-label">{stepLabel}</p>
            <h2 className="oq-question">{t('onboarding.q1Title')}</h2>
            <p className="oq-desc">{t('onboarding.q1Desc')}</p>
            <div className="oq-grid oq-grid--2">
              {[
                { val: 'Poultry', icon: '🐔', label: t('onboarding.q1Poultry'), sub: t('onboarding.q1PoultryDesc') },
                { val: 'Swine',   icon: '🐷', label: t('onboarding.q1Swine'),   sub: t('onboarding.q1SwineDesc') },
              ].map(opt => (
                <button
                  key={opt.val}
                  className={`oq-opt${answers.livestock === opt.val ? ' oq-opt--selected' : ''}`}
                  onClick={() => set('livestock', opt.val)}
                >
                  <span className="oq-opt-icon">{opt.icon}</span>
                  <div>
                    <div className="oq-opt-text">{opt.label}</div>
                    <div className="oq-opt-sub">{opt.sub}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="oq-nav">
              <button className="oq-btn-next" disabled={!canNext()} onClick={nextStep}>
                {t('onboarding.next')}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2 : Poultry subtype (conditional) ── */}
        {step === 2 && (
          <div className="oq-step">
            <p className="oq-step-label">{stepLabel}</p>
            <h2 className="oq-question">{t('onboarding.q2Title')}</h2>
            <p className="oq-desc">{t('onboarding.q2Desc')}</p>
            <div className="oq-grid oq-grid--3">
              {[
                { val: 'Broiler', icon: '🍗', label: t('onboarding.q2Broiler'), sub: t('onboarding.q2BroilerDesc') },
                { val: 'Layer',   icon: '🥚', label: t('onboarding.q2Layer'),   sub: t('onboarding.q2LayerDesc') },
                { val: 'Color',   icon: '🐓', label: t('onboarding.q2Color'),   sub: t('onboarding.q2ColorDesc') },
              ].map(opt => (
                <button
                  key={opt.val}
                  className={`oq-opt oq-opt--column${answers.subtype === opt.val ? ' oq-opt--selected' : ''}`}
                  onClick={() => set('subtype', opt.val)}
                >
                  <span className="oq-opt-icon">{opt.icon}</span>
                  <div className="oq-opt-text">{opt.label}</div>
                  <div className="oq-opt-sub">{opt.sub}</div>
                </button>
              ))}
            </div>
            <div className="oq-nav">
              <button className="oq-btn-back" onClick={prevStep}>{t('onboarding.back')}</button>
              <button className="oq-btn-next" disabled={!canNext()} onClick={nextStep}>
                {t('onboarding.next')}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3 : Operation type ── */}
        {step === 3 && (
          <div className="oq-step">
            <p className="oq-step-label">{stepLabel}</p>
            <h2 className="oq-question">{t('onboarding.q3Title')}</h2>
            <p className="oq-desc">{t('onboarding.q3Desc')}</p>
            <div className="oq-grid oq-grid--1">
              {[
                { val: 'Breeding',    icon: '🧬', label: t('onboarding.q3Breeding'),    sub: t('onboarding.q3BreedingDesc') },
                { val: 'Commercial',  icon: '🏭', label: t('onboarding.q3Commercial'),  sub: t('onboarding.q3CommercialDesc') },
                { val: 'Integrated',  icon: '🔗', label: t('onboarding.q3Integrated'),  sub: t('onboarding.q3IntegratedDesc') },
              ].map(opt => (
                <button
                  key={opt.val}
                  className={`oq-opt${answers.operation === opt.val ? ' oq-opt--selected' : ''}`}
                  onClick={() => set('operation', opt.val)}
                >
                  <span className="oq-opt-icon">{opt.icon}</span>
                  <div>
                    <div className="oq-opt-text">{opt.label}</div>
                    <div className="oq-opt-sub">{opt.sub}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="oq-nav">
              <button className="oq-btn-back" onClick={prevStep}>{t('onboarding.back')}</button>
              <button className="oq-btn-next" disabled={!canNext()} onClick={nextStep}>
                {t('onboarding.next')}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4 : Population ── */}
        {step === 4 && (
          <div className="oq-step">
            <p className="oq-step-label">{stepLabel}</p>
            <h2 className="oq-question">{t('onboarding.q4Title')}</h2>
            <p className="oq-desc">{t('onboarding.q4Desc')}</p>
            <div className="oq-range-wrap">
              <div className="oq-range-display">
                {RANGE_LABELS[lang]?.[rangeIdx] ?? RANGE_LABELS.en[rangeIdx]}
              </div>
              <input
                type="range" min="0" max="5" step="1" value={rangeIdx}
                onChange={e => {
                  const idx = Number(e.target.value);
                  setRangeIdx(idx);
                  set('population', RANGE_VALUES[idx]);
                }}
              />
              <div className="oq-range-labels">
                {(RANGE_LABELS[lang] ?? RANGE_LABELS.en).map((l, i) => (
                  <span key={i} style={{ fontSize: '10px' }}>
                    {i === 0 ? l.split('–')[0] : i === 5 ? l : '·'}
                  </span>
                ))}
              </div>
            </div>
            <div className="oq-nav">
              <button className="oq-btn-back" onClick={prevStep}>{t('onboarding.back')}</button>
              <button className="oq-btn-next" onClick={nextStep}>{t('onboarding.next')}</button>
            </div>
          </div>
        )}

        {/* ── STEP 5 : Role ── */}
        {step === 5 && (
          <div className="oq-step">
            <p className="oq-step-label">{stepLabel}</p>
            <h2 className="oq-question">{t('onboarding.q5Title')}</h2>
            <p className="oq-desc">{t('onboarding.q5Desc')}</p>
            <div className="oq-grid oq-grid--2">
              {[
                { val: 'Owner',            icon: '👔', label: t('onboarding.q5Owner'),   sub: t('onboarding.q5OwnerDesc') },
                { val: 'Farm Manager',     icon: '📋', label: t('onboarding.q5Manager'), sub: t('onboarding.q5ManagerDesc') },
                { val: 'Technical Service',icon: '🔧', label: t('onboarding.q5Tech'),    sub: t('onboarding.q5TechDesc') },
                { val: 'Veterinarian',     icon: '🩺', label: t('onboarding.q5Vet'),     sub: t('onboarding.q5VetDesc') },
              ].map(opt => (
                <button
                  key={opt.val}
                  className={`oq-opt oq-opt--column${answers.role === opt.val ? ' oq-opt--selected' : ''}`}
                  onClick={() => set('role', opt.val)}
                >
                  <span className="oq-opt-icon">{opt.icon}</span>
                  <div className="oq-opt-text">{opt.label}</div>
                  <div className="oq-opt-sub">{opt.sub}</div>
                </button>
              ))}
            </div>
            <div className="oq-nav">
              <button className="oq-btn-back" onClick={prevStep}>{t('onboarding.back')}</button>
              <button className="oq-btn-next" disabled={!canNext()} onClick={nextStep}>
                {t('onboarding.next')}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 6 : Country ── */}
        {step === 6 && (
          <div className="oq-step">
            <p className="oq-step-label">{stepLabel}</p>
            <h2 className="oq-question">{t('onboarding.q6Title')}</h2>
            <p className="oq-desc">{t('onboarding.q6Desc')}</p>
            <div className="oq-grid oq-grid--2">
              {[
                { val: 'Indonesia', flag: '🇮🇩' },
                { val: 'Vietnam',   flag: '🇻🇳' },
              ].map(opt => (
                <button
                  key={opt.val}
                  className={`oq-opt${answers.country === opt.val ? ' oq-opt--selected' : ''}`}
                  onClick={() => { set('country', opt.val); set('province', ''); }}
                >
                  <span className="oq-opt-icon">{opt.flag}</span>
                  <div className="oq-opt-text">{opt.val}</div>
                </button>
              ))}
            </div>
            <div className="oq-nav">
              <button className="oq-btn-back" onClick={prevStep}>{t('onboarding.back')}</button>
              <button className="oq-btn-next" disabled={!canNext()} onClick={nextStep}>
                {t('onboarding.next')}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 7 : Province ── */}
        {step === 7 && (
          <div className="oq-step">
            <p className="oq-step-label">{stepLabel}</p>
            <h2 className="oq-question">
              {answers.country === 'Vietnam' ? t('onboarding.q7TitleVN') : t('onboarding.q7TitleID')}
            </h2>
            <p className="oq-desc">{t('onboarding.q7Desc')}</p>
            <div className="oq-select-wrap">
              <select
                value={answers.province}
                onChange={e => set('province', e.target.value)}
              >
                <option value="">{t('onboarding.q7Placeholder')}</option>
                {provinces.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <span className="oq-select-arrow">▾</span>
            </div>
            <div className="oq-nav">
              <button className="oq-btn-back" onClick={prevStep}>{t('onboarding.back')}</button>
              <button className="oq-btn-next" disabled={!canNext()} onClick={nextStep}>
                {t('onboarding.finish')}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 8 : Complete ── */}
        {step === 8 && (
          <div className="oq-step oq-complete">
            <div className="oq-complete-icon">✓</div>
            <h2 className="oq-complete-title">{t('onboarding.profileReady')}</h2>
            <p className="oq-complete-desc">{t('onboarding.profileReadyDesc')}</p>
            {/* Email notification badge */}
            <div className="oq-email-badge">
              <span style={{ fontSize: '16px', flexShrink: 0, marginTop: '1px' }}>📧</span>
              <span>{t('onboarding.notifyBadge')}</span>
            </div>
            <div className="oq-summary">
              {[
                { label: t('onboarding.summaryLivestock'), val: answers.subtype ? `${answers.livestock} — ${answers.subtype}` : answers.livestock },
                { label: t('onboarding.summaryOp'),        val: answers.operation },
                { label: t('onboarding.summaryPop'),       val: RANGE_LABELS[lang]?.[rangeIdx] ?? RANGE_LABELS.en[rangeIdx] },
                { label: t('onboarding.summaryRole'),      val: answers.role },
                { label: t('onboarding.summaryLocation'),  val: `${answers.country} — ${answers.province}` },
              ].map(row => (
                <div key={row.label} className="oq-summary-row">
                  <span className="oq-summary-label">{row.label}</span>
                  <span className="oq-summary-val">{row.val}</span>
                </div>
              ))}
            </div>
            <button
              className="oq-btn-next oq-btn-next--full"
              onClick={() => {
                window.location.hash = '/';
              }}
            >
              {t('onboarding.startApp')}
            </button>
          </div>
        )}
    </div>
  );
}
