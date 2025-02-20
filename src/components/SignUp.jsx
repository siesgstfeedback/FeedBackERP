import React, { useState } from "react";
import styled from "styled-components";
import supabase from "../config/SupabaseClient";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Button = styled.button`
  padding: 10px;
  margin: 10px;
  border-radius: 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background-color: #ffffff;
    color: #007bff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }

  &:active {
    background-color: #0056b3;
    color: #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transform: translateY(0);
  }
`;

const Container = styled.div`
  max-width: 700px; /* Limits the maximum width */
  margin: 30px auto; /* Center the container */
  background-color: #f0f0f0;
  border-radius: 30px;
  padding: 40px; /* Increased padding for better spacing */
  display: flex;
  justify-content: center;
  flex-direction: column;
  box-sizing: border-box; /* Includes padding in width calculations */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Softer shadow */
  
  &:hover {
    background-color: #e8e8e8;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2), 0 12px 40px rgba(0, 0, 0, 0.2);
    transform: scale(1.02); /* Slight scaling for a subtle effect */
  }
  transition: all 0.3s ease;
`;

const HeroDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5px;
`;

const LogDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SignDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  font-weight: 600; /* Bold for better emphasis */
  margin: 0;
  font-size: 24px; /* Slightly larger for better visibility */
  color: #333; /* Darker color for better contrast */
`;

const FormContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr; /* One column by default for mobile */
  gap: 20px; /* Space between the columns */
  width: 100%;
  
  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr); /* Two columns for larger screens */
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%; /* Ensure full width */

  label {
    margin-bottom: 5px;
    font-weight: bold;
    color: #555; /* Slightly darker for better readability */
  }

  input, select {
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    box-sizing: border-box; /* Ensure padding is included in width */
    transition: border-color 0.3s ease;

    &:focus {
      border-color: #007bff; /* Highlight focus state */
      outline: none;
    }
  }
`;

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [prn, setPrn] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [year, setYear] = useState("");
  const [branch, setBranch] = useState("");
  const [batch, setBatch] = useState("");
  const [division, setDivision] = useState("");
  const [semester, setSemester] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
  
    // Basic validation
    if (!username || !prn || !email || !password || !year || !branch || !semester || !division || !batch ) {
      toast.error("All fields are required!");
      return;
    }
  
    // Additional validation for email format
    const emailPattern = /^[^\s@]+@gst\.sies\.edu\.in$/;
    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid college email address");
      return;
    }

    const { data: emailData, error: emailError } = await supabase
      .from("student")
      .select("*")
      .eq("s_email", email)
      .single();

    if (emailError && emailError.code !== 'PGRST116') {
      console.error("Error checking email:", emailError);
      return;
    }
    if (emailData) {
      toast.error("Email already exists!");
      return;
    }

    // Check if the PRN already exists
    const { data: prnData, error: prnError } = await supabase
      .from("student")
      .select("*")
      .eq("s_prn", prn)
      .single();

    if (prnError && prnError.code !== 'PGRST116') {
      console.error("Error checking PRN:", prnError);
      return;
    }
    if (prnData) {
      toast.error("PRN already exists!");
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from("student")
        .insert([{ 
          s_name: username, 
          s_email: email, 
          s_prn: prn, 
          s_year: year, 
          s_semester:semester,
          s_branch: branch, 
          s_division: division, 
          s_batch: batch,
          s_password: password
          // Date-time will be handled by your database's now() function, so no need to manually insert it here.
        }]);
      if (error) {
        console.error("Error inserting record:", error);
      } else {
        // console.log("Record inserted:", data);
        toast.success("Signed in Successfully!!");
        // Clear form fields
        setUsername("");
        setPrn("");
        setEmail("");
        setPassword("");
        setYear("");
        setBranch("");
        setDivision("");
        setBatch("");
        setSemester("");
        navigate('/student-login');
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
    console.log("Submit Clicked!!");
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <ToastContainer />
      <Header />
      <center>
        <Container>
          <LogDiv>
            <HeroDiv>
              <Title>Login</Title> {/* Enhanced title */}
            </HeroDiv>
            <HeroDiv>
              <Button onClick={() => navigate('/faculty-login')}>Faculty</Button>
              <Button onClick={() => navigate('/student-login')}>Student</Button>
            </HeroDiv>
          </LogDiv>
          {/* <SignDiv>
            <HeroDiv>
              <Title>Sign Up</Title>
            </HeroDiv>
            <form onSubmit={handleSubmit}>
              <FormContainer>
                <InputGroup>
                  <label htmlFor="name">Name:</label>
                  <input
                    type="text"
                    id="name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </InputGroup>
                <InputGroup>
                  <label htmlFor="prn">PRN:</label>
                  <input
                    type="text"
                    id="prn"
                    value={prn}
                    onChange={(e) => setPrn(e.target.value)}
                    required
                  />
                </InputGroup>
                <InputGroup>
                  <label htmlFor="email">E-mail ID:</label>
                  <input
                    type="text"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </InputGroup>
                <InputGroup>
                  <label htmlFor="year">Year:</label>
                  <select
                    id="year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                  >
                    <option value="">Select Year</option>
                    <option value="FE">FE</option>
                    <option value="SE">SE</option>
                    <option value="TE">TE</option>
                    <option value="BE">BE</option>
                  </select>
                </InputGroup>
                <InputGroup>
                  <label htmlFor="branch">Branch:</label>
                  <select
                    id="branch"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    required
                  >
                    <option value="">Select Branch</option>
                    <option value="CE">CE</option>
                    <option value="IT">IT</option>
                    <option value="EXTC">EXTC</option>
                    <option value="COMP">COMP</option>
                  </select>
                </InputGroup>
                <InputGroup>
                  <label htmlFor="division">Division:</label>
                  <select
                    id="division"
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    required
                  >
                    <option value="">Select Division</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                  </select>
                </InputGroup>
                <InputGroup>
                  <label htmlFor="batch">Batch:</label>
                  <select
                    id="batch"
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    required
                  >
                    <option value="">Select Batch</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                  </select>
                </InputGroup>
                <InputGroup>
                  <label htmlFor="semester">Semester:</label>
                  <select
                    id="semester"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    required
                  >
                    <option value="">Select Semester</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                  </select>
                </InputGroup>
                <InputGroup>
                  <label htmlFor="password">Password:</label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{ flex: 1 }} // Allow input to grow
                    />
                    <button
                      type="button"
                      onClick={handleTogglePassword}
                      style={{ marginLeft: '10px', border: 'none', background: 'none', cursor: 'pointer' }}
                    >
                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                </InputGroup>
              </FormContainer>
              <Button type="submit">Sign Up</Button>
            </form>
          </SignDiv> */}
        </Container>
      </center>
      <Footer />
    </>
  );
};

export default SignUp;