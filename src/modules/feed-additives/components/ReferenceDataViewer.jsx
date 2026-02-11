import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, FileSpreadsheet, ChevronDown, ArrowLeft } from 'lucide-react';
import * as XLSX from 'xlsx';

const ReferenceDataViewer = () => {
    const navigate = useNavigate();
    const [consumptionData, setConsumptionData] = useState(null);
    const [selectedAnimalType, setSelectedAnimalType] = useState('poultry');
    const [selectedCategory, setSelectedCategory] = useState('commercial');
    const [selectedSpecificCategory, setSelectedSpecificCategory] = useState('broiler');

    useEffect(() => {
        fetch('/data/feed-additives/consumption-database.json')
            .then(res => res.json())
            .then(data => setConsumptionData(data))
            .catch(err => console.error('Error loading consumption data:', err));
    }, []);

    const exportToExcel = () => {
        if (!consumptionData) return;

        const wb = XLSX.utils.book_new();
        let data = [];
        let sheetName = '';

        // Get data based on selection
        if (selectedAnimalType === 'poultry') {
            if (selectedCategory === 'commercial') {
                if (selectedSpecificCategory === 'broiler') {
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
                } else if (selectedSpecificCategory === 'layer') {
                    // Rearing data
                    const rearingData = consumptionData.poultry_commercial.layer.rearing_weeks_1_18.map(d => ({
                        'Week': d.week,
                        'Phase': 'Rearing',
                        'BW Min (g)': d.bw_g_min,
                        'BW Max (g)': d.bw_g_max,
                        'Feed Min (g/day)': d.feed_g_min,
                        'Feed Max (g/day)': d.feed_g_max,
                        'Water Min (ml/day)': d.water_ml_min,
                        'Water Max (ml/day)': d.water_ml_max,
                        'Cum Feed Min (g)': d.cum_feed_g_min,
                        'Cum Feed Max (g)': d.cum_feed_g_max
                    }));
                    
                    // Production data
                    const productionData = consumptionData.poultry_commercial.layer.production_weeks_18_100_per_hen_day.map(d => ({
                        'Week': d.week,
                        'Phase': 'Production',
                        'Production (%)': d.prod_pct,
                        'Egg Weight (g)': d.egg_wt_g,
                        'Egg Mass (g)': d.egg_mass_g,
                        'Feed (g/day)': d.feed_g,
                        'FCR': d.fcr,
                        'Body Weight (g)': d.bw_g,
                        'Water (ml/day)': d.water_ml
                    }));
                    
                    data = [...rearingData, ...productionData];
                    sheetName = 'Layer Complete Data';
                }
            } else if (selectedCategory === 'breeding') {
                if (selectedSpecificCategory === 'broiler_breeder') {
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
                } else if (selectedSpecificCategory === 'color_breeder') {
                    // Rearing data
                    const rearingData = consumptionData.poultry_breeding.color_breeder.female_pullet_rearing_weeks_0_24.map(d => ({
                        'Week': d.week,
                        'Phase': 'Rearing',
                        'Days': d.days,
                        'Body Weight (g)': d.bw_g,
                        'Weekly Growth (g)': d.growth_g_wk,
                        'Feed (g/day)': d.feed_g,
                        'Water (ml/day)': (d.feed_g * 2.0).toFixed(0),
                        'ME (kcal/day)': d.me_kcal,
                        'Note': d.note || ''
                    }));
                    
                    // Production data
                    const productionData = consumptionData.poultry_breeding.color_breeder.female_production_20C_weeks_24_70.map(d => ({
                        'Week': d.week,
                        'Phase': 'Production',
                        'Production (%)': d.prod_pct,
                        'Feed (g/day)': d.feed_g,
                        'Water (ml/day)': (d.feed_g * 2.0).toFixed(0),
                        'ME (kcal/day)': d.me_kcal,
                        'Diet ME': d.diet_me,
                        'Note': d.note || ''
                    }));
                    
                    data = [...rearingData, ...productionData];
                    sheetName = 'Color Breeder Female';
                } else if (selectedSpecificCategory === 'layer_breeder') {
                    // Rearing data
                    const rearingData = consumptionData.poultry_commercial.layer.rearing_weeks_1_18.map(d => ({
                        'Week': d.week,
                        'Phase': 'Rearing',
                        'Feed Avg (g/day)': ((d.feed_g_min + d.feed_g_max) / 2).toFixed(1),
                        'Water Avg (ml/day)': ((d.water_ml_min + d.water_ml_max) / 2).toFixed(1),
                        'BW Avg (g)': ((d.bw_g_min + d.bw_g_max) / 2).toFixed(0)
                    }));
                    
                    // Production fixed values
                    const productionData = [{
                        'Week': '20+',
                        'Phase': 'Production',
                        'Feed (g/day)': 160,
                        'Water (ml/day)': 280,
                        'Note': 'Fixed breeding values'
                    }];
                    
                    data = [...rearingData, ...productionData];
                    sheetName = 'Layer Breeder';
                }
            }
        } else if (selectedAnimalType === 'swine') {
            if (selectedCategory === 'commercial') {
                const swineData = consumptionData.swine_commercial[selectedSpecificCategory].data_by_weight;
                data = swineData.map(d => ({
                    'Weight (kg)': d.weight_kg,
                    'Water (L/day)': d.water_L,
                    'Feed (kg/day)': d.feed_kg
                }));
                sheetName = selectedSpecificCategory.charAt(0).toUpperCase() + selectedSpecificCategory.slice(1);
            } else if (selectedCategory === 'breeding') {
                const swineBreedingData = consumptionData.swine_breeding[selectedSpecificCategory];
                data = [{
                    'Category': selectedSpecificCategory.replace('_', ' ').toUpperCase(),
                    'Water (L/day)': swineBreedingData.water_L,
                    'Feed (kg/day)': swineBreedingData.feed_kg,
                    'Note': swineBreedingData.note || ''
                }];
                sheetName = selectedSpecificCategory.charAt(0).toUpperCase() + selectedSpecificCategory.slice(1);
            }
        }

        if (data.length === 0) {
            alert('No data available for export');
            return;
        }

        const ws = XLSX.utils.json_to_sheet(data);
        
        // Auto-size columns
        const colWidths = Object.keys(data[0]).map(key => ({
            wch: Math.max(key.length, ...data.map(row => String(row[key] || '').length)) + 2
        }));
        ws['!cols'] = colWidths;

        XLSX.utils.book_append_sheet(wb, ws, sheetName);
        
        const fileName = `FarmWell_${sheetName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, fileName);
    };

    const renderTable = () => {
        if (!consumptionData) return <div>Loading...</div>;

        if (selectedAnimalType === 'poultry') {
            if (selectedCategory === 'commercial') {
                if (selectedSpecificCategory === 'broiler') {
                    const broilerData = consumptionData.poultry_commercial.broiler.daily_data;
                    return (
                        <div>
                            <div style={{ marginBottom: '1rem', padding: '1rem', background: '#dbeafe', borderRadius: '6px' }}>
                                <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Broiler Daily Performance Data</h3>
                                <p style={{ fontSize: '0.875rem', color: '#1e40af' }}>
                                    Source: {consumptionData.poultry_commercial.broiler.source}<br/>
                                    Breed: {consumptionData.poultry_commercial.broiler.breed}<br/>
                                    Coverage: Day 0-56 (57 data points)
                                </p>
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
                                <thead>
                                    <tr style={{ background: '#3b82f6', color: 'white' }}>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>Day</th>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>BW (g)</th>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>Gain (g)</th>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>Feed (g/day)</th>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>Cum Feed (g)</th>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>FCR</th>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>Water (ml/day)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {broilerData.map(d => (
                                        <tr key={d.day} style={{ background: d.day % 7 === 0 ? '#f3f4f6' : 'white' }}>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.day}</td>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.bw_g}</td>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.gain_g}</td>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.feed_g}</td>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.cum_feed_g}</td>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.fcr.toFixed(3)}</td>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.water_ml}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    );
                } else if (selectedSpecificCategory === 'layer') {
                    const rearingData = consumptionData.poultry_commercial.layer.rearing_weeks_1_18;
                    const productionData = consumptionData.poultry_commercial.layer.production_weeks_18_100_per_hen_day;
                    return (
                        <div>
                            <div style={{ marginBottom: '1rem', padding: '1rem', background: '#dbeafe', borderRadius: '6px' }}>
                                <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Layer Complete Weekly Data</h3>
                                <p style={{ fontSize: '0.875rem', color: '#1e40af' }}>
                                    Source: {consumptionData.poultry_commercial.layer.source}<br/>
                                    Breed: {consumptionData.poultry_commercial.layer.breed}<br/>
                                    Coverage: Week 1-100 (100 data points)
                                </p>
                            </div>
                            
                            <h4 style={{ fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Rearing Phase (Weeks 1-18)</h4>
                            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', marginBottom: '2rem' }}>
                                <thead>
                                    <tr style={{ background: '#3b82f6', color: 'white' }}>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>Week</th>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>BW Min-Max (g)</th>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>Feed Min-Max (g/day)</th>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>Water Min-Max (ml/day)</th>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>Cum Feed Min-Max (g)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rearingData.map(d => (
                                        <tr key={d.week}>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.week}</td>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.bw_g_min} - {d.bw_g_max}</td>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.feed_g_min} - {d.feed_g_max}</td>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.water_ml_min} - {d.water_ml_max}</td>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.cum_feed_g_min} - {d.cum_feed_g_max}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <h4 style={{ fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Production Phase (Weeks 18-100)</h4>
                            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
                                <thead>
                                    <tr style={{ background: '#3b82f6', color: 'white' }}>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>Week</th>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>Prod (%)</th>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>Egg Wt (g)</th>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>Egg Mass (g)</th>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>Feed (g/day)</th>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>FCR</th>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>BW (g)</th>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>Water (ml/day)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productionData.map(d => (
                                        <tr key={d.week} style={{ background: d.week % 10 === 0 ? '#f3f4f6' : 'white' }}>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.week}</td>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.prod_pct}</td>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.egg_wt_g}</td>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.egg_mass_g}</td>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.feed_g}</td>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.fcr}</td>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.bw_g}</td>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.water_ml}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    );
                }
            } else if (selectedCategory === 'breeding') {
                if (selectedSpecificCategory === 'broiler_breeder') {
                    const breederData = consumptionData.poultry_breeding.broiler_breeder.female_complete_weeks_0_64;
                    return (
                        <div>
                            <div style={{ marginBottom: '1rem', padding: '1rem', background: '#dbeafe', borderRadius: '6px' }}>
                                <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Broiler Breeder Female Complete Data</h3>
                                <p style={{ fontSize: '0.875rem', color: '#1e40af' }}>
                                    Source: {consumptionData.poultry_breeding.broiler_breeder.source}<br/>
                                    Breed: {consumptionData.poultry_breeding.broiler_breeder.breed}<br/>
                                    Coverage: Week 0-64 (65 data points)
                                </p>
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
                                <thead>
                                    <tr style={{ background: '#3b82f6', color: 'white' }}>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>Week</th>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>Days</th>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>BW (g)</th>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>Gain (g)</th>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>Feed (g/day)</th>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>Water (ml/day)</th>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>Cum Feed (kg)</th>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>Energy (kcal)</th>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>Note</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {breederData.map(d => (
                                        <tr key={d.week} style={{ background: d.note ? '#fef3c7' : (d.week <= 20 ? '#f0fdf4' : 'white') }}>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.week}</td>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.days}</td>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.bw_g}</td>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.gain_g}</td>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.feed_g}</td>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{(d.feed_g * 1.8).toFixed(0)}</td>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.cum_feed_kg}</td>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.energy_kcal}</td>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb', fontSize: '0.875rem' }}>{d.note || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    );
                } else if (selectedSpecificCategory === 'color_breeder') {
                    const rearingData = consumptionData.poultry_breeding.color_breeder.female_pullet_rearing_weeks_0_24;
                    const productionData = consumptionData.poultry_breeding.color_breeder.female_production_20C_weeks_24_70;
                    return (
                        <div>
                            <div style={{ marginBottom: '1rem', padding: '1rem', background: '#dbeafe', borderRadius: '6px' }}>
                                <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Color Breeder Female Complete Data</h3>
                                <p style={{ fontSize: '0.875rem', color: '#1e40af' }}>
                                    Source: {consumptionData.poultry_breeding.color_breeder.source}<br/>
                                    Breed: {consumptionData.poultry_breeding.color_breeder.breed}
                                </p>
                            </div>
                            
                            <h4 style={{ fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Pullet Rearing (Weeks 0-24)</h4>
                            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', marginBottom: '2rem' }}>
                                <thead>
                                    <tr style={{ background: '#3b82f6', color: 'white' }}>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>Week</th>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>Days</th>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>BW (g)</th>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>Growth (g/wk)</th>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>Feed (g/day)</th>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>Water (ml/day)</th>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>ME (kcal)</th>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>Note</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rearingData.map(d => (
                                        <tr key={d.week} style={{ background: d.note ? '#fef3c7' : 'white' }}>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.week}</td>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.days}</td>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.bw_g}</td>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.growth_g_wk}</td>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.feed_g}</td>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{(d.feed_g * 2.0).toFixed(0)}</td>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.me_kcal}</td>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb', fontSize: '0.875rem' }}>{d.note || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <h4 style={{ fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Production Phase 20°C (Weeks 24-70)</h4>
                            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
                                <thead>
                                    <tr style={{ background: '#3b82f6', color: 'white' }}>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>Week</th>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>Prod (%)</th>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>Feed (g/day)</th>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>Water (ml/day)</th>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>ME (kcal)</th>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>Diet ME</th>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>Note</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productionData.map(d => (
                                        <tr key={d.week} style={{ background: d.note ? '#fef3c7' : 'white' }}>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.week}</td>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.prod_pct}</td>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.feed_g}</td>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{(d.feed_g * 2.0).toFixed(0)}</td>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.me_kcal}</td>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.diet_me}</td>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb', fontSize: '0.875rem' }}>{d.note || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    );
                } else if (selectedSpecificCategory === 'layer_breeder') {
                    const rearingData = consumptionData.poultry_commercial.layer.rearing_weeks_1_18;
                    return (
                        <div>
                            <div style={{ marginBottom: '1rem', padding: '1rem', background: '#dbeafe', borderRadius: '6px' }}>
                                <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Layer Breeder Data</h3>
                                <p style={{ fontSize: '0.875rem', color: '#1e40af' }}>
                                    Rearing: Uses layer commercial data<br/>
                                    Production: Fixed breeding values
                                </p>
                            </div>
                            
                            <h4 style={{ fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Rearing Phase (Weeks 1-18)</h4>
                            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', marginBottom: '2rem' }}>
                                <thead>
                                    <tr style={{ background: '#3b82f6', color: 'white' }}>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>Week</th>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>Feed Avg (g/day)</th>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>Water Avg (ml/day)</th>
                                        <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>BW Avg (g)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rearingData.map(d => (
                                        <tr key={d.week}>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.week}</td>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{((d.feed_g_min + d.feed_g_max) / 2).toFixed(1)}</td>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{((d.water_ml_min + d.water_ml_max) / 2).toFixed(1)}</td>
                                            <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{((d.bw_g_min + d.bw_g_max) / 2).toFixed(0)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <h4 style={{ fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Production Phase (Week 20+)</h4>
                            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                                <p><strong>Feed:</strong> 160 g/bird/day</p>
                                <p><strong>Water:</strong> 280 ml/bird/day</p>
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem', fontStyle: 'italic' }}>
                                    Note: Fixed breeding values with feed restriction management
                                </p>
                            </div>
                        </div>
                    );
                }
            }
        } else if (selectedAnimalType === 'swine') {
            if (selectedCategory === 'commercial') {
                const swineData = consumptionData.swine_commercial[selectedSpecificCategory].data_by_weight;
                return (
                    <div>
                        <div style={{ marginBottom: '1rem', padding: '1rem', background: '#dbeafe', borderRadius: '6px' }}>
                            <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                                Swine {selectedSpecificCategory.charAt(0).toUpperCase() + selectedSpecificCategory.slice(1)} Data
                            </h3>
                            <p style={{ fontSize: '0.875rem', color: '#1e40af' }}>
                                Weight-based consumption data
                            </p>
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
                            <thead>
                                <tr style={{ background: '#3b82f6', color: 'white' }}>
                                    <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>Weight (kg)</th>
                                    <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>Water (L/day)</th>
                                    <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb', textAlign: 'left' }}>Feed (kg/day)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {swineData.map(d => (
                                    <tr key={d.weight_kg}>
                                        <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.weight_kg}</td>
                                        <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.water_L}</td>
                                        <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.feed_kg}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            } else if (selectedCategory === 'breeding') {
                const swineBreedingData = consumptionData.swine_breeding[selectedSpecificCategory];
                return (
                    <div>
                        <div style={{ marginBottom: '1rem', padding: '1rem', background: '#dbeafe', borderRadius: '6px' }}>
                            <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                                {selectedSpecificCategory.replace('_', ' ').toUpperCase()}
                            </h3>
                            <p style={{ fontSize: '0.875rem', color: '#1e40af' }}>
                                Fixed breeding values
                            </p>
                        </div>
                        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                            <p><strong>Water:</strong> {swineBreedingData.water_L} L/day</p>
                            <p><strong>Feed:</strong> {swineBreedingData.feed_kg} kg/day</p>
                            {swineBreedingData.note && (
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem', fontStyle: 'italic' }}>
                                    Note: {swineBreedingData.note}
                                </p>
                            )}
                        </div>
                    </div>
                );
            }
        }

        return <div>No data available</div>;
    };

    const getCategoryOptions = () => {
        if (selectedAnimalType === 'poultry') {
            return [
                { value: 'commercial', label: 'Commercial' },
                { value: 'breeding', label: 'Breeding' }
            ];
        } else if (selectedAnimalType === 'swine') {
            return [
                { value: 'commercial', label: 'Commercial' },
                { value: 'breeding', label: 'Breeding' }
            ];
        }
        return [];
    };

    const getSpecificCategoryOptions = () => {
        if (selectedAnimalType === 'poultry') {
            if (selectedCategory === 'commercial') {
                return [
                    { value: 'broiler', label: 'Broiler' },
                    { value: 'layer', label: 'Layer' }
                ];
            } else if (selectedCategory === 'breeding') {
                return [
                    { value: 'broiler_breeder', label: 'Broiler Breeder' },
                    { value: 'color_breeder', label: 'Color Breeder' },
                    { value: 'layer_breeder', label: 'Layer Breeder' }
                ];
            }
        } else if (selectedAnimalType === 'swine') {
            if (selectedCategory === 'commercial') {
                return [
                    { value: 'nursery', label: 'Nursery' },
                    { value: 'grower', label: 'Grower' },
                    { value: 'finisher', label: 'Finisher' }
                ];
            } else if (selectedCategory === 'breeding') {
                return [
                    { value: 'sow_gestation', label: 'Sow Gestation' },
                    { value: 'sow_lactation', label: 'Sow Lactation' },
                    { value: 'boar', label: 'Boar' }
                ];
            }
        }
        return [];
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '2rem' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <button
                            onClick={() => navigate('/feed-additives')}
                            style={{
                                padding: '0.5rem',
                                background: '#f3f4f6',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.background = '#e5e7eb'}
                            onMouseOut={(e) => e.target.style.background = '#f3f4f6'}
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                            📊 Reference Data Viewer
                        </h1>
                    </div>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', marginLeft: '3rem' }}>
                        View and export complete consumption database for all animal categories
                    </p>
                </div>

                {/* Controls */}
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                                Animal Type
                            </label>
                            <select
                                value={selectedAnimalType}
                                onChange={(e) => {
                                    setSelectedAnimalType(e.target.value);
                                    setSelectedCategory('commercial');
                                    setSelectedSpecificCategory(e.target.value === 'poultry' ? 'broiler' : 'nursery');
                                }}
                                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem' }}
                            >
                                <option value="poultry">Poultry</option>
                                <option value="swine">Swine</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                                Category
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value);
                                    const newOptions = getSpecificCategoryOptions();
                                    if (newOptions.length > 0) {
                                        setSelectedSpecificCategory(newOptions[0].value);
                                    }
                                }}
                                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem' }}
                            >
                                {getCategoryOptions().map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                                Specific Category
                            </label>
                            <select
                                value={selectedSpecificCategory}
                                onChange={(e) => setSelectedSpecificCategory(e.target.value)}
                                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem' }}
                            >
                                {getSpecificCategoryOptions().map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <button
                                onClick={exportToExcel}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem 1rem',
                                    background: '#10b981',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <FileSpreadsheet size={16} />
                                Export to Excel
                            </button>
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    {renderTable()}
                </div>

                {/* Footer Info */}
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'white', borderRadius: '8px', fontSize: '0.875rem', color: '#6b7280' }}>
                    <p><strong>Database Version:</strong> {consumptionData?.database_info?.version || 'Loading...'}</p>
                    <p><strong>Last Updated:</strong> {consumptionData?.database_info?.last_updated || 'Loading...'}</p>
                    <p><strong>Completeness:</strong> {consumptionData?.database_info?.completeness || 'Loading...'}</p>
                </div>
            </div>
        </div>
    );
};

export default ReferenceDataViewer;
