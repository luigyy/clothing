import { NextPageWithLayout } from "next";
import CartLayout from "./layout";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { api } from "~/utils/api";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { LocationCard } from "../settings/location";
import InputComponent from "~/components/InputComponent";
import { z } from "zod";
import i18next from "i18next";
import { zodI18nMap } from "zod-i18n-map";
import translation from "zod-i18n-map/locales/es/zod.json";
import { ContextProvider as CostaRicaLocationContextProvider } from "react-select-costarica-location";
import LocationForm from "~/components/LocationForm";

i18next.init({
  lng: "es",
  resources: {
    es: { zod: translation },
  },
});

z.setErrorMap(zodI18nMap);
//

const LocationConfirmation: NextPageWithLayout = () => {
  const router = useRouter();
  const { locationId } = router.query;
  const [selectedLocationId, setSelectedLocationId] = useState(locationId);

  useEffect(() => {
    setSelectedLocationId(locationId);
  }, [router.isReady]);

  const selectLocationHandler = (id: string) => {
    router.query.locationId = id;
    router.push(router);
    //
    setSelectedLocationId(id);
  };

  return (
    <div className="px-4">
      <UserLocation
        selectLocationFn={selectLocationHandler}
        selectedLocationId={
          Array.isArray(selectedLocationId)
            ? selectedLocationId[0]
            : selectedLocationId
        }
      />
    </div>
  );
};

const LocationFormSchema = z.object({
  name: z.string().min(1),
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

  const router = useRouter();
  const locationId = Array.isArray(router.query.locationId)
    ? router.query.locationId[0]
    : router.query.locationId;

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
                name: response.name,
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
    //clear form
    methods.reset();
    setCreateNewLocationIsOn(false);
  };

  const deleteLocationFn = ({ id }: { id: string }) => {
    const deleteUserLocation = async () => {
      await deleteLocation.mutateAsync(
        { id },
        {
          onSuccess: () => {
            utils.location.getUserLocations.setData(undefined, (oldData) => {
              if (!oldData) return;
              return {
                ...oldData,
                userLocation: oldData.userLocation.filter(
                  (data) => id !== data.id,
                ),
              };
            });
          },
        },
      );
    };
    toast.promise(deleteUserLocation, {
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

  useEffect(() => {
    if (locationId) {
      selectLocationFn && selectLocationFn(locationId);
    }
  }, [locationId]);

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
            <InputComponent
              label="Nombre"
              registerName="name"
              error={methods.formState.errors.name}
              type="text"
            />

            <CostaRicaLocationContextProvider>
              <LocationForm setLocationFn={setLocation} />
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

LocationConfirmation.getLayout = (page) => <CartLayout>{page}</CartLayout>;

export default LocationConfirmation;
