import type { CartItem } from "../domain/cart-item";
import { getCartTotal } from "../domain/cart";

interface CartPanelProps {
  cart: CartItem[];
  currency: string;
  onIncrease: (productId: string) => void;
  onDecrease: (productId: string) => void;
  onRemove: (productId: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}

export function CartPanel({
  cart,
  currency,
  onIncrease,
  onDecrease,
  onRemove,
  onConfirm,
  onClose,
}: CartPanelProps) {
  if (cart.length === 0) {
    return (
      <section>
        <h2>السلة فارغة</h2>

        <button type="button" onClick={onClose}>
          العودة للقائمة
        </button>
      </section>
    );
  }

  const total = getCartTotal(cart);

  return (
    <section>
      <button type="button" onClick={onClose}>
        إغلاق
      </button>

      <h2>السلة</h2>

      {cart.map((item) => (
        <article key={item.productId}>
          <h3>{item.name}</h3>

          <p>
            {item.unitPrice.toLocaleString("ar-SD")} {currency}
          </p>

          <button
            type="button"
            onClick={() => onIncrease(item.productId)}
          >
            +
          </button>

          <span>{item.quantity}</span>

          <button
            type="button"
            onClick={() => onDecrease(item.productId)}
          >
            −
          </button>

          <button
            type="button"
            onClick={() => onRemove(item.productId)}
          >
            حذف
          </button>
        </article>
      ))}

      <p>
        الإجمالي: {total.toLocaleString("ar-SD")} {currency}
      </p>

      <button type="button" onClick={onConfirm}>
        تأكيد الطلب
      </button>
    </section>
  );
}
