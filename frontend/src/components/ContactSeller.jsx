import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useAuth } from "../context/auth";
import toast from "react-hot-toast";
import axios from "axios";
import Loader from "./Loader";

const ContactSeller = ({ ad }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const [auth, setAuth] = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isLoggedin) {
      setName(auth.user?.name);
      setEmail(auth.user?.email);
      setPhone(auth.user?.phone);
    }
  }, [auth.isLoggedin]);

  const handleContactClick = () => {
    navigate(`/login?redirect=/ad/${ad?.slug}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/ads/contact-seller", {
        name,
        email,
        phone,
        message,
        adId: ad._id,
      });
      toast.success("Message sended.");
      setLoading(false);
      setMessage("");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.error);
      setLoading(false);
    }
  };

  return (
    <>
      {auth.isLoggedin ? (
        <div className="isolate bg-white px-1 py-5 sm:py-5 lg:px-1">
          <div
            className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
            aria-hidden="true"
          ></div>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              Contact Seller {ad?.postedBy?.name}
            </h2>
          </div>
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-4 max-w-xl sm:mt-4"
          >
            <div className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  Name
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    name="first-name"
                    id="first-name"
                    autoComplete="given-name"
                    required
                    value={name}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  Email
                </label>
                <div className="mt-2.5">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="phone-number"
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  Phone number
                </label>
                <div className="relative mt-2.5">
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    required
                    autoComplete="phone"
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  Message
                </label>
                <div className="mt-2.5">
                  <textarea
                    name="message"
                    id="message"
                    maxLength={200}
                    required
                    value={message}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={(e) => {
                      setMessage(e.target.value);
                    }}
                    autoFocus={true}
                  />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <button
                type="submit"
                disabled={!name || !email || loading}
                className="block w-full rounded-md bg-blue-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {loading ? <Loader /> : "Send"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="isolate bg-white px-6 py-5 sm:py-5 lg:px-8">
          <div className="mt-4">
            <button
              className="block w-full rounded-md bg-blue-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => handleContactClick()}
            >
              Login for Contact
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactSeller;
