import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { format } from "date-fns";
import { Plus, BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import JournalEntryForm from "@/components/journal/JournalEntryForm";
import JournalCard from "@/components/journal/JournalCard";

const MOODS = {
  amazing: { emoji: "🤩", label: "Amazing", color: "text-yellow-500" },
  good: { emoji: "😊", label: "Good", color: "text-green-500" },
  okay: { emoji: "😐", label: "Okay", color: "text-blue-400" },
  low: { emoji: "😔", label: "Low", color: "text-orange-400" },
  rough: { emoji: "😢", label: "Rough", color: "text-red-400" },
};

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [loading, setLoading] = useState(true);
  const today = format(new Date(), "yyyy-MM-dd");

  useEffect(() => { loadEntries(); }, []);
  const loadEntries = async () => {
    const data = await base44.entities.JournalEntry.list("-date", 30);
    setEntries(data);
    setLoading(false);
  };

  const todayEntry = entries.find(e => e.date === today);

  const handleSave = async (data) => {
    if (todayEntry && !viewing?.id) {
      await base44.entities.JournalEntry.update(todayEntry.id, data);
    } else if (viewing?.id) {
      await base44.entities.JournalEntry.update(viewing.id, data);
    } else {
      await base44.entities.JournalEntry.create({ ...data, date: today });
    }
    setShowForm(false);
    setViewing(null);
    loadEntries();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-5 pt-12 pb-4 bg-gradient-to-br from-background to-accent/5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-serif">Journal</h1>
            <p className="text-sm text-muted-foreground">Reflect & grow</p>
          </div>
          <Button size="sm" onClick={() => { setViewing(null); setShowForm(true); }} className="rounded-xl gap-1">
            <Plus className="w-4 h-4" /> {todayEntry ? "Edit Today" : "Write"}
          </Button>
        </div>
      </div>

      {/* Today's mood prompt */}
      {!todayEntry && (
        <div className="mx-5 mb-4 bg-gradient-to-r from-accent/20 to-primary/10 rounded-2xl p-4 border border-accent/20">
          <p className="text-sm font-semibold mb-1">How are you feeling today?</p>
          <p className="text-xs text-muted-foreground mb-3">Take 2 minutes to reflect on your day.</p>
          <Button size="sm" onClick={() => setShowForm(true)} className="bg-accent hover:bg-accent/90 text-white rounded-xl">
            Start today's entry
          </Button>
        </div>
      )}

      {/* Entries List */}
      <div className="px-5 pb-6 space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Past Entries</p>
        {loading ? (
          Array(3).fill(0).map((_, i) => <div key={i} className="h-20 bg-muted/30 rounded-2xl animate-pulse" />)
        ) : entries.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium">Your story starts here</p>
            <p className="text-sm">Write your first journal entry</p>
          </div>
        ) : (
          entries.map(entry => (
            <JournalCard key={entry.id} entry={entry} moods={MOODS} onEdit={() => { setViewing(entry); setShowForm(true); }} />
          ))
        )}
      </div>

      <Dialog open={showForm} onOpenChange={(open) => { setShowForm(open); if (!open) setViewing(null); }}>
        <DialogContent className="mx-4 rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{viewing ? "Edit Entry" : "Today's Journal"}</DialogTitle></DialogHeader>
          <JournalEntryForm initial={viewing || todayEntry} moods={MOODS} onSave={handleSave} onCancel={() => { setShowForm(false); setViewing(null); }} />
        </DialogContent>
      </Dialog>
    </div>
  );
}