import { Link, useLocation } from "react-router-dom";
import { Activity, Menu, Moon, Sun, User, LogOut, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

export function Navbar() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/#top", label: "Home", hash: "#top" },
    { href: "/#technology", label: "Technology", hash: "#technology" },
    { href: "/#insights", label: "Insights", hash: "#insights" },
    { href: "/history", label: "History", hash: null, protected: true },
    { href: "/about", label: "About", hash: null },
    { href: "/#contact", label: "Contact", hash: "#contact" },
  ];

  const isActive = (hash: string | null) =>
    hash
      ? location.pathname === "/" && location.hash === hash
      : location.pathname === "/about";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/40 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-slate-800/60 dark:bg-slate-950/70">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg health-gradient shadow-soft">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="hidden sm:inline text-slate-900 dark:text-slate-100">VitaSense</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            if (link.protected && !user) return null;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.hash) ? "text-primary" : "text-slate-600 dark:text-slate-300"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          {/* User Menu / Auth Buttons */}
          <Button size="sm" className="rounded-full glow-button" asChild>
            <Link to="/upload">Try Demo</Link>
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm text-muted-foreground truncate">
                  {user.email}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/60 bg-white/85 dark:border-slate-800/60 dark:bg-slate-950/90">
          <div className="container py-4 flex flex-col gap-2">
            {navLinks.map((link) => {
              if (link.protected && !user) return null;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(link.hash)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted dark:hover:bg-slate-800"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
            {!user && (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-muted dark:hover:bg-slate-800"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
