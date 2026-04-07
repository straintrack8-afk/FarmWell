import React from 'react';
import{useTranslation}from'../../../hooks/useTranslation';

// CHART: Daily Mortality Bar Chart
export const DailyMortalityChart = ({ history, initialPop }) => {
  const{t}=useTranslation();
  const mortData = history.filter(h => h.day && h.mortality > 0);

  if (!mortData.length) return (
    <p style={{ color: '#9ca3af', fontStyle: 'italic', fontSize: '13px' }}>
      {t('farmguide.noMortalityData')||'No mortality data recorded yet.'}
    </p>
  );

  const W = 800, H = 220;
  const pad = { t: 20, r: 20, b: 40, l: 55 };
  const cW = W - pad.l - pad.r;
  const cH = H - pad.t - pad.b;

  const alertThreshold = initialPop * 0.005; // 0.5%
  const maxMort = Math.max(...mortData.map(h => h.mortality), alertThreshold * 1.2);
  const maxDay = Math.max(...mortData.map(h => h.day), 56);

  const xScale = (day) => pad.l + ((day - 1) / (maxDay - 1)) * cW;
  const yScale = (v) => pad.t + cH - (v / maxMort) * cH;
  const barW = Math.max(8, cW / (maxDay * 1.5));

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

        {/* X labels */}
        {mortData.map(h => (
          <text key={h.day} x={xScale(h.day)} y={H - pad.b + 16}
            textAnchor="middle" fontSize="10" fill="#9ca3af">D{h.day}</text>
        ))}

        {/* Bars */}
        {mortData.map((h, i) => {
          const isSpike = h.mortality > alertThreshold;
          const x = xScale(h.day) - barW / 2;
          const barH = cH - (yScale(h.mortality) - pad.t);
          return (
            <g key={i}>
              <rect
                x={x} y={yScale(h.mortality)}
                width={barW} height={Math.max(barH, 2)}
                fill={isSpike ? '#EF4444' : 'var(--fw-orange, #E8652A)'}
                opacity={isSpike ? 0.9 : 0.7}
                rx="2"
              />
              <text
                x={xScale(h.day)} y={yScale(h.mortality) - 5}
                textAnchor="middle" fontSize="9"
                fill={isSpike ? '#EF4444' : 'var(--fw-orange, #E8652A)'}
                fontWeight="600"
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
          <rect x="70" y="-7" width="14" height="9" fill="#EF4444" opacity="0.9" rx="1"/>
          <text x="88" y="3" fontSize="10" fill="#374151">{t('farmguide.spikeMortality')||'Spike (>0.5%/day)'}</text>
        </g>
      </svg>
    </div>
  );
};
