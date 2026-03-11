import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { calculateSymptomOverlap } from '../utils/diseaseComparison';
import { 
  ComparisonSection, 
  ComparisonListSection, 
  SymptomOverlapSection, 
  KeyDifferences 
} from '../components/comparison/ComparisonHelpers';

const DiseaseComparison = () => {
  const { language } = useLanguage();
  
  const [allDiseases, setAllDiseases] = useState([]);
  const [selectedDisease1, setSelectedDisease1] = useState(null);
  const [selectedDisease2, setSelectedDisease2] = useState(null);
  
  const [search1, setSearch1] = useState('');
  const [categoryFilter1, setCategoryFilter1] = useState([]);
  const [severityFilter1, setSeverityFilter1] = useState([]);
  
  const [search2, setSearch2] = useState('');
  const [categoryFilter2, setCategoryFilter2] = useState([]);
  const [severityFilter2, setSeverityFilter2] = useState([]);
  
  useEffect(() => {
    const loadDiseases = async () => {
      try {
        const langCode = language === 'id' ? 'id' : language === 'vn' ? 'vn' : 'en';
        const response = await fetch(`/data/poultry/diseases_COMPLETE_129_v4.1_ENRICHED_${langCode}.json`);
        const data = await response.json();
        setAllDiseases(data.diseases || data.penyakit || []);
      } catch (err) {
        console.error('Error loading diseases:', err);
      }
    };
    
    loadDiseases();
  }, [language]);
  
  const filteredDiseases1 = allDiseases.filter(disease => {
    const diseaseName = disease.name || disease.nama || '';
    const diseaseCategory = disease.category || disease.kategori || '';
    const diseaseSeverity = disease.severity || disease.tingkat_keparahan || '';
    
    const matchesSearch = diseaseName.toLowerCase().includes(search1.toLowerCase());
    const matchesCategory = categoryFilter1.length === 0 || categoryFilter1.includes(diseaseCategory);
    const matchesSeverity = severityFilter1.length === 0 || severityFilter1.includes(diseaseSeverity);
    
    return matchesSearch && matchesCategory && matchesSeverity;
  });
  
  const filteredDiseases2 = allDiseases.filter(disease => {
    const diseaseName = disease.name || disease.nama || '';
    const diseaseCategory = disease.category || disease.kategori || '';
    const diseaseSeverity = disease.severity || disease.tingkat_keparahan || '';
    
    const matchesSearch = diseaseName.toLowerCase().includes(search2.toLowerCase());
    const matchesCategory = categoryFilter2.length === 0 || categoryFilter2.includes(diseaseCategory);
    const matchesSeverity = severityFilter2.length === 0 || severityFilter2.includes(diseaseSeverity);
    
    return matchesSearch && matchesCategory && matchesSeverity;
  });
  
  const translations = {
    en: {
      title: 'Comparing Diseases',
      subtitle: 'Select two diseases to compare their characteristics, symptoms, and treatments',
      disease1: 'Disease 1',
      disease2: 'Disease 2',
      searchPlaceholder: 'Search by name...',
      searchLabel: 'Search Disease',
      categoryLabel: 'Category',
      severityLabel: 'Severity',
      selectDisease: 'Select Disease',
      results: 'results',
      noDiseasesFound: 'No diseases found',
      adjustFilters: 'Try adjusting your filters',
      selectTwoMessage: 'Select two diseases above to see detailed comparison',
      viral: 'Viral',
      bacterial: 'Bacterial',
      parasitic: 'Parasitic',
      fungal: 'Fungal',
      nutritional: 'Nutritional',
      other: 'Other',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      zoonotic: 'Zoonotic',
      basicInfo: 'Basic Information',
      description: 'Description',
      symptomOverlap: 'Symptom Overlap Analysis',
      commonSymptoms: 'Common Symptoms',
      uniqueTo: 'Unique to',
      clinicalSigns: 'Clinical Signs',
      transmission: 'Transmission',
      diagnosis: 'Diagnosis',
      treatment: 'Treatment',
      prevention: 'Prevention & Control',
      keyDifferences: 'Key Differences',
      category: 'Category',
      severity: 'Severity',
      affectedAges: 'Affected Ages',
      yes: 'Yes',
      no: 'No',
      allAges: 'All ages',
      noInfo: 'No information available',
      more: 'more',
      cause: 'Cause',
      zoonoticRisk: 'Zoonotic Risk',
      canInfectHumans: 'can infect humans, requiring PPE when handling affected birds',
      is: 'is',
      while: 'while'
    },
    id: {
      title: 'Membandingkan Penyakit',
      subtitle: 'Pilih dua penyakit untuk membandingkan karakteristik, gejala, dan pengobatannya',
      disease1: 'Penyakit 1',
      disease2: 'Penyakit 2',
      searchPlaceholder: 'Cari berdasarkan nama...',
      searchLabel: 'Cari Penyakit',
      categoryLabel: 'Kategori',
      severityLabel: 'Tingkat Keparahan',
      selectDisease: 'Pilih Penyakit',
      results: 'hasil',
      noDiseasesFound: 'Tidak ada penyakit ditemukan',
      adjustFilters: 'Coba sesuaikan filter Anda',
      selectTwoMessage: 'Pilih dua penyakit di atas untuk melihat perbandingan detail',
      viral: 'Viral',
      bacterial: 'Bakteri',
      parasitic: 'Parasit',
      fungal: 'Jamur',
      nutritional: 'Nutrisi',
      other: 'Lainnya',
      high: 'Tinggi',
      medium: 'Sedang',
      low: 'Rendah',
      zoonotic: 'Zoonosis',
      basicInfo: 'Informasi Dasar',
      description: 'Deskripsi',
      symptomOverlap: 'Analisis Tumpang Tindih Gejala',
      commonSymptoms: 'Gejala Umum',
      uniqueTo: 'Unik untuk',
      clinicalSigns: 'Tanda Klinis',
      transmission: 'Penularan',
      diagnosis: 'Diagnosis',
      treatment: 'Pengobatan',
      prevention: 'Pencegahan & Kontrol',
      keyDifferences: 'Perbedaan Utama',
      category: 'Kategori',
      severity: 'Tingkat Keparahan',
      affectedAges: 'Umur yang Terpengaruh',
      yes: 'Ya',
      no: 'Tidak',
      allAges: 'Semua umur',
      noInfo: 'Tidak ada informasi tersedia',
      more: 'lagi',
      cause: 'Penyebab',
      zoonoticRisk: 'Risiko Zoonosis',
      canInfectHumans: 'dapat menginfeksi manusia, memerlukan APD saat menangani unggas yang terinfeksi',
      is: 'adalah',
      while: 'sedangkan'
    },
    vn: {
      title: 'So sánh Bệnh',
      subtitle: 'Chọn hai bệnh để so sánh đặc điểm, triệu chứng và phương pháp điều trị',
      disease1: 'Bệnh 1',
      disease2: 'Bệnh 2',
      searchPlaceholder: 'Tìm kiếm theo tên...',
      searchLabel: 'Tìm kiếm Bệnh',
      categoryLabel: 'Danh mục',
      severityLabel: 'Mức độ nghiêm trọng',
      selectDisease: 'Chọn Bệnh',
      results: 'kết quả',
      noDiseasesFound: 'Không tìm thấy bệnh',
      adjustFilters: 'Thử điều chỉnh bộ lọc của bạn',
      selectTwoMessage: 'Chọn hai bệnh ở trên để xem so sánh chi tiết',
      viral: 'Vi-rút',
      bacterial: 'Vi khuẩn',
      parasitic: 'Ký sinh trùng',
      fungal: 'Nấm',
      nutritional: 'Dinh dưỡng',
      other: 'Khác',
      high: 'Cao',
      medium: 'Trung bình',
      low: 'Thấp',
      zoonotic: 'Lây nhiễm người',
      basicInfo: 'Thông tin cơ bản',
      description: 'Mô tả',
      symptomOverlap: 'Phân tích Triệu chứng Chồng chéo',
      commonSymptoms: 'Triệu chứng Chung',
      uniqueTo: 'Đặc trưng cho',
      clinicalSigns: 'Dấu hiệu Lâm sàng',
      transmission: 'Lây truyền',
      diagnosis: 'Chẩn đoán',
      treatment: 'Điều trị',
      prevention: 'Phòng ngừa & Kiểm soát',
      keyDifferences: 'Sự khác biệt Chính',
      category: 'Danh mục',
      severity: 'Mức độ nghiêm trọng',
      affectedAges: 'Độ tuổi bị ảnh hưởng',
      yes: 'Có',
      no: 'Không',
      allAges: 'Mọi lứa tuổi',
      noInfo: 'Không có thông tin',
      more: 'nữa',
      cause: 'Nguyên nhân',
      zoonoticRisk: 'Nguy cơ Lây nhiễm',
      canInfectHumans: 'có thể lây nhiễm cho người, cần thiết bị bảo hộ khi xử lý gia cầm bị nhiễm',
      is: 'là',
      while: 'trong khi'
    }
  };
  
  const t = translations[language] || translations.en;
  
  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1F2937', marginBottom: '0.5rem' }}>
          🔍 {t.title}
        </h1>
        <p style={{ color: '#6B7280' }}>
          {t.subtitle}
        </p>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: window.innerWidth >= 1024 ? '1fr 1fr' : '1fr',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <DiseaseSelectionBox
          title={t.disease1}
          search={search1}
          onSearchChange={setSearch1}
          categoryFilter={categoryFilter1}
          onCategoryFilterChange={setCategoryFilter1}
          severityFilter={severityFilter1}
          onSeverityFilterChange={setSeverityFilter1}
          filteredDiseases={filteredDiseases1}
          selectedDisease={selectedDisease1}
          onSelectDisease={setSelectedDisease1}
          translations={t}
        />
        
        <DiseaseSelectionBox
          title={t.disease2}
          search={search2}
          onSearchChange={setSearch2}
          categoryFilter={categoryFilter2}
          onCategoryFilterChange={setCategoryFilter2}
          severityFilter={severityFilter2}
          onSeverityFilterChange={setSeverityFilter2}
          filteredDiseases={filteredDiseases2}
          selectedDisease={selectedDisease2}
          onSelectDisease={setSelectedDisease2}
          translations={t}
        />
      </div>
      
      {selectedDisease1 && selectedDisease2 ? (
        <ComparisonDisplay 
          disease1={selectedDisease1} 
          disease2={selectedDisease2}
          translations={t}
        />
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          background: '#F9FAFB', 
          borderRadius: '0.5rem' 
        }}>
          <p style={{ color: '#6B7280' }}>
            👆 {t.selectTwoMessage}
          </p>
        </div>
      )}
    </div>
  );
};

const DiseaseSelectionBox = ({
  title,
  search,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  severityFilter,
  onSeverityFilterChange,
  filteredDiseases,
  selectedDisease,
  onSelectDisease,
  translations: t
}) => {
  const categories = [
    { id: 'Viral', label: t.viral },
    { id: 'Bacterial', label: t.bacterial },
    { id: 'Parasitic', label: t.parasitic },
    { id: 'Fungal', label: t.fungal },
    { id: 'Nutritional', label: t.nutritional },
    { id: 'Other', label: t.other }
  ];
  
  const severities = [
    { id: 'High', label: t.high },
    { id: 'Medium', label: t.medium },
    { id: 'Low', label: t.low }
  ];
  
  const toggleFilter = (filterArray, setFilter, value) => {
    if (filterArray.includes(value)) {
      setFilter(filterArray.filter(v => v !== value));
    } else {
      setFilter([...filterArray, value]);
    }
  };
  
  return (
    <div style={{ 
      background: 'white', 
      borderRadius: '0.5rem', 
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      padding: '1.5rem'
    }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1F2937', marginBottom: '1rem' }}>
        {title}
      </h2>
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
          🔍 {t.searchLabel}
        </label>
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem 1rem',
            border: '1px solid #D1D5DB',
            borderRadius: '0.5rem',
            fontSize: '0.875rem'
          }}
        />
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
          📁 {t.categoryLabel}
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {categories.map(category => (
            <label key={category.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={categoryFilter.includes(category.id)}
                onChange={() => toggleFilter(categoryFilter, onCategoryFilterChange, category.id)}
                style={{ width: '1rem', height: '1rem' }}
              />
              <span style={{ fontSize: '0.875rem', color: '#374151' }}>{category.label}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
          ⚡ {t.severityLabel}
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {severities.map(severity => (
            <label key={severity.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={severityFilter.includes(severity.id)}
                onChange={() => toggleFilter(severityFilter, onSeverityFilterChange, severity.id)}
                style={{ width: '1rem', height: '1rem' }}
              />
              <span style={{ fontSize: '0.875rem', color: '#374151' }}>{severity.label}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '1rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.75rem' }}>
          📋 {t.selectDisease} ({filteredDiseases.length} {t.results})
        </label>
        <div style={{ maxHeight: '24rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {filteredDiseases.length > 0 ? (
            filteredDiseases.map(disease => {
              const diseaseName = disease.name || disease.nama || '';
              const diseaseCategory = disease.category || disease.kategori || '';
              const diseaseSeverity = disease.severity || disease.tingkat_keparahan || '';
              const diseaseZoonotic = disease.zoonotic || disease.zoonosis || false;
              
              return (
                <div
                  key={disease.id}
                  onClick={() => onSelectDisease(disease)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: selectedDisease?.id === disease.id ? '2px solid #10B981' : '1px solid #E5E7EB',
                    background: selectedDisease?.id === disease.id ? '#D1FAE5' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontWeight: '600', color: '#1F2937', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                        {diseaseName}
                      </h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                        <span style={{
                          fontSize: '0.75rem',
                          padding: '0.125rem 0.5rem',
                          borderRadius: '0.25rem',
                          background: diseaseCategory === 'Viral' ? '#EDE9FE' : 
                                     diseaseCategory === 'Bacterial' ? '#DBEAFE' :
                                     diseaseCategory === 'Parasitic' ? '#D1FAE5' : '#F3F4F6',
                          color: diseaseCategory === 'Viral' ? '#5B21B6' :
                                diseaseCategory === 'Bacterial' ? '#1E40AF' :
                                diseaseCategory === 'Parasitic' ? '#065F46' : '#374151'
                        }}>
                          {diseaseCategory}
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          padding: '0.125rem 0.5rem',
                          borderRadius: '0.25rem',
                          background: diseaseSeverity === 'High' ? '#FEE2E2' :
                                     diseaseSeverity === 'Medium' ? '#FEF3C7' : '#D1FAE5',
                          color: diseaseSeverity === 'High' ? '#991B1B' :
                                diseaseSeverity === 'Medium' ? '#92400E' : '#065F46'
                        }}>
                          {diseaseSeverity}
                        </span>
                        {diseaseZoonotic && (
                          <span style={{
                            fontSize: '0.75rem',
                            padding: '0.125rem 0.5rem',
                            borderRadius: '0.25rem',
                            background: '#FED7AA',
                            color: '#9A3412'
                          }}>
                            {t.zoonotic}
                          </span>
                        )}
                      </div>
                    </div>
                    {selectedDisease?.id === disease.id && (
                      <div style={{ marginLeft: '0.5rem' }}>
                        <span style={{ color: '#10B981', fontSize: '1.25rem' }}>✓</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6B7280' }}>
              <p style={{ fontSize: '0.875rem' }}>{t.noDiseasesFound}</p>
              <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>{t.adjustFilters}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ComparisonDisplay = ({ disease1, disease2, translations: t }) => {
  const symptomOverlap = calculateSymptomOverlap(disease1, disease2);
  
  const getName = (disease) => disease.name || disease.nama || '';
  const getCategory = (disease) => disease.category || disease.kategori || '';
  const getSeverity = (disease) => disease.severity || disease.tingkat_keparahan || '';
  const getZoonotic = (disease) => disease.zoonotic || disease.zoonosis || false;
  const getAgeGroups = (disease) => disease.ageGroups || disease.kelompok_umur || [];
  const getDescription = (disease) => disease.description || disease.deskripsi || t.noInfo;
  const getClinicalSigns = (disease) => disease.clinicalSigns || disease.tanda_klinis || [];
  const getTransmission = (disease) => disease.transmission || disease.penularan || [];
  const getDiagnosis = (disease) => disease.diagnosis || disease.diagnosis || [];
  const getTreatment = (disease) => disease.treatment || disease.pengobatan || [];
  const getControl = (disease) => disease.control || disease.pengendalian || [];
  
  return (
    <div style={{ 
      background: 'white', 
      borderRadius: '0.5rem', 
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      padding: '1.5rem'
    }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '1.5rem',
        marginBottom: '1.5rem',
        paddingBottom: '1.5rem',
        borderBottom: '1px solid #E5E7EB'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1F2937', marginBottom: '0.5rem' }}>
            {getName(disease1)}
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
            <span style={{
              fontSize: '0.75rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '0.25rem',
              background: getCategory(disease1) === 'Viral' ? '#EDE9FE' : 
                         getCategory(disease1) === 'Bacterial' ? '#DBEAFE' :
                         getCategory(disease1) === 'Parasitic' ? '#D1FAE5' : '#F3F4F6',
              color: getCategory(disease1) === 'Viral' ? '#5B21B6' :
                    getCategory(disease1) === 'Bacterial' ? '#1E40AF' :
                    getCategory(disease1) === 'Parasitic' ? '#065F46' : '#374151'
            }}>
              {getCategory(disease1)}
            </span>
            <span style={{
              fontSize: '0.75rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '0.25rem',
              background: getSeverity(disease1) === 'High' ? '#FEE2E2' :
                         getSeverity(disease1) === 'Medium' ? '#FEF3C7' : '#D1FAE5',
              color: getSeverity(disease1) === 'High' ? '#991B1B' :
                    getSeverity(disease1) === 'Medium' ? '#92400E' : '#065F46'
            }}>
              {getSeverity(disease1)}
            </span>
          </div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1F2937', marginBottom: '0.5rem' }}>
            {getName(disease2)}
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
            <span style={{
              fontSize: '0.75rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '0.25rem',
              background: getCategory(disease2) === 'Viral' ? '#EDE9FE' : 
                         getCategory(disease2) === 'Bacterial' ? '#DBEAFE' :
                         getCategory(disease2) === 'Parasitic' ? '#D1FAE5' : '#F3F4F6',
              color: getCategory(disease2) === 'Viral' ? '#5B21B6' :
                    getCategory(disease2) === 'Bacterial' ? '#1E40AF' :
                    getCategory(disease2) === 'Parasitic' ? '#065F46' : '#374151'
            }}>
              {getCategory(disease2)}
            </span>
            <span style={{
              fontSize: '0.75rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '0.25rem',
              background: getSeverity(disease2) === 'High' ? '#FEE2E2' :
                         getSeverity(disease2) === 'Medium' ? '#FEF3C7' : '#D1FAE5',
              color: getSeverity(disease2) === 'High' ? '#991B1B' :
                    getSeverity(disease2) === 'Medium' ? '#92400E' : '#065F46'
            }}>
              {getSeverity(disease2)}
            </span>
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <ComparisonSection
          title={`📋 ${t.basicInfo}`}
          data1={{
            [t.category]: getCategory(disease1),
            [t.severity]: getSeverity(disease1),
            [t.zoonotic]: getZoonotic(disease1) ? t.yes : t.no,
            [t.affectedAges]: getAgeGroups(disease1).join(', ') || t.allAges
          }}
          data2={{
            [t.category]: getCategory(disease2),
            [t.severity]: getSeverity(disease2),
            [t.zoonotic]: getZoonotic(disease2) ? t.yes : t.no,
            [t.affectedAges]: getAgeGroups(disease2).join(', ') || t.allAges
          }}
        />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>
              📝 {t.description}
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#4B5563' }}>
              {getDescription(disease1)}
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>
              📝 {t.description}
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#4B5563' }}>
              {getDescription(disease2)}
            </p>
          </div>
        </div>
        
        <SymptomOverlapSection 
          disease1={disease1}
          disease2={disease2}
          overlap={symptomOverlap}
          translations={t}
        />
        
        <ComparisonListSection
          title={`🩺 ${t.clinicalSigns}`}
          list1={getClinicalSigns(disease1)}
          list2={getClinicalSigns(disease2)}
          translations={t}
        />
        
        <ComparisonListSection
          title={`🦠 ${t.transmission}`}
          list1={getTransmission(disease1)}
          list2={getTransmission(disease2)}
          translations={t}
        />
        
        <ComparisonListSection
          title={`🔬 ${t.diagnosis}`}
          list1={getDiagnosis(disease1)}
          list2={getDiagnosis(disease2)}
          translations={t}
        />
        
        <ComparisonListSection
          title={`💊 ${t.treatment}`}
          list1={getTreatment(disease1)}
          list2={getTreatment(disease2)}
          translations={t}
        />
        
        <ComparisonListSection
          title={`🛡️ ${t.prevention}`}
          list1={getControl(disease1)}
          list2={getControl(disease2)}
          translations={t}
        />
        
        <KeyDifferences 
          disease1={disease1} 
          disease2={disease2}
          translations={t}
        />
      </div>
    </div>
  );
};

export default DiseaseComparison;
