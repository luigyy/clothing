import { Prisma } from "@prisma/client";
type Garment = Prisma.GarmentGetPayload<{
  include: {
    pictures: true;
    likes: true;
  };
}>;
import GarmentCard from "./GarmentCard";
import InfiniteScroll from "react-infinite-scroll-component";

type ExtendedGarment = Garment & { isFavorite: boolean };

type InfiniteTweetListProps = {
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean | undefined;
  fetchNewGarments: () => Promise<unknown>;
  garments?: ExtendedGarment[];
};

export default function InfiniteGarmentSearch({
  garments,
  isError,
  isLoading,
  fetchNewGarments,
  hasMore = false,
}: InfiniteTweetListProps) {
  if (isLoading) return <div>loading...</div>;
  if (isError) return <h1>Error...</h1>;
  console.log(garments);

  if (garments == null || garments.length === 0) {
    return <h2 className="">No garments</h2>;
  }
  return (
    <InfiniteScroll
      dataLength={garments.length}
      hasMore={hasMore}
      next={() => fetchNewGarments()}
      loader={"Loading..."}
    >
      <div className=" grid h-screen w-full  grid-cols-2 gap-y-24 border  border-orange px-1 pt-2 sm:grid-cols-3 md:grid-cols-4">
        {garments.map((garment) => (
          <GarmentCard
            id={garment.id}
            key={garment.id}
            brand={garment.brand}
            original_price={garment.current_price}
            genre={garment.genre}
            image_url={garment.pictures[0]!.url}
            size={garment.size}
            current_price={garment.current_price}
          />
        ))}
      </div>
    </InfiniteScroll>
  );
}
