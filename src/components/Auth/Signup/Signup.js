import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios'; // Import axios for making HTTP requests
import Footer from '../../../common/Footer/Footer';
import {BASE_URL} from "../../../backendlink"

const Signup = () => {
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const move = useNavigate();

  const notify = (text, type) => {
    if (type === 'success') {
      toast.success(text, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500,
      });
    }
    if (type === 'error') {
      toast.error(text, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPending(true);

    try {

      const response = await axios.post(`${BASE_URL}/register-user` , {
        name,
        email,
        password
      });
      if(response.status == 201)
      {
        // Notify user
        notify(response.data.message, 'success');
        setPending(false);
  
        // If signup is successful, move to the "/signin" route
        move('/signin');
          
      }
      else{
        // If an error occurs, handle it here
        console.error('Error during signup:');
        setPending(false);

        // Notify user
        notify(response.data.message, 'error');
      }
    } 
    catch (error) 
    {
      // If an error occurs, handle it here
      console.error('Error during signup:', error);
      setPending(false);

      // Notify user
      notify('Error during signup', 'error');
    }
  };

  return (
    <>
    <div className='create'>
      <h2>Sign up</h2>

      <form onSubmit={handleSubmit}>
        <input
          type='text'
          required
          placeholder='Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          />
        <input
          type='email'
          required
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type='password'
          required
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          />
        
        {!pending && <button>Signup</button>}
        {pending && <button disabled>Signing Up.....</button>}
      </form>
    </div>
    <Footer/>

    </>
  );
};

export default Signup;
