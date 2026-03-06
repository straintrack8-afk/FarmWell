import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { DiagnosisProvider } from './contexts/DiagnosisContext';
import { BiosecurityProvider } from './contexts/BiosecurityContext';
import SharedTopNav from '../../components/SharedTopNav';
import HomePage from './pages/HomePage';

// Diagnosis pages
import AgePage from './pages/AgePage';
import SymptomsPage from './pages/SymptomsPage';
import ResultsPage from './pages/ResultsPage';
import DiseasePage from './pages/DiseasePage';

// Biosecurity pages
import BiosecurityMainDashboard from './pages/biosecurity/BiosecurityMainDashboard';
import LanguageSelectionPage from './pages/biosecurity/LanguageSelectionPage';
import FarmProfilePage from './pages/biosecurity/FarmProfilePage';
import BiosecurityDashboard from './pages/biosecurity/BiosecurityDashboard';
import AssessmentPage from './pages/biosecurity/AssessmentPage';
import BiosecurityResultsPage from './pages/biosecurity/ResultsPage';
import BiosecurityReportPage from './pages/biosecurity/BiosecurityReportPage';
import BiosecurityHistoryPage from './pages/biosecurity/BiosecurityHistoryPage';

// Farm Calculator page
import PigFarmCalculatorPage from './pages/PigFarmCalculatorPage';

import './index.css';

function App() {
  const location = useLocation();
  const isSwineHomePage = location.pathname === '/swine' || location.pathname === '/swine/';

  return (
    <DiagnosisProvider>
      <BiosecurityProvider>
        <div className="fw-page">
          <SharedTopNav
            logoSrc={isSwineHomePage ? "/images/FarmWell_Logo.png" : "/images/PigWell_Logo.png"}
            logoAlt={isSwineHomePage ? "FarmWell" : "PigWell"}
            logoHref={isSwineHomePage ? "/" : "/swine"}
            logoScale={1}
            imageScale={isSwineHomePage ? 1 : 1.25}
          />
          <div className="portal-layout" style={{ background: 'transparent', padding: 0 }}>
            <div className="portal-container" style={{ maxWidth: '100%', padding: 0 }}>
              <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
                <Routes>
                  <Route path="/" element={null} />
                </Routes>
                <main style={{ flex: 1, padding: 0 }}>
                  <Routes>
                    {/* PigWell Feature Selection */}
                    <Route path="/" element={<HomePage />} />

                    {/* Diagnosis Routes */}
                    <Route path="/diagnosis/age" element={<AgePage />} />
                    <Route path="/diagnosis/symptoms" element={<SymptomsPage />} />
                    <Route path="/diagnosis/results" element={<ResultsPage />} />
                    <Route path="/diagnosis/disease/:id" element={<DiseasePage />} />

                    {/* Biosecurity Routes */}
                    <Route path="/biosecurity" element={<BiosecurityMainDashboard />} />
                    <Route path="/biosecurity/language" element={<LanguageSelectionPage />} />
                    <Route path="/biosecurity/farm-profile" element={<FarmProfilePage />} />
                    <Route path="/biosecurity/dashboard" element={<BiosecurityDashboard />} />
                    <Route path="/biosecurity/assessment/:focusArea" element={<AssessmentPage />} />
                    <Route path="/biosecurity/results" element={<BiosecurityResultsPage />} />
                    <Route path="/biosecurity/report" element={<BiosecurityReportPage />} />
                    <Route path="/biosecurity/history" element={<BiosecurityHistoryPage />} />

                    {/* Farm Calculator Route */}
                    <Route path="/farm-calculator" element={<PigFarmCalculatorPage />} />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/swine" replace />} />
                  </Routes>
                </main>
              </div>
            </div>
          </div>

          {/* ── SUPPORTED BY ── */}
          <div className="fw-supported">
            <div className="fw-sup-label">POWERED BY</div>
            <div className="fw-sup-logos">
              <img src="/images/Vaksindo_logo.png" alt="Vaksindo" className="fw-vaksindo-logo" />
            </div>
          </div>

          {/* ── FOOTER ── */}
          <footer className="fw-footer" style={{ marginTop: 'auto' }}>
            <div className="fw-footer-copy">© 2025 FarmWell · Integrated Livestock Platform</div>
          </footer>
        </div>
      </BiosecurityProvider>
    </DiagnosisProvider>
  );
}

export default App;
