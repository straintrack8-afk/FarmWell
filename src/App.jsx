import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DiagnosisProvider } from './contexts/DiagnosisContext';
import Header from './components/common/Header';
import HomePage from './pages/HomePage';
import AgePage from './pages/AgePage';
import SymptomsPage from './pages/SymptomsPage';
import ResultsPage from './pages/ResultsPage';
import DiseasePage from './pages/DiseasePage';
import './index.css';

function App() {
  return (
    <DiagnosisProvider>
      <BrowserRouter>
        <div className="app">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/age" element={<AgePage />} />
              <Route path="/symptoms" element={<SymptomsPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/disease/:id" element={<DiseasePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </DiagnosisProvider>
  );
}

export default App;
