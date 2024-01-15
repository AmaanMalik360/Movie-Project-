

export const addMovies = () =>
{
    // Load the blogs in redux
    const loadMovies = (movies) => (dispatch) => {

        dispatch({ type: "MOVIES_DATA_REQUEST" });
        
        localStorage.setItem('movies', JSON.stringify(movies));
        console.log("movies received",movies);
        if(movies)
        {
            dispatch({
                type: "MOVIES_DATA_SUCCESS",
                payload: {
                    movies
                }
            })
        }
        else
        {
            dispatch({
                type: "MOVIES_DATA_FAILURE",                
                payload: {
                    error: "Error Occurred" 
                }
            })
        }
        console.log(movies);

    }

    return loadBlogs;
}
