import fs from 'fs';

const translations = {
    // Categories
    "Mortality": { en: "Mortality", id: "Mortalitas", vi: "Tỷ lệ chết" },
    "Number of affected pigs": { en: "Number of affected pigs", id: "Jumlah babi yang terkena", vi: "Số lượng lợn bị ảnh hưởng" },
    "Fever status": { en: "Fever status", id: "Status demam", vi: "Tình trạng sốt" },
    "Locomotion / nervous signs": { en: "Locomotion / nervous signs", id: "Tanda lokomotor/saraf", vi: "Dấu hiệu vận động/thần kinh" },
    "Excretion/discharge signs": { en: "Excretion/discharge signs", id: "Tanda ekskresi/cairan", vi: "Dấu hiệu bài tiết/tiết dịch" },
    "Skin/bodily signs": { en: "Skin/bodily signs", id: "Tanda kulit/tubuh", vi: "Dấu hiệu da/cơ thể" },
    "Reproductive signs": { en: "Reproductive signs", id: "Tanda reproduksi", vi: "Dấu hiệu sinh sản" },
    "Respiratory signs": { en: "Respiratory signs", id: "Tanda pernapasan", vi: "Dấu hiệu hô hấp" },

    // Mortality
    "Increase by less than 6%": { en: "Increase by less than 6%", id: "Peningkatan kurang dari 6%", vi: "Tăng dưới 6%" },
    "Increase by more than 6%": { en: "Increase by more than 6%", id: "Peningkatan lebih dari 6%", vi: "Tăng trên 6%" },
    "Sudden deaths": { en: "Sudden deaths", id: "Kematian mendadak", vi: "Chết đột ngột" },

    // Number of affected pigs
    "Less than 10%": { en: "Less than 10%", id: "Kurang dari 10%", vi: "Dưới 10%" },
    "More than 10%": { en: "More than 10%", id: "Lebih dari 10%", vi: "Trên 10%" },

    // Fever status
    "Fever": { en: "Fever", id: "Demam", vi: "Sốt" },
    "No fever": { en: "No fever", id: "Tidak demam", vi: "Không sốt" },

    // Locomotion
    "Blindness": { en: "Blindness", id: "Kebutaan", vi: "Mù lòa" },
    "Fits / convulsions": { en: "Fits / convulsions", id: "Kejang / sawan", vi: "Co giật" },
    "Holding head to one side": { en: "Holding head to one side", id: "Kepala miring ke satu sisi", vi: "Nghiêng đầu sang một bên" },
    "Incoordination / partial paralysis": { en: "Incoordination / partial paralysis", id: "Loyo / kelumpuhan parsial", vi: "Mất phối hợp / liệt một phần" },
    "Lameness/stiffness/arthritis": { en: "Lameness/stiffness/arthritis", id: "Pincang / kaku / artritis", vi: "Què / cứng khớp / viêm khớp" },
    "Opisthotonus": { en: "Opisthotonus", id: "Opistotonus (kejang leher)", vi: "Khoèo cổ (uốn ván)" },
    "Paralysis / dog-sitting position": { en: "Paralysis / dog-sitting position", id: "Kelumpuhan / posisi duduk seperti anjing", vi: "Liệt / tư thế ngồi chó" },
    "Trembling / shaking": { en: "Trembling / shaking", id: "Gemetar", vi: "Run rẩy" },
    "Weakness": { en: "Weakness", id: "Kelemahan", vi: "Suy nhược" },

    // Excretion/discharge
    "Blood from nose": { en: "Blood from nose", id: "Mimisan (darah dari hidung)", vi: "Chảy máu mũi" },
    "Blood from vulva": { en: "Blood from vulva", id: "Darah dari vulva", vi: "Chảy máu âm hộ" },
    "Blood in feces/diarrhea": { en: "Blood in feces/diarrhea", id: "Darah dalam feses / diare", vi: "Phân có máu / tiêu chảy ra máu" },
    "Conjunctivitis": { en: "Conjunctivitis", id: "Konjungtivitis (mata merah)", vi: "Viêm kết mạc" },
    "Constipation": { en: "Constipation", id: "Sembelit", vi: "Táo bón" },
    "Diarrhoea": { en: "Diarrhoea", id: "Diare", vi: "Tiêu chảy" },
    "Mucus/pus from nose": { en: "Mucus/pus from nose", id: "Lendir/nanah dari hidung", vi: "Chảy dịch/mủ mũi" },
    "Mucus/pus in feces/diarrhea": { en: "Mucus/pus in feces/diarrhea", id: "Lendir/nanah dalam feses", vi: "Phân có nhầy/mủ" },
    "Salivation": { en: "Salivation", id: "Air liur berlebihan", vi: "Chảy dãi" },
    "Vomiting": { en: "Vomiting", id: "Muntah", vi: "Nôn mửa" },

    // Skin/bodily
    "Abdomen distended": { en: "Abdomen distended", id: "Perut buncit / kembung", vi: "Bụng phình to" },
    "Anemia / pale pigs": { en: "Anemia / pale pigs", id: "Anemia / babi pucat", vi: "Thiếu máu / lợn nhợt nhạt" },
    "Anorexia / weight loss": { en: "Anorexia / weight loss", id: "Hilang nafsu makan / penurunan berat badan", vi: "Bỏ ăn / giảm cân" },
    "Blisters / vesicles": { en: "Blisters / vesicles", id: "Lepuhan / vesikel", vi: "Mụn nước / bọng nước" },
    "Blue skin / cyanosis": { en: "Blue skin / cyanosis", id: "Kulit biru / sianosis", vi: "Da tím tái" },
    "Dehydration": { en: "Dehydration", id: "Dehidrasi", vi: "Mất nước" },
    "Edema": { en: "Edema", id: "Edema (bengkak berair)", vi: "Phù nề" },
    "Gangrene / necrosis": { en: "Gangrene / necrosis", id: "Gangren / nekrosis (jaringan mati)", vi: "Hoại tử" },
    "Greasy brown skin": { en: "Greasy brown skin", id: "Kulit cokelat berminyak", vi: "Da nhờn ướt màu nâu" },
    "Hairy pigs": { en: "Hairy pigs", id: "Babi berbulu kusam", vi: "Lợn lông xù" },
    "Hemorrhage": { en: "Hemorrhage", id: "Pendarahan", vi: "Xuất huyết" },
    "Jaundice": { en: "Jaundice", id: "Penyakit kuning", vi: "Vàng da" },
    "Lymph nodes enlarged": { en: "Lymph nodes enlarged", id: "Kelenjar getah bening membesar", vi: "Sưng hạch bạch huyết" },
    "Poor growth / wasting / starvation": { en: "Poor growth / wasting / starvation", id: "Pertumbuhan buruk / kurus kering / kelaparan", vi: "Chậm lớn / còi cọc / gầy gò" },
    "Raised skin patches": { en: "Raised skin patches", id: "Bercak kulit menonjol", vi: "Da nổi mảng" },
    "Scratching/irritation of the skin": { en: "Scratching/irritation of the skin", id: "Gatal / iritasi kulit", vi: "Gãi / kích ứng da" },
    "Skin Lesions (black, brown, red)": { en: "Skin Lesions (black, brown, red)", id: "Lesi kulit (hitam, cokelat, merah)", vi: "Tổn thương da (đen, nâu, đỏ)" },
    "Swollen testicles": { en: "Swollen testicles", id: "Testis bengkak", vi: "Sưng tinh hoàn" },
    "Ulcerated / inflamed skin / dermatitis": { en: "Ulcerated / inflamed skin / dermatitis", id: "Kulit borok / meradang / dermatitis", vi: "Viêm loét / viêm da" },

    // Reproductive
    "Abortion / not in pig": { en: "Abortion / not in pig", id: "Keguguran / tidak bunting", vi: "Sảy thai / không chửa" },
    "Anoestrus": { en: "Anoestrus", id: "Anestrus (tidak birahi)", vi: "Không động dục" },
    "Mastitis": { en: "Mastitis", id: "Mastitis (radang ambing)", vi: "Viêm vú" },
    "Mummified piglets": { en: "Mummified piglets", id: "Anak babi mumi", vi: "Lợn con thai gỗ" },
    "No milk": { en: "No milk", id: "Tidak ada susu", vi: "Không có sữa" },
    "Reproductive failure": { en: "Reproductive failure", id: "Kegagalan reproduksi", vi: "Thất bại sinh sản" },
    "Small litter size": { en: "Small litter size", id: "Anak sedikit (Litter size kecil)", vi: "Số heo con sinh ra ít" },
    "Stillbirths": { en: "Stillbirths", id: "Lahir mati", vi: "Thai chết lưu" },

    // Respiratory
    "Coughing": { en: "Coughing", id: "Batuk", vi: "Ho" },
    "Deformed nose": { en: "Deformed nose", id: "Hidung bengkok / cacat", vi: "Mũi biến dạng" },
    "Pneumonia / rapid breathing": { en: "Pneumonia / rapid breathing", id: "Pneumonia / napas cepat", vi: "Viêm phổi / thở nhanh" },
    "Sneezing": { en: "Sneezing", id: "Bersin", vi: "Hắt hơi" }
};

const inputPath = 'public/data/swine/symptoms.json';
const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

// Convert to localized structure
data.categories.forEach(cat => {
    const catTrans = translations[cat.name];
    if (catTrans) {
        cat.name = catTrans;
    } else {
        console.warn('Missing translation for category:', cat.name);
        cat.name = { en: cat.name, id: cat.name, vi: cat.name };
    }

    cat.symptoms.forEach(sym => {
        const symTrans = translations[sym.label];
        if (symTrans) {
            sym.label = symTrans;
        } else {
            console.warn('Missing translation for symptom:', sym.label);
            sym.label = { en: sym.label, id: sym.label, vi: sym.label };
        }
    });
});

fs.writeFileSync(inputPath, JSON.stringify(data, null, 2));
console.log('Successfully translated symptoms.json');
