/**
 * Safe localStorage helpers with an SSR-proof memory mirror.
 *
 * localStorage is unavailable during server render and can throw inside private
 * mode or after quota pressure; every access is guarded and buffered so the
 * stores stay calm on first paint.
 */

const PREFIX = "elo-g/";

const memory = new Map<string, string>();

function canUseStorage(): boolean {
  try {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
  } catch {
    return false;
  }
}

export function readJSON<T>(key: string): T | null {
  const full = PREFIX + key;
  const raw = memory.has(full) ? memory.get(full)! : canUseStorage()
    ? window.localStorage.getItem(full)
    : null;
  if (raw === null || raw === undefined) {
    memory.delete(full);
    return null;
  }
  memory.set(full, raw);
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function writeJSON<T>(key: string, value: T): boolean {
  const full = PREFIX + key;
  let raw: string;
  try {
    raw = JSON.stringify(value);
  } catch {
    return false;
  }
  memory.set(full, raw);
  if (!canUseStorage()) return true;
  try {
    window.localStorage.setItem(full, raw);
    return true;
  } catch {
    return false;
  }
}

export function removeKey(key: string): void {
  const full = PREFIX + key;
  memory.delete(full);
  if (!canUseStorage()) return;
  try {
    window.localStorage.removeItem(full);
  } catch {
    /* ignore */
  }
}

export function clearAll(): void {
  memory.clear();
  if (!canUseStorage()) return;
  try {
    for (let i = window.localStorage.length - 1; i >= 0; i--) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(PREFIX)) window.localStorage.removeItem(k);
    }
  } catch {
    /* ignore */
  }
}

/** Local-time date stamp in YYYY-MM-DD form (never UTC). */
export function dateStamp(date = new Date()): string {
  const y = String(date.getFullYear()).padStart(4, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}