import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import CartGarmentCard from "~/components/CartGarmentCard";
import { ItemRow } from "~/components/Navbar";
import { Garment } from "@prisma/client";

const Index = ({}) => {
  const deleteFromCart = api.orders.deleteGarmentFromCart.useMutation();
  const { data } = api.orders.getCurrentUserCart.useQuery();
  const [deletingId, setDeletingId] = useState("");
  const utils = api.useContext();

  //handler for delete button
  function handleDeleteFromCart(id: string) {
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
  const [cartTotal, setCartTotal] = useState(calculateTotal(data?.garments));

  function calculateTotal(garments: Garment[] | null | undefined) {
    if (!garments) return 0;

    let total = 0;
    garments.forEach((garment) => {
      total += garment.current_price;
    });
    return total;
  }

  useEffect(() => {
    setCartTotal(calculateTotal(data?.garments));
  }, [data]);

  if (!data?.garments.length) return <div>no orders!</div>;

  return (
    <div className="flex px-4 pb-10">
      <div className="grid w-[65%] grid-cols-4 flex-wrap gap-y-14 pb-14 pt-2">
        {data.garments.map((garment) => (
          <CartGarmentCard
            key={garment.id}
            brand={garment.brand}
            current_price={garment.current_price}
            genre={garment.genre}
            id={garment.id}
            image_url={garment.pictures[0]?.url ?? ""}
            isFavorite={false}
            original_price={garment.original_price}
            handleDeleteFromCart={handleDeleteFromCart}
            size={garment.size}
            deletingId={deletingId}
          />
        ))}
      </div>
      <div className="w-[35%]  ">
        <div className="sticky top-3  mx-auto mt-3 min-h-[200px] w-[85%] rounded-lg  ">
          {data.garments.map((garment) => (
            <ItemRow
              key={garment.id}
              brand={garment.brand}
              current_price={garment.current_price}
              garmentId={garment.id}
              genre={garment.genre}
              size={garment.size}
            />
          ))}

          <div className="mt-3  flex justify-between  border-t border-orange border-opacity-25 px-3 pt-3">
            <h1>Total</h1>
            <p className="text-sm font-semibold">{`₡${cartTotal.toLocaleString()}`}</p>
          </div>
          <button className="btn mx-1 my-4 w-full">Ir a pagar</button>
        </div>
      </div>
    </div>
  );
};

export default Index;
