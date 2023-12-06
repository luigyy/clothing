import React from "react";
import { FiHeart } from "react-icons/fi";
import { AiFillHeart } from "react-icons/ai";
import Link from "next/link";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { ClipLoader } from "react-spinners";
import Image from "next/image";

interface GarmentCardProps {
  brand: string;
  size: string;
  genre: string;
  original_price: number;
  image_url: string;
  current_price: number;
  isFavorite: boolean;
  id: string;
  currentPage: {
    garments?: boolean;
    favorites?: boolean;
    recommendations?: boolean;
    any?: boolean;
  };
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
  currentPage,
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
          //if we are in the favorites page, we will want to delete a garment from cache if we unlike it

          if (currentPage.any) return;

          if (currentPage.favorites) {
            utils.garments.getAll.setInfiniteData(
              { currentPage },
              (oldData) => {
                if (!oldData) return;

                return {
                  ...oldData,
                  pages: oldData.pages.map((page) => {
                    return {
                      ...page,
                      garments: page.garments.filter(
                        (garment) => garment.id != id,
                      ),
                    };
                  }),
                };
              },
            );
          } else if (currentPage.recommendations) {
            utils.garments.getRecommendations.setData(undefined, (oldData) => {
              if (!oldData) return;

              return {
                ...oldData,
                garments: oldData.garments.map((garment) => {
                  if (garment.id === id) {
                    return { ...garment, isFavorite: !garment.isFavorite };
                  }
                  return garment;
                }),
              };
            });
          }

          utils.garments.getAll.setInfiniteData({ currentPage }, (oldData) => {
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
          <AiFillHeart className="h-6 w-6 text-green transition-all duration-200 hover:scale-110" />
        ) : (
          <FiHeart className="h-6 w-6 text-green transition-all duration-200 hover:scale-110" />
        )}
      </button>
      <Link
        href={`/garments/${id}`}
        className="relative mx-auto aspect-[3/4] w-[210px]   "
      >
        <Image
          width={300}
          height={300}
          src={image_url}
          className="h-full w-full object-cover"
          alt=""
        />

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
