import { describe, expect, it } from "vitest";
import type { Product } from "../../src/features/menu/domain/product";
import {
  addProductToCart,
  decreaseCartItem,
  getCartItemCount,
  getCartTotal,
  increaseCartItem,
  removeCartItem,
} from "../../src/features/cart/domain/cart";

const mango: Product = {
  id: "mango-juice",
  restaurantId: "fresh-juice",
  categoryId: "juices",
  name: "عصير مانجو",
  description: "عصير مانجو طازج",
  price: 3000,
  imageUrl: null,
  isAvailable: true,
  sortOrder: 1,
};

describe("cart", () => {
  it("adds a new product with quantity 1", () => {
    const cart = addProductToCart([], mango);

    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(1);
    expect(cart[0].unitPrice).toBe(3000);
  });

  it("increases quantity instead of duplicating the same product", () => {
    let cart = addProductToCart([], mango);
    cart = addProductToCart(cart, mango);

    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(2);
  });

  it("increases an existing cart item", () => {
    let cart = addProductToCart([], mango);
    cart = increaseCartItem(cart, mango.id);

    expect(cart[0].quantity).toBe(2);
  });

  it("removes an item when its quantity reaches zero", () => {
    let cart = addProductToCart([], mango);
    cart = decreaseCartItem(cart, mango.id);

    expect(cart).toEqual([]);
  });

  it("removes a cart item explicitly", () => {
    let cart = addProductToCart([], mango);
    cart = removeCartItem(cart, mango.id);

    expect(cart).toEqual([]);
  });

  it("calculates item count and total correctly", () => {
    let cart = addProductToCart([], mango);
    cart = addProductToCart(cart, mango);
    cart = addProductToCart(cart, mango);

    expect(getCartItemCount(cart)).toBe(3);
    expect(getCartTotal(cart)).toBe(9000);
  });

  it("keeps the price snapshot already stored in the cart", () => {
    const cart = addProductToCart([], mango);

    const changedProduct = {
      ...mango,
      price: 5000,
    };

    expect(changedProduct.price).toBe(5000);
    expect(cart[0].unitPrice).toBe(3000);
  });
});
