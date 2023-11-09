import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Tab } from "@headlessui/react";
import { HeartIcon } from "@heroicons/react/24/outline";
import { IoBedOutline } from "react-icons/io5";
import { BiArea } from "react-icons/bi";
import { TbBath } from "react-icons/tb";
import { formatPrice } from "../helpers/formatPrice";

const Ad = () => {
  const { slug } = useParams();
  const [ad, setAd] = useState("");
  const [relatedAds, setRelatedAds] = useState("");

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const { data } = await axios.get(`/ads/ad/${slug}`);
        setAd(data.ad);
        setRelatedAds(data.related);
      } catch (error) {
        console.log(error);
      }
    };
    if (slug) {
      fetchAd();
    }
  }, [slug]);

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-2 sm:px-6 sm:py-8 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          <Tab.Group as="div" className="flex flex-col-reverse">
            <div className="mx-auto mt-6 w-full max-w-2xl sm:block lg:max-w-none">
              <Tab.List className="grid grid-cols-4 gap-6">
                {ad?.photos?.map((image) => (
                  <Tab
                    key={image.key}
                    className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                  >
                    {({ selected }) => (
                      <>
                        <span className="absolute inset-0 overflow-hidden rounded-md">
                          <img
                            src={image.Location}
                            alt=""
                            className="h-full w-full object-cover object-center"
                          />
                        </span>
                        <span
                          className={classNames(
                            selected ? "ring-indigo-500" : "ring-transparent",
                            "pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2"
                          )}
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </Tab>
                ))}
              </Tab.List>
            </div>

            <Tab.Panels className="aspect-h-1 aspect-w-1 w-full">
              {ad?.photos?.map((image) => (
                <Tab.Panel key={image.key}>
                  <img
                    src={image.Location}
                    alt="propertyPhoto"
                    className="h-full w-full object-cover object-center rounded-lg sm:rounded-lg"
                  />
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {ad.title}{" "}
            </h1>

            <div className="mt-3">
              <p className="text-xl tracking-tight text-gray-900">
                {ad?.address}
              </p>
            </div>

            <div className="mt-3">
              <div
                className={`inline-flex items-center rounded-lg ${
                  ad?.action === "sell"
                    ? "ring-blue-400/30 bg-blue-400/10 text-blue-400"
                    : "ring-red-400/30 bg-red-400/10 text-red-400"
                }  px-2 py-1 text-xs font-medium  ring-1 ring-inset `}
              >
                {ad?.propertyType?.toUpperCase()} / {ad?.action?.toUpperCase()}
              </div>
            </div>

            <div className="mt-3">
              <p className="text-3xl tracking-tight text-gray-900">
                {formatPrice(ad.price)}
              </p>
            </div>

            <div className="mt-3">
              <p className="tracking-tight text-gray-900">
                {ad.propertyType === "house" && (
                  <>
                    <div className="flex">
                      <IoBedOutline />
                      <span className="-mt-1 ml-2">{ad.bedroom} Bedroom</span>
                    </div>
                    <div className="flex">
                      <TbBath />
                      <span className="-mt-1 ml-2">{ad.bathroom} Bathroom</span>
                    </div>
                    <div className="flex">
                      <BiArea />
                      <span className="-mt-1 ml-2">
                        {ad.landSize} Square meters
                      </span>
                    </div>
                  </>
                )}
                {ad.propertyType === "land" && (
                  <>
                    <div className="flex">
                      <BiArea />
                      <span className="-mt-1 ml-2">
                        {ad.landSize} Square meters
                      </span>
                    </div>
                  </>
                )}
              </p>
            </div>

            <div className="-ml-px flex w-0 flex-1">
              <div className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"></div>
            </div>

            <div className="mt-3">
              <div
                className="space-y-6 text-base text-gray-700"
                dangerouslySetInnerHTML={{ __html: ad.description }}
              />
            </div>

            <div className="mt-3 flex">
              <button
                type="button"
                className="flex items-center justify-center rounded-md px-1 py-1 text-red-600 hover:text-red-900
                hover:bg-gray-100"
              >
                <HeartIcon
                  className="h-6 w-6 flex-shrink-0"
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ad;
