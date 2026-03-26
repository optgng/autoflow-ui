"use client";

import { useState, useRef } from "react";
import useSWR from "swr";
import { Card, CardBody } from "@heroui/react";
import {
  Target, Flame, Activity, Plus, Trash2, X, RefreshCw, Zap, ChevronDown,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { apiClient } from "@/lib/api";
import ModalPortal from "./ui/ModalPortal";
import { useAnimatedMount } from "@/lib/hooks/useAnimatedMount";
import { useTheme } from "next-themes";
import { useDelayedSkeleton } from "@/lib/hooks/useDelayedSkeleton";

/* ─────────────────────────── types ─────────────────────────── */
interface HabitLog {
  id: number;
  date: string;
  is_completed: boolean;
}

interface Habit {
  id: number;
  name: string;
  description: string | null;
  color: string;
  icon: string;
  frequency: string;
  habit_type: "good" | "bad";
  time_of_day: ("morning" | "afternoon" | "evening")[] | null;
  repeat_days: number[] | null;
  current_streak: number;
  habit_strength: number;
  logs: HabitLog[];
}

interface ActivityPoint { date: string; count: number }

/* ─────────────────────────── constants ─────────────────────── */
const COLORS = ["#3b82f6", "#ec4899", "#8b5cf6", "#10b981", "#f59e0b"];

const TIME_OF_DAY_OPTIONS: { value: "morning" | "afternoon" | "evening"; label: string }[] = [
  { value: "morning",   label: "🌅 Утро"    },
  { value: "afternoon", label: "☀️ День"    },
  { value: "evening",   label: "🌙 Вечер"   },
];

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const FREQUENCY_OPTIONS = [
  { value: "daily",    label: "Ежедневно"        },
  { value: "weekly",   label: "По дням недели"   },
  { value: "monthly",  label: "Ежемесячно"       },
  { value: "interval", label: "Интервал"         },
];

/* ─────────────────────────── fetcher ───────────────────────── */
const fetcher = (url: string) => apiClient.get(url).then((r) => r.data);

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function HabitsView() {
  const { data: habits, mutate } = useSWR("/habits", fetcher, {
    onSuccess: () => setIsInitialLoad(false),
  });
  const { data: activityData, mutate: mutateActivity } = useSWR<ActivityPoint[]>(
    "habits/activity/summary?days=7",
    fetcher,
    { revalidateOnFocus: false }
  );

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const showSkeleton = useDelayedSkeleton(!habits && isInitialLoad, 2000);

  /* ── modal state ── */
  const [isModalOpen, setIsModalOpen]       = useState(false);
  const [newHabitName, setNewHabitName]     = useState("");
  const [newHabitColor, setNewHabitColor]   = useState(COLORS[0]);
  const [isSubmitting, setIsSubmitting]     = useState(false);

  // Новые поля формы
  const [habitType, setHabitType]           = useState<"good" | "bad">("good");
  const [timeOfDay, setTimeOfDay]           = useState<("morning" | "afternoon" | "evening")[]>([]);
  const [frequency, setFrequency]           = useState("daily");
  const [repeatDays, setRepeatDays]         = useState<number[]>([]);

  /* ── delete state ── */
  const [deleteId, setDeleteId]       = useState<number | null>(null);
  const [isDeleting, setIsDeleting]   = useState(false);
  const [removingId, setRemovingId]   = useState<number | null>(null);

  const { mounted: deleteMounted, animating: deleteAnimating } = useAnimatedMount(deleteId !== null, 220);
  const deleteHabitRef = useRef<Habit | undefined>(undefined);
  const deleteTarget   = habits?.find((h: Habit) => h.id === deleteId);
  if (deleteTarget) deleteHabitRef.current = deleteTarget;
  const displayDeleteHabit = deleteHabitRef.current;

  const today = new Date().toISOString().split("T")[0];

  /* ─────────────────────────── helpers ──────────────────────── */
  const resetModal = () => {
    setNewHabitName("");
    setNewHabitColor(COLORS[0]);
    setHabitType("good");
    setTimeOfDay([]);
    setFrequency("daily");
    setRepeatDays([]);
  };

  const toggleTimeOfDay = (val: "morning" | "afternoon" | "evening") => {
    setTimeOfDay((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  };

  const toggleRepeatDay = (idx: number) => {
    setRepeatDays((prev) =>
      prev.includes(idx) ? prev.filter((d) => d !== idx) : [...prev, idx]
    );
  };

  /* ─────────────────────────── actions ──────────────────────── */
  const toggleHabit = async (habitId: number) => {
    const currentHabit = habits?.find((h: Habit) => h.id === habitId);
    const wasCompleted  = currentHabit?.logs.some(
      (l: HabitLog) => l.date === today && l.is_completed
    ) ?? false;
    const willBeCompleted = !wasCompleted;

    const updatedHabits = habits?.map((h: Habit) => {
      if (h.id !== habitId) return h;
      const idx    = h.logs.findIndex((l: HabitLog) => l.date === today);
      const newLogs = [...h.logs];
      if (idx >= 0) {
        newLogs[idx] = { ...newLogs[idx], is_completed: willBeCompleted };
      } else {
        newLogs.push({ id: Date.now(), date: today, is_completed: true });
      }
      return { ...h, logs: newLogs };
    });
    mutate(updatedHabits, false);

    const optimisticActivity = activityData?.map((d: ActivityPoint) => {
      if (d.date !== today) return d;
      return { ...d, count: willBeCompleted ? d.count + 1 : Math.max(0, d.count - 1) };
    });
    mutateActivity(optimisticActivity, false);

    try {
      const resp = await apiClient.post(`/habits/${habitId}/toggle`, null, {
        params: { target_date: today },
      });
      const { current_streak, habit_strength } = resp.data;
      mutate(
        habits?.map((h: Habit) =>
          h.id === habitId ? { ...h, current_streak, habit_strength } : h
        ),
        false
      );
      mutate();
      mutateActivity();
    } catch (error) {
      console.error("Failed to toggle habit", error);
      mutate();
      mutateActivity();
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`habits/${deleteId}`);
      mutate(habits?.filter((h: Habit) => h.id !== deleteId), false);
      setDeleteId(null);
    } catch (err) {
      console.error("Failed to delete habit", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setRemovingId(deleteId);
    await new Promise((r) => setTimeout(r, 280));
    await handleDelete();
    setRemovingId(null);
  };

  const createHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    setIsSubmitting(true);
    try {
      await apiClient.post("/habits/", {
        name:         newHabitName,
        color:        newHabitColor,
        frequency,
        habit_type:   habitType,
        time_of_day:  timeOfDay.length > 0  ? timeOfDay  : null,
        repeat_days:  frequency === "weekly" ? repeatDays : null,
      });
      resetModal();
      setIsModalOpen(false);
      mutate();
    } catch (error) {
      console.error("Failed to create habit", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ─────────────────────────── chart ────────────────────────── */
  const chartData =
    activityData?.map((d: ActivityPoint) => ({
      date: new Date(d.date + "T00:00:00").toLocaleDateString("ru-RU", { weekday: "short" }),
      fullDate: new Date(d.date + "T00:00:00").toLocaleDateString("ru-RU", {
        weekday: "long", day: "numeric", month: "short",
      }),
      count: d.count,
    })) ?? Array.from({ length: 7 }, () => ({ date: "—", fullDate: "—", count: 0 }));

  const totalHabits         = habits?.length ?? 0;
  const completedTodayCount = habits?.filter((h: Habit) =>
    h.logs.some((l: HabitLog) => l.date === today && l.is_completed)
  ).length ?? 0;
  const todayProgress = totalHabits > 0 ? Math.round((completedTodayCount / totalHabits) * 100) : 0;

  const tooltipStyle = {
    background:   isDark ? "#111113" : "#FAF7F2",
    border:       `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(180,155,120,0.3)"}`,
    borderRadius: 12,
    fontSize:     12,
    color:        isDark ? "#fff" : "#1A1510",
  };

  /* ─────────────────────────── sub-components ───────────────── */
  function HabitSkeleton() {
    return (
      <div className="glass-card rounded-2xl p-5 border border-white/10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl shimmer" />
            <div className="h-4 shimmer rounded w-28" />
          </div>
          <div className="w-7 h-7 shimmer rounded-lg" />
        </div>
        <div className="h-2 shimmer rounded-full w-full mt-2" />
        <div className="h-3 shimmer rounded w-20 mt-3" />
        <div className="h-2 shimmer rounded-full w-full mt-3" />
        <div className="h-3 shimmer rounded w-24 mt-1.5" />
      </div>
    );
  }

  const CustomBarTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const fullDate = payload[0]?.payload?.fullDate;
    const count    = payload[0]?.value ?? 0;
    return (
      <div style={tooltipStyle} className="px-3.5 py-2.5 rounded-xl shadow-lg pointer-events-none">
        <p className="text-xs mb-1.5" style={{ color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)" }}>
          {fullDate}
        </p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#3b82f6" }} />
          <span className="text-sm font-semibold">Выполнено: {count}</span>
        </div>
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════════════ */
  return (
    <div className="flex flex-col gap-6">

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="glass-card hover-lift card-hover-glow transition-all rounded-2xl border border-white/10">
          <CardBody className="p-5 flex flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Target size={24} />
            </div>
            <div>
              <p className="text-xs text-default-500 font-medium uppercase tracking-wide">Всего привычек</p>
              <p className="text-2xl font-bold text-foreground mt-1">{totalHabits}</p>
            </div>
          </CardBody>
        </Card>

        <Card className="glass-card hover-lift card-hover-glow transition-all rounded-2xl border border-white/10">
          <CardBody className="p-5 flex flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning/10 text-warning flex items-center justify-center">
              <Flame size={24} />
            </div>
            <div>
              <p className="text-xs text-default-500 font-medium uppercase tracking-wide">Выполнено сегодня</p>
              <p className="text-2xl font-bold text-foreground mt-1">{completedTodayCount}</p>
            </div>
          </CardBody>
        </Card>

        <Card className="glass-card hover-lift card-hover-glow transition-all rounded-2xl border border-white/10">
          <CardBody className="p-5 flex flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 text-success flex items-center justify-center">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-xs text-default-500 font-medium uppercase tracking-wide">Прогресс дня</p>
              <p className="text-2xl font-bold text-foreground mt-1">{todayProgress}%</p>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="flex items-center justify-between mt-2">
        <h2 className="text-lg font-semibold text-foreground">Мои привычки</h2>
        <button
          onClick={() => { resetModal(); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl hover:opacity-90 transition-opacity text-sm font-medium shadow-glow"
        >
          <Plus size={16} /> Создать
        </button>
      </div>

      {/* Сетка привычек */}
      {isInitialLoad ? (
        showSkeleton ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array(3).fill(0).map((_, i) => <HabitSkeleton key={i} />)}
          </div>
        ) : null
      ) : (
        <div key="habits-loaded" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {habits?.length === 0 ? (
            <p className="text-default-400 text-sm col-span-full py-8 text-center glass-card rounded-2xl border border-dashed border-divider">
              Привычек нет. Добавь первую!
            </p>
          ) : (
            habits?.map((habit: Habit, idx: number) => {
              const isCompletedToday = habit.logs.some(
                (l: HabitLog) => l.date === today && l.is_completed
              );
              const last7 = Array.from({ length: 7 }, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (6 - i));
                const dateStr = d.toISOString().split("T")[0];
                return habit.logs.some((l: HabitLog) => l.date === dateStr && l.is_completed);
              });

              const strength      = habit.habit_strength ?? 0;
              const strengthLabel =
                strength >= 75 ? "Сильная" :
                strength >= 40 ? "Формируется" : "Слабая";

              const isBad         = habit.habit_type === "bad";
              const toggleLabel   = isCompletedToday
                ? (isBad ? "✗ Сорвался" : "✓ Выполнено")
                : (isBad ? "Сорвался"   : "Отметить");

              return (
                <Card
                  key={habit.id}
                  className={`glass-card hover-lift transition-all rounded-2xl overflow-hidden border border-white/10 stagger-container ${
                    removingId === habit.id ? "opacity-0 scale-95 pointer-events-none" : "opacity-100"
                  }`}
                  style={{ animationDelay: `${idx * 0.07}s`, transition: "opacity 0.28s ease, transform 0.28s ease" }}
                >
                  <div className="h-1 w-full" style={{ backgroundColor: habit.color }} />

                  <CardBody className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: habit.color + "22", border: `1px solid ${habit.color}44` }}
                        >
                          <Target size={18} style={{ color: habit.color }} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="font-semibold text-foreground truncate">{habit.name}</p>
                            {isBad && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-danger/15 text-danger font-medium flex-shrink-0">
                                ❌
                              </span>
                            )}
                          </div>
                          {habit.description && (
                            <p className="text-xs text-default-400 mt-0.5 truncate">{habit.description}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => setDeleteId(habit.id)}
                        className="p-1.5 rounded-lg text-default-300 hover:text-danger hover:bg-danger/10 transition-colors flex-shrink-0 ml-2"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {/* Стрейк */}
                    <div className="flex items-center gap-1.5 mb-3">
                      <Flame size={14} className={habit.current_streak > 0 ? "text-warning" : "text-default-300"} />
                      <span className={`text-xs font-medium ${habit.current_streak > 0 ? "text-warning" : "text-default-400"}`}>
                        {habit.current_streak} дн. стрейк
                      </span>
                    </div>

                    {/* Сила привычки */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1">
                          <Zap size={12} style={{ color: habit.color }} className="flex-shrink-0" />
                          <span className="text-xs text-default-500 font-medium">Сила привычки</span>
                        </div>
                        <span className="text-xs font-semibold" style={{ color: habit.color }}>
                          {strength.toFixed(0)}%
                          <span className="text-default-400 font-normal ml-1">· {strengthLabel}</span>
                        </span>
                      </div>
                      <div
                        className="w-full h-1.5 rounded-full overflow-hidden"
                        style={{ backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)" }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${strength}%`, backgroundColor: habit.color, boxShadow: `0 0 6px ${habit.color}66` }}
                        />
                      </div>
                    </div>

                    {/* Последние 7 дней */}
                    <div className="flex gap-1.5 mb-4">
                      {last7.map((done, i) => (
                        <div
                          key={i}
                          className="flex-1 h-1.5 rounded-full transition-all"
                          style={{ backgroundColor: done ? habit.color : (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)") }}
                        />
                      ))}
                    </div>

                    {/* Кнопка выполнения / "Сорвался" */}
                    <button
                      onClick={() => toggleHabit(habit.id)}
                      className={`w-full h-9 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        isCompletedToday
                          ? isBad
                            ? "bg-danger/15 text-danger border border-danger/30 hover:bg-danger/25"
                            : "bg-success/15 text-success border border-success/30 hover:bg-success/25"
                          : "bg-content2 text-default-500 border border-divider hover:bg-content3 hover:text-foreground"
                      }`}
                    >
                      {toggleLabel}
                    </button>
                  </CardBody>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* График активности */}
      <Card className="glass-card rounded-2xl mt-4 border border-white/10">
        <CardBody className="p-6">
          <h3 className="text-base font-semibold mb-6 text-foreground">Активность за 7 дней</h3>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#3b82f6" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#1644B8" stopOpacity={0.9} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  content={<CustomBarTooltip />}
                  cursor={{ fill: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)" }}
                />
                <Bar dataKey="count" fill="url(#colorBar)" radius={[4, 4, 0, 0]} maxBarSize={80} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      {/* ══════════════════ МОДАЛ СОЗДАНИЯ ПРИВЫЧКИ ══════════════════ */}
      {isModalOpen && (
        <ModalPortal>
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-overlay animate-overlay-in">
            <div className="relative glass-modal rounded-2xl w-full max-w-sm p-6 animate-modal-content border border-white/10 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-default-400 hover:text-foreground hover:bg-white/5 transition-colors"
              >
                <X size={20} />
              </button>
              <h2 className="text-xl font-bold mb-5 text-foreground">Новая привычка</h2>

              <form onSubmit={createHabit} className="space-y-5">

                {/* ── Тип привычки (два таба) ── */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-default-600">Тип</label>
                  <div className="flex gap-2 p-1 rounded-xl bg-content2">
                    <button
                      type="button"
                      onClick={() => setHabitType("good")}
                      className={`flex-1 h-9 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                        habitType === "good"
                          ? "bg-success/20 text-success shadow-sm"
                          : "text-default-400 hover:text-foreground"
                      }`}
                    >
                      💪 Хорошая
                    </button>
                    <button
                      type="button"
                      onClick={() => setHabitType("bad")}
                      className={`flex-1 h-9 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                        habitType === "bad"
                          ? "bg-danger/20 text-danger shadow-sm"
                          : "text-default-400 hover:text-foreground"
                      }`}
                    >
                      ❌ Плохая
                    </button>
                  </div>
                  {habitType === "bad" && (
                    <p className="text-xs text-default-400 px-1">
                      Кнопка отметки будет называться «Сорвался»
                    </p>
                  )}
                </div>

                {/* ── Название ── */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-default-600">Название</label>
                  <input
                    autoFocus
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                    placeholder={habitType === "good" ? "Например: Читать 30 минут" : "Например: Сладкое"}
                    className="input-field"
                    required
                  />
                </div>

                {/* ── Цвет ── */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-default-600">Цвет карточки</label>
                  <div className="flex gap-3">
                    {COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setNewHabitColor(c)}
                        className={`w-8 h-8 rounded-full transition-transform ${
                          newHabitColor === c ? "scale-110 ring-2 ring-white/50" : "opacity-70 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                {/* ── Время дня (мультиселект-пилюли) ── */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-default-600">Время дня</label>
                  <div className="flex gap-2 flex-wrap">
                    {TIME_OF_DAY_OPTIONS.map(({ value, label }) => {
                      const active = timeOfDay.includes(value);
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => toggleTimeOfDay(value)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                            active
                              ? "border-primary/50 bg-primary/15 text-primary"
                              : "border-divider bg-content2 text-default-400 hover:text-foreground hover:border-default-400"
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ── Повторение (дропдаун) ── */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-default-600">Повторение</label>
                  <div className="relative">
                    <select
                      value={frequency}
                      onChange={(e) => { setFrequency(e.target.value); setRepeatDays([]); }}
                      className="input-field appearance-none pr-9 cursor-pointer"
                    >
                      {FREQUENCY_OPTIONS.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-default-400 pointer-events-none"
                    />
                  </div>
                </div>

                {/* ── Дни недели (только при weekly) ── */}
                {frequency === "weekly" && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-default-600">Дни недели</label>
                    <div className="grid grid-cols-7 gap-1">
                      {WEEKDAYS.map((day, idx) => {
                        const active = repeatDays.includes(idx);
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => toggleRepeatDay(idx)}
                            className={`h-9 rounded-lg text-xs font-medium transition-all ${
                              active
                                ? "bg-primary text-white shadow-sm"
                                : "bg-content2 text-default-400 hover:bg-content3 hover:text-foreground"
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── Submit ── */}
                <button
                  type="submit"
                  disabled={isSubmitting || !newHabitName.trim()}
                  className="w-full h-11 mt-2 rounded-xl bg-gradient-to-r from-primary to-blue-600 text-white font-semibold flex items-center justify-center gap-2 shadow-glow hover:opacity-90 disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Сохранить"}
                </button>
              </form>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* ══════════════════ МОДАЛ УДАЛЕНИЯ ══════════════════ */}
      {deleteMounted && displayDeleteHabit && (
        <ModalPortal>
          <div
            className={`fixed inset-0 z-[100] flex items-center justify-center px-4 modal-overlay ${
              deleteAnimating ? "animate-overlay-in" : "animate-overlay-out"
            }`}
            onClick={() => setDeleteId(null)}
          >
            <div
              className={`relative glass-modal rounded-2xl p-6 w-full max-w-sm space-y-4 ${
                deleteAnimating ? "animate-modal-content" : "animate-modal-out"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-foreground">Удалить привычку?</h2>
                <button
                  onClick={() => setDeleteId(null)}
                  className="text-default-400 hover:text-foreground p-1 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-content2">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                  style={{ backgroundColor: displayDeleteHabit.color }}
                >
                  <Target size={16} />
                </div>
                <div>
                  <p className="font-medium text-foreground">{displayDeleteHabit.name}</p>
                  <p className="text-xs text-default-400 mt-0.5">
                    Стрейк: {displayDeleteHabit.current_streak} дн. · вся история будет удалена
                  </p>
                </div>
              </div>

              <p className="text-sm text-default-400">
                Все логи и история выполнения будут удалены безвозвратно.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 h-10 rounded-xl bg-content2 hover:bg-content3 transition-colors text-sm font-medium"
                >
                  Отмена
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="flex-1 h-10 rounded-xl bg-danger hover:bg-danger/80 text-white text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isDeleting && <RefreshCw className="w-4 h-4 animate-spin" />}
                  Удалить
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}
