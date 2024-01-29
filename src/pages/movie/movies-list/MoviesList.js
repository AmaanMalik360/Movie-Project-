import React, { useState, useEffect } from 'react';
import { IoIosAddCircleOutline, IoMdCreate, IoMdHeart, IoMdTrash} from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { IconContext } from 'react-icons';
import { BASE_URL } from '../../../backendlink';
import Pagination from '../../../components/common/pagination/Pagination';
import EmptyList from '../empty-list/EmptyList';
import "./MoviesList.css"
import {deleteMovie, loadFavourites, loadMovies, toggleFavourites } from '../../../redux/actions/movieActions';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { showToast } from '../../../components/common/toasts/Toast';
// Antd Import
import { Button, Modal } from 'antd';

const MoviesList = () => {
  const dispatch = useDispatch();
  const move = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'))
  const token = localStorage.getItem('token')

  const movies = useSelector(state => state.movies.movies)
  const userFavorites = useSelector(state => state.movies.favourites)
  const [permissions, setPermissions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [loading, setLoading] = useState(true); 
  const [currentPage, setCurrentPage] = useState(1);
  const [temp, setTemp] = useState(); 

  // Code to calculate pages
  const moviesPerPage = 8;  
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

  const fetchMovies = async () => {
    dispatch(loadMovies(token))
  }; 

  const fetchUserFavorites = async () => {
    dispatch(loadFavourites(user.id, token))    
  };
  
  const toggleFavorite = async (movieId) => {
    dispatch(toggleFavourites(user.id, movieId, token, userFavorites));
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
      try {

        // Decode the token to get user permissions
        const decodedToken = jwtDecode(token);
        const permissions = decodedToken.permissions || [];

        // Store user permissions in state
        setPermissions(permissions);
        if (token) {
          await fetchMovies(); 
        }
        if (user && token) {
          await fetchUserFavorites();
        }
      } 
      catch (error) {
        console.error('Error decoding token:', error);
      }

      setLoading(false);
    };

    fetchData();
  }, []);
  
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
      {movies.length === 0 ? (
        <div className="mt">
          <EmptyList />
        </div>
      ) : (
        <>
          <IconContext.Provider value={{ color: "#2BD17E", size: "1.5em" }}>
            <section className="movies">
                  {permissions.includes("Write") ? (
                    <section className="add-section">
                      <div className="add-div">
                        <Link to="/create-movie" className="add-heading">
                          <h2>Add a Movie</h2>
                          <IoIosAddCircleOutline
                            size={32}
                            color="white"
                            className="add-button"
                          />
                        </Link>
                      </div>
                    </section>
                  ) : (
                    <></>
                  )}

              <section className="movies-panel">
                <div className="movie-grid">
                  {currentMovies?.map((movie, i) => (
                    <div key={i} className="movie-item">
                      <img
                        src={`${BASE_URL}/Images/${movie.image}`}
                        alt=""
                        className="movie-image"
                      />
                      <div className="title">
                        <p className="movie-title">{movie.name}</p>
                      </div>

                      <div className="line">
                        <div className="line1">
                          <p className="movie-date">{movie.year}</p>
                        </div>

                        <div className="line2">

                        {permissions.includes("Delete") ? (
                          <div className="delete-link">
                            <IoMdTrash
                              onClick={() => handleDelete(movie.id)}
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
                            onClick={() => moveToEdit(movie)}
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
                            onClick={() => toggleFavorite(movie.id)}
                            color={
                              user &&
                              movie &&
                              Array.isArray(userFavorites) &&
                              userFavorites?.some(
                                (fav) =>
                                  fav?.userId === user?.id &&
                                  fav?.movieId === movie?.id
                              )
                                ? "#2BD17E" : "#093545"
                            }
                            className="heart"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {movies.length > 0 && (
                  <Pagination
                    currentPage={currentPage}
                    paginate={setCurrentPage}
                    moviesPerPage={moviesPerPage}
                    items={movies}
                  />
                )}
              </section>
            </section>
          </IconContext.Provider>
        </>
      )}
      <Modal title="Are you sure you want to delete?" open={isModalOpen} onOk={deleteMovies} onCancel={handleCancel}>
        <p>saflskdjfla</p>
        {/* <Button onClick={deleteMovies} className='modal-button'> Yes Delete.</Button> */}
      </Modal>
      

    </>
  );
};

export default MoviesList;