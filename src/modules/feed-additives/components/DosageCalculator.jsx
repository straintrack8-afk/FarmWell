import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { feedAdditivesTranslations } from '../translations';
import * as XLSX from 'xlsx';

const DosageCalculator = () => {
    const { language } = useLanguage();
    const t = (key) => feedAdditivesTranslations[language]?.[key] || feedAdditivesTranslations['en'][key];
    const [currentStep, setCurrentStep] = useState(1);
    const [showCustomProtocol, setShowCustomProtocol] = useState(false);
    const [showDailyDetails, setShowDailyDetails] = useState(false);
    const [showReferenceView, setShowReferenceView] = useState(false);

    // Export Reference Data to Excel
    const exportReferenceToExcel = () => {
        if (!consumptionData || !referenceSelection.specificCategory) return;

        const wb = XLSX.utils.book_new();
        let data = [];
        let sheetName = '';

        const { animalType, productionCategory, specificCategory } = referenceSelection;

        if (animalType === 'poultry') {
            if (productionCategory === 'commercial') {
                if (specificCategory === 'broiler') {
                    const broilerData = consumptionData.poultry_commercial.broiler.daily_data;
                    data = broilerData.map(d => ({
                        'Day': d.day,
                        'Body Weight (g)': d.bw_g,
                        'Daily Gain (g)': d.gain_g,
                        'Feed (g/day)': d.feed_g,
                        'Cumulative Feed (g)': d.cum_feed_g,
                        'FCR': d.fcr,
                        'Water (ml/day)': d.water_ml
                    }));
                    sheetName = 'Broiler Daily Data';
                } else if (specificCategory === 'layer') {
                    const rearingData = consumptionData.poultry_commercial.layer.rearing_weeks_1_18.map(d => ({
                        'Week': d.week,
                        'Phase': 'Rearing',
                        'BW Min (g)': d.bw_g_min,
                        'BW Max (g)': d.bw_g_max,
                        'Feed Min (g/day)': d.feed_g_min,
                        'Feed Max (g/day)': d.feed_g_max,
                        'Water Min (ml/day)': d.water_ml_min,
                        'Water Max (ml/day)': d.water_ml_max
                    }));
                    const productionData = consumptionData.poultry_commercial.layer.production_weeks_18_100.map(d => ({
                        'Week': d.week,
                        'Phase': 'Production',
                        'Production (%)': d.prod_pct,
                        'Egg Weight (g)': d.egg_wt_g,
                        'Feed (g/day)': d.feed_g,
                        'Water (ml/day)': d.water_ml,
                        'Body Weight (g)': d.bw_g
                    }));
                    data = [...rearingData, ...productionData];
                    sheetName = 'Layer Complete Data';
                }
            } else if (productionCategory === 'breeding') {
                if (specificCategory === 'broiler_breeder') {
                    const breederData = consumptionData.poultry_breeding.broiler_breeder.female_complete_weeks_0_64;
                    data = breederData.map(d => ({
                        'Week': d.week,
                        'Days': d.days,
                        'Body Weight (g)': d.bw_g,
                        'Weekly Gain (g)': d.gain_g,
                        'Feed (g/day)': d.feed_g,
                        'Water (ml/day)': (d.feed_g * 1.8).toFixed(0),
                        'Cumulative Feed (kg)': d.cum_feed_kg,
                        'Energy (kcal/day)': d.energy_kcal,
                        'Note': d.note || ''
                    }));
                    sheetName = 'Broiler Breeder Female';
                } else if (specificCategory === 'color_breeder') {
                    const rearingData = consumptionData.poultry_breeding.color_breeder.female_pullet_rearing_weeks_0_24.map(d => ({
                        'Week': d.week,
                        'Phase': 'Rearing',
                        'Body Weight (g)': d.bw_g,
                        'Feed (g/day)': d.feed_g,
                        'Water (ml/day)': (d.feed_g * 2.0).toFixed(0),
                        'ME (kcal/day)': d.me_kcal
                    }));
                    const productionData = consumptionData.poultry_breeding.color_breeder.female_production_20C_weeks_24_70.map(d => ({
                        'Week': d.week,
                        'Phase': 'Production',
                        'Production (%)': d.prod_pct,
                        'Feed (g/day)': d.feed_g,
                        'Water (ml/day)': (d.feed_g * 2.0).toFixed(0),
                        'ME (kcal/day)': d.me_kcal
                    }));
                    data = [...rearingData, ...productionData];
                    sheetName = 'Color Breeder Female';
                } else if (specificCategory === 'layer_breeder') {
                    const rearingData = consumptionData.poultry_commercial.layer.rearing_weeks_1_18.map(d => ({
                        'Week': d.week,
                        'Phase': 'Rearing',
                        'Feed Avg (g/day)': ((d.feed_g_min + d.feed_g_max) / 2).toFixed(1),
                        'Water Avg (ml/day)': ((d.water_ml_min + d.water_ml_max) / 2).toFixed(1),
                        'BW Avg (g)': ((d.bw_g_min + d.bw_g_max) / 2).toFixed(0)
                    }));
                    data = rearingData;
                    sheetName = 'Layer Breeder';
                }
            }
        } else if (animalType === 'swine') {
            if (productionCategory === 'commercial') {
                const swineData = consumptionData.swine_commercial[specificCategory].data_by_weight;
                data = swineData.map(d => ({
                    'Weight (kg)': d.weight_kg,
                    'Water (L/day)': d.water_L,
                    'Feed (kg/day)': d.feed_kg
                }));
                sheetName = specificCategory.charAt(0).toUpperCase() + specificCategory.slice(1);
            }
        }

        if (data.length === 0) {
            alert('No data available for export');
            return;
        }

        const ws = XLSX.utils.json_to_sheet(data);
        const colWidths = Object.keys(data[0]).map(key => ({
            wch: Math.max(key.length, ...data.map(row => String(row[key] || '').length)) + 2
        }));
        ws['!cols'] = colWidths;

        XLSX.utils.book_append_sheet(wb, ws, sheetName);
        const fileName = `FarmWell_${sheetName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, fileName);
    };

    // Print Reference Data
    const printReferenceData = () => {
        window.print();
    };

    // Add print styles
    React.useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            @media print {
                /* Hide everything except results */
                body * {
                    visibility: hidden;
                }
                
                /* Show only the print content */
                .print-content, .print-content * {
                    visibility: visible;
                }
                
                .print-content {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                }
                
                /* Hide navigation, buttons, and non-essential elements */
                .no-print,
                button,
                .step-indicator,
                nav,
                header,
                .navigation-buttons {
                    display: none !important;
                }
                
                /* Print header */
                .print-header {
                    display: flex !important;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 2rem;
                    padding-bottom: 1rem;
                    border-bottom: 3px solid #667eea;
                }
                
                .print-header img {
                    width: 60px;
                    height: 60px;
                }
                
                .print-header h1 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #1f2937;
                    margin: 0;
                }
                
                .print-header p {
                    font-size: 0.875rem;
                    color: #6b7280;
                    margin: 0;
                }
                
                /* Page setup */
                @page {
                    size: A4;
                    margin: 1.5cm;
                }
                
                /* Ensure content fits */
                .print-content {
                    max-width: 100%;
                    font-size: 10pt;
                }
                
                /* Table styling for print */
                table {
                    page-break-inside: auto;
                    border-collapse: collapse;
                    width: 100%;
                }
                
                tr {
                    page-break-inside: avoid;
                    page-break-after: auto;
                }
                
                thead {
                    display: table-header-group;
                }
                
                /* Avoid breaking these elements */
                .period-breakdown,
                .total-investment,
                .expected-benefits {
                    page-break-inside: avoid;
                }
                
                /* Remove backgrounds and use borders for print */
                * {
                    background: white !important;
                    color: black !important;
                }
                
                .calculation-summary {
                    border: 2px solid #333 !important;
                    padding: 1rem !important;
                    margin-bottom: 1rem !important;
                }
                
                .total-investment {
                    border: 3px solid #333 !important;
                    padding: 1rem !important;
                    margin: 1rem 0 !important;
                }
                
                /* Print-specific spacing */
                h2, h3, h4 {
                    margin-top: 1rem;
                    margin-bottom: 0.5rem;
                    color: #000 !important;
                }
                
                /* Daily details table */
                .daily-details-table {
                    font-size: 8pt;
                    margin-top: 0.5rem;
                }
                
                .daily-details-table th {
                    background: #f3f4f6 !important;
                    border: 1px solid #000 !important;
                    padding: 0.25rem !important;
                    font-weight: 700;
                }
                
                .daily-details-table td {
                    border: 1px solid #ccc !important;
                    padding: 0.25rem !important;
                }
            }
            
            /* Hide print header on screen */
            .print-header {
                display: none;
            }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);
    const [referenceSelection, setReferenceSelection] = useState({
        animalType: '',
        productionCategory: '',
        specificCategory: ''
    });
    const [inquiryData, setInquiryData] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [calculationData, setCalculationData] = useState({
        // Step 1: Animal Selection
        animalType: '', // 'swine' or 'poultry'
        productionCategory: '', // 'breeding' or 'commercial'
        specificCategory: '', // e.g., 'broiler', 'nursery', etc.

        // Step 2: Flock/Herd Info
        population: '',
        age: '',
        ageUnit: 'days', // 'days' or 'weeks'
        gender: 'mixed', // 'female', 'male', 'mixed'
        femaleRatio: 10,
        maleRatio: 1,

        // Step 3: Product Selection
        selectedProduct: null,
        productPrice: 3640000, // Default price per kg in VND

        // Step 4: Protocol
        protocolPeriods: [
            { startDay: 1, endDay: 5 }
        ],

        // Results
        results: null
    });

    const [consumptionData, setConsumptionData] = useState(null);
    const [productsData, setProductsData] = useState(null);

    // Load databases
    useEffect(() => {
        fetch('/data/feed-additives/consumption-database.json')
            .then(res => res.json())
            .then(data => setConsumptionData(data))
            .catch(err => console.error('Failed to load consumption data:', err));

        fetch('/data/feed-additives/products-database.json')
            .then(res => res.json())
            .then(data => setProductsData(data))
            .catch(err => console.error('Failed to load products data:', err));
    }, []);

    // Animal categories configuration
    const animalCategories = {
        swine: {
            breeding: [
                { id: 'sow_gestation', label: 'Sow - Gestation', icon: '🐷' },
                { id: 'sow_lactation', label: 'Sow - Lactation', icon: '🐷' },
                { id: 'boar', label: 'Boar', icon: '🐗' }
            ],
            commercial: [
                { id: 'nursery', label: 'Nursery/Weaner (5-27 kg)', icon: '🐖' },
                { id: 'grower', label: 'Grower (27-60 kg)', icon: '🐖' },
                { id: 'finisher', label: 'Finisher (60-120 kg)', icon: '🐖' }
            ]
        },
        poultry: {
            breeding: [
                { id: 'broiler_breeder', label: 'Broiler Breeder', icon: '🐔' },
                { id: 'layer_breeder', label: 'Layer Breeder', icon: '🐔' },
                { id: 'color_breeder', label: 'Color Breeder', icon: '🐓' }
            ],
            commercial: [
                { id: 'broiler', label: 'Broiler', icon: '🐔' },
                { id: 'layer', label: 'Layer (Commercial)', icon: '🐔' },
                { id: 'color_chicken', label: 'Color/Kampung Chicken', icon: '🐓' }
            ]
        }
    };

    const updateData = (field, value) => {
        setCalculationData(prev => ({ ...prev, [field]: value }));
    };

    // Helper function for linear interpolation
    const interpolateLayerData = (ageInWeeks, layerData, adjustmentFactor = 1.0) => {
        if (!layerData || layerData.length === 0) {
            return { waterL: 0.2 * adjustmentFactor, feedKg: 0.1 * adjustmentFactor };
        }

        // Find exact week data
        let weekData = layerData.find(d => d.week === ageInWeeks);

        if (weekData) {
            return {
                waterL: (weekData.water_ml * adjustmentFactor) / 1000,
                feedKg: (weekData.feed_g * adjustmentFactor) / 1000
            };
        }

        // Interpolate between two closest weeks
        if (ageInWeeks < layerData[0].week) {
            weekData = layerData[0];
            return {
                waterL: (weekData.water_ml * adjustmentFactor) / 1000,
                feedKg: (weekData.feed_g * adjustmentFactor) / 1000
            };
        }

        if (ageInWeeks > layerData[layerData.length - 1].week) {
            weekData = layerData[layerData.length - 1];
            return {
                waterL: (weekData.water_ml * adjustmentFactor) / 1000,
                feedKg: (weekData.feed_g * adjustmentFactor) / 1000
            };
        }

        // Find two surrounding weeks for interpolation
        let lowerWeek = null;
        let upperWeek = null;

        for (let i = 0; i < layerData.length - 1; i++) {
            if (layerData[i].week <= ageInWeeks && layerData[i + 1].week >= ageInWeeks) {
                lowerWeek = layerData[i];
                upperWeek = layerData[i + 1];
                break;
            }
        }

        if (lowerWeek && upperWeek) {
            const ratio = (ageInWeeks - lowerWeek.week) / (upperWeek.week - lowerWeek.week);
            const waterMl = lowerWeek.water_ml + (upperWeek.water_ml - lowerWeek.water_ml) * ratio;
            const feedG = lowerWeek.feed_g + (upperWeek.feed_g - lowerWeek.feed_g) * ratio;
            return {
                waterL: (waterMl * adjustmentFactor) / 1000,
                feedKg: (feedG * adjustmentFactor) / 1000
            };
        }

        // Fallback to closest week
        weekData = layerData.reduce((prev, curr) =>
            Math.abs(curr.week - ageInWeeks) < Math.abs(prev.week - ageInWeeks) ? curr : prev
        );
        return {
            waterL: (weekData.water_ml * adjustmentFactor) / 1000,
            feedKg: (weekData.feed_g * adjustmentFactor) / 1000
        };
    };

    const useTemplate = (templateType) => {
        let periods = [];
        if (templateType === 'standard') {
            periods = [
                { startDay: 1, endDay: 5 },
                { startDay: 25, endDay: 29 }
            ];
        } else if (templateType === 'intensive') {
            periods = [
                { startDay: 1, endDay: 7 }
            ];
        }
        setCalculationData(prev => ({ ...prev, protocolPeriods: periods }));
        setShowCustomProtocol(false);
    };

    const nextStep = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const resetCalculation = () => {
        setCurrentStep(1);
        setShowCustomProtocol(false);
        setShowDailyDetails(false);
        setShowReferenceView(false);
        setInquiryData({ name: '', email: '', phone: '' });
        setCalculationData({
            animalType: '',
            productionCategory: '',
            specificCategory: '',
            population: '',
            age: '',
            ageUnit: 'days',
            gender: 'mixed',
            femaleRatio: 10,
            maleRatio: 1,
            selectedProduct: null,
            productPrice: 3640000,
            protocolPeriods: [{ startDay: 1, endDay: 5 }],
            results: null
        });
    };

    const exportToExcel = () => {
        if (!calculationData.results) return;

        // Create CSV content
        let csvContent = "Feed Additives Dosage Calculation Report\n\n";

        // Summary Information
        csvContent += "SUMMARY INFORMATION\n";
        csvContent += `Product,${calculationData.selectedProduct.name}\n`;
        csvContent += `Animal Type,${calculationData.specificCategory}\n`;
        csvContent += `Population,${calculationData.population}\n`;
        csvContent += `Current Age,${calculationData.age} ${calculationData.ageUnit}\n`;
        csvContent += `Total Treatment Days,${calculationData.results.totalDays}\n`;
        csvContent += `Number of Periods,${calculationData.protocolPeriods.length}\n\n`;

        // Period Details
        csvContent += "PERIOD BREAKDOWN\n";
        csvContent += "Period,Start Day,End Day,Days,Total Water (L),Total Feed (kg),Product Needed (g),Cost (VND)\n";
        calculationData.results.periods.forEach((period, index) => {
            csvContent += `${index + 1},${period.startDay},${period.endDay},${period.days},${period.totalWaterL},${period.totalFeedKg},${period.productNeeded},${period.cost}\n`;
        });

        // Total Investment
        csvContent += "\nTOTAL INVESTMENT\n";
        csvContent += `Total Product (kg),${(calculationData.results.totalProductGrams / 1000).toFixed(2)}\n`;
        csvContent += `Total Cost (VND),${calculationData.results.totalCost}\n`;
        csvContent += `Cost per Animal (VND),${Math.round(calculationData.results.costPerAnimal)}\n\n`;

        // Inquiry Information (if filled)
        if (inquiryData.name || inquiryData.email || inquiryData.phone) {
            csvContent += "INQUIRY INFORMATION\n";
            csvContent += `Name,${inquiryData.name}\n`;
            csvContent += `Email,${inquiryData.email}\n`;
            csvContent += `Phone,${inquiryData.phone}\n`;
        }

        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `Feed_Additives_Calculation_${Date.now()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const printPDF = () => {
        // Auto-expand daily details for print
        const wasShowingDetails = showDailyDetails;
        if (!showDailyDetails) {
            setShowDailyDetails(true);
        }

        // Wait for state update, then print
        setTimeout(() => {
            window.print();

            // Restore original state after print dialog closes
            if (!wasShowingDetails) {
                setTimeout(() => setShowDailyDetails(false), 100);
            }
        }, 100);
    };

    const calculateResults = () => {
        if (!consumptionData || !calculationData.selectedProduct) return;

        const results = {
            periods: [],
            totalProductGrams: 0,
            totalCost: 0,
            costPerAnimal: 0,
            totalDays: 0
        };

        // Calculate for each period
        calculationData.protocolPeriods.forEach(period => {
            const periodResult = calculatePeriod(period);
            results.periods.push(periodResult);
            results.totalProductGrams += parseFloat(periodResult.productNeeded);
            results.totalCost += parseInt(periodResult.cost);
        });

        results.totalDays = calculationData.protocolPeriods.reduce(
            (sum, p) => sum + (p.endDay - p.startDay + 1), 0
        );
        results.costPerAnimal = results.totalCost / parseInt(calculationData.population);

        setCalculationData(prev => ({ ...prev, results }));
    };

    const calculatePeriod = (period) => {
        const { startDay, endDay } = period;
        const days = endDay - startDay + 1;
        const population = parseInt(calculationData.population);

        let totalWaterL = 0;
        let totalFeedKg = 0;
        const dailyBreakdown = [];

        // Calculate consumption for each day
        for (let day = startDay; day <= endDay; day++) {
            const consumption = getDailyConsumption(day);
            const dayWaterL = consumption.waterL * population;
            const dayFeedKg = consumption.feedKg * population;

            totalWaterL += dayWaterL;
            totalFeedKg += dayFeedKg;

            // Calculate product and cost for this day
            const product = calculationData.selectedProduct;
            let dayProductNeeded = 0;

            if (product.application.method === 'feed') {
                const dayFeedTons = dayFeedKg / 1000;
                dayProductNeeded = dayFeedTons * product.application.dosage.amount;
            } else if (product.application.method === 'water') {
                const dosagePerUnit = product.application.dosage.per || 1000;
                dayProductNeeded = (dayWaterL / dosagePerUnit) * product.application.dosage.amount;
            }

            const dayCost = (dayProductNeeded / 1000) * parseFloat(calculationData.productPrice);

            // Convert age to days
            let ageInDays = calculationData.ageUnit === 'weeks' ? parseInt(calculationData.age) * 7 : parseInt(calculationData.age);
            ageInDays += (day - 1);

            dailyBreakdown.push({
                day,
                ageInDays,
                waterPerAnimal: consumption.waterL * 1000, // Convert to ml
                totalWaterL: dayWaterL.toFixed(3),
                feedPerAnimal: consumption.feedKg * 1000, // Convert to g
                totalFeedKg: dayFeedKg.toFixed(3),
                productNeeded: dayProductNeeded.toFixed(1),
                cost: Math.round(dayCost)
            });
        }

        // Calculate total product needed
        const product = calculationData.selectedProduct;
        let productNeeded = 0;

        if (product.application.method === 'feed') {
            const totalFeedTons = totalFeedKg / 1000;
            productNeeded = totalFeedTons * product.application.dosage.amount;
        } else if (product.application.method === 'water') {
            const dosagePerUnit = product.application.dosage.per || 1000;
            productNeeded = (totalWaterL / dosagePerUnit) * product.application.dosage.amount;
        }

        const cost = (productNeeded / 1000) * parseFloat(calculationData.productPrice);

        return {
            startDay,
            endDay,
            days,
            totalWaterL: totalWaterL.toFixed(1),
            totalFeedKg: totalFeedKg.toFixed(1),
            productNeeded: productNeeded.toFixed(1),
            cost: Math.round(cost),
            dailyBreakdown
        };
    };

    const getDailyConsumption = (dayNumber) => {
        const { specificCategory, age, ageUnit } = calculationData;

        console.log('=== getDailyConsumption START ===');
        console.log('Input:', { dayNumber, specificCategory, age, ageUnit });
        console.log('consumptionData loaded?', !!consumptionData);

        if (!consumptionData) {
            console.error('❌ Consumption data not loaded yet');
            return { waterL: 0, feedKg: 0 };
        }

        // Convert age to days with validation
        let ageInDays = ageUnit === 'weeks' ? (parseInt(age) || 0) * 7 : (parseInt(age) || 0);
        ageInDays += (dayNumber - 1); // Add protocol day offset

        let waterL = 0;
        let feedKg = 0;

        console.log('Calculated ageInDays:', ageInDays);

        // Broiler calculation (use daily data from comprehensive database)
        if (specificCategory === 'broiler') {
            const broilerData = consumptionData?.poultry_commercial?.broiler?.daily_data;
            if (broilerData && Array.isArray(broilerData)) {
                // Find exact day or use closest day
                const dayData = broilerData.find(d => d.day === ageInDays) ||
                    broilerData[Math.min(ageInDays, broilerData.length - 1)];
                if (dayData) {
                    waterL = (dayData.water_ml || 0) / 1000;
                    feedKg = (dayData.feed_g || 0) / 1000;
                }
            }
            console.log('Broiler calculation:', { ageInDays, waterL, feedKg });
        }
        // Layer calculation (use comprehensive database v2.1)
        else if (specificCategory === 'layer') {
            const ageInWeeks = Math.floor(ageInDays / 7);
            const layerCommercial = consumptionData?.poultry_commercial?.layer;

            if (layerCommercial) {
                if (ageInWeeks <= 18) {
                    // Rearing phase - use rearing_weeks_1_18
                    const rearingData = layerCommercial.rearing_weeks_1_18 || [];
                    const weekData = rearingData.find(d => d.week === ageInWeeks);
                    if (weekData) {
                        // Use average of min and max
                        const avgWater = (weekData.water_ml_min + weekData.water_ml_max) / 2;
                        const avgFeed = (weekData.feed_g_min + weekData.feed_g_max) / 2;
                        waterL = avgWater / 1000;
                        feedKg = avgFeed / 1000;
                    } else {
                        // Interpolate between available weeks
                        const sortedData = rearingData.sort((a, b) => a.week - b.week);
                        for (let i = 0; i < sortedData.length - 1; i++) {
                            if (ageInWeeks > sortedData[i].week && ageInWeeks < sortedData[i + 1].week) {
                                const w1 = sortedData[i];
                                const w2 = sortedData[i + 1];
                                const ratio = (ageInWeeks - w1.week) / (w2.week - w1.week);
                                const avgWater1 = (w1.water_ml_min + w1.water_ml_max) / 2;
                                const avgWater2 = (w2.water_ml_min + w2.water_ml_max) / 2;
                                const avgFeed1 = (w1.feed_g_min + w1.feed_g_max) / 2;
                                const avgFeed2 = (w2.feed_g_min + w2.feed_g_max) / 2;
                                waterL = (avgWater1 + ratio * (avgWater2 - avgWater1)) / 1000;
                                feedKg = (avgFeed1 + ratio * (avgFeed2 - avgFeed1)) / 1000;
                                break;
                            }
                        }
                    }
                } else {
                    // Production phase - use production_weeks_18_100
                    const productionData = layerCommercial.production_weeks_18_100 || [];
                    const weekData = productionData.find(d => d.week === ageInWeeks);
                    if (weekData) {
                        waterL = (weekData.water_ml || 0) / 1000;
                        feedKg = (weekData.feed_g || 0) / 1000;
                    } else {
                        // Use closest available data
                        const closestData = productionData.reduce((prev, curr) =>
                            Math.abs(curr.week - ageInWeeks) < Math.abs(prev.week - ageInWeeks) ? curr : prev
                        );
                        if (closestData) {
                            waterL = (closestData.water_ml || 0) / 1000;
                            feedKg = (closestData.feed_g || 0) / 1000;
                        }
                    }
                }
            }
            console.log('Layer calculation:', { ageInWeeks, ageInDays, waterL, feedKg });
        }
        // Swine calculation (weight-based approximation)
        else if (['nursery', 'grower', 'finisher'].includes(specificCategory)) {
            const swineData = consumptionData?.swine_commercial?.[specificCategory]?.data_by_weight || [];
            if (swineData.length > 0) {
                const midPoint = swineData[Math.floor(swineData.length / 2)];
                waterL = midPoint.water_L || 0;
                feedKg = midPoint.feed_kg || 0;
            }
            console.log('Swine calculation:', { swineData: swineData.length, waterL, feedKg });
        }
        // Layer Breeder - use layer rearing data, then fixed production values
        else if (specificCategory === 'layer_breeder') {
            const ageInWeeks = Math.floor(ageInDays / 7);

            if (ageInWeeks < 20) {
                // Before 20 weeks: use layer rearing data
                const layerCommercial = consumptionData?.poultry_commercial?.layer;
                const rearingData = layerCommercial?.rearing_weeks_1_18 || [];
                const weekData = rearingData.find(d => d.week === ageInWeeks);
                if (weekData) {
                    const avgWater = (weekData.water_ml_min + weekData.water_ml_max) / 2;
                    const avgFeed = (weekData.feed_g_min + weekData.feed_g_max) / 2;
                    waterL = avgWater / 1000;
                    feedKg = avgFeed / 1000;
                }
            } else {
                // After 20 weeks: breeder production phase (fixed values)
                waterL = 0.28; // 280ml per bird
                feedKg = 0.16; // 160g per bird
            }

            console.log('Layer breeder calculation:', { ageInWeeks, ageInDays, waterL, feedKg });
        }
        // Color Chicken (Commercial) - slower growth than broiler
        else if (specificCategory === 'color_chicken') {
            // Color/Kampung chicken grows slower, use modified formula
            // Approximately 70% of broiler consumption
            const waterMl = 5.28 * ageInDays * 0.7;
            waterL = waterMl / 1000;
            feedKg = (waterMl / 1.77) / 1000;
            console.log('Color chicken calculation:', { ageInDays, waterMl, waterL, feedKg });
        }
        // Color Breeder - use comprehensive weekly data with temperature selection
        else if (specificCategory === 'color_breeder') {
            const ageInWeeks = Math.floor(ageInDays / 7);
            const colorBreederData = consumptionData?.poultry_breeding?.color_breeder;

            if (ageInWeeks <= 24) {
                // Rearing phase: use female_pullet_rearing_weeks_0_24
                const rearingData = colorBreederData?.female_pullet_rearing_weeks_0_24 || [];
                const weekData = rearingData.find(d => d.week === ageInWeeks);
                if (weekData) {
                    feedKg = (weekData.feed_g || 0) / 1000;
                    waterL = feedKg * 2.0; // Using water:feed ratio of 2.0 for color breeder
                } else {
                    // Interpolate between available weeks
                    const sortedData = rearingData.sort((a, b) => a.week - b.week);
                    for (let i = 0; i < sortedData.length - 1; i++) {
                        if (ageInWeeks > sortedData[i].week && ageInWeeks < sortedData[i + 1].week) {
                            const w1 = sortedData[i];
                            const w2 = sortedData[i + 1];
                            const ratio = (ageInWeeks - w1.week) / (w2.week - w1.week);
                            const feedG = w1.feed_g + ratio * (w2.feed_g - w1.feed_g);
                            feedKg = feedG / 1000;
                            waterL = feedKg * 2.0;
                            break;
                        }
                    }
                }
            } else {
                // Production phase: use female_production_20C_weeks_24_70 (default to 20C)
                const productionData = colorBreederData?.female_production_20C_weeks_24_70 || [];
                const weekData = productionData.find(d => d.week === ageInWeeks);
                if (weekData) {
                    feedKg = (weekData.feed_g || 0) / 1000;
                    waterL = feedKg * 2.0;
                } else {
                    // Use closest available data
                    const closestData = productionData.reduce((prev, curr) =>
                        Math.abs(curr.week - ageInWeeks) < Math.abs(prev.week - ageInWeeks) ? curr : prev
                    );
                    if (closestData) {
                        feedKg = (closestData.feed_g || 0) / 1000;
                        waterL = feedKg * 2.0;
                    }
                }
            }

            console.log('Color breeder calculation:', { ageInWeeks, ageInDays, waterL, feedKg });
        }
        // Broiler Breeder - use complete weekly data (v2.2)
        else if (specificCategory === 'broiler_breeder') {
            const ageInWeeks = Math.floor(ageInDays / 7);
            const broilerBreederData = consumptionData?.poultry_breeding?.broiler_breeder;

            // Use single complete table for weeks 0-64
            const completeData = broilerBreederData?.female_complete_weeks_0_64 || [];
            const weekData = completeData.find(d => d.week === ageInWeeks);
            if (weekData) {
                feedKg = (weekData.feed_g || 0) / 1000;
                waterL = feedKg * 1.8; // Using water:feed ratio of 1.8
            } else {
                // Use closest available data if exact week not found
                const closestData = completeData.reduce((prev, curr) =>
                    Math.abs(curr.week - ageInWeeks) < Math.abs(prev.week - ageInWeeks) ? curr : prev
                );
                if (closestData) {
                    feedKg = (closestData.feed_g || 0) / 1000;
                    waterL = feedKg * 1.8;
                }
            }

            console.log('Broiler breeder calculation:', { ageInWeeks, ageInDays, waterL, feedKg });
        }
        // Swine breeding - use database values
        else if (['sow_gestation', 'sow_lactation', 'boar'].includes(specificCategory)) {
            const swineBreedingData = consumptionData?.swine_breeding?.[specificCategory];
            if (swineBreedingData) {
                waterL = swineBreedingData.water_L || 0;
                feedKg = swineBreedingData.feed_kg || 0;
            }
            console.log('Swine breeder calculation:', { specificCategory, waterL, feedKg });
        }
        else {
            console.error('❌ Unknown category:', specificCategory);
            console.log('Available categories: broiler, layer, layer_breeder, broiler_breeder, color_chicken, color_breeder, nursery, grower, finisher, sow_gestation, sow_lactation, boar');
        }

        console.log('✅ Final result:', { waterL, feedKg, waterMl: waterL * 1000, feedG: feedKg * 1000 });
        console.log('=== getDailyConsumption END ===\n');

        return { waterL, feedKg };
    };

    const addPeriod = () => {
        const lastPeriod = calculationData.protocolPeriods[calculationData.protocolPeriods.length - 1];
        const newPeriod = {
            startDay: lastPeriod.endDay + 1,
            endDay: lastPeriod.endDay + 5
        };
        setCalculationData(prev => ({
            ...prev,
            protocolPeriods: [...prev.protocolPeriods, newPeriod]
        }));
    };

    const removePeriod = (index) => {
        if (calculationData.protocolPeriods.length > 1) {
            setCalculationData(prev => ({
                ...prev,
                protocolPeriods: prev.protocolPeriods.filter((_, i) => i !== index)
            }));
        }
    };

    const updatePeriod = (index, field, value) => {
        setCalculationData(prev => ({
            ...prev,
            protocolPeriods: prev.protocolPeriods.map((period, i) =>
                i === index ? { ...period, [field]: parseInt(value) } : period
            )
        }));
    };

    // Get filtered products based on animal selection
    const getAvailableProducts = () => {
        if (!productsData || !calculationData.specificCategory) return [];

        return productsData.products.filter(product => {
            const matchesSpecies = product.target_species.includes(calculationData.animalType);
            const matchesAnimal = product.target_animals.includes(calculationData.specificCategory) ||
                product.target_animals.includes('all_breeders');
            return matchesSpecies && matchesAnimal;
        });
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', padding: '2rem' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{
                    background: '#f3f4f6',
                    color: '#1f2937',
                    padding: '2rem',
                    borderRadius: '12px',
                    marginBottom: '2rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    flexWrap: 'wrap'
                }}>
                    <img
                        src="/images/FarmWell_Logo.png"
                        alt="FarmWell"
                        onClick={() => window.location.href = '/'}
                        style={{
                            height: 'clamp(48px, 10vw, 80px)',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            flexShrink: 0
                        }}
                        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    />
                    <div style={{ flex: 1, minWidth: '160px' }}>
                        <h1 style={{ fontSize: 'clamp(1.1rem, 5vw, 2rem)', fontWeight: '700', marginBottom: '0.25rem', color: '#1f2937', lineHeight: 1.2 }}>
                            FEED ADDITIVES CALCULATOR
                        </h1>
                        <p style={{ color: '#6b7280', fontSize: 'clamp(0.75rem, 2.5vw, 1rem)' }}>
                            Vaksindo Vietnam - United Animal Health Products
                        </p>
                    </div>
                </div>

                {/* Progress Steps */}
                <div style={{
                    background: 'white',
                    padding: '1rem',
                    borderRadius: '12px',
                    marginBottom: '2rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        {[1, 2, 3, 4].map(step => (
                            <div key={step} style={{ flex: 1, textAlign: 'center', padding: '0 2px' }}>
                                <div style={{
                                    width: 'clamp(28px, 8vw, 40px)',
                                    height: 'clamp(28px, 8vw, 40px)',
                                    borderRadius: '50%',
                                    background: currentStep >= step ? '#667eea' : '#e5e7eb',
                                    color: 'white',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: '700',
                                    fontSize: 'clamp(0.75rem, 3vw, 1rem)',
                                    marginBottom: '0.35rem'
                                }}>
                                    {step}
                                </div>
                                <div style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.875rem)', color: '#6b7280', lineHeight: 1.2 }}>
                                    {step === 1 && 'Select Animal'}
                                    {step === 2 && 'Flock Info'}
                                    {step === 3 && 'Select Product'}
                                    {step === 4 && 'Protocol & Results'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step Content */}
                <div style={{
                    background: 'white',
                    padding: '2rem',
                    borderRadius: '12px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    minHeight: '400px'
                }}>
                    {/* Reference Data View Toggle */}
                    {!showReferenceView && currentStep === 1 && (
                        <div style={{ marginBottom: '1.5rem', textAlign: 'right' }}>
                            <button
                                onClick={() => setShowReferenceView(true)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: '#f59e0b',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    fontWeight: '600'
                                }}
                            >
                                📚 {t('viewReferenceData')}
                            </button>
                        </div>
                    )}

                    {/* Reference Data Page */}
                    {showReferenceView ? (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>
                                    📚 {t('referenceData')}
                                </h2>
                                <button
                                    onClick={() => setShowReferenceView(false)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        background: '#6b7280',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '0.875rem',
                                        fontWeight: '600'
                                    }}
                                >
                                    ← {t('backToCalculator')}
                                </button>
                            </div>

                            {/* Animal Selection for Reference */}
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', fontWeight: '600', marginBottom: '1rem' }}>
                                    {t('selectAnimalType')}
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                                    {['swine', 'poultry'].map(type => (
                                        <button
                                            key={type}
                                            onClick={() => {
                                                setReferenceSelection({
                                                    animalType: type,
                                                    productionCategory: '',
                                                    specificCategory: ''
                                                });
                                            }}
                                            style={{
                                                padding: '1rem',
                                                border: referenceSelection.animalType === type ? '3px solid #667eea' : '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                background: referenceSelection.animalType === type ? '#f3f4ff' : 'white',
                                                cursor: 'pointer',
                                                fontSize: '1rem',
                                                fontWeight: '600',
                                                textTransform: 'capitalize',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {t(type)}
                                        </button>
                                    ))}
                                </div>

                                {/* Production Category */}
                                {referenceSelection.animalType && (
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '1rem' }}>
                                            {t('selectProductionCategory')}
                                        </label>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                                            {['commercial', 'breeding'].map(cat => (
                                                <button
                                                    key={cat}
                                                    onClick={() => {
                                                        setReferenceSelection(prev => ({
                                                            ...prev,
                                                            productionCategory: cat,
                                                            specificCategory: ''
                                                        }));
                                                    }}
                                                    style={{
                                                        padding: '1rem',
                                                        border: referenceSelection.productionCategory === cat ? '3px solid #667eea' : '2px solid #e5e7eb',
                                                        borderRadius: '8px',
                                                        background: referenceSelection.productionCategory === cat ? '#f3f4ff' : 'white',
                                                        cursor: 'pointer',
                                                        fontSize: '1rem',
                                                        fontWeight: '600',
                                                        textTransform: 'capitalize',
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    {t(cat)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Specific Category */}
                                {referenceSelection.productionCategory && (
                                    <div>
                                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '1rem' }}>
                                            {t('selectSpecificCategory')}
                                        </label>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                            {animalCategories[referenceSelection.animalType][referenceSelection.productionCategory].map(cat => (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => {
                                                        setReferenceSelection(prev => ({
                                                            ...prev,
                                                            specificCategory: cat.id
                                                        }));
                                                    }}
                                                    style={{
                                                        padding: '1rem',
                                                        border: referenceSelection.specificCategory === cat.id ? '3px solid #667eea' : '2px solid #e5e7eb',
                                                        borderRadius: '8px',
                                                        background: referenceSelection.specificCategory === cat.id ? '#f3f4ff' : 'white',
                                                        cursor: 'pointer',
                                                        fontSize: '1rem',
                                                        fontWeight: '600',
                                                        transition: 'all 0.2s',
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{cat.icon}</div>
                                                    {cat.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Display Reference Data Table */}
                            {referenceSelection.specificCategory && consumptionData && (
                                <div style={{
                                    background: '#f9fafb',
                                    padding: '1.5rem',
                                    borderRadius: '8px',
                                    marginTop: '2rem'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                                            Reference Data: {animalCategories[referenceSelection.animalType][referenceSelection.productionCategory].find(c => c.id === referenceSelection.specificCategory)?.label}
                                        </h3>
                                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                                            <button
                                                onClick={exportReferenceToExcel}
                                                className="no-print"
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    background: '#10b981',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '600',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem'
                                                }}
                                            >
                                                📊 Export Excel
                                            </button>
                                            <button
                                                onClick={printReferenceData}
                                                className="no-print"
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    background: '#3b82f6',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '600',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem'
                                                }}
                                            >
                                                🖨️ Print PDF
                                            </button>
                                        </div>
                                    </div>

                                    {/* Broiler - Daily Data from Comprehensive Database */}
                                    {referenceSelection.specificCategory === 'broiler' && (
                                        <div>
                                            <div style={{ background: '#dbeafe', padding: '1rem', borderRadius: '6px', marginBottom: '1rem' }}>
                                                <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Daily Performance Data (Day 0-56)</h4>
                                                <p style={{ fontSize: '0.875rem', color: '#1e40af' }}>
                                                    Source: {consumptionData.poultry_commercial.broiler.source}<br />
                                                    Breed: {consumptionData.poultry_commercial.broiler.breed}
                                                </p>
                                            </div>
                                            <div style={{ overflowX: 'auto' }}>
                                                <table style={{ width: '100%', background: 'white', borderCollapse: 'collapse' }}>
                                                    <thead>
                                                        <tr style={{ background: '#3b82f6', color: 'white' }}>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Day</th>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Body Weight (g)</th>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Feed (g/day)</th>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Water (ml/day)</th>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>FCR</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {consumptionData.poultry_commercial.broiler.daily_data.map(dayData => (
                                                            <tr key={dayData.day} style={{ background: dayData.day % 7 === 0 ? '#f3f4f6' : 'white' }}>
                                                                <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb', fontWeight: dayData.day % 7 === 0 ? '600' : 'normal' }}>{dayData.day}</td>
                                                                <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{dayData.bw_g}</td>
                                                                <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{dayData.feed_g}</td>
                                                                <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{dayData.water_ml}</td>
                                                                <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{dayData.fcr.toFixed(3)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {/* Layer - Complete Weekly Data from Comprehensive Database */}
                                    {referenceSelection.specificCategory === 'layer' && (
                                        <div>
                                            <div style={{ background: '#dbeafe', padding: '1rem', borderRadius: '6px', marginBottom: '1rem' }}>
                                                <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Complete Weekly Data (Week 1-100)</h4>
                                                <p style={{ fontSize: '0.875rem', color: '#1e40af' }}>
                                                    Source: {consumptionData.poultry_commercial.layer.source}<br />
                                                    Breed: {consumptionData.poultry_commercial.layer.breed} - {consumptionData.poultry_commercial.layer.housing}
                                                </p>
                                            </div>

                                            {/* Rearing Phase */}
                                            <h5 style={{ fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Rearing Phase (Weeks 1-18)</h5>
                                            <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
                                                <table style={{ width: '100%', background: 'white', borderCollapse: 'collapse' }}>
                                                    <thead>
                                                        <tr style={{ background: '#3b82f6', color: 'white' }}>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Week</th>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Feed (g/day)</th>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Water (ml/day)</th>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Body Weight (g)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {consumptionData.poultry_commercial.layer.rearing_weeks_1_18.map(data => {
                                                            const avgFeed = ((data.feed_g_min + data.feed_g_max) / 2).toFixed(1);
                                                            const avgWater = ((data.water_ml_min + data.water_ml_max) / 2).toFixed(1);
                                                            const avgBW = ((data.bw_g_min + data.bw_g_max) / 2).toFixed(0);
                                                            return (
                                                                <tr key={data.week}>
                                                                    <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{data.week}</td>
                                                                    <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{avgFeed}</td>
                                                                    <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{avgWater}</td>
                                                                    <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{avgBW}</td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Production Phase */}
                                            <h5 style={{ fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Production Phase (Weeks 18-100)</h5>
                                            <div style={{ overflowX: 'auto' }}>
                                                <table style={{ width: '100%', background: 'white', borderCollapse: 'collapse' }}>
                                                    <thead>
                                                        <tr style={{ background: '#3b82f6', color: 'white' }}>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Week</th>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Production %</th>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Feed (g/day)</th>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Water (ml/day)</th>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Egg Weight (g)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {consumptionData.poultry_commercial.layer.production_weeks_18_100.map(data => (
                                                            <tr key={data.week} style={{ background: data.week % 10 === 0 ? '#f3f4f6' : 'white' }}>
                                                                <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb', fontWeight: data.week % 10 === 0 ? '600' : 'normal' }}>{data.week}</td>
                                                                <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{data.prod_pct.toFixed(1)}%</td>
                                                                <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{data.feed_g}</td>
                                                                <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{data.water_ml}</td>
                                                                <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{data.egg_wt_g}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {/* Color Chicken - Formula with Adjustment and Daily Details */}
                                    {referenceSelection.specificCategory === 'color_chicken' && (
                                        <div>
                                            <div style={{ background: '#dbeafe', padding: '1rem', borderRadius: '6px', marginBottom: '1rem' }}>
                                                <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Calculation Method: Formula with 70% Adjustment</h4>
                                                <p style={{ fontSize: '0.875rem', color: '#1e40af' }}>
                                                    Water (ml/bird/day) = 5.28 × Age (days) × 0.70<br />
                                                    Feed (g/bird/day) = Water ÷ 1.77
                                                </p>
                                            </div>
                                            <div style={{ overflowX: 'auto' }}>
                                                <table style={{ width: '100%', background: 'white', borderCollapse: 'collapse' }}>
                                                    <thead>
                                                        <tr style={{ background: '#3b82f6', color: 'white' }}>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Day</th>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Water (ml/bird/day)</th>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Feed (g/bird/day)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Array.from({ length: 71 }, (_, i) => i).map(day => {
                                                            const water = 5.28 * day * 0.7;
                                                            const feed = water / 1.77;
                                                            return (
                                                                <tr key={day} style={{ background: day % 7 === 0 ? '#f3f4f6' : 'white' }}>
                                                                    <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb', fontWeight: day % 7 === 0 ? '600' : 'normal' }}>{day}</td>
                                                                    <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{water.toFixed(1)}</td>
                                                                    <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{feed.toFixed(1)}</td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {/* Broiler Breeder - Complete Weekly Data (v2.2) */}
                                    {referenceSelection.specificCategory === 'broiler_breeder' && (
                                        <div>
                                            <div style={{ background: '#dbeafe', padding: '1rem', borderRadius: '6px', marginBottom: '1rem' }}>
                                                <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Complete Weekly Data (Week 0-64)</h4>
                                                <p style={{ fontSize: '0.875rem', color: '#1e40af' }}>
                                                    Source: {consumptionData.poultry_breeding.broiler_breeder.source}<br />
                                                    Breed: {consumptionData.poultry_breeding.broiler_breeder.breed}<br />
                                                    Note: {consumptionData.poultry_breeding.broiler_breeder.note}
                                                </p>
                                            </div>

                                            {/* Complete Table - All Weeks */}
                                            <div style={{ overflowX: 'auto' }}>
                                                <table style={{ width: '100%', background: 'white', borderCollapse: 'collapse' }}>
                                                    <thead>
                                                        <tr style={{ background: '#3b82f6', color: 'white' }}>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Week</th>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Days</th>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>BW (g)</th>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Gain (g)</th>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Feed (g/day)</th>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Water (ml/day)</th>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Energy (kcal)</th>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Note</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {consumptionData.poultry_breeding.broiler_breeder.female_complete_weeks_0_64.map(data => {
                                                            const isRearing = data.week <= 20;
                                                            const hasNote = data.note && data.note !== '';
                                                            return (
                                                                <tr key={data.week} style={{
                                                                    background: hasNote ? '#fef3c7' : (isRearing ? '#f0fdf4' : 'white')
                                                                }}>
                                                                    <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb', fontWeight: data.week % 10 === 0 ? '600' : 'normal' }}>{data.week}</td>
                                                                    <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{data.days}</td>
                                                                    <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{data.bw_g}</td>
                                                                    <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{data.gain_g}</td>
                                                                    <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{data.feed_g}</td>
                                                                    <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{(data.feed_g * 1.8).toFixed(0)}</td>
                                                                    <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{data.energy_kcal}</td>
                                                                    <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb', fontSize: '0.875rem', color: '#059669' }}>
                                                                        {data.note || '-'}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div style={{ marginTop: '1rem', padding: '1rem', background: '#fef3c7', borderRadius: '6px', fontSize: '0.875rem' }}>
                                                <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>📝 Key Milestones:</p>
                                                <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                                                    <li><strong>Week 0</strong>: Day old ad lib feeding</li>
                                                    <li><strong>Week 21</strong>: First light stimulation</li>
                                                    <li><strong>Week 25</strong>: 5% production begins</li>
                                                    <li><strong>Week 30</strong>: Peak production achieved</li>
                                                    <li><strong>Week 64</strong>: End of production cycle</li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                    {/* Color Breeder - Complete Weekly Data */}
                                    {referenceSelection.specificCategory === 'color_breeder' && (
                                        <div>
                                            <div style={{ background: '#dbeafe', padding: '1rem', borderRadius: '6px', marginBottom: '1rem' }}>
                                                <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Complete Weekly Data (Week 1-70)</h4>
                                                <p style={{ fontSize: '0.875rem', color: '#1e40af' }}>
                                                    Source: {consumptionData.poultry_breeding.color_breeder.source}<br />
                                                    Breed: {consumptionData.poultry_breeding.color_breeder.breed}
                                                </p>
                                            </div>

                                            {/* Rearing Phase */}
                                            <h5 style={{ fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Pullet Rearing Phase (Weeks 1-24)</h5>
                                            <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
                                                <table style={{ width: '100%', background: 'white', borderCollapse: 'collapse' }}>
                                                    <thead>
                                                        <tr style={{ background: '#3b82f6', color: 'white' }}>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Week</th>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Feed (g/day)</th>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Water (ml/day)</th>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Body Weight (g)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {consumptionData.poultry_breeding.color_breeder.female_pullet_rearing_weeks_0_24.map(data => (
                                                            <tr key={data.week}>
                                                                <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{data.week}</td>
                                                                <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{data.feed_g}</td>
                                                                <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{(data.feed_g * 2.0).toFixed(0)}</td>
                                                                <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{data.bw_g}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Production Phase */}
                                            <h5 style={{ fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Production Phase - 20°C (Weeks 24-70)</h5>
                                            <div style={{ overflowX: 'auto' }}>
                                                <table style={{ width: '100%', background: 'white', borderCollapse: 'collapse' }}>
                                                    <thead>
                                                        <tr style={{ background: '#3b82f6', color: 'white' }}>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Week</th>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Production %</th>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Feed (g/day)</th>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Water (ml/day)</th>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Note</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {consumptionData.poultry_breeding.color_breeder.female_production_20C_weeks_24_70.map(data => (
                                                            <tr key={data.week} style={{ background: data.note ? '#fef3c7' : 'white' }}>
                                                                <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{data.week}</td>
                                                                <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{data.prod_pct}%</td>
                                                                <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{data.feed_g}</td>
                                                                <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{(data.feed_g * 2.0).toFixed(0)}</td>
                                                                <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb', fontSize: '0.875rem', color: '#059669' }}>
                                                                    {data.note || '-'}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {/* Layer Breeder - Using Layer Data + Fixed Production */}
                                    {referenceSelection.specificCategory === 'layer_breeder' && (
                                        <div>
                                            <div style={{ background: '#dbeafe', padding: '1rem', borderRadius: '6px', marginBottom: '1rem' }}>
                                                <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Layer Breeder Data</h4>
                                                <p style={{ fontSize: '0.875rem', color: '#1e40af' }}>
                                                    Rearing Phase: Uses layer commercial data<br />
                                                    Production Phase: Fixed breeding values
                                                </p>
                                            </div>

                                            {/* Rearing Phase */}
                                            <h5 style={{ fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Rearing Phase (Weeks 1-18)</h5>
                                            <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
                                                <table style={{ width: '100%', background: 'white', borderCollapse: 'collapse' }}>
                                                    <thead>
                                                        <tr style={{ background: '#3b82f6', color: 'white' }}>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Week</th>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Feed (g/day)</th>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Water (ml/day)</th>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Body Weight (g)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {consumptionData.poultry_commercial.layer.rearing_weeks_1_18.map(data => {
                                                            const avgFeed = ((data.feed_g_min + data.feed_g_max) / 2).toFixed(1);
                                                            const avgWater = ((data.water_ml_min + data.water_ml_max) / 2).toFixed(1);
                                                            const avgBW = ((data.bw_g_min + data.bw_g_max) / 2).toFixed(0);
                                                            return (
                                                                <tr key={data.week}>
                                                                    <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{data.week}</td>
                                                                    <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{avgFeed}</td>
                                                                    <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{avgWater}</td>
                                                                    <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{avgBW}</td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Production Phase */}
                                            <h5 style={{ fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Production Phase (Week 20+)</h5>
                                            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '6px' }}>
                                                <p style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>Fixed Breeding Values</p>
                                                <p>Feed: 160 g/bird/day</p>
                                                <p>Water: 280 ml/bird/day</p>
                                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem', fontStyle: 'italic' }}>
                                                    Note: Feed restriction management for optimal breeding performance
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Swine - Weight Based */}
                                    {['nursery', 'grower', 'finisher'].includes(referenceSelection.specificCategory) && (
                                        <div>
                                            <div style={{ background: '#dbeafe', padding: '1rem', borderRadius: '6px', marginBottom: '1rem' }}>
                                                <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Calculation Method: Weight-Based with Interpolation</h4>
                                                <p style={{ fontSize: '0.875rem', color: '#1e40af' }}>
                                                    Data from NRC Nutrient Requirements of Swine, 11th Edition
                                                </p>
                                            </div>
                                            <div style={{ overflowX: 'auto' }}>
                                                <table style={{ width: '100%', background: 'white', borderCollapse: 'collapse' }}>
                                                    <thead>
                                                        <tr style={{ background: '#3b82f6', color: 'white' }}>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Weight (kg)</th>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Water (L/pig/day)</th>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Feed (kg/pig/day)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {consumptionData.swine_commercial[referenceSelection.specificCategory].data_by_weight.map(data => (
                                                            <tr key={data.weight_kg}>
                                                                <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{data.weight_kg}</td>
                                                                <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{data.water_L}</td>
                                                                <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{data.feed_kg}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {/* Swine Breeding - Fixed Values */}
                                    {['sow_gestation', 'sow_lactation', 'boar'].includes(referenceSelection.specificCategory) && (
                                        <div>
                                            <div style={{ background: '#dbeafe', padding: '1rem', borderRadius: '6px', marginBottom: '1rem' }}>
                                                <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Calculation Method: Fixed Values</h4>
                                                <p style={{ fontSize: '0.875rem', color: '#1e40af' }}>
                                                    Data from NRC Swine Nutrition Standards
                                                </p>
                                            </div>
                                            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '6px' }}>
                                                {referenceSelection.specificCategory === 'sow_gestation' && (
                                                    <div>
                                                        <p style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>Sow - Gestation</p>
                                                        <p>Water: 15 L/sow/day</p>
                                                        <p>Feed: 2.5 kg/sow/day</p>
                                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem', fontStyle: 'italic' }}>
                                                            Note: Adjust based on body condition score
                                                        </p>
                                                    </div>
                                                )}
                                                {referenceSelection.specificCategory === 'sow_lactation' && (
                                                    <div>
                                                        <p style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>Sow - Lactation</p>
                                                        <p>Water: 25 L/sow/day</p>
                                                        <p>Feed: 6.0 kg/sow/day</p>
                                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem', fontStyle: 'italic' }}>
                                                            Note: High water demand due to milk production
                                                        </p>
                                                    </div>
                                                )}
                                                {referenceSelection.specificCategory === 'boar' && (
                                                    <div>
                                                        <p style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>Boar</p>
                                                        <p>Water: 15 L/boar/day</p>
                                                        <p>Feed: 2.5 kg/boar/day</p>
                                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem', fontStyle: 'italic' }}>
                                                            Note: Maintenance level, adjust for body condition
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Step 1: Animal Selection */}
                            {currentStep === 1 && (
                                <div>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                                        {t('step1')}: {t('selectAnimalType').replace(':', '')}
                                    </h2>

                                    {/* Animal Type Selection */}
                                    <div style={{ marginBottom: '2rem' }}>
                                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '1rem' }}>
                                            {t('selectAnimalType')}
                                        </label>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                                            {['swine', 'poultry'].map(type => (
                                                <button
                                                    key={type}
                                                    onClick={() => {
                                                        updateData('animalType', type);
                                                        updateData('productionCategory', '');
                                                        updateData('specificCategory', '');
                                                    }}
                                                    style={{
                                                        padding: '1.5rem',
                                                        border: calculationData.animalType === type ? '3px solid #667eea' : '2px solid #e5e7eb',
                                                        borderRadius: '8px',
                                                        background: calculationData.animalType === type ? '#f3f4ff' : 'white',
                                                        cursor: 'pointer',
                                                        fontSize: '1.125rem',
                                                        fontWeight: '600',
                                                        textTransform: 'capitalize',
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    {type === 'swine' ? '🐷' : '🐔'} {t(type)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Production Category */}
                                    {calculationData.animalType && (
                                        <div style={{ marginBottom: '2rem' }}>
                                            <label style={{ display: 'block', fontWeight: '600', marginBottom: '1rem' }}>
                                                {t('selectProductionCategory')}
                                            </label>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                                                {['breeding', 'commercial'].map(category => (
                                                    <button
                                                        key={category}
                                                        onClick={() => {
                                                            updateData('productionCategory', category);
                                                            updateData('specificCategory', '');
                                                        }}
                                                        style={{
                                                            padding: '1.5rem',
                                                            border: calculationData.productionCategory === category ? '3px solid #667eea' : '2px solid #e5e7eb',
                                                            borderRadius: '8px',
                                                            background: calculationData.productionCategory === category ? '#f3f4ff' : 'white',
                                                            cursor: 'pointer',
                                                            fontSize: '1.125rem',
                                                            fontWeight: '600',
                                                            textTransform: 'capitalize',
                                                            transition: 'all 0.2s'
                                                        }}
                                                    >
                                                        {category}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Specific Category */}
                                    {calculationData.productionCategory && (
                                        <div>
                                            <label style={{ display: 'block', fontWeight: '600', marginBottom: '1rem' }}>
                                                {t('selectSpecificCategory')}
                                            </label>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                                {animalCategories[calculationData.animalType][calculationData.productionCategory].map(cat => (
                                                    <button
                                                        key={cat.id}
                                                        onClick={() => updateData('specificCategory', cat.id)}
                                                        style={{
                                                            padding: '1rem',
                                                            border: calculationData.specificCategory === cat.id ? '3px solid #667eea' : '2px solid #e5e7eb',
                                                            borderRadius: '8px',
                                                            background: calculationData.specificCategory === cat.id ? '#f3f4ff' : 'white',
                                                            cursor: 'pointer',
                                                            fontSize: '1rem',
                                                            fontWeight: '600',
                                                            transition: 'all 0.2s',
                                                            textAlign: 'center'
                                                        }}
                                                    >
                                                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{cat.icon}</div>
                                                        {cat.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Step 2: Flock/Herd Information */}
                            {currentStep === 2 && (
                                <div>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                                        {t('step2')}: {t('flockHerdInfo')}
                                    </h2>

                                    <div style={{ maxWidth: '600px' }}>
                                        {/* Population */}
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                                                {t('populationSize')}
                                            </label>
                                            <input
                                                type="number"
                                                value={calculationData.population}
                                                onChange={(e) => updateData('population', e.target.value)}
                                                placeholder={t('enterPopulation')}
                                                min="1"
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem',
                                                    border: '2px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    fontSize: '1rem'
                                                }}
                                            />
                                        </div>

                                        {/* Age */}
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                                                {t('currentAge')}
                                            </label>
                                            <div style={{ display: 'flex', gap: '1rem' }}>
                                                <input
                                                    type="number"
                                                    value={calculationData.age}
                                                    onChange={(e) => updateData('age', e.target.value)}
                                                    placeholder={t('age')}
                                                    min="1"
                                                    style={{
                                                        flex: 2,
                                                        padding: '0.75rem',
                                                        border: '2px solid #e5e7eb',
                                                        borderRadius: '8px',
                                                        fontSize: '1rem'
                                                    }}
                                                />
                                                <select
                                                    value={calculationData.ageUnit}
                                                    onChange={(e) => updateData('ageUnit', e.target.value)}
                                                    style={{
                                                        flex: 1,
                                                        padding: '0.75rem',
                                                        border: '2px solid #e5e7eb',
                                                        borderRadius: '8px',
                                                        fontSize: '1rem'
                                                    }}
                                                >
                                                    <option value="days">{t('days')}</option>
                                                    <option value="weeks">{t('weeks')}</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Gender (for breeders only) */}
                                        {calculationData.productionCategory === 'breeding' && (
                                            <div style={{ marginBottom: '1.5rem' }}>
                                                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                                                    Gender:
                                                </label>
                                                <select
                                                    value={calculationData.gender}
                                                    onChange={(e) => updateData('gender', e.target.value)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.75rem',
                                                        border: '2px solid #e5e7eb',
                                                        borderRadius: '8px',
                                                        fontSize: '1rem'
                                                    }}
                                                >
                                                    <option value="female">Female only</option>
                                                    <option value="male">Male only</option>
                                                    <option value="mixed">Mixed flock</option>
                                                </select>

                                                {calculationData.gender === 'mixed' && (
                                                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
                                                        <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                                            Ratio (Female : Male):
                                                        </label>
                                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                            <input
                                                                type="number"
                                                                value={calculationData.femaleRatio}
                                                                onChange={(e) => updateData('femaleRatio', e.target.value)}
                                                                min="1"
                                                                style={{
                                                                    flex: 1,
                                                                    minWidth: 0,
                                                                    padding: '0.5rem',
                                                                    border: '1px solid #e5e7eb',
                                                                    borderRadius: '4px'
                                                                }}
                                                            />
                                                            <span style={{ flexShrink: 0 }}>:</span>
                                                            <input
                                                                type="number"
                                                                value={calculationData.maleRatio}
                                                                onChange={(e) => updateData('maleRatio', e.target.value)}
                                                                min="1"
                                                                style={{
                                                                    flex: 1,
                                                                    minWidth: 0,
                                                                    padding: '0.5rem',
                                                                    border: '1px solid #e5e7eb',
                                                                    borderRadius: '4px'
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Product Selection */}
                            {currentStep === 3 && (
                                <div>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                                        {t('step3')}: {t('selectProduct')}
                                    </h2>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                                        {getAvailableProducts().map(product => (
                                            <div
                                                key={product.id}
                                                onClick={() => updateData('selectedProduct', product)}
                                                style={{
                                                    padding: '1.5rem',
                                                    border: calculationData.selectedProduct?.id === product.id ? '3px solid #667eea' : '2px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    background: calculationData.selectedProduct?.id === product.id ? '#f3f4ff' : 'white',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                                                    <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1f2937' }}>
                                                        {product.name}
                                                    </h3>
                                                    {product.popular && (
                                                        <span style={{
                                                            background: '#fef3c7',
                                                            color: '#92400e',
                                                            padding: '0.25rem 0.5rem',
                                                            borderRadius: '4px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '600'
                                                        }}>
                                                            ★ Popular
                                                        </span>
                                                    )}
                                                </div>
                                                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                                                    {product.application.method === 'feed' ? '🥣 Feed' : '💧 Water'} • {product.application.dosage.amount}{product.application.dosage.unit}/{product.application.dosage.per}{product.application.dosage.per_unit || ' ton'}
                                                </div>
                                                <div style={{ fontSize: '0.875rem', color: '#374151' }}>
                                                    {product.benefits.primary.slice(0, 2).map((benefit, i) => (
                                                        <div key={i} style={{ marginBottom: '0.25rem' }}>
                                                            ✓ {benefit}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Price Input */}
                                    {calculationData.selectedProduct && (
                                        <div style={{
                                            background: '#f0fdf4',
                                            border: '2px solid #86efac',
                                            borderRadius: '12px',
                                            padding: '1.5rem',
                                            maxWidth: '500px',
                                            width: '100%',
                                            boxSizing: 'border-box'
                                        }}>
                                            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '1rem', color: '#166534' }}>
                                                💰 {t('productPrice').replace(' (VND/kg):', '')}
                                            </h3>
                                            <div>
                                                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                                                    {t('productPrice')}
                                                </label>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                                                    <input
                                                        type="number"
                                                        value={calculationData.productPrice}
                                                        onChange={(e) => updateData('productPrice', e.target.value)}
                                                        min="0"
                                                        step="1000"
                                                        style={{
                                                            flex: 1,
                                                            minWidth: 0,
                                                            padding: '0.75rem',
                                                            border: '2px solid #d1d5db',
                                                            borderRadius: '8px',
                                                            fontSize: '1rem',
                                                            fontWeight: '600'
                                                        }}
                                                    />
                                                    <span style={{ fontSize: '1rem', fontWeight: '600', color: '#6b7280', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                                        VND/kg
                                                    </span>
                                                </div>
                                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                                                    {t('enterPriceHint')}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Step 4: Protocol & Results */}
                            {currentStep === 4 && (
                                <div>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                                        {t('step4')}: {t('treatmentProtocol')}
                                    </h2>

                                    {/* Template Protocol Selection */}
                                    <div style={{ marginBottom: '2rem' }}>
                                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
                                            {t('templateProtocol')}
                                        </h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                                            <button
                                                onClick={() => useTemplate('standard')}
                                                style={{
                                                    padding: '1.5rem',
                                                    border: '2px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    background: 'white',
                                                    cursor: 'pointer',
                                                    textAlign: 'left',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseOver={(e) => {
                                                    e.currentTarget.style.borderColor = '#667eea';
                                                    e.currentTarget.style.background = '#f3f4ff';
                                                }}
                                                onMouseOut={(e) => {
                                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                                    e.currentTarget.style.background = 'white';
                                                }}
                                            >
                                                <div style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                                                    📋 {t('standardPreventionTitle')}
                                                </div>
                                                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                                    {t('standardPreventionDesc')}
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => useTemplate('intensive')}
                                                style={{
                                                    padding: '1.5rem',
                                                    border: '2px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    background: 'white',
                                                    cursor: 'pointer',
                                                    textAlign: 'left',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseOver={(e) => {
                                                    e.currentTarget.style.borderColor = '#667eea';
                                                    e.currentTarget.style.background = '#f3f4ff';
                                                }}
                                                onMouseOut={(e) => {
                                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                                    e.currentTarget.style.background = 'white';
                                                }}
                                            >
                                                <div style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                                                    🏥 {t('intensiveTreatmentTitle')}
                                                </div>
                                                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                                    {t('intensiveTreatmentDesc')}
                                                </div>
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => setShowCustomProtocol(!showCustomProtocol)}
                                            style={{
                                                color: '#667eea',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontSize: '1rem',
                                                fontWeight: '600',
                                                padding: '0.5rem 0'
                                            }}
                                        >
                                            {showCustomProtocol ? t('hideCustomProtocol') : t('createCustomProtocol')}
                                        </button>
                                    </div>

                                    {/* Custom Protocol Builder */}
                                    {showCustomProtocol && (
                                        <div style={{ marginBottom: '2rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
                                                {t('customProtocolLabel')}
                                            </h3>

                                            {calculationData.protocolPeriods.map((period, index) => (
                                                <div key={index} style={{
                                                    background: '#f9fafb',
                                                    padding: '1rem',
                                                    borderRadius: '8px',
                                                    marginBottom: '1rem'
                                                }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                                        <strong>Period {index + 1}</strong>
                                                        {calculationData.protocolPeriods.length > 1 && (
                                                            <button
                                                                onClick={() => removePeriod(index)}
                                                                style={{
                                                                    background: '#fee2e2',
                                                                    color: '#dc2626',
                                                                    border: 'none',
                                                                    padding: '0.25rem 0.75rem',
                                                                    borderRadius: '4px',
                                                                    cursor: 'pointer',
                                                                    fontSize: '0.875rem'
                                                                }}
                                                            >
                                                                Remove
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                                        <div>
                                                            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                                                                Start Day:
                                                            </label>
                                                            <input
                                                                type="number"
                                                                value={period.startDay}
                                                                onChange={(e) => updatePeriod(index, 'startDay', e.target.value)}
                                                                min="1"
                                                                style={{
                                                                    width: '100%',
                                                                    padding: '0.5rem',
                                                                    border: '1px solid #e5e7eb',
                                                                    borderRadius: '4px'
                                                                }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                                                                End Day:
                                                            </label>
                                                            <input
                                                                type="number"
                                                                value={period.endDay}
                                                                onChange={(e) => updatePeriod(index, 'endDay', e.target.value)}
                                                                min={period.startDay}
                                                                style={{
                                                                    width: '100%',
                                                                    padding: '0.5rem',
                                                                    border: '1px solid #e5e7eb',
                                                                    borderRadius: '4px'
                                                                }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                                                                Duration:
                                                            </label>
                                                            <div style={{
                                                                padding: '0.5rem',
                                                                background: 'white',
                                                                border: '1px solid #e5e7eb',
                                                                borderRadius: '4px',
                                                                fontWeight: '600'
                                                            }}>
                                                                {period.endDay - period.startDay + 1} days
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            <button
                                                onClick={addPeriod}
                                                style={{
                                                    padding: '0.75rem 1.5rem',
                                                    background: '#667eea',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    fontSize: '1rem',
                                                    fontWeight: '600',
                                                    marginTop: '0.5rem'
                                                }}
                                            >
                                                ➕ Add Another Period
                                            </button>
                                        </div>
                                    )}

                                    {/* Calculate Button */}
                                    <button
                                        onClick={calculateResults}
                                        style={{
                                            width: '100%',
                                            padding: '1rem',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '1.125rem',
                                            fontWeight: '700',
                                            marginBottom: '2rem'
                                        }}
                                    >
                                        🧮 {t('calculateDosage')}
                                    </button>

                                    {/* Results Display */}
                                    {calculationData.results && (
                                        <div className="print-content" style={{
                                            background: '#f0fdf4',
                                            border: '2px solid #86efac',
                                            borderRadius: '12px',
                                            padding: '2rem'
                                        }}>
                                            {/* Print Header - Only visible when printing */}
                                            <div className="print-header">
                                                <img src="/images/FarmWell_Logo.png" alt="FarmWell" />
                                                <div>
                                                    <h1>{t('title')}</h1>
                                                    <p>{t('subtitle')}</p>
                                                    <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
                                                        {t('generated')} {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                                                    </p>
                                                </div>
                                            </div>

                                            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#166534' }}>
                                                📊 {t('calculationResults')}
                                            </h3>

                                            {/* Summary */}
                                            <div className="calculation-summary" style={{
                                                background: 'white',
                                                padding: '1.5rem',
                                                borderRadius: '8px',
                                                marginBottom: '1.5rem'
                                            }}>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                                                    <div>
                                                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{t('product')}</div>
                                                        <div style={{ fontSize: '1.125rem', fontWeight: '700' }}>
                                                            {calculationData.selectedProduct.name}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{t('population')}</div>
                                                        <div style={{ fontSize: '1.125rem', fontWeight: '700' }}>
                                                            {parseInt(calculationData.population).toLocaleString()} {t('animals')}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{t('totalTreatmentDays')}</div>
                                                        <div style={{ fontSize: '1.125rem', fontWeight: '700' }}>
                                                            {calculationData.results.totalDays} {t('days')}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{t('numberOfPeriods')}</div>
                                                        <div style={{ fontSize: '1.125rem', fontWeight: '700' }}>
                                                            {calculationData.protocolPeriods.length} {t('numberOfPeriods').toLowerCase().includes('period') ? '' : 'periods'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Period Breakdown */}
                                            <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
                                                {t('periodBreakdown')}
                                            </h4>
                                            {calculationData.results.periods.map((period, index) => (
                                                <div key={index} className="period-breakdown" style={{
                                                    background: 'white',
                                                    padding: '1rem',
                                                    borderRadius: '8px',
                                                    marginBottom: '1rem'
                                                }}>
                                                    <div style={{ fontWeight: '700', marginBottom: '0.75rem' }}>
                                                        {t('period')} {index + 1}: {t('day')} {period.startDay}-{period.endDay} ({period.days} {t('days')})
                                                    </div>
                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', fontSize: '0.875rem' }}>
                                                        <div>{t('totalWater')} {parseFloat(period.totalWaterL).toLocaleString()} L</div>
                                                        <div>{t('totalFeed')} {parseFloat(period.totalFeedKg).toLocaleString()} kg</div>
                                                        <div style={{ color: '#667eea', fontWeight: '600' }}>
                                                            {t('productNeeded')} {parseFloat(period.productNeeded).toLocaleString()} g
                                                        </div>
                                                        <div style={{ color: '#f59e0b', fontWeight: '600' }}>
                                                            {t('cost')} {parseInt(period.cost).toLocaleString()} VND
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Total Investment */}
                                            <div className="total-investment" style={{
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                color: 'white',
                                                padding: '1.5rem',
                                                borderRadius: '8px',
                                                marginTop: '1.5rem'
                                            }}>
                                                <h4 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>
                                                    💰 {t('totalInvestment')}
                                                </h4>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '1rem' }}>
                                                    <div>
                                                        <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>{t('totalProduct')}</div>
                                                        <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                                                            {(calculationData.results.totalProductGrams / 1000).toFixed(2)} kg
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>{t('totalCost')}</div>
                                                        <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                                                            {calculationData.results.totalCost.toLocaleString()} VND
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>{t('costPerAnimal')}</div>
                                                        <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                                                            {Math.round(calculationData.results.costPerAnimal).toLocaleString()} VND
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Expected Benefits */}
                                            <div className="expected-benefits" style={{
                                                background: 'white',
                                                padding: '1.5rem',
                                                borderRadius: '8px',
                                                marginTop: '1.5rem'
                                            }}>
                                                <h4 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '1rem', color: '#166534' }}>
                                                    💡 {t('expectedBenefits')}
                                                </h4>
                                                {calculationData.selectedProduct.benefits.primary.map((benefit, i) => (
                                                    <div key={i} style={{ marginBottom: '0.5rem', paddingLeft: '1.5rem', position: 'relative' }}>
                                                        <span style={{ position: 'absolute', left: 0 }}>✓</span>
                                                        {benefit}
                                                    </div>
                                                ))}
                                                <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280', fontStyle: 'italic' }}>
                                                    {t('benefitsNote')}
                                                </div>
                                            </div>

                                            {/* Daily Calculation Details */}
                                            <div style={{
                                                background: '#eff6ff',
                                                border: '2px solid #93c5fd',
                                                borderRadius: '12px',
                                                padding: '1.5rem',
                                                marginTop: '1.5rem'
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                                    <h4 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e40af' }}>
                                                        📋 {t('dailyCalculationDetails')}
                                                    </h4>
                                                    <button
                                                        onClick={() => setShowDailyDetails(!showDailyDetails)}
                                                        style={{
                                                            background: '#3b82f6',
                                                            color: 'white',
                                                            border: 'none',
                                                            padding: '0.5rem 1rem',
                                                            borderRadius: '6px',
                                                            cursor: 'pointer',
                                                            fontSize: '0.875rem',
                                                            fontWeight: '600'
                                                        }}
                                                    >
                                                        {showDailyDetails ? '🔼 ' + t('hideDetails') : '🔽 ' + t('showDetails')}
                                                    </button>
                                                </div>

                                                {showDailyDetails && (
                                                    <div>
                                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                                                            {t('dailyDetailsDescription')}
                                                        </p>

                                                        {calculationData.results.periods.map((period, periodIndex) => (
                                                            <div key={periodIndex} style={{ marginBottom: '2rem' }}>
                                                                <div style={{
                                                                    background: '#3b82f6',
                                                                    color: 'white',
                                                                    padding: '0.75rem 1rem',
                                                                    borderRadius: '8px 8px 0 0',
                                                                    fontWeight: '700',
                                                                    fontSize: '1rem'
                                                                }}>
                                                                    {t('period')} {periodIndex + 1}
                                                                </div>

                                                                <div style={{ overflowX: 'auto' }}>
                                                                    <table className="daily-details-table" style={{
                                                                        width: '100%',
                                                                        background: 'white',
                                                                        borderCollapse: 'collapse',
                                                                        fontSize: '0.875rem'
                                                                    }}>
                                                                        <thead>
                                                                            <tr style={{ background: '#f3f4f6' }}>
                                                                                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>{t('dayColumn')}</th>
                                                                                <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid #e5e7eb' }}>{t('ageColumn')}</th>
                                                                                <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid #e5e7eb' }}>{t('waterPerAnimal')}</th>
                                                                                <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid #e5e7eb' }}>{t('totalWaterL')}</th>
                                                                                <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid #e5e7eb' }}>{t('feedPerAnimal')}</th>
                                                                                <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid #e5e7eb' }}>{t('totalFeedKg')}</th>
                                                                                <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid #e5e7eb', color: '#667eea' }}>{t('productG')}</th>
                                                                                <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid #e5e7eb', color: '#f59e0b' }}>{t('costVND')}</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {period.dailyBreakdown.map((day, dayIndex) => (
                                                                                <tr key={dayIndex} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                                                    <td style={{ padding: '0.75rem' }}>{day.day}</td>
                                                                                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>{day.ageInDays}</td>
                                                                                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>{day.waterPerAnimal.toFixed(1)}</td>
                                                                                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>{parseFloat(day.totalWaterL).toLocaleString()}</td>
                                                                                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>{day.feedPerAnimal.toFixed(1)}</td>
                                                                                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>{parseFloat(day.totalFeedKg).toLocaleString()}</td>
                                                                                    <td style={{ padding: '0.75rem', textAlign: 'right', color: '#667eea', fontWeight: '600' }}>
                                                                                        {parseFloat(day.productNeeded).toLocaleString()}
                                                                                    </td>
                                                                                    <td style={{ padding: '0.75rem', textAlign: 'right', color: '#f59e0b', fontWeight: '600' }}>
                                                                                        {day.cost.toLocaleString()}
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                            <tr style={{ background: '#fce7f3', fontWeight: '700' }}>
                                                                                <td colSpan="3" style={{ padding: '0.75rem' }}>{t('totalPeriod')}</td>
                                                                                <td style={{ padding: '0.75rem', textAlign: 'right' }}>{parseFloat(period.totalWaterL).toLocaleString()}</td>
                                                                                <td style={{ padding: '0.75rem', textAlign: 'right' }}></td>
                                                                                <td style={{ padding: '0.75rem', textAlign: 'right' }}>{parseFloat(period.totalFeedKg).toLocaleString()}</td>
                                                                                <td style={{ padding: '0.75rem', textAlign: 'right', color: '#667eea' }}>
                                                                                    {parseFloat(period.productNeeded).toLocaleString()}
                                                                                </td>
                                                                                <td style={{ padding: '0.75rem', textAlign: 'right', color: '#f59e0b' }}>
                                                                                    {parseInt(period.cost).toLocaleString()}
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Export Buttons */}
                                            <div className="no-print" style={{
                                                display: 'flex',
                                                gap: '1rem',
                                                marginTop: '2rem',
                                                justifyContent: 'center'
                                            }}>
                                                <button
                                                    onClick={exportToExcel}
                                                    style={{
                                                        padding: '0.75rem 2rem',
                                                        background: '#10b981',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        fontSize: '1rem',
                                                        fontWeight: '600',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem'
                                                    }}
                                                >
                                                    📊 {t('exportToExcel')}
                                                </button>
                                                <button
                                                    onClick={printPDF}
                                                    style={{
                                                        padding: '0.75rem 2rem',
                                                        background: '#ef4444',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        fontSize: '1rem',
                                                        fontWeight: '600',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem'
                                                    }}
                                                >
                                                    🖨️ {t('printPDF')}
                                                </button>
                                            </div>

                                            {/* Request for Inquiry Form */}
                                            <div className="no-print" style={{
                                                background: '#f0f9ff',
                                                border: '2px solid #0ea5e9',
                                                borderRadius: '12px',
                                                padding: '2rem',
                                                marginTop: '2rem'
                                            }}>
                                                <h4 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', color: '#0369a1' }}>
                                                    📧 {t('requestForInquiry')}
                                                </h4>
                                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>
                                                    {t('inquiryDescription')}
                                                </p>

                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                                                    <div>
                                                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                                                            {t('name')} *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={inquiryData.name}
                                                            onChange={(e) => setInquiryData(prev => ({ ...prev, name: e.target.value }))}
                                                            placeholder={t('enterName')}
                                                            style={{
                                                                width: '100%',
                                                                padding: '0.75rem',
                                                                border: '2px solid #e5e7eb',
                                                                borderRadius: '8px',
                                                                fontSize: '1rem'
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                                                            {t('email')} *
                                                        </label>
                                                        <input
                                                            type="email"
                                                            value={inquiryData.email}
                                                            onChange={(e) => setInquiryData(prev => ({ ...prev, email: e.target.value }))}
                                                            placeholder={t('enterEmail')}
                                                            style={{
                                                                width: '100%',
                                                                padding: '0.75rem',
                                                                border: '2px solid #e5e7eb',
                                                                borderRadius: '8px',
                                                                fontSize: '1rem'
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                                                            {t('phoneNumber')} *
                                                        </label>
                                                        <input
                                                            type="tel"
                                                            value={inquiryData.phone}
                                                            onChange={(e) => setInquiryData(prev => ({ ...prev, phone: e.target.value }))}
                                                            placeholder={t('enterPhone')}
                                                            style={{
                                                                width: '100%',
                                                                padding: '0.75rem',
                                                                border: '2px solid #e5e7eb',
                                                                borderRadius: '8px',
                                                                fontSize: '1rem'
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => {
                                                        if (inquiryData.name && inquiryData.email && inquiryData.phone) {
                                                            alert(t('inquirySuccess'));
                                                            // TODO: Implement actual inquiry submission logic here
                                                        } else {
                                                            alert(t('fillAllFields'));
                                                        }
                                                    }}
                                                    style={{
                                                        marginTop: '1.5rem',
                                                        padding: '0.75rem 2rem',
                                                        background: '#0ea5e9',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        fontSize: '1rem',
                                                        fontWeight: '600',
                                                        width: '100%'
                                                    }}
                                                >
                                                    {t('submitInquiry')}
                                                </button>

                                                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '1rem', fontStyle: 'italic' }}>
                                                    {t('allFieldsRequired')}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="navigation-buttons" style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                gap: '0.75rem',
                                marginTop: '2rem',
                                paddingTop: '2rem',
                                borderTop: '1px solid #e5e7eb'
                            }}>
                                {currentStep === 4 ? (
                                    // Results page navigation
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', width: '100%' }}>
                                        <button
                                            onClick={prevStep}
                                            style={{
                                                padding: '0.75rem 1rem',
                                                background: 'white',
                                                color: '#374151',
                                                border: '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontSize: '1rem',
                                                fontWeight: '600',
                                                flexShrink: 0,
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            ← Previous
                                        </button>
                                        <button
                                            onClick={resetCalculation}
                                            style={{
                                                padding: '0.75rem 1rem',
                                                background: '#10b981',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontSize: '1rem',
                                                fontWeight: '600',
                                                marginLeft: 'auto',
                                                flexShrink: 0,
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            🔄 {t('newCalculation')}
                                        </button>
                                    </div>
                                ) : (
                                    // Other pages navigation
                                    <>
                                        <button
                                            onClick={prevStep}
                                            disabled={currentStep === 1}
                                            style={{
                                                padding: '0.75rem 1rem',
                                                background: currentStep === 1 ? '#e5e7eb' : 'white',
                                                color: currentStep === 1 ? '#9ca3af' : '#374151',
                                                border: '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
                                                fontSize: '1rem',
                                                fontWeight: '600',
                                                flexShrink: 0,
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            ← Previous
                                        </button>

                                        {currentStep < 4 && (
                                            <button
                                                onClick={nextStep}
                                                disabled={
                                                    (currentStep === 1 && !calculationData.specificCategory) ||
                                                    (currentStep === 2 && (!calculationData.population || !calculationData.age)) ||
                                                    (currentStep === 3 && (!calculationData.selectedProduct || !calculationData.productPrice))
                                                }
                                                style={{
                                                    padding: '0.75rem 1rem',
                                                    background: '#667eea',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    fontSize: '1rem',
                                                    fontWeight: '600',
                                                    flexShrink: 0,
                                                    whiteSpace: 'nowrap',
                                                    opacity: (
                                                        (currentStep === 1 && !calculationData.specificCategory) ||
                                                        (currentStep === 2 && (!calculationData.population || !calculationData.age)) ||
                                                        (currentStep === 3 && (!calculationData.selectedProduct || !calculationData.productPrice))
                                                    ) ? 0.5 : 1
                                                }}
                                            >
                                                {t('next')} →
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DosageCalculator;
