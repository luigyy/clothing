import React from "react";
import GarmentCard from "~/components/GarmentCard";
import { api } from "~/utils/api";

interface indexProps {}

const index: React.FC<indexProps> = ({}) => {
  const { data, isLoading } = api.garments.getAll.useQuery();
  if (isLoading) {
    return (
      <div className="flex ">
        <div
          className="b sticky left-0 top-0 h-[calc(100vh-92px)]  w-1/4 border-2
      border-blue"
        ></div>
        <div className="grid w-3/4 gap-y-24 border-2  border-red-500 px-1 pt-2 ">
          <h1 className="text-blue">Loading...</h1>
        </div>
      </div>
    );
  }
  return (
    <div className="flex ">
      <div
        className="b sticky left-0 top-0 h-[calc(100vh-92px)]  w-1/4 border-2
      border-blue"
      ></div>
      <div className="grid w-3/4 grid-cols-2 place-content-around gap-y-24 px-1 pt-2 sm:grid-cols-3 md:grid-cols-4">
        {data?.map((garment) => (
          <GarmentCard
            id={garment.id}
            key={garment.id}
            brand={garment.brand}
            original_price={garment.current_price}
            genre={garment.genre}
            image_url={garment.pictures[0]?.url!}
            size={garment.size}
            current_price={garment.current_price}
          />
        ))}
      </div>
    </div>
  );
};

export default index;
