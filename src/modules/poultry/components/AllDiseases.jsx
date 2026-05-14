import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDiagnosis } from '../contexts/DiagnosisContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { STEPS } from '../utils/constants';
import PoultryTopNav from './common/PoultryTopNav';

const DiagnosticToolsIcon = () => (
    <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, stroke: 'white', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
        <circle cx="11" cy="11" r="8"/>
        <path d="M21 21l-4.35-4.35"/>
        <path d="M11 8v6M8 11h6"/>
    </svg>
);

// Translation object for AllDiseases page
const translations = {
  en: {
    pageTitle: 'All Poultry Diseases & Conditions',
    browseText: 'Browse and explore {count} diseases in our database',
    searchLabel: 'Search Disease',
    searchPlaceholder: 'Search by name...',
    categoryLabel: 'Category',
    severityLabel: 'Severity',
    all: 'All',
    showing: 'Showing',
    of: 'of',
    diseases: 'diseases',
    viewDetails: 'View Details',
    backButton: '← Back to Symptom Selection',
    noResults: 'No diseases found',
    tryAdjusting: 'Try adjusting your search or filters',
    affects: 'Affects',
    zoonotic: '⚠️ Zoonotic',
    // Category translations
    Viral: 'Viral',
    Bacterial: 'Bacterial',
    Parasitic: 'Parasitic',
    Fungal: 'Fungal',
    Ectoparasitic: 'Ectoparasitic',
    Nutritional: 'Nutritional',
    Metabolic: 'Metabolic',
    Cardiovascular: 'Cardiovascular',
    Reproductive: 'Reproductive',
    Toxicological: 'Toxicological',
    Environmental: 'Environmental',
    Management: 'Management',
    Digestive: 'Digestive',
    Other: 'Other',
    // Severity translations
    High: 'High',
    Medium: 'Medium',
    Low: 'Low'
  },
  id: {
    pageTitle: 'Semua Penyakit & Kondisi Unggas',
    browseText: 'Jelajahi {count} penyakit dalam database kami',
    searchLabel: 'Cari Penyakit',
    searchPlaceholder: 'Cari berdasarkan nama...',
    categoryLabel: 'Kategori',
    severityLabel: 'Tingkat Keparahan',
    all: 'Semua',
    showing: 'Menampilkan',
    of: 'dari',
    diseases: 'penyakit',
    viewDetails: 'Lihat Detail',
    backButton: '← Kembali ke Pemilihan Gejala',
    noResults: 'Tidak ada penyakit ditemukan',
    tryAdjusting: 'Coba sesuaikan pencarian atau filter Anda',
    affects: 'Mempengaruhi',
    zoonotic: '⚠️ Zoonosis',
    // Category translations
    Viral: 'Viral',
    Bacterial: 'Bakteri',
    Parasitic: 'Parasit',
    Fungal: 'Jamur',
    Ectoparasitic: 'Ektoparasit',
    Nutritional: 'Nutrisi',
    Metabolic: 'Metabolik',
    Cardiovascular: 'Kardiovaskular',
    Reproductive: 'Reproduksi',
    Toxicological: 'Toksikologi',
    Environmental: 'Lingkungan',
    Management: 'Manajemen',
    Digestive: 'Pencernaan',
    Other: 'Lainnya',
    // Severity translations
    High: 'Tinggi',
    Medium: 'Sedang',
    Low: 'Rendah',
    Tinggi: 'Tinggi',
    Sedang: 'Sedang',
    Rendah: 'Rendah'
  },
  vi: {
    pageTitle: 'Tất Cả Bệnh & Tình Trạng Gia Cầm',
    browseText: 'Duyệt và khám phá {count} bệnh trong cơ sở dữ liệu của chúng tôi',
    searchLabel: 'Tìm Kiếm Bệnh',
    searchPlaceholder: 'Tìm kiếm theo tên...',
    categoryLabel: 'Danh Mục',
    severityLabel: 'Mức Độ Nghiêm Trọng',
    all: 'Tất Cả',
    showing: 'Hiển thị',
    of: 'của',
    diseases: 'bệnh',
    viewDetails: 'Xem Chi Tiết',
    backButton: '← Quay Lại Chọn Triệu Chứng',
    noResults: 'Không tìm thấy bệnh',
    tryAdjusting: 'Thử điều chỉnh tìm kiếm hoặc bộ lọc của bạn',
    affects: 'Ảnh hưởng',
    zoonotic: '⚠️ Lây từ động vật',
    // Category translations
    Viral: 'Virus',
    Bacterial: 'Vi khuẩn',
    Parasitic: 'Ký sinh trùng',
    Fungal: 'Nấm',
    Ectoparasitic: 'Ký sinh trùng ngoài',
    Nutritional: 'Dinh dưỡng',
    Metabolic: 'Chuyển hóa',
    Cardiovascular: 'Tim mạch',
    Reproductive: 'Sinh sản',
    Toxicological: 'Độc chất',
    Environmental: 'Môi trường',
    Management: 'Quản lý',
    Digestive: 'Tiêu hóa',
    Other: 'Khác',
    // Severity translations
    High: 'Cao',
    Medium: 'Trung bình',
    Low: 'Thấp',
    Cao: 'Cao',
    'Trung bình': 'Trung bình',
    Thấp: 'Thấp'
  }
};

function AllDiseases() {
    const navigate = useNavigate();
    const { diseases, setStep } = useDiagnosis();
    const { language } = useLanguage();
    const normalizedLang = (language === 'vt' || language === 'vn') ? 'vi' : language;
    const t = translations[normalizedLang] || translations.en;
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedSeverity, setSelectedSeverity] = useState('all');
    
    // Update filter values when language changes
    useEffect(() => {
        setSelectedCategory('all');
        setSelectedSeverity('all');
    }, [language]);

    // Get unique categories and severities
    const categories = useMemo(() => {
        const cats = new Set(diseases.map(d => d.category || d.kategori).filter(Boolean));
        return Array.from(cats).sort();
    }, [diseases]);

    const severities = useMemo(() => {
        const sevs = new Set(diseases.map(d => d.severity || d.tingkat_keparahan).filter(Boolean));
        return Array.from(sevs).sort();
    }, [diseases]);

    // Filter diseases
    const filteredDiseases = useMemo(() => {
        return diseases.filter(disease => {
            const diseaseName = disease.name || disease.nama || disease.ten_benh || '';
            const diseaseCategory = disease.category || disease.kategori;
            const diseaseSeverity = disease.severity || disease.tingkat_keparahan;
            
            const matchesSearch = !searchQuery || 
                diseaseName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || diseaseCategory === selectedCategory;
            const matchesSeverity = selectedSeverity === 'all' || diseaseSeverity === selectedSeverity;
            
            return matchesSearch && matchesCategory && matchesSeverity;
        });
    }, [diseases, searchQuery, selectedCategory, selectedSeverity]);

    const getCategoryBadgeClass = (category) => {
        const map = {
            'Viral': 'fw-badge-viral',
            'Bacterial': 'fw-badge-bacterial',
            'Parasitic': 'fw-badge-parasitic',
            'Fungal': 'fw-badge-fungal',
            'Ectoparasitic': 'fw-badge-other',
            'Nutritional': 'fw-badge-other',
            'Metabolic': 'fw-badge-other',
            'Cardiovascular': 'fw-badge-other',
            'Reproductive': 'fw-badge-other',
            'Toxicological': 'fw-badge-other',
            'Environmental': 'fw-badge-other',
            'Management': 'fw-badge-other',
            'Digestive': 'fw-badge-other',
        };
        return map[category] || 'fw-badge-other';
    };

    const getSeverityBadgeClass = (severity) => {
        if (!severity) return '';
        const s = severity.toLowerCase();
        if (s === 'high') return 'fw-badge-high';
        if (s === 'medium') return 'fw-badge-medium';
        if (s === 'low') return 'fw-badge-low';
        return 'fw-badge-other';
    };

    return (
        <div className="fw-module-page">
            <PoultryTopNav title={t.pageTitle.replace('All Poultry ', '').replace('Semua ', '').replace('Tất Cả ', '') || 'All Diseases'} />

            <div className="fw-mod-card">

                {/* Filter bar */}
                <div className="fw-disease-filter-bar">
                    <div className="fw-disease-search">
                        <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t.searchPlaceholder}
                        />
                    </div>
                    <div className="fw-disease-filter-row">
                        <select
                            className="fw-disease-select"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="all">{t.categoryLabel}: {t.all}</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{t[cat] || cat}</option>
                            ))}
                        </select>
                        <select
                            className="fw-disease-select"
                            value={selectedSeverity}
                            onChange={(e) => setSelectedSeverity(e.target.value)}
                        >
                            <option value="all">{t.severityLabel}: {t.all}</option>
                            {severities.map(sev => (
                                <option key={sev} value={sev}>{t[sev] || sev}</option>
                            ))}
                        </select>
                    </div>
                    <div className="fw-disease-count">
                        {t.showing} <strong>{filteredDiseases.length}</strong> {t.of} {diseases.length} {t.diseases}
                    </div>
                </div>

                {/* Disease list */}
                <div className="fw-disease-list">
                    {filteredDiseases.length === 0 ? (
                        <div className="fw-disease-empty">
                            <div className="fw-disease-empty-title">{t.noResults}</div>
                            <div className="fw-disease-empty-sub">{t.tryAdjusting}</div>
                        </div>
                    ) : (
                        filteredDiseases.map((disease) => {
                            const name = disease.name?.[language] || disease.name?.en || disease.name || disease.nama || disease.ten_benh || '';
                            const desc = disease.description?.[language] || disease.description?.en || disease.description || disease.deskripsi || '';
                            const category = disease.category || disease.kategori;
                            const severity = disease.severity || disease.tingkat_keparahan;
                            const isZoonotic = disease.zoonotic || disease.is_zoonotic || disease.zoonosis;
                            const affects = disease.age_groups?.[language] || disease.age_groups?.en || disease.ageGroups || disease.kelompok_umur || '';

                            return (
                                <div
                                    key={disease.id || name}
                                    className="fw-disease-card"
                                    onClick={() => {
                                        if (setStep) setStep(STEPS.DETAIL);
                                        navigate('/poultry/diagnostic/detail', { state: { disease } });
                                    }}
                                >
                                    <div className="fw-disease-card-name">{name}</div>
                                    <div className="fw-disease-badges">
                                        {category && (
                                            <span className={`fw-disease-badge ${getCategoryBadgeClass(category)}`}>
                                                {t[category] || category}
                                            </span>
                                        )}
                                        {severity && (
                                            <span className={`fw-disease-badge ${getSeverityBadgeClass(severity)}`}>
                                                {t[severity] || severity}
                                            </span>
                                        )}
                                        {isZoonotic && (
                                            <span className="fw-disease-badge fw-badge-zoonotic">
                                                <svg viewBox="0 0 24 24" style={{ width: 9, height: 9 }}>
                                                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                                                    <line x1="12" y1="9" x2="12" y2="13"/>
                                                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                                                </svg>
                                                {t.zoonotic?.replace('⚠️ ', '') || 'Zoonotic'}
                                            </span>
                                        )}
                                    </div>
                                    {desc && (
                                        <div className="fw-disease-card-desc">
                                            {desc.length > 80 ? desc.substring(0, 80) + '...' : desc}
                                        </div>
                                    )}
                                    {affects && (
                                        <div className="fw-disease-card-affects">
                                            <strong>{t.affects}:</strong> {Array.isArray(affects) ? affects.join(', ') : affects}
                                        </div>
                                    )}
                                    <div className="fw-disease-card-link">{t.viewDetails} →</div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Bottom nav */}
                <div className="fw-mod-bnav">
                    <button className="fw-mod-bnav-home" onClick={() => navigate('/')}>
                        <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                        <span>Home</span>
                    </button>
                    <button
                        className="fw-mod-bnav-alerts"
                        onClick={() => navigate('/poultry/diagnostic')}
                    >
                        <DiagnosticToolsIcon />
                        <span>Diagnostic</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AllDiseases;
