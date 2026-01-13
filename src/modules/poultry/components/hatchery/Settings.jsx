import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHatcheryAudit } from '../../contexts/HatcheryAuditContext';
import { DEFAULT_SETTINGS, SCORING } from '../../utils/hatcheryConstants';

function Settings() {
    const navigate = useNavigate();
    const {
        settings,
        updateSettings,
        locations,
        addLocation,
        removeLocation,
        auditors,
        addAuditor,
        removeAuditor,
        loadData,
        refreshStorageInfo
    } = useHatcheryAudit();

    const [activeTab, setActiveTab] = useState('general');
    const [localSettings, setLocalSettings] = useState(null);
    const [newLocation, setNewLocation] = useState({ name: '', code: '' });
    const [newAuditor, setNewAuditor] = useState({ name: '', role: 'Auditor' });
    const [showSaveSuccess, setShowSaveSuccess] = useState(false);
    const [storageStats, setStorageStats] = useState(null);

    useEffect(() => {
        if (settings) {
            setLocalSettings(settings);
        }
    }, [settings]);

    useEffect(() => {
        if (activeTab === 'data') {
            const stats = refreshStorageInfo();
            setStorageStats(stats);
        }
    }, [activeTab, refreshStorageInfo]);

    const handleSaveSettings = () => {
        updateSettings(localSettings);
        setShowSaveSuccess(true);
        setTimeout(() => setShowSaveSuccess(false), 3000);
    };

    const handleAddLocation = (e) => {
        e.preventDefault();
        if (newLocation.name && newLocation.code) {
            addLocation(newLocation);
            setNewLocation({ name: '', code: '' });
        }
    };

    const handleAddAuditor = (e) => {
        e.preventDefault();
        if (newAuditor.name) {
            addAuditor(newAuditor);
            setNewAuditor({ name: '', role: 'Auditor' });
        }
    };

    const handleExportData = () => {
        import('../../utils/hatchery/storageManager').then(module => {
            const json = module.exportAllData();
            if (json) {
                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `farmwell_hatchery_backup_${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        });
    };

    const handleImportData = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                import('../../utils/hatchery/storageManager').then(module => {
                    const result = module.importData(event.target.result);
                    if (result.success) {
                        alert('Data imported successfully. The page will reload.');
                        window.location.reload();
                    } else {
                        alert('Import failed: ' + result.error);
                    }
                });
            };
            reader.readAsText(file);
        }
    };

    const handleClearData = () => {
        if (confirm('DANGER: This will permanently delete ALL audit history, settings, and configurations. This action cannot be undone. Are you sure?')) {
            if (confirm('Please confirm one more time: DELETE ALL DATA?')) {
                import('../../utils/hatchery/storageManager').then(module => {
                    module.clearAllData();
                    window.location.reload();
                });
            }
        }
    };

    if (!localSettings) return <div className="p-8 text-center">Loading settings...</div>;

    return (
        <div className="hatchery-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>Settings</h1>
                    <p style={{ color: '#6B7280' }}>Configure generic settings, locations, and data management</p>
                </div>
                <button
                    onClick={() => navigate('/poultry/hatchery-audit')}
                    className="btn-hatchery btn-outline"
                >
                    ← Back to Dashboard
                </button>
            </div>

            {showSaveSuccess && (
                <div className="alert success" style={{ marginBottom: '1rem' }}>
                    <span>✓</span>
                    Settings saved successfully
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                {/* Tabs */}
                <div style={{ display: 'flex', borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
                    {['general', 'locations', 'auditors', 'scoring', 'data'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: '1rem 1.5rem',
                                borderBottom: activeTab === tab ? '2px solid #059669' : '2px solid transparent',
                                color: activeTab === tab ? '#059669' : '#6B7280',
                                fontWeight: activeTab === tab ? '600' : '500',
                                textTransform: 'capitalize',
                                background: 'none',
                                border: 'none',
                                borderBottomWidth: '2px',
                                borderBottomStyle: 'solid',
                                cursor: 'pointer'
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    {/* GENERAL TAB */}
                    {activeTab === 'general' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Audit Preferences</h3>
                                <div className="grid gap-6 max-w-xl">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Audit Frequency
                                        </label>
                                        <select
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            value={localSettings.frequency}
                                            onChange={e => setLocalSettings({ ...localSettings, frequency: e.target.value })}
                                        >
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly">Monthly</option>
                                            <option value="quarterly">Quarterly</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Reminder (Days before due)
                                        </label>
                                        <input
                                            type="number"
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            value={localSettings.reminderDaysBefore}
                                            onChange={e => setLocalSettings({ ...localSettings, reminderDaysBefore: parseInt(e.target.value) })}
                                            min="1"
                                            max="30"
                                        />
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="autoAssign"
                                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                            checked={localSettings.autoAssign}
                                            onChange={e => setLocalSettings({ ...localSettings, autoAssign: e.target.checked })}
                                        />
                                        <label htmlFor="autoAssign" className="ml-2 block text-sm text-gray-900">
                                            Auto-assign audit numbers based on date
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <button
                                    onClick={handleSaveSettings}
                                    className="btn-hatchery btn-primary"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}

                    {/* LOCATIONS TAB */}
                    {activeTab === 'locations' && (
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Manage Locations</h3>

                            <form onSubmit={handleAddLocation} className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                    <label className="block text-xs text-gray-500 mb-1">Location Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Hatchery A"
                                        className="w-full rounded-md border-gray-300 shadow-sm text-sm"
                                        value={newLocation.name}
                                        onChange={e => setNewLocation({ ...newLocation, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="w-32">
                                    <label className="block text-xs text-gray-500 mb-1">Code</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. HA"
                                        className="w-full rounded-md border-gray-300 shadow-sm text-sm"
                                        value={newLocation.code}
                                        onChange={e => setNewLocation({ ...newLocation, code: e.target.value.toUpperCase() })}
                                        required
                                    />
                                </div>
                                <div className="flex items-end">
                                    <button type="submit" className="btn-hatchery btn-secondary">
                                        Add
                                    </button>
                                </div>
                            </form>

                            <div className="border rounded-md overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {locations.length === 0 ? (
                                            <tr>
                                                <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                                                    No locations added yet.
                                                </td>
                                            </tr>
                                        ) : (
                                            locations.map(loc => (
                                                <tr key={loc.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{loc.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{loc.code}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button
                                                            onClick={() => removeLocation(loc.id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* AUDITORS TAB */}
                    {activeTab === 'auditors' && (
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Manage Auditors</h3>

                            <form onSubmit={handleAddAuditor} className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                    <label className="block text-xs text-gray-500 mb-1">Auditor Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. John Doe"
                                        className="w-full rounded-md border-gray-300 shadow-sm text-sm"
                                        value={newAuditor.name}
                                        onChange={e => setNewAuditor({ ...newAuditor, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="w-40">
                                    <label className="block text-xs text-gray-500 mb-1">Role</label>
                                    <select
                                        className="w-full rounded-md border-gray-300 shadow-sm text-sm"
                                        value={newAuditor.role}
                                        onChange={e => setNewAuditor({ ...newAuditor, role: e.target.value })}
                                    >
                                        <option value="Auditor">Auditor</option>
                                        <option value="Manager">Manager</option>
                                        <option value="External">External</option>
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <button type="submit" className="btn-hatchery btn-secondary">
                                        Add
                                    </button>
                                </div>
                            </form>

                            <div className="border rounded-md overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {(!auditors || auditors.length === 0) ? (
                                            <tr>
                                                <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                                                    No auditors added yet.
                                                </td>
                                            </tr>
                                        ) : (
                                            auditors.map(aud => (
                                                <tr key={aud.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{aud.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{aud.role}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button
                                                            onClick={() => removeAuditor(aud.id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* SCORING TAB */}
                    {activeTab === 'scoring' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Scoring Thresholds</h3>
                                <p className="text-sm text-gray-500 mb-6">
                                    Define the score boundaries for environmental assessment classifications.
                                </p>

                                <div className="grid gap-6 max-w-xl">
                                    <div className="p-4 rounded-lg bg-green-50 border border-green-100">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold text-green-800">GOOD</span>
                                            <span className="text-sm text-green-600">Up to score {localSettings.scoringThresholds?.good || 28}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="20"
                                            max="35"
                                            value={localSettings.scoringThresholds?.good || 28}
                                            onChange={e => setLocalSettings({
                                                ...localSettings,
                                                scoringThresholds: {
                                                    ...localSettings.scoringThresholds,
                                                    good: parseInt(e.target.value)
                                                }
                                            })}
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-100">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold text-yellow-800">FAIR</span>
                                            <span className="text-sm text-yellow-600">
                                                {parseInt(localSettings.scoringThresholds?.good || 28) + 1} to {localSettings.scoringThresholds?.fair || 40}
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min={parseInt(localSettings.scoringThresholds?.good || 28) + 5}
                                            max="50"
                                            value={localSettings.scoringThresholds?.fair || 40}
                                            onChange={e => setLocalSettings({
                                                ...localSettings,
                                                scoringThresholds: {
                                                    ...localSettings.scoringThresholds,
                                                    fair: parseInt(e.target.value)
                                                }
                                            })}
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="p-4 rounded-lg bg-red-50 border border-red-100">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-red-800">POOR</span>
                                            <span className="text-sm text-red-600">Greater than {localSettings.scoringThresholds?.fair || 40}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <button
                                    onClick={handleSaveSettings}
                                    className="btn-hatchery btn-primary"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}

                    {/* DATA TAB */}
                    {activeTab === 'data' && (
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Data Management</h3>

                                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                                    <h4 className="font-medium text-blue-900 mb-2">Storage Usage</h4>
                                    {storageStats ? (
                                        <div className="text-sm text-blue-800">
                                            <p>Used: {storageStats.sizeKB} KB ({storageStats.percentUsed}%)</p>
                                            <div className="w-full bg-blue-200 rounded-full h-2.5 mt-2">
                                                <div
                                                    className="bg-blue-600 h-2.5 rounded-full"
                                                    style={{ width: `${Math.min(parseFloat(storageStats.percentUsed), 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-blue-800">Checking storage...</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div className="border border-gray-200 rounded-lg p-5">
                                        <h4 className="font-medium text-gray-900 mb-2">Export Data</h4>
                                        <p className="text-sm text-gray-500 mb-4">
                                            Download a backup of all audits, settings, and locations.
                                        </p>
                                        <button
                                            onClick={handleExportData}
                                            className="btn-hatchery btn-secondary w-full"
                                        >
                                            Export JSON
                                        </button>
                                    </div>

                                    <div className="border border-gray-200 rounded-lg p-5">
                                        <h4 className="font-medium text-gray-900 mb-2">Import Data</h4>
                                        <p className="text-sm text-gray-500 mb-4">
                                            Restore data from a previously exported JSON file.
                                        </p>
                                        <label className="btn-hatchery btn-outline w-full text-center cursor-pointer block">
                                            <span>Select File</span>
                                            <input
                                                type="file"
                                                accept=".json"
                                                className="hidden"
                                                onChange={handleImportData}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-200">
                                <h3 className="text-lg font-medium text-red-600 mb-4">Danger Zone</h3>
                                <div className="bg-red-50 border border-red-200 rounded-lg p-5">
                                    <h4 className="font-medium text-red-900 mb-2">Clear All Data</h4>
                                    <p className="text-sm text-red-700 mb-4">
                                        This will permanently delete all local data, including audits and settings.
                                    </p>
                                    <button
                                        onClick={handleClearData}
                                        className="btn-hatchery w-full"
                                        style={{ backgroundColor: '#EF4444', color: 'white', border: 'none' }}
                                    >
                                        Clear Everything
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Settings;
