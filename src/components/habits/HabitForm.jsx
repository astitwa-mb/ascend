import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ICONS = ["💪", "🧘", "📚", "💧", "🏃", "🎯", "✍️", "🌿", "🍎", "😴", "🎨", "🧠", "💰", "🤝", "✨"];
const CATEGORIES = ["health","fitness","mindfulness","learning","productivity","social","creativity","other"];

export default function HabitForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: initial?.title || "",
    icon: initial?.icon || "✨",
    category: initial?.category || "other",
    frequency: initial?.frequency || "daily",
    xp_per_completion: initial?.xp_per_completion || 10,
    description: initial?.description || "",
    is_active: true,
  });

  return (
    <div className="space-y-4">
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
        <Label htmlFor="title">Habit Name *</Label>
        <Input id="title" placeholder="e.g., Morning meditation" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="mt-1" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Category</Label>
          <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
            <SelectTrigger className="mt-1 capitalize"><SelectValue /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>XP per day</Label>
          <Input type="number" min={5} max={100} value={form.xp_per_completion} onChange={e => setForm(f => ({ ...f, xp_per_completion: Number(e.target.value) }))} className="mt-1" />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <Button variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
        <Button className="flex-1" onClick={() => onSave(form)} disabled={!form.title}>
          {initial ? "Save" : "Create Habit"}
        </Button>
      </div>
    </div>
  );
}