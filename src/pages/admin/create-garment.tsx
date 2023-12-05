import FileUpload from "~/components/FileUpload";
import { DEV_CLOUDINARY_GARMENT_IMAGES_PRESET } from "~/constants";
import i18next from "i18next";
import { zodI18nMap } from "zod-i18n-map";
// Import via ES Modules
import withAdminAuth from "./CheckAdminAuth";

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
import { useSession } from "next-auth/react";
import translation from "zod-i18n-map/locales/es/zod.json";
import { api } from "~/utils/api";
import { toast } from "react-toastify";
import { NextPageWithLayout } from "next";
import Layout from "./layout";

// lng and resources key depend on your locale.
i18next.init({
  lng: "es",
  resources: {
    es: { zod: translation },
  },
});
z.setErrorMap(zodI18nMap);

//types
export const GarmentSchema = z.object({
  brand: z.string(),
  current_price: z.number(),
  retail_price: z.number(),
  size: SizeTypesSchema,
  genre: GenreTypesSchema,
  category: CategoriesTypeSchema,
  email: z.string(),
});

export type GarmentSchemaType = z.infer<typeof GarmentSchema>;

const CreateGarment: NextPageWithLayout = ({}) => {
  //
  const session = useSession();
  const email = session?.data?.user.email;

  const createGarment = api.garments.createGarment.useMutation();

  const [imagesUrls, setImagesUrls] = useState<string[]>([]);

  const methods = useForm<GarmentSchemaType>({
    resolver: zodResolver(GarmentSchema),
  });

  //handlers
  const onSubmit = (formValues: GarmentSchemaType) => {
    //
    function createGarmentWithData() {
      const result = createGarment.mutateAsync({
        ...formValues,
        pictures: imagesUrls,
      });
      return result;
    }

    toast.promise(createGarmentWithData, {
      pending: "Creando prenda",
      success: "Prenda creada exitosamente",
      error: "Error cuando se creaba la prenda",
    });
  };
  useEffect(() => {
    const defaultValues: GarmentSchemaType = {
      brand: "",
      category: "abrigos",
      current_price: 0,
      email: "",
      genre: "female",
      retail_price: 0,
      size: "2XL",
    };
    methods.reset({ ...defaultValues });
  }, []);

  //tsx
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="space-y-3  px-5 py-10"
      >
        <div className="mt-5 grid grid-cols-3 gap-x-3 gap-y-1  ">
          <InputComponent
            label="Marca"
            registerName="brand"
            error={methods.formState.errors.brand}
            type="text"
          />
          <InputComponent
            label="Precio"
            registerName="current_price"
            error={methods.formState.errors.current_price}
            type="number"
          />
          <InputComponent
            label="Precio en tienda"
            registerName="retail_price"
            error={methods.formState.errors.retail_price}
            type="number"
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
            type="text"
          />
        </div>

        {/* uppy */}
        {imagesUrls.length === 0 ? (
          <p className="text-center text-sm text-red-500">
            Añadir las imagenes correspondientes
          </p>
        ) : null}
        <FileUpload
          preset={DEV_CLOUDINARY_GARMENT_IMAGES_PRESET}
          userEmail={email ?? ""}
          imagesUrls={imagesUrls}
          setImagesFunction={setImagesUrls}
          maxNumberOfFilesAllowed={40}
          minNumberOfFilesAllowed={1}
        />

        <button
          type="submit"
          disabled={imagesUrls.length === 0}
          className="clickable-effect rounded bg-blue px-5 py-2 text-sm text-creme"
        >
          Crear prenda
        </button>
      </form>
    </FormProvider>
  );
};

CreateGarment.getLayout = (page) => <Layout>{page}</Layout>;

export default withAdminAuth(CreateGarment);
