import { useState } from 'react';
import { X } from 'lucide-react';
import { Habit, CreateHabitDto } from '../../types';
import { useHabitsStore } from '../../stores/habitsStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {habit ? 'Редактировать привычку' : 'Новая привычка'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Переключатель типа привычки */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тип привычки
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isBad: false })}
                className={`py-3 rounded-lg border-2 transition-colors ${
                  !formData.isBad
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">✅</div>
                <div className="text-sm font-medium">Полезная</div>
                <div className="text-xs text-gray-500">Формирую привычку</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isBad: true })}
                className={`py-3 rounded-lg border-2 transition-colors ${
                  formData.isBad
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">🚫</div>
                <div className="text-sm font-medium">Вредная</div>
                <div className="text-xs text-gray-500">Отказываюсь от привычки</div>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Цвет
              </label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full h-10 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Сложность
            </label>
            <div className="flex gap-2">
              {[1, 2, 3].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData({ ...formData, difficulty: level })}
                  className={`flex-1 py-3 rounded-lg border-2 transition-colors ${
                    formData.difficulty === level
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{difficultyEmojis[level as 1 | 2 | 3]}</div>
                  <div className="text-sm font-medium">
                    {level === 1 ? 'Легко' : level === 2 ? 'Средне' : 'Сложно'}
                  </div>
                  <div className="text-xs text-gray-500">{level * 10} XP</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
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
