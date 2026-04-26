import React, { useState, useEffect } from 'react';
import { getLayerStd, getLayerPhase } from '../data/layerRangeData';

const WeeklyEntry = ({ flock, history, onSave, onClose, t, initialWeek, initialData }) => {
    const [week, setWeek] = useState(initialWeek || 1);
    const [bwActual, setBwActual] = useState('');
    const [epActual, setEpActual] = useState('');
    const [eggWeightActual, setEggWeightActual] = useState('');
    const [feedActual, setFeedActual] = useState('');
    const [mortality, setMortality] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (initialData) {
            setWeek(initialData.week || 1);
            setBwActual(initialData.bw_actual_g || '');
            setEpActual(initialData.ep_actual_pct || '');
            setEggWeightActual(initialData.egg_weight_actual_g || '');
            setFeedActual(initialData.feed_actual_g || '');
            setMortality(initialData.mortality || '');
            setNotes(initialData.notes || '');
        }
    }, [initialData]);

    const std = getLayerStd(week);
    const phase = getLayerPhase(week);
    const isProduction = week >= 19;

    const handleSubmit = (e) => {
        e.preventDefault();

        const entry = {
            week: parseInt(week),
            bw_actual_g: bwActual ? parseFloat(bwActual) : null,
            ep_actual_pct: isProduction && epActual ? parseFloat(epActual) : null,
            egg_weight_actual_g: isProduction && eggWeightActual ? parseFloat(eggWeightActual) : null,
            feed_actual_g: feedActual ? parseFloat(feedActual) : null,
            mortality: mortality ? parseInt(mortality) : 0,
            notes: notes || '',
            recorded_at: new Date().toISOString()
        };

        onSave(entry);
    };

    const getPhaseColor = (phase) => {
        switch (phase) {
            case 'Starter': return '#E8652A';
            case 'Developer': return '#1B7A6E';
            case 'Pre-Layer': return '#8B5CF6';
            case 'Layer': return '#C47A1A';
            default: return 'var(--fw-teal)';
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
        }}>
            <div style={{
                background: 'var(--fw-card)',
                borderRadius: '12px',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '1.5rem'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem'
                }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--fw-text)' }}>
                        {t('farmguide.weeklyEntry') || 'Weekly Entry'}
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            color: 'var(--fw-sub)',
                            padding: '0.25rem'
                        }}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Week Selector */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-text)', marginBottom: '0.5rem' }}>
                            {t('farmguide.week') || 'Week'} *
                        </label>
                        <select
                            value={week}
                            onChange={(e) => setWeek(parseInt(e.target.value))}
                            required
                            disabled={!!initialData}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                fontSize: '1rem',
                                border: '1px solid var(--fw-border)',
                                borderRadius: '8px',
                                background: initialData ? 'var(--fw-bg)' : 'var(--fw-card)',
                                color: 'var(--fw-text)',
                                fontFamily: 'inherit'
                            }}
                        >
                            {Array.from({ length: 80 }, (_, i) => i + 1).map(w => (
                                <option key={w} value={w}>Week {w}</option>
                            ))}
                        </select>
                    </div>

                    {/* Phase Display */}
                    <div style={{
                        padding: '0.75rem 1rem',
                        background: 'var(--fw-bg)',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <span style={{ fontSize: '0.875rem', color: 'var(--fw-sub)' }}>
                            {t('farmguide.phase') || 'Phase'}:
                        </span>
                        <span style={{
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: getPhaseColor(phase),
                            padding: '0.25rem 0.75rem',
                            background: 'var(--fw-card)',
                            borderRadius: '6px'
                        }}>
                            {phase}
                        </span>
                    </div>

                    {/* Standard Reference */}
                    {std && (
                        <div style={{
                            padding: '0.75rem 1rem',
                            background: 'var(--fw-teal-lt)',
                            border: '1px solid var(--fw-teal)',
                            borderRadius: '8px',
                            marginBottom: '1.5rem',
                            fontSize: '0.875rem'
                        }}>
                            <div style={{ fontWeight: '600', color: 'var(--fw-text)', marginBottom: '0.5rem' }}>
                                {t('farmguide.stdReference') || 'Standard Reference'}:
                            </div>
                            <div style={{ color: 'var(--fw-text)' }}>
                                BW: {std.bw_low}–{std.bw_high}g (avg {std.bw_avg}g)
                            </div>
                            {isProduction && std.ep_pct && (
                                <>
                                    <div style={{ color: 'var(--fw-text)' }}>
                                        EP%: {std.ep_pct.toFixed(1)}%
                                    </div>
                                    <div style={{ color: 'var(--fw-text)' }}>
                                        Egg Weight: {std.egg_weight_g.toFixed(1)}g
                                    </div>
                                </>
                            )}
                            <div style={{ color: 'var(--fw-text)' }}>
                                Feed Standard: <strong>{std.feed_g_day ? std.feed_g_day + ' g/day' : '—'}</strong>
                            </div>
                        </div>
                    )}

                    {/* BW Actual */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-text)', marginBottom: '0.5rem' }}>
                            {t('farmguide.colBWActual') || 'BW Actual'} (g) *
                        </label>
                        <input
                            type="number"
                            value={bwActual}
                            onChange={(e) => setBwActual(e.target.value)}
                            required
                            step="0.1"
                            min="0"
                            placeholder="e.g., 1890"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                fontSize: '1rem',
                                border: '1px solid var(--fw-border)',
                                borderRadius: '8px',
                                background: 'var(--fw-card)',
                                color: 'var(--fw-text)',
                                fontFamily: 'inherit'
                            }}
                        />
                    </div>

                    {/* Feed Actual - Available for ALL weeks */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-text)', marginBottom: '0.5rem' }}>
                            {t('farmguide.feedActual') || 'Feed Actual (g/day)'}
                        </label>
                        <input
                            type="number"
                            value={feedActual}
                            onChange={(e) => setFeedActual(e.target.value)}
                            step="0.1"
                            min="0"
                            placeholder="e.g., 115"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                fontSize: '1rem',
                                border: '1px solid var(--fw-border)',
                                borderRadius: '8px',
                                background: 'var(--fw-card)',
                                color: 'var(--fw-text)',
                                fontFamily: 'inherit'
                            }}
                        />
                        {std && std.feed_g_day && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--fw-sub)', marginTop: '0.25rem' }}>
                                {t('farmguide.feedStandard') || 'Standard'}: {std.feed_g_day} g/day
                            </div>
                        )}
                    </div>

                    {/* Production Phase Fields (W19-W80) */}
                    {isProduction && (
                        <>
                            {/* EP% */}
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-text)', marginBottom: '0.5rem' }}>
                                    {t('farmguide.epPctLabel') || 'Egg Production %'} *
                                </label>
                                <input
                                    type="number"
                                    value={epActual}
                                    onChange={(e) => setEpActual(e.target.value)}
                                    required={isProduction}
                                    step="0.1"
                                    min="0"
                                    max="100"
                                    placeholder="e.g., 93.5"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        fontSize: '1rem',
                                        border: '1px solid var(--fw-border)',
                                        borderRadius: '8px',
                                        background: 'var(--fw-card)',
                                        color: 'var(--fw-text)',
                                        fontFamily: 'inherit'
                                    }}
                                />
                            </div>

                            {/* Egg Weight */}
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-text)', marginBottom: '0.5rem' }}>
                                    {t('farmguide.eggWeightLabel') || 'Egg Weight (g)'} *
                                </label>
                                <input
                                    type="number"
                                    value={eggWeightActual}
                                    onChange={(e) => setEggWeightActual(e.target.value)}
                                    required={isProduction}
                                    step="0.1"
                                    min="0"
                                    placeholder="e.g., 64.2"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        fontSize: '1rem',
                                        border: '1px solid var(--fw-border)',
                                        borderRadius: '8px',
                                        background: 'var(--fw-card)',
                                        color: 'var(--fw-text)',
                                        fontFamily: 'inherit'
                                    }}
                                />
                            </div>
                        </>
                    )}

                    {/* Mortality */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-text)', marginBottom: '0.5rem' }}>
                            {t('farmguide.colMortality') || 'Mortality'} (birds)
                        </label>
                        <input
                            type="number"
                            value={mortality}
                            onChange={(e) => setMortality(e.target.value)}
                            min="0"
                            step="1"
                            placeholder="0"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                fontSize: '1rem',
                                border: '1px solid var(--fw-border)',
                                borderRadius: '8px',
                                background: 'var(--fw-card)',
                                color: 'var(--fw-text)',
                                fontFamily: 'inherit'
                            }}
                        />
                    </div>

                    {/* Notes */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-text)', marginBottom: '0.5rem' }}>
                            {t('farmguide.notes') || 'Notes'}
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows="3"
                            placeholder={t('farmguide.notesPlaceholder') || 'Optional notes...'}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                fontSize: '1rem',
                                border: '1px solid var(--fw-border)',
                                borderRadius: '8px',
                                background: 'var(--fw-card)',
                                color: 'var(--fw-text)',
                                fontFamily: 'inherit',
                                resize: 'vertical'
                            }}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                            type="submit"
                            style={{
                                flex: 1,
                                padding: '0.75rem',
                                background: 'var(--fw-teal)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            {initialData ? (t('farmguide.update') || 'Update Entry') : (t('common.save') || 'Save')}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                flex: 1,
                                padding: '0.75rem',
                                background: 'transparent',
                                color: 'var(--fw-sub)',
                                border: '2px solid var(--fw-border)',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            {t('common.cancel') || 'Cancel'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WeeklyEntry;
