import { Flame } from 'lucide-react';

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
}

export const StreakDisplay = ({ currentStreak, longestStreak }: StreakDisplayProps) => {
  return (
    <div className="flex gap-4">
      <div className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-lg">
        <Flame className="w-6 h-6 text-orange-500" />
        <div>
          <p className="text-xs text-gray-600">Текущая серия</p>
          <p className="text-xl font-bold text-orange-600">{currentStreak}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-lg">
        <Flame className="w-6 h-6 text-yellow-600" />
        <div>
          <p className="text-xs text-gray-600">Лучшая серия</p>
          <p className="text-xl font-bold text-yellow-700">{longestStreak}</p>
        </div>
      </div>
    </div>
  );
};
