import React, { useState, useEffect, useMemo } from 'react';
import { useDiagnosis } from '../contexts/DiagnosisContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import '../styles/DiseaseDiagnosis.css';

const CATEGORY_EMOJI = {
  respiratory:      { emoji: '🐔', label: 'Head & Respiratory' },
  digestive:        { emoji: '🌾', label: 'Digestive System' },
  musculoskeletal:  { emoji: '🦴', label: 'Bones & Joints' },
  integumentary:    { emoji: '�', label: 'Skin & Feathers' },
  reproductive:     { emoji: '🥚', label: 'Reproductive System' },
  general:          { emoji: '🌡️', label: 'Behavior & Systemic' },
};

const BodyPartSelectionNew = () => {
  const { language } = useLanguage();
  
  const {
    symptomCategories,
    selectedSymptoms,
    selectedAge,
    results,
    toggleSymptom,
    clearSymptoms,
    calculateResults,
    viewDiseaseDetail,
    previousStep,
  } = useDiagnosis();

  const [currentStep, setCurrentStep] = useState(2);
  const [activeCategory, setActiveCategory] = useState('head_respiratory');
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileTab, setMobileTab] = useState('symptoms');
  const [showResults, setShowResults] = useState(false);

  const ageLabel = selectedAge || 'All ages';

  const handleToggleSym = (symptom) => {
    toggleSymptom(symptom);
    setTimeout(() => calculateResults(), 0);
  };

  const handleClearAll = () => {
    clearSymptoms();
    setTimeout(() => calculateResults(), 0);
  };

  const selectCategory = (catId) => {
    setActiveCategory(catId);
    setSearchTerm('');
    if (window.innerWidth <= 640) {
      setMobileTab('symptoms');
    }
  };

  useEffect(() => {
    if (selectedSymptoms.length > 0) {
      calculateResults();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSymptoms.length]);

  const activeSymptoms = useMemo(() => {
    if (!symptomCategories) return [];
    
    if (searchTerm) {
      const allSymptoms = [];
      Object.entries(symptomCategories).forEach(([catId, catData]) => {
        catData.symptoms.forEach(sym => {
          allSymptoms.push(sym);
        });
      });
      return allSymptoms.filter(sym => {
        const symName = typeof sym === 'string' ? sym : sym.name || sym;
        return symName.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
    
    const catData = symptomCategories[activeCategory];
    return catData ? catData.symptoms : [];
  }, [symptomCategories, activeCategory, searchTerm]);

  const getCategorySelectedCount = (catId) => {
    if (!symptomCategories || !symptomCategories[catId]) return 0;
    const catData = symptomCategories[catId];
    return selectedSymptoms.filter(selSym => {
      return catData.symptoms.some(catSym => {
        const catSymName = typeof catSym === 'string' ? catSym : catSym.name || catSym;
        const selSymName = typeof selSym === 'string' ? selSym : selSym.name || selSym;
        return catSymName === selSymName;
      });
    }).length;
  };

  const activeCategoryName = useMemo(() => {
    if (searchTerm) {
      return `🔍 ${language === 'en' ? 'Search' : language === 'id' ? 'Pencarian' : 'Tìm kiếm'}: "${searchTerm}"`;
    }
    const meta = CATEGORY_EMOJI[activeCategory];
    const catData = symptomCategories?.[activeCategory];
    return meta && catData ? `${meta.emoji} ${catData.label || meta.label}` : '';
  }, [symptomCategories, activeCategory, searchTerm, language]);

  const selectedInActiveCategory = useMemo(() => {
    return activeSymptoms.filter(sym => {
      const symName = typeof sym === 'string' ? sym : sym.name || sym;
      return selectedSymptoms.some(selSym => {
        const selSymName = typeof selSym === 'string' ? selSym : selSym.name || selSym;
        return symName === selSymName;
      });
    }).length;
  }, [activeSymptoms, selectedSymptoms]);

  const handleDiseaseClick = (disease) => {
    viewDiseaseDetail(disease);
  };

  return (
    <div className="diagnosis-page">
      {/* Step Progress Bar */}
      <div className="dd-step-bar">
        <div className="dd-step-inner">
          <div className={`dd-step ${currentStep >= 1 ? 'done' : ''}`} onClick={previousStep}>
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
          <div className={`dd-step-connector ${showResults ? 'done' : ''}`}></div>
          <div className={`dd-step ${showResults ? 'now' : ''}`}>
            <div className="dd-step-circle">{showResults ? '✓' : '3'}</div>
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
            🐔 {ageLabel} · {selectedSymptoms.length} {language === 'en' ? 'symptom' : language === 'id' ? 'gejala' : 'triệu chứng'}{selectedSymptoms.length !== 1 ? 's' : ''} {language === 'en' ? 'selected' : language === 'id' ? 'dipilih' : 'đã chọn'}
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
            <span className="tab-badge">{selectedSymptoms.length}</span>
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
            {symptomCategories && Object.entries(symptomCategories).map(([catId, catData]) => {
              const meta = CATEGORY_EMOJI[catId] || { emoji: '📋', label: catId };
              const selCount = getCategorySelectedCount(catId);
              return (
                <div
                  key={catId}
                  className={`dd-cat-card ${activeCategory === catId ? 'active' : ''} ${selCount > 0 ? 'has-sel' : ''}`}
                  onClick={() => selectCategory(catId)}
                >
                  <div className="dd-cat-sel-badge">{selCount}</div>
                  <div className="dd-cat-emoji-wrap">{meta.emoji}</div>
                  <span className="dd-cat-name">{catData.label || meta.label}</span>
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
                    const symName = typeof symptom === 'string' ? symptom : symptom.name || symptom;
                    const isSelected = selectedSymptoms.some(s => {
                      const sName = typeof s === 'string' ? s : s.name || s;
                      return sName === symName;
                    });
                    return (
                      <div
                        key={idx}
                        className={`dd-sym-chip ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleToggleSym(symptom)}
                      >
                        <span>{symName}</span>
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
                <span className="dd-sel-count-pill">{selectedSymptoms.length}</span>
              </div>
              <div className="dd-sel-bar-actions">
                <button className="dd-btn-clear-all" onClick={handleClearAll}>
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                  {language === 'en' ? 'Clear all' : language === 'id' ? 'Hapus semua' : 'Xóa tất cả'}
                </button>
              </div>
            </div>
            <div className="dd-sel-pills">
              {selectedSymptoms.length === 0 ? (
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,.35)', padding: '4px 0' }}>
                  {language === 'en' ? 'No symptoms selected yet' : language === 'id' ? 'Belum ada gejala yang dipilih' : 'Chưa chọn triệu chứng nào'}
                </span>
              ) : (
                selectedSymptoms.map((symptom, idx) => {
                  const symName = typeof symptom === 'string' ? symptom : symptom.name || symptom;
                  return (
                    <div key={idx} className="dd-sel-pill">
                      {symName}
                      <button className="dd-sel-pill-del" onClick={() => handleToggleSym(symptom)}>
                        ✕
                      </button>
                    </div>
                  );
                })
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
              {selectedSymptoms.length === 0 ? (
                <div className="dd-empty-results">
                  <div className="dd-empty-results-icon">🔬</div>
                  <div className="dd-empty-results-msg">
                    {language === 'en' ? 'Select symptoms to see possible conditions' : language === 'id' ? 'Pilih gejala untuk melihat kondisi yang mungkin' : 'Chọn triệu chứng để xem tình trạng có thể'}
                  </div>
                </div>
              ) : results && results.length > 0 ? (
                results.slice(0, 10).map((disease, idx) => {
                  const pct = Math.round(disease.percentage || disease.score || disease.confidence || 0);
                  const name = disease.name || disease.nama || 'Unknown';
                  const diseaseType = disease.category || disease.type || 'viral';
                  const isNotifiable = disease.notifiable || false;
                  
                  return (
                    <div
                      key={disease.id || idx}
                      className={`dd-disease-card ${idx === 0 ? 'rank-1' : ''}`}
                      onClick={() => handleDiseaseClick(disease)}
                      style={{ animationDelay: `${idx * 0.05}s`, cursor: 'pointer' }}
                    >
                      <div className="dd-d-rank">{idx + 1}</div>
                      <div className="dd-d-body">
                        <div className="dd-d-name">{name}</div>
                        <div className="dd-d-bar">
                          <div className="dd-d-fill" style={{ width: `${pct}%` }}></div>
                        </div>
                        <div className="dd-d-tags">
                          <span className={`dd-d-tag ${diseaseType.toLowerCase().includes('viral') || diseaseType.toLowerCase().includes('virus') ? 'viral' : diseaseType.toLowerCase().includes('bact') ? 'bact' : ''}`}>
                            {diseaseType}
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
                          {pct}<span className="dd-d-pct-unit">%</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="dd-empty-results">
                  <div className="dd-empty-results-msg">
                    {language === 'en' ? 'No matching conditions found' : language === 'id' ? 'Tidak ada kondisi yang cocok' : 'Không tìm thấy tình trạng nào'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Action Bar */}
      <div className="dd-action-bar">
        <div className="dd-action-inner">
          <button className="dd-btn-back" onClick={previousStep}>
            ← {language === 'en' ? 'Back to Age' : language === 'id' ? 'Kembali ke Umur' : 'Quay lại Tuổi'}
          </button>
          <button className="dd-btn-all" onClick={() => window.location.href = '/poultry/diseases'}>
            {language === 'en' ? 'All Diseases' : language === 'id' ? 'Semua Penyakit' : 'Tất cả bệnh'}
          </button>
          <button
            className="dd-btn-diagnose"
            disabled={selectedSymptoms.length === 0}
            onClick={() => {
              setShowResults(true);
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

export default BodyPartSelectionNew;
