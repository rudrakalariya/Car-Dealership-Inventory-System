import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, User as UserIcon, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function Navbar({ transparent = false }: { transparent?: boolean }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header
      className={
        "fixed top-0 left-0 right-0 z-40 transition-colors " +
        (transparent
          ? "bg-transparent"
          : "bg-background/70 backdrop-blur-xl border-b border-border")
      }
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="flex h-10 w-10 items-center justify-center rounded-full text-foreground/80 hover:bg-white/5">
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-background border-border">
            <SheetHeader>
              <SheetTitle className="font-display text-2xl">DriveHub</SheetTitle>
            </SheetHeader>
            <nav className="mt-8 flex flex-col gap-1">
              {[
                { to: "/", label: "Home" },
                { to: "/catalog", label: "Browse Vehicles" },
                { to: "/admin", label: "Admin" },
              ].map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-4 py-3 text-lg font-medium hover:bg-white/5"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <Link to="/" className="font-display text-xl font-bold tracking-tight">
          DRIVE<span className="text-gradient">HUB</span>
        </Link>

        <div className="flex items-center gap-1">
          <button className="flex h-10 w-10 items-center justify-center rounded-full text-foreground/80 hover:bg-white/5">
            <Search className="h-5 w-5" />
          </button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-10 w-10 items-center justify-center rounded-full text-foreground/80 hover:bg-white/5">
                  <UserIcon className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="text-sm font-medium">{user.username}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user.role === "admin" && (
                  <DropdownMenuItem onClick={() => navigate({ to: "/admin" })}>
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Admin dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    navigate({ to: "/" });
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full"
              onClick={() => navigate({ to: "/login" })}
            >
              Sign in
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
