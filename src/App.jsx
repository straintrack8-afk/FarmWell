import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import SwineApp from './modules/swine/App';
import PoultryApp from './modules/poultry/App';

function App() {
    return (
        <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/swine/*" element={<SwineApp />} />
            <Route path="/poultry/*" element={<PoultryApp />} />
        </Routes>
    );
}

export default App;
