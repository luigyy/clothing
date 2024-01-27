//translate zod erros to spanish

import { NextPageWithLayout } from "next";
import SettingsLayout from "./layout";
import { BsTrash } from "react-icons/bs";
import { UserLocation } from "../cart/location-confirmation";

const truncate = (input: string, length: number) =>
  input.length > length ? `${input.substring(0, length)}...` : input;

export const LocationCard = ({
  id,
  location,
  deleteLocationFn,
  selectLocationFn,
  selectedLocationId,
  showDeleteButton,
}: {
  id: string;
  location: {
    name: string;
    province: string;
    municipality: string;
    district: string;
    exactLocation: string | null;
    locationLink: string | null;
  };
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
          <h1 className="text-sm font-bold">{location.name}</h1>
          <h1 className="text-xs font-semibold text-blue/70">
            {location.province}, {location.municipality}, {location.district}
          </h1>
        </div>

        <div className="flex flex-col gap-y-3">
          <h1 className="text-right text-xs font-medium text-blue/60">
            Ubicacion exacta:{" "}
          </h1>
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
            className=" mx-auto flex h-full w-16 items-center justify-center rounded bg-blue"
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
