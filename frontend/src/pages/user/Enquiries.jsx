import React, { useEffect, useState } from "react";
import axios from "axios";
import AdCard from "../../components/AdCard";

const Enquiries = () => {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    const loadMore = async () => {
      try {
        const { data } = await axios.get(`/ads/enquiries`);
        setAds(data.ads);
      } catch (error) {
        console.log(error);
      }
    };
    loadMore();
  }, []);

  return (
    <div>
      {ads.length === 0 ? (
        <div className="bg-white">
          <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Your enquiry list is empty
            </h2>
          </div>
        </div>
      ) : (
        <div>
          <div className="text-4xl font-bold text-gray-700 mb-2">
            My enquiries ({ads.length} ads)
          </div>
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {ads?.map((ad) => (
              <AdCard ad={ad} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Enquiries;
