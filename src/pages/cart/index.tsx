import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import CartGarmentCard from "~/components/CartGarmentCard";
import { Garment } from "@prisma/client";
import { NextPageWithLayout } from "next";
import CartLayout from "./layout";
import { ClipLoader } from "react-spinners";

const Index: NextPageWithLayout = () => {
  const deleteFromCart = api.orders.deleteGarmentFromCart.useMutation();
  const { data, isLoading } = api.orders.getCurrentUserCart.useQuery();

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

  if (isLoading) {
    return <ClipLoader color="#93a571" size={23} />;
  }

  if (!data?.garments.length) return <div>no orders!</div>;

  return (
    <div>
      <h1 className="py-4 text-center">Confirme su orden</h1>
      <div className="grid w-full grid-cols-4 ">
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
    </div>
  );
};

Index.getLayout = (page) => <CartLayout>{page}</CartLayout>;

export default Index;
