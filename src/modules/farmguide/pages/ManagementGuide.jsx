import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from '../../../hooks/useTranslation';
import SharedTopNav from '../../../components/SharedTopNav';
import ChecklistItem from '../components/ChecklistItem';
import WeekDaySelector from '../components/WeekDaySelector';
import { BROILER_GUIDE, FEED_WEEKLY, BROILER_DAILY_ENV } from '../data/broilerGuideData';
import { COLOR_CHICKEN_GUIDE, COLOR_CHICKEN_TARGETS } from '../data/colorChickenGuideData';
import { getColorRange } from '../data/colorChickenRangeData';
import FlockSaya from './FlockSaya';
import GrowthChart from './GrowthChart';
import '../../../portal.css';

const WEEK_RANGES = {
    broiler: { min: 1, max: 8, label: 'Minggu' },
    layer: { min: 1, max: 19, label: 'Minggu' },
    color_chicken: { min: 1, max: 18, label: 'Minggu' },
    parent_stock: { min: 1, max: 25, label: 'Minggu' },
};

const BROILER_DAILY_BW = [
    { day: 1,  week: 1, bw_g: 45,   gain_g: null, feed_g_day: 13  },
    { day: 2,  week: 1, bw_g: 60,   gain_g: 15,   feed_g_day: 15  },
    { day: 3,  week: 1, bw_g: 78,   gain_g: 18,   feed_g_day: 18  },
    { day: 4,  week: 1, bw_g: 98,   gain_g: 20,   feed_g_day: 22  },
    { day: 5,  week: 1, bw_g: 118,  gain_g: 20,   feed_g_day: 25  },
    { day: 6,  week: 1, bw_g: 143,  gain_g: 25,   feed_g_day: 30  },
    { day: 7,  week: 1, bw_g: 170,  gain_g: 27,   feed_g_day: 35  },
    { day: 8,  week: 2, bw_g: 203,  gain_g: 33,   feed_g_day: 41  },
    { day: 9,  week: 2, bw_g: 236,  gain_g: 33,   feed_g_day: 47  },
    { day: 10, week: 2, bw_g: 270,  gain_g: 34,   feed_g_day: 50  },
    { day: 11, week: 2, bw_g: 305,  gain_g: 35,   feed_g_day: 55  },
    { day: 12, week: 2, bw_g: 340,  gain_g: 35,   feed_g_day: 60  },
    { day: 13, week: 2, bw_g: 368,  gain_g: 28,   feed_g_day: 63  },
    { day: 14, week: 2, bw_g: 400,  gain_g: 32,   feed_g_day: 68  },
    { day: 15, week: 3, bw_g: 448,  gain_g: 48,   feed_g_day: 75  },
    { day: 16, week: 3, bw_g: 498,  gain_g: 50,   feed_g_day: 80  },
    { day: 17, week: 3, bw_g: 548,  gain_g: 50,   feed_g_day: 85  },
    { day: 18, week: 3, bw_g: 598,  gain_g: 50,   feed_g_day: 90  },
    { day: 19, week: 3, bw_g: 648,  gain_g: 50,   feed_g_day: 94  },
    { day: 20, week: 3, bw_g: 698,  gain_g: 50,   feed_g_day: 97  },
    { day: 21, week: 3, bw_g: 750,  gain_g: 52,   feed_g_day: 100 },
    { day: 22, week: 4, bw_g: 807,  gain_g: 57,   feed_g_day: 106 },
    { day: 23, week: 4, bw_g: 864,  gain_g: 57,   feed_g_day: 112 },
    { day: 24, week: 4, bw_g: 921,  gain_g: 57,   feed_g_day: 117 },
    { day: 25, week: 4, bw_g: 978,  gain_g: 57,   feed_g_day: 122 },
    { day: 26, week: 4, bw_g: 1035, gain_g: 57,   feed_g_day: 125 },
    { day: 27, week: 4, bw_g: 1093, gain_g: 58,   feed_g_day: 128 },
    { day: 28, week: 4, bw_g: 1150, gain_g: 57,   feed_g_day: 130 },
    { day: 29, week: 5, bw_g: 1214, gain_g: 64,   feed_g_day: 136 },
    { day: 30, week: 5, bw_g: 1278, gain_g: 64,   feed_g_day: 141 },
    { day: 31, week: 5, bw_g: 1342, gain_g: 64,   feed_g_day: 146 },
    { day: 32, week: 5, bw_g: 1406, gain_g: 64,   feed_g_day: 151 },
    { day: 33, week: 5, bw_g: 1470, gain_g: 64,   feed_g_day: 155 },
    { day: 34, week: 5, bw_g: 1535, gain_g: 65,   feed_g_day: 158 },
    { day: 35, week: 5, bw_g: 1600, gain_g: 65,   feed_g_day: 160 },
    { day: 36, week: 6, bw_g: 1671, gain_g: 71,   feed_g_day: 165 },
    { day: 37, week: 6, bw_g: 1743, gain_g: 72,   feed_g_day: 170 },
    { day: 38, week: 6, bw_g: 1814, gain_g: 71,   feed_g_day: 175 },
    { day: 39, week: 6, bw_g: 1886, gain_g: 72,   feed_g_day: 180 },
    { day: 40, week: 6, bw_g: 1957, gain_g: 71,   feed_g_day: 184 },
    { day: 41, week: 6, bw_g: 2029, gain_g: 72,   feed_g_day: 187 },
    { day: 42, week: 6, bw_g: 2100, gain_g: 71,   feed_g_day: 190 },
    { day: 43, week: 7, bw_g: 2171, gain_g: 71,   feed_g_day: 194 },
    { day: 44, week: 7, bw_g: 2243, gain_g: 72,   feed_g_day: 198 },
    { day: 45, week: 7, bw_g: 2314, gain_g: 71,   feed_g_day: 202 },
    { day: 46, week: 7, bw_g: 2386, gain_g: 72,   feed_g_day: 207 },
    { day: 47, week: 7, bw_g: 2457, gain_g: 71,   feed_g_day: 210 },
    { day: 48, week: 7, bw_g: 2529, gain_g: 72,   feed_g_day: 213 },
    { day: 49, week: 7, bw_g: 2600, gain_g: 71,   feed_g_day: 215 },
    { day: 50, week: 8, bw_g: 2664, gain_g: 64,   feed_g_day: 218 },
    { day: 51, week: 8, bw_g: 2729, gain_g: 65,   feed_g_day: 220 },
    { day: 52, week: 8, bw_g: 2793, gain_g: 64,   feed_g_day: 222 },
    { day: 53, week: 8, bw_g: 2857, gain_g: 64,   feed_g_day: 224 },
    { day: 54, week: 8, bw_g: 2921, gain_g: 64,   feed_g_day: 226 },
    { day: 55, week: 8, bw_g: 2986, gain_g: 65,   feed_g_day: 228 },
    { day: 56, week: 8, bw_g: 3050, gain_g: 64,   feed_g_day: 230 },
];

const VentilationIcon = ({ size = 32, color = 'currentColor' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" fill="none"/>
        <path
            d="M12 12 C12 12 13 8 16 7 C17.5 6.5 18 7.5 17 9 C16 10.5 14 11 12 12Z"
            fill={color}
            opacity="0.9"
        />
        <path
            d="M12 12 C12 12 15.5 13.5 16 17 C16.3 18.5 15 19 14 18 C13 17 12.5 15 12 12Z"
            fill={color}
            opacity="0.9"
        />
        <path
            d="M12 12 C12 12 9 14 8 17 C7.3 18.5 8.5 19.2 9.5 18 C10.5 16.8 11 14.5 12 12Z"
            fill={color}
            opacity="0.9"
        />
        <path
            d="M12 12 C12 12 8.5 10.5 7 8 C6.2 6.5 7.5 5.8 8.8 7 C10 8.2 11 10 12 12Z"
            fill={color}
            opacity="0.9"
        />
        <circle cx="12" cy="12" r="2" fill={color}/>
        <circle cx="12" cy="12" r="1" fill="white"/>
    </svg>
);

const getVentilationLabel = (ventValue, t) => {
    const map = {
        'Minimum active':        t('farmguide.ventMinActive')    || 'Minimum active',
        'Gradually increase':    t('farmguide.ventGradual')      || 'Gradually increase',
        'Transitional':          t('farmguide.ventTransitional') || 'Transitional',
        'Transitional → Tunnel': t('farmguide.ventTransitional') || 'Transitional → Tunnel',
        'Full tunnel':           t('farmguide.ventTunnelFull')   || 'Full tunnel',
        'Maximum':               t('farmguide.ventTunnelMax')    || 'Maximum',
        'Optimal — house temp < 25°C during catching': t('farmguide.ventOptimal') || 'Optimal — house temp < 25°C during catching',
    };
    return map[ventValue] || ventValue;
};

const ManagementGuide = () => {
    const navigate = useNavigate();
    const { module } = useParams();
    const { t, tSafe, language } = useTranslation();
    const lang = language || 'en';

    const [flockContext, setFlockContext] = useState(null);
    const [selectedWeek, setSelectedWeek] = useState(1);
    const [selectedDay, setSelectedDay] = useState(7);
    const [mainTab, setMainTab] = useState('guide');
    const storageKey = `farmguide_activetab_${module}`;
    const [activeTab, setActiveTab] = useState(() => {
        return localStorage.getItem(storageKey) || 'environment';
    });
    const [viewMode, setViewMode] = useState(() => {
        return localStorage.getItem('farmguide_bw_view_mode') || 'weekly';
    });
    
    // Data states
    const [envData, setEnvData] = useState(null);
    const [feedData, setFeedData] = useState(null);
    const [checklistData, setChecklistData] = useState(null);
    const [bwData, setBwData] = useState(null);
    const [ccDailyData, setCcDailyData] = useState(null);
    
    // Checklist state
    const [checkedItems, setCheckedItems] = useState({});

    useEffect(() => {
        // Load flock context from localStorage - ONLY ONCE on mount
        const stored = localStorage.getItem('farmguide_active_flock');
        if (!stored) {
            alert(t('farmguide.noFlockContext') || 'Please select a module first.');
            navigate('/farmguide');
            return;
        }
        
        const context = JSON.parse(stored);
        setFlockContext(context);
    }, []);

    useEffect(() => {
        // Load checklist state from localStorage
        if (!flockContext) return;
        
        const flockId = flockContext.selected_at?.substring(0, 10) || 'default';
        const checklistKey = `farmguide_checklist_${flockId}_week${selectedWeek}`;
        const saved = JSON.parse(localStorage.getItem(checklistKey) || '{}');
        setCheckedItems(saved);
    }, [selectedWeek]);

    useEffect(() => {
        // Load data based on active tab
        if (activeTab === 'environment' && !envData) {
            fetch('/data/farmguide_data/management/environment_params.json')
                .then(r => r.json())
                .then(data => setEnvData(data))
                .catch(err => console.error('Failed to load environment data:', err));
        }
        
        if (activeTab === 'feed' && !feedData) {
            fetch('/data/farmguide_data/management/feed_program.json')
                .then(r => r.json())
                .then(data => setFeedData(data))
                .catch(err => console.error('Failed to load feed data:', err));
        }
        
        if (activeTab === 'checklist' && !checklistData) {
            fetch('/data/farmguide_data/management/weekly_checklist.json')
                .then(r => r.json())
                .then(data => setChecklistData(data))
                .catch(err => console.error('Failed to load checklist data:', err));
        }
        
        if (activeTab === 'bw' && !bwData && module) {
            loadBWData();
        }
    }, [activeTab, module]);

    useEffect(() => {
        // Save viewMode to localStorage
        localStorage.setItem('farmguide_bw_view_mode', viewMode);
    }, [viewMode]);

    useEffect(() => {
        // Auto-scroll to active row when week/day changes in BW tab
        if (activeTab === 'bw' && (bwData || module === 'broiler')) {
            const rowId = viewMode === 'daily' ? `bw-row-day-${selectedDay}` : `bw-row-${selectedWeek}`;
            const activeRow = document.getElementById(rowId);
            if (activeRow) {
                setTimeout(() => {
                    activeRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
        }
    }, [selectedWeek, selectedDay, activeTab, bwData, module, viewMode]);

    const loadBWData = () => {
        if (module === 'layer') {
            fetch('/data/farmguide_data/breeds/layer_standards.json')
                .then(r => r.json())
                .then(data => setBwData(data))
                .catch(err => console.error('Failed to load layer BW data:', err));
        } else if (module === 'parent_stock') {
            fetch('/data/farmguide_data/breeds/ps_standards.json')
                .then(r => r.json())
                .then(data => setBwData(data))
                .catch(err => console.error('Failed to load PS BW data:', err));
        } else if (module === 'color_chicken') {
            fetch('/data/farmguide_data/breeds/color_chicken_standards.json')
                .then(r => r.json())
                .then(data => {
                    setBwData(data);
                    setCcDailyData(data);
                })
                .catch(err => console.error('Failed to load color chicken BW data:', err));
        }
    };

    const handleViewModeChange = (mode) => {
        setViewMode(mode);
        localStorage.setItem('farmguide_bw_view_mode', mode);
    };

    const handleSwitchToWeekly = () => {
        setViewMode('weekly');
        localStorage.setItem('farmguide_bw_view_mode', 'weekly');
    };

    const handleSwitchToDaily = () => {
        setViewMode('daily');
        localStorage.setItem('farmguide_bw_view_mode', 'daily');
        setSelectedDay(selectedWeek * 7);
    };

    const daysInSelectedWeek = Array.from(
        { length: 7 },
        (_, i) => (selectedWeek - 1) * 7 + 1 + i
    );

    const handleWeekSelect = (week) => {
        setSelectedWeek(week);
        if (viewMode === 'daily') {
            setSelectedDay(week * 7);
        }
    };

    const handleDaySelect = (day) => {
        setSelectedDay(day);
        const week = Math.ceil(day / 7);
        setSelectedWeek(week);
    };

    const getDaysForWeek = (week) => {
        const start = (week - 1) * 7 + 1;
        return Array.from({ length: 7 }, (_, i) => start + i);
    };

    const handleChecklistToggle = (itemId) => {
        if (!flockContext) return;
        
        const flockId = flockContext.selected_at?.substring(0, 10) || 'default';
        const checklistKey = `farmguide_checklist_${flockId}_week${selectedWeek}`;
        
        const updated = { ...checkedItems, [itemId]: !checkedItems[itemId] };
        setCheckedItems(updated);
        localStorage.setItem(checklistKey, JSON.stringify(updated));
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

    const BREED_LABELS = {
        breed_a: 'AA Plus',
        breed_b: 'Indian River',
        breed_c: 'Ross 308FF',
        commercial_layer: 'Commercial Layer',
        variant_a: 'Color Chicken',
        variant_b: 'Color Chicken Tipe B',
    };

    const getFlockBadge = () => {
        if (!flockContext) return null;
        
        // Broiler uses generic label (no breed/sex)
        if (module === 'broiler') {
            return 'Broiler Commercial';
        }
        
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

    const renderWeekSelector = () => {
        if (viewMode === 'daily' && (module === 'broiler' || module === 'color_chicken')) {
            const days = getDaysForWeek(selectedWeek);
            return (
                <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginBottom: '1.5rem',
                    overflowX: 'auto',
                    paddingBottom: '0.5rem'
                }}>
                    {days.map(day => (
                        <button
                            key={day}
                            onClick={() => handleDaySelect(day)}
                            style={{
                                padding: '0.5rem 0.875rem',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: selectedDay === day ? 'var(--fw-card)' : 'var(--fw-text)',
                                background: selectedDay === day ? 'var(--fw-teal)' : 'var(--fw-card)',
                                border: `2px solid ${selectedDay === day ? 'var(--fw-teal)' : 'var(--fw-border)'}`,
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            D{day}
                        </button>
                    ))}
                </div>
            );
        }

        const range = WEEK_RANGES[module] || { min: 1, max: 8 };
        const weeks = [];
        for (let i = range.min; i <= range.max; i++) {
            weeks.push(i);
        }
        
        return (
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                overflowX: 'auto',
                padding: '0.5rem 0',
                marginBottom: '1.5rem'
            }}>
                {weeks.map(week => (
                    <button
                        key={week}
                        onClick={() => handleWeekSelect(week)}
                        style={{
                            minWidth: '48px',
                            padding: '0.5rem 0.75rem',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: selectedWeek === week ? 'var(--fw-card)' : 'var(--fw-text)',
                            background: selectedWeek === week ? 'var(--fw-orange)' : 'var(--fw-card)',
                            border: `2px solid ${selectedWeek === week ? 'var(--fw-orange)' : 'var(--fw-border)'}`,
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                            if (selectedWeek !== week) {
                                e.target.style.borderColor = 'var(--fw-orange)';
                            }
                        }}
                        onMouseOut={(e) => {
                            if (selectedWeek !== week) {
                                e.target.style.borderColor = 'var(--fw-border)';
                            }
                        }}
                    >
                        W{week}
                    </button>
                ))}
            </div>
        );
    };

    const handleMainTabClick = (tabId) => {
        setMainTab(tabId);
        if (tabId === 'guide') {
            setActiveTab('environment');
            localStorage.setItem(storageKey, 'environment');
        }
    };

    const renderMainTabNav = () => {
        const mainTabs = [
            { id: 'guide', label: 'Guide' },
            { id: 'flock', label: 'My Flock' },
        ];
        
        return (
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                marginBottom: '1rem',
                overflowX: 'auto',
                borderBottom: '2px solid var(--fw-border)',
                paddingBottom: '0.5rem'
            }}>
                {mainTabs.map(tab => {
                    const isActive = mainTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => handleMainTabClick(tab.id)}
                            style={{
                                padding: '10px 24px',
                                fontSize: '15px',
                                fontWeight: '600',
                                color: isActive ? '#ffffff' : 'var(--fw-sub)',
                                background: isActive ? 'var(--fw-teal)' : 'transparent',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                whiteSpace: 'nowrap'
                            }}
                            onMouseOver={(e) => {
                                if (!isActive) {
                                    e.target.style.color = 'var(--fw-teal)';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (!isActive) {
                                    e.target.style.color = 'var(--fw-sub)';
                                }
                            }}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>
        );
    };

    const renderSubTabNav = () => {
        if (mainTab !== 'guide') return null;
        
        const subTabs = [
            { id: 'environment', label: t('farmguide.tabEnvironment') || 'Environment' },
            { id: 'feed', label: t('farmguide.tabFeed') || 'Feed Program' },
            { id: 'bw', label: t('farmguide.tabBW') || 'Body Weight' },
            { id: 'checklist', label: t('farmguide.tabChecklist') || 'Checklist' },
            { id: 'references', label: 'References' },
        ];
        
        return (
            <div style={{
                display: 'flex',
                gap: '4px',
                marginBottom: '16px',
                borderBottom: '1px solid var(--fw-border)',
                overflowX: 'auto'
            }}>
                {subTabs.map(tab => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                localStorage.setItem(storageKey, tab.id);
                                if (tab.id === 'checklist') {
                                    setViewMode('weekly');
                                }
                            }}
                            style={{
                                padding: '7px 14px',
                                fontSize: '13px',
                                fontWeight: isActive ? '600' : '500',
                                color: isActive ? 'var(--fw-teal)' : 'var(--fw-sub)',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: `2px solid ${isActive ? 'var(--fw-teal)' : 'transparent'}`,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>
        );
    };

    const renderEnvironmentTab = () => {
        if (module === 'broiler') {
            // Daily mode: lookup by day
            if (viewMode === 'daily') {
                const day = selectedDay || ((selectedWeek - 1) * 7 + 1);
                const dailyEnv = BROILER_DAILY_ENV.find(r => day >= r.minDay && day <= r.maxDay)
                    || BROILER_DAILY_ENV[BROILER_DAILY_ENV.length - 1];
                
                const parentWeek = Math.ceil(day / 7);
                const weekData = BROILER_GUIDE[parentWeek - 1];
                const env = weekData?.environment;
                
                return (
                    <div style={{ padding: '0 0 2rem 0' }}>
                        {/* Day range badge */}
                        <div style={{ marginBottom: '1rem' }}>
                            <span style={{
                                background: '#E1F5EE', color: '#0C3830',
                                borderRadius: '20px', padding: '4px 14px',
                                fontSize: '13px', fontWeight: '600'
                            }}>
                                Day {dailyEnv.dayRange}
                            </span>
                        </div>

                        {/* Main env cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', marginBottom: '1rem' }}>
                            <div style={{ background: 'var(--fw-card)', border: '1px solid var(--fw-border)', borderRadius: '12px', padding: '1rem' }}>
                                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🌡️</div>
                                <div style={{ fontSize: '12px', color: 'var(--fw-sub)', marginBottom: '4px' }}>Room Temperature</div>
                                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--fw-text)' }}>{dailyEnv.room_temp}</div>
                            </div>
                            <div style={{ background: 'var(--fw-card)', border: '1px solid var(--fw-border)', borderRadius: '12px', padding: '1rem' }}>
                                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>💧</div>
                                <div style={{ fontSize: '12px', color: 'var(--fw-sub)', marginBottom: '4px' }}>Relative Humidity</div>
                                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--fw-text)' }}>{dailyEnv.rh}</div>
                            </div>
                            <div style={{ background: 'var(--fw-card)', border: '1px solid var(--fw-border)', borderRadius: '12px', padding: '1rem' }}>
                                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>💡</div>
                                <div style={{ fontSize: '12px', color: 'var(--fw-sub)', marginBottom: '4px' }}>Lighting</div>
                                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--fw-text)' }}>{dailyEnv.lighting}</div>
                            </div>
                            <div style={{ background: 'var(--fw-card)', border: '1px solid var(--fw-border)', borderRadius: '12px', padding: '1rem' }}>
                                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🌬️</div>
                                <div style={{ fontSize: '12px', color: 'var(--fw-sub)', marginBottom: '4px' }}>Ventilation</div>
                                <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--fw-text)' }}>{dailyEnv.ventilation}</div>
                            </div>
                        </div>

                        {/* Specs Grid */}
                        {weekData && (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                                gap: '0.75rem',
                                marginBottom: '1.5rem'
                            }}>
                                {weekData.specs
                                    .filter(spec => spec.labelKey !== 'specBrooderEdge' && spec.labelKey !== 'specLightIntensity')
                                    .map((spec, idx) => (
                                        <div key={idx} style={{
                                            padding: '1rem',
                                            background: 'var(--fw-card)',
                                            border: '1px solid var(--fw-border)',
                                            borderRadius: '8px'
                                        }}>
                                            <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{spec.icon}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--fw-sub)', marginBottom: '0.25rem' }}>
                                                {spec.labelKey ? (tSafe('farmguide.' + spec.labelKey) ?? spec.label) : spec.label}
                                            </div>
                                            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-text)' }}>
                                                {spec.value}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}

                        {/* Note */}
                        {dailyEnv.note && (
                            <div style={{
                                background: 'var(--fw-card)', border: '1px solid var(--fw-border)',
                                borderRadius: '10px', padding: '0.875rem 1rem',
                                fontSize: '13px', color: 'var(--fw-sub)', lineHeight: '1.5'
                            }}>
                                💡 {dailyEnv.note[language] || dailyEnv.note.en}
                            </div>
                        )}

                        {/* Gas limits */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '1rem' }}>
                            <div style={{ background: 'var(--fw-card)', border: '1px solid var(--fw-border)', borderRadius: '10px', padding: '0.875rem 1rem' }}>
                                <div style={{ fontSize: '12px', color: 'var(--fw-sub)' }}>NH₃</div>
                                <div style={{ fontWeight: '700' }}>{'< 10 ppm'}</div>
                            </div>
                            <div style={{ background: 'var(--fw-card)', border: '1px solid var(--fw-border)', borderRadius: '10px', padding: '0.875rem 1rem' }}>
                                <div style={{ fontSize: '12px', color: 'var(--fw-sub)' }}>CO₂</div>
                                <div style={{ fontWeight: '700' }}>{'< 2,500 ppm'}</div>
                            </div>
                        </div>
                    </div>
                );
            }

            // Weekly mode: existing behavior
            const weekData = BROILER_GUIDE[selectedWeek - 1];
            if (!weekData) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--fw-sub)' }}>No data available</div>;
            const env = weekData.environment;
            
            return (
                <div>
                    {/* 4 Main Parameter Cards */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem',
                        marginBottom: '1.5rem'
                    }}>
                        <div style={{
                            padding: '1.5rem',
                            background: 'var(--fw-card)',
                            border: '2px solid var(--fw-border)',
                            borderRadius: '12px'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌡️</div>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)', marginBottom: '0.5rem' }}>
                                {t('farmguide.tempTarget') || 'Suhu'}
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--fw-text)' }}>
                                {env.temp}
                            </div>
                        </div>
                        
                        <div style={{
                            padding: '1.5rem',
                            background: 'var(--fw-card)',
                            border: '2px solid var(--fw-border)',
                            borderRadius: '12px'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💧</div>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)', marginBottom: '0.5rem' }}>
                                {t('farmguide.humidity') || 'RH'}
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--fw-text)' }}>
                                {env.rh}
                            </div>
                        </div>
                        
                        <div style={{
                            padding: '1.5rem',
                            background: 'var(--fw-card)',
                            border: '2px solid var(--fw-border)',
                            borderRadius: '12px'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💡</div>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)', marginBottom: '0.5rem' }}>
                                {t('farmguide.lighting') || 'Cahaya'}
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--fw-text)' }}>
                                {typeof env.light === 'object' ? (env.light[lang] ?? env.light['en']) : env.light}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--fw-sub)', marginTop: '0.25rem' }}>
                                {env.light_lux}
                            </div>
                        </div>
                        
                        <div style={{
                            padding: '1.5rem',
                            background: 'var(--fw-card)',
                            border: '2px solid var(--fw-border)',
                            borderRadius: '12px'
                        }}>
                            <div style={{ marginBottom: '0.5rem' }}>
                                <VentilationIcon size={32} color="var(--fw-teal)" />
                            </div>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)', marginBottom: '0.5rem' }}>
                                {t('farmguide.ventilation') || 'Ventilasi'}
                            </div>
                            <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--fw-text)' }}>
                                {env.ventKey ? (tSafe('farmguide.' + env.ventKey) ?? env.ventilation) : env.ventilation}
                            </div>
                        </div>
                    </div>
                    
                    {/* Specs Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '0.75rem',
                        marginBottom: '1.5rem'
                    }}>
                        {weekData.specs.map((spec, idx) => (
                            <div key={idx} style={{
                                padding: '1rem',
                                background: 'var(--fw-card)',
                                border: '1px solid var(--fw-border)',
                                borderRadius: '8px'
                            }}>
                                <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{spec.icon}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--fw-sub)', marginBottom: '0.25rem' }}>
                                    {spec.labelKey ? (tSafe('farmguide.' + spec.labelKey) ?? spec.label) : spec.label}
                                </div>
                                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-text)' }}>
                                    {spec.value}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Air Quality Row */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '0.75rem',
                        padding: '1rem',
                        background: 'var(--fw-card)',
                        border: '1px solid var(--fw-border)',
                        borderRadius: '8px'
                    }}>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--fw-sub)', marginBottom: '0.25rem' }}>NH₃</div>
                            <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--fw-text)' }}>{env.nh3}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--fw-sub)', marginBottom: '0.25rem' }}>CO₂</div>
                            <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--fw-text)' }}>{env.co2}</div>
                        </div>
                    </div>
                    
                    {/* Daily Mode Note */}
                    {viewMode === 'daily' && (
                        <div style={{
                            marginTop: '1rem',
                            padding: '0.75rem 1rem',
                            background: 'var(--fw-teal-lt)',
                            border: '1px solid var(--fw-teal)',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            color: 'var(--fw-text)'
                        }}>
                            {(t('farmguide.envWeeklyNote') || '💡 Environment parameters apply for the entire week (W{week})').replace('{week}', selectedWeek)}
                        </div>
                    )}
                </div>
            );
        }
        
        if (module === 'color_chicken') {
            const weekData = COLOR_CHICKEN_GUIDE[selectedWeek - 1];
            if (!weekData) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--fw-sub)' }}>No data available</div>;
            
            const env = weekData.environment;
            
            return (
                <div>
                    {/* 4 Main Parameter Cards */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem',
                        marginBottom: '1.5rem'
                    }}>
                        <div style={{
                            padding: '1.5rem',
                            background: 'var(--fw-card)',
                            border: '2px solid var(--fw-border)',
                            borderRadius: '12px'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌡️</div>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)', marginBottom: '0.5rem' }}>
                                {t('farmguide.tempTarget') || 'Suhu'}
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--fw-text)' }}>
                                {env.temp}
                            </div>
                        </div>
                        
                        <div style={{
                            padding: '1.5rem',
                            background: 'var(--fw-card)',
                            border: '2px solid var(--fw-border)',
                            borderRadius: '12px'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💧</div>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)', marginBottom: '0.5rem' }}>
                                {t('farmguide.humidity') || 'RH'}
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--fw-text)' }}>
                                {env.rh}
                            </div>
                        </div>
                        
                        <div style={{
                            padding: '1.5rem',
                            background: 'var(--fw-card)',
                            border: '2px solid var(--fw-border)',
                            borderRadius: '12px'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💡</div>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)', marginBottom: '0.5rem' }}>
                                {t('farmguide.lighting') || 'Cahaya'}
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--fw-text)' }}>
                                {typeof env.light === 'object' ? (env.light[lang] ?? env.light['en']) : env.light}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--fw-sub)', marginTop: '0.25rem' }}>
                                {env.light_lux}
                            </div>
                        </div>
                        
                        <div style={{
                            padding: '1.5rem',
                            background: 'var(--fw-card)',
                            border: '2px solid var(--fw-border)',
                            borderRadius: '12px'
                        }}>
                            <div style={{ marginBottom: '0.5rem' }}>
                                <VentilationIcon size={32} color="var(--fw-teal)" />
                            </div>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)', marginBottom: '0.5rem' }}>
                                {t('farmguide.ventilation') || 'Ventilasi'}
                            </div>
                            <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--fw-text)' }}>
                                {env.ventKey ? (tSafe('farmguide.' + env.ventKey) ?? env.ventilation) : env.ventilation}
                            </div>
                        </div>
                    </div>
                    
                    {/* Specs Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '0.75rem',
                        marginBottom: '1.5rem'
                    }}>
                        {weekData.specs.map((spec, idx) => (
                            <div key={idx} style={{
                                padding: '1rem',
                                background: 'var(--fw-card)',
                                border: '1px solid var(--fw-border)',
                                borderRadius: '8px'
                            }}>
                                <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{spec.icon}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--fw-sub)', marginBottom: '0.25rem' }}>
                                    {spec.labelKey ? (tSafe('farmguide.' + spec.labelKey) ?? spec.label) : spec.label}
                                </div>
                                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-text)' }}>
                                    {spec.value}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Air Quality Row */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '0.75rem',
                        padding: '1rem',
                        background: 'var(--fw-card)',
                        border: '1px solid var(--fw-border)',
                        borderRadius: '8px'
                    }}>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--fw-sub)', marginBottom: '0.25rem' }}>NH₃</div>
                            <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--fw-text)' }}>{env.nh3}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--fw-sub)', marginBottom: '0.25rem' }}>CO₂</div>
                            <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--fw-text)' }}>{env.co2}</div>
                        </div>
                    </div>
                    
                    {/* Daily Mode Note */}
                    {viewMode === 'daily' && (
                        <div style={{
                            marginTop: '1rem',
                            padding: '0.75rem 1rem',
                            background: 'var(--fw-teal-lt)',
                            border: '1px solid var(--fw-teal)',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            color: 'var(--fw-text)'
                        }}>
                            {(t('farmguide.envWeeklyNote') || '💡 Environment parameters apply for the entire week (W{week})').replace('{week}', selectedWeek)}
                        </div>
                    )}
                </div>
            );
        }
        
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
    };

    const renderFeedTab = () => {
        if (module === 'broiler' || module === 'color_chicken') {
            const weekData = module === 'broiler' ? BROILER_GUIDE[selectedWeek - 1] : COLOR_CHICKEN_GUIDE[selectedWeek - 1];
            if (!weekData) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--fw-sub)' }}>No data available</div>;
            
            const feedInfo = weekData.feed;
            
            return (
                <div>
                    {/* Active Phase Card */}
                    <div style={{
                        padding: '1.5rem',
                        background: 'var(--fw-card)',
                        border: '2px solid var(--fw-teal)',
                        borderRadius: '12px',
                        marginBottom: '1.5rem'
                    }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)', marginBottom: '0.5rem' }}>
                            Fase Aktif
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--fw-text)', marginBottom: '1rem' }}>
                            {feedInfo.phase.toUpperCase()}
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--fw-sub)', marginBottom: '0.25rem' }}>Bentuk</div>
                                <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--fw-text)' }}>{feedInfo.form}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--fw-sub)', marginBottom: '0.25rem' }}>Ukuran</div>
                                <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--fw-text)' }}>{feedInfo.size}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--fw-sub)', marginBottom: '0.25rem' }}>Durasi</div>
                                <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--fw-text)' }}>{feedInfo.duration}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--fw-sub)', marginBottom: '0.25rem' }}>Intake</div>
                                <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--fw-text)' }}>{feedInfo.intake}</div>
                            </div>
                        </div>
                        
                        <div style={{
                            marginTop: '1rem',
                            padding: '0.75rem',
                            background: 'var(--fw-bg)',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            color: 'var(--fw-text)'
                        }}>
                            <strong>Air:</strong> {feedInfo.water}
                        </div>
                    </div>
                    
                    {/* Feed Consumption Table */}
                    <div style={{
                        background: 'var(--fw-card)',
                        border: '1px solid var(--fw-border)',
                        borderRadius: '12px',
                        overflow: 'hidden'
                    }}>
                        <div style={viewMode === 'daily' ? { maxHeight: '320px', overflowY: 'auto', border: '1px solid var(--fw-border)', borderRadius: '8px' } : {}}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: 'var(--fw-bg)' }}>
                                        <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)' }}>
                                            {viewMode === 'weekly' ? 'Week' : 'Day'}
                                        </th>
                                        <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)' }}>
                                            Phase
                                        </th>
                                        <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)' }}>
                                            Daily (g)
                                        </th>
                                        <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)' }}>
                                            Cumulative (g)
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                {viewMode === 'weekly' ? (
                                    FEED_WEEKLY.map(row => {
                                        const isActive = row.week === selectedWeek;
                                        return (
                                            <tr key={row.week} style={{
                                                background: isActive ? 'var(--fw-teal-lt)' : 'transparent',
                                                borderTop: '1px solid var(--fw-border)'
                                            }}>
                                                <td style={{ padding: '0.75rem', fontSize: '0.875rem', fontWeight: isActive ? '700' : '400', color: 'var(--fw-text)' }}>
                                                    W{row.week}
                                                </td>
                                                <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: 'var(--fw-text)' }}>
                                                    {row.phase}
                                                </td>
                                                <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-text)' }}>
                                                    {row.daily_g}
                                                </td>
                                                <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', color: 'var(--fw-sub)' }}>
                                                    {row.cum_g}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    (() => {
                                        let cumulative = 0;
                                        const getPhase = (week) => {
                                            if (week <= 3) return 'Starter';
                                            if (week <= 5) return 'Grower';
                                            return 'Finisher';
                                        };
                                        return BROILER_DAILY_BW.map(row => {
                                            const isActive = row.day === selectedDay;
                                            cumulative += row.feed_g_day;
                                            return (
                                                <tr key={row.day} style={{
                                                    background: isActive ? 'var(--fw-teal-lt)' : 'transparent',
                                                    borderTop: '1px solid var(--fw-border)'
                                                }}>
                                                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', fontWeight: isActive ? '700' : '400', color: 'var(--fw-text)' }}>
                                                        D{row.day}
                                                    </td>
                                                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: 'var(--fw-text)' }}>
                                                        {getPhase(row.week)}
                                                    </td>
                                                    <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-text)' }}>
                                                        {row.feed_g_day}
                                                    </td>
                                                    <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', color: 'var(--fw-sub)' }}>
                                                        {cumulative}
                                                    </td>
                                                </tr>
                                            );
                                        });
                                    })()
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    {/* Feed Chart for Broiler */}
                    {module === 'broiler' && (() => {
                        const chartData = viewMode === 'weekly' ? FEED_WEEKLY : BROILER_DAILY_BW;
                        const chartHeight = 300;
                        const chartWidth = 800;
                        const padding = { top: 20, right: 40, bottom: 40, left: 60 };
                        const plotWidth = chartWidth - padding.left - padding.right;
                        const plotHeight = chartHeight - padding.top - padding.bottom;
                        
                        const maxFeed = viewMode === 'weekly' 
                            ? Math.max(...FEED_WEEKLY.map(d => d.daily_g))
                            : Math.max(...BROILER_DAILY_BW.map(d => d.feed_g_day));
                        
                        const xScale = viewMode === 'weekly'
                            ? (week) => padding.left + ((week - 1) / 7) * plotWidth
                            : (day) => padding.left + ((day - 1) / 55) * plotWidth;
                        
                        const yScale = (feed) => padding.top + plotHeight - (feed / 250) * plotHeight;
                        
                        const points = chartData.map(d => {
                            const x = viewMode === 'weekly' ? xScale(d.week) : xScale(d.day);
                            const y = viewMode === 'weekly' ? yScale(d.daily_g) : yScale(d.feed_g_day);
                            return `${x},${y}`;
                        }).join(' ');
                        
                        const currentX = viewMode === 'weekly' ? xScale(selectedWeek) : xScale(selectedDay);
                        
                        return (
                            <div style={{ marginTop: '1.5rem' }}>
                                <div style={{ 
                                    fontSize: '0.875rem', 
                                    fontWeight: '600', 
                                    color: 'var(--fw-text)', 
                                    marginBottom: '0.75rem' 
                                }}>
                                    {t('farmguide.feedChart') || 'Standard Feed Curve'}
                                </div>
                                <div style={{ 
                                    background: 'var(--fw-card)', 
                                    border: '1px solid var(--fw-border)', 
                                    borderRadius: '8px', 
                                    padding: '1rem',
                                    overflowX: 'auto'
                                }}>
                                    <svg width={chartWidth} height={chartHeight} style={{ display: 'block' }}>
                                        {/* Grid lines */}
                                        {[0, 50, 100, 150, 200, 250].map(feed => (
                                            <g key={feed}>
                                                <line
                                                    x1={padding.left}
                                                    y1={yScale(feed)}
                                                    x2={chartWidth - padding.right}
                                                    y2={yScale(feed)}
                                                    stroke="var(--fw-border)"
                                                    strokeWidth="1"
                                                    strokeDasharray="4,4"
                                                />
                                                <text
                                                    x={padding.left - 10}
                                                    y={yScale(feed) + 4}
                                                    textAnchor="end"
                                                    fontSize="11"
                                                    fill="var(--fw-sub)"
                                                >
                                                    {feed}g
                                                </text>
                                            </g>
                                        ))}
                                        
                                        {/* Feed line */}
                                        <polyline
                                            points={points}
                                            fill="none"
                                            stroke="var(--fw-orange)"
                                            strokeWidth="3"
                                        />
                                        
                                        {/* Current selection highlight */}
                                        <line
                                            x1={currentX}
                                            y1={padding.top}
                                            x2={currentX}
                                            y2={chartHeight - padding.bottom}
                                            stroke="var(--fw-teal)"
                                            strokeWidth="2"
                                            strokeDasharray="5,5"
                                        />
                                        
                                        {/* X-axis labels */}
                                        {viewMode === 'weekly' ? (
                                            [1, 2, 3, 4, 5, 6, 7, 8].map(week => (
                                                <text
                                                    key={week}
                                                    x={xScale(week)}
                                                    y={chartHeight - padding.bottom + 20}
                                                    textAnchor="middle"
                                                    fontSize="11"
                                                    fill="var(--fw-text)"
                                                    fontWeight={week === selectedWeek ? '700' : '400'}
                                                >
                                                    W{week}
                                                </text>
                                            ))
                                        ) : (
                                            [1, 7, 14, 21, 28, 35, 42, 49, 56].map(day => (
                                                <text
                                                    key={day}
                                                    x={xScale(day)}
                                                    y={chartHeight - padding.bottom + 20}
                                                    textAnchor="middle"
                                                    fontSize="11"
                                                    fill="var(--fw-text)"
                                                >
                                                    D{day}
                                                </text>
                                            ))
                                        )}
                                        
                                        {/* Axis labels */}
                                        <text
                                            x={chartWidth / 2}
                                            y={chartHeight - 5}
                                            textAnchor="middle"
                                            fontSize="12"
                                            fill="var(--fw-sub)"
                                            fontWeight="600"
                                        >
                                            {viewMode === 'weekly' ? (t('farmguide.week') || 'Week') : (t('farmguide.day') || 'Day')}
                                        </text>
                                        <text
                                            x={15}
                                            y={chartHeight / 2}
                                            textAnchor="middle"
                                            fontSize="12"
                                            fill="var(--fw-sub)"
                                            fontWeight="600"
                                            transform={`rotate(-90, 15, ${chartHeight / 2})`}
                                        >
                                            {t('farmguide.dailyFeed') || 'Daily Feed (g)'}
                                        </text>
                                    </svg>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            );
        }
        
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
    };
    
    const renderFeedTabOld = () => {
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
        
        if (!feedData) {
            return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--fw-sub)' }}>Loading...</div>;
        }
        
        const getFeedPhase = (week) => {
            if (week <= 1) return 'starter';
            if (week <= 3) return 'starter';
            if (week <= 4) return 'grower';
            return 'finisher';
        };
        
        const phaseId = getFeedPhase(selectedWeek);
        const phase = feedData.feed_phases.phases.find(p => p.phase_id === phaseId);
        
        if (!phase) {
            return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--fw-sub)' }}>No data available</div>;
        }
        
        const targetDay = selectedWeek * 7;
        const consumptionData = feedData.feed_consumption_reference.data
            .filter(row => Math.abs(row[0] - targetDay) <= 7)
            .slice(0, 3);
        
        return (
            <div>
                {/* Phase Info Card */}
                <div style={{
                    padding: '1.5rem',
                    background: 'var(--fw-card)',
                    border: '2px solid var(--fw-teal)',
                    borderRadius: '12px',
                    marginBottom: '1.5rem'
                }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)', marginBottom: '0.5rem' }}>
                        {t('farmguide.activeFeedPhase') || 'Active Phase'}
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--fw-text)', marginBottom: '1rem' }}>
                        {phase.name_en.toUpperCase()}
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--fw-sub)', marginBottom: '0.25rem' }}>
                                {t('farmguide.feedForm') || 'Form'}
                            </div>
                            <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--fw-text)' }}>
                                {phase.form}
                            </div>
                        </div>
                        
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--fw-sub)', marginBottom: '0.25rem' }}>
                                {t('farmguide.energy') || 'Energy'}
                            </div>
                            <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--fw-text)' }}>
                                {phase.energy_kcal_per_kg_min}–{phase.energy_kcal_per_kg_max} kcal/kg
                            </div>
                        </div>
                        
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--fw-sub)', marginBottom: '0.25rem' }}>
                                {t('farmguide.protein') || 'Protein'}
                            </div>
                            <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--fw-text)' }}>
                                {phase.crude_protein_pct_min}–{phase.crude_protein_pct_max}%
                            </div>
                        </div>
                    </div>
                    
                    {phase.note && (
                        <div style={{
                            marginTop: '1rem',
                            padding: '0.75rem',
                            background: 'var(--fw-bg)',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            color: 'var(--fw-text)'
                        }}>
                            <strong>{t('farmguide.notes') || 'Notes'}:</strong> {phase.note}
                        </div>
                    )}
                </div>
                
                {/* Feed Consumption Table */}
                {consumptionData.length > 0 && (
                    <div>
                        <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--fw-text)', marginBottom: '0.75rem' }}>
                            {t('farmguide.feedConsumption') || 'Feed Consumption Reference'}
                        </div>
                        
                        <div style={{
                            background: 'var(--fw-card)',
                            border: '1px solid var(--fw-border)',
                            borderRadius: '8px',
                            overflow: 'hidden'
                        }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: 'var(--fw-bg)' }}>
                                        <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)' }}>
                                            {t('farmguide.day') || 'Day'}
                                        </th>
                                        <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)' }}>
                                            {t('farmguide.dailyIntake') || 'Daily'} (g)
                                        </th>
                                        <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)' }}>
                                            {t('farmguide.cumIntake') || 'Cumulative'} (g)
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {consumptionData.map((row, idx) => (
                                        <tr key={idx} style={{ borderTop: '1px solid var(--fw-border)' }}>
                                            <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: 'var(--fw-text)' }}>
                                                {row[0]}
                                            </td>
                                            <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', color: 'var(--fw-text)' }}>
                                                {row[1]}
                                            </td>
                                            <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', color: 'var(--fw-text)' }}>
                                                {row[2]}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const BROILER_WEEKLY_BW_STANDARD = [
        { week: 1, day: 7,  bw_g: 170,  gain_g: 130, feed_g_day: 35  },
        { week: 2, day: 14, bw_g: 400,  gain_g: 230, feed_g_day: 68  },
        { week: 3, day: 21, bw_g: 750,  gain_g: 350, feed_g_day: 100 },
        { week: 4, day: 28, bw_g: 1150, gain_g: 400, feed_g_day: 130 },
        { week: 5, day: 35, bw_g: 1600, gain_g: 450, feed_g_day: 160 },
        { week: 6, day: 42, bw_g: 2100, gain_g: 500, feed_g_day: 190 },
        { week: 7, day: 49, bw_g: 2600, gain_g: 500, feed_g_day: 215 },
        { week: 8, day: 56, bw_g: 3050, gain_g: 450, feed_g_day: 230 },
    ];

    const renderBWTab = () => {
        let tableData = [];
        
        // Handle daily view for Broiler and Color Chicken
        if (viewMode === 'daily' && module === 'broiler') {
            tableData = BROILER_DAILY_BW.map(row => ({
                day: row.day,
                week: row.week,
                bw: row.bw_g,
                gain: row.gain_g
            }));
        } else if (viewMode === 'daily' && module === 'color_chicken') {
            const variant = flockContext?.variant || flockContext?.breed_code || 'choi';
            const sex = flockContext?.sex || 'male';
            const rangeData = getColorRange(variant, sex);
            tableData = rangeData.map((row, idx) => ({
                day: row.day,
                week: row.week,
                bw: row.bw_avg,
                gain: idx > 0 ? row.bw_avg - rangeData[idx - 1].bw_avg : null,
                feed: row.feed_avg,
            }));
        } else if (module === 'broiler') {
            tableData = BROILER_WEEKLY_BW_STANDARD.map(row => ({
                week: row.week,
                day: row.day,
                bw: row.bw_g,
                gain: row.gain_g
            }));
        } else if (!bwData) {
            return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--fw-sub)' }}>Loading...</div>;
        } else if (module === 'layer') {
            const rearingData = bwData.rearing_bw.data;
            tableData = rearingData.map(row => ({
                week: row[0],
                bw: row[1],
                gain: row[0] > 1 ? row[1] - rearingData.find(r => r[0] === row[0] - 1)?.[1] : null,
                feed: null,
                feedPhase: row[4]
            }));
        } else if (module === 'color_chicken') {
            // Weekly view: pick day 7 of each week (D7, D14, D21 ... D126)
            const variant = flockContext?.variant || flockContext?.breed_code || 'choi';
            const sex = flockContext?.sex || 'male';
            const rangeData = getColorRange(variant, sex);
            const weeklyRows = rangeData.filter(r => r.day % 7 === 0);
            tableData = weeklyRows.map((row, idx) => ({
                week: row.week,
                day: row.day,
                bw: row.bw_avg,
                gain: idx > 0 ? row.bw_avg - weeklyRows[idx - 1].bw_avg : null,
                feed: row.feed_avg,
            }));
        } else if (module === 'parent_stock') {
            if (!bwData) {
                return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--fw-sub)' }}>Loading...</div>;
            }
            
            const sex = flockContext?.sex || 'female';
            const breed = flockContext?.breed_code || 'breed_a';
            
            let rawData = [];
            if (sex === 'female' && bwData.female_bw_in_season && bwData.female_bw_in_season[breed]) {
                rawData = bwData.female_bw_in_season[breed].data || [];
            } else if (sex === 'male' && bwData.male_bw && bwData.male_bw[breed]) {
                rawData = bwData.male_bw[breed].data || [];
            }
            
            if (!Array.isArray(rawData) || rawData.length === 0) {
                return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--fw-sub)' }}>No data available for this breed and sex combination.</div>;
            }
            
            const weekMap = new Map();
            rawData.forEach(row => {
                if (Array.isArray(row) && row.length >= 5) {
                    const week = row[1];
                    if (week >= 1 && week <= 25 && Number.isInteger(week)) {
                        weekMap.set(week, row);
                    }
                }
            });
            
            tableData = Array.from(weekMap.values()).map(row => ({
                week: row[1],
                day: row[0],
                bw: row[2],
                gain: row[3],
                feed: row[4]
            }));
        }
        
        if (tableData.length === 0) {
            return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--fw-sub)' }}>No data available</div>;
        }
        
        return (
            <div>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--fw-text)', marginBottom: '0.75rem' }}>
                    {viewMode === 'daily' 
                        ? `${t('farmguide.day') || 'Day'} ${selectedDay} — ${t('farmguide.stdBW') || 'Standard BW'}`
                        : `${t('farmguide.week') || 'Week'} ${selectedWeek} — ${t('farmguide.stdBW') || 'Standard BW'}`
                    }
                </div>
                
                <div style={{
                    maxHeight: '420px',
                    overflowY: 'auto',
                    background: 'var(--fw-card)',
                    border: '1px solid var(--fw-border)',
                    borderRadius: '8px'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                            <tr style={{ background: 'var(--fw-bg)' }}>
                                {viewMode === 'daily' ? (
                                    <>
                                        <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)' }}>
                                            {t('farmguide.day') || 'Day'}
                                        </th>
                                        <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)' }}>
                                            {t('farmguide.week') || 'Week'}
                                        </th>
                                    </>
                                ) : (
                                    <>
                                        <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)' }}>
                                            {t('farmguide.week') || 'Week'}
                                        </th>
                                        {(module === 'broiler' || module === 'parent_stock') && (
                                            <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)' }}>
                                                {t('farmguide.day') || 'Day'}
                                            </th>
                                        )}
                                    </>
                                )}
                                <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)' }}>
                                    {t('farmguide.stdBW') || 'BW'} (g)
                                </th>
                                <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)' }}>
                                    {viewMode === 'daily' ? (t('farmguide.adg') || 'ADG (g)') : (t('farmguide.weeklyGain') || 'Gain (g)')}
                                </th>
                                {module === 'layer' && (
                                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)' }}>
                                        Feed Phase
                                    </th>
                                )}
                                {module === 'color_chicken' && tableData[0].fcr !== undefined && (
                                    <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)' }}>
                                        FCR
                                    </th>
                                )}
                                {module !== 'broiler' && tableData[0].feed !== null && tableData[0].feed !== undefined && (
                                    <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)' }}>
                                        {t('farmguide.feedPerDay') || 'Feed/Day'} (g)
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((row, idx) => {
                                const isActive = viewMode === 'daily' ? row.day === selectedDay : row.week === selectedWeek;
                                const rowId = viewMode === 'daily' ? `bw-row-day-${row.day}` : `bw-row-${row.week}`;
                                
                                return (
                                    <tr 
                                        key={idx}
                                        id={rowId}
                                        style={{ 
                                            borderTop: '1px solid var(--fw-border)',
                                            background: isActive ? 'var(--fw-teal)' : 'transparent'
                                        }}
                                    >
                                        {viewMode === 'daily' ? (
                                            <>
                                                <td style={{ 
                                                    padding: '0.75rem', 
                                                    fontSize: isActive ? 'calc(0.875rem * 1.1)' : '0.875rem',
                                                    fontWeight: isActive ? '700' : '400',
                                                    color: isActive ? '#ffffff' : 'var(--fw-text)'
                                                }}>
                                                    {row.day}
                                                </td>
                                                <td style={{ 
                                                    padding: '0.75rem', 
                                                    textAlign: 'right',
                                                    fontSize: isActive ? 'calc(0.875rem * 1.1)' : '0.875rem',
                                                    fontWeight: isActive ? '700' : '400',
                                                    color: isActive ? '#ffffff' : 'var(--fw-text)'
                                                }}>
                                                    {row.week}
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td style={{ 
                                                    padding: '0.75rem', 
                                                    fontSize: isActive ? 'calc(0.875rem * 1.1)' : '0.875rem',
                                                    fontWeight: isActive ? '700' : '400',
                                                    color: isActive ? '#ffffff' : 'var(--fw-text)'
                                                }}>
                                                    {row.week}
                                                </td>
                                                {(module === 'broiler' || module === 'parent_stock') && (
                                                    <td style={{ 
                                                        padding: '0.75rem', 
                                                        textAlign: 'right',
                                                        fontSize: isActive ? 'calc(0.875rem * 1.1)' : '0.875rem',
                                                        fontWeight: isActive ? '700' : '400',
                                                        color: isActive ? '#ffffff' : 'var(--fw-text)'
                                                    }}>
                                                        {row.day}
                                                    </td>
                                                )}
                                            </>
                                        )}
                                        <td style={{ 
                                            padding: '0.75rem', 
                                            textAlign: 'right', 
                                            fontSize: isActive ? 'calc(0.875rem * 1.1)' : '0.875rem',
                                            fontWeight: isActive ? '700' : '400',
                                            color: isActive ? '#ffffff' : 'var(--fw-text)'
                                        }}>
                                            {row.bw}
                                        </td>
                                        <td style={{ 
                                            padding: '0.75rem', 
                                            textAlign: 'right', 
                                            fontSize: isActive ? 'calc(0.875rem * 1.1)' : '0.875rem',
                                            fontWeight: isActive ? '700' : '400',
                                            color: isActive ? '#ffffff' : 'var(--fw-text)'
                                        }}>
                                            {row.gain ? Math.round(row.gain) : '—'}
                                        </td>
                                        {module === 'layer' && (
                                            <td style={{ 
                                                padding: '0.75rem', 
                                                textAlign: 'left',
                                                fontSize: isActive ? 'calc(0.875rem * 1.1)' : '0.875rem',
                                                fontWeight: isActive ? '700' : '400',
                                                color: isActive ? '#ffffff' : 'var(--fw-text)',
                                                textTransform: 'capitalize'
                                            }}>
                                                {row.feedPhase || '—'}
                                            </td>
                                        )}
                                        {module === 'color_chicken' && row.fcr !== undefined && (
                                            <td style={{ 
                                                padding: '0.75rem', 
                                                textAlign: 'right',
                                                fontSize: isActive ? 'calc(0.875rem * 1.1)' : '0.875rem',
                                                fontWeight: isActive ? '700' : '400',
                                                color: isActive ? '#ffffff' : 'var(--fw-text)'
                                            }}>
                                                {row.fcr ? row.fcr.toFixed(2) : '—'}
                                            </td>
                                        )}
                                        {module !== 'broiler' && row.feed !== null && row.feed !== undefined && (
                                            <td style={{ 
                                                padding: '0.75rem', 
                                                textAlign: 'right', 
                                                fontSize: isActive ? 'calc(0.875rem * 1.1)' : '0.875rem',
                                                fontWeight: isActive ? '700' : '400',
                                                color: isActive ? '#ffffff' : 'var(--fw-text)'
                                            }}>
                                                {row.feed ? Math.round(row.feed) : '—'}
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                
                {module === 'broiler' && (() => {
                    // BW Chart for Broiler
                    const chartData = viewMode === 'weekly' 
                        ? BROILER_WEEKLY_BW_STANDARD 
                        : BROILER_DAILY_BW;
                    
                    const maxBW = Math.max(...chartData.map(d => d.bw_g));
                    const chartHeight = 300;
                    const chartWidth = 800;
                    const padding = { top: 20, right: 40, bottom: 40, left: 60 };
                    const plotWidth = chartWidth - padding.left - padding.right;
                    const plotHeight = chartHeight - padding.top - padding.bottom;
                    
                    const xScale = viewMode === 'weekly'
                        ? (week) => padding.left + ((week - 1) / 7) * plotWidth
                        : (day) => padding.left + ((day - 1) / 55) * plotWidth;
                    
                    const yScale = (bw) => padding.top + plotHeight - (bw / 3500) * plotHeight;
                    
                    const points = chartData.map(d => {
                        const x = viewMode === 'weekly' ? xScale(d.week) : xScale(d.day);
                        const y = yScale(d.bw_g);
                        return `${x},${y}`;
                    }).join(' ');
                    
                    const currentX = viewMode === 'weekly' ? xScale(selectedWeek) : xScale(selectedDay);
                    
                    return (
                        <div style={{ marginTop: '1.5rem' }}>
                            <div style={{ 
                                fontSize: '0.875rem', 
                                fontWeight: '600', 
                                color: 'var(--fw-text)', 
                                marginBottom: '0.75rem' 
                            }}>
                                {t('farmguide.bwChart') || 'Standard BW Curve'}
                            </div>
                            <div style={{ 
                                background: 'var(--fw-card)', 
                                border: '1px solid var(--fw-border)', 
                                borderRadius: '8px', 
                                padding: '1rem',
                                overflowX: 'auto'
                            }}>
                                <svg width={chartWidth} height={chartHeight} style={{ display: 'block' }}>
                                    {/* Grid lines */}
                                    {[0, 500, 1000, 1500, 2000, 2500, 3000, 3500].map(bw => (
                                        <g key={bw}>
                                            <line
                                                x1={padding.left}
                                                y1={yScale(bw)}
                                                x2={chartWidth - padding.right}
                                                y2={yScale(bw)}
                                                stroke="var(--fw-border)"
                                                strokeWidth="1"
                                                strokeDasharray="4,4"
                                            />
                                            <text
                                                x={padding.left - 10}
                                                y={yScale(bw) + 4}
                                                textAnchor="end"
                                                fontSize="11"
                                                fill="var(--fw-sub)"
                                            >
                                                {bw}g
                                            </text>
                                        </g>
                                    ))}
                                    
                                    {/* BW line */}
                                    <polyline
                                        points={points}
                                        fill="none"
                                        stroke="var(--fw-teal)"
                                        strokeWidth="3"
                                    />
                                    
                                    {/* Current selection highlight */}
                                    <line
                                        x1={currentX}
                                        y1={padding.top}
                                        x2={currentX}
                                        y2={chartHeight - padding.bottom}
                                        stroke="var(--fw-orange)"
                                        strokeWidth="2"
                                        strokeDasharray="5,5"
                                    />
                                    
                                    {/* X-axis labels */}
                                    {viewMode === 'weekly' ? (
                                        [1, 2, 3, 4, 5, 6, 7, 8].map(week => (
                                            <text
                                                key={week}
                                                x={xScale(week)}
                                                y={chartHeight - padding.bottom + 20}
                                                textAnchor="middle"
                                                fontSize="11"
                                                fill="var(--fw-text)"
                                                fontWeight={week === selectedWeek ? '700' : '400'}
                                            >
                                                W{week}
                                            </text>
                                        ))
                                    ) : (
                                        [1, 7, 14, 21, 28, 35, 42, 49, 56].map(day => (
                                            <text
                                                key={day}
                                                x={xScale(day)}
                                                y={chartHeight - padding.bottom + 20}
                                                textAnchor="middle"
                                                fontSize="11"
                                                fill="var(--fw-text)"
                                            >
                                                D{day}
                                            </text>
                                        ))
                                    )}
                                    
                                    {/* Axis labels */}
                                    <text
                                        x={chartWidth / 2}
                                        y={chartHeight - 5}
                                        textAnchor="middle"
                                        fontSize="12"
                                        fill="var(--fw-sub)"
                                        fontWeight="600"
                                    >
                                        {viewMode === 'weekly' ? (t('farmguide.week') || 'Week') : (t('farmguide.day') || 'Day')}
                                    </text>
                                    <text
                                        x={15}
                                        y={chartHeight / 2}
                                        textAnchor="middle"
                                        fontSize="12"
                                        fill="var(--fw-sub)"
                                        fontWeight="600"
                                        transform={`rotate(-90, 15, ${chartHeight / 2})`}
                                    >
                                        {t('farmguide.bodyWeight') || 'Body Weight (g)'}
                                    </text>
                                </svg>
                            </div>
                        </div>
                    );
                })()}
            </div>
        );
    };

    const renderChecklistTab = () => {
        if (module === 'broiler' || module === 'color_chicken') {
            const weekData = module === 'broiler' ? BROILER_GUIDE[selectedWeek - 1] : COLOR_CHICKEN_GUIDE[selectedWeek - 1];
            if (!weekData) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--fw-sub)' }}>No data available</div>;
            
            const items = weekData.checklist || [];
            const completedCount = items.filter(item => checkedItems[item.id]).length;
            const totalCount = items.length;
            const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
            
            return (
                <div>
                    {/* Progress Bar */}
                    <div style={{
                        padding: '1rem',
                        background: 'var(--fw-card)',
                        border: '1px solid var(--fw-border)',
                        borderRadius: '8px',
                        marginBottom: '1.5rem'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-text)' }}>
                                ✓ {completedCount} / {totalCount} selesai
                            </span>
                            <span style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--fw-teal)' }}>
                                {progressPct}%
                            </span>
                        </div>
                        
                        <div style={{
                            width: '100%',
                            height: '8px',
                            background: 'var(--fw-border)',
                            borderRadius: '4px',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                width: `${progressPct}%`,
                                height: '100%',
                                background: 'var(--fw-teal)',
                                transition: 'width 0.3s'
                            }} />
                        </div>
                    </div>
                    
                    {/* Focus Area */}
                    <div style={{
                        padding: '0.75rem 1rem',
                        marginBottom: '1rem',
                        background: 'var(--fw-teal-lt)',
                        border: '1px solid var(--fw-teal)',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        color: 'var(--fw-text)'
                    }}>
                        <strong>Focus:</strong> {weekData.titleKey ? (tSafe('farmguide.' + weekData.titleKey) ?? weekData.title) : weekData.title}
                    </div>
                    
                    {/* Checklist Items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                        {items.map(item => (
                            <ChecklistItem
                                key={item.id}
                                id={item.id}
                                text={item.text[lang] ?? item.text['en']}
                                priority={item.priority}
                                checked={!!checkedItems[item.id]}
                                onToggle={handleChecklistToggle}
                            />
                        ))}
                    </div>
                    
                    {/* Key Points Section */}
                    <div style={{
                        padding: '1.5rem',
                        background: 'var(--fw-card)',
                        border: '2px solid var(--fw-border)',
                        borderRadius: '12px'
                    }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--fw-text)', marginBottom: '1rem' }}>
                            📌 Key Points
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {weekData.key_points.map((kp, idx) => (
                                <div key={idx} style={{
                                    display: 'flex',
                                    gap: '0.75rem',
                                    padding: '0.75rem',
                                    background: 'var(--fw-bg)',
                                    borderRadius: '8px'
                                }}>
                                    <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{kp.icon}</span>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--fw-text)', margin: 0, lineHeight: '1.5' }}>
                                        {kp.text[lang] ?? kp.text['en']}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Daily Mode Note */}
                    {viewMode === 'daily' && (
                        <div style={{
                            marginTop: '1rem',
                            padding: '0.75rem 1rem',
                            background: 'var(--fw-teal-lt)',
                            border: '1px solid var(--fw-teal)',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            color: 'var(--fw-text)'
                        }}>
                            💡 Checklist berlaku untuk seluruh minggu ini (W{selectedWeek})
                        </div>
                    )}
                </div>
            );
        }
        
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
    };

    const renderReferencesTab = () => (
        <div style={{ maxWidth: '700px', padding: '8px 0' }}>
            <h3 style={{ marginBottom: '8px' }}>About These Standards</h3>
            <p style={{ color: 'var(--fw-sub)', lineHeight: '1.7', marginBottom: '24px', fontSize: '14px' }}>
                Performance standards in this app represent <strong>averaged ranges</strong> derived
                from multiple commercial broiler industry handbooks. Values are general guidelines
                for broiler production — not specifications from any specific breed or company.
            </p>

            <h4 style={{ marginBottom: '8px' }}>Methodology</h4>
            <p style={{ color: 'var(--fw-sub)', lineHeight: '1.7', marginBottom: '24px', fontSize: '14px' }}>
                Body weight and feed intake ranges are derived by averaging performance data
                from multiple commercial broiler production standards. An acceptable tolerance
                of ±3% is applied beyond the natural variation observed across all referenced
                sources to account for normal on-farm conditions.
            </p>

            <h4 style={{ marginBottom: '12px' }}>References</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                {[
                    { title: 'Commercial Broiler Management Guide',          year: '2025', type: 'Management Guide'   },
                    { title: 'Commercial Broiler Performance Objectives',    year: '2022', type: 'Performance Data'   },
                    { title: 'Broiler Production Standard Reference',        year: '2023', type: 'Industry Standard'  },
                    { title: 'Commercial Poultry Management Handbook',       year: '2022', type: 'Management Guide'   },
                ].map((ref, i) => (
                    <div key={i} style={{
                        padding: '12px 16px', background: 'white',
                        borderRadius: '8px', border: '1px solid var(--fw-border)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                        <div>
                            <div style={{ fontWeight: '600', fontSize: '14px' }}>{ref.title}</div>
                            <div style={{ fontSize: '12px', color: 'var(--fw-sub)', marginTop: '2px' }}>
                                {ref.type} · {ref.year}
                            </div>
                        </div>
                        <span style={{
                            fontSize: '11px', padding: '3px 10px',
                            background: 'var(--fw-teal-lt, #E6F5F2)',
                            color: 'var(--fw-teal)', borderRadius: '20px', fontWeight: '600',
                        }}>Verified</span>
                    </div>
                ))}
            </div>

            <div style={{
                background: '#FFF9EC', border: '1px solid #F6D860',
                borderRadius: '8px', padding: '14px 16px',
                fontSize: '13px', color: '#6b5b00', lineHeight: '1.6',
            }}>
                <strong>⚠ Disclaimer:</strong> Performance data shown in this application is aggregated from
                multiple industry sources and represents general guidance only. This data is
                not affiliated with, endorsed by, or sourced directly from any specific breed
                company or genetics supplier. Actual performance will vary based on genetics,
                environment, nutrition, health status, and management practices.
            </div>
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'environment':
                return renderEnvironmentTab();
            case 'feed':
                return renderFeedTab();
            case 'bw':
                return renderBWTab();
            case 'checklist':
                return renderChecklistTab();
            case 'references':
                return renderReferencesTab();
            default:
                return null;
        }
    };

    if (!flockContext) {
        return null;
    }

    return (
        <div className="fw-page">
            <SharedTopNav />

            <div className="fw-section">
                {/* Flock Badge */}
                <div style={{ marginBottom: '1rem' }}>
                    <div style={{
                        display: 'inline-block',
                        padding: '0.375rem 0.875rem',
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

                {/* ─── LEVEL 1: Main Tab Navigation ─── */}
                {renderMainTabNav()}

                {/* ─── LEVEL 2: Sub-Tab Navigation (only for Guide) ─── */}
                {renderSubTabNav()}

                {/* ─── Week/Day Selector ─── */}
                {mainTab === 'guide' && module === 'broiler' && activeTab !== 'references' && (
                    <WeekDaySelector
                        mode="weekday"
                        totalWeeks={8}
                        selectedWeek={selectedWeek}
                        selectedDay={selectedDay}
                        showDailyToggle={activeTab !== 'checklist'}
                        selectedMode={viewMode}
                        onWeekChange={(w) => setSelectedWeek(Number(w))}
                        onDayChange={(d) => setSelectedDay(Number(d))}
                        onModeChange={(m) => setViewMode(m)}
                    />
                )}

                {/* ─── Weekly/Daily Toggle (only for non-Broiler modules) ─── */}
                {mainTab === 'guide' && module !== 'broiler' && (
                    <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        marginBottom: '0.5rem'
                    }}>
                        <button
                            onClick={handleSwitchToWeekly}
                            style={{
                                padding: '0.375rem 1rem',
                                borderRadius: '20px',
                                border: `1.5px solid var(--fw-teal)`,
                                background: viewMode === 'weekly' ? 'var(--fw-teal)' : 'transparent',
                                color: viewMode === 'weekly' ? '#ffffff' : 'var(--fw-teal)',
                                fontWeight: viewMode === 'weekly' ? '600' : '500',
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                                transition: 'all 0.15s'
                            }}
                        >
                            {t('farmguide.weekly') || 'Weekly'}
                        </button>
                        <button
                            onClick={handleSwitchToDaily}
                            style={{
                                padding: '0.375rem 1rem',
                                borderRadius: '20px',
                                border: `1.5px solid var(--fw-teal)`,
                                background: viewMode === 'daily' ? 'var(--fw-teal)' : 'transparent',
                                color: viewMode === 'daily' ? '#ffffff' : 'var(--fw-teal)',
                                fontWeight: viewMode === 'daily' ? '600' : '500',
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                                transition: 'all 0.15s'
                            }}
                        >
                            {t('farmguide.daily') || 'Daily'}
                        </button>
                    </div>
                )}

                {/* ─── Period Selector (only for non-Broiler modules) ─── */}
                {mainTab === 'guide' && module !== 'broiler' && (
                    <div style={{
                        display: 'flex',
                        gap: '0.375rem',
                        flexWrap: 'wrap',
                        marginBottom: '1rem'
                    }}>
                        {viewMode === 'weekly' ? (
                        (() => {
                            const range = WEEK_RANGES[module] || { min: 1, max: 8 };
                            const weeks = [];
                            for (let i = range.min; i <= range.max; i++) {
                                weeks.push(i);
                            }
                            return weeks.map(week => (
                                <button
                                    key={week}
                                    onClick={() => handleWeekSelect(week)}
                                    style={{
                                        padding: '0.375rem 0.75rem',
                                        borderRadius: '8px',
                                        border: '1px solid var(--fw-border)',
                                        background: selectedWeek === week ? 'var(--fw-orange)' : '#ffffff',
                                        color: selectedWeek === week ? '#ffffff' : 'var(--fw-text)',
                                        fontWeight: selectedWeek === week ? '600' : '500',
                                        fontSize: '0.875rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.15s'
                                    }}
                                >
                                    W{week}
                                </button>
                            ));
                        })()
                    ) : (
                        daysInSelectedWeek.map(day => (
                            <button
                                key={day}
                                onClick={() => handleDaySelect(day)}
                                style={{
                                    padding: '0.375rem 0.75rem',
                                    borderRadius: '8px',
                                    border: '1px solid var(--fw-border)',
                                    background: selectedDay === day ? 'var(--fw-orange)' : '#ffffff',
                                    color: selectedDay === day ? '#ffffff' : 'var(--fw-text)',
                                    fontWeight: selectedDay === day ? '600' : '500',
                                    fontSize: '0.875rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s'
                                }}
                            >
                                D{day}
                            </button>
                        ))
                    )}
                    </div>
                )}

                {/* ─── Phase Pill, Title, Tags + Alert (only for Guide + Color Chicken) ─── */}
                {mainTab === 'guide' && module === 'color_chicken' && COLOR_CHICKEN_GUIDE[selectedWeek - 1] && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        {(() => {
                            const weekData = COLOR_CHICKEN_GUIDE[selectedWeek - 1];
                            const phaseColor = weekData.phase === 'Brooding' ? '#E8652A' : 
                                             weekData.phase === 'Grower' ? '#1B7A6E' : 
                                             weekData.phase === 'Finisher' ? '#C47A1A' : '#8B5CF6';
                            
                            return (
                                <>
                                    {/* ROW 4: Phase Pill */}
                                    <div style={{
                                        display: 'inline-block',
                                        padding: '0.375rem 0.875rem',
                                        marginBottom: '0.75rem',
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        color: 'white',
                                        background: phaseColor,
                                        borderRadius: '6px'
                                    }}>
                                        {weekData.phase} · {viewMode === 'weekly' ? `Week ${selectedWeek}` : `Day ${selectedDay}`}
                                    </div>
                                    
                                    {/* ROW 5: Title with Emoji */}
                                    <h2 style={{
                                        fontSize: '1.5rem',
                                        fontWeight: '700',
                                        color: 'var(--fw-text)',
                                        marginBottom: '0.75rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        <span>{weekData.emoji}</span>
                                        <span>{weekData.titleKey ? (tSafe('farmguide.' + weekData.titleKey) ?? weekData.title) : weekData.title}</span>
                                    </h2>
                                    
                                    {/* ROW 6: Tags + Alert */}
                                    <div style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '0.5rem',
                                        marginBottom: weekData.alert ? '1rem' : '0'
                                    }}>
                                        {(weekData.tags[lang] ?? weekData.tags['en']).map((tag, idx) => (
                                            <span key={idx} style={{
                                                padding: '0.25rem 0.75rem',
                                                fontSize: '0.75rem',
                                                fontWeight: '500',
                                                color: 'var(--fw-text)',
                                                background: 'var(--fw-bg)',
                                                border: '1px solid var(--fw-border)',
                                                borderRadius: '4px'
                                            }}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    
                                    {weekData.alert && (
                                        <div style={{
                                            padding: '1rem',
                                            marginTop: '1rem',
                                            background: 'var(--fw-orange-lt)',
                                            border: '2px solid var(--fw-orange)',
                                            borderRadius: '8px'
                                        }}>
                                            <div style={{
                                                fontSize: '0.875rem',
                                                fontWeight: '700',
                                                color: 'var(--fw-text)',
                                                marginBottom: '0.5rem'
                                            }}>
                                                ⚠️ {weekData.alert.title[lang] ?? weekData.alert.title['en']}
                                            </div>
                                            <div style={{
                                                fontSize: '0.875rem',
                                                color: 'var(--fw-text)',
                                                lineHeight: '1.5'
                                            }}>
                                                {weekData.alert.text[lang] ?? weekData.alert.text['en']}
                                            </div>
                                        </div>
                                    )}
                                </>
                            );
                        })()}
                    </div>
                )}

                {/* Content Area */}
                <div className="content-area">
                    {mainTab === 'guide' && renderTabContent()}
                    {mainTab === 'flock' && <FlockSaya module={module} embedded={true} />}
                </div>
            </div>
        </div>
    );
}

export default ManagementGuide;
