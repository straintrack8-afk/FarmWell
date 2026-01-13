import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HatcheryAuditProvider } from '../../contexts/HatcheryAuditContext';
import Dashboard from './Dashboard';
import AuditWizard from './audit/AuditWizard';
import AuditHistory from './AuditHistory';
import AuditReport from './AuditReport';
import '../../hatchery.css';

// Placeholder components (to be implemented)
import Settings from './Settings';

function HatcheryAuditRouter() {
    return (
        <HatcheryAuditProvider>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/new" element={<AuditWizard />} />
                <Route path="/history" element={<AuditHistory />} />
                <Route path="/audit/:id" element={<AuditWizard />} />
                <Route path="/report/:id" element={<AuditReport />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/poultry/hatchery-audit" replace />} />
            </Routes>
        </HatcheryAuditProvider>
    );
}

export default HatcheryAuditRouter;
