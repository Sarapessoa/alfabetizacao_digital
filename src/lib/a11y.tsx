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

export function A11yToggle() {
  const { enabled, toggle } = useA11y();
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
      className={`inline-flex items-center gap-2 h-12 px-4 rounded-full text-base font-bold transition active:scale-[0.99] ${
        enabled
          ? "bg-foreground text-background border-2 border-foreground"
          : "bg-card text-foreground border-2 border-border hover:bg-muted"
      }`}
    >
      <Eye className="size-5" />
      {enabled ? "A+" : "A"}
    </button>
  );
}