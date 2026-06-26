"use client";
import React, { useState, useEffect, useRef } from 'react';
import { APIProvider, Map, useMap, MapControl, ControlPosition } from '@vis.gl/react-google-maps';
import { Plus, Trash, BookOpen, ChevronDown, ChevronUp, Edit3, Check } from 'lucide-react';

// ── Shared types, store, constants, data ──────────────────────────────────────
export type { Activity, ActivityType, Region } from '@/types';
export { useStore } from '@/store/ui';
import type { Activity, ActivityType, DayMeals, HotelAnchor, Reservation, UserEdits, DocEntry, BookItem, BookUrgency, BookCategory, HotelStop, Phrase, PhraseCategory } from '@/types';
import { useStore } from '@/store/ui';
import { regionColors, regionMap, hotelAnchors, REGION_HEROES, typeIcon, typeLabel, regionGroups, regionMap2 } from '@/constants';
import { activities, haikus, meals, dayMeta, _H5, _H7, _H5b, _genHaiku } from '@/data/activities';
import { restaurantPrices, restaurantNotes, activityPrices } from '@/data/dining';
import { hotelStops } from '@/data/hotels';
import { activityUrls } from '@/data/urls';
import { _phrases, _speak } from '@/data/phrases';
import { bookingItems } from '@/data/booking';
import { transits } from '@/data/transits';

// store, types, constants imported from ./store, ./types, ./constants

const AmbientLayer: React.FC = () => {
  const [fireflies, setFireflies] = useState<{id:number;left:string;top:string;size:string;duration:string}[]>([]);
  const [soots, setSoots] = useState<{id:number;left:string;duration:string}[]>([]);
  useEffect(() => {
    const fInterval = setInterval(() => {
      setFireflies(prev => {
        const next = [...prev, { id:Math.random(), left:`${Math.random()*95}vw`, top:`${40+Math.random()*50}vh`, size:`${3+Math.random()*4}px`, duration:`${5+Math.random()*7}s` }];
        if (next.length > 12) next.shift();
        return next;
      });
    }, 2500);
    const sInterval = setInterval(() => {
      if (Math.random() < 0.3) setSoots(prev => {
        const next = [...prev, { id:Math.random(), left:`${Math.random()*90}vw`, duration:`${8+Math.random()*6}s` }];
        if (next.length > 5) next.shift();
        return next;
      });
    }, 3500);
    return () => { clearInterval(fInterval); clearInterval(sInterval); };
  }, []);
  const fixed: React.CSSProperties = { position:'fixed', inset:0, pointerEvents:'none', overflow:'hidden', zIndex:0 };
  return (
    <div style={fixed}>
      <div style={{ position:'absolute', top:'2.5rem', width:'11rem', height:'4rem', opacity:0.3, background:'#ede6d8', borderRadius:'9999px', filter:'blur(24px)', animation:'cloudDrift 80s linear infinite' }} />
      <div style={{ position:'absolute', top:'11rem', width:'15rem', height:'5rem', opacity:0.2, background:'#ede6d8', borderRadius:'9999px', filter:'blur(24px)', animation:'cloudDrift 110s linear infinite', animationDelay:'-30s' }} />
      {fireflies.map(f => <div key={f.id} style={{ position:'absolute', borderRadius:'50%', background:'#e8a830', opacity:0, boxShadow:'0 0 8px #e8a830', left:f.left, top:f.top, width:f.size, height:f.size, animation:`fireflyFloat ${f.duration} ease-in-out infinite` }} />)}
      {soots.map(s => (
        <div key={s.id} style={{ position:'absolute', width:'12px', height:'12px', background:'#1e1208', borderRadius:'50%', opacity:0, display:'flex', alignItems:'center', justifyContent:'center', left:s.left, top:'-20px', animation:`sootFall ${s.duration} linear forwards` }}>
          <div style={{ position:'absolute', width:'3px', height:'3px', background:'white', borderRadius:'50%', left:'2px', top:'3px' }} />
          <div style={{ position:'absolute', width:'3px', height:'3px', background:'white', borderRadius:'50%', right:'2px', top:'3px' }} />
        </div>
      ))}
    </div>
  );
};

const Header: React.FC = () => {
  const { togglePhrasebook, toggleDocsPage, toggleHotels, toggleFlight, toggleRestaurants, toggleActivities, toggleBooking, toggleAIPlanner } = useStore();
  const [menuOpen, setMenuOpen] = React.useState(false);
  return (
    <header className="app-header">
      <div className="header-left">
        <h1>The Wanderer's Sketchbook</h1>
        <p>An 18-Day Journey Through Landscapes, Flavors, and Hidden Valleys</p>
      </div>
      <div className="header-actions">
        <div className="header-btns-desktop">
          <button className="docs-trigger-btn" onClick={toggleDocsPage} title="Documents"><span aria-hidden="true">📎</span><span className="btn-label"> Docs</span></button>
          <button className="docs-trigger-btn" onClick={toggleHotels} title="Hotels"><span aria-hidden="true">🏨</span><span className="btn-label"> Hotels</span></button>
          <button className="docs-trigger-btn" onClick={toggleFlight} title="Flights"><span aria-hidden="true">✈</span><span className="btn-label"> Flights</span></button>
          <button className="docs-trigger-btn" onClick={toggleRestaurants} title="Restaurants"><span aria-hidden="true">🍜</span><span className="btn-label"> Dining</span></button>
          <button className="docs-trigger-btn" onClick={toggleActivities} title="Activities"><span aria-hidden="true">🗺</span><span className="btn-label"> Activities</span></button>
          <button className="docs-trigger-btn" onClick={toggleBooking} title="Booking Timeline"><span aria-hidden="true">📅</span><span className="btn-label"> Book</span></button>
          <button className="docs-trigger-btn ai-trigger-btn" onClick={toggleAIPlanner} title="AI Live Planner"><span aria-hidden="true">✦</span><span className="btn-label"> AI</span></button>
          <button className="pb-trigger-btn" onClick={togglePhrasebook} title="Japanese Phrasebook">言葉</button>
        </div>
        <div className="header-btns-mobile">
          <button className="docs-trigger-btn ai-trigger-btn" onClick={toggleAIPlanner}>✦ AI</button>
          <button className="pb-trigger-btn" onClick={togglePhrasebook}>言葉</button>
          <div style={{ position: 'relative' }}>
            <button className="mobile-menu-btn" onClick={() => setMenuOpen(v => !v)}>⋯</button>
            {menuOpen && (
              <div className="mobile-menu-dropdown" onClick={() => setMenuOpen(false)}>
                <button onClick={toggleHotels}>🏨 Hotels</button>
                <button onClick={toggleFlight}>✈ Flights</button>
                <button onClick={toggleRestaurants}>🍜 Dining</button>
                <button onClick={toggleActivities}>🗺 Activities</button>
                <button onClick={toggleBooking}>📅 Booking</button>
                <button onClick={toggleDocsPage}>📎 Docs</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

const DayScrollVignette: React.FC<{ acts: Activity[]; day: number }> = ({ acts, day }) => {
  const region = regionMap2[day] || 'tokyo';
  const sH = 220;
  const n = acts.length || 1;
  const H = n * sH;
  const s = day;

  // ── Region palette: [ink, accent, faint] ──────────────────────────────────
  const palette: Record<string, [string, string, string]> = {
    'tokyo':     ['#3a2a1a', '#c87e18', '#b8906040'],
    'izu':       ['#1a3020', '#4a7848', '#4a784830'],
    'hakone':    ['#1a2030', '#5878a0', '#5878a030'],
    'lake-biwa': ['#102828', '#388888', '#38888830'],
    'osaka':     ['#2a1410', '#b84428', '#b8442828'],
    'kyoto':     ['#1e1428', '#7a4a88', '#7a4a8830'],
  };
  const [ink, accent, _glowRaw] = palette[region] ?? palette['tokyo'];
  const faint = ink + '88';

  // ── Region-specific vine path ──────────────────────────────────────────────
  const buildVine = (): string => {
    if (region === 'tokyo') {
      // Angular neon tube: sharp right-angle segments
      const pts: [number, number][] = [];
      for (let i = 0; i <= n * 5; i++) {
        const y = (i / (n * 5)) * H;
        const x = i % 2 === 0 ? 58 + (i % 4) * 8 : 72 + (i % 3) * 7;
        pts.push([x, y]);
      }
      return pts.reduce((p, [x, y], i, arr) => {
        if (i === 0) return `M${x} ${y}`;
        const [px, py] = arr[i - 1];
        // Go horizontal then vertical (neon tube bends)
        return `${p} L${x} ${py} L${x} ${y}`;
      }, '');
    }
    if (region === 'izu') {
      // River: lazy wide curves, meanders
      const vx = (t: number) => 62 + Math.sin(t * 1.4 + s * 0.7) * 24 + Math.cos(t * 2.8) * 8;
      const steps = n * 8;
      const pts = Array.from({ length: steps + 1 }, (_, i) => ({
        x: vx(i / steps * n * Math.PI * 2),
        y: (i / steps) * H,
      }));
      return pts.reduce((p, pt, i, arr) => {
        if (i === 0) return `M${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
        const prev = arr[i - 1];
        const cy = (prev.y + pt.y) / 2;
        return `${p} C${prev.x.toFixed(1)} ${cy.toFixed(1)},${pt.x.toFixed(1)} ${cy.toFixed(1)},${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
      }, '');
    }
    if (region === 'hakone') {
      // Mountain ridge: jagged rise/fall
      const pts: [number, number][] = [];
      for (let i = 0; i <= n * 6; i++) {
        const y = (i / (n * 6)) * H;
        const peak = i % 3 === 1 ? -18 : (i % 3 === 2 ? 12 : 0);
        const x = 68 + peak + Math.sin(i * 0.9 + s) * 6;
        pts.push([x, y]);
      }
      return pts.reduce((p, [x, y], i, arr) => {
        if (i === 0) return `M${x} ${y}`;
        const [px, py] = arr[i - 1];
        const mx = (x + px) / 2;
        return `${p} Q${mx} ${py} ${x} ${y}`;
      }, '');
    }
    if (region === 'lake-biwa') {
      // Calm wave: gentle sine
      const vx = (t: number) => 68 + Math.sin(t * 1.1 + s * 0.4) * 14 + Math.sin(t * 3.2) * 4;
      const steps = n * 8;
      const pts = Array.from({ length: steps + 1 }, (_, i) => ({
        x: vx(i / steps * n * Math.PI * 2),
        y: (i / steps) * H,
      }));
      return pts.reduce((p, pt, i, arr) => {
        if (i === 0) return `M${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
        const prev = arr[i - 1];
        const cy = (prev.y + pt.y) / 2;
        return `${p} C${prev.x.toFixed(1)} ${cy.toFixed(1)},${pt.x.toFixed(1)} ${cy.toFixed(1)},${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
      }, '');
    }
    if (region === 'osaka') {
      // Canal: two wavy parallels merged as single path with loops
      const vx = (t: number) => 65 + Math.sin(t * 1.6 + s * 0.8) * 16 + Math.sin(t * 0.5) * 10;
      const steps = n * 6;
      const pts = Array.from({ length: steps + 1 }, (_, i) => ({
        x: vx(i / steps * n * Math.PI * 2),
        y: (i / steps) * H,
      }));
      return pts.reduce((p, pt, i, arr) => {
        if (i === 0) return `M${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
        const prev = arr[i - 1];
        const cy = (prev.y + pt.y) / 2;
        return `${p} C${prev.x.toFixed(1)} ${cy.toFixed(1)},${pt.x.toFixed(1)} ${cy.toFixed(1)},${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
      }, '');
    }
    // kyoto: stepping stone path — vertical with slight sway
    const vx = (t: number) => 66 + Math.sin(t * 1.2 + s * 0.6) * 10;
    const steps = n * 6;
    const pts = Array.from({ length: steps + 1 }, (_, i) => ({
      x: vx(i / steps * n * Math.PI * 2),
      y: (i / steps) * H,
    }));
    return pts.reduce((p, pt, i, arr) => {
      if (i === 0) return `M${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
      const prev = arr[i - 1];
      const cy = (prev.y + pt.y) / 2;
      return `${p} C${prev.x.toFixed(1)} ${cy.toFixed(1)},${pt.x.toFixed(1)} ${cy.toFixed(1)},${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
    }, '');
  };

  const vinePath = buildVine();

  // ── Vine decoration per region ────────────────────────────────────────────
  // ── Per-activity vine decorations (colorful, activity-specific) ──────────
  // ── Title-specific vine decorations ────────────────────────────────────────
  const getTitleDecor = (title: string, c1: string, c2: string, c3: string): React.ReactNode => {
    const tl = title.toLowerCase();
    const i = ink;
    const f = faint;

    // ── Airports ──────────────────────────────────────────────────────────
    if (tl.includes('airport') || tl.includes('narita') || tl.includes('haneda')) return (
      <g fill="none" strokeLinecap="round">
        {/* Airplane body */}
        <path d="M-18 0 Q-10 -3 0 -2 Q10 -1 18 0 Q10 1 0 2 Q-10 3 -18 0Z" stroke={i} strokeWidth="1.2"/>
        {/* Wings */}
        <path d="M-4 -2 L-8 -14 L8 -12 L4 -2" fill={c2} fillOpacity="0.4" stroke={i} strokeWidth="1"/>
        <path d="M8 0 L6 8 L14 7 L12 0" fill={c2} fillOpacity="0.3" stroke={i} strokeWidth="0.8"/>
        {/* Tail */}
        <path d="M-14 0 L-18 -8 L-10 -7 L-12 0" fill={c3} fillOpacity="0.4" stroke={i} strokeWidth="0.8"/>
        {/* Windows */}
        {[-4,0,4,8].map(wx => <circle key={wx} cx={wx} cy={-1} r="1.2" fill={c1} fillOpacity="0.7" stroke="none"/>)}
        {/* Runway lines */}
        <line x1="-10" y1="12" x2="10" y2="12" stroke={f} strokeWidth="1.5" strokeDasharray="3,3"/>
      </g>
    );

    // ── Watches / Seiko ───────────────────────────────────────────────────
    if (tl.includes('seiko') || tl.includes('watch') || tl.includes('clock')) return (
      <g fill="none" strokeLinecap="round">
        {/* Watch case */}
        <circle cx="0" cy="0" r="14" fill={c2} fillOpacity="0.2" stroke={i} strokeWidth="1.4"/>
        <circle cx="0" cy="0" r="11" stroke={i} strokeWidth="0.7"/>
        {/* Hour markers */}
        {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => {
          const rad = a * Math.PI / 180;
          const r1 = a % 90 === 0 ? 7 : 8.5;
          const r2 = 10.5;
          return <line key={a} x1={(Math.cos(rad)*r1).toFixed(1)} y1={(Math.sin(rad)*r1).toFixed(1)}
            x2={(Math.cos(rad)*r2).toFixed(1)} y2={(Math.sin(rad)*r2).toFixed(1)}
            stroke={i} strokeWidth={a % 90 === 0 ? 1.4 : 0.7}/>;
        })}
        {/* Hands */}
        <line x1="0" y1="2" x2="0" y2="-8" stroke={i} strokeWidth="1.5"/>
        <line x1="0" y1="1.5" x2="6" y2="-4" stroke={i} strokeWidth="1"/>
        <line x1="0" y1="1" x2="0" y2="5" stroke={c1} strokeWidth="1.2"/>
        <circle cx="0" cy="0" r="1.5" fill={c1} stroke="none"/>
        {/* Crown */}
        <rect x="13" y="-2" width="4" height="4" rx="1" stroke={i} strokeWidth="0.8"/>
        {/* Strap */}
        <rect x="-5" y="14" width="10" height="8" rx="2" fill={c1} fillOpacity="0.3" stroke={i} strokeWidth="0.9"/>
        <rect x="-5" y="-22" width="10" height="8" rx="2" fill={c1} fillOpacity="0.3" stroke={i} strokeWidth="0.9"/>
      </g>
    );

    // ── Knife Street / Kappabashi ─────────────────────────────────────────
    if (tl.includes('knife') || tl.includes('kappabashi')) return (
      <g fill="none" strokeLinecap="round">
        {/* Chef knife */}
        <path d="M-18 4 L10 -8 Q18 -10 18 -4 Q16 2 10 2 L-18 8Z"
          fill={c2} fillOpacity="0.3" stroke={i} strokeWidth="1.2"/>
        <line x1="10" y1="-3" x2="-14" y2="5" stroke={i} strokeWidth="0.5"/>
        {/* Handle */}
        <rect x="-20" y="2" width="10" height="8" rx="2" fill={c1} fillOpacity="0.6" stroke={i} strokeWidth="1"/>
        {[0,1,2].map(n => <circle key={n} cx={-17+n*3} cy="6" r="1" fill={i} fillOpacity="0.5" stroke="none"/>)}
        {/* Ladle */}
        <path d="M6 12 Q8 18 4 22 Q0 26 -2 22 Q-4 18 0 14 Q2 10 6 12Z"
          fill={c3} fillOpacity="0.4" stroke={i} strokeWidth="0.9"/>
        <line x1="6" y1="12" x2="16" y2="2" stroke={i} strokeWidth="1"/>
        {/* Small bowls */}
        <path d="M12 18 Q18 16 22 20 Q20 24 14 24 Q10 22 12 18Z" fill={c1} fillOpacity="0.3" stroke={i} strokeWidth="0.8"/>
      </g>
    );

    // ── Meiji Jingu / Gardens ─────────────────────────────────────────────
    if (tl.includes('meiji') || tl.includes('jingu') || tl.includes('gyoen')) return (
      <g fill="none" strokeLinecap="round">
        {/* Iris flowers */}
        {[[-10,0],[0,-4],[10,0]].map(([fx,fy]) => (
          <g key={fx} transform={`translate(${fx},${fy})`}>
            <line x1="0" y1="12" x2="0" y2="-2" stroke={i} strokeWidth="1"/>
            {[[-30,1],[0,-1],[30,1]].map(([ra,oy]) => (
              <ellipse key={ra} cx={(Math.cos(ra*Math.PI/180)*6).toFixed(1)}
                cy={(Math.sin(ra*Math.PI/180)*6+oy).toFixed(1)}
                rx="4" ry="2.5" fill={c1} fillOpacity="0.65" stroke={i} strokeWidth="0.7"
                transform={`rotate(${ra})`}/>
            ))}
            <ellipse cx="0" cy="-2" rx="2" ry="5" fill={c2} fillOpacity="0.5" stroke={i} strokeWidth="0.6"/>
          </g>
        ))}
        {/* Wooden torii */}
        <line x1="-18" y1="14" x2="-18" y2="6" stroke={c3} strokeWidth="2"/>
        <line x1="18" y1="14" x2="18" y2="6" stroke={c3} strokeWidth="2"/>
        <line x1="-20" y1="7" x2="20" y2="7" stroke={c3} strokeWidth="2"/>
        <line x1="-16" y1="10" x2="16" y2="10" stroke={c3} strokeWidth="1.2"/>
      </g>
    );

    // ── Nezu Museum ───────────────────────────────────────────────────────
    if (tl.includes('nezu')) return (
      <g fill="none" strokeLinecap="round">
        {/* Hanging scroll */}
        <rect x="-8" y="-16" width="16" height="22" fill={c2} fillOpacity="0.25" stroke={i} strokeWidth="1"/>
        <rect x="-9" y="-18" width="18" height="3" rx="1" fill={c1} fillOpacity="0.5" stroke={i} strokeWidth="0.8"/>
        <rect x="-9" y="6" width="18" height="3" rx="1" fill={c1} fillOpacity="0.5" stroke={i} strokeWidth="0.8"/>
        {/* Brushstroke kanji-like marks */}
        <path d="M-4 -12 Q-2 -8 -4 -4" stroke={i} strokeWidth="1.5"/>
        <path d="M0 -12 Q2 -8 0 -4" stroke={i} strokeWidth="1.5"/>
        <path d="M4 -12 Q2 -8 4 -4" stroke={i} strokeWidth="1.5"/>
        <line x1="-5" y1="-4" x2="5" y2="-4" stroke={i} strokeWidth="1"/>
        {/* Bamboo fence */}
        {[-16,-10,10,16].map(bx => (
          <g key={bx}>
            <line x1={bx} y1="10" x2={bx} y2="22" stroke={c3} strokeWidth="1.4"/>
            <line x1={bx-2} y1="14" x2={bx+2} y2="14" stroke={c3} strokeWidth="0.7"/>
          </g>
        ))}
        <line x1="-18" y1="14" x2="18" y2="14" stroke={c3} strokeWidth="0.8"/>
      </g>
    );

    // ── Sumida Park / Skytree ─────────────────────────────────────────────
    if (tl.includes('sumida') || tl.includes('skytree')) return (
      <g fill="none" strokeLinecap="round">
        {/* Skytree - tall tapered tower */}
        <path d="M-4 22 L-3 8 L-1 -12 L0 -22 L1 -12 L3 8 L4 22" fill={c2} fillOpacity="0.3" stroke={i} strokeWidth="1.2"/>
        {/* Observation decks */}
        <ellipse cx="0" cy="0" rx="5" ry="2" fill={c1} fillOpacity="0.5" stroke={i} strokeWidth="1"/>
        <ellipse cx="0" cy="-10" rx="3.5" ry="1.5" fill={c1} fillOpacity="0.4" stroke={i} strokeWidth="0.8"/>
        {/* Asahi building golden flame */}
        <rect x="12" y="6" width="8" height="16" fill={c3} fillOpacity="0.3" stroke={i} strokeWidth="1"/>
        <path d="M12 6 Q16 -2 22 2 Q20 6 16 6Z" fill={c1} fillOpacity="0.7" stroke={i} strokeWidth="0.8"/>
        {/* River */}
        <path d="M-22 22 Q-10 19 0 22 Q10 25 22 22" stroke={c2} strokeWidth="1" strokeOpacity="0.7"/>
        <path d="M-22 25 Q-10 23 0 25 Q10 27 22 25" stroke={c2} strokeWidth="0.6" strokeOpacity="0.5"/>
      </g>
    );

    // ── Jazz Kissa / Shinjuku bar ─────────────────────────────────────────
    if (tl.includes('jazz') || tl.includes('kissa') || tl.includes('vinyl')) return (
      <g fill="none" strokeLinecap="round">
        {/* Vinyl record */}
        <circle cx="-8" cy="0" r="14" fill={c1} fillOpacity="0.15" stroke={i} strokeWidth="1.2"/>
        {[5,7,9,11,13].map(r => <circle key={r} cx="-8" cy="0" r={r} stroke={i} strokeWidth="0.4" strokeOpacity="0.5"/>)}
        <circle cx="-8" cy="0" r="3" fill={c1} fillOpacity="0.6" stroke={i} strokeWidth="0.8"/>
        <circle cx="-8" cy="0" r="1" fill={i} stroke="none"/>
        {/* Whisky glass */}
        <path d="M8 -4 L10 12 L18 12 L20 -4Z" fill={c2} fillOpacity="0.35" stroke={i} strokeWidth="1"/>
        <line x1="8" y1="-4" x2="20" y2="-4" stroke={i} strokeWidth="0.8"/>
        <line x1="9" y1="3" x2="19" y2="3" stroke={i} strokeWidth="0.5" strokeOpacity="0.6"/>
        {/* Ice cubes */}
        <rect x="10" y="1" width="4" height="4" rx="0.5" fill="white" fillOpacity="0.6" stroke={i} strokeWidth="0.5"/>
        <rect x="15" y="3" width="3" height="3" rx="0.5" fill="white" fillOpacity="0.6" stroke={i} strokeWidth="0.5"/>
        {/* Music note */}
        <path d="M6 -12 L6 -18 L14 -20 L14 -14" stroke={c3} strokeWidth="1.1"/>
        <ellipse cx="5" cy="-11" rx="2.5" ry="2" fill={c3} fillOpacity="0.6" stroke={c3} strokeWidth="0.5" transform="rotate(-20,5,-11)"/>
        <ellipse cx="13" cy="-13" rx="2.5" ry="2" fill={c3} fillOpacity="0.6" stroke={c3} strokeWidth="0.5" transform="rotate(-20,13,-13)"/>
      </g>
    );

    // ── Omoide Yokocho / yakitori ─────────────────────────────────────────
    if (tl.includes('omoide') || tl.includes('yokocho') || tl.includes('yakitori')) return (
      <g fill="none" strokeLinecap="round">
        {/* Narrow alley walls */}
        <line x1="-14" y1="-18" x2="-14" y2="18" stroke={i} strokeWidth="1"/>
        <line x1="14" y1="-18" x2="14" y2="18" stroke={i} strokeWidth="1"/>
        {/* Grill */}
        <rect x="-12" y="6" width="24" height="10" rx="0.5" fill={c3} fillOpacity="0.2" stroke={i} strokeWidth="1"/>
        {[-8,-3,2,7].map(gx => <line key={gx} x1={gx} y1="6" x2={gx} y2="16" stroke={i} strokeWidth="0.6"/>)}
        {/* Yakitori skewers */}
        {[-6,0,6].map(sx2 => (
          <g key={sx2}>
            <line x1={sx2} y1="-16" x2={sx2} y2="10" stroke={i} strokeWidth="0.9"/>
            {[-10,-5,0].map(sy2 => (
              <ellipse key={sy2} cx={sx2} cy={sy2} rx="3" ry="2.5" fill={c1} fillOpacity="0.6" stroke={i} strokeWidth="0.6"/>
            ))}
          </g>
        ))}
        {/* Smoke */}
        <path d="M-6 -16 Q-8 -22 -6 -28" stroke={f} strokeWidth="0.7"/>
        <path d="M6 -16 Q8 -22 6 -28" stroke={f} strokeWidth="0.7"/>
        {/* Lanterns */}
        <ellipse cx="-10" cy="-14" rx="3" ry="5" fill={c2} fillOpacity="0.5" stroke={i} strokeWidth="0.8"/>
        <ellipse cx="10" cy="-14" rx="3" ry="5" fill={c2} fillOpacity="0.5" stroke={i} strokeWidth="0.8"/>
      </g>
    );

    // ── Tokyo Station (brick dome) ────────────────────────────────────────
    if (tl.includes('tokyo station')) return (
      <g fill="none" strokeLinecap="round">
        {/* Classic red-brick facade */}
        <rect x="-18" y="-4" width="36" height="22" fill={c1} fillOpacity="0.2" stroke={i} strokeWidth="1.2"/>
        {/* Central dome */}
        <path d="M-6 -4 Q0 -16 6 -4" fill={c2} fillOpacity="0.35" stroke={i} strokeWidth="1.2"/>
        {/* Side domes */}
        <path d="M-18 -4 Q-14 -12 -10 -4" fill={c2} fillOpacity="0.25" stroke={i} strokeWidth="0.9"/>
        <path d="M10 -4 Q14 -12 18 -4" fill={c2} fillOpacity="0.25" stroke={i} strokeWidth="0.9"/>
        {/* Arched windows */}
        {[-12,-4,4,12].map(wx => (
          <path key={wx} d={`M${wx-3} 14 L${wx-3} 6 Q${wx} 3 ${wx+3} 6 L${wx+3} 14`}
            fill={c3} fillOpacity="0.3" stroke={i} strokeWidth="0.7"/>
        ))}
        {/* Brick texture lines */}
        {[0,4,8,12].map(ry => <line key={ry} x1="-18" y1={ry} x2="18" y2={ry} stroke={f} strokeWidth="0.4"/>)}
        {/* Platform */}
        <line x1="-20" y1="18" x2="20" y2="18" stroke={i} strokeWidth="1"/>
        <line x1="-18" y1="20" x2="18" y2="20" stroke={f} strokeWidth="0.5"/>
      </g>
    );

    // ── Asaba Ryokan ──────────────────────────────────────────────────────
    if (tl.includes('asaba') || (tl.includes('ryokan') && tl.includes('shuzenji'))) return (
      <g fill="none" strokeLinecap="round">
        {/* Main building */}
        <rect x="-16" y="-4" width="32" height="16" fill={c2} fillOpacity="0.2" stroke={i} strokeWidth="1.1"/>
        <path d="M-18 -4 L0 -16 L18 -4" fill={c1} fillOpacity="0.3" stroke={i} strokeWidth="1.2"/>
        <path d="M-20 -8 L0 -20 L20 -8" stroke={f} strokeWidth="0.8"/>
        {/* Shoji screens */}
        {[-10,-2,6].map(wx => (
          <g key={wx}>
            <rect x={wx} y="-2" width="6" height="10" rx="0.3" stroke={i} strokeWidth="0.7"/>
            <line x1={wx+3} y1="-2" x2={wx+3} y2="8" stroke={f} strokeWidth="0.4"/>
            <line x1={wx} y1="3" x2={wx+6} y2="3" stroke={f} strokeWidth="0.4"/>
          </g>
        ))}
        {/* Katsura River under stilts */}
        <line x1="-16" y1="12" x2="-16" y2="20" stroke={i} strokeWidth="0.8"/>
        <line x1="0" y1="12" x2="0" y2="20" stroke={i} strokeWidth="0.8"/>
        <line x1="16" y1="12" x2="16" y2="20" stroke={i} strokeWidth="0.8"/>
        <path d="M-22 20 Q-10 17 0 20 Q10 23 22 20" stroke={c2} strokeWidth="1.1"/>
        <path d="M-22 23 Q-10 21 0 23 Q10 25 22 23" stroke={c2} strokeWidth="0.6"/>
      </g>
    );

    // ── Shuzenji Bamboo Forest / Temple ───────────────────────────────────
    if (tl.includes('shuzenji') || tl.includes('bamboo forest')) return (
      <g fill="none" strokeLinecap="round">
        {/* Bamboo stalks */}
        {[-14,-6,2,10,18].map((ox,oi) => (
          <g key={ox}>
            <rect x={ox} y={-18 + oi%2*4} width="5" height="34" rx="2.5"
              fill={c1} fillOpacity="0.3" stroke={i} strokeWidth="1"/>
            {[-10,-2,6,14].map(oy => <line key={oy} x1={ox} y1={oy} x2={ox+5} y2={oy} stroke={i} strokeWidth="0.5"/>)}
          </g>
        ))}
        {/* Temple gate in background */}
        <line x1="-4" y1="16" x2="-4" y2="-2" stroke={c3} strokeWidth="1.5"/>
        <line x1="4" y1="16" x2="4" y2="-2" stroke={c3} strokeWidth="1.5"/>
        <path d="M-7 -1 Q0 -6 7 -1" stroke={c3} strokeWidth="1.8"/>
        <path d="M-5 2 Q0 -1 5 2" stroke={c3} strokeWidth="1.1"/>
      </g>
    );

    // ── Kaiseki & Noh Stage ───────────────────────────────────────────────
    if (tl.includes('kaiseki') || tl.includes('noh')) return (
      <g fill="none" strokeLinecap="round">
        {/* Noh mask */}
        <path d="M-8 -18 Q-10 -8 -8 2 Q0 8 8 2 Q10 -8 8 -18 Q0 -22 -8 -18Z"
          fill={c2} fillOpacity="0.3" stroke={i} strokeWidth="1.2"/>
        <ellipse cx="-3" cy="-8" rx="2.5" ry="3" fill={i} fillOpacity="0.6" stroke="none"/>
        <ellipse cx="3" cy="-8" rx="2.5" ry="3" fill={i} fillOpacity="0.6" stroke="none"/>
        <path d="M-4 -1 Q0 2 4 -1" stroke={i} strokeWidth="0.9"/>
        <path d="M-6 -14 Q0 -16 6 -14" stroke={f} strokeWidth="0.6"/>
        {/* Floating stage */}
        <rect x="-16" y="10" width="32" height="6" rx="0.5" fill={c1} fillOpacity="0.3" stroke={i} strokeWidth="1"/>
        {[-12,-4,4,12].map(sx2 => <line key={sx2} x1={sx2} y1="16" x2={sx2} y2="24" stroke={i} strokeWidth="0.8"/>)}
        {/* Torches */}
        {[-14, 14].map(tx => (
          <g key={tx}>
            <line x1={tx} y1="8" x2={tx} y2="-2" stroke={i} strokeWidth="0.9"/>
            <path d={`M${tx-3} -4 Q${tx} -10 ${tx+3} -4 Q${tx} -1 ${tx-3} -4`}
              fill={c3} fillOpacity="0.8" stroke={c3} strokeWidth="0.5"/>
          </g>
        ))}
      </g>
    );

    // ── Hakone Tozan Railway ──────────────────────────────────────────────
    if (tl.includes('tozan') || tl.includes('hakone') && tl.includes('railway')) return (
      <g fill="none" strokeLinecap="round">
        {/* Mountain track zig-zagging */}
        <path d="M-18 18 L-6 4 L6 12 L18 -4 L22 -10" stroke={c2} strokeWidth="1.8"/>
        <path d="M-16 18 L-4 4 L8 12 L20 -4 L24 -10" stroke={c2} strokeWidth="1"/>
        {/* Train car on track */}
        <rect x="-4" y="2" width="14" height="8" rx="1.5" fill={c1} fillOpacity="0.4" stroke={i} strokeWidth="1.1"
          transform="rotate(-25,-4,2)"/>
        <rect x="-2" y="3" width="4" height="3" rx="0.5" fill={c3} fillOpacity="0.5" stroke={i} strokeWidth="0.6"
          transform="rotate(-25,-2,3)"/>
        {/* Tunnel entrance */}
        <path d="M14 -2 Q18 -8 22 -2 L22 6 L14 6Z" fill={f} fillOpacity="0.3" stroke={i} strokeWidth="0.9"/>
        {/* Forest */}
        {[-18,-12,16].map(px => (
          <path key={px} d={`M${px+4} 18 L${px} 8 L${px+8} 8Z`}
            fill={c1} fillOpacity="0.4" stroke={i} strokeWidth="0.7"/>
        ))}
      </g>
    );

    // ── Gora Kadan Onsen ──────────────────────────────────────────────────
    if (tl.includes('gora') || tl.includes('onsen') || tl.includes('imperial onsen')) return (
      <g fill="none" strokeLinecap="round">
        {/* Outdoor onsen pool */}
        <ellipse cx="0" cy="8" rx="16" ry="8" fill={c2} fillOpacity="0.3" stroke={i} strokeWidth="1.2"/>
        <ellipse cx="0" cy="8" rx="12" ry="5" stroke={i} strokeWidth="0.5" strokeDasharray="2,2"/>
        {/* Steam */}
        {[-8,-2,4,10].map(sx2 => (
          <path key={sx2} d={`M${sx2} 4 Q${sx2-3} -3 ${sx2} -10`} stroke={f} strokeWidth="0.9"/>
        ))}
        {/* Bamboo fence */}
        {[-18,-12,-6,12,18].map(bx => (
          <line key={bx} x1={bx} y1="16" x2={bx} y2="-2" stroke={c1} strokeWidth="1.4"/>
        ))}
        <line x1="-18" y1="4" x2="20" y2="4" stroke={c1} strokeWidth="0.8"/>
        {/* Fuji */}
        <path d="M6 -18 L14 -32 L22 -18" fill="white" fillOpacity="0.7" stroke={i} strokeWidth="0.8"/>
        <path d="M10 -22 Q14 -24 18 -22" stroke={i} strokeWidth="0.6" strokeDasharray="1.5,1"/>
      </g>
    );

    // ── Open-Air Museum / Sculpture ───────────────────────────────────────
    if (tl.includes('open-air') || tl.includes('open air') || (tl.includes('museum') && tl.includes('hakone'))) return (
      <g fill="none" strokeLinecap="round">
        {/* Abstract sculptures */}
        {/* Tall curved form */}
        <path d="M-12 16 Q-14 6 -10 -2 Q-6 -12 -2 -8 Q2 -4 0 6 Q-2 14 -2 16"
          fill={c1} fillOpacity="0.35" stroke={i} strokeWidth="1.2"/>
        {/* Sphere */}
        <circle cx="8" cy="-2" r="8" fill={c2} fillOpacity="0.25" stroke={i} strokeWidth="1"/>
        <ellipse cx="8" cy="-2" rx="8" ry="3" stroke={f} strokeWidth="0.5"/>
        {/* Pedestal */}
        <rect x="-14" y="16" width="12" height="5" rx="0.5" fill={f} fillOpacity="0.4" stroke={i} strokeWidth="0.8"/>
        <rect x="3" y="6" width="12" height="5" rx="0.5" fill={f} fillOpacity="0.4" stroke={i} strokeWidth="0.8"/>
        {/* Mountain horizon */}
        <path d="M-22 22 L-16 14 L-10 18 L-2 10 L6 16 L12 8 L20 14 L24 22" stroke={f} strokeWidth="0.7"/>
      </g>
    );

    // ── Owakudani Ropeway ─────────────────────────────────────────────────
    if (tl.includes('owakudani') || tl.includes('ropeway')) return (
      <g fill="none" strokeLinecap="round">
        {/* Cable */}
        <path d="M-22 -8 Q0 -16 22 -8" stroke={i} strokeWidth="1.4"/>
        {/* Gondola */}
        <rect x="-8" y="-16" width="16" height="12" rx="2" fill={c1} fillOpacity="0.4" stroke={i} strokeWidth="1.2"/>
        <rect x="-5" y="-14" width="4" height="5" rx="0.5" fill={c2} fillOpacity="0.4" stroke={i} strokeWidth="0.6"/>
        <rect x="1" y="-14" width="4" height="5" rx="0.5" fill={c2} fillOpacity="0.4" stroke={i} strokeWidth="0.6"/>
        <line x1="0" y1="-16" x2="0" y2="-12" stroke={i} strokeWidth="0.8"/>
        {/* Pulley wheel */}
        <circle cx="0" cy="-18" r="3" stroke={i} strokeWidth="0.9"/>
        {/* Volcanic vents below */}
        <path d="M-18 18 Q-12 10 -8 12 Q-4 6 0 8 Q4 2 8 6 Q12 0 18 4" stroke={i} strokeWidth="1"/>
        {[-10,-2,6,14].map(vx2 => (
          <path key={vx2} d={`M${vx2} ${vx2%4===0?12:8} Q${vx2-2} ${vx2%4===0?4:-2} ${vx2} ${vx2%4===0?-4:-8}`}
            stroke={c3} strokeWidth="0.9"/>
        ))}
      </g>
    );

    // ── Biwako Express ────────────────────────────────────────────────────
    if (tl.includes('biwako') || tl.includes('lakeside express')) return (
      <g fill="none" strokeLinecap="round">
        {/* Train */}
        <rect x="-18" y="-10" width="36" height="14" rx="2" fill={c1} fillOpacity="0.3" stroke={i} strokeWidth="1.2"/>
        <path d="-18 -10 L-12 -16 L16 -16 L18 -10" fill={c2} fillOpacity="0.3" stroke={i} strokeWidth="0.9"/>
        {[-10,-2,6,14].map(wx => <rect key={wx} x={wx} y="-8" width="6" height="5" rx="0.5"
          fill={c3} fillOpacity="0.5" stroke={i} strokeWidth="0.6"/>)}
        {/* Lake visible through window */}
        <path d="M-2 -7 Q2 -9 6 -7 Q4 -4 0 -4 Q-2 -5 -2 -7Z" fill={c2} fillOpacity="0.5" stroke="none"/>
        {/* Rails */}
        <line x1="-22" y1="4" x2="22" y2="4" stroke={i} strokeWidth="1.2"/>
        <line x1="-22" y1="6" x2="22" y2="6" stroke={i} strokeWidth="1.2"/>
        {[-18,-10,-2,6,14].map(tx => <line key={tx} x1={tx} y1="4" x2={tx} y2="6" stroke={i} strokeWidth="1"/>)}
        {/* Lake */}
        <path d="M-22 14 Q-8 10 0 14 Q10 18 22 14" stroke={c2} strokeWidth="1.1"/>
        <path d="M-22 18 Q-8 15 0 18 Q10 21 22 18" stroke={c2} strokeWidth="0.6"/>
      </g>
    );

    // ── Lakeside Ryokan ───────────────────────────────────────────────────
    if (tl.includes('lakeside ryokan')) return (
      <g fill="none" strokeLinecap="round">
        {/* Ryokan building */}
        <rect x="-14" y="-6" width="28" height="16" fill={c1} fillOpacity="0.2" stroke={i} strokeWidth="1.1"/>
        <path d="M-16 -6 L0 -18 L16 -6" fill={c2} fillOpacity="0.3" stroke={i} strokeWidth="1.2"/>
        {/* Shoji screens */}
        {[-10,-2,6].map(wx => <rect key={wx} x={wx} y="-4" width="6" height="12" rx="0.3" stroke={i} strokeWidth="0.7"/>)}
        {/* Heron on lake shore */}
        <path d="M18 10 L18 0 L22 -4 M18 0 L15 4" stroke={i} strokeWidth="1"/>
        <path d="M22 -4 L25 -4" stroke={i} strokeWidth="0.8"/>
        {/* Reeds */}
        {[-18,-14].map(rx => (
          <g key={rx}>
            <line x1={rx} y1="10" x2={rx} y2="0" stroke={i} strokeWidth="0.9"/>
            <ellipse cx={rx} cy="0" rx="1.5" ry="4" stroke={i} strokeWidth="0.7"/>
          </g>
        ))}
        {/* Lake */}
        <path d="M-22 10 Q-8 7 0 10 Q10 13 22 10" stroke={c2} strokeWidth="1.1"/>
      </g>
    );

    // ── Suntory Yamazaki Distillery ────────────────────────────────────────
    if (tl.includes('suntory') || tl.includes('yamazaki') || tl.includes('distillery')) return (
      <g fill="none" strokeLinecap="round">
        {/* Copper pot stills */}
        {[-14,4].map(ox => (
          <g key={ox}>
            <path d={`M${ox+2} 16 Q${ox-2} 10 ${ox} 4 Q${ox+4} -4 ${ox+8} 0 Q${ox+12} 4 ${ox+10} 10 Q${ox+8} 16 ${ox+6} 16Z`}
              fill={c1} fillOpacity="0.45" stroke={i} strokeWidth="1.1"/>
            <path d={`M${ox+4} 4 Q${ox+8} -2 ${ox+8} -10`} stroke={i} strokeWidth="0.9"/>
            <path d={`M${ox+8} -10 Q${ox+10} -14 ${ox+16} -12`} stroke={i} strokeWidth="0.8"/>
          </g>
        ))}
        {/* Whisky barrel */}
        <ellipse cx="14" cy="8" rx="8" ry="10" fill={c2} fillOpacity="0.35" stroke={i} strokeWidth="1.1"/>
        {[-4,0,4].map(ry => <line key={ry} x1="6" y1={8+ry} x2="22" y2={8+ry} stroke={f} strokeWidth="0.5"/>)}
        <ellipse cx="14" cy="8" rx="8" ry="3" stroke={i} strokeWidth="0.7"/>
        {/* Whisky glass */}
        <path d="M-20 4 L-18 14 L-10 14 L-8 4Z" fill={c3} fillOpacity="0.4" stroke={i} strokeWidth="0.9"/>
        <line x1="-20" y1="4" x2="-8" y2="4" stroke={i} strokeWidth="0.7"/>
        <line x1="-15" y1="14" x2="-13" y2="18" stroke={i} strokeWidth="0.9"/>
        <line x1="-13" y1="18" x2="-17" y2="18" stroke={i} strokeWidth="0.9"/>
      </g>
    );

    // ── Dotonbori Canal Walk ──────────────────────────────────────────────
    if (tl.includes('dotonbori')) return (
      <g fill="none" strokeLinecap="round">
        {/* Glico Running Man */}
        <circle cx="-12" cy="-18" r="4" fill={c1} fillOpacity="0.4" stroke={i} strokeWidth="1"/>
        <line x1="-12" y1="-14" x2="-12" y2="-4" stroke={i} strokeWidth="1.2"/>
        <path d="-12 -10 L-18 -6 M-12 -10 L-6 -6" stroke={i} strokeWidth="1.1"/>
        <path d="-12 -4 L-16 4 M-12 -4 L-6 2" stroke={i} strokeWidth="1.1"/>
        {/* Bridge */}
        <path d="M-22 8 Q0 4 22 8" stroke={i} strokeWidth="1.4"/>
        {[-16,-8,0,8,16].map(bx => <line key={bx} x1={bx} y1="8" x2={bx} y2="14" stroke={i} strokeWidth="0.8"/>)}
        {/* Canal with neon reflections */}
        <path d="M-22 14 Q-8 11 0 14 Q10 17 22 14" stroke={c2} strokeWidth="1.2"/>
        {[-14,-4,8].map(rx => (
          <line key={rx} x1={rx} y1="15" x2={rx+4} y2="20" stroke={c1} strokeWidth="0.6" strokeOpacity="0.7"/>
        ))}
        {/* Hanging neon signs */}
        {[0,10].map(sx2 => (
          <g key={sx2}>
            <line x1={sx2+4} y1="-14" x2={sx2+4} y2="-6" stroke={f} strokeWidth="0.7"/>
            <rect x={sx2} y="-6" width="8" height="6" rx="0.5" fill={c3} fillOpacity="0.5" stroke={i} strokeWidth="0.7"/>
          </g>
        ))}
      </g>
    );

    // ── Kushikatsu Counter ────────────────────────────────────────────────
    if (tl.includes('kushikatsu') || tl.includes('counter') && tl.includes('osaka')) return (
      <g fill="none" strokeLinecap="round">
        {/* Counter top */}
        <rect x="-20" y="8" width="40" height="5" rx="0.5" fill={c2} fillOpacity="0.3" stroke={i} strokeWidth="1"/>
        {/* Skewers in holder */}
        <rect x="-6" y="-8" width="12" height="16" rx="1" fill={c1} fillOpacity="0.2" stroke={i} strokeWidth="0.8"/>
        {[-3,0,3,6].map(sx2 => (
          <g key={sx2}>
            <line x1={sx2} y1="-18" x2={sx2} y2="8" stroke={i} strokeWidth="0.9"/>
            <ellipse cx={sx2} cy={-14} rx="2.5" ry="2" fill={c3} fillOpacity="0.6" stroke={i} strokeWidth="0.5"/>
            <ellipse cx={sx2} cy={-8} rx="2.5" ry="2" fill={c1} fillOpacity="0.6" stroke={i} strokeWidth="0.5"/>
          </g>
        ))}
        {/* Sauce pot */}
        <path d="M10 4 Q8 -2 10 -8 Q14 -10 18 -8 Q20 -2 18 4Z"
          fill={c2} fillOpacity="0.4" stroke={i} strokeWidth="1"/>
        <path d="M10 -2 Q14 -4 18 -2" stroke={f} strokeWidth="0.5"/>
        <path d="M10 4 L8 4 M18 4 L20 4" stroke={i} strokeWidth="0.8"/>
        {/* Cabbage */}
        <path d="M-18 6 Q-16 2 -12 4 Q-10 2 -8 4 Q-10 8 -14 8 Q-18 8 -18 6Z"
          fill={c1} fillOpacity="0.4" stroke={i} strokeWidth="0.7"/>
      </g>
    );

    // ── Church of the Light ───────────────────────────────────────────────
    if (tl.includes('church') || tl.includes('light') && tl.includes('ibaraki')) return (
      <g fill="none" strokeLinecap="round">
        {/* Concrete wall - Tadao Ando brutalist */}
        <rect x="-18" y="-20" width="36" height="36" fill={f} fillOpacity="0.15" stroke={i} strokeWidth="1.2"/>
        {/* Cross of light - glowing */}
        <rect x="-2" y="-18" width="4" height="32" fill={c1} fillOpacity="0.8" stroke="none"/>
        <rect x="-14" y="-6" width="28" height="4" fill={c1} fillOpacity="0.8" stroke="none"/>
        {/* Cross outline */}
        <rect x="-2" y="-18" width="4" height="32" fill="none" stroke={i} strokeWidth="0.5"/>
        <rect x="-14" y="-6" width="28" height="4" fill="none" stroke={i} strokeWidth="0.5"/>
        {/* Light rays */}
        <path d="-8 -10 L-18 -20" stroke={c1} strokeWidth="0.5" strokeOpacity="0.5"/>
        <path d="8 -10 L18 -20" stroke={c1} strokeWidth="0.5" strokeOpacity="0.5"/>
        <path d="-10 -4 L-18 2" stroke={c1} strokeWidth="0.5" strokeOpacity="0.5"/>
        <path d="10 -4 L18 2" stroke={c1} strokeWidth="0.5" strokeOpacity="0.5"/>
      </g>
    );

    // ── Umeda Sky Building ────────────────────────────────────────────────
    if (tl.includes('umeda') || tl.includes('sky building')) return (
      <g fill="none" strokeLinecap="round">
        {/* Left tower */}
        <rect x="-18" y="-22" width="10" height="36" fill={c1} fillOpacity="0.25" stroke={i} strokeWidth="1.1"/>
        {/* Right tower */}
        <rect x="8" y="-22" width="10" height="36" fill={c1} fillOpacity="0.25" stroke={i} strokeWidth="1.1"/>
        {/* Floating Garden top connector */}
        <rect x="-20" y="-24" width="40" height="8" rx="2" fill={c2} fillOpacity="0.5" stroke={i} strokeWidth="1.2"/>
        {/* Escalator tube in void */}
        <ellipse cx="0" cy="-8" rx="5" ry="8" fill={c3} fillOpacity="0.25" stroke={i} strokeWidth="0.8"/>
        {/* Windows */}
        {[-16,-8,10,18].map(wx => (
          [0,1,2,3,4].map(wy => (
            <rect key={`${wx}-${wy}`} x={wx} y={-18+wy*6} width="4" height="4" rx="0.3"
              fill={c3} fillOpacity={((wx+wy)%3===0)?0.5:0.1} stroke={i} strokeWidth="0.4"/>
          ))
        ))}
      </g>
    );

    // ── Kyoto Station ─────────────────────────────────────────────────────
    if (tl.includes('kyoto station')) return (
      <g fill="none" strokeLinecap="round">
        {/* Modern glass grid facade */}
        {[0,1,2,3,4,5].map(row => [0,1,2,3,4,5,6].map(col => (
          <rect key={`${row}-${col}`} x={-21+col*7} y={-20+row*7} width="6" height="6" rx="0.3"
            fill={c2} fillOpacity={((row+col)%3===0)?0.4:0.1} stroke={i} strokeWidth="0.5"/>
        )))}
        {/* Roof arch */}
        <path d="M-22 -20 Q0 -30 22 -20" stroke={i} strokeWidth="1.3"/>
        {/* Train below */}
        <rect x="-18" y="22" width="36" height="8" rx="1" fill={c1} fillOpacity="0.3" stroke={i} strokeWidth="0.9"/>
        <line x1="-20" y1="30" x2="20" y2="30" stroke={i} strokeWidth="1"/>
      </g>
    );

    // ── ROKU KYOTO ────────────────────────────────────────────────────────
    if (tl.includes('roku')) return (
      <g fill="none" strokeLinecap="round">
        {/* Low modernist building with overhanging eaves */}
        <rect x="-18" y="0" width="36" height="14" fill={c1} fillOpacity="0.2" stroke={i} strokeWidth="1.1"/>
        <path d="M-22 0 L0 -10 L22 0" fill={c2} fillOpacity="0.3" stroke={i} strokeWidth="1.2"/>
        <path d="-24 -2 L0 -14 L24 -2" stroke={f} strokeWidth="0.7"/>
        {/* Shoji panels */}
        {[-12,-4,4,12].map(wx => (
          <g key={wx}>
            <rect x={wx} y="2" width="6" height="10" rx="0.3" stroke={i} strokeWidth="0.6"/>
            <line x1={wx+3} y1="2" x2={wx+3} y2="12" stroke={f} strokeWidth="0.3"/>
            <line x1={wx} y1="7" x2={wx+6} y2="7" stroke={f} strokeWidth="0.3"/>
          </g>
        ))}
        {/* Mountain foothills behind */}
        <path d="M-24 0 L-16 -14 L-8 -6 L0 -18 L8 -8 L16 -14 L24 0" stroke={f} strokeWidth="0.7"/>
        {/* Stepping stone path */}
        {[-8,-2,4,10].map(sx2 => <ellipse key={sx2} cx={sx2} cy="18" rx="4" ry="2" fill={f} fillOpacity="0.4" stroke={i} strokeWidth="0.6"/>)}
      </g>
    );

    // ── Ryoan-ji Zen Garden ───────────────────────────────────────────────
    if (tl.includes('ryoan') || tl.includes('zen garden')) return (
      <g fill="none" strokeLinecap="round">
        {/* Raked sand - horizontal lines */}
        {[-14,-8,-2,4,10,16].map(ly => (
          <path key={ly} d={`M-22 ${ly} Q-10 ${ly-2} 0 ${ly} Q10 ${ly+2} 22 ${ly}`}
            stroke={f} strokeWidth="0.7"/>
        ))}
        {/* 5 stone groups (Ryoan-ji has 15 in 5 groups) */}
        {/* Stones */}
        {[[-14,2],[-4,-6],[4,0],[12,-4],[18,6]].map(([sx2,sy2]) => (
          <g key={sx2}>
            <ellipse cx={sx2} cy={sy2} rx={3+Math.abs(sx2)%2} ry={2.5}
              fill={c2} fillOpacity="0.5" stroke={i} strokeWidth="1"/>
            {/* Sand ripples around each stone */}
            <path d={`M${(sx2 as number)-6} ${(sy2 as number)+3} Q${sx2} ${(sy2 as number)+5} ${(sx2 as number)+6} ${(sy2 as number)+3}`}
              stroke={f} strokeWidth="0.5"/>
          </g>
        ))}
        {/* Garden wall */}
        <rect x="-22" y="-18" width="44" height="4" rx="0" fill={c1} fillOpacity="0.25" stroke={i} strokeWidth="0.8"/>
      </g>
    );

    // ── Kinkaku-ji Golden Pavilion ─────────────────────────────────────────
    if (tl.includes('kinkaku') || tl.includes('golden pavilion')) return (
      <g fill="none" strokeLinecap="round">
        {/* Golden pavilion - 3 tiers */}
        <rect x="-14" y="4" width="28" height="10" fill={c1} fillOpacity="0.7" stroke={i} strokeWidth="1.1"/>
        <rect x="-11" y="-6" width="22" height="11" fill={c1} fillOpacity="0.65" stroke={i} strokeWidth="1"/>
        <rect x="-8" y="-14" width="16" height="9" fill={c1} fillOpacity="0.6" stroke={i} strokeWidth="0.9"/>
        {/* Roofs */}
        <path d="-16 4 L0 -2 L16 4" fill={c2} fillOpacity="0.5" stroke={i} strokeWidth="1"/>
        <path d="-13 -6 L0 -12 L13 -6" fill={c2} fillOpacity="0.45" stroke={i} strokeWidth="0.9"/>
        <path d="-10 -14 L0 -20 L10 -14" fill={c2} fillOpacity="0.4" stroke={i} strokeWidth="0.8"/>
        <line x1="0" y1="-22" x2="0" y2="-20" stroke={i} strokeWidth="0.8"/>
        {/* Reflection in pond */}
        <path d="M-14 14 Q0 17 14 14" stroke={c1} strokeWidth="0.8" strokeOpacity="0.6"/>
        <path d="M-11 17 Q0 20 11 17" stroke={c1} strokeWidth="0.5" strokeOpacity="0.5"/>
        <path d="-8 20 Q0 22 8 20" stroke={c1} strokeWidth="0.4" strokeOpacity="0.4"/>
        {/* Pond ripple */}
        <path d="M-20 14 Q0 11 20 14" stroke={c3} strokeWidth="0.9"/>
      </g>
    );

    // ── Ginkaku-ji Silver Pavilion ─────────────────────────────────────────
    if (tl.includes('ginkaku') || tl.includes('silver pavilion')) return (
      <g fill="none" strokeLinecap="round">
        {/* Silver pavilion - 2 tiers, darker/gray */}
        <rect x="-12" y="2" width="24" height="12" fill={c2} fillOpacity="0.3" stroke={i} strokeWidth="1.1"/>
        <rect x="-9" y="-7" width="18" height="10" fill={c2} fillOpacity="0.25" stroke={i} strokeWidth="1"/>
        <path d="-14 2 L0 -4 L14 2" stroke={i} strokeWidth="1.1"/>
        <path d="-11 -7 L0 -13 L11 -7" stroke={i} strokeWidth="0.9"/>
        <line x1="0" y1="-15" x2="0" y2="-13" stroke={i} strokeWidth="0.7"/>
        {/* Kogetsudai sand cone */}
        <path d="M-22 14 L-18 0 L-14 14" fill={c1} fillOpacity="0.4" stroke={i} strokeWidth="0.9"/>
        <path d="-20 14 Q-18 7 -16 14" stroke={f} strokeWidth="0.5"/>
        <path d="-21 10 Q-18 5 -15 10" stroke={f} strokeWidth="0.4"/>
        {/* Pond */}
        <path d="M-14 14 Q0 18 14 14" stroke={c3} strokeWidth="0.9"/>
        <path d="M-10 17 Q0 20 10 17" stroke={c3} strokeWidth="0.5"/>
      </g>
    );

    // ── Philosopher's Path ─────────────────────────────────────────────────
    if (tl.includes("philosopher")) return (
      <g fill="none" strokeLinecap="round">
        {/* Stone path */}
        {[-14,-8,-2,4,10].map(sx2 => (
          <ellipse key={sx2} cx={sx2} cy={12+(sx2%6)} rx="5" ry="2.5"
            fill={c2} fillOpacity="0.4" stroke={i} strokeWidth="0.8"/>
        ))}
        {/* Canal alongside */}
        <path d="M-20 18 Q-8 15 0 18 Q10 21 20 18" stroke={c3} strokeWidth="1.1"/>
        <path d="M-20 21 Q-8 19 0 21 Q10 23 20 21" stroke={c3} strokeWidth="0.5"/>
        {/* Cherry trees overhanging */}
        <path d="M-14 10 L-14 -4 L-22 -14 M-14 -4 L-6 -12" stroke={i} strokeWidth="1.2"/>
        <path d="M10 8 L10 -6 L18 -16 M10 -6 L2 -14" stroke={i} strokeWidth="1.2"/>
        {/* Cherry blossoms */}
        {[[-20,-14],[-6,-12],[18,-16],[2,-14]].map(([bx,by]) => (
          <g key={bx} transform={`translate(${bx},${by})`}>
            {[0,72,144,216,288].map(a => (
              <ellipse key={a} cx={+(Math.cos(a*Math.PI/180)*4).toFixed(1)}
                cy={+(Math.sin(a*Math.PI/180)*4).toFixed(1)}
                rx="3" ry="1.8" fill={c1} fillOpacity="0.65" stroke={i} strokeWidth="0.5"
                transform={`rotate(${a})`}/>
            ))}
          </g>
        ))}
      </g>
    );

    // ── Takagamine Tea House ───────────────────────────────────────────────
    if (tl.includes('takagamine') || tl.includes('tea house') || tl.includes('tea shrine')) return (
      <g fill="none" strokeLinecap="round">
        {/* Tea house with thatched hip roof */}
        <rect x="-14" y="0" width="28" height="16" fill={c1} fillOpacity="0.2" stroke={i} strokeWidth="1"/>
        <path d="-18 0 L0 -16 L18 0" fill={c2} fillOpacity="0.4" stroke={i} strokeWidth="1.2"/>
        <path d="-20 -2 L0 -18 L20 -2" stroke={f} strokeWidth="0.7"/>
        {/* Roji gate */}
        <line x1="-24" y1="16" x2="-24" y2="0" stroke={i} strokeWidth="1.1"/>
        <line x1="-20" y1="16" x2="-20" y2="0" stroke={i} strokeWidth="1.1"/>
        <line x1="-26" y1="2" x2="-18" y2="2" stroke={i} strokeWidth="0.9"/>
        <path d="-26 1 Q-22 -3 -18 1" stroke={i} strokeWidth="0.7"/>
        {/* Stepping stones */}
        {[-12,-4,4,12].map(sx2 => <ellipse key={sx2} cx={sx2} cy="22" rx="4" ry="2" fill={f} fillOpacity="0.4" stroke={i} strokeWidth="0.6"/>)}
        {/* Tea bowl in window */}
        <path d="-4 8 Q0 6 4 8 Q3 12 0 13 Q-3 12 -4 8Z"
          fill={c3} fillOpacity="0.5" stroke={i} strokeWidth="0.7"/>
      </g>
    );

    // ── Clay-Pot Crab Dinner ───────────────────────────────────────────────
    if (tl.includes('clay') || tl.includes('crab') || tl.includes('donabe')) return (
      <g fill="none" strokeLinecap="round">
        {/* Clay pot / donabe */}
        <path d="M-14 10 Q-16 0 -14 -8 Q-8 -14 0 -14 Q8 -14 14 -8 Q16 0 14 10Z"
          fill={c1} fillOpacity="0.35" stroke={i} strokeWidth="1.2"/>
        {/* Lid */}
        <path d="M-12 -10 Q0 -20 12 -10" fill={c2} fillOpacity="0.4" stroke={i} strokeWidth="1.1"/>
        <circle cx="0" cy="-20" r="3" fill={c2} fillOpacity="0.6" stroke={i} strokeWidth="0.9"/>
        {/* Steam from lid */}
        <path d="-4 -20 Q-6 -28 -4 -34" stroke={f} strokeWidth="0.9"/>
        <path d="2 -20 Q4 -28 2 -34" stroke={f} strokeWidth="0.9"/>
        {/* Crab claw peeking out */}
        <path d="M10 -6 Q16 -10 20 -6 Q18 -2 14 -4 Q10 -4 10 -6Z"
          fill={c3} fillOpacity="0.6" stroke={i} strokeWidth="0.9"/>
        <path d="M14 -4 Q18 0 22 -2" stroke={i} strokeWidth="0.8"/>
        {/* Chopsticks */}
        <line x1="-18" y1="-12" x2="-6" y2="4" stroke={i} strokeWidth="1.2"/>
        <line x1="-14" y1="-14" x2="-2" y2="2" stroke={i} strokeWidth="1.2"/>
      </g>
    );

    // ── Nozomi Shinkansen (Kyoto departure) ────────────────────────────────
    if (tl.includes('nozomi') || tl.includes('shinkansen') && tl.includes('kyoto')) return (
      <g fill="none" strokeLinecap="round">
        {/* Shinkansen nose */}
        <path d="M-4 8 Q-16 8 -18 4 L-18 -4 Q-16 -8 -4 -8 Q4 -8 16 -4 Q20 -2 20 0 Q20 2 16 4 Q4 8 -4 8Z"
          fill={c2} fillOpacity="0.35" stroke={i} strokeWidth="1.2"/>
        <path d="-4 -8 Q4 -6 16 -2" stroke={f} strokeWidth="0.5"/>
        {[-8,-2,4,10].map(wx => <rect key={wx} x={wx} y="-5" width="5" height="4" rx="0.5"
          fill={c3} fillOpacity="0.5" stroke={i} strokeWidth="0.5"/>)}
        {/* Speed lines */}
        {[-6,-2,2,6].map(ly => <line key={ly} x1="-22" y1={ly} x2="-18" y2={ly}
          stroke={c1} strokeWidth={Math.abs(ly)===6?0.7:1.2}/>)}
        {/* Rice fields in background */}
        {[14,18,22].map(ry => <line key={ry} x1="-20" y1={ry} x2="24" y2={ry} stroke={f} strokeWidth="0.5" strokeDasharray="3,2"/>)}
        {/* Mt. Fuji */}
        <path d="M12 22 L18 10 L24 22" fill={f} fillOpacity="0.3" stroke={i} strokeWidth="0.7"/>
      </g>
    );

    // ── Imperial Palace East Gardens ───────────────────────────────────────
    if (tl.includes('imperial palace') || tl.includes('east gardens')) return (
      <g fill="none" strokeLinecap="round">
        {/* Stone walls */}
        <rect x="-20" y="-4" width="40" height="18" fill={c2} fillOpacity="0.25" stroke={i} strokeWidth="1.2"/>
        <line x1="-20" y1="2" x2="20" y2="2" stroke={f} strokeWidth="0.5"/>
        {/* Moat */}
        <path d="-22 14 Q-8 11 0 14 Q10 17 22 14" stroke={c3} strokeWidth="1.1"/>
        {/* Stone bridge */}
        <path d="-6 14 Q0 10 6 14" stroke={i} strokeWidth="1.3"/>
        <line x1="-6" y1="14" x2="-6" y2="18" stroke={i} strokeWidth="0.9"/>
        <line x1="6" y1="14" x2="6" y2="18" stroke={i} strokeWidth="0.9"/>
        {/* Pine trees */}
        <path d="M-16 -4 L-16 -14 L-24 -8 L-22 -4" stroke={i} strokeWidth="0.8"/>
        <circle cx="-18" cy="-16" r="5" fill={c1} fillOpacity="0.4" stroke={i} strokeWidth="0.8"/>
        <path d="M14 -4 L14 -12 L22 -6 L20 -4" stroke={i} strokeWidth="0.8"/>
        <circle cx="16" cy="-14" r="5" fill={c1} fillOpacity="0.4" stroke={i} strokeWidth="0.8"/>
        {/* Watch tower silhouette */}
        <rect x="-4" y="-18" width="8" height="14" rx="0.5" fill={c2} fillOpacity="0.3" stroke={i} strokeWidth="0.9"/>
        <path d="-6 -18 L0 -24 L6 -18" fill={c2} fillOpacity="0.3" stroke={i} strokeWidth="0.8"/>
      </g>
    );

    // ── Hyatt / Hotel generic ─────────────────────────────────────────────
    if (tl.includes('hyatt') || tl.includes('intercontinental') || tl.includes('hotel') || tl.includes('inn')) return (
      <g fill="none" strokeLinecap="round">
        <rect x="-10" y="-22" width="20" height="36" fill={c1} fillOpacity="0.2" stroke={i} strokeWidth="1.2"/>
        {[0,1,2,3,4,5].map(row => [0,1].map(col => (
          <rect key={`${row}-${col}`} x={-8+col*8} y={-20+row*6} width="5" height="4" rx="0.3"
            fill={c2} fillOpacity={((row+col+s)%4===0)?0.7:0.15} stroke={i} strokeWidth="0.4"/>
        )))}
        <circle cx="0" cy="-26" r="4" fill={c3} fillOpacity="0.4" stroke={i} strokeWidth="0.9"/>
        <line x1="-14" y1="14" x2="14" y2="14" stroke={i} strokeWidth="0.8"/>
      </g>
    );

    // ── Default seafood / restaurant ──────────────────────────────────────
    if (tl.includes('seafood') || tl.includes('happo') || tl.includes('oyster') || tl.includes('crab')) return (
      <g fill="none" strokeLinecap="round">
        {/* Oyster shells */}
        {[[-12,-4],[0,0],[10,-6]].map(([ox,oy]) => (
          <g key={ox} transform={`translate(${ox},${oy})`}>
            <path d="M0 0 Q-6 -4 -8 -10 Q-2 -14 6 -10 Q10 -4 8 0 Q4 2 0 0Z"
              fill={c2} fillOpacity="0.4" stroke={i} strokeWidth="0.9"/>
            <path d="M0 0 Q2 -6 0 -12" stroke={f} strokeWidth="0.4"/>
          </g>
        ))}
        {/* Snow crab claw */}
        <path d="M6 8 Q10 4 16 6 Q20 10 18 14 Q14 16 10 14 Q6 12 6 8Z"
          fill={c1} fillOpacity="0.5" stroke={i} strokeWidth="1"/>
        <path d="M14 6 Q18 2 22 4" stroke={i} strokeWidth="0.9"/>
        <path d="M16 8 Q20 6 24 8" stroke={i} strokeWidth="0.8"/>
        {/* Ice bucket */}
        <path d="-18 4 L-16 16 L-8 16 L-6 4Z" fill={c3} fillOpacity="0.3" stroke={i} strokeWidth="0.9"/>
        <line x1="-18" y1="4" x2="-6" y2="4" stroke={i} strokeWidth="0.7"/>
      </g>
    );

    // ── Golf course ───────────────────────────────────────────────────────
    if (tl.includes('golf') || tl.includes('kawana')) return (
      <g fill="none" strokeLinecap="round">
        {/* Rolling fairway */}
        <path d="M-22 16 Q-10 8 0 12 Q10 16 22 10" stroke={f} strokeWidth="0.9"/>
        <path d="M-22 20 Q-8 13 0 17 Q10 21 22 15" stroke={f} strokeWidth="0.5"/>
        {/* Flag on green */}
        <circle cx="8" cy="8" r="6" fill={c2} fillOpacity="0.25" stroke={i} strokeWidth="0.8"/>
        <line x1="8" y1="8" x2="8" y2="-14" stroke={i} strokeWidth="1.1"/>
        <path d="M8 -14 L18 -9 L8 -4" fill={c1} fillOpacity="0.7" stroke={i} strokeWidth="0.8"/>
        {/* Golf club */}
        <line x1="-12" y1="-18" x2="-2" y2="10" stroke={i} strokeWidth="1.2"/>
        <path d="M-4 8 Q-2 12 2 10 Q0 6 -4 8Z" fill={c2} fillOpacity="0.5" stroke={i} strokeWidth="0.8"/>
        {/* Ocean horizon */}
        <line x1="-22" y1="2" x2="22" y2="2" stroke={c3} strokeWidth="0.5" strokeDasharray="3,2"/>
        <path d="M-22 4 Q-10 2 0 4 Q10 6 22 4" stroke={c3} strokeWidth="0.7"/>
      </g>
    );

    // ── Senso-ji / Asakusa temple ─────────────────────────────────────────
    if (tl.includes('senso') || tl.includes('asakusa') || tl.includes('pagoda')) return (
      <g fill="none" strokeLinecap="round">
        {/* Five-storey pagoda */}
        {[0,1,2,3,4].map(tier => (
          <g key={tier}>
            <rect x={-10+tier*2} y={-20+tier*8} width={20-tier*4} height={7} rx="0.3"
              fill={c2} fillOpacity="0.25" stroke={i} strokeWidth={tier===0?0.5:0.8}/>
            <path d={`M${-12+tier*2} ${-20+tier*8} L${0} ${-26+tier*8} L${12-tier*2} ${-20+tier*8}`}
              fill={c1} fillOpacity="0.35" stroke={i} strokeWidth="0.9"/>
          </g>
        ))}
        <line x1="0" y1="-26" x2="0" y2="-30" stroke={i} strokeWidth="0.8"/>
        {/* Incense smoke */}
        <path d="M10 14 Q8 8 10 2" stroke={f} strokeWidth="0.8"/>
        <path d="M14 14 Q12 8 14 2" stroke={f} strokeWidth="0.6"/>
        {/* Thunder gate suggestion */}
        <rect x="-18" y="14" width="36" height="6" rx="0.5" fill={c3} fillOpacity="0.3" stroke={i} strokeWidth="0.9"/>
        <path d="M-20 14 L0 8 L20 14" fill={c3} fillOpacity="0.2" stroke={i} strokeWidth="0.8"/>
      </g>
    );

    // ── Shibuya / Hamarikyu ───────────────────────────────────────────────
    if (tl.includes('shibuya') || tl.includes('scramble')) return (
      <g fill="none" strokeLinecap="round">
        {/* Pedestrian crossing stripes */}
        {[-10,-4,2,8].map(lx => (
          <rect key={lx} x={lx} y="-4" width="4" height="22" rx="0.3"
            fill={c2} fillOpacity="0.3" stroke={i} strokeWidth="0.5"/>
        ))}
        {/* Crowd dots */}
        {[[-14,18],[-8,20],[-2,18],[4,20],[10,18],[16,20]].map(([px,py]) => (
          <circle key={px} cx={px} cy={py} r="2" fill={c1} fillOpacity="0.5" stroke={i} strokeWidth="0.4"/>
        ))}
        {/* Building silhouettes */}
        <rect x="-22" y="-20" width="8" height="18" fill={f} fillOpacity="0.2" stroke={i} strokeWidth="0.7"/>
        <rect x="14" y="-16" width="10" height="14" fill={f} fillOpacity="0.2" stroke={i} strokeWidth="0.7"/>
        <rect x="-22" y="-24" width="5" height="4" fill={c1} fillOpacity="0.3" stroke={i} strokeWidth="0.5"/>
      </g>
    );

    // ── Hamarikyu Gardens ─────────────────────────────────────────────────
    if (tl.includes('hamarikyu') || tl.includes('hama')) return (
      <g fill="none" strokeLinecap="round">
        {/* Tidal pond */}
        <ellipse cx="0" cy="10" rx="16" ry="8" fill={c3} fillOpacity="0.2" stroke={i} strokeWidth="0.9"/>
        <ellipse cx="0" cy="10" rx="11" ry="5" stroke={f} strokeWidth="0.5" strokeDasharray="2,2"/>
        {/* Floating tea house on bridge */}
        <line x1="-12" y1="10" x2="-20" y2="10" stroke={i} strokeWidth="0.8"/>
        <rect x="-20" y="4" width="10" height="8" rx="0.5" fill={c2} fillOpacity="0.3" stroke={i} strokeWidth="0.9"/>
        <path d="-22 4 L-15 -2 L-8 4" stroke={i} strokeWidth="0.8"/>
        {/* Stone lanterns */}
        {[-8, 10].map(lx => <g key={lx}>
          <rect x={lx} y="0" width="4" height="8" rx="0.3" fill={f} fillOpacity="0.4" stroke={i} strokeWidth="0.7"/>
          <path d={`M${lx-2} 0 L${lx+2} -5 L${lx+6} 0`} fill={f} fillOpacity="0.3" stroke={i} strokeWidth="0.6"/>
        </g>)}
        {/* Skyscrapers pressing in */}
        <rect x="12" y="-16" width="8" height="20" fill={f} fillOpacity="0.15" stroke={f} strokeWidth="0.5"/>
        <rect x="18" y="-22" width="6" height="26" fill={f} fillOpacity="0.15" stroke={f} strokeWidth="0.5"/>
      </g>
    );

    // ── Tsukiji Market ────────────────────────────────────────────────────
    if (tl.includes('tsukiji') || tl.includes('outer market')) return (
      <g fill="none" strokeLinecap="round">
        {/* Tuna on ice */}
        <path d="M-18 4 Q-10 -2 0 0 Q10 2 18 -2 Q14 8 0 8 Q-14 8 -18 4Z"
          fill={c1} fillOpacity="0.35" stroke={i} strokeWidth="1.1"/>
        <line x1="-12" y1="4" x2="12" y2="2" stroke={f} strokeWidth="0.5"/>
        {/* Ice crystals */}
        {[-14,-6,4,12].map(ix => <circle key={ix} cx={ix} cy="6" r="1" fill="white" fillOpacity="0.6" stroke={f} strokeWidth="0.3"/>)}
        {/* Tamagoyaki press */}
        <rect x="-10" y="12" width="14" height="8" rx="1" fill={c2} fillOpacity="0.4" stroke={i} strokeWidth="0.9"/>
        <line x1="-10" y1="16" x2="4" y2="16" stroke={f} strokeWidth="0.4"/>
        {/* Uni cup */}
        <path d="M10 12 Q8 16 10 20 Q14 22 18 20 Q20 16 18 12Z" fill={c3} fillOpacity="0.35" stroke={i} strokeWidth="0.8"/>
        {/* Market stall roof */}
        <path d="M-20 10 Q0 6 20 10" stroke={c1} strokeWidth="0.7" strokeDasharray="2,2"/>
      </g>
    );

    // ── Tokyo Tower ───────────────────────────────────────────────────────
    if (tl.includes('tokyo tower')) return (
      <g fill="none" strokeLinecap="round">
        <path d="M-10 22 L-4 4 L0 -22 L4 4 L10 22" fill={c1} fillOpacity="0.25" stroke={i} strokeWidth="1.2"/>
        <path d="-10 22 L10 22 M-7 14 L7 14 M-4 6 L4 6" stroke={i} strokeWidth="0.7"/>
        <line x1="0" y1="-22" x2="0" y2="-28" stroke={i} strokeWidth="0.9"/>
        {/* Main deck */}
        <rect x="-5" y="4" width="10" height="4" rx="0.5" fill={c1} fillOpacity="0.4" stroke={i} strokeWidth="0.8"/>
        {/* Top deck */}
        <rect x="-3" y="-6" width="6" height="3" rx="0.3" fill={c2} fillOpacity="0.4" stroke={i} strokeWidth="0.7"/>
        {/* Orange/white bands */}
        <line x1="-8" y1="18" x2="8" y2="18" stroke={c1} strokeWidth="1.2"/>
        <line x1="-5" y1="10" x2="5" y2="10" stroke={c1} strokeWidth="1.2"/>
        {/* City base */}
        <path d="M-22 22 L-18 14 L-14 18 L-8 10 L0 14 L8 8 L14 14 L18 10 L22 22" stroke={f} strokeWidth="0.6"/>
      </g>
    );

    // ── Osaka Castle ──────────────────────────────────────────────────────
    if (tl.includes('osaka castle')) return (
      <g fill="none" strokeLinecap="round">
        <rect x="-14" y="8" width="28" height="10" fill={c2} fillOpacity="0.3" stroke={i} strokeWidth="1"/>
        <rect x="-11" y="2" width="22" height="8" fill={c2} fillOpacity="0.25" stroke={i} strokeWidth="0.9"/>
        <rect x="-8" y="-4" width="16" height="8" fill={c2} fillOpacity="0.2" stroke={i} strokeWidth="0.8"/>
        <path d="-16 8 L0 2 L16 8" fill={c1} fillOpacity="0.4" stroke={i} strokeWidth="1.1"/>
        <path d="-13 2 L0 -4 L13 2" fill={c1} fillOpacity="0.35" stroke={i} strokeWidth="1"/>
        <path d="-10 -4 L0 -10 L10 -4" fill={c1} fillOpacity="0.3" stroke={i} strokeWidth="0.9"/>
        <line x1="0" y1="-12" x2="0" y2="-16" stroke={i} strokeWidth="0.8"/>
        {/* Stone base */}
        <path d="-20 18 L-16 12 L16 12 L20 18" fill={c3} fillOpacity="0.3" stroke={i} strokeWidth="0.9"/>
        {/* Moat */}
        <path d="-22 20 Q-8 17 0 20 Q10 23 22 20" stroke={c3} strokeWidth="0.9"/>
      </g>
    );

    // ── Fugu / blowfish ───────────────────────────────────────────────────
    if (tl.includes('fugu') || tl.includes('blowfish') || tl.includes('zuboraya')) return (
      <g fill="none" strokeLinecap="round">
        {/* Blowfish body */}
        <circle cx="-4" cy="0" r="12" fill={c2} fillOpacity="0.25" stroke={i} strokeWidth="1.2"/>
        {/* Spines */}
        {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => (
          <line key={a}
            x1={(Math.cos(a*Math.PI/180)*12-4).toFixed(1)} y1={(Math.sin(a*Math.PI/180)*12).toFixed(1)}
            x2={(Math.cos(a*Math.PI/180)*16-4).toFixed(1)} y2={(Math.sin(a*Math.PI/180)*16).toFixed(1)}
            stroke={i} strokeWidth="0.7"/>
        ))}
        <circle cx="-4" cy="-2" r="2.5" fill={i} fillOpacity="0.5" stroke="none"/>
        <path d="-2 2 Q0 4 -4 4" stroke={i} strokeWidth="0.6"/>
        {/* Sashimi fan */}
        {[-6,-2,2,6,10].map((sx2,idx2) => (
          <ellipse key={idx2} cx={14+sx2*0.3} cy={6-idx2*2} rx="5" ry="1.5"
            fill={c1} fillOpacity="0.4" stroke={i} strokeWidth="0.6"
            transform={`rotate(${-20+idx2*8},${14+sx2*0.3},${6-idx2*2})`}/>
        ))}
      </g>
    );

    // ── Okonomiyaki ───────────────────────────────────────────────────────
    if (tl.includes('okonomiyaki') || tl.includes('fukutaro')) return (
      <g fill="none" strokeLinecap="round">
        {/* Griddle pan */}
        <ellipse cx="0" cy="14" rx="18" ry="5" fill={c3} fillOpacity="0.3" stroke={i} strokeWidth="0.9"/>
        {/* Pancake */}
        <ellipse cx="0" cy="6" rx="14" ry="10" fill={c1} fillOpacity="0.4" stroke={i} strokeWidth="1.1"/>
        {/* Mayo zigzag */}
        <path d="M-8 4 Q-4 0 0 4 Q4 8 8 4" stroke="white" strokeWidth="1.5" fill="none"/>
        {/* Bonito flakes */}
        {[[-6,2],[0,-2],[6,2],[-3,6],[3,6]].map(([bx,by]) => (
          <path key={bx} d={`M${bx-3} ${by} Q${bx} ${by-4} ${bx+3} ${by}`}
            stroke={c2} strokeWidth="0.8" fill="none"/>
        ))}
        {/* Sauce drizzle */}
        <path d="M-10 0 Q-6 -4 -2 0 Q2 4 6 0 Q10 -4 12 0" stroke={c3} strokeWidth="1.2" fill="none"/>
        {/* Spatula */}
        <path d="M16 -8 L10 8" stroke={i} strokeWidth="1.2"/>
        <rect x="8" y="6" width="8" height="4" rx="1" fill={c2} fillOpacity="0.4" stroke={i} strokeWidth="0.7" transform="rotate(-30,12,8)"/>
      </g>
    );

    // ── Yudofu / tofu ─────────────────────────────────────────────────────
    if (tl.includes('yudofu') || tl.includes('tofu') || tl.includes('junsei')) return (
      <g fill="none" strokeLinecap="round">
        {/* Clay pot */}
        <path d="M-12 8 Q-14 0 -12 -8 Q-6 -14 0 -14 Q6 -14 12 -8 Q14 0 12 8Z"
          fill={c1} fillOpacity="0.2" stroke={i} strokeWidth="1.1"/>
        {/* Kombu in water */}
        <path d="M-8 -2 Q-4 -6 0 -2 Q4 2 8 -2" stroke={c3} strokeWidth="1" fill="none"/>
        {/* Tofu block */}
        <rect x="-6" y="-6" width="12" height="8" rx="1" fill="white" fillOpacity="0.7" stroke={i} strokeWidth="0.9"/>
        {/* Steam */}
        <path d="-4 -6 Q-6 -12 -4 -18" stroke={f} strokeWidth="0.8"/>
        <path d="2 -6 Q4 -12 2 -18" stroke={f} strokeWidth="0.8"/>
        {/* Sesame sauce bowl */}
        <path d="M-20 6 Q-18 2 -14 4 Q-12 2 -10 4 Q-12 8 -16 8 Q-20 8 -20 6Z"
          fill={c2} fillOpacity="0.4" stroke={i} strokeWidth="0.7"/>
      </g>
    );

    // ── Gion walk ─────────────────────────────────────────────────────────
    if (tl.includes('gion') || tl.includes('maiko') || tl.includes('geiko')) return (
      <g fill="none" strokeLinecap="round">
        {/* Cobblestone lane */}
        {[-12,-6,0,6,12].map(sx2 => (
          <ellipse key={sx2} cx={sx2} cy="20" rx="4" ry="2" fill={f} fillOpacity="0.3" stroke={i} strokeWidth="0.5"/>
        ))}
        {/* Machiya buildings */}
        <rect x="-20" y="-8" width="10" height="26" fill={c1} fillOpacity="0.15" stroke={i} strokeWidth="0.9"/>
        <rect x="10" y="-4" width="12" height="22" fill={c1} fillOpacity="0.15" stroke={i} strokeWidth="0.9"/>
        {/* Lattice windows */}
        {[0,1,2].map(r => [0,1].map(c2 => (
          <rect key={`${r}-${c2}`} x={-19+c2*4} y={-6+r*6} width="3" height="4" rx="0.2"
            fill={c2===0&&r===1 ? c3 : 'none'} fillOpacity="0.5" stroke={f} strokeWidth="0.4"/>
        )))}
        {/* Red lantern */}
        <ellipse cx="0" cy="-6" rx="5" ry="8" fill={c2} fillOpacity="0.6" stroke={i} strokeWidth="0.9"/>
        <line x1="0" y1="-14" x2="0" y2="-12" stroke={i} strokeWidth="0.8"/>
        <line x1="-5" y1="-6" x2="5" y2="-6" stroke={f} strokeWidth="0.4"/>
        {/* Willow branch */}
        <path d="M20 -10 Q22 0 18 12 M20 -4 Q24 4 20 14 M20 2 Q26 10 22 20" stroke={c1} strokeWidth="0.8" fillOpacity="0.0"/>
      </g>
    );

    // ── Nijo Castle ───────────────────────────────────────────────────────
    if (tl.includes('nijo')) return (
      <g fill="none" strokeLinecap="round">
        {/* Castle wall and tower */}
        <rect x="-20" y="2" width="40" height="16" fill={c2} fillOpacity="0.2" stroke={i} strokeWidth="1.1"/>
        {/* Tower tiers */}
        <rect x="-10" y="-10" width="20" height="13" fill={c2} fillOpacity="0.25" stroke={i} strokeWidth="1"/>
        <path d="-12 -10 L0 -18 L12 -10" fill={c1} fillOpacity="0.3" stroke={i} strokeWidth="1.1"/>
        <path d="-8 -10 L0 -6 L8 -10" fill={c1} fillOpacity="0.2" stroke={i} strokeWidth="0.8"/>
        {/* Golden screen suggestion */}
        <rect x="-6" y="4" width="12" height="8" rx="0.3" fill={c1} fillOpacity="0.25" stroke={f} strokeWidth="0.5"/>
        {/* Nightingale floor wavy lines */}
        <path d="-18 10 Q-12 8 -6 10 Q0 12 6 10 Q12 8 18 10" stroke={f} strokeWidth="0.6" strokeDasharray="2,1"/>
        {/* Stone base */}
        <path d="-22 18 L-18 14 L18 14 L22 18" fill={c3} fillOpacity="0.3" stroke={i} strokeWidth="0.8"/>
      </g>
    );

    // ── Nanzen-ji ─────────────────────────────────────────────────────────
    if (tl.includes('nanzen')) return (
      <g fill="none" strokeLinecap="round">
        {/* Sanmon gate */}
        <rect x="-16" y="4" width="32" height="16" fill={c1} fillOpacity="0.2" stroke={i} strokeWidth="1.1"/>
        <path d="-18 4 L0 -8 L18 4" fill={c2} fillOpacity="0.3" stroke={i} strokeWidth="1.2"/>
        {/* 3 arched portals */}
        {[-10,0,10].map(px => (
          <path key={px} d={`M${px-5} 20 L${px-5} 10 Q${px} 6 ${px+5} 10 L${px+5} 20`}
            fill={c3} fillOpacity="0.3" stroke={i} strokeWidth="0.8"/>
        ))}
        {/* Red-brick aqueduct arches */}
        {[-14,-4,6].map(ax => (
          <g key={ax}>
            <path d={`M${ax} 24 Q${ax+5} 16 ${ax+10} 24`} fill={c2} fillOpacity="0.3" stroke={i} strokeWidth="0.9"/>
          </g>
        ))}
        <line x1="-16" y1="16" x2="20" y2="16" stroke={c2} strokeWidth="1"/>
      </g>
    );

    // ── Tenryu-ji garden ─────────────────────────────────────────────────
    if (tl.includes('tenryu') || tl.includes('tenryuji')) return (
      <g fill="none" strokeLinecap="round">
        {/* Garden pond */}
        <ellipse cx="0" cy="12" rx="16" ry="7" fill={c3} fillOpacity="0.25" stroke={i} strokeWidth="1"/>
        {/* Borrowed landscape - Arashiyama hills */}
        <path d="-22 4 L-14 -8 L-6 0 L2 -14 L10 -4 L18 -10 L22 4" fill={c1} fillOpacity="0.2" stroke={i} strokeWidth="0.8"/>
        {/* Stone stepping stones in pond */}
        {[-8,-2,4,10].map(sx2 => <ellipse key={sx2} cx={sx2} cy="12" rx="3" ry="2" fill={c2} fillOpacity="0.5" stroke={i} strokeWidth="0.6"/>)}
        {/* Pine on shore */}
        <path d="-18 4 L-18 -6 L-24 0 L-22 4 M-18 -2 L-12 -4" stroke={i} strokeWidth="0.9"/>
        <circle cx="-20" cy="-8" r="5" fill={c1} fillOpacity="0.3" stroke={i} strokeWidth="0.7"/>
        {/* Reflection */}
        <path d="-14 16 Q0 14 14 16" stroke={c1} strokeWidth="0.5" strokeOpacity="0.5"/>
      </g>
    );

    // ── Sagano train / gorge ───────────────────────────────────────────────
    if (tl.includes('sagano') || tl.includes('romantic train') || tl.includes('gorge')) return (
      <g fill="none" strokeLinecap="round">
        {/* Gorge walls */}
        <path d="-22 -18 Q-20 -8 -18 0 L-18 22" stroke={i} strokeWidth="1.1"/>
        <path d="22 -18 Q20 -8 18 0 L18 22" stroke={i} strokeWidth="1.1"/>
        {/* River at bottom */}
        <path d="-18 18 Q-8 14 0 18 Q8 22 18 18" stroke={c3} strokeWidth="1.2"/>
        <path d="-18 21 Q-8 18 0 21 Q8 24 18 21" stroke={c3} strokeWidth="0.5"/>
        {/* Train car */}
        <rect x="-12" y="-4" width="24" height="10" rx="2" fill={c1} fillOpacity="0.3" stroke={i} strokeWidth="1.1"/>
        {[-8,-2,4,10].map(wx => <rect key={wx} x={wx} y="-2" width="5" height="5" rx="0.5"
          fill={c2} fillOpacity="0.4" stroke={i} strokeWidth="0.5"/>)}
        {/* Track */}
        <line x1="-22" y1="6" x2="22" y2="6" stroke={i} strokeWidth="1.1"/>
        <line x1="-22" y1="8" x2="22" y2="8" stroke={i} strokeWidth="1.1"/>
        {[-16,-8,0,8,16].map(tx => <line key={tx} x1={tx} y1="6" x2={tx} y2="8" stroke={i} strokeWidth="0.9"/>)}
      </g>
    );

    // ── Kappo / counter kaiseki ────────────────────────────────────────────
    if (tl.includes('kappo') || tl.includes('farewell kaiseki') || tl.includes('kaiseki') && tl.includes('kyoto')) return (
      <g fill="none" strokeLinecap="round">
        {/* Counter top */}
        <rect x="-20" y="6" width="40" height="4" rx="0.5" fill={c2} fillOpacity="0.3" stroke={i} strokeWidth="1"/>
        {/* Lacquer bowls on counter */}
        {[-12,-4,4,12].map(bx => (
          <g key={bx}>
            <path d={`M${bx-5} 6 Q${bx-6} 0 ${bx-4} -4 Q${bx} -6 ${bx+4} -4 Q${bx+6} 0 ${bx+5} 6Z`}
              fill={c1} fillOpacity={bx===4?0.5:0.3} stroke={i} strokeWidth="0.8"/>
            <path d={`M${bx-5} 6 Q${bx} 4 ${bx+5} 6`} stroke={i} strokeWidth="0.5"/>
          </g>
        ))}
        {/* Chef's hands / ladle */}
        <path d="M18 -8 Q22 -4 20 2 Q18 6 16 4" stroke={i} strokeWidth="0.9"/>
        <circle cx="16" cy="4" r="3" fill={c3} fillOpacity="0.4" stroke={i} strokeWidth="0.7"/>
        {/* Sake carafe */}
        <path d="-20 -2 Q-22 -6 -20 -12 Q-16 -16 -12 -12 Q-10 -6 -12 -2Z"
          fill={c2} fillOpacity="0.35" stroke={i} strokeWidth="0.8"/>
        <line x1="-16" y1="-12" x2="-16" y2="-18" stroke={i} strokeWidth="0.7"/>
      </g>
    );

    // ── Kuromon Market ────────────────────────────────────────────────────
    if (tl.includes('kuromon') || tl.includes('ichiba') || tl.includes("kitchen of japan")) return (
      <g fill="none" strokeLinecap="round">
        {/* Market roof */}
        <path d="-22 -4 Q0 -10 22 -4" stroke={i} strokeWidth="1.1"/>
        <line x1="-22" y1="-4" x2="-22" y2="20" stroke={i} strokeWidth="0.8"/>
        <line x1="22" y1="-4" x2="22" y2="20" stroke={i} strokeWidth="0.8"/>
        {/* Stalls */}
        {[-14,-4,6,16].map(sx2 => (
          <g key={sx2}>
            <rect x={sx2} y="2" width="8" height="12" rx="0.3" fill={c1} fillOpacity="0.2" stroke={i} strokeWidth="0.7"/>
            <path d={`M${sx2-2} 2 Q${sx2+4} -2 ${sx2+10} 2`} fill={c2} fillOpacity="0.3" stroke={i} strokeWidth="0.7"/>
          </g>
        ))}
        {/* Sea urchin and crab on display */}
        <circle cx="-10" cy="10" r="5" fill={c3} fillOpacity="0.35" stroke={i} strokeWidth="0.8"/>
        {[0,40,80,120,160,200,240,280,320].map(a => (
          <line key={a}
            x1={(-10+Math.cos(a*Math.PI/180)*5).toFixed(1)} y1={(10+Math.sin(a*Math.PI/180)*5).toFixed(1)}
            x2={(-10+Math.cos(a*Math.PI/180)*8).toFixed(1)} y2={(10+Math.sin(a*Math.PI/180)*8).toFixed(1)}
            stroke={i} strokeWidth="0.6"/>
        ))}
      </g>
    );

    // ── Obanzai / Kyoto home cooking ─────────────────────────────────────
    if (tl.includes('obanzai') || tl.includes('oimatsu')) return (
      <g fill="none" strokeLinecap="round">
        {/* Row of small dishes */}
        {[[-16,0],[-8,2],[0,0],[8,2],[16,0]].map(([dx2,dy]) => (
          <g key={dx2}>
            <path d={`M${dx2-5} ${8+dy} Q${dx2-6} ${2+dy} ${dx2-4} ${-2+dy} Q${dx2} ${-4+dy} ${dx2+4} ${-2+dy} Q${dx2+6} ${2+dy} ${dx2+5} ${8+dy}Z`}
              fill={c1} fillOpacity="0.35" stroke={i} strokeWidth="0.8"/>
          </g>
        ))}
        {/* Lacquer tray */}
        <rect x="-22" y="8" width="44" height="4" rx="1" fill={c2} fillOpacity="0.4" stroke={i} strokeWidth="0.9"/>
        <line x1="-22" y1="10" x2="22" y2="10" stroke={f} strokeWidth="0.3"/>
        {/* Chopsticks */}
        <line x1="-14" y1="-8" x2="-10" y2="8" stroke={i} strokeWidth="0.9"/>
        <line x1="-10" y1="-8" x2="-6" y2="8" stroke={i} strokeWidth="0.9"/>
        {/* Tea cup */}
        <path d="M12 -8 Q10 -14 12 -18 Q16 -20 20 -18 Q22 -14 20 -8Z"
          fill={c3} fillOpacity="0.35" stroke={i} strokeWidth="0.8"/>
        <path d="M20 -14 Q24 -14 24 -10" stroke={i} strokeWidth="0.7"/>
      </g>
    );

    // ── Ramen ─────────────────────────────────────────────────────────────
    if (tl.includes('ramen') || tl.includes('ramen street')) return (
      <g fill="none" strokeLinecap="round">
        {/* Ramen bowl */}
        <path d="M-14 4 Q-16 -4 -14 -12 Q-8 -18 0 -18 Q8 -18 14 -12 Q16 -4 14 4Z"
          fill={c1} fillOpacity="0.25" stroke={i} strokeWidth="1.2"/>
        <path d="-14 4 Q0 8 14 4" stroke={i} strokeWidth="0.7"/>
        {/* Noodle swirls */}
        <path d="-8 -4 Q-4 -8 0 -4 Q4 0 8 -4 Q10 -8 12 -6" stroke={c3} strokeWidth="1" fill="none"/>
        <path d="-10 0 Q-6 -4 -2 0 Q2 4 6 0" stroke={c3} strokeWidth="0.8" fill="none"/>
        {/* Chashu pork */}
        <ellipse cx="-4" cy="-8" rx="5" ry="3.5" fill={c2} fillOpacity="0.5" stroke={i} strokeWidth="0.8"/>
        <path d="-7 -9 Q-4 -12 -1 -9" stroke={f} strokeWidth="0.4"/>
        {/* Soft egg half */}
        <path d="M6 -10 Q10 -14 14 -10 Q14 -6 10 -6 Q6 -6 6 -10Z" fill="white" fillOpacity="0.6" stroke={i} strokeWidth="0.7"/>
        <circle cx="10" cy="-9" r="2" fill={c1} fillOpacity="0.7" stroke="none"/>
        {/* Steam */}
        <path d="-2 -18 Q-4 -24 -2 -28" stroke={f} strokeWidth="0.8"/>
        <path d="4 -18 Q6 -24 4 -28" stroke={f} strokeWidth="0.8"/>
      </g>
    );

    // ── Tempura ───────────────────────────────────────────────────────────
    if (tl.includes('tempura') || tl.includes('daikokuya')) return (
      <g fill="none" strokeLinecap="round">
        {/* Shrimp tempura */}
        <path d="M-2 -18 Q0 -12 2 -6 Q4 0 2 6 Q0 10 -2 6 Q-4 0 -2 -6 Q-2 -12 -2 -18Z"
          fill={c1} fillOpacity="0.5" stroke={i} strokeWidth="1.1"/>
        {/* Batter texture */}
        {[-14,-8,-2,4,10].map(by => <line key={by} x1="-4" y1={by} x2="4" y2={by+2} stroke={f} strokeWidth="0.4"/>)}
        {/* Vegetable tempura pieces */}
        <ellipse cx="12" cy="-4" rx="7" ry="4" fill={c2} fillOpacity="0.4" stroke={i} strokeWidth="0.8" transform="rotate(-20,12,-4)"/>
        <ellipse cx="12" cy="6" rx="6" ry="3.5" fill={c3} fillOpacity="0.4" stroke={i} strokeWidth="0.8" transform="rotate(10,12,6)"/>
        {/* Dark sesame-oil sauce */}
        <path d="-18 14 Q-14 10 -10 14 Q-6 18 -2 14 Q2 10 6 14" stroke={c2} strokeWidth="1.2" fill="none"/>
        {/* Chopsticks */}
        <line x1="-14" y1="-20" x2="-8" y2="14" stroke={i} strokeWidth="1.1"/>
        <line x1="-10" y1="-20" x2="-4" y2="14" stroke={i} strokeWidth="1.1"/>
      </g>
    );

    // ── KIX / Kansai airport ──────────────────────────────────────────────
    if (tl.includes('kix') || tl.includes('kansai international') || tl.includes('kansai') && tl.includes('airport')) return (
      <g fill="none" strokeLinecap="round">
        {/* Renzo Piano curved roof */}
        <path d="-22 8 Q-10 -8 0 -10 Q10 -8 22 8" fill={c2} fillOpacity="0.2" stroke={i} strokeWidth="1.3"/>
        <path d="-22 10 Q-10 -6 0 -8 Q10 -6 22 10" stroke={f} strokeWidth="0.5"/>
        {/* Terminal wall grid */}
        {[-3,-1,1,3].map(col => <line key={col} x1={col*6} y1="8" x2={col*6} y2="18" stroke={f} strokeWidth="0.4"/>)}
        {[10,14,18].map(ry => <line key={ry} x1="-20" y1={ry} x2="20" y2={ry} stroke={f} strokeWidth="0.4"/>)}
        {/* Airplane departing */}
        <path d="M-8 -18 Q0 -22 8 -18 Q4 -14 0 -14 Q-4 -14 -8 -18Z" fill={c1} fillOpacity="0.4" stroke={i} strokeWidth="0.9"/>
        <path d="-2 -18 L-6 -24 L2 -22 L4 -16" fill={c2} fillOpacity="0.3" stroke={i} strokeWidth="0.7"/>
        <path d="4 -16 L8 -20 L10 -16" fill={c3} fillOpacity="0.3" stroke={i} strokeWidth="0.6"/>
        {/* Bay water */}
        <path d="-22 22 Q-8 19 0 22 Q10 25 22 22" stroke={c3} strokeWidth="0.9"/>
      </g>
    );

    // ── Generic restaurant fallback ───────────────────────────────────────
    return (
      <g fill="none" strokeLinecap="round">
        <path d="M-12 4 Q0 0 12 4 Q10 12 0 14 Q-10 12 -12 4Z"
          fill={c1} fillOpacity="0.55" stroke={i} strokeWidth="1" />
        <path d="M-4 3 Q-6 -3 -4 -9" stroke={c3} strokeWidth="0.9" fill="none"/>
        <path d="M0 2 Q-2 -4 0 -10" stroke={c3} strokeWidth="0.9" fill="none"/>
        <path d="M4 3 Q6 -3 4 -9" stroke={c3} strokeWidth="0.9" fill="none"/>
        <line x1="-3" y1="2" x2="-6" y2="-11" stroke={i} strokeWidth="1.3"/>
        <line x1="2" y1="2" x2="0" y2="-11" stroke={i} strokeWidth="1.3"/>
      </g>
    );
    // ── anime / otaku ──────────────────────────────────────────────────────
    if (tl.includes('akihabara') || tl.includes('electric town')) return (
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="-14" y="-18" width="28" height="32" rx="2" stroke={i} strokeWidth="1.2"/>
        <line x1="-14" y1="-6" x2="14" y2="-6" stroke={i} strokeWidth="0.9"/>
        <line x1="-14" y1="6" x2="14" y2="6" stroke={i} strokeWidth="0.9"/>
        <rect x="-10" y="-14" width="7" height="5" rx="1" stroke={c2} strokeWidth="1"/>
        <rect x="3" y="-14" width="7" height="5" rx="1" stroke={c2} strokeWidth="1"/>
        <rect x="-10" y="-2" width="20" height="5" rx="1" stroke={c2} strokeWidth="1"/>
        <line x1="0" y1="-26" x2="0" y2="-18" stroke={i} strokeWidth="0.8"/>
        <line x1="-6" y1="-23" x2="6" y2="-23" stroke={i} strokeWidth="0.8"/>
        <rect x="-7" y="10" width="14" height="7" rx="3" stroke={i} strokeWidth="1.1"/>
        <circle cx="6" cy="13.5" r="1.5" stroke={c2} strokeWidth="0.8"/>
        <line x1="-5" y1="13.5" x2="-2" y2="13.5" stroke={i} strokeWidth="0.9"/>
        <line x1="-3.5" y1="12" x2="-3.5" y2="15" stroke={i} strokeWidth="0.9"/>
      </g>
    );
    if (tl.includes('nakano broadway') || tl.includes('mandarake')) return (
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="-15" y="-20" width="30" height="40" rx="1" stroke={i} strokeWidth="1.2"/>
        <line x1="-15" y1="-8" x2="15" y2="-8" stroke={i} strokeWidth="0.8"/>
        <line x1="-15" y1="4" x2="15" y2="4" stroke={i} strokeWidth="0.8"/>
        <line x1="-15" y1="16" x2="15" y2="16" stroke={i} strokeWidth="0.8"/>
        <line x1="0" y1="-20" x2="0" y2="20" stroke={i} strokeWidth="0.8"/>
        <ellipse cx="-7" cy="-14" rx="3" ry="4" stroke={c2} strokeWidth="1"/>
        <ellipse cx="7" cy="-14" rx="3" ry="4" stroke={c2} strokeWidth="1"/>
        <rect x="-13" y="7" width="3" height="8" stroke={c2} strokeWidth="0.9"/>
        <rect x="-9" y="7" width="3" height="8" stroke={c2} strokeWidth="0.9"/>
        <rect x="-5" y="7" width="3" height="8" stroke={c2} strokeWidth="0.9"/>
        <rect x="3" y="7" width="3" height="8" stroke={c2} strokeWidth="0.9"/>
        <rect x="7" y="7" width="3" height="8" stroke={c2} strokeWidth="0.9"/>
      </g>
    );
    if (tl.includes('ghibli') || tl.includes('miyazaki') || tl.includes('totoro')) return (
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="0" cy="8" rx="14" ry="16" stroke={i} strokeWidth="1.3"/>
        <path d="M-10 -4 L-14 -18 L-6 -8" stroke={i} strokeWidth="1.1"/>
        <path d="M10 -4 L14 -18 L6 -8" stroke={i} strokeWidth="1.1"/>
        <circle cx="-5" cy="4" r="3.5" stroke={i} strokeWidth="1"/>
        <circle cx="5" cy="4" r="3.5" stroke={i} strokeWidth="1"/>
        <circle cx="-4" cy="3" r="1.5" fill={c2} fillOpacity="0.5" stroke={c2} strokeWidth="0.5"/>
        <circle cx="6" cy="3" r="1.5" fill={c2} fillOpacity="0.5" stroke={c2} strokeWidth="0.5"/>
        <ellipse cx="0" cy="10" rx="2.5" ry="1.5" stroke={i} strokeWidth="0.9"/>
        <path d="M-8 15 Q0 20 8 15" stroke={i} strokeWidth="1"/>
      </g>
    );
    if (tl.includes('takeshita') || tl.includes('harajuku')) return (
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="-16" y="-22" width="32" height="12" rx="3" stroke={i} strokeWidth="1.2"/>
        <text x="0" y="-13" fontSize="7" textAnchor="middle" stroke="none" fill={c2} fontFamily="sans-serif">竹下通り</text>
        <circle cx="0" cy="5" r="6" stroke={i} strokeWidth="1.1"/>
        <line x1="0" y1="11" x2="0" y2="20" stroke={i} strokeWidth="1"/>
        <line x1="-10" y1="15" x2="10" y2="15" stroke={i} strokeWidth="1"/>
        <path d="M-7 -1 Q0 -7 7 -1" stroke={c2} strokeWidth="0.9"/>
        <path d="M13 8 L16 16 L19 8 Z" stroke={c2} strokeWidth="0.9"/>
      </g>
    );
    // ── nightlife ───────────────────────────────────────────────────────────
    if (tl.includes('kabukicho') || tl.includes('golden gai')) return (
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="-15" y="-18" width="30" height="20" rx="3" stroke={i} strokeWidth="1.3"/>
        <rect x="-11" y="-14" width="22" height="12" rx="1" stroke={c2} strokeWidth="0.9"/>
        <line x1="-4" y1="-12" x2="-4" y2="-4" stroke={i} strokeWidth="0.9"/>
        <line x1="-8" y1="-8" x2="-0" y2="-8" stroke={i} strokeWidth="0.9"/>
        <path d="M4 -12 L8 -4 L12 -12" stroke={c2} strokeWidth="0.9"/>
        <line x1="16" y1="-14" x2="16" y2="-2" stroke={i} strokeWidth="0.9"/>
        <line x1="13" y1="-10" x2="19" y2="-6" stroke={i} strokeWidth="0.9"/>
        <rect x="-13" y="6" width="10" height="14" rx="1" stroke={i} strokeWidth="1"/>
        <rect x="3" y="8" width="10" height="12" rx="1" stroke={i} strokeWidth="1"/>
        <ellipse cx="-8" cy="21" rx="2.5" ry="1.5" stroke={i} strokeWidth="0.8"/>
        <ellipse cx="-3" cy="21" rx="2.5" ry="1.5" stroke={i} strokeWidth="0.8"/>
        <line x1="-8" y1="20" x2="-8" y2="26" stroke={i} strokeWidth="0.8"/>
        <line x1="-3" y1="20" x2="-3" y2="26" stroke={i} strokeWidth="0.8"/>
      </g>
    );
    if (tl.includes('yurakucho') || tl.includes('izakaya row')) return (
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M-18 0 Q0 -12 18 0" stroke={i} strokeWidth="1.2"/>
        <line x1="-18" y1="0" x2="-18" y2="12" stroke={i} strokeWidth="1"/>
        <line x1="18" y1="0" x2="18" y2="12" stroke={i} strokeWidth="1"/>
        <line x1="-18" y1="-7" x2="18" y2="-7" stroke={i} strokeWidth="0.8"/>
        <line x1="-18" y1="-11" x2="18" y2="-11" stroke={i} strokeWidth="0.8"/>
        <ellipse cx="-7" cy="-2" rx="3" ry="5" fill={c2} fillOpacity="0.25" stroke={c2} strokeWidth="0.9"/>
        <ellipse cx="7" cy="-2" rx="3" ry="5" fill={c2} fillOpacity="0.25" stroke={c2} strokeWidth="0.9"/>
        <line x1="-7" y1="-8" x2="-7" y2="-7" stroke={i} strokeWidth="0.8"/>
        <line x1="7" y1="-8" x2="7" y2="-7" stroke={i} strokeWidth="0.8"/>
        <rect x="-14" y="12" width="28" height="12" rx="1" stroke={i} strokeWidth="1.1"/>
        <line x1="-14" y1="17" x2="14" y2="17" stroke={i} strokeWidth="0.8"/>
        <line x1="-7" y1="2" x2="-7" y2="15" stroke={c2} strokeWidth="1.1"/>
        <circle cx="-7" cy="4" r="2" fill={c2} fillOpacity="0.4" stroke={c2} strokeWidth="0.7"/>
        <circle cx="-7" cy="9" r="2" fill={c2} fillOpacity="0.4" stroke={c2} strokeWidth="0.7"/>
        <line x1="5" y1="2" x2="5" y2="15" stroke={c2} strokeWidth="1.1"/>
        <circle cx="5" cy="4" r="2" fill={c2} fillOpacity="0.4" stroke={c2} strokeWidth="0.7"/>
        <circle cx="5" cy="9" r="2" fill={c2} fillOpacity="0.4" stroke={c2} strokeWidth="0.7"/>
      </g>
    );
    // ── Hakone / mountain ────────────────────────────────────────────────────
    if (tl.includes('romancecar') || (tl.includes('hakone') && tl.includes('train'))) return (
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M-20 10 L-10 -2 L4 4 L12 -12 L22 4" stroke={i} strokeWidth="1.1"/>
        <rect x="-14" y="4" width="28" height="10" rx="3" stroke={i} strokeWidth="1.2"/>
        <rect x="-11" y="6" width="6" height="6" rx="1" stroke={c2} strokeWidth="0.9"/>
        <rect x="-3" y="6" width="6" height="6" rx="1" stroke={c2} strokeWidth="0.9"/>
        <rect x="5" y="6" width="6" height="6" rx="1" stroke={c2} strokeWidth="0.9"/>
        <path d="M14 5 Q20 5 20 10 Q20 14 14 14" stroke={i} strokeWidth="1.2"/>
        <circle cx="-7" cy="14" r="3" stroke={i} strokeWidth="1"/>
        <circle cx="8" cy="14" r="3" stroke={i} strokeWidth="1"/>
      </g>
    );
    if (tl.includes('owakudani') || tl.includes('volcanic')) return (
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M-20 16 L-8 -4 L4 8 L12 -16 L24 6" stroke={i} strokeWidth="1.2"/>
        <path d="M-8 -4 Q-10 -14 -7 -22 Q-4 -28 -8 -30" stroke={i} strokeWidth="1.1"/>
        <path d="M4 8 Q2 -4 6 -14 Q10 -22 7 -28" stroke={c2} strokeWidth="1.1"/>
        <path d="M12 -16 Q12 -24 16 -30 Q20 -34 16 -36" stroke={i} strokeWidth="1"/>
        <ellipse cx="14" cy="20" rx="5" ry="6" stroke={i} strokeWidth="1.1"/>
        <path d="M9 21 Q14 18 19 21" stroke={i} strokeWidth="0.9"/>
      </g>
    );
    if (tl.includes('lake ashi') || tl.includes('ashinoko') || tl.includes('boat crossing')) return (
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M-6 -18 L0 -28 L6 -18" stroke={i} strokeWidth="1.2"/>
        <path d="M-14 -8 L0 -28 L14 -8" stroke={i} strokeWidth="1.1"/>
        <ellipse cx="0" cy="4" rx="22" ry="10" stroke={i} strokeWidth="1"/>
        <line x1="-18" y1="-16" x2="-18" y2="6" stroke={c2} strokeWidth="1.1"/>
        <line x1="-11" y1="-16" x2="-11" y2="6" stroke={c2} strokeWidth="1.1"/>
        <line x1="-21" y1="-13" x2="-8" y2="-13" stroke={c2} strokeWidth="1.1"/>
        <line x1="-20" y1="-9" x2="-9" y2="-9" stroke={c2} strokeWidth="0.9"/>
        <path d="M5 2 Q10 -2 20 0 Q22 6 5 6 Z" stroke={i} strokeWidth="1"/>
        <line x1="12" y1="-2" x2="12" y2="-8" stroke={i} strokeWidth="0.9"/>
        <path d="M12 -8 L19 -4 L12 -2 Z" fill={c2} fillOpacity="0.4" stroke={c2} strokeWidth="0.7"/>
      </g>
    );
    if (tl.includes('gora kadan') || (tl.includes('ryokan') && tl.includes('hakone'))) return (
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M-18 2 L0 -14 L18 2" stroke={i} strokeWidth="1.2"/>
        <rect x="-14" y="2" width="28" height="20" rx="1" stroke={i} strokeWidth="1.1"/>
        <line x1="-6" y1="2" x2="-6" y2="22" stroke={i} strokeWidth="0.9"/>
        <line x1="6" y1="2" x2="6" y2="22" stroke={i} strokeWidth="0.9"/>
        <line x1="-14" y1="12" x2="14" y2="12" stroke={i} strokeWidth="0.9"/>
        <rect x="2" y="-22" width="5" height="6" rx="1" stroke={c2} strokeWidth="0.9"/>
        <line x1="4.5" y1="-30" x2="4.5" y2="-22" stroke={c2} strokeWidth="0.8"/>
        <path d="M-4" y="-18" width="1" stroke={c2} strokeWidth="0.8"/>
        <ellipse cx="-18" cy="14" rx="2" ry="4" fill={c2} fillOpacity="0.2" stroke={c2} strokeWidth="0.8"/>
        <line x1="-22" y1="8" x2="-22" y2="18" stroke={i} strokeWidth="0.8"/>
        <rect x="-24" y="6" width="6" height="4" rx="0.5" stroke={i} strokeWidth="0.7"/>
      </g>
    );
    // ── Nara ────────────────────────────────────────────────────────────────
    if (tl.includes('nara') || tl.includes('todai-ji') || tl.includes('deer')) return (
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="-8" cy="8" rx="8" ry="6" stroke={i} strokeWidth="1.1"/>
        <line x1="-8" y1="2" x2="-9" y2="-8" stroke={i} strokeWidth="1"/>
        <circle cx="-9" cy="-11" r="4" stroke={i} strokeWidth="1.1"/>
        <path d="M-11 -14 L-14 -22 L-12 -18" stroke={i} strokeWidth="0.9"/>
        <path d="M-6 -14 L-3 -21 L-5 -18" stroke={i} strokeWidth="0.9"/>
        <line x1="-14" y1="12" x2="-15" y2="20" stroke={i} strokeWidth="0.9"/>
        <line x1="-6" y1="12" x2="-5" y2="20" stroke={i} strokeWidth="0.9"/>
        <rect x="4" y="-8" width="18" height="22" rx="1" stroke={i} strokeWidth="1.1"/>
        <path d="M2" y="-8" stroke={i} strokeWidth="1.2"/>
        <path d="M2 -8 L13 -18 L24 -8" stroke={i} strokeWidth="1.2"/>
        <line x1="4" y1="4" x2="22" y2="4" stroke={i} strokeWidth="0.8"/>
        <ellipse cx="13" cy="0" rx="4" ry="5" stroke={c2} strokeWidth="0.9"/>
      </g>
    );
    // ── Osaka extras ─────────────────────────────────────────────────────────
    if (tl.includes('hozenji') || tl.includes('yokocho')) return (
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="-4" y="-2" width="8" height="18" rx="1" stroke={i} strokeWidth="1.1"/>
        <ellipse cx="0" cy="-5" rx="6" ry="7" stroke={i} strokeWidth="1.2"/>
        <path d="M-5" y="-2" stroke={c2} strokeWidth="0.9"/>
        <path d="M-5 -2 Q-8 2 -7 6 Q-5 10 -3 8" stroke={c2} strokeWidth="0.9"/>
        <path d="M5 -2 Q8 2 7 6 Q5 10 3 8" stroke={c2} strokeWidth="0.9"/>
        <path d="M-4 6 Q-7 10 -6 14" stroke={c2} strokeWidth="0.8"/>
        <path d="M4 6 Q7 10 6 14" stroke={c2} strokeWidth="0.8"/>
        <line x1="-16" y1="-22" x2="-16" y2="22" stroke={i} strokeWidth="1"/>
        <line x1="16" y1="-22" x2="16" y2="22" stroke={i} strokeWidth="1"/>
        <ellipse cx="0" cy="18" rx="3" ry="5" fill={c2} fillOpacity="0.2" stroke={c2} strokeWidth="0.8"/>
      </g>
    );
    if (tl.includes('golf club') || tl.includes('golf') || tl.includes('kobe golf')) return (
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M-22 8 Q-8 2 4 6 Q14 10 22 4" stroke={i} strokeWidth="1.1"/>
        <path d="M-22 14 Q0 8 22 12" stroke={i} strokeWidth="0.8"/>
        <line x1="8" y1="-14" x2="8" y2="8" stroke={i} strokeWidth="1"/>
        <path d="M8 -14 L18 -8 L8 -4 Z" fill={c2} fillOpacity="0.4" stroke={c2} strokeWidth="0.8"/>
        <line x1="-12" y1="-18" x2="6" y2="8" stroke={i} strokeWidth="1.2"/>
        <ellipse cx="7" cy="9" rx="4" ry="2.5" stroke={i} strokeWidth="1" transform="rotate(-25 7 9)"/>
        <path d="M-24" y="-8" width="1" stroke={i} strokeWidth="0.8"/>
        <path d="M-24 -4 Q-10 -8 6 -5 Q16 -2 24 -6" stroke={i} strokeWidth="0.8"/>
      </g>
    );
    // ── Kyoto extras ─────────────────────────────────────────────────────────
    if (tl.includes('daitoku-ji') || tl.includes('daitokuji') || tl.includes('sub-temple')) return (
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="-16" y="4" width="32" height="18" rx="1" stroke={i} strokeWidth="1.1"/>
        <path d="M-16 4 Q-12 -6 0 -8 Q12 -6 16 4" stroke={i} strokeWidth="0.9"/>
        <path d="M-18 4 Q0 -12 18 4" stroke={i} strokeWidth="1.2"/>
        <path d="M-20 16 Q0 10 20 16 Q20 22 -20 22" stroke={c2} strokeWidth="0.9"/>
        <path d="M-18 20 Q-10 17 0 20 Q10 17 18 20" stroke={c2} strokeWidth="0.9"/>
        <path d="M-18 24 Q-12 21 0 24 Q12 21 18 24" stroke={c2} strokeWidth="0.9"/>
        <ellipse cx="-6" cy="16" rx="3" ry="2" stroke={c2} strokeWidth="0.8"/>
        <ellipse cx="8" cy="12" rx="4" ry="2.5" stroke={c2} strokeWidth="0.8"/>
        <rect x="-6" y="-22" width="12" height="16" rx="1" stroke={i} strokeWidth="1"/>
        <line x1="0" y1="-22" x2="0" y2="-6" stroke={i} strokeWidth="0.8"/>
      </g>
    );
    if (tl.includes('nijo castle') || tl.includes('nijo')) return (
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="-16" y="-4" width="32" height="24" rx="1" stroke={i} strokeWidth="1.1"/>
        <path d="M-18" y="-4" stroke={i} strokeWidth="1.2"/>
        <path d="M-18 -4 L0 -18 L18 -4" stroke={i} strokeWidth="1.2"/>
        <path d="M-12 4 L0 -6 L12 4" stroke={i} strokeWidth="0.9"/>
        <rect x="-8" y="-2" width="5" height="6" rx="1" stroke={c2} strokeWidth="0.9"/>
        <rect x="3" y="-2" width="5" height="6" rx="1" stroke={c2} strokeWidth="0.9"/>
        <rect x="-8" y="8" width="5" height="6" rx="1" stroke={c2} strokeWidth="0.9"/>
        <rect x="3" y="8" width="5" height="6" rx="1" stroke={c2} strokeWidth="0.9"/>
        <path d="M-20 22 Q0 18 20 22" stroke={i} strokeWidth="0.9"/>
        <path d="M-22 26 Q0 22 22 26" stroke={i} strokeWidth="0.8"/>
        <path d="M-16 16 Q-8 14 0 16 Q8 14 16 16" stroke={c2} strokeWidth="0.7"/>
      </g>
    );
    if (tl.includes('shibuya sky') || tl.includes('shibuya scramble') || tl.includes('shibuya')) return (
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="-5" y="-28" width="10" height="40" rx="1.5" stroke={i} strokeWidth="1.1"/>
        <rect x="-10" y="-32" width="20" height="8" rx="2" stroke={i} strokeWidth="1.2"/>
        <line x1="-22" y1="18" x2="22" y2="18" stroke={i} strokeWidth="1.2"/>
        <line x1="-22" y1="22" x2="22" y2="22" stroke={i} strokeWidth="0.9"/>
        <line x1="-18" y1="26" x2="18" y2="26" stroke={i} strokeWidth="0.8"/>
        <circle cx="-12" cy="20" r="2" fill={c2} fillOpacity="0.5" stroke={c2} strokeWidth="0.7"/>
        <circle cx="2" cy="24" r="2" fill={c2} fillOpacity="0.5" stroke={c2} strokeWidth="0.7"/>
        <circle cx="14" cy="20" r="2" fill={c2} fillOpacity="0.5" stroke={c2} strokeWidth="0.7"/>
        <path d="M-24 -8 L-16 -16 L-14 -4" stroke={c2} strokeWidth="0.7"/>
        <path d="M16 -4 L18 -14 L24 -6" stroke={c2} strokeWidth="0.7"/>
      </g>
    );

    // ── Bourdain food ────────────────────────────────────────────────────────
    if (tl.includes('soba') || tl.includes('yabu')) return (
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="0" cy="4" rx="18" ry="12" stroke={i} strokeWidth="1.2"/>
        <ellipse cx="0" cy="2" rx="14" ry="9" stroke={i} strokeWidth="0.8"/>
        <path d="M-10 -2 Q-6 2 -2 -1 Q2 3 6 0 Q10 4 13 1" stroke={c2} strokeWidth="1.1"/>
        <path d="M-12 2 Q-7 6 -3 3 Q1 7 5 4 Q9 8 12 5" stroke={c2} strokeWidth="1"/>
        <path d="M-9 6 Q-4 10 0 7 Q4 11 8 8" stroke={c2} strokeWidth="0.9"/>
        <line x1="-4" y1="-18" x2="-2" y2="-10" stroke={i} strokeWidth="1.1"/>
        <line x1="4" y1="-18" x2="2" y2="-10" stroke={i} strokeWidth="1.1"/>
      </g>
    );
    if (tl.includes('ramen') || (tl.includes('midnight') && tl.includes('ramen'))) return (
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="0" cy="6" rx="18" ry="12" stroke={i} strokeWidth="1.2"/>
        <ellipse cx="0" cy="4" rx="14" ry="9" stroke={i} strokeWidth="0.8"/>
        <path d="M-12 0 Q-8 4 -4 1 Q0 5 4 2 Q8 6 12 3" stroke={c2} strokeWidth="1.1"/>
        <path d="M-10 4 Q-6 8 -2 5 Q2 9 6 6 Q10 10 13 7" stroke={c2} strokeWidth="1"/>
        <ellipse cx="6" cy="-2" rx="4" ry="5" stroke={i} strokeWidth="0.9"/>
        <path d="M-8 -8 Q-6 -14 -4 -8" stroke={c2} strokeWidth="0.8"/>
        <path d="M0 -6 Q2 -14 4 -6" stroke={c2} strokeWidth="0.8"/>
        <path d="M6 -8 Q8 -16 10 -8" stroke={c2} strokeWidth="0.8"/>
      </g>
    );
    if (tl.includes('gyoza')) return (
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M-16 4 Q-14 -6 -8 -8 Q0 -10 8 -8 Q14 -6 16 4 Q14 10 0 12 Q-14 10 -16 4Z" stroke={i} strokeWidth="1.2"/>
        <path d="M-16 4 Q0 6 16 4" stroke={i} strokeWidth="0.8"/>
        <path d="M-10 -4 Q-8 0 -10 4" stroke={i} strokeWidth="0.8"/>
        <path d="M-4 -6 Q-2 -1 -4 4" stroke={i} strokeWidth="0.8"/>
        <path d="M2 -6 Q4 -1 2 4" stroke={i} strokeWidth="0.8"/>
        <path d="M8 -4 Q10 0 8 4" stroke={i} strokeWidth="0.8"/>
        <ellipse cx="-10" cy="12" rx="3" ry="1.5" fill={c2} fillOpacity="0.2" stroke={c2} strokeWidth="0.7"/>
        <ellipse cx="0" cy="14" rx="3" ry="1.5" fill={c2} fillOpacity="0.2" stroke={c2} strokeWidth="0.7"/>
        <ellipse cx="10" cy="12" rx="3" ry="1.5" fill={c2} fillOpacity="0.2" stroke={c2} strokeWidth="0.7"/>
      </g>
    );
    if (tl.includes('takoyaki') || tl.includes('wanaka')) return (
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="-12" cy="4" r="6" stroke={i} strokeWidth="1.2"/>
        <circle cx="0" cy="4" r="6" stroke={i} strokeWidth="1.2"/>
        <circle cx="12" cy="4" r="6" stroke={i} strokeWidth="1.2"/>
        <circle cx="-12" cy="4" r="2" fill={c2} fillOpacity="0.4" stroke={c2} strokeWidth="0.7"/>
        <circle cx="0" cy="4" r="2" fill={c2} fillOpacity="0.4" stroke={c2} strokeWidth="0.7"/>
        <circle cx="12" cy="4" r="2" fill={c2} fillOpacity="0.4" stroke={c2} strokeWidth="0.7"/>
        <path d="M-16 -4 Q0 -8 16 -4" stroke={c2} strokeWidth="0.9"/>
        <path d="M-14 12 Q0 16 14 12" stroke={c2} strokeWidth="0.9"/>
        <path d="M-10 -14 Q-8 -20 -6 -14" stroke={i} strokeWidth="0.8"/>
        <path d="M2 -16 Q4 -22 6 -16" stroke={i} strokeWidth="0.8"/>
      </g>
    );

  };

  const VineDecor = () => {
    return <>
      {acts.map((act, si) => {
        const vy = si * sH + sH * 0.82;
        const side = si % 2 === 0 ? 1 : -1;
        const vxHere = (region === 'tokyo')
          ? (si % 2 === 0 ? 58 + (si % 4) * 8 : 72 + (si % 3) * 7)
          : 68 + Math.sin((si * 3 + 4) / (n * 6) * n * Math.PI * 2 + s * 0.6) * 16;
        const dx = vxHere + side * 30;
        const t = act.type || 'nature';
        const tokyoColors: Record<string, string[]> = {
          transit:    ['#e8c040', '#4a80c8', '#c8c8d0'],
          hotel:      ['#e89030', '#c0c8d8', '#f8e8a0'],
          restaurant: ['#e8603a', '#f8d860', '#c04828'],
          museum:     ['#40c8d8', '#e840b0', '#e8b030'],
          nature:     ['#60b848', '#a8d888', '#f8e8b0'],
          shop:       ['#e84080', '#40c8d8', '#f8e040'],
        };
        const izuColors: Record<string, string[]> = {
          transit:    ['#4080b8', '#a8d0e8', '#f8f0e0'],
          hotel:      ['#e8a848', '#c0d8e8', '#f8e8d0'],
          restaurant: ['#c83828', '#f0c060', '#8ab878'],
          nature:     ['#e8a0b0', '#60a848', '#a8d8c0'],
          museum:     ['#c83828', '#b0a880', '#e8d8b0'],
          shop:       ['#c84038', '#f8d060', '#60a090'],
        };
        const hakoneColors: Record<string, string[]> = {
          transit:    ['#b0c8e0', '#f8f8f8', '#6888a8'],
          hotel:      ['#f8f8ff', '#5878a0', '#e8c080'],
          restaurant: ['#f8f8ff', '#e8a848', '#5878a0'],
          nature:     ['#e87030', '#f8c040', '#b0c8e0'],
          museum:     ['#88a0b8', '#c8d8e8', '#e8b860'],
          shop:       ['#5878a0', '#e8d8b0', '#c0d0e0'],
        };
        const biwaColors: Record<string, string[]> = {
          transit:    ['#388888', '#a0d8d8', '#f0f8f8'],
          hotel:      ['#388888', '#c8e8e8', '#f0e8c0'],
          restaurant: ['#388888', '#e8c060', '#f8f0e0'],
          nature:     ['#388888', '#a8d8c0', '#f8f0e0'],
          museum:     ['#388888', '#b0a880', '#c8e8e8'],
          shop:       ['#388888', '#f8d060', '#a0d0d0'],
        };
        const osakaColors: Record<string, string[]> = {
          transit:    ['#4060a0', '#a0b8d8', '#f8e0a0'],
          hotel:      ['#b84428', '#f8e0a0', '#4060a0'],
          restaurant: ['#e87030', '#f8c840', '#c83828'],
          museum:     ['#808080', '#b84428', '#e8e0d0'],
          shop:       ['#e8a030', '#c83828', '#f8e8a0'],
          nature:     ['#c83828', '#e8c040', '#4060a0'],
        };
        const kyotoColors: Record<string, string[]> = {
          transit:    ['#c83020', '#f8e8d0', '#60a040'],
          hotel:      ['#e8a030', '#f8e8d0', '#7a4a88'],
          restaurant: ['#50a040', '#c83020', '#f8e8c0'],
          museum:     ['#c83020', '#708040', '#e8d0b0'],
          nature:     ['#e8a0b0', '#c83020', '#60a040'],
          shop:       ['#7a4a88', '#c83020', '#f8d060'],
        };
        const regionPalettes: Record<string, Record<string, string[]>> = {
          'tokyo': tokyoColors, 'izu': izuColors, 'hakone': hakoneColors,
          'lake-biwa': biwaColors, 'osaka': osakaColors, 'kyoto': kyotoColors,
        };
        const pal = (regionPalettes[region] ?? tokyoColors)[t] ?? ['#e8a030', '#60a848', '#4a6eb8'];
        const [c1, c2, c3] = pal;
        return (
          <g key={si} transform={`translate(${dx.toFixed(1)},${vy.toFixed(1)})`}>
            {getTitleDecor(act.title, c1, c2, c3)}
          </g>
        );
      })}
    </>;
  };

  // ── Vine decorative overlays per region ───────────────────────────────────
  const vineStroke1 = region === 'tokyo' ? accent : faint;
  const vineW1 = region === 'tokyo' ? 1.4 : 1.6;
  const vineW2 = 0.6;
  const vineDash = region === 'tokyo' ? '12,4,6,4' : (region === 'kyoto' ? '20,10,5,10' : '30,8,12,8');

  return (
    <svg
      viewBox={`0 0 140 ${H}`}
      style={{ width: '100%', height: '100%', display: 'block' }}
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Vine / path */}
      <path d={vinePath} stroke={vineStroke1} strokeWidth={vineW1} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={vinePath} stroke={ink} strokeWidth={vineW2} fill="none" strokeLinecap="round" strokeDasharray={vineDash} />

      {/* Region-specific vine decoration */}
      <VineDecor />

    </svg>
  );
};





const ActivityItem: React.FC<{ activity: any; index: number; transit?: { icon: string; mode: string; time: string } }> = ({ activity, index, transit }) => {
  const { activeDay, editMode, userEdits, updateActivityEdit, updateNoteEdit, selectedActivity, selectActivity, hoverActivity, doneActivities, toggleDone } = useStore();
  const dayHaikus = haikus[activeDay] || [];
  const savedKey = `${activeDay}_${index}`;
  const isSelected = selectedActivity?.key === savedKey;
  const editedTitle = userEdits.activities[savedKey]?.title;
  const editedDesc = userEdits.activities[savedKey]?.description;
  const displayTitle = editedTitle !== undefined ? editedTitle : activity.title;
  const isOptional = activity.optional === true;
  const isDone = doneActivities[savedKey] === true;
  const displayHaiku = editedDesc !== undefined ? editedDesc : (dayHaikus[index] || "");
  const editedNote = userEdits.activities[savedKey]?.note;
  const displayNote = editedNote !== undefined ? editedNote : (activity.desc || "");

  const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${activity.lat},${activity.lng}`;

  const typeColor = TYPE_COLORS[activity.type] || 'var(--rc)';
  return (
    <>
      {transit && (
        <div className="transit-divider">
          <div className="transit-divider-line" />
          <div className="transit-divider-body">
            <span className="transit-divider-icon">{transit.icon}</span>
            <span className="transit-divider-mode">{transit.mode}</span>
            <span className="transit-divider-time">{transit.time}</span>
          </div>
          <div className="transit-divider-line" />
        </div>
      )}
      <div
      className="timeline-item"
      style={{
        cursor: editMode ? 'default' : 'pointer',
        borderLeft: `3px solid ${TYPE_COLORS[activity.type] || 'var(--rc)'}${isSelected ? '' : '90'}`,
        background: isSelected ? `${TYPE_BG[activity.type] || 'rgba(0,0,0,0.04)'}` : TYPE_BG[activity.type] || 'transparent',
        opacity: isDone ? 0.48 : 1,
        transition: 'border-left 0.2s, background 0.2s, opacity 0.3s, transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.18s ease',
        paddingLeft: '12px',
      }}
      onMouseEnter={() => { if (!editMode) hoverActivity(savedKey); }}
      onMouseLeave={() => { if (!editMode) hoverActivity(null); }}
      onClick={() => {
          if (!editMode) {
            selectActivity(savedKey, activity.lat, activity.lng);
            if (window.innerWidth <= 900) {
              setTimeout(() => {
                document.querySelector('.map-pane-wrapper')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 150);
            }
          }
        }}
    >
      <div className="timeline-item-main">
      <span className="timeline-bullet" style={{
        background: TYPE_COLORS[activity.type] || 'var(--rc)',
        borderColor: TYPE_COLORS[activity.type] || 'var(--rc)',
        color: '#fff',
        fontSize: '10px',
      }}>
        {({'hotel':'🏨','restaurant':'🍜','museum':'🏛','shop':'🛍','transit':'🚄','nature':'🌿'} as Record<string,string>)[activity.type] ?? '●'}
      </span>
      <span className="timeline-time">{activity.time}</span>
      {activity.duration && <span className="activity-duration-badge">{activity.duration}</span>}
      <span className="activity-cat" style={{ color: TYPE_COLORS[activity.type] || 'var(--rc)', background: `${TYPE_BG[activity.type] || 'rgba(0,0,0,0.04)'}`, padding: '2px 7px', borderRadius: '3px', opacity: 1 }}>{({'hotel':'Hotel','restaurant':'Dining','museum':'Culture','shop':'Shopping','transit':'Transit','nature':'Nature'} as Record<string,string>)[activity.type] ?? activity.type}</span>
      <h3
        contentEditable={editMode}
        suppressContentEditableWarning
        onBlur={(e) => updateActivityEdit(activeDay, index, 'title', e.currentTarget.innerText)}
        className="timeline-title focus:outline-none"
        style={{ color: isSelected ? 'var(--rc)' : undefined, textDecoration: isDone ? 'line-through' : 'none' }}
      >
        {displayTitle}
      </h3>
{isOptional && <span className="optional-badge">if energy allows</span>}
      {isSelected && (
      <div className="timeline-item-body">
      <p
        contentEditable={editMode}
        suppressContentEditableWarning
        onBlur={(e) => updateNoteEdit(activeDay, index, e.currentTarget.innerText)}
        className="timeline-note focus:outline-none"
      >
        {displayNote}
      </p>
      <p
        contentEditable={editMode}
        suppressContentEditableWarning
        onBlur={(e) => updateActivityEdit(activeDay, index, 'description', e.currentTarget.innerText)}
        className="timeline-desc focus:outline-none"
      >
        {displayHaiku}
      </p>
      {editMode && (
        <button
          className="haiku-regen-btn"
          title="Regenerate haiku"
          onClick={(e) => {
            e.stopPropagation();
            updateActivityEdit(activeDay, index, 'description', _genHaiku(displayTitle + String(activeDay) + String(index)));
          }}
        >🎋 new haiku</button>
      )}
      {!editMode && (
        <>
        <a href={navUrl} target="_blank" rel="noopener noreferrer" className="navigate-btn"
          onClick={e => e.stopPropagation()}>
          ↗ Navigate
        </a>
        {activityUrls[activity.title] && (
          <a
            href={activityUrls[activity.title]}
            target="_blank"
            rel="noopener noreferrer"
            className="navigate-btn website-btn"
            onClick={e => e.stopPropagation()}
          >
            🌐 Website
          </a>
        )}
        <button
          className={`done-stamp-btn${isDone ? ' done-stamp-btn--done' : ''}`}
          onClick={(e) => { e.stopPropagation(); toggleDone(savedKey); }}
        >
          {isDone ? '✓ Done' : '◯ Mark done'}
        </button>
        </>
      )}
      </div>
      )}
      </div>

    </div>
  </>
  );
};

const MealsSection: React.FC = () => {
  const { activeDay, editMode, userEdits, updateMealEdit } = useStore();
  const dayMeals = meals[activeDay];
  const mealTypes: Array<{ key: 'breakfast' | 'lunch' | 'dinner'; label: string; icon: string }> = [
    { key: 'breakfast', label: 'Breakfast', icon: '☀' }, { key: 'lunch', label: 'Lunch', icon: '◑' }, { key: 'dinner', label: 'Dinner', icon: '☽' }
  ];
  return (
    <div className="meals-container">
      <h4 className="meals-header">Today's Table</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {mealTypes.map(({ key, label, icon }) => {
          const defaultMeal = dayMeals?.[key];
          const editedText = userEdits.meals[activeDay]?.[key];
          const displayText = editedText !== undefined ? editedText : (defaultMeal?.text || "");
          return (
            <div key={key} className={`meal-row ${defaultMeal?.booked ? 'booked' : ''}`}>
              <div className="meal-label-col">
                <span className="text-base">{icon}</span>
                <span className="meal-type">{label}</span>
              </div>
              <p contentEditable={editMode} suppressContentEditableWarning onBlur={(e) => updateMealEdit(activeDay, key, e.currentTarget.innerText)} className={`meal-text focus:outline-none ${editMode ? 'border-b border-dashed border-[#c87e18] bg-white bg-opacity-40 px-1' : ''}`}>{displayText}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Document uploader (per day, base64 in localStorage)
const DocUploader: React.FC<{ dayId: number }> = ({ dayId }) => {
  const { documents, addDocument, removeDocument } = useStore();
  const docs = documents[dayId] || [];
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        addDocument(dayId, { name: file.name, b64: reader.result as string, mime: file.type });
      };
      reader.readAsDataURL(file);
    });
  };

  const openDoc = (doc: { b64: string; mime: string; name: string }) => {
    const win = window.open();
    if (!win) return;
    if (doc.mime === 'application/pdf') {
      win.document.write(`<iframe src="${doc.b64}" style="width:100%;height:100vh;border:none"/>`);
    } else {
      win.document.write(`<img src="${doc.b64}" style="max-width:100%"/>`);
    }
  };

  return (
    <div style={{ marginTop: '16px' }}>
      <h5 style={{ fontFamily: 'var(--font-display)', fontSize: '0.68rem', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--rc)', marginBottom: '10px' }}>
        📎 Documents & Confirmations
      </h5>
      <input ref={inputRef} type="file" accept=".pdf,.png,.jpg,.jpeg,.webp" multiple style={{ display: 'none' }}
        onChange={e => handleFiles(e.target.files)} />
      <button className="doc-upload-btn" onClick={() => inputRef.current?.click()}>
        + Upload PDF or image
      </button>
      {docs.length > 0 && (
        <div className="doc-list">
          {docs.map((doc, idx) => (
            <div key={idx} className="doc-item">
              <span className="doc-item-name">📄 {doc.name}</span>
              <div className="doc-item-actions">
                <button className="doc-item-btn doc-item-view" onClick={() => openDoc(doc)}>View</button>
                <button className="doc-item-btn doc-item-del" onClick={() => removeDocument(dayId, idx)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Full-day card modal (slide-up drawer)
// ── Day schedule timeline ─────────────────────────────────────────────────
function parseTimeHours(str: string): number {
  if (!str) return 12;
  const lower = str.toLowerCase();
  if (lower.includes('afternoon') || lower.includes('transit baseline')) return 13.5;
  if (lower.includes('morning') || lower.includes('home base')) return 8;
  if (lower.includes('evening') || lower.includes('return')) return 21;
  const m = str.match(/(\d{1,2}):(\d{2})\s*(am|pm)/i);
  if (!m) return 12;
  let h = parseInt(m[1]);
  const min = parseInt(m[2]);
  const period = m[3].toUpperCase();
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return h + min / 60;
}

const TYPE_COLORS: Record<string, string> = {
  hotel:      '#b8681a',
  restaurant:  '#b83428',
  museum:      '#3858a8',
  shop:        '#2a7868',
  transit:     '#5878a8',
  nature:      '#3a7838',
};
const TYPE_BG: Record<string,string> = {
  hotel:      'rgba(184,104,26,0.08)',
  restaurant:  'rgba(184,52,40,0.07)',
  museum:      'rgba(56,88,168,0.07)',
  shop:        'rgba(42,120,104,0.07)',
  transit:     'rgba(88,120,168,0.06)',
  nature:      'rgba(58,120,56,0.07)',
};

const ReservationsPanel: React.FC = () => {
  const { activeDay, reservations, updateReservation } = useStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const res = reservations[activeDay] || {};

  const handleField = (field: string, val: string) =>
    updateReservation(activeDay, { [field]: val });

  const addBooking = () =>
    updateReservation(activeDay, {
      restaurantBookings: [...(res.restaurantBookings || []), { name: '', time: '', notes: '' }]
    });

  const updateBooking = (idx: number, key: string, val: string) => {
    const list = [...(res.restaurantBookings || [])];
    (list[idx] as any)[key] = val;
    updateReservation(activeDay, { restaurantBookings: list });
  };

  const removeBooking = (idx: number) =>
    updateReservation(activeDay, {
      restaurantBookings: (res.restaurantBookings || []).filter((_, i) => i !== idx)
    });

  const fieldStyle = { backgroundColor: '#f2e8d0', border: '1px solid #cdbf9c', padding: '7px 10px', borderRadius: '4px', outline: 'none', fontFamily: 'var(--font-body)', fontSize: '0.88rem', width: '100%' };

  return (
    <div style={{ marginTop: '32px', border: '1px solid var(--paper-fold)', borderRadius: '6px', background: 'rgba(230,216,190,0.3)' }}>
      <button
        onClick={() => setIsOpen(o => !o)}
        style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'var(--font-display)', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--ink-fade)', border: 'none', background: 'transparent', cursor: 'pointer' }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen style={{ width: '15px', height: '15px' }} /> Bookings & Documents
        </span>
        {isOpen ? <ChevronUp style={{ width: '15px', height: '15px' }} /> : <ChevronDown style={{ width: '15px', height: '15px' }} />}
      </button>

      {isOpen && (
        <div style={{ padding: '16px', borderTop: '1px solid var(--paper-fold)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.68rem', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--rc)', marginBottom: '10px' }}>🏨 Hotel / Ryokan</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <input placeholder="Confirmation #" value={res.hotelConfirmation || ''} onChange={e => handleField('hotelConfirmation', e.target.value)} style={fieldStyle} />
              <input placeholder="Check-in time"  value={res.hotelCheckIn    || ''} onChange={e => handleField('hotelCheckIn',    e.target.value)} style={fieldStyle} />
              <input placeholder="Address"        value={res.hotelAddress    || ''} onChange={e => handleField('hotelAddress',    e.target.value)} style={{...fieldStyle, gridColumn:'1/-1'}} />
              <input placeholder="Phone"          value={res.hotelPhone      || ''} onChange={e => handleField('hotelPhone',      e.target.value)} style={fieldStyle} />
              <input placeholder="Transport ref"  value={res.transportRef    || ''} onChange={e => handleField('transportRef',    e.target.value)} style={fieldStyle} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.68rem', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--rc)' }}>🍽 Restaurant Bookings</p>
              <button onClick={addBooking} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--rc)', fontFamily: 'var(--font-display)' }}>
                <Plus style={{ width: '13px', height: '13px' }} /> Add
              </button>
            </div>
            {(res.restaurantBookings || []).map((b, i) => (
              <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '6px', alignItems: 'center' }}>
                <input placeholder="Name" value={b.name}  onChange={e => updateBooking(i,'name', e.target.value)} style={{...fieldStyle, width:'35%'}} />
                <input placeholder="Time" value={b.time}  onChange={e => updateBooking(i,'time', e.target.value)} style={{...fieldStyle, width:'20%'}} />
                <input placeholder="Notes"value={b.notes} onChange={e => updateBooking(i,'notes',e.target.value)} style={{...fieldStyle, flex:1}} />
                <button onClick={() => removeBooking(i)} style={{ border:'none', background:'none', cursor:'pointer', color:'var(--ghibli-red)', padding:'4px', flexShrink:0 }}>
                  <Trash style={{ width:'14px', height:'14px' }} />
                </button>
              </div>
            ))}
          </div>

          <DocUploader dayId={activeDay} />
        </div>
      )}
    </div>
  );
};

const DayScheduleTimeline: React.FC<{ day: number; color: string; compact?: boolean }> = ({ day, color, compact }) => {
  const acts = activities[day] || [];
  const hotel = hotelAnchors[day];

  type Stop = { title: string; type: string; h: number };
  const stops: Stop[] = [];
  if (hotel) stops.push({ title: hotel.name, type: 'hotel', h: 8 });
  acts.forEach(a => stops.push({ title: a.title, type: a.type, h: parseTimeHours(a.time) }));
  if (hotel?.loop) stops.push({ title: hotel.name, type: 'hotel', h: 22 });
  stops.sort((a, b) => a.h - b.h);

  const DAY_START = 7, DAY_END = 23, SPAN = DAY_END - DAY_START;
  const pct = (h: number) => Math.min(100, Math.max(0, ((h - DAY_START) / SPAN) * 100));

  // Pace metric: based on experience count + time spread, excluding pure transit/hotel
  const experienceStops = stops.filter(s => s.type !== 'hotel' && s.type !== 'transit');
  const transitStops    = stops.filter(s => s.type === 'transit');
  const expCount = experienceStops.length;
  const expHours = experienceStops.map(s => s.h).sort((a, b) => a - b);
  const gaps = expHours.slice(0, -1).map((h, i) => expHours[i + 1] - h);
  const maxGap = gaps.length > 0 ? Math.max(...gaps) : 0;
  const tightGaps = gaps.filter(g => g <= 1.5).length;
  const timeSpan = expHours.length > 1 ? expHours[expHours.length - 1] - expHours[0] : 0;
  const hasMajorTransit = transitStops.some(s => s.title.includes('Shinkansen') || s.title.includes('Haruka') || s.title.includes('Express'));
  const hasLongBreak = maxGap >= 6;
  const pace = hasLongBreak
    ? (expCount >= 5 ? 'active' : 'relaxed')
    : (expCount >= 5 || (expCount >= 4 && tightGaps >= 2) || timeSpan >= 12)
    ? 'packed'
    : (expCount >= 3 || timeSpan >= 9 || (expCount >= 2 && hasMajorTransit))
    ? 'active'
    : 'relaxed';
  const paceLabel = { packed: '⚡ Packed', active: '◈ Active', relaxed: '〜 Leisurely' }[pace];
  const paceColor = { packed: '#b84428', active: '#c87e18', relaxed: '#4a7848' }[pace];

  const axisHours = compact ? [8, 12, 17, 21] : [7, 9, 12, 15, 18, 21, 23];
  const fmtH = (h: number) => h === 12 ? '12pm' : h < 12 ? `${h}am` : `${h - 12}pm`;

  const trackH = compact ? 36 : 52;
  const dotR = compact ? 7 : 9;
  const labelOffset = compact ? 16 : 22;

  return (
    <div style={{ userSelect: 'none' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: compact ? '8px' : '12px' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.65rem', letterSpacing: '2.5px', textTransform: 'uppercase', color, opacity: 0.8 }}>
          Day at a Glance
        </span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: compact ? '0.68rem' : '0.75rem', fontWeight: 700, color: paceColor }}>
          {paceLabel}
        </span>
      </div>

      {/* Timeline track */}
      <div style={{ position: 'relative', height: `${trackH}px`, marginBottom: '18px' }}>
        {/* Base track */}
        <div style={{
          position: 'absolute', left: 0, right: 0,
          top: `${trackH / 2 - 2}px`, height: '4px',
          background: 'var(--paper-fold)', borderRadius: '2px',
        }}/>

        {/* Gap fills — darker = tighter schedule */}
        {stops.slice(0, -1).map((s, i) => {
          const x1 = pct(s.h), x2 = pct(stops[i + 1].h);
          const gap = stops[i + 1].h - s.h;
          const opacity = gap <= 1.5 ? 0.55 : gap <= 3 ? 0.28 : 0.1;
          return (
            <div key={i} style={{
              position: 'absolute',
              left: `${x1}%`, width: `${Math.max(0, x2 - x1)}%`,
              top: `${trackH / 2 - 4}px`, height: '8px',
              background: color, opacity, borderRadius: '2px',
              transition: 'opacity 0.3s',
            }}/>
          );
        })}

        {/* Activity markers */}
        {stops.map((s, i) => {
          const x = pct(s.h);
          const tc = TYPE_COLORS[s.type] || color;
          const above = i % 2 === 0;
          const shortTitle = s.title.split(/[\s,·]/)[0];
          return (
            <div key={i} style={{ position: 'absolute', left: `${x}%`, transform: 'translateX(-50%)' }}>
              {/* Dot */}
              <div style={{
                width: `${dotR * 2}px`, height: `${dotR * 2}px`,
                borderRadius: '50%', background: tc,
                border: '2.5px solid var(--paper)',
                position: 'absolute',
                top: `${trackH / 2 - dotR}px`,
                left: `-${dotR}px`,
                boxShadow: '0 1px 5px rgba(0,0,0,0.22)',
              }}/>
              {/* Label */}
              {!compact && (
                <div style={{
                  position: 'absolute',
                  top: above ? `${trackH / 2 - dotR - labelOffset}px` : `${trackH / 2 + dotR + 4}px`,
                  left: '-28px', width: '56px',
                  textAlign: 'center',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.6rem', fontWeight: 600,
                  color: tc, lineHeight: 1.2,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {shortTitle}
                </div>
              )}
              {/* Tick */}
              <div style={{
                position: 'absolute',
                left: '-1px', width: '2px',
                top: above
                  ? `${trackH / 2 - dotR - 4}px`
                  : `${trackH / 2 + dotR}px`,
                height: '4px',
                background: tc, opacity: 0.5,
              }}/>
            </div>
          );
        })}
      </div>

      {/* Hour axis */}
      <div style={{ position: 'relative', height: '14px' }}>
        {axisHours.map(h => (
          <span key={h} style={{
            position: 'absolute',
            left: `${pct(h)}%`, transform: 'translateX(-50%)',
            fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
            color: 'var(--ink-light)', opacity: 0.6,
          }}>
            {fmtH(h)}
          </span>
        ))}
      </div>
    </div>
  );
};

// ── Inline Phrasebook ────────────────────────────────────────────────────────

const PhrasebookInline: React.FC = () => {
  const [openCat, setOpenCat] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState<string | null>(null);

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="pbi-wrap">
      <div className="pbi-tabs">
        {_phrases.map(({ cat }) => (
          <button
            key={cat}
            className={`pbi-tab ${openCat === cat ? 'active' : ''}`}
            onClick={() => setOpenCat(openCat === cat ? null : cat)}
          >{cat}</button>
        ))}
      </div>
      {openCat && (() => {
        const items = _phrases.find(p => p.cat === openCat)?.items || [];
        return (
          <div className="pbi-grid">
            {items.map((p, i) => {
              const id = `pbi_${openCat}_${i}`;
              return (
                <div key={id} className="pbi-card">
                  <span className="pbi-jp">{p.jp}</span>
                  <span className="pbi-rom">{p.rom}</span>
                  <span className="pbi-en">{p.en}</span>
                  <button className="pbi-speak" onClick={() => _speak(p.jp)} title="Hear pronunciation">🔊</button>
                  <button className="pbi-copy" onClick={() => copy(p.jp, id)} title="Copy">
                    {copied === id ? '✓' : '⿻'}
                  </button>
                </div>
              );
            })}
          </div>
        );
      })()}
    </div>
  );
};

// ── Phrasebook ─────────────────────────────────────────────────────────────
interface ReturnOption { icon: string; mode: string; time: string; note?: string; }
interface ReturnTransitData { options: ReturnOption[]; warning?: string; }

const returnTransits: Record<number, ReturnTransitData> = {
  1:  { options: [
        { icon:'🚶', mode:'Walk along Chuo-dori back to hotel', time:'~5 min', note:'Same block' },
      ]},
  2:  { options: [
        { icon:'🚶', mode:'Walk via Ginza', time:'~15 min' },
        { icon:'🚇', mode:'Hibiya Line 1 stop from Hibiya to Ginza', time:'~8 min', note:'Until ~12:30am' },
        { icon:'🚕', mode:'Taxi from Yurakucho', time:'~8 min', note:'¥1,000–1,400' },
      ]},
  3:  { options: [
        { icon:'🚇', mode:'Asakusa Line → Higashi-Ginza', time:'~25 min', note:'Until ~12:30am' },
        { icon:'🚕', mode:'Taxi from Asakusa', time:'~25 min', note:'¥2,500–3,500' },
        { icon:'🚗', mode:'Uber (available in Tokyo, book via app)', time:'~25 min' },
      ]},
  4:  { warning:'Trains end ~12:30am — Midnight Ramen finishes around 2am. Taxi or Uber only.',
        options: [
        { icon:'🚕', mode:'Taxi from Shinjuku (stand outside Kabukicho)', time:'~20 min', note:'¥3,000–4,000' },
        { icon:'🚗', mode:'Uber or GO taxi app (pre-book before leaving ramen)', time:'~20 min', note:'Same price, no language barrier' },
      ]},
  5:  { options: [
        { icon:'🚇', mode:'Marunouchi Line → Ginza-itchome', time:'~15 min', note:'Until ~12:30am' },
        { icon:'🚕', mode:'Taxi from Shinjuku-sanchome', time:'~18 min', note:'¥2,000–3,000' },
        { icon:'🚗', mode:'Uber', time:'~18 min' },
      ]},
  8:  { options: [
        { icon:'🚇', mode:'Osaka Metro Tanimachi Line → Nakanoshima area', time:'~20 min', note:'Until ~12:30am' },
        { icon:'🚕', mode:'Taxi from Shinsekai', time:'~20 min', note:'¥1,500–2,500' },
      ]},
  9:  { options: [
        { icon:'🚂', mode:'JR/Hanshin from Sannomiya → Osaka, Metro to Nakanoshima', time:'~50 min', note:'Last train ~12:30am' },
        { icon:'🚕', mode:'Taxi from Kobe Sannomiya', time:'~45 min', note:'¥6,000–9,000' },
        { icon:'🚗', mode:'Uber (book ahead — limited in Kobe)', time:'~45 min' },
      ]},
  10: { options: [
        { icon:'🚇', mode:'Osaka Metro from Shinsaibashi to Nakanoshima', time:'~15 min', note:'Until ~12:30am' },
        { icon:'🚕', mode:'Taxi from Namba', time:'~15 min', note:'¥1,500–2,000' },
      ]},
  11: { options: [
        { icon:'🚶', mode:'Walk through Namba / Nishi-Nihonbashi', time:'~20 min' },
        { icon:'🚇', mode:'Metro from Nipponbashi → 2 stops', time:'~10 min', note:'Early afternoon, trains plentiful' },
      ]},
  12: { options: [
        { icon:'🚂', mode:'Hanshin Main Line → Osaka-Namba, Metro to Conrad', time:'~45 min', note:'Post-game crowds — expect wait' },
        { icon:'🚕', mode:'Taxi from Koshien (queue outside stadium)', time:'~50 min', note:'¥5,000–8,000' },
        { icon:'🚗', mode:'Uber (pre-book 10 min before game ends)', time:'~45 min' },
      ]},
  13: { options: [
        { icon:'🚕', mode:'Taxi from Higashiyama', time:'~12 min', note:'¥1,200–1,800' },
        { icon:'🚶', mode:'Walk downhill along Higashiyama-dori', time:'~25 min' },
        { icon:'🚌', mode:'Kyoto City Bus 206 toward Kyoto Station', time:'~20 min', note:'Last bus check before going' },
      ]},
  14: { options: [
        { icon:'🚕', mode:'Taxi from Nanzen-ji', time:'~15 min', note:'¥1,500–2,000' },
        { icon:'🚶', mode:'Walk downhill (pleasant in June evening)', time:'~30 min' },
      ]},
  15: { options: [
        { icon:'🚕', mode:'Taxi from Nishiki area', time:'~12 min', note:'¥1,200–1,800' },
        { icon:'🚶', mode:'Walk south on Karasuma-dori', time:'~20 min' },
      ]},
  16: { warning:'Late return from Gion (~11pm) — taxis plentiful at this hour, no need to rush.',
        options: [
        { icon:'🚕', mode:'Taxi from Hanamikoji (stand on Shijo-dori)', time:'~10 min', note:'¥1,000–1,500, very easy' },
        { icon:'🚶', mode:'Walk along Gojo-dori', time:'~20 min' },
        { icon:'🚗', mode:'Uber (available in Kyoto)', time:'~10 min' },
      ]},
  18: { warning:'Final night — early Haruka Express tomorrow morning. Home by midnight.',
        options: [
        { icon:'🚕', mode:'Taxi from Gion (corner of Hanamikoji)', time:'~10 min', note:'¥1,000–1,500' },
        { icon:'🚶', mode:'Walk via Shijo → Kawaramachi → Shichijo', time:'~20 min' },
        { icon:'🚗', mode:'Uber (pre-book for peace of mind)', time:'~10 min' },
      ]},
};

const ReturnTransitCard: React.FC<{ data: ReturnTransitData; hotelName: string }> = ({ data, hotelName }) => {
  const { activeDay } = useStore();
  const color = regionColors[regionMap[activeDay]];
  return (
    <div style={{ marginTop: '4px', borderTop: '1px dashed var(--paper-fold)', paddingTop: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <span style={{ fontSize: '13px' }}>🏨</span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.67rem', fontWeight: 700, letterSpacing: '1.8px', textTransform: 'uppercase', color }}>Return to {hotelName}</span>
      </div>
      {data.warning && (
        <div style={{ fontSize: '11px', color: '#b83020', fontWeight: 600, marginBottom: '8px', padding: '6px 10px', background: 'rgba(184,48,32,0.06)', borderRadius: '5px', borderLeft: '3px solid #b83020' }}>
          ⚠ {data.warning}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {data.options.map((opt, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', padding: '7px 10px', background: 'rgba(0,0,0,0.025)', borderRadius: '5px' }}>
            <span style={{ fontSize: '15px', flexShrink: 0 }}>{opt.icon}</span>
            <span style={{ flex: 1, color: 'var(--ink)', lineHeight: 1.4 }}>{opt.mode}</span>
            <span style={{ fontVariantNumeric: 'tabular-nums', color, fontWeight: 600, flexShrink: 0, fontSize: '11px' }}>{opt.time}</span>
            {opt.note && <span style={{ fontSize: '10px', color: 'var(--ink-fade)', flexShrink: 0, maxWidth: '90px', textAlign: 'right', lineHeight: 1.3 }}>{opt.note}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};


const JournalPane: React.FC = () => {
  const { activeDay, doneActivities, openStory, aiSuggestions } = useStore();
  const region = regionMap[activeDay];
  const color = regionColors[region];
  const hero = REGION_HEROES[region] || REGION_HEROES.tokyo;

  const [animClass, setAnimClass] = React.useState('');
  const [scrollPct, setScrollPct] = React.useState(0);
  const prevDayRef = React.useRef(activeDay);

  React.useEffect(() => {
    const wrapper = document.querySelector('.journal-pane-wrapper') as HTMLElement;
    if (!wrapper) return;
    wrapper.scrollTop = 0;
    setScrollPct(0);
    if (prevDayRef.current === activeDay) return;
    const fwd = activeDay > prevDayRef.current;
    prevDayRef.current = activeDay;
    setAnimClass(fwd ? 'day-slide-fwd' : 'day-slide-back');
    const t = setTimeout(() => setAnimClass(''), 380);
    return () => clearTimeout(t);
  }, [activeDay]);

  React.useEffect(() => {
    const wrapper = document.querySelector('.journal-pane-wrapper') as HTMLElement;
    if (!wrapper) return;
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = wrapper;
      setScrollPct(scrollHeight <= clientHeight ? 0 : (scrollTop / (scrollHeight - clientHeight)) * 100);
    };
    wrapper.addEventListener('scroll', onScroll, { passive: true });
    return () => wrapper.removeEventListener('scroll', onScroll);
  }, []);
  const metadata = dayMeta[activeDay];

  const _acts = activities[activeDay] || [];

  return (
    <div className="journal-pane" style={{ '--rc': color } as React.CSSProperties}>
      <div className="scroll-progress-wrap"><div className="scroll-progress-fill" style={{ width: `${scrollPct}%` }} /></div>
      <div className={animClass} style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '96px' }}>
        <div className="region-hero" style={{ background: hero.gradient }}>
          <span className="region-tag">{region} Region</span>
          <h2 className="day-title"><span style={{ color }}>〜</span> {metadata.title}</h2>
          <p className="region-hero-tagline">{hero.tagline}</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="lodging-badge-row" style={{ marginBottom: 0 }}>
            <span className="lodging-badge">LODGING</span>
            <span className="lodging-name">{metadata.lodging}</span>
          </div>
          <button className="story-play-btn" onClick={() => openStory(activeDay)} title="Story Mode">
            <span className="story-play-icon">▶</span><span className="story-play-label">Story</span>
          </button>
          </div>
        </div>

        {/* Compact schedule timeline */}
        <div className="schedule-timeline-wrap" style={{ padding: '14px 16px 10px', background: 'rgba(0,0,0,0.025)', borderRadius: '5px', border: '1px solid var(--paper-fold)' }}>
          <DayScheduleTimeline day={activeDay} color={color} />
        </div>
        {(() => {
          const totalActs = _acts.length;
          const doneCount = _acts.filter((_: any, i: number) => doneActivities[`${activeDay}_${i}`]).length;
          if (doneCount === 0) return null;
          const pct = (doneCount / totalActs) * 100;
          return (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontFamily: 'var(--font-display)', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--ink-fade)', marginBottom: '5px' }}>
                <span>{doneCount} of {totalActs} completed</span>
                <span style={{ color }}>{Math.round(pct)}%</span>
              </div>
              <div style={{ height: '3px', background: 'var(--paper-fold)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '2px', transition: 'width 0.5s ease' }} />
              </div>
            </div>
          );
        })()}
        <PhrasebookInline />
        <div className="day-scroll-layout">
          <div className="timeline-container">
            {hotelAnchors[activeDay] && (() => {
              const hotel = hotelAnchors[activeDay]!;
              const outbound = transits[activeDay]?.[0];
              return (
                <div style={{ marginBottom: '16px', padding: '10px 14px', background: 'rgba(0,0,0,0.025)', borderRadius: '7px', border: '1px solid var(--paper-fold)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '18px', flexShrink: 0 }}>🏨</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color, fontFamily: 'var(--font-display)', marginBottom: '2px' }}>Departing from</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{hotel.name}</div>
                  </div>
                  {outbound && (
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '12px', color: 'var(--ink-light)' }}>{outbound.icon} {outbound.mode}</div>
                      <div style={{ fontSize: '11px', color, fontWeight: 600, marginTop: '2px' }}>{outbound.time}</div>
                    </div>
                  )}
                </div>
              );
            })()}
            {_acts.map((act: any, idx: number) => (
              <ActivityItem key={idx} activity={act} index={idx}
                transit={idx > 0 ? (transits[activeDay]?.[idx] ?? undefined) : undefined} />
            ))}
            {aiSuggestions[activeDay]?.map((act, idx) => (
              <div key={`ai_${idx}`} className="ai-timeline-item" style={{ borderColor: `${color}60` }}>
                <span className="ai-timeline-badge" style={{ background: color }}>✦ AI</span>
                <ActivityItem activity={act} index={9000 + idx} />
              </div>
            ))}
            {returnTransits[activeDay] && hotelAnchors[activeDay] && (
              <ReturnTransitCard data={returnTransits[activeDay]} hotelName={hotelAnchors[activeDay]!.name} />
            )}
          </div>
          <div className="day-scroll-vig">
            <DayScrollVignette acts={_acts} day={activeDay} />
          </div>
        </div>
        <MealsSection />
        <ReservationsPanel />
      </div>
    </div>
  );
};

const getPinIconUrl = (type: string, color: string, num?: number, done = false) => {
  if (done) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 36" width="28" height="36"><path d="M14 2C9.03 2 5 6.03 5 11c0 6.56 9 23 9 23s9-16.44 9-23c0-4.97-4.03-9-9-9z" fill="#b0a898" stroke="#fff" stroke-width="0.8"/><text x="14" y="12" font-size="11" font-family="Georgia,serif" fill="#fff" text-anchor="middle" dominant-baseline="middle">✓</text></svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }
  const label = num !== undefined ? `<text x="12" y="13" font-size="8" font-family="Georgia,serif" font-weight="bold" fill="#fff" text-anchor="middle" dominant-baseline="middle">${num}</text>` : '';
  const isHotel = type === 'hotel';
  const pinColor = isHotel ? '#7a3018' : color;
  const svg = isHotel
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 36" width="28" height="36"><path d="M14 2C9.03 2 5 6.03 5 11c0 6.56 9 23 9 23s9-16.44 9-23c0-4.97-4.03-9-9-9z" fill="${pinColor}" stroke="#fff" stroke-width="1"/><text x="14" y="12" font-size="9" font-family="Georgia,serif" font-weight="bold" fill="#fff" text-anchor="middle" dominant-baseline="middle">H</text></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 36" width="28" height="36"><path d="M14 2C9.03 2 5 6.03 5 11c0 6.56 9 23 9 23s9-16.44 9-23c0-4.97-4.03-9-9-9z" fill="${pinColor}" stroke="#fff" stroke-width="0.8"/>${label}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const StoryOverlay: React.FC = () => {
  const { storyDay, storyStep, closeStory, setStoryStep } = useStore();
  const googleMap = useMap('travel_map');
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [dir, setDir] = React.useState<'fwd' | 'back'>('fwd');
  const [animKey, setAnimKey] = React.useState(0);
  const touchStartX = React.useRef<number | null>(null);
  const flyInDoneRef = React.useRef(false);

  const acts: any[] = storyDay !== null ? ((activities as any)[storyDay] || []) : [];
  const act = acts[storyStep] ?? null;
  const region = storyDay !== null ? (regionMap[storyDay] || 'tokyo') : 'tokyo';
  const color = regionColors[region];
  const hero = REGION_HEROES[region] || REGION_HEROES.tokyo;

  // ── Cinematic fly-in when story opens ──────────────────────────────────────
  const REGION_CENTERS: Record<string, {lat:number;lng:number}> = {
    tokyo:  {lat:35.68,  lng:139.77},
    hakone: {lat:35.25,  lng:139.10},
    osaka:  {lat:34.70,  lng:135.50},
    kyoto:  {lat:35.01,  lng:135.77},
  };
  React.useEffect(() => {
    if (storyDay === null) { flyInDoneRef.current = false; return; }
    if (flyInDoneRef.current || !googleMap || !act) return;
    flyInDoneRef.current = true;
    const g = (window as any).google;
    const city = REGION_CENTERS[region] || {lat:35.68, lng:139.77};
    const target = { lat: act.lat, lng: act.lng };
    // Kick off sequence
    setTimeout(() => {
      g?.maps?.event?.trigger(googleMap, 'resize');
      googleMap.setCenter({lat:36.2, lng:138.0});
      googleMap.setZoom(5); googleMap.setTilt(0);
    }, 50);
    setTimeout(() => {
      googleMap.panTo(city);
      _animVal(5, 10, 800, z => googleMap.setZoom(z));
    }, 300);
    setTimeout(() => {
      googleMap.panTo(target);
      _animVal(10, 15.5, 900, z => googleMap.setZoom(z), () => googleMap.setTilt(45));
    }, 1200);
  }, [storyDay]);

  const goTo = React.useCallback((step: number, d: 'fwd' | 'back') => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setDir(d);
    setAnimKey(k => k + 1);
    setStoryStep(step);
  }, [setStoryStep]);
  const goNext = React.useCallback(() => {
    if (storyStep < acts.length - 1) goTo(storyStep + 1, 'fwd');
    else closeStory();
  }, [storyStep, acts.length, goTo, closeStory]);
  const goPrev = React.useCallback(() => {
    if (storyStep > 0) goTo(storyStep - 1, 'back');
  }, [storyStep, goTo]);

  React.useEffect(() => {
    if (!act || storyDay === null) return;
    if (googleMap && act.lat && act.lng) { googleMap.panTo({ lat: act.lat, lng: act.lng }); googleMap.setZoom(15); }
    timerRef.current = setTimeout(goNext, 6000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [storyStep, storyDay]);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeStory();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev, closeStory]);

  if (storyDay === null || !act) return null;

  const price = act.type === 'restaurant'
    ? (restaurantPrices as any)[act.title]
    : (activityPrices as any)[act.title];

  const storyTypeIcon: Record<string, string> = { hotel: '🏨', restaurant: '🍜', museum: '🏛', shop: '🛍', transit: '🚄', nature: '🌿' };
  const storyTypeLabel: Record<string, string> = { hotel: 'Hotel', restaurant: 'Dining', museum: 'Culture', shop: 'Shopping', transit: 'Transit', nature: 'Nature' };

  const typeBg: Record<string, string> = {
    hotel: '#130a02', restaurant: '#120305', museum: '#060a14',
    shop: '#0e0512', transit: '#05080f', nature: '#030d06',
  };
  const typeAccent: Record<string, string> = {
    hotel: '#d4952a', restaurant: '#c84040', museum: '#6890c0',
    shop: '#c87890', transit: '#6890c8', nature: '#5a9a5a',
  };
  const bg = typeBg[act.type] ?? '#0a0804';
  const accent = typeAccent[act.type] ?? color;
  const padded = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="story-overlay"
      style={{ '--story-bg': bg, '--story-accent': accent } as React.CSSProperties}
      onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
      onTouchEnd={e => {
        if (touchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(dx) > 50) { dx < 0 ? goNext() : goPrev(); }
        touchStartX.current = null;
      }}
    >
      {/* Top strip: progress + header floats over map */}
      <div className="story-top-strip">
        <div className="story-progress">
          {acts.map((_: any, i: number) => (
            <div key={i} className="story-seg-wrap" onClick={() => goTo(i, i > storyStep ? 'fwd' : 'back')}>
              <div className={`story-seg${i < storyStep ? ' done' : i === storyStep ? ' active' : ''}`}
                style={i === storyStep ? { '--story-color': accent } as React.CSSProperties : {}} />
            </div>
          ))}
        </div>
        <div className="story-header">
          <div className="story-day-meta">
            <span className="story-day-label" style={{ color: accent }}>Day {storyDay}&nbsp;&nbsp;·&nbsp;&nbsp;{region.charAt(0).toUpperCase() + region.slice(1)}</span>
            <span className="story-tagline">{hero.tagline}</span>
          </div>
          <button className="story-close" onClick={closeStory}>✕</button>
        </div>
      </div>

      {/* Transparent window — map shows through here */}
      <div className="story-map-window" />

      {/* Gradient fade from transparent to type-bg */}
      <div className="story-fade" />

      {/* Bottom content panel */}
      <div key={`${storyDay}_${storyStep}_${animKey}`} className={`story-content story-content--${dir}`}>

        {/* Type badge row */}
        <div className="story-type-row">
          <span className="story-type-badge" style={{ color: accent, borderColor: `${accent}50`, background: `${accent}15` }}>
            <span className="story-type-icon-sm">{storyTypeIcon[act.type] ?? '📍'}</span>
            {storyTypeLabel[act.type] ?? act.type}
          </span>
          <span className="story-time-chip">{act.time}{act.duration ? `  ·  ${act.duration}` : ''}</span>
        </div>

        {/* Title */}
        <h2 className="story-title" style={{ '--title-glow': `${accent}30` } as React.CSSProperties}>
          {act.title}
        </h2>

        {/* Description */}
        <div className="story-desc-wrap">
          <p className="story-desc">{act.desc}</p>
          <div className="story-desc-fade" style={{ background: `linear-gradient(transparent, ${bg})` }} />
        </div>

        {/* Meta + Nav row */}
        <div className="story-bottom-row">
          <div className="story-meta-pills">
            {price !== undefined && price > 0 && (
              <span className="story-pill" style={{ color: accent, borderColor: `${accent}50`, background: `${accent}15` }}>💴 ${price}/pp</span>
            )}
            {price === 0 && <span className="story-pill story-pill--free">✓ Free</span>}
            {(act as any).optional && <span className="story-pill story-pill--opt">Optional</span>}
          </div>
          <div className="story-nav">
            <button className="story-nav-btn" onClick={goPrev} disabled={storyStep === 0}>‹</button>
            <span className="story-counter">
              <span style={{ color: accent }}>{padded(storyStep + 1)}</span>
              <span className="story-counter-dot"> · </span>
              <span>{padded(acts.length)}</span>
            </span>
            <button className="story-nav-btn" onClick={goNext}>
              {storyStep === acts.length - 1 ? '✕' : '›'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


const MapEngine: React.FC<{ activeDay: number }> = ({ activeDay }) => {
  const googleMap = useMap('travel_map');
  const { selectedActivity, hoveredActivityKey, doneActivities } = useStore();
  const [markerData, setMarkerData] = useState<Array<{ marker: any; iw: any; lat: number; lng: number; actKey: string; originalIconUrl: string }>>([]);
  const [polyline, setPolyline] = useState<any>(null);
  const [transitLines, setTransitLines] = useState<any[]>([]);
  const openIwRef = React.useRef<any>(null);
  const animFrameRef = React.useRef<number>(0);

  useEffect(() => {
    if (!googleMap) return;
    const google = (window as any).google;
    if (!google) return;

    markerData.forEach(({ marker }) => marker.setMap(null));
    if (polyline) polyline.setMap(null);
    transitLines.forEach(p => p.setMap(null));
    setTransitLines([]);
    if (openIwRef.current) { openIwRef.current.close(); openIwRef.current = null; }
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    const dayActs = activities[activeDay] || [];
    const hotel = hotelAnchors[activeDay];
    const pathCoordinates: any[] = [];
    const bounds = new google.maps.LatLngBounds();
    const newMarkerData: typeof markerData = [];


    // Track segments with type for transit styling
    interface MapSeg { from: {lat:number;lng:number}; to: {lat:number;lng:number}; kind: 'normal'|'transit'|'longhaul'; }
    const mapSegs: MapSeg[] = [];
    const coordTypes: string[] = [];
    const coordTitles: string[] = [];

    let pinSeq = 0;
    const addPin = (
      loc: { lat: number; lng: number },
      title: string, type: string, color: string,
      isHotelPin = false, actKey = '',
      extra: { time?: string; duration?: string; desc?: string } = {}
    ) => {
      bounds.extend(loc);
      pathCoordinates.push(loc);
      const seq = isHotelPin ? undefined : ++pinSeq;
      const iconUrl = getPinIconUrl(type, color, seq);
      const marker = new google.maps.Marker({
        position: loc, map: googleMap, title,
        icon: { url: iconUrl, scaledSize: new google.maps.Size(28, 36) }
      });
      const icon = typeIcon[type] || '📍';
      const label = typeLabel[type] || type;
      const rawDesc = extra.desc || '';
      const shortDesc = rawDesc.substring(0, 130);
      const isCut = rawDesc.length > 130;
      const escapedTitle = title.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      const escapedDesc = shortDesc.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      const iwContent = `<div style="font-family:Georgia,serif;max-width:230px;padding:10px 13px;line-height:1.5;color:#2a1a0a">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
          <span style="font-size:15px">${icon}</span>
          <span style="font-size:9px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:#9a8870;font-family:sans-serif">${label}</span>
        </div>
        <div style="font-size:13px;font-weight:700;margin-bottom:4px">${escapedTitle}</div>
        ${extra.time ? `<div style="font-size:10px;color:#8a7a68;font-family:sans-serif;margin-bottom:6px">${extra.time}${extra.duration ? ' · ' + extra.duration : ''}</div>` : ''}
        ${escapedDesc ? `<div style="font-size:11px;color:#5a4a38;line-height:1.55">${escapedDesc}${isCut ? '…' : ''}</div>` : ''}
      </div>`;
      const iw = new google.maps.InfoWindow({ content: iwContent });
      marker.addListener('click', () => {
        if (openIwRef.current) openIwRef.current.close();
        iw.open(googleMap, marker);
        openIwRef.current = iw;
      });
      newMarkerData.push({ marker, iw, lat: loc.lat, lng: loc.lng, actKey, originalIconUrl: iconUrl });
    };

    if (hotel) {
      addPin({ lat: hotel.lat, lng: hotel.lng }, hotel.name, 'hotel', '#b83020', true, 'hotel');
      coordTypes.push('hotel'); coordTitles.push(hotel.name);
    }
    dayActs.forEach((act: any, i: number) => {
      addPin(
        { lat: act.lat, lng: act.lng }, act.title, act.type, '#c87e18', false, `${activeDay}_${i}`,
        { time: act.time, duration: act.duration, desc: act.desc }
      );
      coordTypes.push(act.type); coordTitles.push(act.title);
    });
    if (hotel && hotel.loop) {
      pathCoordinates.push({ lat: hotel.lat, lng: hotel.lng });
      coordTypes.push('hotel'); coordTitles.push(hotel.name);
    }

    // Build typed segments for transit styling
    for (let i = 0; i < pathCoordinates.length - 1; i++) {
      const t = coordTypes[i + 1] || coordTypes[i];
      const title = coordTitles[i + 1] || '';
      const isLong = t === 'transit' && (
        title.includes('Shinkansen') || title.includes('Haruka') ||
        title.includes('Express') || title.includes('Odakyu')
      );
      mapSegs.push({ from: pathCoordinates[i], to: pathCoordinates[i + 1], kind: t === 'transit' ? (isLong ? 'longhaul' : 'transit') : 'normal' });
    }

    setMarkerData(newMarkerData);

    if (pathCoordinates.length > 1) {
      const segColor = regionColors[regionMap[activeDay]] || '#c87e18';
      // Normal animated path (transit segments drawn transparently so only normal segments show)
      const normalPath = pathCoordinates.filter((_, i) =>
        i === 0 || mapSegs[i - 1]?.kind === 'normal'
      );
      const newPolyline = new google.maps.Polyline({
        path: [],
        strokeColor: segColor,
        strokeOpacity: 0.5,
        strokeWeight: 2.5,
        geodesic: true,
        icons: [{ icon: { path: 'M 0,-1 0,1', strokeOpacity: 0.85, scale: 3, strokeColor: segColor }, offset: '0', repeat: '14px' }],
        map: googleMap,
      });
      setPolyline(newPolyline);

      // Transit overlays — dashed, styled by kind, drawn immediately
      const newTransitLines: any[] = [];
      mapSegs.forEach(seg => {
        if (seg.kind === 'normal') return;
        const isLong = seg.kind === 'longhaul';
        const segColor = isLong ? '#c84428' : '#4a80c8';
        const tl = new google.maps.Polyline({
          path: [seg.from, seg.to],
          strokeOpacity: 0,
          strokeWeight: isLong ? 4 : 2.5,
          geodesic: true,
          icons: [{
            icon: {
              path: 'M 0,-1 0,1',
              strokeOpacity: 0.9,
              scale: isLong ? 5 : 3,
              strokeColor: segColor,
              strokeWeight: isLong ? 3 : 2,
            },
            offset: '0',
            repeat: isLong ? '20px' : '13px',
          }],
          map: googleMap,
        });
        newTransitLines.push(tl);
      });
      setTransitLines(newTransitLines);

      const totalPath = [...pathCoordinates];
      const duration = 1800;
      const startTime = performance.now();
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 2);
      const animatePath = (now: number) => {
        const t = Math.min((now - startTime) / duration, 1);
        const e = easeOut(t);
        const len = totalPath.length - 1;
        const pos = e * len;
        const idx = Math.floor(pos);
        const frac = pos - idx;
        const partial = totalPath.slice(0, idx + 1);
        if (idx < len) {
          partial.push({
            lat: totalPath[idx].lat + (totalPath[idx + 1].lat - totalPath[idx].lat) * frac,
            lng: totalPath[idx].lng + (totalPath[idx + 1].lng - totalPath[idx].lng) * frac,
          });
        }
        // Only animate normal segments
        const partialNormal = partial.filter((_, i) => i === 0 || mapSegs[i - 1]?.kind === 'normal');
        newPolyline.setPath(partialNormal.length > 1 ? partialNormal : partial);
        if (t < 1) { animFrameRef.current = requestAnimationFrame(animatePath); }
      };
      animFrameRef.current = requestAnimationFrame(animatePath);
    }
    if (pathCoordinates.length > 0) {
      const savedMap = googleMap;
      const savedBounds = bounds;
      setTimeout(() => savedMap.fitBounds(savedBounds, 60), 250);
    }
  }, [activeDay, googleMap]);

  useEffect(() => {
    if (!googleMap) return;
    const google = (window as any).google;
    if (!google) return;
    markerData.forEach(({ marker, actKey }) => {
      if (hoveredActivityKey && actKey === hoveredActivityKey) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
      } else {
        if (marker.getAnimation() !== null) marker.setAnimation(null);
      }
    });
  }, [hoveredActivityKey, markerData]);

  useEffect(() => {
    markerData.forEach(({ marker, actKey, originalIconUrl }) => {
      const isDone = actKey && actKey !== 'hotel' && doneActivities[actKey];
      marker.setIcon({ url: isDone ? getPinIconUrl('', '', undefined, true) : originalIconUrl, scaledSize: new (window as any).google.maps.Size(28, 36) });
    });
  }, [doneActivities, markerData]);

  useEffect(() => {
    if (!googleMap || !selectedActivity) return;
    const google = (window as any).google;
    if (!google) return;
    const { lat, lng } = selectedActivity;
    const startCenter = googleMap.getCenter();
    if (!startCenter) { googleMap.panTo({ lat, lng }); googleMap.setZoom(15); return; }
    const startLat = startCenter.lat();
    const startLng = startCenter.lng();
    const startZoom = googleMap.getZoom() ?? 11;
    const targetZoom = 15;
    const midZoom = Math.max(9, Math.min(startZoom, targetZoom) - 2);
    const duration = 2200;
    const startTime = performance.now();
    const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 2);
    const easeIn = (t: number) => t * t * t;
    const animate = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const panE = easeInOut(t);
      const zoom = t < 0.4
        ? startZoom + (midZoom - startZoom) * easeOut(t / 0.4)
        : midZoom + (targetZoom - midZoom) * easeIn((t - 0.4) / 0.6);
      googleMap.moveCamera({
        center: { lat: startLat + (lat - startLat) * panE, lng: startLng + (lng - startLng) * panE },
        zoom,
      });
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    if (openIwRef.current) { openIwRef.current.close(); openIwRef.current = null; }
    markerData.forEach(({ marker, iw, actKey }) => {
      if (actKey === selectedActivity.key) {
        setTimeout(() => {
          if (openIwRef.current !== iw) { iw.open(googleMap, marker); openIwRef.current = iw; }
        }, 1800);
      }
    });
  }, [selectedActivity]);

  return null;
};

const PARCHMENT_MAP_STYLE: any[] = [
  { elementType: 'geometry', stylers: [{ saturation: -42 }, { lightness: 8 }, { gamma: 1.05 }] },
  { featureType: 'water', stylers: [{ color: '#a8bfcc' }, { saturation: -25 }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#e8d4a0' }] },
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#f2e4c0' }] },
  { featureType: 'road.local', elementType: 'geometry', stylers: [{ color: '#f8f0de' }] },
  { featureType: 'landscape.natural', stylers: [{ color: '#ede4d0' }] },
  { featureType: 'landscape.man_made', stylers: [{ color: '#e8dcc8' }] },
  { featureType: 'poi.park', stylers: [{ color: '#cad8b8' }] },
  { featureType: 'poi.business', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit.line', elementType: 'geometry', stylers: [{ color: '#c8b888' }, { weight: 1.5 }] },
  { featureType: 'administrative', elementType: 'labels.text.fill', stylers: [{ color: '#7a5a38' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#5a3c1e' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#4a6878' }] },
];

const MapPane: React.FC = () => {
  const { activeDay } = useStore();
  const [mapType, setMapType] = useState<'roadmap' | 'hybrid'>('roadmap');
  const [fading, setFading] = useState(false);
  const prevDayRef = React.useRef(activeDay);
  React.useEffect(() => {
    if (prevDayRef.current !== activeDay) {
      setFading(true);
      prevDayRef.current = activeDay;
      const t = setTimeout(() => setFading(false), 1100);
      return () => clearTimeout(t);
    }
  }, [activeDay]);
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Map
        id="travel_map"
        defaultCenter={{ lat: 35.6762, lng: 139.6503 }}
        defaultZoom={11}
        mapTypeId={mapType}
        styles={mapType === 'roadmap' ? PARCHMENT_MAP_STYLE : undefined}
        disableDefaultUI={true}
        zoomControl={true}
        gestureHandling="greedy"
        clickableIcons={false}
        style={{ width: '100%', height: '100%' }}
      >
        <MapEngine activeDay={activeDay} />
        <MapControl position={ControlPosition.TOP_RIGHT}>
          <div className="map-controls-overlay">
            <button onClick={() => setMapType('roadmap')} className={`map-control-btn ${mapType === 'roadmap' ? 'active' : ''}`}>Sketch Map</button>
            <button onClick={() => setMapType('hybrid')} className={`map-control-btn ${mapType === 'hybrid' ? 'active' : ''}`}>Satellite</button>
          </div>
        </MapControl>
      </Map>
      {fading && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none',
          background: 'var(--paper)',
          animation: 'mapDayFade 1.1s ease-out forwards',
        }} />
      )}
    </div>
  );
};



const PhrasebookDrawer: React.FC = () => {
  const { phrasebookOpen, togglePhrasebook } = useStore();
  const [copied, setCopied] = React.useState<string | null>(null);
  const [openCat, setOpenCat] = React.useState<string>('Greetings');

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  if (!phrasebookOpen) return null;
  return (
    <>
      <div className="pb-backdrop" onClick={togglePhrasebook} />
      <div className="pb-drawer">
        <div className="pb-header">
          <span className="pb-title">言葉 — Phrasebook</span>
          <button className="pb-close" onClick={togglePhrasebook}>✕</button>
        </div>
        <div className="pb-body">
          {_phrases.map(({ cat, items }) => (
            <div key={cat} className="pb-category">
              <button
                className={`pb-cat-btn ${openCat === cat ? 'open' : ''}`}
                onClick={() => setOpenCat(openCat === cat ? '' : cat)}
              >
                {cat} <span className="pb-cat-arrow">{openCat === cat ? '▲' : '▼'}</span>
              </button>
              {openCat === cat && (
                <div className="pb-items">
                  {items.map((p, i) => {
                    const id = `${cat}_${i}`;
                    return (
                      <div key={id} className="pb-item">
                        <div className="pb-jp">{p.jp}</div>
                        <div className="pb-rom">{p.rom}</div>
                        <div className="pb-en">{p.en}</div>
                        <button className="pb-speak" onClick={() => _speak(p.jp)} title="Hear pronunciation">🔊</button>
                        <button
                          className="pb-copy"
                          onClick={() => copy(p.jp, id)}
                          title="Copy Japanese"
                        >{copied === id ? '✓' : '⿻'}</button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};


// ── Documents Page ───────────────────────────────────────────────────────────



// ── Shared activity row ───────────────────────────────────────────────────────
const ActivityRow: React.FC<{ act: any; day: number; price?: number; note?: string }> = ({ act, day, price, note }) => {
  const region = regionMap[day];
  const color = regionColors[region];
  return (
    <div style={{ display: 'flex', gap: '14px', padding: '14px 18px', borderBottom: '1px solid rgba(0,0,0,0.06)', background: 'rgba(255,255,255,0.5)' }}>
      <div style={{ flexShrink: 0, textAlign: 'center', minWidth: '38px' }}>
        <div style={{ fontSize: '18px' }}>{typeIcon[act.type] ?? '📍'}</div>
        <div style={{ fontSize: '10px', fontWeight: 700, color: color, textTransform: 'uppercase', letterSpacing: '0.4px', marginTop: '2px' }}>Day {day}</div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#1e1208', letterSpacing: '-0.2px' }}>{act.title}</div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'baseline', flexShrink: 0 }}>
            {note
              ? <span style={{ fontSize: '11px', color: '#4a8a4a', fontStyle: 'italic' }}>{note}</span>
              : price !== undefined && <span style={{ fontSize: '13px', fontWeight: 700, color: color }}>{price === 0 ? 'Free' : `$${price}/pp`}</span>
            }
            <span style={{ fontSize: '11px', color: '#aaa' }}>{act.time}</span>
          </div>
        </div>
        <div style={{ fontSize: '11px', color: color, fontWeight: 600, marginTop: '1px', marginBottom: '5px' }}>
          {region.charAt(0).toUpperCase() + region.slice(1)} · {typeLabel[act.type] ?? act.type}
        </div>
        <p style={{ fontSize: '12.5px', color: '#5a4a3a', lineHeight: '1.55', margin: 0 }}>{act.desc}</p>
      </div>
    </div>
  );
};

// ── Restaurants Panel ─────────────────────────────────────────────────────────
const RestaurantsPanel: React.FC = () => {
  const { restaurantsOpen, toggleRestaurants } = useStore();
  if (!restaurantsOpen) return null;
  const rows: { day: number; act: any }[] = [];
  Object.entries(activities).forEach(([d, acts]) => {
    (acts as any[]).forEach(act => {
      if (act.type === 'restaurant') rows.push({ day: Number(d), act });
    });
  });
  rows.sort((a, b) => a.day - b.day || 0);
  const totalPerPerson = rows.reduce((s, { act }) => s + (restaurantPrices[act.title] ?? 0), 0);
  return (
    <div className="docs-page">
      <div className="docs-page-header">
        <div>
          <h2 className="docs-page-title">🍜 Dining Itinerary</h2>
          <p className="docs-page-sub">{rows.length} meals across 18 days · est. per person</p>
        </div>
        <button className="docs-close-btn" onClick={toggleRestaurants}>✕ Close</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {rows.map(({ day, act }, i) => (
          <ActivityRow key={i} act={act} day={day}
            price={restaurantPrices[act.title]}
            note={restaurantNotes[act.title]}
          />
        ))}
      </div>
      <div style={{ borderTop: '2px solid rgba(0,0,0,0.08)', padding: '14px 24px', background: 'rgba(248,244,236,0.9)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '13px', color: '#7a6a5a' }}>{rows.length} meals · est. dining per person</div>
        <div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#1e1208', textAlign: 'right' }}>${totalPerPerson.toLocaleString()}</div>
          <div style={{ fontSize: '11px', color: '#aaa', textAlign: 'right' }}>${(totalPerPerson * 2).toLocaleString()} for 2</div>
        </div>
      </div>
    </div>
  );
};

// ── Activities Panel ──────────────────────────────────────────────────────────
const ActivitiesPanel: React.FC = () => {
  const { activitiesOpen, toggleActivities } = useStore();
  const [filter, setFilter] = React.useState<string>('all');
  if (!activitiesOpen) return null;
  const rows: { day: number; act: any }[] = [];
  Object.entries(activities).forEach(([d, acts]) => {
    (acts as any[]).forEach(act => {
      if (!['restaurant', 'hotel'].includes(act.type)) rows.push({ day: Number(d), act });
    });
  });
  rows.sort((a, b) => a.day - b.day);
  const types = ['all', ...Array.from(new Set(rows.map(r => r.act.type)))];
  const filtered = filter === 'all' ? rows : rows.filter(r => r.act.type === filter);
  const filteredTotal = filtered.reduce((s, { act }) => s + (activityPrices[act.title] ?? 0), 0);
  return (
    <div className="docs-page">
      <div className="docs-page-header">
        <div>
          <h2 className="docs-page-title">🗺 Activities</h2>
          <p className="docs-page-sub">{filtered.length} of {rows.length} experiences · est. per person</p>
        </div>
        <button className="docs-close-btn" onClick={toggleActivities}>✕ Close</button>
      </div>
      <div style={{ display: 'flex', gap: '8px', padding: '10px 20px', borderBottom: '1px solid rgba(0,0,0,0.06)', flexWrap: 'wrap' }}>
        {types.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{
            padding: '4px 12px', borderRadius: '20px', border: '1.5px solid',
            borderColor: filter === t ? '#3a2a1a' : '#d0c8b8',
            background: filter === t ? '#3a2a1a' : 'transparent',
            color: filter === t ? '#f8f4ec' : '#7a6a5a',
            fontSize: '12px', fontWeight: 600, cursor: 'pointer',
            textTransform: 'capitalize', fontFamily: 'inherit',
          }}>
            {t === 'all' ? `All (${rows.length})` : `${typeIcon[t] ?? ''} ${typeLabel[t] ?? t}`}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filtered.map(({ day, act }, i) => (
          <ActivityRow key={i} act={act} day={day} price={activityPrices[act.title]} />
        ))}
      </div>
      <div style={{ borderTop: '2px solid rgba(0,0,0,0.08)', padding: '14px 24px', background: 'rgba(248,244,236,0.9)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '13px', color: '#7a6a5a' }}>{filtered.length} experiences · est. per person</div>
        <div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#1e1208', textAlign: 'right' }}>${filteredTotal.toLocaleString()}</div>
          <div style={{ fontSize: '11px', color: '#aaa', textAlign: 'right' }}>${(filteredTotal * 2).toLocaleString()} for 2</div>
        </div>
      </div>
    </div>
  );
};


// ── Booking Timeline Panel ────────────────────────────────────────────────────



const URGENCY_META: Record<string, { label:string; color:string; bg:string }> = {
  now:  { label:'Book Now',          color:'#c03828', bg:'#fff0ed' },
  dec:  { label:'By Dec 2026',       color:'#b85a10', bg:'#fff5e8' },
  feb:  { label:'By Feb 2027',       color:'#7a6010', bg:'#fffbe8' },
  apr:  { label:'By Apr 2027',       color:'#3a6830', bg:'#eef5e8' },
  may:  { label:'By May 2027',       color:'#2a6858', bg:'#e8f5f2' },
  walk: { label:'Walk-in / Day-of',  color:'#7a7a7a', bg:'#f5f5f5' },
};

const BookingPanel: React.FC = () => {
  const { bookingOpen, toggleBooking } = useStore();
  const [booked, setBooked] = React.useState<Record<string,boolean>>(() =>
    JSON.parse(localStorage.getItem('wanderer_booked_v1') || '{}')
  );
  const [filter, setFilter] = React.useState<BookUrgency | 'all'>('all');
  if (!bookingOpen) return null;

  const toggleBooked = (key: string) => {
    setBooked(prev => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem('wanderer_booked_v1', JSON.stringify(next));
      return next;
    });
  };

  const urgencyOrder: BookUrgency[] = ['now', 'dec', 'feb', 'apr', 'may', 'walk'];
  const filtered = filter === 'all' ? bookingItems : bookingItems.filter(i => i.urgency === filter);
  const grouped = urgencyOrder.map(u => ({ urgency: u, items: filtered.filter(i => i.urgency === u) })).filter(g => g.items.length > 0);
  const totalItems = bookingItems.length;
  const bookedCount = bookingItems.filter(i => booked[i.key]).length;

  return (
    <div className="docs-page">
      <div className="docs-page-header">
        <div>
          <h2 className="docs-page-title">📅 Booking Timeline</h2>
          <p className="docs-page-sub">Trip: May 28 – Jun 15, 2027 · Today: Jun 21, 2026 · {bookedCount}/{totalItems} confirmed</p>
        </div>
        <button className="docs-close-btn" onClick={toggleBooking}>✕ Close</button>
      </div>
      <div style={{ display: 'flex', gap: '6px', padding: '10px 20px', borderBottom: '1px solid rgba(0,0,0,0.06)', flexWrap: 'wrap', alignItems: 'center' }}>
        <button onClick={() => setFilter('all')} style={{ padding: '4px 12px', borderRadius: '20px', border: '1.5px solid', borderColor: filter === 'all' ? '#3a2a1a' : '#d0c8b8', background: filter === 'all' ? '#3a2a1a' : 'transparent', color: filter === 'all' ? '#f8f4ec' : '#7a6a5a', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>All ({totalItems})</button>
        {urgencyOrder.map(u => {
          const meta = URGENCY_META[u];
          const count = bookingItems.filter(i => i.urgency === u).length;
          return <button key={u} onClick={() => setFilter(u)} style={{ padding: '4px 12px', borderRadius: '20px', border: `1.5px solid ${filter === u ? meta.color : '#d0c8b8'}`, background: filter === u ? meta.color : 'transparent', color: filter === u ? '#fff' : meta.color, fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{meta.label} ({count})</button>;
        })}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {grouped.map(({ urgency: u, items }) => {
          const meta = URGENCY_META[u];
          return (
            <div key={u}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: meta.color, flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: meta.color }}>{meta.label}</span>
                <div style={{ flex: 1, height: '1px', background: `${meta.color}30` }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {items.map(item => {
                  const isDone = booked[item.key];
                  return (
                    <div key={item.key} style={{ background: isDone ? 'rgba(0,0,0,0.03)' : meta.bg, borderRadius: '10px', border: `1.5px solid ${isDone ? '#d0c8b8' : meta.color}30`, padding: '14px 16px', opacity: isDone ? 0.55 : 1, transition: 'opacity 0.2s' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                          <span style={{ fontSize: '18px', flexShrink: 0 }}>{item.icon}</span>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e1208', textDecoration: isDone ? 'line-through' : 'none' }}>{item.name}</div>
                            <div style={{ fontSize: '10px', color: meta.color, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', marginTop: '1px' }}>{item.dayRef} · {item.category}</div>
                          </div>
                        </div>
                        <button onClick={() => toggleBooked(item.key)} style={{ flexShrink: 0, padding: '4px 12px', borderRadius: '12px', border: `1.5px solid ${isDone ? '#4a8a4a' : meta.color}`, background: isDone ? '#eef5e8' : 'transparent', color: isDone ? '#4a8a4a' : meta.color, fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                          {isDone ? '✓ Booked' : 'Mark booked'}
                        </button>
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: meta.color, marginBottom: '5px', fontStyle: 'italic' }}>⏰ {item.bookBy}</div>
                      <p style={{ fontSize: '12px', color: '#5a4a38', lineHeight: '1.6', margin: 0 }}>{item.how}</p>
                      {item.note && <div style={{ marginTop: '8px', padding: '6px 10px', background: `${meta.color}15`, borderRadius: '6px', fontSize: '11px', color: meta.color, fontWeight: 600 }}>⚠ {item.note}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ borderTop: '2px solid rgba(0,0,0,0.08)', padding: '14px 24px', background: 'rgba(248,244,236,0.9)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '13px', color: '#7a6a5a' }}>{bookedCount} confirmed · {totalItems - bookedCount} remaining</div>
        <div style={{ height: '6px', width: '160px', background: 'var(--paper-fold)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(bookedCount / totalItems) * 100}%`, background: '#4a8a4a', transition: 'width 0.4s ease', borderRadius: '3px' }} />
        </div>
      </div>
    </div>
  );
};

// ── Hotels Panel ─────────────────────────────────────────────────────────────

const HotelsPanel: React.FC = () => {
  const { hotelsOpen, toggleHotels } = useStore();
  const [confirmations, setConfirmations] = React.useState<Record<string, string>>({});
  if (!hotelsOpen) return null;
  return (
    <div className="docs-page">
      <div className="docs-page-header">
        <div>
          <h2 className="docs-page-title">🏨 Hotel Itinerary</h2>
          <p className="docs-page-sub">4 properties · 18 nights · May 28 – Jun 15, 2027</p>
        </div>
        <button className="docs-close-btn" onClick={toggleHotels}>✕ Close</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px 24px 8px' }}>
        {hotelStops.map((stop, i) => {
          const regionKey = ({'Tokyo':'tokyo','Hakone':'hakone','Osaka':'osaka','Kyoto':'kyoto'} as Record<string,string>)[stop.city] || 'tokyo';
    const color = regionColors[regionKey];
          const subtotal = stop.perNight * stop.nights;
          return (
            <div key={i} style={{ background: 'rgba(255,255,255,0.6)', borderRadius: '12px', border: `2px solid ${color}30`, overflow: 'hidden' }}>
              <div style={{ borderLeft: `4px solid ${color}`, padding: '16px 18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: '17px', fontWeight: 700, color: '#1e1208', letterSpacing: '-0.3px' }}>{stop.name}</div>
                    <div style={{ fontSize: '12px', color: color, fontWeight: 600, marginTop: '2px' }}>{stop.city}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: color }}>${subtotal.toLocaleString()}</div>
                    <div style={{ fontSize: '11px', color: '#aaa' }}>${stop.perNight.toLocaleString()} × {stop.nights} nights</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '20px', margin: '10px 0 8px', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#999', fontWeight: 600 }}>Check-in</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#2a1a0a' }}>{stop.checkIn}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#999', fontWeight: 600 }}>Check-out</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#2a1a0a' }}>{stop.checkOut}</div>
                  </div>
                </div>
                <p style={{ fontSize: '12.5px', color: '#5a4a3a', lineHeight: '1.5', margin: '0 0 12px' }}>{stop.note}</p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input type="text" placeholder="Confirmation number"
                    value={confirmations[`hotel_${i}`] || ''}
                    onChange={e => setConfirmations(prev => ({ ...prev, [`hotel_${i}`]: e.target.value }))}
                    style={{ flex: 1, fontSize: '13px', padding: '6px 10px', borderRadius: '6px', border: '1.5px solid #d0c8b8', background: 'rgba(255,255,255,0.8)', outline: 'none', fontFamily: 'inherit' }}
                  />
                  {confirmations[`hotel_${i}`] && <span style={{ fontSize: '11px', color: '#4a8a4a', fontWeight: 600 }}>✓</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ borderTop: '2px solid rgba(0,0,0,0.08)', padding: '14px 24px', background: 'rgba(248,244,236,0.9)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '13px', color: '#7a6a5a' }}>17 nights · 4 properties · est. accommodation</div>
        <div style={{ fontSize: '22px', fontWeight: 800, color: '#1e1208' }}>
          ${hotelStops.reduce((s, h) => s + h.perNight * h.nights, 0).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

// ── Flight Panel ──────────────────────────────────────────────────────────────
const flightLegs = [
  {
    label: 'Outbound',
    airline: 'ANA — All Nippon Airways',
    flight: 'NH 111',
    route: 'ORD → HND',
    from: "Chicago O'Hare (ORD)",
    to: 'Tokyo Haneda (HND)',
    departs: '11:55 PM',
    arrives: '4:05 AM +2',
    date: 'Thu, May 28, 2027',
    arrivalDate: 'Sat, May 30, 2027',
    duration: '13h 10m · Nonstop',
    cabin: 'Premium Economy',
    terminal: 'ORD Terminal 5 · HND Terminal 3',
    color: '#c87e18',
  },
  {
    label: 'Return',
    airline: 'ANA — All Nippon Airways',
    flight: 'NH 843',
    route: 'KIX → ORD',
    from: 'Osaka Kansai (KIX)',
    to: "Chicago O'Hare (ORD)",
    departs: '5:30 PM',
    arrives: '4:35 PM',
    date: 'Sun, Jun 14, 2027',
    arrivalDate: 'Sun, Jun 14, 2027',
    duration: '13h 05m · Nonstop',
    cabin: 'Premium Economy',
    terminal: 'KIX Terminal 1 · ORD Terminal 5',
    color: '#7a4a88',
  },
];

const FlightPanel: React.FC = () => {
  const { flightOpen, toggleFlight } = useStore();
  const [notes, setNotes] = React.useState<Record<number, string>>({});
  if (!flightOpen) return null;
  return (
    <div className="docs-page">
      <div className="docs-page-header">
        <div>
          <h2 className="docs-page-title">✈ Flight Itinerary</h2>
          <p className="docs-page-sub">Open-jaw · ORD → HND / KIX → ORD · ANA Premium Economy</p>
        </div>
        <button className="docs-close-btn" onClick={toggleFlight}>✕ Close</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '0 24px 32px' }}>
        {flightLegs.map((leg, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.65)',
            borderRadius: '14px',
            border: `2px solid ${leg.color}30`,
            overflow: 'hidden',
          }}>
            <div style={{ borderLeft: `4px solid ${leg.color}`, padding: '20px 22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: leg.color, fontWeight: 700 }}>{leg.label}</span>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: '#1e1208', letterSpacing: '-0.5px', marginTop: '2px' }}>{leg.route}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#1e1208' }}>{leg.flight}</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>{leg.airline}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0', alignItems: 'center', margin: '16px 0' }}>
                <div style={{ textAlign: 'left', minWidth: '110px' }}>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: leg.color, letterSpacing: '-1px' }}>{leg.departs}</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#2a1a0a' }}>{leg.from}</div>
                  <div style={{ fontSize: '11px', color: '#999' }}>{leg.date}</div>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 16px' }}>
                  <div style={{ fontSize: '11px', color: '#888', fontWeight: 500, letterSpacing: '0.3px' }}>{leg.duration}</div>
                  <div style={{ width: '100%', height: '1.5px', background: `linear-gradient(to right, ${leg.color}60, ${leg.color})`, margin: '6px 0', position: 'relative' }}>
                    <span style={{ position: 'absolute', right: '-6px', top: '-5px', fontSize: '12px', color: leg.color }}>✈</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#aaa' }}>{leg.cabin}</div>
                </div>
                <div style={{ textAlign: 'right', minWidth: '110px' }}>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: leg.color, letterSpacing: '-1px' }}>{leg.arrives}</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#2a1a0a' }}>{leg.to}</div>
                  <div style={{ fontSize: '11px', color: '#999' }}>{leg.arrivalDate}</div>
                </div>
              </div>

              <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '14px', borderTop: '1px solid #e8e0d0', paddingTop: '10px' }}>{leg.terminal}</div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Confirmation / record locator"
                  value={notes[i] || ''}
                  onChange={e => setNotes(prev => ({ ...prev, [i]: e.target.value }))}
                  style={{
                    flex: 1, fontSize: '13px', padding: '7px 10px', borderRadius: '6px',
                    border: '1.5px solid #d0c8b8', background: 'rgba(255,255,255,0.8)',
                    outline: 'none', fontFamily: 'inherit',
                  }}
                />
                {notes[i] && <span style={{ fontSize: '11px', color: '#4a8a4a', fontWeight: 600 }}>✓ Saved</span>}
              </div>
            </div>
          </div>
        ))}
        <div style={{
          background: 'rgba(248,244,236,0.8)', borderRadius: '10px', padding: '14px 18px',
          fontSize: '12px', color: '#7a6a5a', lineHeight: '1.6',
          border: '1px solid #e0d8c8',
        }}>
          <strong style={{ color: '#3a2a1a' }}>Open-jaw routing.</strong> Outbound on NH111 (ORD→HND, nonstop).
          Return on NH843 (KIX→ORD, nonstop). Book as two separate one-ways on ana.co.jp.
          Haruka Express from Kyoto Station to KIX takes ~75 minutes — allow 3 hours before departure.
        </div>
      </div>
    </div>
  );
};


const DocsPage: React.FC = () => {
  const { documents, addDocument, removeDocument, toggleDocsPage } = useStore();
  const inputRefs = React.useRef<Record<number, HTMLInputElement | null>>({});

  const catLabels: Record<string,string> = {
    hotel:'Hotel', restaurant:'Dining', museum:'Museum',
    shop:'Shopping', transit:'Transit', nature:'Nature'
  };

  const openDoc = (doc: DocEntry) => {
    const win = window.open();
    if (!win) return;
    if (doc.mime === 'application/pdf') {
      win.document.write(`<iframe src="${doc.b64}" style="width:100%;height:100vh;border:none"/>`);
    } else {
      win.document.write(`<img src="${doc.b64}" style="max-width:100%;display:block;margin:auto"/>`);
    }
  };

  const handleFiles = (dayId: number, files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => addDocument(dayId, { name: file.name, b64: reader.result as string, mime: file.type });
      reader.readAsDataURL(file);
    });
  };

  const totalDocs = Object.values(documents).reduce((n, arr) => n + (arr?.length ?? 0), 0);

  return (
    <div className="docs-page">
      <div className="docs-page-header">
        <div>
          <h2 className="docs-page-title">📎 Documents & Confirmations</h2>
          <p className="docs-page-sub">{totalDocs} file{totalDocs !== 1 ? 's' : ''} stored across all days</p>
        </div>
        <button className="docs-close-btn" onClick={toggleDocsPage}>✕ Close</button>
      </div>

      <div className="docs-grid">
        {Array.from({ length: 18 }, (_, i) => i + 1).map(day => {
          const docs = documents[day] || [];
          const meta = dayMeta[day];
          const region = regionMap[day];
          const color = regionColors[region];
          return (
            <div key={day} className={`docs-day-card ${docs.length > 0 ? 'has-docs' : ''}`}
              style={{ '--rc': color } as React.CSSProperties}>
              <div className="docs-day-header">
                <span className="docs-day-num" style={{ color }}>Day {day}</span>
                <span className="docs-day-title">{meta.title}</span>
                <span className="docs-day-region">{region}</span>
              </div>
              {docs.length > 0 && (
                <ul className="docs-file-list">
                  {docs.map((doc, idx) => (
                    <li key={idx} className="docs-file-item">
                      <span className="docs-file-icon">
                        {doc.mime === 'application/pdf' ? '📄' : '🖼'}
                      </span>
                      <span className="docs-file-name">{doc.name}</span>
                      <div className="docs-file-actions">
                        <button className="docs-file-btn view" onClick={() => openDoc(doc)}>View</button>
                        <button className="docs-file-btn del" onClick={() => removeDocument(day, idx)}>✕</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <input
                ref={el => { inputRefs.current[day] = el; }}
                type="file" accept=".pdf,.png,.jpg,.jpeg,.webp" multiple
                style={{ display: 'none' }}
                onChange={e => handleFiles(day, e.target.files)}
              />
              <button className="docs-upload-btn" onClick={() => inputRefs.current[day]?.click()}>
                + Upload
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const DayNav: React.FC = () => {
  const { activeDay, setActiveDay } = useStore();
  const activeGroup = regionGroups.find(g => g.days.includes(activeDay)) || regionGroups[0];

  const h2r = (hex: string, a: number) => {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return `rgba(${r},${g},${b},${a})`;
  };

  const tabIcons: Record<string,React.ReactNode> = {
    Tokyo: (
      <svg viewBox="0 0 14 20" width="11" height="15" aria-hidden="true">
        <ellipse cx="7" cy="13" rx="4.5" ry="5.5" fill="none" stroke="currentColor" strokeWidth="1.1"/>
        <line x1="7" y1="7.5" x2="7" y2="5" stroke="currentColor" strokeWidth="1"/>
        <line x1="5" y1="5" x2="9" y2="5" stroke="currentColor" strokeWidth="1"/>
        <line x1="3.5" y1="11" x2="10.5" y2="11" stroke="currentColor" strokeWidth="0.7"/>
        <line x1="3" y1="13.5" x2="11" y2="13.5" stroke="currentColor" strokeWidth="0.7"/>
      </svg>
    ),
    Hakone: (
      <svg viewBox="0 0 20 15" width="14" height="10" aria-hidden="true">
        <path d="M2 14 L10 1 L18 14Z" fill="none" stroke="currentColor" strokeWidth="1.1"/>
        <path d="M7 14 L9 9.5 L11 14" fill="none" stroke="currentColor" strokeWidth="0.9"/>
        <path d="M0 14 L20 14" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.5"/>
        <path d="M7 5 Q10 3 13 5" fill="none" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.6"/>
      </svg>
    ),
    Osaka: (
      <svg viewBox="0 0 18 17" width="13" height="12" aria-hidden="true">
        <line x1="4" y1="16" x2="4" y2="6" stroke="currentColor" strokeWidth="1.2"/>
        <line x1="14" y1="16" x2="14" y2="6" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M1 8.5 L17 8.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M2.5 11.5 L15.5 11.5" stroke="currentColor" strokeWidth="1"/>
        <path d="M0 8.5 Q9 4 18 8.5" stroke="currentColor" strokeWidth="1"/>
      </svg>
    ),
    Kyoto: (
      <svg viewBox="0 0 18 18" width="12" height="12" aria-hidden="true">
        <circle cx="9" cy="9" r="2.2" fill="none" stroke="currentColor" strokeWidth="0.9"/>
        <ellipse cx="9" cy="3.2" rx="1.8" ry="2.8" fill="none" stroke="currentColor" strokeWidth="0.9"/>
        <ellipse cx="9" cy="14.8" rx="1.8" ry="2.8" fill="none" stroke="currentColor" strokeWidth="0.9"/>
        <ellipse cx="3.2" cy="9" rx="2.8" ry="1.8" fill="none" stroke="currentColor" strokeWidth="0.9"/>
        <ellipse cx="14.8" cy="9" rx="2.8" ry="1.8" fill="none" stroke="currentColor" strokeWidth="0.9"/>
      </svg>
    ),
  };

  const sootSlots = React.useMemo(() =>
    [9,22,37,53,68,83].map((lp,i) => ({ lp, sz: 8 + (i%3)*4, delay: i*1.65 })), []);

  return (
    <div
      className="ghibli-nav"
      style={{ '--nav-glow': h2r(activeGroup.color, 0.20) } as React.CSSProperties}
    >
      {/* ── soot sprites ── */}
      {sootSlots.map(({ lp, sz, delay }, i) => (
        <span
          key={i}
          className="kurosuke"
          style={{ left: `${lp}%`, width: sz, height: sz, animationDelay: `${delay}s` }}
        />
      ))}

      {/* ── region tabs ── */}
      <div className="ghibli-tabs">
        {regionGroups.map(g => {
          const on = activeGroup.name === g.name;
          return (
            <button
              key={g.name}
              onClick={() => setActiveDay(g.days[0])}
              className={`ghibli-tab${on ? ' ghibli-tab--on' : ''}`}
              style={{
                '--rc':  g.color,
                '--rcf': h2r(g.color, 0.18),
              } as React.CSSProperties}
            >
              <span className="ghibli-tab-icon">{tabIcons[g.name]}</span>
              {g.name}
            </button>
          );
        })}
      </div>

      {/* ── day seed vine ── */}
      <div className="ghibli-vine-row">
        {activeGroup.days.map((d, idx) => (
          <React.Fragment key={d}>
            {idx > 0 && (
              <svg width="16" height="34" viewBox="0 0 16 34" className="vine-seg" aria-hidden="true">
                <path
                  d={idx % 2 === 0
                    ? 'M8 0 Q3 8 8 17 Q13 26 8 34'
                    : 'M8 0 Q13 8 8 17 Q3 26 8 34'}
                  stroke={activeGroup.color}
                  strokeWidth="1.1"
                  strokeOpacity="0.32"
                  fill="none"
                />
                {idx % 3 === 1 && (
                  <ellipse cx="8" cy="17" rx="3" ry="1.8" fill={activeGroup.color} fillOpacity="0.28"/>
                )}
              </svg>
            )}
            <button
              onClick={() => setActiveDay(d)}
              className={`ghibli-seed${activeDay === d ? ' ghibli-seed--on' : ''}`}
              style={{
                '--rc':  activeGroup.color,
                '--rcg': h2r(activeGroup.color, 0.48),
              } as React.CSSProperties}
            >
              {d}
            </button>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const EditModeToggle: React.FC = () => {
  const { editMode, toggleEditMode } = useStore();
  return (
    <button onClick={toggleEditMode} className={`fab-btn ${editMode ? 'active' : ''}`}>
      {editMode ? <Check style={{ width: '20px', height: '20px' }} /> : <Edit3 style={{ width: '20px', height: '20px' }} />}
    </button>
  );
};

// ── AI Live Planner ───────────────────────────────────────────────────────────
interface AIChatMsg { role: 'user' | 'assistant'; content: string; }
interface AISuggestedAct { time: string; title: string; type: string; lat: number; lng: number; desc: string; }

const AIPlanner: React.FC = () => {
  const { aiPlannerOpen, toggleAIPlanner, activeDay, aiSuggestions, addAiSuggestion, removeAiSuggestion } = useStore();
  const [msgs, setMsgs] = React.useState<AIChatMsg[]>([]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [parsedSuggestions, setParsedSuggestions] = React.useState<AISuggestedAct[]>([]);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, loading]);

  if (!aiPlannerOpen) return null;

  const region = regionMap[activeDay] || 'tokyo';
  const dayActs: Activity[] = (activities as any)[activeDay] || [];
  const aiAdded = aiSuggestions[activeDay] || [];

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setParsedSuggestions([]);
    const newMsgs: AIChatMsg[] = [...msgs, { role: 'user', content: userMsg }];
    setMsgs(newMsgs);
    setLoading(true);
    try {
      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          day: activeDay,
          region,
          dayTitle: (dayMeta as any)[activeDay]?.title || '',
          activities: dayActs.map(a => ({ time: a.time, title: a.title, type: a.type })),
          message: userMsg,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const reply: string = data.reply || 'Something went wrong.';
      const match = reply.match(/```suggestions\n([\s\S]*?)\n```/);
      if (match) {
        try { setParsedSuggestions(JSON.parse(match[1])); } catch {}
      }
      const cleanReply = reply.replace(/```suggestions[\s\S]*?```/g, '').trim();
      setMsgs(prev => [...prev, { role: 'assistant', content: cleanReply }]);
    } catch (e: any) {
      setMsgs(prev => [...prev, { role: 'assistant', content: `⚠ ${e.message || 'Error reaching AI.'}` }]);
    }
    setLoading(false);
  };

  const color = regionColors[region];

  return (
    <div className="ai-panel">
      <div className="ai-panel-header" style={{ borderBottom: `2px solid ${color}30` }}>
        <div>
          <span className="ai-panel-title" style={{ color }}>✦ Live Planner</span>
          <span className="ai-panel-day">Day {activeDay} · {region.charAt(0).toUpperCase() + region.slice(1)}</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button className="ai-close-btn" onClick={toggleAIPlanner}>✕</button>
        </div>
      </div>

      

      <div className="ai-context">
        <div className="ai-context-label">Today's plan</div>
        {dayActs.slice(0, 6).map((a, i) => (
          <div key={i} className="ai-context-item">
            <span className="ai-ctx-time">{a.time}</span>
            <span className="ai-ctx-title">{a.title}</span>
          </div>
        ))}
        {aiAdded.length > 0 && <>
          <div className="ai-context-label" style={{ marginTop: '8px', color }}>Added by AI</div>
          {aiAdded.map((a, i) => (
            <div key={i} className="ai-context-item ai-context-item--added">
              <span className="ai-ctx-time">{a.time}</span>
              <span className="ai-ctx-title">{a.title}</span>
              <button className="ai-ctx-remove" onClick={() => removeAiSuggestion(activeDay, i)}>✕</button>
            </div>
          ))}
        </>}
      </div>

      <div className="ai-messages" ref={scrollRef}>
        {msgs.length === 0 && (
          <div className="ai-empty">
            <div className="ai-empty-icon">✦</div>
            <p>Tell me what you feel like doing, where you are, or what you want to change about today.</p>
            <div className="ai-chips">
              {["We're enjoying Shibuya — what else is nearby?", "Find us a great ramen spot right now", "We're tired, suggest a quiet afternoon", "What's walkable from here in the next 2 hrs?"].map(q => (
                <button key={q} className="ai-chip" onClick={() => { setInput(q); }}>{q}</button>
              ))}
            </div>
          </div>
        )}
        {msgs.map((m, i) => (
          <div key={i} className={`ai-msg ai-msg--${m.role}`}>
            {m.role === 'assistant' && <span className="ai-msg-avatar" style={{ color }}>✦</span>}
            <p className="ai-msg-text">{m.content}</p>
          </div>
        ))}
        {loading && (
          <div className="ai-msg ai-msg--assistant">
            <span className="ai-msg-avatar" style={{ color }}>✦</span>
            <p className="ai-msg-text ai-thinking">thinking<span>.</span><span>.</span><span>.</span></p>
          </div>
        )}
        {parsedSuggestions.length > 0 && (
          <div className="ai-suggestions">
            <div className="ai-suggestions-label">Suggested additions</div>
            {parsedSuggestions.map((s, i) => (
              <div key={i} className="ai-suggestion-card" style={{ borderColor: `${color}50` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <div>
                    <div className="ai-sug-time" style={{ color }}>{s.time}</div>
                    <div className="ai-sug-title">{s.title}</div>
                    <div className="ai-sug-desc">{s.desc}</div>
                  </div>
                  <button className="ai-add-btn" style={{ background: color, borderColor: color }}
                    onClick={() => {
                      addAiSuggestion(activeDay, { lat: s.lat, lng: s.lng, title: s.title, time: s.time, type: s.type as any, desc: s.desc });
                      setParsedSuggestions(prev => prev.filter((_, j) => j !== i));
                    }}>
                    + Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="ai-input-row">
        <input className="ai-input" placeholder="What would you like to do?"
          value={input} disabled={loading}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') send(); }} />
        <button className="ai-send-btn" onClick={send} disabled={loading || !input.trim()}
          style={{ background: color, opacity: (loading || !input.trim()) ? 0.4 : 1 }}>
          {loading ? '…' : '✦'}
        </button>
      </div>
    </div>
  );
};

// --- MAIN RUNNER LAYOUT ---

// ── Smooth value animator ─────────────────────────────────────────────────────
const _animVal = (from: number, to: number, ms: number, cb: (v: number) => void, done?: () => void) => {
  const t0 = performance.now();
  const step = (now: number) => {
    const t = Math.min((now - t0) / ms, 1);
    const e = t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
    cb(from + (to - from) * e);
    if (t < 1) requestAnimationFrame(step); else done?.();
  };
  requestAnimationFrame(step);
};

// ── Particle types ────────────────────────────────────────────────────────────
interface _P { x:number; y:number; vx:number; vy:number; sz:number; op:number; maxOp:number; rot:number; vrot:number; life:number; maxLife:number; phase:number; color:string; }

const _sakura = (W:number, H:number, tint:'warm'|'cool'='warm'): _P => {
  const warm = ['#ffb7c5','#ffc0cb','#ffd0dc','#ffaabb','#ff9eb5'];
  const cool = ['#c8d8e8','#d8c8e0','#e0d4e8','#c0d0e0','#d0c8dc'];
  const cols = tint === 'cool' ? cool : warm;
  return { x: Math.random()*W, y: -20-Math.random()*H*0.4, vx: (Math.random()-.5)*.6, vy: .5+Math.random()*.7,
    sz: 4+Math.random()*5, op:0, maxOp:.22+Math.random()*.28, rot:Math.random()*Math.PI*2, vrot:(Math.random()-.5)*.035,
    life:0, maxLife:270+Math.random()*200, phase:Math.random()*Math.PI*2, color:cols[Math.floor(Math.random()*cols.length)] };
};
const _firefly = (W:number, H:number): _P => ({
  x:Math.random()*W, y:H+Math.random()*60, vx:(Math.random()-.5)*.7, vy:-(0.28+Math.random()*.55),
  sz:1.5+Math.random()*2.5, op:0, maxOp:.55+Math.random()*.35, rot:0, vrot:0,
  life:0, maxLife:260+Math.random()*280, phase:Math.random()*Math.PI*2,
  color:['#ff9500','#ffaa20','#ffb840','#ff7500','#ffc050'][Math.floor(Math.random()*5)],
});
const _mist = (W:number, H:number): _P => ({
  x:Math.random()*W, y:Math.random()*H, vx:(Math.random()-.5)*.1, vy:-.04-.06*Math.random(),
  sz:90+Math.random()*130, op:0, maxOp:.028+Math.random()*.025, rot:0, vrot:0,
  life:0, maxLife:500+Math.random()*400, phase:Math.random()*Math.PI*2, color:'#e8f2f8',
});
const _spawn = (region:string, W:number, H:number): _P => {
  if (region==='osaka') return _firefly(W,H);
  if (region==='hakone') return _mist(W,H);
  if (region==='kyoto') return _sakura(W,H,'cool');
  return _sakura(W,H,'warm');
};
const _regionCount: Record<string,number> = { tokyo:18, kyoto:16, hakone:7, osaka:22 };

const ParticleCanvas: React.FC = () => {
  const { activeDay } = useStore();
  const region = regionMap[activeDay] || 'tokyo';
  const cvRef = React.useRef<HTMLCanvasElement>(null);
  const ptRef = React.useRef<_P[]>([]);
  const rafRef = React.useRef(0);
  const rRef = React.useRef('');

  React.useEffect(() => {
    const cv = cvRef.current; if (!cv) return;
    const ctx = cv.getContext('2d'); if (!ctx) return;
    const resize = () => { cv.width = window.innerWidth; cv.height = window.innerHeight; };
    resize(); window.addEventListener('resize', resize);

    if (rRef.current !== region) {
      rRef.current = region;
      const n = _regionCount[region] || 0;
      ptRef.current = Array.from({length:n}, () => {
        const p = _spawn(region, cv.width, cv.height);
        p.life = Math.floor(Math.random() * p.maxLife);
        return p;
      });
    }

    const tick = () => {
      const W = cv.width, H = cv.height;
      ctx.clearRect(0,0,W,H);
      ptRef.current.forEach((p,i) => {
        p.life++;
        const lr = p.life / p.maxLife;
        p.op = lr < .12 ? (lr/.12)*p.maxOp : lr > .82 ? ((1-lr)/.18)*p.maxOp : p.maxOp;
        if (region==='osaka') {
          p.x += p.vx + Math.sin(p.life*.025+p.phase)*.35;
          p.y += p.vy;
          p.op *= .92 + Math.sin(p.life*.15+p.phase)*.08;
        } else if (region==='hakone') {
          p.x += p.vx; p.y += p.vy;
        } else {
          p.x += p.vx + Math.sin(p.life*.018+p.phase)*.45;
          p.y += p.vy; p.rot += p.vrot;
        }
        if (p.life>=p.maxLife || p.y>H+80 || p.y<-p.sz*2)
          ptRef.current[i] = _spawn(region,W,H);

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.op));
        if (region==='tokyo'||region==='kyoto') {
          ctx.translate(p.x,p.y); ctx.rotate(p.rot);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          const s=p.sz;
          ctx.moveTo(0,-s); ctx.bezierCurveTo(s*.9,-s*.5,s*.9,s*.5,0,s);
          ctx.bezierCurveTo(-s*.9,s*.5,-s*.9,-s*.5,0,-s); ctx.fill();
        } else if (region==='osaka') {
          ctx.shadowColor=p.color; ctx.shadowBlur=p.sz*5;
          ctx.fillStyle=p.color; ctx.beginPath();
          ctx.arc(p.x,p.y,p.sz,0,Math.PI*2); ctx.fill();
        } else if (region==='hakone') {
          const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.sz);
          g.addColorStop(0,'rgba(220,235,248,0.85)'); g.addColorStop(1,'rgba(220,235,248,0)');
          ctx.fillStyle=g; ctx.beginPath(); ctx.arc(p.x,p.y,p.sz,0,Math.PI*2); ctx.fill();
        }
        ctx.restore();
      });
      rafRef.current = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(rafRef.current);
      else tick();
    };
    document.addEventListener('visibilitychange', onVisibility);

    tick();
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [region]);

  return <canvas ref={cvRef} style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:8,opacity:.9}} />;
};


const App: React.FC = () => {
  const { editMode, docsPageOpen, hotelsOpen, flightOpen, restaurantsOpen, activitiesOpen, bookingOpen, activeDay, setActiveDay, storyDay, aiPlannerOpen } = useStore();
  const touchStartRef = React.useRef(0);
  const [mobileTab, setMobileTab] = React.useState<'journal'|'map'>('journal');
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
      <div className={`app-container mobile-view-${mobileTab}${storyDay !== null ? ' story-mode' : ''}`}>
        <AmbientLayer />
        <ParticleCanvas />
        <Header />
        <DayNav />
        {/* region groups now shown in DayNav */}
        {docsPageOpen && <DocsPage />}
       {hotelsOpen && <HotelsPanel />}
       {flightOpen && <FlightPanel />}
       {restaurantsOpen && <RestaurantsPanel />}
       {activitiesOpen && <ActivitiesPanel />}
       {bookingOpen && <BookingPanel />}
        <main className="main-content" style={{ display: docsPageOpen ? 'none' : undefined }}>
          <section className="journal-pane-wrapper" id="journal-pane"
            style={{ borderRight: '1px solid var(--paper-fold)', boxShadow: editMode ? 'inset 0 0 0 2px var(--amber)' : 'none' }}
            onTouchStart={e => { touchStartRef.current = e.touches[0].clientX; }}
            onTouchEnd={e => {
              const diff = touchStartRef.current - e.changedTouches[0].clientX;
              if (Math.abs(diff) > 55) {
                if (diff > 0 && activeDay < 19) setActiveDay(activeDay + 1);
                else if (diff < 0 && activeDay > 1) setActiveDay(activeDay - 1);
              }
            }}
          >
            <JournalPane />
          </section>
          <section className="map-pane-wrapper" id="map-pane">
            <MapPane />
          </section>
        </main>
        <EditModeToggle />
        <PhrasebookDrawer />
        <StoryOverlay />
        {aiPlannerOpen && <AIPlanner />}
      </div>

      {/* Mobile bottom tab bar */}
      <nav className="mobile-tab-bar">
        <button className={`mobile-tab-btn${mobileTab==='journal'?' active':''}`} onClick={()=>setMobileTab('journal')}>
          <span>📔</span><span className="mobile-tab-label">Journal</span>
        </button>
        <button className={`mobile-tab-btn${mobileTab==='map'?' active':''}`} onClick={()=>setMobileTab('map')}>
          <span>🗺</span><span className="mobile-tab-label">Map</span>
        </button>
      </nav>
    </APIProvider>
  );
};

export { App as TripAppInner };

    
