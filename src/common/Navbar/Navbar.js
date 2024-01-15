import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import { signout } from '../../redux/actions/authActions';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

const Navbar = () => {

  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth)
  
  const [user, setUser] = useState(); // Contains user's information
  const [token, setToken] = useState()
  
  // State for storing permissions
  const [permissions, setPermissions] = useState([]);
  
  // Fetch all permissions
  // const fetchAllPermissions = async (token) => {
  //   try 
  //   {
  //     const response = await axios.get('http://localhost:1234/all-permissions', {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         'Content-Type': 'application/json',
  //       },
  //     });
  //     console.log("Permissions are: ",response.data.permissions);
  //     setPermissions(response.data.permissions);
  //   } 
  //   catch (error) 
  //   {
  //     console.error('Error fetching permissions:', error);
  //   }
  // };

  useEffect(() => {
    let myuser = JSON.parse(localStorage.getItem('user'));
    let mytoken = JSON.parse(localStorage.getItem('token')); 
    
    if(myuser)
    {
      setUser(myuser)
    }
    if(mytoken)
    {
      setToken(mytoken)
    }
    
    async function getData(mytoken)
    {
      
    }    
    if(mytoken)
    {
      getData(mytoken)
    }
  }, [auth])

  const notify = (text, type) =>{
    if(type === 'success')
    {
      toast.success(text, {
        // Set to 1.5sec
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500,
      });
    }
    if(type === 'error'){
      toast.error(text, {
        // Set to 1.5sec
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500,
      });
    }
    if(type === 'info'){
      toast.info(text, {
        // Set to 1.5sec
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500,
      });
    }

  }

  const signOut = () =>{
    dispatch(signout())
    notify('Signed out Successfully', "success")
    // Trigger a page refresh
    window.location.reload();
  }
  
  const renderLoggedInLinks = () => {  
    return (
      <>
        <Link to="/movies">Movies</Link>
        <Link to="/favourites">Favourites</Link>
        <Link onClick={signOut} to="/">
          Signout
        </Link>
      </>
    );
  };

  const renderNonLoggedInLinks = () =>{
    return (
      <>
        <Link to="/">Signup</Link>
        <Link to="/signin">Signin</Link>    
      </>
      ) 
  }

  return (

    <nav className='navbar'>
        <h1>Movies Corner</h1>
        <div className="links">
        {user && Object.keys(user).length !== 0  ?  
          renderLoggedInLinks() : 
          renderNonLoggedInLinks()}

        </div>
        
    </nav>
  )
}

export default Navbar