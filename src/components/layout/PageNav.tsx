import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type PageNavItem = {
  href: string;
  label: string;
};

type PageNavProps = {
  title?: string;
  items: PageNavItem[];
};

export function PageNav({ title = "On this page", items }: PageNavProps) {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href.startsWith("#")) {
      return location.hash === href;
    }
    if (href.includes("#")) {
      const [path, hash] = href.split("#");
      return location.pathname === path && location.hash === `#${hash}`;
    }
    return location.pathname === href;
  };

  return (
    <aside className="page-nav mt-5">
      <Card className="page-nav__panel">
        <CardHeader className="page-nav__header">
          <CardTitle className="page-nav__title">{title}</CardTitle>
        </CardHeader>
        <Separator className="page-nav__separator" />
        <CardContent className="page-nav__content">
          <nav className="page-nav__links">
            {items.map((item) => {
              const active = isActive(item.href);
              return (
                <Button
                  key={item.href}
                  asChild
                  variant={active ? "secondary" : "ghost"}
                  size="sm"
                  className={`page-nav__link ${active ? "is-active" : ""}`}
                >
                  <a href={item.href}>
                    <span className="page-nav__bullet" aria-hidden="true" />
                    <span className="page-nav__text">{item.label}</span>
                  </a>
                </Button>
              );
            })}
          </nav>
        </CardContent>
      </Card>
    </aside>
  );
}
