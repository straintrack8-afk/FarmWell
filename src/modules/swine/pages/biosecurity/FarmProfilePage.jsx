import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBiosecurity } from '../../contexts/BiosecurityContext';

// Translation data for the form
const translations = {
    en: {
        title: 'Farm Profile',
        subtitle: 'Basic information about your farm',
        assessmentDate: 'Assessment Date',
        assessorName: 'Assessor Name',
        farmName: 'Farm Name',
        auditType: 'Audit Type',
        auditTypes: {
            internal: 'Internal Audit',
            external: 'External Audit',
            certification: 'Certification Audit',
            surveillance: 'Surveillance Audit'
        },
        farmType: 'What type of pig farm do you operate?',
        farmTypes: {
            breeding: 'Breeding farm (sows and piglets)',
            finishing: 'Finishing farm (fattening pigs)',
            farrow_to_finish: 'Farrow-to-finish (complete cycle)',
            nursery: 'Nursery (weaned piglets)'
        },
        hasOtherLivestock: 'Do you have other livestock on the same premises?',
        nearOtherFarms: 'Is your farm located near other pig farms?',
        numberOfPigs: 'How many pigs are currently on your farm?',
        operatingDuration: 'How long have you been operating this pig farm?',
        durations: {
            less_than_1_year: 'Less than 1 year',
            '1_to_3_years': '1 to 3 years',
            '3_to_5_years': '3 to 5 years',
            '5_to_10_years': '5 to 10 years',
            more_than_10_years: 'More than 10 years'
        },
        yesNo: {
            yes: 'Yes',
            no: 'No'
        },
        yesNoUnknown: {
            yes: 'Yes',
            no: 'No',
            dont_know: "I don't know"
        },
        selectPlaceholder: 'Select an option',
        saveButton: 'Save Farm Profile',
        cancelButton: 'Cancel',
        requiredField: 'This field is required'
    },
    id: {
        title: 'Profil Peternakan',
        subtitle: 'Informasi dasar tentang peternakan Anda',
        assessmentDate: 'Tanggal Penilaian',
        assessorName: 'Nama Penilai',
        farmName: 'Nama Peternakan',
        auditType: 'Jenis Audit',
        auditTypes: {
            internal: 'Audit Internal',
            external: 'Audit Eksternal',
            certification: 'Audit Sertifikasi',
            surveillance: 'Audit Pengawasan'
        },
        farmType: 'Jenis peternakan babi apa yang Anda operasikan?',
        farmTypes: {
            breeding: 'Peternakan pembibitan (induk dan anak babi)',
            finishing: 'Peternakan penggemukan',
            farrow_to_finish: 'Farrow-to-finish (siklus lengkap)',
            nursery: 'Nursery (anak babi yang disapih)'
        },
        hasOtherLivestock: 'Apakah Anda memiliki ternak lain di lokasi yang sama?',
        nearOtherFarms: 'Apakah peternakan Anda berlokasi dekat dengan peternakan babi lain?',
        numberOfPigs: 'Berapa jumlah babi yang saat ini ada di peternakan Anda?',
        operatingDuration: 'Sudah berapa lama Anda mengoperasikan peternakan babi ini?',
        durations: {
            less_than_1_year: 'Kurang dari 1 tahun',
            '1_to_3_years': '1 hingga 3 tahun',
            '3_to_5_years': '3 hingga 5 tahun',
            '5_to_10_years': '5 hingga 10 tahun',
            more_than_10_years: 'Lebih dari 10 tahun'
        },
        yesNo: {
            yes: 'Ya',
            no: 'Tidak'
        },
        yesNoUnknown: {
            yes: 'Ya',
            no: 'Tidak',
            dont_know: 'Saya tidak tahu'
        },
        selectPlaceholder: 'Pilih opsi',
        saveButton: 'Simpan Profil Peternakan',
        cancelButton: 'Batal',
        requiredField: 'Field ini wajib diisi'
    },
    vt: {
        title: 'Hồ Sơ Trang Trại',
        subtitle: 'Thông tin cơ bản về trang trại của bạn',
        assessmentDate: 'Ngày Đánh Giá',
        assessorName: 'Tên Người Đánh Giá',
        farmName: 'Tên Trang Trại',
        auditType: 'Loại Kiểm Toán',
        auditTypes: {
            internal: 'Kiểm Toán Nội Bộ',
            external: 'Kiểm Toán Bên Ngoài',
            certification: 'Kiểm Toán Chứng Nhận',
            surveillance: 'Kiểm Toán Giám Sát'
        },
        farmType: 'Bạn vận hành loại trang trại lợn nào?',
        farmTypes: {
            breeding: 'Trang trại giống (lợn nái và lợn con)',
            finishing: 'Trang trại vỗ béo',
            farrow_to_finish: 'Chu kỳ hoàn chỉnh',
            nursery: 'Nhà trẻ (lợn con cai sữa)'
        },
        hasOtherLivestock: 'Bạn có nuôi gia súc khác trong cùng khu vực không?',
        nearOtherFarms: 'Trang trại của bạn có nằm gần các trang trại lợn khác không?',
        numberOfPigs: 'Hiện tại có bao nhiêu con lợn trong trang trại của bạn?',
        operatingDuration: 'Bạn đã vận hành trang trại lợn này được bao lâu?',
        durations: {
            less_than_1_year: 'Dưới 1 năm',
            '1_to_3_years': '1 đến 3 năm',
            '3_to_5_years': '3 đến 5 năm',
            '5_to_10_years': '5 đến 10 năm',
            more_than_10_years: 'Hơn 10 năm'
        },
        yesNo: {
            yes: 'Có',
            no: 'Không'
        },
        yesNoUnknown: {
            yes: 'Có',
            no: 'Không',
            dont_know: 'Tôi không biết'
        },
        selectPlaceholder: 'Chọn một tùy chọn',
        saveButton: 'Lưu Hồ Sơ Trang Trại',
        cancelButton: 'Hủy',
        requiredField: 'Trường này là bắt buộc'
    }
};

function FarmProfilePage() {
    const navigate = useNavigate();
    const { language: contextLanguage, setFarmProfile } = useBiosecurity();
    const [currentLang, setCurrentLang] = useState(contextLanguage || 'en');
    const [errors, setErrors] = useState({});

    // Form state
    const [formData, setFormData] = useState({
        assessmentDate: new Date().toISOString().split('T')[0],
        assessorName: '',
        farmName: '',
        auditType: '',
        farmType: '',
        hasOtherLivestock: '',
        nearOtherFarms: '',
        numberOfPigs: '',
        operatingDuration: ''
    });

    // Load existing farm profile data
    useEffect(() => {
        setCurrentLang(contextLanguage || 'en');

        // Load existing farm profile from localStorage
        const savedProfile = localStorage.getItem('pigwell_farm_profile');
        if (savedProfile) {
            try {
                const profileData = JSON.parse(savedProfile);
                setFormData(prevData => ({
                    ...prevData,
                    ...profileData
                }));
            } catch (error) {
                console.error('Error loading farm profile:', error);
            }
        }
    }, [contextLanguage]);

    const t = translations[currentLang] || translations.en;

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Clear error for this field
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: null
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.assessmentDate) newErrors.assessmentDate = t.requiredField;
        if (!formData.assessorName.trim()) newErrors.assessorName = t.requiredField;
        if (!formData.farmName.trim()) newErrors.farmName = t.requiredField;
        if (!formData.auditType) newErrors.auditType = t.requiredField;
        if (!formData.farmType) newErrors.farmType = t.requiredField;
        if (!formData.hasOtherLivestock) newErrors.hasOtherLivestock = t.requiredField;
        if (!formData.nearOtherFarms) newErrors.nearOtherFarms = t.requiredField;
        if (!formData.numberOfPigs || formData.numberOfPigs <= 0) newErrors.numberOfPigs = t.requiredField;
        if (!formData.operatingDuration) newErrors.operatingDuration = t.requiredField;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validateForm()) {
            return;
        }

        // Save to localStorage
        localStorage.setItem('pigwell_farm_profile', JSON.stringify(formData));

        // Update context
        setFarmProfile({
            completed: true,
            data: formData,
            timestamp: new Date().toISOString()
        });

        // Navigate to dashboard
        navigate('/swine/biosecurity/dashboard');
    };

    const handleCancel = () => {
        navigate('/swine/biosecurity/dashboard');
    };

    return (
        <div className="farm-profile-page">
            <div className="farm-profile-container">
                <div className="farm-profile-header">
                    <h1>{t.title}</h1>
                    <p>{t.subtitle}</p>
                </div>

                <div className="farm-profile-form">
                    {/* Assessment Metadata Section */}
                    <div className="form-section">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="assessmentDate">
                                    {t.assessmentDate} <span className="required">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="assessmentDate"
                                    value={formData.assessmentDate}
                                    onChange={(e) => handleInputChange('assessmentDate', e.target.value)}
                                    className={errors.assessmentDate ? 'error' : ''}
                                />
                                {errors.assessmentDate && <span className="error-message">{errors.assessmentDate}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="assessorName">
                                    {t.assessorName} <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="assessorName"
                                    value={formData.assessorName}
                                    onChange={(e) => handleInputChange('assessorName', e.target.value)}
                                    placeholder={t.assessorName}
                                    className={errors.assessorName ? 'error' : ''}
                                />
                                {errors.assessorName && <span className="error-message">{errors.assessorName}</span>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="farmName">
                                    {t.farmName} <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="farmName"
                                    value={formData.farmName}
                                    onChange={(e) => handleInputChange('farmName', e.target.value)}
                                    placeholder={t.farmName}
                                    className={errors.farmName ? 'error' : ''}
                                />
                                {errors.farmName && <span className="error-message">{errors.farmName}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="auditType">
                                    {t.auditType} <span className="required">*</span>
                                </label>
                                <select
                                    id="auditType"
                                    value={formData.auditType}
                                    onChange={(e) => handleInputChange('auditType', e.target.value)}
                                    className={errors.auditType ? 'error' : ''}
                                >
                                    <option value="">{t.selectPlaceholder}</option>
                                    {Object.entries(t.auditTypes).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                                {errors.auditType && <span className="error-message">{errors.auditType}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Farm Profile Questions Section */}
                    <div className="form-section">
                        <div className="form-group full-width">
                            <label htmlFor="farmType">
                                {t.farmType} <span className="required">*</span>
                            </label>
                            <select
                                id="farmType"
                                value={formData.farmType}
                                onChange={(e) => handleInputChange('farmType', e.target.value)}
                                className={errors.farmType ? 'error' : ''}
                            >
                                <option value="">{t.selectPlaceholder}</option>
                                {Object.entries(t.farmTypes).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                            {errors.farmType && <span className="error-message">{errors.farmType}</span>}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="hasOtherLivestock">
                                    {t.hasOtherLivestock} <span className="required">*</span>
                                </label>
                                <select
                                    id="hasOtherLivestock"
                                    value={formData.hasOtherLivestock}
                                    onChange={(e) => handleInputChange('hasOtherLivestock', e.target.value)}
                                    className={errors.hasOtherLivestock ? 'error' : ''}
                                >
                                    <option value="">{t.selectPlaceholder}</option>
                                    {Object.entries(t.yesNo).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                                {errors.hasOtherLivestock && <span className="error-message">{errors.hasOtherLivestock}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="nearOtherFarms">
                                    {t.nearOtherFarms} <span className="required">*</span>
                                </label>
                                <select
                                    id="nearOtherFarms"
                                    value={formData.nearOtherFarms}
                                    onChange={(e) => handleInputChange('nearOtherFarms', e.target.value)}
                                    className={errors.nearOtherFarms ? 'error' : ''}
                                >
                                    <option value="">{t.selectPlaceholder}</option>
                                    {Object.entries(t.yesNoUnknown).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                                {errors.nearOtherFarms && <span className="error-message">{errors.nearOtherFarms}</span>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="numberOfPigs">
                                    {t.numberOfPigs} <span className="required">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="numberOfPigs"
                                    value={formData.numberOfPigs}
                                    onChange={(e) => handleInputChange('numberOfPigs', e.target.value)}
                                    placeholder="0"
                                    min="1"
                                    className={errors.numberOfPigs ? 'error' : ''}
                                />
                                {errors.numberOfPigs && <span className="error-message">{errors.numberOfPigs}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="operatingDuration">
                                    {t.operatingDuration} <span className="required">*</span>
                                </label>
                                <select
                                    id="operatingDuration"
                                    value={formData.operatingDuration}
                                    onChange={(e) => handleInputChange('operatingDuration', e.target.value)}
                                    className={errors.operatingDuration ? 'error' : ''}
                                >
                                    <option value="">{t.selectPlaceholder}</option>
                                    {Object.entries(t.durations).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                                {errors.operatingDuration && <span className="error-message">{errors.operatingDuration}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="form-actions">
                        <button className="btn-secondary" onClick={handleCancel}>
                            {t.cancelButton}
                        </button>
                        <button className="btn-primary" onClick={handleSave}>
                            {t.saveButton}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FarmProfilePage;
