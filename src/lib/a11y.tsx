import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Eye } from "lucide-react";

type Ctx = { enabled: boolean; toggle: () => void };

const A11yContext = createContext<Ctx>({ enabled: false, toggle: () => {} });

const STORAGE_KEY = "ajudante-tech:a11y";

export function A11yProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    try {
      const v = window.localStorage.getItem(STORAGE_KEY);
      if (v === "1") setEnabled(true);
    } catch {
      // ignore
    }
  }, []);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return <A11yContext.Provider value={{ enabled, toggle }}>{children}</A11yContext.Provider>;
}

export function useA11y() {
  return useContext(A11yContext);
}

export function A11yToggle({
  compact = false,
  className = "",
}: {
  compact?: boolean;
  className?: string;
}) {
  const { enabled, toggle } = useA11y();
  const sizeClass = compact ? "h-10 px-3 text-sm" : "h-12 px-4 text-base";
  const iconClass = compact ? "size-4" : "size-5";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={
        enabled
          ? "Desativar modo acessível com texto maior e alto contraste"
          : "Ativar modo acessível com texto maior e alto contraste"
      }
      className={`inline-flex items-center gap-2 rounded-full font-bold transition active:scale-[0.99] ${sizeClass} ${
        enabled
          ? "bg-background text-foreground border-4 border-foreground shadow-[0_0_0_2px_var(--background)]"
          : "bg-card text-foreground border-2 border-border hover:bg-muted"
      } ${className}`}
    >
      <Eye className={iconClass} />
      {enabled ? "A+" : "A"}
    </button>
  );
}
