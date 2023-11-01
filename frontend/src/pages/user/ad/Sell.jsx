import React from "react";
import AdForm from "../../../components/AdForm";

const Sell = () => {
  return (
    <>
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Sell Your Property
      </h2>
      <AdForm action="sell" />
    </>
  );
};

export default Sell;
