import { describe, expect, it } from "vitest";
import type { CartItem } from "../../src/features/cart/domain/cart-item";
import { createOrder } from "../../src/features/orders/domain/create-order";

const cart: CartItem[] = [
  {
    productId: "mango-juice",
    name: "عصير مانجو",
    unitPrice: 3000,
    quantity: 2,
  },
];

describe("createOrder", () => {
  it("rejects an empty cart", () => {
    expect(() =>
      createOrder({
        restaurantId: "fresh-juice",
        cart: [],
      }),
    ).toThrow("Cannot create an order from an empty cart.");
  });

  it("creates a new order from the cart", () => {
    const order = createOrder({
      restaurantId: "fresh-juice",
      cart,
    });

    expect(order.restaurantId).toBe("fresh-juice");
    expect(order.status).toBe("NEW");
    expect(order.total).toBe(6000);
    expect(order.items).toHaveLength(1);
  });

  it("stores a snapshot of product data inside the order", () => {
    const order = createOrder({
      restaurantId: "fresh-juice",
      cart,
    });

    expect(order.items[0]).toEqual({
      productId: "mango-juice",
      productName: "عصير مانجو",
      unitPrice: 3000,
      quantity: 2,
      totalPrice: 6000,
    });
  });

  it("creates order identity and timestamp", () => {
    const order = createOrder({
      restaurantId: "fresh-juice",
      cart,
    });

    expect(order.id).not.toBe("");
    expect(order.orderNumber).not.toBe("");
    expect(Number.isNaN(Date.parse(order.createdAt))).toBe(false);
  });
});
