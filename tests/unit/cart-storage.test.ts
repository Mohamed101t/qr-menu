import { describe, expect, it, vi } from "vitest";
import {
  loadCart,
  saveCart,
  type CartStorage,
} from "../../src/features/cart/data/cart-storage";

function createMemoryStorage(): CartStorage {
  const data = new Map<string, string>();

  return {
    getItem(key) {
      return data.get(key) ?? null;
    },

    setItem(key, value) {
      data.set(key, value);
    },
  };
}

describe("cart storage", () => {
  it("saves and restores a cart", () => {
    const storage = createMemoryStorage();

    saveCart(
      "fresh-juice",
      [
        {
          productId: "mango",
          name: "عصير مانجو",
          unitPrice: 3000,
          quantity: 2,
        },
      ],
      storage,
    );

    expect(loadCart("fresh-juice", storage)).toEqual([
      {
        productId: "mango",
        name: "عصير مانجو",
        unitPrice: 3000,
        quantity: 2,
      },
    ]);
  });

  it("keeps carts separated by restaurant", () => {
    const storage = createMemoryStorage();

    saveCart(
      "restaurant-a",
      [
        {
          productId: "1",
          name: "منتج",
          unitPrice: 1000,
          quantity: 1,
        },
      ],
      storage,
    );

    expect(loadCart("restaurant-b", storage)).toEqual([]);
  });

  it("returns an empty cart for invalid JSON", () => {
    const storage: CartStorage = {
      getItem: () => "invalid-json",
      setItem: () => {},
    };

    expect(loadCart("fresh-juice", storage)).toEqual([]);
  });

  it("rejects malformed stored cart data", () => {
    const storage: CartStorage = {
      getItem: () =>
        JSON.stringify([
          {
            productId: "mango",
            quantity: -10,
          },
        ]),
      setItem: () => {},
    };

    expect(loadCart("fresh-juice", storage)).toEqual([]);
  });

  it("fails safely when storage cannot save", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const storage: CartStorage = {
      getItem: () => null,
      setItem: () => {
        throw new Error("Storage unavailable");
      },
    };

    expect(() =>
      saveCart("fresh-juice", [], storage),
    ).not.toThrow();

    expect(consoleError).toHaveBeenCalled();

    consoleError.mockRestore();
  });
});
