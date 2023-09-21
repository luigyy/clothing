import React from "react";
import { FiHeart } from "react-icons/fi";
import { AiFillHeart } from "react-icons/ai";
import Link from "next/link";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { ClipLoader } from "react-spinners";

interface GarmentCardProps {
  brand: string;
  size: string;
  genre: string;
  original_price: number;
  image_url: string;
  current_price: number;
  isFavorite: boolean;
  id: string;
}

const GarmentCard: React.FC<GarmentCardProps> = ({
  id,
  brand,
  size,
  genre,
  original_price,
  current_price,
  image_url,
  isFavorite,
}) => {
  //validate like the video
  //mutation
  const toggleLike = api.garments.toggleLike.useMutation();
  const utils = api.useContext();
  const { data: sessionData } = useSession();

  //handler for liking button
  async function handleLike() {
    if (!id) return;
    if (!sessionData?.user) return;
    // //perform action
    await toggleLike.mutateAsync(
      { garmentId: id },
      //refresh cache
      {
        onSuccess: () => {
          // utils.garments.getAll.invalidate();
          utils.garments.getAll.setInfiniteData({}, (oldData) => {
            if (!oldData) return;

            //
            return {
              ...oldData,
              pages: oldData.pages.map((page) => {
                return {
                  ...page,
                  garments: page.garments.map((currentGarment) => {
                    if (currentGarment.id === id) {
                      return {
                        ...currentGarment,
                        isFavorite: !currentGarment.isFavorite,
                      };
                    }
                    return currentGarment;
                  }),
                };
              }),
            };
          });
        },
      },
    );
  }

  return (
    <div className="relative mx-auto aspect-[3/4] w-[210px]">
      <button
        onClick={handleLike}
        className="absolute right-3 top-3 z-10 inline-block "
        disabled={toggleLike.isLoading}
      >
        {toggleLike.isLoading ? (
          <ClipLoader color="#93a571" size={23} />
        ) : isFavorite ? (
          <AiFillHeart className="h-6 w-6 text-green" />
        ) : (
          <FiHeart className="h-6 w-6 text-green" />
        )}
      </button>
      <Link
        href={`/prendas/${id}`}
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
