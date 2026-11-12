import type { Category } from "../domain/category";
import type { Product } from "../domain/product";

export const categories: Category[] = [
  {
    id: "juices",
    name: "عصائر",
    sortOrder: 1,
  },
];

export const products: Product[] = [
  {
    id: "mango-juice",
    restaurantId: "fresh-juice",
    categoryId: "juices",
    name: "عصير مانجو",
    description: "عصير مانجو طازج",
    price: 3000,
    imageUrl: null,
    isAvailable: true,
    sortOrder: 1,
  },
];
