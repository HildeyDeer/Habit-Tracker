import { useEffect } from 'react';
import { LogOut, User, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useHabitsStore } from '../stores/habitsStore';
import { useGamificationStore } from '../stores/gamificationStore';
import { HabitList } from '../components/habits/HabitList';
import { LevelProgress } from '../components/gamification/LevelProgress';
import { StreakDisplay } from '../components/gamification/StreakDisplay';
import { AchievementsList } from '../components/gamification/AchievementsList';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { fetchHabits } = useHabitsStore();
  const { profile, fetchProfile, fetchAchievements } = useGamificationStore();

  useEffect(() => {
    fetchHabits();
    fetchProfile();
    fetchAchievements();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">{user?.username}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="w-5 h-5 mr-2" />
            Выйти
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Основная колонка - привычки */}
          <div className="lg:col-span-2">
            <HabitList />
          </div>

          {/* Боковая колонка - геймификация */}
          <div className="space-y-4">
            <LevelProgress />

            {profile && (
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <h3 className="font-bold">Статистика</h3>
                </div>
                <StreakDisplay
                  currentStreak={profile.currentStreak}
                  longestStreak={profile.longestStreak}
                />
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Всего выполнений</span>
                    <span className="font-bold">{profile.totalCompletions}</span>
                  </div>
                </div>
              </Card>
            )}

            <AchievementsList />
          </div>
        </div>
      </main>
    </div>
  );
};
