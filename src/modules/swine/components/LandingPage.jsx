import React from 'react';
import { useDiagnosis } from '../contexts/DiagnosisContext';
import { STEPS } from '../utils/constants';
import Button from './common/Button';
import { useTranslation } from '../../../hooks/useTranslation';
import {
    Stethoscope,
    Database,
    Wifi,
    WifiOff,
    ChevronRight,
    Shield,
    Zap,
    BookOpen
} from 'lucide-react';

export default function LandingPage() {
    const { setStep, allDiseases, isOffline } = useDiagnosis();
    const { t, language } = useTranslation();

    const handleStart = () => {
        setStep(STEPS.AGE);
    };

    const features = [
        {
            icon: Database,
            title: t('swine.diagnosis.landing.features.database.title'),
            description: `${allDiseases.length}+ ${t('swine.diagnosis.landing.features.database.description')}`
        },
        {
            icon: Zap,
            title: t('swine.diagnosis.landing.features.instant.title'),
            description: t('swine.diagnosis.landing.features.instant.description')
        },
        {
            icon: WifiOff,
            title: t('swine.diagnosis.landing.features.offline.title'),
            description: t('swine.diagnosis.landing.features.offline.description')
        },
        {
            icon: Shield,
            title: t('swine.diagnosis.landing.features.expert.title'),
            description: t('swine.diagnosis.landing.features.expert.description')
        }
    ];

    const steps = [
        { number: 1, title: t('swine.diagnosis.landing.steps.step1.title'), description: t('swine.diagnosis.landing.steps.step1.description') },
        { number: 2, title: t('swine.diagnosis.landing.steps.step2.title'), description: t('swine.diagnosis.landing.steps.step2.description') },
        { number: 3, title: t('swine.diagnosis.landing.steps.step3.title'), description: t('swine.diagnosis.landing.steps.step3.description') }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full opacity-50 blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 rounded-full opacity-50 blur-3xl" />
                </div>

                <div className="relative max-w-6xl mx-auto px-4 py-6 sm:py-8">
                    {/* Top-left Logo */}
                    <div className="absolute top-6 left-4 z-20">
                        <img
                            src="/images/PoultryWell_Logo.png"
                            alt="PoultryWell Logo"
                            className="h-10 sm:h-12 w-auto"
                        />
                    </div>

                    {/* Main content */}
                    <div className="text-center mb-12">
                        {/* Logo/Icon */}
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500 rounded-2xl shadow-lg shadow-primary-500/30 mb-6">
                            <Stethoscope className="w-10 h-10 text-white" />
                        </div>

                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                            {t('swine.diagnosis.landing.heroTitle')} <span className="text-primary-500">{t('swine.diagnosis.landing.heroTitleHighlight')}</span>
                        </h1>

                        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                            {t('swine.diagnosis.landing.heroDescription')}
                        </p>

                        {/* Status badge */}
                        <div className="flex items-center justify-center gap-4 mb-8">
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '0.5rem 1rem',
                                background: '#f3f4f6',
                                borderRadius: '9999px',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: '#374151',
                                border: '1px solid #e5e7eb'
                            }}>
                                {language.toUpperCase()}
                            </div>
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-sm border ${isOffline
                                ? 'bg-amber-50 border-amber-200 text-amber-700'
                                : 'bg-green-50 border-green-200 text-green-700'
                                }`}>
                                {isOffline ? (
                                    <>
                                        <WifiOff className="w-4 h-4" />
                                        <span className="text-sm font-medium">{t('swine.diagnosis.landing.offlineMode')}</span>
                                    </>
                                ) : (
                                    <>
                                        <Wifi className="w-4 h-4" />
                                        <span className="text-sm font-medium">{t('swine.diagnosis.landing.online')}</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* CTA Button */}
                        <Button
                            size="xl"
                            onClick={handleStart}
                            icon={ChevronRight}
                            iconPosition="right"
                            className="shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transform hover:-translate-y-0.5"
                        >
                            {t('swine.diagnosis.landing.startButton')}
                        </Button>
                    </div>

                    {/* How it works */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 mb-12">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-primary-500" />
                            {t('swine.diagnosis.landing.howItWorks')}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {steps.map((step, index) => (
                                <div
                                    key={step.number}
                                    className="relative flex items-start gap-4"
                                >
                                    {/* Connector line */}
                                    {index < steps.length - 1 && (
                                        <div className="hidden md:block absolute top-6 left-6 w-full h-0.5 bg-gray-200" />
                                    )}

                                    {/* Step number */}
                                    <div className="relative z-10 flex-shrink-0 w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary-500/30">
                                        {step.number}
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">
                                            {step.title}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mb-3">
                                    <feature.icon className="w-5 h-5 text-primary-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-gray-100 py-8">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{t('swine.diagnosis.landing.footer.poweredBy')}</span>
                            <img
                                src="/images/Vaksindo_logo.png"
                                alt="Vaksindo logo"
                                className="h-12 w-auto opacity-80 hover:opacity-100 transition-opacity"
                            />
                        </div>
                        <p className="text-sm text-gray-500 max-w-md mx-auto">
                            {t('swine.diagnosis.landing.footer.disclaimer')}
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
