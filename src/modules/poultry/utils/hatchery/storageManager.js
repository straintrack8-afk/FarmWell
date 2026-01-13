/**
 * Storage Manager for Hatchery Audit
 * Handles localStorage operations for audit data persistence
 * Falls back to in-memory storage if localStorage is unavailable
 */

import { HATCHERY_STORAGE_KEYS, DEFAULT_SETTINGS } from '../hatcheryConstants.js';

// In-memory storage fallback
let memoryStorage = {};

/**
 * Check if localStorage is available
 */
function isLocalStorageAvailable() {
    try {
        const testKey = '__localStorage_test__';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        return true;
    } catch (e) {
        console.warn('localStorage is not available, using in-memory storage fallback');
        return false;
    }
}

const useLocalStorage = isLocalStorageAvailable();

/**
 * Storage abstraction layer
 */
const storage = {
    getItem: (key) => {
        if (useLocalStorage) {
            return localStorage.getItem(key);
        }
        return memoryStorage[key] || null;
    },
    setItem: (key, value) => {
        if (useLocalStorage) {
            localStorage.setItem(key, value);
        } else {
            memoryStorage[key] = value;
        }
    },
    removeItem: (key) => {
        if (useLocalStorage) {
            localStorage.removeItem(key);
        } else {
            delete memoryStorage[key];
        }
    },
    clear: () => {
        if (useLocalStorage) {
            localStorage.clear();
        } else {
            memoryStorage = {};
        }
    }
};


/**
 * Generate unique audit ID
 * Format: HA-YYYYMMDD-XXX
 */
export function generateAuditId() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;

    // Get existing audits to determine sequence number
    const audits = getAllAudits();
    const todayAudits = audits.filter(audit =>
        audit.auditNumber && audit.auditNumber.includes(dateStr)
    );

    const sequence = String(todayAudits.length + 1).padStart(3, '0');

    return `HA-${dateStr}-${sequence}`;
}

/**
 * Generate unique sample ID
 * Format: HA-XXX-YYYYMMDD
 */
export function generateSampleId(auditNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;

    // Extract audit sequence from audit number
    const auditSeq = auditNumber ? auditNumber.split('-')[2] : '001';

    // Generate random 3-digit number for sample
    const sampleSeq = String(Math.floor(Math.random() * 1000)).padStart(3, '0');

    return `${auditSeq}-${dateStr}-${sampleSeq}`;
}

/**
 * Save audit to localStorage
 */
export function saveAudit(auditData) {
    try {
        const audits = getAllAudits();

        // Update timestamp
        auditData.updatedAt = new Date().toISOString();

        // Find existing audit index
        const existingIndex = audits.findIndex(a => a.id === auditData.id);

        if (existingIndex >= 0) {
            // Update existing audit
            audits[existingIndex] = auditData;
        } else {
            // Add new audit
            auditData.createdAt = auditData.createdAt || new Date().toISOString();
            audits.push(auditData);
        }

        storage.setItem(HATCHERY_STORAGE_KEYS.AUDITS, JSON.stringify(audits));
        storage.setItem(HATCHERY_STORAGE_KEYS.LAST_UPDATED, new Date().toISOString());

        return { success: true, audit: auditData };
    } catch (error) {
        console.error('Error saving audit:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get all audits from localStorage
 */
export function getAllAudits() {
    try {
        const data = storage.getItem(HATCHERY_STORAGE_KEYS.AUDITS);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading audits:', error);
        return [];
    }
}

/**
 * Get audit by ID
 */
export function getAuditById(id) {
    const audits = getAllAudits();
    return audits.find(audit => audit.id === id);
}

/**
 * Delete audit
 */
export function deleteAudit(id) {
    try {
        const audits = getAllAudits();
        const filtered = audits.filter(audit => audit.id !== id);
        storage.setItem(HATCHERY_STORAGE_KEYS.AUDITS, JSON.stringify(filtered));

        // Clear current audit if it's the one being deleted
        const currentAudit = getCurrentAudit();
        if (currentAudit && currentAudit.id === id) {
            clearCurrentAudit();
        }

        return { success: true };
    } catch (error) {
        console.error('Error deleting audit:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Save current audit (draft/in-progress)
 */
export function saveCurrentAudit(auditData) {
    try {
        storage.setItem(HATCHERY_STORAGE_KEYS.CURRENT_AUDIT, JSON.stringify(auditData));
        return { success: true };
    } catch (error) {
        console.error('Error saving current audit:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get current audit (draft/in-progress)
 */
export function getCurrentAudit() {
    try {
        const data = storage.getItem(HATCHERY_STORAGE_KEYS.CURRENT_AUDIT);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error loading current audit:', error);
        return null;
    }
}

/**
 * Clear current audit
 */
export function clearCurrentAudit() {
    storage.removeItem(HATCHERY_STORAGE_KEYS.CURRENT_AUDIT);
}

/**
 * Get settings
 */
export function getSettings() {
    try {
        const data = storage.getItem(HATCHERY_STORAGE_KEYS.SETTINGS);
        return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch (error) {
        console.error('Error loading settings:', error);
        return DEFAULT_SETTINGS;
    }
}

/**
 * Save settings
 */
export function saveSettings(settings) {
    try {
        storage.setItem(HATCHERY_STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
        return { success: true };
    } catch (error) {
        console.error('Error saving settings:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get locations
 */
export function getLocations() {
    try {
        const data = storage.getItem(HATCHERY_STORAGE_KEYS.LOCATIONS);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading locations:', error);
        return [];
    }
}

/**
 * Save locations
 */
export function saveLocations(locations) {
    try {
        storage.setItem(HATCHERY_STORAGE_KEYS.LOCATIONS, JSON.stringify(locations));
        return { success: true };
    } catch (error) {
        console.error('Error saving locations:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get auditors
 */
export function getAuditors() {
    try {
        const data = storage.getItem(HATCHERY_STORAGE_KEYS.AUDITORS);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading auditors:', error);
        return [];
    }
}

/**
 * Save auditors
 */
export function saveAuditors(auditors) {
    try {
        storage.setItem(HATCHERY_STORAGE_KEYS.AUDITORS, JSON.stringify(auditors));
        return { success: true };
    } catch (error) {
        console.error('Error saving auditors:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get storage usage information
 */
export function getStorageInfo() {
    try {
        if (!useLocalStorage) {
            // For in-memory storage, calculate size of memoryStorage object
            const memorySize = JSON.stringify(memoryStorage).length;
            const sizeKB = (memorySize / 1024).toFixed(2);
            const sizeMB = (memorySize / (1024 * 1024)).toFixed(2);
            return {
                totalBytes: memorySize,
                sizeKB,
                sizeMB,
                percentUsed: '0',
                isNearLimit: false,
                usingMemoryStorage: true
            };
        }

        let totalSize = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                totalSize += localStorage[key].length + key.length;
            }
        }

        // Convert to KB
        const sizeKB = (totalSize / 1024).toFixed(2);
        const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);

        // Estimate available space (typical limit is 5-10MB)
        const estimatedLimit = 5 * 1024 * 1024; // 5MB in bytes
        const percentUsed = ((totalSize / estimatedLimit) * 100).toFixed(1);

        return {
            totalBytes: totalSize,
            sizeKB,
            sizeMB,
            percentUsed,
            isNearLimit: percentUsed > 80,
            usingMemoryStorage: false
        };
    } catch (error) {
        console.error('Error getting storage info:', error);
        return null;
    }
}

/**
 * Export all audit data as JSON
 */
export function exportAllData() {
    try {
        const data = {
            audits: getAllAudits(),
            settings: getSettings(),
            locations: getLocations(),
            auditors: getAuditors(),
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        return JSON.stringify(data, null, 2);
    } catch (error) {
        console.error('Error exporting data:', error);
        return null;
    }
}

/**
 * Import audit data from JSON
 */
export function importData(jsonString) {
    try {
        const data = JSON.parse(jsonString);

        if (data.audits) {
            storage.setItem(HATCHERY_STORAGE_KEYS.AUDITS, JSON.stringify(data.audits));
        }
        if (data.settings) {
            storage.setItem(HATCHERY_STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
        }
        if (data.locations) {
            storage.setItem(HATCHERY_STORAGE_KEYS.LOCATIONS, JSON.stringify(data.locations));
        }
        if (data.auditors) {
            storage.setItem(HATCHERY_STORAGE_KEYS.AUDITORS, JSON.stringify(data.auditors));
        }

        return { success: true, message: 'Data imported successfully' };
    } catch (error) {
        console.error('Error importing data:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Clear all hatchery audit data
 */
export function clearAllData() {
    try {
        Object.values(HATCHERY_STORAGE_KEYS).forEach(key => {
            storage.removeItem(key);
        });
        return { success: true };
    } catch (error) {
        console.error('Error clearing data:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get audit statistics
 */
export function getAuditStatistics() {
    const audits = getAllAudits();
    const completedAudits = audits.filter(a => a.status === 'completed' || a.status === 'approved');

    if (completedAudits.length === 0) {
        return {
            totalAudits: 0,
            completedAudits: 0,
            averageScore: 0,
            lastAuditDate: null,
            goodCount: 0,
            fairCount: 0,
            poorCount: 0
        };
    }

    const classifications = completedAudits.map(a => a.summary?.environmental?.classification);

    return {
        totalAudits: audits.length,
        completedAudits: completedAudits.length,
        lastAuditDate: completedAudits[completedAudits.length - 1]?.auditDate,
        goodCount: classifications.filter(c => c === 'GOOD').length,
        fairCount: classifications.filter(c => c === 'FAIR').length,
        poorCount: classifications.filter(c => c === 'POOR').length
    };
}
