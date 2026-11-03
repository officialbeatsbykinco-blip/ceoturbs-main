# Ads reporting: 3 campaigns, $30/day hard cap

| # | Campaign | Platform | Budget | Primary conversion |
|---|---|---|---|---|
| 1 | CEO Turbo \| Booked Calls \| Search | Google (232-066-4335) | $10/day | Book appointment (`book_call`) |
| 2 | CEO Turbo \| Booked Calls \| Microsoft | Microsoft (189366985) | $10/day | UET Booked call (`book_appointment`) |
| 3 | Google Review Cards \| Search | Microsoft (189366985) | $10/day | UET Purchase |

Max spend: 3 × $10 = **$30/day** (platforms can overspend a day by up to 2× the daily budget but never over the monthly cap of 30.4 × budget). Keep every other campaign paused.

## Weekly table (fill from the platforms; cost / conv = spend ÷ conversions)
| Campaign | Spend | Clicks | Booked calls | Card sales | Cost per booked call | Cost per sale | Revenue / ROAS |
|---|---|---|---|---|---|---|---|
| 1 Google booked calls | | | | n/a | | n/a | n/a |
| 2 Microsoft booked calls | | | | n/a | | n/a | n/a |
| 3 Microsoft review cards | | | n/a | | n/a | | |
| **Total** | | | | | | | |

Break-even: one Turbo Launch ($1,697) pays for ~56 days of all three. A card pack averages ~$25–$80, so cards need cost per sale under ~$15 on 1 card.

## Where to read each number
- Google Ads → Goals → Conversions (Book appointment). Also GA4 `book_call`.
- Microsoft Ads → Goals → UET → Booked call and Purchase; Campaigns tab columns Spend, Conversions, Revenue.
- Cross-check booked calls against Cal.com bookings (`api/cal-webhook.js`) and card orders in Shopify. Platform counts should be within ~10–20%.

## Routine
- **Day 3:** search terms report on both platforms. Add every junk query as a negative (phrase).
- **Day 7:** pause keywords with 20+ clicks and 0 conversions. Raise CPC cap 20% on keywords with conversions.
- **Day 14:** move budget to the campaign with the lowest cost per booked call / sale, but never above $30/day total.

## Recommendations policy
OFF: all auto-apply, add broad match, Display Expansion, optimized targeting, AI Max, auto assets, Search Partners / Audience network, Final URL expansion, budget-raising bidding recommendations.
OK to apply after reading: optimized ad rotation, data-driven attribution, remove conflicting negatives, remove redundant/non-serving keywords, hand-reviewed RSA improvements.
