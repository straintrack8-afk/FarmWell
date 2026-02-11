import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DosageCalculator from './components/DosageCalculator';

const FeedAdditivesApp = () => {
    return (
        <Routes>
            <Route path="/" element={<DosageCalculator />} />
        </Routes>
    );
};

export default FeedAdditivesApp;
