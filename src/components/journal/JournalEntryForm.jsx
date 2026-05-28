import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

export default function JournalEntryForm({ initial, moods, onSave, onCancel }) {
  const [form, setForm] = useState({
    mood: initial?.mood || "okay",
    mood_score: initial?.mood_score || 3,
    energy_level: initial?.energy_level || 3,
    reflection: initial?.reflection || "",
    challenges: initial?.challenges || "",
    gratitude: initial?.gratitude || [""],
    wins: initial?.wins || [""],
  });

  const updateList = (key, idx, val) => {
    const arr = [...form[key]];
    arr[idx] = val;
    setForm(f => ({ ...f, [key]: arr }));
  };

  const addItem = (key) => setForm(f => ({ ...f, [key]: [...f[key], ""] }));
  const removeItem = (key, idx) => setForm(f => ({ ...f, [key]: f[key].filter((_, i) => i !== idx) }));

  const cleanAndSave = () => {
    onSave({
      ...form,
      gratitude: form.gratitude.filter(g => g.trim()),
      wins: form.wins.filter(w => w.trim()),
    });
  };

  const EnergyDots = ({ value, onChange }) => (
    <div className="flex gap-2 mt-1">
      {[1,2,3,4,5].map(n => (
        <button key={n} onClick={() => onChange(n)}
          className={`w-8 h-8 rounded-full border-2 text-sm font-bold transition-all ${
            value >= n ? "bg-primary border-primary text-white" : "border-muted-foreground/30 text-muted-foreground"
          }`}>{n}</button>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Mood */}
      <div>
        <Label>How are you feeling?</Label>
        <div className="flex gap-2 mt-2 flex-wrap">
          {Object.entries(moods).map(([key, m]) => (
            <button key={key} onClick={() => setForm(f => ({ ...f, mood: key, mood_score: ["rough","low","okay","good","amazing"].indexOf(key) + 1 }))}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl border-2 transition-all ${form.mood === key ? "border-primary bg-primary/10" : "border-transparent hover:border-border bg-muted/30"}`}>
              <span className="text-xl">{m.emoji}</span>
              <span className={`text-[10px] font-medium ${m.color}`}>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Energy */}
      <div>
        <Label>Energy Level</Label>
        <EnergyDots value={form.energy_level} onChange={v => setForm(f => ({ ...f, energy_level: v }))} />
      </div>

      {/* Gratitude */}
      <div>
        <Label>Gratitude (what are you thankful for?)</Label>
        <div className="space-y-2 mt-2">
          {form.gratitude.map((g, i) => (
            <div key={i} className="flex gap-2">
              <Input placeholder={`Gratitude ${i + 1}`} value={g} onChange={e => updateList("gratitude", i, e.target.value)} className="flex-1 text-sm" />
              {form.gratitude.length > 1 && <button onClick={() => removeItem("gratitude", i)} className="text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>}
            </div>
          ))}
          {form.gratitude.length < 5 && (
            <button onClick={() => addItem("gratitude")} className="text-primary text-xs flex items-center gap-1 hover:underline"><Plus className="w-3 h-3" /> Add more</button>
          )}
        </div>
      </div>

      {/* Wins */}
      <div>
        <Label>Today's Wins 🏆</Label>
        <div className="space-y-2 mt-2">
          {form.wins.map((w, i) => (
            <div key={i} className="flex gap-2">
              <Input placeholder={`Win ${i + 1}`} value={w} onChange={e => updateList("wins", i, e.target.value)} className="flex-1 text-sm" />
              {form.wins.length > 1 && <button onClick={() => removeItem("wins", i)} className="text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>}
            </div>
          ))}
          {form.wins.length < 5 && (
            <button onClick={() => addItem("wins")} className="text-primary text-xs flex items-center gap-1 hover:underline"><Plus className="w-3 h-3" /> Add more</button>
          )}
        </div>
      </div>

      {/* Reflection */}
      <div>
        <Label>Daily Reflection</Label>
        <Textarea placeholder="How did today go? What did you learn? What would you do differently?" value={form.reflection} onChange={e => setForm(f => ({ ...f, reflection: e.target.value }))} className="mt-1 min-h-24 text-sm" />
      </div>

      {/* Challenges */}
      <div>
        <Label>Challenges faced</Label>
        <Textarea placeholder="What was hard today? How did you handle it?" value={form.challenges} onChange={e => setForm(f => ({ ...f, challenges: e.target.value }))} className="mt-1 min-h-16 text-sm" />
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
        <Button className="flex-1" onClick={cleanAndSave}>Save Entry</Button>
      </div>
    </div>
  );
}