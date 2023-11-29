//TODO: create layout and move input componenets to components folder
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { usePathname } from "next/navigation";
import { api } from "~/utils/api";
import { FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputComponent from "~/components/InputComponent";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import your language translation files
import i18next from "i18next";
import { zodI18nMap } from "zod-i18n-map";
import translation from "zod-i18n-map/locales/es/zod.json";
import { NextPageWithLayout } from "next";
import SettingsLayout from "./layout";

// lng and resources key depend on your locale.
i18next.init({
  lng: "es",
  resources: {
    es: { zod: translation },
  },
});

z.setErrorMap(zodI18nMap);

const ProfileFormSchema = z.object({
  name: z.string().min(3),
  lastName: z.string(),
  phoneNumber: z.string().min(7, {
    message: "El número de celular debe contener al menos 8 caracteres",
  }),
  email: z.string().email(),
  locationLink: z.string(),
  exactLocation: z.string(),
});

type ProfileFormType = z.infer<typeof ProfileFormSchema>;

const ProfileSettings = () => {
  const { data } = api.users.getCurrentUser.useQuery();
  const updateUser = api.users.updateUser.useMutation();

  //useForm stuff
  // const { register, handleSubmit, formState, reset } = useForm({
  //   resolver: zodResolver(ProfileFormSchema),
  // });

  // const { errors, isDirty, dirtyFields } = formState;
  const methods = useForm<ProfileFormType>({
    resolver: zodResolver(ProfileFormSchema),
  });

  //handlers
  const onSubmit = (formValues: ProfileFormType) => {
    //
    function updateProfile() {
      const result = updateUser.mutateAsync({
        ...formValues,
        id: data?.id || "",
      });
      return result;
    }

    toast.promise(updateProfile, {
      pending: "Actualizando perfil",
      success: "Perfil actualizado exitosamente",
      error: "Error al actualizar el perfil",
    });
  };

  //set default values when user information is retrieved
  useEffect(() => {
    const defaultValues = {
      name: data?.name ?? "",
      lastName: data?.lastName ?? "",
      email: data?.email ?? "",
      exactLocation: data?.exactLocation ?? "",
      locationLink: data?.locationLink ?? "",
      phoneNumber: data?.phoneNumber ?? "",
    };
    methods.reset({ ...defaultValues });
  }, [data]);

  //tsx
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        <InputComponent
          label="Nombre"
          registerName="name"
          error={methods.formState.errors.name}
          type="text"
        />
        <InputComponent
          label="Apellido"
          registerName="lastName"
          error={methods.formState.errors.lastName}
          type="text"
        />
        <InputComponent
          label="Teléfono"
          registerName="phoneNumber"
          error={methods.formState.errors.phoneNumber}
          inputInfo="
 * Por favor NO INCLUIR el código de país
        "
          type="text"
        />
        <InputComponent
          label="Email"
          registerName="email"
          error={methods.formState.errors.email}
          type="text"
        />

        <InputComponent
          label="Link de Google Maps"
          registerName="locationLink"
          error={methods.formState.errors.locationLink}
          type="text"
        />
        <InputComponent
          label="Dirección exacta"
          registerName="exactLocation"
          error={methods.formState.errors.exactLocation}
          type="text"
        />

        {methods.formState.isDirty ? (
          <button
            type="submit"
            className="clickable-effect rounded bg-blue px-5 py-2 text-sm text-creme"
          >
            Actualizar perfil
          </button>
        ) : null}
      </form>
    </FormProvider>
  );
};
const Index: NextPageWithLayout = () => {
  return <ProfileSettings />;
};

function SelectComponent({
  label,
  updatingProfile,
  options,
  handlerFn,
}: {
  label: string;
  updatingProfile: boolean;
  options: string[];
  handlerFn: (label: string) => void;
}) {
  return (
    <div className="flex flex-col">
      <label htmlFor="countries" className=" text-sm text-orange">
        {label}
      </label>
      <select
        id="countries"
        className={`rounded ${
          updatingProfile ? "border border-blue " : "border bg-zinc-50"
        }  border-opacity-25 bg-creme px-2 py-1 text-sm outline-none placeholder:text-sm`}
        onChange={(e) => handlerFn(e.target.value)}
      >
        {options.map((option) => (
          <option value={option} disabled={options.length === 0}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

Index.getLayout = (page) => <SettingsLayout>{page}</SettingsLayout>;

export default Index;
