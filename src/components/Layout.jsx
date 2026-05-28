import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Home, Flame, Target, Timer, BookOpen, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/habits", icon: Flame, label: "Habits" },
  { to: "/goals", icon: Target, label: "Goals" },
  { to: "/focus", icon: Timer, label: "Focus" },
  { to: "/journal", icon: BookOpen, label: "Journal" },
  { to: "/coach", icon: Bot, label: "Coach" },
  { to: "/profile", icon: User, label: "Profile" },
];

export default function Layout() {
  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative">
      <main className="flex-1 pb-20 overflow-y-auto">
        <Outlet />
      </main>
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-card/90 backdrop-blur-xl border-t border-border z-50">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-200 min-w-[44px]",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className={cn(
                    "p-1.5 rounded-lg transition-all",
                    isActive && "bg-primary/10"
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-medium">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}