import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { signout } from '../../../redux/actions/authActions';
import { useDispatch, useSelector } from 'react-redux';
import {ReactComponent as LogoutIcon} from "../../../assets/images/logout_button.svg"
import { showToast } from '../toasts/Toast';

const Navbar = () => {

  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth)
  // console.log(user);
  
  const [user, setUser] = useState()
  
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'))
    setUser(storedUser)
  }, [auth])
  

  const signOut = () =>{
    dispatch(signout())
    showToast('Signed out Successfully', "success")
    // window.location.reload();
  }
  
  const renderLoggedInLinks = () => {  
    return (
      <>
        <Link to="/movies">Movies</Link>
        <Link to="/favourites">Favourites</Link>
        <Link onClick={signOut} to="/" className="logout-link">
          <LogoutIcon className="logout-icon-svg out" />
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
  const renderLoggedInAdminLinks = () =>{
    return (
      <>
        <Link onClick={signOut} to="/" className="logout-link">
          <LogoutIcon className="logout-icon-svg out" />
        </Link>   
      </> 
    ) 
  }

  return (
    <nav className='navbar'>
        <h1>Movies Corner</h1>
        <div className="links">
        {user && Object.keys(user)?.length !== 0?  
          user?.isAdmin? 
            renderLoggedInAdminLinks() : 
            renderLoggedInLinks() : 
          renderNonLoggedInLinks()}
        </div>        
    </nav>
  )
}

export default Navbar