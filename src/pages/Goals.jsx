import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Target, CheckCircle2, Circle, Trophy, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GoalForm from "@/components/goals/GoalForm";
import { format } from "date-fns";

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadGoals(); }, []);
  const loadGoals = async () => {
    const data = await base44.entities.Goal.filter({ status: "active" }, "-created_date");
    setGoals(data);
    setLoading(false);
  };

  const toggleMilestone = async (goal, idx) => {
    const milestones = [...(goal.milestones || [])];
    milestones[idx] = { ...milestones[idx], completed: !milestones[idx].completed };
    const completedCount = milestones.filter(m => m.completed).length;
    const progress = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : goal.progress;
    await base44.entities.Goal.update(goal.id, { milestones, progress });
    loadGoals();
  };

  const completeGoal = async (id) => {
    await base44.entities.Goal.update(id, { status: "completed" });
    loadGoals();
  };

  const handleSave = async (data) => {
    if (editing) {
      await base44.entities.Goal.update(editing.id, data);
    } else {
      await base44.entities.Goal.create(data);
    }
    setShowForm(false);
    setEditing(null);
    loadGoals();
  };

  const statusColor = { active: "text-primary", completed: "text-accent", paused: "text-muted-foreground" };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-5 pt-12 pb-4 bg-gradient-to-br from-background to-orange-400/5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-serif">My Goals</h1>
            <p className="text-sm text-muted-foreground">{goals.length} active goals</p>
          </div>
          <Button size="sm" onClick={() => { setEditing(null); setShowForm(true); }} className="rounded-xl gap-1">
            <Plus className="w-4 h-4" /> Add
          </Button>
        </div>
      </div>

      <div className="px-5 pb-6 space-y-3">
        {loading ? (
          Array(2).fill(0).map((_, i) => <div key={i} className="h-32 bg-muted/30 rounded-2xl animate-pulse" />)
        ) : goals.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Target className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium">No goals yet</p>
            <p className="text-sm">Set your first goal to stay focused</p>
          </div>
        ) : (
          goals.map(goal => (
            <div key={goal.id} className="bg-card border border-border/50 rounded-2xl p-4">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">{goal.icon || "🎯"}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm">{goal.title}</p>
                    <button onClick={() => setExpanded(e => ({ ...e, [goal.id]: !e[goal.id] }))}>
                      {expanded[goal.id] ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </button>
                  </div>
                  {goal.target_date && (
                    <p className="text-xs text-muted-foreground">Target: {format(new Date(goal.target_date), "MMM d, yyyy")}</p>
                  )}
                </div>
              </div>

              {/* Progress */}
              <div className="mb-2">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Progress</span><span>{goal.progress || 0}%</span>
                </div>
                <Progress value={goal.progress || 0} className="h-2" />
              </div>

              {/* Milestones */}
              {expanded[goal.id] && goal.milestones?.length > 0 && (
                <div className="mt-3 space-y-2 border-t border-border/50 pt-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Milestones</p>
                  {goal.milestones.map((m, idx) => (
                    <button key={idx} onClick={() => toggleMilestone(goal, idx)} className="w-full flex items-center gap-2 text-left">
                      {m.completed ? <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" /> : <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                      <span className={`text-sm ${m.completed ? "line-through text-muted-foreground" : ""}`}>{m.title}</span>
                    </button>
                  ))}
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => { setEditing(goal); setShowForm(true); }}>Edit</Button>
                    <Button size="sm" className="flex-1 text-xs bg-accent hover:bg-accent/90" onClick={() => completeGoal(goal.id)}>
                      <Trophy className="w-3 h-3 mr-1" /> Complete
                    </Button>
                  </div>
                </div>
              )}

              {expanded[goal.id] && (!goal.milestones || goal.milestones.length === 0) && (
                <div className="flex gap-2 pt-2 border-t border-border/50">
                  <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => { setEditing(goal); setShowForm(true); }}>Edit</Button>
                  <Button size="sm" className="flex-1 text-xs bg-accent hover:bg-accent/90" onClick={() => completeGoal(goal.id)}>
                    <Trophy className="w-3 h-3 mr-1" /> Complete
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="mx-4 rounded-2xl">
          <DialogHeader><DialogTitle>{editing ? "Edit Goal" : "New Goal"}</DialogTitle></DialogHeader>
          <GoalForm initial={editing} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null); }} />
        </DialogContent>
      </Dialog>
    </div>
  );
}