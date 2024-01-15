import React, { useState, useCallback, useEffect } from "react";
import { FiDownload } from "react-icons/fi";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import "../CreateMovie/createmovie.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../../backendlink";
import Footer from "../../../common/Footer/Footer";

const EditMovie = () => {

  const location = useLocation();

  // Access the movieData from the state
  const movieData = location.state?.movieData || null;

  console.log(movieData.id);
  const move = useNavigate();
  const myuser = JSON.parse(localStorage.getItem('user'));
  const mytoken = JSON.parse(localStorage.getItem('token'));
  const [user, setUser] = useState(myuser);
  const [token, setToken] = useState(mytoken);

  // const { movieId } = useParams();
  const [userValue, setUserValue] = useState({
    img: "",
    name: "",
    year: "",
  });
  const [uploadedImage, setUploadedImage] = useState(null);

  // useEffect(() => {
  //   const fetchMovieDetails = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${BASE_URL}/movie/${movieId}`
  //       );
  //       setUserValue(response.data.data);
  //     } catch (error) {
  //       console.error("Error fetching movie details:", error.message);
  //     }
  //   };

  //   fetchMovieDetails();
  // }, [movieId]);

  const userData = (e) => {
    const { name, value } = e.target;
    setUserValue((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setUploadedImage(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  const submitUserData = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("file", uploadedImage);

      // Append other form data
      Object.entries(userValue).forEach(([key, value]) => {
        formData.append(key, value);
      });

      console.log("uploaded Image",uploadedImage);
      console.log("user Value",userValue);
      console.log("formdata", Object.fromEntries(formData));

      const response = await axios.patch(
        `${BASE_URL}/edit-movie/${movieData.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Image upload response:", response.data);

      setUserValue({
        name: "",
        year: "",
        img: "",
      });
      setUploadedImage(null);
      
      move('/movies')
    } catch (error) {
      console.error("Error uploading image:", error.message);
    }
  };

  return (
    <>
      <section className="add-new-movie">
        <div className="add-new-movie-wraper section-spacing">
          <h2>Edit Movie</h2>
          <div
            className={`add-new-movie-content ${
              isDragActive ? "drag-active" : ""
            }`}
          >
            <div className="upload-movie-img" {...getRootProps()}>
              {(uploadedImage || movieData?.image) ? (
                <img
                  src={uploadedImage ? URL.createObjectURL(uploadedImage) : `${BASE_URL}/Images/${movieData.image}`}
                  alt="Uploaded Preview"
                />
              ) : (
                <>
                  <div>
                    <FiDownload />
                  </div>
                  <div>
                    <p>Click to upload</p>
                  </div>
                </>
              )}
              <input {...getInputProps()} />
            </div>

            <div className="movie-signup-form add-movie-form">
              <form onSubmit={submitUserData}>
                <input
                  type="text"
                  placeholder={movieData.name}
                  value={userValue.name}
                  name="name"
                  onChange={userData}
                />
                <input
                  type="number"
                  placeholder={movieData.year}
                  value={userValue.year}
                  name="year"
                  onChange={userData}
                />

                <div className="add-movie-btns">
                  <input
                    type="button"
                    value="Cancel"
                    className="btn-secondary"
                  />
                  <input type="submit" value="Update" className="btn-primary" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Footer/>
    </>
  );
};

export default EditMovie;
