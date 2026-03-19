/**
 * BodyPartSelection Component
 * Step 2: Select affected body parts/systems and symptoms
 */

import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useDiagnosis } from '../contexts/DiagnosisContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { BODY_PARTS } from '../utils/constants';
import './BodyPartSelection.css';

// Translation object for UI text
const translations = {
  en: {
    searchAllSymptoms: 'Search All Symptom(s)',
    selectedSymptoms: 'Selected Symptom(s)',
    possibleConditions: 'Possible Condition(s)',
    searchPlaceholder: 'Search symptoms...',
    clearAll: 'Clear All',
    selectSymptoms: 'Select Symptoms',
    selectSymptomsSub: 'Search and select symptoms you observe',
    possibleConditionsSub: 'Select symptoms to see possible diseases',
    noSymptomsSelected: 'No symptoms selected',
    confidence: 'confidence',
    backToAge: 'Back to Age',
    showAllDiseases: 'Show All Diseases/Conditions',
    headRespiratory: 'Head & Respiratory',
    digestiveSystem: 'Digestive System',
    bonesJoints: 'Bones & Joints',
    skinFeathers: 'Skin & Feathers',
    reproductiveSystem: 'Reproductive System',
    behaviorSystemic: 'Behavior & Systemic',
    progressAge: 'Age',
    progressBodyPart: 'Body Part & Symptoms',
    progressResults: 'Results',
    viewDetails: 'View Details',
    compare: 'Compare ↓'
  },
  id: {
    searchAllSymptoms: 'Cari Semua Gejala',
    selectedSymptoms: 'Gejala Terpilih',
    possibleConditions: 'Kemungkinan Penyakit',
    searchPlaceholder: 'Cari gejala...',
    clearAll: 'Hapus Semua',
    selectSymptoms: 'Pilih Gejala',
    selectSymptomsSub: 'Cari dan pilih gejala yang Anda amati',
    possibleConditionsSub: 'Pilih gejala untuk melihat kemungkinan penyakit',
    noSymptomsSelected: 'Tidak ada gejala terpilih',
    confidence: 'keyakinan',
    backToAge: 'Kembali ke Umur',
    showAllDiseases: 'Tampilkan Semua Penyakit/Kondisi',
    headRespiratory: 'Kepala & Pernapasan',
    digestiveSystem: 'Sistem Pencernaan',
    bonesJoints: 'Tulang & Sendi',
    skinFeathers: 'Kulit & Bulu',
    reproductiveSystem: 'Sistem Reproduksi',
    behaviorSystemic: 'Perilaku & Sistemik',
    progressAge: 'Umur',
    progressBodyPart: 'Bagian Tubuh & Gejala',
    progressResults: 'Hasil',
    viewDetails: 'Lihat Detail',
    compare: 'Bandingkan ↓'
  },
  vi: {
    searchAllSymptoms: 'Tìm Kiếm Tất Cả Triệu Chứng',
    selectedSymptoms: 'Triệu Chứng Đã Chọn',
    possibleConditions: 'Bệnh Có Thể',
    searchPlaceholder: 'Tìm kiếm triệu chứng...',
    clearAll: 'Xóa Tất Cả',
    selectSymptoms: 'Chọn Triệu Chứng',
    selectSymptomsSub: 'Tìm kiếm và chọn các triệu chứng bạn quan sát',
    possibleConditionsSub: 'Chọn triệu chứng để xem các bệnh có thể',
    noSymptomsSelected: 'Chưa chọn triệu chứng nào',
    confidence: 'độ tin cậy',
    backToAge: 'Quay Lại Tuổi',
    showAllDiseases: 'Hiển Thị Tất Cả Bệnh/Tình Trạng',
    headRespiratory: 'Đầu & Hô Hấp',
    digestiveSystem: 'Hệ Tiêu Hóa',
    bonesJoints: 'Xương & Khớp',
    skinFeathers: 'Da & Lông',
    reproductiveSystem: 'Hệ Sinh Sản',
    behaviorSystemic: 'Hành Vi & Toàn Thân',
    progressAge: 'Tuổi',
    progressBodyPart: 'Bộ Phận Cơ Thể & Triệu Chứng',
    progressResults: 'Kết Quả',
    viewDetails: 'Xem Chi Tiết',
    compare: 'So Sánh ↓'
  }
};

// Helper function to get translated category name
const getCategoryName = (categoryId, t) => {
  const categoryNames = {
    respiratory: t.headRespiratory,
    digestive: t.digestiveSystem,
    musculoskeletal: t.bonesJoints,
    integumentary: t.skinFeathers,
    reproductive: t.reproductiveSystem,
    general: t.behaviorSystemic
  };
  return categoryNames[categoryId] || categoryId;
};

function ProgressBar({ step, t }) {
  const steps = [
    { num: 1, label: t?.progressAge || 'Age' },
    { num: 2, label: t?.progressBodyPart || 'Body Part & Symptoms' },
    { num: 3, label: t?.progressResults || 'Results' }
  ];

  return (
    <div style={{
      background: 'white',
      padding: '1rem',
      borderRadius: '12px',
      marginBottom: '2rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {steps.map((s, idx) => (
          <div key={s.num} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: s.num <= step ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : '#E5E7EB',
                color: s.num <= step ? 'white' : '#9CA3AF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.5rem',
                fontWeight: '600',
                fontSize: '1.125rem'
              }}>
                {s.num}
              </div>
              <div style={{
                fontSize: '0.875rem',
                fontWeight: s.num === step ? '600' : '400',
                color: s.num === step ? '#10B981' : '#6B7280'
              }}>
                {s.label}
              </div>
            </div>
            {idx < steps.length - 1 && (
              <div style={{
                height: '2px',
                flex: 1,
                background: s.num < step ? '#10B981' : '#E5E7EB',
                marginTop: '-1.5rem'
              }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const BodyPartSelection = () => {
  const { 
    selectedSymptoms,
    toggleSymptom,
    clearSymptoms,
    calculateResults,
    viewDiseaseDetail,
    setStep,
    selectedAge,
    bodyPartsWithSymptoms,
    diseases,
    AGE_GROUPS,
    filterDiseasesByAge,
    STEPS 
  } = useDiagnosis();

  const { language } = useLanguage();
  const normalizedLang = (language === 'vt' || language === 'vn') ? 'vi' : language;
  const t = translations[normalizedLang] || translations.en;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // State for differential diagnosis
  const [selectedForComparison, setSelectedForComparison] = useState(null);
  const differentialPanelRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});

  // Toggle category expansion
  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleContinue = () => {
    // Calculate results before showing results page
    calculateResults();
    setStep(STEPS.RESULTS);
  };

  const handleBack = () => {
    setStep(STEPS.AGE);
  };

  /**
   * Calculate consistency bonus based on logical symptom patterns
   * Rewards clinically coherent combinations
   */
  const calculateConsistencyBonus = (disease, matchedSymptoms) => {
    let bonus = 0;
    
    // Extract symptom categories
    const categories = matchedSymptoms.map(s => s.category || s.kategori || 'general');
    const categorySet = new Set(categories);
    
    // Check for specific symptom patterns
    const hasRespiratory = categories.some(c => 
      c === 'respiratory' || c === 'head_respiratory' || c === 'pernapasan'
    );
    const hasSystemic = categories.some(c => 
      c === 'general' || c === 'behavior' || c === 'systemic' || c === 'umum' || c === 'perilaku'
    );
    const hasDigestive = categories.some(c => 
      c === 'digestive' || c === 'droppings' || c === 'pencernaan' || c === 'kotoran'
    );
    const hasNeurological = categories.some(c => 
      c === 'neurological' || c === 'neck' || c === 'neurologis' || c === 'leher'
    );
    const hasSkinFeathers = categories.some(c => 
      c === 'skin' || c === 'feathers' || c === 'skin_feathers' || c === 'kulit' || c === 'bulu'
    );
    
    // PATTERN 1: Viral Respiratory Diseases
    const diseaseCategory = disease.category || disease.kategori || '';
    if ((diseaseCategory === 'Viral' || diseaseCategory === 'Virus') && hasRespiratory && hasSystemic) {
      bonus += 10;
    }
    
    // PATTERN 2: Bacterial Diseases
    if (diseaseCategory === 'Bacterial' || diseaseCategory === 'Bakteri') {
      if ((hasDigestive || hasRespiratory) && hasSystemic) {
        bonus += 10;
      }
    }
    
    // PATTERN 3: Neurological Diseases
    if (hasNeurological && (hasSystemic || hasRespiratory)) {
      bonus += 10;
    }
    
    // PATTERN 4: High Severity Multi-System Involvement
    const severityIsHigh = disease.severity === 'High' || 
                          disease.tingkat_keparahan === 'Tinggi' || 
                          disease.severity === 'Cao';
    
    if (severityIsHigh && categorySet.size >= 3) {
      bonus += 5;
    }
    
    // PATTERN 5: Parasitic/Fungal Skin Involvement
    if ((diseaseCategory === 'Parasitic' || diseaseCategory === 'Fungal' || 
         diseaseCategory === 'Parasit' || diseaseCategory === 'Jamur') && 
        hasSkinFeathers && hasSystemic) {
      bonus += 5;
    }
    
    // Cap bonus at 20 points maximum
    return Math.min(bonus, 20);
  };

  /**
   * Calculate hybrid confidence score for a disease
   * Uses 5 components: weighted, primary, specificity, category coverage, consistency
   */
  const calculateHybridScore = (disease, matchedSymptoms, symptomsArray) => {
    if (matchedSymptoms.length === 0) {
      return {
        total: 0,
        components: { weighted: 0, primary: 0, specificity: 0, category: 0, consistency: 0 },
        breakdown: { matchedSymptoms: 0, totalSymptoms: symptomsArray.length, matchedPrimary: 0, totalPrimary: 0 }
      };
    }
    
    // ===== COMPONENT 1: WEIGHTED SCORE (40%) =====
    const matchedWeight = matchedSymptoms.reduce((sum, s) => {
      const weight = typeof s === 'object' ? (s.weight || s.bobot || 0.5) : 0.5;
      return sum + weight;
    }, 0);
    const totalWeight = symptomsArray.reduce((sum, s) => {
      const weight = typeof s === 'object' ? (s.weight || s.bobot || 0.5) : 0.5;
      return sum + weight;
    }, 0);
    
    const weightedScore = totalWeight > 0 ? (matchedWeight / totalWeight) * 100 : 0;
    
    // ===== COMPONENT 2: PRIMARY SCORE (30%) =====
    const primarySymptoms = symptomsArray.filter(s => {
      if (typeof s === 'string') return false;
      const significance = s.significance || s.signifikansi;
      return significance === 'primary' || significance === 'primer';
    });
    const matchedPrimary = matchedSymptoms.filter(s => {
      if (typeof s === 'string') return false;
      const significance = s.significance || s.signifikansi;
      return significance === 'primary' || significance === 'primer';
    });
    
    let primaryScore = 0;
    if (primarySymptoms.length > 0) {
      primaryScore = (matchedPrimary.length / primarySymptoms.length) * 100;
      
      // ⭐ BONUS: +20 if ALL primary symptoms are matched
      if (matchedPrimary.length === primarySymptoms.length && primarySymptoms.length > 0) {
        primaryScore += 20;
        console.log(`✨ BONUS: ${disease.name || disease.nama} matched ALL ${primarySymptoms.length} primary symptoms!`);
      }
    } else {
      primaryScore = 50; // Default if no primary symptoms
    }
    
    // ===== COMPONENT 3: SPECIFICITY SCORE (20%) =====
    const highSpecificitySymptoms = symptomsArray.filter(s => {
      if (typeof s === 'string') return false;
      const specificity = s.specificity || s.spesifisitas;
      return specificity === 'high' || specificity === 'tinggi';
    });
    const matchedHighSpecificity = matchedSymptoms.filter(s => {
      if (typeof s === 'string') return false;
      const specificity = s.specificity || s.spesifisitas;
      return specificity === 'high' || specificity === 'tinggi';
    });
    
    let specificityScore = 50; // Default baseline
    if (highSpecificitySymptoms.length > 0) {
      specificityScore = (matchedHighSpecificity.length / highSpecificitySymptoms.length) * 100;
    }
    
    // ===== COMPONENT 4: CATEGORY COVERAGE (10%) =====
    const allCategories = [...new Set(
      symptomsArray.map(s => typeof s === 'object' ? (s.category || s.kategori || 'general') : 'general')
    )];
    const matchedCategories = [...new Set(
      matchedSymptoms.map(s => typeof s === 'object' ? (s.category || s.kategori || 'general') : 'general')
    )];
    
    const categoryCoverage = allCategories.length > 0 ? (matchedCategories.length / allCategories.length) * 100 : 0;
    
    // ===== COMPONENT 5: CONSISTENCY BONUS (0-20 points) =====
    const consistencyBonus = calculateConsistencyBonus(disease, matchedSymptoms);
    
    // ===== CALCULATE TOTAL SCORE =====
    let totalScore = (
      (weightedScore * 0.40) +      // 40% weight
      (primaryScore * 0.30) +       // 30% weight
      (specificityScore * 0.20) +   // 20% weight
      (categoryCoverage * 0.10) +   // 10% weight
      consistencyBonus              // 0-20 bonus points
    );
    
    // Ensure score is within 0-100 range
    totalScore = Math.max(0, Math.min(100, totalScore));
    totalScore = Math.round(totalScore * 10) / 10;
    
    return {
      total: totalScore,
      components: {
        weighted: Math.round(weightedScore * 0.40 * 10) / 10,
        primary: Math.round(primaryScore * 0.30 * 10) / 10,
        specificity: Math.round(specificityScore * 0.20 * 10) / 10,
        category: Math.round(categoryCoverage * 0.10 * 10) / 10,
        consistency: consistencyBonus
      },
      breakdown: {
        matchedSymptoms: matchedSymptoms.length,
        totalSymptoms: symptomsArray.length,
        matchedPrimary: matchedPrimary.length,
        totalPrimary: primarySymptoms.length,
        matchedCategories: matchedCategories.length,
        totalCategories: allCategories.length,
        allPrimaryMatched: matchedPrimary.length === primarySymptoms.length && primarySymptoms.length > 0
      }
    };
  };

  // Real-time disease matching as symptoms are selected
  const possibleDiseases = useMemo(() => {
    if (selectedSymptoms.length === 0 || !diseases) return [];

    console.log('🔍 DIAGNOSIS DEBUG - Selected symptoms:', selectedSymptoms);
    console.log('🔍 Total diseases to check:', diseases.length);

    // STAGE 2: Filter diseases by age if selected
    let filteredDiseases = diseases;
    if (selectedAge && selectedAge !== 'All ages' && filterDiseasesByAge) {
      filteredDiseases = filterDiseasesByAge(diseases, selectedAge);
    }

    // Filter out non-chicken diseases (Turkey, Duck, Quail specific)
    const NON_CHICKEN_DISEASE_IDS = [1076, 1102, 1103, 1104, 1105, 1108];
    const chickenDiseases = filteredDiseases.filter(disease => {
      // Exclude diseases with specific IDs
      if (NON_CHICKEN_DISEASE_IDS.includes(disease.id)) {
        return false;
      }
      // Exclude diseases with Turkey/Duck/Quail in the name
      const diseaseName = disease.name || disease.nama || '';
      if (diseaseName.includes('Turkey') || diseaseName.includes('Duck') || 
          diseaseName.includes('Quail') || diseaseName.includes('Kalkun') || 
          diseaseName.includes('Bebek') || diseaseName.includes('Puyuh')) {
        return false;
      }
      return true;
    });

    console.log('🐔 Chicken-only diseases:', chickenDiseases.length, '(filtered out', diseases.length - chickenDiseases.length, 'total excluded)');

    console.log('\n🔍 HYBRID SCORING - Starting diagnosis...');
    
    const scored = chickenDiseases.map(disease => {
      // Handle both English (symptomsEnhanced) and Indonesian (gejala_lengkap) field names
      const symptomsArray = disease.symptomsEnhanced || disease.gejala_lengkap || disease.symptoms || [];
      
      // Filter matched symptoms
      // CRITICAL: selectedSymptoms contains NAMES not IDs!
      const matchedSymptoms = symptomsArray.filter(symptom => {
        const symptomName = typeof symptom === 'string' ? symptom : (symptom.name || symptom.nama);
        return selectedSymptoms.includes(symptomName);
      });
      
      // Calculate hybrid score
      const scoreData = calculateHybridScore(disease, matchedSymptoms, symptomsArray);
      
      // Debug for Avian Influenza
      if (disease.id === 1001) {
        console.log('\n🦅 AVIAN INFLUENZA DEBUG:');
        console.log('  - Disease name:', disease.name || disease.nama);
        console.log('  - Total symptoms:', symptomsArray.length);
        console.log('  - Matched count:', matchedSymptoms.length);
        console.log('  - Matched symptoms:', matchedSymptoms.map(s => s.name || s.nama));
        console.log('  - Score components:', scoreData.components);
        console.log('  - Breakdown:', scoreData.breakdown);
        console.log('  - TOTAL SCORE:', scoreData.total + '%');
      }

      return {
        ...disease,
        matchCount: matchedSymptoms.length,
        percentage: scoreData.total,
        scoreComponents: scoreData.components,
        breakdown: scoreData.breakdown
      };
    });

    const filtered = scored.filter(d => d.matchCount > 0);
    console.log(`Diseases with matches: ${filtered.length}`);
    
    // Sort by total score (highest first)
    const sorted = filtered.sort((a, b) => b.percentage - a.percentage);
    
    // Log top 5 for debugging
    console.log('\n🏆 TOP 5 RESULTS (HYBRID SCORING):');
    sorted.slice(0, 5).forEach((r, i) => {
      const diseaseName = r.name || r.nama;
      console.log(`#${i+1}: ${diseaseName} - ${r.percentage}%`);
      console.log(`   Components: W:${r.scoreComponents.weighted} P:${r.scoreComponents.primary} S:${r.scoreComponents.specificity} C:${r.scoreComponents.category} +${r.scoreComponents.consistency}`);
      console.log(`   Match: ${r.breakdown.matchedSymptoms}/${r.breakdown.totalSymptoms} total, ${r.breakdown.matchedPrimary}/${r.breakdown.totalPrimary} primary`);
    });
    
    const aiResult = sorted.find(d => d.id === 1001);
    if (aiResult) {
      const aiRank = sorted.indexOf(aiResult) + 1;
      console.log(`\n✅ Avian Influenza found at rank #${aiRank} with ${aiResult.percentage}%`);
    } else if (selectedSymptoms.length > 0) {
      console.warn('⚠️ Avian Influenza not in results');
    }

    return sorted.slice(0, 10); // Top 10 matches
  }, [selectedSymptoms, diseases]);

  // Filter symptoms by search term
  const filteredBodyParts = useMemo(() => {
    if (!bodyPartsWithSymptoms) return [];
    
    if (!searchTerm) return bodyPartsWithSymptoms;
    
    return bodyPartsWithSymptoms.map(part => ({
      ...part,
      symptoms: part.symptoms.filter(symptom => 
        symptom.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(part => part.symptoms.length > 0);
  }, [bodyPartsWithSymptoms, searchTerm]);

  return (
    <div className="body-part-selection">
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        <ProgressBar step={2} t={t} />
        
        {/* Header */}
        <div className="step-header" style={{ marginBottom: '1.5rem' }}>
          <h2 className="step-title">{t.selectSymptoms}</h2>
          <p className="step-subtitle">
            {t.selectSymptomsSub}
            {selectedAge && <span className="age-badge"> • Age: {selectedAge}</span>}
          </p>
        </div>

      {/* 3-BOX LAYOUT */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        
        {/* BOX 1: Search and Select Symptoms */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          maxHeight: '600px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ 
            background: '#10B981', 
            color: 'white', 
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontWeight: '600',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '1.25rem' }}>1</span>
            <span>{t.searchAllSymptoms}</span>
          </div>

          {/* Search Input */}
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '0.75rem',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              marginBottom: '1rem',
              fontSize: '0.875rem',
              width: '100%'
            }}
          />

          {/* Symptoms List by Category - Accordion Style */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredBodyParts.map((part) => {
              const isExpanded = expandedCategories[part.id];
              const categorySymptomCount = part.symptoms.length;
              
              return (
              <div key={part.id} style={{ marginBottom: '0.5rem' }}>
                {/* Category Header - Clickable */}
                <div
                  onClick={() => toggleCategory(part.id)}
                  style={{
                    padding: '0.75rem',
                    background: isExpanded ? '#F0FDF4' : '#F9FAFB',
                    border: '1px solid',
                    borderColor: isExpanded ? '#10B981' : '#E5E7EB',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                  onMouseEnter={(e) => {
                    if (!isExpanded) e.currentTarget.style.background = '#F3F4F6';
                  }}
                  onMouseLeave={(e) => {
                    if (!isExpanded) e.currentTarget.style.background = '#F9FAFB';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1rem' }}>{part.icon}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1F2937' }}>
                      {getCategoryName(part.id, t)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1rem' }}>
                      {isExpanded ? '▲' : '▼'}
                    </span>
                  </div>
                </div>
                
                {/* Symptoms List - Collapsible */}
                {isExpanded && (
                  <div style={{ paddingLeft: '0.5rem', marginTop: '0.5rem' }}>
                    {part.symptoms.map((symptom, idx) => {
                  const isSelected = selectedSymptoms.includes(symptom);
                  return (
                    <div
                      key={`${part.id}-${idx}-${symptom}`}
                      onClick={() => toggleSymptom(symptom)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        marginBottom: '0.5rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderRadius: '6px',
                        background: isSelected ? '#F0FDF4' : 'transparent',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.background = '#F9FAFB';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <span style={{ 
                        fontSize: '0.8125rem',
                        color: isSelected ? '#059669' : '#374151',
                        fontWeight: isSelected ? '500' : '400'
                      }}>
                        {symptom}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSymptom(symptom);
                        }}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: isSelected ? '#10B981' : '#EF4444',
                          border: 'none',
                          color: 'white',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1rem',
                          fontWeight: '600'
                        }}
                      >
                        {isSelected ? '✓' : '+'}
                      </button>
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

        {/* BOX 2: Selected Symptoms */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          maxHeight: '600px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ 
            background: '#10B981', 
            color: 'white', 
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontWeight: '600',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>2</span>
              <span>{t.selectedSymptoms}</span>
            </div>
            {selectedSymptoms.length > 0 && (
              <button
                onClick={clearSymptoms}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                {t.clearAll}
              </button>
            )}
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {selectedSymptoms.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#9CA3AF' }}>
                <p style={{ fontSize: '0.875rem' }}>{t.noSymptomsSelected}</p>
              </div>
            ) : (
              selectedSymptoms.map((symptom, idx) => (
                <div
                  key={`selected-${idx}-${symptom}`}
                  style={{
                    padding: '0.75rem',
                    marginBottom: '0.5rem',
                    background: '#F0FDF4',
                    border: '1px solid #10B981',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span style={{ 
                    fontSize: '0.8125rem',
                    color: '#059669',
                    fontWeight: '500',
                    flex: 1
                  }}>
                    {symptom}
                  </span>
                  <button
                    onClick={() => toggleSymptom(symptom)}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#06B6D4',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem',
                      fontWeight: '600'
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* BOX 3: Possible Conditions */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          maxHeight: '600px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ 
            background: '#10B981', 
            color: 'white', 
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontWeight: '600',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '1.25rem' }}>3</span>
            <span>{t.possibleConditions}</span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {possibleDiseases.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#9CA3AF' }}>
                <p style={{ fontSize: '0.875rem' }}>{t.possibleConditionsSub}</p>
              </div>
            ) : (
              possibleDiseases.map((disease, index) => {
                const getRankIcon = (rank) => {
                  if (rank === 1) return '🥇';
                  if (rank === 2) return '🥈';
                  if (rank === 3) return '🥉';
                  return `#${rank}`;
                };
                
                const getConfidenceColor = (conf) => {
                  if (conf >= 80) return '#10B981';
                  if (conf >= 60) return '#F59E0B';
                  return '#EF4444';
                };
                
                const getSeverityBadge = (sev) => {
                  const highSev = ['High', 'Tinggi', 'Cao'];
                  if (highSev.includes(sev)) return { bg: '#FEE2E2', color: '#DC2626', icon: '🔴' };
                  return { bg: '#FEF3C7', color: '#D97706', icon: '🟡' };
                };
                
                const diseaseSeverity = disease.severity || disease.tingkat_keparahan || 'Medium';
                const diseaseCategory = disease.category || disease.kategori || 'Unknown';
                const diseaseZoonotic = disease.zoonotic || disease.zoonosis || false;
                const severityStyle = getSeverityBadge(diseaseSeverity);
                
                // Calculate primary symptom matches for star indicator
                const symptomsArray = disease.symptomsEnhanced || disease.gejala_lengkap || [];
                const primarySymptoms = symptomsArray.filter(s => s.significance === 'primary' || s.signifikansi === 'primer');
                const matchedPrimary = primarySymptoms.filter(s => selectedSymptoms.includes(s.name || s.nama)).length;
                const totalPrimary = Math.min(primarySymptoms.length, 5);
                
                return (
                  <div
                    key={disease.id}
                    style={{
                      padding: '0.75rem',
                      marginBottom: '0.75rem',
                      background: 'white',
                      border: selectedForComparison?.id === disease.id ? '2px solid #10B981' : '1px solid #E5E7EB',
                      borderRadius: '8px',
                      transition: 'all 0.2s',
                      boxShadow: selectedForComparison?.id === disease.id ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none'
                    }}
                  >
                    {/* Header with rank and name */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1.25rem', lineHeight: '1' }}>{getRankIcon(index + 1)}</span>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ 
                          fontSize: '0.875rem',
                          fontWeight: '700',
                          color: '#111827',
                          margin: 0,
                          lineHeight: '1.3',
                          cursor: 'pointer'
                        }}
                        onClick={() => viewDiseaseDetail(disease)}
                        >
                          {disease.name || disease.nama || disease.ten_benh || 'Unknown Disease'}
                        </h3>
                      </div>
                    </div>
                    
                    {/* Confidence bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <div style={{ flex: 1, background: '#E5E7EB', borderRadius: '9999px', height: '8px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${Math.min(disease.percentage, 100)}%`,
                          height: '100%',
                          background: getConfidenceColor(disease.percentage),
                          borderRadius: '9999px',
                          transition: 'width 0.5s ease-in-out'
                        }} />
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#374151', minWidth: '45px', textAlign: 'right' }}>
                        {disease.percentage.toFixed(1)}%
                      </span>
                    </div>
                    
                    {/* Badges row */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.5rem' }}>
                      <span style={{
                        fontSize: '0.625rem',
                        padding: '0.125rem 0.5rem',
                        background: '#DBEAFE',
                        color: '#1E40AF',
                        borderRadius: '4px',
                        fontWeight: '600'
                      }}>
                        🦠 {diseaseCategory}
                      </span>
                      <span style={{
                        fontSize: '0.625rem',
                        padding: '0.125rem 0.5rem',
                        background: severityStyle.bg,
                        color: severityStyle.color,
                        borderRadius: '4px',
                        fontWeight: '600'
                      }}>
                        {severityStyle.icon} {diseaseSeverity}
                      </span>
                      {diseaseZoonotic && (
                        <span style={{
                          fontSize: '0.625rem',
                          padding: '0.125rem 0.5rem',
                          background: '#FED7AA',
                          color: '#C2410C',
                          borderRadius: '4px',
                          fontWeight: '600'
                        }}>
                          ⚠️ Zoonotic
                        </span>
                      )}
                    </div>
                    
                    {/* Symptom match indicator */}
                    <div style={{ marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.625rem', color: '#6B7280' }}>
                        <span>Match:</span>
                        <div style={{ display: 'flex', gap: '1px' }}>
                          {[...Array(totalPrimary || 5)].map((_, i) => (
                            <span key={i} style={{ color: i < matchedPrimary ? '#F59E0B' : '#D1D5DB' }}>
                              {i < matchedPrimary ? '⭐' : '○'}
                            </span>
                          ))}
                        </div>
                        <span style={{ color: '#9CA3AF' }}>
                          {matchedPrimary}/{totalPrimary || 0} primary
                        </span>
                      </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => viewDiseaseDetail(disease)}
                        style={{
                          flex: 1,
                          fontSize: '0.625rem',
                          padding: '0.375rem 0.75rem',
                          border: '1px solid #10B981',
                          color: '#10B981',
                          background: 'white',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#D1FAE5'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                      >
                        {t.viewDetails}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedForComparison(disease);
                          setTimeout(() => {
                            differentialPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }, 100);
                        }}
                        style={{
                          fontSize: '0.625rem',
                          padding: '0.375rem 0.75rem',
                          border: '1px solid #D1D5DB',
                          color: '#374151',
                          background: 'white',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                      >
                        {t.compare}
                      </button>
                    </div>
                    
                    {/* High severity / Zoonotic alerts */}
                    {(['High', 'Tinggi', 'Cao'].includes(diseaseSeverity) || diseaseZoonotic) && (
                      <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #F3F4F6' }}>
                        {['High', 'Tinggi', 'Cao'].includes(diseaseSeverity) && (
                          <p style={{ fontSize: '0.625rem', color: '#DC2626', margin: '0 0 0.25rem 0' }}>
                            🚨 High severity - urgent action required
                          </p>
                        )}
                        {diseaseZoonotic && (
                          <p style={{ fontSize: '0.625rem', color: '#C2410C', margin: 0 }}>
                            👤 Can infect humans - use PPE
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
        <button
          type="button"
          onClick={handleBack}
          className="btn btn-secondary"
        >
          ← {t.backToAge}
        </button>

        <button
          type="button"
          onClick={() => setStep(STEPS.ALL_DISEASES)}
          className="btn btn-primary"
        >
          {t.showAllDiseases} →
        </button>
      </div>
      
      {/* DIFFERENTIAL DIAGNOSIS PANEL */}
      {selectedForComparison && possibleDiseases.length > 1 && (
        <div 
          ref={differentialPanelRef}
          style={{
            marginTop: '2rem',
            background: 'linear-gradient(to bottom right, #D1FAE5, #ECFDF5)',
            border: '2px solid #A7F3D0',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            animation: 'slideIn 0.3s ease-out'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1F2937', margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                📊 Differential Diagnosis
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>
                Comparing conditions ranked by confidence
              </p>
            </div>
            <button
              onClick={() => setSelectedForComparison(null)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                color: '#9CA3AF',
                cursor: 'pointer',
                padding: '0.25rem',
                lineHeight: '1'
              }}
            >
              ✕
            </button>
          </div>
          
          {/* Selected disease header */}
          <div style={{
            background: 'white',
            border: '2px solid #10B981',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>🥇</span>
                <div>
                  <span style={{ fontWeight: '700', color: '#1F2937', fontSize: '1rem' }}>
                    {selectedForComparison.name || selectedForComparison.nama || selectedForComparison.ten_benh}
                  </span>
                  <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: '0.25rem 0 0 0' }}>
                    Your selected condition
                  </p>
                </div>
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#10B981' }}>
                {selectedForComparison.percentage.toFixed(1)}%
              </span>
            </div>
          </div>
          
          {/* Comparison cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {possibleDiseases
              .filter(d => d.id !== selectedForComparison.id)
              .slice(0, 2)
              .map((compareDisease, index) => {
                // Calculate symptom overlap
                const selectedDiseaseSymptoms = (selectedForComparison.symptomsEnhanced || selectedForComparison.gejala_lengkap || [])
                  .filter(s => selectedSymptoms.includes(s.name || s.nama))
                  .map(s => s.id);
                
                const compareDiseaseSymptoms = (compareDisease.symptomsEnhanced || compareDisease.gejala_lengkap || [])
                  .filter(s => selectedSymptoms.includes(s.name || s.nama))
                  .map(s => s.id);
                
                const overlap = selectedDiseaseSymptoms.filter(id => compareDiseaseSymptoms.includes(id));
                const overlapPercent = selectedDiseaseSymptoms.length > 0 ? Math.round(overlap.length / selectedDiseaseSymptoms.length * 100) : 0;
                
                // Get symptom names
                const getSymptomName = (symptomId) => {
                  const allSymptoms = [
                    ...(selectedForComparison.symptomsEnhanced || selectedForComparison.gejala_lengkap || []),
                    ...(compareDisease.symptomsEnhanced || compareDisease.gejala_lengkap || [])
                  ];
                  const sym = allSymptoms.find(s => s.id === symptomId);
                  return sym ? (sym.name || sym.nama) : symptomId;
                };
                
                const overlappingSymptoms = overlap.map(getSymptomName);
                const uniqueToSelected = selectedDiseaseSymptoms.filter(id => !compareDiseaseSymptoms.includes(id)).map(getSymptomName);
                const uniqueToCompare = compareDiseaseSymptoms.filter(id => !selectedDiseaseSymptoms.includes(id)).map(getSymptomName);
                
                // Differentiation tip
                const selectedCategory = selectedForComparison.category || selectedForComparison.kategori;
                const compareCategory = compareDisease.category || compareDisease.kategori;
                const differentiationTip = selectedCategory === compareCategory
                  ? `Both are ${selectedCategory} diseases. Focus on unique symptom patterns and disease progression timeline to differentiate.`
                  : `Key difference: ${selectedForComparison.name || selectedForComparison.nama} is ${selectedCategory}, while ${compareDisease.name || compareDisease.nama} is ${compareCategory}. This fundamentally affects treatment approach.`;
                
                return (
                  <div
                    key={compareDisease.id}
                    style={{
                      background: 'white',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      padding: '1rem',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}
                  >
                    {/* Comparison header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <h3 style={{ fontSize: '0.875rem', fontWeight: '700', color: '#1F2937', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>🔍</span>
                        <span>vs #{index + 2}: {compareDisease.name || compareDisease.nama || compareDisease.ten_benh}</span>
                      </h3>
                      <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', background: '#F3F4F6', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                        {compareDisease.percentage.toFixed(1)}%
                      </span>
                    </div>
                    
                    {/* Overlap visualization */}
                    <div style={{ marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: '600' }}>Symptom Overlap:</span>
                        <span style={{ fontWeight: '600' }}>
                          {overlapPercent}% ({overlap.length}/{selectedSymptoms.length} symptoms)
                        </span>
                      </div>
                      <div style={{ width: '100%', background: '#E5E7EB', borderRadius: '9999px', height: '10px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${overlapPercent}%`,
                          height: '100%',
                          background: '#8B5CF6',
                          borderRadius: '9999px',
                          transition: 'width 0.5s ease-in-out'
                        }} />
                      </div>
                    </div>
                    
                    {/* Overlapping symptoms */}
                    {overlappingSymptoms.length > 0 && (
                      <div style={{ marginBottom: '0.75rem' }}>
                        <h4 style={{ fontSize: '0.75rem', fontWeight: '600', color: '#374151', margin: '0 0 0.5rem 0' }}>
                          ✅ Overlapping symptoms:
                        </h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                          {overlappingSymptoms.slice(0, 5).map((symptom, i) => (
                            <span key={i} style={{
                              fontSize: '0.625rem',
                              padding: '0.25rem 0.5rem',
                              background: '#F3E8FF',
                              color: '#6B21A8',
                              borderRadius: '4px'
                            }}>
                              {symptom}
                            </span>
                          ))}
                          {overlappingSymptoms.length > 5 && (
                            <span style={{ fontSize: '0.625rem', color: '#9CA3AF', fontStyle: 'italic' }}>
                              +{overlappingSymptoms.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Unique symptoms - side by side */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      {/* Unique to selected */}
                      <div style={{ borderLeft: '2px solid #10B981', paddingLeft: '0.5rem' }}>
                        <h4 style={{ fontSize: '0.75rem', fontWeight: '600', color: '#059669', margin: '0 0 0.5rem 0' }}>
                          🔹 Unique to {(selectedForComparison.name || selectedForComparison.nama || '').split(' ')[0]}:
                        </h4>
                        {uniqueToSelected.length > 0 ? (
                          <ul style={{ fontSize: '0.625rem', color: '#6B7280', margin: 0, paddingLeft: '1rem', listStyle: 'disc' }}>
                            {uniqueToSelected.slice(0, 3).map((symptom, i) => (
                              <li key={i}>{symptom}</li>
                            ))}
                            {uniqueToSelected.length > 3 && (
                              <li style={{ color: '#9CA3AF', fontStyle: 'italic' }}>
                                +{uniqueToSelected.length - 3} more
                              </li>
                            )}
                          </ul>
                        ) : (
                          <p style={{ fontSize: '0.625rem', color: '#9CA3AF', fontStyle: 'italic', margin: 0 }}>None specific</p>
                        )}
                      </div>
                      
                      {/* Unique to compare */}
                      <div style={{ borderLeft: '2px solid #F97316', paddingLeft: '0.5rem' }}>
                        <h4 style={{ fontSize: '0.75rem', fontWeight: '600', color: '#C2410C', margin: '0 0 0.5rem 0' }}>
                          🔹 Unique to {(compareDisease.name || compareDisease.nama || '').split(' ')[0]}:
                        </h4>
                        {uniqueToCompare.length > 0 ? (
                          <ul style={{ fontSize: '0.625rem', color: '#6B7280', margin: 0, paddingLeft: '1rem', listStyle: 'disc' }}>
                            {uniqueToCompare.slice(0, 3).map((symptom, i) => (
                              <li key={i}>{symptom}</li>
                            ))}
                            {uniqueToCompare.length > 3 && (
                              <li style={{ color: '#9CA3AF', fontStyle: 'italic' }}>
                                +{uniqueToCompare.length - 3} more
                              </li>
                            )}
                          </ul>
                        ) : (
                          <p style={{ fontSize: '0.625rem', color: '#9CA3AF', fontStyle: 'italic', margin: 0 }}>None specific</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Differentiation tip */}
                    <div style={{
                      background: '#FEF3C7',
                      borderLeft: '4px solid #F59E0B',
                      padding: '0.75rem',
                      marginBottom: '0.75rem',
                      borderRadius: '4px'
                    }}>
                      <p style={{ fontSize: '0.75rem', color: '#92400E', margin: 0 }}>
                        <span style={{ fontWeight: '600' }}>💡 Differentiation Tip:</span>
                        {' '}
                        {differentiationTip}
                      </p>
                    </div>
                    
                    {/* Action button */}
                    <button
                      onClick={() => {
                        setSelectedForComparison(compareDisease);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      style={{
                        width: '100%',
                        fontSize: '0.75rem',
                        padding: '0.5rem 1rem',
                        border: '2px solid #10B981',
                        color: '#10B981',
                        background: 'white',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#EFF6FF'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                    >
                      Select This Disease Instead
                    </button>
                  </div>
                );
              })}
          </div>
          
          {/* Footer actions */}
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => viewDiseaseDetail(selectedForComparison)}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                background: '#10B981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#059669'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#10B981'}
            >
              View Full Disease Details
            </button>
            <button
              onClick={() => setSelectedForComparison(null)}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'white',
                color: '#374151',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
            >
              Close
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default BodyPartSelection;
