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
import { useEffect, useRef, useState } from "react";
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

export const UserLocation = ({
  selectedLocationId,
  selectLocationFn,
  showDeleteButton,
}: {
  selectedLocationId?: string;
  selectLocationFn?: (id: string) => void;
  showDeleteButton?: boolean;
}) => {
  const { data, isLoading } = api.location.getUserLocations.useQuery();
  const { data: cart } = api.orders.getCurrentUserCart.useQuery();
  const deleteLocation = api.location.deleteLocation.useMutation();
  const createLocation = api.location.createLocation.useMutation();

  const utils = api.useContext();
  //
  const [createNewLocationIsOn, setCreateNewLocationIsOn] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  //
  const methods = useForm<LocationFormType>({
    resolver: zodResolver(LocationFormSchema),
  });

  const [location, setLocation] = useState({
    province: "",
    municipality: "",
    district: "",
  });

  const toggleForm = () => {
    setCreateNewLocationIsOn(!createNewLocationIsOn);
    //move focus to form
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  //handlers
  const onSubmit = (formValues: LocationFormType) => {
    //
    async function createLocationFn() {
      //get values province, municipality values
      const { province, municipality, district } = location;

      //create location
      createLocation.mutateAsync(
        {
          ...formValues,
          province,
          municipality,
          district,
        },
        {
          onSuccess: (response) => {
            utils.location.getUserLocations.setData(undefined, (oldData) => {
              if (!oldData) return;
              const oldLocation = oldData.userLocation;
              oldLocation.push({
                province,
                municipality,
                district,
                ...formValues,
                id: response.id,
                userId: response.userId,
              });
              return {
                ...oldData,
                userLocation: oldLocation,
              };
            });
          },
        },
      );
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

  //if already exists location, select it
  useEffect(() => {
    if (!cart?.locationId) return;
    selectLocationFn && selectLocationFn(cart.locationId);
  }, [isLoading]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="space-y-6">
          {selectLocationFn ? (
            <h1 className="py-4 text-center">Seleccione la ubicación</h1>
          ) : (
            <h1 className="py-2">Datos de ubicación</h1>
          )}
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
                  selectLocationFn={selectLocationFn}
                  selectedLocationId={selectedLocationId}
                  showDeleteButton={showDeleteButton}
                />
              ))}
            </div>
          </div>
          <div
            ref={ref}
            className={` transition-all duration-200 space-y-2${
              createNewLocationIsOn
                ? ""
                : "pointer-events-none  -z-10  h-0 -translate-y-[130vh] opacity-0  "
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
            <div className="flex gap-x-4">
              <button className="btn mt-2" type="submit">
                Crear ubicación
              </button>
              <button
                onClick={() => setCreateNewLocationIsOn(false)}
                className="btn mt-2 [&&]:border-green [&&]:bg-green"
              >
                Cerrar
              </button>
            </div>
          </div>

          {createNewLocationIsOn ? null : (
            <button onClick={() => toggleForm()} className="btn">
              Crear nueva ubicación
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export const LocationCard = ({
  id,
  location,
  index,
  deleteLocationFn,
  selectLocationFn,
  selectedLocationId,
  showDeleteButton,
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
  deleteLocationFn?: ({ id }: { id: string }) => void;
  selectLocationFn?: (id: string) => void;
  selectedLocationId?: string;
  showDeleteButton?: boolean;
}) => {
  return (
    <div className="flex gap-x-1">
      {selectLocationFn ? (
        <div className="flex items-center justify-center ">
          <input
            onChange={() => selectLocationFn(id)}
            className=" mx-auto flex aspect-[1] w-7 items-center justify-center rounded  accent-[#93a571]   "
            checked={selectedLocationId === id}
            type="radio"
          ></input>
        </div>
      ) : null}
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
      {deleteLocationFn && showDeleteButton ? (
        <div className=" ">
          <button
            onClick={() => deleteLocationFn({ id })}
            className=" mx-auto flex h-full w-16 items-center justify-center  rounded bg-blue"
          >
            <BsTrash className="click-effect flex h-2/3 w-2/3 cursor-pointer text-orange" />
          </button>
        </div>
      ) : null}
    </div>
  );
};

const Index: NextPageWithLayout = () => {
  return <UserLocation showDeleteButton={true} />;
};
Index.getLayout = (page) => <SettingsLayout>{page}</SettingsLayout>;

export default Index;
