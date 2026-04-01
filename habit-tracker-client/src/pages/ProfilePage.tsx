import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, Edit2, Save, X, LogOut, Moon, Sun } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import { useGamificationStore } from '../stores/gamificationStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LevelProgress } from '../components/gamification/LevelProgress';
import { StreakDisplay } from '../components/gamification/StreakDisplay';
import { cn } from '../lib/utils';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, setUser, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { profile, fetchProfile } = useGamificationStore();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSave = () => {
    // Здесь можно добавить API вызов для обновления профиля
    setUser({ ...user!, username });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setUsername(user?.username || '');
    setIsEditing(false);
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-slate-200/50 dark:border-dark-border/50">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Профиль</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-dark-surface2 
                  hover:bg-slate-200 dark:hover:bg-dark-border 
                  transition-all duration-200 flex items-center justify-center"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-500" />
                )}
              </button>
              <Button variant="ghost" onClick={handleLogout} size="sm">
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Выйти</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Карточка профиля */}
          <Card className="overflow-hidden">
            <div className="relative h-32 bg-gradient-to-r from-primary-600 via-primary-700 to-purple-700">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full blur-2xl" />
              </div>
            </div>
            
            <div className="relative -mt-16 px-6 pb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                {/* Аватар */}
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 
                  shadow-xl shadow-primary-500/30 flex items-center justify-center flex-shrink-0">
                  <User className="w-16 h-16 text-white" />
                </div>
                
                {/* Информация */}
                <div className="flex-1 pt-16 sm:pt-0">
                  {isEditing ? (
                    <div className="flex items-center gap-3">
                      <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="max-w-xs"
                        placeholder="Ваше имя"
                      />
                      <Button size="sm" onClick={handleSave}>
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="secondary" onClick={handleCancel}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {user.username}
                      </h2>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-2 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 
                          hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(user.createdAt || Date.now()).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Геймификация */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LevelProgress />
            
            {profile && (
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 
                    flex items-center justify-center">
                    <span className="text-xl">🔥</span>
                  </div>
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
                  <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                    {profile.totalCompletions}
                  </span>
                </div>
              </Card>
            )}
          </div>

          {/* Статистика */}
          <Card>
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-4">
              Статистика
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-dark-surface2">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {profile?.totalCompletions || 0}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Всего выполнений
                </div>
              </div>
              <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-dark-surface2">
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {profile?.level || 1}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Уровень
                </div>
              </div>
              <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-dark-surface2">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {profile?.currentStreak || 0}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Дней подряд
                </div>
              </div>
              <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-dark-surface2">
                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {profile?.longestStreak || 0}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Лучшая серия
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};
