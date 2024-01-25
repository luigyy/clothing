import React from "react";
import { api } from "~/utils/api";
import InfiniteGarmentSearch from "~/components/InfiniteGarmentSearch";
import { useSession } from "next-auth/react";
import LoginModal from "~/components/LoginModal";

const Index = ({}) => {
  const session = useSession();

  const currentPage = {
    favorites: true,
  };
  const garments = api.garments.getAll.useInfiniteQuery(
    {
      currentPage,
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );
  //
  if (!session.data) {
    return (
      <div className="text-center">
        <LoginModal showModal={true} />
      </div>
    );
  }
  return (
    <>
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
    </>
  );
};

export default Index;
