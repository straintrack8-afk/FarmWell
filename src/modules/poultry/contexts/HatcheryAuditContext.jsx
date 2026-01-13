import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
    getAllAudits,
    getAuditById,
    saveAudit,
    deleteAudit,
    getCurrentAudit,
    saveCurrentAudit,
    clearCurrentAudit,
    getSettings,
    saveSettings,
    getLocations,
    saveLocations,
    generateAuditId,
    getAuditStatistics,
    getStorageInfo,
    getAuditors,
    saveAuditors
} from '../utils/hatchery/storageManager';
import { calculateAuditSummary, identifyCriticalIssues } from '../utils/hatchery/scoringEngine';
import { AUDIT_STATUS, AUDIT_STEPS } from '../utils/hatcheryConstants';

const HatcheryAuditContext = createContext();

export function useHatcheryAudit() {
    const context = useContext(HatcheryAuditContext);
    if (!context) {
        throw new Error('useHatcheryAudit must be used within HatcheryAuditProvider');
    }
    return context;
}

export function HatcheryAuditProvider({ children }) {
    // State
    const [audits, setAudits] = useState([]);
    const [currentAudit, setCurrentAudit] = useState(null);
    const [settings, setSettingsState] = useState(null);
    const [locations, setLocationsState] = useState([]);
    const [auditors, setAuditorsState] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [storageInfo, setStorageInfoState] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load initial data
    useEffect(() => {
        loadData();
    }, []);

    const loadData = useCallback(() => {
        try {
            setIsLoading(true);

            const allAudits = getAllAudits();
            const current = getCurrentAudit();
            const userSettings = getSettings();
            const userLocations = getLocations();
            const userAuditors = getAuditors();
            const stats = getAuditStatistics();
            const storage = getStorageInfo();

            setAudits(allAudits);
            setCurrentAudit(current);
            setSettingsState(userSettings);
            setLocationsState(userLocations);
            setAuditorsState(userAuditors);
            setStatistics(stats);
            setStorageInfoState(storage);
            setError(null);
        } catch (err) {
            setError('Failed to load hatchery audit data');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Audit CRUD operations
    const createNewAudit = useCallback(() => {
        const newAudit = {
            id: Date.now().toString(),
            auditNumber: generateAuditId(),
            auditDate: new Date().toISOString(),
            auditor: '',
            location: '',
            auditType: 'scheduled',
            status: AUDIT_STATUS.DRAFT,
            currentStep: AUDIT_STEPS.INFO,

            // Data sections
            info: {
                auditDate: new Date().toISOString().split('T')[0],
                auditor: '',
                location: '',
                auditType: 'scheduled'
            },
            vaccineStorage: {
                temperatureOk: false,
                currentTemperature: null,
                tempLogAvailable: false,
                vaccineOnly: false,
                fifoFollowed: false,
                properPositioning: false,
                clearLabeling: false,
                notes: '',
                photos: []
            },
            equipment: [],
            techniques: {
                asepticTechnique: false,
                handHygiene: false,
                newSyringe: false,
                correctNeedle: false,
                expiryChecked: false,
                mixedCorrectly: false,
                recordsMaintained: false,
                spraySampleSize: 0,
                dropletUniformity: '',
                trayCoverage: 0,
                injectionSampleSize: 0,
                accurateInjectionPercent: 0,
                bleedingPercent: 0,
                wetNeckPercent: 0,
                noVaccinePercent: 0,
                notes: '',
                videos: []
            },
            samples: {},
            incubation: {
                startDate: null,
                endDate: null,
                temperature: 37,
                responsibleTech: ''
            },

            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        setCurrentAudit(newAudit);
        saveCurrentAudit(newAudit);

        return newAudit;
    }, []);

    const updateCurrentAudit = useCallback((updates) => {
        setCurrentAudit(prev => {
            const updated = { ...prev, ...updates, updatedAt: new Date().toISOString() };
            saveCurrentAudit(updated);
            return updated;
        });
    }, []);

    const updateAuditSection = useCallback((section, data) => {
        setCurrentAudit(prev => {
            const updated = {
                ...prev,
                [section]: data,
                updatedAt: new Date().toISOString()
            };
            saveCurrentAudit(updated);
            return updated;
        });
    }, []);

    const completeAudit = useCallback(() => {
        if (!currentAudit) return { success: false, error: 'No current audit' };

        try {
            // Calculate summary
            const summary = calculateAuditSummary(currentAudit);
            const issues = identifyCriticalIssues(currentAudit);

            const completedAudit = {
                ...currentAudit,
                status: AUDIT_STATUS.COMPLETED,
                completedAt: new Date().toISOString(),
                summary,
                issues
            };

            // Save to audits list
            const result = saveAudit(completedAudit);

            if (result.success) {
                // Clear current audit
                clearCurrentAudit();
                setCurrentAudit(null);

                // Reload data
                loadData();

                return { success: true, audit: completedAudit };
            }

            return result;
        } catch (err) {
            console.error('Error completing audit:', err);
            return { success: false, error: err.message };
        }
    }, [currentAudit, loadData]);

    const loadAudit = useCallback((id) => {
        const audit = getAuditById(id);
        if (audit) {
            setCurrentAudit(audit);
            saveCurrentAudit(audit);
            return { success: true, audit };
        }
        return { success: false, error: 'Audit not found' };
    }, []);

    const removeAudit = useCallback((id) => {
        const result = deleteAudit(id);
        if (result.success) {
            loadData();
        }
        return result;
    }, [loadData]);

    const discardCurrentAudit = useCallback(() => {
        clearCurrentAudit();
        setCurrentAudit(null);
    }, []);

    // Settings operations
    const updateSettings = useCallback((newSettings) => {
        const result = saveSettings(newSettings);
        if (result.success) {
            setSettingsState(newSettings);
        }
        return result;
    }, []);

    // Locations operations
    const updateLocations = useCallback((newLocations) => {
        const result = saveLocations(newLocations);
        if (result.success) {
            setLocationsState(newLocations);
        }
        return result;
    }, []);

    const addLocation = useCallback((location) => {
        const newLocations = [...locations, { ...location, id: Date.now().toString() }];
        return updateLocations(newLocations);
    }, [locations, updateLocations]);

    const removeLocation = useCallback((id) => {
        const newLocations = locations.filter(loc => loc.id !== id);
        return updateLocations(newLocations);
    }, [locations, updateLocations]);

    // Auditors operations
    const updateAuditors = useCallback((newAuditors) => {
        const result = saveAuditors(newAuditors);
        if (result.success) {
            setAuditorsState(newAuditors);
        }
        return result;
    }, []);

    const addAuditor = useCallback((auditor) => {
        const newAuditors = [...auditors, { ...auditor, id: Date.now().toString() }];
        return updateAuditors(newAuditors);
    }, [auditors, updateAuditors]);

    const removeAuditor = useCallback((id) => {
        const newAuditors = auditors.filter(aud => aud.id !== id);
        return updateAuditors(newAuditors);
    }, [auditors, updateAuditors]);

    // Navigation helpers
    const goToStep = useCallback((step) => {
        updateCurrentAudit({ currentStep: step });
    }, [updateCurrentAudit]);

    const nextStep = useCallback(() => {
        if (!currentAudit) return;

        const steps = Object.values(AUDIT_STEPS);
        const currentIndex = steps.indexOf(currentAudit.currentStep);

        if (currentIndex < steps.length - 1) {
            goToStep(steps[currentIndex + 1]);
        }
    }, [currentAudit, goToStep]);

    const previousStep = useCallback(() => {
        if (!currentAudit) return;

        const steps = Object.values(AUDIT_STEPS);
        const currentIndex = steps.indexOf(currentAudit.currentStep);

        if (currentIndex > 0) {
            goToStep(steps[currentIndex - 1]);
        }
    }, [currentAudit, goToStep]);

    // Refresh storage info
    const refreshStorageInfo = useCallback(() => {
        const storage = getStorageInfo();
        setStorageInfoState(storage);
        return storage;
    }, []);

    const value = {
        // State
        audits,
        currentAudit,
        settings,
        locations,
        auditors,
        statistics,
        storageInfo,
        isLoading,
        error,

        // Audit operations
        createNewAudit,
        updateCurrentAudit,
        updateAuditSection,
        completeAudit,
        loadAudit,
        removeAudit,
        discardCurrentAudit,

        // Settings operations
        updateSettings,

        // Locations operations
        updateLocations,
        addLocation,
        removeLocation,

        // Auditors operations
        updateAuditors,
        addAuditor,
        removeAuditor,

        // Navigation
        goToStep,
        nextStep,
        previousStep,

        // Utilities
        loadData,
        refreshStorageInfo
    };

    return (
        <HatcheryAuditContext.Provider value={value}>
            {children}
        </HatcheryAuditContext.Provider>
    );
}
