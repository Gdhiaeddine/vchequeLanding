import { describe, it, expect } from 'vitest';
import { parseAndFormatPrice, calculateDiscountBadge } from '../lib/pricing';

describe('Pricing & Discount Calculation Utilities', () => {
  it('formats raw prices correctly in French locale with 2 decimal places', () => {
    expect(parseAndFormatPrice('8500', '8 500,00')).toBe('8 500,00');
    expect(parseAndFormatPrice('12000', '12 000,00')).toBe('12 000,00');
    expect(parseAndFormatPrice('', '8 500,00')).toBe('8 500,00');
    expect(parseAndFormatPrice(undefined, '8 500,00')).toBe('8 500,00');
  });

  it('calculates discount percentage badge automatically', () => {
    // 8500 vs 12000 -> (12000 - 8500) / 12000 = 29.166...% -> -29%
    expect(calculateDiscountBadge('8500', '12000')).toBe('-29%');
    expect(calculateDiscountBadge(8500, 12000)).toBe('-29%');

    // 7000 vs 10000 -> (10000 - 7000) / 10000 = 30% -> -30%
    expect(calculateDiscountBadge('7000', '10000')).toBe('-30%');

    // Edge cases: equal, higher, or missing prices
    expect(calculateDiscountBadge('12000', '12000')).toBeNull();
    expect(calculateDiscountBadge('15000', '12000')).toBeNull();
    expect(calculateDiscountBadge(undefined, '12000')).toBeNull();
    expect(calculateDiscountBadge('8500', undefined)).toBeNull();
  });
});
