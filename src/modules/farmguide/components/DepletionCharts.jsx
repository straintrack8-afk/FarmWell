import React, { useState } from 'react';
import{useTranslation}from'../../../hooks/useTranslation';

// CHART: Daily Mortality Bar Chart
export const DailyMortalityChart = ({ history, initialPop }) => {
  const{t}=useTranslation();
  const [tooltip, setTooltip] = useState(null);
  
  // Handle both day-based (Broiler/Color Chicken) and week-based (Layer) data
  const isWeekBased = history.length > 0 && history[0].week !== undefined && history[0].day === undefined;
  const mortData = history.filter(h => {
    const timeValue = isWeekBased ? h.week : h.day;
    return timeValue && h.mortality > 0;
  });

  if (!mortData.length) return (
    <p style={{ color: '#9ca3af', fontStyle: 'italic', fontSize: '13px' }}>
      {t('farmguide.noMortalityData')||'No mortality data recorded yet.'}
    </p>
  );

  const W = 800, H = 240;
  const pad = { t: 20, r: 50, b: 70, l: 40 };
  const cW = W - pad.l - pad.r;
  const cH = H - pad.t - pad.b;

  const alertThreshold = initialPop * 0.005; // 0.5%
  const maxMort = Math.max(...mortData.map(h => h.mortality), alertThreshold * 1.2);
  
  // Use actual min/max from data for linear scale
  const timeValues = mortData.map(h => isWeekBased ? h.week : h.day);
  const minTime = Math.min(...timeValues);
  const maxTime = Math.max(...timeValues);

  const xScale = (val) => {
    if (maxTime === minTime) return pad.l + cW / 2;
    return pad.l + ((val - minTime) / (maxTime - minTime)) * cW;
  };
  const yScale = (v) => pad.t + cH - (v / maxMort) * cH;
  const totalBars = mortData.length;
  const barW = 8; // Fixed narrow width to prevent overlap

  const totalMort = mortData.reduce((s, h) => s + h.mortality, 0);
  const alertY = yScale(alertThreshold);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
        <h3 style={{ margin: 0, fontSize: '1.125rem', color: 'var(--fw-text)' }}>{t('farmguide.dailyMortality')||'Daily Mortality'}</h3>
        <span style={{ fontSize: '13px', color: '#6b7280' }}>
          {t('farmguide.totalBirds')||'Total'}: {totalMort} birds ({((totalMort / initialPop) * 100).toFixed(2)}%)
        </span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
        {/* Alert line 0.5% */}
        <line x1={pad.l} y1={alertY} x2={W - pad.r} y2={alertY}
          stroke="#EF4444" strokeWidth="1" strokeDasharray="4,3" opacity="0.7" />
        <text x={W - pad.r + 4} y={alertY + 4} fontSize="9" fill="#EF4444">
          Alert ({Math.round(alertThreshold)})
        </text>

        {/* Y labels */}
        {[0, Math.round(alertThreshold), Math.round(maxMort)].filter((v, i, a) => a.indexOf(v) === i).map((v, i) => (
          <text key={i} x={pad.l - 6} y={yScale(v) + 4}
            textAnchor="end" fontSize="10" fill="#9ca3af">{v}</text>
        ))}

        {/* X-axis baseline */}
        <line
          x1={pad.l}
          x2={W - pad.r}
          y1={H - pad.b}
          y2={H - pad.b}
          stroke="rgba(0,0,0,0.1)"
          strokeWidth="1"
        />

        {/* X labels - numbers only (one per bar) */}
        {mortData.map((h) => {
          const timeValue = isWeekBased ? h.week : h.day;
          const xPos = xScale(timeValue);
          const yPos = H - pad.b + 16;
          
          return (
            <text 
              key={timeValue} 
              x={xPos} 
              y={yPos}
              textAnchor="middle"
              fontSize="9" 
              fill="#888"
            >
              {timeValue}
            </text>
          );
        })}

        {/* Centered WEEK/DAY label */}
        <text
          x={W / 2}
          y={H - pad.b + 32}
          textAnchor="middle"
          fontSize="11"
          fill="#888"
          fontWeight="500"
        >
          {isWeekBased ? 'WEEK' : 'DAY'}
        </text>

        {/* Bars */}
        {mortData.map((h, i) => {
          const timeValue = isWeekBased ? h.week : h.day;
          const isSpike = h.mortality > alertThreshold;
          const x = xScale(timeValue) - barW / 2;
          const barH = cH - (yScale(h.mortality) - pad.t);
          return (
            <g key={i}>
              <rect
                x={x} y={yScale(h.mortality)}
                width={barW} height={Math.max(barH, 2)}
                fill={isSpike ? '#EF4444' : 'var(--fw-orange, #E8652A)'}
                opacity={isSpike ? 0.9 : 0.7}
                rx="2"
                style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setTooltip({
                    x: rect.left + rect.width / 2,
                    y: rect.top,
                    timeValue,
                    mortality: h.mortality,
                    isWeekBased
                  });
                }}
                onMouseLeave={() => setTooltip(null)}
              />
              <text
                x={xScale(timeValue)} y={yScale(h.mortality) - 5}
                textAnchor="middle" fontSize="9"
                fill={isSpike ? '#EF4444' : 'var(--fw-orange, #E8652A)'}
                fontWeight="600"
                style={{ pointerEvents: 'none' }}
              >
                {h.mortality}
              </text>
            </g>
          );
        })}

        {/* Legend */}
        <g transform={`translate(${pad.l}, ${H - 6})`}>
          <rect x="0" y="-7" width="14" height="9" fill="var(--fw-orange)" opacity="0.7" rx="1"/>
          <text x="18" y="3" fontSize="10" fill="#374151">{t('farmguide.normalMortality')||'Normal'}</text>
          <rect x="90" y="-7" width="14" height="9" fill="#EF4444" opacity="0.9" rx="1"/>
          <text x="108" y="3" fontSize="10" fill="#374151">{t('farmguide.spikeMortality')||'Spike (>0.5%/day)'}</text>
        </g>
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          style={{
            position: 'fixed',
            left: `${tooltip.x}px`,
            top: `${tooltip.y - 60}px`,
            transform: 'translateX(-50%)',
            background: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
            padding: '8px 12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            fontSize: '13px',
            pointerEvents: 'none',
            zIndex: 1000,
            whiteSpace: 'nowrap'
          }}
        >
          <div style={{ fontWeight: '600', marginBottom: '4px' }}>
            {tooltip.isWeekBased ? `Week ${tooltip.timeValue}` : `Day ${tooltip.timeValue}`}
          </div>
          <div>
            Mortality: {tooltip.mortality} birds
          </div>
        </div>
      )}
    </div>
  );
};
