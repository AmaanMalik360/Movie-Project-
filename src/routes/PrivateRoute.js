import React from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import {jwtDecode} from 'jwt-decode';

const PrivateRoute = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const permissions = ['Write', 'Edit']

  // Function to check if user has the required permissions
  const hasPermission = () => {
    if (user && token) {
      const decodedToken = jwtDecode(token);
      const userPermissions = decodedToken.permissions || [];
      console.log("user permissions", userPermissions);
      console.log(Array.isArray(permissions));
      console.log(permissions);

      if (Array.isArray(permissions)) {
        // Check if any of the required permissions exist in the user's permissions
        return permissions.some((permission) => userPermissions.includes(permission));
      } else {
        // Check if the single required permission exists in the user's permissions
        return userPermissions.includes(permissions);
      }
    }

    // User or token is missing, no permissions
    return false;
  };

  return (
    user && token? <Outlet /> : (
      <Navigate
        to="/signin"
        state={{ from: location }}
        replace
      />
    )
  );
};

export default PrivateRoute;
