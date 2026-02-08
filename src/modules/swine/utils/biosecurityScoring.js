/**
 * Biosecurity scoring calculations
 * Based on Biocheck Pig 4.0 methodology
 */

import { getFocusAreaQuestions, getFilteredFocusAreaQuestions } from '../data/questions_data';

/**
 * Calculate score for a single question
 * @param {object} question - Question object
 * @param {any} answer - User's answer
 * @returns {number} Score (0-100)
 */
function calculateQuestionScore(question, answer) {
  if (!answer) return 0;

  const { type, options } = question;

  if (type === 'single_choice' || type === 'single_select') {
    const selectedOption = options.find(opt => opt.value === answer);
    return selectedOption?.score || 0;
  }

  if (type === 'multiple_choice' || type === 'multi_select') {
    // For multiple choice, calculate average score of selected options
    if (!Array.isArray(answer) || answer.length === 0) return 0;

    const selectedOptions = options.filter(opt => answer.includes(opt.value));
    const totalScore = selectedOptions.reduce((sum, opt) => sum + (opt.score || 0), 0);
    return selectedOptions.length > 0 ? totalScore / selectedOptions.length : 0;
  }

  // For numeric and text inputs, no scoring (or implement custom logic)
  return 0;
}

/**
 * Calculate score for a focus area
 * @param {number} focusAreaNumber - Focus area number (1-4)
 * @param {object} answers - Answers object { questionId: answer }
 * @param {string} language - Language code
 * @param {string} farmType - Farm type for filtering questions
 * @returns {number} Focus area score (0-100)
 */
export function calculateFocusAreaScore(focusAreaNumber, answers, language = 'en', farmType = null) {
  const questions = farmType
    ? getFilteredFocusAreaQuestions(focusAreaNumber, language, farmType)
    : getFocusAreaQuestions(focusAreaNumber, language);

  if (questions.length === 0) return 0;

  let totalScore = 0;
  let scoredQuestions = 0;

  questions.forEach(question => {
    const answer = answers[question.id];
    if (answer !== undefined && answer !== null) {
      const score = calculateQuestionScore(question, answer);
      totalScore += score;
      scoredQuestions++;
    }
  });

  return scoredQuestions > 0 ? Math.round(totalScore / scoredQuestions) : 0;
}

/**
 * Calculate External Biosecurity score (Focus Areas 1 & 2)
 * @param {object} assessment - Assessment object with focus_areas
 * @param {string} language - Language code
 * @returns {number} External biosecurity score (0-100)
 */
export function calculateExternalScore(assessment, language = 'en') {
  const fa1Score = assessment.focus_areas[1]?.score || 0;
  const fa2Score = assessment.focus_areas[2]?.score || 0;

  return Math.round((fa1Score + fa2Score) / 2);
}

/**
 * Calculate Internal Biosecurity score (Focus Areas 3 & 4)
 * @param {object} assessment - Assessment object with focus_areas
 * @param {string} language - Language code
 * @returns {number} Internal biosecurity score (0-100)
 */
export function calculateInternalScore(assessment, language = 'en') {
  const fa3Score = assessment.focus_areas[3]?.score || 0;
  const fa4Score = assessment.focus_areas[4]?.score || 0;

  return Math.round((fa3Score + fa4Score) / 2);
}

/**
 * Calculate Overall Biosecurity score
 * @param {object} assessment - Assessment object with focus_areas
 * @param {string} language - Language code
 * @returns {number} Overall biosecurity score (0-100)
 */
export function calculateOverallScore(assessment, language = 'en') {
  const externalScore = calculateExternalScore(assessment, language);
  const internalScore = calculateInternalScore(assessment, language);

  return Math.round((externalScore + internalScore) / 2);
}

/**
 * Get score interpretation with enterprise thresholds
 * @param {number} score - Score value (0-100)
 * @param {string} language - Language code
 * @returns {object} Interpretation object { label, color, level, certification }
 */
export function getScoreInterpretation(score, language = 'en') {
  const interpretations = {
    en: {
      excellence: { label: 'Excellence Level', color: '#10B981', level: 'excellence', certification: 'excellence' },
      certified: { label: 'Certification Eligible', color: '#3B82F6', level: 'certified', certification: 'eligible' },
      pass: { label: 'Pass', color: '#F59E0B', level: 'pass', certification: 'pass' },
      fail: { label: 'Needs Improvement', color: '#EF4444', level: 'fail', certification: 'not_eligible' }
    },
    id: {
      excellence: { label: 'Tingkat Keunggulan', color: '#10B981', level: 'excellence', certification: 'excellence' },
      certified: { label: 'Memenuhi Sertifikasi', color: '#3B82F6', level: 'certified', certification: 'eligible' },
      pass: { label: 'Lulus', color: '#F59E0B', level: 'pass', certification: 'pass' },
      fail: { label: 'Perlu Perbaikan', color: '#EF4444', level: 'fail', certification: 'not_eligible' }
    },
    vt: {
      excellence: { label: 'Mức Xuất Sắc', color: '#10B981', level: 'excellence', certification: 'excellence' },
      certified: { label: 'Đủ Điều Kiện Chứng Nhận', color: '#3B82F6', level: 'certified', certification: 'eligible' },
      pass: { label: 'Đạt', color: '#F59E0B', level: 'pass', certification: 'pass' },
      fail: { label: 'Cần Cải Thiện', color: '#EF4444', level: 'fail', certification: 'not_eligible' }
    }
  };

  const langInterpretations = interpretations[language] || interpretations.en;

  // Enterprise thresholds: 90+ excellence, 80+ certification, 60+ pass, <60 fail
  if (score >= 90) return langInterpretations.excellence;
  if (score >= 80) return langInterpretations.certified;
  if (score >= 60) return langInterpretations.pass;
  return langInterpretations.fail;
}

/**
 * Get critical action items (questions with score < 50)
 * @param {number} focusAreaNumber - Focus area number
 * @param {object} answers - Answers object
 * @param {string} language - Language code
 * @param {string} farmType - Farm type for filtering
 * @returns {array} Array of critical items { question, answer, score }
 */
export function getCriticalActionItems(focusAreaNumber, answers, language = 'en', farmType = null) {
  const questions = farmType
    ? getFilteredFocusAreaQuestions(focusAreaNumber, language, farmType)
    : getFocusAreaQuestions(focusAreaNumber, language);
  const criticalItems = [];

  questions.forEach(question => {
    const answer = answers[question.id];
    if (answer !== undefined && answer !== null) {
      const score = calculateQuestionScore(question, answer);
      if (score < 50) {
        criticalItems.push({
          question: question.text,
          questionNumber: question.number,
          answer,
          score,
          focusArea: focusAreaNumber
        });
      }
    }
  });

  return criticalItems;
}

/**
 * Detect farm type based on farm profile answers
 * @param {object} profileAnswers - Farm profile answers
 * @returns {string} Farm type: 'breeding', 'finishing', 'nursery', 'farrow_to_finish'
 */
export function detectFarmType(profileAnswers) {
  const categories = profileAnswers.pre_q1 || [];

  if (!Array.isArray(categories) || categories.length === 0) {
    return 'farrow_to_finish'; // Default
  }

  const hasBreeding = categories.includes('sows_gilts_boars');
  const hasSuckling = categories.includes('suckling_piglets');
  const hasWeaned = categories.includes('weaned_piglets');
  const hasSlaughter = categories.includes('slaughter_pigs');

  // Farrow to finish: has all or most categories
  if (hasBreeding && hasSuckling && (hasWeaned || hasSlaughter)) {
    return 'farrow_to_finish';
  }

  // Breeding: only breeding animals and suckling piglets
  if (hasBreeding && hasSuckling && !hasWeaned && !hasSlaughter) {
    return 'breeding';
  }

  // Nursery: only weaned piglets
  if (!hasBreeding && !hasSuckling && hasWeaned && !hasSlaughter) {
    return 'nursery';
  }

  // Finishing: only slaughter pigs
  if (!hasBreeding && !hasSuckling && !hasWeaned && hasSlaughter) {
    return 'finishing';
  }

  // Default to farrow_to_finish if unclear
  return 'farrow_to_finish';
}

/**
 * Calculate weighted category scores (Enterprise feature)
 * @param {object} assessment - Assessment object with all answers
 * @param {string} language - Language code
 * @returns {object} Category breakdown with weighted scores
 */
export function calculateCategoryBreakdown(assessment, language = 'en') {
  // Category weights from enterprise spec (each 25%)
  const categories = {
    purchasing_transportation: {
      weight: 0.25,
      focusAreas: [1], // Focus Area 1
      name: {
        en: 'Purchase & Transport',
        id: 'Pembelian & Transportasi',
        vt: 'Mua & Vận Chuyển'
      }
    },
    facilities_people: {
      weight: 0.25,
      focusAreas: [2], // Focus Area 2
      name: {
        en: 'Facilities & People',
        id: 'Fasilitas & Orang',
        vt: 'Cơ Sở & Con Người'
      }
    },
    production_management: {
      weight: 0.25,
      focusAreas: [3], // Focus Area 3
      name: {
        en: 'Production Management',
        id: 'Manajemen Produksi',
        vt: 'Quản Lý Sản Xuất'
      }
    },
    cleaning_procedures: {
      weight: 0.25,
      focusAreas: [4], // Focus Area 4
      name: {
        en: 'Cleaning & Disinfection',
        id: 'Pembersihan & Disinfeksi',
        vt: 'Vệ Sinh & Khử Trùng'
      }
    }
  };

  const breakdown = {};
  let totalWeightedScore = 0;

  Object.keys(categories).forEach(categoryKey => {
    const category = categories[categoryKey];
    let categoryScore = 0;
    let focusAreaCount = 0;

    // Calculate average score across focus areas in this category
    category.focusAreas.forEach(faNum => {
      const faScore = assessment.focus_areas?.[faNum]?.score || 0;
      categoryScore += faScore;
      focusAreaCount++;
    });

    const avgScore = focusAreaCount > 0 ? categoryScore / focusAreaCount : 0;
    const weightedScore = avgScore * category.weight;
    totalWeightedScore += weightedScore;

    breakdown[categoryKey] = {
      name: category.name[language] || category.name.en,
      score: Math.round(avgScore),
      weight: category.weight,
      weightedScore: Math.round(weightedScore * 100) / 100
    };
  });

  return {
    categories: breakdown,
    totalWeightedScore: Math.round(totalWeightedScore)
  };
}

/**
 * Get certification status based on score
 * @param {number} score - Overall score
 * @param {string} language - Language code
 * @returns {object} Certification status
 */
export function getCertificationStatus(score, language = 'en') {
  const statuses = {
    en: {
      excellence: { status: 'Excellence Level', badge: '🏆', description: 'Outstanding biosecurity practices' },
      eligible: { status: 'Certification Eligible', badge: '✅', description: 'Meets certification requirements' },
      pass: { status: 'Pass', badge: '✓', description: 'Acceptable biosecurity level' },
      fail: { status: 'Not Eligible', badge: '⚠️', description: 'Improvements required for certification' }
    },
    id: {
      excellence: { status: 'Tingkat Keunggulan', badge: '🏆', description: 'Praktik biosekuriti luar biasa' },
      eligible: { status: 'Memenuhi Sertifikasi', badge: '✅', description: 'Memenuhi persyaratan sertifikasi' },
      pass: { status: 'Lulus', badge: '✓', description: 'Tingkat biosekuriti dapat diterima' },
      fail: { status: 'Tidak Memenuhi', badge: '⚠️', description: 'Diperlukan perbaikan untuk sertifikasi' }
    },
    vt: {
      excellence: { status: 'Mức Xuất Sắc', badge: '🏆', description: 'Thực hành an ninh sinh học xuất sắc' },
      eligible: { status: 'Đủ Điều Kiện', badge: '✅', description: 'Đáp ứng yêu cầu chứng nhận' },
      pass: { status: 'Đạt', badge: '✓', description: 'Mức an ninh sinh học chấp nhận được' },
      fail: { status: 'Không Đủ Điều Kiện', badge: '⚠️', description: 'Cần cải thiện để được chứng nhận' }
    }
  };

  const langStatuses = statuses[language] || statuses.en;

  if (score >= 90) return { ...langStatuses.excellence, threshold: 90 };
  if (score >= 80) return { ...langStatuses.eligible, threshold: 80 };
  if (score >= 60) return { ...langStatuses.pass, threshold: 60 };
  return { ...langStatuses.fail, threshold: 60 };
}

/**
 * Get all critical action items across all focus areas
 * @param {object} assessment - Assessment object
 * @param {string} language - Language code
 * @returns {array} Array of all critical items
 */
export function getAllCriticalActionItems(assessment, language = 'en') {
  const allItems = [];

  for (let i = 1; i <= 4; i++) {
    const answers = assessment.focus_areas[i]?.answers || {};
    const items = getCriticalActionItems(i, answers, language);
    allItems.push(...items);
  }

  // Sort by score (lowest first)
  return allItems.sort((a, b) => a.score - b.score);
}

/**
 * Calculate disease risk score for a specific disease
 * @param {object} assessment - Assessment object with all answers
 * @param {string} diseaseName - Name of the disease (e.g., 'PRRS', 'African_Swine_Fever')
 * @param {string} language - Language code
 * @returns {number} Disease risk score (0-100, higher = more risk)
 */
export function calculateDiseaseRiskScore(assessment, diseaseName, language = 'en') {
  let totalRisk = 0;
  let questionCount = 0;

  // Iterate through all focus areas
  for (let i = 1; i <= 4; i++) {
    const questions = getFocusAreaQuestions(i, language);
    const answers = assessment.focus_areas[i]?.answers || {};

    questions.forEach(question => {
      const answer = answers[question.id];
      if (answer !== undefined && answer !== null && question.risk_assessment) {
        const diseasesAffected = question.risk_assessment.diseases_affected || [];

        // Check if this question affects the specified disease
        if (diseasesAffected.includes(diseaseName) || diseasesAffected.includes('All_Major_Diseases') || diseasesAffected.includes('Multiple')) {
          const score = calculateQuestionScore(question, answer);
          // Invert score: low score = high risk
          const riskScore = 100 - score;
          totalRisk += riskScore;
          questionCount++;
        }
      }
    });
  }

  return questionCount > 0 ? Math.round(totalRisk / questionCount) : 0;
}

/**
 * Get all disease risks across the assessment
 * @param {object} assessment - Assessment object
 * @param {string} language - Language code
 * @returns {object} Object with disease names as keys and risk scores as values
 */
export function getAllDiseaseRisks(assessment, language = 'en') {
  const diseases = [
    'PRRS',
    'African_Swine_Fever',
    'Porcine_Epidemic_Diarrhea',
    'Porcine_Circovirus',
    'Swine_Influenza',
    'Mycoplasma',
    'Salmonellosis'
  ];

  const diseaseRisks = {};

  diseases.forEach(disease => {
    diseaseRisks[disease] = calculateDiseaseRiskScore(assessment, disease, language);
  });

  // Sort by risk score (highest first)
  return Object.fromEntries(
    Object.entries(diseaseRisks).sort(([, a], [, b]) => b - a)
  );
}

/**
 * Get critical items filtered by priority level
 * @param {object} assessment - Assessment object
 * @param {string} priority - Priority level ('critical', 'high', 'medium', 'low')
 * @param {string} language - Language code
 * @returns {array} Array of items matching the priority level
 */
export function getCriticalItemsByPriority(assessment, priority, language = 'en') {
  const allItems = [];

  for (let i = 1; i <= 4; i++) {
    const questions = getFocusAreaQuestions(i, language);
    const answers = assessment.focus_areas[i]?.answers || {};

    questions.forEach(question => {
      const answer = answers[question.id];
      if (answer !== undefined && answer !== null && question.risk_assessment) {
        const score = calculateQuestionScore(question, answer);
        const triggerThreshold = question.risk_assessment.trigger_score_threshold || 50;
        const itemPriority = question.risk_assessment.priority || 'medium';

        // Check if score is below threshold and priority matches
        if (score < triggerThreshold && itemPriority === priority) {
          allItems.push({
            question: question.text,
            questionNumber: question.number,
            questionId: question.id,
            answer,
            score,
            focusArea: i,
            priority: itemPriority,
            riskDescription: question.risk_assessment.risk_description,
            recommendation: question.risk_assessment.recommendation,
            diseasesAffected: question.risk_assessment.diseases_affected || []
          });
        }
      }
    });
  }

  return allItems.sort((a, b) => a.score - b.score);
}

/**
 * Get high priority recommendations (critical + high)
 * @param {object} assessment - Assessment object
 * @param {string} language - Language code
 * @returns {array} Array of high priority items
 */
export function getHighPriorityRecommendations(assessment, language = 'en') {
  const critical = getCriticalItemsByPriority(assessment, 'critical', language);
  const high = getCriticalItemsByPriority(assessment, 'high', language);

  return [...critical, ...high].sort((a, b) => {
    // Sort by priority first (critical before high), then by score
    if (a.priority === 'critical' && b.priority !== 'critical') return -1;
    if (a.priority !== 'critical' && b.priority === 'critical') return 1;
    return a.score - b.score;
  });
}

/**
 * Get disease risk level interpretation
 * @param {number} riskScore - Risk score (0-100)
 * @param {string} language - Language code
 * @returns {object} Risk level interpretation
 */
export function getDiseaseRiskLevel(riskScore, language = 'en') {
  const levels = {
    en: {
      critical: { label: 'Critical Risk', color: '#DC2626', icon: '🔴' },
      high: { label: 'High Risk', color: '#EA580C', icon: '🟠' },
      moderate: { label: 'Moderate Risk', color: '#F59E0B', icon: '🟡' },
      low: { label: 'Low Risk', color: '#10B981', icon: '🟢' }
    },
    id: {
      critical: { label: 'Risiko Kritis', color: '#DC2626', icon: '🔴' },
      high: { label: 'Risiko Tinggi', color: '#EA580C', icon: '🟠' },
      moderate: { label: 'Risiko Sedang', color: '#F59E0B', icon: '🟡' },
      low: { label: 'Risiko Rendah', color: '#10B981', icon: '🟢' }
    },
    vt: {
      critical: { label: 'Rủi Ro Nghiêm Trọng', color: '#DC2626', icon: '🔴' },
      high: { label: 'Rủi Ro Cao', color: '#EA580C', icon: '🟠' },
      moderate: { label: 'Rủi Ro Trung Bình', color: '#F59E0B', icon: '🟡' },
      low: { label: 'Rủi Ro Thấp', color: '#10B981', icon: '🟢' }
    }
  };

  const langLevels = levels[language] || levels.en;

  if (riskScore >= 75) return { ...langLevels.critical, score: riskScore };
  if (riskScore >= 50) return { ...langLevels.high, score: riskScore };
  if (riskScore >= 25) return { ...langLevels.moderate, score: riskScore };
  return { ...langLevels.low, score: riskScore };
}

export default {
  calculateQuestionScore,
  calculateFocusAreaScore,
  calculateExternalScore,
  calculateInternalScore,
  calculateOverallScore,
  getScoreInterpretation,
  getCriticalActionItems,
  getAllCriticalActionItems,
  detectFarmType,
  calculateCategoryBreakdown,
  getCertificationStatus,
  // New enhanced functions
  calculateDiseaseRiskScore,
  getAllDiseaseRisks,
  getCriticalItemsByPriority,
  getHighPriorityRecommendations,
  getDiseaseRiskLevel
};

