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
  currentPage: {
    garments?: boolean;
    favorites?: boolean;
    recommendations?: boolean;
  };
};

export default function InfiniteGarmentSearch({
  garments,
  isError,
  isLoading,
  fetchNewGarments,
  hasMore = false,
  currentPage,
}: InfiniteTweetListProps) {
  if (isLoading) return <div>loading...</div>;
  if (isError) return <h1>Error...</h1>;

  if (garments == null || garments.length === 0) {
    return <h2 className="">No garments</h2>;
  }
  return (
    <div className="relative ">
      <InfiniteScroll
        dataLength={garments.length}
        hasMore={hasMore}
        next={async () => await fetchNewGarments()}
        loader={
          <div
            className="absolute bottom-0 h-28 w-full overflow-hidden  bg-opacity-60  backdrop-blur-sm"
            key={0}
          >
            <h1 className="flex h-full items-center justify-center text-2xl">
              Loading...
            </h1>
          </div>
        }
      >
        <div className="relative grid w-full grid-cols-2  gap-y-24 px-1 pb-14 pt-2 sm:grid-cols-3 md:grid-cols-4">
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
              isFavorite={garment.isFavorite}
              currentPage={currentPage}
              showFavoriteButton={true}
            />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}
