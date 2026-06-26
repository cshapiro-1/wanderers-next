import type { HotelStop } from '@/types';

export const hotelStops: HotelStop[] = [
  { name: "Hyatt Centric Ginza Tokyo",  city: "Tokyo",  nights: 5, checkIn: "May 28", checkOut: "Jun 2",  perNight: 420, note: "FREE — World of Hyatt points + 2 free night certs", onPoints: true },
  { name: "Gora Kadan",                 city: "Hakone", nights: 2, checkIn: "Jun 2",  checkOut: "Jun 4",  perNight: 1200, note: "Includes kaiseki dinner & breakfast for two · Relais & Châteaux", onPoints: false },
  { name: "Conrad Osaka",               city: "Osaka",  nights: 5, checkIn: "Jun 4",  checkOut: "Jun 9",  perNight: 380, note: "Cash — Hilton Honors earns back ~3%", onPoints: false },
  { name: "Hyatt Regency Kyoto",        city: "Kyoto",  nights: 6, checkIn: "Jun 9",  checkOut: "Jun 15", perNight: 430, note: "FREE — 90k+ remaining Hyatt points cover all 6 nights", onPoints: true },
];
