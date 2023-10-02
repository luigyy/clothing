import React, { useState } from "react";
import { api } from "~/utils/api";
import CartGarmentCard from "~/components/CartGarmentCard";

const Index = ({}) => {
  const deleteFromCart = api.orders.deleteGarmentFromCart.useMutation();
  const { data } = api.orders.getCurrentUserCart.useQuery();
  const [deletingId, setDeletingId] = useState("");
  const utils = api.useContext();

  //handler for delete button
  async function handleDeleteFromCart(id: string) {
    setDeletingId(id);
    deleteFromCart.mutate(
      { garmentId: id },
      {
        onSuccess: () => {
          utils.orders.getCurrentUserCart.setData(undefined, (oldData) => {
            if (!oldData) return;

            return {
              ...oldData,
              garments: oldData.garments.filter((garment) => garment.id != id),
            };
          });
          setDeletingId("");
        },
      },
    );
  }

  if (!data?.garments.length) return <div>no orders!</div>;

  return (
    <div className="flex px-20">
      <div className="border-blue-500 flex  w-[65%] flex-wrap gap-x-4  gap-y-14 border-2 pb-14 pt-2">
        {data.garments.map((garment) => (
          <CartGarmentCard
            brand={garment.brand}
            current_price={garment.current_price}
            genre={garment.genre}
            id={garment.id}
            image_url={garment.pictures[0]?.url || ""}
            isFavorite={false}
            original_price={garment.original_price}
            handleDeleteFromCart={handleDeleteFromCart}
            size={garment.size}
            deletingId={deletingId}
          />
        ))}
      </div>
      <div className="w-[35%] border-2 border-orange">
        <div className="sticky top-3 mx-auto mt-3 min-h-[200px] w-[85%] rounded-lg border-2"></div>
      </div>
    </div>
  );
};

export default Index;
