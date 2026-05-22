import { Link, useLocation } from "@tanstack/react-router";
import { BookOpen, Home, ShieldCheck, Smartphone } from "lucide-react";
import { useA11y } from "../lib/a11y";

const tabs = [
  { to: "/inicio" as const, label: "Início", icon: Home, match: "/inicio" },
  { to: "/apps" as const, label: "Aplicativos", icon: Smartphone, match: "/apps" },
  { to: "/glossario" as const, label: "Glossário", icon: BookOpen, match: "/glossario" },
  { to: "/seguranca" as const, label: "Segurança", icon: ShieldCheck, match: "/seguranca" },
];

export function BottomTabBar() {
  const location = useLocation();
  const { enabled: a11y } = useA11y();

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur border-t-2 border-border"
    >
      <ul className="mx-auto max-w-md grid grid-cols-4">
        {tabs.map(({ to, label, icon: Icon, match }) => {
          const active = location.pathname === match || location.pathname.startsWith(match + "/");
          return (
            <li key={to}>
              <Link
                to={to}
                onClick={() => window.scrollTo(0, 0)}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center justify-center gap-1 py-2.5 transition ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon
                  className={a11y ? "size-7" : "size-6"}
                  strokeWidth={active ? 2.6 : 2.2}
                />
                <span className={`font-bold leading-none ${a11y ? "text-sm" : "text-xs"}`}>
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
