// Shipping address for the backup order forms (components/shop/ShippingFields.tsx).

export type ShipAddress = { street: string; apt: string; city: string; state: string; zip: string };
export const EMPTY_ADDRESS: ShipAddress = { street: "", apt: "", city: "", state: "", zip: "" };

/** The first problem with the address, or "" when it's complete. */
export function addressError(a: ShipAddress) {
  if (a.street.trim().length < 4) return "Enter the street address to ship your order to.";
  if (a.city.trim().length < 2) return "Enter the city.";
  if (!/^[a-z]{2}$/i.test(a.state.trim())) return "Enter the 2-letter state, like FL.";
  if (!/^\d{5}(-\d{4})?$/.test(a.zip.trim())) return "Enter a 5-digit ZIP code.";
  return "";
}

/** "Ship to: 12 Main St, Apt 4, Tampa, FL 33602" for the order note on the leads sheet. */
export const shipTo = (a: ShipAddress) =>
  `Ship to: ${[a.street, a.apt, a.city, `${a.state.trim().toUpperCase()} ${a.zip.trim()}`].map((x) => x.trim()).filter(Boolean).join(", ")}`;
