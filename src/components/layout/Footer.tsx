import { Link } from "react-router-dom";
import { Activity, Instagram, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-12 border-t border-border bg-gradient-to-b from-[#eaf6ff] to-[#fdfeff] dark:from-[#0b1118] dark:to-[#0b1118]">
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2 font-semibold text-lg text-foreground">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg health-gradient shadow-soft">
                <Activity className="h-5 w-5 text-primary-foreground" />
              </div>
              VITALMed
            </div>
            <p className="text-sm text-muted-foreground mt-3 max-w-xs">
              AI-powered audio intelligence for modern care teams and patients.
            </p>
            <div className="flex items-center gap-3 mt-4 text-muted-foreground">
              <Linkedin className="h-4 w-4" />
              <Twitter className="h-4 w-4" />
              <Instagram className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground mb-3">Product</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <Link to="/upload" className="block hover:text-primary">Upload</Link>
              <Link to="/history" className="block hover:text-primary">History</Link>
              <Link to="/about" className="block hover:text-primary">About</Link>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground mb-3">Resources</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <span className="block">Security</span>
              <span className="block">Docs</span>
              <span className="block">Support</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground mb-3">Contact</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <span className="block">hello@vitasense.ai</span>
              <span className="block">+1 (415) 555-0198</span>
              <span className="block">San Francisco, CA</span>
            </div>
          </div>
        </div>
        <div className="mt-8 text-xs text-muted-foreground">
          Copyright 2026 VitaSense. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
