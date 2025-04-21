import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
// import supabase from "../config/SupabaseClient";
import Header from "./Header";
import Footer from "./Footer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Button = styled.button`
  padding: 12px 20px;
  margin: 10px;
  border-radius: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #0056b3;
  }
`;

const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 40px auto;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 16px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

const Heading = styled.h2`
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
`;

const Select = styled.select`
  padding: 10px;
  margin: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
`;

const List = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ListItem = styled.li`
  padding: 8px 0;
  font-size: 16px;
  border-bottom: 1px solid #ddd;
`;

const NotFilledStudents = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [studentsWithoutFeedback, setStudentsWithoutFeedback] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    checkIfAdmin();
  }, []);




  const checkIfAdmin = async () => {
    const email = sessionStorage.getItem('userEmail');
  
    if (!email) {
      setLoading(false);
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/check-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      const result = await response.json();
      // console.log(result);
  
      if (result.isAdmin) {
        setIsAdmin(true);
        // fetchFacultyData();
      } else {
        console.log("User is not an admin.");
        navigate("/faculty-login");
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  
    setLoading(false);
  };
  

  // const checkIfAdmin = async () => {
  //   const username = sessionStorage.getItem("userEmail");

  //   if (!username) {
  //     toast.error("You must be logged in to access this panel.");
  //     navigate("/faculty-login");
  //     return;
  //   }

  //   const { data, error } = await supabase
  //     .from("admin")
  //     .select()
  //     .eq("a_email", username);

  //   if (error) {
  //     console.error("Error checking admin status:", error);
  //   } else if (data && data.length > 0) {
  //     setIsAdmin(true);
  //   } else {
  //     toast.error("Unauthorized Access");
  //     navigate("/faculty-login");
  //   }
  // };

  // const fetchNotFilledStudents = async () => {
  //   if (!branch || !year) {
  //     toast.error("Please select both branch and year.");
  //     return;
  //   }

  //   try {
  //     // Fetch all students from the selected branch and year
  //     const { data: students, error: studentError } = await supabase
  //       .from("student")
  //       .select("s_prn")
  //       .eq("s_branch", branch)
  //       .eq("s_year", year);

  //     if (studentError) throw studentError;

  //     const studentPRNs = students.map((student) => student.s_prn);

  //     // Fetch PRNs from feedback table for the selected branch and year
  //     const { data: feedback, error: feedbackError } = await supabase
  //       .from("feedback")
  //       .select("s_prn")
  //       .eq("f_branch", branch)
  //       .eq("f_year", year);

  //     if (feedbackError) throw feedbackError;

  //     const feedbackPRNs = feedback.map((entry) => entry.s_prn);

  //     // Filter out students who have not submitted feedback
  //     const notFilledPRNs = studentPRNs.filter(
  //       (prn) => !feedbackPRNs.includes(prn)
  //     );

  //     setStudentsWithoutFeedback(notFilledPRNs);
  //   } catch (error) {
  //     console.error("Error fetching not filled students:", error);
  //   }
  // };

  // const fetchNotFilledStudents = async () => {
  //   if (!branch || !year) {
  //     toast.error("Please select both branch and year.");
  //     return;
  //   }

  //   try {
  //     let studentPRNs = [];
  //     let offset = 0;
  //     const limit = 1000;

  //     // Fetch all students from the selected branch and year in batches
  //     while (true) {
  //       const { data: students, error: studentError } = await supabase
  //         .from("student")
  //         .select("s_prn")
  //         .eq("s_branch", branch)
  //         .eq("s_year", year)
  //         .range(offset, offset + limit - 1); // Fetch rows in batches of 1000

  //       if (studentError) throw studentError;
  //       if (students.length === 0) break; // No more data to fetch

  //       studentPRNs = [
  //         ...studentPRNs,
  //         ...students.map((student) => student.s_prn),
  //       ];
  //       offset += limit;
  //     }

  //     let feedbackPRNs = [];
  //     offset = 0;

  //     // Fetch all feedback entries in batches
  //     while (true) {
  //       const { data: feedback, error: feedbackError } = await supabase
  //         .from("feedback")
  //         .select("s_prn")
  //         .eq("f_branch", branch)
  //         .eq("f_year", year)
  //         .range(offset, offset + limit - 1);

  //       if (feedbackError) throw feedbackError;
  //       if (feedback.length === 0) break;

  //       feedbackPRNs = [
  //         ...feedbackPRNs,
  //         ...feedback.map((entry) => entry.s_prn),
  //       ];
  //       offset += limit;
  //     }

  //     // Filter out students who have not submitted feedback
  //     const notFilledPRNs = studentPRNs.filter(
  //       (prn) => !feedbackPRNs.includes(prn)
  //     );

  //     setStudentsWithoutFeedback(notFilledPRNs);
  //   } catch (error) {
  //     console.error("Error fetching not filled students:", error);
  //   }
  // };


  
const fetchNotFilledStudents = async () => {
  if (!branch || !year) {
    toast.error("Please select both branch and year.");
    return;
  }

  try {
    const res = await fetch(
      `http://localhost:5000/api/not-filled-students?branch=${encodeURIComponent(branch)}&year=${encodeURIComponent(year)}`
    );
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to fetch students");
    }

    setStudentsWithoutFeedback(data); // the array of PRNs
  } catch (err) {
    console.error("Error fetching not filled students:", err);
    toast.error("Error fetching students who haven't submitted feedback.");
  }
};

  if (!isAdmin) {
    return null;
  }
  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/faculty-login");
  };
  return (
    <>
      <ToastContainer />
      <Header />
      <Container>
        <Button onClick={() => navigate("/admin")}>Back to Admin Panel</Button>
        <Button onClick={handleLogout}>Log Out</Button>
        <Heading>Not Filled Feedback Students</Heading>
        <Select onChange={(e) => setBranch(e.target.value)} value={branch}>
          <option value="">Select Branch</option>
          <option value="CE">CE</option>
          <option value="IT">IT</option>
          <option value="ECS">ECS</option>
          <option value="EXTC">EXTC</option>
          <option value="AIDS">AIDS</option>
          <option value="AIML">AIML</option>
          <option value="IOT">IOT</option>
          <option value="MECH">MECH</option>
        </Select>
        <Select onChange={(e) => setYear(e.target.value)} value={year}>
          <option value="">Select Year</option>
          <option value="FE">FE</option>
          <option value="SE">SE</option>
          <option value="TE">TE</option>
          <option value="BE">BE</option>
          <option value="ME">ME</option>
        </Select>
        <Button onClick={fetchNotFilledStudents}>Fetch Not Filled PRNs</Button>
        {studentsWithoutFeedback.length > 0 && (
          <>
            <h3>Students who haven't submitted feedback:</h3>
            <List>
              {studentsWithoutFeedback.map((prn) => (
                <ListItem key={prn}>{prn}</ListItem>
              ))}
            </List>
          </>
        )}
        {studentsWithoutFeedback.length === 0 && (
          <>
            <h3>No students found</h3>
          </>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default NotFilledStudents;
