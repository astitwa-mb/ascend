import { format } from "date-fns";

export default function HabitStreak({ habitId, last7, logs }) {
  const dayLabels = ["M","T","W","T","F","S","S"];

  return (
    <div className="flex gap-1 mt-3 justify-end">
      {last7.map((date, i) => {
        const done = logs.some(l => l.habit_id === habitId && l.date === date && l.completed);
        return (
          <div key={date} className="flex flex-col items-center gap-0.5">
            <div className={`w-5 h-5 rounded-full transition-all ${done ? "bg-primary" : "bg-muted"}`} />
            <span className="text-[8px] text-muted-foreground">{dayLabels[(new Date(date).getDay() + 6) % 7]}</span>
          </div>
        );
      })}
    </div>
  );
}