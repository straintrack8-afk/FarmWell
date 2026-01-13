import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DiagnosisProvider, useDiagnosis } from './contexts/DiagnosisContext';
import './poultry.css';
import { STEPS } from './utils/constants';
import Header from './components/common/Header';
import PoultryLanding from './components/PoultryLanding';
import LandingPage from './components/LandingPage';
import AgeSelection from './components/AgeSelection';
import SymptomSelection from './components/SymptomSelection';
import ResultsList from './components/ResultsList';
import DiseaseDetail from './components/DiseaseDetail';
import HatcheryAuditRouter from './components/hatchery/HatcheryAuditRouter';

function DiagnosticApp() {
    const { step, isLoading, error } = useDiagnosis();

    // Loading state
    if (isLoading) {
        return (
            <div className="portal-layout">
                <div className="portal-container">
                    <div className="portal-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
                        <div className="spinner"></div>
                        <p className="text-muted">Loading Poultry database...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="portal-layout">
                <div className="portal-container">
                    <div className="portal-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem' }}>⚠️</div>
                        <h2 className="text-danger">Failed to Load</h2>
                        <p className="text-muted" style={{ maxWidth: '400px' }}>{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="btn btn-primary"
                        >
                            Retry Loading
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="portal-layout">
            <div className="portal-container">
                <div className="portal-card" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
                    <Header />
                    <main style={{ flex: 1, padding: '2rem 0' }}>
                        {step === STEPS.LANDING && <LandingPage />}
                        {step === STEPS.AGE && <AgeSelection />}
                        {step === STEPS.SYMPTOMS && <SymptomSelection />}
                        {step === STEPS.RESULTS && <ResultsList />}
                        {step === STEPS.DETAIL && <DiseaseDetail />}
                    </main>
                </div>
            </div>
        </div>
    );
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<PoultryLanding />} />
            <Route path="/diagnostic/*" element={
                <DiagnosisProvider>
                    <DiagnosticApp />
                </DiagnosisProvider>
            } />
            <Route path="/hatchery-audit/*" element={<HatcheryAuditRouter />} />
        </Routes>
    );
}

export default App;

