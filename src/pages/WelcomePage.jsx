import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';

const WelcomePage = () => {
    const navigate = useNavigate();
    const { language, setLanguage } = useLanguage();
    const { t } = useTranslation();

    const languages = [
        { code: 'en', name: 'English', flag: '/images/flags/flag_en.png' },
        { code: 'id', name: 'Indonesia', flag: '/images/flags/flag_id.png' },
        { code: 'vn', name: 'Tiếng Việt', flag: '/images/flags/flag_vn.png' }
    ];

    const modules = [
        {
            id: 'feed-additives',
            title: t('welcome.feedAdditivesModule'),
            description: t('welcome.feedAdditivesDescription'),
            icon: '/images/feed_additives_logo.png',
            color: 'purple',
            path: '/feed-additives'
        },
        {
            id: 'swine',
            title: t('welcome.swineModule'),
            description: t('welcome.swineDescription'),
            icon: '/images/PigWell_Logo.png',
            color: 'blue',
            path: '/swine'
        },
        {
            id: 'poultry',
            title: t('welcome.poultryModule'),
            description: t('welcome.poultryDescription'),
            icon: '/images/PoultryWell_Logo.png',
            color: 'emerald',
            path: '/poultry'
        }
    ];

    return (
        <div className="portal-container">
            <div className="farmwell-card">
                <div className="logo-section">
                    <img
                        src="/images/FarmWell_Logo.png"
                        alt="FarmWell"
                        className="main-logo"
                    />
                    <p className="text-gray-500 text-lg font-medium opacity-70">
                        {t('welcome.subtitle')}
                    </p>

                    {/* Language Selector */}
                    <div className="language-selector">
                        <p className="language-label">{t('welcome.selectLanguage')}</p>
                        <div className="language-flags">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => setLanguage(lang.code)}
                                    className={`flag-button ${language === lang.code ? 'active' : ''}`}
                                    title={lang.name}
                                >
                                    <img
                                        src={lang.flag}
                                        alt={lang.name}
                                        className="flag-icon"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="module-grid">
                    {modules.map((module) => (
                        <div
                            key={module.id}
                            onClick={() => navigate(module.path)}
                            className="module-card group cursor-pointer"
                        >
                            <img
                                src={module.icon}
                                alt={module.title}
                                className="module-icon"
                            />
                            <h2 className="module-title">{module.title}</h2>
                            <p className="module-desc mb-6">
                                {module.description}
                            </p>

                            <div className={`flex items-center font-bold group-hover:gap-2 transition-all ${
                                module.color === 'purple' ? 'text-purple-600' : 
                                module.color === 'emerald' ? 'text-emerald-600' : 
                                'text-blue-600'
                            }`}>
                                {t('welcome.launchModule')} <ChevronRight className="w-5 h-5 ml-1" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="footer-branding">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em] mb-6">
                        {t('welcome.poweredBy')}
                    </p>
                    <div className="flex justify-center items-center">
                        <img
                            src="/images/Vaksindo_logo.png"
                            alt="Vaksindo"
                            className="vaksindo-logo"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomePage;
