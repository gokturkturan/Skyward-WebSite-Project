import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/auth";
import { Link } from "react-router-dom";
import AdCard from "../../components/AdCard";
import Loader from "../../components/Loader";

const Dashboard = () => {
  const [auth, setAuth] = useAuth();
  const [ads, setAds] = useState([]);
  const [total, setTotal] = useState();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const seller = auth.user.role.includes("Seller");

  useEffect(() => {
    const loadMore = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/ads/user-ads/${page}`);
        setAds([...ads, ...data.ads]);
        setTotal(data.total);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    loadMore();
  }, [page]);

  return (
    <div>
      {!seller ? (
        <div className="bg-white">
          <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              You haven't created any ads yet.
            </h2>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                to="/ad/create/sell"
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sell Property
              </Link>
              <Link
                to="/ad/create/rent"
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Rent Property
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div>
            {ads?.length === 0 || (
              <div className="text-4xl font-bold text-gray-700 mb-2">
                My Ads ({total} ads)
              </div>
            )}
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {ads?.map((ad) => (
                <AdCard ad={ad} userAd={true} />
              ))}
            </ul>
          </div>
          {ads.length !== total ? (
            <div className="flex justify-center">
              <button
                type="submit"
                className=" rounded-md bg-blue-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 mt-2"
                disabled={loading}
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {`${ads.length} / ${total} Load More`}
              </button>
            </div>
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
