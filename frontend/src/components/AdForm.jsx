import React, { useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import CurrencyInput from "react-currency-input-field";
import { GOOGLE_PLACES_KEY } from "../constants";
import ImageUpload from "./ImageUpload";

const propertyType = [
  { id: "land", title: "Land" },
  { id: "house", title: "House" },
];

const carPark = [
  { id: "available", title: "Available" },
  { id: "unavailable", title: "Unavailable" },
];

const AdForm = ({ action }) => {
  const [ad, setAd] = useState({
    photos: [],
    uploading: false,
    price: "",
    address: "",
    propertyType: "",
    title: "",
    description: "",
    loading: false,
    action: action,
  });

  const handleChangePropertyType = (type) => {
    delete ad.bathroom;
    delete ad.bedrooms;
    delete ad.carPark;
    setAd({ ...ad, propertyType: type.id });
  };

  return (
    <>
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium leading-6 text-gray-900 mt-2 mb-2"
        >
          Ad Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
          value={ad.title}
          onChange={(e) => {
            setAd({ ...ad, title: e.target.value });
          }}
          required
        />
      </div>

      <div>
        <label
          htmlFor="location"
          className="block text-sm font-medium leading-6 text-gray-900 mb-1"
        >
          Location
        </label>
        <GooglePlacesAutocomplete
          apiKey={GOOGLE_PLACES_KEY}
          apiOptions="tr"
          selectProps={{
            defaultInputValue: ad?.address,
            placeholder: "Search for address...",
            onChange: ({ value }) => {
              setAd({ ...ad, address: value.description });
            },
          }}
        />
      </div>

      <div className="mt-1">
        <label className="text-base font-semibold text-gray-900">
          Property Type
        </label>
        <fieldset className="mt-1">
          <div className="space-y-1">
            {propertyType.map((type) => (
              <div key={type.id} className="flex items-center px-4">
                <input
                  id={type.id}
                  name="propertyMethod"
                  type="radio"
                  defaultChecked={type.id === "email"}
                  className="h-4 w-4"
                  onChange={() => handleChangePropertyType(type)}
                />
                <label
                  htmlFor={type.id}
                  className="ml-1 block text-sm font-medium leading-6 text-gray-900"
                >
                  {type.title}
                </label>
              </div>
            ))}
          </div>
        </fieldset>
      </div>

      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium leading-6 text-gray-900 mt-2"
        >
          Price
        </label>
        <div className="relative mt-2 rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">₺</span>
          </div>
          <CurrencyInput
            placeholder="Enter a price"
            defaultValue={ad.price}
            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            onValueChange={(value) => setAd({ ...ad, price: value })}
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-gray-500 sm:text-sm" id="price-currency">
              TL
            </span>
          </div>
        </div>
      </div>

      {ad.propertyType && ad.propertyType !== "land" && (
        <div>
          <label
            htmlFor="bedroom"
            className="block text-sm font-medium leading-6 text-gray-900 mt-2 mb-2"
          >
            Number of Bedroom
          </label>
          <input
            type="number"
            name="bedroom"
            id="bedroom"
            min="0"
            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
            value={ad.bedrooms}
            onChange={(e) => {
              setAd({ ...ad, bedrooms: e.target.value });
            }}
            required
          />
        </div>
      )}

      {ad.propertyType && ad.propertyType === "land" && (
        <div>
          <label
            htmlFor="landSize"
            className="block text-sm font-medium leading-6 text-gray-900 mt-2 mb-2"
          >
            Land Size
          </label>
          <input
            type="number"
            name="landSize"
            id="landSize"
            min="0"
            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
            value={ad.landSize}
            onChange={(e) => {
              setAd({ ...ad, landSize: e.target.value });
            }}
            required
          />
        </div>
      )}

      {ad.propertyType && ad.propertyType !== "land" && (
        <div>
          <label
            htmlFor="bathroom"
            className="block text-sm font-medium leading-6 text-gray-900 mt-2 mb-2"
          >
            Number of Bathroom
          </label>
          <input
            type="number"
            name="bathroom"
            id="bathroom"
            min="0"
            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
            value={ad.bathroom}
            onChange={(e) => {
              setAd({ ...ad, bathroom: e.target.value });
            }}
            required
          />
        </div>
      )}

      {ad.propertyType && ad.propertyType !== "land" && (
        <div className="mt-2">
          <label className="text-base font-semibold text-gray-900">
            Car Park
          </label>
          <fieldset className="mt-1">
            <div className="space-y-1">
              {carPark.map((type) => (
                <div key={type.id} className="flex items-center px-4">
                  <input
                    id={type.id}
                    name="carPark"
                    type="radio"
                    defaultChecked={type.id === "email"}
                    className="h-4 w-4"
                    onChange={() => setAd({ ...ad, carPark: type.id })}
                  />
                  <label
                    htmlFor={type.id}
                    className="ml-1 block text-sm font-medium leading-6 text-gray-900"
                  >
                    {type.title}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>
        </div>
      )}

      <ImageUpload ad={ad} setAd={setAd} />

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium leading-6 text-gray-900 mt-2 mb-2"
        >
          Description
        </label>
        <textarea
          rows={3}
          name="comment"
          id="comment"
          className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          value={ad.description}
          onChange={(e) => {
            setAd({ ...ad, description: e.target.value });
          }}
          required
        />
      </div>

      <button
        type="button"
        className="rounded-md bg-blue-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 my-2"
      >
        Post Ad
      </button>

      <pre className="mt-5">{JSON.stringify(ad, null, 4)}</pre>
    </>
  );
};

export default AdForm;
