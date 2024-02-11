import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./context/auth";
import AccountActivate from "./pages/auth/AccountActivate";
import ForgotPassword from "./pages/ForgotPassword";
import AccountAccess from "./pages/auth/AccountAccess";
import Dashboard from "./pages/user/Dashboard";
import PrivateRoute from "./components/routes/PrivateRoute";
import Sell from "./pages/user/ad/Sell";
import Rent from "./pages/user/ad/Rent";
import Ad from "./pages/Ad";
import Profile from "./pages/Profile";
import Edit from "./pages/user/ad/Edit";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<Home />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/register" element={<Register />}></Route>
      <Route
        path="/account-activate/:token"
        element={<AccountActivate />}
      ></Route>
      <Route path="/forgot-password" element={<ForgotPassword />}></Route>
      <Route
        path="/account-access/:resetToken"
        element={<AccountAccess />}
      ></Route>
      <Route path="/ad/:slug" element={<Ad />}></Route>

      <Route path="" element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/ad/create/sell" element={<Sell />}></Route>
        <Route path="/ad/create/rent" element={<Rent />}></Route>
        <Route path="/user/ad/:slug" element={<Edit />}></Route>
        <Route path="/profile/" element={<Profile />}></Route>
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
  // </React.StrictMode>
);

reportWebVitals();
