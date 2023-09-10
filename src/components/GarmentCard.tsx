import React from "react";
import { FiHeart } from "react-icons/fi";
import { AiFillHeart } from "react-icons/ai";

interface GarmentCardProps {
  brand: string;
  size: string;
  genre: "Male" | "Female";
  current_price: number;
  original_price: number;
  image_url: string;
  isFavorite: boolean;
}

const GarmentCard: React.FC<GarmentCardProps> = ({
  brand,
  size,
  genre,
  current_price,
  original_price,
  image_url,
  isFavorite,
}) => {
  return (
    <div className="relative mx-auto aspect-[3/4] w-[250px] ">
      <div className="absolute right-3 top-3 inline-block ">
        {isFavorite ? (
          <FiHeart className="text-orange h-6 w-6" />
        ) : (
          <AiFillHeart className="text-orange h-6 w-6" />
        )}
      </div>
      <img src={image_url} alt="" />
      <div className=" absolute flex h-12 w-full items-center justify-between">
        <div className="flex flex-col justify-between">
          <h1 className="text-lg">{brand}</h1>
          <span className="text-sm">
            {size}/{genre === "Male" ? "Hombre" : "Mujer"}
          </span>
        </div>
        <div className="flex flex-col justify-between ">
          <span className="text-right  font-semibold">₡{current_price}</span>
          <span className="text-orange text-right text-sm line-through">
            ₡{original_price.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GarmentCard;
