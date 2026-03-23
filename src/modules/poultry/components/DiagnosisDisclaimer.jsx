import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

const DiagnosisDisclaimer = () => {
  const { language } = useLanguage();

  const disclaimerText = {
    title: {
      en: "Important Notice",
      id: "Pemberitahuan Penting",
      vi: "Thông báo Quan trọng"
    },
    content: {
      en: "This tool helps identify possible health problems in livestock. It does not provide a diagnosis and does not replace veterinary advice. Different diseases may show similar symptoms, and only a qualified veterinarian can properly examine the animals and confirm the correct diagnosis. The results provided by this tool are for guidance only. If animals show signs of illness, consult a veterinarian promptly.",
      id: "Alat ini membantu mengidentifikasi kemungkinan masalah kesehatan pada ternak. Alat ini tidak memberikan diagnosis dan tidak menggantikan saran dokter hewan. Penyakit yang berbeda dapat menunjukkan gejala yang serupa, dan hanya dokter hewan yang berkualifikasi yang dapat memeriksa hewan dengan benar dan memastikan diagnosis yang tepat. Hasil yang diberikan oleh alat ini hanya untuk panduan. Jika hewan menunjukkan tanda-tanda penyakit, segera konsultasikan dengan dokter hewan.",
      vi: "Công cụ này giúp xác định các vấn đề sức khỏe có thể xảy ra ở vật nuôi. Công cụ này không cung cấp chẩn đoán và không thay thế lời khuyên của bác sĩ thú y. Các bệnh khác nhau có thể có triệu chứng tương tự và chỉ bác sĩ thú y có chuyên môn mới có thể kiểm tra động vật đúng cách và xác nhận chẩn đoán chính xác. Kết quả do công cụ này cung cấp chỉ mang tính chất hướng dẫn. Nếu vật nuôi có dấu hiệu bệnh, hãy tham khảo ý kiến bác sĩ thú y kịp thời."
    }
  };

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg 
            className="h-5 w-5 text-yellow-400" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            {disclaimerText.title[language]}
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>{disclaimerText.content[language]}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisDisclaimer;
