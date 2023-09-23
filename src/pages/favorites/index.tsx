import React from "react";
import { api } from "~/utils/api";
import GarmentCard from "~/components/GarmentCard";
import InfiniteGarmentSearch from "~/components/InfiniteGarmentSearch";

interface indexProps {}

const Index = ({}) => {
  const currentPage = {
    favorites: true,
  };
  const garments = api.garments.getAll.useInfiniteQuery(
    {
      currentPage,
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );
  return (
    <div className="min-h-screen w-full px-32">
      <InfiniteGarmentSearch
        garments={garments.data?.pages.flatMap((page) => page.garments)}
        isLoading={garments.isLoading}
        isError={garments.isError}
        fetchNewGarments={garments.fetchNextPage}
        hasMore={garments.hasNextPage}
        currentPage={currentPage}
      />
    </div>
  );
};

export default Index;
