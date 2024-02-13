import { useState, createContext, useContext } from "react";

const SearchContext = createContext();

const initialState = {
  address: "",
  action: "Buy",
  type: "House",
  price: "",
  priceRange: [0, 10000000],
  results: [],
  page: "",
  loading: false,
};

const SearchProvider = ({ children }) => {
  const [search, setSearch] = useState(initialState);

  return (
    <SearchContext.Provider value={[search, setSearch, initialState]}>
      {children}
    </SearchContext.Provider>
  );
};

const useSearch = () => useContext(SearchContext);

export { useSearch, SearchProvider };
