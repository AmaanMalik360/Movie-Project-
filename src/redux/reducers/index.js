import { combineReducers } from "redux";
import authReducers from "./authReducers";
import moviesReducers from "./moviesReducers";

const rootReducer = combineReducers({
    auth: authReducers,
    movies: moviesReducers
})

export default rootReducer;