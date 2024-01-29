import React, { useState, useCallback } from "react";
import { FiDownload } from "react-icons/fi";
import { useDropzone } from "react-dropzone";
import "./CreateMovie.css";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../../components/common/toasts/Toast";
import { submitMovie } from "../../../redux/actions/movieActions";
import { useSelector } from "react-redux";

const CreateMovie = () => {

  const move = useNavigate();
  const token = localStorage.getItem('token')
  
  const [userValue, setUserValue] = useState({
    img: "",
    name: "",
    year: "",
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

    submitMovie(formData, token, move, false);

    setUserValue({ title: "", year: 0, img: "" });
    setUploadedImage(null);
  };
  
  const handleCancel = () =>{
    move(-1);
  }

  return (
    <>
      <section className="add-new-movie">
        <div className="add-new-movie-wraper section-spacing">
          <h2>Create a new movie</h2>
          <div
            className={`add-new-movie-content ${
              isDragActive ? "drag-active" : ""
            }`}
          >
            <div className="upload-movie-img" {...getRootProps()}>
              {uploadedImage ? (
                <img
                  src={URL.createObjectURL(uploadedImage)}
                  alt="Uploaded Preview"
                />
              ) : (
                <div >
                  <div>
                    <FiDownload />
                  </div>
                  <div>
                    <p>Click to upload</p>
                  </div>
                </div>
              )}
              <input {...getInputProps()} />
            </div>

            <div className="movie-signup-form add-movie-form">
              <form onSubmit={submitUserData}>
                <input
                  type="text"
                  placeholder="Title"
                  value={userValue.name}
                  name="name"
                  onChange={userData}
                />
                <input
                  type="number"
                  placeholder="Publishing year"
                  value={userValue.year}
                  name="year"
                  onChange={userData}
                />

                <div className="add-movie-btns">
                  <input
                    type="button"
                    value="Cancel"
                    className="btn-secondary"
                    onClick={handleCancel}
                  />
                  <input type="submit" value="Submit" className="btn-primary" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default CreateMovie;