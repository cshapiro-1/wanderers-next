import type { HotelStop } from '@/types';

export const hotelStops: HotelStop[] = [
  { name: "Hyatt Regency Kyoto",        city: "Kyoto",  nights: 4, checkIn: "May 28", checkOut: "Jun 1",  perNight: 430, note: "FREE — World of Hyatt points cover 4 nights in Higashiyama", onPoints: true },
  { name: "Conrad Osaka",               city: "Osaka",  nights: 3, checkIn: "Jun 1",  checkOut: "Jun 4",  perNight: 380, note: "Cash / Hilton — 58th floor river confluence panorama", onPoints: false },
  { name: "Gora Kadan",                 city: "Hakone", nights: 2, checkIn: "Jun 4",  checkOut: "Jun 6",  perNight: 1200, note: "Includes in-room kaiseki, private onsen & in-room Shiatsu · Relais & Châteaux", onPoints: false },
  { name: "Hyatt Centric Ginza Tokyo",  city: "Tokyo",  nights: 9, checkIn: "Jun 6",  checkOut: "Jun 15", perNight: 420, note: "FREE — World of Hyatt points (transferred from new CSP)", onPoints: true },
];
