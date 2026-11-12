import type { Restaurant } from "../domain/restaurant";

interface RestaurantHeaderProps {
  restaurant: Restaurant;
}

export function RestaurantHeader({
  restaurant,
}: RestaurantHeaderProps) {
  return (
    <header>
      {restaurant.logoUrl && (
        <img
          src={restaurant.logoUrl}
          alt={`شعار ${restaurant.name}`}
        />
      )}

      <h1>{restaurant.name}</h1>
    </header>
  );
}
