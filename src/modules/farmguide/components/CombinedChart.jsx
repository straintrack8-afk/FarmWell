import React from 'react';
import { BROILER_RANGE } from '../data/broilerRangeData';
import{useTranslation}from'../../../hooks/useTranslation';

export default function CombinedChart({ history = [], initialPop = 10000 }) {
  const{t}=useTranslation();
  const W = 800;
  const H = 300;
  const pad = { t: 20, r: 70, b: 50, l: 60 };
  const cW = W - pad.l - pad.r;
  const cH = H - pad.t - pad.b;

  const maxBW = 3355;
  const maxFeed = 276;

  const xScale = (day) => pad.l + ((day - 1) / 55) * cW;
  const yBW = (bw) => pad.t + cH - (bw / maxBW) * cH;
  const yFeed = (feed) => pad.t + cH - (feed / maxFeed) * cH;

  const buildPath = (points) => {
    if (!points || points.length < 2) return '';
    return points
      .map((p, i) => {
        const x = xScale(p.day);
        const y = p.yFn(p.value);
        if (isNaN(x) || isNaN(y)) return '';
        return (i === 0 ? 'M' : 'L') + ' ' + x.toFixed(1) + ' ' + y.toFixed(1);
      })
      .filter(Boolean)
      .join(' ');
  };

  const bwStdPoints = BROILER_RANGE.filter((_, i) => i % 7 === 0 || i === BROILER_RANGE.length - 1).map(r => ({ day: r.day, value: r.bw_avg, yFn: yBW }));
  const feedStdPoints = BROILER_RANGE.filter((_, i) => i % 7 === 0 || i === BROILER_RANGE.length - 1).map(r => ({ day: r.day, value: r.feed_avg, yFn: yFeed }));

  const bwActPoints = history
    .filter(h => h.bw_actual_g)
    .map(h => ({ day: h.day, value: h.bw_actual_g, yFn: yBW }));

  const feedActPoints = history
    .filter(h => h.feed_actual_g && initialPop > 0)
    .map(h => ({ day: h.day, value: h.feed_actual_g, yFn: yFeed }));

  const bwStdPath = buildPath(bwStdPoints);
  const feedStdPath = buildPath(feedStdPoints);
  const bwActPath = buildPath(bwActPoints);
  const feedActPath = buildPath(feedActPoints);

  const bwYLabels = [0, 500, 1000, 1500, 2000, 2500, 3000];
  const feedYLabels = [0, 50, 100, 150, 200, 250];
  const days = [1, 7, 14, 21, 28, 35, 42, 49, 56];

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
          fill="#2563EB"
        >
          {v}g
        </text>
      ))}

      {days.map((d) => (
        <text
          key={d}
          x={xScale(d)}
          y={H - pad.b + 16}
          textAnchor="middle"
          fontSize="11"
          fill="#6b7280"
        >
          {'D' + d}
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
          stroke="#2563EB"
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
          stroke="var(--fw-orange, #E8652A)"
          strokeWidth="1.5"
          strokeDasharray="5,3"
          opacity="0.7"
        />
      )}

      {feedActPoints.map((p, i) => {
        const cx = xScale(p.day);
        const cy = yFeed(p.value);
        if (isNaN(cx) || isNaN(cy)) return null;
        return (
          <rect
            key={i}
            x={cx - 4}
            y={cy - 4}
            width={8}
            height={8}
            fill="var(--fw-orange, #E8652A)"
            stroke="white"
            strokeWidth="1.5"
            opacity="0.85"
            transform={`rotate(45, ${cx}, ${cy})`}
          />
        );
      })}

      {bwActPoints.map((p, i) => {
        const cx = xScale(p.day);
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
          const cx = xScale(p.day);
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

        <line x1="185" y1="0" x2="201" y2="0" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="4,2" />
        <text x="205" y="4" fontSize="10" fill="#374151">{t('farmguide.feedStandard')||'Feed Standard'}</text>

        <line x1="295" y1="0" x2="311" y2="0" stroke="var(--fw-orange, #E8652A)" strokeWidth="1.5" strokeDasharray="4,2" opacity="0.7" />
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
          Belum ada data aktual. Input data harian untuk melihat perbandingan.
        </text>
      )}
    </svg>
  );
}
