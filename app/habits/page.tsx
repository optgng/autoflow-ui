import HabitsView from "@/app/components/habits-view";

export const metadata = {
  title: "Трекер привычек | AutoFlow",
  description: "Отслеживание полезных привычек",
};

export default function HabitsPage() {
  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
          Трекер привычек
        </h1>
        <p className="text-muted-foreground mt-1">Формируйте полезные привычки шаг за шагом</p>
      </div>
      <HabitsView />
    </div>
  );
}
