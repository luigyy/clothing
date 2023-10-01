import React from "react";
import { api } from "~/utils/api";
import CartGarmentCard from "~/components/CartGarmentCard";

const Index = ({}) => {
  const { data } = api.orders.getCurrentUserCart.useQuery();
  if (!data) return <div>no orders!</div>;

  return (
    <div className="flex px-20">
      <div className="border-blue-500 flex w-[65%] flex-wrap border-2 pb-12 pt-2">
        {data.garments.map((garment) => (
          <CartGarmentCard
            brand={garment.brand}
            current_price={garment.current_price}
            genre={garment.genre}
            id={garment.id}
            image_url={garment.pictures[0]?.url || ""}
            isFavorite={false}
            original_price={garment.original_price}
            showFavoriteButton={false}
            size={garment.size}
          />
        ))}
      </div>
      <div className="w-[35%] border-2 border-orange"></div>
    </div>
  );
};

export default Index;
