import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, Navigate,  Outlet } from "react-router-dom";


const UpdatePermission = () => {

    const location = useLocation();
    const user = JSON.parse(window.localStorage.getItem("user"))
    const token = JSON.parse(window.localStorage.getItem("token"))

    const [hasEdit, setHasEdit] = useState()

    // State for storing permissions and userPermissions
    const [permissions, setPermissions] = useState([]);
    const [userPermissions, setUserPermissions] = useState([]);

    // Fetch all permissions
    const fetchAllPermissions = async () => {
        try 
        {
        const response = await axios.get('http://localhost:1234/all-permissions', {
            headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            },
        });
        console.log("Permissions are: ",response.data.permissions);
        setPermissions(response.data.permissions);
        } 
        catch (error) 
        {
        console.error('Error fetching permissions:', error);
        }
    };

    // Fetch all userPermissions
    const fetchAllUserPermissions = async () => {
        try 
        {
        const response = await axios.get('http://localhost:1234/all-user-permissions', {
            headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            },
        });
        console.log("userPermissions are: ",response.data.userPermissions);

        setUserPermissions(response.data.userPermissions);
        } 
        catch (error) 
        {
        console.error('Error fetching userPermissions:', error);
        }
    };

    useEffect(() => {
        
        async function getData(){
            await fetchAllPermissions();
            await fetchAllUserPermissions();
        }
        
        getData()
        
    }, []);

    useEffect(() => {
        // Your logic to calculate hasEdit and hasDelete
        
        // Permissions 
        const editPermission = permissions.find(permission => permission.name === 'Edit');
        const EditPermission =
          user &&
          userPermissions.some(
            uP => uP.userId === user._id && uP.permissionId === (editPermission ?editPermission._id : null)
          );
        setHasEdit(EditPermission)
        
    }, [permissions, userPermissions]);
    
    console.log("User from Create Permissions", user);
    return (
        hasEdit?
        <Outlet/> : 
        <Navigate to = "/home" 
        state={{from: location}} replace
        
        />
    );

};

export default UpdatePermission;