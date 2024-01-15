import React from "react";
import { useLocation, Navigate,  Outlet } from "react-router-dom";


const PrivateRoute = () => {

    const location = useLocation();
    const user  = JSON.parse(window.localStorage.getItem("user"))
    
    return (
        user?
        <Outlet/> : 
        <Navigate to = "/signin" 
        state={{from: location}} replace
        
        />
    );

};

export default PrivateRoute;