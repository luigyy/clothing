import { NextPageWithLayout } from "next";
import CartLayout from "./layout";
import { api } from "~/utils/api";

const DataSlot = ({
  placeholder,
  label,
}: {
  placeholder: string;
  label: string;
}) => {
  return (
    <div className="flex flex-col">
      <label className="pl-1 font-title text-sm font-bold tracking-tight">
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        disabled
        alt={placeholder}
        className="rounded-md bg-creme py-1 shadow-sm placeholder:px-3  placeholder:text-sm placeholder:text-blue/80"
      />
    </div>
  );
};

const Index: NextPageWithLayout = () => {
  const { data: userData } = api.users.getCurrentUser.useQuery();
  const { data: locationData } = api.orders.getCurrentUserCart.useQuery();
  const location = locationData?.location;

  return (
    <div className="px-7">
      <h1 className="py-4 text-center">Confirme sus datos</h1>
      <p className="py-6 text-sm font-semibold">Datos personales</p>

      {/*  */}
      <div className="grid grid-cols-3 gap-x-1 gap-y-2">
        <DataSlot
          placeholder={`${userData?.name}  ${userData?.lastName}` || ""}
          label="Nombre"
        />
        <DataSlot placeholder={userData?.email || ""} label="Correo" />
        <DataSlot placeholder={userData?.phoneNumber || ""} label="Número" />
      </div>

      <p className="mt-5 py-6 text-sm font-semibold">Datos de ubicación</p>

      {/*  */}
      <div className="grid grid-cols-3 gap-x-1 gap-y-2">
        <DataSlot
          placeholder={`${location?.name} ` || ""}
          label="Nombre de ubicación"
        />
        <DataSlot
          placeholder={
            `${location?.province}, ${location?.municipality}, ${location?.district},` ||
            ""
          }
          label="Lugar"
        />

        <DataSlot
          placeholder={`${location?.exactLocation} ` || ""}
          label="Dirección exacta"
        />
      </div>
    </div>
  );
};

Index.getLayout = (page) => <CartLayout>{page}</CartLayout>;

export default Index;
