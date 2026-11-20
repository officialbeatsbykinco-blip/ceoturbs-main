import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { EMPTY_ADDRESS, addressError, shipTo } from "@/lib/ship-address";

const read = (f: string) => readFileSync(path.resolve(__dirname, f), "utf8");

describe("review card orders always have a shipping address", () => {
  const ok = { street: "401 E Jackson St", apt: "Suite 2", city: "Tampa", state: "fl", zip: "33602" };

  it("accepts a full US address and writes it on the order note", () => {
    expect(addressError(ok)).toBe("");
    expect(shipTo(ok)).toBe("Ship to: 401 E Jackson St, Suite 2, Tampa, FL 33602");
    expect(shipTo({ ...ok, apt: "" })).toBe("Ship to: 401 E Jackson St, Tampa, FL 33602");
  });

  it("stops the order when any part of the address is missing", () => {
    expect(addressError(EMPTY_ADDRESS)).toMatch(/street/);
    expect(addressError({ ...ok, city: "" })).toMatch(/city/);
    expect(addressError({ ...ok, state: "Florida" })).toMatch(/state/);
    expect(addressError({ ...ok, zip: "336" })).toMatch(/ZIP/);
  });

  it("is required on both backup order forms (cards and counter stand)", () => {
    for (const f of ["../components/shop/BuyBox.tsx", "../components/shop/StandRequest.tsx"]) {
      const src = read(f);
      expect(src, f).toContain("<ShippingFields");
      expect(src, f).toMatch(/addressError\(addr\)[^]*if \(addrErr\) return setErr\(addrErr\)/);
      expect(src, f).toContain("shipTo(addr)");
    }
  });

  it("sends pack buttons straight to Shopify checkout, falling back to the store page", () => {
    const src = read("../components/blocks/GrowEverywhere.tsx");
    expect(src).toContain("createCheckout(pack");
    expect(src).toContain("window.location.assign(packPath(pack.id))");
    expect(src).toContain('to={packPath(p.id)}');
  });
});
