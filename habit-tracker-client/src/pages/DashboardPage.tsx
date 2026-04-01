import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Flame } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useHabitsStore } from '../stores/habitsStore';
import { useGamificationStore } from '../stores/gamificationStore';
import { HabitList } from '../components/habits/HabitList';
import { LevelProgress } from '../components/gamification/LevelProgress';
import { StreakDisplay } from '../components/gamification/StreakDisplay';
import { AchievementsList } from '../components/gamification/AchievementsList';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { cn } from '../lib/utils';

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
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-slate-200/50 dark:border-dark-border/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="hidden sm:flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl shadow-lg shadow-primary-500/30">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100">{user?.username}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" onClick={handleLogout} size="sm">
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Выйти</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Основная колонка - привычки */}
          <div className="lg:col-span-2">
            <HabitList />
          </div>

          {/* Боковая колонка - геймификация */}
          <div className="space-y-6">
            <LevelProgress />

            {profile && (
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Серии</h3>
                </div>
                <StreakDisplay
                  currentStreak={profile.currentStreak}
                  longestStreak={profile.longestStreak}
                />
                <div className={cn(
                  'mt-4 pt-4 border-t border-slate-100 dark:border-dark-border',
                  'flex justify-between items-center'
                )}>
                  <span className="text-sm text-slate-600 dark:text-slate-400">Всего выполнений</span>
                  <span className="text-lg font-bold text-primary-600 dark:text-primary-400">{profile.totalCompletions}</span>
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
