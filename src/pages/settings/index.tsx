//TODO: create layout and move input componenets to components folder
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "~/utils/api";
import { FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputComponent from "~/components/InputComponent";
import { NextPageWithLayout } from "next";
import SettingsLayout from "./layout";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import your language translation files
import i18next from "i18next";
import { zodI18nMap } from "zod-i18n-map";
import translation from "zod-i18n-map/locales/es/zod.json";

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
});

type ProfileFormType = z.infer<typeof ProfileFormSchema>;

const ProfileSettings = () => {
  const { data } = api.users.getCurrentUser.useQuery();
  const updateUser = api.users.updateUser.useMutation();
  const [location, setLocation] = useState({
    province: "",
    municipality: "",
    district: "",
  });

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
      phoneNumber: data?.phoneNumber ?? "",
    };
    methods.reset({ ...defaultValues });
  }, [data]);

  //tsx
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        <h1 className="py-1">Datos personales</h1>
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

        <button className="btn" type="submit">
          Actualizar perfil
        </button>
      </form>

      {/* // */}
      {/* location section  */}
    </FormProvider>
  );
};
const Index: NextPageWithLayout = () => {
  return <ProfileSettings />;
};

Index.getLayout = (page) => <SettingsLayout>{page}</SettingsLayout>;

export default Index;
