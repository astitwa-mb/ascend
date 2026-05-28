import { format } from "date-fns";

export default function JournalCard({ entry, moods, onEdit }) {
  const mood = moods[entry.mood];
  return (
    <button onClick={onEdit} className="w-full text-left bg-card border border-border/50 rounded-2xl p-4 hover:border-primary/30 transition-all">
      <div className="flex items-start gap-3">
        <span className="text-2xl">{mood?.emoji || "📝"}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className={`text-xs font-medium ${mood?.color}`}>{mood?.label}</span>
            <span className="text-xs text-muted-foreground">{format(new Date(entry.date), "MMM d, yyyy")}</span>
          </div>
          {entry.reflection ? (
            <p className="text-sm text-muted-foreground line-clamp-2">{entry.reflection}</p>
          ) : (
            <p className="text-sm text-muted-foreground italic">No reflection written</p>
          )}
          {entry.gratitude?.length > 0 && (
            <p className="text-xs text-accent mt-1">🙏 {entry.gratitude[0]}{entry.gratitude.length > 1 ? ` +${entry.gratitude.length - 1} more` : ""}</p>
          )}
        </div>
      </div>
    </button>
  );
}