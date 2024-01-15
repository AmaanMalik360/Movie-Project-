import React, { useEffect, useState } from 'react'
import { IoMdCreate, IoMdHeart  } from 'react-icons/io';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../../backendlink';
import axios from 'axios';
import Footer from '../../../common/Footer/Footer';
import { IconContext } from 'react-icons';
import { Link } from 'react-router-dom';

const Favourites = () => {

    const myuser = JSON.parse(localStorage.getItem('user'));
    const mytoken = JSON.parse(localStorage.getItem('token'));

    const [loading, setLoading] = useState(true); // New loading state
    const [userFavorites, setUserFavorites] = useState([]);
    const [user, setUser] = useState(myuser);
    const [token, setToken] = useState(mytoken);
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
          } 
          else if (response.status === 200) {
            // Movie removed from favorites
            const updatedFavorites = userFavorites.filter(
              (fav) => fav.userId !== user.id || fav.movieId !== movieId
            );
            setUserFavorites(updatedFavorites);
            notify(response.data.message, 'success');
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
    const currentMovies = userFavorites.slice(indexOfFirstMovie, indexOfLastMovie);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (loading) {
        return <p>Loading...</p>; // Display a loading message or spinner
    }

    return (
        <>
        <IconContext.Provider value={{ color: "#2BD17E", size: '1.5em' }}>
            <section className='movies'>
                
                <section className='movies-panel'>
                <div className='movie-grid'>
                    {userFavorites?.map((movie, i) => (
                    <div key={i} className='movie-item'>
                        <img src={`${BASE_URL}/Images/${movie.Movie.image}`} alt="" className="movie-image" />
                        <IoMdHeart
                            onClick={() => toggleFavorite(movie.movieId)}
                            className='heart'
                        />
                        <p className="movie-title">{movie.Movie.name}</p>
                        <p className="movie-date">{movie.Movie.year}</p>
                        <Link to={`/edit-movie/${movie.id}`} className="edit-link">
                          <IoMdCreate size={20} color="#fff" className="edit-icon" />
                        </Link>
                    </div>
                    ))}
                </div>
                </section>
                <section className="pagination">
                <div className="button-container">
                    <button className="prev" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Prev</button>

                    <ul className="pages">
                    {Array.from({ length: Math.ceil(userFavorites.length / moviesPerPage) }, (_, index) => (
                        <li key={index} onClick={() => paginate(index + 1)} className={currentPage === index + 1 ? 'active' : ''}>
                        {index + 1}
                        </li>
                    ))}
                    </ul>

                    <button className="next" onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(userFavorites.length / moviesPerPage)}>Next</button>
                </div>
                </section>
            </section>

        </IconContext.Provider>
        <Footer />
        </>
    )
}

export default Favourites