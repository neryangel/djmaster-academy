import { useState, useCallback, useMemo } from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  GripVertical, 
  Trash2, 
  Download, 
  Plus,
  ListMusic, 
  Activity, 
  TrendingUp,
  TrendingDown,
  ArrowRightLeft,
  Disc3,
  Waves,
  Music4
} from 'lucide-react';
import { 
  type Track, 
  type TransitionAnalysis, 
  CAMELOT_NUMBERS, 
  CAMELOT_TYPES, 
  GENRES, 
  getKeyCompatibility, 
  getCamelotColor, 
  analyzeTransition 
} from '../../lib/music-math';

const generateId = () => Math.random().toString(36).substring(2, 11);

/* --- Sortable Row Component --- */
const SortableTrackRow = ({ 
  track, 
  index, 
  transition, 
  removeTrack 
}: { 
  track: Track; 
  index: number; 
  transition: TransitionAnalysis | null; 
  removeTrack: (id: string) => void; 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition: dndTransition,
    isDragging
  } = useSortable({ id: track.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: dndTransition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.9 : 1,
  };

  const camelotColor = getCamelotColor(track.key);

  return (
    <div ref={setNodeRef} style={style} className={`group relative ${isDragging ? 'shadow-2xl ring-1 ring-[#00E5FF]/40 rounded-xl bg-[#1c1c24]' : ''}`}>
      {/* Track Row - Flat Data Grid Look */}
      <div className={`grid grid-cols-[30px_40px_1fr_80px_60px_60px_50px] gap-4 items-center bg-transparent hover:bg-white/[0.02] border border-transparent hover:border-white/[0.05] rounded-xl p-3 mb-1 transition-colors ${isDragging ? 'bg-[#1c1c24] border-[#00E5FF]/30' : ''}`}>
        
        {/* Drag Handle */}
        <div 
          {...attributes} 
          {...listeners} 
          className="cursor-move p-1 text-white/20 hover:text-white transition-colors flex items-center justify-center focus:outline-none rounded"
        >
          <GripVertical size={16} />
        </div>

        {/* Index */}
        <div className="text-center font-mono text-white/40 text-sm font-medium">{String(index + 1).padStart(2, '0')}</div>
        
        {/* Title & Genre */}
        <div className="min-w-0 pr-3 border-r border-white/10 mr-1">
          <p className="text-white font-medium truncate text-[14px]">{track.name}</p>
          <p className="text-white/40 text-xs truncate mt-0.5">{track.genre}</p>
        </div>

        {/* BPM */}
        <div className="font-mono text-[13px] text-white/80 font-medium pl-2">{track.bpm}</div>

        {/* KEY */}
        <div>
          <span 
            className="inline-flex items-center justify-center px-2 py-0.5 rounded-[4px] font-mono text-[11px] font-semibold border border-transparent transition-colors"
            style={{ 
              color: camelotColor === '#FFFFFF' ? '#000' : '#111', 
              backgroundColor: camelotColor,
            }}
          >
            {track.key}
          </span>
        </div>

        {/* Energy Fader */}
        <div className="flex flex-col justify-center h-full pb-1 pl-2">
          <div className="flex items-end h-[18px] gap-[2px]" dir="ltr">
             {Array.from({length: 5}).map((_, i) => (
               <div key={i} className={`w-1 rounded-sm transition-all ${i < track.energy ? 'bg-[#00E5FF]' : 'bg-white/10'}`} style={{ height: `${(i+1)*20}%`}}></div>
             ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
           <button 
            onClick={(e) => { e.stopPropagation(); removeTrack(track.id); }} 
            className="p-1.5 text-white/30 hover:text-[#FF0055] hover:bg-[#FF0055]/10 rounded-md transition-colors"
            title="הסר שיר מסט"
           >
             <Trash2 size={16} />
           </button>
        </div>
      </div>

      {/* Transition Analysis Log */}
      {transition && !isDragging && (
        <div className="py-2 pl-12 pr-16 relative flex bg-transparent">
          <div className="absolute right-[calc(28px+20px+16px)] top-0 bottom-0 w-[2px] bg-white/5 rounded-full"></div>
          <div className="px-4 py-2 flex items-center justify-between gap-4 flex-1 w-full ml-12 bg-white/[0.02] rounded-lg border border-white/5">
             
             <div className="flex items-center gap-2">
               {transition.keyCompatibility === 'perfect' && <span className="w-1.5 h-1.5 rounded-full bg-[#00D6BA]"></span>}
               {transition.keyCompatibility === 'compatible' && <span className="w-1.5 h-1.5 rounded-full bg-[#FFD32F]"></span>}
               {transition.keyCompatibility === 'energy_change' && <span className="w-1.5 h-1.5 rounded-full bg-[#FF4189]"></span>}
               {transition.keyCompatibility === 'clash' && <span className="w-1.5 h-1.5 rounded-full bg-[#FF593B]"></span>}
               <span className="text-xs font-medium text-white/60">{transition.keyLabel}</span>
             </div>

             <div className="h-3 w-[1px] bg-white/10"></div>

             <div className="text-xs font-mono font-medium flex items-center gap-1.5">
               <ArrowRightLeft size={10} className="text-white/30" />
               <span className="text-[#00E5FF]">{transition.bpmSuggestion}</span>
             </div>

             <div className="h-3 w-[1px] bg-white/10"></div>

             <div className="text-xs font-medium text-white/60 flex items-center gap-1.5">
               {transition.energyFlow.includes('עלייה') || transition.energyFlow.includes('שבירת') ? <TrendingUp size={12} className="text-[#00E5FF]" /> : <TrendingDown size={12} className="text-[#7B2FFF]" />}
               {transition.energyFlow}
             </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default function SetPlanner() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    bpm: 124,
    key: '8A',
    genre: 'האוס',
    energy: 3,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // minimum drag distance before initiating drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addTrack = useCallback(() => {
    if (!formData.name.trim()) return;

    const newTrack: Track = {
      id: generateId(),
      ...formData,
    };

    setTracks(prev => [...prev, newTrack]);
    setFormData({ name: '', bpm: 124, key: '8A', genre: 'האוס', energy: 3 });
  }, [formData]);

  const removeTrack = useCallback((id: string) => {
    setTracks(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setTracks((items) => {
        const oldIndex = items.findIndex(t => t.id === active.id);
        const newIndex = items.findIndex(t => t.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const stats = useMemo(() => {
    if (tracks.length === 0) {
      return { avgBpm: 0, minBpm: 0, maxBpm: 0, quality: 0, duration: 0 };
    }

    const bpms = tracks.map(t => t.bpm);
    const avgBpm = Math.round(bpms.reduce((a, b) => a + b) / bpms.length);
    const minBpm = Math.min(...bpms);
    const maxBpm = Math.max(...bpms);

    let compatibleTransitions = 0;
    let totalTransitions = 0;

    for (let i = 0; i < tracks.length - 1; i++) {
      const trackI = tracks[i];
      const trackNext = tracks[i + 1];
      if (!trackI || !trackNext) continue;
      const compatibility = getKeyCompatibility(trackI.key, trackNext.key);
      if (compatibility !== 'clash') compatibleTransitions++;
      totalTransitions++;
    }

    const quality = totalTransitions > 0 ? Math.round((compatibleTransitions / totalTransitions) * 100) : 100;
    const duration = Math.round((tracks.length * 5)); // 5 mins avg per track

    return { avgBpm, minBpm, maxBpm, quality, duration };
  }, [tracks]);

  const exportSet = () => {
    let exportText = 'רשימת השמעה | DJMaster Academy\n';
    exportText += `תאריך: ${new Date().toLocaleDateString('he-IL')}\n`;
    exportText += '═'.repeat(60) + '\n\n';

    tracks.forEach((track, i) => {
      exportText += `[${String(i + 1).padStart(2, '0')}] ${track.name}\n`;
      exportText += `    BPM: ${track.bpm} | מפתח: ${track.key} | ז׳אנר: ${track.genre} | אנרגיה: ${track.energy}/5\n`;

      if (i < tracks.length - 1) {
        const trackI = tracks[i]!;
        const trackNext = tracks[i + 1];
        if (!trackNext) return;
        const transition = analyzeTransition(trackI, trackNext);
        exportText += `    ↳ מעבר: ${transition.transitionType} (${transition.keyLabel})\n`;
      }
      exportText += '\n';
    });

    exportText += '═'.repeat(60) + '\n';
    exportText += `סה״כ שירים: ${tracks.length} | משך משוער: ${stats.duration} דקות\n`;
    exportText += `טווח BPM: ${stats.minBpm}-${stats.maxBpm} | הלימה הרמונית: ${stats.quality}%\n`;

    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dj-master-set-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full flex flex-col gap-6 font-sans antialiased" dir="rtl">
      
      {/* Top Metrics Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Metric Card */}
        <div className="bg-[#121217] border border-white/10 rounded-xl p-5 shadow-[0_4px_16px_rgba(0,0,0,0.5)] flex flex-col justify-center">
          <div className="text-white/40 text-[11px] font-semibold uppercase tracking-wider mb-2 flex items-center gap-2"><ListMusic size={14} className="text-[#00E5FF]"/> OVERALL TRACKS</div>
          <div className="text-3xl font-bold text-white font-mono">{String(tracks.length).padStart(2, '0')}</div>
        </div>

        {/* Metric Card */}
        <div className="bg-[#121217] border border-white/10 rounded-xl p-5 shadow-[0_4px_16px_rgba(0,0,0,0.5)] flex flex-col justify-center">
          <div className="text-white/40 text-[11px] font-semibold uppercase tracking-wider mb-2 flex items-center gap-2"><Activity size={14} className="text-[#00E5FF]"/> DURATION</div>
          <div className="text-3xl font-bold text-white font-mono">{stats.duration}<span className="text-sm font-sans font-medium text-white/30 mr-2 uppercase">min</span></div>
        </div>

        {/* Metric Card */}
        <div className="bg-[#121217] border border-white/10 rounded-xl p-5 shadow-[0_4px_16px_rgba(0,0,0,0.5)] flex flex-col justify-center">
          <div className="text-white/40 text-[11px] font-semibold uppercase tracking-wider mb-2 flex items-center gap-2"><Waves size={14} className="text-[#00E5FF]"/> AVG BPM</div>
          <div className="text-3xl font-bold text-white font-mono">{stats.avgBpm}</div>
        </div>

        {/* Metric Card */}
        <div className="bg-[#121217] border border-white/10 rounded-xl p-5 shadow-[0_4px_16px_rgba(0,0,0,0.5)] flex flex-col justify-center">
          <div className="text-white/40 text-[11px] font-semibold uppercase tracking-wider mb-2 flex items-center gap-2"><ArrowRightLeft size={14} className="text-[#00E5FF]"/> BPM RANGE</div>
          <div className="text-2xl font-bold text-white font-mono pt-1">{stats.minBpm}<span className="text-white/20 mx-1">-</span>{stats.maxBpm}</div>
        </div>

        {/* Highlight Metric Card */}
        <div className="bg-[#00E5FF]/5 border border-[#00E5FF]/20 rounded-xl p-5 shadow-[0_4px_16px_rgba(0,229,255,0.05)] flex flex-col justify-center relative overflow-hidden">
          <div className="text-[#00E5FF]/80 text-[11px] font-bold uppercase tracking-wider mb-2 relative z-10 flex items-center gap-2"><Disc3 size={14} className={tracks.length > 1 ? "animate-[spin_4s_linear_infinite]" : ""} /> HARMONIC MATCH</div>
          <div className="text-3xl font-bold text-[#00E5FF] relative z-10 font-mono">{stats.quality}<span className="text-lg">%</span></div>
        </div>
      </div>

      {/* Main Studio View Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        
        {/* Panel 1: Inspector / Form (Col Span 1) */}
        <div className="xl:col-span-1 flex flex-col w-full bg-[#121217] border border-white/10 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
            
          <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Music4 size={16} className="text-white/40" />
              ADD TRACK
            </h2>
          </div>

          <div className="p-6 space-y-6 flex-1">
            
            <div className="w-full">
              <label className="block text-xs font-medium text-white/50 tracking-wider mb-2">TITLE & ARTIST</label>
              <input
                type="text"
                dir="auto"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Fisher - Losing It"
                className="w-full px-4 py-3 bg-[#09090b] border border-white/10 rounded-lg text-white placeholder-white/20 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all text-sm box-border text-left rtl:text-right"
                onKeyDown={(e) => { if (e.key === 'Enter') addTrack(); }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="w-full min-w-0">
                <label className="block text-xs font-medium text-white/50 tracking-wider mb-2">BPM</label>
                <input
                  type="number"
                  value={formData.bpm || ''}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setFormData({ ...formData, bpm: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 bg-[#09090b] border border-white/10 rounded-lg text-white font-mono focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all text-sm text-center box-border"
                />
              </div>
              <div className="w-full min-w-0">
                <label className="block text-xs font-medium text-white/50 tracking-wider mb-2">KEY</label>
                <div className="relative w-full">
                  <select
                    value={formData.key}
                    onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                    className="w-full px-4 py-3 bg-[#09090b] border border-white/10 rounded-lg text-white font-mono appearance-none focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all text-sm pl-10 box-border text-center"
                    style={{ color: getCamelotColor(formData.key) }}
                    dir="ltr"
                  >
                    {CAMELOT_NUMBERS.map((num) =>
                      CAMELOT_TYPES.map((type) => (
                        <option key={`${num}${type}`} value={`${num}${type}`} style={{ color: getCamelotColor(`${num}${type}`) }}>
                          {num}{type}
                        </option>
                      ))
                    )}
                  </select>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full pointer-events-none" style={{ backgroundColor: getCamelotColor(formData.key) }}></div>
                </div>
              </div>
            </div>

            <div className="w-full min-w-0">
              <label className="block text-xs font-medium text-white/50 tracking-wider mb-2">GENRE</label>
              <div className="relative">
                <select
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  className="w-full px-4 py-3 bg-[#09090b] border border-white/10 rounded-lg text-white appearance-none focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all text-sm pl-10 box-border"
                >
                  {GENRES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none border-t-[5px] border-t-white/30 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent"></div>
              </div>
            </div>

            <div className="w-full pt-4">
              <label className="flex justify-between items-center text-xs font-medium text-white/50 tracking-wider mb-4">
                <span>ENERGY LEVEL</span>
                <span className="text-[#7B2FFF] font-mono font-bold">{formData.energy}.0</span>
              </label>
              <input
                type="range"
                value={formData.energy}
                onChange={(e) => setFormData({ ...formData, energy: parseInt(e.target.value) })}
                min="1"
                max="5"
                className="w-full dj-slider"
              />
            </div>
          </div>

          <div className="p-6 pt-0">
            <button
              onClick={addTrack}
              className="w-full py-3 bg-[#00E5FF] hover:bg-[#00f0ff] text-[#09090b] font-bold tracking-wider uppercase rounded-lg transition-colors flex justify-center items-center gap-2 active:scale-[0.98]"
            >
              <Plus size={16} />
              ADD TO SET
            </button>
          </div>

        </div>

        {/* Panel 2: The Playlist View (Col Span 3) */}
        <div className="xl:col-span-3 flex flex-col w-full h-full bg-[#121217] border border-white/10 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.5)] overflow-hidden">
            
          {/* Deck Header */}
          <div className="px-6 py-4 border-b border-white/10 bg-[#1A1A24] flex justify-between items-center shrink-0">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2 tracking-wider">
              SETLIST
            </h2>
            {tracks.length > 0 && (
              <button
                onClick={exportSet}
                className="px-4 py-1.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-medium rounded-lg flex items-center gap-2 transition-colors active:scale-[0.98] border border-white/10"
              >
                <Download size={14} className="opacity-70" />
                EXPORT TXT
              </button>
            )}
          </div>

          {/* Column Headers */}
          {tracks.length > 0 && (
              <div className="grid grid-cols-[30px_40px_1fr_80px_60px_60px_50px] gap-4 px-6 py-3 border-b border-white/5 bg-[#09090b] text-[10px] font-semibold text-white/40 uppercase tracking-widest sticky top-0 z-20 shrink-0">
                <div></div>
                <div className="text-center">#</div>
                <div>TRACK INFO</div>
                <div className="pl-2">BPM</div>
                <div>KEY</div>
                <div className="text-center pl-2">ENERGY</div>
                <div></div>
              </div>
          )}

          {/* Deck Area (DnD Wrapper) */}
          <div className="flex-1 overflow-y-auto bg-[#09090b] p-6 relative min-h-[400px]">
            {tracks.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center mb-6 bg-white/[0.02]">
                  <ListMusic size={32} strokeWidth={1.5} className="text-white/20" />
                </div>
                <p className="text-sm font-medium text-white/60 mb-2">Playlist is empty</p>
                <p className="text-white/30 text-xs max-w-sm leading-relaxed">Add tracks using the inspector to visualize transition flows and harmonic compatibility in real-time.</p>
              </div>
            ) : (
              <div className="pb-8 space-y-1"> 
                <DndContext 
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext 
                    items={tracks.map(t => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {tracks.map((track, index) => {
                      const nextTrack = tracks[index + 1];
                      const transition = index < tracks.length - 1 && nextTrack ? analyzeTransition(track, nextTrack) : null;
                      return (
                        <SortableTrackRow 
                          key={track.id} 
                          track={track} 
                          index={index} 
                          transition={transition}
                          removeTrack={removeTrack}
                        />
                      );
                    })}
                  </SortableContext>
                </DndContext>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
