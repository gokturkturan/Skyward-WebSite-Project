import React from "react";
import { useAuth } from "../context/auth";

const Home = () => {
  const [auth, setAuth] = useAuth();
  return (
    <div>
      <h1 className="display-1 bg-primary text-light p-5">Home</h1>
      {JSON.stringify(auth, null, 4)}
    </div>
  );
};

export default Home;
