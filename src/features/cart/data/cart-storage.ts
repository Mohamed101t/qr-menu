import type { CartItem } from "../domain/cart-item";

export interface CartStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

const CART_STORAGE_PREFIX = "qr-menu:cart";

function getCartStorageKey(restaurantId: string): string {
  return `${CART_STORAGE_PREFIX}:${restaurantId}`;
}

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.productId === "string" &&
    typeof item.name === "string" &&
    typeof item.unitPrice === "number" &&
    Number.isFinite(item.unitPrice) &&
    item.unitPrice >= 0 &&
    typeof item.quantity === "number" &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0
  );
}

export function loadCart(
  restaurantId: string,
  storage: CartStorage = window.localStorage,
): CartItem[] {
  try {
    const storedCart = storage.getItem(
      getCartStorageKey(restaurantId),
    );

    if (!storedCart) {
      return [];
    }

    const parsed: unknown = JSON.parse(storedCart);

    if (!Array.isArray(parsed) || !parsed.every(isCartItem)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
}

export function saveCart(
  restaurantId: string,
  cart: CartItem[],
  storage: CartStorage = window.localStorage,
): void {
  try {
    storage.setItem(
      getCartStorageKey(restaurantId),
      JSON.stringify(cart),
    );
  } catch (error) {
    console.error("Failed to save cart.", error);
  }
}

