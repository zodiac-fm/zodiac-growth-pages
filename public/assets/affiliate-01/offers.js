// Current affiliate offer. Change this record first, then run npm run build.
export const OFFER = {
  "id": "affiliate-free-7-day",
  "trialDays": 7,
  "annual": {
    "id": "annual",
    "display": "$7.33/mo · $88 billed yearly",
    "charge": 88,
    "interval": "year"
  },
  "monthly": {
    "id": "monthly",
    "display": "$14/mo",
    "charge": 14,
    "interval": "month"
  },
  "short": "7 days free. Then $88 yearly or $14 monthly, on the plan you choose.",
  "terms": "Card required when you start the trial. On day 8, your selected plan renews automatically at $88 yearly or $14 monthly until you cancel. Cancel before day 8 to avoid the first charge. Later cancellation stops the next charge. No refunds. Paid access continues through the period you paid for.",
  "source": "brand/offers.md, current relaunch matrix, verified 2026-11-16",
  "billingDay": 8,
  "monthlyYearTotal": 168
};
