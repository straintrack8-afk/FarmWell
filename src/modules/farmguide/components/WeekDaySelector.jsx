import React from 'react';
import { useTranslation } from '../../../hooks/useTranslation';

const WeekDaySelector = ({
    mode = 'weekday',           // 'phase' for Layer | 'weekday' for Broiler/Color Chicken
    totalWeeks,
    rearingEndWeek,
    selectedWeek,
    selectedDay,
    selectedPhase,              // 'rearing' | 'production' (only for mode='phase')
    onWeekChange,
    onDayChange,
    onPhaseChange,              // (phase) => void (only for mode='phase')
    showDailyToggle = false,
    selectedMode = 'weekly',
    onModeChange,
}) => {
    const { t } = useTranslation();

    // Phase mode logic (for Layer)
    if (mode === 'phase') {
        const currentPhase = selectedPhase || (selectedWeek <= rearingEndWeek ? 'rearing' : 'production');
        const minWeek = currentPhase === 'rearing' ? 1 : (rearingEndWeek + 1);
        const maxWeek = currentPhase === 'rearing' ? rearingEndWeek : totalWeeks;
        
        const isPrevDisabled = selectedWeek <= minWeek;
        const isNextDisabled = selectedWeek >= maxWeek;

        const handlePrev = () => {
            if (!isPrevDisabled) {
                onWeekChange(selectedWeek - 1);
            }
        };

        const handleNext = () => {
            if (!isNextDisabled) {
                onWeekChange(selectedWeek + 1);
            }
        };

        const handleDropdownChange = (e) => {
            onWeekChange(parseInt(e.target.value));
        };

        const handlePhaseToggle = (phase) => {
            if (onPhaseChange) {
                onPhaseChange(phase);
            }
        };

        // Generate scoped dropdown options based on current phase
        const weekOptions = [];
        for (let i = minWeek; i <= maxWeek; i++) {
            weekOptions.push(i);
        }

        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flexWrap: 'wrap',
                marginBottom: '1.5rem'
            }}>
                {/* Phase Toggle */}
                <div style={{
                    display: 'flex',
                    border: '1px solid var(--fw-border)',
                    borderRadius: '8px',
                    overflow: 'hidden'
                }}>
                    <button
                        onClick={() => handlePhaseToggle('rearing')}
                        style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: currentPhase === 'rearing' ? 'white' : 'var(--fw-sub)',
                            background: currentPhase === 'rearing' ? '#0C3830' : 'transparent',
                            border: 'none',
                            borderRight: '1px solid var(--fw-border)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontFamily: 'inherit'
                        }}
                    >
                        {t('farmguide.phase_rearing') || 'Rearing'}
                    </button>
                    <button
                        onClick={() => handlePhaseToggle('production')}
                        style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: currentPhase === 'production' ? 'white' : 'var(--fw-sub)',
                            background: currentPhase === 'production' ? '#854F0B' : 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontFamily: 'inherit'
                        }}
                    >
                        {t('farmguide.phase_production') || 'Production'}
                    </button>
                </div>

                {/* Prev Arrow */}
                <button
                    onClick={handlePrev}
                    disabled={isPrevDisabled}
                    style={{
                        width: '32px',
                        height: '36px',
                        border: '1px solid var(--fw-border)',
                        borderRadius: '8px',
                        background: 'var(--fw-card)',
                        color: 'var(--fw-text)',
                        fontSize: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: isPrevDisabled ? 'default' : 'pointer',
                        opacity: isPrevDisabled ? 0.3 : 1,
                        pointerEvents: isPrevDisabled ? 'none' : 'auto',
                        transition: 'all 0.2s',
                        fontFamily: 'inherit'
                    }}
                >
                    ‹
                </button>

                {/* Scoped Dropdown */}
                <select
                    value={selectedWeek}
                    onChange={handleDropdownChange}
                    style={{
                        width: '130px',
                        height: '36px',
                        fontSize: '14px',
                        border: '1px solid var(--fw-border)',
                        borderRadius: '8px',
                        background: 'var(--fw-card)',
                        color: 'var(--fw-text)',
                        padding: '0 0.75rem',
                        cursor: 'pointer',
                        fontFamily: 'inherit'
                    }}
                >
                    {weekOptions.map(week => (
                        <option key={week} value={week}>
                            {t('farmguide.week') || 'Week'} {week}
                        </option>
                    ))}
                </select>

                {/* Next Arrow */}
                <button
                    onClick={handleNext}
                    disabled={isNextDisabled}
                    style={{
                        width: '32px',
                        height: '36px',
                        border: '1px solid var(--fw-border)',
                        borderRadius: '8px',
                        background: 'var(--fw-card)',
                        color: 'var(--fw-text)',
                        fontSize: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: isNextDisabled ? 'default' : 'pointer',
                        opacity: isNextDisabled ? 0.3 : 1,
                        pointerEvents: isNextDisabled ? 'none' : 'auto',
                        transition: 'all 0.2s',
                        fontFamily: 'inherit'
                    }}
                >
                    ›
                </button>
            </div>
        );
    }

    // Weekday mode logic (for Broiler/Color Chicken) - original implementation
    const phase = selectedWeek <= rearingEndWeek ? 'rearing' : 'production';
    
    // Calculate boundaries based on mode
    const maxDay = totalWeeks * 7;
    const startDayOfWeek = (selectedWeek - 1) * 7 + 1;
    const endDayOfWeek = selectedWeek * 7;
    
    const isPrevDisabled = selectedMode === 'daily' 
        ? selectedDay <= 1 
        : selectedWeek <= 1;
    const isNextDisabled = selectedMode === 'daily' 
        ? selectedDay >= totalWeeks * 7 
        : selectedWeek >= totalWeeks;

    const handlePrev = () => {
        if (!isPrevDisabled) {
            if (selectedMode === 'daily') {
                onDayChange(selectedDay - 1);
            } else {
                onWeekChange(selectedWeek - 1);
            }
        }
    };

    const handleNext = () => {
        if (!isNextDisabled) {
            if (selectedMode === 'daily') {
                onDayChange(selectedDay + 1);
            } else {
                onWeekChange(selectedWeek + 1);
            }
        }
    };

    const handleDropdownChange = (e) => {
        if (selectedMode === 'daily') {
            onDayChange(parseInt(e.target.value));
        } else {
            onWeekChange(parseInt(e.target.value));
        }
    };

    const getPhaseLabel = (week) => {
        return week <= rearingEndWeek 
            ? (t('farmguide.phase_rearing') || 'Rearing')
            : (t('farmguide.phase_production') || 'Production');
    };

    const phaseBadgeStyle = phase === 'rearing' 
        ? {
            background: '#E1F5EE',
            color: '#0F6E56',
            borderRadius: '20px',
            padding: '4px 12px',
            fontSize: '12px',
            fontWeight: '500',
            whiteSpace: 'nowrap'
        }
        : {
            background: '#FFF3E0',
            color: '#E65100',
            borderRadius: '20px',
            padding: '4px 12px',
            fontSize: '12px',
            fontWeight: '500',
            whiteSpace: 'nowrap'
        };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap',
            marginBottom: '1.5rem'
        }}>
            {/* Weekly/Daily Toggle */}
            {showDailyToggle && (
                <div style={{
                    display: 'flex',
                    border: '1px solid var(--fw-border)',
                    borderRadius: '8px',
                    overflow: 'hidden'
                }}>
                    <button
                        onClick={() => onModeChange('weekly')}
                        style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: selectedMode === 'weekly' ? 'white' : 'var(--fw-sub)',
                            background: selectedMode === 'weekly' ? '#0C3830' : 'transparent',
                            border: 'none',
                            borderRight: '1px solid var(--fw-border)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontFamily: 'inherit'
                        }}
                    >
                        {t('farmguide.weekly') || 'Weekly'}
                    </button>
                    <button
                        onClick={() => onModeChange('daily')}
                        style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: selectedMode === 'daily' ? 'white' : 'var(--fw-sub)',
                            background: selectedMode === 'daily' ? '#0C3830' : 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontFamily: 'inherit'
                        }}
                    >
                        {t('farmguide.daily') || 'Daily'}
                    </button>
                </div>
            )}

            {/* Prev Arrow */}
            <button
                onClick={handlePrev}
                disabled={isPrevDisabled}
                style={{
                    width: '32px',
                    height: '36px',
                    border: '1px solid var(--fw-border)',
                    borderRadius: '8px',
                    background: 'var(--fw-card)',
                    color: 'var(--fw-text)',
                    fontSize: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: isPrevDisabled ? 'default' : 'pointer',
                    opacity: isPrevDisabled ? 0.3 : 1,
                    pointerEvents: isPrevDisabled ? 'none' : 'auto',
                    transition: 'all 0.2s',
                    fontFamily: 'inherit'
                }}
            >
                ‹
            </button>

            {/* Dropdown */}
            <select
                value={selectedMode === 'daily' ? selectedDay : selectedWeek}
                onChange={handleDropdownChange}
                style={{
                    width: '180px',
                    height: '36px',
                    fontSize: '14px',
                    border: '1px solid var(--fw-border)',
                    borderRadius: '8px',
                    background: 'var(--fw-card)',
                    color: 'var(--fw-text)',
                    padding: '0 0.75rem',
                    cursor: 'pointer',
                    fontFamily: 'inherit'
                }}
            >
                {selectedMode === 'daily' ? (
                    Array.from({ length: totalWeeks * 7 }, (_, i) => i + 1).map(day => (
                        <option key={day} value={day}>
                            {t('farmguide.day') || 'Day'} {day}
                        </option>
                    ))
                ) : (
                    Array.from({ length: totalWeeks }, (_, i) => i + 1).map(week => (
                        <option key={week} value={week}>
                            {t('farmguide.week') || 'Week'} {week}
                        </option>
                    ))
                )}
            </select>

            {/* Next Arrow */}
            <button
                onClick={handleNext}
                disabled={isNextDisabled}
                style={{
                    width: '32px',
                    height: '36px',
                    border: '1px solid var(--fw-border)',
                    borderRadius: '8px',
                    background: 'var(--fw-card)',
                    color: 'var(--fw-text)',
                    fontSize: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: isNextDisabled ? 'default' : 'pointer',
                    opacity: isNextDisabled ? 0.3 : 1,
                    pointerEvents: isNextDisabled ? 'none' : 'auto',
                    transition: 'all 0.2s',
                    fontFamily: 'inherit'
                }}
            >
                ›
            </button>
        </div>
    );
};

export default WeekDaySelector;
