import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatDate } from './dateUtils';
import { SAMPLE_LOCATIONS } from '../hatcheryConstants';

/**
 * Generate PDF report for a hatchery audit
 * @param {Object} audit - Complete audit data
 * @returns {jsPDF} PDF document
 */
export function generateAuditPDF(audit) {
    const doc = new jsPDF();
    let yPos = 20;

    // Header
    yPos = addHeader(doc, audit, yPos);

    // Summary Section
    yPos = addSummarySection(doc, audit, yPos);

    // Vaccine Storage Section
    if (audit.vaccineStorage) {
        yPos = checkPageBreak(doc, yPos, 60);
        yPos = addVaccineStorageSection(doc, audit.vaccineStorage, yPos);
    }

    // Equipment Section
    if (audit.equipment && audit.equipment.length > 0) {
        yPos = checkPageBreak(doc, yPos, 60);
        yPos = addEquipmentSection(doc, audit.equipment, yPos);
    }

    // Techniques Section
    if (audit.techniques) {
        yPos = checkPageBreak(doc, yPos, 60);
        yPos = addTechniquesSection(doc, audit.techniques, yPos);
    }

    // Environmental Assessment Section
    if (audit.samples) {
        doc.addPage();
        yPos = 20;
        yPos = addEnvironmentalSection(doc, audit.samples, yPos);
    }

    // Add page numbers
    addPageNumbers(doc);

    return doc;
}

/**
 * Download PDF report
 * @param {Object} audit - Complete audit data
 */
export function downloadAuditPDF(audit) {
    const doc = generateAuditPDF(audit);
    const filename = `Hatchery_Audit_${audit.auditNumber || 'Report'}.pdf`;
    doc.save(filename);
}

// Helper Functions

function checkPageBreak(doc, yPos, requiredSpace) {
    if (yPos + requiredSpace > 270) {
        doc.addPage();
        return 20;
    }
    return yPos;
}

function addHeader(doc, audit, yPos) {
    // Title
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('Hatchery Audit Report', 105, yPos, { align: 'center' });

    yPos += 10;
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(audit.auditNumber || 'N/A', 105, yPos, { align: 'center' });

    yPos += 15;

    // Audit Info Box
    doc.setDrawColor(200);
    doc.setFillColor(245, 247, 250);
    doc.rect(15, yPos, 180, 30, 'FD');

    doc.setFontSize(10);
    yPos += 8;

    doc.setFont(undefined, 'bold');
    doc.text('Date:', 20, yPos);
    doc.setFont(undefined, 'normal');
    doc.text(formatDate(audit.info?.auditDate, 'long'), 50, yPos);

    doc.setFont(undefined, 'bold');
    doc.text('Location:', 120, yPos);
    doc.setFont(undefined, 'normal');
    doc.text(audit.info?.location || 'N/A', 150, yPos);

    yPos += 7;

    doc.setFont(undefined, 'bold');
    doc.text('Auditor:', 20, yPos);
    doc.setFont(undefined, 'normal');
    doc.text(audit.info?.auditor || 'N/A', 50, yPos);

    doc.setFont(undefined, 'bold');
    doc.text('Type:', 120, yPos);
    doc.setFont(undefined, 'normal');
    doc.text(audit.info?.auditType || 'N/A', 150, yPos);

    return yPos + 20;
}

function addSummarySection(doc, audit, yPos) {
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Overall Assessment', 15, yPos);

    yPos += 10;

    if (audit.finalScore) {
        const score = audit.finalScore.score || 0;
        const classification = audit.finalScore.classification || 'N/A';

        // Score box
        const color = classification === 'GOOD' ? [16, 185, 129] :
            classification === 'FAIR' ? [245, 158, 11] : [239, 68, 68];

        doc.setFillColor(...color);
        doc.rect(15, yPos, 60, 20, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.text(score.toString(), 45, yPos + 14, { align: 'center' });

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(`Classification: ${classification}`, 80, yPos + 10);
    }

    return yPos + 30;
}

function addVaccineStorageSection(doc, data, yPos) {
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Vaccine Storage Assessment', 15, yPos);

    yPos += 8;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');

    if (data.currentTemperature) {
        doc.text(`Temperature: ${data.currentTemperature}°C`, 15, yPos);
        yPos += 6;
    }

    // Checklist
    const checks = [
        { key: 'temperatureOk', label: 'Temperature maintained (+2°C to +8°C)' },
        { key: 'tempLogAvailable', label: 'Temperature log available' },
        { key: 'vaccineOnly', label: 'Refrigerator for vaccines only' },
        { key: 'fifoFollowed', label: 'FIFO principle followed' },
        { key: 'properPositioning', label: 'Proper positioning' },
        { key: 'clearLabeling', label: 'Clear labeling' }
    ];

    checks.forEach(check => {
        const status = data[check.key] ? '✓' : '✗';
        const color = data[check.key] ? [16, 185, 129] : [239, 68, 68];
        doc.setTextColor(...color);
        doc.text(status, 15, yPos);
        doc.setTextColor(0, 0, 0);
        doc.text(check.label, 22, yPos);
        yPos += 6;
    });

    return yPos + 5;
}

function addEquipmentSection(doc, equipment, yPos) {
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Vaccination Equipment', 15, yPos);

    yPos += 8;

    const tableData = equipment.map(eq => [
        eq.name || eq.type,
        eq.quantity || 1,
        eq.conditionGood ? '✓' : '✗',
        eq.maintenanceCurrent ? '✓' : '✗',
        eq.notes || '-'
    ]);

    doc.autoTable({
        startY: yPos,
        head: [['Equipment', 'Qty', 'Condition', 'Maintenance', 'Notes']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] },
        styles: { fontSize: 9 }
    });

    return doc.lastAutoTable.finalY + 10;
}

function addTechniquesSection(doc, data, yPos) {
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Vaccination Techniques', 15, yPos);

    yPos += 8;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');

    if (data.spraySampleSize) {
        doc.text(`Spray Sample Size: ${data.spraySampleSize} trays`, 15, yPos);
        yPos += 6;
    }

    if (data.dropletUniformity) {
        doc.text(`Droplet Uniformity: ${data.dropletUniformity}`, 15, yPos);
        yPos += 6;
    }

    if (data.trayCoverage) {
        doc.text(`Tray Coverage: ${data.trayCoverage}%`, 15, yPos);
        yPos += 6;
    }

    // Injection Quality
    if (data.injectionSampleSize) {
        yPos += 5;
        doc.setFont(undefined, 'bold');
        doc.text('Injection Quality:', 15, yPos);
        doc.setFont(undefined, 'normal');
        yPos += 6;

        doc.text(`Sample Size: ${data.injectionSampleSize} chicks`, 15, yPos);
        yPos += 6;
        doc.text(`Accurate: ${data.accurateInjectionPercent || 0}%`, 15, yPos);
        yPos += 6;
        doc.text(`Bleeding: ${data.bleedingPercent || 0}%`, 15, yPos);
        yPos += 6;
        doc.text(`Wet Neck: ${data.wetNeckPercent || 0}%`, 15, yPos);
        yPos += 6;
    }

    return yPos + 5;
}

function addEnvironmentalSection(doc, samples, yPos) {
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Environmental Assessment Results', 15, yPos);

    yPos += 10;

    // Create table data from samples
    const tableData = [];

    Object.entries(samples).forEach(([locationKey, sampleGroup]) => {
        if (sampleGroup && sampleGroup.length > 0) {
            sampleGroup.forEach(sample => {
                tableData.push([
                    sample.id,
                    sample.name,
                    sample.type === 'air_plate' ? 'Air Plate' : 'Swab',
                    sample.aspergillusCount || '-',
                    sample.colonyCount || '-',
                    sample.score || '-'
                ]);
            });
        }
    });

    if (tableData.length > 0) {
        doc.autoTable({
            startY: yPos,
            head: [['Sample ID', 'Location', 'Type', 'Aspergillus', 'Other Molds', 'Score']],
            body: tableData,
            theme: 'striped',
            headStyles: { fillColor: [59, 130, 246] },
            styles: { fontSize: 8 },
            columnStyles: {
                0: { cellWidth: 25 },
                1: { cellWidth: 50 },
                2: { cellWidth: 25 },
                3: { cellWidth: 25 },
                4: { cellWidth: 25 },
                5: { cellWidth: 20 }
            }
        });
    }

    return doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : yPos + 10;
}

function addPageNumbers(doc) {
    const pageCount = doc.internal.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(150);
        doc.text(
            `Page ${i} of ${pageCount}`,
            doc.internal.pageSize.getWidth() / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
        );
    }
}
