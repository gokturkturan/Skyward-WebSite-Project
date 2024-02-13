import React from "react";
import AdCard from "../../components/AdCard";
import Search from "../../components/Search";
import { useSearch } from "../../context/search";

const SearchPage = () => {
  const [search, setSearch] = useSearch();

  return (
    <>
      <div>
        <Search />
      </div>
      <div className="mt-4">
        <div className="text-2xl font-bold text-gray-700 mb-2">
          Found {search.results.length} ads
        </div>
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {search.results?.map((ad) => (
            <AdCard ad={ad} />
          ))}
        </ul>
        {search.results.length === 0 ? (
          "No property matching your search criteria was found."
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default SearchPage;
