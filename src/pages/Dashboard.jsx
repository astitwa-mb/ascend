import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { Flame, Target, Timer, BookOpen, TrendingUp, Zap, Star, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import XPBar from "@/components/dashboard/XPBar";
import DisciplineRing from "@/components/dashboard/DisciplineRing";
import TodayHabits from "@/components/dashboard/TodayHabits";
import QuickStats from "@/components/dashboard/QuickStats";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [habits, setHabits] = useState([]);
  const [todayLogs, setTodayLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [profiles, habitsData, logs] = await Promise.all([
      base44.entities.UserProfile.list(),
      base44.entities.Habit.filter({ is_active: true }),
      base44.entities.HabitLog.filter({ date: today }),
    ]);
    setProfile(profiles[0] || null);
    setHabits(habitsData);
    setTodayLogs(logs);
    setLoading(false);
  };

  const completedToday = todayLogs.filter(l => l.completed).length;
  const totalToday = habits.length;
  const completionRate = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-muted-foreground text-sm">{greeting()} 👋</p>
            <h1 className="text-2xl font-bold font-serif text-foreground">
              {profile?.identity ? `I am ${profile.identity}` : "Ascend"}
            </h1>
          </div>
          <Link to="/profile">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Star className="w-5 h-5 text-primary" />
            </div>
          </Link>
        </div>

        {/* XP Bar */}
        {profile && <XPBar xp={profile.xp || 0} level={profile.level || 1} />}
      </div>

      {/* Discipline Ring + Stats */}
      <div className="px-5 mb-4">
        <div className="bg-card rounded-2xl p-4 border border-border/50 shadow-sm">
          <div className="flex items-center gap-4">
            <DisciplineRing score={profile?.discipline_score || 50} />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">Discipline Score</p>
              <p className="text-2xl font-bold text-foreground">{profile?.discipline_score || 50}</p>
              <p className="text-xs text-muted-foreground">Rank: <span className="text-primary font-semibold">{profile?.rank || "Beginner"}</span></p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-1">Today</p>
              <p className="text-2xl font-bold text-accent">{completionRate}%</p>
              <p className="text-xs text-muted-foreground">{completedToday}/{totalToday} habits</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <QuickStats profile={profile} />

      {/* Today's Habits */}
      <div className="px-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-foreground">Today's Habits</h2>
          <Link to="/habits" className="text-primary text-sm flex items-center gap-1">
            See all <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <TodayHabits habits={habits.slice(0, 4)} logs={todayLogs} onUpdate={loadData} loading={loading} />
      </div>

      {/* Quick Links */}
      <div className="px-5 mb-6">
        <h2 className="font-semibold text-foreground mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { to: "/focus", icon: Timer, label: "Start Focus", color: "from-primary/20 to-primary/5", iconColor: "text-primary" },
            { to: "/journal", icon: BookOpen, label: "Write Journal", color: "from-accent/20 to-accent/5", iconColor: "text-accent" },
            { to: "/goals", icon: Target, label: "My Goals", color: "from-orange-400/20 to-orange-400/5", iconColor: "text-orange-400" },
            { to: "/coach", icon: Zap, label: "Ask Coach", color: "from-purple-400/20 to-purple-400/5", iconColor: "text-purple-400" },
          ].map(({ to, icon: Icon, label, color, iconColor }) => (
            <Link key={to} to={to}>
              <div className={`bg-gradient-to-br ${color} border border-border/50 rounded-2xl p-4 flex items-center gap-3`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
                <span className="text-sm font-medium text-foreground">{label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}