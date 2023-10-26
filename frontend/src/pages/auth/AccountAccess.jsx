import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { useAuth } from "../../context/auth";

const AccountAccess = () => {
  const { resetToken } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [auth, setAuth] = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (resetToken) {
      accessRequest();
    }
  }, [resetToken]);

  const accessRequest = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/users/access-account", {
        resetToken,
      });
      toast.success("Please update your password in profile page");
      setLoading(false);
      setAuth({ ...data, isLoggedin: true });
      localStorage.setItem(
        "auth",
        JSON.stringify({ ...data, isLoggedin: true })
      );
      navigate("/");
    } catch (error) {
      setError(error.response.data.error);
      toast.error(error.response.data.error);
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger"> {error} </Message>
      ) : (
        <Message variant="success">You have successfully logged in.</Message>
      )}
    </div>
  );
};

export default AccountAccess;
