export const DISEASE_DIAGNOSIS_DISCLAIMERS = {
  en: {
    title: "Important Notice",
    shortText: "This tool only helps recognize disease symptoms in livestock. If disease signs are observed, immediately contact a veterinarian for professional consultation and diagnosis.",
    fullText: "This tool is designed as a supporting aid to help identify early signs of disease in livestock and does not replace the role of a veterinarian. To ensure proper animal health, please consult a veterinarian immediately if any signs of illness are observed.",
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
    shortText: "Tool ini hanya membantu mengenali gejala penyakit pada ternak. Jika terlihat tanda-tanda penyakit, segera hubungi dokter hewan untuk konsultasi dan diagnosis profesional.",
    fullText: "Tool ini dirancang sebagai sarana pendukung dalam mengenali gejala awal penyakit pada ternak dan tidak menggantikan peran dokter hewan. Untuk memastikan kondisi kesehatan ternak, segera lakukan konsultasi dengan dokter hewan apabila terdapat tanda-tanda penyakit.",
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
    shortText: "Công cụ này chỉ giúp nhận biết triệu chứng bệnh ở vật nuôi. Nếu phát hiện dấu hiệu bệnh, hãy liên hệ ngay với bác sĩ thú y để được tư vấn và chẩn đoán chuyên nghiệp.",
    fullText: "Công cụ này được thiết kế như một phương tiện hỗ trợ trong việc nhận diện sớm các dấu hiệu bệnh ở vật nuôi và không thay thế vai trò của bác sĩ thú y. Để đảm bảo tình trạng sức khỏe vật nuôi, vui lòng liên hệ bác sĩ thú y để được tư vấn khi phát hiện bất kỳ dấu hiệu bệnh nào.",
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
