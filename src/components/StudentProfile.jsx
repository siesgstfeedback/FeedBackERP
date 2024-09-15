import React, { useState, useEffect } from "react";
import profilepic from "../assets/Profile.png";
import styled from "styled-components";
import Header from './Header';
import Footer from './Footer';
import supabase from "../config/SupabaseClient";
import { useNavigate } from 'react-router-dom';


const Logo = styled.img`
  max-width: 150px;
  max-height: 150px;
  text-align: center;
  border-radius: 30px;
`;

const ProfileDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
  width: 700px;
  margin: 30px;
  border-radius: 30px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  text-align:left;

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
    align-items: left;
    width: 100%;
  }

  label {
    font-family: 'Arial', sans-serif;
    font-size: 16px;
    margin-bottom: 5px;
    color: #555;
    align-items:left;
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
    width:100px;
    border-radius: 5px;
    border: 1px solid #ccc;
    box-sizing: border-box; /* Ensure padding is included in width */
  }
  input {
    flex: 1 1 45%; /* Each input/select takes up to 45% of the container */
    padding: 10px;
    margin-top: 1px;
    width:250px;
    border-radius: 5px;
    border: 1px solid #ccc;
    box-sizing: border-box; /* Ensure padding is included in width */
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

const LogButton = styled.button`
  padding: 10px;
  margin: 10px;
  max-width:150px;
  border-radius: 5px;
  background-color: #ffffff;
  color: #000000;
  border-weight: 1px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: #777777;
    color: #ffffff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }

  &:active {
    background-color: #777777;
    color: #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transform: translateY(0);
  }
`;

const Button = styled.button`
  padding: 10px;
  margin: 10px;
  max-width:150px;
  border-radius: 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease, color 0.3s ease;

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

const InfoDiv = styled.div`
  margin-left: 50px;
`;



const fetchRecord = async (email, prn) => {
  try {
    const { data, error } = await supabase
      .from('student')
      .select('s_name, s_prn, s_year, s_semester, s_branch, s_division, s_batch, s_email')
      .eq('s_email', email)
      .eq('s_prn', prn);

    if (error) {
      throw new Error(error.message);
    }

    if (data.length === 0) {
      throw new Error('No student record found.');
    }

    const student = data[0];
    return {
      name: student.s_name,
      prn: student.s_prn,
      year: student.s_year,
      semester: student.s_semester,
      branch: student.s_branch,
      division: student.s_division,
      batch: student.s_batch,
      email: student.s_email
    };
  } catch (error) {
    console.error('Error fetching record:', error.message);
    return { error: error.message };
  }
};

const updateRecord = async (updatedData) => {
  try {
    const { error } = await supabase
      .from('student')
      .update({
        s_name: updatedData.name,
        s_prn: updatedData.prn,
        s_year: updatedData.year,
        s_semester: updatedData.semester,
        s_branch: updatedData.branch,
        s_division: updatedData.division,
        s_batch: updatedData.batch,
        s_email: updatedData.email
      })
      .eq('s_email', updatedData.email)
      .eq('s_prn', updatedData.prn);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating record:', error.message);
    return { error: error.message };
  }
};

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  
  const handleLogout = () => {   
    sessionStorage.setItem('userEmail',"");
    sessionStorage.setItem('userPRN', "");
    navigate("/student-login");
  }
  

  useEffect(() => {
    const fetchStudentData = async () => {
      const email = sessionStorage.getItem('userEmail');
      const prn = sessionStorage.getItem('userPRN');

      if (!email || !prn) {
        setError('Email or PRN not found in session storage.');
        setLoading(false);
        return;
      }

      const result = await fetchRecord(email, prn);

      if (result.error) {
        setError(result.error);
      } else {
        setStudent(result);
      }

      setLoading(false);
    };

    fetchStudentData();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateRecord(student);

    if (result.error) {
      setError(result.error);
    } else {
      setIsEditing(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      <Header />
      <center>
        <ProfileDiv>
          <div className="Logo">
            <Logo src={profilepic} alt="Student Profile" />
          </div>
          <InfoDiv>
            {!isEditing ? (
              <>
                <p>Name: {student.name}</p>
                <p>PRN: {student.prn}</p>
                <p>Branch: {student.branch}</p>
                <p>Email: {student.email}</p>
                <p>Year: {student.year}</p>
                <p>Semester: {student.semester}</p>
                <p>Division: {student.division}</p>
                <p>Batch: {student.batch}</p>
                <Button onClick={handleEditToggle}>Edit Profile</Button>
              </>
            ) : (
              <form onSubmit={handleSubmit}>
                <label>
                  Name:{student.name}
                  {/* <input
                    type="text"
                    name="name"
                    value={student.name}
                    onChange={handleInputChange}
                  /> */}
                </label>
                <br />
                <label>
                  Branch:{student.branch}
                  {/* <select name="branch" value={student.branch} onChange={handleInputChange}>
                    <option value="CE">CE</option>
                    <option value="IT">IT</option>
                    <option value="ECS">ECS</option>
                    <option value="AIML">AIML</option>
                    <option value="AIDS">AIDS</option>
                    <option value="IOT">IOT</option>
                    <option value="MECH">MECH</option>
                    <option value="EXTC">EXTC</option>
                  </select> */}
                </label>
                <br />
                <label>
                  Email:
                  <input
                    type="email"
                    name="email"
                    value={student.email}
                    onChange={handleInputChange}
                  />
                </label>
                <br />
                <label>
                  PRN:
                  <input
                    type="prn"
                    name="prn"
                    value={student.prn}
                    onChange={handleInputChange}
                  />
                </label>
                <br />
                <label>
                  Year:
                  <select name="year" value={student.year} onChange={handleInputChange}>
                    <option value="FE">FE</option>
                    <option value="SE">SE</option>
                    <option value="TE">TE</option>
                    <option value="BE">BE</option>
                    {/* Add more options if needed */}
                  </select>
                </label>
                <br />
                <label>
                  Semester:
                  <select name="semester" value={student.semester} onChange={handleInputChange}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                  </select>
                </label>
                <br />
                <label>
                  Division:
                  <select name="division" value={student.division} onChange={handleInputChange}>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="B IOT">B IOT</option>
                    <option value="B AIDS">B AIDS</option>
                    <option value="B AIML">B AIML</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                    <option value="F">F</option>
                    <option value="G">G</option>
                    <option value="H">H</option>
                  </select>
                </label>
                <br />
                <label>
                  Batch:
                  <select name="batch" value={student.batch} onChange={handleInputChange}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </label>
                <br />
                <Button type="submit">Save Changes</Button>
                <Button type="button" onClick={handleEditToggle}>
                  Cancel
                </Button>
              </form>
            )}
          </InfoDiv>
        </ProfileDiv>
        <LogButton onClick={handleLogout}>Log Out</LogButton>
      </center>
      <Footer />
    </>
  );
};

export default StudentProfile;
