const initialState = {
    movies: [],
    favourites: [],
    movie: {},
    isLoading: false,
    error: null,
  };
  
export default (state = initialState, action) => 
{
    switch (action.type) {
      case "MOVIES_REQUEST":
        state = {
          ...state,
          isLoading: true,
        };
        break;

      case "MOVIES_SUCCESS":
        state = {
          ...state,
          movies: action.payload,
          isLoading: false,
        };
        break;

      case "MOVIES_FAILURE":
        state = {
          ...state,
          isLoading: false,
          error: action.payload.error,
        };
        break;

      case "FAVOURITES_REQUEST":
        state = {
          ...state,
          isLoading: true,
        };
        break;

      case "FAVOURITES_SUCCESS":
        state = {
          ...state,
          favourites: action.payload,
          isLoading: false,
        };
        break;

      case "FAVOURITES_FAILURE":
        state = {
          ...state,
          isLoading: false,
          error: action.payload.error,
        };
        break;
      
        case "DELETE_MOVIE_REQUEST":
        state = {
          ...state,
          isLoading: true,
        };
        break;

      case "DELETE_MOVIE_SUCCESS":
        state = {
            ...state,
            movies: state.movies.filter(movie => movie.id !== action.payload),
            isLoading: false,
        };
        break;

      case "DELETE_MOVIE_FAILURE":
        state = {
          ...state,
          isLoading: false,
          error: action.payload.error,
        };
        break;

      case "CLEAR_MOVIES":
        state = {
          ...initialState,
        };
        break;
    }
return state;
};