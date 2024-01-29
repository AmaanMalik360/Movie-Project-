import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Signup from './pages/auth/signup/Signup';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Signin from './pages/auth/signin/Signin';
import MoviesList from './pages/movie/movies-list/MoviesList';
import CreateMovie from './pages/movie/create-movie/CreateMovie';
import EditMovie from './pages/movie/edit-movie/EditMovie';
import NotFound from './routes/NotFound';
import Navbar from './components/common/navbar/Navbar';
import PrivateRoute from './routes/PrivateRoute';
import Favourites from './pages/movie/favourites/Favourites';
import UserList from './pages/admin/dashboard/UserList';
import Permissions from './routes/Permissions';
import Footer from './components/common/footer/Footer';

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
                  <Route path='/favourites' element={<Favourites/>}></Route>
                  
                  <Route element={<Permissions perProp={['Admin']} />}>
                    <Route path='/userlist' element={<UserList/>}/>
                  </Route>
                  
                  <Route element={<Permissions perProp={['Write']} />}>
                    <Route path='/create-movie' element={<CreateMovie />} />
                  </Route>
                  <Route element={<Permissions perProp={['Edit']} />}>
                    <Route path='/edit-movie/:movieId' element={<EditMovie />} />
                  </Route>
                
                </Route>

                <Route path='*' element={<NotFound/>}/>
              </Routes>
          </div>       
        <ToastContainer />
      </div>
        <Footer/>
    </Router>
  );
}
export default App;