import InputComponent from "~/components/InputComponent";
import LocationForm from "~/components/LocationForm";
import { ContextProvider as CostaRicaLocationContextProvider } from "react-select-costarica-location";
import { z } from "zod";

//translate zod erros to spanish
import i18next from "i18next";
import { zodI18nMap } from "zod-i18n-map";
import translation from "zod-i18n-map/locales/es/zod.json";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";
import { NextPageWithLayout } from "next";
import SettingsLayout from "./layout";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BsTrash } from "react-icons/bs";
import { ClipLoader } from "react-spinners";

i18next.init({
  lng: "es",
  resources: {
    es: { zod: translation },
  },
});

z.setErrorMap(zodI18nMap);
//

//test: to delete
const DEFAULT_LOCATION = {
  province: "Cartago",
  municipality: "Turrialba",
  district: "Tuis",
};

const truncate = (input: string, length: number) =>
  input.length > length ? `${input.substring(0, length)}...` : input;

const LocationFormSchema = z.object({
  exactLocation: z.string().min(1),
  locationLink: z.string().min(1),
});

type LocationFormType = z.infer<typeof LocationFormSchema>;

const UserLocation: NextPageWithLayout = () => {
  const { data, isLoading } = api.users.getCurrentUser.useQuery();
  const deleteLocation = api.location.deleteLocation.useMutation();
  const createLocation = api.location.createLocation.useMutation();
  //
  const [createNewLocationIsOn, setCreateNewLocationIsOn] = useState(false);
  //
  const methods = useForm<LocationFormType>({
    resolver: zodResolver(LocationFormSchema),
  });

  const [location, setLocation] = useState({
    province: "",
    municipality: "",
    district: "",
  });

  //handlers
  const onSubmit = (formValues: LocationFormType) => {
    //
    async function createLocationFn() {
      //get values province, municipality values
      const { province, municipality, district } = location;

      //create location
      createLocation.mutateAsync({
        ...formValues,
        province,
        municipality,
        district,
      });
      console.log(formValues);
    }

    toast.promise(createLocationFn, {
      pending: "Creando ubicacion",
      success: "Ubicación creada",
      error: "Error al crear la ubicación",
    });
  };

  const deleteLocationFn = ({ id }: { id: string }) => {
    toast.promise(deleteLocation.mutateAsync({ id }), {
      pending: "Borrando ubicación",
      success: "Ubicación borrada",
      error: "Error al borrar la ubicación",
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <h1 className="py-2">Datos de ubicación</h1>
          <div className=" ">
            <h1 className="mb-2  text-sm font-bold">Ubicaciones guardadas</h1>
            {isLoading ? (
              <div className="flex justify-center">
                <ClipLoader color="#d8690e" size={40} className="" />
              </div>
            ) : null}
            <div className="flex flex-col gap-y-2">
              {data?.userLocation.map((location, index) => (
                <LocationCard
                  id={location.id}
                  key={index}
                  location={location}
                  index={index}
                  deleteLocationFn={deleteLocationFn}
                />
              ))}
            </div>
          </div>
          <div
            className={` transition-all duration-200 space-y-2${
              createNewLocationIsOn
                ? ""
                : "pointer-events-none -z-10 h-0 -translate-y-full opacity-0"
            }`}
          >
            <CostaRicaLocationContextProvider>
              <LocationForm
                defaultLocation={DEFAULT_LOCATION}
                setLocationFn={setLocation}
              />
            </CostaRicaLocationContextProvider>
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
            <button className="btn mt-2" type="submit">
              Crear ubicación
            </button>
          </div>

          {createNewLocationIsOn ? null : (
            <button
              onClick={() => setCreateNewLocationIsOn(!createNewLocationIsOn)}
              className="btn"
            >
              Crear nueva ubicación
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

const LocationCard = ({
  id,
  location,
  index,
  deleteLocationFn,
}: {
  id: string;
  location: {
    province: string;
    municipality: string;
    district: string;
    exactLocation: string | null;
    locationLink: string | null;
  };
  index: number;
  deleteLocationFn: ({ id }: { id: string }) => void;
}) => {
  return (
    <div className="flex gap-x-1">
      <div className=" flex flex-grow justify-between rounded border border-orange/30 p-1 pl-2">
        <div className="flex flex-col gap-y-3">
          <h1 className="text-xs font-semibold">Ubicacion #{index + 1}</h1>
          <p className="text-xs font-semibold">
            {location.province}, {location.municipality}, {location.district}
          </p>
        </div>

        <div className="flex flex-col gap-y-3">
          <h1 className="text-right text-xs">Ubicacion exacta: </h1>
          <h1 className="text-xs font-medium">
            {" "}
            {location.exactLocation ? truncate(location.exactLocation, 50) : ""}
          </h1>
        </div>
      </div>
      <div className=" ">
        <button
          onClick={() => deleteLocationFn({ id })}
          className=" mx-auto flex h-full w-16 items-center justify-center  rounded bg-blue"
        >
          <BsTrash className="click-effect flex h-2/3 w-2/3 cursor-pointer text-orange" />
        </button>
      </div>
    </div>
  );
};
UserLocation.getLayout = (page) => <SettingsLayout>{page}</SettingsLayout>;

export default UserLocation;
