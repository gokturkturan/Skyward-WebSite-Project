import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { useAuth } from "../../context/auth";

const AccountActivate = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [auth, setAuth] = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      activationRequest();
    }
  }, [token]);

  const activationRequest = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/users/register", { token });
      toast.success("You have successfully registered.");
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
        <Message variant="success">You have successfully registered.</Message>
      )}
    </div>
  );
};

export default AccountActivate;
