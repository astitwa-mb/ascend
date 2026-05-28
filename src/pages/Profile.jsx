import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Star, Zap, Trophy, Flame, BookOpen, Timer, Edit3, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import XPBar from "@/components/dashboard/XPBar";
import DisciplineRing from "@/components/dashboard/DisciplineRing";
import BadgeDisplay from "@/components/profile/BadgeDisplay";

const RANKS = [
  { name: "Beginner", min: 1, max: 4 },
  { name: "Apprentice", min: 5, max: 9 },
  { name: "Journeyman", min: 10, max: 19 },
  { name: "Expert", min: 20, max: 29 },
  { name: "Master", min: 30, max: 49 },
  { name: "Legend", min: 50, max: Infinity },
];

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [editingIdentity, setEditingIdentity] = useState(false);
  const [identity, setIdentity] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    const list = await base44.entities.UserProfile.list();
    const p = list[0] || null;
    setProfile(p);
    setIdentity(p?.identity || "");
    setLoading(false);
  };

  const saveIdentity = async () => {
    if (profile) {
      await base44.entities.UserProfile.update(profile.id, { identity });
    } else {
      await base44.entities.UserProfile.create({ identity, xp: 0, level: 1, discipline_score: 50, rank: "Beginner" });
    }
    setEditingIdentity(false);
    loadProfile();
  };

  const rank = RANKS.find(r => (profile?.level || 1) >= r.min && (profile?.level || 1) <= r.max)?.name || "Beginner";

  const stats = [
    { icon: Flame, label: "Longest Streak", value: `${profile?.longest_streak || 0} days`, color: "text-orange-400" },
    { icon: Trophy, label: "Habits Done", value: profile?.total_habits_completed || 0, color: "text-yellow-500" },
    { icon: Timer, label: "Focus Time", value: `${profile?.total_focus_minutes || 0} min`, color: "text-primary" },
    { icon: BookOpen, label: "Journal Entries", value: profile?.total_journal_entries || 0, color: "text-accent" },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-5 pt-12 pb-8 bg-gradient-to-br from-primary/20 via-background to-accent/10">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 shadow-lg">
            <Star className="w-10 h-10 text-white" />
          </div>

          {/* Identity */}
          {editingIdentity ? (
            <div className="flex items-center gap-2 mb-2">
              <Input value={identity} onChange={e => setIdentity(e.target.value)} placeholder="Who do you want to become?" className="text-center text-sm w-52" autoFocus />
              <button onClick={saveIdentity} className="text-accent"><Check className="w-5 h-5" /></button>
              <button onClick={() => setEditingIdentity(false)} className="text-muted-foreground"><X className="w-4 h-4" /></button>
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl font-bold font-serif">{profile?.identity || "Set your identity"}</h2>
              <button onClick={() => setEditingIdentity(true)} className="text-muted-foreground hover:text-primary">
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">{rank}</span>
            <span className="text-sm text-muted-foreground">Level {profile?.level || 1}</span>
          </div>

          <div className="w-full max-w-xs">
            <XPBar xp={profile?.xp || 0} level={profile?.level || 1} />
          </div>
        </div>
      </div>

      {/* Discipline Score */}
      <div className="px-5 mb-4">
        <div className="bg-card border border-border/50 rounded-2xl p-4 flex items-center gap-4">
          <DisciplineRing score={profile?.discipline_score || 50} />
          <div>
            <p className="text-xs text-muted-foreground">Discipline Score</p>
            <p className="text-3xl font-bold">{profile?.discipline_score || 50}</p>
            <p className="text-xs text-muted-foreground">Consistency builds character</p>
          </div>
          <div className="ml-auto">
            <Zap className="w-5 h-5 text-yellow-400" />
            <p className="text-lg font-bold">{profile?.xp || 0}</p>
            <p className="text-xs text-muted-foreground">Total XP</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-5 mb-4">
        <div className="grid grid-cols-2 gap-3">
          {stats.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-card border border-border/50 rounded-xl p-4">
              <Icon className={`w-5 h-5 mb-2 ${color}`} />
              <p className="text-xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <BadgeDisplay badges={profile?.badges || []} />

      {/* Logout */}
      <div className="px-5 pb-8 mt-4">
        <Button variant="outline" className="w-full rounded-xl text-muted-foreground" onClick={() => base44.auth.logout()}>
          Sign Out
        </Button>
      </div>
    </div>
  );
}