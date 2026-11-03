import "@testing-library/jest-dom";

if (typeof window !== "undefined") Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Newer Node ships its own (broken without --localstorage-file) localStorage that shadows jsdom's.
for (const name of ["localStorage", "sessionStorage"] as const) {
  if (typeof window === "undefined") continue;
  let ok = true;
  try {
    (globalThis as unknown as Record<string, Storage>)[name].setItem("__t", "1");
  } catch {
    ok = false;
  }
  if (ok) continue;
  const m = new Map<string, string>();
  const store = {
    get length() { return m.size; },
    clear: () => m.clear(),
    getItem: (k: string) => (m.has(k) ? m.get(k)! : null),
    key: (i: number) => [...m.keys()][i] ?? null,
    removeItem: (k: string) => void m.delete(k),
    setItem: (k: string, v: string) => void m.set(k, String(v)),
  } as Storage;
  Object.defineProperty(globalThis, name, { value: store, configurable: true, writable: true });
  Object.defineProperty(window, name, { value: store, configurable: true, writable: true });
}
