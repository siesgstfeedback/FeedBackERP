import React, { useState, useEffect } from "react";
import profilepic from "../assets/Profile.png";
import styled from "styled-components";
import Header from "./Header";
import Footer from "./Footer";
// import supabase from "../config/SupabaseClient";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Logo = styled.img`
  max-width: 150px;
  max-height: 150px;
  text-align: center;
  border-radius: 30px;

  @media (max-width: 600px) {
  display: block;
  margin-left: 125px;
  margin-bottom:30px;
  margin-top: 20px;
  }
  @media (max-width: 480px) {
  display: block;
  margin-left: 50px;
  margin-bottom:30px;
  margin-top: 20px;

  }

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
  text-align: left;

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
    align-items: left;
    width: 100%;
  }

  label {
    font-family: "Arial", sans-serif;
    font-size: 16px;
    margin-bottom: 5px;
    color: #555;
    align-items: left;
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

  select {
    flex: 1 1 45%;
    padding: 10px;
    margin-top: 1px;
    width: 100px;
    border-radius: 5px;
    border: 1px solid #ccc;
    box-sizing: border-box;
  }

  input {
    flex: 1 1 45%;
    padding: 10px;
    margin-top: 1px;
    width: 250px;
    border-radius: 5px;
    border: 1px solid #ccc;
    box-sizing: border-box;
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
  @media (max-width: 768px){
  max-width:600px;
  }
  @media (max-width: 600px) {
  display: block;
  max-width: 400px;
  }
  @media (max-width: 480px) {
  display: block;
  max-width: 250px;
  }
  

`;

const LogButton = styled.button`
  padding: 10px;
  margin: 10px;
  max-width: 150px;
  border-radius: 5px;
  background-color: #ffffff;
  color: #000000;
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
  max-width: 150px;
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
  @media (max-width: 600px) {
      margin-left: 70px;
  }
  @media (max-width: 480px) {
      margin-left: 10px;
  }
`;

// const fetchRecord = async (email, prn) => {
//   try {
//     const { data, error } = await supabase
//       .from("student")
//       .select(
//         "s_name, s_prn, s_year, s_semester, s_branch, s_division, s_batch, s_email"
//       )
//       .eq("s_email", email)
//       .eq("s_prn", prn);

//     if (error) {
//       throw new Error(error.message);
//     }

//     if (data.length === 0) {
//       throw new Error("No student record found.");
//     }

//     const student = data[0];
//     return {
//       name: student.s_name,
//       prn: student.s_prn,
//       year: student.s_year,
//       semester: student.s_semester,
//       branch: student.s_branch,
//       division: student.s_division,
//       batch: student.s_batch,
//       email: student.s_email,
//     };
//   } catch (error) {
//     console.error("Error fetching record:", error.message);
//     return { error: error.message };
//   }
// };

const fetchRecord = async (email, prn) => {
  try {
    const res = await fetch("http://localhost:5000/api/student-record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, prn }),
    });
    const result = await res.json();

    if (!res.ok) {
      // show server‐side validation or fetch errors
      throw new Error(result.error || "Failed to fetch student record");
    }

    // result.student has your mapped fields
    return result.student;
  } catch (err) {
    console.error("Error fetching record:", err);
    toast.error(err.message);
    return { error: err.message };
  }
};

// const updateRecord = async (updatedData) => {
//   try {
//     const { error } = await supabase
//       .from("student")
//       .update({
//         s_name: updatedData.name,
//         s_prn: updatedData.prn,
//         s_year: updatedData.year,
//         s_semester: updatedData.semester,
//         s_branch: updatedData.branch,
//         s_division: updatedData.division,
//         s_batch: updatedData.batch,
//         s_email: updatedData.email,
//       })
//       .eq("s_email", updatedData.email)
//       .eq("s_prn", updatedData.prn);

//     if (error) {
//       throw new Error(error.message);
//     }

//     return { success: true };
//   } catch (error) {
//     console.error("Error updating record:", error.message);
//     return { error: error.message };
//   }
// };
const updateRecord = async (updatedData) => {
  try {
    const res = await fetch("http://localhost:5000/api/student-record", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });
    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Failed to update record");
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating record:", error.message);
    toast.error(error.message);
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
    sessionStorage.setItem("userEmail", "");
    sessionStorage.setItem("userPRN", "");
    toast.info("You have logged out!"); // Display toast on logout
    navigate("/student-login");
  };

  useEffect(() => {
    const fetchStudentData = async () => {
      const email = sessionStorage.getItem("userEmail");
      const prn = sessionStorage.getItem("userPRN");

      if (!email || !prn) {
        setError("Email or PRN not found in session storage.");
        setLoading(false);
        navigate("/student-login");
        return;
      }

      const result = await fetchRecord(email, prn);

      if (result.error) {
        setError(result.error);
      } else {
        setStudent(result);
        toast.success("Student data fetched successfully!"); // Success toast
      }

      setLoading(false);
    };

    fetchStudentData();
  }, []);

  const navFeedback = () => {
    navigate("/feedback");
  };

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
      toast.success("Profile updated successfully!"); // Success toast
      setIsEditing(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/sp-settings");
      const result = await res.json();
  
      if (!res.ok) {
        throw new Error(result.error || "Failed to fetch settings");
      }
  
      return {
        student_editing: result.student_editing,
        student_feedback: result.student_feedback,
      };
    } catch (error) {
      console.error("Error fetching settings:", error.message);
      toast.error("Error fetching settings");
      return { error: error.message };
    }
  };

  // const fetchSettings = async () => {
  //   try {
  //     const { data, error } = await supabase
  //       .from("settings")
  //       .select("student_editing, student_feedback")
  //       .eq("id", 1) // Assuming you're updating the row with id 1
  //       .single(); // Fetch a single row

  //     if (error) {
  //       throw new Error(error.message);
  //     }

  //     return data;
  //   } catch (error) {
  //     console.error("Error fetching settings:", error.message);
  //     return { error: error.message };
  //   }
  // };

  const [settings, setSettings] = useState({ editing: true, feedback: true });

  useEffect(() => {
    const fetchStudentData = async () => {
      const email = sessionStorage.getItem("userEmail");
      const prn = sessionStorage.getItem("userPRN");

      if (!email || !prn) {
        setError("Email or PRN not found in session storage.");
        setLoading(false);
        return;
      }

      const result = await fetchRecord(email, prn);

      if (result.error) {
        setError(result.error);
      } else {
        setStudent(result);
        // toast.success("Student data fetched successfully!"); // Success toast
      }

      const settingsResult = await fetchSettings();
      if (settingsResult.error) {
        setError(settingsResult.error);
      } else {
        setSettings({
          editing: settingsResult.student_editing,
          feedback: settingsResult.student_feedback,
        });
      }

      setLoading(false);
    };

    fetchStudentData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      <ToastContainer />
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
                {settings.editing && (
                  <Button onClick={handleEditToggle}>Edit Profile</Button>
                )}
              </>
            ) : (
              <form onSubmit={handleSubmit}>
                <label>
                  Name:
                  <input
                    type="text"
                    name="name"
                    value={student.name}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  PRN:
                  <input
                    type="text"
                    name="prn"
                    value={student.prn}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  Year:
                  <input
                    type="text"
                    name="year"
                    value={student.year}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  Semester:
                  <input
                    type="text"
                    name="semester"
                    value={student.semester}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  Branch:
                  <input
                    type="text"
                    name="branch"
                    value={student.branch}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  Division:
                  <input
                    type="text"
                    name="division"
                    value={student.division}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  Batch:
                  <input
                    type="text"
                    name="batch"
                    value={student.batch}
                    onChange={handleInputChange}
                  />
                </label>
                <Button type="submit">Save Changes</Button>
                <Button type="button" onClick={handleEditToggle}>
                  Cancel
                </Button>
              </form>
            )}
          </InfoDiv>
        </ProfileDiv>
        {settings.feedback && <Button onClick={navFeedback}>Feedback</Button>}
        <LogButton onClick={handleLogout}>Log Out</LogButton>
      </center>
      <Footer />
    </>
  );
};

export default StudentProfile;