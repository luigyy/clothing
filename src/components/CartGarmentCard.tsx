import React from "react";
import Link from "next/link";
import { ClipLoader } from "react-spinners";
import { BsTrash } from "react-icons/bs";

interface GarmentCardProps {
  brand: string;
  size: string;
  genre: string;
  original_price: number;
  image_url: string;
  current_price: number;
  isFavorite: boolean;
  id: string;
  deletingId: string;
  handleDeleteFromCart: (id: string) => void;
}

const GarmentCard: React.FC<GarmentCardProps> = ({
  id,
  brand,
  size,
  genre,
  original_price,
  current_price,
  image_url,
  deletingId,
  handleDeleteFromCart,
}) => {
  //validate like the video
  //mutation

  return (
    <div className="relative mx-auto aspect-[3/4] w-[180px]">
      <button
        onClick={() => handleDeleteFromCart(id)}
        className="absolute right-3 top-3 z-10 inline-block "
        disabled={deletingId === id}
      >
        {deletingId === id ? (
          <ClipLoader color="#d8690e" size={23} />
        ) : (
          <BsTrash className="h-6 w-6 text-orange" />
        )}
      </button>
      <Link
        href={`/garments/${id}`}
        className="relative mx-auto aspect-[3/4] w-[210px]   "
      >
        <img src={image_url} className="h-full w-full object-cover" alt="" />

        <div className="absolute bottom-0 flex h-12 w-full translate-y-full items-center justify-between px-1">
          <div className="flex flex-col justify-between">
            <h1 className="text-lg">{brand}</h1>
            <span className="text-sm">
              {size}/{genre === "male" ? "Hombre" : "Mujer"}
            </span>
          </div>
          <div className="flex flex-col justify-between ">
            <span className="text-right text-sm font-semibold">
              ₡{current_price.toLocaleString()}
            </span>
            <span className="text-right text-sm text-orange line-through">
              {current_price === original_price
                ? null
                : `₡${original_price.toLocaleString()}`}
              {}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default GarmentCard;
