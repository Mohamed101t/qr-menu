import { describe, expect, it } from "vitest";
import { buildApp } from "../../server/app";

describe("GET /api/v1/menu/:restaurantSlug", () => {
  it("returns the restaurant menu", async () => {
    const app = buildApp();
    try {
      const response = await app.inject({ method: "GET", url: "/api/v1/menu/fresh-juice" });
      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body.restaurant).toMatchObject({ id: "fresh-juice", name: "Fresh Juice", slug: "fresh-juice", currency: "SDG" });
      expect(body.categories).toHaveLength(1);
      expect(body.products).toHaveLength(2);
      expect(body.products[0]).toMatchObject({ id: "mango-juice", price: 3000, isAvailable: true });
    } finally {
      await app.close();
    }
  });

  it("returns 404 for an unknown restaurant", async () => {
    const app = buildApp();
    try {
      const response = await app.inject({ method: "GET", url: "/api/v1/menu/unknown-shop" });
      expect(response.statusCode).toBe(404);
      expect(response.json()).toEqual({ code: "MENU_NOT_FOUND", message: "Restaurant menu not found." });
    } finally {
      await app.close();
    }
  });

  it("rejects an invalid restaurant slug", async () => {
    const app = buildApp();
    try {
      const response = await app.inject({ method: "GET", url: "/api/v1/menu/INVALID_SLUG" });
      expect(response.statusCode).toBe(400);
    } finally {
      await app.close();
    }
  });
});
