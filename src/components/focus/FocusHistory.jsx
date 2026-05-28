import { format } from "date-fns";
import { Timer, Zap } from "lucide-react";

const typeLabel = { pomodoro: "Pomodoro", deep_work: "Deep Work", flow: "Flow" };
const typeColor = { pomodoro: "text-primary", deep_work: "text-orange-400", flow: "text-accent" };

export default function FocusHistory({ sessions }) {
  if (!sessions.length) return (
    <div className="px-5 text-center text-muted-foreground py-8">
      <Timer className="w-8 h-8 mx-auto mb-2 opacity-20" />
      <p className="text-sm">No sessions yet. Start your first focus session!</p>
    </div>
  );

  return (
    <div className="px-5 pb-6">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Recent Sessions</p>
      <div className="space-y-2">
        {sessions.map(s => (
          <div key={s.id} className="bg-card border border-border/50 rounded-xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Timer className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{s.label || typeLabel[s.type]}</p>
              <p className={`text-xs ${typeColor[s.type]}`}>{typeLabel[s.type]} · {s.duration_minutes} min</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-xs text-yellow-500">
                <Zap className="w-3 h-3" />{s.xp_earned}
              </div>
              <p className="text-[10px] text-muted-foreground">{format(new Date(s.date), "MMM d")}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}