import { base44 } from "@/api/base44Client";
import { format } from "date-fns";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export default function TodayHabits({ habits, logs, onUpdate, loading }) {
  const [toggling, setToggling] = useState(null);
  const today = format(new Date(), "yyyy-MM-dd");

  const isCompleted = (habitId) => logs.some(l => l.habit_id === habitId && l.completed);
  const getLog = (habitId) => logs.find(l => l.habit_id === habitId);

  const toggle = async (habit) => {
    setToggling(habit.id);
    const log = getLog(habit.id);
    if (log) {
      await base44.entities.HabitLog.update(log.id, { completed: !log.completed });
    } else {
      await base44.entities.HabitLog.create({
        habit_id: habit.id,
        date: today,
        completed: true,
        xp_earned: habit.xp_per_completion || 10,
      });
    }
    await onUpdate();
    setToggling(null);
  };

  if (loading) return (
    <div className="space-y-2">
      {[1,2,3].map(i => <Skeleton key={i} className="h-14 rounded-xl" />)}
    </div>
  );

  if (!habits.length) return (
    <div className="text-center py-8 text-muted-foreground text-sm">
      No habits yet. <a href="/habits" className="text-primary">Add your first habit →</a>
    </div>
  );

  return (
    <div className="space-y-2">
      {habits.map(habit => {
        const done = isCompleted(habit.id);
        return (
          <button
            key={habit.id}
            onClick={() => toggle(habit)}
            disabled={toggling === habit.id}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${
              done ? "bg-primary/5 border-primary/20" : "bg-card border-border/50"
            }`}
          >
            <div className="flex-shrink-0">
              {toggling === habit.id ? (
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              ) : done ? (
                <CheckCircle2 className="w-5 h-5 text-primary" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <span className="text-lg">{habit.icon || "✨"}</span>
            <div className="flex-1 text-left">
              <p className={`text-sm font-medium ${done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                {habit.title}
              </p>
              <p className="text-[11px] text-muted-foreground capitalize">{habit.category}</p>
            </div>
            <span className="text-xs text-muted-foreground">+{habit.xp_per_completion || 10}xp</span>
          </button>
        );
      })}
    </div>
  );
}