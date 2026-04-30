import {
  FUZZY_AUTO_APPLY_THRESHOLD,
  FUZZY_SUGGEST_THRESHOLD,
  FREE_TIER_SCANS_PER_MONTH,
  FREE_TIER_MAX_CATEGORY_DEPTH,
  FREE_TIER_REPORT_HISTORY_MONTHS,
} from '../constants';

describe('Thresholds', () => {
  it('auto-apply threshold is higher than suggest threshold', () => {
    expect(FUZZY_AUTO_APPLY_THRESHOLD).toBeGreaterThan(FUZZY_SUGGEST_THRESHOLD);
  });

  it('thresholds are valid confidence values between 0 and 1', () => {
    expect(FUZZY_AUTO_APPLY_THRESHOLD).toBeGreaterThan(0);
    expect(FUZZY_AUTO_APPLY_THRESHOLD).toBeLessThanOrEqual(1);
    expect(FUZZY_SUGGEST_THRESHOLD).toBeGreaterThan(0);
    expect(FUZZY_SUGGEST_THRESHOLD).toBeLessThanOrEqual(1);
  });
});

describe('Free tier limits', () => {
  it('free scans per month is a positive integer', () => {
    expect(FREE_TIER_SCANS_PER_MONTH).toBeGreaterThan(0);
    expect(Number.isInteger(FREE_TIER_SCANS_PER_MONTH)).toBe(true);
  });

  it('max category depth allows at least 2 levels', () => {
    expect(FREE_TIER_MAX_CATEGORY_DEPTH).toBeGreaterThanOrEqual(2);
  });

  it('report history is at least 1 month', () => {
    expect(FREE_TIER_REPORT_HISTORY_MONTHS).toBeGreaterThanOrEqual(1);
  });
});
