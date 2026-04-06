import { useLanguage } from '../contexts/LanguageContext';
import { translations, getTranslation } from '../i18n/translations';

export const useTranslation = () => {
    const { language } = useLanguage();

    const t = (key, fallback = '') => {
        return getTranslation(translations, language, key, fallback);
    };

    const tSafe = (key) => {
        const result = t(key);
        // Jika hasilnya sama persis dengan key → translation tidak ditemukan
        if (result === key) return null;
        return result;
    };

    return { t, tSafe, language };
};
