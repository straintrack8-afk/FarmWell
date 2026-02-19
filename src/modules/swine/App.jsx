import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DiagnosisProvider } from './contexts/DiagnosisContext';
import { BiosecurityProvider } from './contexts/BiosecurityContext';
import Header from './components/common/Header';
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
  return (
    <DiagnosisProvider>
      <BiosecurityProvider>
        <div className="portal-layout">
          <div className="portal-container">
            <div className="portal-card" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
              <Header />
              <main style={{ flex: 1, padding: '0 0 0.5rem 0' }}>
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
      </BiosecurityProvider>
    </DiagnosisProvider>
  );
}

export default App;
