import React, { useEffect, useState } from 'react'
import { IoMdCreate, IoMdHeart, IoMdTrash  } from 'react-icons/io';
import { IconContext } from 'react-icons';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../backendlink';
import Pagination from '../../../components/common/pagination/Pagination';
import EmptyList from '../empty-list/EmptyList';
import { useDispatch, useSelector } from 'react-redux';
import { deleteMovie, loadFavourites, toggleFavourites } from '../../../redux/actions/movieActions';
import { jwtDecode } from 'jwt-decode';
import { showToast } from '../../../components/common/toasts/Toast';
// Antd Import
import { Button, Modal } from 'antd';

const Favourites = () => {

    const move = useNavigate();
    const dispatch = useDispatch();
    // const loadFavourites = addFavourites();
    
    // const movies = useSelector(state => state.movies.movies)
    const user = JSON.parse(localStorage.getItem('user'))
    const token = localStorage.getItem('token')

    const userFavorites = useSelector(state => state.movies.favourites)
    const [permissions, setPermissions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [loading, setLoading] = useState(true); // New loading state
    const [currentPage, setCurrentPage] = useState(1);
    const [temp, setTemp] = useState(); 

    // Code to calculate pages
    const moviesPerPage = 8;
    const indexOfLastMovie = currentPage * moviesPerPage;
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
    const currentMovies = userFavorites.slice(indexOfFirstMovie, indexOfLastMovie);

    const fetchUserFavorites = async () => {
      dispatch(loadFavourites(user.id, token))    
    };

    const handleDelete = (movieId) => {
      console.log(movieId);
      setTemp(movieId)
      showModal()
    }
    // Antd code
    const showModal = () => {
      setIsModalOpen(true);
    };
    const handleCancel = () => {
      setIsModalOpen(false);
    }; 
    const deleteMovies = async () =>{
      if(permissions.includes('Delete')) {
        dispatch(deleteMovie(temp, token))
      }
      else{
        showToast('Not Permitted to Delete.','info')
      }
      handleCancel()
    }
    
    useEffect(() => {
        const fetchData = async () => {
          if (user && token) await fetchUserFavorites();
          // Decode the token to get user permissions
          const decodedToken = jwtDecode(token);
          const permissions = decodedToken.permissions || [];

          // Store user permissions in state
          setPermissions(permissions);
          setLoading(false); // Set loading to false once data fetching is complete
        };
    
        fetchData();
    }, []);

    const toggleFavorite = async (movieId) => {
      dispatch(toggleFavourites(user.id, movieId, token, userFavorites))
    }; 

    if (loading) {
      return <p>Loading...</p>; // Display a loading message or spinner
    }

    const moveToEdit = (movie) => {
      if(permissions.includes('Edit')) {
      // Navigate to the edit-movie component and pass the movie data
      move(`/edit-movie/${movie.id}`, { state: { movieData: movie } });
      }
      else{
        showToast('Not Permitted to Edit.','info')
      }
    };
    

    return (
      <>
        <IconContext.Provider value={{ color: "#2BD17E", size: "1.5em" }}>
          <section className="movies">
            <section className="movies-panel">
              {userFavorites.length === 0 ? (
                <EmptyList />
              ) : (
                <div className="movie-grid">
                  {currentMovies?.map((movie, i) => (
                    <div key={i} className="movie-item">
                      <img
                        src={`${BASE_URL}/Images/${movie.Movie.image}`}
                        alt=""
                        className="movie-image"
                      />
                      <div className="title">
                        <p className="movie-title">{movie.Movie.name}</p>
                      </div>

                      <div className="line">
                        <div className="line1">
                          <p className="movie-date">{movie.Movie.year}</p>
                        </div>

                        <div className="line2">
                          {permissions.includes("Delete") ? (
                            <div className="delete-link">
                              <IoMdTrash
                                onClick={() => handleDelete(movie.movieId)}
                                size={20}
                                color="#fff"
                                className="delete-icon"
                              />
                            </div>
                          ) : (
                            <></>
                          )}
                          {permissions.includes("Edit") ? (
                            <div
                              onClick={() => moveToEdit(movie.Movie)}
                              className="edit-link"
                            >
                              <IoMdCreate
                                size={20}
                                color="#fff"
                                className="edit-icon"
                              />
                            </div>
                          ) : (
                            <></>
                          )}
                          <IoMdHeart
                            onClick={() => toggleFavorite(movie.movieId)}
                            className="heart"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {userFavorites.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  paginate={setCurrentPage}
                  moviesPerPage={moviesPerPage}
                  items={userFavorites}
                />
              )}
            </section>
          </section>
        </IconContext.Provider>
        <Modal
          title="Are you sure you want to delete?"
          open={isModalOpen}
          onOk={deleteMovies}
          onCancel={handleCancel}
        >
          <p>saflskdjfla</p>
        </Modal>
      </>
    );
}

export default Favourites