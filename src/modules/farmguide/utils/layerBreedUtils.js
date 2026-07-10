/**
 * layerBreedUtils.js
 * Looks up breed-specific weekly standards from commercial layer JSON files.
 * Returns an object compatible with getLayerStd() return format.
 *
 * Place at: src/modules/farmguide/utils/layerBreedUtils.js
 */

/**
 * Given parsed breed JSON and a week number, returns a standard object
 * matching the shape returned by getLayerStd(week).
 *
 * @param {object} breedData  - Parsed JSON from layer_commercial_*.json
 * @param {number} week       - Week number (1–80)
 * @returns {object|null}     - Standard object or null if not found
 */
export function getLayerBreedStd(breedData, week) {
  if (!breedData) return null;

  const rearingWeeks = breedData._meta?.rearing_weeks ?? 18;
  const isRearing = week <= rearingWeeks;

  if (isRearing) {
    const rearing = breedData.rearing?.data ?? [];
    const row = rearing.find(r => r[0] === week);
    if (!row) return null;
    // columns: [week, bw_g_min, bw_g_max, bw_g_avg, feed_g_day_min, feed_g_day_max, feed_g_day_avg]
    return {
      week,
      phase: week <= 8 ? 'Starter' : week <= 15 ? 'Developer' : 'Pre-Layer',
      bw_avg: row[3],
      bw_low: row[1],
      bw_high: row[2],
      feed_g_day: row[6],
      cumulative_feed_g: null,
      ep_pct: null,
      ep_hh_pct: null,
      egg_weight_g: null,
      egg_mass_week_g: null,
    };
  } else {
    const production = breedData.production?.data ?? [];
    const row = production.find(r => r[0] === week);
    if (!row) return null;
    // columns: [week, ep_pct, egg_weight_g, feed_g_day, body_weight_g]
    const bwAvg = row[4];
    return {
      week,
      phase: 'Layer',
      bw_avg: bwAvg,
      bw_low: Math.round(bwAvg * 0.97),
      bw_high: Math.round(bwAvg * 1.03),
      feed_g_day: row[3],
      cumulative_feed_g: null,
      ep_pct: row[1],
      ep_hh_pct: null,
      egg_weight_g: row[2],
      egg_mass_week_g: null,
    };
  }
}
