/**
 * Scoring Engine for Hatchery Audit
 * Implements the scoring formulas and classification logic
 */

import { SCORING } from '../hatcheryConstants.js';

/**
 * Calculate plate score based on colony counts
 * @param {number} aspergillusCount - Number of Aspergillus colonies
 * @param {number} otherMoldCount - Number of other mold colonies
 * @returns {number} Score from 1-5
 */
export function calculatePlateScore(aspergillusCount, otherMoldCount) {
    // Score 5: >10 Aspergillus colonies
    if (aspergillusCount > 10) {
        return SCORING.PLATE_SCORE.CRITICAL;
    }

    // Score 4: 4-10 Aspergillus colonies
    if (aspergillusCount >= 4 && aspergillusCount <= 10) {
        return SCORING.PLATE_SCORE.WARNING;
    }

    // Score 3 or 4: 1-3 Aspergillus
    if (aspergillusCount >= 1 && aspergillusCount <= 3) {
        return otherMoldCount > 40 ? SCORING.PLATE_SCORE.WARNING : SCORING.PLATE_SCORE.FAIR;
    }

    // Score 1 or 2: No Aspergillus
    if (aspergillusCount === 0) {
        return otherMoldCount > 40 ? SCORING.PLATE_SCORE.GOOD : SCORING.PLATE_SCORE.EXCELLENT;
    }

    return SCORING.PLATE_SCORE.EXCELLENT;
}

/**
 * Calculate environmental assessment score
 * Formula: 2 × (H + HV + HHV + G) + S + M
 * @param {Object} samples - Object containing sample arrays by location code
 * @returns {number} Total environmental score
 */
export function calculateEnvironmentalScore(samples) {
    const sumScores = (locationCode) => {
        const locationSamples = samples[locationCode] || [];
        return locationSamples.reduce((sum, sample) => {
            return sum + (sample.calculatedScore || 0);
        }, 0);
    };

    const H = sumScores('H');    // Hatchers
    const HV = sumScores('HV');  // Hatcher Ventilation
    const HHV = sumScores('HHV'); // Hallways
    const G = sumScores('GV');   // General Ventilation (Fans)
    const S = sumScores('S');    // Setters
    const M = sumScores('M');    // Miscellaneous

    const total = 2 * (H + HV + HHV + G) + S + M;

    return total;
}

/**
 * Classify environmental score
 * @param {number} score - Environmental assessment score
 * @returns {Object} Classification with label and color
 */
export function classifyEnvironmentalScore(score) {
    if (score <= SCORING.CLASSIFICATION.GOOD.max) {
        return SCORING.CLASSIFICATION.GOOD;
    }
    if (score >= SCORING.CLASSIFICATION.FAIR.min && score <= SCORING.CLASSIFICATION.FAIR.max) {
        return SCORING.CLASSIFICATION.FAIR;
    }
    return SCORING.CLASSIFICATION.POOR;
}

/**
 * Calculate compliance percentage
 * @param {number} passedItems - Number of items that passed
 * @param {number} totalItems - Total number of items checked
 * @returns {number} Percentage (0-100)
 */
export function calculateCompliancePercentage(passedItems, totalItems) {
    if (totalItems === 0) return 0;
    return Math.round((passedItems / totalItems) * 100);
}

/**
 * Calculate vaccine storage compliance score
 * @param {Object} vaccineStorageData - Vaccine storage assessment data
 * @returns {Object} Score and percentage
 */
export function calculateVaccineStorageScore(vaccineStorageData) {
    const checks = [
        vaccineStorageData.temperatureOk,
        vaccineStorageData.tempLogAvailable,
        vaccineStorageData.vaccineOnly,
        vaccineStorageData.fifoFollowed,
        vaccineStorageData.properPositioning,
        vaccineStorageData.clearLabeling
    ];

    const passedCount = checks.filter(check => check === true).length;
    const percentage = calculateCompliancePercentage(passedCount, checks.length);

    return {
        passedCount,
        totalCount: checks.length,
        percentage,
        classification: getComplianceClassification(percentage)
    };
}

/**
 * Calculate equipment compliance score
 * @param {Array} equipmentList - Array of equipment items
 * @returns {Object} Score and percentage
 */
export function calculateEquipmentScore(equipmentList) {
    if (!equipmentList || equipmentList.length === 0) {
        return { passedCount: 0, totalCount: 0, percentage: 0, classification: 'POOR' };
    }

    let totalChecks = 0;
    let passedChecks = 0;

    equipmentList.forEach(equipment => {
        const checks = [
            equipment.conditionGood,
            equipment.maintenanceCurrent,
            equipment.dosesSufficient,
            equipment.cleaningFollowed,
            equipment.sparePartsAdequate
        ];

        totalChecks += checks.length;
        passedChecks += checks.filter(check => check === true).length;
    });

    const percentage = calculateCompliancePercentage(passedChecks, totalChecks);

    return {
        passedCount: passedChecks,
        totalCount: totalChecks,
        percentage,
        classification: getComplianceClassification(percentage)
    };
}

/**
 * Calculate vaccination techniques compliance score
 * @param {Object} techniquesData - Vaccination techniques data
 * @returns {Object} Score and percentage
 */
export function calculateTechniquesScore(techniquesData) {
    const preparationChecks = [
        techniquesData.asepticTechnique,
        techniquesData.handHygiene,
        techniquesData.newSyringe,
        techniquesData.correctNeedle,
        techniquesData.expiryChecked,
        techniquesData.mixedCorrectly,
        techniquesData.recordsMaintained
    ];

    const preparationPassed = preparationChecks.filter(check => check === true).length;

    // Quality assessment (spray and injection)
    const sprayQuality = techniquesData.dropletUniformity === 'excellent' || techniquesData.dropletUniformity === 'good' ? 1 : 0;
    const coverageGood = (techniquesData.trayCoverage || 0) >= 90 ? 1 : 0;
    const injectionAccurate = (techniquesData.accurateInjectionPercent || 0) >= 95 ? 1 : 0;
    const lowBleeding = (techniquesData.bleedingPercent || 0) <= 5 ? 1 : 0;
    const lowWetNeck = (techniquesData.wetNeckPercent || 0) <= 5 ? 1 : 0;

    const qualityPassed = sprayQuality + coverageGood + injectionAccurate + lowBleeding + lowWetNeck;
    const qualityTotal = 5;

    const totalPassed = preparationPassed + qualityPassed;
    const totalChecks = preparationChecks.length + qualityTotal;

    const percentage = calculateCompliancePercentage(totalPassed, totalChecks);

    return {
        passedCount: totalPassed,
        totalCount: totalChecks,
        percentage,
        classification: getComplianceClassification(percentage)
    };
}

/**
 * Get compliance classification based on percentage
 * @param {number} percentage - Compliance percentage
 * @returns {string} Classification (EXCELLENT, GOOD, FAIR, POOR)
 */
export function getComplianceClassification(percentage) {
    if (percentage >= SCORING.COMPLIANCE.EXCELLENT) return 'EXCELLENT';
    if (percentage >= SCORING.COMPLIANCE.GOOD) return 'GOOD';
    if (percentage >= SCORING.COMPLIANCE.FAIR) return 'FAIR';
    return 'POOR';
}

/**
 * Calculate overall audit summary
 * @param {Object} auditData - Complete audit data
 * @returns {Object} Summary with all scores
 */
export function calculateAuditSummary(auditData) {
    const vaccineStorage = calculateVaccineStorageScore(auditData.vaccineStorage || {});
    const equipment = calculateEquipmentScore(auditData.equipment || []);
    const techniques = calculateTechniquesScore(auditData.techniques || {});
    const environmentalScore = calculateEnvironmentalScore(auditData.samples || {});
    const environmentalClassification = classifyEnvironmentalScore(environmentalScore);

    return {
        vaccineStorage,
        equipment,
        techniques,
        environmental: {
            score: environmentalScore,
            classification: environmentalClassification.label,
            color: environmentalClassification.color
        },
        overallStatus: determineOverallStatus(vaccineStorage, equipment, techniques, environmentalClassification)
    };
}

/**
 * Determine overall audit status
 * @param {Object} vaccineStorage - Vaccine storage score
 * @param {Object} equipment - Equipment score
 * @param {Object} techniques - Techniques score
 * @param {Object} environmental - Environmental classification
 * @returns {string} Overall status (EXCELLENT, GOOD, FAIR, POOR)
 */
function determineOverallStatus(vaccineStorage, equipment, techniques, environmental) {
    // If environmental is POOR, overall is POOR
    if (environmental.label === 'POOR') return 'POOR';

    // If any category is POOR, overall is POOR
    if (vaccineStorage.classification === 'POOR' ||
        equipment.classification === 'POOR' ||
        techniques.classification === 'POOR') {
        return 'POOR';
    }

    // If environmental is FAIR or any category is FAIR, overall is FAIR
    if (environmental.label === 'FAIR' ||
        vaccineStorage.classification === 'FAIR' ||
        equipment.classification === 'FAIR' ||
        techniques.classification === 'FAIR') {
        return 'FAIR';
    }

    // If all categories are GOOD or EXCELLENT, overall is GOOD
    const avgPercentage = (vaccineStorage.percentage + equipment.percentage + techniques.percentage) / 3;
    if (avgPercentage >= SCORING.COMPLIANCE.EXCELLENT) return 'EXCELLENT';

    return 'GOOD';
}

/**
 * Identify critical issues from audit data
 * @param {Object} auditData - Complete audit data
 * @returns {Array} Array of critical issues
 */
export function identifyCriticalIssues(auditData) {
    const issues = [];

    // Check vaccine storage
    if (auditData.vaccineStorage) {
        if (!auditData.vaccineStorage.temperatureOk) {
            issues.push({
                category: 'Vaccine Storage',
                priority: 'critical',
                issue: 'Refrigerator temperature out of range (+2°C to +8°C)',
                recommendation: 'Immediately adjust refrigerator temperature and monitor closely'
            });
        }
        if (!auditData.vaccineStorage.tempLogAvailable) {
            issues.push({
                category: 'Vaccine Storage',
                priority: 'high',
                issue: 'Temperature monitoring log missing or not up-to-date',
                recommendation: 'Implement daily temperature logging system'
            });
        }
    }

    // Check samples for high Aspergillus counts
    if (auditData.samples) {
        Object.keys(auditData.samples).forEach(locationCode => {
            const samples = auditData.samples[locationCode] || [];
            samples.forEach(sample => {
                if (sample.aspergillusCount > 10) {
                    issues.push({
                        category: 'Environmental',
                        priority: 'critical',
                        issue: `High Aspergillus contamination (${sample.aspergillusCount} colonies) in ${sample.locationDescription}`,
                        recommendation: 'Immediate deep cleaning and sanitation required'
                    });
                }
            });
        });
    }

    // Check injection quality
    if (auditData.techniques) {
        if ((auditData.techniques.bleedingPercent || 0) > 5) {
            issues.push({
                category: 'Vaccination Techniques',
                priority: 'high',
                issue: `High bleeding rate during injection (${auditData.techniques.bleedingPercent}%)`,
                recommendation: 'Retrain staff on proper injection technique'
            });
        }
        if ((auditData.techniques.wetNeckPercent || 0) > 5) {
            issues.push({
                category: 'Vaccination Techniques',
                priority: 'high',
                issue: `High wet neck rate (${auditData.techniques.wetNeckPercent}%)`,
                recommendation: 'Check injection equipment and technique'
            });
        }
    }

    return issues;
}
