export interface CreateOrderRequestItem {
  productId: string;
  quantity: number;
  observedUnitPrice: number;
}

export interface CreateOrderRequest {
  restaurantSlug: string;
  items: CreateOrderRequestItem[];
}

export interface OrderItemSnapshot {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface CreatedOrder {
  id: string;
  orderNumber: string;
  restaurantId: string;
  status: "NEW";
  items: OrderItemSnapshot[];
  total: number;
  createdAt: string;
}
