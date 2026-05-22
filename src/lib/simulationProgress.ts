import { useEffect, useState } from "react";

export type SimulationId = "configuracoes" | "camera" | "google" | "youtube" | "whatsapp";

export type SimulationProgress = Partial<
  Record<
    SimulationId,
    {
      completed: boolean;
      completedAt: string;
    }
  >
>;

const STORAGE_KEY = "ajudante-tech:simulation-progress";
const PROGRESS_EVENT = "ajudante-tech:simulation-progress";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getSimulationProgress(): SimulationProgress {
  if (!canUseStorage()) return {};

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function markSimulationCompleted(id: SimulationId): void {
  if (!canUseStorage()) return;

  const progress = getSimulationProgress();
  progress[id] = {
    completed: true,
    completedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  window.dispatchEvent(new Event(PROGRESS_EVENT));
}

export function subscribeSimulationProgress(listener: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;

  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) listener();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(PROGRESS_EVENT, listener);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(PROGRESS_EVENT, listener);
  };
}

export function useSimulationProgress(): SimulationProgress {
  const [progress, setProgress] = useState<SimulationProgress>({});

  useEffect(() => {
    setProgress(getSimulationProgress());
    return subscribeSimulationProgress(() => setProgress(getSimulationProgress()));
  }, []);

  return progress;
}
