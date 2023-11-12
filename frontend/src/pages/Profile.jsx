import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Loader from "../components/Loader";
import ProfileImageUpload from "../components/ProfileImageUpload";

const Profile = () => {
  const [auth, setAuth] = useAuth();

  console.log(auth);

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [about, setAbout] = useState("");
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (auth.user) {
      setUsername(auth.user.username);
      setName(auth.user.name);
      setEmail(auth.user.email);
      setCompany(auth.user.company);
      setAddress(auth.user.homeAddress?.address);
      setCity(auth.user.homeAddress?.city);
      setCountry(auth.user.homeAddress?.country);
      setPostalCode(auth.user.homeAddress?.postalCode);
      setPhone(auth.user.phone);
      setAbout(auth.user.about);
      setPhoto(auth.user.photo);
    }
  }, []);

  const oldPasswordRef = useRef(null);
  const newPasswordRef = useRef(null);
  const confirmNewPasswordRef = useRef(null);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/users/update-password", {
        oldPassword: oldPasswordRef.current.value,
        newPassword: newPasswordRef.current.value,
        confirmNewPassword: confirmNewPasswordRef.current.value,
      });

      toast.success("Password Changed");

      if (
        oldPasswordRef.current &&
        newPasswordRef.current &&
        confirmNewPasswordRef.current
      ) {
        oldPasswordRef.current.value = "";
        newPasswordRef.current.value = "";

        confirmNewPasswordRef.current.value = "";
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.put("/users/update-profile", {
        username,
        name,
        email,
        company,
        address,
        city,
        country,
        postalCode,
        phone,
        about,
        photo,
      });
      setAuth({ ...auth, user: data });
      let fromLS = JSON.parse(localStorage.getItem("auth"));
      fromLS.user = data;
      localStorage.setItem("auth", JSON.stringify(fromLS));
      setLoading(false);
      toast.success("Profile Updated.");
    } catch (error) {
      console.log(error);
      toast.error("Profile Updating Failed.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Profile
            </h2>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-4">
              <label
                htmlFor="website"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Username
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="website"
                    id="website"
                    value={username}
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="about"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                About
              </label>
              <div className="mt-2">
                <textarea
                  id="about"
                  name="about"
                  maxLength={200}
                  className="block w-full rounded-md border-0 py-1.5 pl-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={about}
                  onChange={(e) => {
                    setAbout(e.target.value);
                  }}
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Write a few sentences about yourself.
              </p>
            </div>

            <ProfileImageUpload
              photo={photo}
              setPhoto={setPhoto}
              uploading={uploading}
              setUploading={setUploading}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-gray-900/10 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Personal Information
            </h2>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-3">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  className="block w-full rounded-md border-0 py-1.5 pl-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="phone"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Phone
              </label>
              <div className="mt-2">
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  value={phone}
                  className="block w-full rounded-md border-0 py-1.5 pl-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  className="block w-full rounded-md border-0 py-1.5 pl-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  disabled
                />
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="company"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Company
              </label>
              <div className="mt-2">
                <input
                  id="company"
                  name="company"
                  type="text"
                  value={company}
                  className="block w-full rounded-md border-0 py-1.5 pl-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => {
                    setCompany(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="sm:col-span-3">
              <label
                htmlFor="country"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Country
              </label>
              <div className="mt-2">
                <select
                  id="country"
                  name="country"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                  }}
                >
                  <option>Select</option>
                  <option>Türkiye</option>
                  <option>Germany</option>
                  <option>France</option>
                  <option>Italy</option>
                </select>
              </div>
            </div>
            <div className="col-span-full">
              <label
                htmlFor="street-address"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Street address
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="street-address"
                  id="street-address"
                  value={address}
                  className="block w-full rounded-md border-0 py-1.5 pl-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => {
                    setAddress(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="sm:col-span-2 sm:col-start-1">
              <label
                htmlFor="city"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                City
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="city"
                  id="city"
                  value={city}
                  className="block w-full rounded-md border-0 py-1.5 pl-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => {
                    setCity(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="postal-code"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                ZIP / Postal code
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="postal-code"
                  id="postal-code"
                  value={postalCode}
                  className="block w-full rounded-md border-0 py-1.5 pl-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => {
                    setPostalCode(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-x-6 border-b">
          <button
            type="submit"
            className="mb-2 -mt-5 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            disabled={loading}
          >
            {loading ? <Loader /> : "Save"}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-gray-900/10 md:grid-cols-3">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Change Password
          </h2>
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <div className="col-span-full">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Old Password
              </label>
              <div className="mt-2">
                <input
                  ref={oldPasswordRef}
                  id="password"
                  name="password"
                  type="password"
                  className="block w-full rounded-md border-0 py-1.5 pl-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="col-span-full">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                New Password
              </label>
              <div className="mt-2">
                <input
                  ref={newPasswordRef}
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  className="block w-full rounded-md border-0 py-1.5 pl-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="col-span-full">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Confirm New Password
              </label>
              <div className="mt-2">
                <input
                  ref={confirmNewPasswordRef}
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  type="password"
                  className="block w-full rounded-md border-0 py-1.5 pl-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-x-6">
          <button
            type="btn"
            className="mb-2 -mt-5 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            disabled={loading}
            onClick={handleChangePassword}
          >
            {loading ? <Loader /> : "Update Password"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default Profile;
