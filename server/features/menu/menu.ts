export interface MenuRestaurant {
  id: string;
  name: string;
  slug: string;
  businessType: "restaurant" | "cafe" | "juice_shop";
  logoUrl: string | null;
  primaryColor: string;
  currency: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  sortOrder: number;
}

export interface MenuProduct {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
  sortOrder: number;
}

export interface RestaurantMenu {
  restaurant: MenuRestaurant;
  categories: MenuCategory[];
  products: MenuProduct[];
}
