import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/auth";
import { Link } from "react-router-dom";
import AdCard from "../../components/AdCard";

const Dashboard = () => {
  const [auth, setAuth] = useAuth();
  const [ads, setAds] = useState([]);
  const [total, setTotal] = useState();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const seller = auth.user.role.includes("Seller");

  const handleDelete = () => {
    loadMore();
  };

  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/ads/user-ads/${page}`);
      setAds(data.ads);
      setTotal(data.total);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const goToPreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const goToNextPage = () => {
    if (ads.length < total) {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    loadMore();
  }, [page]);

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
        <>
          <div>
            {ads?.length === 0 || (
              <div className="text-4xl font-bold text-gray-700 mb-2">
                My Ads ({total} ads)
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

          <div className="flex items-center justify-between border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={goToPreviousPage}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={goToNextPage}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between lg:justify-center">
              <div>
                <nav
                  className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <button
                    onClick={goToPreviousPage}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  >
                    <span>←</span>
                  </button>
                  <button
                    disabled={true}
                    aria-current="page"
                    className="relative z-10 inline-flex items-center bg-blue-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    {page}
                  </button>
                  <button
                    onClick={goToNextPage}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  >
                    {page + 1}
                  </button>
                  <button
                    onClick={goToNextPage}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  >
                    <span>→</span>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
