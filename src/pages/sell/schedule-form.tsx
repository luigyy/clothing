import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import InputComponent from "~/components/InputComponent";
import LocationForm from "~/components/LocationForm";
import { api } from "~/utils/api";
import {
  ContextProvider as CostaRicaLocationContextProvider,
  Location,
} from "react-select-costarica-location";

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

export default function ScheduleForm() {
  const [location, setLocation] = useState({
    province: "",
    municipality: "",
    district: "",
  });

  const { provincia, canton, distrito } = Location();
  const { data } = api.users.getCurrentUser.useQuery();

  const methods = useForm<ProfileFormType>({
    resolver: zodResolver(ProfileFormSchema),
  });

  //handlers
  const onSubmit = (formValues: ProfileFormType) => {
    console.log("LOCATION", location);
    console.log("submit");
    // //
    // function createClothingPickupRequest() {

    // }

    // toast.promise(createClothingPickupRequest, {
    //   pending: "Actualizando perfil",
    //   success: "Perfil actualizado exitosamente",
    //   error: "Error al actualizar el perfil",
    // });
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
    <>
      <h1 className="py-5 text-center text-2xl tracking-tight text-orange">
        Agendar recolecta
      </h1>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="px-4">
          <div>
            <h1 className="pb-4">Datos personales</h1>
            <div className="grid grid-cols-4 gap-x-5 gap-y-2">
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
            </div>
          </div>
          <div className="py-5">
            <h1 className="py-4">Datos de ubicación</h1>
            <div className="grid grid-cols-4 gap-x-5 gap-y-2">
              <CostaRicaLocationContextProvider>
                <LocationForm setLocationFn={setLocation} />
              </CostaRicaLocationContextProvider>
            </div>
          </div>
          <button className="btn my-5" type="submit">
            Agendar recolección
          </button>
        </form>
      </FormProvider>
    </>
  );
}
