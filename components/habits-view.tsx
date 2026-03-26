"use client";

import { useState, useRef, useEffect } from "react";
import useSWR from "swr";
import { Card, CardBody } from "@heroui/react";
import {
  Target, Flame, Activity, Plus, Trash2, X, RefreshCw, Zap, ChevronDown, Pencil, Eye,
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
  start_date: string | null;
  end_date: string | null;
  end_after_count: number | null;
  interval_start: string | null;
  interval_end: string | null;
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
  { value: "daily",    label: "Ежедневно"       },
  { value: "weekly",   label: "По дням недели"  },
  { value: "monthly",  label: "Ежемесячно"      },
  { value: "interval", label: "Интервал"        },
];

const END_CONDITION_LABELS: Record<string, string> = {
  never:   "Никогда",
  by_date: "До даты",
  after_n: "После N выполнений",
};

const CHART_PRESETS = [
  { label: "3 дня",   days: 3  },
  { label: "7 дней",  days: 7  },
  { label: "14 дней", days: 14 },
  { label: "30 дней", days: 30 },
];

/* ─────────────────────────── fetcher ───────────────────────── */
const fetcher = (url: string) => apiClient.get(url).then((r) => r.data);

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function HabitsView() {
  const todayISO = new Date().toISOString().split("T")[0];

  const { data: habits, mutate } = useSWR("/habits", fetcher, {
    onSuccess: () => setIsInitialLoad(false),
  });

  const [chartDays, setChartDays] = useState(7);
  const [chartCustomDate, setChartCustomDate] = useState("");
  const chartQuery = chartCustomDate
    ? `habits/activity/summary?days=30&from=${chartCustomDate}`
    : `habits/activity/summary?days=${chartDays}`;
  const { data: activityData, mutate: mutateActivity } = useSWR<ActivityPoint[]>(
    chartQuery, fetcher, { revalidateOnFocus: false }
  );

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const showSkeleton = useDelayedSkeleton(!habits && isInitialLoad, 2000);

  /* ── create modal state ── */
  const [isModalOpen, setIsModalOpen]     = useState(false);
  const [newHabitName, setNewHabitName]   = useState("");
  const [newHabitColor, setNewHabitColor] = useState(COLORS[0]);
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const [habitType, setHabitType]         = useState<"good" | "bad">("good");
  const [timeOfDay, setTimeOfDay]         = useState<("morning" | "afternoon" | "evening")[]>([]);
  const [frequency, setFrequency]         = useState("daily");
  const [repeatDays, setRepeatDays]       = useState<number[]>([]);
  const [intervalFrom, setIntervalFrom]   = useState("");
  const [intervalTo, setIntervalTo]       = useState("");
  const [startDate, setStartDate]         = useState(todayISO);
  const [endCondition, setEndCondition]   = useState<"never" | "by_date" | "after_n">("never");
  const [endDate, setEndDate]             = useState("");
  const [endCount, setEndCount]           = useState<number>(30);

  /* ── frequency custom dropdown ── */
  const [freqOpen, setFreqOpen] = useState(false);
  const freqRef = useRef<HTMLDivElement>(null);
  const { mounted: freqMounted, animating: freqAnimating } = useAnimatedMount(freqOpen, 160);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (freqRef.current && !freqRef.current.contains(e.target as Node)) setFreqOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  /* ── end-condition custom dropdown ── */
  const [endCondOpen, setEndCondOpen] = useState(false);
  const endCondRef = useRef<HTMLDivElement>(null);
  const { mounted: endCondMounted, animating: endCondAnimating } = useAnimatedMount(endCondOpen, 160);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (endCondRef.current && !endCondRef.current.contains(e.target as Node)) setEndCondOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  /* ── delete state ── */
  const [deleteId, setDeleteId]     = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const { mounted: deleteMounted, animating: deleteAnimating } = useAnimatedMount(deleteId !== null, 220);
  const deleteHabitRef = useRef<Habit | undefined>(undefined);
  const deleteTarget   = habits?.find((h: Habit) => h.id === deleteId);
  if (deleteTarget) deleteHabitRef.current = deleteTarget;
  const displayDeleteHabit = deleteHabitRef.current;

  /* ── view/edit state ── */
  const [viewHabit, setViewHabit]   = useState<Habit | null>(null);
  const [isEditing, setIsEditing]   = useState(false);
  const [editData, setEditData]     = useState<Partial<Habit>>({});
  const [isSaving, setIsSaving]     = useState(false);
  const { mounted: viewMounted, animating: viewAnimating } = useAnimatedMount(viewHabit !== null, 280);

  /* ── edit dropdown states ── */
  const [editFreqOpen, setEditFreqOpen]         = useState(false);
  const editFreqRef = useRef<HTMLDivElement>(null);
  const { mounted: editFreqMounted, animating: editFreqAnimating } = useAnimatedMount(editFreqOpen, 160);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (editFreqRef.current && !editFreqRef.current.contains(e.target as Node)) setEditFreqOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  /* ─────────────────────────── helpers ──────────────────────── */
  const resetModal = () => {
    setNewHabitName(""); setNewHabitColor(COLORS[0]);
    setHabitType("good"); setTimeOfDay([]); setFrequency("daily"); setRepeatDays([]);
    setIntervalFrom(""); setIntervalTo("");
    setStartDate(todayISO); setEndCondition("never"); setEndDate(""); setEndCount(30);
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

  /* ─────────────────────────── metrics ──────────────────────── */
  const goodHabits = habits?.filter((h: Habit) => h.habit_type !== "bad") ?? [];
  const badHabits  = habits?.filter((h: Habit) => h.habit_type === "bad")  ?? [];
  const totalHabits = (habits?.length ?? 0);

  // Хорошая: выполнено = лог есть и is_completed
  const goodCompletedToday = goodHabits.filter((h: Habit) =>
    h.logs.some((l: HabitLog) => l.date === todayISO && l.is_completed)
  ).length;
  // Плохая: «устоял» = лога сегодня НЕТ
  const badHeldToday = badHabits.filter((h: Habit) =>
    !h.logs.some((l: HabitLog) => l.date === todayISO && l.is_completed)
  ).length;
  const completedTodayCount = goodCompletedToday + badHeldToday;
  const todayProgress = totalHabits > 0
    ? Math.round((completedTodayCount / totalHabits) * 100)
    : 0;

  /* ─────────────────────────── actions ──────────────────────── */
  const toggleHabit = async (habitId: number) => {
    const currentHabit  = habits?.find((h: Habit) => h.id === habitId);
    const wasCompleted  = currentHabit?.logs.some(
      (l: HabitLog) => l.date === todayISO && l.is_completed
    ) ?? false;
    const willBeCompleted = !wasCompleted;
    const isBad = currentHabit?.habit_type === "bad";

    const updatedHabits = habits?.map((h: Habit) => {
      if (h.id !== habitId) return h;
      const idx     = h.logs.findIndex((l: HabitLog) => l.date === todayISO);
      const newLogs = [...h.logs];
      if (idx >= 0) {
        newLogs[idx] = { ...newLogs[idx], is_completed: willBeCompleted };
      } else {
        newLogs.push({ id: Date.now(), date: todayISO, is_completed: true });
      }
      return { ...h, logs: newLogs };
    });
    mutate(updatedHabits, false);

    // Для плохой привычки «сорвался» — засчитываем в чарт как -1 (она уже была в норме)
    // Для хорошей — +1 при выполнении, -1 при отмене
    const delta = willBeCompleted ? 1 : -1;
    // Плохие: «сорвался» — добавляет метку, норма — убирает
    const chartDelta = isBad ? (willBeCompleted ? -1 : 1) : delta;
    const optimisticActivity = activityData?.map((d: ActivityPoint) => {
      if (d.date !== todayISO) return d;
      return { ...d, count: Math.max(0, d.count + chartDelta) };
    });
    mutateActivity(optimisticActivity, false);

    try {
      const resp = await apiClient.post(`/habits/${habitId}/toggle`, null, {
        params: { target_date: todayISO },
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
        name:            newHabitName,
        color:           newHabitColor,
        frequency,
        habit_type:      habitType,
        time_of_day:     timeOfDay.length > 0   ? timeOfDay   : null,
        repeat_days:     frequency === "weekly" ? repeatDays  : null,
        interval_start:  frequency === "interval" ? intervalFrom || null : null,
        interval_end:    frequency === "interval" ? intervalTo   || null : null,
        start_date:      startDate   || null,
        end_date:        endCondition === "by_date" ? endDate   || null : null,
        end_after_count: endCondition === "after_n" ? endCount            : null,
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

  const openView = (habit: Habit) => {
    setViewHabit(habit);
    setIsEditing(false);
    setEditData({ ...habit });
  };

  const saveEdit = async () => {
    if (!viewHabit) return;
    setIsSaving(true);
    try {
      const resp = await apiClient.put(`/habits/${viewHabit.id}`, editData);
      mutate(
        habits?.map((h: Habit) => h.id === viewHabit.id ? { ...h, ...resp.data } : h),
        false
      );
      setViewHabit({ ...viewHabit, ...resp.data });
      setIsEditing(false);
      mutate();
    } catch (err) {
      console.error("Failed to save habit", err);
    } finally {
      setIsSaving(false);
    }
  };

  /* ─────────────────────────── chart ────────────────────────── */
  const chartData =
    activityData?.map((d: ActivityPoint) => ({
      date: new Date(d.date + "T00:00:00").toLocaleDateString("ru-RU", { weekday: "short", day: "numeric" }),
      fullDate: new Date(d.date + "T00:00:00").toLocaleDateString("ru-RU", {
        weekday: "long", day: "numeric", month: "short",
      }),
      count: d.count,
    })) ?? Array.from({ length: chartDays || 7 }, () => ({ date: "—", fullDate: "—", count: 0 }));

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
                (l: HabitLog) => l.date === todayISO && l.is_completed
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

              const isBad       = habit.habit_type === "bad";
              // Плохая «в норме» = лога нет сегодня; «сорвался» = лог есть
              const isSuccessToday = isBad ? !isCompletedToday : isCompletedToday;
              const toggleLabel   = isCompletedToday
                ? (isBad ? "✗ Сорвался" : "✓ Выполнено")
                : (isBad ? "Устоять"    : "Отметить");

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
                      <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                        <button
                          onClick={() => openView(habit)}
                          className="p-1.5 rounded-lg text-default-300 hover:text-primary hover:bg-primary/10 transition-colors"
                          title="Просмотр"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteId(habit.id)}
                          className="p-1.5 rounded-lg text-default-300 hover:text-danger hover:bg-danger/10 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
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
                          style={{ backgroundColor: done
                            ? (isBad ? "#ef4444" : habit.color)
                            : (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)") }}
                        />
                      ))}
                    </div>

                    {/* Кнопка */}
                    <button
                      onClick={() => toggleHabit(habit.id)}
                      className={`w-full h-9 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        isSuccessToday
                          ? isBad
                            ? "bg-success/15 text-success border border-success/30 hover:bg-success/25"
                            : "bg-success/15 text-success border border-success/30 hover:bg-success/25"
                          : isCompletedToday && isBad
                            ? "bg-danger/15 text-danger border border-danger/30 hover:bg-danger/25"
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

      {/* ═══ ГРАФИК ═══ */}
      <Card className="glass-card rounded-2xl mt-4 border border-white/10">
        <CardBody className="p-6">
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <h3 className="text-base font-semibold text-foreground mr-auto">Активность</h3>
            {CHART_PRESETS.map(({ label, days }) => (
              <button
                key={days}
                type="button"
                onClick={() => { setChartDays(days); setChartCustomDate(""); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                  chartDays === days && !chartCustomDate
                    ? "border-primary/50 bg-primary/15 text-primary"
                    : "border-divider bg-content2 text-default-400 hover:text-foreground hover:border-default-400"
                }`}
              >
                {label}
              </button>
            ))}
            <input
              type="date"
              value={chartCustomDate}
              max={todayISO}
              onChange={e => { setChartCustomDate(e.target.value); setChartDays(0); }}
              className="input-field h-8 w-36 text-xs"
            />
          </div>
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

      {/* ══════════════════ МОДАЛ СОЗДАНИЯ ══════════════════ */}
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

                {/* Тип */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-default-600">Тип</label>
                  <div className="flex gap-2 p-1 rounded-xl bg-content2">
                    <button type="button" onClick={() => setHabitType("good")}
                      className={`flex-1 h-9 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                        habitType === "good" ? "bg-success/20 text-success shadow-sm" : "text-default-400 hover:text-foreground"
                      }`}>
                      💪 Хорошая
                    </button>
                    <button type="button" onClick={() => setHabitType("bad")}
                      className={`flex-1 h-9 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                        habitType === "bad" ? "bg-danger/20 text-danger shadow-sm" : "text-default-400 hover:text-foreground"
                      }`}>
                      ❌ Плохая
                    </button>
                  </div>
                  {habitType === "bad" && (
                    <p className="text-xs text-default-400 px-1">Кнопка отметки будет «Сорвался»</p>
                  )}
                </div>

                {/* Название */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-default-600">Название</label>
                  <input autoFocus value={newHabitName} onChange={e => setNewHabitName(e.target.value)}
                    placeholder={habitType === "good" ? "Например: Читать 30 минут" : "Например: Сладкое"}
                    className="input-field" required />
                </div>

                {/* Цвет */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-default-600">Цвет карточки</label>
                  <div className="flex gap-3">
                    {COLORS.map(c => (
                      <button key={c} type="button" onClick={() => setNewHabitColor(c)}
                        className={`w-8 h-8 rounded-full transition-transform ${
                          newHabitColor === c ? "scale-110 ring-2 ring-white/50" : "opacity-70 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>

                {/* Время дня */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-default-600">Время дня</label>
                  <div className="flex gap-2 flex-wrap">
                    {TIME_OF_DAY_OPTIONS.map(({ value, label }) => {
                      const active = timeOfDay.includes(value);
                      return (
                        <button key={value} type="button" onClick={() => toggleTimeOfDay(value)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                            active
                              ? "border-primary/50 bg-primary/15 text-primary"
                              : "border-divider bg-content2 text-default-400 hover:text-foreground hover:border-default-400"
                          }`}>
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Повторение — кастомный dropdown */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-default-600">Повторение</label>
                  <div ref={freqRef} className="relative">
                    <button type="button" onClick={() => setFreqOpen(v => !v)}
                      className="input-field flex items-center justify-between cursor-pointer text-left w-full">
                      <span>{FREQUENCY_OPTIONS.find(o => o.value === frequency)?.label}</span>
                      <ChevronDown size={16} className={`text-default-400 transition-transform duration-300 flex-shrink-0 ${freqOpen ? "rotate-180" : ""}`} />
                    </button>
                    {freqMounted && (
                      <div className={`absolute left-0 right-0 mt-1.5 glass-dropdown rounded-xl py-1 z-50 ${
                        freqAnimating ? "animate-dropdown" : "animate-dropdown-out"
                      }`}>
                        {FREQUENCY_OPTIONS.map(({ value, label }) => (
                          <button key={value} type="button"
                            onClick={() => { setFrequency(value); setFreqOpen(false); setRepeatDays([]); setIntervalFrom(""); setIntervalTo(""); }}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors ${
                              frequency === value ? "text-primary font-medium" : "text-foreground"
                            }`}>
                            {label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Дни недели */}
                {frequency === "weekly" && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-default-600">Дни недели</label>
                    <div className="grid grid-cols-7 gap-1">
                      {WEEKDAYS.map((day, idx) => {
                        const active = repeatDays.includes(idx);
                        return (
                          <button key={idx} type="button" onClick={() => toggleRepeatDay(idx)}
                            className={`h-9 rounded-lg text-xs font-medium transition-all ${
                              active ? "bg-primary text-white shadow-sm" : "bg-content2 text-default-400 hover:bg-content3 hover:text-foreground"
                            }`}>
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Интервал */}
                {frequency === "interval" && (
                  <div className="space-y-1.5 animate-modal-content">
                    <label className="text-sm font-medium text-default-600">Период интервала</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <p className="text-xs text-default-400">С</p>
                        <input type="date" value={intervalFrom}
                          onChange={e => setIntervalFrom(e.target.value)}
                          max={intervalTo || undefined} className="input-field" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-default-400">По</p>
                        <input type="date" value={intervalTo}
                          onChange={e => setIntervalTo(e.target.value)}
                          min={intervalFrom || undefined} className="input-field" />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Секция Даты ── */}
                <div className="space-y-3 pt-1">
                  <p className="text-xs font-semibold text-default-400 uppercase tracking-wide">Даты</p>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-default-600">Дата начала</label>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                      className="input-field" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-default-600">Условие завершения</label>
                    <div ref={endCondRef} className="relative">
                      <button type="button" onClick={() => setEndCondOpen(v => !v)}
                        className="input-field flex items-center justify-between cursor-pointer text-left w-full">
                        <span>{END_CONDITION_LABELS[endCondition]}</span>
                        <ChevronDown size={16} className={`text-default-400 transition-transform duration-300 flex-shrink-0 ${endCondOpen ? "rotate-180" : ""}`} />
                      </button>
                      {endCondMounted && (
                        <div className={`absolute left-0 right-0 mt-1.5 glass-dropdown rounded-xl py-1 z-50 ${
                          endCondAnimating ? "animate-dropdown" : "animate-dropdown-out"
                        }`}>
                          {(["never", "by_date", "after_n"] as const).map(val => (
                            <button key={val} type="button"
                              onClick={() => { setEndCondition(val); setEndCondOpen(false); }}
                              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors ${
                                endCondition === val ? "text-primary font-medium" : "text-foreground"
                              }`}>
                              {END_CONDITION_LABELS[val]}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {endCondition === "by_date" && (
                      <input type="date" value={endDate} min={startDate}
                        onChange={e => setEndDate(e.target.value)}
                        className="input-field mt-2 animate-modal-content" />
                    )}
                    {endCondition === "after_n" && (
                      <div className="flex items-center gap-3 mt-2 animate-modal-content">
                        <input type="number" min={1} max={999} value={endCount}
                          onChange={e => setEndCount(Number(e.target.value))}
                          className="input-field w-28" />
                        <span className="text-sm text-default-400">выполнений</span>
                      </div>
                    )}
                  </div>
                </div>

                <button type="submit" disabled={isSubmitting || !newHabitName.trim()}
                  className="w-full h-11 mt-2 rounded-xl bg-gradient-to-r from-primary to-blue-600 text-white font-semibold flex items-center justify-center gap-2 shadow-glow hover:opacity-90 disabled:opacity-50 transition-all">
                  {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Сохранить"}
                </button>
              </form>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* ══════════════════ МОДАЛ ПРОСМОТРА / РЕДАКТИРОВАНИЯ ══════════════════ */}
      {viewMounted && viewHabit && (
        <ModalPortal>
          <div
            className={`fixed inset-0 z-[100] flex items-center justify-center p-4 modal-overlay ${
              viewAnimating ? "animate-overlay-in" : "animate-overlay-out"
            }`}
            onClick={() => { setViewHabit(null); setIsEditing(false); }}
          >
            <div
              className={`relative glass-modal rounded-2xl w-full max-w-sm p-6 border border-white/10 max-h-[90vh] overflow-y-auto ${
                viewAnimating ? "animate-modal-content" : "animate-modal-out"
              }`}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-foreground">
                  {isEditing ? "Редактировать" : "Привычка"}
                </h2>
                <div className="flex items-center gap-2">
                  {!isEditing && (
                    <button onClick={() => setIsEditing(true)}
                      className="p-1.5 rounded-lg text-default-400 hover:text-primary hover:bg-primary/10 transition-colors">
                      <Pencil size={16} />
                    </button>
                  )}
                  <button onClick={() => { setViewHabit(null); setIsEditing(false); }}
                    className="p-1.5 rounded-lg text-default-400 hover:text-foreground hover:bg-white/5 transition-colors">
                    <X size={20} />
                  </button>
                </div>
              </div>

              {isEditing ? (
                /* ── РЕЖИМ РЕДАКТИРОВАНИЯ ── */
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-default-600">Название</label>
                    <input value={editData.name ?? ""}
                      onChange={e => setEditData(d => ({ ...d, name: e.target.value }))}
                      className="input-field" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-default-600">Описание</label>
                    <input value={editData.description ?? ""}
                      onChange={e => setEditData(d => ({ ...d, description: e.target.value }))}
                      className="input-field" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-default-600">Цвет</label>
                    <div className="flex gap-3">
                      {COLORS.map(c => (
                        <button key={c} type="button" onClick={() => setEditData(d => ({ ...d, color: c }))}
                          className={`w-8 h-8 rounded-full transition-transform ${
                            editData.color === c ? "scale-110 ring-2 ring-white/50" : "opacity-70 hover:opacity-100"
                          }`} style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-default-600">Повторение</label>
                    <div ref={editFreqRef} className="relative">
                      <button type="button" onClick={() => setEditFreqOpen(v => !v)}
                        className="input-field flex items-center justify-between cursor-pointer text-left w-full">
                        <span>{FREQUENCY_OPTIONS.find(o => o.value === editData.frequency)?.label ?? "Ежедневно"}</span>
                        <ChevronDown size={16} className={`text-default-400 transition-transform duration-300 ${
                          editFreqOpen ? "rotate-180" : ""
                        }`} />
                      </button>
                      {editFreqMounted && (
                        <div className={`absolute left-0 right-0 mt-1.5 glass-dropdown rounded-xl py-1 z-50 ${
                          editFreqAnimating ? "animate-dropdown" : "animate-dropdown-out"
                        }`}>
                          {FREQUENCY_OPTIONS.map(({ value, label }) => (
                            <button key={value} type="button"
                              onClick={() => { setEditData(d => ({ ...d, frequency: value })); setEditFreqOpen(false); }}
                              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors ${
                                editData.frequency === value ? "text-primary font-medium" : "text-foreground"
                              }`}>
                              {label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-default-600">Дата начала</label>
                    <input type="date" value={editData.start_date ?? ""}
                      onChange={e => setEditData(d => ({ ...d, start_date: e.target.value }))}
                      className="input-field" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-default-600">Дата окончания</label>
                    <input type="date" value={editData.end_date ?? ""}
                      onChange={e => setEditData(d => ({ ...d, end_date: e.target.value }))}
                      className="input-field" />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setIsEditing(false)}
                      className="flex-1 h-10 rounded-xl bg-content2 hover:bg-content3 text-sm font-medium transition-colors">
                      Отмена
                    </button>
                    <button type="button" onClick={saveEdit} disabled={isSaving}
                      className="flex-1 h-10 rounded-xl bg-gradient-to-r from-primary to-blue-600 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition-all flex items-center justify-center gap-2">
                      {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Сохранить"}
                    </button>
                  </div>
                </div>
              ) : (
                /* ── РЕЖИМ ПРОСМОТРА ── */
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-content2">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: viewHabit.color + "22", border: `1px solid ${viewHabit.color}44` }}>
                      <Target size={18} style={{ color: viewHabit.color }} />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{viewHabit.name}</p>
                      {viewHabit.description && (
                        <p className="text-xs text-default-400 mt-0.5">{viewHabit.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-content2">
                      <p className="text-xs text-default-400 mb-1">Стрейк</p>
                      <p className="font-semibold text-warning">{viewHabit.current_streak} дн.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-content2">
                      <p className="text-xs text-default-400 mb-1">Сила</p>
                      <p className="font-semibold" style={{ color: viewHabit.color }}>{viewHabit.habit_strength.toFixed(0)}%</p>
                    </div>
                    <div className="p-3 rounded-xl bg-content2">
                      <p className="text-xs text-default-400 mb-1">Тип</p>
                      <p className="font-semibold text-foreground">{viewHabit.habit_type === "bad" ? "❌ Плохая" : "💪 Хорошая"}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-content2">
                      <p className="text-xs text-default-400 mb-1">Повторение</p>
                      <p className="font-semibold text-foreground">{FREQUENCY_OPTIONS.find(o => o.value === viewHabit.frequency)?.label ?? viewHabit.frequency}</p>
                    </div>
                  </div>

                  {(viewHabit.start_date || viewHabit.end_date) && (
                    <div className="grid grid-cols-2 gap-3">
                      {viewHabit.start_date && (
                        <div className="p-3 rounded-xl bg-content2">
                          <p className="text-xs text-default-400 mb-1">Начало</p>
                          <p className="font-semibold text-foreground text-sm">{viewHabit.start_date}</p>
                        </div>
                      )}
                      {viewHabit.end_date && (
                        <div className="p-3 rounded-xl bg-content2">
                          <p className="text-xs text-default-400 mb-1">Окончание</p>
                          <p className="font-semibold text-foreground text-sm">{viewHabit.end_date}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {viewHabit.time_of_day && viewHabit.time_of_day.length > 0 && (
                    <div>
                      <p className="text-xs text-default-400 mb-2">Время дня</p>
                      <div className="flex gap-2 flex-wrap">
                        {viewHabit.time_of_day.map(t => (
                          <span key={t} className="px-3 py-1 rounded-full text-xs bg-primary/15 text-primary border border-primary/30">
                            {TIME_OF_DAY_OPTIONS.find(o => o.value === t)?.label ?? t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
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
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-foreground">Удалить привычку?</h2>
                <button onClick={() => setDeleteId(null)}
                  className="text-default-400 hover:text-foreground p-1 rounded-lg hover:bg-white/5 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-content2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                  style={{ backgroundColor: displayDeleteHabit.color }}>
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
                <button onClick={() => setDeleteId(null)}
                  className="flex-1 h-10 rounded-xl bg-content2 hover:bg-content3 transition-colors text-sm font-medium">
                  Отмена
                </button>
                <button onClick={handleDeleteConfirm} disabled={isDeleting}
                  className="flex-1 h-10 rounded-xl bg-danger hover:bg-danger/80 text-white text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
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
