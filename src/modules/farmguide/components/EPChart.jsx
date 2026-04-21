import React, { useState } from 'react';
import { LAYER_RANGE } from '../data/layerRangeData';
import { useTranslation } from '../../../hooks/useTranslation';

export default function EPChart({ history = [], showStandardOnly = false, selectedWeek }) {
  const { t } = useTranslation();
  const [tooltip, setTooltip] = useState(null);
  
  // Filter production weeks only (W19-W80)
  const productionData = LAYER_RANGE.filter(r => r.week >= 19);
  
  const W = 800;
  const H = 300;
  const pad = { t: 20, r: 70, b: 50, l: 60 };
  const cW = W - pad.l - pad.r;
  const cH = H - pad.t - pad.b;

  // Y-axis: 0-100%
  const yScale = (val) => Math.max(pad.t, pad.t + cH - ((val / 100) * cH));
  
  // X-axis: W19-W80 (62 weeks)
  const xScale = (week) => pad.l + ((week - 19) / (80 - 19)) * cW;

  const buildPath = (points) => {
    if (!points || points.length < 2) return '';
    return points
      .map((p, i) => {
        const x = xScale(p.week);
        const y = yScale(p.value);
        if (isNaN(x) || isNaN(y)) return '';
        return (i === 0 ? 'M' : 'L') + ' ' + x.toFixed(1) + ' ' + y.toFixed(1);
      })
      .filter(Boolean)
      .join(' ');
  };

  // Standard EP% line from LAYER_RANGE
  const epStdPoints = productionData
    .filter(r => r.ep_pct !== null && r.ep_pct !== undefined)
    .map(r => ({ week: r.week, value: r.ep_pct }));

  // Actual EP% line from history
  const epActPoints = showStandardOnly ? [] : history
    .filter(h => h.week >= 19 && h.ep_actual_pct !== null && h.ep_actual_pct !== undefined)
    .map(h => ({ week: h.week, value: h.ep_actual_pct }));

  const epStdPath = buildPath(epStdPoints);
  const epActPath = buildPath(epActPoints);

  // Y-axis labels: 0%, 25%, 50%, 75%, 100%
  const yLabels = [0, 25, 50, 75, 100];
  
  // X-axis labels: W19, W30, W40...W80 (every 10 weeks to prevent overlap)
  const xLabels = [19, 30, 40, 50, 60, 70, 80];

  // Tooltip data for all production weeks
  const tooltipData = productionData.map(r => {
    const actData = history.find(h => h.week === r.week);
    return {
      week: r.week,
      epStd: r.ep_pct,
      epAct: actData?.ep_actual_pct
    };
  });

  // Check if there's any production data
  // showStandardOnly = true (Guide tab): always show standard curve regardless of history
  const hasProductionData = showStandardOnly || history.some(
    h => Number(h.week) >= 19 && h.ep_actual_pct !== null && h.ep_actual_pct !== undefined
  );

  if (!hasProductionData) {
    return (
      <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--fw-sub)', background: 'var(--fw-bg)', borderRadius: '8px' }}>
        {t('farmguide.epChartEmpty') || 'No production data yet. Enter W19+ data to see EP% chart.'}
      </p>
    );
  }

  return (
    <svg
      viewBox={'0 0 ' + W + ' ' + H}
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      {/* Horizontal gridlines */}
      {yLabels.map((v) => (
        <line
          key={v}
          x1={pad.l}
          y1={yScale(v)}
          x2={W - pad.r}
          y2={yScale(v)}
          stroke="#e5e7eb"
          strokeWidth="1"
        />
      ))}

      {/* Y-axis labels (left) */}
      {yLabels.map((v) => (
        <text
          key={v}
          x={pad.l - 6}
          y={yScale(v) + 4}
          textAnchor="end"
          fontSize="10"
          fill="#0C3830"
        >
          {v}%
        </text>
      ))}

      {/* X-axis labels */}
      {xLabels.map((w) => (
        <text
          key={w}
          x={xScale(w)}
          y={H - pad.b + 16}
          textAnchor="middle"
          fontSize="11"
          fill="#6b7280"
        >
          {'W' + w}
        </text>
      ))}

      {/* Standard EP% line (teal dashed) */}
      {epStdPath && (
        <path
          d={epStdPath}
          fill="none"
          stroke="#0C3830"
          strokeWidth="2"
          strokeDasharray="5,3"
        />
      )}

      {/* Actual EP% line (orange solid) */}
      {epActPath && (
        <path
          d={epActPath}
          fill="none"
          stroke="#E65100"
          strokeWidth="2.5"
        />
      )}

      {/* Actual EP% data points (orange circles) */}
      {epActPoints.map((p, i) => {
        const cx = xScale(p.week);
        const cy = yScale(p.value);
        if (isNaN(cx) || isNaN(cy)) return null;
        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={5}
            fill="#E65100"
            stroke="white"
            strokeWidth="2"
          />
        );
      })}

      {/* Standard EP% markers (teal circles) */}
      {epStdPoints
        .filter((p, i) => i % 5 === 0 || p.week === selectedWeek)
        .map((p, i) => {
          const cx = xScale(p.week);
          const cy = yScale(p.value);
          const isSelected = p.week === selectedWeek;

          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={isSelected ? 6 : 3}
              fill={isSelected ? '#2D7A5F' : 'white'}
              stroke={isSelected ? '#2D7A5F' : '#0C3830'}
              strokeWidth={isSelected ? 2 : 1.5}
            />
          );
        })}

      {/* Legend */}
      <g transform={'translate(' + pad.l + ', ' + (H - 12) + ')'}>
        <line x1="0" y1="0" x2="16" y2="0" stroke="#0C3830" strokeWidth="2" strokeDasharray="4,2" />
        <text x="20" y="4" fontSize="10" fill="#374151">{t('farmguide.epStandard') || 'EP% Standard'}</text>

        {!showStandardOnly && (
          <>
            <line x1="120" y1="0" x2="136" y2="0" stroke="#E65100" strokeWidth="2.5" />
            <text x="140" y="4" fontSize="10" fill="#374151">{t('farmguide.epActual') || 'EP% Actual'}</text>
          </>
        )}
      </g>

      {/* Hover areas for tooltip */}
      {tooltipData.map((data, i) => {
        const x = xScale(data.week);
        const hoverWidth = cW / 62;
        return (
          <rect
            key={i}
            x={x - hoverWidth / 2}
            y={pad.t}
            width={hoverWidth}
            height={cH}
            fill="transparent"
            onMouseEnter={() => setTooltip({ x, data })}
            onMouseLeave={() => setTooltip(null)}
            style={{ cursor: 'crosshair' }}
          />
        );
      })}

      {/* Tooltip */}
      {tooltip && (
        <g>
          <rect
            x={tooltip.x > W - 200 ? tooltip.x - 160 : tooltip.x + 10}
            y={pad.t + 10}
            width={150}
            height={80}
            fill="white"
            stroke="#d1d5db"
            strokeWidth="1"
            rx="4"
            filter="url(#tooltip-shadow)"
          />
          <defs>
            <filter id="tooltip-shadow-ep" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
            </filter>
          </defs>
          <text x={tooltip.x > W - 200 ? tooltip.x - 150 : tooltip.x + 20} y={pad.t + 28} fontSize="11" fontWeight="600" fill="#374151">
            {t('farmguide.week') || 'Week'} {tooltip.data.week}
          </text>
          <text x={tooltip.x > W - 200 ? tooltip.x - 150 : tooltip.x + 20} y={pad.t + 46} fontSize="10" fill="#0C3830">
            {t('farmguide.epStandard') || 'EP% Standard'}: {tooltip.data.epStd ? tooltip.data.epStd + '%' : '—'}
          </text>
          {!showStandardOnly && (
            <text x={tooltip.x > W - 200 ? tooltip.x - 150 : tooltip.x + 20} y={pad.t + 62} fontSize="10" fill="#E65100" fontWeight="600">
              {t('farmguide.epActual') || 'EP% Actual'}: {tooltip.data.epAct ? tooltip.data.epAct + '%' : '—'}
            </text>
          )}
        </g>
      )}
    </svg>
  );
}
