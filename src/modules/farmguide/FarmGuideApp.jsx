import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FarmGuideHome from './pages/FarmGuideHome';
import BreedSelector from './pages/BreedSelector';
import SexSelector from './pages/SexSelector';
import ManagementGuide from './pages/ManagementGuide';
import GrowthChart from './pages/GrowthChart';
import FlockSaya from './pages/FlockSaya';

function FarmGuideApp() {
    return (
        <Routes>
            <Route path="/" element={<FarmGuideHome />} />
            <Route path=":module/pilih-jenis" element={<BreedSelector />} />
            <Route path=":module/pilih-kelamin" element={<SexSelector />} />
            <Route path=":module/panduan" element={<ManagementGuide />} />
            <Route path=":module/grafik" element={<GrowthChart />} />
            <Route path=":module/flock-saya" element={<FlockSaya />} />
        </Routes>
    );
}

export default FarmGuideApp;
