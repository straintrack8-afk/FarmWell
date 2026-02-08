import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import WelcomePage from './pages/WelcomePage';
import SwineApp from './modules/swine/App';
import PoultryApp from './modules/poultry/App';
import FeedAdditivesApp from './modules/feed-additives/App';

function App() {
    return (
        <LanguageProvider>
            <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/feed-additives/*" element={<FeedAdditivesApp />} />
                <Route path="/swine/*" element={<SwineApp />} />
                <Route path="/poultry/*" element={<PoultryApp />} />
            </Routes>
        </LanguageProvider>
    );
}

export default App;
