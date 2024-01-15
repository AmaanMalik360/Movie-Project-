import axios from 'axios';
import { BASE_URL } from '../../backendlink';

const matchUser = (email, password) => 
{
    let allUsers = JSON.parse(localStorage.getItem('users')) || []; // Initialize as an empty array if 'users' is not in localStorage

    const userExists = allUsers.filter((obj) => email === obj.email && password === obj.password);
  
    console.log("The found user is:", userExists);
    if (userExists.length === 0) 
    {
      const res = {
        exists: false,
        error:  "Error Occurred"
      };
      return res;

    } 
    else 
    {  
      const res = {
        exists: true,
        user: userExists[0]
      };
  
      localStorage.setItem('user', JSON.stringify(userExists[0]));
      localStorage.setItem('token', JSON.stringify(true));
      return res;
    }
};

export const useLogin = () => {
    const signin = (email, password) => async (dispatch) => {
      try {
        dispatch({ type: 'LOGIN_REQUEST' });
  
        // Make an HTTP request to your backend
        const response = await axios.post(`${BASE_URL}/signin-user`, {
          email,
          password,
        });

        // response = response.data
        console.log(response.status);  
        console.log(response.data);  
        // Assuming your backend returns a success message on successful signin
        if (response.status == 200) 
        {
          const {user, token} = response.data;
          localStorage.setItem('user', JSON.stringify(user))
          localStorage.setItem('token', JSON.stringify(token))

          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user, token
            },
          });
  
          return { success: true, user, message : response.data.message };
        } 
        else 
        {
          dispatch({
            type: 'LOGIN_FAILURE',
            payload: { error: response.data.message },
          });
          return { success: false, error: response.data.message };
        }
      } 
      catch (error) {
        console.error('Error during signin:', error);
        dispatch({
          type: 'LOGIN_FAILURE',
          payload: { error: 'Error during signin' },
        });
        return { success: false, error: 'Error during signin' };
      }
    };
  
    return signin;
  };


export const signout = () =>{
    return dispatch => {
      dispatch({
          type:'LOGOUT_REQUEST'
      })
      localStorage.removeItem('user', null);
      localStorage.setItem('token', null);
      dispatch({
          type:'LOGOUT_SUCCESS'
      })
      
    }

}


