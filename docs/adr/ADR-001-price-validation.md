# ADR-001: Price Validation at Order Confirmation

## Status

Accepted

## Context

The customer menu stores a snapshot of the product price inside the cart.

This allows the cart to remain stable across page reloads even if menu data changes.

However, browser data cannot be trusted as the final source of truth for order pricing.

## Decision

The cart may display the price snapshot that existed when the customer added the product.

When the customer confirms an order, the backend must:

1. Load the current product data from the database.
2. Validate that every product is still available.
3. Recalculate prices using trusted server-side data.
4. Compare the current total with the customer's cart snapshot.

If a product price changed, the system must not silently submit the order.

The customer must be informed that the price changed and must confirm the updated total.

## Why

This protects the business from manipulated browser prices while avoiding surprising customers with silent price changes.

## Consequences

Frontend cart prices are display snapshots only.

The backend becomes the authoritative source for final order prices.

Order records must store their own price snapshots after successful confirmation so historical orders do not change when menu prices change.

## Revisit Trigger

Review this decision if the product later introduces:

- promotions,
- coupons,
- time-based pricing,
- delivery pricing,
- taxes,
- or external POS integration.
