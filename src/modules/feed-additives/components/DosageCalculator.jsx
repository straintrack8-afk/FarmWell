import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { feedAdditivesTranslations } from '../translations';
import * as XLSX from 'xlsx';

const DosageCalculator = () => {
    const { language, setLanguage } = useLanguage();
    const navigate = useNavigate();
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
                { id: 'sow_gestation', label: 'Sow - Gestation', icon: '' },
                { id: 'sow_lactation', label: 'Sow - Lactation', icon: '' },
                { id: 'boar', label: 'Boar', icon: '' }
            ],
            commercial: [
                { id: 'nursery', label: 'Nursery/Weaner (5-27 kg)', icon: '' },
                { id: 'grower', label: 'Grower (27-60 kg)', icon: '' },
                { id: 'finisher', label: 'Finisher (60-120 kg)', icon: '' }
            ]
        },
        poultry: {
            breeding: [
                { id: 'broiler_breeder', label: 'Broiler Breeder', icon: '' },
                { id: 'layer_breeder', label: 'Layer Breeder', icon: '' },
                { id: 'color_breeder', label: 'Color Breeder', icon: '' }
            ],
            commercial: [
                { id: 'broiler', label: 'Broiler', icon: '' },
                { id: 'layer', label: 'Layer (Commercial)', icon: '' },
                { id: 'color_chicken', label: 'Color/Kampung Chicken', icon: '' }
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

    const handleInquirySubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        
        // Web3Forms configuration
        formData.append("access_key", "4d168932-50a6-4445-8527-ebd8a98eba33");
        formData.append("subject", `FarmWell Inquiry from ${formData.get('name')}`);
        formData.append("from_name", "FarmWell Contact Form");
        
        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                alert(t('inquirySuccess'));
                setInquiryData({ name: '', email: '', phone: '' });
            } else {
                alert("Failed to send inquiry. Please try again.");
                console.error("Web3Forms Error:", data);
            }
        } catch (error) {
            alert("Failed to send inquiry. Please try again.");
            console.error("Network Error:", error);
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

        // Period Summary
        csvContent += "PERIOD BREAKDOWN\n";
        csvContent += "Period,Start Day,End Day,Days,Total Water (L),Total Feed (kg),Product Needed (g),Cost (VND)\n";
        calculationData.results.periods.forEach((period, index) => {
            csvContent += `${index + 1},${period.startDay},${period.endDay},${period.days},${parseFloat(period.totalWaterL).toLocaleString()},${parseFloat(period.totalFeedKg).toLocaleString()},${parseFloat(period.productNeeded).toLocaleString()},${parseInt(period.cost).toLocaleString()}\n`;
        });

        // Daily Detail Breakdown
        csvContent += "\nDAILY CALCULATION DETAILS\n";
        calculationData.results.periods.forEach((period, periodIndex) => {
            csvContent += `\nPeriod ${periodIndex + 1}: Day ${period.startDay}-${period.endDay} (${period.days} days)\n`;
            csvContent += "Day,Age (days),Water (ml/animal),Total Water (L),Feed (g/animal),Total Feed (kg),Product (g),Cost (VND)\n";
            period.dailyBreakdown.forEach(day => {
                csvContent += `${day.day},${day.ageInDays},${day.waterPerAnimal.toFixed(1)},${parseFloat(day.totalWaterL).toLocaleString()},${day.feedPerAnimal.toFixed(1)},${parseFloat(day.totalFeedKg).toLocaleString()},${parseFloat(day.productNeeded).toLocaleString()},${day.cost.toLocaleString()}\n`;
            });
            // Total row for this period
            csvContent += `Total Period,,,${parseFloat(period.totalWaterL).toLocaleString()},,${parseFloat(period.totalFeedKg).toLocaleString()},${parseFloat(period.productNeeded).toLocaleString()},${parseInt(period.cost).toLocaleString()}\n`;
        });

        // Total Investment
        csvContent += "\nTOTAL INVESTMENT\n";
        csvContent += `Total Product (kg),${(calculationData.results.totalProductGrams / 1000).toFixed(2)}\n`;
        csvContent += `Total Cost (VND),${calculationData.results.totalCost.toLocaleString()}\n`;
        csvContent += `Cost per Animal (VND),${Math.round(calculationData.results.costPerAnimal).toLocaleString()}\n\n`;

        // Inquiry Information (if filled)
        if (inquiryData.name || inquiryData.email || inquiryData.phone) {
            csvContent += "INQUIRY INFORMATION\n";
            csvContent += `Name,${inquiryData.name}\n`;
            csvContent += `Email,${inquiryData.email}\n`;
            csvContent += `Phone,${inquiryData.phone}\n`;
        }

        // Create download link
        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
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
            console.error(' Consumption data not loaded yet');
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
            console.error(' Unknown category:', specificCategory);
            console.log('Available categories: broiler, layer, layer_breeder, broiler_breeder, color_chicken, color_breeder, nursery, grower, finisher, sow_gestation, sow_lactation, boar');
        }

        console.log(' Final result:', { waterL, feedKg, waterMl: waterL * 1000, feedG: feedKg * 1000 });
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

    const languages = [
        { code: 'en', label: 'EN' },
        { code: 'id', label: 'ID' },
        { code: 'vi', label: 'VI' },
    ];

    const SwineIcon = () => (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 9a7 7 0 11-14 0 7 7 0 0114 0z"/>
            <path d="M12 2v2"/>
            <path d="M8 3.5C6 5 5 7 5 9"/>
            <path d="M16 3.5C18 5 19 7 19 9"/>
            <path d="M9 9h.01M15 9h.01"/>
            <path d="M9 13c1 1 5 1 6 0"/>
            <path d="M10 7h4"/>
            <path d="M8 17l-1 4M16 17l1 4"/>
        </svg>
    );

    const PoultryIcon = () => (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 2c0 0-2 1-2 4 0 1.5.5 2.5 1 3"/>
            <path d="M9 6C7 6 4 7.5 4 11c0 2 1 3.5 2.5 4.5"/>
            <path d="M15 7c2 0 5 1.5 5 5 0 2-1 3.5-2.5 4.5"/>
            <ellipse cx="12" cy="15" rx="5" ry="4"/>
            <path d="M9 19l-1 3M15 19l1 3"/>
            <path d="M10 13h.01M14 13h.01"/>
        </svg>
    );

    // Production Category icons
    const BreedingIcon = () => (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8 2 5 5 5 8c0 2 1 3.5 2.5 4.5"/>
            <path d="M12 2c4 0 7 3 7 6 0 2-1 3.5-2.5 4.5"/>
            <path d="M8 12c0 3 1.5 5.5 4 6.5"/>
            <path d="M16 12c0 3-1.5 5.5-4 6.5"/>
            <circle cx="12" cy="19" r="2"/>
            <path d="M9 8h6M12 6v4"/>
        </svg>
    );

    const CommercialIcon = () => (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="10" width="18" height="11" rx="2"/>
            <path d="M7 10V7a5 5 0 0110 0v3"/>
            <path d="M12 14v3"/>
            <path d="M9 17h6"/>
        </svg>
    );

    // Swine Specific icons
    const SowGestationIcon = () => (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="12" cy="13" rx="7" ry="5"/>
            <path d="M9 13h.01M15 13h.01"/>
            <path d="M10 16c.5.5 3.5.5 4 0"/>
            <path d="M5 10C3.5 9 3 7.5 3 6c0-1 .5-2 1.5-2"/>
            <path d="M19 10c1.5-1 2-2.5 2-4 0-1-.5-2-1.5-2"/>
            <circle cx="12" cy="5" r="1.5" fill="currentColor"/>
            <path d="M8 18l-1 3M16 18l1 3"/>
        </svg>
    );

    const SowLactationIcon = () => (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="12" cy="12" rx="7" ry="5"/>
            <path d="M9 12h.01M15 12h.01"/>
            <path d="M10 15c.5.5 3.5.5 4 0"/>
            <path d="M5 9C3.5 8 3 6.5 3 5"/>
            <path d="M19 9c1.5-1 2-2.5 2-4"/>
            <path d="M8 4c0 0 1-2 4-2s4 2 4 2"/>
            <path d="M8 17l-1 3M16 17l1 3"/>
            <circle cx="9" cy="19" r="1" fill="currentColor"/>
            <circle cx="15" cy="19" r="1" fill="currentColor"/>
        </svg>
    );

    const BoarIcon = () => (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="12" cy="13" rx="7" ry="5"/>
            <path d="M9 13h.01M15 13h.01"/>
            <path d="M10 16c.5.5 3.5.5 4 0"/>
            <path d="M5 10C3.5 9 3 7 3 5.5"/>
            <path d="M19 10c1.5-1 2-3 2-4.5"/>
            <path d="M3 5.5L1 4M21 5.5L23 4"/>
            <path d="M8 18l-1 3M16 18l1 3"/>
            <path d="M16 8c1-1 3-1 3 1"/>
        </svg>
    );

    const NurseryIcon = () => (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="12" cy="14" rx="5" ry="4"/>
            <path d="M9 14h.01M15 14h.01"/>
            <path d="M10 17c.5.5 3.5.5 4 0"/>
            <path d="M7 11C5.5 10 5 8.5 5 7"/>
            <path d="M17 11c1.5-1 2-2.5 2-4"/>
            <path d="M9 19l-.5 2M15 19l.5 2"/>
            <path d="M9 9a3 3 0 016 0"/>
        </svg>
    );

    const GrowerIcon = () => (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="12" cy="13" rx="6" ry="4.5"/>
            <path d="M9 13h.01M15 13h.01"/>
            <path d="M10 16c.5.5 3.5.5 4 0"/>
            <path d="M6 10C4 9 3 7 3 5.5"/>
            <path d="M18 10c2-1 3-3 3-4.5"/>
            <path d="M8 18l-1 3M16 18l1 3"/>
            <path d="M8 8a4 4 0 018 0"/>
            <path d="M10 6l2-3 2 3"/>
        </svg>
    );

    const FinisherIcon = () => (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="12" cy="13" rx="7" ry="5"/>
            <path d="M9 13h.01M15 13h.01"/>
            <path d="M10 16c.5.5 3.5.5 4 0"/>
            <path d="M5 10C3.5 9 3 7 3 5.5"/>
            <path d="M19 10c1.5-1 2-3 2-4.5"/>
            <path d="M8 18l-1 3M16 18l1 3"/>
            <path d="M8 8a4 4 0 018 0"/>
            <path d="M7 10l1-2M17 10l-1-2"/>
        </svg>
    );

    // Poultry Specific icons
    const BroilerIcon = () => (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3c-1 0-2 .5-2 1.5S11 6 12 6s2-.5 2-1.5S13 3 12 3z"/>
            <path d="M8 6C6 6 4 8 4 11c0 2 1 3.5 3 4.5"/>
            <path d="M16 6c2 0 4 2 4 5 0 2-1 3.5-3 4.5"/>
            <ellipse cx="12" cy="16" rx="5" ry="4"/>
            <path d="M9 15h.01M15 15h.01"/>
            <path d="M9 20l-1 2M15 20l1 2"/>
        </svg>
    );

    const LayerIcon = () => (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3c-1 0-2 .5-2 1.5S11 6 12 6s2-.5 2-1.5S13 3 12 3z"/>
            <path d="M8 6C6 6 4 8 4 11c0 2 1 3.5 3 4.5"/>
            <path d="M16 6c2 0 4 2 4 5 0 2-1 3.5-3 4.5"/>
            <ellipse cx="12" cy="16" rx="5" ry="4"/>
            <path d="M9 15h.01M15 15h.01"/>
            <path d="M9 20l-1 2M15 20l1 2"/>
            <ellipse cx="18" cy="20" rx="2.5" ry="3" transform="rotate(-15 18 20)"/>
        </svg>
    );

    const ColorChickenIcon = () => (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3c-1 0-2 .5-2 1.5S11 6 12 6s2-.5 2-1.5S13 3 12 3z"/>
            <path d="M14 4c1-1 3-1.5 4-1"/>
            <path d="M8 6C6 6 4 8 4 11c0 2 1 3.5 3 4.5"/>
            <path d="M16 6c2 0 4 2 4 5 0 2-1 3.5-3 4.5"/>
            <ellipse cx="12" cy="16" rx="5" ry="4"/>
            <path d="M9 15h.01M15 15h.01"/>
            <path d="M9 20l-1 2M15 20l1 2"/>
            <path d="M10 13c.5-.5 1.5-.5 2 0"/>
        </svg>
    );

    const BroilerBreederIcon = () => (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 3c-.8 0-1.5.5-1.5 1.5S8.2 6 9 6s1.5-.5 1.5-1.5S9.8 3 9 3z"/>
            <path d="M6 6C4 6 2 8 2 11c0 2 1 3 2.5 4"/>
            <ellipse cx="9" cy="16" rx="4" ry="3.5"/>
            <path d="M7 20l-.5 2M11 20l.5 2"/>
            <path d="M15 3c.8 0 1.5.5 1.5 1.5S15.8 6 15 6s-1.5-.5-1.5-1.5S14.2 3 15 3z"/>
            <path d="M18 6c2 0 4 2 4 5 0 2-1 3-2.5 4"/>
            <ellipse cx="15" cy="16" rx="4" ry="3.5"/>
            <path d="M13 20l-.5 2M17 20l.5 2"/>
        </svg>
    );

    const LayerBreederIcon = () => (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 3c-.8 0-1.5.5-1.5 1.5S8.2 6 9 6s1.5-.5 1.5-1.5S9.8 3 9 3z"/>
            <path d="M6 6C4 6 2 8 2 11c0 2 1 3 2.5 4"/>
            <ellipse cx="9" cy="16" rx="4" ry="3.5"/>
            <path d="M7 20l-.5 2M11 20l.5 2"/>
            <ellipse cx="20" cy="19" rx="2" ry="2.5" transform="rotate(-10 20 19)"/>
            <path d="M15 3c.8 0 1.5.5 1.5 1.5S15.8 6 15 6s-1.5-.5-1.5-1.5S14.2 3 15 3z"/>
            <ellipse cx="15" cy="15" rx="3.5" ry="3"/>
            <path d="M13 19l-.5 2M17 19l.5 2"/>
        </svg>
    );

    const ColorBreederIcon = () => (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 3c-.8 0-1.5.5-1.5 1.5S8.2 6 9 6s1.5-.5 1.5-1.5S9.8 3 9 3z"/>
            <path d="M10.5 4c.8-.8 2.5-1.2 3.5-.8"/>
            <path d="M6 6C4 6 2 8 2 11c0 2 1 3 2.5 4"/>
            <ellipse cx="9" cy="16" rx="4" ry="3.5"/>
            <path d="M7 20l-.5 2M11 20l.5 2"/>
            <path d="M15 3c.8 0 1.5.5 1.5 1.5S15.8 6 15 6s-1.5-.5-1.5-1.5S14.2 3 15 3z"/>
            <path d="M18 6c2 0 4 2 4 5 0 2-1 3-2.5 4"/>
            <ellipse cx="15" cy="16" rx="4" ry="3.5"/>
            <path d="M13 20l-.5 2M17 20l.5 2"/>
        </svg>
    );

    const specificCategoryIcons = {
        sow_gestation: <SowGestationIcon />,
        sow_lactation: <SowLactationIcon />,
        boar: <BoarIcon />,
        nursery: <NurseryIcon />,
        grower: <GrowerIcon />,
        finisher: <FinisherIcon />,
        broiler_breeder: <BroilerBreederIcon />,
        layer_breeder: <LayerBreederIcon />,
        color_breeder: <ColorBreederIcon />,
        broiler: <BroilerIcon />,
        layer: <LayerIcon />,
        color_chicken: <ColorChickenIcon />,
    };

    const FeedApplicationIcon = () => (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: 14, height: 14, stroke: 'var(--fw-green3)', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
            <path d="M3 7h18M3 12h18M3 17h18"/>
        </svg>
    );

    const WaterApplicationIcon = () => (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: 14, height: 14, stroke: 'var(--fw-green3)', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
            <path d="M12 2l6 9a6 6 0 11-12 0l6-9z"/>
        </svg>
    );

    return (
        <div className="fw-module-page">

            {/* ── COMPACT HEADER ── */}
            <div className="fw-mod-top">
                <div
                    className="fw-mod-top-logo"
                    onClick={() => navigate('/')}
                    title="Back to Home"
                >
                    <img src="/images/feed_additives_logo.svg" alt="Feed Module" />
                </div>
                <div className="fw-mod-top-lang">
                    {languages.map(lang => (
                        <button
                            key={lang.code}
                            className={`fw-mod-top-lang-btn${language === lang.code ? ' active' : ''}`}
                            onClick={() => setLanguage(lang.code)}
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── WHITE CARD ── */}
            <div className="fw-mod-card">

                {/* Step indicator */}
                <div className="fw-mod-steps">
                    {[
                        { n: 1, label: t('step1') || 'Animal' },
                        { n: 2, label: t('step2') || 'Flock' },
                        { n: 3, label: t('step3') || 'Product' },
                        { n: 4, label: t('step4') || 'Results' },
                    ].map((step, i, arr) => (
                        <React.Fragment key={step.n}>
                            <div className="fw-mod-step">
                                <div className={`fw-mod-step-circle ${currentStep > step.n ? 'done' : currentStep === step.n ? 'active' : 'pending'}`}>
                                    {step.n}
                                </div>
                                <div className={`fw-mod-step-label${currentStep === step.n ? ' active' : ''}`}>
                                    {step.label}
                                </div>
                            </div>
                            {i < arr.length - 1 && (
                                <div className={`fw-mod-step-line${currentStep > step.n ? ' done' : ''}`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Scrollable content */}
                <div className="fw-mod-content">
                    {/* Reference Data View Toggle */}
                    {!showReferenceView && currentStep === 1 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>
                                {t('selectAnimal')}
                            </h2>
                            <button
                                onClick={() => setShowReferenceView(true)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: '#10b981',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    fontWeight: '600'
                                }}
                            >
                                {t('viewReferenceData')}
                            </button>
                        </div>
                    )}

                    {/* Reference Data Page */}
                    {showReferenceView ? (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>
                                    {t('referenceData')}
                                </h2>
                                <button
                                    className="fw-ref-back-btn"
                                    onClick={() => setShowReferenceView(false)}
                                >
                                    {t('backToCalculator') || 'Back to Calculator'}
                                </button>
                            </div>

                            {/* Animal Selection for Reference */}
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', fontWeight: '600', marginBottom: '1rem' }}>
                                    {t('selectAnimalType')}
                                </label>
                                <div className="fw-animal-grid" style={{ marginBottom: '1.5rem' }}>
                                    {['swine', 'poultry'].map(type => (
                                        <div
                                            key={type}
                                            onClick={() => {
                                                setReferenceSelection({
                                                    animalType: type,
                                                    productionCategory: '',
                                                    specificCategory: ''
                                                });
                                            }}
                                            className={`fw-animal-card${referenceSelection.animalType === type ? ' selected' : ''}`}
                                        >
                                            <div className="fw-animal-card-icon">
                                                {type === 'swine' ? <SwineIcon /> : <PoultryIcon />}
                                            </div>
                                            <div className="fw-animal-card-name" style={{ textTransform: 'capitalize' }}>
                                                {t(type)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Production Category */}
                                {referenceSelection.animalType && (
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '1rem' }}>
                                            {t('selectProductionCategory')}
                                        </label>
                                        <div className="fw-animal-grid">
                                            {['breeding', 'commercial'].map(cat => (
                                                <div
                                                    key={cat}
                                                    className={`fw-animal-card${referenceSelection.productionCategory === cat ? ' selected' : ''}`}
                                                    onClick={() => {
                                                        setReferenceSelection(prev => ({
                                                            ...prev,
                                                            productionCategory: cat,
                                                            specificCategory: ''
                                                        }));
                                                    }}
                                                >
                                                    <div className="fw-animal-card-icon">
                                                        {cat === 'breeding' ? <BreedingIcon /> : <CommercialIcon />}
                                                    </div>
                                                    <div className="fw-animal-card-name" style={{ textTransform: 'capitalize' }}>
                                                        {t(cat)}
                                                    </div>
                                                </div>
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
                                        <div className="fw-animal-grid">
                                            {animalCategories[referenceSelection.animalType][referenceSelection.productionCategory].map(cat => (
                                                <div
                                                    key={cat.id}
                                                    className={`fw-animal-card${referenceSelection.specificCategory === cat.id ? ' selected' : ''}`}
                                                    onClick={() => {
                                                        setReferenceSelection(prev => ({
                                                            ...prev,
                                                            specificCategory: cat.id
                                                        }));
                                                    }}
                                                >
                                                    <div className="fw-animal-card-icon">
                                                        {specificCategoryIcons[cat.id] || <CommercialIcon />}
                                                    </div>
                                                    <div className="fw-animal-card-name">{t(cat.id)}</div>
                                                </div>
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
                                    <div className="fw-ref-header">
                                        <div className="fw-ref-title">
                                            {referenceSelection.specificCategory === 'broiler_breeder'
                                                ? t('broilerBreederReferenceTitle')
                                                : referenceSelection.specificCategory === 'broiler'
                                                    ? t('commercialTitle')
                                                    : referenceSelection.specificCategory === 'layer'
                                                        ? t('layerTitle')
                                                        : referenceSelection.specificCategory === 'color_chicken'
                                                            ? t('colorTitle')
                                                            : (t('referenceDataTitle') || 'Reference Data') + ': ' + (animalCategories[referenceSelection.animalType][referenceSelection.productionCategory].find(c => c.id === referenceSelection.specificCategory)?.label || '')
                                            }
                                        </div>
                                        <div className="fw-ref-actions">
                                            <button className="fw-ref-btn excel no-print" onClick={exportReferenceToExcel}>
                                                {t('exportExcel') || 'Export Excel'}
                                            </button>
                                            <button className="fw-ref-btn pdf no-print" onClick={printReferenceData}>
                                                {t('printPDF') || 'Print PDF'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Broiler - Daily Data from Comprehensive Database */}
                                    {referenceSelection.specificCategory === 'broiler' && (
                                        <div>
                                            <div className="fw-ref-info-box">
                                                <div className="fw-ref-info-title">{t('dailyPerformanceData') || 'Daily Performance Data'}</div>
                                                <div className="fw-ref-info-desc">
                                                    {t('commercialSource') || 'Ross 308 Performance Objectives'}
                                                    <br />
                                                    {t('commercialBreed') || 'Ross 308 Broiler'}
                                                </div>
                                            </div>
                                            <div className="fw-ref-table-wrap">
                                                <table className="fw-ref-table">
                                                    <thead>
                                                        <tr>
                                                            <th>{t('commercialTableHeaders.day') || 'Day No.'}</th>
                                                            <th>{t('commercialTableHeaders.bodyWeight') || 'Body Weight (g)'}</th>
                                                            <th>{t('commercialTableHeaders.feed') || 'Feed (g/day)'}</th>
                                                            <th>{t('commercialTableHeaders.water') || 'Water (ml/day)'}</th>
                                                            <th>{t('commercialTableHeaders.fcr') || 'FCR'}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {consumptionData.poultry_commercial.broiler.daily_data.map(dayData => (
                                                            <tr key={dayData.day} style={{ background: dayData.day % 7 === 0 ? '#f3f4f6' : 'white' }}>
                                                                <td style={{ fontWeight: dayData.day % 7 === 0 ? 600 : 400 }}>{dayData.day}</td>
                                                                <td>{dayData.bw_g}</td>
                                                                <td>{dayData.feed_g}</td>
                                                                <td>{dayData.water_ml}</td>
                                                                <td>{dayData.fcr.toFixed(3)}</td>
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
                                            <div className="fw-ref-info-box">
                                                <div className="fw-ref-info-title">{t('completeWeeklyDataLayer') || 'Complete Weekly Data — Layer'}</div>
                                                <div className="fw-ref-info-desc">
                                                    {t('layerSource') || 'Hy-Line W-36 Management Guide'}<br />
                                                    {t('layerBreed') || 'Hy-Line W-36'}
                                                </div>
                                            </div>

                                            {/* Rearing Phase */}
                                            <div className="fw-ref-phase-title">{t('rearingPhase') || 'Rearing Phase'}</div>
                                            <div className="fw-ref-table-wrap">
                                                <table className="fw-ref-table">
                                                    <thead>
                                                        <tr>
                                                            <th>{t('layerTableHeaders.week') || 'Week No.'}</th>
                                                            <th>Feed (g/day)</th>
                                                            <th>Water (ml/day)</th>
                                                            <th>Body Weight (g)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {consumptionData.poultry_commercial.layer.rearing_weeks_1_18.map(data => {
                                                            const avgFeed = ((data.feed_g_min + data.feed_g_max) / 2).toFixed(1);
                                                            const avgWater = ((data.water_ml_min + data.water_ml_max) / 2).toFixed(1);
                                                            const avgBW = ((data.bw_g_min + data.bw_g_max) / 2).toFixed(0);
                                                            return (
                                                                <tr key={data.week}>
                                                                    <td>{data.week}</td>
                                                                    <td>{avgFeed}</td>
                                                                    <td>{avgWater}</td>
                                                                    <td>{avgBW}</td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Production Phase */}
                                            <div className="fw-ref-phase-title">{t('productionPhase') || 'Production Phase'}</div>
                                            <div className="fw-ref-table-wrap">
                                                <table className="fw-ref-table">
                                                    <thead>
                                                        <tr>
                                                            <th>{t('layerTableHeaders.week') || 'Week No.'}</th>
                                                            <th>Production %</th>
                                                            <th>Feed (g/day)</th>
                                                            <th>Water (ml/day)</th>
                                                            <th>Egg Weight (g)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {consumptionData.poultry_commercial.layer.production_weeks_18_100.map(data => (
                                                            <tr key={data.week} style={{ background: data.week % 10 === 0 ? '#f3f4f6' : 'white' }}>
                                                                <td style={{ fontWeight: data.week % 10 === 0 ? 600 : 400 }}>{data.week}</td>
                                                                <td>{data.prod_pct.toFixed(1)}%</td>
                                                                <td>{data.feed_g}</td>
                                                                <td>{data.water_ml}</td>
                                                                <td>{data.egg_wt_g}</td>
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
                                            <div className="fw-ref-info-box">
                                                <div className="fw-ref-info-title">{t('calculationMethod') || 'Calculation Method'}</div>
                                                <div className="fw-ref-info-desc">
                                                    Water (ml/bird/day) = 5.28 × Age (days) × 0.70<br />
                                                    Feed (g/bird/day) = Water ÷ 1.77
                                                </div>
                                            </div>
                                            <div className="fw-ref-table-wrap">
                                                <table className="fw-ref-table">
                                                    <thead>
                                                        <tr>
                                                            <th>{t('colorTableHeaders.day') || 'Day No.'}</th>
                                                            <th>Water (ml/bird/day)</th>
                                                            <th>Feed (g/bird/day)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Array.from({ length: 71 }, (_, i) => i).map(day => {
                                                            const water = 5.28 * day * 0.7;
                                                            const feed = water / 1.77;
                                                            return (
                                                                <tr key={day} style={{ background: day % 7 === 0 ? '#f3f4f6' : 'white' }}>
                                                                    <td style={{ fontWeight: day % 7 === 0 ? 600 : 400 }}>{day}</td>
                                                                    <td>{water.toFixed(1)}</td>
                                                                    <td>{feed.toFixed(1)}</td>
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
                                            <div className="fw-ref-info-box">
                                                <div className="fw-ref-info-title">{t('completeWeeklyDataBroilerBreeder') || 'Complete Weekly Data — Broiler Breeder'}</div>
                                                <div className="fw-ref-info-desc">
                                                    {t('broilerBreederSource') || 'Ross 308 Parent Stock Management Guide'}<br />
                                                    {t('broilerBreederBreed') || 'Ross 308 Parent Stock'}<br />
                                                    {t('broilerBreederNote') || 'Female data. Male values differ.'}
                                                </div>
                                            </div>

                                            {/* Complete Table - All Weeks */}
                                            <div className="fw-ref-table-wrap">
                                                <table className="fw-ref-table">
                                                    <thead>
                                                        <tr>
                                                            <th>{t('tableHeaderWeek') || 'Week No.'}</th>
                                                            <th>{t('tableHeaderDays')}</th>
                                                            <th>{t('tableHeaderBW')}</th>
                                                            <th>{t('tableHeaderGain')}</th>
                                                            <th>{t('tableHeaderFeed')}</th>
                                                            <th>{t('tableHeaderWater')}</th>
                                                            <th>{t('tableHeaderEnergy')}</th>
                                                            <th>{t('tableHeaderNote')}</th>
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
                                                                    <td style={{ fontWeight: data.week % 10 === 0 ? 600 : 400 }}>{data.week}</td>
                                                                    <td>{data.days}</td>
                                                                    <td>{data.bw_g}</td>
                                                                    <td>{data.gain_g}</td>
                                                                    <td>{data.feed_g}</td>
                                                                    <td>{(data.feed_g * 1.8).toFixed(0)}</td>
                                                                    <td>{data.energy_kcal}</td>
                                                                    <td style={{ fontSize: '0.875rem', color: '#059669' }}>
                                                                        {data.note || (data.week === 64 ? t('endOfCycle') : '-')}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="fw-ref-info-box" style={{ background: '#fef3c7' }}>
                                                <div className="fw-ref-info-title">{t('keyMilestones')}</div>
                                                <div className="fw-ref-info-desc">
                                                    <ul style={{ marginLeft: '1.5rem', marginTop: '4px' }}>
                                                        <li><strong>Week 0</strong>: {t('milestoneWeek0').split(': ')[1]}</li>
                                                        <li><strong>Week 21</strong>: {t('milestoneWeek21').split(': ')[1]}</li>
                                                        <li><strong>Week 25</strong>: {t('milestoneWeek25').split(': ')[1]}</li>
                                                        <li><strong>Week 30</strong>: {t('milestoneWeek30').split(': ')[1]}</li>
                                                        <li><strong>Week 64</strong>: {t('milestoneWeek64').split(': ')[1]}</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Color Breeder - Complete Weekly Data */}
                                    {referenceSelection.specificCategory === 'color_breeder' && (
                                        <div>
                                            <div className="fw-ref-info-box">
                                                <div className="fw-ref-info-title">{t('completeWeeklyDataColorBreeder') || 'Complete Weekly Data — Color Breeder'}</div>
                                                <div className="fw-ref-info-desc">
                                                    {t('broilerBreederSource') || 'Ross 308 Parent Stock Management Guide'}<br />
                                                    {t('broilerBreederBreed') || 'Ross 308 Parent Stock'}
                                                </div>
                                            </div>

                                            {/* Rearing Phase */}
                                            <div className="fw-ref-phase-title">{t('pulletRearingPhase') || 'Pullet Rearing Phase'}</div>
                                            <div className="fw-ref-table-wrap">
                                                <table className="fw-ref-table">
                                                    <thead>
                                                        <tr>
                                                            <th>{t('tableHeaderWeek') || 'Week No.'}</th>
                                                            <th>{t('tableHeaderFeed')}</th>
                                                            <th>{t('tableHeaderWater')}</th>
                                                            <th>{t('tableHeaderBW')}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {consumptionData.poultry_breeding.color_breeder.female_pullet_rearing_weeks_0_24.map(data => (
                                                            <tr key={data.week}>
                                                                <td>{data.week}</td>
                                                                <td>{data.feed_g}</td>
                                                                <td>{(data.feed_g * 2.0).toFixed(0)}</td>
                                                                <td>{data.bw_g}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Production Phase */}
                                            <div className="fw-ref-phase-title">{t('productionPhase') || 'Production Phase'} - 20°C</div>
                                            <div className="fw-ref-table-wrap">
                                                <table className="fw-ref-table">
                                                    <thead>
                                                        <tr>
                                                            <th>{t('tableHeaderWeek') || 'Week No.'}</th>
                                                            <th>Production %</th>
                                                            <th>{t('tableHeaderFeed')}</th>
                                                            <th>{t('tableHeaderWater')}</th>
                                                            <th>{t('tableHeaderNote')}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {consumptionData.poultry_breeding.color_breeder.female_production_20C_weeks_24_70.map(data => (
                                                            <tr key={data.week} style={{ background: data.note ? '#fef3c7' : 'white' }}>
                                                                <td>{data.week}</td>
                                                                <td>{data.prod_pct}%</td>
                                                                <td>{data.feed_g}</td>
                                                                <td>{(data.feed_g * 2.0).toFixed(0)}</td>
                                                                <td style={{ fontSize: '0.875rem', color: '#059669' }}>
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
                                            <div className="fw-ref-info-box">
                                                <div className="fw-ref-info-title">Layer Breeder Data</div>
                                                <div className="fw-ref-info-desc">
                                                    {t('layerBreederRearingNote')}<br />
                                                    {t('layerBreederProductionNote')}
                                                </div>
                                            </div>

                                            {/* Rearing Phase */}
                                            <div className="fw-ref-phase-title">{t('rearingPhase') || 'Rearing Phase'}</div>
                                            <div className="fw-ref-table-wrap">
                                                <table className="fw-ref-table">
                                                    <thead>
                                                        <tr>
                                                            <th>{t('layerTableHeaders.week') || 'Week No.'}</th>
                                                            <th>Feed (g/day)</th>
                                                            <th>Water (ml/day)</th>
                                                            <th>Body Weight (g)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {consumptionData.poultry_commercial.layer.rearing_weeks_1_18.map(data => {
                                                            const avgFeed = ((data.feed_g_min + data.feed_g_max) / 2).toFixed(1);
                                                            const avgWater = ((data.water_ml_min + data.water_ml_max) / 2).toFixed(1);
                                                            const avgBW = ((data.bw_g_min + data.bw_g_max) / 2).toFixed(0);
                                                            return (
                                                                <tr key={data.week}>
                                                                    <td>{data.week}</td>
                                                                    <td>{avgFeed}</td>
                                                                    <td>{avgWater}</td>
                                                                    <td>{avgBW}</td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Production Phase */}
                                            <div className="fw-ref-phase-title">{t('productionPhase') || 'Production Phase'}</div>
                                            <div className="fw-ref-info-box" style={{ background: 'white' }}>
                                                <div className="fw-ref-info-title">{t('fixedBreedingValues')}</div>
                                                <div className="fw-ref-info-desc">
                                                    Feed: 160 g/bird/day<br />
                                                    Water: 280 ml/bird/day<br />
                                                    <em style={{ color: 'var(--fw-muted)' }}>{t('feedRestrictionNote')}</em>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Swine - Weight Based */}
                                    {['nursery', 'grower', 'finisher'].includes(referenceSelection.specificCategory) && (
                                        <div>
                                            <div className="fw-ref-info-box">
                                                <div className="fw-ref-info-title">{t('calcMethodWeightBased')}</div>
                                                <div className="fw-ref-info-desc">
                                                    {t('dataSourceNRC11th')}
                                                </div>
                                            </div>
                                            <div className="fw-ref-table-wrap">
                                                <table className="fw-ref-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Weight (kg)</th>
                                                            <th>Water (L/pig/day)</th>
                                                            <th>Feed (kg/pig/day)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {consumptionData.swine_commercial[referenceSelection.specificCategory].data_by_weight.map(data => (
                                                            <tr key={data.weight_kg}>
                                                                <td>{data.weight_kg}</td>
                                                                <td>{data.water_L}</td>
                                                                <td>{data.feed_kg}</td>
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
                                            <div className="fw-ref-info-box">
                                                <div className="fw-ref-info-title">{t('calcMethodFixed')}</div>
                                                <div className="fw-ref-info-desc">
                                                    {t('dataSourceNRC')}
                                                </div>
                                            </div>
                                            <div className="fw-ref-info-box" style={{ background: 'white' }}>
                                                {referenceSelection.specificCategory === 'sow_gestation' && (
                                                    <div>
                                                        <p style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>{t('sow_gestation')}</p>
                                                        <p>{t('waterTemplate').replace('{value}', '15').replace('{animal}', 'sow')}</p>
                                                        <p>{t('feedTemplate').replace('{value}', '2.5').replace('{animal}', 'sow')}</p>
                                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem', fontStyle: 'italic' }}>
                                                            {t('noteSowGestation')}
                                                        </p>
                                                    </div>
                                                )}
                                                {referenceSelection.specificCategory === 'sow_lactation' && (
                                                    <div>
                                                        <p style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>{t('sow_lactation')}</p>
                                                        <p>{t('waterTemplate').replace('{value}', '25').replace('{animal}', 'sow')}</p>
                                                        <p>{t('feedTemplate').replace('{value}', '6.0').replace('{animal}', 'sow')}</p>
                                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem', fontStyle: 'italic' }}>
                                                            {t('noteSowLactation')}
                                                        </p>
                                                    </div>
                                                )}
                                                {referenceSelection.specificCategory === 'boar' && (
                                                    <div>
                                                        <p style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>{t('boar')}</p>
                                                        <p>{t('waterTemplate').replace('{value}', '15').replace('{animal}', 'boar')}</p>
                                                        <p>{t('feedTemplate').replace('{value}', '2.5').replace('{animal}', 'boar')}</p>
                                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem', fontStyle: 'italic' }}>
                                                            {t('noteBoar')}
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

                                    {/* Animal Type Selection */}
                                    <div style={{ marginBottom: '2rem' }}>
                                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '1rem', fontSize: '1.125rem' }}>
                                            {t('selectAnimalType')}
                                        </label>
                                        <div className="fw-animal-grid">
                                            {['swine', 'poultry'].map(type => (
                                                <div
                                                    key={type}
                                                    onClick={() => {
                                                        updateData('animalType', type);
                                                        updateData('productionCategory', '');
                                                        updateData('specificCategory', '');
                                                    }}
                                                    className={`fw-animal-card${calculationData.animalType === type ? ' selected' : ''}`}
                                                >
                                                    <div className="fw-animal-card-icon">
                                                        {type === 'swine' ? <SwineIcon /> : <PoultryIcon />}
                                                    </div>
                                                    <div className="fw-animal-card-name" style={{ textTransform: 'capitalize' }}>
                                                        {t(type)}
                                                    </div>
                                                    <div className="fw-animal-card-desc">
                                                        {type === 'swine'
                                                            ? t('swineDescription')
                                                            : t('poultryDescription')}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Production Category */}
                                    {calculationData.animalType && (
                                        <div style={{ marginBottom: '2rem' }}>
                                            <label style={{ display: 'block', fontWeight: '600', marginBottom: '1rem', fontSize: '1.125rem' }}>
                                                {t('selectProductionCategory')}
                                            </label>
                                            <div className="fw-animal-grid">
                                                {['breeding', 'commercial'].map(category => (
                                                    <div
                                                        key={category}
                                                        className={`fw-animal-card${calculationData.productionCategory === category ? ' selected' : ''}`}
                                                        onClick={() => {
                                                            updateData('productionCategory', category);
                                                            updateData('specificCategory', '');
                                                        }}
                                                    >
                                                        <div className="fw-animal-card-icon">
                                                            {category === 'breeding' ? <BreedingIcon /> : <CommercialIcon />}
                                                        </div>
                                                        <div className="fw-animal-card-name" style={{ textTransform: 'capitalize' }}>
                                                            {t(category)}
                                                        </div>
                                                        <div className="fw-animal-card-desc">
                                                            {category === 'breeding'
                                                                ? t('breedingDescription').replace('{animalType}', t(`animalType${calculationData.animalType.charAt(0).toUpperCase() + calculationData.animalType.slice(1)}`))
                                                                : t('commercialDescription').replace('{animalType}', t(`animalType${calculationData.animalType.charAt(0).toUpperCase() + calculationData.animalType.slice(1)}`))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Specific Category */}
                                    {calculationData.productionCategory && (
                                        <div style={{ marginBottom: '2rem' }}>
                                            <label style={{ display: 'block', fontWeight: '600', marginBottom: '1rem', fontSize: '1.125rem' }}>
                                                {t('selectSpecificCategory')}
                                            </label>
                                            <div className="fw-animal-grid">
                                                {animalCategories[calculationData.animalType][calculationData.productionCategory].map(cat => (
                                                    <div
                                                        key={cat.id}
                                                        className={`fw-animal-card${calculationData.specificCategory === cat.id ? ' selected' : ''}`}
                                                        onClick={() => updateData('specificCategory', cat.id)}
                                                    >
                                                        <div className="fw-animal-card-icon">
                                                            {specificCategoryIcons[cat.id] || <CommercialIcon />}
                                                        </div>
                                                        <div className="fw-animal-card-name">{t(cat.id)}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Step 2: Flock/Herd Information */}
                            {currentStep === 2 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                                    {/* Population */}
                                    <div className="fw-form-group">
                                        <label className="fw-form-label">{t('populationSize')}</label>
                                        <input
                                            className="fw-form-input"
                                            type="number"
                                            value={calculationData.population}
                                            onChange={(e) => updateData('population', e.target.value)}
                                            placeholder="e.g. 10000"
                                            min="1"
                                        />
                                    </div>

                                    {/* Age */}
                                    <div className="fw-form-group">
                                        <label className="fw-form-label">{t('currentAge')}</label>
                                        <div className="fw-form-row">
                                            <input
                                                className="fw-form-input"
                                                type="number"
                                                value={calculationData.age}
                                                onChange={(e) => updateData('age', e.target.value)}
                                                placeholder="e.g. 21"
                                                min="1"
                                            />
                                            <select
                                                className="fw-form-select"
                                                value={calculationData.ageUnit}
                                                onChange={(e) => updateData('ageUnit', e.target.value)}
                                            >
                                                <option value="days">{t('days')}</option>
                                                <option value="weeks">{t('weeks')}</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Gender — only for breeders */}
                                    {calculationData.productionCategory === 'breeding' && (
                                        <div className="fw-form-group">
                                            <label className="fw-form-label">{t('genderLabel')}</label>
                                            <select
                                                className="fw-form-select"
                                                value={calculationData.gender}
                                                onChange={(e) => updateData('gender', e.target.value)}
                                            >
                                                <option value="female">{t('genderFemale')}</option>
                                                <option value="male">{t('genderMale')}</option>
                                                <option value="mixed">{t('genderMixed')}</option>
                                            </select>

                                            {calculationData.gender === 'mixed' && (
                                                <div className="fw-form-sub-box">
                                                    <label className="fw-form-label">{t('genderRatio')}</label>
                                                    <div className="fw-form-ratio">
                                                        <input
                                                            className="fw-form-input"
                                                            type="number"
                                                            value={calculationData.femaleRatio}
                                                            onChange={(e) => updateData('femaleRatio', e.target.value)}
                                                            min="1"
                                                            placeholder="♀"
                                                        />
                                                        <span className="fw-form-ratio-sep">:</span>
                                                        <input
                                                            className="fw-form-input"
                                                            type="number"
                                                            value={calculationData.maleRatio}
                                                            onChange={(e) => updateData('maleRatio', e.target.value)}
                                                            min="1"
                                                            placeholder="♂"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                </div>
                            )}

                            {/* Step 3: Product Selection */}
                            {currentStep === 3 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                                    {/* Product list */}
                                    <div className="fw-product-list">
                                        {getAvailableProducts().map(product => {
                                            const isSelected = calculationData.selectedProduct?.id === product.id;
                                            const perUnit = product.application.dosage.per_unit
                                                ? (product.application.dosage.per_unit.includes('ton') ? ' ton' : ` ${product.application.dosage.per_unit}`)
                                                : ' ton';
                                            const dosageText = `${product.application.dosage.amount}${product.application.dosage.unit} / ${product.application.dosage.per}${perUnit}`;
                                            const benefits = (product.benefits.primary[language] || product.benefits.primary['en']).slice(0, 2);

                                            return (
                                                <div
                                                    key={product.id}
                                                    className={`fw-product-card${isSelected ? ' selected' : ''}`}
                                                    onClick={() => updateData('selectedProduct', product)}
                                                >
                                                    <div className="fw-product-card-top">
                                                        <div className="fw-product-card-name">{product.name}</div>
                                                        {product.popular && (
                                                            <span className="fw-product-popular-badge">{t('popular')}</span>
                                                        )}
                                                    </div>

                                                    <div className="fw-product-meta">
                                                        <span className="fw-product-method-badge">
                                                            {product.application.method === 'feed' ? t('applicationFeed') || 'Feed' : t('applicationWater') || 'Water'}
                                                        </span>
                                                        <span className="fw-product-dosage">{dosageText}</span>
                                                    </div>

                                                    <div className="fw-product-benefits">
                                                        {benefits.map((benefit, i) => (
                                                            <div key={i} className="fw-product-benefit-item">{benefit}</div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Price input — only shows when product selected */}
                                    {calculationData.selectedProduct && (
                                        <div className="fw-price-box">
                                            <div className="fw-price-box-title">{t('productPrice') || 'Product Price'}</div>
                                            <div className="fw-price-input-row">
                                                <input
                                                    className="fw-form-input"
                                                    type="number"
                                                    value={calculationData.productPrice}
                                                    onChange={(e) => updateData('productPrice', e.target.value)}
                                                    min="0"
                                                    step="1000"
                                                />
                                                <span className="fw-price-unit">VND/kg</span>
                                            </div>
                                            <div className="fw-price-hint">{t('enterPriceHint') || 'Enter price per kilogram'}</div>
                                        </div>
                                    )}

                                </div>
                            )}

                            {/* Step 4: Protocol & Results */}
                            {currentStep === 4 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                                    {/* Template Protocol */}
                                    <div className="fw-form-group">
                                        <label className="fw-form-label">{t('templateProtocol') || 'Template Protocol'}</label>
                                        <div className="fw-protocol-grid">
                                            <div
                                                className={`fw-protocol-card${calculationData.protocolPeriods.length === 2 ? ' selected' : ''}`}
                                                onClick={() => useTemplate('standard')}
                                            >
                                                <div className="fw-protocol-card-name">{t('standardPreventionTitle') || 'Standard Prevention'}</div>
                                                <div className="fw-protocol-card-desc">{t('standardPreventionDesc') || 'Day 1-5 + Day 25-29'}</div>
                                            </div>
                                            <div
                                                className={`fw-protocol-card${calculationData.protocolPeriods.length === 1 && calculationData.protocolPeriods[0].endDay === 7 ? ' selected' : ''}`}
                                                onClick={() => useTemplate('intensive')}
                                            >
                                                <div className="fw-protocol-card-name">{t('intensiveTreatmentTitle') || 'Intensive Treatment'}</div>
                                                <div className="fw-protocol-card-desc">{t('intensiveTreatmentDesc') || 'Day 1-7 continuous'}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Custom Protocol Toggle */}
                                    <button
                                        className="fw-custom-protocol-toggle"
                                        onClick={() => setShowCustomProtocol(!showCustomProtocol)}
                                    >
                                        {showCustomProtocol ? '− ' + (t('hideCustomProtocol') || 'Hide Custom Protocol') : '+ ' + (t('createCustomProtocol') || 'Create Custom Protocol')}
                                    </button>

                                    {/* Custom Protocol Builder */}
                                    {showCustomProtocol && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {calculationData.protocolPeriods.map((period, index) => (
                                                <div key={index} className="fw-form-sub-box">
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <span className="fw-form-label">{t('periodLabel') || 'Period'} {index + 1}</span>
                                                        {calculationData.protocolPeriods.length > 1 && (
                                                            <button
                                                                onClick={() => removePeriod(index)}
                                                                style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', padding: '3px 10px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                                                            >
                                                                {t('removeButton') || 'Remove'}
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="fw-form-row">
                                                        <div className="fw-form-group" style={{ flex: 1 }}>
                                                            <label className="fw-form-label">{t('startDayLabel') || 'Start Day'}</label>
                                                            <input className="fw-form-input" type="number" value={period.startDay} min="1"
                                                                onChange={(e) => updatePeriod(index, 'startDay', e.target.value)} />
                                                        </div>
                                                        <div className="fw-form-group" style={{ flex: 1 }}>
                                                            <label className="fw-form-label">{t('endDayLabel') || 'End Day'}</label>
                                                            <input className="fw-form-input" type="number" value={period.endDay} min={period.startDay}
                                                                onChange={(e) => updatePeriod(index, 'endDay', e.target.value)} />
                                                        </div>
                                                        <div className="fw-form-group" style={{ flex: 0.8 }}>
                                                            <label className="fw-form-label">Duration</label>
                                                            <div className="fw-form-input" style={{ background: 'var(--fw-green-ltr)', color: 'var(--fw-green3)', fontWeight: 700 }}>
                                                                {period.endDay - period.startDay + 1}d
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <button
                                                onClick={addPeriod}
                                                style={{ background: 'var(--fw-green-lt)', color: 'var(--fw-green3)', border: 'none', borderRadius: '10px', padding: '10px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                                            >
                                                + {t('addPeriod') || 'Add Another Period'}
                                            </button>
                                        </div>
                                    )}

                                    {/* Calculate Button */}
                                    <button className="fw-calculate-btn" onClick={calculateResults}>
                                        {t('calculateDosage') || 'Calculate Dosage & Cost'}
                                    </button>

                                    {/* Results */}
                                    {calculationData.results && (
                                        <div className="fw-results-box">
                                            <div className="fw-results-title">{t('calculationResults') || 'Calculation Results'}</div>

                                            {/* Summary */}
                                            <div className="fw-results-summary">
                                                <div className="fw-results-summary-item">
                                                    <div className="fw-results-summary-label">{t('product') || 'Product'}</div>
                                                    <div className="fw-results-summary-value">{calculationData.selectedProduct.name}</div>
                                                </div>
                                                <div className="fw-results-summary-item">
                                                    <div className="fw-results-summary-label">{t('population') || 'Population'}</div>
                                                    <div className="fw-results-summary-value">{parseInt(calculationData.population).toLocaleString()}</div>
                                                </div>
                                                <div className="fw-results-summary-item">
                                                    <div className="fw-results-summary-label">{t('totalTreatmentDays') || 'Treatment Days'}</div>
                                                    <div className="fw-results-summary-value">{calculationData.results.totalDays} {t('days') || 'days'}</div>
                                                </div>
                                                <div className="fw-results-summary-item">
                                                    <div className="fw-results-summary-label">{t('numberOfPeriods') || 'Periods'}</div>
                                                    <div className="fw-results-summary-value">{calculationData.protocolPeriods.length}</div>
                                                </div>
                                            </div>

                                            {/* Period Breakdown */}
                                            <div className="fw-form-label" style={{ marginBottom: '-6px' }}>{t('periodBreakdown') || 'Period Breakdown'}</div>
                                            {calculationData.results.periods.map((period, index) => (
                                                <div key={index} className="fw-period-card">
                                                    <div className="fw-period-card-title">
                                                        {t('period') || 'Period'} {index + 1}: {t('day') || 'Day'} {period.startDay}–{period.endDay} ({period.days} {t('days') || 'days'})
                                                    </div>
                                                    <div className="fw-period-stats">
                                                        <div className="fw-period-stat">{t('totalWater') || 'Water'}: {parseFloat(period.totalWaterL).toLocaleString()} L</div>
                                                        <div className="fw-period-stat">{t('totalFeed') || 'Feed'}: {parseFloat(period.totalFeedKg).toLocaleString()} kg</div>
                                                        <div className="fw-period-stat highlight">{t('productNeeded') || 'Product'}: {parseFloat(period.productNeeded).toLocaleString()} g</div>
                                                        <div className="fw-period-stat cost">{t('cost') || 'Cost'}: {parseInt(period.cost).toLocaleString()} VND</div>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Total Investment */}
                                            <div className="fw-total-investment">
                                                <div className="fw-total-investment-title">{t('totalInvestment') || 'Total Investment'}</div>
                                                <div className="fw-total-investment-grid">
                                                    <div>
                                                        <div className="fw-total-investment-item-label">{t('totalProduct') || 'Total Product'}</div>
                                                        <div className="fw-total-investment-item-value">{(calculationData.results.totalProductGrams / 1000).toFixed(2)} kg</div>
                                                    </div>
                                                    <div>
                                                        <div className="fw-total-investment-item-label">{t('totalCost') || 'Total Cost'}</div>
                                                        <div className="fw-total-investment-item-value">{calculationData.results.totalCost.toLocaleString()} VND</div>
                                                    </div>
                                                    <div>
                                                        <div className="fw-total-investment-item-label">{t('costPerAnimal') || 'Per Animal'}</div>
                                                        <div className="fw-total-investment-item-value small">{Math.round(calculationData.results.costPerAnimal).toLocaleString()} VND</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Expected Benefits */}
                                            <div className="fw-benefits-box">
                                                <div className="fw-benefits-title">{t('expectedBenefits') || 'Expected Benefits'}</div>
                                                {(calculationData.selectedProduct.benefits.primary[language] || calculationData.selectedProduct.benefits.primary['en']).map((benefit, i) => (
                                                    <div key={i} className="fw-product-benefit-item">{benefit}</div>
                                                ))}
                                                <div className="fw-benefits-note">{t('benefitsNote') || 'Results may vary based on farm conditions.'}</div>
                                            </div>

                                            {/* Daily Details Toggle */}
                                            <div className="fw-price-box">
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <div className="fw-price-box-title">{t('dailyCalculationDetails') || 'Daily Calculation Details'}</div>
                                                    <button
                                                        onClick={() => setShowDailyDetails(!showDailyDetails)}
                                                        style={{ background: 'var(--fw-green)', color: 'white', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                                                    >
                                                        {showDailyDetails ? (t('hideDetails') || 'Hide') : (t('showDetails') || 'Show Details')}
                                                    </button>
                                                </div>
                                                {showDailyDetails && calculationData.results.periods.map((period, periodIndex) => (
                                                    <div key={periodIndex} style={{ overflowX: 'auto', borderRadius: '8px', marginTop: '8px' }}>
                                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', background: 'white' }}>
                                                            <thead>
                                                                <tr style={{ background: 'var(--fw-green)', color: 'white' }}>
                                                                    <th style={{ padding: '6px 8px', textAlign: 'left' }}>{t('dayColumn') || 'Day'}</th>
                                                                    <th style={{ padding: '6px 8px', textAlign: 'right' }}>{t('waterPerAnimal') || 'Water/animal'}</th>
                                                                    <th style={{ padding: '6px 8px', textAlign: 'right' }}>{t('productG') || 'Product (g)'}</th>
                                                                    <th style={{ padding: '6px 8px', textAlign: 'right' }}>{t('costVND') || 'Cost'}</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {period.dailyBreakdown.map((day, i) => (
                                                                    <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                                                        <td style={{ padding: '5px 8px' }}>{day.day}</td>
                                                                        <td style={{ padding: '5px 8px', textAlign: 'right' }}>{day.waterPerAnimal.toFixed(0)} ml</td>
                                                                        <td style={{ padding: '5px 8px', textAlign: 'right', color: 'var(--fw-green3)', fontWeight: 600 }}>{parseFloat(day.productNeeded).toLocaleString()}</td>
                                                                        <td style={{ padding: '5px 8px', textAlign: 'right', color: '#E08000', fontWeight: 600 }}>{day.cost.toLocaleString()}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Export Buttons */}
                                            <div className="fw-export-row">
                                                <button className="fw-export-btn" onClick={exportToExcel}>{t('exportToExcel') || 'Export Excel'}</button>
                                                <button className="fw-export-btn" onClick={printPDF}>{t('printPDF') || 'Print PDF'}</button>
                                            </div>

                                            {/* Inquiry Form */}
                                            <div className="fw-inquiry-box">
                                                <div className="fw-inquiry-title">{t('requestForInquiry') || 'Request for Inquiry'}</div>
                                                <div className="fw-inquiry-desc">{t('inquiryDescription') || 'Interested in this product? Our team will reach out to you.'}</div>
                                                <form onSubmit={handleInquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                    <div className="fw-form-group">
                                                        <label className="fw-form-label">{t('name') || 'Name'} *</label>
                                                        <input className="fw-form-input" type="text" name="name" value={inquiryData.name}
                                                            onChange={(e) => setInquiryData(prev => ({ ...prev, name: e.target.value }))}
                                                            placeholder={t('enterName') || 'Enter your name'} required />
                                                    </div>
                                                    <div className="fw-form-group">
                                                        <label className="fw-form-label">{t('email') || 'Email'} *</label>
                                                        <input className="fw-form-input" type="email" name="email" value={inquiryData.email}
                                                            onChange={(e) => setInquiryData(prev => ({ ...prev, email: e.target.value }))}
                                                            placeholder={t('enterEmail') || 'Enter your email'} required />
                                                    </div>
                                                    <div className="fw-form-group">
                                                        <label className="fw-form-label">{t('phoneNumber') || 'Phone'} *</label>
                                                        <input className="fw-form-input" type="tel" name="phone" value={inquiryData.phone}
                                                            onChange={(e) => setInquiryData(prev => ({ ...prev, phone: e.target.value }))}
                                                            placeholder={t('enterPhone') || 'Enter your phone'} required />
                                                    </div>
                                                    <button type="submit" className="fw-inquiry-submit">{t('submitInquiry') || 'Submit Inquiry'}</button>
                                                </form>
                                                <div className="fw-inquiry-note">{t('allFieldsRequired') || '* All fields required. Information kept confidential.'}</div>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            )}

                        </>
                    )}
            </div>

            {/* Navigation */}
            <div className="fw-step-nav">
                {/* Left side — Previous or empty */}
                {currentStep > 1 ? (
                    <button className="fw-step-nav-btn prev" onClick={prevStep}>
                        ← {t('previous') || 'Previous'}
                    </button>
                ) : (
                    <div />
                )}

                {/* Right side — Next (steps 1-3) or New Calculation (step 4) */}
                {currentStep < 4 ? (
                    <button
                        className="fw-step-nav-btn next"
                        onClick={nextStep}
                        disabled={
                            (currentStep === 1 && !calculationData.specificCategory) ||
                            (currentStep === 2 && (!calculationData.population || !calculationData.age)) ||
                            (currentStep === 3 && (!calculationData.selectedProduct || !calculationData.productPrice))
                        }
                    >
                        {t('next') || 'Next'} →
                    </button>
                ) : (
                    <button
                        className="fw-step-nav-btn next"
                        onClick={resetCalculation}
                        style={{ width: 'auto', paddingLeft: '20px', paddingRight: '20px' }}
                    >
                        ↺ {t('newCalculation') || 'New Calculation'}
                    </button>
                )}
            </div>

            <div className="fw-mod-bnav">
                <button className="fw-mod-bnav-home" onClick={() => navigate('/')}>
                    <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    <span>Home</span>
                </button>
                <button className="fw-mod-bnav-alerts" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                    <span>Alerts</span>
                </button>
            </div>

        </div>
    </div>
    );
};

export default DosageCalculator;
