import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { format } from "date-fns";
import { Play, Pause, RotateCcw, CheckCircle2, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FocusHistory from "@/components/focus/FocusHistory";

const PRESETS = [
  { label: "Pomodoro", minutes: 25, type: "pomodoro" },
  { label: "Deep Work", minutes: 50, type: "deep_work" },
  { label: "Flow", minutes: 90, type: "flow" },
];

export default function Focus() {
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [label, setLabel] = useState("");
  const [timeLeft, setTimeLeft] = useState(PRESETS[0].minutes * 60);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [sessions, setSessions] = useState([]);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  const today = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    setTimeLeft(PRESETS[selectedPreset].minutes * 60);
    setRunning(false);
    setCompleted(false);
  }, [selectedPreset]);

  useEffect(() => {
    if (running) {
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            setCompleted(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const loadSessions = async () => {
    const data = await base44.entities.FocusSession.filter({}, "-created_date", 10);
    setSessions(data);
  };

  const reset = () => {
    setRunning(false);
    setCompleted(false);
    setTimeLeft(PRESETS[selectedPreset].minutes * 60);
  };

  const saveSession = async () => {
    const preset = PRESETS[selectedPreset];
    const xp = Math.round(preset.minutes / 5);
    await base44.entities.FocusSession.create({
      date: today,
      duration_minutes: preset.minutes,
      type: preset.type,
      label: label || preset.label,
      completed: true,
      xp_earned: xp,
    });
    setCompleted(false);
    reset();
    loadSessions();
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const preset = PRESETS[selectedPreset];
  const progress = ((preset.minutes * 60 - timeLeft) / (preset.minutes * 60)) * 100;
  const circumference = 2 * Math.PI * 90;

  return (
    <div className="min-h-screen bg-background">
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-2xl font-bold font-serif">Focus Timer</h1>
        <p className="text-sm text-muted-foreground">Deep work sessions</p>
      </div>

      {/* Preset Selector */}
      <div className="px-5 mb-6">
        <div className="flex gap-2">
          {PRESETS.map((p, i) => (
            <button key={i} onClick={() => setSelectedPreset(i)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedPreset === i ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timer Circle */}
      <div className="flex flex-col items-center px-5 mb-6">
        <div className="relative w-52 h-52 mb-6">
          <svg className="w-52 h-52 -rotate-90" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="90" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
            <circle
              cx="100" cy="100" r="90"
              fill="none"
              stroke={completed ? "hsl(var(--accent))" : "hsl(var(--primary))"}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (progress / 100) * circumference}
              style={{ transition: "stroke-dashoffset 0.5s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {completed ? (
              <CheckCircle2 className="w-10 h-10 text-accent mb-1" />
            ) : (
              <Timer className="w-6 h-6 text-primary mb-1" />
            )}
            <span className="text-4xl font-bold font-mono tabular-nums">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
            <span className="text-xs text-muted-foreground mt-1">{preset.label}</span>
          </div>
        </div>

        {/* Label Input */}
        <Input
          placeholder="What are you working on?"
          value={label}
          onChange={e => setLabel(e.target.value)}
          className="mb-4 text-center max-w-xs"
          disabled={running}
        />

        {/* Controls */}
        {completed ? (
          <div className="flex gap-3">
            <Button variant="outline" onClick={reset} className="gap-2 rounded-xl px-5">
              <RotateCcw className="w-4 h-4" /> Reset
            </Button>
            <Button onClick={saveSession} className="gap-2 rounded-xl px-5 bg-accent hover:bg-accent/90">
              <CheckCircle2 className="w-4 h-4" /> Save Session
            </Button>
          </div>
        ) : (
          <div className="flex gap-3">
            <Button variant="outline" size="icon" onClick={reset} className="rounded-xl w-12 h-12">
              <RotateCcw className="w-5 h-5" />
            </Button>
            <Button onClick={() => setRunning(r => !r)} className="rounded-xl w-32 h-12 text-base gap-2">
              {running ? <><Pause className="w-5 h-5" /> Pause</> : <><Play className="w-5 h-5" /> Start</>}
            </Button>
          </div>
        )}
      </div>

      {/* History */}
      <FocusHistory sessions={sessions} />
    </div>
  );
}