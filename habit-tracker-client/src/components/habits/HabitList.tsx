import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHabitsStore } from '../../stores/habitsStore';
import { HabitCard } from './HabitCard';
import { HabitForm } from './HabitForm';
import { Button } from '../ui/Button';
import { Habit } from '../../types';
import { cn } from '../../lib/utils';

export const HabitList = () => {
  const { habits, fetchHabits } = useHabitsStore();
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [filter, setFilter] = useState<'all' | 'good' | 'bad'>('all');

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingHabit(null);
  };

  const completedToday = habits.filter((h) => h.isCompletedToday).length;
  const goodHabits = habits.filter(h => !h.isBad);
  const badHabits = habits.filter(h => h.isBad);
  
  const filteredHabits = filter === 'good' ? goodHabits : filter === 'bad' ? badHabits : habits;
  
  const progress = habits.length > 0 ? (completedToday / habits.length) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Мои привычки</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            <span className="font-medium text-emerald-600 dark:text-emerald-400">{goodHabits.length}</span> полезных • 
            <span className="font-medium text-red-600 dark:text-red-400"> {badHabits.length}</span> вредных
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} size="lg">
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Добавить</span>
        </Button>
      </div>

      {/* Фильтры */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={cn(
            'px-4 py-2 rounded-xl text-sm font-medium transition-all',
            filter === 'all'
              ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
              : 'bg-slate-100 dark:bg-dark-surface2 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-dark-border'
          )}
        >
          Все ({habits.length})
        </button>
        <button
          onClick={() => setFilter('good')}
          className={cn(
            'px-4 py-2 rounded-xl text-sm font-medium transition-all',
            filter === 'good'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
              : 'bg-slate-100 dark:bg-dark-surface2 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-dark-border'
          )}
        >
          Полезные ({goodHabits.length})
        </button>
        <button
          onClick={() => setFilter('bad')}
          className={cn(
            'px-4 py-2 rounded-xl text-sm font-medium transition-all',
            filter === 'bad'
              ? 'bg-red-600 text-white shadow-lg shadow-red-500/30'
              : 'bg-slate-100 dark:bg-dark-surface2 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-dark-border'
          )}
        >
          Вредные ({badHabits.length})
        </button>
      </div>

      {/* Прогресс за день */}
      {habits.length > 0 && (
        <div className="bg-white dark:bg-dark-surface rounded-2xl p-4 border border-slate-100 dark:border-dark-border">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Выполнено сегодня
            </span>
            <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
              {completedToday}/{habits.length}
            </span>
          </div>
          <div className="h-2.5 bg-slate-100 dark:bg-dark-surface2 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      {/* Список привычек */}
      {filteredHabits.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-dark-surface rounded-2xl border border-dashed border-slate-200 dark:border-dark-border">
          <div className="text-6xl mb-4">
            {filter === 'all' ? '📝' : filter === 'good' ? '✅' : '🚫'}
          </div>
          <p className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
            {filter === 'all' 
              ? 'У вас пока нет привычек' 
              : filter === 'good' 
                ? 'Нет полезных привычек' 
                : 'Нет вредных привычек'}
          </p>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Начните отслеживать свои привычки прямо сейчас
          </p>
          <Button onClick={() => setShowForm(true)} size="lg">
            <Plus className="w-5 h-5" />
            Создать привычку
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredHabits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} onEdit={handleEdit} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {showForm && <HabitForm habit={editingHabit} onClose={handleCloseForm} />}
    </div>
  );
};
