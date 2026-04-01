import { motion } from 'framer-motion';
import { AlertTriangle, Check, Trash2, Edit } from 'lucide-react';
import { Habit } from '../../types';
import { useHabitsStore } from '../../stores/habitsStore';
import { cn } from '../../lib/utils';

interface HabitCardProps {
  habit: Habit;
  onEdit?: (habit: Habit) => void;
}

export const HabitCard = ({ habit, onEdit }: HabitCardProps) => {
  const { toggleComplete, deleteHabit, recordRelapse } = useHabitsStore();

  const difficultyColors = {
    1: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    2: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    3: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  };

  const handleRelapse = async () => {
    if (window.confirm('Вы уверены, что хотите записать срыв? Это сбросит серию.')) {
      await recordRelapse(habit.id);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        'group relative bg-white dark:bg-dark-surface rounded-2xl p-4',
        'border-l-4 shadow-md hover:shadow-lg transition-all duration-200',
        'dark:border-slate-700',
        habit.isBad 
          ? 'border-red-500 dark:border-red-500' 
          : habit.isCompletedToday 
            ? 'border-emerald-500 dark:border-emerald-500' 
            : 'border-slate-300 dark:border-slate-600'
      )}
      style={{ borderLeftColor: habit.color || undefined }}
    >
      <div className="flex items-start gap-4">
        {/* Кнопка действия */}
        {habit.isBad ? (
          <button
            onClick={handleRelapse}
            className="flex-shrink-0 w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 
              hover:bg-red-100 dark:hover:bg-red-900/30 
              text-red-600 dark:text-red-400 
              flex items-center justify-center transition-all duration-200"
            title="Записать срыв"
          >
            <AlertTriangle className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={() => toggleComplete(habit.id, !habit.isCompletedToday)}
            className={cn(
              'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200',
              habit.isCompletedToday
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-slate-100 dark:bg-dark-surface2 text-slate-400 hover:bg-slate-200 dark:hover:bg-dark-border'
            )}
          >
            {habit.isCompletedToday && <Check className="w-5 h-5" />}
          </button>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {habit.icon && <span className="text-2xl">{habit.icon}</span>}
            <h3
              className={cn(
                'font-semibold text-lg transition-all',
                habit.isBad 
                  ? 'text-red-600 dark:text-red-400' 
                  : habit.isCompletedToday 
                    ? 'line-through text-slate-400 dark:text-slate-500' 
                    : 'text-slate-900 dark:text-slate-100'
              )}
            >
              {habit.name}
            </h3>
            {habit.isBad && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                Вредная
              </span>
            )}
          </div>

          {habit.description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2">
              {habit.description}
            </p>
          )}

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span
              className={cn(
                'text-xs font-medium px-2.5 py-1 rounded-full',
                difficultyColors[habit.difficulty as 1 | 2 | 3]
              )}
            >
              {habit.difficulty === 1 ? 'Легко' : habit.difficulty === 2 ? 'Средне' : 'Сложно'}
            </span>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
              🔥 {habit.currentStreak} дн.
            </span>
            {!habit.isBad && habit.difficulty && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400">
                +{habit.difficulty * 10} XP
              </span>
            )}
          </div>

          {habit.lastRelapseDate && (
            <p className="text-xs text-red-500 dark:text-red-400 mt-2 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Последний срыв: {new Date(habit.lastRelapseDate).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          )}
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {onEdit && (
            <button
              onClick={() => onEdit(habit)}
              className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => deleteHabit(habit.id)}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
