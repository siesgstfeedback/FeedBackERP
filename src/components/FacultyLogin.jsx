import React, { useState } from "react";
import styled from "styled-components";
import Header from './Header';
import Footer from './Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import supabase from "../config/SupabaseClient";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Styled container for the login form
const Fcontainer = styled.div`
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

  input[type="text"], input[type="password"], select {
    width: 100%; 
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    box-sizing: border-box;
    transition: border-color 0.2s;
  }

  input[type="text"]:focus, input[type="password"]:focus, select:focus {
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

  @media (max-width: 600px) {
    h2 {
      font-size: 20px; /* Smaller font for small screens */
    }

    button {
      width: 30%; /* Full width for button on small screens */
    }
  }
`;

const BackButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 20px;
`;

const FacultyLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [designation, setDesignation] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password || !designation) {
            toast.error("All fields are required!");
            return;
        }

        try {
            let data, error;
            if (designation === 'admin') {
                ({ data, error } = await supabase
                    .from('admin')
                    .select('*')
                    .eq('a_email', username)
                    .eq('a_password', password));
            } else if (designation === 'faculty') {
                ({ data, error } = await supabase
                    .from('faculty')
                    .select('*')
                    .eq('f_email', username)
                    .eq('f_empid', password));
            } 
            else if(designation === 'ttcord') {
                if(((username==='ttcordfe@sies.edu.in') && (password==='TTCOORDFE'))||((username==='ttcordce@sies.edu.in') && (password==='TTCOORDCE'))||((username==='ttcordit@sies.edu.in') && (password==='TTCOORDIT'))||((username==='ttcordextc@sies.edu.in') && (password==='TTCOORDEXTC'))||((username==='ttcordecs@sies.edu.in') && (password==='TTCOORDECS'))||((username==='ttcordaids@sies.edu.in') && (password==='TTCOORDAIDS'))||((username==='ttcordaiml@sies.edu.in') && (password==='TTCOORDAIML'))||((username==='ttcordiot@sies.edu.in') && (password==='TTCOORDIOT'))||((username==='ttcordmech@sies.edu.in') && (password==='TTCOORDMECH'))){
                    data = {username: username, designation: designation};
                    sessionStorage.setItem('userEmail', username);
                    sessionStorage.setItem('userdesignation', designation);
                    navigate('/ttcoordpanel');
                }
                else {
                    data = undefined;
                    toast.error("Invalid email or password.");
                };
            }
            
            else {
                toast.error("Invalid designation. Please select either admin or faculty.");
                return;
            }

            if (error) {
                throw new Error(error.message);
            }

            if (data.length === 0) {
                toast.error("Invalid email or password.");
                return;
            }

            sessionStorage.setItem('userEmail', username);
            sessionStorage.setItem('userdesignation', designation);

            if (designation === 'admin' && data.length > 0) {
                navigate('/admin');
            } else if (designation === 'faculty' && data.length > 0) {
                sessionStorage.setItem('f_empid', password);
                navigate('/faculty');
            }
            

        } catch (error) {
            console.error("Error:", error.message);
            toast.error("An error occurred. Please try again.");
        }
    };

    const navigateRegister = () => {
        navigate('/');
    }

    return (
        <>
            <ToastContainer/>
            <Header />
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
                                            top: '34%',
                                            transform: 'translateY(-50%)',
                                            border: 'none',
                                            background: 'transparent',
                                            cursor: 'pointer',
                                            zIndex: 1,
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            icon={showPassword ? faEyeSlash : faEye}
                                            style={{ color: '#000', fontSize: '18px' }}
                                        />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="designation">Designation:</label><br />
                                <select
                                    id="designation"
                                    value={designation}
                                    onChange={(e) => setDesignation(e.target.value)}
                                    required
                                >
                                    <option value="">Select Designation</option>
                                    {/* <option value="hod">Head of Department</option> */}
                                    <option value="faculty">Faculty</option>
                                    <option value="admin">Admin</option>
                                    <option value="ttcord">Time Table Coord</option>
                                </select>
                            </div>
                            <BackButtonContainer>
                                <button onClick={navigateRegister}>Back</button>
                                <button type="submit">Login</button>
                            </BackButtonContainer>
                        </form>
                    </div>
                </Fcontainer>
            </center>
            <Footer />
        </>
    );
};

export default FacultyLogin;
