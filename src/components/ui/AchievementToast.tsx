import React, { useEffect, useState } from 'react';
import { Badge } from '../../types/gamification';

interface AchievementToastProps {
  badge: Badge;
  onDismiss?: () => void;
  duration?: number;
  stackPosition?: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
}

const RARITY_COLORS = {
  common: { border: '#00FF88', glow: 'rgba(0, 255, 136, 0.3)', bg: 'rgba(0, 255, 136, 0.1)' },
  uncommon: { border: '#00D4FF', glow: 'rgba(0, 212, 255, 0.3)', bg: 'rgba(0, 212, 255, 0.1)' },
  rare: { border: '#7B2FFF', glow: 'rgba(123, 47, 255, 0.3)', bg: 'rgba(123, 47, 255, 0.1)' },
  epic: { border: '#FF8C00', glow: 'rgba(255, 140, 0, 0.3)', bg: 'rgba(255, 140, 0, 0.1)' },
  legendary: { border: '#FFD700', glow: 'rgba(255, 215, 0, 0.5)', bg: 'rgba(255, 215, 0, 0.15)' },
};

export default function AchievementToast({
  badge,
  onDismiss,
  duration = 5000,
  stackPosition = 0,
}: AchievementToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [particleId, setParticleId] = useState(0);

  const rarityConfig = RARITY_COLORS[badge.rarity];

  // Auto-dismiss
  useEffect(() => {
    const startTime = Date.now();
    const updateInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, duration - elapsed);
      setProgress((remaining / duration) * 100);

      if (remaining === 0) {
        clearInterval(updateInterval);
        setIsVisible(false);
        setTimeout(onDismiss, 300);
      }
    }, 50);

    return () => clearInterval(updateInterval);
  }, [duration, onDismiss]);

  // Confetti particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < 15; i++) {
        const angle = (Math.random() * Math.PI * 2);
        const velocity = 3 + Math.random() * 4;
        newParticles.push({
          id: particleId + i,
          x: Math.random() * 100,
          y: -10,
          vx: Math.cos(angle) * velocity,
          vy: velocity,
          life: 1,
          size: 3 + Math.random() * 4,
        });
      }
      setParticles(newParticles);
      setParticleId(prev => prev + 15);
    };

    generateParticles();
    const particleInterval = setInterval(generateParticles, 600);

    return () => clearInterval(particleInterval);
  }, []);

  // Update particles
  useEffect(() => {
    const particleInterval = setInterval(() => {
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.15,
            life: p.life - 0.02,
          }))
          .filter(p => p.life > 0 && p.y < 120)
      );
    }, 30);

    return () => clearInterval(particleInterval);
  }, []);

  const rarityEmoji = {
    common: '⭐',
    uncommon: '✨',
    rare: '💎',
    epic: '🔥',
    legendary: '👑',
  };

  const rarityLabel = {
    common: 'שכיח',
    uncommon: 'נדיר',
    rare: 'נדיר מאוד',
    epic: 'אפי',
    legendary: 'אגדי',
  };

  return (
    <div
      className={`fixed font-hebrew transition-all duration-300 pointer-events-none ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
      style={{
        right: '1.5rem',
        top: `${1.5 + stackPosition * 8.5}rem`,
      }}
    >
      <div
        className="relative overflow-hidden rounded-lg shadow-2xl pointer-events-auto"
        style={{
          background: rarityConfig.bg,
          border: `2px solid ${rarityConfig.border}`,
          boxShadow: `0 0 30px ${rarityConfig.glow}, inset 0 0 20px ${rarityConfig.glow}`,
          width: '340px',
        }}
      >
        {/* Confetti Canvas Background */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ mixBlendMode: 'screen' }}
        >
          {particles.map(p => (
            <circle
              key={p.id}
              cx={`${p.x}%`}
              cy={`${p.y}%`}
              r={p.size}
              fill={rarityConfig.border}
              opacity={p.life}
            />
          ))}
        </svg>

        {/* Content */}
        <div className="relative z-10 p-4 flex gap-4" dir="rtl">
          {/* Icon */}
          <div
            className="flex-shrink-0 w-16 h-16 rounded-lg flex items-center justify-center text-3xl"
            style={{
              background: rarityConfig.bg,
              border: `2px solid ${rarityConfig.border}`,
            }}
          >
            {badge.icon}
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-bold text-white truncate">{badge.nameHe}</h3>
              <span className="text-xs flex-shrink-0">{rarityEmoji[badge.rarity]}</span>
            </div>
            <p className="text-xs text-gray-300 line-clamp-2 mb-2">{badge.descriptionHe}</p>

            {/* XP Reward */}
            <div className="flex items-center gap-2 mb-2">
              <div className="text-xs font-mono bg-dj-dark rounded px-2 py-1">
                <span className="text-dj-green">+{badge.xpReward}</span>
                <span className="text-gray-500 mr-1">XP</span>
              </div>
              <span
                className="text-xs font-bold px-2 py-1 rounded"
                style={{
                  background: rarityConfig.bg,
                  color: rarityConfig.border,
                  border: `1px solid ${rarityConfig.border}`,
                }}
              >
                {rarityLabel[badge.rarity]}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-dj-dark rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-100"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${rarityConfig.border}, ${rarityConfig.glow})`,
                }}
              />
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onDismiss, 300);
            }}
            className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 transition-colors text-gray-400 hover:text-white text-sm"
          >
            ×
          </button>
        </div>

        {/* Animated Glow Border */}
        <div
          className="absolute inset-0 rounded-lg pointer-events-none opacity-0 animate-pulse"
          style={{
            boxShadow: `inset 0 0 20px ${rarityConfig.glow}`,
          }}
        />
      </div>
    </div>
  );
}

// Toast Container Component
interface AchievementToastContainerProps {
  toasts: (Badge & { id: string })[];
  onDismiss: (id: string) => void;
}

export function AchievementToastContainer({
  toasts,
  onDismiss,
}: AchievementToastContainerProps) {
  return (
    <div className="fixed inset-0 pointer-events-none">
      {toasts.map((toast, index) => (
        <AchievementToast
          key={toast.id}
          badge={toast}
          onDismiss={() => onDismiss(toast.id)}
          stackPosition={index}
        />
      ))}
    </div>
  );
}
