import React,{useState} from 'react';
import { getColorRange } from '../data/colorChickenRangeData';
import { BROILER_RANGE } from '../data/broilerRangeData';
import { LAYER_RANGE } from '../data/layerRangeData';
import{useTranslation}from'../../../hooks/useTranslation';

export default function CombinedChart({ history = [], initialPop = 10000, module, variant, sex }) {
  const{t}=useTranslation();
  
  // Layer uses week-based data, others use day-based
  const isLayer = module === 'layer';
  
  // For Layer: render two separate charts
  if (isLayer) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <LayerBWChart history={history} t={t} />
        <LayerFeedChart history={history} t={t} />
      </div>
    );
  }
  
  // For Broiler/Color Chicken: render combined chart
  return <BroilerCombinedChart history={history} initialPop={initialPop} module={module} variant={variant} sex={sex} t={t} />;
}

// Layer Body Weight Chart Component
function LayerBWChart({ history, t }) {
  const [tooltip, setTooltip] = useState(null);
  const rangeData = LAYER_RANGE;
  
  const W = 800;
  const H = 280;
  const pad = { t: 40, r: 40, b: 50, l: 60 };
  const cW = W - pad.l - pad.r;
  const cH = H - pad.t - pad.b;

  const bwMax=Math.max(
    ...rangeData.map(r=>r.bw_avg||0),
    ...history.filter(h=>h.bw_actual_g).map(h=>h.bw_actual_g),
    1
  )*1.1;

  const maxX = 80;
  const xScale = (val) => pad.l + ((val - 1) / (maxX - 1)) * cW;
  const yBW = (val) => Math.max(pad.t, pad.t + cH - ((val / bwMax) * cH));

  const buildPath = (points) => {
    if (!points || points.length < 2) return '';
    return points
      .map((p, i) => {
        const x = xScale(p.x);
        const y = yBW(p.value);
        if (isNaN(x) || isNaN(y)) return '';
        return (i === 0 ? 'M' : 'L') + ' ' + x.toFixed(1) + ' ' + y.toFixed(1);
      })
      .filter(Boolean)
      .join(' ');
  };

  const bwStdPoints = rangeData.map(r => ({ x: r.week, value: r.bw_avg }));
  const bwActPoints = history.filter(h => h.bw_actual_g).map(h => ({ x: h.week, value: h.bw_actual_g }));

  const bwStdPath = buildPath(bwStdPoints);
  const bwActPath = buildPath(bwActPoints);

  const bwYLabels = [0, 700, 1400, 2100];
  const xAxisLabels = [1, 10, 20, 30, 40, 50, 60, 70, 80];

  const allVals = Array.from({ length: maxX }, (_, i) => i + 1);
  const tooltipData = allVals.map(val => {
    const stdData = rangeData.find(r => r.week === val);
    const actData = history.find(h => h.week === val);
    return {
      val,
      label: `Week ${val}`,
      bwStd: stdData?.bw_avg,
      bwAct: actData?.bw_actual_g
    };
  });

  return (
    <div style={{
      background: 'var(--fw-card, white)',
      borderRadius: '12px',
      padding: '1.25rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid var(--fw-border, #e5e7eb)'
    }}>
      <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: '600', color: 'var(--fw-text)' }}>
        {t('farmguide.bodyWeight') || 'Body Weight'}
      </h3>
      <svg
        viewBox={'0 0 ' + W + ' ' + H}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        {bwYLabels.map((v) => (
          <line
            key={v}
            x1={pad.l}
            y1={yBW(v)}
            x2={W - pad.r}
            y2={yBW(v)}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        {bwYLabels.map((v) => (
          <text
            key={v}
            x={pad.l - 6}
            y={yBW(v) + 4}
            textAnchor="end"
            fontSize="10"
            fill="var(--fw-teal, #1B7A6E)"
          >
            {v}g
          </text>
        ))}

        {xAxisLabels.map((val) => (
          <text
            key={val}
            x={xScale(val)}
            y={H - pad.b + 16}
            textAnchor="middle"
            fontSize="11"
            fill="#6b7280"
          >
            W{val}
          </text>
        ))}

        {bwStdPath && (
          <path
            d={bwStdPath}
            fill="none"
            stroke="var(--fw-teal, #1B7A6E)"
            strokeWidth="2"
          />
        )}

        {bwActPath && (
          <path
            d={bwActPath}
            fill="none"
            stroke="var(--fw-orange, #E8652A)"
            strokeWidth="2.5"
          />
        )}

        {bwActPoints.map((p, i) => {
          const cx = xScale(p.x);
          const cy = yBW(p.value);
          if (isNaN(cx) || isNaN(cy)) return null;
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={5}
              fill="var(--fw-orange, #E8652A)"
              stroke="white"
              strokeWidth="2"
            />
          );
        })}

        {bwStdPoints
          .filter((_, i) => i % 5 === 0)
          .map((p, i) => {
            const cx = xScale(p.x);
            const cy = yBW(p.value);
            return (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={3}
                fill="white"
                stroke="var(--fw-teal, #1B7A6E)"
                strokeWidth="1.5"
              />
            );
          })}

        <g transform={'translate(' + pad.l + ', ' + (H - 12) + ')'}>
          <line x1="0" y1="0" x2="16" y2="0" stroke="var(--fw-teal, #1B7A6E)" strokeWidth="2" />
          <text x="20" y="4" fontSize="10" fill="#374151">{t('farmguide.bwStandard')||'BW Standard'}</text>

          <line x1="120" y1="0" x2="136" y2="0" stroke="var(--fw-orange, #E8652A)" strokeWidth="2.5" />
          <text x="140" y="4" fontSize="10" fill="#374151">{t('farmguide.bwActual')||'BW Actual'}</text>
        </g>

        {bwActPoints.length === 0 && (
          <text
            x={W / 2}
            y={H / 2}
            textAnchor="middle"
            fontSize="12"
            fill="#9ca3af"
          >
            {t('farmguide.noActualData') || 'No actual data yet. Enter flock data to see comparison.'}
          </text>
        )}

        {tooltipData.map((data,i)=>{
          const x=xScale(data.val);
          const hoverWidth=cW/maxX;
          return(
            <rect
              key={i}
              x={x-hoverWidth/2}
              y={pad.t}
              width={hoverWidth}
              height={cH}
              fill="transparent"
              onMouseEnter={()=>setTooltip({x,data})}
              onMouseLeave={()=>setTooltip(null)}
              style={{cursor:'crosshair'}}
            />
          );
        })}

        {tooltip&&(
          <g>
            <rect
              x={tooltip.x>W-200?tooltip.x-140:tooltip.x+10}
              y={pad.t+10}
              width={130}
              height={70}
              fill="white"
              stroke="#d1d5db"
              strokeWidth="1"
              rx="4"
              filter="url(#tooltip-shadow-bw)"
            />
            <defs>
              <filter id="tooltip-shadow-bw" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15"/>
              </filter>
            </defs>
            <text x={tooltip.x>W-200?tooltip.x-130:tooltip.x+20} y={pad.t+28} fontSize="11" fontWeight="600" fill="#374151">
              {tooltip.data.label}
            </text>
            <text x={tooltip.x>W-200?tooltip.x-130:tooltip.x+20} y={pad.t+46} fontSize="10" fill="var(--fw-teal,#1B7A6E)">
              {t('farmguide.bwStandard')||'BW Standard'}: {tooltip.data.bwStd?tooltip.data.bwStd+'g':'—'}
            </text>
            <text x={tooltip.x>W-200?tooltip.x-130:tooltip.x+20} y={pad.t+62} fontSize="10" fill="var(--fw-orange,#E8652A)" fontWeight="600">
              {t('farmguide.bwActual')||'BW Actual'}: {tooltip.data.bwAct?tooltip.data.bwAct+'g':'—'}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

// Layer Feed Intake Chart Component
function LayerFeedChart({ history, t }) {
  const [tooltip, setTooltip] = useState(null);
  const rangeData = LAYER_RANGE;
  
  const W = 800;
  const H = 280;
  const pad = { t: 40, r: 40, b: 50, l: 60 };
  const cW = W - pad.l - pad.r;
  const cH = H - pad.t - pad.b;

  const feedMax=Math.max(
    ...rangeData.filter(r=>r.feed_g_day).map(r=>r.feed_g_day||0),
    ...history.filter(h=>h.feed_actual_g).map(h=>h.feed_actual_g),
    1
  )*1.1;

  const maxX = 80;
  const xScale = (val) => pad.l + ((val - 1) / (maxX - 1)) * cW;
  const yFeed = (val) => Math.max(pad.t, pad.t + cH - ((val / feedMax) * cH));

  const buildPath = (points) => {
    if (!points || points.length < 2) return '';
    return points
      .map((p, i) => {
        const x = xScale(p.x);
        const y = yFeed(p.value);
        if (isNaN(x) || isNaN(y)) return '';
        return (i === 0 ? 'M' : 'L') + ' ' + x.toFixed(1) + ' ' + y.toFixed(1);
      })
      .filter(Boolean)
      .join(' ');
  };

  const feedStdPoints = rangeData.filter(r => r.feed_g_day).map(r => ({ x: r.week, value: r.feed_g_day }));
  const feedActPoints = history.filter(h => h.feed_actual_g).map(h => ({ x: h.week, value: h.feed_actual_g }));

  const feedStdPath = buildPath(feedStdPoints);
  const feedActPath = buildPath(feedActPoints);

  const feedYLabels = [0, 50, 100, 150, 200];
  const xAxisLabels = [1, 10, 20, 30, 40, 50, 60, 70, 80];

  const allVals = Array.from({ length: maxX }, (_, i) => i + 1);
  const tooltipData = allVals.map(val => {
    const stdData = rangeData.find(r => r.week === val);
    const actData = history.find(h => h.week === val);
    return {
      val,
      label: `Week ${val}`,
      feedStd: stdData?.feed_g_day,
      feedAct: actData?.feed_actual_g
    };
  });

  return (
    <div style={{
      background: 'var(--fw-card, white)',
      borderRadius: '12px',
      padding: '1.25rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid var(--fw-border, #e5e7eb)',
      marginBottom: '1.5rem'
    }}>
      <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: '600', color: 'var(--fw-text)' }}>
        {t('farmguide.feedIntake') || 'Feed Intake'}
      </h3>
      <svg
        viewBox={'0 0 ' + W + ' ' + H}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        {feedYLabels.map((v) => (
          <line
            key={v}
            x1={pad.l}
            y1={yFeed(v)}
            x2={W - pad.r}
            y2={yFeed(v)}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        {feedYLabels.map((v) => (
          <text
            key={v}
            x={pad.l - 6}
            y={yFeed(v) + 4}
            textAnchor="end"
            fontSize="10"
            fill="#5B8DB8"
          >
            {v}g
          </text>
        ))}

        {xAxisLabels.map((val) => (
          <text
            key={val}
            x={xScale(val)}
            y={H - pad.b + 16}
            textAnchor="middle"
            fontSize="11"
            fill="#6b7280"
          >
            W{val}
          </text>
        ))}

        {feedStdPath && (
          <path
            d={feedStdPath}
            fill="none"
            stroke="#5B8DB8"
            strokeWidth="2"
            strokeDasharray="5,3"
          />
        )}

        {feedActPath && (
          <path
            d={feedActPath}
            fill="none"
            stroke="#F5A623"
            strokeWidth="2.5"
            strokeDasharray="5,3"
          />
        )}

        {feedActPoints.map((p, i) => {
          const cx = xScale(p.x);
          const cy = yFeed(p.value);
          if (isNaN(cx) || isNaN(cy)) return null;
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={5}
              fill="#F5A623"
              stroke="white"
              strokeWidth="2"
            />
          );
        })}

        {feedStdPoints
          .filter((_, i) => i % 5 === 0)
          .map((p, i) => {
            const cx = xScale(p.x);
            const cy = yFeed(p.value);
            return (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={3}
                fill="white"
                stroke="#5B8DB8"
                strokeWidth="1.5"
              />
            );
          })}

        <g transform={'translate(' + pad.l + ', ' + (H - 12) + ')'}>
          <line x1="0" y1="0" x2="16" y2="0" stroke="#5B8DB8" strokeWidth="2" strokeDasharray="4,2" />
          <text x="20" y="4" fontSize="10" fill="#374151">{t('farmguide.feedStandard')||'Feed Standard'}</text>

          <line x1="130" y1="0" x2="146" y2="0" stroke="#F5A623" strokeWidth="2.5" strokeDasharray="4,2" />
          <text x="150" y="4" fontSize="10" fill="#374151">{t('farmguide.feedActual')||'Feed Actual'}</text>
        </g>

        {feedActPoints.length === 0 && (
          <text
            x={W / 2}
            y={H / 2}
            textAnchor="middle"
            fontSize="12"
            fill="#9ca3af"
          >
            {t('farmguide.noActualData') || 'No actual data yet. Enter flock data to see comparison.'}
          </text>
        )}

        {tooltipData.map((data,i)=>{
          const x=xScale(data.val);
          const hoverWidth=cW/maxX;
          return(
            <rect
              key={i}
              x={x-hoverWidth/2}
              y={pad.t}
              width={hoverWidth}
              height={cH}
              fill="transparent"
              onMouseEnter={()=>setTooltip({x,data})}
              onMouseLeave={()=>setTooltip(null)}
              style={{cursor:'crosshair'}}
            />
          );
        })}

        {tooltip&&(
          <g>
            <rect
              x={tooltip.x>W-200?tooltip.x-140:tooltip.x+10}
              y={pad.t+10}
              width={130}
              height={70}
              fill="white"
              stroke="#d1d5db"
              strokeWidth="1"
              rx="4"
              filter="url(#tooltip-shadow-feed)"
            />
            <defs>
              <filter id="tooltip-shadow-feed" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15"/>
              </filter>
            </defs>
            <text x={tooltip.x>W-200?tooltip.x-130:tooltip.x+20} y={pad.t+28} fontSize="11" fontWeight="600" fill="#374151">
              {tooltip.data.label}
            </text>
            <text x={tooltip.x>W-200?tooltip.x-130:tooltip.x+20} y={pad.t+46} fontSize="10" fill="#5B8DB8">
              {t('farmguide.feedStandard')||'Feed Standard'}: {tooltip.data.feedStd?tooltip.data.feedStd+'g/day':'—'}
            </text>
            <text x={tooltip.x>W-200?tooltip.x-130:tooltip.x+20} y={pad.t+62} fontSize="10" fill="#F5A623" fontWeight="600">
              {t('farmguide.feedActual')||'Feed Actual'}: {tooltip.data.feedAct?tooltip.data.feedAct+'g/day':'—'}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

// Broiler/Color Chicken Combined Chart Component (unchanged from original)
function BroilerCombinedChart({ history, initialPop, module, variant, sex, t }) {
  const[tooltip,setTooltip]=useState(null);
  const rangeData = (module === 'color_chicken' ? getColorRange(variant||'choi',sex||'male') : BROILER_RANGE);
  
  const W = 800;
  const H = 300;
  const pad = { t: 20, r: 60, b: 50, l: 60 };
  const cW = W - pad.l - pad.r;
  const cH = H - pad.t - pad.b;

  const bwMax=Math.max(
    ...rangeData.map(r=>r.bw_avg||0),
    ...history.filter(h=>h.bw_actual_g).map(h=>h.bw_actual_g),
    1
  )*1.1;
  const feedMax=Math.max(
    ...rangeData.map(r=>r.feed_avg||0),
    ...history.filter(h=>h.feed_actual_g).map(h=>h.feed_actual_g),
    1
  )*1.1;

  const maxX = 56;
  const xScale = (val) => pad.l + ((val - 1) / (maxX - 1)) * cW;
  const yBW = (val) => Math.max(pad.t, pad.t + cH - ((val / bwMax) * cH));
  const yFeed = (val) => Math.max(pad.t, pad.t + cH - ((val / feedMax) * cH));

  const buildPath = (points) => {
    if (!points || points.length < 2) return '';
    return points
      .map((p, i) => {
        const x = xScale(p.x);
        const y = p.yFn(p.value);
        if (isNaN(x) || isNaN(y)) return '';
        return (i === 0 ? 'M' : 'L') + ' ' + x.toFixed(1) + ' ' + y.toFixed(1);
      })
      .filter(Boolean)
      .join(' ');
  };

  const bwStdPoints = rangeData.filter((_, i) => i % 7 === 0 || i === rangeData.length - 1).map(r => ({ x: r.day, value: r.bw_avg, yFn: yBW }));
  const feedStdPoints = rangeData.filter((_, i) => i % 7 === 0 || i === rangeData.length - 1).map(r => ({ x: r.day, value: r.feed_avg, yFn: yFeed }));
  const bwActPoints = history.filter(h => h.bw_actual_g).map(h => ({ x: h.day, value: h.bw_actual_g, yFn: yBW }));
  const feedActPoints = history.filter(h => h.feed_actual_g && initialPop > 0).map(h => ({ x: h.day, value: h.feed_actual_g, yFn: yFeed }));

  const bwStdPath = buildPath(bwStdPoints);
  const feedStdPath = buildPath(feedStdPoints);
  const bwActPath = buildPath(bwActPoints);
  const feedActPath = buildPath(feedActPoints);

  const bwYLabels = [0, 700, 1400, 2100];
  const feedYLabels = [0, 50, 100, 150];
  const xAxisLabels = [1, 7, 14, 21, 28, 35, 42, 49, 56];

  const maxVal = rangeData.length > 0 ? rangeData[rangeData.length - 1].day : 56;
  const allVals = Array.from({ length: maxVal }, (_, i) => i + 1);
  const tooltipData = allVals.map(val => {
    const stdData = rangeData.find(r => r.day === val);
    const actData = history.find(h => h.day === val);
    return {
      val,
      label: `Day ${val}`,
      bwStd: stdData?.bw_avg,
      bwAct: actData?.bw_actual_g,
      feedStd: stdData?.feed_avg,
      feedAct: actData?.feed_actual_g
    };
  });

  return (
    <svg
      viewBox={'0 0 ' + W + ' ' + H}
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      {bwYLabels.map((v) => (
        <line
          key={v}
          x1={pad.l}
          y1={yBW(v)}
          x2={W - pad.r}
          y2={yBW(v)}
          stroke="#e5e7eb"
          strokeWidth="1"
        />
      ))}

      {bwYLabels.map((v) => (
        <text
          key={v}
          x={pad.l - 6}
          y={yBW(v) + 4}
          textAnchor="end"
          fontSize="10"
          fill="var(--fw-teal, #1B7A6E)"
        >
          {v}g
        </text>
      ))}

      {feedYLabels.map((v) => (
        <text
          key={v}
          x={W - pad.r + 6}
          y={yFeed(v) + 4}
          textAnchor="start"
          fontSize="10"
          fill="#5B8DB8"
        >
          {v}g
        </text>
      ))}

      {xAxisLabels.map((val) => (
        <text
          key={val}
          x={xScale(val)}
          y={H - pad.b + 16}
          textAnchor="middle"
          fontSize="11"
          fill="#6b7280"
        >
          D{val}
        </text>
      ))}

      {bwStdPath && (
        <path
          d={bwStdPath}
          fill="none"
          stroke="var(--fw-teal, #1B7A6E)"
          strokeWidth="2"
        />
      )}

      {feedStdPath && (
        <path
          d={feedStdPath}
          fill="none"
          stroke="#5B8DB8"
          strokeWidth="1.5"
          strokeDasharray="5,3"
        />
      )}

      {bwActPath && (
        <path
          d={bwActPath}
          fill="none"
          stroke="var(--fw-orange, #E8652A)"
          strokeWidth="2.5"
        />
      )}

      {feedActPath && (
        <path
          d={feedActPath}
          fill="none"
          stroke="#F5A623"
          strokeWidth="1.5"
          strokeDasharray="5,3"
          opacity="0.9"
        />
      )}

      {feedActPoints.map((p, i) => {
        const cx = xScale(p.x);
        const cy = yFeed(p.value);
        if (isNaN(cx) || isNaN(cy)) return null;
        return (
          <rect
            key={i}
            x={cx - 4}
            y={cy - 4}
            width={8}
            height={8}
            fill="#F5A623"
            stroke="white"
            strokeWidth="1.5"
            opacity="0.9"
            transform={`rotate(45, ${cx}, ${cy})`}
          />
        );
      })}

      {bwActPoints.map((p, i) => {
        const cx = xScale(p.x);
        const cy = yBW(p.value);
        if (isNaN(cx) || isNaN(cy)) return null;
        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={5}
            fill="var(--fw-orange, #E8652A)"
            stroke="white"
            strokeWidth="2"
          />
        );
      })}

      {bwStdPoints
        .filter((_, i) => i % 2 === 0)
        .map((p, i) => {
          const cx = xScale(p.x);
          const cy = yBW(p.value);
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={3}
              fill="white"
              stroke="var(--fw-teal, #1B7A6E)"
              strokeWidth="1.5"
            />
          );
        })}

      <g transform={'translate(' + pad.l + ', ' + (H - 12) + ')'}>
        <line x1="0" y1="0" x2="16" y2="0" stroke="var(--fw-teal, #1B7A6E)" strokeWidth="2" />
        <text x="20" y="4" fontSize="10" fill="#374151">{t('farmguide.bwStandard')||'BW Standard'}</text>

        <line x1="90" y1="0" x2="106" y2="0" stroke="var(--fw-orange, #E8652A)" strokeWidth="2.5" />
        <text x="110" y="4" fontSize="10" fill="#374151">{t('farmguide.bwActual')||'BW Actual'}</text>

        <line x1="185" y1="0" x2="201" y2="0" stroke="#5B8DB8" strokeWidth="1.5" strokeDasharray="4,2" />
        <text x="205" y="4" fontSize="10" fill="#374151">{t('farmguide.feedStandard')||'Feed Standard'}</text>

        <line x1="295" y1="0" x2="311" y2="0" stroke="#F5A623" strokeWidth="1.5" strokeDasharray="4,2" opacity="0.9" />
        <text x="315" y="4" fontSize="10" fill="#374151">{t('farmguide.feedActual')||'Feed Actual'}</text>
      </g>

      {bwActPoints.length === 0 && (
        <text
          x={W / 2}
          y={H / 2}
          textAnchor="middle"
          fontSize="12"
          fill="#9ca3af"
        >
          {t('farmguide.noActualData') || 'No actual data yet. Enter flock data to see comparison.'}
        </text>
      )}

      {tooltipData.map((data,i)=>{
        const x=xScale(data.val);
        const hoverWidth=cW/maxVal;
        return(
          <rect
            key={i}
            x={x-hoverWidth/2}
            y={pad.t}
            width={hoverWidth}
            height={cH}
            fill="transparent"
            onMouseEnter={()=>setTooltip({x,data})}
            onMouseLeave={()=>setTooltip(null)}
            style={{cursor:'crosshair'}}
          />
        );
      })}

      {tooltip&&(
        <g>
          <rect
            x={tooltip.x>W-200?tooltip.x-160:tooltip.x+10}
            y={pad.t+10}
            width={150}
            height={110}
            fill="white"
            stroke="#d1d5db"
            strokeWidth="1"
            rx="4"
            filter="url(#tooltip-shadow)"
          />
          <defs>
            <filter id="tooltip-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15"/>
            </filter>
          </defs>
          <text x={tooltip.x>W-200?tooltip.x-150:tooltip.x+20} y={pad.t+28} fontSize="11" fontWeight="600" fill="#374151">
            {tooltip.data.label}
          </text>
          <text x={tooltip.x>W-200?tooltip.x-150:tooltip.x+20} y={pad.t+46} fontSize="10" fill="var(--fw-teal,#1B7A6E)">
            {t('farmguide.bwStandard')||'BW Standard'}: {tooltip.data.bwStd?tooltip.data.bwStd+'g':'—'}
          </text>
          <text x={tooltip.x>W-200?tooltip.x-150:tooltip.x+20} y={pad.t+62} fontSize="10" fill="var(--fw-orange,#E8652A)" fontWeight="600">
            {t('farmguide.bwActual')||'BW Actual'}: {tooltip.data.bwAct?tooltip.data.bwAct+'g':'—'}
          </text>
          <text x={tooltip.x>W-200?tooltip.x-150:tooltip.x+20} y={pad.t+80} fontSize="10" fill="#5B8DB8">
            {t('farmguide.feedStandard')||'Feed Standard'}: {tooltip.data.feedStd?tooltip.data.feedStd+'g':'—'}
          </text>
          <text x={tooltip.x>W-200?tooltip.x-150:tooltip.x+20} y={pad.t+96} fontSize="10" fill="#F5A623" opacity="0.9">
            {t('farmguide.feedActual')||'Feed Actual'}: {tooltip.data.feedAct?tooltip.data.feedAct+'g':'—'}
          </text>
        </g>
      )}
    </svg>
  );
}
