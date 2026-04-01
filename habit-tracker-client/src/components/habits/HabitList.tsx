import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHabitsStore } from '../../stores/habitsStore';
import { HabitCard } from './HabitCard';
import { HabitForm } from './HabitForm';
import { Button } from '../ui/Button';
import { Habit } from '../../types';

export const HabitList = () => {
  const { habits, fetchHabits } = useHabitsStore();
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

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
  const progress = habits.length > 0 ? (completedToday / habits.length) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Мои привычки</h2>
          <p className="text-gray-500">
            Полезных: {habits.filter(h => !h.isBad).length} | 
            Вредных: {habits.filter(h => h.isBad).length}
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Добавить
        </Button>
      </div>

      {habits.length > 0 && (
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-green-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}

      {habits.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500 mb-4">У вас пока нет привычек</p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Создать первую привычку
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {habits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} onEdit={handleEdit} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {showForm && <HabitForm habit={editingHabit} onClose={handleCloseForm} />}
    </div>
  );
};
