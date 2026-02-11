import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DosageCalculator from './components/DosageCalculator';
import ReferenceDataViewer from './components/ReferenceDataViewer';

const FeedAdditivesApp = () => {
    return (
        <Routes>
            <Route path="/" element={<DosageCalculator />} />
            <Route path="/reference-data" element={<ReferenceDataViewer />} />
        </Routes>
    );
};

export default FeedAdditivesApp;
