import React, { useEffect, useState } from "react";
import axios from "axios";
import AdCard from "../components/AdCard";
import Search from "../components/Search";

const Home = () => {
  const [adsForSell, setAdsForSell] = useState([]);
  const [adsForRent, setAdsForRent] = useState([]);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const { data } = await axios.get("/ads/allAds");
        setAdsForRent(data.adsForRent);
        setAdsForSell(data.adsForSell);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAds();
  }, []);

  return (
    <>
      <div>
        <Search />
      </div>
      <div>
        {adsForSell?.length === 0 || (
          <div className="text-4xl font-bold text-gray-700 mb-2">For Sell</div>
        )}
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {adsForSell?.map((ad) => (
            <AdCard ad={ad} />
          ))}
        </ul>
        {adsForRent?.length === 0 || (
          <div className="text-4xl font-bold text-gray-700 mb-2 mt-8">
            For Rent
          </div>
        )}
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {adsForRent?.map((ad) => (
            <AdCard ad={ad} />
          ))}
        </ul>
      </div>
    </>
  );
};

export default Home;
