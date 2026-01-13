const CATEGORY_WEIGHTS = {
  farm_characteristics: 0.05,
  purchase_animals: 0.12,
  transport_deadstock: 0.10,
  feed_water_equipment: 0.08,
  visitors_workers: 0.12,
  vermin_bird_control: 0.08,
  location: 0.07,
  disease_management: 0.10,
  farrowing_suckling: 0.07,
  nursery_unit: 0.07,
  finishing_unit: 0.07,
  measures_between_compartments: 0.07,
  cleaning_disinfection: 0.07
};

export function calculateScore(answers, questions) {
  let totalScore = 0;
  const categoryScores = {};
  const categoryDetails = {};

  for (const [categoryId, weight] of Object.entries(CATEGORY_WEIGHTS)) {
    const categoryQuestions = questions.filter(q => q.category === categoryId);
    const categoryAnswers = answers.filter(a => a.category === categoryId);
    
    let categoryTotal = 0;
    let maxPoints = 0;
    let answeredCount = 0;

    for (const question of categoryQuestions) {
      const answer = categoryAnswers.find(a => a.question_id === question.id);
      
      if (answer && question.scoring !== 'demographic') {
        const score = calculateQuestionScore(question, answer.answer_value);
        categoryTotal += score;
        maxPoints += 100;
        answeredCount++;
      }
    }

    const categoryPercent = maxPoints > 0 ? (categoryTotal / maxPoints) * 100 : 0;
    categoryScores[categoryId] = Math.round(categoryPercent * 100) / 100;
    categoryDetails[categoryId] = {
      score: categoryPercent,
      weight: weight,
      answered: answeredCount,
      total: categoryQuestions.filter(q => q.scoring !== 'demographic').length
    };
    
    totalScore += categoryPercent * weight;
  }

  const finalScore = Math.round(totalScore * 100) / 100;

  return {
    overall_score: finalScore,
    category_scores: categoryScores,
    category_details: categoryDetails,
    grade: getGrade(finalScore),
    risk_level: getRiskLevel(finalScore)
  };
}

function calculateQuestionScore(question, answerValue) {
  if (question.type === 'single_select') {
    const option = question.options.find(opt => opt.value === answerValue);
    return option ? option.score : 0;
  }
  
  if (question.type === 'multi_select') {
    const selectedValues = Array.isArray(answerValue) ? answerValue : [answerValue];
    const scores = selectedValues.map(val => {
      const option = question.options.find(opt => opt.value === val);
      return option ? option.score : 0;
    });
    return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  }
  
  if (question.type === 'matrix') {
    if (typeof answerValue === 'object' && !Array.isArray(answerValue)) {
      const scores = Object.values(answerValue).map(val => {
        const column = question.columns.find(col => col.value === val);
        return column ? column.score : 0;
      });
      return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    }
    return 0;
  }
  
  if (question.type === 'number') {
    if (question.scoring && typeof question.scoring === 'object') {
      const value = parseFloat(answerValue);
      
      for (const [range, score] of Object.entries(question.scoring)) {
        if (range.includes('>=')) {
          const threshold = parseFloat(range.replace('>=', ''));
          if (value >= threshold) return score;
        } else if (range.includes('<=')) {
          const threshold = parseFloat(range.replace('<=', ''));
          if (value <= threshold) return score;
        } else if (range.includes('-')) {
          const [min, max] = range.split('-').map(v => parseFloat(v));
          if (value >= min && value <= max) return score;
        } else if (range.includes('<')) {
          const threshold = parseFloat(range.replace('<', ''));
          if (value < threshold) return score;
        }
      }
    }
    return 0;
  }
  
  return 0;
}

export function getRiskLevel(score) {
  if (score >= 85) {
    return {
      level: 'low',
      color: 'green',
      icon: '✅',
      message: 'Excellent biosecurity practices! Your farm has strong protection against disease risks.'
    };
  }
  if (score >= 70) {
    return {
      level: 'medium',
      color: 'yellow',
      icon: '⚠️',
      message: 'Good biosecurity, but there is room for improvement in some areas.'
    };
  }
  if (score >= 50) {
    return {
      level: 'high',
      color: 'orange',
      icon: '🟠',
      message: 'Significant biosecurity gaps detected. Immediate action recommended.'
    };
  }
  return {
    level: 'critical',
    color: 'red',
    icon: '🔴',
    message: 'Critical biosecurity deficiencies. Your farm is at high risk for disease outbreaks.'
  };
}

export function getGrade(score) {
  if (score >= 95) return 'A+';
  if (score >= 90) return 'A';
  if (score >= 85) return 'A-';
  if (score >= 80) return 'B+';
  if (score >= 75) return 'B';
  if (score >= 70) return 'B-';
  if (score >= 65) return 'C+';
  if (score >= 60) return 'C';
  if (score >= 55) return 'C-';
  if (score >= 50) return 'D+';
  if (score >= 45) return 'D';
  return 'F';
}

export function generateRecommendations(answers, categoryScores) {
  const recommendations = [];

  for (const [categoryId, score] of Object.entries(categoryScores)) {
    if (score < 70) {
      const categoryAnswers = answers.filter(a => a.category === categoryId);
      const lowScoreAnswers = categoryAnswers.filter(a => a.answer_score < 50);

      for (const answer of lowScoreAnswers) {
        const recommendation = getRecommendationForAnswer(answer);
        if (recommendation) {
          recommendations.push({
            category: categoryId,
            priority: score < 50 ? 'high' : 'medium',
            ...recommendation
          });
        }
      }
    }
  }

  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

function getRecommendationForAnswer(answer) {
  const recommendations = {
    Q8_no: {
      issue_title: 'No Quarantine for New Animals',
      issue_description: 'New breeding pigs are not quarantined before mixing with the herd.',
      recommendation_text: 'Establish a dedicated quarantine area separated from the main herd. Keep new animals isolated for at least 28 days.',
      expected_impact: 'Prevents introduction of diseases from purchased animals',
      estimated_cost: 'Medium',
      implementation_timeline: '1-2 months'
    },
    Q22_no: {
      issue_title: 'No Hygiene Lock',
      issue_description: 'There is no changing area at the entrance to pig units.',
      recommendation_text: 'Install a hygiene lock with separate clean and dirty zones. Require all workers and visitors to change clothes and boots.',
      expected_impact: 'Significantly reduces disease transmission from people',
      estimated_cost: 'Medium-High',
      implementation_timeline: '2-3 months'
    },
    Q26_no: {
      issue_title: 'No Pest Control Program',
      issue_description: 'No professional pest control program is in place.',
      recommendation_text: 'Implement a regular pest control program with monthly monitoring and bait stations around all buildings.',
      expected_impact: 'Reduces disease transmission from rodents and insects',
      estimated_cost: 'Low-Medium',
      implementation_timeline: 'Immediate'
    },
    Q30_no: {
      issue_title: 'No Wild Boar Fencing',
      issue_description: 'Farm lacks fencing to prevent wild boar entry.',
      recommendation_text: 'Install secure perimeter fencing at least 1.5m high to prevent wild boar and other wild animals from entering.',
      expected_impact: 'Critical for African Swine Fever prevention',
      estimated_cost: 'High',
      implementation_timeline: '3-6 months'
    },
    Q46_yes_uncooked: {
      issue_title: 'CRITICAL: Feeding Uncooked Food Waste',
      issue_description: 'Pigs are being fed uncooked food waste or swill.',
      recommendation_text: 'IMMEDIATELY STOP feeding any food waste to pigs. Use only certified commercial feed.',
      expected_impact: 'Eliminates the highest risk factor for African Swine Fever',
      estimated_cost: 'Low (may increase feed costs)',
      implementation_timeline: 'Immediate'
    }
  };

  const key = `${answer.question_id}_${answer.answer_value}`;
  return recommendations[key] || null;
}
