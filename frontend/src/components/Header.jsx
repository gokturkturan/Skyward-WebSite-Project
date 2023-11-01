import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/20/solid";
import logo from "../assets/skyward.png";
import { useAuth } from "../context/auth";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Header = () => {
  const [auth, setAuth] = useAuth();

  const navigate = useNavigate();

  const logoutHandler = () => {
    setAuth({ user: null, token: "", refreshToken: "", isLoggedin: false });
    localStorage.removeItem("auth");
    navigate("/login");
  };

  const handlePostSellAdClick = () => {
    navigate(`/login?redirect=/ad/create/sell`);
  };

  const handlePostRentAdClick = () => {
    navigate(`/login?redirect=/ad/create/rent`);
  };

  return (
    <Disclosure as="nav" className="bg-white shadow">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="-ml-2 mr-2 flex items-center md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-shrink-0 items-center">
                  <Link to="/">
                    <img className="h-8 w-auto" src={logo} alt="Skyward" />
                  </Link>
                </div>
                <div className="hidden md:ml-6 md:flex md:space-x-8">
                  {/* Bir şey koymak istiyorsan buraya koy */}
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex">
                  <div className="hidden md:ml-4 md:flex md:flex-shrink-0 md:items-center">
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="relative flex bg-white text-sm">
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">Open user menu</span>
                          <span className="relative inline-flex items-center gap-x-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 mr-2">
                            <PlusIcon
                              className="-ml-0.5 h-5 w-5"
                              aria-hidden="true"
                            />
                            Post Ad
                          </span>
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <div
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                                onClick={() => handlePostSellAdClick()}
                              >
                                Sell House/Land
                              </div>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <div
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                                onClick={() => handlePostRentAdClick()}
                              >
                                Rent House/Land
                              </div>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                  {!auth.isLoggedin && (
                    <Link to={"/login"}>
                      <button
                        type="button"
                        className="relative inline-flex items-center gap-x-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      >
                        Login <span aria-hidden="true">&rarr;</span>
                      </button>
                    </Link>
                  )}
                </div>
                {auth.isLoggedin && (
                  <div className="hidden md:ml-4 md:flex md:flex-shrink-0 md:items-center">
                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="relative flex rounded-full px-4 py-2 bg-white text-sm hover:bg-gray-100">
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">Open user menu</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                            />
                          </svg>
                          {auth.user.name ? auth.user.name : auth.user.username}
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/dashboard"
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                Dashboard
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <div
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                                onClick={logoutHandler}
                              >
                                Logout
                              </div>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                )}
              </div>
            </div>
          </div>
          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {/* Bir şey koymak istiyorsan buraya koy */}
            </div>
            <div className="border-t border-gray-200 pb-3 pt-4">
              {auth.isLoggedin && (
                <div className="flex items-center px-4 sm:px-6">
                  <div className="flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {auth.user.name ? auth.user.name : auth.user.username}
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      {auth.user.email ? auth.user.email : auth.user.username}
                    </div>
                  </div>
                </div>
              )}
              <div className="mt-3 space-y-1">
                <Disclosure as="div">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 sm:px-6">
                        Post Ad
                      </Disclosure.Button>
                      <Disclosure.Panel className="mt-2 space-y-2">
                        <Disclosure.Button
                          key="sell"
                          className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                          onClick={() => handlePostSellAdClick()}
                        >
                          Sell House/Land
                        </Disclosure.Button>
                        <Disclosure.Button
                          key="rent"
                          className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                          onClick={() => handlePostRentAdClick()}
                        >
                          Rent House/Land
                        </Disclosure.Button>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                {auth.isLoggedin && (
                  <>
                    <Link to="/dashboard">
                      <Disclosure.Button className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 sm:px-6">
                        Dashboard
                      </Disclosure.Button>
                    </Link>
                    <Disclosure.Button
                      onClick={logoutHandler}
                      className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 sm:px-6"
                    >
                      Logout
                    </Disclosure.Button>
                  </>
                )}
                {!auth.isLoggedin && (
                  <Link to="/login">
                    <Disclosure.Button className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 sm:px-6">
                      Login
                    </Disclosure.Button>
                  </Link>
                )}
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Header;
