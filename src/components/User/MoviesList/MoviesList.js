import React, { useState, useEffect } from 'react';
import { IoIosAddCircleOutline, IoMdCreate, IoMdHeart, IoMdHeartEmpty  } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios'; // Import axios
import Footer from '../../../common/Footer/Footer';
import { BASE_URL } from '../../../backendlink';
import { IconContext } from 'react-icons';

const MoviesList = () => {

  const move = useNavigate();

  const myuser = JSON.parse(localStorage.getItem('user'));
  const mytoken = JSON.parse(localStorage.getItem('token'));

  const [user, setUser] = useState(myuser);
  const [token, setToken] = useState(mytoken);
  const [movies, setMovies] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 8;

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

  const fetchMovies = async (token) => {
    try {
      const response = await axios.get(`${BASE_URL}/movies`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data.Movies);
      setMovies(response.data.Movies);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const fetchUserFavorites = async (userId, token) => {
    try {
      const response = await axios.get(`${BASE_URL}/user-favourites/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data.favourites);
      setUserFavorites(response.data.favourites);
    } catch (error) {
      console.error('Error fetching user favorites:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        await fetchMovies(token);
      }
      if (user && token) {
        await fetchUserFavorites(user.id, token);
      }
      setLoading(false); // Set loading to false once data fetching is complete
    };

    fetchData();
  }, []);

  const toggleFavorite = async (movieId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/toggle-favourite-movie`,
        {
          userId: user.id,
          movieId: movieId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 201) {
        // Movie added to favorites
        const updatedFavorites = [...userFavorites, response.data.newFavourite];
        setUserFavorites(updatedFavorites);
        notify(response.data.message, 'success');
        console.log(userFavorites);
      } else if (response.status === 200) {
        // Movie removed from favorites
        const updatedFavorites = userFavorites.filter(
          (fav) => fav.userId !== user.id || fav.movieId !== movieId
          );
          setUserFavorites(updatedFavorites);
          notify(response.data.message, 'success');
          console.log(userFavorites);
      } else {
        // Other status codes (handle as needed)
        notify(response.data.message, 'error');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Handle error scenarios
      notify('An error occurred while toggling favorite', 'error');
    }
  };

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  if (loading) {
    return <p>Loading...</p>; // Display a loading message or spinner
  }

  const moveToEdit = (movie) => {
    // Navigate to the edit-movie component and pass the movie data
    move(`/edit-movie/${movie.id}`, { state: { movieData: movie } });
  };

  return (
    <>
    <IconContext.Provider value={{ color: "#2BD17E", size: '1.5em' }}>
      <section className='movies'>
        <section className='add-section'>
          <div className='add-div'>
            <Link to='/create-movie' className="add-heading">
              <h2>Add a Movie</h2>
              <IoIosAddCircleOutline
                size={32}
                color="white"
                style={{ marginRight: '40px', position: 'relative', top: '5px' }}
              />
            </Link>
          </div>
        </section>

        <section className='movies-panel'>
          <div className='movie-grid'>
            {currentMovies?.map((movie, i) => (
              <div key={i} className='movie-item'>
                <img src={`${BASE_URL}/Images/${movie.image}`} alt="" className="movie-image" />
                <IoMdHeart
                    onClick={() => toggleFavorite(movie.id)}
                    color={user && movie && Array.isArray(userFavorites) && userFavorites.some((fav) => fav?.userId === user?.id && fav?.movieId === movie?.id) ? "#2BD17E" : "#224957"}
                    className='heart'
                />  
                <p className="movie-title">{movie.name}</p>
                <p className="movie-date">{movie.year}</p>
                
                <div onClick={()=> moveToEdit(movie)}  className="edit-link">
                    <IoMdCreate size={20} color="#fff" className="edit-icon" />
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="pagination">
          <div className="button-container">
            <button className="prev" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Prev</button>

            <ul className="pages">
              {Array.from({ length: Math.ceil(movies.length / moviesPerPage) }, (_, index) => (
                <li key={index} onClick={() => paginate(index + 1)} className={currentPage === index + 1 ? 'active' : ''}>
                  {index + 1}
                  </li>
              ))}
            </ul>

            <button className="next" onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(movies.length / moviesPerPage)}>Next</button>
          </div>
        </section>
      </section>

      </IconContext.Provider>
      <Footer />
    </>
  );
};

export default MoviesList;