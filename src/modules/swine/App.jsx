import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DiagnosisProvider } from './contexts/DiagnosisContext';
import { BiosecurityProvider } from './contexts/BiosecurityContext';
import Header from './components/common/Header';
import HomePage from './pages/HomePage';
import AgePage from './pages/AgePage';
import SymptomsPage from './pages/SymptomsPage';
import ResultsPage from './pages/ResultsPage';
import DiseasePage from './pages/DiseasePage';
import BiosecurityHomePage from './pages/BiosecurityHomePage';
import BiosecurityAssessmentPage from './pages/BiosecurityAssessmentPage';
import BiosecurityResultsPage from './pages/BiosecurityResultsPage';
import './index.css';

function App() {
  return (
    <DiagnosisProvider>
      <BiosecurityProvider>
        <div className="portal-layout">
          <div className="portal-container">
            <div className="portal-card" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
              <Header />
              <main style={{ flex: 1, padding: '2rem 0' }}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/age" element={<AgePage />} />
                  <Route path="/symptoms" element={<SymptomsPage />} />
                  <Route path="/results" element={<ResultsPage />} />
                  <Route path="/disease/:id" element={<DiseasePage />} />
                  <Route path="/biosecurity" element={<BiosecurityHomePage />} />
                  <Route path="/biosecurity/assessment" element={<BiosecurityAssessmentPage />} />
                  <Route path="/biosecurity/results/:assessmentId" element={<BiosecurityResultsPage />} />
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
