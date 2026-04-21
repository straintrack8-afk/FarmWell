// layerRangeData.js
// Layer performance standards — W1–W80
// Source: Brown Layer Management Guide (Cage Housing)
// Rearing phase: W1–W18 (BW tracking)
// Production phase: W19–W80 (EP%, Egg Weight, Feed, BW)
// No breed names in UI — use as generic "Layer" standard

// ─── PERFORMANCE TARGETS ────────────────────────────────────────────────────
export const LAYER_TARGETS = {
  rearing: {
    bw_at_17wk_kg: 1.42,
    livability_pct: '98–99',
  },
  production: {
    age_50pct_prod_days: '140–145',
    peak_ep_pct: '94–96',
    eggs_72wk: 324,
    eggs_80wk: 367,
    eggs_100wk: 461,
    avg_egg_weight_72wk_g: 63.7,
    avg_egg_weight_80wk_g: 64.1,
    fcr_kg_per_kg_egg_mass: '2.0–2.2',
    bw_end_production_kg: 2.06,
    livability_72wk_pct: '95–96',
    livability_100wk_pct: '90–91',
  },
};

// ─── REARING DATA W1–W18 ────────────────────────────────────────────────────
// Fields: week, phase, bw_avg (g), bw_low (g), bw_high (g), feed_g_day, cumulative_feed_g
export const LAYER_REARING = [
  { week: 1,  phase: 'Starter',   bw_avg: 75,   bw_low: 73,   bw_high: 77   , feed_g_day: 10, cumulative_feed_g: 70 },
  { week: 2,  phase: 'Starter',   bw_avg: 130,  bw_low: 126,  bw_high: 134  , feed_g_day: 16, cumulative_feed_g: 182 },
  { week: 3,  phase: 'Starter',   bw_avg: 195,  bw_low: 189,  bw_high: 201  , feed_g_day: 24, cumulative_feed_g: 350 },
  { week: 4,  phase: 'Starter',   bw_avg: 273,  bw_low: 265,  bw_high: 281  , feed_g_day: 31, cumulative_feed_g: 567 },
  { week: 5,  phase: 'Starter',   bw_avg: 366,  bw_low: 355,  bw_high: 377  , feed_g_day: 36, cumulative_feed_g: 819 },
  { week: 6,  phase: 'Starter',   bw_avg: 469,  bw_low: 455,  bw_high: 483  , feed_g_day: 41, cumulative_feed_g: 1106 },
  { week: 7,  phase: 'Starter',   bw_avg: 573,  bw_low: 556,  bw_high: 590  , feed_g_day: 45, cumulative_feed_g: 1421 },
  { week: 8,  phase: 'Starter',   bw_avg: 677,  bw_low: 657,  bw_high: 697  , feed_g_day: 49, cumulative_feed_g: 1764 },
  { week: 9,  phase: 'Developer', bw_avg: 777,  bw_low: 754,  bw_high: 800  , feed_g_day: 53, cumulative_feed_g: 2135 },
  { week: 10, phase: 'Developer', bw_avg: 873,  bw_low: 847,  bw_high: 899  , feed_g_day: 57, cumulative_feed_g: 2534 },
  { week: 11, phase: 'Developer', bw_avg: 963,  bw_low: 934,  bw_high: 992  , feed_g_day: 60, cumulative_feed_g: 2954 },
  { week: 12, phase: 'Developer', bw_avg: 1047, bw_low: 1016, bw_high: 1078 , feed_g_day: 63, cumulative_feed_g: 3395 },
  { week: 13, phase: 'Developer', bw_avg: 1128, bw_low: 1094, bw_high: 1162 , feed_g_day: 66, cumulative_feed_g: 3857 },
  { week: 14, phase: 'Developer', bw_avg: 1205, bw_low: 1169, bw_high: 1241 , feed_g_day: 69, cumulative_feed_g: 4340 },
  { week: 15, phase: 'Developer', bw_avg: 1279, bw_low: 1241, bw_high: 1317 , feed_g_day: 72, cumulative_feed_g: 4844 },
  { week: 16, phase: 'Developer', bw_avg: 1351, bw_low: 1310, bw_high: 1392 , feed_g_day: 76, cumulative_feed_g: 5376 },
  { week: 17, phase: 'Developer', bw_avg: 1421, bw_low: 1378, bw_high: 1464 , feed_g_day: 81, cumulative_feed_g: 5943 },
  { week: 18, phase: 'Pre-Layer', bw_avg: 1493, bw_low: 1448, bw_high: 1538 , feed_g_day: 89, cumulative_feed_g: 6569 },
];

// ─── PRODUCTION DATA W19–W80 ─────────────────────────────────────────────────
// Fields: week, phase, bw_avg (g), bw_low (g), bw_high (g), feed_g_day, cumulative_feed_g,
//         ep_pct (rate of lay % per H.D.), ep_hh_pct (rate per H.H.),
//         egg_weight_g, egg_mass_week_g (egg mass g/H.D. per week)
export const LAYER_PRODUCTION = [
  // W19 = Pre-layer / start of lay
  { week: 19, phase: 'Pre-Layer', bw_avg: 1565, bw_low: 1518, bw_high: 1612, ep_pct: 9.0,  ep_hh_pct: 9.0,  egg_weight_g: 43.6, egg_mass_week_g: 3.9  , feed_g_day: 95, cumulative_feed_g: 7234 },
  { week: 20, phase: 'Layer',     bw_avg: 1635, bw_low: 1586, bw_high: 1684, ep_pct: 36.4, ep_hh_pct: 36.3, egg_weight_g: 46.1, egg_mass_week_g: 16.8 , feed_g_day: 100, cumulative_feed_g: 7934 },
  { week: 21, phase: 'Layer',     bw_avg: 1701, bw_low: 1650, bw_high: 1752, ep_pct: 54.4, ep_hh_pct: 54.3, egg_weight_g: 48.7, egg_mass_week_g: 26.5 , feed_g_day: 104, cumulative_feed_g: 8662 },
  { week: 22, phase: 'Layer',     bw_avg: 1760, bw_low: 1707, bw_high: 1813, ep_pct: 71.9, ep_hh_pct: 71.7, egg_weight_g: 51.1, egg_mass_week_g: 36.7 , feed_g_day: 107, cumulative_feed_g: 9411 },
  { week: 23, phase: 'Layer',     bw_avg: 1808, bw_low: 1754, bw_high: 1862, ep_pct: 82.3, ep_hh_pct: 82.1, egg_weight_g: 53.3, egg_mass_week_g: 43.9 , feed_g_day: 109, cumulative_feed_g: 10174 },
  { week: 24, phase: 'Layer',     bw_avg: 1846, bw_low: 1791, bw_high: 1901, ep_pct: 87.9, ep_hh_pct: 87.6, egg_weight_g: 55.3, egg_mass_week_g: 48.6 , feed_g_day: 111, cumulative_feed_g: 10951 },
  { week: 25, phase: 'Layer',     bw_avg: 1874, bw_low: 1818, bw_high: 1930, ep_pct: 91.1, ep_hh_pct: 90.7, egg_weight_g: 57.0, egg_mass_week_g: 51.9 , feed_g_day: 112, cumulative_feed_g: 11735 },
  { week: 26, phase: 'Layer',     bw_avg: 1893, bw_low: 1836, bw_high: 1950, ep_pct: 92.9, ep_hh_pct: 92.5, egg_weight_g: 58.2, egg_mass_week_g: 54.1 , feed_g_day: 113, cumulative_feed_g: 12526 },
  { week: 27, phase: 'Layer',     bw_avg: 1906, bw_low: 1849, bw_high: 1963, ep_pct: 94.0, ep_hh_pct: 93.5, egg_weight_g: 59.3, egg_mass_week_g: 55.7 , feed_g_day: 114, cumulative_feed_g: 13324 },
  { week: 28, phase: 'Layer',     bw_avg: 1914, bw_low: 1857, bw_high: 1971, ep_pct: 94.6, ep_hh_pct: 94.0, egg_weight_g: 60.2, egg_mass_week_g: 56.9 , feed_g_day: 115, cumulative_feed_g: 14129 },
  { week: 29, phase: 'Layer',     bw_avg: 1918, bw_low: 1860, bw_high: 1976, ep_pct: 94.9, ep_hh_pct: 94.3, egg_weight_g: 61.0, egg_mass_week_g: 57.8 , feed_g_day: 115, cumulative_feed_g: 14934 },
  { week: 30, phase: 'Layer',     bw_avg: 1921, bw_low: 1863, bw_high: 1979, ep_pct: 95.1, ep_hh_pct: 94.5, egg_weight_g: 61.6, egg_mass_week_g: 58.5 , feed_g_day: 115, cumulative_feed_g: 15739 },
  { week: 31, phase: 'Layer',     bw_avg: 1924, bw_low: 1866, bw_high: 1982, ep_pct: 95.3, ep_hh_pct: 94.6, egg_weight_g: 62.1, egg_mass_week_g: 59.2 , feed_g_day: 115, cumulative_feed_g: 16544 },
  { week: 32, phase: 'Layer',     bw_avg: 1926, bw_low: 1868, bw_high: 1984, ep_pct: 95.4, ep_hh_pct: 94.7, egg_weight_g: 62.5, egg_mass_week_g: 59.6 , feed_g_day: 115, cumulative_feed_g: 17349 },
  { week: 33, phase: 'Layer',     bw_avg: 1929, bw_low: 1871, bw_high: 1987, ep_pct: 95.5, ep_hh_pct: 94.7, egg_weight_g: 62.9, egg_mass_week_g: 60.1 , feed_g_day: 115, cumulative_feed_g: 18154 },
  { week: 34, phase: 'Layer',     bw_avg: 1932, bw_low: 1874, bw_high: 1990, ep_pct: 95.5, ep_hh_pct: 94.6, egg_weight_g: 63.3, egg_mass_week_g: 60.4 , feed_g_day: 115, cumulative_feed_g: 18959 },
  { week: 35, phase: 'Layer',     bw_avg: 1934, bw_low: 1876, bw_high: 1992, ep_pct: 95.4, ep_hh_pct: 94.5, egg_weight_g: 63.7, egg_mass_week_g: 60.7 , feed_g_day: 115, cumulative_feed_g: 19764 },
  { week: 36, phase: 'Layer',     bw_avg: 1936, bw_low: 1878, bw_high: 1994, ep_pct: 95.3, ep_hh_pct: 94.3, egg_weight_g: 63.9, egg_mass_week_g: 60.9 , feed_g_day: 115, cumulative_feed_g: 20569 },
  { week: 37, phase: 'Layer',     bw_avg: 1939, bw_low: 1881, bw_high: 1997, ep_pct: 95.1, ep_hh_pct: 94.1, egg_weight_g: 64.1, egg_mass_week_g: 61.0 , feed_g_day: 115, cumulative_feed_g: 21374 },
  { week: 38, phase: 'Layer',     bw_avg: 1941, bw_low: 1883, bw_high: 1999, ep_pct: 94.9, ep_hh_pct: 93.8, egg_weight_g: 64.3, egg_mass_week_g: 61.0 , feed_g_day: 115, cumulative_feed_g: 22179 },
  { week: 39, phase: 'Layer',     bw_avg: 1944, bw_low: 1886, bw_high: 2002, ep_pct: 94.8, ep_hh_pct: 93.6, egg_weight_g: 64.4, egg_mass_week_g: 61.1 , feed_g_day: 115, cumulative_feed_g: 22984 },
  { week: 40, phase: 'Layer',     bw_avg: 1946, bw_low: 1888, bw_high: 2004, ep_pct: 94.6, ep_hh_pct: 93.3, egg_weight_g: 64.6, egg_mass_week_g: 61.1 , feed_g_day: 115, cumulative_feed_g: 23789 },
  { week: 41, phase: 'Layer',     bw_avg: 1949, bw_low: 1891, bw_high: 2007, ep_pct: 94.4, ep_hh_pct: 93.1, egg_weight_g: 64.7, egg_mass_week_g: 61.1 , feed_g_day: 115, cumulative_feed_g: 24594 },
  { week: 42, phase: 'Layer',     bw_avg: 1952, bw_low: 1893, bw_high: 2011, ep_pct: 94.2, ep_hh_pct: 92.8, egg_weight_g: 64.9, egg_mass_week_g: 61.1 , feed_g_day: 115, cumulative_feed_g: 25399 },
  { week: 43, phase: 'Layer',     bw_avg: 1954, bw_low: 1895, bw_high: 2013, ep_pct: 94.0, ep_hh_pct: 92.6, egg_weight_g: 65.0, egg_mass_week_g: 61.1 , feed_g_day: 115, cumulative_feed_g: 26204 },
  { week: 44, phase: 'Layer',     bw_avg: 1956, bw_low: 1897, bw_high: 2015, ep_pct: 93.8, ep_hh_pct: 92.3, egg_weight_g: 65.1, egg_mass_week_g: 61.0 , feed_g_day: 115, cumulative_feed_g: 27009 },
  { week: 45, phase: 'Layer',     bw_avg: 1959, bw_low: 1900, bw_high: 2018, ep_pct: 93.5, ep_hh_pct: 91.9, egg_weight_g: 65.2, egg_mass_week_g: 61.0 , feed_g_day: 115, cumulative_feed_g: 27814 },
  { week: 46, phase: 'Layer',     bw_avg: 1961, bw_low: 1902, bw_high: 2020, ep_pct: 93.2, ep_hh_pct: 91.6, egg_weight_g: 65.3, egg_mass_week_g: 60.9 , feed_g_day: 115, cumulative_feed_g: 28619 },
  { week: 47, phase: 'Layer',     bw_avg: 1964, bw_low: 1905, bw_high: 2023, ep_pct: 92.9, ep_hh_pct: 91.2, egg_weight_g: 65.4, egg_mass_week_g: 60.8 , feed_g_day: 115, cumulative_feed_g: 29424 },
  { week: 48, phase: 'Layer',     bw_avg: 1966, bw_low: 1907, bw_high: 2025, ep_pct: 92.6, ep_hh_pct: 90.8, egg_weight_g: 65.5, egg_mass_week_g: 60.7 , feed_g_day: 115, cumulative_feed_g: 30229 },
  { week: 49, phase: 'Layer',     bw_avg: 1969, bw_low: 1910, bw_high: 2028, ep_pct: 92.3, ep_hh_pct: 90.4, egg_weight_g: 65.6, egg_mass_week_g: 60.6 , feed_g_day: 115, cumulative_feed_g: 31034 },
  { week: 50, phase: 'Layer',     bw_avg: 1972, bw_low: 1913, bw_high: 2031, ep_pct: 92.0, ep_hh_pct: 90.0, egg_weight_g: 65.7, egg_mass_week_g: 60.5 , feed_g_day: 115, cumulative_feed_g: 31839 },
  { week: 51, phase: 'Layer',     bw_avg: 1974, bw_low: 1915, bw_high: 2033, ep_pct: 91.7, ep_hh_pct: 89.6, egg_weight_g: 65.8, egg_mass_week_g: 60.4 , feed_g_day: 115, cumulative_feed_g: 32644 },
  { week: 52, phase: 'Layer',     bw_avg: 1976, bw_low: 1916, bw_high: 2035, ep_pct: 91.3, ep_hh_pct: 89.2, egg_weight_g: 65.9, egg_mass_week_g: 60.2 , feed_g_day: 115, cumulative_feed_g: 33449 },
  { week: 53, phase: 'Layer',     bw_avg: 1979, bw_low: 1919, bw_high: 2038, ep_pct: 91.0, ep_hh_pct: 88.8, egg_weight_g: 66.0, egg_mass_week_g: 60.0 , feed_g_day: 115, cumulative_feed_g: 34254 },
  { week: 54, phase: 'Layer',     bw_avg: 1981, bw_low: 1921, bw_high: 2040, ep_pct: 90.6, ep_hh_pct: 88.3, egg_weight_g: 66.1, egg_mass_week_g: 59.9 , feed_g_day: 115, cumulative_feed_g: 35059 },
  { week: 55, phase: 'Layer',     bw_avg: 1983, bw_low: 1923, bw_high: 2042, ep_pct: 90.3, ep_hh_pct: 87.9, egg_weight_g: 66.1, egg_mass_week_g: 59.7 , feed_g_day: 115, cumulative_feed_g: 35864 },
  { week: 56, phase: 'Layer',     bw_avg: 1985, bw_low: 1925, bw_high: 2044, ep_pct: 89.9, ep_hh_pct: 87.5, egg_weight_g: 66.2, egg_mass_week_g: 59.5 , feed_g_day: 115, cumulative_feed_g: 36669 },
  { week: 57, phase: 'Layer',     bw_avg: 1988, bw_low: 1928, bw_high: 2047, ep_pct: 89.5, ep_hh_pct: 87.0, egg_weight_g: 66.2, egg_mass_week_g: 59.3 , feed_g_day: 115, cumulative_feed_g: 37474 },
  { week: 58, phase: 'Layer',     bw_avg: 1990, bw_low: 1930, bw_high: 2049, ep_pct: 89.2, ep_hh_pct: 86.6, egg_weight_g: 66.3, egg_mass_week_g: 59.1 , feed_g_day: 115, cumulative_feed_g: 38279 },
  { week: 59, phase: 'Layer',     bw_avg: 1992, bw_low: 1932, bw_high: 2051, ep_pct: 88.8, ep_hh_pct: 86.1, egg_weight_g: 66.3, egg_mass_week_g: 58.9 , feed_g_day: 115, cumulative_feed_g: 39084 },
  { week: 60, phase: 'Layer',     bw_avg: 1994, bw_low: 1934, bw_high: 2054, ep_pct: 88.4, ep_hh_pct: 85.6, egg_weight_g: 66.4, egg_mass_week_g: 58.7 , feed_g_day: 115, cumulative_feed_g: 39889 },
  { week: 61, phase: 'Layer',     bw_avg: 1996, bw_low: 1936, bw_high: 2056, ep_pct: 88.1, ep_hh_pct: 85.2, egg_weight_g: 66.4, egg_mass_week_g: 58.5 , feed_g_day: 115, cumulative_feed_g: 40694 },
  { week: 62, phase: 'Layer',     bw_avg: 1998, bw_low: 1938, bw_high: 2058, ep_pct: 87.7, ep_hh_pct: 84.7, egg_weight_g: 66.5, egg_mass_week_g: 58.3 , feed_g_day: 115, cumulative_feed_g: 41499 },
  { week: 63, phase: 'Layer',     bw_avg: 2000, bw_low: 1940, bw_high: 2060, ep_pct: 87.3, ep_hh_pct: 84.2, egg_weight_g: 66.6, egg_mass_week_g: 58.1 , feed_g_day: 115, cumulative_feed_g: 42304 },
  { week: 64, phase: 'Layer',     bw_avg: 2002, bw_low: 1942, bw_high: 2062, ep_pct: 86.9, ep_hh_pct: 83.8, egg_weight_g: 66.6, egg_mass_week_g: 57.9 , feed_g_day: 115, cumulative_feed_g: 43109 },
  { week: 65, phase: 'Layer',     bw_avg: 2004, bw_low: 1944, bw_high: 2064, ep_pct: 86.5, ep_hh_pct: 83.3, egg_weight_g: 66.7, egg_mass_week_g: 57.7 , feed_g_day: 115, cumulative_feed_g: 43914 },
  { week: 66, phase: 'Layer',     bw_avg: 2006, bw_low: 1946, bw_high: 2066, ep_pct: 86.1, ep_hh_pct: 82.8, egg_weight_g: 66.8, egg_mass_week_g: 57.5 , feed_g_day: 115, cumulative_feed_g: 44719 },
  { week: 67, phase: 'Layer',     bw_avg: 2008, bw_low: 1948, bw_high: 2068, ep_pct: 85.7, ep_hh_pct: 82.3, egg_weight_g: 66.8, egg_mass_week_g: 57.3 , feed_g_day: 115, cumulative_feed_g: 45524 },
  { week: 68, phase: 'Layer',     bw_avg: 2010, bw_low: 1950, bw_high: 2070, ep_pct: 85.3, ep_hh_pct: 81.8, egg_weight_g: 66.9, egg_mass_week_g: 57.1 , feed_g_day: 115, cumulative_feed_g: 46329 },
  { week: 69, phase: 'Layer',     bw_avg: 2012, bw_low: 1952, bw_high: 2072, ep_pct: 84.9, ep_hh_pct: 81.3, egg_weight_g: 66.9, egg_mass_week_g: 56.8 , feed_g_day: 115, cumulative_feed_g: 47134 },
  { week: 70, phase: 'Layer',     bw_avg: 2014, bw_low: 1954, bw_high: 2074, ep_pct: 84.4, ep_hh_pct: 80.7, egg_weight_g: 67.0, egg_mass_week_g: 56.6 , feed_g_day: 115, cumulative_feed_g: 47939 },
  { week: 71, phase: 'Layer',     bw_avg: 2016, bw_low: 1956, bw_high: 2076, ep_pct: 83.9, ep_hh_pct: 80.2, egg_weight_g: 67.0, egg_mass_week_g: 56.3 , feed_g_day: 115, cumulative_feed_g: 48744 },
  { week: 72, phase: 'Layer',     bw_avg: 2018, bw_low: 1958, bw_high: 2078, ep_pct: 83.4, ep_hh_pct: 79.6, egg_weight_g: 67.1, egg_mass_week_g: 56.0 , feed_g_day: 115, cumulative_feed_g: 49549 },
  { week: 73, phase: 'Layer',     bw_avg: 2020, bw_low: 1960, bw_high: 2080, ep_pct: 82.9, ep_hh_pct: 79.0, egg_weight_g: 67.1, egg_mass_week_g: 55.7 , feed_g_day: 115, cumulative_feed_g: 50354 },
  { week: 74, phase: 'Layer',     bw_avg: 2022, bw_low: 1962, bw_high: 2082, ep_pct: 82.4, ep_hh_pct: 78.4, egg_weight_g: 67.2, egg_mass_week_g: 55.4 , feed_g_day: 115, cumulative_feed_g: 51159 },
  { week: 75, phase: 'Layer',     bw_avg: 2024, bw_low: 1964, bw_high: 2084, ep_pct: 81.9, ep_hh_pct: 77.7, egg_weight_g: 67.2, egg_mass_week_g: 55.1 , feed_g_day: 115, cumulative_feed_g: 51964 },
  { week: 76, phase: 'Layer',     bw_avg: 2026, bw_low: 1966, bw_high: 2086, ep_pct: 81.3, ep_hh_pct: 77.1, egg_weight_g: 67.3, egg_mass_week_g: 54.7 , feed_g_day: 115, cumulative_feed_g: 52769 },
  { week: 77, phase: 'Layer',     bw_avg: 2028, bw_low: 1968, bw_high: 2088, ep_pct: 80.8, ep_hh_pct: 76.5, egg_weight_g: 67.3, egg_mass_week_g: 54.4 , feed_g_day: 115, cumulative_feed_g: 53574 },
  { week: 78, phase: 'Layer',     bw_avg: 2030, bw_low: 1970, bw_high: 2090, ep_pct: 80.3, ep_hh_pct: 75.9, egg_weight_g: 67.4, egg_mass_week_g: 54.1 , feed_g_day: 115, cumulative_feed_g: 54379 },
  { week: 79, phase: 'Layer',     bw_avg: 2032, bw_low: 1972, bw_high: 2092, ep_pct: 79.7, ep_hh_pct: 75.2, egg_weight_g: 67.4, egg_mass_week_g: 53.7 , feed_g_day: 115, cumulative_feed_g: 55184 },
  { week: 80, phase: 'Layer',     bw_avg: 2034, bw_low: 1974, bw_high: 2094, ep_pct: 79.2, ep_hh_pct: 74.6, egg_weight_g: 67.5, egg_mass_week_g: 53.4 , feed_g_day: 115, cumulative_feed_g: 55989 },
];

// ─── COMBINED W1–W80 ─────────────────────────────────────────────────────────
// Merge rearing + production into single array for easy lookup
export const LAYER_RANGE = [
  ...LAYER_REARING.map(r => ({ ...r, ep_pct: null, egg_weight_g: null, egg_mass_week_g: null })),
  ...LAYER_PRODUCTION,
];

// Helper: get standard row by week
export const getLayerStd = (week) => LAYER_RANGE.find(r => r.week === week) || null;

// Helper: get phase by week
export const getLayerPhase = (week) => {
  if (week <= 8)  return 'Starter';
  if (week <= 18) return 'Developer';
  if (week === 19) return 'Pre-Layer';
  return 'Layer';
};
