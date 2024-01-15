import React, { useState } from 'react'
import { useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { signout } from '../../../redux/actions/authActions';
import { useLogin } from '../../../redux/actions/authActions';
import Footer from '../../../common/Footer/Footer';

const Signin = () => {

    const dispatch = useDispatch();
    const signin = useLogin()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [pending, setPending] = useState(false)
    const [rememberMe, setRememberMe] = useState(false);

    const move = useNavigate();

    const notify = (text, type) =>
    {
        if(type === 'success')
        {
          toast.success(text, {
            // Set to 1.5sec
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1500,
          });
        }
        if(type === 'error')
        {
          toast.error(text, {
            // Set to 1.5sec
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1500,
          });
        }  
    }

    const handleSubmit = async (e) => {
      e.preventDefault();
      setPending(true);
  
      try {
        // Dispatch the signin action and get the response from the backend
        const response = await dispatch(signin(email, password));
  
        if (response && response.success) {
  
          // Assuming the backend returns a success message on successful signin
          notify(response.message, 'success');
          setPending(false);
  
          // Redirect to movies list
          
          move('/movies');
          
        } 
        else 
        {
          notify(response.error || 'Invalid email or password', 'error');
          setPending(false);
        }
      } 
      catch (error) 
      {
        console.error('Error during signin:', error);
        setPending(false);
        notify('Error during signin', 'error');
      }
    };
      

    return (
      <>
        <div className='create'>
            <h2>Sign in </h2>

            <form onSubmit={handleSubmit}>
                <input
                    type='email'
                    required
                    placeholder='Email'
                    value={email}
                    onChange={(e)=> setEmail(e.target.value)}
                />
                <input
                    type='password'
                    required
                    placeholder='Password'
                    value={password}
                    onChange={(e)=> setPassword(e.target.value)}
                    />
                    
                <div className="remember-me">
                  <input
                    type="checkbox"
                    id="rememberMeCheckbox"
                    value={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    />
                  <p htmlFor="rememberMeCheckbox">Remember Me</p>
                </div>

                {!pending && <button >Login</button>}
                {pending && <button >Logging in.....</button>}

            </form>
        </div>       
        <Footer/>    
      </>
    )
}

export default Signin;