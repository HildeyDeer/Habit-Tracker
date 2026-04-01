import { useGamificationStore } from '../../stores/gamificationStore';
import { Card } from '../ui/Card';
import { Check, Lock } from 'lucide-react';

export const AchievementsList = () => {
  const { achievements } = useGamificationStore();

  return (
    <Card>
      <h3 className="text-lg font-bold mb-4">Достижения</h3>
      <div className="grid gap-3">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`flex items-center gap-3 p-3 rounded-lg ${
              achievement.isEarned ? 'bg-green-50' : 'bg-gray-50 opacity-60'
            }`}
          >
            <div className="text-2xl">{achievement.icon || '🏆'}</div>
            <div className="flex-1">
              <p className="font-medium">{achievement.name}</p>
              <p className="text-sm text-gray-500">{achievement.description}</p>
            </div>
            {achievement.isEarned ? (
              <Check className="w-6 h-6 text-green-500" />
            ) : (
              <Lock className="w-5 h-5 text-gray-400" />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
