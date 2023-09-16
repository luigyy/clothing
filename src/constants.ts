import { z } from "zod";

//
//
//everytime a typescript type is changed, the corresponding zod type must be updated
export type CategoriesType =
  | "camisas"
  | "jeans"
  | "abrigos"
  | "pantalones"
  | "shorts"
  | "zapatos"
  | "vestidos"
  | "enaguas"
  | "blusa"
  | "accesorio";

export type GenreType = "male" | "female";

export type SizeType = "3XS" | "2XS" | "XS" | "S" | "M" | "L" | "2XL" | "3XL";
//
//
//zod types
export const ZodCategoriesType = z.union([
  z.literal("camisas"),
  z.literal("jeans"),
  z.literal("pantalones"),
  z.literal("shorts"),
  z.literal("zapatos"),
  z.literal("vestidos"),
  z.literal("enaguas"),
  z.literal("blusa"),
  z.literal("accesorio"),
]);

export const ZodGenreType = z.union([z.literal("male"), z.literal("female")]);

export const ZodSizesType = z.union([
  z.literal("3XS"),
  z.literal("2XS"),
  z.literal("XS"),
  z.literal("S"),
  z.literal("M"),
  z.literal("L"),
  z.literal("2XL"),
  z.literal("3XL"),
]);

export interface FiltersType {
  genre?: string;
  category?: string;
  size?: string;
}
