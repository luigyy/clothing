import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { CategoriesType, GenreType, SizeType } from "~/constants";
import InfiniteGarmentSearch from "~/components/InfiniteGarmentSearch";
import { IoIosArrowForward } from "react-icons/io";
import { FiltersType } from "~/constants";

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

const Index: React.FC<indexProps> = ({}) => {
  const router = useRouter();
  let search = router.query.search;
  if (Array.isArray(search)) {
    search = search[0];
  }

  const [filters, setFilters] = useState<FiltersType>({
    genre: undefined,
    category: undefined,
    size: undefined,
  });

  const [openFilters, setOpenFilters] = useState({
    categories: false,
    sizes: false,
  });
  //

  useEffect(() => {
    if (!router.isReady) return;
    buildFiltersFromUrlParams();
  }, [router.isReady]);

  const currentPage = {
    garments: true,
  };

  //if url contains search param, use the search query, otherwise use the default query
  const garments = api.garments.getAll.useInfiniteQuery(
    {
      genre: filters.genre,
      category: filters.category,
      size: filters.size,
      searchQuery: search,
      currentPage,
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );

  //debug
  useEffect(() => {
    console.log(garments.error);
  }, [garments.isError]);

  function handleGenre(genre: GenreType | "all") {
    if (genre === "all") {
      router.replace("/garments", undefined, { shallow: true });
      return setFilters({ ...filters, genre: undefined });
    }
    router.query.genre = genre;
    router.push(router);
    setFilters({ ...filters, genre });
  }

  function handleSize(size: SizeType | "all") {
    if (size === "all") {
      router.replace("/garments", undefined, { shallow: true });
      return setFilters({ ...filters, size: undefined });
    }
    router.query.size = size;
    router.push(router);
    setFilters({ ...filters, size });
  }
  function handleCategory(category: CategoriesType | "all") {
    if (category === "all") {
      router.replace("/garments", undefined, { shallow: true });
      return setFilters({ ...filters, category: undefined });
    }
    router.query.category = category;
    router.push(router);
    setFilters({ ...filters, category });
  }

  function buildFiltersFromUrlParams() {
    let { genre } = router.query;
    let { category } = router.query;
    let { size } = router.query;

    //check they're not arrays
    if (Array.isArray(genre)) {
      genre = genre[0];
    }
    if (Array.isArray(category)) {
      category = category[0];
    }
    if (Array.isArray(size)) {
      size = size[0];
    }

    setFilters({ genre, category, size });
  }
  //loading component
  if (garments.isLoading) {
    return (
      <div className="flex ">
        <div className="gap-y-24 border-2  border-red-500 px-1 pt-2 ">
          <h1 className="text-blue">Loading...</h1>
        </div>
      </div>
    );
  }
  return (
    <div className="flex ">
      {/* filter sidebar  */}
      <div className=" sticky  left-0 top-0 h-[calc(100vh-92px)] w-1/4 px-10 pt-10">
        <h1 className="text-xl">Filtrar por </h1>
        {/* genre  */}
        <div className="flex justify-between  pt-5">
          <div className="flex flex-col items-center justify-center ">
            <label className="text-sm">Hombre</label>
            <input
              type="radio"
              value="male"
              checked={filters.genre === "male"}
              className="h-5 w-5 accent-orange"
              onClick={() => handleGenre("male")}
            />
          </div>{" "}
          <div className="flex flex-col items-center justify-center">
            <label className="text-sm">Mujer</label>
            <input
              type="radio"
              value="female"
              checked={filters.genre === "female"}
              onClick={() => handleGenre("female")}
              className="h-5 w-5 accent-orange"
            />
          </div>{" "}
          <div className="flex flex-col items-center justify-center">
            <label className="text-sm">Todos</label>
            <input
              type="radio"
              value={undefined}
              checked={filters.genre === undefined}
              onClick={() => handleGenre("all")}
              className="h-5 w-5 accent-orange"
            />
          </div>
        </div>
        {/* category  */}
        <div className="mt-5">
          <div>
            {/* button  */}
            <button
              onClick={() =>
                setOpenFilters({
                  ...openFilters,
                  categories: openFilters.categories === true ? false : true,
                })
              }
              className="peer flex items-center gap-x-5 "
            >
              <h1 className=" text-lg">Categoria</h1>
              <IoIosArrowForward className="mt-1 text-lg text-orange " />
            </button>
            <div
              className={`peer gap-x-1 pt-1  ${
                openFilters.categories
                  ? "relative translate-y-0 opacity-100"
                  : " absolute  -translate-x-[100%] opacity-0  "
              }  transition-transform `}
            >
              <button
                onClick={() => handleCategory("all")}
                className={`${
                  filters.category === undefined ? "border-orange" : null
                } rounded border px-1 text-sm`}
              >
                Todos
              </button>
              <button
                onClick={() => handleCategory("camisas")}
                className={`${
                  filters.category === "camisas" ? "border-orange" : null
                } rounded border px-1 text-sm`}
              >
                Camisas
              </button>
              <button
                onClick={() => handleCategory("abrigos")}
                className={`${
                  filters.category === "abrigos" ? "border-orange" : null
                } rounded border px-1 text-sm`}
              >
                Abrigos
              </button>
              <button
                onClick={() => handleCategory("jeans")}
                className={`${
                  filters.category === "jeans" ? "border-orange" : null
                } rounded border px-1 text-sm`}
              >
                Jeans
              </button>
              <button
                onClick={() => handleCategory("pantalones")}
                className={`${
                  filters.category === "pantalones" ? "border-orange" : null
                } rounded border px-1 text-sm`}
              >
                Pantalones
              </button>
              <button
                onClick={() => handleCategory("shorts")}
                className={`${
                  filters.category === "shorts" ? "border-orange" : null
                } rounded border px-1 text-sm`}
              >
                Shorts
              </button>
              <button
                onClick={() => handleCategory("zapatos")}
                className={`${
                  filters.category === "zapatos" ? "border-orange" : null
                } rounded border px-1 text-sm`}
              >
                Zapatos
              </button>
              <button
                onClick={() => handleCategory("vestidos")}
                className={`${
                  filters.category === "vestidos" ? "border-orange" : null
                } rounded border px-1 text-sm`}
              >
                Vestidos
              </button>
              <button
                onClick={() => handleCategory("enaguas")}
                className={`${
                  filters.category === "enaguas" ? "border-orange" : null
                } rounded border px-1 text-sm`}
              >
                Enaguas
              </button>
            </div>
          </div>
        </div>
        {/* end category */}

        {/* sizes  */}
        <div className="pt-5">
          <div>
            {/* button  */}
            <button
              onClick={() =>
                setOpenFilters({
                  ...openFilters,
                  sizes: openFilters.sizes === true ? false : true,
                })
              }
              className="peer flex items-center gap-x-5"
            >
              <h1 className="text-lg">Sizes</h1>
              <IoIosArrowForward className="mt-1 text-lg text-orange " />
            </button>
            <div
              className={`peer gap-x-1 pt-1  ${
                openFilters.sizes
                  ? "relative translate-y-0 opacity-100"
                  : " absolute  -translate-x-[100%] opacity-0  "
              }  transition-transform `}
            >
              <button
                onClick={() => handleSize("all")}
                className={`${
                  filters.size === undefined ? "border-orange" : null
                } rounded border px-1 text-sm`}
              >
                Todos
              </button>
              <button
                onClick={() => handleSize("2XS")}
                className={`${
                  filters.size === "2XS" ? "border-orange" : null
                } rounded border px-1 text-sm`}
              >
                2XS
              </button>
              <button
                onClick={() => handleSize("XS")}
                className={`${
                  filters.size === "XS" ? "border-orange" : null
                } rounded border px-1 text-sm`}
              >
                XS
              </button>
              <button
                onClick={() => handleSize("S")}
                className={`${
                  filters.size === "S" ? "border-orange" : null
                } rounded border px-1 text-sm`}
              >
                S
              </button>
              <button
                onClick={() => handleSize("M")}
                className={`${
                  filters.size === "M" ? "border-orange" : null
                } rounded border px-1 text-sm`}
              >
                M
              </button>
              <button
                onClick={() => handleSize("L")}
                className={`${
                  filters.size === "L" ? "border-orange" : null
                } rounded border px-1 text-sm`}
              >
                L
              </button>
              <button
                onClick={() => handleSize("2XL")}
                className={`${
                  filters.size === "2XL" ? "border-orange" : null
                } rounded border px-1 text-sm`}
              >
                2XL
              </button>
            </div>
          </div>
        </div>
        {/*end sizes  */}
      </div>
      {/* prendas  */}
      <div className="w-full">
        <InfiniteGarmentSearch
          garments={garments.data?.pages.flatMap((page) => page.garments)}
          isLoading={garments.isLoading}
          isError={garments.isError}
          fetchNewGarments={garments.fetchNextPage}
          hasMore={garments.hasNextPage}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
};

export default Index;
