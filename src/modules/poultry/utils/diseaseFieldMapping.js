/**
 * Disease Field Mapping Utility
 * Handles field name differences between language versions
 */

// Field name mapping for different languages
export const FIELD_MAP = {
  en: {
    description: 'description',
    clinicalSigns: 'clinicalSigns',
    transmission: 'transmission',
    diagnosis: 'diagnosis',
    treatment: 'treatment',
    control: 'control',
    vaccineRecommendations: 'vaccineRecommendations'
  },
  id: {
    description: 'deskripsi',
    clinicalSigns: 'tanda_klinis',
    transmission: 'penularan',
    diagnosis: 'diagnosis',
    treatment: 'pengobatan',
    control: 'pengendalian',
    vaccineRecommendations: 'rekomendasi_vaksin'
  },
  vi: {
    description: 'description',
    clinicalSigns: 'clinicalSigns',
    transmission: 'transmission',
    diagnosis: 'diagnosis',
    treatment: 'treatment',
    control: 'control',
    vaccineRecommendations: 'vaccineRecommendations'
  }
};

/**
 * Get field value from disease object based on language
 * @param {Object} disease - Disease object
 * @param {string} field - Field name (English version)
 * @param {string} language - Language code (en/id/vi)
 * @returns {any} Field value
 */
export const getFieldValue = (disease, field, language = 'en') => {
  if (!disease) return null;
  
  const mappedField = FIELD_MAP[language]?.[field] || field;
  return disease[mappedField];
};

/**
 * Get severity color classes based on severity level
 * @param {string} severity - Severity level
 * @returns {string} Tailwind CSS classes
 */
export const getSeverityColor = (severity) => {
  const severityLower = severity?.toLowerCase() || '';
  
  if (severityLower.includes('high') || severityLower === 'tinggi' || severityLower === 'cao') {
    return 'bg-red-100 text-red-800 border-red-300';
  }
  if (severityLower.includes('medium') || severityLower === 'sedang' || severityLower === 'trung bình') {
    return 'bg-yellow-100 text-yellow-800 border-yellow-300';
  }
  if (severityLower.includes('low') || severityLower === 'rendah' || severityLower === 'thấp') {
    return 'bg-green-100 text-green-800 border-green-300';
  }
  
  return 'bg-gray-100 text-gray-800 border-gray-300';
};

/**
 * Get category badge class
 * @param {string} category - Disease category
 * @returns {string} CSS class name
 */
export const getCategoryClass = (category) => {
  const lower = category?.toLowerCase() || '';
  if (lower.includes('bacterial') || lower.includes('bakteri')) return 'badge-bacterial';
  if (lower.includes('viral') || lower.includes('virus')) return 'badge-viral';
  if (lower.includes('parasitic') || lower.includes('parasit')) return 'badge-parasitic';
  if (lower.includes('nutritional') || lower.includes('nutrisi')) return 'badge-nutritional';
  if (lower.includes('toxicosis') || lower.includes('toksik')) return 'badge-toxicosis';
  if (lower.includes('fungal') || lower.includes('jamur')) return 'badge-fungal';
  return 'badge-other';
};

/**
 * Get UI labels based on language
 * @param {string} language - Language code
 * @returns {Object} UI labels
 */
export const getUILabels = (language = 'en') => {
  // Normalize Vietnamese language code (handle legacy 'vt' and 'vn' codes)
  const normalizedLang = (language === 'vt' || language === 'vn') ? 'vi' : language;
  
  const labels = {
    en: {
      backToResults: 'Back to Results',
      zoonoticHazard: 'Zoonotic Disease Hazard',
      zoonoticWarning: 'This disease can be transmitted from animals to humans. Take appropriate biosecurity precautions.',
      description: 'Description',
      clinicalSigns: 'Clinical Signs',
      matchedSymptoms: 'Matched Symptoms',
      otherSymptoms: 'Other Symptoms',
      transmission: 'Transmission',
      diagnosis: 'Diagnosis Methods',
      treatment: 'Treatment Options',
      control: 'Control & Prevention',
      vaccineRecommendations: 'Vaccine Recommendations',
      vaccineComingSoon: 'Vaccine information will be updated soon. Please consult with a licensed veterinarian for current vaccination protocols and product availability in your region.',
      severity: 'Severity',
      severityHigh: 'High Severity',
      severityMedium: 'Medium Severity',
      severityLow: 'Low Severity',
      zoonoticBadge: '⚠️ Zoonotic',
      category: 'Category',
      ageGroups: 'Age Groups',
      confidenceMatch: 'Confidence Match',
      symptomsMatched: 'symptoms matched',
      newDiagnosis: 'New Diagnosis',
      allDiseases: 'All Poultry Diseases & Conditions',
      print: 'Print'
    },
    id: {
      backToResults: 'Kembali ke Hasil',
      zoonoticHazard: 'Bahaya Penyakit Zoonosis',
      zoonoticWarning: 'Penyakit ini dapat menular dari hewan ke manusia. Ambil tindakan pencegahan biosekuriti yang tepat.',
      description: 'Deskripsi',
      clinicalSigns: 'Tanda Klinis',
      matchedSymptoms: 'Gejala yang Cocok',
      otherSymptoms: 'Gejala Lainnya',
      transmission: 'Penularan',
      diagnosis: 'Metode Diagnosis',
      treatment: 'Opsi Pengobatan',
      control: 'Pengendalian & Pencegahan',
      vaccineRecommendations: 'Rekomendasi Vaksin',
      vaccineComingSoon: 'Informasi vaksin akan segera diperbarui. Silakan konsultasi dengan dokter hewan berlisensi untuk protokol vaksinasi terkini dan ketersediaan produk di wilayah Anda.',
      severity: 'Tingkat Keparahan',
      severityHigh: 'Parah Tinggi',
      severityMedium: 'Parah Sedang',
      severityLow: 'Parah Rendah',
      zoonoticBadge: '⚠️ Zoonosis',
      category: 'Kategori',
      ageGroups: 'Kelompok Umur',
      confidenceMatch: 'Kecocokan Diagnosis',
      symptomsMatched: 'gejala cocok',
      newDiagnosis: 'Diagnosis Baru',
      allDiseases: 'Semua Penyakit & Kondisi Unggas',
      print: 'Cetak'
    },
    vi: {
      backToResults: 'Quay lại Kết quả',
      zoonoticHazard: 'Nguy cơ bệnh lây từ động vật',
      zoonoticWarning: 'Bệnh này có thể lây từ động vật sang người. Thực hiện các biện pháp an toàn sinh học thích hợp.',
      description: 'Mô tả',
      clinicalSigns: 'Dấu hiệu lâm sàng',
      matchedSymptoms: 'Triệu chứng phù hợp',
      otherSymptoms: 'Triệu chứng khác',
      transmission: 'Lây truyền',
      diagnosis: 'Phương pháp chẩn đoán',
      treatment: 'Tùy chọn điều trị',
      control: 'Kiểm soát & Phòng ngừa',
      vaccineRecommendations: 'Khuyến nghị Vắc-xin',
      vaccineComingSoon: 'Thông tin vắc-xin sẽ được cập nhật sớm. Vui lòng tham khảo ý kiến bác sĩ thú y có giấy phép về các quy trình tiêm chủng hiện tại và tính sẵn có của sản phẩm trong khu vực của bạn.',
      severity: 'Mức độ nghiêm trọng',
      severityHigh: 'Nghiêm Trọng Cao',
      severityMedium: 'Nghiêm Trọng Trung Bình',
      severityLow: 'Nghiêm Trọng Thấp',
      zoonoticBadge: '⚠️ Bệnh Lây Từ Động Vật',
      category: 'Danh mục',
      ageGroups: 'Nhóm tuổi',
      confidenceMatch: 'Độ Khớp Chẩn Đoán',
      symptomsMatched: 'triệu chứng khớp',
      newDiagnosis: 'Chẩn đoán mới',
      allDiseases: 'Tất Cả Bệnh & Tình Trạng Gia Cầm',
      print: 'In'
    }
  };
  
  return labels[normalizedLang] || labels.en;
};
