// Runs `fn` once the visitor first scrolls, taps, moves the mouse or types, with a timer as the fallback for
// someone who just reads. Ad tags and the booking embed wait for this, so they never compete with first paint.
const EVENTS = ["pointerdown", "pointermove", "scroll", "keydown", "touchstart"] as const;

export function onEngaged(fn: () => void, fallbackMs?: number) {
  let done = false;
  const run = () => {
    if (done) return;
    done = true;
    cancel();
    fn();
  };
  const timer = fallbackMs === undefined ? undefined : window.setTimeout(run, fallbackMs);
  const cancel = () => {
    window.clearTimeout(timer);
    EVENTS.forEach((e) => window.removeEventListener(e, run));
  };
  EVENTS.forEach((e) => window.addEventListener(e, run, { once: true, passive: true }));
  return cancel;
}
