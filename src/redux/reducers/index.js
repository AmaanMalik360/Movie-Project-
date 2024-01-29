import { combineReducers } from "redux";
import authReducers from "./authReducers";
import moviesReducers from "./moviesReducers";
import adminReducer from "./adminReducer";

const rootReducer = combineReducers({
    auth: authReducers,
    movies: moviesReducers,
    admin: adminReducer
})

export default rootReducer;