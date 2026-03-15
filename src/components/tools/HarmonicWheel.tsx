import React, { useState, useRef } from 'react';
import { Target, Music2, Cpu, Activity, Info } from 'lucide-react';

interface CamelotKey {
  number: number;
  minor: string;
  major: string;
  color: string;
}

const CAMELOT_KEYS: CamelotKey[] = [
  { number: 1, minor: 'Abm', major: 'B', color: '#00D6BA' }, // Turquoise
  { number: 2, minor: 'Ebm', major: 'F#', color: '#80E53B' }, // Light Green
  { number: 3, minor: 'Bbm', major: 'Db', color: '#ADF035' }, // Lime
  { number: 4, minor: 'Fm', major: 'Ab', color: '#E6F333' }, // Yellow
  { number: 5, minor: 'Cm', major: 'Eb', color: '#FFD32F' }, // Gold
  { number: 6, minor: 'Gm', major: 'Bb', color: '#FF9732' }, // Orange
  { number: 7, minor: 'Dm', major: 'F', color: '#FF593B' }, // Red
  { number: 8, minor: 'Am', major: 'C', color: '#FF4189' }, // Pink
  { number: 9, minor: 'Em', major: 'G', color: '#FF4DAF' }, // Magenta
  { number: 10, minor: 'Bm', major: 'D', color: '#9B5BFF' }, // Purple
  { number: 11, minor: 'F#m', major: 'A', color: '#4F70FF' }, // Blue
  { number: 12, minor: 'Dbm', major: 'E', color: '#1CA8FF' }, // Light Blue
];

const GENRE_KEYS = {
  'טראנס': ['8B', '8A', '9B', '9A'],
  'טק הוס': ['5A', '6A', '6B', '12A'],
  'אלקטרו הוס': ['1B', '2B', '3B', '4B'],
  'פרוגרסיבי': ['10B', '11B', '12B', '1B'],
  'דראם וביס': ['9A', '9B', '10A', '10B'],
};

type KeyType = 'A' | 'B';

interface HarmonicMatch {
  key: string;
  compatibility: 'perfect' | 'compatible' | 'energy_change' | 'clash';
  label: string;
  color: string;
}

export default function HarmonicWheel() {
  const [selectedKey, setSelectedKey] = useState<string | null>('8A');
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const CENTER_X = 200;
  const CENTER_Y = 200;
  const RADIUS_OUTER = 180;
  const RADIUS_INNER = 120;
  const RADIUS_CENTER = 60;

  const getKeyColor = (keyNumber: number): string => {
    return CAMELOT_KEYS[keyNumber - 1]?.color || '#666';
  };

  const getCompatibility = (selected: string, check: string): HarmonicMatch => {
    if (selected === check) {
      return { key: check, compatibility: 'perfect', label: 'Harmonic Lock (Perfect)', color: '#00D6BA' };
    }

    const selectedNum = parseInt(selected.slice(0, -1));
    const checkNum = parseInt(check.slice(0, -1));
    const selectedType = selected.slice(-1) as KeyType;
    const checkType = check.slice(-1) as KeyType;

    // Same number, different type (energy change)
    if (selectedNum === checkNum && selectedType !== checkType) {
      return { key: check, compatibility: 'energy_change', label: 'Energy Shift (Modulation)', color: '#FF4189' };
    }

    // Adjacent keys (±1)
    const diff = Math.abs(selectedNum - checkNum);
    if (diff === 1 || diff === 11) {
      if (selectedType === checkType) {
        return { key: check, compatibility: 'compatible', label: 'Adjacent Flow (Compatible)', color: '#FFD32F' };
      }
    }

    return { key: check, compatibility: 'clash', label: 'Frequency Clash', color: '#FF593B' };
  };

  const getCompatibleKeys = (): HarmonicMatch[] => {
    if (!selectedKey) return [];
    const compatible: HarmonicMatch[] = [];

    for (let i = 1; i <= 12; i++) {
      for (const type of ['A', 'B'] as KeyType[]) {
        const key = `${i}${type}`;
        const match = getCompatibility(selectedKey, key);
        compatible.push(match);
      }
    }

    return compatible.sort((a, b) => {
      const order = { perfect: 0, compatible: 1, energy_change: 2, clash: 3 };
      return order[a.compatibility] - order[b.compatibility];
    });
  };

  const renderKeySegment = (number: number, type: KeyType, index: number) => {
    // Camelot wheel standard: 8 is at 12 o'clock (top).
    const angle = (number - 8) * (Math.PI / 6) - (Math.PI / 2);

    const isMinor = type === 'A';
    const radiusInnerArc = isMinor ? RADIUS_CENTER : RADIUS_INNER;
    const radiusOuterArc = isMinor ? RADIUS_INNER : RADIUS_OUTER;

    const startAngle = angle - Math.PI / 12;
    const endAngle = angle + Math.PI / 12;

    const x1_out = CENTER_X + Math.cos(startAngle) * radiusOuterArc;
    const y1_out = CENTER_Y + Math.sin(startAngle) * radiusOuterArc;
    const x2_out = CENTER_X + Math.cos(endAngle) * radiusOuterArc;
    const y2_out = CENTER_Y + Math.sin(endAngle) * radiusOuterArc;

    const x1_in = CENTER_X + Math.cos(startAngle) * radiusInnerArc;
    const y1_in = CENTER_Y + Math.sin(startAngle) * radiusInnerArc;
    const x2_in = CENTER_X + Math.cos(endAngle) * radiusInnerArc;
    const y2_in = CENTER_Y + Math.sin(endAngle) * radiusInnerArc;

    const pathD = `
      M ${x1_in} ${y1_in}
      L ${x1_out} ${y1_out}
      A ${radiusOuterArc} ${radiusOuterArc} 0 0 1 ${x2_out} ${y2_out}
      L ${x2_in} ${y2_in}
      A ${radiusInnerArc} ${radiusInnerArc} 0 0 0 ${x1_in} ${y1_in}
      Z
    `;

    const camelotKey = CAMELOT_KEYS[number - 1];
    const keyLabel = camelotKey ? (isMinor ? camelotKey.minor : camelotKey.major) : '';
    const keyId = `${number}${type}`;
    const compatibility = selectedKey ? getCompatibility(selectedKey, keyId) : null;

    let fillColor = getKeyColor(number);
    let opacity = '1';
    let strokeColor = 'rgba(255,255,255,0.03)';
    let strokeWidth = '1';
    let filter = '';

    if (selectedKey === keyId) {
      strokeColor = '#fff';
      strokeWidth = '3';
      opacity = '1';
      filter = 'drop-shadow(0 0 15px rgba(255,255,255,0.8))';
    } else if (selectedKey && compatibility) {
      if (compatibility.compatibility === 'perfect') {
        fillColor = '#00D6BA';
        strokeColor = '#00D6BA';
        strokeWidth = '2';
        opacity = '1';
        filter = 'drop-shadow(0 0 10px rgba(0,214,186,0.6))';
      } else if (compatibility.compatibility === 'compatible') {
        opacity = '0.9';
        strokeColor = 'rgba(255,211,47,0.5)';
        strokeWidth = '1.5';
      } else if (compatibility.compatibility === 'energy_change') {
        opacity = '0.7';
        strokeColor = 'rgba(255,65,137,0.5)';
      } else {
        opacity = '0.1'; // Deeply fade clashes
      }
    }

    if (hoveredKey === keyId && selectedKey !== keyId) {
      strokeColor = '#fff';
      strokeWidth = '2';
      opacity = '0.9';
    }

    const midRadius = (radiusInnerArc + radiusOuterArc) / 2;
    const cx = CENTER_X + Math.cos(angle) * midRadius;
    const cy = CENTER_Y + Math.sin(angle) * midRadius;
    const isSelected = selectedKey === keyId;

    return (
      <g
        key={keyId}
        style={{ cursor: 'pointer', outline: 'none' }}
        onClick={() => setSelectedKey(keyId)}
        onMouseEnter={() => setHoveredKey(keyId)}
        onMouseLeave={() => setHoveredKey(null)}
      >
        <path
          d={pathD}
          fill={fillColor}
          fillOpacity={opacity}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          style={{ filter, transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={fillColor === '#FFD32F' || fillColor === '#ADF035' || fillColor === '#E6F333' || fillColor === '#80E53B' ? '#000' : '#fff'} // Black text for bright colors
          pointerEvents="none"
          style={{ 
            userSelect: 'none', 
            transition: 'all 0.3s ease', 
            opacity: (compatibility && compatibility.compatibility === 'clash' && !isSelected) ? 0.3 : 1 
          }}
        >
          <tspan x={cx} dy="-0.1em" fontSize={isMinor ? "16" : "18"} fontWeight="900" fontFamily="monospace">{keyId}</tspan>
          <tspan x={cx} dy="1.4em" fontSize={isMinor ? "10" : "11"} fontWeight="700" opacity="0.8">{keyLabel}</tspan>
        </text>
      </g>
    );
  };

  const compatibleKeys = getCompatibleKeys();

  return (
    <div className="w-full flex flex-col gap-6 font-sans antialiased" dir="rtl">
      
      {/* Top LCD Dashboard Metrics */}
      <div className="bg-[#0f0f16] border border-white/5 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] p-6 relative overflow-hidden">
         <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#b500ff] to-[#00e5ff] opacity-80"></div>
         
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#05050A] border border-white/10 flex items-center justify-center shadow-inner">
                 <Target size={24} className="text-[#00e5ff]" />
              </div>
              <div>
                 <h1 className="text-xl font-bold text-white tracking-widest uppercase mb-1">מנוע התאמה הרמונית</h1>
                 <p className="text-xs text-white/40 tracking-wider font-mono">Select a root key to analyze compatible transition frequencies.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-[#05050A] border border-white/5 rounded-lg px-4 py-2.5">
               <span className="w-2 h-2 rounded-full bg-[#00e5ff] shadow-[0_0_8px_#00e5ff] animate-pulse"></span>
               <span className="text-[10px] font-mono font-bold text-white/50 tracking-wideset uppercase">Engine Status:</span>
               <span className="text-[10px] font-mono font-black text-[#00e5ff] tracking-wideset uppercase">Online</span>
            </div>
         </div>
      </div>

      {/* Main Interface Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 min-h-[600px] items-start">
        
        {/* Left Side: Info & Legend Panel (Col Span 4) */}
        <div className="xl:col-span-4 flex flex-col gap-6 min-w-0 w-full h-full">
           
           {/* Current Target Block */}
           <div className="bg-[#0f0f16] border border-white/5 rounded-2xl shadow-xl flex flex-col overflow-hidden text-center relative p-8">
              <div className="absolute inset-0 bg-gradient-to-b from-[#b500ff]/5 to-transparent pointer-events-none"></div>
              
              <h2 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4">Root Frequency (Target)</h2>
              
              {selectedKey ? (
                <div className="flex flex-col items-center">
                   <div 
                      className="text-7xl font-black mb-2 transition-colors duration-500 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]" 
                      style={{ color: getKeyColor(parseInt(selectedKey)) }}
                    >
                     {selectedKey}
                   </div>
                   <div className="bg-[#05050A] border border-white/[0.04] rounded-lg px-6 py-4 w-full mt-4 text-left shadow-inner" dir="ltr">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Base Note</span>
                        <span className="text-sm font-bold text-white">{CAMELOT_KEYS[parseInt(selectedKey) - 1]?.[selectedKey.endsWith('A') ? 'minor' : 'major'] ?? ''}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Scale Type</span>
                        <span className="text-sm font-bold text-white">{selectedKey.endsWith('A') ? 'Minor' : 'Major'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Wheel Position</span>
                        <span className="text-sm font-bold text-white font-mono">{selectedKey.slice(0, -1)}</span>
                      </div>
                   </div>
                </div>
              ) : (
                <div className="py-12 flex items-center justify-center">
                   <span className="text-white/20 font-bold uppercase tracking-widest">Awaiting Input...</span>
                </div>
              )}
           </div>

           {/* Diagnostics / Compatibility Legend */}
           <div className="bg-[#0f0f16] border border-white/5 rounded-2xl shadow-xl p-6">
              <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4 border-b border-white/5 pb-3 flex items-center gap-2"><Activity size={12} className="text-[#ff0055]" /> Compatibility Matrix</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded bg-[#00D6BA] shadow-[0_0_8px_#00D6BA]" />
                  <span className="text-xs font-bold text-white/80">Harmonic Lock</span>
                  <span className="text-[10px] text-white/40 font-mono tracking-widest align-middle ml-auto" dir="ltr">0% SHIFT</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded bg-[#FFD32F] shadow-[0_0_8px_#FFD32F]" />
                  <span className="text-xs font-bold text-white/80">Adjacent Flow</span>
                  <span className="text-[10px] text-white/40 font-mono tracking-widest align-middle ml-auto" dir="ltr">±1 KEY</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded bg-[#FF4189] shadow-[0_0_8px_#FF4189]" />
                  <span className="text-xs font-bold text-white/80">Energy Modulation</span>
                  <span className="text-[10px] text-white/40 font-mono tracking-widest align-middle ml-auto" dir="ltr">MIN/MAJ</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded bg-white/10" />
                  <span className="text-xs font-bold text-white/40">Frequency Clash</span>
                  <span className="text-[10px] text-red-500/50 font-mono tracking-widest align-middle ml-auto" dir="ltr">UNSAFE</span>
                </div>
              </div>
           </div>

        </div>

        {/* Right Side: The Physical Wheel UI (Col Span 8) */}
        <div className="xl:col-span-8 bg-[#0f0f16] border border-white/5 rounded-2xl shadow-xl flex flex-col p-8 items-center justify-center relative min-h-[500px] overflow-hidden">
            
            {/* Background Studio Glow */}
            <div 
              className="absolute inset-0 opacity-10 blur-[100px] transition-colors duration-1000"
              style={{ backgroundColor: selectedKey ? getKeyColor(parseInt(selectedKey)) : '#1CA8FF' }}
            ></div>

            <h3 className="absolute top-6 left-6 text-[10px] font-mono font-bold text-white/20 uppercase tracking-[0.3em] z-10">Sensory Input Interface</h3>
            
            {/* The SVG Wheel */}
            <div className="relative z-10 scale-[0.85] sm:scale-100 transition-transform">
              <svg
                ref={svgRef}
                width="400"
                height="400"
                viewBox="0 0 400 400"
                className="drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] filter"
              >
                {/* Center Hub (Hardware Aesthetic) */}
                <circle cx={CENTER_X} cy={CENTER_Y} r={RADIUS_CENTER} fill="#05050A" stroke="#222" strokeWidth="4" />
                <circle cx={CENTER_X} cy={CENTER_Y} r={RADIUS_CENTER - 15} fill="#111" stroke="#333" strokeWidth="1" />
                {/* Spindle hole */}
                <circle cx={CENTER_X} cy={CENTER_Y} r={8} fill="#000" stroke="#444" strokeWidth="2" />

                {/* Render Circular Segments */}
                {CAMELOT_KEYS.map((key) => (
                  <React.Fragment key={key.number}>
                    {renderKeySegment(key.number, 'A', (key.number - 1) * 2)}
                    {renderKeySegment(key.number, 'B', (key.number - 1) * 2 + 1)}
                  </React.Fragment>
                ))}
              </svg>
            </div>
            
        </div>
      </div>

      {/* Output Panel: Analysis Matches */}
      {selectedKey && (
        <div className="bg-[#0f0f16] border border-white/5 rounded-2xl shadow-xl p-6 mt-2 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#00D6BA] via-[#FFD32F] to-[#FF4189]"></div>
          
          <div className="flex items-center gap-3 mb-6 pl-4 border-b border-white/5 pb-4">
             <Cpu size={16} className="text-white/40" />
             <h2 className="text-sm font-bold text-white uppercase tracking-widest">מסלולי מעבר בטוחים (Safe Transitions)</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
            {compatibleKeys.filter(k => k.compatibility !== 'clash').map(({ key, compatibility, label, color }) => (
              <button
                key={key}
                onClick={() => setSelectedKey(key)}
                className="bg-[#05050A] hover:bg-[#11111A] border border-white/[0.04] rounded-xl p-4 transition-all duration-300 text-left flex flex-col relative group overflow-hidden"
                dir="ltr"
              >
                {/* Hover Glow Edge */}
                <div 
                  className="absolute inset-y-0 left-0 w-1 opacity-50 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: color }}
                ></div>

                <div className="flex justify-between items-center w-full mb-2 pl-3">
                   <span 
                     className="text-2xl font-black transition-transform group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_currentColor] origin-left"
                     style={{ color: color }}
                   >
                     {key}
                   </span>
                   <span className="text-[9px] font-mono font-bold tracking-widest border px-1.5 py-0.5 rounded opacity-50" style={{ color: color, borderColor: color }}>
                     {compatibility.toUpperCase()}
                   </span>
                </div>
                
                <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest pl-3 mt-auto">
                   {label}
                </span>
                
                {/* Visual Audio Waveform Hint */}
                <div className="absolute right-3 bottom-3 flex items-end gap-[2px] opacity-10 group-hover:opacity-30 transition-opacity h-4">
                   <div className="w-[2px] h-[40%] bg-white rounded-t-sm"></div>
                   <div className="w-[2px] h-[80%] bg-white rounded-t-sm"></div>
                   <div className="w-[2px] h-[100%]" style={{ backgroundColor: color }}></div>
                   <div className="w-[2px] h-[60%] bg-white rounded-t-sm"></div>
                   <div className="w-[2px] h-[30%] bg-white rounded-t-sm"></div>
                </div>
              </button>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
