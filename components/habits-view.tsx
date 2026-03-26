"use client";

import { useState } from "react";
import { Card, CardBody, Progress, Checkbox } from "@heroui/react";
import { Target, Flame, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const mockHabits = [
  { id: 1, name: "Чтение", icon: "book", color: "#8b5cf6", completedToday: false, weekProgress: 60 },
  { id: 2, name: "Тренировка", icon: "dumbbell", color: "#ec4899", completedToday: true, weekProgress: 80 },
];

const mockChartData = [
  { date: "Пн", count: 2 }, { date: "Вт", count: 3 }, { date: "Ср", count: 1 },
  { date: "Чт", count: 4 }, { date: "Пт", count: 2 }, { date: "Сб", count: 0 }, { date: "Вс", count: 5 },
];

export default function HabitsView() {
  const [habits, setHabits] = useState(mockHabits);

  const toggleHabit = (id: number) => {
    // В реальности здесь будет вызов POST /api/v1/habits/{id}/toggle
    setHabits(habits.map(h => h.id === id ? { ...h, completedToday: !h.completedToday } : h));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500"><Target size={24} /></div>
            <div>
              <p className="text-sm text-muted-foreground">Всего привычек</p>
              <p className="text-2xl font-semibold">{habits.length}</p>
            </div>
          </CardBody>
        </Card>
        <Card className="glass-card">
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500"><Flame size={24} /></div>
            <div>
              <p className="text-sm text-muted-foreground">Текущий стрик</p>
              <p className="text-2xl font-semibold">5 дней</p>
            </div>
          </CardBody>
        </Card>
        <Card className="glass-card">
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-xl text-green-500"><Activity size={24} /></div>
            <div>
              <p className="text-sm text-muted-foreground">Выполнение за неделю</p>
              <p className="text-2xl font-semibold">70%</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Сетка привычек */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {habits.map((habit) => (
          <Card key={habit.id} className="glass-card transition-all hover:-translate-y-1">
            <CardBody className="flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: habit.color }}>
                    <Target size={20} />
                  </div>
                  <h3 className="font-medium text-lg">{habit.name}</h3>
                </div>
                <Checkbox
                  isSelected={habit.completedToday}
                  onValueChange={() => toggleHabit(habit.id)}
                  color="success"
                  size="lg"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1 text-muted-foreground">
                  <span>Прогресс недели</span>
                  <span>{habit.weekProgress}%</span>
                </div>
                <Progress value={habit.weekProgress} color="primary" className="h-2" />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Аналитика */}
      <Card className="glass-card mt-4">
        <CardBody>
          <h3 className="text-lg font-medium mb-4">Активность за 7 дней</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockChartData}>
                <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }} contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Bar dataKey="count" fill="url(#colorUv)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
