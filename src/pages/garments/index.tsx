import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { CategoriesType, GenreType, SizeType } from "~/constants";
import InfiniteGarmentSearch from "~/components/InfiniteGarmentSearch";
import { IoIosArrowForward } from "react-icons/io";
import { FiltersType } from "~/constants";
import LoadingPage from "~/components/LoadingPage";
import { ClipLoader } from "react-spinners";
import { NextPageWithLayout } from "next";
import FilterSidebar from "./filterLayout";

interface indexProps {}

/**
 * Roadmap to adding a new filter:
 *
 * 1- Add a new field to the filters state object, with the name of the garment filter you wanna filter by
 * 2- Update the getAllByFilter garments query to accept the new filter as param
 * 3- Update the new filter in the BuildFiltersFromUrlParams function
 * 4- Create an input handler for the new filter
 *
 */

const Index: NextPageWithLayout = () => {
  const router = useRouter();
  let { genre, category, size, search } = router.query;
  //
  const currentPage = {
    garments: true,
  };

  // fn to clean type of params
  function cleanQueryParam(param: string | string[] | undefined) {
    if (!param) return undefined;
    if (Array.isArray(param)) {
      return param[0];
    }
    return param;
  }

  //clean type of query params: from string | string[] | undefined --> string
  genre = cleanQueryParam(genre);
  category = cleanQueryParam(category);
  size = cleanQueryParam(size);
  search = cleanQueryParam(search);

  //if url contains search param, use the search query, otherwise use the default query
  const garments = api.garments.getAll.useInfiniteQuery(
    {
      genre: genre,
      category: category,
      size: size,
      searchQuery: search,
      currentPage,
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );
  //loading component
  if (garments.isLoading) {
    return <ClipLoader color="#93a571" size={40} />;
  }
  return (
    <InfiniteGarmentSearch
      garments={garments.data?.pages.flatMap((page) => page.garments)}
      isLoading={garments.isLoading}
      isError={garments.isError}
      fetchNewGarments={garments.fetchNextPage}
      hasMore={garments.hasNextPage}
      currentPage={currentPage}
    />
  );
};

Index.getLayout = (page) => <FilterSidebar>{page}</FilterSidebar>;

export default Index;
