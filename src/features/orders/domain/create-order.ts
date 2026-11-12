import type { CartItem } from "../../cart/domain/cart-item";
import { getCartTotal } from "../../cart/domain/cart";
import type { Order } from "./order";

interface CreateOrderInput {
  restaurantId: string;
  cart: CartItem[];
}

export function createOrder({
  restaurantId,
  cart,
}: CreateOrderInput): Order {
  if (cart.length === 0) {
    throw new Error("Cannot create an order from an empty cart.");
  }

  const now = new Date();

  return {
    id: crypto.randomUUID(),
    orderNumber: now.getTime().toString().slice(-6),
    restaurantId,
    status: "NEW",
    items: cart.map((item) => ({
      productId: item.productId,
      productName: item.name,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      totalPrice: item.unitPrice * item.quantity,
    })),
    total: getCartTotal(cart),
    createdAt: now.toISOString(),
  };
}
