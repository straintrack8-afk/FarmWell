const DISEASE_RISKS = {
  'African Swine Fever': {
    severity: 'CRITICAL',
    description: 'Highly contagious viral disease with up to 100% mortality. No treatment or vaccine available.',
    triggers: [
      { condition: 'Q46_yes_uncooked', weight: 'CRITICAL', factor: 'Feeding uncooked food waste/swill' },
      { condition: 'Q30_no', weight: 'CRITICAL', factor: 'No wild boar fencing' },
      { condition: 'Q30_yes_basic', weight: 'HIGH', factor: 'Inadequate wild boar fencing' },
      { condition: 'Q8_no', weight: 'HIGH', factor: 'No quarantine for new animals' },
      { condition: 'Q24_yes', weight: 'HIGH', factor: 'Workers also work on other pig farms' },
      { condition: 'Q13_never', weight: 'MEDIUM', factor: 'Transport vehicles not disinfected' }
    ],
    threshold: 1,
    prevention: [
      'IMMEDIATELY stop all food waste feeding',
      'Install secure wild-boar-proof fencing (minimum 1.5m height)',
      'Implement strict quarantine protocol (28+ days minimum)',
      'Dedicated workers only - no contact with other pig farms',
      'Mandatory vehicle disinfection at farm entrance',
      'Report any unusual deaths immediately to authorities'
    ]
  },
  
  'PRRS (Porcine Reproductive & Respiratory Syndrome)': {
    severity: 'HIGH',
    description: 'Causes reproductive failure in sows and respiratory disease in piglets. Major economic impact.',
    triggers: [
      { condition: 'Q8_no', weight: 'CRITICAL', factor: 'No quarantine for new breeding stock' },
      { condition: 'Q9_less_than_28', weight: 'HIGH', factor: 'Quarantine period too short' },
      { condition: 'Q7_no', weight: 'HIGH', factor: 'Unknown health status of purchased animals' },
      { condition: 'Q22_no', weight: 'HIGH', factor: 'No hygiene lock for workers/visitors' },
      { condition: 'Q24_yes', weight: 'HIGH', factor: 'Workers contact with other pig farms' },
      { condition: 'Q31_under_500m', weight: 'MEDIUM', factor: 'Very close proximity to other pig farms' }
    ],
    threshold: 2,
    prevention: [
      'Minimum 28-day quarantine for all new breeding stock',
      'Source animals only from high health status herds',
      'Install and enforce hygiene lock protocols',
      'Dedicated workers with no outside pig contact',
      'Maintain distance from other pig operations',
      'Regular vaccination program'
    ]
  },
  
  'Salmonella': {
    severity: 'MEDIUM',
    description: 'Bacterial infection causing diarrhea and reduced growth. Zoonotic risk to humans.',
    triggers: [
      { condition: 'Q18_never', weight: 'HIGH', factor: 'Water never tested' },
      { condition: 'Q16_no', weight: 'HIGH', factor: 'Feed storage not protected from pests' },
      { condition: 'Q26_no', weight: 'HIGH', factor: 'No pest control program' },
      { condition: 'Q27_never', weight: 'HIGH', factor: 'No rodent control' },
      { condition: 'Q41_never', weight: 'MEDIUM', factor: 'Units not cleaned between batches' },
      { condition: 'Q19_yes_not_cleaned', weight: 'MEDIUM', factor: 'Equipment shared without cleaning' }
    ],
    threshold: 2,
    prevention: [
      'Test water quality at least twice per year',
      'Protect feed storage from rodents and birds',
      'Implement professional pest control program',
      'Monthly rodent control with bait stations',
      'Thorough cleaning and disinfection between batches',
      'Dedicated equipment per unit or clean between uses'
    ]
  },
  
  'E. coli & Clostridial Diseases': {
    severity: 'MEDIUM',
    description: 'Bacterial infections causing diarrhea, especially in young piglets.',
    triggers: [
      { condition: 'Q40_never', weight: 'HIGH', factor: 'No all-in/all-out management' },
      { condition: 'Q41_never', weight: 'HIGH', factor: 'No cleaning between batches' },
      { condition: 'Q42_0_1', weight: 'MEDIUM', factor: 'Insufficient downtime between batches' },
      { condition: 'Q44_never', weight: 'MEDIUM', factor: 'Manure pits not cleaned' },
      { condition: 'Q19_yes_not_cleaned', weight: 'MEDIUM', factor: 'Equipment contamination' }
    ],
    threshold: 2,
    prevention: [
      'Implement all-in/all-out management',
      'Clean and disinfect units between batches',
      'Minimum 4-7 days downtime between batches',
      'Regular manure pit cleaning',
      'Dedicated or properly cleaned equipment',
      'Vaccination program for piglets'
    ]
  },
  
  'Swine Influenza': {
    severity: 'MEDIUM',
    description: 'Respiratory disease causing fever, coughing, and reduced performance.',
    triggers: [
      { condition: 'Q21_no', weight: 'HIGH', factor: 'No waiting period for visitors from other farms' },
      { condition: 'Q22_no', weight: 'HIGH', factor: 'No hygiene lock' },
      { condition: 'Q23_never', weight: 'HIGH', factor: 'No clothing/boot changes' },
      { condition: 'Q28_no', weight: 'MEDIUM', factor: 'No bird protection' },
      { condition: 'Q34_not_separated', weight: 'MEDIUM', factor: 'Age groups not separated' }
    ],
    threshold: 2,
    prevention: [
      '48-hour waiting period after visiting other pig farms',
      'Install hygiene lock with shower facilities',
      'Mandatory clothing and boot changes',
      'Protect buildings from wild bird entry',
      'Separate different age groups physically',
      'Annual vaccination program'
    ]
  },
  
  'Parasitic Infections': {
    severity: 'LOW',
    description: 'Internal and external parasites reducing growth and performance.',
    triggers: [
      { condition: 'Q26_no', weight: 'HIGH', factor: 'No pest control program' },
      { condition: 'Q41_never', weight: 'HIGH', factor: 'No cleaning between batches' },
      { condition: 'Q44_never', weight: 'MEDIUM', factor: 'Manure pits not cleaned' },
      { condition: 'Q35_no', weight: 'MEDIUM', factor: 'No herd health plan' }
    ],
    threshold: 2,
    prevention: [
      'Regular deworming program',
      'Professional pest control',
      'Thorough cleaning between batches',
      'Regular manure removal',
      'Develop herd health plan with veterinarian'
    ]
  }
};

export function assessDiseaseRisks(answers) {
  const risks = {
    critical: [],
    high: [],
    medium: [],
    low: []
  };

  for (const [disease, config] of Object.entries(DISEASE_RISKS)) {
    const triggeredFactors = [];
    let criticalCount = 0;
    let highCount = 0;
    let mediumCount = 0;

    for (const trigger of config.triggers) {
      if (evaluateCondition(trigger.condition, answers)) {
        triggeredFactors.push({
          weight: trigger.weight,
          factor: trigger.factor
        });
        
        if (trigger.weight === 'CRITICAL') criticalCount++;
        if (trigger.weight === 'HIGH') highCount++;
        if (trigger.weight === 'MEDIUM') mediumCount++;
      }
    }

    if (triggeredFactors.length >= config.threshold) {
      const riskScore = calculateRiskScore(criticalCount, highCount, mediumCount);
      
      const risk = {
        disease,
        severity: config.severity,
        description: config.description,
        factors: triggeredFactors,
        prevention: config.prevention,
        risk_score: riskScore
      };

      if (criticalCount >= 1) {
        risks.critical.push(risk);
      } else if (highCount >= 2 || (highCount >= 1 && mediumCount >= 2)) {
        risks.high.push(risk);
      } else if (highCount >= 1 || mediumCount >= 3) {
        risks.medium.push(risk);
      } else {
        risks.low.push(risk);
      }
    }
  }

  return risks;
}

function evaluateCondition(condition, answers) {
  if (condition.includes('_AND_')) {
    const parts = condition.split('_AND_');
    return parts.every(part => evaluateSingleCondition(part, answers));
  }
  
  return evaluateSingleCondition(condition, answers);
}

function evaluateSingleCondition(condition, answers) {
  const parts = condition.split('_');
  const questionId = parts[0];
  const expectedValue = parts.slice(1).join('_');
  
  const answer = answers.find(a => a.question_id === questionId);
  
  if (!answer) return false;
  
  if (expectedValue.includes('less_than')) {
    const threshold = parseInt(expectedValue.replace('less_than_', ''));
    return parseInt(answer.answer_value) < threshold;
  }
  
  if (Array.isArray(answer.answer_value)) {
    return answer.answer_value.includes(expectedValue);
  }
  
  return answer.answer_value === expectedValue;
}

function calculateRiskScore(criticalCount, highCount, mediumCount) {
  return (criticalCount * 100) + (highCount * 50) + (mediumCount * 25);
}

export function getDiseaseRiskSummary(risks) {
  const totalDiseases = Object.values(risks).flat().length;
  const criticalCount = risks.critical.length;
  const highCount = risks.high.length;
  
  let summary = {
    total: totalDiseases,
    critical: criticalCount,
    high: highCount,
    medium: risks.medium.length,
    low: risks.low.length
  };
  
  if (criticalCount > 0) {
    summary.level = 'critical';
    summary.message = `${criticalCount} critical disease risk(s) detected. Immediate action required!`;
    summary.color = 'red';
  } else if (highCount > 0) {
    summary.level = 'high';
    summary.message = `${highCount} high-priority disease risk(s) identified. Action recommended.`;
    summary.color = 'orange';
  } else if (risks.medium.length > 0) {
    summary.level = 'medium';
    summary.message = 'Some disease risks present. Consider improvements.';
    summary.color = 'yellow';
  } else {
    summary.level = 'low';
    summary.message = 'Low disease risk. Maintain current practices.';
    summary.color = 'green';
  }
  
  return summary;
}
