// Don't forget the CSS: core and the UI components + plugins you are using.
import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";

// Don't forget the CSS: core and the UI components + plugins you are using.
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";

import { zodResolver } from "@hookform/resolvers/zod";
import SelectComponent from "~/components/SelectComponent";
import { z } from "zod";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import InputComponent from "~/components/InputComponent";
import {
  SizeTypesSchema,
  GenreTypesSchema,
  CategoriesTypeSchema,
} from "~/types";
import { CategoriesOptions, GenreOptions, SizeOptions } from "~/constants";

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

//
const uppy = new Uppy();

const CreateGarment = ({}) => {
  //useForm stuff
  // const { register, handleSubmit, formState, reset } = useForm({
  //   resolver: zodResolver(ProfileFormSchema),
  // });

  // const { errors, isDirty, dirtyFields } = formState;
  const methods = useForm<GarmentSchemaType>({
    resolver: zodResolver(GarmentSchema),
  });

  //handlers
  const onSubmit = (formValues: GarmentSchemaType) => {
    console.log(formValues);
  };
  useEffect(() => {
    const defaultValues: GarmentSchemaType = {
      brand: "",
      category: "abrigos",
      current_price: "",
      email: "",
      genre: "female",
      retail_price: "",
      size: "2XL",
    };
    methods.reset({ ...defaultValues });
  }, []);

  //tsx
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="space-y-3  px-10"
      >
        <div className="mt-5 grid grid-cols-3 gap-x-3 gap-y-1 ">
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
          <SelectComponent
            label="Talla"
            registerName="size"
            options={SizeOptions}
            // error={methods.formState.errors.size}
          />
          <SelectComponent
            label="Género"
            registerName="genre"
            options={GenreOptions}
          />

          <SelectComponent
            label="Categoría"
            registerName="category"
            options={CategoriesOptions}
          />
          <InputComponent
            label="Email del vendedor"
            registerName="email"
            error={methods.formState.errors.email}
          />
        </div>

        {/* uppy */}
        <Dashboard
          width={500}
          height={250}
          uppy={uppy}
          className="mx-auto flex justify-center "
        />
        {/* uppy */}

        <button
          type="submit"
          className="clickable-effect rounded bg-blue px-5 py-2 text-sm text-creme"
        >
          Crear prenda
        </button>
      </form>
    </FormProvider>
  );
};

export default CreateGarment;
