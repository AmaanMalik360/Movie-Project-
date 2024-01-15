import React from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";

const AdminPermission = () => {
    const location = useLocation();
    const user = JSON.parse(window.localStorage.getItem("user"));
    console.log("User from Create Permissions", user);

    return user.isAdmin? (
        <Outlet />
    ) : (
        <Navigate to = "/home" 
        state={{from: location}} replace
        
        />
    );
};

export default AdminPermission;
