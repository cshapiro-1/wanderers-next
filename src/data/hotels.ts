import type { HotelStop } from '@/types';

export const hotelStops: HotelStop[] = [
  { name: "Hyatt Regency Kyoto",        city: "Kyoto",  nights: 7, checkIn: "May 28", checkOut: "Jun 4",  perNight: 430, note: "FREE — World of Hyatt points cover 7 nights in Higashiyama", onPoints: true },
  { name: "Conrad Osaka",               city: "Osaka",  nights: 5, checkIn: "Jun 4",  checkOut: "Jun 9",  perNight: 380, note: "Cash / Hilton — 58th floor river confluence panorama", onPoints: false },
  { name: "Gora Kadan",                 city: "Hakone", nights: 2, checkIn: "Jun 9",  checkOut: "Jun 11", perNight: 1200, note: "Includes in-room kaiseki, private onsen & Shiatsu spa · Relais & Châteaux", onPoints: false },
  { name: "Hyatt Centric Ginza Tokyo",  city: "Tokyo",  nights: 4, checkIn: "Jun 11", checkOut: "Jun 15", perNight: 420, note: "FREE — World of Hyatt points (transferred from new CSP)", onPoints: true },
];
