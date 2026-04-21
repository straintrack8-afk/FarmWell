import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FarmGuideHome from './pages/FarmGuideHome';
import BreedSelector from './pages/BreedSelector';
import ManagementGuide from './pages/ManagementGuide';
import GrowthChart from './pages/GrowthChart';
import FlockSaya from './pages/FlockSaya';

function FarmGuideApp() {
    return (
        <Routes>
            <Route path="/" element={<FarmGuideHome />} />
            <Route path=":module/pilih-jenis" element={<BreedSelector />} />
            <Route path=":module/panduan" element={<ManagementGuide />} />
            <Route path="ps/broiler/panduan" element={<ManagementGuide module="parent_stock" />} />
            <Route path="ps/layer/panduan" element={<ManagementGuide module="layer_ps" />} />
            <Route path=":module/grafik" element={<GrowthChart />} />
            <Route path=":module/flock-saya" element={<FlockSaya />} />
        </Routes>
    );
}

export default FarmGuideApp;
