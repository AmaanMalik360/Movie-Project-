import React from "react";
import { Link } from "react-router-dom";
import "./EmptyList.css"

const EmptyList = () => {
  return (
    <>
      <section className="movie-not-found">
        <div className="movie-not-found-wrapper">
          <h2>Your Favourite movies list is empty</h2>
          <Link to="/create-movie" className="btn-primary">
            Add a new movie
          </Link>
        </div>
      </section>
    </>
  );
};

export default EmptyList;