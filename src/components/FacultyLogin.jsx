import React, { useState } from "react";
// import "./LoginPage.css";
import styled from "styled-components";
import Header from './Header'
import Footer from './Footer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import supabase from "../config/SupabaseClient";
import { useNavigate } from 'react-router-dom';


const Fcontainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
  width:500px;
  margin: 30px;
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
    font-family: 'Arial', sans-serif;
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
    font-family: 'Arial', sans-serif;
    font-size: 16px;
    margin-bottom: 5px;
    color: #555;
  }

  input[type="text"], input[type="password"] {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    box-sizing: border-box;
    transition: border-color 0.2s;
  }

  input[type="text"]:focus, input[type="password"]:focus {
    border-color: #888;
    outline: none;
  }
  select {
    flex: 1 1 45%; /* Each input/select takes up to 45% of the container */
    padding: 10px;
    margin-top: 1px;
    border: 1px solid #ccc;
    box-sizing: border-box; /* Ensure padding is included in width */
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border-radius: 5px;
    font-size: 16px;
    transition: border-color 0.2s;
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


const FacultyLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [designation, setDesignation] = useState("");
    const navigate = useNavigate();

    // const handleSubmit = (event) => {
    //     event.preventDefault();
    //     console.log("Username:", username);
    //     console.log("Password:", password);
    //     console.log("Clicked");
    // };
    const [showPassword, setShowPassword] = useState(false);
    const handleTogglePassword = () => {
      setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
      e.preventDefault(); // Prevent the default form submission

      // Basic validation
      if (!username || !password || !designation) {
          alert("All fields are required!");
          return;
      }

      // Additional validation for email format
      // const emailPattern = /^[^\s@]+@gst\.sies\.edu\.in$/;
      // if (!emailPattern.test(email)) {
      //     alert("Please enter a valid college email address");
      //     return;
      // }

      if (designation==='admin'){
      try {
          // Fetching user data from Supabase
          const { data, error } = await supabase
              .from('admin')
              .select('*')
              .eq('a_email', username)
              .eq('a_password', password);

          if (error) {
              throw new Error(error.message);
          }

          if (data.length === 0) {
              alert("Invalid email or password.");
              return;
          }

          const admin = data[0];

          // Storing non-sensitive data
          sessionStorage.setItem('userEmail', admin.a_email);
          sessionStorage.setItem('userdesignation', designation);
          // sessionStorage.setItem('userPRN', student.a_prn);

          navigate('/add-faculty');
          console.log(data);
      } catch (error) {
          console.error("Error:", error.message);
          alert("An error occurred. Please try again.");
      }
  };
};
    return (
      <>
      <Header/>
      <center>
        <Fcontainer>
        <div className="login-page">
            <h2>Faculty Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                  <label htmlFor="password">Password:</label>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        paddingRight: '50px',
                        boxSizing: 'border-box',
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleTogglePassword}
                      style={{
                        position: 'absolute',
                        right: '0px',
                        top: '35%',
                        transform: 'translateY(-50%)',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        zIndex: 1,
                      }}
                    >
                      <FontAwesomeIcon
                          icon={showPassword ? faEyeSlash : faEye}
                          style={{ color: '#000', fontSize: '18px' }} // Adjust color and size
                        />                   
                    </button>
                  </div>
                </div>
              <div>
              <label htmlFor="designation">Designation:</label><br/>
              <select
                id="designation"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                required
              >
                <option value="">Select Designation</option>
                <option value="hod">Head of Department</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Admin</option>
              </select>
            </div>
                
                <button type="submit">Login</button>
            </form>
        </div>
        </Fcontainer>
        </center>
        <Footer/>
        </>
    );
};

export default FacultyLogin;
