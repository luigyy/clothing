import { z } from "zod";
import { Garment } from "@prisma/client";
import { NextPage } from "next";
import { ComponentType, ReactElement, ReactNode } from "react";

export type Page<P = {}> = NextPage<P> & {
  // You can disable whichever you don't need
  getLayout?: (page: ReactElement) => ReactNode;
  layout?: ComponentType;
};

//
export const ProfileFormSchema = z.object({
  name: z.string().min(3),
  lastName: z.string(),
  phoneNumber: z.string().min(7, {
    message: "El número de celular debe contener al menos 8 caracteres",
  }),
  email: z.string().email(),
  locationLink: z.string(),
  exactLocation: z.string(),
});

export type ProfileFormType = z.infer<typeof ProfileFormSchema>;

export const SizeTypesSchema = z.enum([
  "3XS",
  "2XS",
  "XS",
  "S",
  "M",
  "L",
  "2XL",
  "3XL",
]);
export const GenreTypesSchema = z.enum(["male", "female"]);

export const CategoriesTypeSchema = z.enum([
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
]);
