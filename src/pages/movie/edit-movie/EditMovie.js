import React, { useState, useCallback} from "react";
import { FiDownload } from "react-icons/fi";
import { useDropzone } from "react-dropzone";
import "../create-movie/CreateMovie.css";
import { useLocation, useNavigate} from "react-router-dom";
import { BASE_URL } from "../../../backendlink";
import { showToast } from "../../../components/common/toasts/Toast";
import { submitMovie } from "../../../redux/actions/movieActions";
import { useSelector } from "react-redux";

const EditMovie = () => {

  const location = useLocation();
  const move = useNavigate();
  // Access the movieData from the state
  const movieData = location.state?.movieData || null;
  
  console.log(movieData.year);
  const token = localStorage.getItem('token') 

  const [userValue, setUserValue] = useState({
    img: "",
    name: movieData.name,
    year: parseInt(movieData.year),
  });
  const [uploadedImage, setUploadedImage] = useState(null);

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
    // Perform year validation before submitting
    const yearValue = parseInt(userValue.year, 10);
    if (isNaN(yearValue) || yearValue < 1900) {
      // Handle the case where the year is invalid (not a number or less than 1900)
      showToast("Invalid year. Please enter a year 1900 or above.", "error");
      return;
    }
    const formData = new FormData();
    formData.append("file", uploadedImage);

    // Append other form data
    Object.entries(userValue).forEach(([key, value]) => {
      formData.append(key, value);
    });

    submitMovie(formData, token, move, true, movieData.id);

    setUserValue({ title: "", year: 0, img: ""});
    setUploadedImage(null);
  };

  const handleCancel = () =>{
    move(-1);
  }

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
                  // placeholder={userValue.name}
                  value={userValue.name}
                  name="name"
                  required
                  onChange={userData}
                />
                <input
                  type="number"
                  // placeholder={userValue.year}
                  value={userValue.year}
                  name="year"
                  required
                  onChange={userData}
                />

                <div className="add-movie-btns">
                  <input
                    type="button"
                    value="Cancel"
                    onClick={handleCancel}
                    className="btn-secondary"
                  />
                  <input type="submit" value="Update" className="btn-primary" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default EditMovie;
