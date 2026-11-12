import type { Product } from "../../menu/domain/product";
import type { CartItem } from "./cart-item";

export function addProductToCart(
  cart: CartItem[],
  product: Product,
): CartItem[] {
  const existingItem = cart.find(
    (item) => item.productId === product.id,
  );

  if (!existingItem) {
    return [
      ...cart,
      {
        productId: product.id,
        name: product.name,
        unitPrice: product.price,
        quantity: 1,
      },
    ];
  }

  return cart.map((item) =>
    item.productId === product.id
      ? { ...item, quantity: item.quantity + 1 }
      : item,
  );
}

export function increaseCartItem(
  cart: CartItem[],
  productId: string,
): CartItem[] {
  return cart.map((item) =>
    item.productId === productId
      ? { ...item, quantity: item.quantity + 1 }
      : item,
  );
}

export function decreaseCartItem(
  cart: CartItem[],
  productId: string,
): CartItem[] {
  return cart
    .map((item) =>
      item.productId === productId
        ? { ...item, quantity: item.quantity - 1 }
        : item,
    )
    .filter((item) => item.quantity > 0);
}

export function removeCartItem(
  cart: CartItem[],
  productId: string,
): CartItem[] {
  return cart.filter(
    (item) => item.productId !== productId,
  );
}

export function getCartItemCount(cart: CartItem[]): number {
  return cart.reduce(
    (total, item) => total + item.quantity,
    0,
  );
}

export function getCartTotal(cart: CartItem[]): number {
  return cart.reduce(
    (total, item) =>
      total + item.unitPrice * item.quantity,
    0,
  );
}
