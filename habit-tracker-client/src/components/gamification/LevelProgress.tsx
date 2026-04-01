import { motion } from 'framer-motion';
import { useGamificationStore } from '../../stores/gamificationStore';

export const LevelProgress = () => {
  const { profile } = useGamificationStore();

  if (!profile) return null;

  const progressPercent = (profile.experiencePoints / profile.xpToNextLevel) * 100;

  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-white font-bold text-lg">Level {profile.level}</span>
        <span className="text-white text-sm">
          {profile.experiencePoints} / {profile.xpToNextLevel} XP
        </span>
      </div>
      <div className="h-3 bg-white/30 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-yellow-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};
