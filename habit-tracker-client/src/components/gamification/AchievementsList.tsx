import { useGamificationStore } from '../../stores/gamificationStore';
import { Card } from '../ui/Card';
import { Check, Lock, Trophy } from 'lucide-react';
import { cn } from '../../lib/utils';

export const AchievementsList = () => {
  const { achievements } = useGamificationStore();

  const earnedCount = achievements.filter(a => a.isEarned).length;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Достижения</h3>
        </div>
        <span className="text-sm font-medium px-2.5 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400">
          {earnedCount}/{achievements.length}
        </span>
      </div>
      
      <div className="space-y-2">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={cn(
              'flex items-center gap-3 p-3 rounded-xl transition-all duration-200',
              achievement.isEarned 
                ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20' 
                : 'bg-slate-50 dark:bg-dark-surface2 opacity-70'
            )}
          >
            <div className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0',
              achievement.isEarned 
                ? 'bg-white dark:bg-dark-surface shadow-md' 
                : 'bg-slate-200 dark:bg-dark-border grayscale'
            )}>
              {achievement.icon || '🏆'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate">
                {achievement.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {achievement.description}
              </p>
            </div>
            {achievement.isEarned ? (
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-white" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-dark-border flex items-center justify-center flex-shrink-0">
                <Lock className="w-4 h-4 text-slate-400" />
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
