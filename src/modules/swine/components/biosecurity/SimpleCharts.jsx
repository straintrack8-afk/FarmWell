import React from 'react';

// --- Simple Pie Chart ---
export function SimplePieChart({ data, size = 200 }) {
    // data: [{ label, value, color }]
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulativePercent = 0;

    if (total === 0) {
        return (
            <div style={{ width: size, height: size, borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                No Data
            </div>
        );
    }

    // Prepare segments
    const segments = data.map((item, index) => {
        const percent = item.value / total;
        const startPercent = cumulativePercent;
        const endPercent = cumulativePercent + percent;
        cumulativePercent += percent;

        // Calculate SVG path for segment (using conic-gradient logic via SVG stroke-dasharray is hard, 
        // easier to use simpler method: viewBox 0 0 32 32, circle with stroke-dasharray)
        // Circumference = 100
        // r = 15.9155
        // cx = 16, cy = 16

        const dashArray = `${percent * 100} ${100 - percent * 100}`;
        const dashOffset = 25 - (startPercent * 100); // 25 is to start at top (12 o'clock)

        return (
            <circle
                key={index}
                r="15.9155"
                cx="16"
                cy="16"
                fill="transparent"
                stroke={item.color}
                strokeWidth="6"
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                style={{ transition: 'all 0.3s ease' }}
            >
                <title>{item.label}: {item.value}</title>
            </circle>
        );
    });

    return (
        <div style={{ position: 'relative', width: size, height: size }}>
            <svg viewBox="0 0 32 32" width="100%" height="100%" style={{ transform: 'rotate(0deg)' }}>
                {segments}
            </svg>
            {/* Center Text (Total or Label) */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1f2937' }}>{total}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Total</div>
            </div>
        </div>
    );
}

// --- Simple Line Chart ---
export function SimpleLineChart({ data, height = 200, color = '#667eea' }) {
    // data: [{ label, value }] (label is date/string, value is number)

    if (!data || data.length === 0) {
        return (
            <div style={{ height, background: '#f9fafb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                No Data
            </div>
        );
    }

    const padding = 20;
    const width = 100; // use viewBox percentages
    const chartHeight = 100;

    // Y Axis: 0 to 100 fixed for Score
    const maxY = 100;
    const minY = 0;

    // Points
    const points = data.map((point, index) => {
        const x = data.length === 1 ? 50 : padding + (index / (data.length - 1)) * (width - 2 * padding);
        const y = chartHeight - padding - ((point.value - minY) / (maxY - minY)) * (chartHeight - 2 * padding);
        return { x, y, ...point };
    });

    // SVG Polyline string
    const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');

    return (
        <div style={{ width: '100%', height }}>
            <svg viewBox={`0 0 ${width} ${chartHeight}`} width="100%" height="100%" preserveAspectRatio="none">
                {/* Grid Lines */}
                <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="2" />
                <line x1={padding} y1={chartHeight / 2} x2={width - padding} y2={chartHeight / 2} stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="2" />
                <line x1={padding} y1={chartHeight - padding} x2={width - padding} y2={chartHeight - padding} stroke="#e5e7eb" strokeWidth="0.5" />

                {/* Y Axis Labels (HTML overlay might be better, but simple text here) */}
                <text x={padding - 2} y={padding + 2} fontSize="4" textAnchor="end" fill="#9ca3af">100</text>
                <text x={padding - 2} y={chartHeight - padding + 2} fontSize="4" textAnchor="end" fill="#9ca3af">0</text>

                {/* Line */}
                <polyline
                    points={polylinePoints}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Data Points */}
                {points.map((p, i) => (
                    <circle
                        key={i}
                        cx={p.x}
                        cy={p.y}
                        r="3"
                        fill="white"
                        stroke={color}
                        strokeWidth="1.5"
                    >
                        <title>{p.label}: {p.value}</title>
                    </circle>
                ))}
            </svg>
            {/* X Axis Labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '1rem', paddingRight: '1rem', marginTop: '-10px', fontSize: '0.75rem', color: '#6b7280' }}>
                {data.length > 0 && <span>{data[0].label}</span>}
                {data.length > 1 && <span>{data[data.length - 1].label}</span>}
            </div>
        </div>
    );
}
