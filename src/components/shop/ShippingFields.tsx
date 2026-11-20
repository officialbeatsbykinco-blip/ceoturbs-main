import { REVIEW_CARD } from "@/config/site";
import type { ShipAddress } from "@/lib/ship-address";

// Where to mail the order, for the backup order forms (used when Shopify checkout can't be reached).
// Shopify's own checkout collects the address itself; these forms have to ask for it.

export function ShippingFields({ uid, value, onChange }: { uid: string; value: ShipAddress; onChange: (a: ShipAddress) => void }) {
  const set = (k: keyof ShipAddress, v: string) => onChange({ ...value, [k]: k === "state" ? v.toUpperCase() : v });
  const field = (k: keyof ShipAddress, label: string, ac: string, max: number, numeric = false) => (
    <div key={k}>
      <label htmlFor={`${uid}-${k}`} className="mb-1.5 block text-xs font-medium text-chrome">
        {label}
      </label>
      <input id={`${uid}-${k}`} data-clarity-mask="true" type="text" inputMode={numeric ? "numeric" : undefined} className="field" value={value[k]} onChange={(e) => set(k, e.target.value)} autoComplete={`shipping ${ac}`} maxLength={max} />
    </div>
  );
  return (
    <fieldset className="grid gap-3 rounded-2xl border border-white/10 p-3">
      <legend className="px-1 text-xs font-semibold text-chrome">Ship my order to</legend>
      {field("street", "Street address", "address-line1", 100)}
      {field("apt", "Apt, suite (optional)", "address-line2", 60)}
      <div className="grid grid-cols-[1fr_4.5rem_6rem] gap-2">
        {field("city", "City", "address-level2", 60)}
        {field("state", "State", "address-level1", 2)}
        {field("zip", "ZIP", "postal-code", 10, true)}
      </div>
      <p className="text-[11px] text-muted-foreground">US addresses. {REVIEW_CARD.shipping.processing}.</p>
    </fieldset>
  );
}
