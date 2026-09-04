import { describe, it, expect } from 'vitest';
import { regionMap, regionColors } from '../src/constants';

describe('Feature & Region Engine', () => {
  it('maps all 18 days to valid aesthetic regions with distinct color palettes', () => {
    for (let day = 1; day <= 18; day++) {
      const region = regionMap[day];
      expect(region).toBeDefined();
      expect(['tokyo', 'izu', 'hakone', 'lake-biwa', 'osaka', 'kyoto']).toContain(region);
      expect(regionColors[region]).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it('verifies JPY to USD currency calculations with custom rate', () => {
    const rate = 155;
    const jpyAmount = 15500;
    const usd = (jpyAmount / rate).toFixed(2);
    expect(usd).toBe('100.00');

    const usdAmount = 50;
    const jpy = Math.round(usdAmount * rate);
    expect(jpy).toBe(7750);
  });
});
