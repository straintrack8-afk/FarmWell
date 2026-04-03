import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import WelcomePage from './pages/WelcomePage';
import SwineApp from './modules/swine/App';
import PoultryApp from './modules/poultry/App';
import FeedAdditivesApp from './modules/feed-additives/App';
import FarmGuideApp from './modules/farmguide/FarmGuideApp';
import SplashScreen from './components/SplashScreen';
import SharedTopNav from './components/SharedTopNav';
import OnboardingQuestionnaire from './components/OnboardingQuestionnaire';
import { useOnboarding } from './hooks/useOnboarding';

// Show splash once per browser session (disappears after refresh or new tab)
const hasSeenSplash = sessionStorage.getItem('fw_splash_seen') === 'true';

function AppContent() {
    const [splashDone, setSplashDone] = useState(hasSeenSplash);
    const { isComplete, saveOnboardingData } = useOnboarding();

    const handleSplashComplete = () => {
        sessionStorage.setItem('fw_splash_seen', 'true');
        setSplashDone(true);
    };

    return (
        <>
            {/* Splash sits above everything and unmounts itself once done */}
            {!splashDone && (
                <SplashScreen duration={3500} onComplete={handleSplashComplete} />
            )}

            {/* Navbar untuk questionnaire (WelcomePage & modules render navbar sendiri) */}
            {splashDone && !isComplete && <SharedTopNav />}

            {/* Onboarding — muncul untuk new user, tidak bisa di-skip */}
            {splashDone && !isComplete && (
                <div style={{ minHeight: 'calc(100vh - 56px)', background: '#f5f7f5' }}>
                    <OnboardingQuestionnaire
                        onComplete={saveOnboardingData}
                    />
                </div>
            )}

            {/* Routes hanya tampil setelah onboarding selesai */}
            {splashDone && isComplete && (
                <Routes>
                    <Route path="/" element={<WelcomePage />} />
                    <Route path="/feed-additives/*" element={<FeedAdditivesApp />} />
                    <Route path="/swine/*" element={<SwineApp />} />
                    <Route path="/poultry/*" element={<PoultryApp />} />
                    <Route path="/farmguide/*" element={<FarmGuideApp />} />
                </Routes>
            )}
        </>
    );
}

function App() {
    return (
        <LanguageProvider>
            <AppContent />
        </LanguageProvider>
    );
}

export default App;
