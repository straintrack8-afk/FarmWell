import { useLanguage } from '../contexts/LanguageContext';
import { translations, getTranslation } from '../i18n/translations';

export const useTranslation = () => {
    const { language } = useLanguage();

    const t = (key, fallback = '') => {
        return getTranslation(translations, language, key, fallback);
    };

    return { t, language };
};
