import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BookOpen,
  CheckSquare,
  Code,
  DollarSign,
  FileSpreadsheet,
  Globe,
  GraduationCap,
  Home,
  LogOut,
  MessageSquare,
  MoreHorizontal,
  Settings,
  StickyNote,
  User,
} from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { Link, useLocation } from "../lib/router-shim";

export function Layout({ children }: { children: React.ReactNode }) {
  const { clear } = useInternetIdentity();
  const location = useLocation();

  const allNavItems = [
    { path: "/", icon: Home, label: "Dashboard" },
    { path: "/chat", icon: MessageSquare, label: "Chat" },
    { path: "/knowledge", icon: BookOpen, label: "Knowledge" },
    { path: "/tasks", icon: CheckSquare, label: "Tasks" },
    { path: "/notes", icon: StickyNote, label: "Notes" },
    { path: "/finance", icon: DollarSign, label: "Finance" },
    { path: "/excel", icon: FileSpreadsheet, label: "Excel" },
    { path: "/coding", icon: Code, label: "Code" },
    { path: "/website", icon: Globe, label: "Web" },
    { path: "/settings", icon: Settings, label: "Settings" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  const mobileNavItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/chat", icon: MessageSquare, label: "Chat" },
    { path: "/tasks", icon: CheckSquare, label: "Tasks" },
    { path: "/notes", icon: StickyNote, label: "Notes" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  const mobileMoreItems = [
    { path: "/finance", icon: DollarSign, label: "Finance" },
    { path: "/knowledge", icon: BookOpen, label: "Knowledge" },
    { path: "/excel", icon: FileSpreadsheet, label: "Excel" },
    { path: "/coding", icon: Code, label: "Code" },
    { path: "/website", icon: Globe, label: "Website" },
    { path: "/settings", icon: Settings, label: "Settings" },
    { path: "/teach", icon: GraduationCap, label: "Teach DJ" },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isMoreActive = mobileMoreItems.some((i) => isActive(i.path));

  return (
    <div className="flex min-h-screen flex-col">
      <header className="glow-border sticky top-0 z-50 border-b border-primary/30 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-3">
            <span className="glow-text font-display text-3xl font-bold tracking-wider">
              DJ
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex overflow-x-auto">
            {allNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    size="sm"
                    className={
                      isActive(item.path)
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }
                  >
                    <Icon className="mr-1 h-3.5 w-3.5" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          <Button
            variant="outline"
            size="sm"
            onClick={() => clear()}
            className="border-destructive/50 text-destructive hover:bg-destructive/10 shrink-0"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <nav className="glow-border fixed bottom-0 left-0 right-0 z-50 border-t border-primary/30 bg-card/95 backdrop-blur md:hidden">
        <div className="flex items-center justify-around px-1 py-1">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link key={item.path} to={item.path} className="flex-1">
                <Button
                  variant={active ? "default" : "ghost"}
                  size="sm"
                  className={`w-full flex-col h-auto py-1.5 gap-0.5 ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-[9px]">{item.label}</span>
                </Button>
              </Link>
            );
          })}

          <div className="flex-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={isMoreActive ? "default" : "ghost"}
                  size="sm"
                  className={`w-full flex-col h-auto py-1.5 gap-0.5 ${
                    isMoreActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="text-[9px]">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="end"
                className="mb-2 border-primary/30 bg-card/95 backdrop-blur"
              >
                {mobileMoreItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <DropdownMenuItem key={item.path} asChild>
                      <Link
                        to={item.path}
                        className={`flex items-center gap-2 ${isActive(item.path) ? "text-primary" : ""}`}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      <div className="h-16 md:hidden" />
    </div>
  );
}
