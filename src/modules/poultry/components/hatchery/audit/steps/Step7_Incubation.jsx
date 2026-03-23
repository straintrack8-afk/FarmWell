import React from 'react';
import { useHatcheryAudit } from '../../../../contexts/HatcheryAuditContext';
import { formatDate, formatRelativeTime, addDays } from '../../../../utils/hatchery/dateUtils';
import { useLanguage } from '../../../../../../contexts/LanguageContext';

function Step7_Incubation() {
    const { currentAudit, updateAuditSection } = useHatcheryAudit();
    const { language } = useLanguage();
    const info = currentAudit?.info || {};

    const translations = {
        title: {
            en: "Incubation Tracking",
            id: "Pelacakan Inkubasi",
            vi: "Theo dõi Ấp trứng"
        },
        description: {
            en: "Track the 3-5 day incubation period for environmental samples (37°C).",
            id: "Lacak periode inkubasi 3-5 hari untuk sampel lingkungan (37°C).",
            vi: "Theo dõi giai đoạn ấp trứng 3-5 ngày cho mẫu môi trường (37°C)."
        },
        readyToIncubate: {
            en: "Ready to Incubate?",
            id: "Siap untuk Inkubasi?",
            vi: "Sẵn sàng ấp trứng?"
        },
        readyDescription: {
            en: "Ensure all samples are placed in the incubator at 37°C.",
            id: "Pastikan semua sampel ditempatkan di inkubator pada 37°C.",
            vi: "Đảm bảo tất cả mẫu được đặt trong máy ấp ở 37°C."
        },
        startIncubationTimer: {
            en: "Start Incubation Timer",
            id: "Mulai Timer Inkubasi",
            vi: "Bắt đầu Hẹn giờ Ấp trứng"
        },
        incubationInProgress: {
            en: "Incubation In Progress",
            id: "Inkubasi Sedang Berlangsung",
            vi: "Đang ấp trứng"
        },
        started: {
            en: "Started",
            id: "Dimulai",
            vi: "Bắt đầu"
        },
        progressLabel: {
            en: "Progress (3 Days)",
            id: "Progres (3 Hari)",
            vi: "Tiến độ (3 Ngày)"
        },
        startDateTime: {
            en: "Start Date & Time",
            id: "Tanggal & Waktu Mulai",
            vi: "Ngày & Giờ Bắt đầu"
        },
        expectedCompletion: {
            en: "Expected Completion (72 hours)",
            id: "Perkiraan Penyelesaian (72 jam)",
            vi: "Dự kiến Hoàn thành (72 giờ)"
        },
        incubationComplete: {
            en: "Incubation Complete",
            id: "Inkubasi Selesai",
            vi: "Ấp trứng Hoàn thành"
        },
        proceedToResults: {
            en: "Proceed to Results Entry to record colony counts.",
            id: "Lanjut ke Entri Hasil untuk mencatat jumlah koloni.",
            vi: "Tiếp tục Nhập Kết quả để ghi lại số lượng khuẩn lạc."
        }
    };

    // Translated time helper function
    const formatRelativeTimeTranslated = (date) => {
        if (!date) return '';

        const d = new Date(date);
        const now = new Date();

        const diffMs = now - d;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);

        const timeUnits = {
            minute: {
                en: "minute",
                id: "menit",
                vi: "phút"
            },
            minutes: {
                en: "minutes",
                id: "menit",
                vi: "phút"
            },
            hour: {
                en: "hour",
                id: "jam",
                vi: "giờ"
            },
            hours: {
                en: "hours",
                id: "jam",
                vi: "giờ"
            },
            day: {
                en: "day",
                id: "hari",
                vi: "ngày"
            },
            days: {
                en: "days",
                id: "hari",
                vi: "ngày"
            },
            week: {
                en: "week",
                id: "minggu",
                vi: "tuần"
            },
            weeks: {
                en: "weeks",
                id: "minggu",
                vi: "tuần"
            },
            month: {
                en: "month",
                id: "bulan",
                vi: "tháng"
            },
            months: {
                en: "months",
                id: "bulan",
                vi: "tháng"
            },
            year: {
                en: "year",
                id: "tahun",
                vi: "năm"
            },
            years: {
                en: "years",
                id: "tahun",
                vi: "năm"
            },
            justNow: {
                en: "just now",
                id: "baru saja",
                vi: "vừa mới"
            },
            ago: {
                en: "ago",
                id: "yang lalu",
                vi: "trước"
            }
        };

        if (diffSec < 60) return timeUnits.justNow[language];
        if (diffMin < 60) {
            const unit = diffMin === 1 ? 'minute' : 'minutes';
            return `${diffMin} ${timeUnits[unit][language]} ${timeUnits.ago[language]}`;
        }
        if (diffHour < 24) {
            const unit = diffHour === 1 ? 'hour' : 'hours';
            return `${diffHour} ${timeUnits[unit][language]} ${timeUnits.ago[language]}`;
        }
        if (diffDay < 7) {
            const unit = diffDay === 1 ? 'day' : 'days';
            return `${diffDay} ${timeUnits[unit][language]} ${timeUnits.ago[language]}`;
        }
        if (diffDay < 30) {
            const weeks = Math.floor(diffDay / 7);
            const unit = weeks === 1 ? 'week' : 'weeks';
            return `${weeks} ${timeUnits[unit][language]} ${timeUnits.ago[language]}`;
        }
        if (diffDay < 365) {
            const months = Math.floor(diffDay / 30);
            const unit = months === 1 ? 'month' : 'months';
            return `${months} ${timeUnits[unit][language]} ${timeUnits.ago[language]}`;
        }

        const years = Math.floor(diffDay / 365);
        const unit = years === 1 ? 'year' : 'years';
        return `${years} ${timeUnits[unit][language]} ${timeUnits.ago[language]}`;
    };

    const handleIncubationStart = () => {
        const now = new Date().toISOString();
        updateAuditSection('info', {
            ...info,
            incubationStartDate: now,
            incubationExpectedEndDate: addDays(now, 3)
        });
    };

    const handleUpdateDate = (field, value) => {
        updateAuditSection('info', {
            ...info,
            [field]: value
        });
    };

    const isIncubating = !!info.incubationStartDate;

    // Calculate progress (simplified)
    const start = info.incubationStartDate ? new Date(info.incubationStartDate).getTime() : 0;
    const end = info.incubationExpectedEndDate ? new Date(info.incubationExpectedEndDate).getTime() : 0;
    const now = Date.now();

    let progress = 0;
    if (start && end) {
        const total = end - start;
        const current = now - start;
        progress = Math.min(100, Math.max(0, Math.round((current / total) * 100)));
    }

    return (
        <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                {translations.title[language]}
            </h2>
            <p style={{ color: '#6B7280', marginBottom: '2rem' }}>
                {translations.description[language]}
            </p>

            {!isIncubating ? (
                <div className="hatchery-card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}></div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
                        {translations.readyToIncubate[language]}
                    </h3>
                    <p style={{ color: '#6B7280', marginBottom: '2rem' }}>
                        {translations.readyDescription[language]}
                    </p>
                    <button
                        onClick={handleIncubationStart}
                        className="btn-hatchery btn-primary"
                        style={{ fontSize: '1.25rem', padding: '1rem 2rem' }}
                    >
                        {translations.startIncubationTimer[language]}
                    </button>
                </div>
            ) : (
                <div>
                    <div className="alert info" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ fontSize: '2rem' }}></div>
                        <div>
                            <strong>{translations.incubationInProgress[language]}</strong>
                            <br />
                            {translations.started[language]} {formatRelativeTimeTranslated(info.incubationStartDate)}
                        </div>
                    </div>

                    <div className="hatchery-card">
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span>{translations.progressLabel[language]}</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="progress-bar-container">
                                <div className="progress-bar-fill" style={{ width: `${progress}%`, backgroundColor: progress >= 100 ? '#10B981' : '#3B82F6' }}></div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">{translations.startDateTime[language]}</label>
                            <input
                                type="datetime-local"
                                className="form-input"
                                value={info.incubationStartDate ? new Date(info.incubationStartDate).toISOString().slice(0, 16) : ''}
                                onChange={(e) => handleUpdateDate('incubationStartDate', e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">{translations.expectedCompletion[language]}</label>
                            <input
                                type="datetime-local"
                                className="form-input"
                                value={info.incubationExpectedEndDate ? new Date(info.incubationExpectedEndDate).toISOString().slice(0, 16) : ''}
                                onChange={(e) => handleUpdateDate('incubationExpectedEndDate', e.target.value)}
                            />
                        </div>
                    </div>

                    {progress >= 100 && (
                        <div className="alert success" style={{ marginTop: '2rem' }}>
                            <span></span>
                            <div>
                                <strong>{translations.incubationComplete[language]}</strong>
                                <br />
                                {translations.proceedToResults[language]}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Step7_Incubation;
