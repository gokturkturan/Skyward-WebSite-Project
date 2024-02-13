import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearch } from "../context/search";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { GOOGLE_PLACES_KEY } from "../constants";
import { sellPrices, rentPrices } from "../helpers/priceList";
import { useNavigate } from "react-router-dom";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import queryString from "query-string";
import toast from "react-hot-toast";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Search = () => {
  const [search, setSearch, initialState] = useSearch();

  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      if (search.address === "") {
        toast.error("Address cannot be empty.");
        return;
      }
      if (search.price === "") {
        toast.error("Price cannot be empty.");
        return;
      }
      setSearch({ ...search, loading: true });
      const { results, page, price, ...rest } = search;
      const query = queryString.stringify(rest);
      const { data } = await axios.get(`/ads/search?${query}`);
      setSearch({ ...search, results: data, loading: false });
      navigate("/search");
    } catch (error) {
      setSearch({ ...search, loading: false });
    }
  };

  return (
    <div>
      <div className="mt-2">
        <GooglePlacesAutocomplete
          apiKey={GOOGLE_PLACES_KEY}
          key={search.address}
          apiOptions="tr"
          selectProps={{
            defaultInputValue: search.address,
            required: true,
            placeholder: "Search for address...",
            onChange: ({ value }) => {
              setSearch({ ...search, address: value.description });
            },
          }}
        />
      </div>
      <div className="flex justify-center">
        <div className="isolate inline-flex rounded-md shadow-sm mt-1">
          <button
            type="button"
            className="relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 focus:z-10"
            onClick={() =>
              setSearch({
                ...search,
                action: "Buy",
                price: "",
              })
            }
          >
            {search.action === "Buy" ? "Buy ✅" : "Buy"}
          </button>
          <button
            type="button"
            className="relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 focus:z-10"
            onClick={() =>
              setSearch({
                ...search,
                action: "Rent",
                price: "",
              })
            }
          >
            {search.action === "Rent" ? "Rent ✅" : "Rent"}
          </button>
          <button
            type="button"
            className="relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 focus:z-10"
            onClick={() => setSearch({ ...search, type: "House", price: "" })}
          >
            {search.type === "House" ? "House ✅" : "House"}
          </button>
          <button
            type="button"
            className="relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 focus:z-10"
            onClick={() => setSearch({ ...search, type: "Land", price: "" })}
          >
            {search.type === "Land" ? "Land ✅" : "Land"}
          </button>
          <div>
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="flex items-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none ">
                  <span className="sr-only">Open options</span>
                  <button
                    type="button"
                    className="relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 focus:z-10"
                  >
                    &#11167;{" "}
                    {search.price != "" ? search.price + "✅" : "Price"}
                  </button>
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {search.action === "Buy"
                      ? sellPrices.map((val) => (
                          <Menu.Item>
                            {({ active }) => (
                              <div
                                className={classNames(
                                  active
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-700",
                                  "block px-4 py-2 text-sm"
                                )}
                                key={val._id}
                                onClick={() =>
                                  setSearch({
                                    ...search,
                                    price: val.name,
                                    priceRange: val.array,
                                  })
                                }
                              >
                                {search.price === val.name
                                  ? `${val.name} ✅`
                                  : val.name}
                              </div>
                            )}
                          </Menu.Item>
                        ))
                      : rentPrices.map((val) => (
                          <Menu.Item>
                            {({ active }) => (
                              <div
                                className={classNames(
                                  active
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-700",
                                  "block px-4 py-2 text-sm"
                                )}
                                key={val._id}
                                onClick={() =>
                                  setSearch({
                                    ...search,
                                    price: val.name,
                                    priceRange: val.array,
                                  })
                                }
                              >
                                {search.price === val.name
                                  ? `${val.name} ✅`
                                  : val.name}
                              </div>
                            )}
                          </Menu.Item>
                        ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>

          <button
            type="button"
            className="relative -ml-px inline-flex items-center rounded-r-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white ring-1 ring-inset ring-gray-300 hover:bg-blue-700 focus:z-10"
            onClick={handleSearch}
          >
            Search
          </button>

          {search.address !== "" || search.price !== "" ? (
            <button
              type="button"
              className="ml-2 relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 focus:z-10 rounded-lg"
              onClick={() => {
                setSearch(initialState);
                navigate("/");
              }}
            >
              Clear Filter
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
