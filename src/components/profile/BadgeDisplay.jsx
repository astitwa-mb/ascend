const ALL_BADGES = [
  { id: "first_habit", emoji: "🌱", name: "First Step", desc: "Created your first habit" },
  { id: "streak_7", emoji: "🔥", name: "Week Warrior", desc: "7-day streak" },
  { id: "streak_30", emoji: "💎", name: "Diamond Mind", desc: "30-day streak" },
  { id: "focus_5", emoji: "⚡", name: "Focus Initiate", desc: "Completed 5 focus sessions" },
  { id: "journal_7", emoji: "📖", name: "Storyteller", desc: "7 journal entries" },
  { id: "level_5", emoji: "🚀", name: "Ascender", desc: "Reached Level 5" },
  { id: "goals_3", emoji: "🎯", name: "Goal Getter", desc: "Completed 3 goals" },
];

export default function BadgeDisplay({ badges = [] }) {
  return (
    <div className="px-5 mb-4">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Badges</p>
      <div className="grid grid-cols-4 gap-3">
        {ALL_BADGES.map(badge => {
          const earned = badges.includes(badge.id);
          return (
            <div key={badge.id} className={`flex flex-col items-center text-center p-2 rounded-xl border transition-all ${earned ? "bg-primary/5 border-primary/20" : "bg-muted/20 border-transparent opacity-40"}`}>
              <span className="text-2xl mb-1">{badge.emoji}</span>
              <p className="text-[9px] font-medium leading-tight text-foreground">{badge.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}