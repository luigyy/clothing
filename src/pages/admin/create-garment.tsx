import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import React from "react";
import { useForm } from "react-hook-form";
import InputComponent from "~/components/InputComponent";
import {
  SizeTypesSchema,
  GenreTypesSchema,
  CategoriesTypeSchema,
} from "~/types";

//types
export const GarmentSchema = z.object({
  brand: z.string(),
  current_price: z.string(),
  retail_price: z.string(),
  size: SizeTypesSchema,
  genre: GenreTypesSchema,
  category: CategoriesTypeSchema,
  email: z.string(),
});

export type GarmentSchemaType = z.infer<typeof GarmentSchema>;

const CreateGarment = ({}) => {
  //
  //useForm stuff
  const { register, formState } = useForm<GarmentSchemaType>({
    resolver: zodResolver(CategoriesTypeSchema),
  });

  const { errors } = formState;

  //handlers
  const onSubmit = (formValues: GarmentSchemaType) => {
    console.log(formValues);
  };
  return (
    <div>
      <InputComponent
        label="Marca"
        {...register("brand")}
        error={errors.brand}
      />
      <InputComponent
        label="Precio"
        {...register("current_price")}
        error={errors.current_price}
      />
      <InputComponent
        label="Precio en tienda"
        {...register("retail_price")}
        error={errors.retail_price}
      />
      <InputComponent label="Talla" {...register("size")} error={errors.size} />
      <InputComponent
        label="Género"
        {...register("genre")}
        error={errors.genre}
      />
      <InputComponent
        label="Email del vendedor"
        {...register("email")}
        error={errors.email}
      />
      <InputComponent
        label="Categoría"
        {...register("category")}
        error={errors.category}
      />
    </div>
  );
};

export default CreateGarment;
