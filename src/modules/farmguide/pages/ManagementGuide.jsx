import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useTranslation } from '../../../hooks/useTranslation';
import ChecklistItem from '../components/ChecklistItem';
import WeekDaySelector from '../components/WeekDaySelector';
import { BROILER_GUIDE, FEED_WEEKLY, BROILER_DAILY_ENV } from '../data/broilerGuideData';
import { COLOR_CHICKEN_GUIDE, COLOR_CHICKEN_TARGETS } from '../data/colorChickenGuideData';
import { getColorRange } from '../data/colorChickenRangeData';
import { LAYER_GUIDE } from '../data/layerGuideData';
import { LAYER_RANGE, LAYER_REARING, LAYER_PRODUCTION, getLayerStd, getLayerPhase } from '../data/layerRangeData';
import { getLayerBreedStd } from '../utils/layerBreedUtils';
import { PS_FEMALE_BW, PS_MALE_BW, PS_FEMALE_FEED, PS_MALE_FEED, PS_EGG_PRODUCTION, PS_BROODING_DAILY, PS_CHECKLIST_DAILY } from '../data/broilerPSRangeData';
import { BROILER_PS_GUIDE } from '../data/broilerPSGuideData';
import { LAYER_PS_GUIDE } from '../data/layerPSGuideData';
import { LAYER_PS_FEMALE_BW, LAYER_PS_MALE_BW, LAYER_PS_EP, LAYER_PS_CONFIG } from '../data/layerPSRangeData';
import FlockSaya from './FlockSaya';
import GrowthChart from './GrowthChart';
import '../../../portal.css';

const WEEK_RANGES = {
    broiler: { min: 1, max: 8, label: 'Minggu' },
    layer: { min: 1, max: 80, label: 'Minggu' },
    color_chicken: { min: 1, max: 18, label: 'Minggu' },
    parent_stock: { min: 1, max: 64, label: 'Minggu' },
    layer_ps: { min: 1, max: 75, label: 'Minggu' },
    color_ps: { min: 1, max: 70, label: 'Week' },
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

const ManagementGuide = ({ module: moduleProp } = {}) => {
    const navigate = useNavigate();
    const { module: moduleParam, moduleSlug } = useParams();
    const module = moduleProp || moduleParam || moduleSlug;
    const { t, tSafe, language } = useTranslation();
    const lang = language || 'en';
    const { language: langContext, setLanguage } = useLanguage();
    const languages = [
        { code: 'en', flag: '/images/flags/flag_en.png', label: 'EN' },
        { code: 'id', flag: '/images/flags/flag_id.png', label: 'ID' },
        { code: 'vi', flag: '/images/flags/flag_vn.png', label: 'VI' },
    ];

    const [flockContext, setFlockContext] = useState(null);
    const [selectedWeek, setSelectedWeek] = useState(() => {
        if (typeof window !== 'undefined') {
            const ctx = JSON.parse(localStorage.getItem('farmguide_active_flock') || '{}');
            const currentModule = ctx.module_id || ctx.module || '';
            if (currentModule === 'parent_stock') {
                const saved = JSON.parse(localStorage.getItem('farmguide_ps_phase') || '{}');
                return saved.phase === 'production' ? 25 : 1;
            }
            if (currentModule === 'layer_ps') {
                const saved = JSON.parse(localStorage.getItem('farmguide_ps_phase') || '{}');
                return saved.phase === 'production' ? 19 : 1;
            }
        }
        return 1;
    });
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
    
    // Color Chicken state
    const [colorVariant, setColorVariant] = useState(() => {
        const saved = JSON.parse(localStorage.getItem('farmguide_active_flock') || '{}');
        return saved.breed_code || 'choi';
    });
    const [colorSex, setColorSex] = useState(() => {
        const saved = JSON.parse(localStorage.getItem('farmguide_active_flock') || '{}');
        return saved.sex || 'male';
    });
    
    // Parent Stock state
    const [psSex, setPsSex] = useState(() => {
        const saved = JSON.parse(localStorage.getItem('farmguide_active_flock') || '{}');
        return saved.sex || 'female';
    });
    const [psPhase, setPsPhase] = useState(() => {
        const saved = JSON.parse(localStorage.getItem('farmguide_ps_phase') || '{}');
        return saved.phase || 'rearing';
    });
    const [psBroodingDay, setPsBroodingDay] = useState(1); // For W1 brooding daily selector
    
    // Checklist state
    const [checkedItems, setCheckedItems] = useState({});
    const [layerBreedData, setLayerBreedData] = useState(null);

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

    // Fetch breed JSON for layer commercial
    useEffect(() => {
        if (!flockContext || flockContext.module_id !== 'layer') return;
        if (!flockContext.breed_json) { setLayerBreedData(null); return; }
        setLayerBreedData(null);
        fetch(flockContext.breed_json)
            .then(r => r.json())
            .then(data => setLayerBreedData(data))
            .catch(() => setLayerBreedData(null));
    }, [flockContext]);

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
    }, [activeTab, module, psSex]);

    useEffect(() => {
        // Save viewMode to localStorage
        localStorage.setItem('farmguide_bw_view_mode', viewMode);
    }, [viewMode]);

    useEffect(() => {
        // Auto-scroll to active row when week/day changes in BW or Feed tab
        if ((activeTab === 'bw' || activeTab === 'feed') && (bwData || module === 'broiler' || module === 'layer' || module === 'color_chicken')) {
            let rowId;
            if (activeTab === 'bw') {
                if (module === 'layer') {
                    rowId = `layer-bw-row-${selectedWeek}`;
                } else if (module === 'color_chicken') {
                    rowId = viewMode === 'daily' ? `color-bw-row-day-${selectedDay}` : `color-bw-row-week-${selectedWeek}`;
                } else {
                    rowId = viewMode === 'daily' ? `bw-row-day-${selectedDay}` : `bw-row-${selectedWeek}`;
                }
            } else if (activeTab === 'feed' && module === 'color_chicken') {
                rowId = viewMode === 'daily' ? `color-feed-row-day-${selectedDay}` : `color-feed-row-week-${selectedWeek}`;
            }
            
            if (rowId) {
                const activeRow = document.getElementById(rowId);
                if (activeRow) {
                    setTimeout(() => {
                        activeRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 100);
                }
            }
        }
    }, [selectedWeek, selectedDay, activeTab, bwData, module, viewMode]);

    useEffect(() => {
        // Auto-scroll for parent_stock BW tab
        if (module === 'parent_stock' && activeTab === 'bw') {
            setTimeout(() => {
                document.getElementById(`ps-bw-row-${selectedWeek}`)
                    ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }, [selectedWeek, activeTab, module]);

    useEffect(() => {
        // Auto-scroll for parent_stock Feed tab
        if (module === 'parent_stock' && activeTab === 'feed') {
            setTimeout(() => {
                document.getElementById(`ps-feed-row-${selectedWeek}`)
                    ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }, [selectedWeek, activeTab, module]);

    useEffect(() => {
        // Auto-scroll for parent_stock Egg Production tab
        if (module === 'parent_stock' && activeTab === 'eggProduction') {
            setTimeout(() => {
                document.getElementById(`ps-ep-row-${selectedWeek}`)
                    ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }, [selectedWeek, activeTab, module]);

    const loadBWData = () => {
        if (module === 'broiler') {
            const ctx = JSON.parse(localStorage.getItem('farmguide_active_flock') || '{}');
            const breedJson = ctx.breed_json || '/data/farmguide_data/breeds/broiler_ross.json';
            fetch(breedJson)
                .then(r => r.json())
                .then(data => {
                    const weekly = data.as_hatched.weekly_summary;
                    const weeklyStandard = weekly.map((row, idx) => ({
                        week: row.week,
                        day: row.day,
                        bw_g: row.bw_g,
                        gain_g: idx > 0 ? row.bw_g - weekly[idx - 1].bw_g : null,
                    }));
                    const dailyStandard = [];
                    for (let i = 0; i < weekly.length; i++) {
                        const startDay = i === 0 ? 1 : weekly[i - 1].day + 1;
                        const endDay = weekly[i].day;
                        const startBw = i === 0 ? 44 : weekly[i - 1].bw_g;
                        const endBw = weekly[i].bw_g;
                        const days = endDay - startDay + 1;
                        for (let d = 0; d < days; d++) {
                            const day = startDay + d;
                            const bw_g = Math.round(startBw + ((endBw - startBw) * (d + 1) / days));
                            const week = weekly[i].week;
                            dailyStandard.push({
                                day,
                                week,
                                bw_g,
                                gain_g: day > 1 ? bw_g - (dailyStandard[dailyStandard.length - 1]?.bw_g || 44) : null,
                            });
                        }
                    }
                    setBwData({ weeklyStandard, dailyStandard, meta: data._meta });
                })
                .catch(err => console.error('Failed to load broiler breed BW data:', err));
        } else if (module === 'layer') {
            fetch('/data/farmguide_data/breeds/layer_standards.json')
                .then(r => r.json())
                .then(data => setBwData(data))
                .catch(err => console.error('Failed to load layer BW data:', err));
        } else if (module === 'parent_stock') {
            const ctx = JSON.parse(localStorage.getItem('farmguide_active_flock') || '{}');
            const breedJson = ctx.breed_json;
            if (breedJson && breedJson.includes('ps_broiler')) {
                fetch(breedJson)
                    .then(r => r.json())
                    .then(data => {
                        const weeklyStandard = (data.female_bw_inseason || [])
                            .filter(r => r.week > 0)
                            .map(r => ({
                                week: r.week,
                                day: r.day,
                                bw_g: r.bw_g,
                                weekly_gain_g: r.weekly_gain_g,
                                feed_g_bird_day: r.feed_g_bird_day
                            }));
                        const weeklyProduction = (data.weekly_production || []).map(r => ({
                            prod_week: r.prod_week,
                            age_weeks: r.age_weeks,
                            hen_housed_pct: r.hen_housed_pct,
                            eggs_bird_week: r.eggs_bird_week,
                            eggs_bird_cum: r.eggs_bird_cum,
                            hatching_eggs_week: r.hatching_eggs_week,
                            hatching_eggs_cum: r.hatching_eggs_cum,
                            hatchability_pct: r.hatchability_pct,
                            chicks_week: r.chicks_week,
                            chicks_cum: r.chicks_cum
                        }));
                        setBwData({
                            ...data,
                            weeklyStandard,
                            weeklyProduction,
                            breedLabel: data.breed_label,
                            source: data.source
                        });
                    })
                    .catch(err => console.error('Failed to load PS breed BW data:', err));
            } else {
                fetch('/data/farmguide_data/breeds/ps_standards.json')
                    .then(r => r.json())
                    .then(data => setBwData(data))
                    .catch(err => console.error('Failed to load PS BW data:', err));
            }
        } else if (module === 'layer_ps') {
            const ctx = JSON.parse(localStorage.getItem('farmguide_active_flock') || '{}');
            const breedJson = ctx.breed_json;
            if (breedJson && breedJson.includes('ps_layer')) {
                fetch(breedJson)
                    .then(r => r.json())
                    .then(data => {
                        // --- MALE branch (rearing only, no production phase) ---
                        if (psSex === 'male') {
                            const maleRearing = data.male_bw_rearing ?? [];
                            const maleData = maleRearing.map(r => ({
                                week: r.week,
                                bw_g: r.bw_g,
                                bw_range_low: r.bw_range_low || null,
                                bw_range_high: r.bw_range_high || null,
                                feed_g_bird_day: r.feed_g_bird_day || null,
                                phase: 'rearing'
                            }));
                            setBwData({
                                ...data,
                                weeklyStandard: maleData,
                                weeklyProduction: [],
                                breedLabel: data.breed_label,
                                isLayerPS: true
                            });
                            return;
                        }

                        // --- FEMALE branch (existing logic — unchanged) ---
                        const weeklyStandard = [
                            ...(data.female_bw_rearing || []).map(r => ({
                                week: r.week,
                                bw_g: r.bw_g,
                                bw_range_low: r.bw_range_low || null,
                                bw_range_high: r.bw_range_high || null,
                                feed_g_bird_day: r.feed_g_bird_day || null,
                                phase: 'rearing'
                            })),
                            ...(data.female_bw_production || []).map(r => ({
                                week: r.week,
                                bw_g: r.bw_g,
                                bw_range_low: null,
                                bw_range_high: null,
                                feed_g_bird_day: r.feed_g_bird_day || null,
                                phase: 'production'
                            }))
                        ];
                        const weeklyProduction = (data.weekly_production || []).map(r => ({
                            age_weeks: r.age_weeks,
                            prod_week: r.age_weeks,
                            hen_housed_pct: r.lay_rate_hd_pct,
                            eggs_bird_week: r.eggs_bird_week,
                            eggs_bird_cum: r.eggs_bird_cum,
                            hatching_eggs_week: r.he_bird_week,
                            hatching_eggs_cum: r.he_bird_cum,
                            hatchability_pct: r.hatchability_pct ?? r.settable_pct ?? null,
                            chicks_week: r.chicks_bird_week,
                            chicks_cum: r.chicks_bird_cum,
                            feed_g_bird_day: r.feed_g_bird_day || null
                        }));
                        setBwData({
                            ...data,
                            weeklyStandard,
                            weeklyProduction,
                            breedLabel: data.breed_label,
                            isLayerPS: true
                        });
                    })
                    .catch(err => console.error('Failed to load Layer PS breed data:', err));
            }

        } else if (module === 'color_ps') {
            const ctx = JSON.parse(localStorage.getItem('farmguide_active_flock') || '{}');
            const breedJson = ctx.breed_json;
            if (breedJson && breedJson.includes('ps_color')) {
                fetch(breedJson)
                    .then(r => r.json())
                    .then(data => {
                        const weeklyStandard = [
                            ...(data.female_bw_rearing || []).map(r => ({
                                week: r.week,
                                bw_g: r.bw_g,
                                feed_g_bird_day: r.feed_g_bird_day || null,
                                phase: 'rearing'
                            })),
                            ...(data.female_bw_production || []).map(r => ({
                                week: r.week,
                                bw_g: r.bw_g,
                                feed_g_bird_day: null,
                                phase: 'production'
                            }))
                        ];
                        const weeklyProduction = (data.weekly_production || []).map(r => ({
                            age_weeks: r.age_weeks,
                            prod_week: r.age_weeks,
                            hen_housed_pct: r.prod_pct,
                            eggs_bird_week: r.eggs_bird_week,
                            eggs_bird_cum: r.eggs_bird_cum,
                            egg_weight_g: r.egg_weight_g,
                            hatching_eggs_week: r.he_bird_week,
                            hatching_eggs_cum: r.he_bird_cum,
                            hatchability_pct: r.he_pct_te ?? null,
                            chicks_week: null,
                            chicks_cum: null,
                            feed_g_bird_day: null
                        }));
                        setBwData({
                            ...data,
                            weeklyStandard,
                            weeklyProduction,
                            breedLabel: data.breed_label,
                            isColorPS: true
                        });
                    })
                    .catch(err => console.error('Failed to load Color PS breed data:', err));
            }
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

    const handleVariantChange = (variant) => {
        setColorVariant(variant);
        const flock = JSON.parse(localStorage.getItem('farmguide_active_flock') || '{}');
        flock.breed_code = variant;
        localStorage.setItem('farmguide_active_flock', JSON.stringify(flock));
    };

    const handleSexChange = (sex) => {
        setColorSex(sex);
        const flock = JSON.parse(localStorage.getItem('farmguide_active_flock') || '{}');
        flock.sex = sex;
        localStorage.setItem('farmguide_active_flock', JSON.stringify(flock));
    };

    const handlePSSexChange = (sex) => {
        setPsSex(sex);
        setBwData(null);
        if (sex === 'male') setPsPhase('rearing');
        const flock = JSON.parse(localStorage.getItem('farmguide_active_flock') || '{}');
        flock.sex = sex;
        localStorage.setItem('farmguide_active_flock', JSON.stringify(flock));
    };

    const handlePSPhaseChange = (phase) => {
        setPsPhase(phase);
        localStorage.setItem('farmguide_ps_phase', JSON.stringify({ phase }));
        // Set week to first week of selected phase
        if (phase === 'rearing') {
            setSelectedWeek(1);
        } else {
            // Layer PS production starts W19, Broiler PS starts W25
            setSelectedWeek(module === 'layer_ps' ? 19 : 25);
        }
    };

    const getModuleName = () => {
        const names = {
            broiler: 'Broiler',
            layer: 'Layer',
            color_chicken: 'Color Chicken',
            parent_stock: 'Parent Stock (PS)',
            layer_ps: 'Layer PS',
            color_ps: 'Color PS',
        };
        return names[module] || module;
    };

    const layerPSGuideEntry = useMemo(() => {
        if (module !== 'layer_ps') return null;
        const isProduction = psPhase === 'production';
        const entries = LAYER_PS_GUIDE.filter(e =>
            isProduction ? e.phase === 'production' : e.phase === 'rearing'
        );
        let matched = entries[0];
        for (const entry of entries) {
            if (entry.week <= selectedWeek) matched = entry;
        }
        return matched || null;
    }, [module, psPhase, selectedWeek]);

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
            const ctx = JSON.parse(localStorage.getItem('farmguide_active_flock') || '{}');
            return ctx.breed_label ? 'Broiler · ' + ctx.breed_label : 'Broiler Commercial';
        }

        // Parent Stock (PS) — read breed_label directly, works for all 4 PS breeds
        if (module === 'parent_stock') {
            const ctx = JSON.parse(localStorage.getItem('farmguide_active_flock') || '{}');
            const label = ctx.breed_label;
            if (label) return 'Parent Stock (PS) · ' + label;
            return 'Parent Stock (PS)';
        }

        // Layer Commercial
        if (module === 'layer') {
            const ctx = JSON.parse(localStorage.getItem('farmguide_active_flock') || '{}');
            const label = ctx.breed_label;
            if (label) return 'Layer Commercial · ' + label;
            return 'Layer Commercial';
        }

        // Layer PS
        if (module === 'layer_ps') {
            const ctx = JSON.parse(localStorage.getItem('farmguide_active_flock') || '{}');
            const label = ctx.breed_label;
            if (label) return 'Layer PS · ' + label;
            return 'Layer PS';
        }

        if (module === 'color_ps') {
            const ctx = JSON.parse(localStorage.getItem('farmguide_active_flock') || '{}');
            const label = ctx.breed_label;
            if (label) return 'Color PS · ' + label;
            return 'Color PS';
        }
        
        const parts = [getModuleName()];
        
        // Untuk color_chicken, tampilkan variant (choi/mia) dengan kapital dari STATE
        if (module === 'color_chicken') {
            // Use colorVariant STATE instead of localStorage
            if (colorVariant) {
                parts.push(colorVariant.charAt(0).toUpperCase() + colorVariant.slice(1));
            }
        } else if (flockContext.breed_code && BREED_LABELS[flockContext.breed_code]) {
            parts.push(BREED_LABELS[flockContext.breed_code]);
        }
        
        // For color_chicken, use colorSex STATE instead of flockContext.sex
        if (module === 'color_chicken') {
            const sexSymbol = colorSex === 'male' ? '♂' : colorSex === 'female' ? '♀' : null;
            if (sexSymbol) {
                parts.push(sexSymbol);
            }
        } else if (flockContext.sex) {
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
        
        let subTabs = [
            { id: 'environment', label: t('farmguide.tabEnvironment') || 'Environment' },
            { id: 'feed', label: t('farmguide.tabFeed') || 'Feed Program' },
            { id: 'bw', label: t('farmguide.tabBW') || 'Body Weight' },
            { id: 'checklist', label: t('farmguide.tabChecklist') || 'Checklist' },
            { id: 'references', label: 'References' },
        ];
        
        // Add Egg Production tab for Layer and Parent Stock modules
        if (module === 'layer') {
            subTabs = [
                { id: 'environment', label: t('farmguide.tabEnvironment') || 'Environment' },
                { id: 'feed', label: t('farmguide.tabFeed') || 'Feed Program' },
                { id: 'bw', label: t('farmguide.tabBW') || 'Body Weight' },
                { id: 'eggProduction', label: t('farmguide.eggProduction') || 'Egg Production' },
                { id: 'checklist', label: t('farmguide.tabChecklist') || 'Checklist' },
                { id: 'references', label: 'References' },
            ];
        }
        
        if (module === 'parent_stock') {
            subTabs = [
                { id: 'environment', label: t('farmguide.tabEnvironment') || 'Environment' },
                { id: 'feed', label: t('farmguide.tabFeed') || 'Feed Program' },
                { id: 'bw', label: t('farmguide.tabBW') || 'Body Weight' },
                { id: 'eggProduction', label: t('farmguide.eggProduction') || 'Egg Production' },
                { id: 'checklist', label: t('farmguide.tabChecklist') || 'Checklist' },
                { id: 'references', label: 'References' },
            ];
        }

        if (module === 'layer_ps') {
            subTabs = [
                { id: 'environment', label: t('farmguide.tabEnvironment') || 'Environment' },
                { id: 'feed', label: t('farmguide.tabFeed') || 'Feed Program' },
                { id: 'bw', label: t('farmguide.tabBW') || 'Body Weight' },
                { id: 'eggProduction', label: t('farmguide.eggProduction') || 'Egg Production' },
                { id: 'checklist', label: t('farmguide.tabChecklist') || 'Checklist' },
                { id: 'references', label: 'References' },
            ];
        }

        if (module === 'color_ps') {
            subTabs = [
                { id: 'environment', label: t('farmguide.tabEnvironment') || 'Environment' },
                { id: 'feed', label: t('farmguide.tabFeed') || 'Feed Program' },
                { id: 'bw', label: t('farmguide.tabBW') || 'Body Weight' },
                { id: 'eggProduction', label: t('farmguide.eggProduction') || 'Egg Production' },
                { id: 'checklist', label: t('farmguide.tabChecklist') || 'Checklist' },
                { id: 'references', label: 'References' },
            ];
        }
        
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
        if (module === 'parent_stock') {
            const isPSBrooding = selectedWeek === 1;
            
            if (isPSBrooding) {
                // BROODING MODE (W1, D1-D28)
                const dayData = PS_BROODING_DAILY[psBroodingDay - 1];
                if (!dayData) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--fw-sub)' }}>No data available</div>;
                
                return (
                    <div>
                        {/* Day selector */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-text)', marginBottom: '0.5rem', display: 'block' }}>
                                {t('farmguide.broodingDaily') || 'Daily Brooding Data'} (D1-D28)
                            </label>
                            <select
                                value={psBroodingDay}
                                onChange={(e) => setPsBroodingDay(Number(e.target.value))}
                                style={{
                                    padding: '0.5rem 1rem',
                                    fontSize: '0.875rem',
                                    border: '1px solid var(--fw-border)',
                                    borderRadius: '8px',
                                    background: 'var(--fw-card)',
                                    color: 'var(--fw-text)',
                                    cursor: 'pointer'
                                }}
                            >
                                {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                                    <option key={day} value={day}>Day {day}</option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Main env cards */}
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
                                    {t('farmguide.tempTarget') || 'Temperature'}
                                </div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--fw-text)' }}>
                                    {dayData.temp_min}–{dayData.temp_max}°C
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
                                    {t('farmguide.humidity') || 'Humidity'}
                                </div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--fw-text)' }}>
                                    {dayData.humidity}
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
                                    {t('farmguide.lighting') || 'Lighting'}
                                </div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--fw-text)' }}>
                                    {dayData.lighting_hours} hrs
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--fw-sub)', marginTop: '0.25rem' }}>
                                    {dayData.light_lux_brooding} lux (brooding)
                                </div>
                            </div>
                            
                            <div style={{
                                padding: '1.5rem',
                                background: 'var(--fw-card)',
                                border: '2px solid var(--fw-border)',
                                borderRadius: '12px'
                            }}>
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌬️</div>
                                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)', marginBottom: '0.5rem' }}>
                                    {t('farmguide.ventilation') || 'Ventilation'}
                                </div>
                                <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--fw-text)' }}>
                                    {t('farmguide.' + dayData.ventilation) || dayData.ventilation}
                                </div>
                            </div>
                        </div>
                        
                        {/* Brooder density card */}
                        <div style={{
                            padding: '1rem',
                            background: 'var(--fw-card)',
                            border: '1px solid var(--fw-border)',
                            borderRadius: '8px',
                            marginBottom: '1.5rem'
                        }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--fw-sub)', marginBottom: '0.25rem' }}>
                                {t('farmguide.broodingDensity') || 'Brooder Density'}
                            </div>
                            <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--fw-text)' }}>
                                {dayData.brooder_density} birds/m²
                            </div>
                        </div>
                        
                        {/* Notes */}
                        {dayData.notes && (
                            <div style={{
                                background: 'var(--fw-card)',
                                border: '1px solid var(--fw-border)',
                                borderRadius: '10px',
                                padding: '0.875rem 1rem',
                                fontSize: '13px',
                                color: 'var(--fw-sub)',
                                lineHeight: '1.5'
                            }}>
                                💡 {t('farmguide.' + dayData.notes) || dayData.notes}
                            </div>
                        )}
                    </div>
                );
            } else {
                // WEEKLY MODE (W2-W64)
                const weekData = BROILER_PS_GUIDE.find(w => w.week === selectedWeek);
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
                                    {t('farmguide.tempTarget') || 'Temperature'}
                                </div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--fw-text)' }}>
                                    {typeof env.temperature === 'object' ? (env.temperature[language] || env.temperature.en) : env.temperature}
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
                                    {t('farmguide.humidity') || 'Humidity'}
                                </div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--fw-text)' }}>
                                    {typeof env.humidity === 'object' ? (env.humidity[language] || env.humidity.en) : env.humidity}
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
                                    {t('farmguide.lighting') || 'Lighting'}
                                </div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--fw-text)' }}>
                                    {typeof env.lighting === 'object' ? (env.lighting[language] || env.lighting.en) : env.lighting}
                                </div>
                                {env.lightIntensity && (
                                    <div style={{ fontSize: '0.75rem', color: 'var(--fw-sub)', marginTop: '0.25rem' }}>
                                        {typeof env.lightIntensity === 'object' ? (env.lightIntensity[language] || env.lightIntensity.en) : env.lightIntensity}
                                    </div>
                                )}
                            </div>
                            
                            <div style={{
                                padding: '1.5rem',
                                background: 'var(--fw-card)',
                                border: '2px solid var(--fw-border)',
                                borderRadius: '12px'
                            }}>
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌬️</div>
                                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)', marginBottom: '0.5rem' }}>
                                    {t('farmguide.ventilation') || 'Ventilation'}
                                </div>
                                <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--fw-text)' }}>
                                    {typeof env.ventilation === 'object' ? (env.ventilation[language] || env.ventilation.en) : env.ventilation}
                                </div>
                            </div>
                        </div>
                        
                        {/* Note */}
                        <div style={{
                            background: 'var(--fw-card)',
                            border: '1px solid var(--fw-border)',
                            borderRadius: '10px',
                            padding: '0.875rem 1rem',
                            fontSize: '13px',
                            color: 'var(--fw-sub)',
                            lineHeight: '1.5'
                        }}>
                            💡 {t('farmguide.envSameForAll') || 'Environment parameters are the same for all variants.'}
                        </div>
                    </div>
                );
            }
        }
        
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
        
        if (module === 'color_ps') {
            const guideWeek = Math.min(selectedWeek, 18);
            const weekData = COLOR_CHICKEN_GUIDE[guideWeek - 1];
            if (!weekData) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--fw-sub)' }}>No data available</div>;
            const env = weekData.environment;
            return (
                <div>
                    {selectedWeek > 18 && (
                        <div style={{ padding: '8px 14px', marginBottom: '16px', background: 'rgba(46,170,94,0.08)', borderLeft: '3px solid #2EAA5E', borderRadius: '0 8px 8px 0', fontSize: '13px', color: '#4A6B4A' }}>
                            Showing W18 environment reference for weeks W19–24.
                        </div>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ padding: '1.5rem', background: 'var(--fw-card)', border: '2px solid var(--fw-border)', borderRadius: '12px' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌡️</div>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)', marginBottom: '0.5rem' }}>Temperature</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--fw-text)' }}>{env.temp}</div>
                        </div>
                        <div style={{ padding: '1.5rem', background: 'var(--fw-card)', border: '2px solid var(--fw-border)', borderRadius: '12px' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💧</div>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)', marginBottom: '0.5rem' }}>Humidity</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--fw-text)' }}>{env.rh}</div>
                        </div>
                        <div style={{ padding: '1.5rem', background: 'var(--fw-card)', border: '2px solid var(--fw-border)', borderRadius: '12px' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💡</div>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)', marginBottom: '0.5rem' }}>Lighting</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--fw-text)' }}>{env.light?.[lang] || env.light?.en || env.light}</div>
                            {env.light_lux && <div style={{ fontSize: '0.875rem', color: 'var(--fw-sub)', marginTop: '0.25rem' }}>{env.light_lux}</div>}
                        </div>
                        <div style={{ padding: '1.5rem', background: 'var(--fw-card)', border: '2px solid var(--fw-border)', borderRadius: '12px' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌬️</div>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)', marginBottom: '0.5rem' }}>Ventilation</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--fw-text)' }}>{env.ventilation}</div>
                        </div>
                    </div>
                    {(env.nh3 || env.co2) && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            {env.nh3 && <div style={{ padding: '1rem', background: 'var(--fw-card)', border: '1px solid var(--fw-border)', borderRadius: '10px' }}><div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--fw-sub)', marginBottom: '4px' }}>NH₃</div><div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--fw-text)' }}>{env.nh3}</div></div>}
                            {env.co2 && <div style={{ padding: '1rem', background: 'var(--fw-card)', border: '1px solid var(--fw-border)', borderRadius: '10px' }}><div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--fw-sub)', marginBottom: '4px' }}>CO₂</div><div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--fw-text)' }}>{env.co2}</div></div>}
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
                    
                    {/* Variant/Sex Note for Color Chicken */}
                    <div style={{
                        marginTop: '1rem',
                        padding: '0.75rem 1rem',
                        background: '#F0F9FF',
                        border: '1px solid #0C3830',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        color: 'var(--fw-text)'
                    }}>
                        ℹ️ {t('farmguide.envSameForAll') || 'Environment parameters are the same for all variants.'}
                    </div>
                </div>
            );
        }
        
        // Layer module
        if (module === 'layer') {
            const weekData = LAYER_GUIDE[selectedWeek - 1];
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
                                {t('farmguide.tempTarget') || 'Temperature'}
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--fw-text)' }}>
                                {typeof env.temp === 'object' ? (env.temp[language] || env.temp.en) : env.temp}
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
                                {t('farmguide.humidity') || 'Humidity'}
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
                                {t('farmguide.lighting') || 'Lighting'}
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--fw-text)' }}>
                                {typeof env.light === 'object' ? (env.light[language] || env.light.en) : env.light}
                            </div>
                            {env.light_lux && (
                                <div style={{ fontSize: '0.75rem', color: 'var(--fw-sub)', marginTop: '0.25rem' }}>
                                    {env.light_lux}
                                </div>
                            )}
                        </div>
                        
                        <div style={{
                            padding: '1.5rem',
                            background: 'var(--fw-card)',
                            border: '2px solid var(--fw-border)',
                            borderRadius: '12px'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌬️</div>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)', marginBottom: '0.5rem' }}>
                                {t('farmguide.ventilation') || 'Ventilation'}
                            </div>
                            <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--fw-text)' }}>
                                {env.ventKey ? (tSafe('farmguide.' + env.ventKey) || env.ventilation) : env.ventilation}
                            </div>
                        </div>
                    </div>
                    
                    {/* Gas Limits */}
                    {(env.nh3 || env.co2) && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            {env.nh3 && (
                                <div style={{
                                    padding: '1rem',
                                    background: 'var(--fw-card)',
                                    border: '1px solid var(--fw-border)',
                                    borderRadius: '8px'
                                }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--fw-sub)', marginBottom: '0.25rem' }}>NH₃</div>
                                    <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--fw-text)' }}>{env.nh3}</div>
                                </div>
                            )}
                            {env.co2 && (
                                <div style={{
                                    padding: '1rem',
                                    background: 'var(--fw-card)',
                                    border: '1px solid var(--fw-border)',
                                    borderRadius: '8px'
                                }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--fw-sub)', marginBottom: '0.25rem' }}>CO₂</div>
                                    <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--fw-text)' }}>{env.co2}</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            );
        }
        
        if (module === 'layer_ps') {
            if (!layerPSGuideEntry) return (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--fw-sub)' }}>
                    No data available
                </div>
            );
            const env = layerPSGuideEntry.environment;
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{
                        display: 'inline-block', padding: '4px 14px', borderRadius: '20px',
                        background: psPhase === 'production' ? 'var(--fw-orange)' : 'var(--fw-teal)',
                        color: 'white', fontSize: '13px', fontWeight: '700', marginBottom: '4px'
                    }}>
                        {psPhase === 'production' ? '🥚 Production' : '🐣 Rearing'} · Week {selectedWeek}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--fw-sub)', marginBottom: '8px' }}>
                        {layerPSGuideEntry.phaseRange?.[lang] || layerPSGuideEntry.phaseRange?.en}
                    </div>
                    {[
                        { icon: '🌡️', label: 'Temperature', value: env.temperature },
                        { icon: '💧', label: t('farmguide.humidity') || 'Humidity', value: env.humidity },
                        { icon: '💡', label: t('farmguide.lighting') || 'Lighting', value: env.lighting },
                        { icon: '🔆', label: 'Light Intensity', value: env.lightIntensity },
                        { icon: '🌬️', label: t('farmguide.ventilation') || 'Ventilation', value: env.ventilation },
                    ].map((item, i) => (
                        <div key={i} style={{
                            background: 'white', borderRadius: '10px', padding: '14px 16px',
                            border: '1px solid var(--fw-border)',
                            display: 'flex', alignItems: 'flex-start', gap: '12px'
                        }}>
                            <span style={{ fontSize: '1.3rem' }}>{item.icon}</span>
                            <div>
                                <div style={{ fontWeight: '700', fontSize: '13px', marginBottom: '4px' }}>{item.label}</div>
                                <div style={{ fontSize: '14px', color: 'var(--fw-text)' }}>
                                    {item.value?.[lang] || item.value?.en || '—'}
                                </div>
                            </div>
                        </div>
                    ))}
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
        if (module === 'parent_stock') {
            // Select data based on sex
            let rawData;
            if (bwData && bwData.weeklyStandard) {
                rawData = bwData.weeklyStandard
                    .filter(r => r.feed_g_bird_day !== null && r.feed_g_bird_day !== undefined)
                    .map(r => ({
                        week: r.week,
                        phase: r.week <= 24 ? 'rearing' : 'production',
                        feed_g_day: r.feed_g_bird_day,
                    }));
            } else {
                rawData = psSex === 'female' ? PS_FEMALE_FEED : PS_MALE_FEED;
            }
            
            // Filter by phase
            const filteredData = rawData.filter(entry => {
                if (psPhase === 'rearing') {
                    return entry.week <= 24;
                } else {
                    return entry.week >= 25;
                }
            });
            
            // Calculate cumulative feed from first week of current phase
            let cumulative = 0;
            const tableData = filteredData.map(entry => {
                cumulative += entry.feed_g_day * 7; // Weekly cumulative
                return {
                    week: entry.week,
                    phase: entry.phase,
                    feed_g_day: entry.feed_g_day,
                    cumulative: cumulative
                };
            });
            
            // Chart data
            const maxFeed = Math.max(...filteredData.map(d => d.feed_g_day));
            const chartHeight = 300;
            const chartWidth = 800;
            const marginLeft = 65;
            const marginBottom = 40;
            const marginTop = 20;
            const marginRight = 20;
            const plotWidth = chartWidth - marginLeft - marginRight;
            const plotHeight = chartHeight - marginTop - marginBottom;
            
            const minWeek = psPhase === 'rearing' ? 1 : 25;
            const maxWeek = psPhase === 'rearing' ? 24 : 64;
            const xScale = (week) => marginLeft + ((week - minWeek) / (maxWeek - minWeek)) * plotWidth;
            const yMax = Math.ceil((maxFeed * 1.1) / 20) * 20;
            const yScale = (feed) => chartHeight - marginBottom - (feed / yMax) * plotHeight;
            
            // X-axis ticks
            const xTicks = psPhase === 'rearing' 
                ? [1, 4, 8, 12, 16, 20, 24]
                : [25, 30, 35, 40, 45, 50, 55, 60, 64];
            
            // Y-axis ticks (every 20g)
            const yTicks = [];
            for (let i = 0; i <= yMax; i += 20) {
                yTicks.push(i);
            }
            
            return (
                <div>
                    {/* Section header */}
                    <div style={{ 
                        fontSize: '1rem', 
                        fontWeight: '600', 
                        color: 'var(--fw-text)', 
                        marginBottom: '0.75rem' 
                    }}>
                        Week {selectedWeek} — Feed Program ({psSex === 'female' ? 'Female' : 'Male'})
                    </div>
                    
                    {/* Feed Table */}
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
                                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)' }}>
                                        Week
                                    </th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)' }}>
                                        Phase
                                    </th>
                                    <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)' }}>
                                        Feed/Day (g)
                                    </th>
                                    <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)' }}>
                                        Cumulative (g)
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map(entry => {
                                    const isActive = entry.week === selectedWeek;
                                    return (
                                        <tr
                                            key={entry.week}
                                            id={`ps-feed-row-${entry.week}`}
                                            style={{ 
                                                borderTop: '1px solid var(--fw-border)',
                                                background: isActive ? '#E1F5EE' : 'transparent'
                                            }}
                                        >
                                            <td style={{ 
                                                padding: '0.75rem', 
                                                fontSize: isActive ? 'calc(0.875rem * 1.1)' : '0.875rem',
                                                fontWeight: isActive ? '700' : '400',
                                                color: 'var(--fw-text)'
                                            }}>
                                                {entry.week}
                                            </td>
                                            <td style={{ 
                                                padding: '0.75rem', 
                                                fontSize: isActive ? 'calc(0.875rem * 1.1)' : '0.875rem',
                                                fontWeight: isActive ? '700' : '400',
                                                color: 'var(--fw-text)'
                                            }}>
                                                {entry.phase}
                                            </td>
                                            <td style={{ 
                                                padding: '0.75rem', 
                                                textAlign: 'right',
                                                fontSize: isActive ? 'calc(0.875rem * 1.1)' : '0.875rem',
                                                fontWeight: isActive ? '700' : '400',
                                                color: 'var(--fw-text)'
                                            }}>
                                                {entry.feed_g_day}
                                            </td>
                                            <td style={{ 
                                                padding: '0.75rem', 
                                                textAlign: 'right',
                                                fontSize: isActive ? 'calc(0.875rem * 1.1)' : '0.875rem',
                                                fontWeight: isActive ? '700' : '400',
                                                color: 'var(--fw-text)'
                                            }}>
                                                {entry.cumulative.toLocaleString()}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Feed Chart */}
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
                                {/* Y-axis gridlines */}
                                {yTicks.map(tick => (
                                    <line
                                        key={`y-grid-${tick}`}
                                        x1={marginLeft}
                                        y1={yScale(tick)}
                                        x2={chartWidth - marginRight}
                                        y2={yScale(tick)}
                                        stroke="var(--fw-border)"
                                        strokeWidth="1"
                                        strokeDasharray="4,4"
                                    />
                                ))}
                                
                                {/* X-axis ticks */}
                                {xTicks.map(week => (
                                    <text
                                        key={week}
                                        x={xScale(week)}
                                        y={chartHeight - marginBottom + 20}
                                        textAnchor="middle"
                                        fontSize="11"
                                        fill="var(--fw-text)"
                                        fontWeight={week === selectedWeek ? '700' : '400'}
                                    >
                                        W{week}
                                    </text>
                                ))}
                                
                                {/* Y-axis labels */}
                                {yTicks.map(tick => (
                                    <text
                                        key={tick}
                                        x={marginLeft - 10}
                                        y={yScale(tick) + 4}
                                        textAnchor="end"
                                        fontSize="11"
                                        fill="var(--fw-sub)"
                                    >
                                        {tick}g
                                    </text>
                                ))}
                                
                                {/* Axis labels */}
                                <text
                                    x={chartWidth / 2}
                                    y={chartHeight - 5}
                                    textAnchor="middle"
                                    fontSize="12"
                                    fill="var(--fw-sub)"
                                    fontWeight="600"
                                >
                                    {t('farmguide.week') || 'Week'}
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
                                    Feed/Day (g)
                                </text>
                                
                                {/* Line path */}
                                <polyline
                                    points={filteredData.map(d => `${xScale(d.week)},${yScale(d.feed_g_day)}`).join(' ')}
                                    fill="none"
                                    stroke="var(--fw-teal)"
                                    strokeWidth="3"
                                />
                                
                                {/* Single highlight circle at selected week */}
                                {(() => {
                                    const selectedData = filteredData.find(d => d.week === selectedWeek);
                                    if (selectedData) {
                                        return (
                                            <circle
                                                cx={xScale(selectedData.week)}
                                                cy={yScale(selectedData.feed_g_day)}
                                                r="6"
                                                fill="#0C3830"
                                            />
                                        );
                                    }
                                    return null;
                                })()}
                            </svg>
                        </div>
                    </div>
                </div>
            );
        }
        
        if (module === 'broiler' || module === 'color_chicken') {
            const weekData = module === 'broiler' ? BROILER_GUIDE[selectedWeek - 1] : COLOR_CHICKEN_GUIDE[selectedWeek - 1];
            if (!weekData) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--fw-sub)' }}>No data available</div>;
            
            const feedInfo = weekData.feed;
            
            return (
                <div>
                    {/* Active Phase Card - Only show in Weekly mode */}
                    {viewMode === 'weekly' && (
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
                    )}
                    
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
                                        const dailyData = module === 'color_chicken' ? getColorRange(colorVariant, colorSex) : BROILER_DAILY_BW;
                                        return dailyData.map(row => {
                                            const day = row.day;
                                            const isActive = day === selectedDay;
                                            const feedValue = module === 'color_chicken' ? row.feed_avg : row.feed_g_day;
                                            cumulative += feedValue;
                                            const rowId = module === 'color_chicken' ? `color-feed-row-day-${day}` : undefined;
                                            return (
                                                <tr key={day} id={rowId} style={{
                                                    background: isActive ? 'var(--fw-teal-lt)' : 'transparent',
                                                    borderTop: '1px solid var(--fw-border)'
                                                }}>
                                                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', fontWeight: isActive ? '700' : '400', color: 'var(--fw-text)' }}>
                                                        D{day}
                                                    </td>
                                                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: 'var(--fw-text)' }}>
                                                        {getPhase(row.week)}
                                                    </td>
                                                    <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-text)' }}>
                                                        {Math.round(feedValue)}
                                                    </td>
                                                    <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', color: 'var(--fw-sub)' }}>
                                                        {Math.round(cumulative)}
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

                    {/* Feed Chart for Color Chicken */}
                    {module === 'color_chicken' && (() => {
                        const chartData = getColorRange(colorVariant, colorSex);
                        const maxFeed = Math.max(...chartData.map(d => d.feed_avg));
                        const yMax = Math.ceil((maxFeed + maxFeed * 0.1) / 20) * 20;
                        const chartHeight = 300;
                        const chartWidth = 800;
                        const padding = { top: 20, right: 40, bottom: 40, left: 50 };
                        const plotWidth = chartWidth - padding.left - padding.right;
                        const plotHeight = chartHeight - padding.top - padding.bottom;
                        
                        const xScale = (day) => padding.left + ((day - 1) / 125) * plotWidth;
                        const yScale = (feed) => padding.top + plotHeight - (feed / yMax) * plotHeight;
                        
                        const points = chartData.map(d => {
                            const x = xScale(d.day);
                            const y = yScale(d.feed_avg);
                            return `${x},${y}`;
                        }).join(' ');
                        
                        const xTicks = [1, 14, 28, 42, 56, 70, 84, 98, 112, 126];
                        const yTicks = [];
                        for (let i = 0; i <= yMax; i += 20) {
                            yTicks.push(i);
                        }
                        
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
                                        {/* Y-axis gridlines and labels */}
                                        {yTicks.map(feed => (
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
                                            stroke="var(--fw-teal)"
                                            strokeWidth="2"
                                        />
                                        
                                        {/* Selected day highlight circle */}
                                        {(() => {
                                            const selectedData = chartData.find(d => d.day === selectedDay);
                                            if (selectedData) {
                                                const x = xScale(selectedData.day);
                                                const y = yScale(selectedData.feed_avg);
                                                return (
                                                    <circle
                                                        cx={x}
                                                        cy={y}
                                                        r={6}
                                                        fill="#0C3830"
                                                        stroke="#0C3830"
                                                        strokeWidth="2"
                                                    />
                                                );
                                            }
                                            return null;
                                        })()}
                                        
                                        {/* X-axis ticks */}
                                        {xTicks.map(day => (
                                            <text
                                                key={day}
                                                x={xScale(day)}
                                                y={chartHeight - padding.bottom + 20}
                                                textAnchor="middle"
                                                fontSize="11"
                                                fill="var(--fw-text)"
                                                fontWeight={day === selectedDay ? '700' : '400'}
                                            >
                                                D{day}
                                            </text>
                                        ))}
                                        
                                        {/* Axis labels */}
                                        <text
                                            x={chartWidth / 2}
                                            y={chartHeight - 5}
                                            textAnchor="middle"
                                            fontSize="12"
                                            fill="var(--fw-sub)"
                                            fontWeight="600"
                                        >
                                            {t('farmguide.day') || 'Day'}
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
                                            Feed/Day (g)
                                        </text>
                                    </svg>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            );
        }
        
        // Layer module
        if (module === 'layer') {
            const layerPhase = selectedWeek <= 18 ? 'rearing' : 'production';
            const phaseData = layerPhase === 'rearing' ? LAYER_REARING : LAYER_PRODUCTION;
            const filteredData = phaseData.filter(row => row.week === selectedWeek || (layerPhase === 'rearing' ? row.week <= 18 : row.week >= 19));
            
            return (
                <div>
                    {/* Feed Consumption Table */}
                    <div style={{
                        maxHeight: '400px',
                        overflowY: 'auto',
                        border: '1px solid var(--fw-border)',
                        borderRadius: '8px',
                        marginBottom: '1.5rem'
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ position: 'sticky', top: 0, background: 'var(--fw-bg)', zIndex: 1 }}>
                                <tr>
                                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)', borderBottom: '2px solid var(--fw-border)' }}>
                                        {t('farmguide.week') || 'Week'}
                                    </th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)', borderBottom: '2px solid var(--fw-border)' }}>
                                        {t('farmguide.feedType') || 'Feed Type'}
                                    </th>
                                    <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)', borderBottom: '2px solid var(--fw-border)' }}>
                                        {t('farmguide.feedPerDay') || 'Feed/Day (g)'}
                                    </th>
                                    <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)', borderBottom: '2px solid var(--fw-border)' }}>
                                        {t('farmguide.cumIntake') || 'Cumulative (g)'}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {phaseData.map((row, idx) => {
                                    const isHighlighted = row.week === selectedWeek;
                                    return (
                                        <tr
                                            key={idx}
                                            ref={isHighlighted ? (el) => {
                                                if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
                                            } : null}
                                            style={{
                                                background: isHighlighted ? 'var(--fw-teal-lt)' : 'transparent',
                                                borderBottom: '1px solid var(--fw-border)'
                                            }}
                                        >
                                            <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: 'var(--fw-text)', fontWeight: isHighlighted ? '600' : '400' }}>
                                                W{row.week}
                                            </td>
                                            <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: 'var(--fw-text)', fontWeight: isHighlighted ? '600' : '400' }}>
                                                {row.phase}
                                            </td>
                                            <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', color: 'var(--fw-text)', fontWeight: isHighlighted ? '600' : '400' }}>
                                                {row.feed_g_day}
                                            </td>
                                            <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', color: 'var(--fw-text)', fontWeight: isHighlighted ? '600' : '400' }}>
                                                {row.cumulative_feed_g}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Feed Chart */}
                    <div style={{
                        padding: '1.5rem',
                        background: 'var(--fw-card)',
                        border: '1px solid var(--fw-border)',
                        borderRadius: '12px'
                    }}>
                        <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: '600', color: 'var(--fw-text)' }}>
                            {t('farmguide.feedChart') || 'Feed Consumption Chart'} ({layerPhase === 'rearing' ? (t('farmguide.rearing') || 'Rearing') : (t('farmguide.production') || 'Production')})
                        </h3>
                        <svg width="100%" height="300" viewBox="0 0 800 300" style={{ overflow: 'visible' }}>
                            {(() => {
                                const maxFeed = Math.max(...phaseData.map(r => r.feed_g_day));
                                const yMax = layerPhase === 'rearing' ? 100 : 120;
                                const yTicks = layerPhase === 'rearing' ? [0, 20, 40, 60, 80, 100] : [0, 20, 40, 60, 80, 100, 120];
                                const xTicks = layerPhase === 'rearing' 
                                    ? [1, 3, 6, 9, 12, 15, 18]
                                    : [19, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80];
                                
                                const xScale = (week) => {
                                    if (layerPhase === 'rearing') {
                                        return 50 + ((week - 1) / 17) * 700;
                                    } else {
                                        return 50 + ((week - 19) / 61) * 700;
                                    }
                                };
                                const yScale = (feed) => 260 - (feed / yMax) * 240;
                                
                                const points = phaseData.map((row) => {
                                    const x = xScale(row.week);
                                    const y = yScale(row.feed_g_day);
                                    return `${x},${y}`;
                                }).join(' ');
                                
                                return (
                                    <>
                                        {/* Y-axis gridlines and labels */}
                                        {yTicks.map(feed => {
                                            const y = yScale(feed);
                                            return (
                                                <g key={feed}>
                                                    <line
                                                        x1="50"
                                                        y1={y}
                                                        x2="750"
                                                        y2={y}
                                                        stroke="var(--fw-border)"
                                                        strokeWidth="1"
                                                        strokeDasharray="4,4"
                                                    />
                                                    <text
                                                        x="40"
                                                        y={y + 4}
                                                        textAnchor="end"
                                                        fontSize="11"
                                                        fill="var(--fw-sub)"
                                                    >
                                                        {feed}g
                                                    </text>
                                                </g>
                                            );
                                        })}
                                        
                                        {/* Y-axis */}
                                        <line x1="50" y1="20" x2="50" y2="260" stroke="var(--fw-border)" strokeWidth="2" />
                                        {/* X-axis */}
                                        <line x1="50" y1="260" x2="750" y2="260" stroke="var(--fw-border)" strokeWidth="2" />
                                        
                                        {/* X-axis ticks */}
                                        {xTicks.map(week => {
                                            const x = xScale(week);
                                            return (
                                                <text
                                                    key={week}
                                                    x={x}
                                                    y="275"
                                                    textAnchor="middle"
                                                    fontSize="11"
                                                    fill="var(--fw-text)"
                                                    fontWeight={week === selectedWeek ? '700' : '400'}
                                                >
                                                    W{week}
                                                </text>
                                            );
                                        })}
                                        
                                        {/* Y-axis label */}
                                        <text x="15" y="140" fill="var(--fw-sub)" fontSize="12" fontWeight="600" textAnchor="middle" transform="rotate(-90 15 140)">
                                            {t('farmguide.feedPerDay') || 'Feed/Day (g)'}
                                        </text>
                                        
                                        {/* X-axis label */}
                                        <text x="400" y="295" fill="var(--fw-sub)" fontSize="12" fontWeight="600" textAnchor="middle">
                                            {t('farmguide.week') || 'Week'}
                                        </text>
                                        
                                        {/* Plot line */}
                                        <polyline
                                            points={points}
                                            fill="none"
                                            stroke="var(--fw-teal)"
                                            strokeWidth="2"
                                        />
                                        
                                        {/* Data points */}
                                        {phaseData.map((row) => {
                                            const x = xScale(row.week);
                                            const y = yScale(row.feed_g_day);
                                            const isHighlighted = row.week === selectedWeek;
                                            return (
                                                <circle
                                                    key={row.week}
                                                    cx={x}
                                                    cy={y}
                                                    r={isHighlighted ? 6 : 4}
                                                    fill={isHighlighted ? 'var(--fw-teal)' : 'white'}
                                                    stroke="var(--fw-teal)"
                                                    strokeWidth="2"
                                                />
                                            );
                                        })}
                                    </>
                                );
                            })()}
                        </svg>
                    </div>
                </div>
            );
        }
        
        if (module === 'layer_ps') {
            // ── REARING: numeric feed table ─────────────────────────────────────────────────
            if (psPhase === 'rearing') {
                if (psSex === 'male') {
                    return (
                        <div style={{
                            background: '#F0FAF4',
                            border: '1.5px solid #2EAA5E',
                            borderRadius: '10px',
                            padding: '16px 20px',
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px'
                        }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                stroke="#2EAA5E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="12" y1="8" x2="12" y2="12"/>
                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            <div>
                                <p style={{ margin: 0, fontWeight: 600, color: '#1E7A42', fontSize: '14px' }}>
                                    Male Feed Program
                                </p>
                                <p style={{ margin: '4px 0 0', color: '#444', fontSize: '13px', lineHeight: '1.5' }}>
                                    Male feed program follows the flock schedule. Refer to female feed data for daily intake targets.
                                </p>
                            </div>
                        </div>
                    );
                }

                const rearingRows = (bwData?.weeklyStandard || []).filter(r => r.phase === 'rearing' && r.feed_g_bird_day != null);
                if (rearingRows.length === 0) return (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#4A6B4A' }}>
                        No feed data available for this breed.
                    </div>
                );
                let cumulative = 0;
                const tableRows = rearingRows.map(r => {
                    const weekTotal = Math.round((r.feed_g_bird_day || 0) * 7);
                    cumulative += weekTotal;
                    return { week: Number(r.week), daily: r.feed_g_bird_day, cumulative };
                });
                const activeWeek = Number(selectedWeek);
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                        {/* Section header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '8px',
                                background: '#2EAA5E', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', flexShrink: 0
                            }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="3" y1="6" x2="21" y2="6"/>
                                    <line x1="3" y1="12" x2="21" y2="12"/>
                                    <line x1="3" y1="18" x2="21" y2="18"/>
                                </svg>
                            </div>
                            <div>
                                <div style={{ fontWeight: '700', fontSize: '14px', color: '#1A2E1A' }}>
                      Rearing Feed Program
                                </div>
                                <div style={{ fontSize: '12px', color: '#4A6B4A' }}>
                                    {bwData?.breedLabel || ''} · W1–W{rearingRows[rearingRows.length - 1]?.week}
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #DFF0E6', background: 'white' }}>
                            {/* Header */}
                            <div style={{
                                display: 'grid', gridTemplateColumns: '56px 1fr 1fr',
                                background: '#2EAA5E', padding: '10px 14px', gap: '8px'
                            }}>
                                {[
                      'Week',
                      'Feed/Day (g)',
                      'Cumulative (g)'
                                ].map((h, i) => (
                                    <div key={i} style={{
                                        fontSize: '11px', fontWeight: '700', color: 'white',
                                        textAlign: i === 0 ? 'center' : 'right',
                                        textTransform: 'uppercase', letterSpacing: '0.04em'
                                    }}>{h}</div>
                                ))}
                            </div>

                            {/* Rows */}
                            {tableRows.map((row, idx) => {
                                const isActive = row.week === activeWeek;
                                return (
                                    <div key={idx} style={{
                                        display: 'grid', gridTemplateColumns: '56px 1fr 1fr',
                                        padding: '9px 14px', gap: '8px',
                                        background: isActive ? 'rgba(46,170,94,0.10)' : idx % 2 === 0 ? 'white' : '#F2F4F2',
                                        borderBottom: idx < tableRows.length - 1 ? '1px solid #DFF0E6' : 'none'
                                    }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <span style={{
                                                display: 'inline-block', minWidth: '28px', padding: '2px 6px',
                                                borderRadius: '6px',
                                                background: isActive ? '#2EAA5E' : 'transparent',
                                                color: isActive ? 'white' : '#4A6B4A',
                                                fontSize: '12px', fontWeight: isActive ? '700' : '500'
                                            }}>
                                                {row.week}
                                            </span>
                                        </div>
                                        <div style={{
                                            textAlign: 'right', fontSize: '13px',
                                            fontWeight: isActive ? '700' : '500',
                                            color: isActive ? '#2EAA5E' : '#1A2E1A'
                                        }}>
                                            {row.daily}
                                        </div>
                                        <div style={{
                                            textAlign: 'right', fontSize: '13px',
                                            fontWeight: isActive ? '700' : '400',
                                            color: isActive ? '#2EAA5E' : '#4A6B4A'
                                        }}>
                                            {row.cumulative.toLocaleString()}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            }

            // ── PRODUCTION: qualitative text cards (unchanged) ───────────────────────────────────
            if (!layerPSGuideEntry) return (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#4A6B4A' }}>
                    No data available
                </div>
            );
            const feed = layerPSGuideEntry.feedProgram;
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{
                        display: 'inline-block', padding: '4px 14px', borderRadius: '20px',
                        background: 'var(--fw-orange)',
                        color: 'white', fontSize: '13px', fontWeight: '700', marginBottom: '4px'
                    }}>
                        🥚 Production · Week {selectedWeek}
                    </div>
                    <div style={{ fontSize: '13px', color: '#4A6B4A', marginBottom: '8px' }}>
                        {layerPSGuideEntry.phaseRange?.[lang] || layerPSGuideEntry.phaseRange?.en}
                    </div>
                    {[
                        { icon: '🌾', label: t('farmguide.feedType') || 'Feed Type', value: feed.feedType },
                        { icon: '⚖️', label: t('farmguide.feedIntake') || 'Feed Intake', value: feed.feedIntake },
                        { icon: '📝', label: t('farmguide.notes') || 'Notes', value: feed.notes },
                    ].map((item, i) => (
                        <div key={i} style={{
                            background: 'white', borderRadius: '10px', padding: '14px 16px',
                            border: '1px solid #DFF0E6',
                            display: 'flex', alignItems: 'flex-start', gap: '12px'
                        }}>
                            <span style={{ fontSize: '1.3rem' }}>{item.icon}</span>
                            <div>
                                <div style={{ fontWeight: '700', fontSize: '13px', marginBottom: '4px' }}>{item.label}</div>
                                <div style={{ fontSize: '14px', color: '#1A2E1A' }}>
                                    {item.value?.[lang] || item.value?.en || '—'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }
        if (module === 'color_ps') {
            if (psPhase === 'rearing') {
                const rearingRows = (bwData?.weeklyStandard || []).filter(r => r.phase === 'rearing' && r.feed_g_bird_day != null);
                if (rearingRows.length === 0) return (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#4A6B4A' }}>
                        No feed data available for this breed.
                    </div>
                );
                let cumulative = 0;
                const tableRows = rearingRows.map(r => {
                    const weekTotal = Math.round((r.feed_g_bird_day || 0) * 7);
                    cumulative += weekTotal;
                    return { week: Number(r.week), daily: r.feed_g_bird_day, cumulative };
                });
                const activeWeek = Number(selectedWeek);
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#2EAA5E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="3" y1="6" x2="21" y2="6"/>
                                    <line x1="3" y1="12" x2="21" y2="12"/>
                                    <line x1="3" y1="18" x2="21" y2="18"/>
                                </svg>
                            </div>
                            <div>
                                <div style={{ fontWeight: '700', fontSize: '14px', color: '#1A2E1A' }}>Rearing Feed Program</div>
                                <div style={{ fontSize: '12px', color: '#4A6B4A' }}>{bwData?.breedLabel || ''} · W1–W{rearingRows[rearingRows.length - 1]?.week}</div>
                            </div>
                        </div>
                        <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #DFF0E6', background: 'white' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '56px 1fr 1fr', background: '#2EAA5E', padding: '10px 14px', gap: '8px' }}>
                                {['Week', 'Feed/Day (g)', 'Cumulative (g)'].map((h, i) => (
                                    <div key={i} style={{ fontSize: '11px', fontWeight: '700', color: 'white', textAlign: i === 0 ? 'center' : 'right', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</div>
                                ))}
                            </div>
                            {tableRows.map((row, idx) => {
                                const isActive = row.week === activeWeek;
                                return (
                                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '56px 1fr 1fr', padding: '9px 14px', gap: '8px', background: isActive ? 'rgba(46,170,94,0.10)' : idx % 2 === 0 ? 'white' : '#F2F4F2', borderBottom: idx < tableRows.length - 1 ? '1px solid #DFF0E6' : 'none' }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <span style={{ display: 'inline-block', minWidth: '28px', padding: '2px 6px', borderRadius: '6px', background: isActive ? '#2EAA5E' : 'transparent', color: isActive ? 'white' : '#4A6B4A', fontSize: '12px', fontWeight: isActive ? '700' : '500' }}>{row.week}</span>
                                        </div>
                                        <div style={{ textAlign: 'right', fontSize: '13px', fontWeight: isActive ? '700' : '500', color: isActive ? '#2EAA5E' : '#1A2E1A' }}>{row.daily}</div>
                                        <div style={{ textAlign: 'right', fontSize: '13px', fontWeight: isActive ? '700' : '400', color: isActive ? '#2EAA5E' : '#4A6B4A' }}>{row.cumulative.toLocaleString()}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            }
            return (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--fw-sub)', background: 'var(--fw-card)', borderRadius: '12px', border: '1px solid var(--fw-border)' }}>
                    Coming soon — Production feed program
                </div>
            );
        }
        if (module === 'color_chicken') {
            const sex = colorSex || 'female';
            const variant = colorVariant || 'variant_a';
            const weeklyData = bwData?.[sex]?.[variant]?.weekly_summary || [];
            const guideEntry = COLOR_CHICKEN_GUIDE[selectedWeek - 1];
            const feedGuide = guideEntry?.feed;
            const keyPoint = guideEntry?.key_points?.[0];

            if (weeklyData.length === 0) return (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#4A6B4A' }}>
                    No feed data available.
                </div>
            );

            // Build cumulative
            let cumulative = 0;
            const tableRows = weeklyData.map(r => {
                const weekTotal = Math.round((r.fc_g_bird_day || 0) * 7);
                cumulative += weekTotal;
                return { week: Number(r.week), daily: r.fc_g_bird_day, cumulative };
            });
            const activeWeek = Number(selectedWeek);

            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                    {/* Numeric table header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <div style={{
                            width: '32px', height: '32px', borderRadius: '8px',
                            background: '#2EAA5E', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="6" x2="21" y2="6"/>
                                <line x1="3" y1="12" x2="21" y2="12"/>
                                <line x1="3" y1="18" x2="21" y2="18"/>
                            </svg>
                        </div>
                        <div>
                            <div style={{ fontWeight: '700', fontSize: '14px', color: '#1A2E1A' }}>
                                Weekly Feed Program
                            </div>
                            <div style={{ fontSize: '12px', color: '#4A6B4A' }}>
                                Color Chicken · {variant === 'variant_a' ? 'Tipe A' : 'Tipe B'} · W1–W{weeklyData[weeklyData.length - 1]?.week}
                            </div>
                        </div>
                    </div>

                    {/* Numeric table */}
                    <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #DFF0E6', background: 'white', marginBottom: '16px' }}>
                        {/* Header */}
                        <div style={{
                            display: 'grid', gridTemplateColumns: '56px 1fr 1fr',
                            background: '#2EAA5E', padding: '10px 14px', gap: '8px'
                        }}>
                            {['Week', 'Feed/Day (g)', 'Cumulative (g)'].map((h, i) => (
                                <div key={i} style={{
                                    fontSize: '11px', fontWeight: '700', color: 'white',
                                    textAlign: i === 0 ? 'center' : 'right',
                                    textTransform: 'uppercase', letterSpacing: '0.04em'
                                }}>{h}</div>
                            ))}
                        </div>
                        {/* Rows */}
                        {tableRows.map((row, idx) => {
                            const isActive = row.week === activeWeek;
                            return (
                                <div key={idx} style={{
                                    display: 'grid', gridTemplateColumns: '56px 1fr 1fr',
                                    padding: '9px 14px', gap: '8px',
                                    background: isActive ? 'rgba(46,170,94,0.10)' : idx % 2 === 0 ? 'white' : '#F2F4F2',
                                    borderBottom: idx < tableRows.length - 1 ? '1px solid #DFF0E6' : 'none'
                                }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <span style={{
                                            display: 'inline-block', minWidth: '28px', padding: '2px 6px',
                                            borderRadius: '6px',
                                            background: isActive ? '#2EAA5E' : 'transparent',
                                            color: isActive ? 'white' : '#4A6B4A',
                                            fontSize: '12px', fontWeight: isActive ? '700' : '500'
                                        }}>
                                            {row.week}
                                        </span>
                                    </div>
                                    <div style={{
                                        textAlign: 'right', fontSize: '13px',
                                        fontWeight: isActive ? '700' : '500',
                                        color: isActive ? '#2EAA5E' : '#1A2E1A'
                                    }}>
                                        {row.daily}
                                    </div>
                                    <div style={{
                                        textAlign: 'right', fontSize: '13px',
                                        fontWeight: isActive ? '700' : '400',
                                        color: isActive ? '#2EAA5E' : '#4A6B4A'
                                    }}>
                                        {row.cumulative.toLocaleString()}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Qualitative section */}
                    {feedGuide && (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                <div style={{
                                    width: '32px', height: '32px', borderRadius: '8px',
                                    background: '#E8F5EE', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2EAA5E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                                        <path d="M2 17l10 5 10-5"/>
                                        <path d="M2 12l10 5 10-5"/>
                                    </svg>
                                </div>
                                <div>
                                    <div style={{ fontWeight: '700', fontSize: '14px', color: '#1A2E1A' }}>
                                        Feed phase — Week {selectedWeek}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#4A6B4A' }}>
                                        {feedGuide.phase} · {feedGuide.duration}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                {[
                                    { label: 'Phase', value: feedGuide.phase },
                                    { label: 'Form', value: feedGuide.form },
                                    { label: 'Size', value: feedGuide.size },
                                    { label: 'Duration', value: feedGuide.duration },
                                ].map((item, i) => (
                                    <div key={i} style={{
                                        background: 'white', borderRadius: '10px',
                                        padding: '12px 14px', border: '1px solid #DFF0E6'
                                    }}>
                                        <div style={{ fontSize: '11px', fontWeight: '700', color: '#4A6B4A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
                                            {item.label}
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#1A2E1A' }}>
                                            {item.value || '—'}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Note bar from key_points[0] */}
                            {keyPoint && (
                                <div style={{
                                    background: 'rgba(46,170,94,0.07)',
                                    borderLeft: '3px solid #2EAA5E',
                                    borderRadius: '0 8px 8px 0',
                                    padding: '10px 14px',
                                    marginTop: '12px',
                                    fontSize: '13px',
                                    color: '#1A2E1A',
                                    lineHeight: '1.5'
                                }}>
                                    {keyPoint.text?.[lang] || keyPoint.text?.en}
                                </div>
                            )}
                        </>
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
        if (module === 'parent_stock') {
            // Select data based on sex
            let rawData;
            if (bwData && bwData.weeklyStandard) {
                rawData = bwData.weeklyStandard.map(r => ({
                    week: r.week,
                    bw: r.bw_g,
                }));
            } else {
                rawData = psSex === 'female' ? PS_FEMALE_BW : PS_MALE_BW;
            }
            
            // Filter by phase
            const filteredData = rawData.filter(entry => {
                if (psPhase === 'rearing') {
                    return entry.week >= 1 && entry.week <= 24;
                } else {
                    return entry.week >= 25 && entry.week <= 64;
                }
            });
            
            // Calculate weekly gain
            const tableData = filteredData.map((entry, idx) => ({
                week: entry.week,
                bw: entry.bw,
                gain: idx > 0 ? entry.bw - filteredData[idx - 1].bw : null
            }));
            
            // Chart data
            const maxBW = Math.max(...filteredData.map(d => d.bw));
            const chartHeight = 300;
            const chartWidth = 700;
            const marginLeft = 65;
            const marginBottom = 40;
            const marginTop = 20;
            const marginRight = 20;
            const plotWidth = chartWidth - marginLeft - marginRight;
            const plotHeight = chartHeight - marginTop - marginBottom;
            
            const minWeek = psPhase === 'rearing' ? 1 : 25;
            const maxWeek = psPhase === 'rearing' ? 24 : 64;
            const xScale = (week) => marginLeft + ((week - minWeek) / (maxWeek - minWeek)) * plotWidth;
            const yScale = (bw) => chartHeight - marginBottom - (bw / (maxBW * 1.1)) * plotHeight;
            
            // X-axis ticks
            const xTicks = psPhase === 'rearing' 
                ? [1, 4, 8, 12, 16, 20, 24]
                : [25, 30, 35, 40, 45, 50, 55, 60, 64];
            
            // Y-axis ticks (every 500g)
            const yTicks = [];
            for (let i = 0; i <= Math.ceil(maxBW * 1.1 / 500) * 500; i += 500) {
                yTicks.push(i);
            }
            
            // Line path
            const linePath = filteredData.map((d, i) => {
                const x = xScale(d.week);
                const y = yScale(d.bw);
                return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
            }).join(' ');
            
            return (
                <div>
                    {/* Section header */}
                    <div style={{ 
                        fontSize: '1rem', 
                        fontWeight: '600', 
                        color: 'var(--fw-text)', 
                        marginBottom: '0.75rem' 
                    }}>
                        Week {selectedWeek} — Standard BW ({psSex === 'female' ? 'Female' : 'Male'})
                    </div>
                    
                    {/* BW Table */}
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
                                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)' }}>
                                        Week
                                    </th>
                                    <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)' }}>
                                        Standard BW (g)
                                    </th>
                                    <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)' }}>
                                        Weekly Gain (g)
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map(entry => {
                                    const isActive = entry.week === selectedWeek;
                                    return (
                                        <tr
                                            key={entry.week}
                                            id={`ps-bw-row-${entry.week}`}
                                            style={{ 
                                                borderTop: '1px solid var(--fw-border)',
                                                background: isActive ? '#E1F5EE' : 'transparent'
                                            }}
                                        >
                                            <td style={{ 
                                                padding: '0.75rem', 
                                                fontSize: isActive ? 'calc(0.875rem * 1.1)' : '0.875rem',
                                                fontWeight: isActive ? '700' : '400',
                                                color: 'var(--fw-text)'
                                            }}>
                                                {entry.week}
                                            </td>
                                            <td style={{ 
                                                padding: '0.75rem', 
                                                textAlign: 'right',
                                                fontSize: isActive ? 'calc(0.875rem * 1.1)' : '0.875rem',
                                                fontWeight: isActive ? '700' : '400',
                                                color: 'var(--fw-text)'
                                            }}>
                                                {entry.bw}
                                            </td>
                                            <td style={{ 
                                                padding: '0.75rem', 
                                                textAlign: 'right',
                                                fontSize: isActive ? 'calc(0.875rem * 1.1)' : '0.875rem',
                                                fontWeight: isActive ? '700' : '400',
                                                color: 'var(--fw-text)'
                                            }}>
                                                {entry.gain !== null ? entry.gain : '—'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* BW Chart */}
                    <div style={{ marginTop: '1.5rem' }}>
                        <div style={{ 
                            fontSize: '0.875rem', 
                            fontWeight: '600', 
                            color: 'var(--fw-text)', 
                            marginBottom: '0.75rem' 
                        }}>
                            {t('farmguide.bwChart') || 'Body Weight Standard Curve'}
                        </div>
                        <div style={{ 
                            background: 'var(--fw-card)', 
                            border: '1px solid var(--fw-border)', 
                            borderRadius: '8px', 
                            padding: '1rem',
                            overflowX: 'auto'
                        }}>
                            <svg width={chartWidth} height={chartHeight} style={{ display: 'block' }}>
                                {/* Y-axis gridlines */}
                                {yTicks.map(tick => (
                                    <line
                                        key={`y-grid-${tick}`}
                                        x1={marginLeft}
                                        y1={yScale(tick)}
                                        x2={chartWidth - marginRight}
                                        y2={yScale(tick)}
                                        stroke="var(--fw-border)"
                                        strokeWidth="1"
                                        strokeDasharray="4,4"
                                    />
                                ))}
                                
                                {/* X-axis ticks */}
                                {xTicks.map(week => (
                                    <text
                                        key={week}
                                        x={xScale(week)}
                                        y={chartHeight - marginBottom + 20}
                                        textAnchor="middle"
                                        fontSize="11"
                                        fill="var(--fw-text)"
                                        fontWeight={week === selectedWeek ? '700' : '400'}
                                    >
                                        W{week}
                                    </text>
                                ))}
                                
                                {/* Y-axis labels */}
                                {yTicks.map(tick => (
                                    <text
                                        key={tick}
                                        x={marginLeft - 10}
                                        y={yScale(tick) + 4}
                                        textAnchor="end"
                                        fontSize="11"
                                        fill="var(--fw-sub)"
                                    >
                                        {tick}g
                                    </text>
                                ))}
                                
                                {/* Axis labels */}
                                <text
                                    x={chartWidth / 2}
                                    y={chartHeight - 5}
                                    textAnchor="middle"
                                    fontSize="12"
                                    fill="var(--fw-sub)"
                                    fontWeight="600"
                                >
                                    {t('farmguide.week') || 'Week'}
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
                                
                                {/* Line path */}
                                <polyline
                                    points={filteredData.map(d => `${xScale(d.week)},${yScale(d.bw)}`).join(' ')}
                                    fill="none"
                                    stroke="var(--fw-teal)"
                                    strokeWidth="3"
                                />
                                
                                {/* Single highlight circle at selected week */}
                                {(() => {
                                    const selectedData = filteredData.find(d => d.week === selectedWeek);
                                    if (selectedData) {
                                        return (
                                            <circle
                                                cx={xScale(selectedData.week)}
                                                cy={yScale(selectedData.bw)}
                                                r="6"
                                                fill="#0C3830"
                                            />
                                        );
                                    }
                                    return null;
                                })()}
                            </svg>
                        </div>
                    </div>
                </div>
            );
        }

        if (module === 'layer_ps') {
            const bwRows = (bwData && bwData.weeklyStandard)
                ? bwData.weeklyStandard
                : (psSex === 'male' ? LAYER_PS_MALE_BW : LAYER_PS_FEMALE_BW);
            const phaseData = psPhase === 'production'
                ? bwRows.filter(r => r.week >= 19)
                : bwRows.filter(r => r.week <= 18);
            const selectedRow = bwRows.find(r => r.week === selectedWeek);

            const minBW = Math.min(...phaseData.map(r => r.bw_g));
            const maxBW = Math.max(...phaseData.map(r => r.bw_g));
            const minW = Math.min(...phaseData.map(r => r.week));
            const maxW = Math.max(...phaseData.map(r => r.week));

            const toX = (w) => ((w - minW) / Math.max(maxW - minW, 1)) * 720 + 40;
            const toY = (bw) => 270 - ((bw - minBW) / Math.max(maxBW - minBW, 1)) * 230;

            const pathD = phaseData.map((r, i) =>
                `${i === 0 ? 'M' : 'L'} ${toX(r.week)} ${toY(r.bw_g)}`
            ).join(' ');

            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ fontWeight: '700', fontSize: '15px' }}>
                        {psSex === 'male' ? 'Male Body Weight — Rearing' : 'Female Body Weight'}
                    </div>
                    <div style={{ overflowY: 'auto', maxHeight: '420px', borderRadius: '10px', border: '1px solid var(--fw-border)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                            <thead>
                                <tr style={{ background: 'var(--fw-teal)', color: 'white', position: 'sticky', top: 0 }}>
                                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Week</th>
                                    <th style={{ padding: '10px 14px', textAlign: 'right' }}>Standard BW (g)</th>
                                    <th style={{ padding: '10px 14px', textAlign: 'right' }}>Weekly Gain (g)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {phaseData.map((row, i) => {
                                    const prev = phaseData[i - 1];
                                    const gain = prev ? row.bw_g - prev.bw_g : null;
                                    const isSelected = row.week === selectedWeek;
                                    return (
                                        <tr key={row.week}
                                            onClick={() => setSelectedWeek(row.week)}
                                            style={{
                                                background: isSelected ? '#E1F5EE' : i % 2 === 0 ? 'white' : '#F9FAFB',
                                                cursor: 'pointer',
                                                fontWeight: isSelected ? '700' : '400',
                                            }}>
                                            <td style={{ padding: '10px 14px' }}>{row.week}</td>
                                            <td style={{ padding: '10px 14px', textAlign: 'right' }}>{row.bw_g}</td>
                                            <td style={{ padding: '10px 14px', textAlign: 'right' }}>{gain !== null ? gain : '—'}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>Standard BW Curve</div>
                    <div style={{ background: 'white', borderRadius: '10px', border: '1px solid var(--fw-border)', padding: '16px', overflowX: 'auto' }}>
                        <svg viewBox="0 0 800 300" style={{ width: '100%', minWidth: '400px' }}>
                            {[0,1,2,3,4].map(i => (
                                <line key={i} x1="40" y1={40 + i*57} x2="760" y2={40 + i*57}
                                    stroke="#E5E7EB" strokeWidth="1" />
                            ))}
                            <path d={pathD} fill="none" stroke="var(--fw-teal)" strokeWidth="2.5" />
                            {selectedRow && (
                                <circle cx={toX(selectedRow.week)} cy={toY(selectedRow.bw_g)} r="5"
                                    fill="var(--fw-teal)" stroke="white" strokeWidth="2" />
                            )}
                            {phaseData.filter((_, i) => i % Math.ceil(phaseData.length / 8) === 0).map(r => (
                                <text key={r.week} x={toX(r.week)} y="290" textAnchor="middle"
                                    fontSize="10" fill="#6B7280">W{r.week}</text>
                            ))}
                            <text x="12" y="150" textAnchor="middle" fontSize="10" fill="#6B7280"
                                transform="rotate(-90, 12, 150)">Body Weight</text>
                        </svg>
                    </div>
                </div>
            );
        }

        if (module === 'color_ps') {
            if (!bwData?.weeklyStandard) return (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#4A6B4A' }}>
                    No data available for this breed.
                </div>
            );
            const isRearing = psPhase === 'rearing';
            const bwRows = bwData.weeklyStandard.filter(r =>
                isRearing ? r.phase === 'rearing' : r.phase === 'production'
            );
            const activeWeek = Number(selectedWeek);
            const minBW = Math.min(...bwRows.map(r => r.bw_g));
            const maxBW = Math.max(...bwRows.map(r => r.bw_g));
            const minW = Math.min(...bwRows.map(r => r.week));
            const maxW = Math.max(...bwRows.map(r => r.week));
            const toX = (w) => ((w - minW) / Math.max(maxW - minW, 1)) * 720 + 40;
            const toY = (bw) => 270 - ((bw - minBW) / Math.max(maxBW - minBW, 1)) * 230;
            const pathD = bwRows.map((r, i) => `${i === 0 ? 'M' : 'L'} ${toX(r.week)} ${toY(r.bw_g)}`).join(' ');
            const selectedBWRow = bwRows.find(r => Number(r.week) === activeWeek);
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                    {/* Section header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <div style={{
                            width: '32px', height: '32px', borderRadius: '8px',
                            background: '#2EAA5E', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                            </svg>
                        </div>
                        <div>
                            <div style={{ fontWeight: '700', fontSize: '14px', color: '#1A2E1A' }}>
                                {isRearing ? 'Rearing Body Weight' : 'Production Body Weight'}
                            </div>
                            <div style={{ fontSize: '12px', color: '#4A6B4A' }}>
                                {bwData?.breedLabel || ''} · {isRearing ? 'W1–W24' : 'W25–W70'}
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #DFF0E6', background: 'white', maxHeight: '420px', overflowY: 'auto' }}>
                        <div style={{
                            display: 'grid', gridTemplateColumns: '56px 1fr 1fr',
                            background: '#2EAA5E', padding: '10px 14px', gap: '8px'
                        }}>
                            {['Week', 'Body Weight (g)', 'Weekly Gain (g)'].map((h, i) => (
                                <div key={i} style={{
                                    fontSize: '11px', fontWeight: '700', color: 'white',
                                    textAlign: i === 0 ? 'center' : 'right',
                                    textTransform: 'uppercase', letterSpacing: '0.04em'
                                }}>{h}</div>
                            ))}
                        </div>
                        {bwRows.map((row, idx) => {
                            const isActive = Number(row.week) === activeWeek;
                            return (
                                <div key={idx} style={{
                                    display: 'grid', gridTemplateColumns: '56px 1fr 1fr',
                                    padding: '9px 14px', gap: '8px',
                                    background: isActive ? 'rgba(46,170,94,0.10)' : idx % 2 === 0 ? 'white' : '#F2F4F2',
                                    borderBottom: idx < bwRows.length - 1 ? '1px solid #DFF0E6' : 'none'
                                }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <span style={{
                                            display: 'inline-block', minWidth: '28px', padding: '2px 6px',
                                            borderRadius: '6px',
                                            background: isActive ? '#2EAA5E' : 'transparent',
                                            color: isActive ? 'white' : '#4A6B4A',
                                            fontSize: '12px', fontWeight: isActive ? '700' : '500'
                                        }}>{row.week}</span>
                                    </div>
                                    <div style={{
                                        textAlign: 'right', fontSize: '13px',
                                        fontWeight: isActive ? '700' : '500',
                                        color: isActive ? '#2EAA5E' : '#1A2E1A'
                                    }}>
                                        {row.bw_g ? row.bw_g.toLocaleString() : '—'}
                                    </div>
                                    <div style={{
                                        textAlign: 'right', fontSize: '13px',
                                        fontWeight: isActive ? '700' : '400',
                                        color: isActive ? '#2EAA5E' : '#4A6B4A'
                                    }}>
                                        {idx === 0 ? '—' : (row.bw_g && bwRows[idx-1]?.bw_g) ? '+' + (row.bw_g - bwRows[idx-1].bw_g) : '—'}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div style={{ fontWeight: '600', fontSize: '14px', marginTop: '16px' }}>Standard BW Curve</div>
                    <div style={{ background: 'white', borderRadius: '10px', border: '1px solid #DFF0E6', padding: '16px', overflowX: 'auto', marginTop: '8px' }}>
                        <svg viewBox="0 0 800 300" style={{ width: '100%', minWidth: '400px' }}>
                            {[0,1,2,3,4].map(i => (
                                <line key={i} x1="40" y1={40 + i*57} x2="760" y2={40 + i*57} stroke="#E5E7EB" strokeWidth="1" />
                            ))}
                            <path d={pathD} fill="none" stroke="#2EAA5E" strokeWidth="2.5" />
                            {selectedBWRow && (
                                <circle cx={toX(selectedBWRow.week)} cy={toY(selectedBWRow.bw_g)} r="5" fill="#2EAA5E" stroke="white" strokeWidth="2" />
                            )}
                            {bwRows.filter((_, i) => i % Math.ceil(bwRows.length / 8) === 0).map(r => (
                                <text key={r.week} x={toX(r.week)} y="290" textAnchor="middle" fontSize="10" fill="#6B7280">W{r.week}</text>
                            ))}
                            <text x="12" y="150" textAnchor="middle" fontSize="10" fill="#6B7280" transform="rotate(-90, 12, 150)">Body Weight</text>
                        </svg>
                    </div>
                </div>
            );
        }

        let tableData = [];
        
        // Handle daily view for Broiler and Color Chicken
        if (viewMode === 'daily' && module === 'broiler') {
            if (!bwData || !bwData.dailyStandard) {
                return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--fw-sub)' }}>Loading...</div>;
            }
            tableData = bwData.dailyStandard.map(row => ({
                day: row.day,
                week: row.week,
                bw: row.bw_g,
                gain: row.gain_g
            }));
        } else if (viewMode === 'daily' && module === 'color_chicken') {
            const rangeData = getColorRange(colorVariant, colorSex);
            tableData = rangeData.map((row, idx) => ({
                day: row.day,
                week: row.week,
                bw: row.bw_avg,
                gain: idx > 0 ? row.bw_avg - rangeData[idx - 1].bw_avg : null,
                feed: row.feed_avg,
            }));
        } else if (module === 'broiler') {
            if (!bwData || !bwData.weeklyStandard) {
                return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--fw-sub)' }}>Loading...</div>;
            }
            tableData = bwData.weeklyStandard.map(row => ({
                week: row.week,
                day: row.day,
                bw: row.bw_g,
                gain: row.gain_g
            }));
        } else if (!bwData) {
            return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--fw-sub)' }}>Loading...</div>;
        } else if (module === 'layer') {
            const _lRows = layerBreedData
                ? Array.from({ length: 80 }, (_, i) => i + 1)
                    .map(w => { const s = getLayerBreedStd(layerBreedData, w); return s ? { week: w, bw: s.bw_avg } : null; })
                    .filter(Boolean)
                : LAYER_RANGE.map(row => ({ week: row.week, bw: row.bw_avg }));
            tableData = _lRows.map((row, idx) => ({
                week: row.week,
                bw: row.bw,
                gain: idx > 0 ? row.bw - _lRows[idx - 1].bw : null
            }));
        } else if (module === 'color_chicken') {
            // Weekly view: pick day 7 of each week (D7, D14, D21 ... D126)
            const rangeData = getColorRange(colorVariant, colorSex);
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
                                {module === 'color_chicken' && (
                                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)' }}>
                                        {t('farmguide.phase') || 'Phase'}
                                    </th>
                                )}
                                <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)' }}>
                                    {t('farmguide.stdBW') || 'BW'} (g)
                                </th>
                                <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)' }}>
                                    {viewMode === 'daily' ? (t('farmguide.adg') || 'ADG (g)') : (t('farmguide.weeklyGain') || 'Gain (g)')}
                                </th>
                                {module === 'color_chicken' && tableData[0].fcr !== undefined && (
                                    <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)' }}>
                                        FCR
                                    </th>
                                )}
                                {module !== 'broiler' && module !== 'color_chicken' && tableData[0].feed !== null && tableData[0].feed !== undefined && (
                                    <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)' }}>
                                        {t('farmguide.feedPerDay') || 'Feed/Day'} (g)
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((row, idx) => {
                                const isActive = viewMode === 'daily' ? row.day === selectedDay : row.week === selectedWeek;
                                const rowId = module === 'layer' 
                                    ? `layer-bw-row-${row.week}`
                                    : module === 'color_chicken'
                                        ? (viewMode === 'daily' ? `color-bw-row-day-${row.day}` : `color-bw-row-week-${row.week}`)
                                        : (viewMode === 'daily' ? `bw-row-day-${row.day}` : `bw-row-${row.week}`);
                                
                                return (
                                    <tr 
                                        key={idx}
                                        id={rowId}
                                        style={{ 
                                            borderTop: '1px solid var(--fw-border)',
                                            background: isActive ? '#E1F5EE' : 'transparent'
                                        }}
                                    >
                                        {viewMode === 'daily' ? (
                                            <>
                                                <td style={{ 
                                                    padding: '0.75rem', 
                                                    fontSize: isActive ? 'calc(0.875rem * 1.1)' : '0.875rem',
                                                    fontWeight: isActive ? '700' : '400',
                                                    color: 'var(--fw-text)'
                                                }}>
                                                    {row.day}
                                                </td>
                                                <td style={{ 
                                                    padding: '0.75rem', 
                                                    textAlign: 'right',
                                                    fontSize: isActive ? 'calc(0.875rem * 1.1)' : '0.875rem',
                                                    fontWeight: isActive ? '700' : '400',
                                                    color: 'var(--fw-text)'
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
                                                    color: 'var(--fw-text)'
                                                }}>
                                                    {row.week}
                                                </td>
                                                {(module === 'broiler' || module === 'parent_stock') && (
                                                    <td style={{ 
                                                        padding: '0.75rem', 
                                                        textAlign: 'right',
                                                        fontSize: isActive ? 'calc(0.875rem * 1.1)' : '0.875rem',
                                                        fontWeight: isActive ? '700' : '400',
                                                        color: 'var(--fw-text)'
                                                    }}>
                                                        {row.day}
                                                    </td>
                                                )}
                                            </>
                                        )}
                                        {module === 'color_chicken' && (
                                            <td style={{ 
                                                padding: '0.75rem', 
                                                textAlign: 'left',
                                                fontSize: isActive ? 'calc(0.875rem * 1.1)' : '0.875rem',
                                                fontWeight: isActive ? '700' : '400',
                                                color: 'var(--fw-text)'
                                            }}>
                                                {(() => {
                                                    const day = row.day || ((row.week - 1) * 7 + 1);
                                                    if (day <= 21) return 'Starter';
                                                    if (day <= 35) return 'Grower';
                                                    return 'Finisher';
                                                })()}
                                            </td>
                                        )}
                                        <td style={{ 
                                            padding: '0.75rem', 
                                            textAlign: 'right', 
                                            fontSize: isActive ? 'calc(0.875rem * 1.1)' : '0.875rem',
                                            fontWeight: isActive ? '700' : '400',
                                            color: 'var(--fw-text)'
                                        }}>
                                            {row.bw}
                                        </td>
                                        <td style={{ 
                                            padding: '0.75rem', 
                                            textAlign: 'right', 
                                            fontSize: isActive ? 'calc(0.875rem * 1.1)' : '0.875rem',
                                            fontWeight: isActive ? '700' : '400',
                                            color: 'var(--fw-text)'
                                        }}>
                                            {row.gain ? Math.round(row.gain) : '—'}
                                        </td>
                                        {module === 'color_chicken' && row.fcr !== undefined && (
                                            <td style={{ 
                                                padding: '0.75rem', 
                                                textAlign: 'right',
                                                fontSize: isActive ? 'calc(0.875rem * 1.1)' : '0.875rem',
                                                fontWeight: isActive ? '700' : '400',
                                                color: 'var(--fw-text)'
                                            }}>
                                                {row.fcr ? row.fcr.toFixed(2) : '—'}
                                            </td>
                                        )}
                                        {module !== 'broiler' && module !== 'color_chicken' && row.feed !== null && row.feed !== undefined && (
                                            <td style={{ 
                                                padding: '0.75rem', 
                                                textAlign: 'right', 
                                                fontSize: isActive ? 'calc(0.875rem * 1.1)' : '0.875rem',
                                                fontWeight: isActive ? '700' : '400',
                                                color: 'var(--fw-text)'
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
                
                {/* Layer BW Chart */}
                {module === 'layer' && (() => {
                    const chartData = layerBreedData
                        ? Array.from({ length: 80 }, (_, i) => i + 1).map(w => { const s = getLayerBreedStd(layerBreedData, w); return s ? { week: w, bw_avg: s.bw_avg } : null; }).filter(Boolean)
                        : LAYER_RANGE;
                    const maxBW = 2200;
                    const chartHeight = 300;
                    const chartWidth = 800;
                    const padding = { top: 20, right: 40, bottom: 40, left: 60 };
                    const plotWidth = chartWidth - padding.left - padding.right;
                    const plotHeight = chartHeight - padding.top - padding.bottom;
                    
                    const xScale = (week) => padding.left + ((week - 1) / 79) * plotWidth;
                    const yScale = (bw) => padding.top + plotHeight - (bw / maxBW) * plotHeight;
                    
                    const points = chartData.map(d => {
                        const x = xScale(d.week);
                        const y = yScale(d.bw_avg);
                        return `${x},${y}`;
                    }).join(' ');
                    
                    const currentX = xScale(selectedWeek);
                    const currentY = yScale(chartData.find(d => d.week === selectedWeek)?.bw_avg || 0);
                    
                    return (
                        <div style={{ marginTop: '1.5rem' }}>
                            <div style={{ 
                                fontSize: '0.875rem', 
                                fontWeight: '600', 
                                color: 'var(--fw-text)', 
                                marginBottom: '0.75rem' 
                            }}>
                                {t('farmguide.bwChart') || 'Body Weight Standard Curve'}
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
                                    {[0, 500, 1000, 1500, 2000].map(bw => (
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
                                    
                                    {/* Data points */}
                                    {chartData.map(d => {
                                        const x = xScale(d.week);
                                        const y = yScale(d.bw_avg);
                                        const isSelected = d.week === selectedWeek;
                                        return (
                                            <circle
                                                key={d.week}
                                                cx={x}
                                                cy={y}
                                                r={isSelected ? 6 : 4}
                                                fill={isSelected ? 'var(--fw-teal)' : 'white'}
                                                stroke="var(--fw-teal)"
                                                strokeWidth="2"
                                            />
                                        );
                                    })}
                                    
                                    {/* X-axis ticks */}
                                    {[1, 10, 20, 30, 40, 50, 60, 70, 80].map(week => (
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
                                    ))}
                                    
                                    {/* Axis labels */}
                                    <text
                                        x={chartWidth / 2}
                                        y={chartHeight - 5}
                                        textAnchor="middle"
                                        fontSize="12"
                                        fill="var(--fw-sub)"
                                        fontWeight="600"
                                    >
                                        {t('farmguide.week') || 'Week'}
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

                {/* Color Chicken BW Chart */}
                {module === 'color_chicken' && (() => {
                    const allData = getColorRange(colorVariant, colorSex);
                    // Weekly mode: use only week-end days (D7, D14, D21...D126)
                    // Daily mode: use all days (D1-D126)
                    const chartData = viewMode === 'weekly' 
                        ? allData.filter(d => d.day % 7 === 0)
                        : allData;
                    
                    const maxBW = Math.max(...chartData.map(d => d.bw_avg));
                    const yMax = Math.ceil((maxBW + maxBW * 0.1) / 200) * 200;
                    const chartHeight = 300;
                    const chartWidth = 800;
                    const padding = { top: 20, right: 40, bottom: 40, left: 65 };
                    const plotWidth = chartWidth - padding.left - padding.right;
                    const plotHeight = chartHeight - padding.top - padding.bottom;
                    
                    const maxDay = viewMode === 'weekly' ? 126 : 126;
                    const xScale = (day) => padding.left + ((day - 1) / 125) * plotWidth;
                    const yScale = (bw) => padding.top + plotHeight - (bw / yMax) * plotHeight;
                    
                    const points = chartData.map(d => {
                        const x = xScale(d.day);
                        const y = yScale(d.bw_avg);
                        return `${x},${y}`;
                    }).join(' ');
                    
                    // X-axis ticks: Weekly mode shows W1-W18, Daily mode shows D1, D14, D28...
                    const xTicks = viewMode === 'weekly'
                        ? [7, 14, 21, 28, 35, 42, 49, 56, 63, 70, 77, 84, 91, 98, 105, 112, 119, 126]
                        : [1, 14, 28, 42, 56, 70, 84, 98, 112, 126];
                    const yTicks = [];
                    for (let i = 0; i <= yMax; i += 200) {
                        yTicks.push(i);
                    }
                    
                    return (
                        <div style={{ marginTop: '1.5rem' }}>
                            <div style={{ 
                                fontSize: '0.875rem', 
                                fontWeight: '600', 
                                color: 'var(--fw-text)', 
                                marginBottom: '0.75rem' 
                            }}>
                                {t('farmguide.bwChart') || 'Body Weight Standard Curve'}
                            </div>
                            <div style={{ 
                                background: 'var(--fw-card)', 
                                border: '1px solid var(--fw-border)', 
                                borderRadius: '8px', 
                                padding: '1rem',
                                overflowX: 'auto'
                            }}>
                                <svg width={chartWidth} height={chartHeight} style={{ display: 'block' }}>
                                    {/* Y-axis gridlines and labels */}
                                    {yTicks.map(bw => (
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
                                        strokeWidth="2"
                                    />
                                    
                                    {/* Selected day/week highlight circle */}
                                    {(() => {
                                        const targetDay = viewMode === 'weekly' ? selectedWeek * 7 : selectedDay;
                                        const selectedData = chartData.find(d => d.day === targetDay);
                                        if (selectedData) {
                                            const x = xScale(selectedData.day);
                                            const y = yScale(selectedData.bw_avg);
                                            return (
                                                <circle
                                                    cx={x}
                                                    cy={y}
                                                    r={6}
                                                    fill="#0C3830"
                                                    stroke="#0C3830"
                                                    strokeWidth="2"
                                                />
                                            );
                                        }
                                        return null;
                                    })()}
                                    
                                    {/* X-axis ticks */}
                                    {xTicks.map(day => {
                                        const isActive = viewMode === 'weekly' 
                                            ? day === selectedWeek * 7 
                                            : day === selectedDay;
                                        const label = viewMode === 'weekly' 
                                            ? `W${day / 7}` 
                                            : `D${day}`;
                                        return (
                                            <text
                                                key={day}
                                                x={xScale(day)}
                                                y={chartHeight - padding.bottom + 20}
                                                textAnchor="middle"
                                                fontSize="11"
                                                fill="var(--fw-text)"
                                                fontWeight={isActive ? '700' : '400'}
                                            >
                                                {label}
                                            </text>
                                        );
                                    })}
                                    
                                    {/* Axis labels */}
                                    <text
                                        x={chartWidth / 2}
                                        y={chartHeight - 5}
                                        textAnchor="middle"
                                        fontSize="12"
                                        fill="var(--fw-sub)"
                                        fontWeight="600"
                                    >
                                        {t('farmguide.day') || 'Day'}
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

    const renderEggProductionTab = () => {
        if (module === 'parent_stock') {
            // Show message if in Rearing phase (W1-W24)
            if (selectedWeek < 25) {
                return (
                    <div style={{ 
                        padding: '2rem', 
                        textAlign: 'center', 
                        background: 'var(--fw-card)',
                        border: '1px solid var(--fw-border)',
                        borderRadius: '8px',
                        color: 'var(--fw-text)'
                    }}>
                        {t('farmguide.epStartsW25') || 'Egg production data starts from Week 25 (Production phase).'}
                    </div>
                );
            }
            
            // Production phase (W25+): show table and chart
            const chartHeight = 300;
            const chartWidth = 800;
            const marginLeft = 65;
            const marginBottom = 40;
            const marginTop = 20;
            const marginRight = 20;
            const plotWidth = chartWidth - marginLeft - marginRight;
            const plotHeight = chartHeight - marginTop - marginBottom;
            
            const minWeek = 25;
            const maxWeek = 64;
            const xScale = (week) => marginLeft + ((week - minWeek) / (maxWeek - minWeek)) * plotWidth;
            const yScale = (ep) => chartHeight - marginBottom - (ep / 100) * plotHeight;
            
            // X-axis ticks
            const xTicks = [25, 30, 35, 40, 45, 50, 55, 60, 64];

            // Use breed-specific production data if available, else fallback to generic
            const epData = (bwData && bwData.weeklyProduction)
                ? bwData.weeklyProduction.map(r => ({
                    week: r.age_weeks,
                    ep_pct: r.hen_housed_pct,
                    hatching_eggs_bird_week: r.hatching_eggs_week,
                    hatchability_pct: r.hatchability_pct,
                    chicks_bird_cum: r.chicks_cum,
                }))
                : PS_EGG_PRODUCTION;
            
            // Y-axis ticks (every 20%)
            const yTicks = [0, 20, 40, 60, 80, 100];
            
            return (
                <div>
                    {/* Section header */}
                    <div style={{ 
                        fontSize: '1rem', 
                        fontWeight: '600', 
                        color: 'var(--fw-text)', 
                        marginBottom: '0.75rem' 
                    }}>
                        Week {selectedWeek} — Egg Production
                    </div>
                    
                    {/* EP Data Table */}
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
                                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)' }}>
                                        Week
                                    </th>
                                    <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)' }}>
                                        EP%
                                    </th>
                                    <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)' }}>
                                        {t('farmguide.hePerBird') || 'HE/Bird/Week'}
                                    </th>
                                    <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)' }}>
                                        Hatchability%
                                    </th>
                                    <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)' }}>
                                        Cum. Chicks
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {epData.map(entry => {
                                    const isActive = entry.week === selectedWeek;
                                    return (
                                        <tr
                                            key={entry.week}
                                            id={`ps-ep-row-${entry.week}`}
                                            style={{ 
                                                borderTop: '1px solid var(--fw-border)',
                                                background: isActive ? '#E1F5EE' : 'transparent'
                                            }}
                                        >
                                            <td style={{ 
                                                padding: '0.75rem', 
                                                fontSize: isActive ? 'calc(0.875rem * 1.1)' : '0.875rem',
                                                fontWeight: isActive ? '700' : '400',
                                                color: 'var(--fw-text)'
                                            }}>
                                                {entry.week}
                                            </td>
                                            <td style={{ 
                                                padding: '0.75rem', 
                                                textAlign: 'right',
                                                fontSize: isActive ? 'calc(0.875rem * 1.1)' : '0.875rem',
                                                fontWeight: isActive ? '700' : '400',
                                                color: 'var(--fw-text)'
                                            }}>
                                                {entry.ep_pct != null ? entry.ep_pct + '%' : '—'}
                                            </td>
                                            <td style={{ 
                                                padding: '0.75rem', 
                                                textAlign: 'right',
                                                fontSize: isActive ? 'calc(0.875rem * 1.1)' : '0.875rem',
                                                fontWeight: isActive ? '700' : '400',
                                                color: 'var(--fw-text)'
                                            }}>
                                                {entry.hatching_eggs_bird_week != null ? entry.hatching_eggs_bird_week : '—'}
                                            </td>
                                            <td style={{ 
                                                padding: '0.75rem', 
                                                textAlign: 'right',
                                                fontSize: isActive ? 'calc(0.875rem * 1.1)' : '0.875rem',
                                                fontWeight: isActive ? '700' : '400',
                                                color: 'var(--fw-text)'
                                            }}>
                                                {entry.hatchability_pct != null ? entry.hatchability_pct + '%' : '—'}
                                            </td>
                                            <td style={{ 
                                                padding: '0.75rem', 
                                                textAlign: 'right',
                                                fontSize: isActive ? 'calc(0.875rem * 1.1)' : '0.875rem',
                                                fontWeight: isActive ? '700' : '400',
                                                color: 'var(--fw-text)'
                                            }}>
                                                {entry.chicks_cum != null ? entry.chicks_cum.toLocaleString() : '—'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* EP% Chart */}
                    <div style={{ marginTop: '1.5rem' }}>
                        <div style={{ 
                            fontSize: '0.875rem', 
                            fontWeight: '600', 
                            color: 'var(--fw-text)', 
                            marginBottom: '0.75rem' 
                        }}>
                            {t('farmguide.epChart') || 'Egg Production Chart (W25-W64)'}
                        </div>
                        <div style={{ 
                            background: 'var(--fw-card)', 
                            border: '1px solid var(--fw-border)', 
                            borderRadius: '8px', 
                            padding: '1rem',
                            overflowX: 'auto'
                        }}>
                            <svg width={chartWidth} height={chartHeight} style={{ display: 'block' }}>
                                {/* Y-axis gridlines */}
                                {yTicks.map(tick => (
                                    <line
                                        key={`y-grid-${tick}`}
                                        x1={marginLeft}
                                        y1={yScale(tick)}
                                        x2={chartWidth - marginRight}
                                        y2={yScale(tick)}
                                        stroke="var(--fw-border)"
                                        strokeWidth="1"
                                        strokeDasharray="4,4"
                                    />
                                ))}
                                
                                {/* X-axis ticks */}
                                {xTicks.map(week => (
                                    <text
                                        key={week}
                                        x={xScale(week)}
                                        y={chartHeight - marginBottom + 20}
                                        textAnchor="middle"
                                        fontSize="11"
                                        fill="var(--fw-text)"
                                        fontWeight={week === selectedWeek ? '700' : '400'}
                                    >
                                        W{week}
                                    </text>
                                ))}
                                
                                {/* Y-axis labels */}
                                {yTicks.map(tick => (
                                    <text
                                        key={tick}
                                        x={marginLeft - 10}
                                        y={yScale(tick) + 4}
                                        textAnchor="end"
                                        fontSize="11"
                                        fill="var(--fw-sub)"
                                    >
                                        {tick}%
                                    </text>
                                ))}
                                
                                {/* Axis labels */}
                                <text
                                    x={chartWidth / 2}
                                    y={chartHeight - 5}
                                    textAnchor="middle"
                                    fontSize="12"
                                    fill="var(--fw-sub)"
                                    fontWeight="600"
                                >
                                    {t('farmguide.week') || 'Week'}
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
                                    EP% (H.D.)
                                </text>
                                
                                {/* Line path */}
                                <polyline
                                    points={epData.map(d => `${xScale(d.week)},${yScale(d.ep_pct)}`).join(' ')}
                                    fill="none"
                                    stroke="var(--fw-teal)"
                                    strokeWidth="3"
                                />
                                
                                {/* Single highlight circle at selected week */}
                                {(() => {
                                    const selectedData = epData.find(d => d.week === selectedWeek);
                                    if (selectedData) {
                                        return (
                                            <circle
                                                cx={xScale(selectedData.week)}
                                                cy={yScale(selectedData.ep_pct)}
                                                r="6"
                                                fill="#0C3830"
                                            />
                                        );
                                    }
                                    return null;
                                })()}
                            </svg>
                        </div>
                    </div>
                </div>
            );
        }
        
        if (module === 'layer_ps') {
            if (psPhase === 'rearing' || selectedWeek < 19) {
                return (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--fw-sub)', fontSize: '14px' }}>
                        🥚 Egg production data starts from Week 19 (Production phase).
                    </div>
                );
            }
            const epData = (bwData && bwData.weeklyProduction && bwData.weeklyProduction.length > 0)
                ? bwData.weeklyProduction.map(r => ({
                    week: r.prod_week || r.age_weeks,
                    ep_pct: r.hen_housed_pct,
                    he_pct: r.hatchability_pct,
                    egg_weight_g: null,
                    saleable_chicks_cum: r.chicks_cum,
                }))
                : LAYER_PS_EP;
            const selectedRow = epData.find(r => r.week === selectedWeek) || epData[0];
            const minW = 19, maxW = 75;
            const toX = (w) => ((w - minW) / (maxW - minW)) * 680 + 60;
            const toY = (v) => 240 - (v / 100) * 200;
            const epLine = epData.filter(r => r.ep_pct != null)
                .map((r, i) => `${i === 0 ? 'M' : 'L'} ${toX(r.week)} ${toY(r.ep_pct)}`).join(' ');
            const heLine = epData.filter(r => r.he_pct != null)
                .map((r, i) => `${i === 0 ? 'M' : 'L'} ${toX(r.week)} ${toY(r.he_pct)}`).join(' ');
            const xTicks = [19,25,30,35,40,45,50,55,60,65,70,75];
            const yTicks = [0,20,40,60,80,100];
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ fontWeight: '700', fontSize: '15px' }}>
                        Week {selectedWeek} — Egg Production Standard
                    </div>
                    {/* KPI row */}
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        {[
                            { label: 'EP%', value: selectedRow?.ep_pct != null ? `${selectedRow.ep_pct}%` : '—' },
                            { label: 'HE%', value: selectedRow?.he_pct != null ? `${selectedRow.he_pct}%` : '—' },
                            { label: 'Egg Weight', value: selectedRow?.egg_weight_g != null ? `${selectedRow.egg_weight_g}g` : '—' },
                            { label: 'Saleable Chicks Cum.', value: selectedRow?.saleable_chicks_cum != null ? selectedRow.saleable_chicks_cum : '—' },
                        ].map((kpi, i) => (
                            <div key={i} style={{
                                background: 'white', borderRadius: '10px', padding: '12px 16px',
                                border: '1px solid var(--fw-border)', minWidth: '120px', flex: '1'
                            }}>
                                <div style={{ fontSize: '11px', color: 'var(--fw-sub)', marginBottom: '4px' }}>{kpi.label}</div>
                                <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--fw-teal)' }}>{kpi.value}</div>
                            </div>
                        ))}
                    </div>
                    {/* Table */}
                    <div style={{ overflowY: 'auto', maxHeight: '380px', borderRadius: '10px', border: '1px solid var(--fw-border)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                            <thead>
                                <tr style={{ background: 'var(--fw-teal)', color: 'white', position: 'sticky', top: 0 }}>
                                    <th style={{ padding: '10px 12px', textAlign: 'left' }}>Week</th>
                                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>EP%</th>
                                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>HE%</th>
                                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Egg Wt (g)</th>
                                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Chicks Cum.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {epData.map((row, i) => {
                                    const isSelected = row.week === selectedWeek;
                                    return (
                                        <tr key={row.week}
                                            onClick={() => setSelectedWeek(row.week)}
                                            style={{
                                                background: isSelected ? '#E1F5EE' : i % 2 === 0 ? 'white' : '#F9FAFB',
                                                cursor: 'pointer',
                                                fontWeight: isSelected ? '700' : '400',
                                            }}>
                                            <td style={{ padding: '9px 12px' }}>{row.week}</td>
                                            <td style={{ padding: '9px 12px', textAlign: 'right' }}>{row.ep_pct ?? '—'}</td>
                                            <td style={{ padding: '9px 12px', textAlign: 'right' }}>{row.he_pct ?? '—'}</td>
                                            <td style={{ padding: '9px 12px', textAlign: 'right' }}>{row.egg_weight_g ?? '—'}</td>
                                            <td style={{ padding: '9px 12px', textAlign: 'right' }}>{row.saleable_chicks_cum ?? '—'}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {/* Chart */}
                    <div style={{ background: 'white', borderRadius: '10px', border: '1px solid var(--fw-border)', padding: '16px', overflowX: 'auto' }}>
                        <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                            <span style={{ color: 'var(--fw-teal)' }}>— EP%</span>
                            <span style={{ color: 'var(--fw-orange)', marginLeft: '16px' }}>— HE%</span>
                        </div>
                        <svg viewBox="0 0 800 280" style={{ width: '100%', minWidth: '400px' }}>
                            {yTicks.map(y => (
                                <g key={y}>
                                    <line x1="60" y1={toY(y)} x2="760" y2={toY(y)} stroke="#E5E7EB" strokeWidth="1" />
                                    <text x="52" y={toY(y) + 4} textAnchor="end" fontSize="10" fill="#9CA3AF">{y}%</text>
                                </g>
                            ))}
                            {xTicks.map(w => (
                                <text key={w} x={toX(w)} y="268" textAnchor="middle" fontSize="10" fill="#9CA3AF">W{w}</text>
                            ))}
                            <path d={epLine} fill="none" stroke="var(--fw-teal)" strokeWidth="2.5" />
                            <path d={heLine} fill="none" stroke="var(--fw-orange)" strokeWidth="2" strokeDasharray="5,3" />
                            {selectedRow && selectedRow.ep_pct != null && (
                                <circle cx={toX(selectedRow.week)} cy={toY(selectedRow.ep_pct)} r="5"
                                    fill="var(--fw-teal)" stroke="white" strokeWidth="2" />
                            )}
                        </svg>
                    </div>
                </div>
            );
        }

        if (module === 'color_ps') {
            const productionRows = (bwData?.weeklyProduction || []).filter(r => r.age_weeks >= 22);
            if (productionRows.length === 0) return (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#4A6B4A' }}>
                    No production data available.
                </div>
            );
            const activeWeek = Number(selectedWeek);
            const selectedRow = productionRows.find(r => r.age_weeks === activeWeek) || productionRows[0];
            const epRows = productionRows.filter(r => r.hen_housed_pct != null);
            const minEPW = epRows.length ? epRows[0].age_weeks : 22;
            const maxEPW = epRows.length ? epRows[epRows.length-1].age_weeks : 70;
            const toX = (w) => ((w - minEPW) / Math.max(maxEPW - minEPW, 1)) * 720 + 40;
            const toY = (v) => 270 - (v / 100) * 230;
            const epPathD = epRows.map((r, i) => `${i === 0 ? 'M' : 'L'} ${toX(r.age_weeks)} ${toY(r.hen_housed_pct)}`).join(' ');
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                    {/* Section header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <div style={{
                            width: '32px', height: '32px', borderRadius: '8px',
                            background: '#2EAA5E', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M12 8v4l3 3"/>
                            </svg>
                        </div>
                        <div>
                            <div style={{ fontWeight: '700', fontSize: '14px', color: '#1A2E1A' }}>
                                Egg Production
                            </div>
                            <div style={{ fontSize: '12px', color: '#4A6B4A' }}>
                                {bwData?.breedLabel || ''} · W22–W70
                            </div>
                        </div>
                    </div>

                    {/* KPI Cards */}
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
                        {[
                            { label: 'Prod %', value: selectedRow?.hen_housed_pct != null ? selectedRow.hen_housed_pct + '%' : '—' },
                            { label: 'Eggs/Hen/Wk', value: selectedRow?.eggs_bird_week != null ? selectedRow.eggs_bird_week.toFixed(1) : '—' },
                            { label: 'Cum Eggs', value: selectedRow?.eggs_bird_cum != null ? selectedRow.eggs_bird_cum.toFixed(1) : '—' },
                            { label: 'Egg Wt (g)', value: selectedRow?.egg_weight_g != null ? selectedRow.egg_weight_g.toFixed(1) : '—' },
                        ].map((kpi, idx) => (
                            <div key={idx} style={{ background: 'white', borderRadius: '10px', padding: '12px 16px', border: '1px solid #DFF0E6', minWidth: '110px', flex: '1' }}>
                                <div style={{ fontSize: '11px', color: '#4A6B4A', marginBottom: '4px' }}>{kpi.label}</div>
                                <div style={{ fontSize: '20px', fontWeight: '700', color: '#2EAA5E' }}>{kpi.value}</div>
                            </div>
                        ))}
                    </div>

                    {/* Table */}
                    <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #DFF0E6', background: 'white', maxHeight: '380px', overflowY: 'auto' }}>
                        <div style={{
                            display: 'grid', gridTemplateColumns: '52px 1fr 1fr 1fr 1fr',
                            background: '#2EAA5E', padding: '10px 14px', gap: '8px'
                        }}>
                            {['Week', 'Prod %', 'Eggs/Hen/Wk', 'Cum Eggs', 'Egg Wt (g)'].map((h, i) => (
                                <div key={i} style={{
                                    fontSize: '11px', fontWeight: '700', color: 'white',
                                    textAlign: i === 0 ? 'center' : 'right',
                                    textTransform: 'uppercase', letterSpacing: '0.04em'
                                }}>{h}</div>
                            ))}
                        </div>
                        {productionRows.map((row, idx) => {
                            const isActive = Number(row.age_weeks) === activeWeek;
                            return (
                                <div key={idx} style={{
                                    display: 'grid', gridTemplateColumns: '52px 1fr 1fr 1fr 1fr',
                                    padding: '9px 14px', gap: '8px',
                                    background: isActive ? 'rgba(46,170,94,0.10)' : idx % 2 === 0 ? 'white' : '#F2F4F2',
                                    borderBottom: idx < productionRows.length - 1 ? '1px solid #DFF0E6' : 'none'
                                }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <span style={{
                                            display: 'inline-block', minWidth: '28px', padding: '2px 6px',
                                            borderRadius: '6px',
                                            background: isActive ? '#2EAA5E' : 'transparent',
                                            color: isActive ? 'white' : '#4A6B4A',
                                            fontSize: '12px', fontWeight: isActive ? '700' : '500'
                                        }}>{row.age_weeks}</span>
                                    </div>
                                    <div style={{ textAlign: 'right', fontSize: '13px', fontWeight: isActive ? '700' : '500', color: isActive ? '#2EAA5E' : '#1A2E1A' }}>
                                        {row.hen_housed_pct != null ? `${row.hen_housed_pct}%` : '—'}
                                    </div>
                                    <div style={{ textAlign: 'right', fontSize: '13px', fontWeight: isActive ? '700' : '400', color: isActive ? '#2EAA5E' : '#1A2E1A' }}>
                                        {row.eggs_bird_week != null ? row.eggs_bird_week.toFixed(1) : '—'}
                                    </div>
                                    <div style={{ textAlign: 'right', fontSize: '13px', fontWeight: isActive ? '700' : '400', color: isActive ? '#2EAA5E' : '#4A6B4A' }}>
                                        {row.eggs_bird_cum != null ? row.eggs_bird_cum.toFixed(1) : '—'}
                                    </div>
                                    <div style={{ textAlign: 'right', fontSize: '13px', fontWeight: isActive ? '700' : '400', color: isActive ? '#2EAA5E' : '#4A6B4A' }}>
                                        {row.egg_weight_g != null ? row.egg_weight_g.toFixed(1) : '—'}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div style={{ fontWeight: '600', fontSize: '14px', marginTop: '16px' }}>Egg Production Curve</div>
                    <div style={{ background: 'white', borderRadius: '10px', border: '1px solid #DFF0E6', padding: '16px', overflowX: 'auto', marginTop: '8px' }}>
                        <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#2EAA5E' }}>— Prod %</div>
                        <svg viewBox="0 0 800 300" style={{ width: '100%', minWidth: '400px' }}>
                            {[0,20,40,60,80,100].map(y => (
                                <g key={y}>
                                    <line x1="40" y1={toY(y)} x2="760" y2={toY(y)} stroke="#E5E7EB" strokeWidth="1" />
                                    <text x="32" y={toY(y)+4} textAnchor="end" fontSize="10" fill="#9CA3AF">{y}%</text>
                                </g>
                            ))}
                            <path d={epPathD} fill="none" stroke="#2EAA5E" strokeWidth="2.5" />
                            {selectedRow?.hen_housed_pct != null && (
                                <circle cx={toX(selectedRow.age_weeks)} cy={toY(selectedRow.hen_housed_pct)} r="5" fill="#2EAA5E" stroke="white" strokeWidth="2" />
                            )}
                            {epRows.filter((_, i) => i % Math.ceil(epRows.length / 8) === 0).map(r => (
                                <text key={r.age_weeks} x={toX(r.age_weeks)} y="290" textAnchor="middle" fontSize="10" fill="#6B7280">W{r.age_weeks}</text>
                            ))}
                        </svg>
                    </div>
                </div>
            );
        }

        if (module !== 'layer') return null;
        
        // Only show for W19+ (Production phase)
        if (selectedWeek < 19) {
            return (
                <div style={{
                    padding: '2rem',
                    textAlign: 'center',
                    color: 'var(--fw-sub)',
                    background: 'var(--fw-card)',
                    borderRadius: '12px',
                    border: '1px solid var(--fw-border)'
                }}>
                    {t('farmguide.epStartsW19') || 'Egg production data starts from Week 19.'}
                </div>
            );
        }
        
        return (
            <div>
                {/* EP Data Table */}
                <div style={{
                    maxHeight: '400px',
                    overflowY: 'auto',
                    border: '1px solid var(--fw-border)',
                    borderRadius: '8px',
                    marginBottom: '1.5rem'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ position: 'sticky', top: 0, background: 'var(--fw-bg)', zIndex: 1 }}>
                            <tr>
                                <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)', borderBottom: '2px solid var(--fw-border)' }}>
                                    {t('farmguide.week') || 'Week'}
                                </th>
                                <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)', borderBottom: '2px solid var(--fw-border)' }}>
                                    EP% (H.D.)
                                </th>
                                <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)', borderBottom: '2px solid var(--fw-border)' }}>
                                    EP% (H.H.)
                                </th>
                                <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)', borderBottom: '2px solid var(--fw-border)' }}>
                                    {t('farmguide.eggWeight') || 'Egg Weight (g)'}
                                </th>
                                <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-sub)', borderBottom: '2px solid var(--fw-border)' }}>
                                    {t('farmguide.eggMass') || 'Egg Mass/Week (g)'}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {LAYER_PRODUCTION.map((row, idx) => {
                                const isHighlighted = row.week === selectedWeek;
                                return (
                                    <tr
                                        key={idx}
                                        ref={isHighlighted ? (el) => {
                                            if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
                                        } : null}
                                        style={{
                                            background: isHighlighted ? 'var(--fw-teal-lt)' : 'transparent',
                                            borderBottom: '1px solid var(--fw-border)'
                                        }}
                                    >
                                        <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: 'var(--fw-text)', fontWeight: isHighlighted ? '600' : '400' }}>
                                            W{row.week}
                                        </td>
                                        <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', color: 'var(--fw-text)', fontWeight: isHighlighted ? '600' : '400' }}>
                                            {row.ep_pct.toFixed(1)}%
                                        </td>
                                        <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', color: 'var(--fw-text)', fontWeight: isHighlighted ? '600' : '400' }}>
                                            {row.ep_hh_pct.toFixed(1)}%
                                        </td>
                                        <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', color: 'var(--fw-text)', fontWeight: isHighlighted ? '600' : '400' }}>
                                            {row.egg_weight_g.toFixed(1)}
                                        </td>
                                        <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', color: 'var(--fw-text)', fontWeight: isHighlighted ? '600' : '400' }}>
                                            {row.egg_mass_week_g.toFixed(1)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                
                {/* EP% Chart */}
                <div style={{
                    padding: '1.5rem',
                    background: 'var(--fw-card)',
                    border: '1px solid var(--fw-border)',
                    borderRadius: '12px'
                }}>
                    <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: '600', color: 'var(--fw-text)' }}>
                        {t('farmguide.epChart') || 'Egg Production Chart'} (W19-W80)
                    </h3>
                    <svg width="100%" height="300" viewBox="0 0 800 300" style={{ overflow: 'visible' }}>
                        {/* Y-axis gridlines and labels */}
                        {[0, 20, 40, 60, 80, 100].map(ep => {
                            const y = 260 - (ep / 100) * 240;
                            return (
                                <g key={ep}>
                                    <line
                                        x1="50"
                                        y1={y}
                                        x2="750"
                                        y2={y}
                                        stroke="var(--fw-border)"
                                        strokeWidth="1"
                                        strokeDasharray="4,4"
                                    />
                                    <text
                                        x="40"
                                        y={y + 4}
                                        textAnchor="end"
                                        fontSize="11"
                                        fill="var(--fw-sub)"
                                    >
                                        {ep}%
                                    </text>
                                </g>
                            );
                        })}
                        
                        {/* Y-axis */}
                        <line x1="50" y1="20" x2="50" y2="260" stroke="var(--fw-border)" strokeWidth="2" />
                        {/* X-axis */}
                        <line x1="50" y1="260" x2="750" y2="260" stroke="var(--fw-border)" strokeWidth="2" />
                        
                        {/* X-axis ticks */}
                        {[19, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80].map(week => {
                            const idx = week - 19;
                            const x = 50 + (idx / 61) * 700;
                            return (
                                <text
                                    key={week}
                                    x={x}
                                    y="275"
                                    textAnchor="middle"
                                    fontSize="11"
                                    fill="var(--fw-text)"
                                    fontWeight={week === selectedWeek ? '700' : '400'}
                                >
                                    W{week}
                                </text>
                            );
                        })}
                        
                        {/* Y-axis label */}
                        <text x="15" y="140" fill="var(--fw-sub)" fontSize="12" fontWeight="600" textAnchor="middle" transform="rotate(-90 15 140)">
                            EP% (H.D.)
                        </text>
                        
                        {/* X-axis label */}
                        <text x="400" y="295" fill="var(--fw-sub)" fontSize="12" fontWeight="600" textAnchor="middle">
                            {t('farmguide.week') || 'Week'}
                        </text>
                        
                        {/* Plot line */}
                        {(() => {
                            const maxEP = 100;
                            const xScale = 700 / LAYER_PRODUCTION.length;
                            const yScale = 240 / maxEP;
                            
                            const points = LAYER_PRODUCTION.map((row, idx) => {
                                const x = 50 + (idx * xScale);
                                const y = 260 - (row.ep_pct * yScale);
                                return `${x},${y}`;
                            }).join(' ');
                            
                            return (
                                <>
                                    <polyline
                                        points={points}
                                        fill="none"
                                        stroke="var(--fw-teal)"
                                        strokeWidth="2"
                                    />
                                    {LAYER_PRODUCTION.map((row, idx) => {
                                        const x = 50 + (idx * xScale);
                                        const y = 260 - (row.ep_pct * yScale);
                                        const isHighlighted = row.week === selectedWeek;
                                        return (
                                            <circle
                                                key={idx}
                                                cx={x}
                                                cy={y}
                                                r={isHighlighted ? 6 : 4}
                                                fill={isHighlighted ? 'var(--fw-teal)' : 'white'}
                                                stroke="var(--fw-teal)"
                                                strokeWidth="2"
                                            />
                                        );
                                    })}
                                </>
                            );
                        })()}
                    </svg>
                </div>
            </div>
        );
    };

    const renderChecklistTab = () => {
        if (module === 'parent_stock') {
            const isPSBrooding = selectedWeek === 1;
            
            if (isPSBrooding) {
                // DAILY MODE (W1, D1-D28)
                const dayData = PS_CHECKLIST_DAILY[psBroodingDay - 1];
                if (!dayData) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--fw-sub)' }}>No data available</div>;
                
                const routineItems = dayData.routine || [];
                const milestoneItems = dayData.milestone || [];
                const allItems = [...routineItems, ...milestoneItems];
                const completedCount = allItems.filter(itemKey => checkedItems[itemKey]).length;
                const totalCount = allItems.length;
                const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
                
                return (
                    <div>
                        {/* Day selector */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-text)', marginBottom: '0.5rem', display: 'block' }}>
                                {t('farmguide.broodingDaily') || 'Daily Brooding Data'} (D1-D28)
                            </label>
                            <select
                                value={psBroodingDay}
                                onChange={(e) => setPsBroodingDay(Number(e.target.value))}
                                style={{
                                    padding: '0.5rem 1rem',
                                    fontSize: '0.875rem',
                                    border: '1px solid var(--fw-border)',
                                    borderRadius: '8px',
                                    background: 'var(--fw-card)',
                                    color: 'var(--fw-text)',
                                    cursor: 'pointer'
                                }}
                            >
                                {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                                    <option key={day} value={day}>Day {day}</option>
                                ))}
                            </select>
                        </div>
                        
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
                                    ✓ {completedCount} / {totalCount} completed
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
                        
                        {/* Daily Routine Section */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--fw-text)', marginBottom: '0.75rem' }}>
                                📋 {t('farmguide.dailyRoutine') || 'Daily Routine'}
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {routineItems.map(itemKey => (
                                    <ChecklistItem
                                        key={itemKey}
                                        id={itemKey}
                                        text={t('farmguide.' + itemKey) || itemKey}
                                        priority="medium"
                                        checked={!!checkedItems[itemKey]}
                                        onToggle={handleChecklistToggle}
                                    />
                                ))}
                            </div>
                        </div>
                        
                        {/* Milestone Tasks Section */}
                        {milestoneItems.length > 0 && (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--fw-text)', marginBottom: '0.75rem' }}>
                                    🎯 {t('farmguide.milestones') || 'Milestone Tasks'}
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {milestoneItems.map(itemKey => (
                                        <ChecklistItem
                                            key={itemKey}
                                            id={itemKey}
                                            text={t('farmguide.' + itemKey) || itemKey}
                                            priority="high"
                                            checked={!!checkedItems[itemKey]}
                                            onToggle={handleChecklistToggle}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            } else {
                // WEEKLY MODE (W2-W64)
                const weekData = BROILER_PS_GUIDE.find(w => w.week === selectedWeek);
                if (!weekData) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--fw-sub)' }}>No data available</div>;
                
                const items = weekData.checklist || [];
                const completedCount = items.filter((item, idx) => checkedItems[`ps-w${selectedWeek}-${idx}`]).length;
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
                                    ✓ {completedCount} / {totalCount} completed
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
                        
                        {/* Checklist Items */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {items.map((item, idx) => (
                                <ChecklistItem
                                    key={`ps-w${selectedWeek}-${idx}`}
                                    id={`ps-w${selectedWeek}-${idx}`}
                                    text={typeof item === 'object' ? (item[language] || item.en) : item}
                                    priority="medium"
                                    checked={!!checkedItems[`ps-w${selectedWeek}-${idx}`]}
                                    onToggle={handleChecklistToggle}
                                />
                            ))}
                        </div>
                    </div>
                );
            }
        }
        
        if (module === 'color_ps') {
            const guideWeek = Math.min(selectedWeek, 18);
            const weekData = COLOR_CHICKEN_GUIDE[guideWeek - 1];
            if (!weekData) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--fw-sub)' }}>No data available</div>;
            const items = weekData.checklist || [];
            const completedCount = items.filter(item => checkedItems[item.id]).length;
            const totalCount = items.length;
            const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
            return (
                <div>
                    {selectedWeek > 18 && (
                        <div style={{ padding: '8px 14px', marginBottom: '16px', background: 'rgba(46,170,94,0.08)', borderLeft: '3px solid #2EAA5E', borderRadius: '0 8px 8px 0', fontSize: '13px', color: '#4A6B4A' }}>
                            Showing W18 checklist reference for weeks W19–24.
                        </div>
                    )}
                    <div style={{ padding: '1rem', background: 'var(--fw-card)', border: '1px solid var(--fw-border)', borderRadius: '8px', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-text)' }}>✓ {completedCount} / {totalCount} selesai</span>
                            <span style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--fw-teal)' }}>{progressPct}%</span>
                        </div>
                        <div style={{ height: '8px', background: 'var(--fw-border)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: progressPct + '%', background: '#2EAA5E', borderRadius: '4px', transition: 'width 0.3s' }} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {items.map(item => (
                            <div key={item.id} onClick={() => toggleCheckItem(item.id)} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem', background: checkedItems[item.id] ? 'rgba(46,170,94,0.06)' : 'var(--fw-card)', border: '1px solid var(--fw-border)', borderRadius: '10px', cursor: 'pointer' }}>
                                <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: checkedItems[item.id] ? 'none' : '2px solid var(--fw-border)', background: checkedItems[item.id] ? '#2EAA5E' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                                    {checkedItems[item.id] && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><polyline points="1.5,5 4,7.5 8.5,2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.875rem', color: checkedItems[item.id] ? 'var(--fw-sub)' : 'var(--fw-text)', textDecoration: checkedItems[item.id] ? 'line-through' : 'none', lineHeight: '1.5' }}>
                                        {item.text?.[lang] || item.text?.en || item.text}
                                    </div>
                                    {item.priority === 'critical' && !checkedItems[item.id] && (
                                        <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#E53E3E', marginTop: '4px', display: 'inline-block' }}>● Critical</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

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
        
        // Layer module
        if (module === 'layer') {
            const weekData = LAYER_GUIDE[selectedWeek - 1];
            if (!weekData) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--fw-sub)' }}>No data available</div>;
            
            const items = weekData.checklist || [];
            const completedCount = items.filter(item => checkedItems[item.id]).length;
            const totalCount = items.length;
            const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
            
            return (
                <div>
                    {/* Progress Bar */}
                    <div style={{
                        padding: '1.5rem',
                        background: 'var(--fw-card)',
                        border: '2px solid var(--fw-border)',
                        borderRadius: '12px',
                        marginBottom: '1.5rem'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--fw-text)' }}>
                                {t('farmguide.weeklyChecklist') || 'Weekly Checklist'}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--fw-sub)' }}>
                                {completedCount} / {totalCount} {t('farmguide.checklistProgress') || 'completed'}
                            </div>
                        </div>
                        <div style={{
                            width: '100%',
                            height: '8px',
                            background: 'var(--fw-bg)',
                            borderRadius: '4px',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                width: `${progressPct}%`,
                                height: '100%',
                                background: progressPct === 100 ? '#10b981' : 'var(--fw-teal)',
                                transition: 'width 0.3s ease'
                            }} />
                        </div>
                    </div>
                    
                    {/* Checklist Items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {items.map((item, idx) => {
                            const priorityColors = {
                                critical: { bg: '#FEE2E2', border: '#DC2626', text: '#991B1B' },
                                high: { bg: '#FEF3C7', border: '#F59E0B', text: '#92400E' },
                                medium: { bg: '#DBEAFE', border: '#3B82F6', text: '#1E40AF' },
                                low: { bg: '#D1FAE5', border: '#10B981', text: '#065F46' }
                            };
                            const colors = priorityColors[item.priority] || priorityColors.medium;
                            
                            return (
                                <ChecklistItem
                                    key={item.id}
                                    id={item.id}
                                    text={typeof item.text === 'object' ? (item.text[language] || item.text.en) : item.text}
                                    priority={item.priority}
                                    checked={checkedItems[item.id] || false}
                                    onToggle={handleChecklistToggle}
                                    colors={colors}
                                />
                            );
                        })}
                    </div>
                </div>
            );
        }
        
        if (module === 'layer_ps') {
            if (!layerPSGuideEntry) return (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--fw-sub)' }}>
                    No data available
                </div>
            );
            const items = layerPSGuideEntry.checklist || [];
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{
                        display: 'inline-block', padding: '4px 14px', borderRadius: '20px',
                        background: psPhase === 'production' ? 'var(--fw-orange)' : 'var(--fw-teal)',
                        color: 'white', fontSize: '13px', fontWeight: '700', marginBottom: '4px'
                    }}>
                        {psPhase === 'production' ? '🥚 Production' : '🐣 Rearing'} · Week {selectedWeek}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--fw-sub)', marginBottom: '4px' }}>
                        {layerPSGuideEntry.phaseRange?.[lang] || layerPSGuideEntry.phaseRange?.en}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--fw-sub)', marginBottom: '4px' }}>
                        ✓ 0 / {items.length} completed
                    </div>
                    {items.map((item, i) => (
                        <div key={i} style={{
                            background: 'white', borderRadius: '10px', padding: '14px 16px',
                            border: '1px solid var(--fw-border)',
                            display: 'flex', alignItems: 'flex-start', gap: '12px',
                        }}>
                            <input type="checkbox" style={{ marginTop: '2px', accentColor: 'var(--fw-teal)' }} />
                            <span style={{ fontSize: '14px' }}>
                                {item?.[lang] || item?.en || '—'}
                            </span>
                        </div>
                    ))}
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

    const renderReferencesTab = () => {
        if (module === 'parent_stock') {
            return (
                <div style={{ maxWidth: '700px', padding: '8px 0' }}>
                    <h3 style={{ marginBottom: '8px' }}>
                        {t('farmguide.aboutStandards') || 'About These Standards'}
                    </h3>
                    <p style={{ color: 'var(--fw-sub)', lineHeight: '1.7', marginBottom: '24px', fontSize: '14px' }}>
                        Performance standards for broiler parent stock (PS) in this app represent{' '}
                        <strong>averaged ranges</strong> derived from multiple PS breed management
                        handbooks. Values are general guidelines for PS rearing and production —
                        not specifications from any specific breed or genetics company.
                    </p>

                    <h4 style={{ marginBottom: '8px' }}>
                        {'Methodology'}
                    </h4>
                    <p style={{ color: 'var(--fw-sub)', lineHeight: '1.7', marginBottom: '24px', fontSize: '14px' }}>
                        Body weight standards are derived by averaging performance data from
                        multiple PS breed handbooks covering both rearing (W1–W24) and
                        production (W25–W64) phases, for both male and female separately.
                        Feed and egg production data follow the same multi-source averaging
                        approach. An acceptable tolerance of ±3% is applied to account for
                        normal on-farm variation.
                    </p>

                    <h4 style={{ marginBottom: '12px' }}>
                        {'References'}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                        {[
                            { title: 'Broiler PS Management Handbook',      year: '2023', type: 'Management Guide' },
                            { title: 'Broiler PS Performance Objectives',   year: '2021', type: 'Performance Data' },
                            { title: 'PS Production Pocket Guide',          year: '2024', type: 'Field Reference'  },
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
                        <strong>⚠ Disclaimer:</strong> Performance data shown in this application
                        is aggregated from multiple industry sources and represents general
                        guidance only. This data is not affiliated with, endorsed by, or sourced
                        directly from any specific breed company or genetics supplier. Actual
                        performance will vary based on genetics, environment, nutrition, health
                        status, and management practices.
                    </div>
                </div>
            );
        }

        if (module === 'layer_ps') {
            return (
                <div style={{ maxWidth: '700px', padding: '8px 0' }}>
                    <h3 style={{ marginBottom: '8px' }}>
                        {t('farmguide.aboutStandards') || 'About These Standards'}
                    </h3>
                    <p style={{ color: 'var(--fw-sub)', lineHeight: '1.7', marginBottom: '24px', fontSize: '14px' }}>
                        Performance standards for layer parent stock (Layer PS) in this app represent{' '}
                        <strong>averaged ranges</strong> derived from multiple layer PS breed management
                        handbooks. Values are general guidelines for Layer PS rearing and production —
                        not specifications from any specific breed or genetics company.
                    </p>

                    <h4 style={{ marginBottom: '8px' }}>{'Methodology'}</h4>
                    <p style={{ color: 'var(--fw-sub)', lineHeight: '1.7', marginBottom: '24px', fontSize: '14px' }}>
                        Body weight standards are derived by averaging performance data from
                        multiple Layer PS breed handbooks covering both rearing (W1–W18) and
                        production (W19–W75) phases, for both male and female separately.
                        Feed and egg production data follow the same multi-source averaging
                        approach. An acceptable tolerance of ±3% is applied to account for
                        normal on-farm variation.
                    </p>

                    <h4 style={{ marginBottom: '12px' }}>{'References'}</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                        {[
                            { title: 'Layer PS Management Handbook',      year: '2023', type: 'Management Guide' },
                            { title: 'Layer PS Performance Objectives',   year: '2022', type: 'Performance Data' },
                            { title: 'Layer Breeder Pocket Guide',        year: '2024', type: 'Field Reference'  },
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
                        <strong>⚠ Disclaimer:</strong> Performance data shown in this application
                        is aggregated from multiple industry sources and represents general
                        guidance only. This data is not affiliated with, endorsed by, or sourced
                        directly from any specific breed company or genetics supplier. Actual
                        performance will vary based on genetics, environment, nutrition, health
                        status, and management practices.
                    </div>
                </div>
            );
        }
        
        const isColorChicken = module === 'color_chicken';
        
        return (
            <div style={{ maxWidth: '700px', padding: '8px 0' }}>
                <h3 style={{ marginBottom: '8px' }}>{t('farmguide.aboutStandards') || 'About These Standards'}</h3>
                <p style={{ color: 'var(--fw-sub)', lineHeight: '1.7', marginBottom: '24px', fontSize: '14px' }}>
                    {isColorChicken ? (
                        <>
                            Performance standards for color chicken in this app represent <strong>averaged ranges</strong> derived
                            from multiple commercial slow-growing breed handbooks. Values are general guidelines — not
                            specifications from any specific breed or company.
                        </>
                    ) : (
                        <>
                            Performance standards in this app represent <strong>averaged ranges</strong> derived
                            from multiple commercial broiler industry handbooks. Values are general guidelines
                            for broiler production — not specifications from any specific breed or company.
                        </>
                    )}
                </p>

                <h4 style={{ marginBottom: '8px' }}>Methodology</h4>
                <p style={{ color: 'var(--fw-sub)', lineHeight: '1.7', marginBottom: '24px', fontSize: '14px' }}>
                    {isColorChicken ? (
                        <>
                            Body weight and feed intake ranges are derived from averaging performance data across
                            Choi and Mia color chicken variants. An acceptable tolerance of ±5% is applied to
                            account for normal on-farm variation.
                        </>
                    ) : (
                        <>
                            Body weight and feed intake ranges are derived by averaging performance data
                            from multiple commercial broiler production standards. An acceptable tolerance
                            of ±3% is applied beyond the natural variation observed across all referenced
                            sources to account for normal on-farm conditions.
                        </>
                    )}
                </p>

                <h4 style={{ marginBottom: '12px' }}>References</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                    {(isColorChicken ? [
                        { title: 'Color Chicken Commercial Management Guide',     year: '2023', type: 'Management Guide'   },
                        { title: 'Slow-Growing Breed Performance Objectives',     year: '2022', type: 'Performance Data'   },
                        { title: 'Color Chicken Production Standard Reference',   year: '2023', type: 'Industry Standard'  },
                    ] : [
                        { title: 'Commercial Broiler Management Guide',           year: '2025', type: 'Management Guide'   },
                        { title: 'Commercial Broiler Performance Objectives',     year: '2022', type: 'Performance Data'   },
                        { title: 'Broiler Production Standard Reference',         year: '2023', type: 'Industry Standard'  },
                        { title: 'Commercial Poultry Management Handbook',        year: '2022', type: 'Management Guide'   },
                    ]).map((ref, i) => (
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
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'environment':
                return renderEnvironmentTab();
            case 'feed':
                return renderFeedTab();
            case 'bw':
                return renderBWTab();
            case 'eggProduction':
                return renderEggProductionTab();
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
        <div className="fw-module-page">
            <div className="fw-mod-top">
                <div
                    className="fw-mod-top-logo"
                    onClick={() => navigate('/')}
                    title="Back to Home"
                >
                    <img src="/images/FarmWell_Logo.png" alt="FarmWell" style={{ width: 34, height: 34, objectFit: 'contain' }} />
                </div>
                <div className="fw-mod-top-lang">
                    {languages.map(lang => (
                        <button
                            key={lang.code}
                            className={`fw-mod-top-lang-btn${langContext === lang.code ? ' active' : ''}`}
                            onClick={() => setLanguage(lang.code)}
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>
            </div>
            <div className="fw-mod-card" style={{ background: '#E8F5EE' }}>
                <div className="fw-mod-content">
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

                {/* ─── Week Selector with Phase Toggle (Layer) ─── */}
                {mainTab === 'guide' && module === 'layer' && activeTab !== 'references' && (
                    <WeekDaySelector
                        mode="phase"
                        totalWeeks={80}
                        rearingEndWeek={18}
                        selectedWeek={selectedWeek}
                        selectedPhase={selectedWeek <= 18 ? 'rearing' : 'production'}
                        onWeekChange={(w) => setSelectedWeek(Number(w))}
                        onPhaseChange={(phase) => {
                            // Switch to first week of selected phase
                            setSelectedWeek(phase === 'rearing' ? 1 : 19);
                        }}
                    />
                )}

                {/* ─── Variant + Sex Toggle + Week Selector (Color Chicken) ─── */}
                {mainTab === 'guide' && module === 'color_chicken' && activeTab !== 'references' && (
                    <>
                        {/* Row 1: Variant + Sex toggles */}
                        <div style={{
                            display: 'flex',
                            gap: '12px',
                            alignItems: 'center',
                            marginBottom: '8px'
                        }}>
                            {/* Variant toggle */}
                            <div style={{
                                display: 'flex',
                                border: '1px solid #0C3830',
                                borderRadius: '20px',
                                overflow: 'hidden'
                            }}>
                                <button
                                    onClick={() => handleVariantChange('choi')}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        color: colorVariant === 'choi' ? 'white' : '#0C3830',
                                        background: colorVariant === 'choi' ? '#0C3830' : 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        fontFamily: 'inherit'
                                    }}
                                >
                                    {t('farmguide.choiVariant') || 'Choi'}
                                </button>
                                <button
                                    onClick={() => handleVariantChange('mia')}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        color: colorVariant === 'mia' ? 'white' : '#0C3830',
                                        background: colorVariant === 'mia' ? '#0C3830' : 'transparent',
                                        border: 'none',
                                        borderLeft: '1px solid #0C3830',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        fontFamily: 'inherit'
                                    }}
                                >
                                    {t('farmguide.miaVariant') || 'Mia'}
                                </button>
                            </div>

                            {/* Sex toggle */}
                            <div style={{
                                display: 'flex',
                                border: '1px solid #0C3830',
                                borderRadius: '20px',
                                overflow: 'hidden'
                            }}>
                                <button
                                    onClick={() => handleSexChange('male')}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        color: colorSex === 'male' ? 'white' : '#0C3830',
                                        background: colorSex === 'male' ? '#0C3830' : 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        fontFamily: 'inherit'
                                    }}
                                >
                                    ♂ {t('farmguide.male') || 'Male'}
                                </button>
                                <button
                                    onClick={() => handleSexChange('female')}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        color: colorSex === 'female' ? 'white' : '#0C3830',
                                        background: colorSex === 'female' ? '#0C3830' : 'transparent',
                                        border: 'none',
                                        borderLeft: '1px solid #0C3830',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        fontFamily: 'inherit'
                                    }}
                                >
                                    ♀ {t('farmguide.female') || 'Female'}
                                </button>
                            </div>
                        </div>

                        {/* Row 2: WeekDaySelector */}
                        <WeekDaySelector
                            mode="weekday"
                            totalWeeks={18}
                            selectedWeek={selectedWeek}
                            selectedDay={selectedDay}
                            showDailyToggle={activeTab !== 'checklist'}
                            selectedMode={viewMode}
                            onWeekChange={(w) => setSelectedWeek(Number(w))}
                            onDayChange={(d) => setSelectedDay(Number(d))}
                            onModeChange={(m) => setViewMode(m)}
                        />
                    </>
                )}

                {/* ─── Sex Toggle + Week Selector (Parent Stock / Layer PS) ─── */}
                {mainTab === 'guide' && (module === 'parent_stock' || module === 'layer_ps' || module === 'color_ps') && activeTab !== 'references' && (
                    <>
                        {(module === 'parent_stock' || module === 'layer_ps') && (
                        <>
                        {/* Row 1: Sex toggle */}
                        <div style={{
                            display: 'flex',
                            gap: '12px',
                            alignItems: 'center',
                            marginBottom: '8px'
                        }}>
                            <div style={{
                                display: 'flex',
                                border: '1px solid #0C3830',
                                borderRadius: '20px',
                                overflow: 'hidden'
                            }}>
                                <button
                                    onClick={() => handlePSSexChange('female')}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        color: psSex === 'female' ? 'white' : '#0C3830',
                                        background: psSex === 'female' ? '#0C3830' : 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        fontFamily: 'inherit'
                                    }}
                                >
                                    ♀ {t('farmguide.female') || 'Female'}
                                </button>
                                <button
                                    onClick={() => handlePSSexChange('male')}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        color: psSex === 'male' ? 'white' : '#0C3830',
                                        background: psSex === 'male' ? '#0C3830' : 'transparent',
                                        border: 'none',
                                        borderLeft: '1px solid #0C3830',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        fontFamily: 'inherit'
                                    }}
                                >
                                    ♂ {t('farmguide.male') || 'Male'}
                                </button>
                            </div>
                        </div>
                        </>
                        )}

                        {/* Row 2: WeekDaySelector with phase toggle */}
                        {!(module === 'layer_ps' && psSex === 'male') && (
                            <WeekDaySelector
                                mode="phase"
                                totalWeeks={module === 'layer_ps' ? 75 : module === 'color_ps' ? 70 : 64}
                                rearingEndWeek={module === 'layer_ps' ? 18 : module === 'color_ps' ? 24 : 24}
                                selectedWeek={selectedWeek}
                                selectedPhase={psPhase}
                                onWeekChange={(w) => setSelectedWeek(Number(w))}
                                onPhaseChange={handlePSPhaseChange}
                            />
                        )}
                    </>
                )}

                {/* ─── Weekly/Daily Toggle (only for non-Broiler/non-Layer/non-ColorChicken/non-PS/non-LayerPS modules) ─── */}
                {mainTab === 'guide' && module !== 'broiler' && module !== 'layer' && module !== 'color_chicken' && module !== 'parent_stock' && module !== 'layer_ps' && module !== 'color_ps' && (
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

                {/* ─── Period Selector (only for non-Broiler/non-Layer/non-ColorChicken/non-PS/non-LayerPS modules) ─── */}
                {mainTab === 'guide' && module !== 'broiler' && module !== 'layer' && module !== 'color_chicken' && module !== 'parent_stock' && module !== 'layer_ps' && module !== 'color_ps' && (
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

                {/* ─── Phase Pill, Title, Tags + Alert (only for Environment tab in Color Chicken) ─── */}
                {mainTab === 'guide' && module === 'color_chicken' && activeTab === 'environment' && COLOR_CHICKEN_GUIDE[selectedWeek - 1] && (
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

                {/* Bottom Nav */}
                <div className="fw-mod-bnav">
                    <button
                        className="fw-mod-bnav-home"
                        onClick={() => navigate('/')}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18}}>
                            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                            <polyline points="9 22 9 12 15 12 15 22"/>
                        </svg>
                        <span>Home</span>
                    </button>
                    <button
                        className="fw-mod-bnav-alerts"
                        onClick={() => navigate('/farmguide')}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18}}>
                            <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                        </svg>
                        <span>FarmGuide</span>
                    </button>
                </div>
                </div>
            </div>
        </div>
    );
}

export default ManagementGuide;
