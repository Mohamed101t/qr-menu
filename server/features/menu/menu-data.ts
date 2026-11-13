import type { RestaurantMenu } from "./menu";

const menus: RestaurantMenu[] = [
  {
    restaurant: {
      id: "fresh-juice",
      name: "Fresh Juice",
      slug: "fresh-juice",
      businessType: "juice_shop",
      logoUrl: null,
      primaryColor: "#16a34a",
      currency: "SDG",
    },
    categories: [
      {
        id: "juices",
        name: "عصائر",
        sortOrder: 1,
      },
    ],
    products: [
      {
        id: "mango-juice",
        categoryId: "juices",
        name: "عصير مانجو",
        description: "عصير مانجو طازج",
        price: 3000,
        imageUrl: null,
        isAvailable: true,
        sortOrder: 1,
      },
      {
        id: "seasonal-juice",
        categoryId: "juices",
        name: "عصير موسمي",
        description: "غير متاح حالياً",
        price: 2500,
        imageUrl: null,
        isAvailable: false,
        sortOrder: 2,
      },
    ],
  },
];

export function findMenuByRestaurantSlug(
  restaurantSlug: string,
): RestaurantMenu | null {
  return (
    menus.find(
      (menu) =>
        menu.restaurant.slug === restaurantSlug,
    ) ?? null
  );
}
