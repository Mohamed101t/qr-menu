import { describe, expect, it } from "vitest";
import { buildApp } from "../../server/app";

const validBody = {
  restaurantSlug: "fresh-juice",
  items: [{ productId: "mango-juice", quantity: 2, observedUnitPrice: 3000 }],
};

describe("POST /api/v1/orders", () => {
  it("creates a validated order", async () => {
    const app = buildApp();
    try {
      const response = await app.inject({ method: "POST", url: "/api/v1/orders", headers: { "idempotency-key": "order-test-001" }, payload: validBody });
      expect(response.statusCode).toBe(201);
      const body = response.json();
      expect(body.order).toMatchObject({ restaurantId: "fresh-juice", status: "NEW", total: 6000 });
      expect(body.order.items[0]).toMatchObject({ productId: "mango-juice", unitPrice: 3000, quantity: 2, lineTotal: 6000 });
    } finally { await app.close(); }
  });

  it("rejects a changed product price", async () => {
    const app = buildApp();
    try {
      const response = await app.inject({ method: "POST", url: "/api/v1/orders", headers: { "idempotency-key": "order-test-002" }, payload: { restaurantSlug: "fresh-juice", items: [{ productId: "mango-juice", quantity: 1, observedUnitPrice: 1 }] } });
      expect(response.statusCode).toBe(409);
      expect(response.json()).toMatchObject({ code: "PRICE_CHANGED" });
    } finally { await app.close(); }
  });

  it("rejects unavailable products", async () => {
    const app = buildApp();
    try {
      const response = await app.inject({ method: "POST", url: "/api/v1/orders", headers: { "idempotency-key": "order-test-003" }, payload: { restaurantSlug: "fresh-juice", items: [{ productId: "seasonal-juice", quantity: 1, observedUnitPrice: 2500 }] } });
      expect(response.statusCode).toBe(409);
      expect(response.json()).toEqual({ code: "PRODUCT_UNAVAILABLE", message: "One or more products are unavailable.", productIds: ["seasonal-juice"] });
    } finally { await app.close(); }
  });

  it("rejects invalid quantities", async () => {
    const app = buildApp();
    try {
      const response = await app.inject({ method: "POST", url: "/api/v1/orders", headers: { "idempotency-key": "order-test-004" }, payload: { restaurantSlug: "fresh-juice", items: [{ productId: "mango-juice", quantity: 0, observedUnitPrice: 3000 }] } });
      expect(response.statusCode).toBe(400);
    } finally { await app.close(); }
  });

  it("does not create a duplicate order on retry", async () => {
    const app = buildApp();
    try {
      const first = await app.inject({ method: "POST", url: "/api/v1/orders", headers: { "idempotency-key": "order-test-005" }, payload: validBody });
      const second = await app.inject({ method: "POST", url: "/api/v1/orders", headers: { "idempotency-key": "order-test-005" }, payload: validBody });
      expect(first.statusCode).toBe(201);
      expect(second.statusCode).toBe(200);
      expect(second.json().order.id).toBe(first.json().order.id);
      expect(second.json().order.orderNumber).toBe(first.json().order.orderNumber);
    } finally { await app.close(); }
  });

  it("rejects reuse of an idempotency key for a different request", async () => {
    const app = buildApp();
    try {
      await app.inject({ method: "POST", url: "/api/v1/orders", headers: { "idempotency-key": "order-test-006" }, payload: validBody });
      const response = await app.inject({ method: "POST", url: "/api/v1/orders", headers: { "idempotency-key": "order-test-006" }, payload: { restaurantSlug: "fresh-juice", items: [{ productId: "mango-juice", quantity: 1, observedUnitPrice: 3000 }] } });
      expect(response.statusCode).toBe(409);
      expect(response.json()).toMatchObject({ code: "IDEMPOTENCY_KEY_REUSED" });
    } finally { await app.close(); }
  });

  it("rejects unknown products", async () => {
    const app = buildApp();
    try {
      const response = await app.inject({ method: "POST", url: "/api/v1/orders", headers: { "idempotency-key": "order-test-007" }, payload: { restaurantSlug: "fresh-juice", items: [{ productId: "does-not-exist", quantity: 1, observedUnitPrice: 3000 }] } });
      expect(response.statusCode).toBe(400);
      expect(response.json()).toMatchObject({ code: "PRODUCT_NOT_FOUND", productId: "does-not-exist" });
    } finally { await app.close(); }
  });

  it("rejects duplicate product lines", async () => {
    const app = buildApp();
    try {
      const response = await app.inject({ method: "POST", url: "/api/v1/orders", headers: { "idempotency-key": "order-test-008" }, payload: { restaurantSlug: "fresh-juice", items: [
        { productId: "mango-juice", quantity: 1, observedUnitPrice: 3000 },
        { productId: "mango-juice", quantity: 2, observedUnitPrice: 3000 }
      ] } });
      expect(response.statusCode).toBe(400);
      expect(response.json()).toMatchObject({ code: "DUPLICATE_PRODUCT" });
    } finally { await app.close(); }
  });
});
