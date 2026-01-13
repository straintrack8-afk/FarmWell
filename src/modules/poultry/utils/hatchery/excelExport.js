import * as XLSX from 'xlsx';
import { formatDate } from './dateUtils';

/**
 * Generate Excel workbook for a hatchery audit
 * @param {Object} audit - Complete audit data
 * @returns {XLSX.WorkBook} Excel workbook
 */
export function generateAuditExcel(audit) {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Summary
    const summarySheet = createSummarySheet(audit);
    XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');

    // Sheet 2: Vaccine Storage
    if (audit.vaccineStorage) {
        const vaccineSheet = createVaccineStorageSheet(audit.vaccineStorage);
        XLSX.utils.book_append_sheet(wb, vaccineSheet, 'Vaccine Storage');
    }

    // Sheet 3: Equipment
    if (audit.equipment && audit.equipment.length > 0) {
        const equipmentSheet = createEquipmentSheet(audit.equipment);
        XLSX.utils.book_append_sheet(wb, equipmentSheet, 'Equipment');
    }

    // Sheet 4: Techniques
    if (audit.techniques) {
        const techniquesSheet = createTechniquesSheet(audit.techniques);
        XLSX.utils.book_append_sheet(wb, techniquesSheet, 'Techniques');
    }

    // Sheet 5: Environmental Samples
    if (audit.samples) {
        const samplesSheet = createSamplesSheet(audit.samples);
        XLSX.utils.book_append_sheet(wb, samplesSheet, 'Environmental Samples');
    }

    return wb;
}

/**
 * Download Excel report
 * @param {Object} audit - Complete audit data
 */
export function downloadAuditExcel(audit) {
    const wb = generateAuditExcel(audit);
    const filename = `Hatchery_Audit_${audit.auditNumber || 'Report'}.xlsx`;
    XLSX.writeFile(wb, filename);
}

// Helper Functions

function createSummarySheet(audit) {
    const data = [
        ['Hatchery Audit Report'],
        [],
        ['Audit Number', audit.auditNumber || 'N/A'],
        ['Date', formatDate(audit.info?.auditDate, 'long')],
        ['Location', audit.info?.location || 'N/A'],
        ['Auditor', audit.info?.auditor || 'N/A'],
        ['Audit Type', audit.info?.auditType || 'N/A'],
        [],
        ['Overall Assessment'],
        ['Environmental Score', audit.finalScore?.score || 'N/A'],
        ['Classification', audit.finalScore?.classification || 'N/A'],
        [],
        ['Status', audit.status || 'N/A'],
        ['Created', formatDate(audit.createdAt, 'long')],
        ['Last Updated', formatDate(audit.updatedAt, 'long')]
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);

    // Set column widths
    ws['!cols'] = [
        { wch: 20 },
        { wch: 30 }
    ];

    return ws;
}

function createVaccineStorageSheet(data) {
    const sheetData = [
        ['Vaccine Storage Assessment'],
        [],
        ['Current Temperature (°C)', data.currentTemperature || 'N/A'],
        [],
        ['Compliance Checklist', 'Status'],
        ['Temperature maintained (+2°C to +8°C)', data.temperatureOk ? 'Yes' : 'No'],
        ['Temperature log available', data.tempLogAvailable ? 'Yes' : 'No'],
        ['Refrigerator for vaccines only', data.vaccineOnly ? 'Yes' : 'No'],
        ['FIFO principle followed', data.fifoFollowed ? 'Yes' : 'No'],
        ['Proper positioning', data.properPositioning ? 'Yes' : 'No'],
        ['Clear labeling', data.clearLabeling ? 'Yes' : 'No'],
        [],
        ['Notes'],
        [data.notes || 'No notes']
    ];

    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    ws['!cols'] = [{ wch: 40 }, { wch: 15 }];

    return ws;
}

function createEquipmentSheet(equipment) {
    const headers = [
        'Equipment Type',
        'Name/Model',
        'Quantity',
        'Last Service Date',
        'Available Doses',
        'Good Condition',
        'Maintenance Current',
        'Doses Sufficient',
        'Cleaning Protocol',
        'Spare Parts',
        'Notes'
    ];

    const rows = equipment.map(eq => [
        eq.type || '',
        eq.name || '',
        eq.quantity || 1,
        eq.lastServiceDate || '',
        eq.dosesAvailable || 0,
        eq.conditionGood ? 'Yes' : 'No',
        eq.maintenanceCurrent ? 'Yes' : 'No',
        eq.dosesSufficient ? 'Yes' : 'No',
        eq.cleaningFollowed ? 'Yes' : 'No',
        eq.sparePartsAdequate ? 'Yes' : 'No',
        eq.notes || ''
    ]);

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

    ws['!cols'] = [
        { wch: 20 },
        { wch: 25 },
        { wch: 10 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 18 },
        { wch: 15 },
        { wch: 18 },
        { wch: 15 },
        { wch: 30 }
    ];

    return ws;
}

function createTechniquesSheet(data) {
    const sheetData = [
        ['Vaccination Techniques Assessment'],
        [],
        ['A. Vaccine Preparation'],
        ['Aseptic technique followed', data.asepticTechnique ? 'Yes' : 'No'],
        ['Hand hygiene performed', data.handHygiene ? 'Yes' : 'No'],
        ['New syringe used', data.newSyringe ? 'Yes' : 'No'],
        ['Correct needle (21G)', data.correctNeedle ? 'Yes' : 'No'],
        ['Expiry dates checked', data.expiryChecked ? 'Yes' : 'No'],
        ['Mixed correctly', data.mixedCorrectly ? 'Yes' : 'No'],
        ['Records maintained', data.recordsMaintained ? 'Yes' : 'No'],
        [],
        ['B. Spray Vaccination Quality'],
        ['Sample Size (trays)', data.spraySampleSize || 'N/A'],
        ['Droplet Uniformity', data.dropletUniformity || 'N/A'],
        ['Tray Coverage (%)', data.trayCoverage || 'N/A'],
        [],
        ['C. Injection Quality'],
        ['Sample Size (chicks)', data.injectionSampleSize || 'N/A'],
        ['Accurate Injection (%)', data.accurateInjectionPercent || 'N/A'],
        ['Bleeding (%)', data.bleedingPercent || 'N/A'],
        ['Wet Neck (%)', data.wetNeckPercent || 'N/A'],
        ['No Vaccine (%)', data.noVaccinePercent || 'N/A'],
        [],
        ['Notes'],
        [data.notes || 'No notes']
    ];

    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    ws['!cols'] = [{ wch: 35 }, { wch: 20 }];

    return ws;
}

function createSamplesSheet(samples) {
    const headers = [
        'Sample ID',
        'Location',
        'Sample Type',
        'Collected',
        'Collection Time',
        'Aspergillus Count',
        'Other Mold Count',
        'Score (1-5)',
        'Notes'
    ];

    const rows = [];

    Object.entries(samples).forEach(([locationKey, sampleGroup]) => {
        if (sampleGroup && sampleGroup.length > 0) {
            sampleGroup.forEach(sample => {
                rows.push([
                    sample.id || '',
                    sample.name || '',
                    sample.type === 'air_plate' ? 'Air Plate' : 'Swab',
                    sample.collected ? 'Yes' : 'No',
                    sample.collectionTime ? formatDate(sample.collectionTime, 'long') : '',
                    sample.aspergillusCount || '',
                    sample.colonyCount || '',
                    sample.score || '',
                    sample.notes || ''
                ]);
            });
        }
    });

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

    ws['!cols'] = [
        { wch: 15 },
        { wch: 25 },
        { wch: 15 },
        { wch: 10 },
        { wch: 20 },
        { wch: 18 },
        { wch: 18 },
        { wch: 12 },
        { wch: 30 }
    ];

    return ws;
}

/**
 * Export all audits to a single Excel file
 * @param {Array} audits - Array of audit objects
 */
export function exportAllAuditsToExcel(audits) {
    const wb = XLSX.utils.book_new();

    // Summary sheet with all audits
    const summaryData = [
        ['All Hatchery Audits'],
        [],
        ['Audit Number', 'Date', 'Location', 'Auditor', 'Status', 'Score', 'Classification']
    ];

    audits.forEach(audit => {
        summaryData.push([
            audit.auditNumber || '',
            formatDate(audit.info?.auditDate, 'short'),
            audit.info?.location || '',
            audit.info?.auditor || '',
            audit.status || '',
            audit.finalScore?.score || '',
            audit.finalScore?.classification || ''
        ]);
    });

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    summarySheet['!cols'] = [
        { wch: 20 },
        { wch: 15 },
        { wch: 20 },
        { wch: 20 },
        { wch: 15 },
        { wch: 10 },
        { wch: 15 }
    ];

    XLSX.utils.book_append_sheet(wb, summarySheet, 'All Audits');

    const filename = `Hatchery_Audits_Export_${formatDate(new Date(), 'short')}.xlsx`;
    XLSX.writeFile(wb, filename);
}
