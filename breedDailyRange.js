/**
 * breedDailyRange.js
 * Interpolates breed-specific WEEKLY performance data into DAILY range data
 * for use in DailyEntry.jsx input form.
 *
 * Place at: src/modules/farmguide/utils/breedDailyRange.js
 */

const DOC_BW_G = 42; // Standard DOC placement weight (g)

/**
 * Given a parsed breed JSON object, extracts weekly_summary
 * and interpolates daily BW + feed targets for D1–D56.
 *
 * Supports JSON schemas from:
 *   - Ross / Arbor Acres / Indian River: { as_hatched: { weekly_summary: [...] } }
 *   - Cobb: same structure, but daily_intake_g may be null for W1
 *
 * Returns an array of:
 *   { day, week, bw_avg, bw_low_alert, bw_high_alert, feed_avg, feed_min, feed_max }
 *
 * Returns null if weekly_summary cannot be found.
 */
export function interpolateBreedDailyRange(breedJsonData) {
  // --- Extract weekly_summary from various JSON schemas ---
  let weekly = [];

  if (Array.isArray(breedJsonData.weekly_summary)) {
    weekly = breedJsonData.weekly_summary;
  } else {
    // Search one level deep for any key containing weekly_summary
    for (const key of Object.keys(breedJsonData)) {
      const val = breedJsonData[key];
      if (val && Array.isArray(val.weekly_summary)) {
        weekly = val.weekly_summary;
        break;
      }
    }
  }

  if (!weekly.length) return null;

  // Sort ascending by day
  const checkpoints = [...weekly].sort((a, b) => a.day - b.day);
  const maxDay = checkpoints[checkpoints.length - 1].day || 56;

  // Synthesize D0 baseline (DOC placement)
  const D0 = { day: 0, bw_g: DOC_BW_G, daily_intake_g: 0 };
  const allPoints = [D0, ...checkpoints];

  const result = [];

  for (let day = 1; day <= maxDay; day++) {
    const week = Math.ceil(day / 7);

    // Find prev checkpoint (≤ day) and next checkpoint (> day)
    let prev = D0;
    let next = checkpoints[checkpoints.length - 1];

    for (const pt of allPoints) {
      if (pt.day <= day) prev = pt;
    }
    for (const pt of allPoints) {
      if (pt.day > day) { next = pt; break; }
    }

    // --- BW interpolation ---
    let bw_avg;
    if (prev.day === day) {
      bw_avg = prev.bw_g;
    } else if (prev.day === next.day) {
      bw_avg = prev.bw_g;
    } else {
      const t = (day - prev.day) / (next.day - prev.day);
      bw_avg = Math.round(prev.bw_g + t * (next.bw_g - prev.bw_g));
    }

    // BW alert thresholds: ±5% tolerance
    const bw_low_alert  = Math.round(bw_avg * 0.95);
    const bw_high_alert = Math.round(bw_avg * 1.05);

    // --- Feed interpolation ---
    // Some breeds (Cobb W1) have null daily_intake_g — derive from cum_intake_g
    const resolveFeed = (pt) => {
      if (pt.daily_intake_g != null) return pt.daily_intake_g;
      if (pt.cum_intake_g != null && pt.day > 0) return Math.round(pt.cum_intake_g / pt.day);
      return 0;
    };

    const prevFeed = resolveFeed(prev);
    const nextFeed = resolveFeed(next);

    let feed_avg;
    if (prev.day === day) {
      feed_avg = prevFeed;
    } else if (prev.day === next.day) {
      feed_avg = prevFeed;
    } else {
      const t = (day - prev.day) / (next.day - prev.day);
      feed_avg = Math.round(prevFeed + t * (nextFeed - prevFeed));
    }

    // Feed tolerance: ±5%
    const feed_min = Math.round(feed_avg * 0.95);
    const feed_max = Math.round(feed_avg * 1.05);

    result.push({
      day,
      week,
      bw_avg,
      bw_low_alert,
      bw_high_alert,
      feed_avg,
      feed_min,
      feed_max,
    });
  }

  return result;
}
