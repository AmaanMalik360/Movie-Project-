import { useEffect, useState } from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Signup from '../components/Auth/Signup/Signup';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Signin from '../components/Auth/Signin/Signin';
import MoviesList from '../components/User/MoviesList/MoviesList';
import CreateMovie from '../components/Movie/CreateMovie/CreateMovie';
import EditMovie from '../components/Movie/EditMovie/EditMovie';
import NotFound from '../routes/NotFound';
import Navbar from '../common/Navbar/Navbar';
import PrivateRoute from '../routes/PrivateRoute';
import Favourites from '../components/User/Favourites/Favourites';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
          <div className="content">
              <Routes>

                <Route path='/' element={<Signup/>}></Route>
                <Route path='/signin' element={<Signin/>}></Route>
                
                <Route element={<PrivateRoute/>}>

                  <Route path='/movies' element={<MoviesList/>}></Route>
                  <Route path='/create-movie' element={<CreateMovie/>}></Route>
                  <Route path='/edit-movie/:movieId' element={<EditMovie/>}></Route>
                  <Route path='/favourites' element={<Favourites/>}></Route>

                </Route>

                <Route path='*' element={<NotFound/>}/>


              </Routes>
          </div>       
        <ToastContainer />
      </div>
      
    </Router>

  );
}
export default App;