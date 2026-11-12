import type { CartItem } from "../domain/cart-item";
import {
  getCartItemCount,
  getCartTotal,
} from "../domain/cart";

interface CartSummaryProps {
  cart: CartItem[];
  currency: string;
  onOpen: () => void;
}

export function CartSummary({
  cart,
  currency,
  onOpen,
}: CartSummaryProps) {
  const itemCount = getCartItemCount(cart);
  const total = getCartTotal(cart);

  if (itemCount === 0) {
    return null;
  }

  return (
    <aside>
      <button type="button" onClick={onOpen}>
        السلة: {itemCount} |{" "}
        {total.toLocaleString("ar-SD")} {currency}
      </button>
    </aside>
  );
}
