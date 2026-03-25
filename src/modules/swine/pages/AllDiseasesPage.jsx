import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDiagnosis } from '../contexts/DiagnosisContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { swineTranslations } from '../translations';

// Translation object for AllDiseases page
const translations = {
  en: {
    pageTitle: 'All Swine Diseases & Conditions',
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
    noResults: 'No diseases found',
    tryAdjusting: 'Try adjusting your search or filters',
    affects: 'Affects',
    zoonotic: '⚠️ Zoonotic',
    importantNotice: 'Important Notice',
    disclaimerText: 'This tool only helps recognize disease symptoms in swine. If disease signs are observed, immediately contact a veterinarian for professional consultation and diagnosis.',
    // Category translations
    Viral: 'Viral',
    Bacterial: 'Bacterial',
    Parasitic: 'Parasitic',
    Nutritional: 'Nutritional',
    Toxicosis: 'Toxicosis',
    Other: 'Other'
  },
  id: {
    pageTitle: 'Semua Penyakit & Kondisi Babi',
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
    noResults: 'Tidak ada penyakit ditemukan',
    tryAdjusting: 'Coba sesuaikan pencarian atau filter Anda',
    affects: 'Mempengaruhi',
    zoonotic: '⚠️ Zoonosis',
    importantNotice: 'Pemberitahuan Penting',
    disclaimerText: 'Alat ini hanya membantu mengenali gejala penyakit pada babi. Jika tanda-tanda penyakit diamati, segera hubungi dokter hewan untuk konsultasi dan diagnosis profesional.',
    // Category translations
    Viral: 'Viral',
    Bacterial: 'Bakteri',
    Parasitic: 'Parasit',
    Nutritional: 'Nutrisi',
    Toxicosis: 'Toksikosis',
    Other: 'Lainnya'
  },
  vi: {
    pageTitle: 'Tất Cả Bệnh & Tình Trạng Lợn',
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
    noResults: 'Không tìm thấy bệnh',
    tryAdjusting: 'Thử điều chỉnh tìm kiếm hoặc bộ lọc của bạn',
    affects: 'Ảnh hưởng',
    zoonotic: '⚠️ Lây từ động vật',
    importantNotice: 'Thông Báo Quan Trọng',
    disclaimerText: 'Công cụ này chỉ giúp nhận biết các triệu chứng bệnh ở lợn. Nếu quan sát thấy dấu hiệu bệnh, hãy liên hệ ngay với bác sĩ thú y để được tư vấn và chẩn đoán chuyên nghiệp.',
    // Category translations
    Viral: 'Virus',
    Bacterial: 'Vi khuẩn',
    Parasitic: 'Ký sinh trùng',
    Nutritional: 'Dinh dưỡng',
    Toxicosis: 'Độc chất',
    Other: 'Khác'
  }
};

// Helper functions
function getCategoryClass(category) {
    const lower = category?.toLowerCase() || '';
    if (lower.includes('viral')) return 'badge-viral';
    if (lower.includes('bacterial')) return 'badge-bacterial';
    if (lower.includes('parasitic')) return 'badge-parasitic';
    if (lower.includes('nutritional')) return 'badge-nutritional';
    if (lower.includes('toxicosis')) return 'badge-toxicosis';
    return 'badge-other';
}

function getSeverityColor(severity) {
    const lower = severity?.toLowerCase() || '';
    if (lower.includes('high') || lower.includes('tinggi') || lower.includes('cao')) return '#DC2626';
    if (lower.includes('moderate') || lower.includes('medium') || lower.includes('sedang') || lower.includes('trung bình')) return '#F59E0B';
    if (lower.includes('low') || lower.includes('rendah') || lower.includes('thấp')) return '#10B981';
    return '#6B7280';
}

function AllDiseasesPage() {
    const navigate = useNavigate();
    const { diseases } = useDiagnosis();
    const { language } = useLanguage();
    const t = translations[language] || translations.en;
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(t.all);
    const [selectedSeverity, setSelectedSeverity] = useState(t.all);
    
    // Update filter values when language changes
    useEffect(() => {
        setSelectedCategory(t.all);
        setSelectedSeverity(t.all);
    }, [t.all]);

    // Get unique categories and severities
    const categories = useMemo(() => {
        const cats = new Set(diseases.map(d => d.category).filter(Boolean));
        return [t.all, ...Array.from(cats).sort()];
    }, [diseases, t.all]);

    const severities = useMemo(() => {
        const sevs = new Set(diseases.map(d => d.mortalityLevel).filter(Boolean));
        return [t.all, ...Array.from(sevs).sort()];
    }, [diseases, t.all]);

    // Filter diseases
    const filteredDiseases = useMemo(() => {
        return diseases.filter(disease => {
            const diseaseName = disease.name || '';
            const diseaseCategory = disease.category;
            const diseaseSeverity = disease.mortalityLevel;
            
            const matchesSearch = !searchQuery || 
                diseaseName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === t.all || diseaseCategory === selectedCategory;
            const matchesSeverity = selectedSeverity === t.all || diseaseSeverity === selectedSeverity;
            
            return matchesSearch && matchesCategory && matchesSeverity;
        });
    }, [diseases, searchQuery, selectedCategory, selectedSeverity, t.all]);

    const handleDiseaseClick = (disease) => {
        navigate(`/swine/diagnosis/disease/${disease.id}`);
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
                                    <option key={sev} value={sev}>{sev}</option>
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
                {filteredDiseases.length > 0 ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '1.5rem',
                        padding: '1.5rem',
                        border: '3px solid #10B981',
                        borderRadius: '12px',
                        background: '#F0FDF4'
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
                                    border: '2px solid #10B981'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(16, 185, 129, 0.15)';
                                    e.currentTarget.style.borderColor = '#10B981';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                                    e.currentTarget.style.borderColor = '#10B981';
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
                                    {disease.name}
                                </h3>

                                {/* Badges */}
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                                    {/* Category */}
                                    {disease.category && (
                                        <span className={getCategoryClass(disease.category)} style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '6px',
                                            fontSize: '0.75rem',
                                            fontWeight: '600'
                                        }}>
                                            {t[disease.category] || disease.category}
                                        </span>
                                    )}

                                    {/* Severity */}
                                    {disease.mortalityLevel && (
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '6px',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            background: getSeverityColor(disease.mortalityLevel) + '20',
                                            color: getSeverityColor(disease.mortalityLevel)
                                        }}>
                                            {disease.mortalityLevel}
                                        </span>
                                    )}

                                    {/* Zoonotic */}
                                    {disease.zoonoticRisk && (
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
                                {disease.description && (
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
                                        {disease.description}
                                    </p>
                                )}

                                {/* Age Groups */}
                                {disease.ageGroups && disease.ageGroups.length > 0 && (
                                    <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                                        <strong>{t.affects}:</strong> {disease.ageGroups.join(', ')}
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
                ) : (
                    /* No results */
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
            </div>
        </div>
    );
}

export default AllDiseasesPage;
