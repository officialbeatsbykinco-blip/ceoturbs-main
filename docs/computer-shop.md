# Computer shop: how to list a computer

The shop at ceoturbo.com/computers shows your Shopify products automatically. You never touch the website code.

## Add a computer in Shopify

1. Shopify admin → **Products → Add product**.
2. **Title**: brand, model and the main spec, e.g. `Dell Latitude 7420 Laptop – i7, 16GB, 512GB SSD`.
3. **Description**: one or two plain sentences, then one spec per line written as `Name: value`. Each of those lines becomes a row in the Specs table:
   ```
   Fast, light business laptop. Cleaned, updated and tested.
   Processor: Intel Core i7-1185G7
   Memory: 16GB
   Storage: 512GB SSD
   Screen: 14" Full HD
   Windows: Windows 11 Pro
   Battery: 90% health
   ```
   (A two-column table in the description works too.)
4. **Media**: add the photos. The first photo is the one on the shop card and in Google results. Square or 4:3, white background looks best.
5. **Price** and, for a sale, **Compare-at price** (shows as a crossed-out price).
6. **Inventory**: track quantity and set it to 1 for a one-of-a-kind computer, so it shows **Sold** after it sells.
7. **Variants** (optional): e.g. option `Memory` with values `8GB` / `16GB`, each with its own price.
8. **Product organization**:
   - **Type**: `Laptop`, `Desktop` or `Computer` (this is what puts it in the shop).
   - **Vendor**: the brand (Dell, HP, Apple, Lenovo…).
   - **Tags**: the condition (`New`, `Refurbished`, `Used` or `Open box`) and, if it fits, `Gaming`. Tags add the badge and the filters.
9. **Publishing / Sales channels**: keep it published to **Buy Button**, the same channel the review cards use. Without it the site can't see the product.
10. Save. The listing shows on ceoturbo.com/computers right away.

## When it shows in Google

The page loads new listings live. Each computer also gets its own prerendered page (title, photo and Product schema for Google) on the next deploy. Any push to `main` redeploys.

## Selling it

Buy now opens Shopify checkout for that computer, so payment, shipping or local pickup, taxes and order emails come from your Shopify settings. Set up local pickup or delivery for Tampa in **Settings → Shipping and delivery**.
