import React, { useState, useMemo } from 'react';

interface Lesson {
  id: string;
  title: string;
  titleHe: string;
  duration: number;
  type: 'video' | 'text' | 'quiz' | 'exercise';
  completed: boolean;
  locked: boolean;
  order: number;
}

interface Module {
  id: string;
  title: string;
  titleHe: string;
  lessons: Lesson[];
  order: number;
}

interface LessonNavigatorProps {
  modules: Module[];
  currentLessonId?: string;
  currentModuleId?: string;
  onLessonSelect?: (lessonId: string, moduleId: string) => void;
  courseProgress?: number;
  isCompact?: boolean;
}

interface ModuleAccordionProps {
  module: Module;
  isExpanded: boolean;
  onToggle: () => void;
  currentLessonId?: string;
  onLessonSelect?: (lessonId: string, moduleId: string) => void;
}

const LESSON_TYPE_ICONS = {
  video: '🎥',
  text: '📖',
  quiz: '📝',
  exercise: '🎛️',
};

const LESSON_TYPE_HE = {
  video: 'סרטון',
  text: 'טקסט',
  quiz: 'בחינה',
  exercise: 'תרגול',
};

function ModuleAccordion({
  module,
  isExpanded,
  onToggle,
  currentLessonId,
  onLessonSelect,
}: ModuleAccordionProps) {
  const completedCount = module.lessons.filter(l => l.completed).length;
  const totalCount = module.lessons.length;
  const progress = (completedCount / totalCount) * 100;

  return (
    <div className="border border-dj-border rounded-lg overflow-hidden">
      {/* Module Header */}
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-dj-border/50 transition-colors"
      >
        <div className="flex items-center gap-3 flex-1 text-right">
          {/* Chevron */}
          <div
            className="flex-shrink-0 transition-transform"
            style={{
              transform: isExpanded ? 'rotate(-90deg)' : 'rotate(0deg)',
            }}
          >
            <span className="text-dj-cyan">▶</span>
          </div>

          {/* Module Info */}
          <div className="flex-1 text-right min-w-0">
            <h3 className="font-bold text-white text-sm">{module.titleHe}</h3>
            <p className="text-xs text-gray-400">
              {completedCount} / {totalCount} שיעורים
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex-shrink-0 ml-3 w-24 h-2 bg-dj-card rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-dj-cyan to-dj-purple transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </button>

      {/* Module Content */}
      {isExpanded && (
        <div className="bg-dj-dark border-t border-dj-border">
          {module.lessons.map((lesson, idx) => (
            <button
              key={lesson.id}
              onClick={() => !lesson.locked && onLessonSelect?.(lesson.id, module.id)}
              disabled={lesson.locked}
              className={`w-full px-6 py-3 text-right flex items-center gap-3 transition-colors
                ${
                  currentLessonId === lesson.id
                    ? 'bg-dj-cyan/20 border-r-2 border-dj-cyan'
                    : 'hover:bg-dj-border/30'
                }
                ${lesson.locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {/* Completion Checkmark */}
              <div className="flex-shrink-0 w-5 h-5 rounded border border-dj-border flex items-center justify-center">
                {lesson.completed ? (
                  <span className="text-dj-green text-sm">✓</span>
                ) : (
                  <span className="text-gray-600 text-xs">○</span>
                )}
              </div>

              {/* Lesson Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm">{lesson.titleHe}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-dj-card px-2 py-0.5 rounded">
                    {LESSON_TYPE_HE[lesson.type]}
                  </span>
                  <span className="text-xs text-gray-500">
                    {Math.ceil(lesson.duration / 60)} דקות
                  </span>
                </div>
              </div>

              {/* Type Icon */}
              <div className="flex-shrink-0 text-lg">
                {lesson.locked ? '🔒' : LESSON_TYPE_ICONS[lesson.type]}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function LessonNavigator({
  modules,
  currentLessonId,
  currentModuleId,
  onLessonSelect,
  courseProgress = 0,
  isCompact = false,
}: LessonNavigatorProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(currentModuleId ? [currentModuleId] : [modules[0]?.id])
  );
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

  const sortedModules = useMemo(() => {
    return [...modules].sort((a, b) => a.order - b.order);
  }, [modules]);

  const totalLessons = useMemo(() => {
    return modules.reduce((sum, m) => sum + m.lessons.length, 0);
  }, [modules]);

  const completedLessons = useMemo(() => {
    return modules.reduce((sum, m) => sum + m.lessons.filter(l => l.completed).length, 0);
  }, [modules]);

  // Desktop Sidebar
  if (!isCompact) {
    return (
      <div className="h-screen bg-dj-card border-l border-dj-border flex flex-col font-hebrew sticky top-0" dir="rtl">
        {/* Header */}
        <div className="p-4 border-b border-dj-border">
          <h2 className="font-bold text-dj-cyan text-sm mb-3">תכנית הלימוד</h2>

          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{completedLessons} / {totalLessons}</span>
              <span>{Math.round(courseProgress)}%</span>
            </div>
            <div className="w-full h-2 bg-dj-dark rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-dj-green to-dj-cyan transition-all"
                style={{ width: `${courseProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Modules List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {sortedModules.map(module => (
            <ModuleAccordion
              key={module.id}
              module={module}
              isExpanded={expandedModules.has(module.id)}
              onToggle={() => toggleModule(module.id)}
              currentLessonId={currentLessonId}
              onLessonSelect={onLessonSelect}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-dj-border text-xs text-gray-500 text-center">
          {completedLessons === totalLessons ? (
            <div className="text-dj-green font-bold">🎉 הקורס הושלם!</div>
          ) : (
            <div>המשך הלימוד</div>
          )}
        </div>
      </div>
    );
  }

  // Mobile Drawer
  return (
    <div className="font-hebrew">
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed bottom-6 left-6 z-40 w-12 h-12 rounded-full bg-dj-cyan text-dj-dark flex items-center justify-center font-bold shadow-lg hover:scale-110 transition-transform"
      >
        ☰
      </button>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-screen w-80 bg-dj-card border-l border-dj-border z-40 transition-transform transform md:hidden flex flex-col
          ${isMobileOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        dir="rtl"
      >
        {/* Header */}
        <div className="p-4 border-b border-dj-border flex items-center justify-between">
          <h2 className="font-bold text-dj-cyan">תכנית הלימוד</h2>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="text-xl text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>

        {/* Overall Progress */}
        <div className="p-4 border-b border-dj-border space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{completedLessons} / {totalLessons}</span>
            <span>{Math.round(courseProgress)}%</span>
          </div>
          <div className="w-full h-2 bg-dj-dark rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-dj-green to-dj-cyan"
              style={{ width: `${courseProgress}%` }}
            />
          </div>
        </div>

        {/* Modules List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {sortedModules.map(module => (
            <ModuleAccordion
              key={module.id}
              module={module}
              isExpanded={expandedModules.has(module.id)}
              onToggle={() => toggleModule(module.id)}
              currentLessonId={currentLessonId}
              onLessonSelect={(lessonId, moduleId) => {
                onLessonSelect?.(lessonId, moduleId);
                setIsMobileOpen(false);
              }}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-dj-border text-xs text-gray-500 text-center">
          {completedLessons === totalLessons ? (
            <div className="text-dj-green font-bold">🎉 הקורס הושלם!</div>
          ) : (
            <div>המשך הלימוד</div>
          )}
        </div>
      </div>
    </div>
  );
}
