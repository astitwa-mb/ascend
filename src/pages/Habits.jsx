import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { format, subDays } from "date-fns";
import { Plus, Flame, MoreVertical, Trash2, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import HabitForm from "@/components/habits/HabitForm";
import HabitStreak from "@/components/habits/HabitStreak";

export default function Habits() {
  const [habits, setHabits] = useState([]);
  const [logs, setLogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const today = format(new Date(), "yyyy-MM-dd");
  const last7 = Array.from({ length: 7 }, (_, i) => format(subDays(new Date(), 6 - i), "yyyy-MM-dd"));

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const [h, l] = await Promise.all([
      base44.entities.Habit.filter({ is_active: true }, "order"),
      base44.entities.HabitLog.filter({}),
    ]);
    setHabits(h);
    setLogs(l);
    setLoading(false);
  };

  const isCompleted = (habitId, date) => logs.some(l => l.habit_id === habitId && l.date === date && l.completed);

  const toggle = async (habit) => {
    const log = logs.find(l => l.habit_id === habit.id && l.date === today);
    if (log) {
      await base44.entities.HabitLog.update(log.id, { completed: !log.completed });
    } else {
      await base44.entities.HabitLog.create({ habit_id: habit.id, date: today, completed: true, xp_earned: habit.xp_per_completion || 10 });
    }
    loadData();
  };

  const deleteHabit = async (id) => {
    await base44.entities.Habit.update(id, { is_active: false });
    loadData();
  };

  const handleSave = async (data) => {
    if (editing) {
      await base44.entities.Habit.update(editing.id, data);
    } else {
      await base44.entities.Habit.create({ ...data, current_streak: 0, best_streak: 0, total_completions: 0 });
    }
    setShowForm(false);
    setEditing(null);
    loadData();
  };

  const categoryColor = {
    health: "text-green-500", fitness: "text-orange-500", mindfulness: "text-purple-400",
    learning: "text-blue-400", productivity: "text-primary", social: "text-pink-400",
    creativity: "text-yellow-500", other: "text-muted-foreground",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 bg-gradient-to-br from-background to-primary/5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-serif">My Habits</h1>
            <p className="text-sm text-muted-foreground">{habits.length} active habits</p>
          </div>
          <Button size="sm" onClick={() => { setEditing(null); setShowForm(true); }} className="rounded-xl gap-1">
            <Plus className="w-4 h-4" /> Add
          </Button>
        </div>
      </div>

      {/* Habit List */}
      <div className="px-5 space-y-3 pb-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => <div key={i} className="h-24 bg-muted/30 rounded-2xl animate-pulse" />)
        ) : habits.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Flame className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium">No habits yet</p>
            <p className="text-sm">Tap "Add" to start your first habit</p>
          </div>
        ) : (
          habits.map(habit => {
            const done = isCompleted(habit.id, today);
            return (
              <div key={habit.id} className={`bg-card border rounded-2xl p-4 transition-all ${done ? "border-primary/30" : "border-border/50"}`}>
                <div className="flex items-start gap-3">
                  <button onClick={() => toggle(habit)} className="mt-0.5 flex-shrink-0">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${done ? "bg-primary border-primary" : "border-muted-foreground/40"}`}>
                      {done && <span className="text-white text-xs">✓</span>}
                    </div>
                  </button>
                  <span className="text-2xl">{habit.icon || "✨"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`font-semibold text-sm ${done ? "line-through text-muted-foreground" : ""}`}>{habit.title}</p>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="text-muted-foreground p-1 rounded-lg hover:bg-muted">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setEditing(habit); setShowForm(true); }}>
                            <Edit3 className="w-3 h-3 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => deleteHabit(habit.id)} className="text-destructive">
                            <Trash2 className="w-3 h-3 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className={`text-xs capitalize ${categoryColor[habit.category] || "text-muted-foreground"}`}>{habit.category}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Flame className="w-3 h-3 text-orange-400" />
                      <span className="text-xs text-muted-foreground">{habit.current_streak || 0} day streak</span>
                      <span className="text-xs text-muted-foreground ml-auto">+{habit.xp_per_completion || 10} XP</span>
                    </div>
                  </div>
                </div>
                {/* 7-day streak view */}
                <HabitStreak habitId={habit.id} last7={last7} logs={logs} />
              </div>
            );
          })
        )}
      </div>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="mx-4 rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Habit" : "New Habit"}</DialogTitle>
          </DialogHeader>
          <HabitForm initial={editing} onSave={handleSave} onCancel={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}