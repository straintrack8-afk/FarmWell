import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import SharedTopNav from '../components/SharedTopNav';

const WelcomePage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const features = [
        { icon: '🏥', title: t('welcome.featureDiagnostics') || 'Disease Diagnostics', sub: t('welcome.featureMultiSpecies') || 'Multi-species' },
        { icon: '📊', title: t('welcome.featurePerformance') || 'Performance Monitor', sub: t('welcome.featureRealtime') || 'Real-time tracking' },
        { icon: '📋', title: t('welcome.featureBiosecurity') || 'Biosecurity Audit', sub: t('welcome.featureFarmHatchery') || 'Farm & Hatchery' },
        { icon: '🤖', title: t('welcome.featureAI') || 'AI Advisory', sub: t('welcome.featureAIPowered') || 'Powered by Claude' },
    ];

    const topModules = [
        {
            id: 'feed-additives',
            name: t('welcome.feedAdditivesModule') || 'Feed Additives',
            desc: t('welcome.feedAdditivesDescription') || 'Comprehensive feed additive analysis & optimization for livestock nutrition management.',
            icon: '/images/feed_additives_logo.png',
            tags: ['Nutrition', 'Optimization', 'Formula'],
            status: 'live',
            ctaLabel: t('welcome.launchModule') || 'Open Module',
            colorClass: 'mc-feed',
            path: '/feed-additives',
        },
        {
            id: 'swine',
            name: t('welcome.swineModule') || 'PigWell — Swine Module',
            desc: t('welcome.swineDescription') || 'Integrated swine farm management for disease diagnostics, production analytics, and biosecurity.',
            icon: '/images/PigWell_Logo.png',
            tags: ['Diagnosis', 'Production', 'Biosecurity'],
            status: 'live',
            ctaLabel: t('welcome.launchModule') || 'Open Module',
            colorClass: 'mc-pig',
            path: '/swine',
        },
    ];

    const midModules = [
        {
            id: 'poultry',
            name: t('welcome.poultryModule') || 'PoultryWell — Poultry Module',
            desc: t('welcome.poultryDescription') || 'Integrated poultry management platform for disease diagnostics, biosecurity audits, and farm support.',
            icon: '/images/PoultryWell_Logo.png',
            tags: ['Diagnostics', 'Audit', 'Hatchery'],
            status: 'live',
            ctaLabel: t('welcome.launchModule') || 'Open Module',
            colorClass: 'mc-poultry',
            path: '/poultry',
        },
        {
            id: 'farmguide',
            name: 'FarmGuide — Breed Monitor',
            desc: 'Panduan manajemen breed berbasis Aviagen 2025. Monitor BW aktual vs standard, growth curve, AI advisory, dan proyeksi panen.',
            icon: null,
            iconEmoji: '📱',
            tags: ['Broiler', 'Parent Stock', 'AI Advisory'],
            status: 'new',
            ctaLabel: 'Open FarmGuide',
            colorClass: 'mc-guide',
            path: null,
        },
    ];

    const aiModule = {
        id: 'ai-assistant',
        name: 'FarmWell AI Assistant',
        desc: 'Asisten AI terintegrasi untuk semua modul FarmWell. Tanyakan apa saja tentang ternak kamu — dijawab real-time.',
        icon: null,
        iconEmoji: '🤖',
        tags: ['AI Chat', 'Multi-Module', 'Bahasa Indonesia'],
        status: 'soon',
        ctaLabel: 'Join Waitlist',
        colorClass: 'mc-ai',
        path: null,
    };

    const moduleStatusLabel = (status) => {
        if (status === 'live') return <span className="mc-badge mb-live">✓ {t('welcome.active') || 'Active'}</span>;
        if (status === 'new') return <span className="mc-badge mb-new">✦ {t('welcome.new') || 'New'}</span>;
        if (status === 'soon') return <span className="mc-badge mb-soon">Coming Soon</span>;
        return null;
    };

    const handleModuleClick = (path) => {
        if (path) navigate(path);
    };

    const renderCard = (mod) => (
        <div
            key={mod.id}
            className={`fw-module-card ${mod.colorClass}`}
            onClick={() => handleModuleClick(mod.path)}
            style={{ cursor: mod.path ? 'pointer' : 'default' }}
        >
            <div className="fmc-header">
                <div className="fmc-icon-wrap">
                    {mod.icon
                        ? <img src={mod.icon} alt={mod.name} className="fmc-logo-img" />
                        : <span className="fmc-emoji">{mod.iconEmoji}</span>
                    }
                </div>
                {moduleStatusLabel(mod.status)}
            </div>
            <div className="fmc-body">
                <div className="fmc-name">{mod.name}</div>
                <div className="fmc-desc">{mod.desc}</div>
                <div className="fmc-tags">
                    {mod.tags.map(tag => <span key={tag} className="fmc-tag">{tag}</span>)}
                </div>
                <button className="fmc-cta" onClick={(e) => { e.stopPropagation(); handleModuleClick(mod.path); }}>
                    {mod.ctaLabel}
                    <div className="fmc-cta-arrow">›</div>
                </button>
            </div>
        </div>
    );

    return (
        <div className="fw-page">
            {/* ── TOPNAV ── */}
            <SharedTopNav hideLogo />

            {/* ── HERO HEADER  (light bg, logo centered) ── */}
            <section className="fw-header-light">
                <div className="fw-header-logo-wrap">
                    <img src="/images/FarmWell_Logo.png" alt="FarmWell" className="fw-header-logo" />
                </div>
                <p className="fw-header-sub">
                    {t('welcome.subtitle') || 'Integrated Livestock Diagnostic & Performance Platform'}
                </p>
            </section>

            {/* ── FEATURE STRIP ── */}
            <div className="fw-feature-strip">
                <div className="fw-features-row">
                    {features.map((feat, i) => (
                        <div key={i} className="fw-feat" style={{ animationDelay: `${(i + 1) * 0.1}s` }}>
                            <div className="fw-feat-icon">{feat.icon}</div>
                            <div>
                                <div className="fw-feat-title">{feat.title}</div>
                                <div className="fw-feat-sub">{feat.sub}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── MODULES SECTION ── */}
            <div className="fw-section">
                <div className="fw-sec-header">
                    <div className="fw-sec-eyebrow">🧩 {t('welcome.allModules') || 'All Modules'}</div>
                    <div className="fw-sec-title">{t('welcome.chooseModule') || 'Choose the module you need'}</div>
                    <div className="fw-sec-sub">{t('welcome.moduleSubtitle') || 'Each module is designed specifically for livestock management needs.'}</div>
                </div>

                {/* Row 1: Feed + Pig */}
                <div className="fw-modules-grid-2">
                    {topModules.map(renderCard)}
                </div>

                {/* Row 2: Poultry + FarmGuide */}
                <div className="fw-modules-grid-2">
                    {midModules.map(renderCard)}
                </div>

                {/* Row 3: AI Assistant — full width */}
                <div className="fw-modules-grid-1">
                    {renderCard(aiModule)}
                </div>
            </div>

            {/* ── SUPPORTED BY ── */}
            <div className="fw-supported">
                <div className="fw-sup-label">{t('welcome.poweredBy') || 'Powered By'}</div>
                <div className="fw-sup-logos">
                    <img src="/images/Vaksindo_logo.png" alt="Vaksindo" className="fw-vaksindo-logo" />
                </div>
            </div>

            {/* ── STATS BAR — above footer ── */}
            <div className="fw-stats-bar">
                <div className="fw-hs"><div className="fw-hs-num">3</div><div className="fw-hs-lbl">{t('welcome.statModules') || 'Active Modules'}</div></div>
                <div className="fw-hs"><div className="fw-hs-num">3</div><div className="fw-hs-lbl">{t('welcome.statLanguages') || 'Languages'}</div></div>
                <div className="fw-hs"><div className="fw-hs-num">AI</div><div className="fw-hs-lbl">{t('welcome.statAI') || 'Powered'}</div></div>
                <div className="fw-hs"><div className="fw-hs-num">24/7</div><div className="fw-hs-lbl">{t('welcome.statAccess') || 'Access'}</div></div>
            </div>

            {/* ── FOOTER ── */}
            <footer className="fw-footer">
                <div className="fw-footer-copy">© 2025 FarmWell · Integrated Livestock Platform</div>
            </footer>
        </div>
    );
};

export default WelcomePage;
