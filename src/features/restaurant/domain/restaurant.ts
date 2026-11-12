export type BusinessType = "restaurant" | "cafe" | "juice_shop";

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  businessType: BusinessType;
  logoUrl: string | null;
  primaryColor: string;
  currency: string;
}
