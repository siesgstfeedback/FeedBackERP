import React, { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Header from "./Header";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import supabase from "../config/SupabaseClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Scontainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
  width: 90%; /* Adjust width for responsiveness */
  max-width: 500px;
  margin: 30px auto;
  border-radius: 30px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background-color: #e8e8e8;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2), 0 12px 40px rgba(0, 0, 0, 0.2);
    transform: scale(1.05);
  }

  h2 {
    font-family: "Arial", sans-serif;
    font-weight: bold;
    font-size: 24px;
    margin-bottom: 20px;
    color: #333;
    text-align: center;
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  label {
    font-family: "Arial", sans-serif;
    font-size: 16px;
    margin-bottom: 5px;
    color: #555;
  }

  input[type="text"],
  input[type="password"] {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    box-sizing: border-box;
    transition: border-color 0.2s;
  }

  input[type="text"]:focus,
  input[type="password"]:focus {
    border-color: #888;
    outline: none;
  }

  button {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.2s, transform 0.2s;
  }

  button:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
  }

  button:active {
    background-color: #004080;
    transform: translateY(0);
  }
`;

const BackButtonContainer = styled.div`
  display: flex;
  justify-content: space-around; /* Adjusts spacing between buttons */
  width: 100%; /* Ensures it takes the full width of the form */
  margin-top: 20px;
  /* Optional: adds space above the button container */
`;

const StudentLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Basic validation
    if (!email || !password) {
      toast.error("All fields are required!");
      return;
    }

    // Additional validation for email format
    const emailPattern = /^[^\s@]+@gst\.sies\.edu\.in$/;
    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid college email address");
      return;
    }

    try {
      // Fetching user data from Supabase
      const { data, error } = await supabase
        .from("student")
        .select("*")
        .eq("s_email", email)
        .eq("s_prn", password);

      if (error) {
        throw new Error(error.message);
      }

      if (data.length === 0) {
        toast.error("Invalid email or password.");
        return;
      }

      const student = data[0];

      // Storing non-sensitive data
      sessionStorage.setItem("userEmail", student.s_email);
      sessionStorage.setItem("userPRN", student.s_prn);
      navigate("/student-profile");
      // console.log(data);
    } catch (error) {
      console.error("Error:", error.message);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const navigateRegister = () => {
    navigate("/");
  };

  return (
    <>
      <ToastContainer />
      <Header />
      <center>
        <Scontainer>
          <div className="login-page">
            <h2>Student Login</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email">Email:</label>
                <input
                  type="text"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="password">Password:</label>
                <div style={{ position: "relative", width: "100%" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      paddingRight: "50px",
                      boxSizing: "border-box",
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleTogglePassword}
                    style={{
                      position: "absolute",
                      right: "0px",
                      top: "34%",
                      transform: "translateY(-50%)",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      zIndex: 1,
                    }}
                  >
                    <FontAwesomeIcon
                      icon={showPassword ? faEyeSlash : faEye}
                      style={{ color: "#000", fontSize: "18px" }} // Adjust color and size
                    />
                  </button>
                </div>
              </div>
              <BackButtonContainer>
                <button onClick={navigateRegister}>Back</button>
                <button type="submit">Login</button>
              </BackButtonContainer>{" "}
            </form>
          </div>
        </Scontainer>
      </center>
      <Footer />
    </>
  );
};

export default StudentLoginPage;
