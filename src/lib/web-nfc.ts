// Writes the review link straight from the page with Web NFC, so no app is needed.
// Only Chrome on Android has it; iPhones and everything else follow the NFC Tools steps.

type NdefWriter = { write: (message: { records: { recordType: string; data: string }[] }, options?: { signal?: AbortSignal }) => Promise<void> };

const reader = () => (window as unknown as { NDEFReader?: new () => NdefWriter }).NDEFReader;

export const canWriteNfc = () => typeof window !== "undefined" && !!reader();

/** Resolves once the card has been written. Waits for a tap until aborted. */
export async function writeCard(url: string, signal?: AbortSignal) {
  const Writer = reader();
  if (!Writer) throw new Error("Web NFC not supported");
  await new Writer().write({ records: [{ recordType: "url", data: url }] }, { signal });
}
