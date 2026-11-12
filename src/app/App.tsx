import { useState } from "react";
import { restaurant } from "../features/restaurant/data/restaurant";
import { RestaurantHeader } from "../features/restaurant/presentation/RestaurantHeader";
import { categories, products } from "../features/menu/data/menu";
import { MenuList } from "../features/menu/presentation/MenuList";
import type { CartItem } from "../features/cart/domain/cart-item";
import {
  addProductToCart,
  increaseCartItem,
  decreaseCartItem,
  removeCartItem,
} from "../features/cart/domain/cart";
import { CartSummary } from "../features/cart/presentation/CartSummary";
import { CartPanel } from "../features/cart/presentation/CartPanel";
import type { Order } from "../features/orders/domain/order";
import { createOrder } from "../features/orders/domain/create-order";
import { OrderSuccess } from "../features/orders/presentation/OrderSuccess";

export function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  function handleConfirmOrder() {
    const newOrder = createOrder({
      restaurantId: restaurant.id,
      cart,
    });

    setOrder(newOrder);
    setCart([]);
    setIsCartOpen(false);
  }

  if (order) {
    return (
      <OrderSuccess
        order={order}
        currency={restaurant.currency}
        onDone={() => setOrder(null)}
      />
    );
  }

  return (
    <main>
      <RestaurantHeader restaurant={restaurant} />

      <MenuList
        categories={categories}
        products={products}
        onAddProduct={(product) =>
          setCart((currentCart) =>
            addProductToCart(currentCart, product),
          )
        }
      />

      <CartSummary
        cart={cart}
        currency={restaurant.currency}
        onOpen={() => setIsCartOpen(true)}
      />

      {isCartOpen && (
        <CartPanel
          cart={cart}
          currency={restaurant.currency}
          onIncrease={(productId) =>
            setCart((currentCart) =>
              increaseCartItem(currentCart, productId),
            )
          }
          onDecrease={(productId) =>
            setCart((currentCart) =>
              decreaseCartItem(currentCart, productId),
            )
          }
          onRemove={(productId) =>
            setCart((currentCart) =>
              removeCartItem(currentCart, productId),
            )
          }
          onConfirm={handleConfirmOrder}
          onClose={() => setIsCartOpen(false)}
        />
      )}
    </main>
  );
}
