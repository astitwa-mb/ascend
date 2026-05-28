import { Flame, Timer, BookOpen, Trophy } from "lucide-react";

export default function QuickStats({ profile }) {
  const stats = [
    { icon: Flame, label: "Streak", value: profile?.longest_streak || 0, unit: "days", color: "text-orange-400" },
    { icon: Timer, label: "Focus", value: profile?.total_focus_minutes || 0, unit: "min", color: "text-primary" },
    { icon: BookOpen, label: "Journals", value: profile?.total_journal_entries || 0, unit: "", color: "text-accent" },
    { icon: Trophy, label: "Habits", value: profile?.total_habits_completed || 0, unit: "", color: "text-yellow-500" },
  ];

  return (
    <div className="px-5 mb-4">
      <div className="grid grid-cols-4 gap-2">
        {stats.map(({ icon: Icon, label, value, unit, color }) => (
          <div key={label} className="bg-card border border-border/50 rounded-xl p-3 text-center">
            <Icon className={`w-4 h-4 mx-auto mb-1 ${color}`} />
            <p className="text-sm font-bold text-foreground">{value}{unit && <span className="text-[9px] text-muted-foreground ml-0.5">{unit}</span>}</p>
            <p className="text-[10px] text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}