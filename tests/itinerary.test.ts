import { describe, it, expect } from 'vitest';
import { activities } from '../src/data/activities';
import { hotelStops } from '../src/data/hotels';
import { restaurantPrices, activityPrices } from '../src/data/dining';

describe('Itinerary Data Integrity', () => {
  it('contains valid activities for all 18 itinerary days', () => {
    for (let day = 1; day <= 18; day++) {
      const dayActs = activities[day];
      expect(dayActs).toBeDefined();
      expect(Array.isArray(dayActs)).toBe(true);
      expect(dayActs.length).toBeGreaterThan(0);

      dayActs.forEach((act) => {
        expect(act.title).toBeTruthy();
        expect(typeof act.lat).toBe('number');
        expect(typeof act.lng).toBe('number');
        expect(act.lat).toBeGreaterThan(30);
        expect(act.lat).toBeLessThan(40);
        expect(act.lng).toBeGreaterThan(130);
        expect(act.lng).toBeLessThan(145);
      });
    }
  });

  it('has valid hotel stops covering Tokyo, Hakone, Osaka, and Kyoto', () => {
    expect(hotelStops.length).toBe(4);
    const cities = hotelStops.map((h) => h.city);
    expect(cities).toContain('Tokyo');
    expect(cities).toContain('Hakone');
    expect(cities).toContain('Osaka');
    expect(cities).toContain('Kyoto');

    const totalNights = hotelStops.reduce((sum, h) => sum + h.nights, 0);
    expect(totalNights).toBeGreaterThanOrEqual(17);
  });

  it('contains accurate price mappings for dining and activities', () => {
    expect(restaurantPrices['Sushi Counter, Ginza']).toBe(250);
    expect(restaurantPrices['Bar High Five, Ginza']).toBe(55);
    expect(restaurantPrices['Kobe Beef Teppanyaki, Misono']).toBe(150);
    expect(restaurantPrices['Farewell Kaiseki, Kikunoi Honten']).toBe(185);

    expect(activityPrices['Suntory Yamazaki Distillery']).toBe(40);
    expect(activityPrices['Gora Kadan Kaiseki'] || activityPrices['Shinjuku Gyoen National Garden']).toBeDefined();
  });
});
