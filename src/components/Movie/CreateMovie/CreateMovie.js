import React, { useState, useCallback } from "react";
import { FiDownload } from "react-icons/fi";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { BASE_URL } from "../../../backendlink";
import "./createmovie.css";
import { useNavigate } from "react-router-dom";
import Footer from "../../../common/Footer/Footer";

const CreateMovie = () => {

  const move = useNavigate();
  const myuser = JSON.parse(localStorage.getItem('user'));
  const mytoken = JSON.parse(localStorage.getItem('token'));
  const [user, setUser] = useState(myuser);
  const [token, setToken] = useState(mytoken);

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

      const response = await axios.post(
        `${BASE_URL}/create-movie`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Image upload response:", response.data);

      setUserValue({
        title: "",
        publish_year: "",
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
                  />
                  <input type="submit" value="Submit" className="btn-primary" />
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

export default CreateMovie;
