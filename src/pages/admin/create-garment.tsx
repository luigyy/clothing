import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
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
  const methods = useForm<GarmentSchemaType>({
    resolver: zodResolver(CategoriesTypeSchema),
  });

  //handlers
  const onSubmit = (formValues: GarmentSchemaType) => {
    console.log(formValues);
  };
  return (
    <FormProvider {...methods}>
      <form className="" onSubmit={methods.handleSubmit(onSubmit)}>
        <div className=" grid grid-cols-3  ">
          <InputComponent
            label="Marca"
            registerName="brand"
            error={methods.formState.errors.brand}
          />
          <InputComponent
            label="Precio"
            registerName="current_price"
            error={methods.formState.errors.current_price}
          />
          <InputComponent
            label="Precio en tienda"
            registerName="retail_price"
            error={methods.formState.errors.retail_price}
          />
          <InputComponent
            label="Talla"
            registerName="size"
            error={methods.formState.errors.size}
          />
          <InputComponent
            label="Género"
            registerName="genre"
            error={methods.formState.errors.genre}
          />
          <InputComponent
            label="Email del vendedor"
            registerName="email"
            error={methods.formState.errors.email}
          />
          <InputComponent
            label="Categoría"
            registerName="category"
            error={methods.formState.errors.category}
          />
        </div>
        <button
          type="submit"
          className="mt-5 rounded bg-blue px-3 py-2 text-sm text-creme "
        >
          Crear prenda
        </button>
      </form>
    </FormProvider>
  );
};

export default CreateGarment;
