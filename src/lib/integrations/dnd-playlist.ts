/**
 * Drag & Drop Playlist Integration
 * אינטגרציה drag & drop של רשימת השמעה באמצעות @dnd-kit
 */

import React from 'react';
import {
  DndContext,
  DndContextProps,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  SortableContextProps,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/**
 * Track item structure
 */
export interface PlaylistTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  bpm?: number;
  key?: string;
  url: string;
}

/**
 * Props for DndPlaylistProvider
 */
export interface DndPlaylistProviderProps {
  children: React.ReactNode;
  isRTL?: boolean;
  direction?: 'vertical' | 'horizontal';
  onReorder?: (tracks: PlaylistTrack[]) => void;
}

/**
 * Props for SortableTrack component
 */
export interface SortableTrackProps {
  track: PlaylistTrack;
  isRTL?: boolean;
  isDragging?: boolean;
  onSelect?: (track: PlaylistTrack) => void;
}

/**
 * Props for useSortablePlaylist hook
 */
export interface UseSortablePlaylistOptions {
  isRTL?: boolean;
  direction?: 'vertical' | 'horizontal';
  onReorder?: (tracks: PlaylistTrack[]) => void;
}

/**
 * Context for Dnd Playlist
 */
const DndPlaylistContext = React.createContext<{
  tracks: PlaylistTrack[];
  setTracks: (tracks: PlaylistTrack[]) => void;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  isRTL?: boolean;
} | null>(null);

/**
 * DndPlaylistProvider - Wrapper component for drag & drop context
 * ספק Dnd context לרשימת השמעה
 */
export const DndPlaylistProvider = React.forwardRef<
  HTMLDivElement,
  DndPlaylistProviderProps
>(({ children, isRTL = false, direction = 'vertical', onReorder }, ref) => {
  const [tracks, setTracks] = React.useState<PlaylistTrack[]>([]);
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      distance: 8,
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tracks.findIndex(t => t.id === active.id);
      const newIndex = tracks.findIndex(t => t.id === over.id);

      const newTracks = arrayMove(tracks, oldIndex, newIndex);
      setTracks(newTracks);

      if (onReorder) {
        onReorder(newTracks);
      }
    }

    setActiveId(null);
  };

  const strategy = direction === 'horizontal'
    ? horizontalListSortingStrategy
    : verticalListSortingStrategy;

  return (
    <DndPlaylistContext.Provider value={{ tracks, setTracks, activeId, setActiveId, isRTL }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={(event) => setActiveId(event.active.id)}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={tracks.map(t => t.id)}
          strategy={strategy}
        >
          <div
            ref={ref}
            dir={isRTL ? 'rtl' : 'ltr'}
            className={`dnd-playlist ${direction}`}
          >
            {children}
          </div>
        </SortableContext>
      </DndContext>
    </DndPlaylistContext.Provider>
  );
});

DndPlaylistProvider.displayName = 'DndPlaylistProvider';

/**
 * SortableTrack component - Individual draggable track item
 * רכיב track draggable בודד
 */
export interface SortableTrackComponentProps extends SortableTrackProps {
  isDragOverlay?: boolean;
}

export const SortableTrack = React.forwardRef<
  HTMLDivElement,
  SortableTrackComponentProps
>(({
  track,
  isRTL = false,
  isDragging = false,
  onSelect,
  isDragOverlay = false,
}, ref) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: track.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  const isActive = isDragging || isSortableDragging;

  return (
    <div
      ref={setNodeRef || ref}
      style={style}
      className={`
        sortable-track
        ${isActive ? 'active dragging' : ''}
        ${isDragOverlay ? 'drag-overlay' : ''}
        p-4 rounded-lg bg-surface border border-border
        transition-all duration-200
        hover:bg-[#2D2D44] cursor-grab active:cursor-grabbing
        flex items-center gap-4 rtl-safe
        ${isRTL ? 'flex-row-reverse' : ''}
      `}
      {...attributes}
      {...listeners}
    >
      {/* Drag Handle */}
      <div className="drag-handle flex-shrink-0 text-muted opacity-50 hover:opacity-100">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M7 2a2 2 0 11-4 0 2 2 0 014 0zM7 6a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0zM13 2a2 2 0 11-4 0 2 2 0 014 0zM13 6a2 2 0 11-4 0 2 2 0 014 0zM13 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>

      {/* Track Content */}
      <div
        className="flex-1 min-w-0 cursor-pointer"
        onClick={() => onSelect?.(track)}
      >
        <h4 className="font-semibold text-white truncate">{track.title}</h4>
        <p className="text-sm text-secondary truncate">{track.artist}</p>
      </div>

      {/* Track Info */}
      <div className={`track-meta flex items-center gap-4 flex-shrink-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
        {track.bpm && (
          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
            {track.bpm} BPM
          </span>
        )}
        {track.key && (
          <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded">
            {track.key}
          </span>
        )}
        <span className="text-xs text-muted ml-2">
          {formatDuration(track.duration)}
        </span>
      </div>
    </div>
  );
});

SortableTrack.displayName = 'SortableTrack';

/**
 * useSortablePlaylist hook - State management for playlist
 * hook לניהול מצב רשימת השמעה
 */
export function useSortablePlaylist(
  initialTracks: PlaylistTrack[] = [],
  options: UseSortablePlaylistOptions = {}
) {
  const { isRTL = false, direction = 'vertical', onReorder } = options;

  const [tracks, setTracks] = React.useState<PlaylistTrack[]>(initialTracks);
  const [selectedTrack, setSelectedTrack] = React.useState<PlaylistTrack | null>(null);
  const [filter, setFilter] = React.useState('');

  const filteredTracks = React.useMemo(() => {
    if (!filter) return tracks;

    const lowerFilter = filter.toLowerCase();
    return tracks.filter(track =>
      track.title.toLowerCase().includes(lowerFilter) ||
      track.artist.toLowerCase().includes(lowerFilter)
    );
  }, [tracks, filter]);

  const addTrack = React.useCallback((track: PlaylistTrack) => {
    setTracks(prev => [...prev, track]);
  }, []);

  const removeTrack = React.useCallback((trackId: string) => {
    setTracks(prev => prev.filter(t => t.id !== trackId));
  }, []);

  const moveTrack = React.useCallback((trackId: string, newIndex: number) => {
    setTracks(prev => {
      const currentIndex = prev.findIndex(t => t.id === trackId);
      if (currentIndex === -1) return prev;

      const newTracks = arrayMove(prev, currentIndex, newIndex);
      onReorder?.(newTracks);
      return newTracks;
    });
  }, [onReorder]);

  const reorderTracks = React.useCallback((newTracks: PlaylistTrack[]) => {
    setTracks(newTracks);
    onReorder?.(newTracks);
  }, [onReorder]);

  const clearPlaylist = React.useCallback(() => {
    setTracks([]);
    setSelectedTrack(null);
  }, []);

  return {
    tracks,
    filteredTracks,
    selectedTrack,
    setSelectedTrack,
    addTrack,
    removeTrack,
    moveTrack,
    reorderTracks,
    clearPlaylist,
    filter,
    setFilter,
    isRTL,
    direction,
  };
}

/**
 * Helper function to format duration
 */
function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Export all components and utilities
 */
export default {
  DndPlaylistProvider,
  SortableTrack,
  useSortablePlaylist,
  formatDuration,
};
