import React, { useEffect } from 'react';
import { useHatcheryAudit } from '../../../../contexts/HatcheryAuditContext';
import { SAMPLE_LOCATIONS as LOCATION_CONFIG } from '../../../../utils/hatcheryConstants';
import { useLanguage } from '../../../../../../contexts/LanguageContext';

function Step5_SamplePlan() {
    const { currentAudit, updateAuditSection } = useHatcheryAudit();
    const { language } = useLanguage();
    const samples = currentAudit?.samples || {};

    const translations = {
        title: {
            en: "Environmental Sampling Plan",
            id: "Rencana Pengambilan Sampel Lingkungan",
            vi: "Kế hoạch Lấy mẫu Môi trường"
        },
        description: {
            en: "Review and confirm the 30-point sampling plan.",
            id: "Tinjau dan konfirmasi rencana pengambilan sampel 30 titik.",
            vi: "Xem lại và xác nhận kế hoạch lấy mẫu 30 điểm."
        },
        resetToDefault: {
            en: "Reset to Default",
            id: "Reset ke Default",
            vi: "Đặt lại Mặc định"
        },
        resetConfirm: {
            en: "Reset sample plan to default? Any custom changes will be lost.",
            id: "Reset rencana pengambilan sampel ke default? Perubahan kustom apa pun akan hilang.",
            vi: "Đặt lại kế hoạch lấy mẫu về mặc định? Mọi thay đổi tùy chỉnh sẽ bị mất."
        },
        totalSamples: {
            en: "Total Samples:",
            id: "Total Sampel:",
            vi: "Tổng số Mẫu:"
        },
        standardProtocol: {
            en: "Standard protocol requires 30 monitoring points across the hatchery.",
            id: "Protokol standar memerlukan 30 titik pemantauan di seluruh penetasan.",
            vi: "Giao thức tiêu chuẩn yêu cầu 30 điểm giám sát trên toàn bộ trại ấp."
        },
        samplesText: {
            en: "samples",
            id: "sampel",
            vi: "mẫu"
        },
        note: {
            en: "Note:",
            id: "Catatan:",
            vi: "Lưu ý:"
        },
        warningMessage: {
            en: "Once you proceed to collection, the sampling plan cannot be modified.",
            id: "Setelah Anda melanjutkan ke pengumpulan, rencana pengambilan sampel tidak dapat dimodifikasi.",
            vi: "Khi bạn tiến hành thu thập, kế hoạch lấy mẫu không thể được sửa đổi."
        },
        sampleTypes: {
            eggshell: {
                en: "eggshell",
                id: "kulit telur",
                vi: "vỏ trứng"
            },
            fluff: {
                en: "fluff",
                id: "bulu",
                vi: "lông tơ"
            },
            air: {
                en: "air",
                id: "udara",
                vi: "không khí"
            },
            water: {
                en: "water",
                id: "air",
                vi: "nước"
            },
            surface: {
                en: "surface",
                id: "permukaan",
                vi: "bề mặt"
            },
            chick: {
                en: "chick",
                id: "anak ayam",
                vi: "gà con"
            }
        }
    };

    useEffect(() => {
        // Initialize samples if they don't exist
        if (Object.keys(samples).length === 0) {
            initializeSamples();
        }
    }, []);

    const initializeSamples = () => {
        const newSamples = {};

        Object.entries(LOCATION_CONFIG).forEach(([key, config]) => {
            newSamples[key] = [];
            for (let i = 0; i < config.defaultCount; i++) {
                newSamples[key].push({
                    id: `${key}-${i + 1}`,
                    name: `${config.name} #${i + 1}`,
                    locationCode: config.code,
                    type: config.type,
                    collected: false,
                    collectionTime: null,
                    incubationStart: null,
                    incubationEnd: null,
                    colonyCount: null,
                    aspergillusCount: null,
                    score: null,
                    notes: ''
                });
            }
        });

        updateAuditSection('samples', newSamples);
    };

    const handleReset = () => {
        if (confirm(translations.resetConfirm[language])) {
            initializeSamples();
        }
    };

    const totalSamples = Object.values(samples).reduce((sum, group) => sum + group.length, 0);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                        {translations.title[language]}
                    </h2>
                    <p style={{ color: '#6B7280' }}>
                        {translations.description[language]}
                    </p>
                </div>
                <button
                    onClick={handleReset}
                    className="btn-hatchery btn-primary"
                    style={{ fontSize: '0.875rem' }}
                >
                    {translations.resetToDefault[language]}
                </button>
            </div>

            <div className="alert info" style={{ marginBottom: '2rem' }}>
                <span></span>
                <div>
                    <strong>{translations.totalSamples[language]} {totalSamples}</strong>
                    <br />
                    {translations.standardProtocol[language]}
                </div>
            </div>

            <div className="sample-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {Object.entries(LOCATION_CONFIG).map(([key, config]) => (
                    <div key={key} className="hatchery-card" style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '0.5rem' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>
                                {config.name} ({config.code})
                            </h3>
                            <span className="badge" style={{ backgroundColor: '#E5E7EB', color: '#374151' }}>
                                {samples[key]?.length || 0} {translations.samplesText[language]}
                            </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {samples[key]?.map((sample, index) => (
                                <div key={sample.id} style={{
                                    padding: '0.5rem',
                                    backgroundColor: '#F9FAFB',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #E5E7EB',
                                    fontSize: '0.875rem',
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}>
                                    <span>{sample.name}</span>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        color: '#6B7280',
                                        textTransform: 'uppercase',
                                        backgroundColor: '#E5E7EB',
                                        padding: '0.125rem 0.375rem',
                                        borderRadius: '0.25rem'
                                    }}>
                                        {translations.sampleTypes[sample.type] || sample.type.replace('_', ' ')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="alert warning" style={{ marginTop: '2rem' }}>
                <span></span>
                <div>
                    <strong>{translations.note[language]}</strong> {translations.warningMessage[language]}
                </div>
            </div>
        </div>
    );
}

export default Step5_SamplePlan;
