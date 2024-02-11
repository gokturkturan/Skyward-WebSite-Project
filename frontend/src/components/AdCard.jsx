import React from "react";
import { useNavigate } from "react-router-dom";
import { IoBedOutline } from "react-icons/io5";
import { BiArea } from "react-icons/bi";
import { TbBath } from "react-icons/tb";
import { formatPrice } from "../helpers/formatPrice";

const AdCard = ({ ad, userAd = false }) => {
  const navigate = useNavigate();

  const handlerClickAd = () => {
    if (userAd) navigate("/user/ad/" + ad.slug);
    else navigate("/ad/" + ad.slug);
  };

  return (
    <li
      key={ad._id}
      className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow border"
      onClick={handlerClickAd}
    >
      <div className="flex flex-1 flex-col p-2">
        <img
          className="mx-auto h-56 w-64 flex-shrink-0 rounded-md"
          src={ad.photos[0]?.Location}
          alt=""
        />
        <dd className="mt-2">
          <span
            className={`inline-flex items-center rounded-lg ${
              ad?.action === "sell"
                ? "ring-blue-400/30 bg-blue-400/10 text-blue-400"
                : "ring-red-400/30 bg-red-400/10 text-red-400"
            }  px-2 py-1 text-xs font-medium  ring-1 ring-inset `}
          >
            {ad.propertyType.toUpperCase()} / {ad.action.toUpperCase()}
          </span>
        </dd>
      </div>
      <div className="flex flex-1 flex-col divide-y">
        <dl className="py-2 flex flex-grow flex-col justify-between">
          <dt className="sr-only">Title</dt>
          <dd className="text-md font-medium">{ad.title}</dd>
        </dl>
        <dl className="py-2 flex flex-grow flex-col justify-between">
          <dt className="sr-only">Address</dt>
          <dd className="text-md font-light">{ad.address}</dd>
        </dl>
      </div>
      <div>
        <div className="-mt-px flex divide-x divide-gray-200">
          <div className="flex w-0 flex-1">
            <span className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900">
              {formatPrice(ad.price)} TL
            </span>
          </div>
          <div className="-ml-px flex w-0 flex-1">
            <div className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900">
              {ad.propertyType === "house" && (
                <>
                  <div className="flex">
                    <IoBedOutline />
                    <span className="-mt-1 ml-2">{ad.bedroom}</span>
                  </div>
                  <div className="flex">
                    <TbBath />
                    <span className="-mt-1 ml-2">{ad.bathroom}</span>
                  </div>
                  <div className="flex">
                    <BiArea />
                    <span className="-mt-1 ml-2">{ad.landSize}</span>
                  </div>
                </>
              )}
              {ad.propertyType === "land" && (
                <>
                  <div className="flex">
                    <BiArea />
                    <span className="-mt-1 ml-2">{ad.landSize}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default AdCard;
