import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

const DosageCalculator = () => {
    const { language } = useLanguage();
    const [currentStep, setCurrentStep] = useState(1);
    const [showCustomProtocol, setShowCustomProtocol] = useState(false);
    const [showDailyDetails, setShowDailyDetails] = useState(false);
    const [showReferenceView, setShowReferenceView] = useState(false);
    const [referenceSelection, setReferenceSelection] = useState({
        animalType: '',
        productionCategory: '',
        specificCategory: ''
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
        // Other breeders (swine) - use default values
        else if (['sow_gestation', 'sow_lactation', 'boar'].includes(specificCategory)) {
            // Default breeder values for swine
            waterL = 0.3; // 300ml per animal
            feedKg = 0.15; // 150g per animal
            console.log('Swine breeder calculation (default):', { specificCategory, waterL, feedKg });
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
                                📚 View Reference Data
                            </button>
                        </div>
                    )}

                    {/* Reference Data Page */}
                    {showReferenceView ? (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>
                                    📚 Feeding Program & Water Consumption Reference
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
                                    ← Back to Calculator
                                </button>
                            </div>

                            {/* Animal Selection for Reference */}
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', fontWeight: '600', marginBottom: '1rem' }}>
                                    Select Animal Type:
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
                                            {type === 'swine' ? '🐷 Swine' : '🐔 Poultry'}
                                        </button>
                                    ))}
                                </div>

                                {/* Production Category */}
                                {referenceSelection.animalType && (
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '1rem' }}>
                                            Production Category:
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
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Specific Category */}
                                {referenceSelection.productionCategory && (
                                    <div>
                                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '1rem' }}>
                                            Specific Category:
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
                                Step 1: Select Animal Type
                            </h2>
                            
                            {/* Animal Type Selection */}
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', fontWeight: '600', marginBottom: '1rem' }}>
                                    Animal Type:
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
                                            {type === 'swine' ? '🐷' : '🐔'} {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Production Category */}
                            {calculationData.animalType && (
                                <div style={{ marginBottom: '2rem' }}>
                                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '1rem' }}>
                                        Production Category:
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
                                        Specific Category:
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
                                Step 2: Flock/Herd Information
                            </h2>
                            
                            <div style={{ maxWidth: '600px' }}>
                                {/* Population */}
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                                        Population Size:
                                    </label>
                                    <input
                                        type="number"
                                        value={calculationData.population}
                                        onChange={(e) => updateData('population', e.target.value)}
                                        placeholder="Enter number of animals"
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
                                        Current Age:
                                    </label>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <input
                                            type="number"
                                            value={calculationData.age}
                                            onChange={(e) => updateData('age', e.target.value)}
                                            placeholder="Age"
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
                                            <option value="days">Days</option>
                                            <option value="weeks">Weeks</option>
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
                                Step 3: Select Product
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
                                        💰 Harga Produk
                                    </h3>
                                    <div>
                                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                                            Harga per Kilogram:
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
                                Step 4: Treatment Protocol
                            </h2>
                            
                            {/* Template Protocol Selection */}
                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
                                    Template Protokol:
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
                                🧮 Calculate Dosage & Cost
                            </button>

                            {/* Results Display */}
                            {calculationData.results && (
                                <div style={{
                                    background: '#f0fdf4',
                                    border: '2px solid #86efac',
                                    borderRadius: '12px',
                                    padding: '2rem'
                                }}>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#166534' }}>
                                        📊 Calculation Results
                                    </h3>

                                    {/* Summary */}
                                    <div style={{
                                        background: 'white',
                                        padding: '1.5rem',
                                        borderRadius: '8px',
                                        marginBottom: '1.5rem'
                                    }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                                            <div>
                                                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Product:</div>
                                                <div style={{ fontSize: '1.125rem', fontWeight: '700' }}>
                                                    {calculationData.selectedProduct.name}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Population:</div>
                                                <div style={{ fontSize: '1.125rem', fontWeight: '700' }}>
                                                    {parseInt(calculationData.population).toLocaleString()} animals
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Treatment Days:</div>
                                                <div style={{ fontSize: '1.125rem', fontWeight: '700' }}>
                                                    {calculationData.results.totalDays} days
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Number of Periods:</div>
                                                <div style={{ fontSize: '1.125rem', fontWeight: '700' }}>
                                                    {calculationData.protocolPeriods.length} periods
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Period Breakdown */}
                                    <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
                                        Period Breakdown:
                                    </h4>
                                    {calculationData.results.periods.map((period, index) => (
                                        <div key={index} style={{
                                            background: 'white',
                                            padding: '1rem',
                                            borderRadius: '8px',
                                            marginBottom: '1rem'
                                        }}>
                                            <div style={{ fontWeight: '700', marginBottom: '0.75rem' }}>
                                                Period {index + 1}: Day {period.startDay}-{period.endDay} ({period.days} days)
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', fontSize: '0.875rem' }}>
                                                <div>Total Water: {parseFloat(period.totalWaterL).toLocaleString()} L</div>
                                                <div>Total Feed: {parseFloat(period.totalFeedKg).toLocaleString()} kg</div>
                                                <div style={{ color: '#667eea', fontWeight: '600' }}>
                                                    Product Needed: {parseFloat(period.productNeeded).toLocaleString()} g
                                                </div>
                                                <div style={{ color: '#f59e0b', fontWeight: '600' }}>
                                                    Cost: {parseInt(period.cost).toLocaleString()} VND
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Total Investment */}
                                    <div style={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white',
                                        padding: '1.5rem',
                                        borderRadius: '8px',
                                        marginTop: '1.5rem'
                                    }}>
                                        <h4 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>
                                            💰 TOTAL INVESTMENT
                                        </h4>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                            <div>
                                                <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Total Product:</div>
                                                <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                                                    {(calculationData.results.totalProductGrams / 1000).toFixed(2)} kg
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Total Cost:</div>
                                                <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                                                    {calculationData.results.totalCost.toLocaleString()} VND
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Cost per Animal:</div>
                                                <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                                                    {Math.round(calculationData.results.costPerAnimal).toLocaleString()} VND
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expected Benefits */}
                                    <div style={{
                                        background: 'white',
                                        padding: '1.5rem',
                                        borderRadius: '8px',
                                        marginTop: '1.5rem'
                                    }}>
                                        <h4 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '1rem', color: '#166534' }}>
                                            💡 Expected Benefits:
                                        </h4>
                                        {calculationData.selectedProduct.benefits.primary.map((benefit, i) => (
                                            <div key={i} style={{ marginBottom: '0.5rem', paddingLeft: '1.5rem', position: 'relative' }}>
                                                <span style={{ position: 'absolute', left: 0 }}>✓</span>
                                                {benefit}
                                            </div>
                                        ))}
                                        <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280', fontStyle: 'italic' }}>
                                            Note: Results may vary based on farm conditions and management practices.
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
                                                📋 Detail Perhitungan Harian
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
                                                {showDailyDetails ? '🔼 Sembunyikan Detail' : '🔽 Tampilkan Detail'}
                                            </button>
                                        </div>

                                        {showDailyDetails && (
                                            <div>
                                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                                                    Tabel di bawah menampilkan perhitungan detail untuk setiap hari dalam periode treatment yang dipilih.
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
                                                            Period {periodIndex + 1}
                                                        </div>
                                                        
                                                        <div style={{ overflowX: 'auto' }}>
                                                            <table style={{
                                                                width: '100%',
                                                                background: 'white',
                                                                borderCollapse: 'collapse',
                                                                fontSize: '0.875rem'
                                                            }}>
                                                                <thead>
                                                                    <tr style={{ background: '#f3f4f6' }}>
                                                                        <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Hari</th>
                                                                        <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid #e5e7eb' }}>Umur (hari)</th>
                                                                        <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid #e5e7eb' }}>Air (ml/ekor)</th>
                                                                        <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid #e5e7eb' }}>Total Air (L)</th>
                                                                        <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid #e5e7eb' }}>Pakan (g/ekor)</th>
                                                                        <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid #e5e7eb' }}>Total Pakan (kg)</th>
                                                                        <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid #e5e7eb', color: '#667eea' }}>Produk (g)</th>
                                                                        <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid #e5e7eb', color: '#f59e0b' }}>Biaya (VND)</th>
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
                                                                        <td colSpan="3" style={{ padding: '0.75rem' }}>Total Period</td>
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
                                </div>
                            )}
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div style={{ 
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
                                    🔄 New Calculation
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
                                        Next →
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
