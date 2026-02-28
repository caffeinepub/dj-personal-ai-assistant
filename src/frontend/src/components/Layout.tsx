import { Link, useLocation } from "react-router-dom";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { Button } from "@/components/ui/button";
import { LogOut, Home, MessageSquare, FileSpreadsheet, Code, Globe, User, Settings, GraduationCap } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const { clear } = useInternetIdentity();
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Dashboard" },
    { path: "/chat", icon: MessageSquare, label: "Chat" },
    { path: "/excel", icon: FileSpreadsheet, label: "Excel" },
    { path: "/coding", icon: Code, label: "Code" },
    { path: "/website", icon: Globe, label: "Web" },
    { path: "/settings", icon: Settings, label: "Settings" },
    { path: "/teach", icon: GraduationCap, label: "Teach" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="glow-border sticky top-0 z-50 border-b border-primary/30 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-3">
            <span className="glow-text font-display text-3xl font-bold tracking-wider">
              DJ
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
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
            className="border-destructive/50 text-destructive hover:bg-destructive/10"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Mobile navigation */}
      <nav className="glow-border fixed bottom-0 left-0 right-0 z-50 border-t border-primary/30 bg-card/95 backdrop-blur md:hidden">
        <div className="flex items-center justify-around px-1 py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path} className="flex-1">
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  size="sm"
                  className={`w-full flex-col h-auto py-1.5 gap-0.5 ${
                    isActive(item.path)
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
        </div>
      </nav>

      {/* Mobile spacer */}
      <div className="h-16 md:hidden" />
    </div>
  );
}
