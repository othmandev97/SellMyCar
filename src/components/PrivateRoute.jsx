import React from "react";
import { Navigate, Outlet } from "react-router-dom";

//import the custom hook
import { useAuthStatus } from "../hooks/useAuthStatus";

//import loading
import { Loading } from "./Loading";
export const PrivateRoute = () => {
  const { loggedIn, checkingStatus } = useAuthStatus();

  if (checkingStatus) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return loggedIn ? <Outlet /> : <Navigate to="/signin" />;
};
