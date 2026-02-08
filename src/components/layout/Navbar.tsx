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
    <nav
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/10 backdrop-blur supports-[backdrop-filter]:bg-white/20 dark:border-white/5 dark:bg-black/30"
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl -ml-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 via-cyan-400 to-blue-500 shadow-soft">
            <img src="/images/red logo.png" alt="VITALMed Logo" className="h-5 w-5" />
          </div>
          <span className="hidden sm:inline bg-gradient-to-r from-sky-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
            VITALMed
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            if (link.protected && !user) return null;
            const className = `text-sm font-medium transition-colors hover:text-foreground ${
              isActive(link.hash, link.href) ? "text-foreground" : "text-foreground/70"
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
        <div className="flex items-center gap-2 mr-3">
          {/* User Menu / Auth Buttons */}
     

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-9 w-9 border border-slate-700/60">
                    <AvatarImage src="" alt={user.email ?? "User"} />
                    <AvatarFallback className="bg-muted text-foreground">
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
