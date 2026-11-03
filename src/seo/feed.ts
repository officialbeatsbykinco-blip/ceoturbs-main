// Google Merchant Center + Microsoft Merchant Center product feed (RSS 2.0, g: namespace).
// Written to /feeds/products.xml at build time; both Merchant Centers fetch it on a schedule.
// Built from the same config as the product page, JSON-LD and Shopify variants, so prices never drift.
import { SITE, REVIEW_CARD, packPath, packSku } from "@/config/site";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const abs = (p: string) => `${SITE.url}${p}`;

const DESCRIPTION =
  "Get more 5-star Google reviews with one tap. Customers hold their phone near the card and your Google review page opens instantly — no app, no searching for your business. Works with iPhone XS and newer and all NFC-enabled Android phones. NTAG215 NFC chip (504 bytes), waterproof PVC, credit-card size 85.5 × 54 × 0.76 mm, double-sided: white matte “Review Us On Google” front and black NFC back. Program it yourself in 2 minutes from your phone, or order it programmed; re-program anytime. Made for barbers, lawn care, mobile repair, cleaners, contractors, stores and restaurants. No subscription. Ships in 1–2 business days from Atlanta with free US shipping.";

export type FeedItem = { id: string; title: string; link: string; price: string; color: string; multipack: number; image: string };

export function feedItems(): FeedItem[] {
  return REVIEW_CARD.packs.map((p) => ({
    id: packSku(p),
    title: `NFC Google Review Card${p.qty > 1 ? ` (${p.qty} Pack)` : ""} – Tap to Review – iPhone & Android, No App – White/Black`,
    link: abs(packPath(p.id)),
    price: `${p.price.toFixed(2)} ${REVIEW_CARD.currency}`,
    color: "White/Black",
    multipack: p.qty,
    image: abs(`/img/review-cards/shop-${p.qty}.jpg`),
  }));
}

export function merchantFeed(): string {
  // Clean, text-free images only: Shopping rejects overlays and supplier infographics.
  const extra = ["shop-both.jpg", "hd/card-hero.jpg", "hd/card-tap.jpg", "hd/card-counter.jpg", "hd/card-specs.jpg"].map((f) => abs(`/img/review-cards/${f}`));
  const items = feedItems()
    .map(
      (i) => `    <item>
      <g:id>${i.id}</g:id>
      <g:item_group_id>${REVIEW_CARD.sku}</g:item_group_id>
      <g:title>${esc(i.title)}</g:title>
      <g:description>${esc(DESCRIPTION)}</g:description>
      <g:link>${esc(i.link)}</g:link>
      <g:image_link>${esc(i.image)}</g:image_link>
${extra.map((u) => `      <g:additional_image_link>${esc(u)}</g:additional_image_link>`).join("\n")}
      <g:availability>in_stock</g:availability>
      <g:price>${i.price}</g:price>
      <g:condition>new</g:condition>
      <g:brand>${esc(SITE.name)}</g:brand>
      <g:mpn>${i.id}</g:mpn>
      <g:identifier_exists>no</g:identifier_exists>
      <g:google_product_category>Business &amp; Industrial &gt; Signage</g:google_product_category>
      <g:product_type>Business Supplies &gt; Review Cards &gt; NFC Google Review Cards</g:product_type>
      <g:color>${esc(i.color)}</g:color>
      <g:material>PVC</g:material>${i.multipack > 1 ? `\n      <g:multipack>${i.multipack}</g:multipack>` : ""}
      <g:product_highlight>One tap opens your Google review page — no app needed</g:product_highlight>
      <g:product_highlight>Works with iPhone XS+ and NFC Android phones</g:product_highlight>
      <g:product_highlight>Waterproof PVC, credit-card size, reusable and re-programmable</g:product_highlight>
      <g:product_highlight>Free US shipping, ships in 1–2 business days</g:product_highlight>
      <g:product_detail><g:section_name>Specs</g:section_name><g:attribute_name>NFC chip</g:attribute_name><g:attribute_value>NTAG215, 504 bytes user memory</g:attribute_value></g:product_detail>
      <g:product_detail><g:section_name>Specs</g:section_name><g:attribute_name>Size</g:attribute_name><g:attribute_value>85.5 x 54 x 0.76 mm</g:attribute_value></g:product_detail>
      <g:shipping>
        <g:country>US</g:country>
        <g:service>Standard (USPS)</g:service>
        <g:price>0.00 USD</g:price>
        <g:min_handling_time>1</g:min_handling_time>
        <g:max_handling_time>2</g:max_handling_time>
        <g:min_transit_time>2</g:min_transit_time>
        <g:max_transit_time>5</g:max_transit_time>
      </g:shipping>
      <g:shipping_weight>0.5 oz</g:shipping_weight>
      <g:custom_label_0>review-cards</g:custom_label_0>
      <g:custom_label_1>${i.multipack > 1 ? "multipack" : "single"}</g:custom_label_1>
    </item>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${esc(SITE.name)} — NFC Google Review Cards</title>
    <link>${SITE.url}/google-review-cards</link>
    <description>NFC tap-to-review cards for Google reviews</description>
${items}
  </channel>
</rss>
`;
}
