export const CategoriesOptions = [
  "camisas",
  "jeans",
  "abrigos",
  "pantalones",
  "shorts",
  "zapatos",
  "vestidos",
  "enaguas",
  "blusa",
  "accesorio",
] as const;

export type CategoriesType = (typeof CategoriesOptions)[number];

export const GenreOptions = ["male", "female"] as const;
export type GenreType = (typeof GenreOptions)[number];

export const SizeOptions = [
  "3XS",
  "2XS",
  "XS",
  "S",
  "M",
  "L",
  "2XL",
  "3XL",
] as const;

export type SizeType = (typeof SizeOptions)[number];

export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
};

export interface FiltersType {
  genre?: string;
  category?: string;
  size?: string;
}

export const ORDER_STATUS = {
  CART: "cart",
  PAID: "paid",
  DELIVERED: "delivered",
};
