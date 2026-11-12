import type { Order } from "../domain/order";

interface OrderSuccessProps {
  order: Order;
  currency: string;
  onDone: () => void;
}

export function OrderSuccess({
  order,
  currency,
  onDone,
}: OrderSuccessProps) {
  return (
    <section>
      <h2>تم استلام الطلب</h2>

      <p>رقم الطلب: #{order.orderNumber}</p>
      <p>الحالة: جديد</p>

      <strong>
        الإجمالي: {order.total.toLocaleString("ar-SD")} {currency}
      </strong>

      <button type="button" onClick={onDone}>
        العودة للقائمة
      </button>
    </section>
  );
}
