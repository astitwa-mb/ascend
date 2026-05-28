import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X } from "lucide-react";

const ICONS = ["🎯", "🏆", "💡", "🚀", "💪", "📚", "💰", "❤️", "🌍", "🎨", "🧠", "🤝"];

export default function GoalForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: initial?.title || "",
    description: initial?.description || "",
    icon: initial?.icon || "🎯",
    type: initial?.type || "short_term",
    target_date: initial?.target_date || "",
    milestones: initial?.milestones || [],
    status: "active",
    progress: initial?.progress || 0,
  });
  const [newMilestone, setNewMilestone] = useState("");

  const addMilestone = () => {
    if (!newMilestone.trim()) return;
    setForm(f => ({ ...f, milestones: [...f.milestones, { title: newMilestone.trim(), completed: false }] }));
    setNewMilestone("");
  };

  const removeMilestone = (idx) => {
    setForm(f => ({ ...f, milestones: f.milestones.filter((_, i) => i !== idx) }));
  };

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
      <div>
        <Label>Icon</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {ICONS.map(icon => (
            <button key={icon} onClick={() => setForm(f => ({ ...f, icon }))}
              className={`text-xl p-2 rounded-lg border-2 transition-all ${form.icon === icon ? "border-primary bg-primary/10" : "border-transparent hover:border-border"}`}>
              {icon}
            </button>
          ))}
        </div>
      </div>
      <div>
        <Label htmlFor="gtitle">Goal Title *</Label>
        <Input id="gtitle" placeholder="e.g., Run a 5K" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="mt-1" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Type</Label>
          <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="short_term">Short Term</SelectItem>
              <SelectItem value="long_term">Long Term</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Target Date</Label>
          <Input type="date" value={form.target_date} onChange={e => setForm(f => ({ ...f, target_date: e.target.value }))} className="mt-1" />
        </div>
      </div>
      <div>
        <Label>Milestones</Label>
        <div className="space-y-2 mt-2">
          {form.milestones.map((m, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2">
              <span className="flex-1 text-sm">{m.title}</span>
              <button onClick={() => removeMilestone(idx)} className="text-muted-foreground hover:text-destructive">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <Input placeholder="Add a milestone..." value={newMilestone} onChange={e => setNewMilestone(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addMilestone()} className="flex-1 text-sm" />
            <Button size="sm" variant="outline" onClick={addMilestone}><Plus className="w-3 h-3" /></Button>
          </div>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <Button variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
        <Button className="flex-1" onClick={() => onSave(form)} disabled={!form.title}>
          {initial ? "Save" : "Create Goal"}
        </Button>
      </div>
    </div>
  );
}