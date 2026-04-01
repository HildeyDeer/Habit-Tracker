import { motion } from 'framer-motion';
import { useGamificationStore } from '../../stores/gamificationStore';
import { Trophy } from 'lucide-react';

export const LevelProgress = () => {
  const { profile } = useGamificationStore();

  if (!profile) return null;

  const progressPercent = Math.min((profile.experiencePoints / profile.xpToNextLevel) * 100, 100);
  const xpRemaining = profile.xpToNextLevel - profile.experiencePoints;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-purple-700 p-6 shadow-xl"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full blur-2xl" />
      </div>

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Trophy className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">Level {profile.level}</p>
              <p className="text-sm text-white/70">Новичок</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/70">До уровня</p>
            <p className="text-xl font-bold text-white">{xpRemaining} XP</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Прогресс</span>
            <span className="text-white font-medium">
              {profile.experiencePoints} / {profile.xpToNextLevel} XP
            </span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full shadow-lg"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
