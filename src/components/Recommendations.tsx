import React from "react";
import { api } from "~/utils/api";
import GarmentCard from "./GarmentCard";

//TODO: CREATE NEW ROUTE TO HANDLE RECOMMENDATIONS (do not allow to reccomend the same item, handle situation where there isnt enough garments, 4 at least neeeded)

const Recommendations = () => {
  const { data } = api.garments.getRecommendations.useQuery();
  const currentPage = {
    recommendations: true,
  };

  const garments = data?.garments;
  return (
    <div>
      <h1 className="text-center text-3xl">Recomendado para ti </h1>
      <div className="flex justify-start  pt-5">
        {garments?.map((garment) => (
          <GarmentCard
            brand={garment.brand}
            current_price={garment.current_price}
            genre={garment.genre}
            id={garment.id}
            image_url={garment.pictures[0]!.url}
            original_price={garment.original_price}
            size={garment.size}
            key={garment.id}
            currentPage={currentPage}
            isFavorite={garment.isFavorite}
          />
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
