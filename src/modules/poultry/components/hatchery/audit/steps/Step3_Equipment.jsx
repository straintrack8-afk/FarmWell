import React, { useState } from 'react';
import { useHatcheryAudit } from '../../../../contexts/HatcheryAuditContext';
import { EQUIPMENT_TYPES } from '../../../../utils/hatcheryConstants';
import PhotoUpload from '../../common/PhotoUpload';

function Step3_Equipment() {
    const { currentAudit, updateAuditSection } = useHatcheryAudit();
    const equipment = currentAudit?.equipment || [];
    const [editingIndex, setEditingIndex] = useState(null);

    const handleAddEquipment = () => {
        const newEquipment = {
            id: Date.now().toString(),
            type: EQUIPMENT_TYPES.SPRAY_CABINET,
            name: '',
            quantity: 1,
            conditionGood: false,
            maintenanceCurrent: false,
            lastServiceDate: '',
            dosesSufficient: false,
            dosesAvailable: 0,
            cleaningFollowed: false,
            sparePartsAdequate: false,
            notes: '',
            photos: []
        };
        updateAuditSection('equipment', [...equipment, newEquipment]);
        setEditingIndex(equipment.length);
    };

    const handleUpdateEquipment = (index, field, value) => {
        const updated = [...equipment];
        updated[index] = { ...updated[index], [field]: value };
        updateAuditSection('equipment', updated);
    };

    const handleDeleteEquipment = (index) => {
        if (confirm('Delete this equipment entry?')) {
            const updated = equipment.filter((_, i) => i !== index);
            updateAuditSection('equipment', updated);
            if (editingIndex === index) setEditingIndex(null);
        }
    };

    const calculateEquipmentScore = (eq) => {
        const checks = [
            eq.conditionGood,
            eq.maintenanceCurrent,
            eq.dosesSufficient,
            eq.cleaningFollowed,
            eq.sparePartsAdequate
        ];
        const passed = checks.filter(c => c === true).length;
        return Math.round((passed / checks.length) * 100);
    };

    const totalScore = equipment.length > 0
        ? Math.round(equipment.reduce((sum, eq) => sum + calculateEquipmentScore(eq), 0) / equipment.length)
        : 0;

    return (
        <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                Vaccination Equipment Assessment
            </h2>
            <p style={{ color: '#6B7280', marginBottom: '2rem' }}>
                Assess the condition and maintenance status of vaccination equipment.
            </p>

            {/* Overall Score */}
            {equipment.length > 0 && (
                <div className="alert info" style={{ marginBottom: '2rem' }}>
                    <span>📊</span>
                    <div>
                        <strong>Overall Equipment Score:</strong> {totalScore}%
                        <br />
                        <span style={{ fontSize: '0.875rem' }}>
                            {equipment.length} equipment item{equipment.length !== 1 ? 's' : ''} assessed
                        </span>
                    </div>
                </div>
            )}

            {/* Equipment List */}
            {equipment.map((eq, index) => (
                <div key={eq.id} className="hatchery-card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>
                            Equipment #{index + 1} - {calculateEquipmentScore(eq)}%
                        </h3>
                        <button
                            onClick={() => handleDeleteEquipment(index)}
                            className="btn-hatchery btn-danger"
                            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                        >
                            Delete
                        </button>
                    </div>

                    <div className="form-group">
                        <label className="form-label required">Equipment Type</label>
                        <select
                            className="form-select"
                            value={eq.type}
                            onChange={(e) => handleUpdateEquipment(index, 'type', e.target.value)}
                        >
                            <option value={EQUIPMENT_TYPES.SPRAY_CABINET}>Spray Cabinet (Henke Sass Wolf)</option>
                            <option value={EQUIPMENT_TYPES.PNEUMATIC_VACCINATOR}>Pneumatic Vaccinator</option>
                            <option value={EQUIPMENT_TYPES.OTHER}>Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Equipment Name/Model</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="e.g., Henke Sass Wolf Model X"
                            value={eq.name || ''}
                            onChange={(e) => handleUpdateEquipment(index, 'name', e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Quantity</label>
                        <input
                            type="number"
                            min="1"
                            className="form-input"
                            value={eq.quantity || 1}
                            onChange={(e) => handleUpdateEquipment(index, 'quantity', parseInt(e.target.value))}
                            style={{ maxWidth: '150px' }}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Last Service Date</label>
                        <input
                            type="date"
                            className="form-input"
                            value={eq.lastServiceDate || ''}
                            onChange={(e) => handleUpdateEquipment(index, 'lastServiceDate', e.target.value)}
                            style={{ maxWidth: '200px' }}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Available Doses</label>
                        <input
                            type="number"
                            min="0"
                            className="form-input"
                            placeholder="Number of doses available"
                            value={eq.dosesAvailable || 0}
                            onChange={(e) => handleUpdateEquipment(index, 'dosesAvailable', parseInt(e.target.value))}
                            style={{ maxWidth: '200px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem' }}>
                            Condition Checks
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label className="checkbox-group">
                                <input
                                    type="checkbox"
                                    checked={eq.conditionGood || false}
                                    onChange={(e) => handleUpdateEquipment(index, 'conditionGood', e.target.checked)}
                                />
                                <span className="checkbox-label">Equipment in good working condition</span>
                            </label>
                            <label className="checkbox-group">
                                <input
                                    type="checkbox"
                                    checked={eq.maintenanceCurrent || false}
                                    onChange={(e) => handleUpdateEquipment(index, 'maintenanceCurrent', e.target.checked)}
                                />
                                <span className="checkbox-label">Regular maintenance performed</span>
                            </label>
                            <label className="checkbox-group">
                                <input
                                    type="checkbox"
                                    checked={eq.dosesSufficient || false}
                                    onChange={(e) => handleUpdateEquipment(index, 'dosesSufficient', e.target.checked)}
                                />
                                <span className="checkbox-label">Sufficient vaccine doses available</span>
                            </label>
                            <label className="checkbox-group">
                                <input
                                    type="checkbox"
                                    checked={eq.cleaningFollowed || false}
                                    onChange={(e) => handleUpdateEquipment(index, 'cleaningFollowed', e.target.checked)}
                                />
                                <span className="checkbox-label">Cleaning & disinfection protocol followed</span>
                            </label>
                            <label className="checkbox-group">
                                <input
                                    type="checkbox"
                                    checked={eq.sparePartsAdequate || false}
                                    onChange={(e) => handleUpdateEquipment(index, 'sparePartsAdequate', e.target.checked)}
                                />
                                <span className="checkbox-label">Spare parts inventory adequate</span>
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Notes</label>
                        <textarea
                            className="form-textarea"
                            placeholder="Any issues or observations..."
                            value={eq.notes || ''}
                            onChange={(e) => handleUpdateEquipment(index, 'notes', e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Photos</label>
                        <PhotoUpload
                            photos={eq.photos || []}
                            onPhotosChange={(photos) => handleUpdateEquipment(index, 'photos', photos)}
                            maxPhotos={3}
                        />
                    </div>
                </div>
            ))}

            {/* Add Equipment Button */}
            <button
                onClick={handleAddEquipment}
                className="btn-hatchery btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
            >
                ➕ Add Equipment
            </button>

            {equipment.length === 0 && (
                <div className="alert info" style={{ marginTop: '1rem' }}>
                    <span>ℹ️</span>
                    <div>
                        Click "Add Equipment" to start assessing vaccination equipment.
                    </div>
                </div>
            )}
        </div>
    );
}

export default Step3_Equipment;
