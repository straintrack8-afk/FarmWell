import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { DiagnosisProvider, useDiagnosis } from './contexts/DiagnosisContext';
import { BroilerAssessmentProvider } from './contexts/BroilerAssessmentContext';
import '../../portal.css';
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
import BroilerAssessmentLanding from './pages/biosecurity/BroilerAssessmentLanding';
import BroilerAssessmentDashboard from './pages/biosecurity/BroilerAssessmentDashboard';
import BroilerAssessmentPage from './pages/biosecurity/BroilerAssessmentPage';
import BroilerResultsPage from './pages/biosecurity/BroilerResultsPage';
import { BreederAssessmentProvider } from './contexts/BreederAssessmentContext';
import BreederAssessmentLanding from './pages/breeder/BreederAssessmentLanding';
import BreederAssessmentDashboard from './pages/breeder/BreederAssessmentDashboard';
import BreederAssessmentPage from './pages/breeder/BreederAssessmentPage';
import BreederResultsPage from './pages/breeder/BreederResultsPage';
import { LayerAssessmentProvider } from './contexts/LayerAssessmentContext';
import LayerAssessmentLanding from './pages/layer/LayerAssessmentLanding';
import LayerAssessmentDashboard from './pages/layer/LayerAssessmentDashboard';
import LayerAssessmentPage from './pages/layer/LayerAssessmentPage';
import LayerResultsPage from './pages/layer/LayerResultsPage';


function DiagnosticApp() {
    const { step, isLoading, error, isOffline, reset } = useDiagnosis();
    const navigate = useNavigate();

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
                    <Header isOffline={isOffline} onBack={reset} />
                    <main style={{ flex: 1, padding: '2rem 0' }}>
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
            {/* Redirect /diagnostic to /diagnostic/age */}
            <Route path="/diagnostic" element={<Navigate to="/poultry/diagnostic/age" replace />} />
            {/* Specific diagnostic routes */}
            <Route path="/diagnostic/age" element={
                <DiagnosisProvider>
                    <DiagnosticApp />
                </DiagnosisProvider>
            } />
            <Route path="/diagnostic/symptoms" element={
                <DiagnosisProvider>
                    <DiagnosticApp />
                </DiagnosisProvider>
            } />
            <Route path="/diagnostic/results" element={
                <DiagnosisProvider>
                    <DiagnosticApp />
                </DiagnosisProvider>
            } />
            <Route path="/diagnostic/detail" element={
                <DiagnosisProvider>
                    <DiagnosticApp />
                </DiagnosisProvider>
            } />
            <Route path="/hatchery-audit/*" element={<HatcheryAuditRouter />} />

            {/* Broiler Biosecurity Assessment Routes */}
            <Route path="/biosecurity" element={<BroilerAssessmentLanding />} />
            <Route path="/biosecurity/assessment" element={
                <BroilerAssessmentProvider>
                    <BroilerAssessmentDashboard />
                </BroilerAssessmentProvider>
            } />
            <Route path="/biosecurity/questions" element={
                <BroilerAssessmentProvider>
                    <BroilerAssessmentPage />
                </BroilerAssessmentProvider>
            } />
            <Route path="/biosecurity/results" element={
                <BroilerAssessmentProvider>
                    <BroilerResultsPage />
                </BroilerAssessmentProvider>
            } />

            {/* Breeder Farm Biosecurity Assessment Routes */}
            <Route path="/breeder-assessment" element={<BreederAssessmentLanding />} />
            <Route path="/breeder-assessment/dashboard" element={
                <BreederAssessmentProvider>
                    <BreederAssessmentDashboard />
                </BreederAssessmentProvider>
            } />
            <Route path="/breeder-assessment/questions" element={
                <BreederAssessmentProvider>
                    <BreederAssessmentPage />
                </BreederAssessmentProvider>
            } />
            <Route path="/breeder-assessment/results" element={
                <BreederAssessmentProvider>
                    <BreederResultsPage />
                </BreederAssessmentProvider>
            } />

            {/* Layer Farm Biosecurity Assessment Routes */}
            <Route path="/layer-assessment" element={<LayerAssessmentLanding />} />
            <Route path="/layer-assessment/dashboard" element={
                <LayerAssessmentProvider>
                    <LayerAssessmentDashboard />
                </LayerAssessmentProvider>
            } />
            <Route path="/layer-assessment/questions" element={
                <LayerAssessmentProvider>
                    <LayerAssessmentPage />
                </LayerAssessmentProvider>
            } />
            <Route path="/layer-assessment/results" element={
                <LayerAssessmentProvider>
                    <LayerResultsPage />
                </LayerAssessmentProvider>
            } />
        </Routes>
    );
}

export default App;
