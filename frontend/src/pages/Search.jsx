import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MovieContainer from "../components/MovieContainer";

const Search = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || "");

  useEffect(() => {
    setQuery(searchParams.get("search") || "");
  }, [searchParams]);

  const params = {
    search: query,
  };

  return (
    <div className="search">
      <MovieContainer params={params} title="Search Results" />
    </div>
  );
};

export default Search;
