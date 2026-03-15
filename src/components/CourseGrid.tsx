import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COURSE_EMOJIS, COURSE_ACCENTS, LEVEL_LABELS, LEVEL_COLORS, LEVEL_EMOJIS } from '@lib/ui-constants';

interface CourseProps {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  lessonCount: number;
  order: number;
}

interface CourseGridProps {
  initialCourses: CourseProps[];
}

export default function CourseGrid({ initialCourses }: CourseGridProps) {
  const [filter, setFilter] = useState<string>('all');

  // Ensure they are sorted by default order
  const sortedCourses = [...initialCourses].sort((a, b) => a.order - b.order);

  const filteredCourses = sortedCourses.filter((course) => {
    if (filter === 'all') return true;
    return course.level === filter;
  });

  return (
    <div className="w-full">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
        <button
          onClick={() => setFilter('all')}
          className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
            filter === 'all'
              ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]'
              : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/5'
          }`}
        >
          הכל
        </button>
        <button
          onClick={() => setFilter('beginner')}
          className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
            filter === 'beginner'
              ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/50 shadow-[0_0_20px_rgba(0,229,255,0.2)]'
              : 'bg-white/5 text-white/50 hover:bg-[#00E5FF]/10 hover:text-[#00E5FF] border border-white/5'
          }`}
        >
          🌱 מתחילים
        </button>
        <button
          onClick={() => setFilter('intermediate')}
          className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
            filter === 'intermediate'
              ? 'bg-[#7B2FFF]/30 text-[#d4b5ff] border border-[#7B2FFF]/50 shadow-[0_0_20px_rgba(123,47,255,0.2)]'
              : 'bg-white/5 text-white/50 hover:bg-[#7B2FFF]/20 hover:text-[#d4b5ff] border border-white/5'
          }`}
        >
          ⚡ מתקדמים
        </button>
      </div>

      {/* Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredCourses.map((course) => {
            const emoji = COURSE_EMOJIS[course.slug] || '📚';
            const accent = COURSE_ACCENTS[course.slug] || '#00d4ff';
            const levelLabel = LEVEL_LABELS[course.level];
            const levelColor = LEVEL_COLORS[course.level];
            const levelEmoji = LEVEL_EMOJIS[course.level];

            return (
              <motion.a
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
                key={course.id}
                href={`/courses/${course.slug}`}
                className="glass-card glow-hover group flex flex-col items-start text-right w-full relative overflow-hidden"
                style={{ textDecoration: 'none', color: 'white', borderTop: `3px solid ${accent}` }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10 blur-2xl" style={{ backgroundColor: accent, pointerEvents: 'none' }} />
                
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform inline-block relative z-10">{emoji}</div>
                <h2 className="text-xl font-bold mb-2 group-hover:text-[#00d4ff] transition-colors relative z-10">{course.title}</h2>
                <p className="text-white/70 text-sm leading-relaxed mb-5 flex-grow relative z-10">{course.description}</p>
                
                <div className="flex gap-3 items-center flex-wrap mt-auto relative z-10 w-full pt-4 border-t border-white/5">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${levelColor}`}>
                    {levelEmoji} {levelLabel}
                  </span>
                  <span className="text-white/60 text-xs tracking-wider mr-auto">⏱️ {course.duration}M</span>
                  <span className="text-white/60 text-xs tracking-wider">📖 {course.lessonCount} Lessons</span>
                </div>
              </motion.a>
            );
          })}
        </AnimatePresence>
      </motion.div>
      
      {filteredCourses.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="text-center py-20 text-white/50"
        >
          לא נמצאו קורסים בקטגוריה זו.
        </motion.div>
      )}
    </div>
  );
}
