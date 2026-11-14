// The computer shop: Shopify listings become cards, listing pages, specs and Product schema; checkout is Shopify's.
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, cleanup, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ComputerShop from "@/pages/ComputerShop";
import ComputerProduct from "@/pages/ComputerProduct";
import { conditionOf, kindsOf, parseDescription, setComputerSnapshot, toComputer, type Computer } from "@/lib/computers";
import { computerMeta, computerPageFor } from "@/seo/computers";
import { pageFor } from "@/seo/pages";
import { problemsFor } from "@/content/tech-quiz";

const raw = (over: Partial<Parameters<typeof toComputer>[0]> = {}) => ({
  handle: "dell-latitude-7420",
  title: "Dell Latitude 7420 Laptop",
  description: "Fast business laptop. Processor: Intel Core i7",
  descriptionHtml: "<p>Fast business laptop, tested and cleaned.</p><ul><li>Processor: Intel Core i7-1185G7</li><li><strong>Memory:</strong> 16GB</li></ul><table><tr><td>Storage</td><td>512GB SSD</td></tr></table>",
  productType: "Laptop",
  vendor: "Dell",
  tags: ["Refurbished", "laptop"],
  updatedAt: "2026-11-13T00:00:00Z",
  availableForSale: true,
  images: { nodes: [{ url: "https://cdn.shopify.com/s/files/dell.jpg", altText: null, width: 1200, height: 900 }] },
  options: [{ name: "Title", values: ["Default Title"] }],
  variants: { nodes: [{ id: "gid://shopify/ProductVariant/42", title: "Default Title", availableForSale: true, price: { amount: "449.0" }, compareAtPrice: { amount: "599.0" }, selectedOptions: [{ name: "Title", value: "Default Title" }] }] },
  ...over,
});

const DELL: Computer = toComputer(raw());

afterEach(() => {
  cleanup();
  setComputerSnapshot([]);
  vi.unstubAllGlobals();
});

describe("Shopify product → computer", () => {
  it("keeps price, sale price, photos and drops Shopify's default option", () => {
    expect(DELL).toMatchObject({ price: 449, compareAt: 599, available: true, options: [] });
    expect(DELL.images[0]).toMatchObject({ alt: "Dell Latitude 7420 Laptop", width: 1200 });
  });

  it("reads condition and kind from the type, title and tags", () => {
    expect(conditionOf(DELL)).toBe("Refurbished");
    expect(kindsOf(DELL)).toEqual(["Laptops"]);
    const mac = toComputer(raw({ title: "Apple Mac mini M2", productType: "Desktop", tags: ["new"] }));
    expect(kindsOf(mac)).toEqual(["Desktops", "Macs"]);
    expect(conditionOf(mac)).toBe("New");
    expect(kindsOf(toComputer(raw({ title: "Workstation machine", productType: "Computer", tags: [] })))).toEqual([]);
  });

  it("turns 'Name: value' lines and table rows into specs, the rest into text (no HTML)", () => {
    const { specs, paragraphs } = parseDescription(DELL.descriptionHtml);
    expect(specs).toEqual([
      ["Processor", "Intel Core i7-1185G7"],
      ["Memory", "16GB"],
      ["Storage", "512GB SSD"],
    ]);
    expect(paragraphs).toEqual(["Fast business laptop, tested and cleaned."]);
    expect(parseDescription("<script>alert(1)</script><p>Note: works great.</p>").paragraphs.join(" ")).not.toContain("<");
  });
});

describe("search", () => {
  it("each listing gets its own title, picture and Product schema", () => {
    const m = computerMeta(DELL);
    expect(m.path).toBe("/computers/dell-latitude-7420");
    expect(m.ogImage).toBe("https://cdn.shopify.com/s/files/dell.jpg");
    expect(m.description.length).toBeLessThanOrEqual(155);
    const product = m.schema.find((n) => n["@type"] === "Product") as Record<string, Record<string, string>>;
    expect(product.offers).toMatchObject({ price: "449.00", priceCurrency: "USD", availability: "https://schema.org/InStock", itemCondition: "https://schema.org/RefurbishedCondition" });
    expect(product.brand).toMatchObject({ name: "Dell" });
  });

  it("the shop is a page; unknown listings get a noindex placeholder until they load", () => {
    expect(pageFor("/computers")?.title).toMatch(/Computers for Sale/);
    expect(computerPageFor("/computers/new-one")?.noindex).toBe(true);
    setComputerSnapshot([DELL]);
    expect(pageFor("/computers/dell-latitude-7420")?.title).toContain("Dell Latitude 7420");
  });
});

const at = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/computers" element={<ComputerShop />} />
        <Route path="/computers/:handle" element={<ComputerProduct />} />
      </Routes>
    </MemoryRouter>,
  );

const shopify = (nodes: unknown[]) => vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ data: { products: { nodes } } }), { status: 200 })));

describe("pages", () => {
  it("lists computers from Shopify with price and a link to each", async () => {
    shopify([raw()]);
    at("/computers");
    const link = await screen.findByRole("link", { name: /Dell Latitude 7420/ });
    expect(link.getAttribute("href")).toBe("/computers/dell-latitude-7420");
    expect(link.textContent).toContain("$449");
    expect(link.textContent).toContain("Refurbished");
  });

  it("with nothing listed yet, it asks what they need instead of showing an empty grid", async () => {
    shopify([]);
    at("/computers");
    expect(await screen.findByText(/New computers are being listed now/)).toBeTruthy();
  });

  it("a listing shows specs and a Buy now button", async () => {
    setComputerSnapshot([DELL]);
    shopify([raw()]);
    at("/computers/dell-latitude-7420");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Dell Latitude 7420 Laptop");
    expect(screen.getByText("512GB SSD")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Buy now" })).toBeTruthy();
  });

  it("a sold-out listing can't be bought; a removed one says so", async () => {
    shopify([raw({ availableForSale: false, variants: { nodes: [{ ...raw().variants.nodes[0], availableForSale: false }] } })]);
    at("/computers/dell-latitude-7420");
    await waitFor(() => expect((screen.getByRole("button", { name: "Sold" }) as HTMLButtonElement).disabled).toBe(true));
    cleanup();
    at("/computers/gone");
    expect(await screen.findByText(/This computer has sold or moved/)).toBeTruthy();
  });
});

describe("repairs", () => {
  it("phones and tablets: screens and batteries only", () => {
    expect(problemsFor("iphone").map((p) => p.id)).toEqual(["screen", "battery"]);
    expect(problemsFor("windows").map((p) => p.id)).toContain("upgrade");
  });
});
