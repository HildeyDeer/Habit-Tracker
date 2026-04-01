import { useState } from 'react';
import { X } from 'lucide-react';
import { Habit, CreateHabitDto } from '../../types';
import { useHabitsStore } from '../../stores/habitsStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { cn } from '../../lib/utils';

interface HabitFormProps {
  habit?: Habit | null;
  onClose: () => void;
}

const difficultyEmojis = {
  1: '😊',
  2: '😐',
  3: '😤',
};

export const HabitForm = ({ habit, onClose }: HabitFormProps) => {
  const { createHabit, updateHabit } = useHabitsStore();
  const [formData, setFormData] = useState<CreateHabitDto>({
    name: habit?.name || '',
    description: habit?.description || '',
    icon: habit?.icon || '',
    color: habit?.color || '#3B82F6',
    difficulty: habit?.difficulty || 1,
    isBad: habit?.isBad || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (habit) {
      await updateHabit(habit.id, formData);
    } else {
      await createHabit(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 dark:border-dark-border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {habit ? 'Редактировать привычку' : 'Новая привычка'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Переключатель типа привычки */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Тип привычки
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isBad: false })}
                className={cn(
                  'py-4 rounded-xl border-2 transition-all duration-200',
                  !formData.isBad
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-slate-200 dark:border-dark-border hover:border-slate-300 dark:hover:border-dark-border bg-white dark:bg-dark-surface'
                )}
              >
                <div className="text-3xl mb-2">✅</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Полезная</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Формирую привычку</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isBad: true })}
                className={cn(
                  'py-4 rounded-xl border-2 transition-all duration-200',
                  formData.isBad
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-slate-200 dark:border-dark-border hover:border-slate-300 dark:hover:border-dark-border bg-white dark:bg-dark-surface'
                )}
              >
                <div className="text-3xl mb-2">🚫</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Вредная</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Отказываюсь от привычки</div>
              </button>
            </div>
          </div>

          <Input
            label="Название"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={formData.isBad ? "Например: Курение" : "Например: Читать 30 минут"}
            required
          />

          <Input
            label="Описание"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder={formData.isBad ? "Например: Не курить после еды" : "Краткое описание привычки"}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Иконка (эмодзи)"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder={formData.isBad ? "🚬" : "📚"}
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Цвет
              </label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full h-11 rounded-xl cursor-pointer border-0 bg-white dark:bg-dark-surface2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Сложность
            </label>
            <div className="flex gap-2">
              {[1, 2, 3].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData({ ...formData, difficulty: level })}
                  className={cn(
                    'flex-1 py-3 rounded-xl border-2 transition-all duration-200',
                    formData.difficulty === level
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-lg shadow-primary-500/20'
                      : 'border-slate-200 dark:border-dark-border hover:border-slate-300 dark:hover:border-dark-border bg-white dark:bg-dark-surface'
                  )}
                >
                  <div className="text-2xl mb-1">{difficultyEmojis[level as 1 | 2 | 3]}</div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {level === 1 ? 'Легко' : level === 2 ? 'Средне' : 'Сложно'}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{level * 10} XP</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Отмена
            </Button>
            <Button type="submit" className="flex-1">
              {habit ? 'Сохранить' : 'Создать'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
