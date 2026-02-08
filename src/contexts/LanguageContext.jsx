import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguageState] = useState(() => {
        // Load saved language from localStorage or default to 'en'
        const savedLanguage = localStorage.getItem('farmwell_language');
        return savedLanguage || 'en';
    });

    const setLanguage = (lang) => {
        setLanguageState(lang);
        localStorage.setItem('farmwell_language', lang);
    };

    useEffect(() => {
        // Ensure language is saved when component mounts
        localStorage.setItem('farmwell_language', language);
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};
