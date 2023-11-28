import { useRouter } from "next/router";

const Search = () => {
  const { query } = useRouter();

  //params
  const search = query.search;

  return <div>param: {search}</div>;
};

export default Search;
