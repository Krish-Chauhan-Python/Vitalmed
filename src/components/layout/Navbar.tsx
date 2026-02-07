import { Link, useLocation } from "react-router-dom";
import { Activity, Menu, LogOut, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home", hash: null },
    { href: "/about", label: "About", hash: null },
    { href: "/history", label: "History", hash: null, protected: true },
    { href: "#", label: "Med Assistant", hash: null, disabled: true },
  ];

  const isActive = (hash: string | null, href: string) => {
    if (hash) {
      return location.pathname === "/" && location.hash === hash;
    }
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname === href;
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#203245] bg-[#0b1118]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0b1118]/90">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg health-gradient shadow-soft">
            <img src="/images/red logo.png" alt="VitalMed Logo" className="h-5 w-5" />
          </div>
          <span className="hidden sm:inline text-slate-100">VitalMed</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            if (link.protected && !user) return null;
            const className = `text-sm font-medium transition-colors hover:text-sky-200 ${
              isActive(link.hash, link.href) ? "text-sky-200" : "text-slate-200/70"
            } ${link.disabled ? "cursor-not-allowed opacity-60" : ""}`;

            if (link.href.startsWith("/")) {
              return (
                <Link key={link.href} to={link.href} className={className}>
                  {link.label}
                </Link>
              );
            }

            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(event) => {
                  if (link.disabled) {
                    event.preventDefault();
                  }
                }}
                aria-disabled={link.disabled}
                className={className}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* User Menu / Auth Buttons */}
          <Button size="sm" className="rounded-full glow-button" asChild>
            <Link to="/upload">Try Demo</Link>
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-9 w-9 border border-slate-700/60">
                    <AvatarImage src="" alt={user.email ?? "User"} />
                    <AvatarFallback className="bg-slate-800 text-slate-200">
                      {(user.email ?? "U").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
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
              const className = `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(link.hash, link.href)
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted dark:hover:bg-slate-800"
              } ${link.disabled ? "cursor-not-allowed opacity-60" : ""}`;

              if (link.href.startsWith("/")) {
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={className}
                  >
                    {link.label}
                  </Link>
                );
              }

              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(event) => {
                    if (link.disabled) {
                      event.preventDefault();
                      return;
                    }
                    setMobileMenuOpen(false);
                  }}
                  aria-disabled={link.disabled}
                  className={className}
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
