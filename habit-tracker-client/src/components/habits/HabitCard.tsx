import { motion } from 'framer-motion';
import { AlertTriangle, Check, Trash2, Edit } from 'lucide-react';
import { Habit } from '../../types';
import { useHabitsStore } from '../../stores/habitsStore';

interface HabitCardProps {
  habit: Habit;
  onEdit?: (habit: Habit) => void;
}

export const HabitCard = ({ habit, onEdit }: HabitCardProps) => {
  const { toggleComplete, deleteHabit, recordRelapse } = useHabitsStore();

  const difficultyColors = {
    1: 'bg-green-100 text-green-800',
    2: 'bg-yellow-100 text-yellow-800',
    3: 'bg-red-100 text-red-800',
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
      className={`bg-white rounded-xl shadow-md p-4 border-l-4 ${
        habit.isBad 
          ? 'border-red-500' 
          : habit.isCompletedToday 
            ? 'border-green-500' 
            : 'border-gray-300'
      }`}
      style={{ borderLeftColor: habit.color || undefined }}
    >
      <div className="flex items-start gap-3">
        {/* Для вредных привычек — кнопка срыва, для полезных — выполнения */}
        {habit.isBad ? (
          <button
            onClick={handleRelapse}
            className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-colors"
            title="Записать срыв"
          >
            <AlertTriangle className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={() => toggleComplete(habit.id, !habit.isCompletedToday)}
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              habit.isCompletedToday
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {habit.isCompletedToday && <Check className="w-5 h-5" />}
          </button>
        )}

        <div className="flex-1">
          <div className="flex items-center gap-2">
            {habit.icon && <span className="text-xl">{habit.icon}</span>}
            <h3
              className={`font-semibold ${
                habit.isBad ? 'text-red-600' : habit.isCompletedToday ? 'line-through text-gray-400' : ''
              }`}
            >
              {habit.name}
            </h3>
            {habit.isBad && (
              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                Вредная
              </span>
            )}
          </div>

          {habit.description && (
            <p className="text-sm text-gray-500 mt-1">{habit.description}</p>
          )}

          <div className="flex items-center gap-2 mt-2">
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                difficultyColors[habit.difficulty as 1 | 2 | 3]
              }`}
            >
              Сложность: {habit.difficulty}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
              🔥 {habit.currentStreak} дн.
            </span>
          </div>

          {habit.lastRelapseDate && (
            <p className="text-xs text-red-500 mt-1">
              Последний срыв: {new Date(habit.lastRelapseDate).toLocaleDateString('ru-RU')}
            </p>
          )}
        </div>

        <div className="flex gap-1">
          {onEdit && (
            <button
              onClick={() => onEdit(habit)}
              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => deleteHabit(habit.id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
