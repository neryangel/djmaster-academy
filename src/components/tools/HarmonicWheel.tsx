import React, { useState, useRef, useEffect } from 'react';

interface CamelotKey {
  number: number;
  minor: string;
  major: string;
  color: string;
}

const CAMELOT_KEYS: CamelotKey[] = [
  { number: 1, minor: 'Abm', major: 'B', color: '#FF6B6B' },
  { number: 2, minor: 'Ebm', major: 'F#', color: '#FF8E6B' },
  { number: 3, minor: 'Bbm', major: 'Db', color: '#FFB86B' },
  { number: 4, minor: 'Fm', major: 'Ab', color: '#FFE66B' },
  { number: 5, minor: 'Cm', major: 'Eb', color: '#D4FF6B' },
  { number: 6, minor: 'Gm', major: 'Bb', color: '#6BFF6B' },
  { number: 7, minor: 'Dm', major: 'F', color: '#6BFFD4' },
  { number: 8, minor: 'Am', major: 'C', color: '#6BD4FF' },
  { number: 9, minor: 'Em', major: 'G', color: '#6B8EFF' },
  { number: 10, minor: 'Bm', major: 'D', color: '#8E6BFF' },
  { number: 11, minor: 'F#m', major: 'A', color: '#D46BFF' },
  { number: 12, minor: 'Dbm', major: 'E', color: '#FF6BD4' },
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
}

export default function HarmonicWheel() {
  const [selectedKey, setSelectedKey] = useState<string | null>('8A');
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const CENTER_X = 200;
  const CENTER_Y = 200;
  const RADIUS_OUTER = 140;
  const RADIUS_INNER = 90;
  const RADIUS_CENTER = 50;

  const getKeyColor = (keyNumber: number): string => {
    return CAMELOT_KEYS[keyNumber - 1]?.color || '#666';
  };

  const getCompatibility = (selected: string, check: string): HarmonicMatch => {
    if (selected === check) {
      return { key: check, compatibility: 'perfect', label: 'תאימות מושלמת' };
    }

    const selectedNum = parseInt(selected.slice(0, -1));
    const checkNum = parseInt(check.slice(0, -1));
    const selectedType = selected.slice(-1) as KeyType;
    const checkType = check.slice(-1) as KeyType;

    // Same number, different type (energy change)
    if (selectedNum === checkNum && selectedType !== checkType) {
      return { key: check, compatibility: 'energy_change', label: 'שינוי אנרגיה' };
    }

    // Adjacent keys (±1)
    const diff = Math.abs(selectedNum - checkNum);
    if (diff === 1 || diff === 11) {
      if (selectedType === checkType) {
        return { key: check, compatibility: 'compatible', label: 'תואם' };
      }
    }

    return { key: check, compatibility: 'clash', label: 'התנגשות' };
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
    const angle = ((index * 30) * Math.PI) / 180 - Math.PI / 2;
    const isMinor = type === 'A';
    const radius = isMinor ? RADIUS_INNER : RADIUS_OUTER;

    const x1 = CENTER_X + Math.cos(angle - Math.PI / 12) * radius;
    const y1 = CENTER_Y + Math.sin(angle - Math.PI / 12) * radius;
    const x2 = CENTER_X + Math.cos(angle + Math.PI / 12) * radius;
    const y2 = CENTER_Y + Math.sin(angle + Math.PI / 12) * radius;

    const keyLabel = isMinor ? CAMELOT_KEYS[number - 1].minor : CAMELOT_KEYS[number - 1].major;
    const keyId = `${number}${type}`;
    const compatibility = selectedKey ? getCompatibility(selectedKey, keyId) : null;

    let fillColor = getKeyColor(number);
    let opacity = '1';
    let strokeWidth = '2';

    if (selectedKey === keyId) {
      strokeWidth = '4';
    } else if (selectedKey && compatibility) {
      if (compatibility.compatibility === 'perfect') {
        fillColor = '#00d4ff';
        strokeWidth = '3';
      } else if (compatibility.compatibility === 'compatible') {
        opacity = '0.9';
      } else if (compatibility.compatibility === 'energy_change') {
        opacity = '0.8';
      } else {
        opacity = '0.4';
      }
    }

    if (hoveredKey === keyId) {
      strokeWidth = '3';
    }

    const cx = CENTER_X + Math.cos(angle) * ((radius + RADIUS_CENTER) / 2);
    const cy = CENTER_Y + Math.sin(angle) * ((radius + RADIUS_CENTER) / 2);

    return (
      <g key={keyId}>
        <path
          d={`M ${CENTER_X} ${CENTER_Y} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`}
          fill={fillColor}
          fillOpacity={opacity}
          stroke={selectedKey === keyId ? '#00d4ff' : '#333'}
          strokeWidth={strokeWidth}
          style={{ cursor: 'pointer', transition: 'all 0.2s' }}
          onClick={() => setSelectedKey(keyId)}
          onMouseEnter={() => setHoveredKey(keyId)}
          onMouseLeave={() => setHoveredKey(null)}
        />
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontSize="12"
          fontWeight="bold"
          pointerEvents="none"
          style={{ userSelect: 'none' }}
        >
          {keyLabel}
        </text>
      </g>
    );
  };

  const compatibleKeys = getCompatibleKeys();

  return (
    <div className="w-full h-full p-6 bg-[#0A0A0F] text-white" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-[#00d4ff]">גלגל הרמוני - קמלוט</h1>
        <p className="text-gray-400 mb-6">בחר מפתח לראות תאימויות הרמוניות</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Wheel */}
          <div className="lg:col-span-2 flex justify-center items-center bg-[#1a1a1f] rounded-lg p-6 border border-[#7b2fff]/30">
            <svg
              ref={svgRef}
              width="400"
              height="400"
              viewBox="0 0 400 400"
              style={{ maxWidth: '100%', height: 'auto' }}
            >
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Center circle */}
              <circle cx={CENTER_X} cy={CENTER_Y} r={RADIUS_CENTER} fill="#7b2fff" opacity="0.3" />

              {/* Inner ring label */}
              <text
                x={CENTER_X - 80}
                y={CENTER_Y - RADIUS_CENTER - 20}
                fill="#999"
                fontSize="11"
                fontWeight="bold"
              >
                מינור (A)
              </text>

              {/* Outer ring label */}
              <text
                x={CENTER_X + 80}
                y={CENTER_Y - RADIUS_CENTER - 20}
                fill="#999"
                fontSize="11"
                fontWeight="bold"
              >
                מז'ור (B)
              </text>

              {/* Render all key segments */}
              {CAMELOT_KEYS.map((key) => (
                <React.Fragment key={key.number}>
                  {renderKeySegment(key.number, 'A', (key.number - 1) * 2)}
                  {renderKeySegment(key.number, 'B', (key.number - 1) * 2 + 1)}
                </React.Fragment>
              ))}
            </svg>
          </div>

          {/* Info Panel */}
          <div className="bg-[#1a1a1f] rounded-lg p-6 border border-[#7b2fff]/30 space-y-6">
            {/* Selected Key Info */}
            <div>
              <h2 className="text-lg font-bold text-[#00d4ff] mb-3">מידע על המפתח</h2>
              {selectedKey ? (
                <div>
                  <p className="text-2xl font-bold text-[#00d4ff] mb-2">{selectedKey}</p>
                  <div className="text-sm text-gray-400 space-y-1">
                    <p>
                      מפתח:{' '}
                      {CAMELOT_KEYS[parseInt(selectedKey) - 1][selectedKey.endsWith('A') ? 'minor' : 'major']}
                    </p>
                    <p>מספר: {selectedKey.slice(0, -1)}</p>
                    <p>סוג: {selectedKey.endsWith('A') ? 'מינור' : 'מז\'ור'}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">בחר מפתח מהגלגל</p>
              )}
            </div>

            {/* Compatibility Legend */}
            <div>
              <h3 className="text-sm font-bold text-[#00d4ff] mb-2">מקרא תאימות</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#00d4ff] rounded" />
                  <span>תאימות מושלמת</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-400 rounded" />
                  <span>תואם (±1)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-400 rounded" />
                  <span>שינוי אנרגיה</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-600 rounded" />
                  <span>התנגשות</span>
                </div>
              </div>
            </div>

            {/* Genre Reference */}
            <div>
              <h3 className="text-sm font-bold text-[#00d4ff] mb-2">ז׳אנרים טיפוסיים</h3>
              <div className="space-y-2 text-xs">
                {Object.entries(GENRE_KEYS).map(([genre, keys]) => (
                  <div key={genre}>
                    <p className="font-semibold text-gray-300">{genre}</p>
                    <p className="text-gray-500">{keys.join(', ')}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Compatible Keys List */}
        {selectedKey && (
          <div className="mt-6 bg-[#1a1a1f] rounded-lg p-6 border border-[#7b2fff]/30">
            <h2 className="text-lg font-bold text-[#00d4ff] mb-4">מפתחות תואמים</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {compatibleKeys.map(({ key, compatibility, label }) => (
                <button
                  key={key}
                  onClick={() => setSelectedKey(key)}
                  className={`p-3 rounded-lg text-center transition-all ${
                    compatibility === 'perfect'
                      ? 'bg-[#00d4ff]/20 border border-[#00d4ff] text-[#00d4ff]'
                      : compatibility === 'compatible'
                        ? 'bg-yellow-500/20 border border-yellow-500 text-yellow-300'
                        : compatibility === 'energy_change'
                          ? 'bg-blue-500/20 border border-blue-500 text-blue-300'
                          : 'bg-gray-700/20 border border-gray-600 text-gray-400'
                  }`}
                >
                  <div className="font-bold text-lg">{key}</div>
                  <div className="text-xs">{label}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
