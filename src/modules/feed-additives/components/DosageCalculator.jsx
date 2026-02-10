import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { feedAdditivesTranslations } from '../translations';

const DosageCalculator = () => {
    const { language } = useLanguage();
    const t = (key) => feedAdditivesTranslations[language]?.[key] || feedAdditivesTranslations['en'][key];
    const [currentStep, setCurrentStep] = useState(1);
    const [showCustomProtocol, setShowCustomProtocol] = useState(false);
    const [showDailyDetails, setShowDailyDetails] = useState(false);
    const [showReferenceView, setShowReferenceView] = useState(false);

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

        // Broiler calculation (formula-based)
        if (specificCategory === 'broiler') {
            const waterMl = 5.28 * ageInDays;
            waterL = waterMl / 1000;
            feedKg = (waterMl / 1.77) / 1000;
            console.log('Broiler calculation:', { waterMl, waterL, feedKg });
        }
        // Layer calculation (table-based with interpolation)
        else if (specificCategory === 'layer') {
            const ageInWeeks = Math.floor(ageInDays / 7);
            const layerData = consumptionData?.poultry_commercial?.layer?.data_by_week || [];
            const result = interpolateLayerData(ageInWeeks, layerData);
            waterL = result.waterL;
            feedKg = result.feedKg;
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
        // Layer Breeder - use layer data for growing phase, breeder data for production phase
        else if (specificCategory === 'layer_breeder') {
            const ageInWeeks = Math.floor(ageInDays / 7);
            
            if (ageInWeeks < 20) {
                // Before 20 weeks: use layer growing data
                const layerData = consumptionData?.poultry_commercial?.layer?.data_by_week || [];
                const result = interpolateLayerData(ageInWeeks, layerData);
                waterL = result.waterL;
                feedKg = result.feedKg;
            } else {
                // After 20 weeks: breeder production phase
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
        // Color Breeder - use layer data with adjustment factor
        else if (specificCategory === 'color_breeder') {
            const ageInWeeks = Math.floor(ageInDays / 7);
            
            if (ageInWeeks < 20) {
                // Before 20 weeks: use layer data with 85% adjustment
                const layerData = consumptionData?.poultry_commercial?.layer?.data_by_week || [];
                const result = interpolateLayerData(ageInWeeks, layerData, 0.85);
                waterL = result.waterL;
                feedKg = result.feedKg;
            } else {
                // After 20 weeks: breeder production phase
                waterL = 0.25; // 250ml per bird
                feedKg = 0.14; // 140g per bird
            }
            
            console.log('Color breeder calculation:', { ageInWeeks, ageInDays, waterL, feedKg });
        }
        // Broiler Breeder - use layer data for growing phase, breeder data for production phase
        else if (specificCategory === 'broiler_breeder') {
            const ageInWeeks = Math.floor(ageInDays / 7);
            
            if (ageInWeeks < 20) {
                // Before 20 weeks: use layer growing data
                const layerData = consumptionData?.poultry_commercial?.layer?.data_by_week || [];
                const result = interpolateLayerData(ageInWeeks, layerData);
                waterL = result.waterL;
                feedKg = result.feedKg;
            } else {
                // After 20 weeks: breeder production phase
                waterL = 0.30; // 300ml per bird
                feedKg = 0.17; // 170g per bird
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
                    gap: '1.5rem'
                }}>
                    <img
                        src="/images/FarmWell_Logo.png"
                        alt="FarmWell"
                        onClick={() => window.location.href = '/'}
                        style={{
                            height: '80px',
                            cursor: 'pointer',
                            transition: 'transform 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    />
                    <div style={{ flex: 1 }}>
                        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', color: '#1f2937' }}>
                            FEED ADDITIVES CALCULATOR
                        </h1>
                        <p style={{ color: '#6b7280', fontSize: '1rem' }}>
                            Vaksindo Vietnam - United Animal Health Products
                        </p>
                    </div>
                </div>

                {/* Progress Steps */}
                <div style={{ 
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    marginBottom: '2rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {[1, 2, 3, 4].map(step => (
                            <div key={step} style={{ flex: 1, textAlign: 'center' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: currentStep >= step ? '#667eea' : '#e5e7eb',
                                    color: 'white',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: '700',
                                    marginBottom: '0.5rem'
                                }}>
                                    {step}
                                </div>
                                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
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
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', color: '#1f2937' }}>
                                        Reference Data: {animalCategories[referenceSelection.animalType][referenceSelection.productionCategory].find(c => c.id === referenceSelection.specificCategory)?.label}
                                    </h3>

                                    {/* Broiler - Formula Based */}
                                    {referenceSelection.specificCategory === 'broiler' && (
                                        <div>
                                            <div style={{ background: '#dbeafe', padding: '1rem', borderRadius: '6px', marginBottom: '1rem' }}>
                                                <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Calculation Method: Formula-Based</h4>
                                                <p style={{ fontSize: '0.875rem', color: '#1e40af' }}>
                                                    Water (ml/bird/day) = 5.28 × Age (days)<br/>
                                                    Feed (g/bird/day) = Water ÷ 1.77
                                                </p>
                                            </div>
                                            <div style={{ overflowX: 'auto' }}>
                                                <table style={{ width: '100%', background: 'white', borderCollapse: 'collapse' }}>
                                                    <thead>
                                                        <tr style={{ background: '#3b82f6', color: 'white' }}>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Age (days)</th>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Water (ml/bird/day)</th>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Feed (g/bird/day)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {[7, 14, 21, 28, 35, 42].map(day => {
                                                            const water = 5.28 * day;
                                                            const feed = water / 1.77;
                                                            return (
                                                                <tr key={day}>
                                                                    <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{day}</td>
                                                                    <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{water.toFixed(1)}</td>
                                                                    <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{feed.toFixed(1)}</td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {/* Layer - Table Based */}
                                    {referenceSelection.specificCategory === 'layer' && (
                                        <div>
                                            <div style={{ background: '#dbeafe', padding: '1rem', borderRadius: '6px', marginBottom: '1rem' }}>
                                                <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Calculation Method: Table-Based with Interpolation</h4>
                                                <p style={{ fontSize: '0.875rem', color: '#1e40af' }}>
                                                    Data from Hy-Line International Management Guide
                                                </p>
                                            </div>
                                            <div style={{ overflowX: 'auto' }}>
                                                <table style={{ width: '100%', background: 'white', borderCollapse: 'collapse' }}>
                                                    <thead>
                                                        <tr style={{ background: '#3b82f6', color: 'white' }}>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Week</th>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Water (ml/bird/day)</th>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Feed (g/bird/day)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {consumptionData.poultry_commercial.layer.data_by_week.map(data => (
                                                            <tr key={data.week}>
                                                                <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{data.week}</td>
                                                                <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{data.water_ml}</td>
                                                                <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{data.feed_g}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {/* Color Chicken - Formula with Adjustment */}
                                    {referenceSelection.specificCategory === 'color_chicken' && (
                                        <div>
                                            <div style={{ background: '#dbeafe', padding: '1rem', borderRadius: '6px', marginBottom: '1rem' }}>
                                                <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Calculation Method: Formula with 70% Adjustment</h4>
                                                <p style={{ fontSize: '0.875rem', color: '#1e40af' }}>
                                                    Water (ml/bird/day) = 5.28 × Age (days) × 0.70<br/>
                                                    Feed (g/bird/day) = Water ÷ 1.77
                                                </p>
                                            </div>
                                            <div style={{ overflowX: 'auto' }}>
                                                <table style={{ width: '100%', background: 'white', borderCollapse: 'collapse' }}>
                                                    <thead>
                                                        <tr style={{ background: '#3b82f6', color: 'white' }}>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Age (days)</th>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Water (ml/bird/day)</th>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Feed (g/bird/day)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {[7, 14, 21, 28, 35, 42, 49, 56, 63, 70].map(day => {
                                                            const water = 5.28 * day * 0.7;
                                                            const feed = water / 1.77;
                                                            return (
                                                                <tr key={day}>
                                                                    <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{day}</td>
                                                                    <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{water.toFixed(1)}</td>
                                                                    <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{feed.toFixed(1)}</td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {/* Breeders - Phase Based with Full Table */}
                                    {['layer_breeder', 'broiler_breeder', 'color_breeder'].includes(referenceSelection.specificCategory) && (
                                        <div>
                                            <div style={{ background: '#dbeafe', padding: '1rem', borderRadius: '6px', marginBottom: '1rem' }}>
                                                <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Calculation Method: Phase-Based</h4>
                                                <p style={{ fontSize: '0.875rem', color: '#1e40af' }}>
                                                    Growing Phase (Week 1-20): Uses layer data{referenceSelection.specificCategory === 'color_breeder' ? ' with 85% adjustment' : ''}<br/>
                                                    Production Phase (Week 21+): Fixed consumption values
                                                </p>
                                            </div>
                                            <div style={{ overflowX: 'auto' }}>
                                                <table style={{ width: '100%', background: 'white', borderCollapse: 'collapse' }}>
                                                    <thead>
                                                        <tr style={{ background: '#3b82f6', color: 'white' }}>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Week</th>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Phase</th>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Water (ml/bird/day)</th>
                                                            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Feed (g/bird/day)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {(() => {
                                                            const adjustmentFactor = referenceSelection.specificCategory === 'color_breeder' ? 0.85 : 1.0;
                                                            const productionWater = referenceSelection.specificCategory === 'layer_breeder' ? 280 : 
                                                                                   referenceSelection.specificCategory === 'broiler_breeder' ? 300 : 250;
                                                            const productionFeed = referenceSelection.specificCategory === 'layer_breeder' ? 160 : 
                                                                                  referenceSelection.specificCategory === 'broiler_breeder' ? 170 : 140;
                                                            
                                                            const rows = [];
                                                            const layerData = consumptionData.poultry_commercial.layer.data_by_week;
                                                            
                                                            // Week 1-20: Growing phase (use layer data)
                                                            for (let week = 1; week <= 20; week++) {
                                                                const weekData = layerData.find(d => d.week === week);
                                                                if (weekData) {
                                                                    rows.push(
                                                                        <tr key={week} style={{ background: week % 2 === 0 ? '#f9fafb' : 'white' }}>
                                                                            <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{week}</td>
                                                                            <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb', color: '#059669', fontWeight: '600' }}>Growing</td>
                                                                            <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>
                                                                                {(weekData.water_ml * adjustmentFactor).toFixed(1)}
                                                                            </td>
                                                                            <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>
                                                                                {(weekData.feed_g * adjustmentFactor).toFixed(1)}
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                }
                                                            }
                                                            
                                                            // Week 21-65: Production phase (fixed values)
                                                            for (let week = 21; week <= 65; week++) {
                                                                rows.push(
                                                                    <tr key={week} style={{ background: week % 2 === 0 ? '#fef3c7' : '#fffbeb' }}>
                                                                        <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{week}</td>
                                                                        <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb', color: '#dc2626', fontWeight: '600' }}>Production</td>
                                                                        <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>
                                                                            {productionWater}
                                                                        </td>
                                                                        <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>
                                                                            {productionFeed}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            }
                                                            
                                                            return rows;
                                                        })()}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div style={{ marginTop: '1rem', padding: '1rem', background: '#fef3c7', borderRadius: '6px', fontSize: '0.875rem' }}>
                                                <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>📝 Notes:</p>
                                                <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                                                    <li>Growing phase (Week 1-20): Consumption increases with age following layer growth pattern</li>
                                                    <li>Production phase (Week 21-65): Fixed consumption due to breeding management and feed restriction programs</li>
                                                    <li>Typical cull age: 60-65 weeks depending on production performance</li>
                                                </ul>
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
                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                    <input
                                                        type="number"
                                                        value={calculationData.femaleRatio}
                                                        onChange={(e) => updateData('femaleRatio', e.target.value)}
                                                        min="1"
                                                        style={{
                                                            flex: 1,
                                                            padding: '0.5rem',
                                                            border: '1px solid #e5e7eb',
                                                            borderRadius: '4px'
                                                        }}
                                                    />
                                                    <span>:</span>
                                                    <input
                                                        type="number"
                                                        value={calculationData.maleRatio}
                                                        onChange={(e) => updateData('maleRatio', e.target.value)}
                                                        min="1"
                                                        style={{
                                                            flex: 1,
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
                                    maxWidth: '500px'
                                }}>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '1rem', color: '#166534' }}>
                                        💰 {t('productPrice').replace(' (VND/kg):', '')}
                                    </h3>
                                    <div>
                                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                                            {t('productPrice')}
                                        </label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <input
                                                type="number"
                                                value={calculationData.productPrice}
                                                onChange={(e) => updateData('productPrice', e.target.value)}
                                                min="0"
                                                step="1000"
                                                style={{
                                                    flex: 1,
                                                    padding: '0.75rem',
                                                    border: '2px solid #d1d5db',
                                                    borderRadius: '8px',
                                                    fontSize: '1rem',
                                                    fontWeight: '600'
                                                }}
                                            />
                                            <span style={{ fontSize: '1rem', fontWeight: '600', color: '#6b7280' }}>
                                                VND/kg
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                                            Masukkan harga per kilogram produk
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
                                            📋 Standard Prevention (10 hari)
                                        </div>
                                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                            Hari 1-5 + Hari 25-29
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
                                            🏥 Intensive Treatment (7 hari)
                                        </div>
                                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                            Hari 1-7 kontinyu
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
                                    {showCustomProtocol ? '− Sembunyikan Protokol Custom' : '+ Atau Buat Protokol Custom'}
                                </button>
                            </div>

                            {/* Custom Protocol Builder */}
                            {showCustomProtocol && (
                                <div style={{ marginBottom: '2rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
                                        Custom Protocol:
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
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
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
                        marginTop: '2rem',
                        paddingTop: '2rem',
                        borderTop: '1px solid #e5e7eb'
                    }}>
                        {currentStep === 4 ? (
                            // Results page navigation
                            <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                                <button
                                    onClick={prevStep}
                                    style={{
                                        padding: '0.75rem 2rem',
                                        background: 'white',
                                        color: '#374151',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '1rem',
                                        fontWeight: '600'
                                    }}
                                >
                                    ← Previous
                                </button>
                                <button
                                    onClick={resetCalculation}
                                    style={{
                                        padding: '0.75rem 2rem',
                                        background: '#10b981',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        marginLeft: 'auto'
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
                                        padding: '0.75rem 2rem',
                                        background: currentStep === 1 ? '#e5e7eb' : 'white',
                                        color: currentStep === 1 ? '#9ca3af' : '#374151',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '8px',
                                        cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
                                        fontSize: '1rem',
                                        fontWeight: '600'
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
                                            padding: '0.75rem 2rem',
                                            background: '#667eea',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '1rem',
                                            fontWeight: '600',
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
