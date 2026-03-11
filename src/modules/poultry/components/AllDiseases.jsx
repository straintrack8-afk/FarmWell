import React, { useState, useMemo } from 'react';
import { useDiagnosis } from '../contexts/DiagnosisContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { STEPS } from '../utils/constants';
import { getSeverityColor, getCategoryClass } from '../utils/diseaseFieldMapping';

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
  vn: {
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
    const { diseases, setStep, viewDiseaseDetail } = useDiagnosis();
    const { language } = useLanguage();
    const normalizedLang = language === 'vt' ? 'vn' : language;
    const t = translations[normalizedLang] || translations.en;
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(t.all);
    const [selectedSeverity, setSelectedSeverity] = useState(t.all);
    
    // Update filter values when language changes
    React.useEffect(() => {
        setSelectedCategory(t.all);
        setSelectedSeverity(t.all);
    }, [t.all]);

    // Get unique categories and severities
    const categories = useMemo(() => {
        const cats = new Set(diseases.map(d => d.category || d.kategori).filter(Boolean));
        return [t.all, ...Array.from(cats).sort()];
    }, [diseases, t.all]);

    const severities = useMemo(() => {
        const sevs = new Set(diseases.map(d => d.severity || d.tingkat_keparahan).filter(Boolean));
        return [t.all, ...Array.from(sevs).sort()];
    }, [diseases, t.all]);

    // Filter diseases
    const filteredDiseases = useMemo(() => {
        return diseases.filter(disease => {
            const diseaseName = disease.name || disease.nama || disease.ten_benh || '';
            const diseaseCategory = disease.category || disease.kategori;
            const diseaseSeverity = disease.severity || disease.tingkat_keparahan;
            
            const matchesSearch = !searchQuery || 
                diseaseName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === t.all || diseaseCategory === selectedCategory;
            const matchesSeverity = selectedSeverity === t.all || diseaseSeverity === selectedSeverity;
            
            return matchesSearch && matchesCategory && matchesSeverity;
        });
    }, [diseases, searchQuery, selectedCategory, selectedSeverity, t.all]);

    const handleDiseaseClick = (disease) => {
        viewDiseaseDetail(disease);
        setStep(STEPS.DETAIL);
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: 'var(--bg-primary)',
            paddingBottom: '2rem'
        }}>
            <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1rem' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: '800',
                        marginBottom: '0.5rem',
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        {t.pageTitle}
                    </h1>
                    <p style={{ fontSize: '1rem', color: '#6B7280' }}>
                        {t.browseText.replace('{count}', diseases.length)}
                    </p>
                </div>

                {/* Filters */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginBottom: '1.5rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                        {/* Search */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                                {t.searchLabel}
                            </label>
                            <input
                                type="text"
                                placeholder={t.searchPlaceholder}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '2px solid #E5E7EB',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#10B981'}
                                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                            />
                        </div>

                        {/* Category Filter */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                                {t.categoryLabel}
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '2px solid #E5E7EB',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    background: 'white'
                                }}
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{t[cat] || cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Severity Filter */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                                {t.severityLabel}
                            </label>
                            <select
                                value={selectedSeverity}
                                onChange={(e) => setSelectedSeverity(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '2px solid #E5E7EB',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    background: 'white'
                                }}
                            >
                                {severities.map(sev => (
                                    <option key={sev} value={sev}>{t[sev] || sev}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Results count */}
                    <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6B7280' }}>
                        {t.showing} <strong>{filteredDiseases.length}</strong> {t.of} {diseases.length} {t.diseases}
                    </div>
                </div>

                {/* Disease Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '1rem'
                }}>
                    {filteredDiseases.map(disease => (
                        <div
                            key={disease.id}
                            onClick={() => handleDiseaseClick(disease)}
                            style={{
                                background: 'white',
                                borderRadius: '12px',
                                padding: '1.25rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                border: '2px solid transparent'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 8px 16px rgba(16, 185, 129, 0.15)';
                                e.currentTarget.style.borderColor = '#10B981';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                                e.currentTarget.style.borderColor = 'transparent';
                            }}
                        >
                            {/* Disease Name */}
                            <h3 style={{
                                fontSize: '1.125rem',
                                fontWeight: '700',
                                marginBottom: '0.75rem',
                                color: '#111827',
                                lineHeight: '1.4'
                            }}>
                                {disease.name || disease.nama || disease.ten_benh}
                            </h3>

                            {/* Badges */}
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                                {/* Category */}
                                {(disease.category || disease.kategori) && (
                                    <span className={getCategoryClass(disease.category || disease.kategori)} style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '6px',
                                        fontSize: '0.75rem',
                                        fontWeight: '600'
                                    }}>
                                        {t[disease.category || disease.kategori] || disease.category || disease.kategori}
                                    </span>
                                )}

                                {/* Severity */}
                                {(disease.severity || disease.tingkat_keparahan) && (
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '6px',
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        background: getSeverityColor(disease.severity || disease.tingkat_keparahan) + '20',
                                        color: getSeverityColor(disease.severity || disease.tingkat_keparahan)
                                    }}>
                                        {t[disease.severity || disease.tingkat_keparahan] || disease.severity || disease.tingkat_keparahan}
                                    </span>
                                )}

                                {/* Zoonotic */}
                                {(disease.zoonotic || disease.zoonosis) && (
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '6px',
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        background: '#FEE2E2',
                                        color: '#DC2626'
                                    }}>
                                        {t.zoonotic}
                                    </span>
                                )}
                            </div>

                            {/* Description preview */}
                            {(disease.description || disease.deskripsi) && (
                                <p style={{
                                    fontSize: '0.875rem',
                                    color: '#6B7280',
                                    lineHeight: '1.5',
                                    marginBottom: '0.75rem',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}>
                                    {disease.description || disease.deskripsi}
                                </p>
                            )}

                            {/* Age Groups */}
                            {(disease.ageGroups || disease.kelompok_umur) && (disease.ageGroups || disease.kelompok_umur).length > 0 && (
                                <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                                    <strong>{t.affects}:</strong> {(disease.ageGroups || disease.kelompok_umur).join(', ')}
                                </div>
                            )}

                            {/* Click to view */}
                            <div style={{
                                marginTop: '1rem',
                                paddingTop: '1rem',
                                borderTop: '1px solid #E5E7EB',
                                fontSize: '0.875rem',
                                color: '#10B981',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                {t.viewDetails} →
                            </div>
                        </div>
                    ))}
                </div>

                {/* No results */}
                {filteredDiseases.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        background: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                            {t.noResults}
                        </h3>
                        <p style={{ color: '#6B7280' }}>
                            {t.tryAdjusting}
                        </p>
                    </div>
                )}

                {/* Back Button */}
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <button
                        onClick={() => setStep(STEPS.SYMPTOMS)}
                        className="btn btn-secondary"
                        style={{
                            padding: '0.75rem 2rem',
                            fontSize: '1rem'
                        }}
                    >
                        {t.backButton}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AllDiseases;
