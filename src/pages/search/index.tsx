import { useRouter } from "next/router";
import { api } from "~/utils/api";

const Search = () => {
  const { query } = useRouter();
  let search = query.search;

  if (Array.isArray(search)) {
    search = search[0];
  }

  const { data } = api.garments.searchResults.useQuery({
    searchQuery: search || "",
  });

  return <div>Inf</div>;
};

export default Search;
