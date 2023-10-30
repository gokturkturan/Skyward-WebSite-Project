import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";

const App = () => {
  return (
    <>
      <Header />
      <Toaster />
      <main className="py-3">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default App;
