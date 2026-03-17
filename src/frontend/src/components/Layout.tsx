import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Activity,
  BookOpen,
  Brain,
  CheckSquare,
  Code,
  DollarSign,
  FileSpreadsheet,
  Globe,
  GraduationCap,
  Home,
  LogOut,
  Map as MapIcon,
  MessageSquare,
  MoreHorizontal,
  Settings,
  StickyNote,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { useContextEngine } from "../context/ContextEngineContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { Link, useLocation } from "../lib/router-shim";
import { HudBackground } from "./HudBackground";
import { ProactiveReminders } from "./ProactiveReminders";

export function Layout({ children }: { children: React.ReactNode }) {
  const { clear } = useInternetIdentity();
  const location = useLocation();
  const { logAction, setCurrentPage } = useContextEngine();

  useEffect(() => {
    logAction("page_visit", location.pathname);
    setCurrentPage(location.pathname);
  }, [location.pathname, logAction, setCurrentPage]);

  const allNavItems = [
    { path: "/", icon: Home, label: "Dashboard" },
    { path: "/chat", icon: MessageSquare, label: "Chat" },
    { path: "/knowledge", icon: BookOpen, label: "Knowledge" },
    { path: "/tasks", icon: CheckSquare, label: "Tasks" },
    { path: "/notes", icon: StickyNote, label: "Notes" },
    { path: "/finance", icon: DollarSign, label: "Finance" },
    { path: "/memory", icon: Brain, label: "Memory" },
    { path: "/plans", icon: MapIcon, label: "Plans" },
    { path: "/excel", icon: FileSpreadsheet, label: "Excel" },
    { path: "/coding", icon: Code, label: "Code" },
    { path: "/website", icon: Globe, label: "Web" },
    { path: "/settings", icon: Settings, label: "Settings" },
    { path: "/profile", icon: User, label: "Profile" },
    { path: "/system-status", icon: Activity, label: "Status" },
  ];

  const mobileNavItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/chat", icon: MessageSquare, label: "Chat" },
    { path: "/tasks", icon: CheckSquare, label: "Tasks" },
    { path: "/plans", icon: MapIcon, label: "Plans" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  const mobileMoreItems = [
    { path: "/finance", icon: DollarSign, label: "Finance" },
    { path: "/notes", icon: StickyNote, label: "Notes" },
    { path: "/knowledge", icon: BookOpen, label: "Knowledge" },
    { path: "/memory", icon: Brain, label: "Memory" },
    { path: "/excel", icon: FileSpreadsheet, label: "Excel" },
    { path: "/coding", icon: Code, label: "Code" },
    { path: "/website", icon: Globe, label: "Web" },
    { path: "/settings", icon: Settings, label: "Settings" },
    { path: "/system-status", icon: Activity, label: "Status" },
    { path: "/teach-dj", icon: GraduationCap, label: "Teach DJ" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#060b14]">
      <ProactiveReminders />

      {/* Desktop sidebar */}
      <div className="fixed left-0 top-0 z-40 hidden h-full w-16 flex-col items-center border-r border-white/5 bg-[#060b14]/95 py-4 backdrop-blur-xl md:flex">
        {/* Logo */}
        <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/40 bg-cyan-500/10">
          <span className="font-display text-sm font-bold text-cyan-400">
            DJ
          </span>
        </div>

        {/* Nav items */}
        <nav className="flex flex-1 flex-col items-center gap-1 overflow-y-auto">
          {allNavItems.map(({ path, icon: Icon, label }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                data-ocid={`nav.${label.toLowerCase().replace(/ /g, "-")}.link`}
                title={label}
                className={`group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                  active
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "text-white/30 hover:bg-white/5 hover:text-white/70"
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                {active && (
                  <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-r bg-cyan-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => clear()}
          title="Log out"
          data-ocid="nav.logout.button"
          className="mt-2 text-white/20 hover:text-rose-400"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>

      {/* Main content with page transitions */}
      <main className="flex-1 md:ml-16">
        <HudBackground />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{ minHeight: "100%" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-white/5 bg-[#060b14]/95 px-2 pb-safe pt-2 backdrop-blur-xl md:hidden">
        {mobileNavItems.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              data-ocid={`nav.${label.toLowerCase()}.link`}
              className={`flex min-h-[44px] flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] transition-all ${
                active ? "text-cyan-400" : "text-white/30 hover:text-white/60"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
        {/* More menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex min-h-[44px] flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] text-white/30 hover:text-white/60"
            >
              <MoreHorizontal className="h-5 w-5" />
              More
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align="end"
            className="mb-2 border-white/10 bg-[#060b14]/95 text-white backdrop-blur-xl"
          >
            {mobileMoreItems.map(({ path, icon: Icon, label }) => (
              <DropdownMenuItem key={path} asChild>
                <Link
                  to={path}
                  data-ocid={`nav.more.${label.toLowerCase().replace(/ /g, "-")}.link`}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile spacer */}
      <div className="h-16 md:hidden" />
    </div>
  );
}
