import axios from "axios";
import { BASE_URL } from "../../backendlink";
import { showToast } from "../../components/common/toasts/Toast";

export const loadMovies = (token) =>{    
    return async (dispatch) => {
      try {
        dispatch({ type: "MOVIES_REQUEST" });

        const response = await axios.get(`${BASE_URL}/movies`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          const { Movies } = response.data;
          dispatch({ type: "MOVIES_SUCCESS", payload:  Movies });
        } 
        else {
          dispatch({
            type: "MOVIES_FAILURE",
            payload: { error: response.data.message },
          });
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
}

export const loadFavourites = (userId, token) =>
{
    // Load the Favourites in redux
    return async (dispatch) => {
      try {
        dispatch({ type: "FAVOURITES_REQUEST" });
        const response = await axios.get(
          `${BASE_URL}/movies/favourites/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Favourites",response.data.favourites);
        if (response.status === 200) {
          const { favourites } = response.data;
          dispatch({
            type: "FAVOURITES_SUCCESS",
            payload: favourites 
          });
        } else {
          dispatch({
            type: "FAVOURITES_FAILURE",
            payload: { error: response.data.message },
          });
        }
      } catch (error) {
        console.error("Error fetching user favorites:", error);
      }
    };
}

export const toggleFavourites = (userId, movieId, token, userFavorites) =>
{
  // Load the Favourites in redux
  return async (dispatch) => {
    try {
      dispatch({ type: "FAVOURITES_REQUEST" });

      const response = await axios.post(
        `${BASE_URL}/movies/toggle-favourites`,
        { userId: userId, movieId: movieId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        // Movie added to favorites
        console.log("New Favourites", response.data.newFavourite);
        showToast(response.data.message, "success");
        const updatedFavorites = [...userFavorites, response.data.newFavourite];
        dispatch({
          type: "FAVOURITES_SUCCESS",
          payload: updatedFavorites,
        });
        console.log(updatedFavorites);
      } 
      else if (response.status === 200) {
        // Movie removed from favorites
        const updatedFavorites = userFavorites.filter(
          (fav) => fav.userId !== userId || fav.movieId !== movieId
        );

        dispatch({ type: "FAVOURITES_SUCCESS", payload: updatedFavorites });
        showToast(response.data.message, "success");
        console.log(updatedFavorites);
      } 
      else {
        // Other status codes (handle as needed)
        dispatch({
          type: "FAVOURITES_FAILURE",
          payload: { error: response.data.message },
        });
        showToast(response.data.message, "error");
      }
    } 
    catch (error) {
      console.error("Error toggling favorite:", error);
      // Handle error scenarios
      showToast("An error occurred while toggling favorite", "error");
    }
  };
}

export const deleteMovie = (movieId, token) =>{  
  return async (dispatch) => {
    try {
      console.log(movieId,token);
      dispatch({ type: "DELETE_MOVIE_REQUEST" });
      const response = await axios.delete(`${BASE_URL}/movies/${movieId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });      

      if(response.status == 200)
      {
        dispatch({ type: "DELETE_MOVIE_SUCCESS", payload: movieId  });
        console.log("Movie delete response:", response.data);
        showToast(response.data.message, 'success')
      }
      else if(response.status == 404)
      {
        dispatch({ type: "DELETE_MOVIE_FAILURE", payload: response.data.message  });
        showToast(response.data.message, 'info')
      }
      else{
        dispatch({ type: "DELETE_MOVIE_FAILURE", payload: response.data.message });
        showToast(response.data.message, 'error')
      }
      
    } 
    catch (error) {
      console.error("Error Deleting movies:", error.message);
      showToast("Error Deleting Movies", 'error')     
    }
  }
}


export const submitMovie = async (formData, token, move, isEdit, movieId = null) => {
  try {
    const url = isEdit ? `${BASE_URL}/movies/${movieId}` : `${BASE_URL}/movies`;
    const method = isEdit ? 'patch' : 'post';

    const response = await axios[method](url, formData, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });

    if (response.status === (isEdit ? 200 : 201)) {
      console.log("Movie upload response:", response.data);
      showToast(response.data.message, 'success');
      move('/movies');
    } else if (response.status === (isEdit ? 401 : 409)) {
      showToast(response.data.message, 'info');
    } else {
      showToast(response.data.message, 'error');
    }
  } catch (error) {
    console.error(`Error ${isEdit ? 'editing' : 'creating'} movie:`, error.message);
  }
};