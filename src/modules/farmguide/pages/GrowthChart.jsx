import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from '../../../hooks/useTranslation';
import SharedTopNav from '../../../components/SharedTopNav';
import { BROILER_RANGE } from '../data/broilerRangeData';
import { getColorRange } from '../data/colorChickenRangeData';
import '../../../portal.css';

const BROILER_WEEKLY_BW_STANDARD = BROILER_RANGE.filter(r => r.day % 7 === 0).map(r => ({
    week: r.week,
    day: r.day,
    bw_avg: r.bw_avg,
    gain_g: r.day === 7 ? r.bw_avg - 45 : null,
    feed_g_day: r.feed_avg
}));

const BROILER_DAILY_BW = BROILER_RANGE.map(r => ({
    day: r.day,
    week: r.week,
    bw_avg: r.bw_avg,
    gain_g: r.day === 1 ? null : r.bw_avg - BROILER_RANGE.find(br => br.day === r.day - 1).bw_avg,
    feed_g_day: r.feed_avg
}));

// Feed Weekly data for Feed Reference tab
const FEED_WEEKLY = [
    { week: 1, phase: 'Starter',  daily_g: 35,  cum_g: 245   },
    { week: 2, phase: 'Starter',  daily_g: 68,  cum_g: 721   },
    { week: 3, phase: 'Starter',  daily_g: 100, cum_g: 1421  },
    { week: 4, phase: 'Grower',   daily_g: 130, cum_g: 2331  },
    { week: 5, phase: 'Grower',   daily_g: 160, cum_g: 3451  },
    { week: 6, phase: 'Finisher', daily_g: 190, cum_g: 4781  },
    { week: 7, phase: 'Finisher', daily_g: 215, cum_g: 6286  },
    { week: 8, phase: 'Finisher', daily_g: 230, cum_g: 7896  },
];

// Feed Daily data - calculate cumulative from BROILER_RANGE
const FEED_DAILY = (() => {
    let cumulative = 0;
    return BROILER_RANGE.map(row => {
        cumulative += row.feed_avg;
        return {
            day: row.day,
            week: row.week,
            phase: row.week <= 3 ? 'Starter' : row.week <= 5 ? 'Grower' : 'Finisher',
            daily_g: row.feed_g_day,
            cum_g: cumulative,
        };
    });
})();

const BREED_LABELS = {
    commercial_layer: 'Commercial Layer',
    variant_a: 'Color Chicken',
    variant_b: 'Color Chicken Tipe B',
};

function GrowthChart({module: moduleProp, embedded = false}) {
    const navigate = useNavigate();
    const { module: moduleParam } = useParams();
    const module = moduleProp || moduleParam;
    const { t } = useTranslation();

    const [flockContext, setFlockContext] = useState(null);
    const [activeTab, setActiveTab] = useState('bw');
    const [standardData, setStandardData] = useState([]);
    const [feedData, setFeedData] = useState(null);
    const [viewMode, setViewMode] = useState(() => {
        return localStorage.getItem('farmguide_bw_view_mode') || 'weekly';
    });
    const [selectedWeek, setSelectedWeek] = useState(1);
    const [selectedDay, setSelectedDay] = useState(7);
    const [ccDailyData, setCcDailyData] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('farmguide_active_flock');
        if (!stored) {
            alert(t('farmguide.noFlockContext') || 'Please select a module first.');
            navigate('/farmguide');
            return;
        }
        
        const context = JSON.parse(stored);
        setFlockContext(context);
        
        loadStandardData(context);
    }, []);

    useEffect(() => {
        localStorage.setItem('farmguide_bw_view_mode', viewMode);
    }, [viewMode]);

    useEffect(() => {
        if (flockContext) {
            loadStandardData(flockContext);
        }
    }, [viewMode, module]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (activeTab === 'feedref' && !feedData) {
            fetch('/data/farmguide_data/management/feed_program.json')
                .then(r => r.json())
                .then(data => setFeedData(data))
                .catch(err => console.error('Failed to load feed data:', err));
        }
    }, [activeTab, feedData]);

    useEffect(() => {
        // Auto-scroll to active row in Feed Reference tab
        if (activeTab === 'feedref') {
            const id = viewMode === 'weekly' 
                ? `feed-row-w${selectedWeek}` 
                : `feed-row-d${selectedDay}`;
            const el = document.getElementById(id);
            if (el) {
                setTimeout(() => {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
        }
    }, [viewMode, selectedWeek, selectedDay, activeTab]);

    const handleViewModeChange = (mode) => {
        setViewMode(mode);
    };

    const handleWeekSelect = (week) => {
        setSelectedWeek(week);
        setSelectedDay(week * 7);
        setTimeout(() => {
            document.getElementById(`gc-row-w${week}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 50);
    };

    const handleDaySelect = (day) => {
        setSelectedDay(day);
        setTimeout(() => {
            document.getElementById(`gc-row-d${day}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 50);
    };

    const handleSwitchToDaily = () => {
        setViewMode('daily');
        setSelectedDay(selectedWeek * 7);
    };

    const handleSwitchToWeekly = () => {
        setViewMode('weekly');
    };

    const loadStandardData = (context) => {
        if (module === 'broiler') {
            if (viewMode === 'daily') {
                setStandardData(BROILER_RANGE.map(row => ({
                    day: row.day,
                    week: row.week,
                    bw: row.bw_avg
                })));
            } else {
                setStandardData(BROILER_WEEKLY_BW_STANDARD.map(row => ({
                    week: row.week,
                    bw: row.bw_avg || row.bw_g
                })));
            }
        } else if (module === 'layer') {
            fetch('/data/farmguide_data/breeds/layer_standards.json')
                .then(r => r.json())
                .then(data => {
                    const standards = data.rearing_bw.data.map(row => ({
                        week: row[0],
                        bw: row[1]
                    }));
                    setStandardData(standards);
                })
                .catch(err => console.error('Failed to load layer standards:', err));
        } else if (module === 'color_chicken') {
            const variant = context.variant || context.breed_code || 'choi';
            const sex = context.sex || 'male';
            const rangeData = getColorRange(variant, sex);

            if (viewMode === 'daily') {
                setStandardData(rangeData.map(r => ({
                    day: r.day,
                    week: r.week,
                    bw: r.bw_avg
                })));
            } else {
                // Weekly: ambil hanya hari ke-7 setiap minggu (D7, D14, D21, ... D126)
                const weeklyData = rangeData.filter(r => r.day % 7 === 0).map(r => ({
                    week: r.week,
                    day: r.day,
                    bw: r.bw_avg
                }));
                setStandardData(weeklyData);
            }
        } else if (module === 'parent_stock') {
            // Guard: jangan fetch ulang jika sudah ada data
            if (standardData.length > 0) return;
            
            fetch('/data/farmguide_data/breeds/ps_standards.json')
                .then(r => r.json())
                .then(data => {
                    const sex = context.sex || 'female';
                    const breed = context.breed_code || 'breed_a';
                    
                    let rawData = [];
                    if (sex === 'female' && data.female_bw_in_season && data.female_bw_in_season[breed]) {
                        rawData = data.female_bw_in_season[breed].data || [];
                    } else if (sex === 'male' && data.male_bw && data.male_bw[breed]) {
                        rawData = data.male_bw[breed].data || [];
                    }
                    
                    if (!Array.isArray(rawData)) {
                        rawData = [];
                    }
                    
                    const weekMap = new Map();
                    rawData.forEach(row => {
                        if (Array.isArray(row) && row.length >= 3) {
                            const week = row[1];
                            if (week >= 1 && week <= 25 && Number.isInteger(week)) {
                                weekMap.set(week, { week: row[1], bw: row[2] });
                            }
                        }
                    });
                    
                    setStandardData(Array.from(weekMap.values()));
                })
                .catch(err => console.error('Failed to load PS standards:', err));
        }
    };


    const getModuleName = () => {
        const names = {
            broiler: 'Broiler',
            layer: 'Layer',
            color_chicken: 'Color Chicken',
            parent_stock: 'Parent Stock (PS)',
        };
        return names[module] || module;
    };

    const getFlockBadge = () => {
        if (!flockContext) return null;
        
        if (module === 'broiler') return 'Broiler Commercial';
        
        const parts = [getModuleName()];
        
        // Untuk color_chicken, tampilkan variant (choi/mia) dengan kapital
        if (module === 'color_chicken') {
            const variant = flockContext.variant || flockContext.breed_code;
            if (variant && variant !== 'variant_a') {
                parts.push(variant.charAt(0).toUpperCase() + variant.slice(1));
            }
        } else if (flockContext.breed_code && BREED_LABELS[flockContext.breed_code]) {
            parts.push(BREED_LABELS[flockContext.breed_code]);
        }
        
        if (flockContext.sex) {
            const sexSymbol = flockContext.sex === 'male' ? '♂' : flockContext.sex === 'female' ? '♀' : null;
            if (sexSymbol) {
                parts.push(sexSymbol);
            }
        }
        
        return parts.join(' · ');
    };


    const renderTabNav = () => {
        const tabs = [
            { id: 'bw', label: t('farmguide.tabBWAndTable') || 'BW & Table' },
            { id: 'feedref', label: t('farmguide.tabFeedRef') || 'Feed Reference' },
        ];
        
        return (
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                borderBottom: '2px solid var(--fw-border)',
                marginBottom: '1.5rem',
                overflowX: 'auto'
            }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '0.75rem 1.25rem',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: activeTab === tab.id ? 'var(--fw-teal)' : 'var(--fw-sub)',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: `3px solid ${activeTab === tab.id ? 'var(--fw-teal)' : 'transparent'}`,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        );
    };

    const renderChartTab = () => {
        if (standardData.length < 2) {
            return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--fw-sub)' }}>Loading chart data...</div>;
        }

        const width = 800;
        const height = 320;
        const padding = { top: 20, right: 20, bottom: 40, left: 60 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;

        // Guard: ensure we have valid data
        const n = standardData.length;
        if (n < 2) return null;

        // Calculate scales with guards
        const bwValues = standardData.map(d => d.bw);
        const minBW = 0;
        const maxBW = Math.max(...bwValues) * 1.1;
        const bwRange = maxBW - minBW || 1; // guard division by zero

        // X scale using index-based positioning (safe from division by zero)
        const getX = (index) => {
            if (n <= 1) return padding.left;
            return padding.left + (index / (n - 1)) * chartWidth;
        };

        // Y scale
        const getY = (bw) => {
            return padding.top + chartHeight - ((bw - minBW) / bwRange) * chartHeight;
        };

        // Build standard path with validation
        const standardPath = standardData.map((d, i) => {
            const x = getX(i);
            const y = getY(d.bw);
            if (isNaN(x) || isNaN(y) || !isFinite(x) || !isFinite(y)) return '';
            return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
        }).filter(s => s).join(' ');

        return (
            <div>
                {/* Daily/Weekly Toggle for Broiler and Color Chicken */}
                {(module === 'broiler' || module === 'color_chicken') && (
                    <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        marginBottom: '1rem',
                        padding: '0.25rem',
                        background: 'var(--fw-bg)',
                        borderRadius: '8px',
                        width: 'fit-content'
                    }}>
                        <button
                            onClick={() => handleViewModeChange('weekly')}
                            style={{
                                padding: '0.5rem 1rem',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: viewMode === 'weekly' ? 'var(--fw-card)' : 'var(--fw-text)',
                                background: viewMode === 'weekly' ? 'var(--fw-teal)' : 'transparent',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {t('farmguide.weekly') || 'Weekly'}
                        </button>
                        <button
                            onClick={() => handleViewModeChange('daily')}
                            style={{
                                padding: '0.5rem 1rem',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: viewMode === 'daily' ? 'var(--fw-card)' : 'var(--fw-text)',
                                background: viewMode === 'daily' ? 'var(--fw-teal)' : 'transparent',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {t('farmguide.daily') || 'Daily'}
                        </button>
                    </div>
                )}


                <div style={{
                    background: 'var(--fw-card)',
                    border: '1px solid var(--fw-border)',
                    borderRadius: '8px',
                    padding: '1rem',
                    overflowX: 'auto'
                }}>
                    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ maxWidth: '100%' }}>
                        <path
                            d={standardPath}
                            fill="none"
                            stroke="var(--fw-teal)"
                            strokeWidth="2"
                            strokeDasharray="5,5"
                        />

                        {standardData
                            .filter((_, i) => viewMode === 'daily' ? i % 7 === 0 : true)
                            .map((d, idx) => {
                                const origIndex = standardData.indexOf(d);
                                const x = getX(origIndex);
                                const y = getY(d.bw);
                                if (isNaN(x) || isNaN(y) || !isFinite(x) || !isFinite(y)) return null;
                                
                                const isSelected = viewMode === 'weekly' ? selectedWeek === d.week : selectedDay === d.day;
                                
                                return (
                                    <circle
                                        key={`std-${origIndex}`}
                                        cx={x}
                                        cy={y}
                                        r={isSelected ? 7 : 4}
                                        fill={isSelected ? 'var(--fw-orange)' : 'var(--fw-card)'}
                                        stroke={isSelected ? 'white' : 'var(--fw-teal)'}
                                        strokeWidth="2"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                            if (viewMode === 'weekly') {
                                                setSelectedWeek(d.week);
                                                setTimeout(() => {
                                                    document.getElementById(`gc-row-w${d.week}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                }, 50);
                                            } else {
                                                setSelectedDay(d.day);
                                                setTimeout(() => {
                                                    document.getElementById(`gc-row-d${d.day}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                }, 50);
                                            }
                                        }}
                                    />
                                );
                            })
                        }

                        <line
                            x1={padding.left}
                            y1={height - padding.bottom}
                            x2={width - padding.right}
                            y2={height - padding.bottom}
                            stroke="var(--fw-border)"
                            strokeWidth="1"
                        />
                        <line
                            x1={padding.left}
                            y1={padding.top}
                            x2={padding.left}
                            y2={height - padding.bottom}
                            stroke="var(--fw-border)"
                            strokeWidth="1"
                        />

                        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                            const y = padding.top + chartHeight * (1 - ratio);
                            const bw = Math.round(maxBW * ratio);
                            return (
                                <g key={`y-${i}`}>
                                    <line
                                        x1={padding.left - 5}
                                        y1={y}
                                        x2={padding.left}
                                        y2={y}
                                        stroke="var(--fw-border)"
                                        strokeWidth="1"
                                    />
                                    <text
                                        x={padding.left - 10}
                                        y={y + 4}
                                        textAnchor="end"
                                        fontSize="10"
                                        fill="var(--fw-sub)"
                                    >
                                        {bw}g
                                    </text>
                                </g>
                            );
                        })}

                        {standardData
                            .filter((_, i) => viewMode === 'daily' ? i % 7 === 0 : true)
                            .map((d, idx) => {
                                const origIndex = standardData.indexOf(d);
                                const x = getX(origIndex);
                                if (isNaN(x) || !isFinite(x)) return null;
                                return (
                                    <g key={`x-${origIndex}`}>
                                        <line
                                            x1={x}
                                            y1={height - padding.bottom}
                                            x2={x}
                                            y2={height - padding.bottom + 5}
                                            stroke="var(--fw-border)"
                                            strokeWidth="1"
                                        />
                                        <text
                                            x={x}
                                            y={height - padding.bottom + 18}
                                            textAnchor="middle"
                                            fontSize="10"
                                            fill="var(--fw-sub)"
                                        >
                                            {viewMode === 'daily' ? `D${d.day}` : `W${d.week}`}
                                        </text>
                                    </g>
                                );
                            })
                        }
                    </svg>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '2rem',
                        marginTop: '1rem',
                        fontSize: '0.875rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg width="30" height="2">
                                <line x1="0" y1="1" x2="30" y2="1" stroke="var(--fw-teal)" strokeWidth="2" strokeDasharray="5,5" />
                            </svg>
                            <span style={{ color: 'var(--fw-text)' }}>{t('farmguide.standard') || 'Standard'}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderBWTab = () => {
        if (standardData.length === 0) {
            return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--fw-sub)' }}>Loading...</div>;
        }

        return (
            <div>
                {renderChartTab()}
                
                {/* Table below chart */}
                <div style={{ marginTop: '2rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--fw-text)', marginBottom: '1rem' }}>
                        {t('farmguide.bwTable') || 'BW Standard Table'}
                    </h3>
                    <div style={{
                        background: 'var(--fw-card)',
                        border: '1px solid var(--fw-border)',
                        borderRadius: '8px',
                        overflowX: 'auto',
                        maxHeight: '400px',
                        overflowY: 'auto'
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ position: 'sticky', top: 0, background: 'var(--fw-bg)', zIndex: 1 }}>
                                <tr>
                                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)' }}>
                                        {viewMode === 'daily' ? (t('farmguide.day') || 'Day') : (t('farmguide.week') || 'Week')}
                                    </th>
                                    <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)' }}>
                                        {t('farmguide.standard') || 'Standard'} (g)
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {standardData.map((std, idx) => {
                                    const isSelected = viewMode === 'weekly' ? selectedWeek === std.week : selectedDay === std.day;
                                    
                                    return (
                                        <tr 
                                            key={idx}
                                            id={viewMode === 'weekly' ? `gc-row-w${std.week}` : `gc-row-d${std.day}`}
                                            style={isSelected ? {
                                                background: 'var(--fw-teal)',
                                                color: 'white',
                                                fontWeight: '700'
                                            } : {
                                                borderTop: '1px solid var(--fw-border)'
                                            }}
                                        >
                                            <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>
                                                {viewMode === 'daily' ? `D${std.day}` : `W${std.week}`}
                                            </td>
                                            <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem' }}>
                                                {std.bw}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const renderFeedRefTab = () => {
        if (module !== 'broiler') {
            return (
                <div style={{
                    padding: '2rem',
                    textAlign: 'center',
                    color: 'var(--fw-sub)',
                    background: 'var(--fw-card)',
                    borderRadius: '12px',
                    border: '1px solid var(--fw-border)'
                }}>
                    {t('farmguide.comingSoon') || 'Coming soon for this module.'}
                </div>
            );
        }

        return (
            <div>
                {/* Weekly/Daily Toggle */}
                <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginBottom: '1rem',
                    padding: '0.25rem',
                    background: 'var(--fw-card)',
                    borderRadius: '8px',
                    border: '1px solid var(--fw-border)',
                    width: 'fit-content'
                }}>
                    <button
                        onClick={() => setViewMode('weekly')}
                        style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            background: viewMode === 'weekly' ? 'var(--fw-teal)' : 'transparent',
                            color: viewMode === 'weekly' ? 'white' : 'var(--fw-text)',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}
                    >
                        {t('farmguide.weekly') || 'Weekly'}
                    </button>
                    <button
                        onClick={() => setViewMode('daily')}
                        style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            background: viewMode === 'daily' ? 'var(--fw-teal)' : 'transparent',
                            color: viewMode === 'daily' ? 'white' : 'var(--fw-text)',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}
                    >
                        {t('farmguide.daily') || 'Daily'}
                    </button>
                </div>

                {/* Feed Table */}
                <div style={{
                    maxHeight: '420px',
                    overflowY: 'auto',
                    background: 'var(--fw-card)',
                    border: '1px solid var(--fw-border)',
                    borderRadius: '8px'
                }}>
                    {viewMode === 'weekly' ? (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ position: 'sticky', top: 0, background: 'var(--fw-bg)', zIndex: 1 }}>
                                <tr>
                                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)' }}>
                                        {t('farmguide.week') || 'Week'}
                                    </th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)' }}>
                                        {t('farmguide.phase') || 'Phase'}
                                    </th>
                                    <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)' }}>
                                        {t('farmguide.dailyFeedIntake') || 'Daily (g)'}
                                    </th>
                                    <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)' }}>
                                        {t('farmguide.cumFeedIntake') || 'Cumulative (g)'}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {FEED_WEEKLY.map(row => (
                                    <tr
                                        key={row.week}
                                        id={`feed-row-w${row.week}`}
                                        style={selectedWeek === row.week ? {
                                            background: 'var(--fw-teal)',
                                            color: '#ffffff',
                                            fontWeight: '700',
                                            fontSize: '110%'
                                        } : {
                                            borderTop: '1px solid var(--fw-border)'
                                        }}
                                    >
                                        <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>
                                            W{row.week}
                                        </td>
                                        <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>
                                            {row.phase}
                                        </td>
                                        <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem' }}>
                                            {row.daily_g}
                                        </td>
                                        <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem' }}>
                                            {row.cum_g.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ position: 'sticky', top: 0, background: 'var(--fw-bg)', zIndex: 1 }}>
                                <tr>
                                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)' }}>
                                        {t('farmguide.day') || 'Day'}
                                    </th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)' }}>
                                        {t('farmguide.week') || 'Week'}
                                    </th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)' }}>
                                        {t('farmguide.phase') || 'Phase'}
                                    </th>
                                    <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)' }}>
                                        {t('farmguide.dailyFeedIntake') || 'Daily (g)'}
                                    </th>
                                    <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)' }}>
                                        {t('farmguide.cumFeedIntake') || 'Cumulative (g)'}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {FEED_DAILY.map(row => (
                                    <tr
                                        key={row.day}
                                        id={`feed-row-d${row.day}`}
                                        style={selectedDay === row.day ? {
                                            background: 'var(--fw-teal)',
                                            color: '#ffffff',
                                            fontWeight: '700',
                                            fontSize: '110%'
                                        } : {
                                            borderTop: '1px solid var(--fw-border)'
                                        }}
                                    >
                                        <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>
                                            D{row.day}
                                        </td>
                                        <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>
                                            W{row.week}
                                        </td>
                                        <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>
                                            {row.phase}
                                        </td>
                                        <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem' }}>
                                            {row.daily_g}
                                        </td>
                                        <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem' }}>
                                            {row.cum_g.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        );
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'bw':
                return renderBWTab();
            case 'feedref':
                return renderFeedRefTab();
            default:
                return null;
        }
    };

    if (!flockContext) {
        return null;
    }

    if (embedded) {
        return (
            <div className="embedded-chart">
                {/* Tab Navigation */}
                {renderTabNav()}

                {/* Tab Content */}
                {activeTab === 'bw' && renderBWTab()}
                {activeTab === 'feedref' && renderFeedRefTab()}
            </div>
        );
    }

    return (
        <div className="fw-page">
            <SharedTopNav />

            <div className="fw-section">
                <div style={{ 
                    marginBottom: '1.5rem',
                    fontSize: '0.875rem',
                    color: 'var(--fw-sub)'
                }}>
                    <span 
                        onClick={() => navigate('/farmguide')}
                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        FarmGuide
                    </span>
                    {' > '}
                    <span 
                        onClick={() => navigate(`/farmguide/${module}/panduan`)}
                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        {getModuleName()}
                    </span>
                    {' > '}
                    <span>Growth Chart</span>
                </div>

                <div className="fw-sec-header" style={{ marginBottom: '1rem' }}>
                    <div className="fw-sec-title">{t('farmguide.growthChart') || 'Growth Chart'}</div>
                    <div style={{
                        display: 'inline-block',
                        padding: '0.375rem 0.875rem',
                        marginTop: '0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: 'var(--fw-teal)',
                        background: 'var(--fw-teal-lt)',
                        border: '1px solid var(--fw-teal)',
                        borderRadius: '6px'
                    }}>
                        {getFlockBadge()}
                    </div>
                </div>

                {renderTabNav()}

                {renderTabContent()}

                <div style={{
                    marginTop: '2rem',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid var(--fw-border)',
                    textAlign: 'center'
                }}>
                    <button
                        onClick={() => navigate(`/farmguide/${module}/flock-saya`)}
                        style={{
                            padding: '0.75rem 1.5rem',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: 'var(--fw-teal)',
                            background: 'transparent',
                            border: '2px solid var(--fw-teal)',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.background = 'var(--fw-teal)';
                            e.target.style.color = 'var(--fw-card)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.color = 'var(--fw-teal)';
                        }}
                    >
                        {t('farmguide.goToFlockSaya') || 'My Flock →'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default GrowthChart;
