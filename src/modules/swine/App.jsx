import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';
import { DiagnosisProvider } from './contexts/DiagnosisContext';
import { BiosecurityProvider } from './contexts/BiosecurityContext';

import HomePage from './pages/HomePage';

// Diagnosis pages
import DiagnosticLanding from './pages/DiagnosticLanding';
import AgePage from './pages/AgePage';
import SymptomsPage from './pages/SymptomsPage';
import DiseaseDiagnosisNew from './pages/DiseaseDiagnosisNew';
import ResultsPage from './pages/ResultsPage';
import DiseasePage from './pages/DiseasePage';
import AllDiseasesPage from './pages/AllDiseasesPage';
import DiseaseComparisonPage from './pages/DiseaseComparisonPage';

// Biosecurity pages
import BiosecurityMainDashboard from './pages/biosecurity/BiosecurityMainDashboard';
import LanguageSelectionPage from './pages/biosecurity/LanguageSelectionPage';
import FarmProfilePage from './pages/biosecurity/FarmProfilePage';
import BiosecurityDashboard from './pages/biosecurity/BiosecurityDashboard';
import AssessmentPage from './pages/biosecurity/AssessmentPage';
import BiosecurityResultsPage from './pages/biosecurity/ResultsPage';
import BiosecurityHistoryPage from './pages/biosecurity/BiosecurityHistoryPage';

// Farm Calculator page
import PigFarmCalculatorPage from './pages/PigFarmCalculatorPage';

import './index.css';

function App() {
  const location = useLocation();
  const { t } = useTranslation();
  const { language } = useLanguage();


  return (
    <DiagnosisProvider>
      <BiosecurityProvider>
        <div className="fw-page">







          <main>






                  <Routes>
                    {/* PigWell Feature Selection */}
                    <Route path="/" element={<HomePage />} />

                    {/* Diagnostic Landing (3-menu grid) */}
                    <Route path="/diagnostic" element={<DiagnosticLanding />} />

                    {/* Diagnosis Routes */}
                    <Route path="/diagnosis/age" element={<AgePage />} />
                    <Route path="/diagnosis/symptoms" element={<DiseaseDiagnosisNew />} />
                    <Route path="/diagnosis/symptoms-new" element={<DiseaseDiagnosisNew />} />
                    <Route path="/diagnosis/results" element={<ResultsPage />} />
                    <Route path="/diagnosis/disease/:id" element={<DiseasePage />} />
                    
                    {/* All Diseases Browse Page */}
                    <Route path="/diseases" element={<AllDiseasesPage />} />
                    
                    {/* Disease Comparison Page */}
                    <Route path="/compare" element={<DiseaseComparisonPage />} />

                    {/* Biosecurity Routes */}
                    <Route path="/biosecurity" element={<BiosecurityMainDashboard />} />
                    <Route path="/biosecurity/language" element={<LanguageSelectionPage />} />
                    <Route path="/biosecurity/farm-profile" element={<FarmProfilePage />} />
                    <Route path="/biosecurity/dashboard" element={<BiosecurityDashboard />} />
                    <Route path="/biosecurity/assessment/:focusArea" element={<AssessmentPage />} />
                    <Route path="/biosecurity/results" element={<BiosecurityResultsPage />} />
                    <Route path="/biosecurity/report" element={<BiosecurityResultsPage />} />
                    <Route path="/biosecurity/history" element={<BiosecurityHistoryPage />} />

                    {/* Farm Calculator Route */}
                    <Route path="/farm-calculator" element={<PigFarmCalculatorPage />} />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/swine" replace />} />
                  </Routes>
                </main>


















        </div>
      </BiosecurityProvider>
    </DiagnosisProvider>
  );
}

export default App;
