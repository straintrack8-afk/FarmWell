export const DISEASE_DIAGNOSIS_DISCLAIMERS = {
  en: {
    title: "Important Notice",
    shortText: "Important Notice: This tool helps identify possible health problems in livestock. It does not provide a diagnosis and does not replace veterinary advice. Different diseases may show similar symptoms, and only a qualified veterinarian can properly examine the animals and confirm the correct diagnosis. The results provided by this tool are for guidance only. If animals show signs of illness, consult a veterinarian promptly.",
    fullText: "Important Notice: This tool helps identify possible health problems in livestock. It does not provide a diagnosis and does not replace veterinary advice. Different diseases may show similar symptoms, and only a qualified veterinarian can properly examine the animals and confirm the correct diagnosis. The results provided by this tool are for guidance only. If animals show signs of illness, consult a veterinarian promptly.",
    checkboxLabel: "I understand and agree to this disclaimer",
    continueButton: "Continue to Tool",
    nextSteps: "Next Steps",
    recommendedActions: [
      "Contact veterinarian immediately",
      "Do not administer medication without professional consultation",
      "Isolate affected animals",
      "Document all symptoms and changes",
      "Prepare animal health history and vaccination records"
    ],
    contactVet: "Contact Veterinarian",
    saveReport: "Save Report"
  },
  id: {
    title: "Pemberitahuan Penting",
    shortText: "Pemberitahuan Penting: Alat ini membantu mengidentifikasi kemungkinan masalah kesehatan pada ternak. Alat ini tidak memberikan diagnosis dan tidak menggantikan saran dokter hewan. Penyakit yang berbeda dapat menunjukkan gejala yang serupa, dan hanya dokter hewan yang berkualifikasi yang dapat memeriksa hewan dengan benar dan memastikan diagnosis yang tepat. Hasil yang diberikan oleh alat ini hanya untuk panduan. Jika hewan menunjukkan tanda-tanda penyakit, segera konsultasikan dengan dokter hewan.",
    fullText: "Pemberitahuan Penting: Alat ini membantu mengidentifikasi kemungkinan masalah kesehatan pada ternak. Alat ini tidak memberikan diagnosis dan tidak menggantikan saran dokter hewan. Penyakit yang berbeda dapat menunjukkan gejala yang serupa, dan hanya dokter hewan yang berkualifikasi yang dapat memeriksa hewan dengan benar dan memastikan diagnosis yang tepat. Hasil yang diberikan oleh alat ini hanya untuk panduan. Jika hewan menunjukkan tanda-tanda penyakit, segera konsultasikan dengan dokter hewan.",
    checkboxLabel: "Saya memahami dan menyetujui disclaimer ini",
    continueButton: "Lanjutkan ke Tool",
    nextSteps: "Langkah Selanjutnya",
    recommendedActions: [
      "Hubungi dokter hewan segera",
      "Jangan berikan obat tanpa konsultasi profesional",
      "Isolasi hewan yang sakit",
      "Catat semua gejala dan perubahan kondisi",
      "Siapkan riwayat kesehatan dan vaksinasi hewan"
    ],
    contactVet: "Hubungi Dokter Hewan",
    saveReport: "Simpan Laporan"
  },
  vi: {
    title: "Thông báo Quan trọng",
    shortText: "Thông báo quan trọng: Công cụ này giúp xác định các vấn đề sức khỏe có thể xảy ra ở vật nuôi. Công cụ này không cung cấp chẩn đoán và không thay thế lời khuyên của bác sĩ thú y. Các bệnh khác nhau có thể có triệu chứng tương tự và chỉ bác sĩ thú y có chuyên môn mới có thể kiểm tra động vật đúng cách và xác nhận chẩn đoán chính xác. Kết quả do công cụ này cung cấp chỉ mang tính chất hướng dẫn. Nếu vật nuôi có dấu hiệu bệnh, hãy tham khảo ý kiến bác sĩ thú y kịp thời.",
    fullText: "Thông báo quan trọng: Công cụ này giúp xác định các vấn đề sức khỏe có thể xảy ra ở vật nuôi. Công cụ này không cung cấp chẩn đoán và không thay thế lời khuyên của bác sĩ thú y. Các bệnh khác nhau có thể có triệu chứng tương tự và chỉ bác sĩ thú y có chuyên môn mới có thể kiểm tra động vật đúng cách và xác nhận chẩn đoán chính xác. Kết quả do công cụ này cung cấp chỉ mang tính chất hướng dẫn. Nếu vật nuôi có dấu hiệu bệnh, hãy tham khảo ý kiến bác sĩ thú y kịp thời.",
    checkboxLabel: "Tôi hiểu và đồng ý với tuyên bố miễn trừ trách nhiệm này",
    continueButton: "Tiếp tục sử dụng Công cụ",
    nextSteps: "Các Bước Tiếp theo",
    recommendedActions: [
      "Liên hệ bác sĩ thú y ngay lập tức",
      "Không dùng thuốc mà không có tư vấn chuyên nghiệp",
      "Cách ly động vật bị bệnh",
      "Ghi chép tất cả triệu chứng và thay đổi",
      "Chuẩn bị lịch sử sức khỏe và tiêm phòng của động vật"
    ],
    contactVet: "Liên hệ Bác sĩ Thú y",
    saveReport: "Lưu Báo cáo"
  }
} as const;

export type DisclaimerLanguage = keyof typeof DISEASE_DIAGNOSIS_DISCLAIMERS;
