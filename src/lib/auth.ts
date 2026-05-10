const SESSION_KEY = "ajudante_session";
const SESSION_DURATION_MS = 3 * 60 * 60 * 1000; // 3 horas

type Session = { email: string; expiresAt: number };

export function saveSession(email: string): void {
  const session: Session = { email, expiresAt: Date.now() + SESSION_DURATION_MS };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function isSessionValid(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const { expiresAt } = JSON.parse(raw) as Session;
    return Date.now() < expiresAt;
  } catch {
    return false;
  }
}

export function clearSession(): void {
  if (typeof window !== "undefined") localStorage.removeItem(SESSION_KEY);
}
