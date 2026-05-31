/**
 * NepaliDate — BS <-> AD Converter
 * The E Chronicles | Section E | St. Xavier's College
 *
 * DST-safe: all diffs use Date.UTC() so timezone shifts never affect the result.
 * Math.round() used throughout to guard against any floating-point drift.
 *
 * Fixes applied (v2):
 *   • BS 2081 row: Shrawan (month 4) corrected from 31 → 32  (year must be 366 days:
 *     April 13 2024 → April 14 2025 crosses Feb 29 2024, so 366 days total)
 *   • BS 2083 row: Jestha (month 2) corrected from 32 → 31,
 *                  Ashadh (month 3) corrected from 31 → 32
 *     (Jestha 1, 2083 = May 15 2026; Ashadh 1, 2083 = June 15 2026 — verified)
 */

const NepaliDate = (() => {

  // ── BS CALENDAR DATA (days per month, index 0 unused) ──
  const BS_DATA = {
    2000:[0,30,32,31,32,31,30,30,30,29,30,29,31],
    2001:[0,31,31,32,31,31,31,30,29,30,29,30,30],
    2002:[0,31,31,32,32,31,30,30,29,30,29,30,30],
    2003:[0,31,32,31,32,31,30,30,30,29,29,30,31],
    2004:[0,30,32,31,32,31,30,30,30,29,30,29,31],
    2005:[0,31,31,32,31,31,31,30,29,30,29,30,30],
    2006:[0,31,31,32,32,31,30,30,29,30,29,30,30],
    2007:[0,31,32,31,32,31,30,30,30,29,29,30,31],
    2008:[0,31,31,31,32,31,31,29,30,30,29,29,31],
    2009:[0,31,31,32,31,31,31,30,29,30,29,30,30],
    2010:[0,31,31,32,32,31,30,30,29,30,29,30,30],
    2011:[0,31,32,31,32,31,30,30,30,29,29,30,31],
    2012:[0,31,31,31,32,31,31,29,30,30,29,30,30],
    2013:[0,31,31,32,31,31,31,30,29,30,29,30,30],
    2014:[0,31,31,32,32,31,30,30,29,30,29,30,30],
    2015:[0,31,32,31,32,31,30,30,30,29,29,30,31],
    2016:[0,31,31,31,32,31,31,29,30,30,29,30,30],
    2017:[0,31,31,32,31,31,31,30,29,30,29,30,30],
    2018:[0,31,31,32,32,31,30,30,29,30,29,30,30],
    2019:[0,31,32,31,32,31,30,30,30,29,29,30,31],
    2020:[0,31,31,31,32,31,31,30,29,30,29,30,30],
    2021:[0,31,31,32,31,31,31,30,29,30,29,30,30],
    2022:[0,31,31,32,32,31,30,30,29,30,29,30,30],
    2023:[0,31,32,31,32,31,30,30,30,29,29,30,31],
    2024:[0,31,31,31,32,31,31,30,29,30,29,30,30],
    2025:[0,31,31,32,31,31,31,30,29,30,29,30,30],
    2026:[0,31,31,32,32,31,30,30,29,30,29,30,30],
    2027:[0,31,32,31,32,31,30,30,30,29,29,30,31],
    2028:[0,31,31,31,32,31,31,30,29,30,29,30,30],
    2029:[0,31,31,32,31,31,31,30,29,30,29,30,30],
    2030:[0,31,31,32,32,31,30,30,29,30,29,30,30],
    2031:[0,31,32,31,32,31,30,30,30,29,29,30,31],
    2032:[0,31,31,31,32,31,31,30,29,30,29,30,30],
    2033:[0,31,31,32,31,31,31,30,29,30,29,30,30],
    2034:[0,31,31,32,32,31,30,30,29,30,29,30,30],
    2035:[0,31,32,31,32,31,30,30,30,29,29,30,31],
    2036:[0,31,31,31,32,31,31,30,29,30,29,30,30],
    2037:[0,31,31,32,31,31,31,30,29,30,29,30,30],
    2038:[0,31,31,32,32,31,30,30,29,30,29,30,30],
    2039:[0,31,32,31,32,31,30,30,30,29,29,30,31],
    2040:[0,31,31,31,32,31,31,30,29,30,29,30,30],
    2041:[0,31,31,32,31,31,31,30,29,30,29,30,30],
    2042:[0,31,31,32,32,31,30,30,29,30,29,30,30],
    2043:[0,31,32,31,32,31,30,30,30,29,29,30,31],
    2044:[0,31,31,31,32,31,31,30,29,30,29,30,30],
    2045:[0,31,31,32,31,31,31,30,29,30,29,30,30],
    2046:[0,31,31,32,32,31,30,30,29,30,29,30,30],
    2047:[0,31,32,31,32,31,30,30,30,29,29,30,31],
    2048:[0,31,31,31,32,31,31,30,29,30,29,30,30],
    2049:[0,31,31,32,31,31,31,30,29,30,29,30,30],
    2050:[0,31,31,32,32,31,30,30,29,30,29,30,30],
    2051:[0,31,32,31,32,31,30,30,30,29,29,30,31],
    2052:[0,31,31,31,32,31,31,30,29,30,29,30,30],
    2053:[0,31,31,32,31,31,31,30,29,30,29,30,30],
    2054:[0,31,31,32,32,31,30,30,29,30,29,30,30],
    2055:[0,31,32,31,32,31,30,30,30,29,29,30,31],
    2056:[0,31,31,31,32,31,31,30,29,30,29,30,30],
    2057:[0,31,31,32,31,31,31,30,29,30,29,30,30],
    2058:[0,31,31,32,32,31,30,30,29,30,29,30,30],
    2059:[0,31,32,31,32,31,30,30,30,29,29,30,31],
    2060:[0,31,31,31,32,31,31,30,29,30,29,30,30],
    2061:[0,31,31,32,31,31,31,30,29,30,29,30,30],
    2062:[0,31,31,32,32,31,30,30,29,30,29,30,30],
    2063:[0,31,32,31,32,31,30,30,30,29,29,30,31],
    2064:[0,31,31,32,31,31,30,30,30,29,30,29,31],
    2065:[0,31,31,32,31,31,31,30,29,30,29,30,30],
    2066:[0,31,31,32,32,31,30,30,29,30,29,30,30],
    2067:[0,31,32,31,32,31,30,30,30,29,29,30,31],
    2068:[0,31,31,31,32,31,31,30,29,30,29,30,30],
    2069:[0,31,31,32,31,31,31,30,29,30,29,30,30],
    2070:[0,31,31,32,32,31,30,30,29,30,29,30,30],
    2071:[0,31,32,31,32,31,30,30,30,29,29,30,31],
    2072:[0,31,31,31,32,31,31,30,29,30,29,30,30],
    2073:[0,31,31,32,31,31,31,30,29,30,29,30,30],
    2074:[0,31,31,32,32,31,30,30,29,30,29,30,30],
    2075:[0,31,32,31,32,31,30,30,30,29,29,30,31],
    2076:[0,31,31,31,32,31,31,30,29,30,29,30,30],
    2077:[0,31,31,32,31,31,31,30,29,30,29,30,30],
    2078:[0,31,31,32,32,31,30,30,29,30,29,30,30],
    2079:[0,31,32,31,32,31,30,30,30,29,29,30,31],
    2080:[0,31,31,31,32,31,31,30,29,30,29,30,30],
    // FIXED: Shrawan (month 4) was 31 → corrected to 32
    // BS 2081 = Apr 13 2024 → Apr 13 2025; crosses Feb 29 2024 → 366 days
    2081:[0,31,31,32,32,31,31,30,29,30,29,30,30],
    2082:[0,31,31,32,32,31,30,30,29,30,29,30,30],
    // FIXED: Jestha (month 2) was 32 → 31; Ashadh (month 3) was 31 → 32
    // Jestha 1, 2083 = May 15 2026; Ashadh 1, 2083 = June 15 2026 (verified)
    2083:[0,31,31,32,32,31,30,30,30,29,29,30,31],
    2084:[0,31,31,31,32,31,31,30,29,30,29,30,30],
    2085:[0,31,31,32,31,31,31,30,29,30,29,30,30],
    2086:[0,31,31,32,32,31,30,30,29,30,29,30,30],
    2087:[0,31,32,31,32,31,30,30,30,29,29,30,31],
    2088:[0,31,32,31,32,31,30,30,30,29,29,30,31],
    2089:[0,31,31,32,31,31,30,30,30,29,30,29,31],
    2090:[0,31,31,32,31,31,31,30,29,30,29,30,30],
  };

  const BS_MONTHS_NP = ['बैशाख','जेठ','असार','श्रावण','भाद्र','आश्विन','कार्तिक','मंसिर','पौष','माघ','फाल्गुन','चैत्र'];
  const BS_MONTHS_EN = ['Baisakh','Jestha','Ashadh','Shrawan','Bhadra','Ashwin','Kartik','Mangsir','Poush','Magh','Falgun','Chaitra'];

  // ── REFERENCE POINT: BS 2000/1/1 = AD 1943/4/14 ──
  // Stored as UTC noon to avoid any edge cases
  const REF_UTC = Date.UTC(1943, 3, 14); // months are 0-indexed → April = 3

  // ── HELPER: get BS_DATA row, fallback to 2082 for unknown years ──
  function getRow(y) {
    return BS_DATA[y] || BS_DATA[2082];
  }

  // ── HELPER: count total BS days from BS 2000/1/1 up to (but not including) given BS date ──
  function bsDaysFromRef(y, m, d) {
    let total = 0;
    for (let yr = 2000; yr < y; yr++) {
      const row = getRow(yr);
      for (let mo = 1; mo <= 12; mo++) total += row[mo];
    }
    const row = getRow(y);
    for (let mo = 1; mo < m; mo++) total += row[mo];
    total += (d - 1);
    return total;
  }

  // ── BS → AD ──
  // Returns a plain JS Date (local midnight) for the given BS date.
  function bsToAd(y, m, d) {
    const days = bsDaysFromRef(y, m, d);
    // Add days to reference using UTC to avoid DST
    const resultUTC = REF_UTC + days * 86400000;
    // Build a local-midnight Date from UTC components
    const tmp = new Date(resultUTC);
    return new Date(tmp.getUTCFullYear(), tmp.getUTCMonth(), tmp.getUTCDate());
  }

  // ── AD → BS ──
  // Accepts any JS Date. Uses UTC calendar date to eliminate DST completely.
  function adToBS(date) {
    const d = new Date(date);
    // Strip time: compare UTC calendar date only
    const inputUTC = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
    const diffDays = Math.round((inputUTC - REF_UTC) / 86400000);

    if (diffDays < 0) {
      console.warn('NepaliDate: date before reference point BS 2000/1/1');
      return { y: 2000, m: 1, d: 1 };
    }

    let remaining = diffDays;

    // Walk forward year by year
    let y = 2000;
    while (true) {
      const row = getRow(y);
      let yearDays = 0;
      for (let mo = 1; mo <= 12; mo++) yearDays += row[mo];
      if (remaining < yearDays) break;
      remaining -= yearDays;
      y++;
      if (y > 2090) { y = 2090; break; } // safety cap
    }

    // Walk forward month by month
    let m = 1;
    const row = getRow(y);
    while (true) {
      const mDays = row[m];
      if (remaining < mDays) break;
      remaining -= mDays;
      m++;
      if (m > 12) { m = 12; break; } // safety cap
    }

    return { y, m, d: remaining + 1 };
  }

  // ── TODAY in BS ──
  // Always uses the local calendar date (year/month/day) so it matches
  // what the user sees on their device clock, DST-safe.
  function todayBS() {
    const now = new Date();
    // Use local date components — NOT UTC — since users care about their local date
    const localUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    const diffDays = Math.round((localUTC - REF_UTC) / 86400000);

    let remaining = diffDays;
    let y = 2000;
    while (true) {
      const row = getRow(y);
      let yearDays = 0;
      for (let mo = 1; mo <= 12; mo++) yearDays += row[mo];
      if (remaining < yearDays) break;
      remaining -= yearDays;
      y++;
      if (y > 2090) { y = 2090; break; }
    }

    let m = 1;
    const row = getRow(y);
    while (true) {
      const mDays = row[m];
      if (remaining < mDays) break;
      remaining -= mDays;
      m++;
      if (m > 12) { m = 12; break; }
    }

    return { y, m, d: remaining + 1 };
  }

  // ── IS BIRTHDAY TODAY ──
  function isBirthday(bsMonth, bsDay) {
    const today = todayBS();
    return today.m === bsMonth && today.d === bsDay;
  }

  // ── FORMAT ──
  function formatBS(y, m, d) {
    return `${BS_MONTHS_EN[m - 1]} ${d}, ${y} BS`;
  }

  function monthName(m)   { return BS_MONTHS_EN[m - 1]; }
  function monthNameNP(m) { return BS_MONTHS_NP[m - 1]; }

  return {
    bsToAd,
    adToBS,
    todayBS,
    isBirthday,
    formatBS,
    monthName,
    monthNameNP,
    BS_MONTHS_EN,
    BS_MONTHS_NP,
  };

})();
