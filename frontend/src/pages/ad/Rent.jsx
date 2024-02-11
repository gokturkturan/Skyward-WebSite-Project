import React from "react";
import AdForm from "../../components/AdForm";

const Rent = () => {
  return (
    <>
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Rent Your Property
      </h2>
      <AdForm action="rent" />
    </>
  );
};

export default Rent;
