// Lead delivery that survives a bad connection. A lead that can't reach /api/lead (offline, timeout,
// server error) is kept in localStorage and re-sent on the next page load. The sheet de-duplicates by
// event id, so a lead that did arrive the first time is never filed twice.

const KEY = "ct_lead_outbox";
const MAX_TRIES = 3;
const MAX_AGE = 7 * 86400_000;

type Pending = { body: Record<string, unknown>; at: number; tries: number };

function read(): Pending[] {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function write(list: Pending[]) {
  try {
    if (list.length) localStorage.setItem(KEY, JSON.stringify(list.slice(-10)));
    else localStorage.removeItem(KEY);
  } catch {
    /* storage blocked */
  }
}

/** true = the server answered (accepted, or rejected as invalid, which a retry can't fix). */
async function post(body: Record<string, unknown>) {
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
      signal: AbortSignal.timeout(10_000),
    });
    return res.status < 500 && res.status !== 429;
  } catch {
    return false;
  }
}

/** Sends a lead to /api/lead. Never throws; a failed send is queued for a retry. */
export async function sendLead(body: Record<string, unknown>) {
  const ok = await post(body);
  if (!ok) write([...read(), { body, at: Date.now(), tries: 1 }]);
  return ok;
}

/** Re-sends queued leads. Call once per page load. */
export function flushLeadOutbox() {
  if (typeof window === "undefined") return;
  const list = read().filter((p) => Date.now() - p.at < MAX_AGE && p.tries < MAX_TRIES);
  write(list);
  if (!list.length) return;
  window.setTimeout(async () => {
    const left: Pending[] = [];
    for (const p of read()) {
      // The bot timer measures the original visit; a retry is not a fast bot.
      if (!(await post({ ...p.body, retry: p.tries }))) left.push({ ...p, tries: p.tries + 1 });
    }
    write(left.filter((p) => p.tries < MAX_TRIES));
  }, 3000);
}
