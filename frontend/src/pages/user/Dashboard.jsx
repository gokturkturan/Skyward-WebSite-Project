import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/auth";
import { Link } from "react-router-dom";
import AdCard from "../../components/AdCard";

const Dashboard = () => {
  const [auth, setAuth] = useAuth();
  const [ads, setAds] = useState([]);
  const seller = auth.user.role.includes("Seller");

  const handleDelete = () => {
    loadMore();
  };

  const loadMore = async () => {
    try {
      const { data } = await axios.get("/ads/user-ads/");
      setAds(data.ads);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadMore();
  }, []);

  return (
    <div>
      {!seller || ads.length === 0 ? (
        <div className="bg-white">
          <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              You haven't created any ads yet.
            </h2>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                to="/ad/create/sell"
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Sell Property
              </Link>
              <Link
                to="/ad/create/rent"
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Rent Property
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {ads?.length === 0 || (
            <div className="text-4xl font-bold text-gray-700 mb-2">
              My Ads ({ads.length} ads)
            </div>
          )}
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {ads?.map((ad) => (
              <div key={ad.id}>
                <AdCard ad={ad} userAd={true} onDelete={handleDelete} />
              </div>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
