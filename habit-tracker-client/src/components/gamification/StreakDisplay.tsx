import { Flame, TrendingUp } from 'lucide-react';

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
}

export const StreakDisplay = ({ currentStreak, longestStreak }: StreakDisplayProps) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-4">
        <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full blur-xl" />
        <div className="relative">
          <Flame className="w-6 h-6 text-white/80 mb-2" />
          <p className="text-2xl font-bold text-white">{currentStreak}</p>
          <p className="text-xs text-white/70">Текущая серия</p>
        </div>
      </div>
      
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl p-4">
        <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full blur-xl" />
        <div className="relative">
          <TrendingUp className="w-6 h-6 text-white/80 mb-2" />
          <p className="text-2xl font-bold text-white">{longestStreak}</p>
          <p className="text-xs text-white/70">Лучшая серия</p>
        </div>
      </div>
    </div>
  );
};
