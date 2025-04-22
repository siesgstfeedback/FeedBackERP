import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver"; // For downloading CSV
// import supabase from "../config/SupabaseClient";
import Header from "./Header";
import Footer from "./Footer";
import { ToastContainer, toast } from "react-toastify";
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

const FeedbackAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [feedbackData, setFeedbackData] = useState([]);
  const [facultyMap, setFacultyMap] = useState({});
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
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
        fetchFacultyNames();
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
  //     toast.error("You must be logged in to access the admin panel.");
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
  //     fetchFacultyNames();
  //   } else {
  //     toast.error("Unauthorized Access");
  //     navigate("/faculty-login");
  //   }
  // };


  const fetchFacultyNames = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/fetchfaculties"); // update with your actual backend URL
      if (!res.ok) throw new Error("Network response was not ok");
  
      const facultyData = await res.json();
  
      const map = {};
      facultyData.forEach((faculty) => {
        map[faculty.f_empid] = faculty.f_name;
      });
  
      setFacultyMap(map);
    } catch (error) {
      console.error("Error fetching faculty names:", error);
      toast.error("Error fetching faculty names.");
    }
  };
  
  // const fetchFacultyNames = async () => {
  //   const { data: facultyData, error: facultyError } = await supabase
  //     .from("faculty")
  //     .select("f_empid, f_name");

  //   if (facultyError) {
  //     console.error("Error fetching faculty names:", facultyError);
  //     toast.error("Error fetching faculty names.");
  //     return;
  //   }

  //   const map = {};
  //   facultyData.forEach((faculty) => {
  //     map[faculty.f_empid] = faculty.f_name;
  //   });

  //   setFacultyMap(map);
  // };

  // const fetchAllFeedback = async () => {
  //   if (!branch || !year) {
  //     toast.error("Please select both branch and year.");
  //     return;
  //   }
  
  //   try {
  //     const { data, error } = await supabase
  //       .from("feedback")
  //       .select("f_empid1, f_subject, q1, q2, q3, q4, q5, q6, q7")
  //       .eq("f_branch", branch)
  //       .eq("f_year", year);
  
  //     if (error) {
  //       throw error;
  //     }
  
  //     const uniqueFeedbackMap = new Map();
  
  //     data.forEach((row) => {
  //       const key = `${row.f_empid1}-${row.f_subject}`;
  //       if (!uniqueFeedbackMap.has(key)) {
  //         uniqueFeedbackMap.set(key, { ...row, count: 1 });
  //       } else {
  //         const existingRow = uniqueFeedbackMap.get(key);
  //         existingRow.q1 += row.q1;
  //         existingRow.q2 += row.q2;
  //         existingRow.q3 += row.q3;
  //         existingRow.q4 += row.q4;
  //         existingRow.q5 += row.q5;
  //         existingRow.q6 += row.q6;
  //         existingRow.q7 += row.q7;
  //         existingRow.count += 1;
  //         uniqueFeedbackMap.set(key, existingRow);
  //       }
  //     });
  
  //     const uniqueFeedbackData = Array.from(uniqueFeedbackMap.values()).map(
  //       (row) => {
  //         return {
  //           ...row,
  //           q2: (row.q2 / row.count).toFixed(3),
  //           q1: (row.q1 / row.count).toFixed(3),
  //           q3: (row.q3 / row.count).toFixed(3),
  //           q4: (row.q4 / row.count).toFixed(3),
  //           q5: (row.q5 / row.count).toFixed(3),
  //           q6: (row.q6 / row.count).toFixed(3),
  //           q7: (row.q7 / row.count).toFixed(3),
  //           facultyName: facultyMap[row.f_empid1] || "Unknown Faculty",
  //           subjectName: row.f_subject,
  //         };
  //       }
  //     );
  
  //     setFeedbackData(uniqueFeedbackData);
  //     toast.success("Feedback data fetched successfully!");
  //   } catch (error) {
  //     console.error("Error fetching feedback:", error);
  //     toast.error("Error fetching feedback. Please try again later.");
  //   }
  // };


  const fetchAllFeedback = async () => {
    if (!branch || !year) {
      toast.error("Please select both branch and year.");
      return;
    }
  
    try {
      const res = await fetch(
        `http://localhost:5000/api/feedback?branch=${branch}&year=${year}`
      );
      if (!res.ok) throw new Error("Failed to fetch");
  
      const data = await res.json();
  
      const processedData = data.map((row) => ({
        ...row,
        facultyName: facultyMap[row.f_empid1] || "Unknown Faculty",
        subjectName: row.f_subject,
      }));
  
      setFeedbackData(processedData);
      toast.success("Feedback data fetched successfully!");
    } catch (error) {
      console.error("Error fetching feedback:", error);
      toast.error("Error fetching feedback. Please try again later.");
    }
  };
  

  // const downloadCSV = (data) => {
  //   if (data.length === 0) {
  //     toast.error("No data available to download.");
  //     return;
  //   }

  //   const csvRows = [];
  //   const headers = [
  //     "Empid",
  //     "Faculty Name",
  //     "Subject Name",
  //     "Teachers Subject Knowledge",
  //     "Communication skills of the teacher",
  //     "Ability to bring conceptual clarity and promotion of thinking ability",
  //     "Teacher illustrates the concept through examples and applications",
  //     "Use of ICT (Information Communication Technology) tools",
  //     "Ability to engage students during lectures",
  //     "Fairness in internal evaluation",
  //   ];
  //   csvRows.push(headers.join(","));

  //   data.forEach((row) => {
  //     const csvRow = [
  //       row.f_empid1,
  //       row.facultyName,
  //       row.subjectName,
  //       ((parseFloat(row.q1) / 5) * 100).toFixed(2),
  //       ((parseFloat(row.q2) / 5) * 100).toFixed(2),
  //       ((parseFloat(row.q3) / 5) * 100).toFixed(2),
  //       ((parseFloat(row.q4) / 5) * 100).toFixed(2),
  //       ((parseFloat(row.q5) / 5) * 100).toFixed(2),
  //       ((parseFloat(row.q6) / 5) * 100).toFixed(2),
  //       ((parseFloat(row.q7) / 5) * 100).toFixed(2),
  //     ];
  //     csvRows.push(csvRow.join(","));
  //   });

  //   const csvString = csvRows.join("\n");
  //   const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  //   saveAs(blob, "feedback_data.csv");
  // };

  const downloadCSV = async() => {
    // await fetchAllFeedback(); 

    if (feedbackData.length === 0) {
      toast.error("No data available to download.");
      return;
    }

    const csvRows = [];
    const headers = [
      "Empid",
      "Faculty Name",
      "Subject Name",
      "Teachers Subject Knowledge",
      "Communication skills of the teacher",
      "Ability to bring conceptual clarity and promotion of thinking ability",
      "Teacher illustrates the concept through examples and applications",
      "Use of ICT (Information Communication Technology) tools",
      "Ability to engage students during lectures",
      "Fairness in internal evaluation",
      "Average Rating", // Re-add the overall average column
    ];
    csvRows.push(headers.join(","));

    feedbackData.forEach((row) => {
      // Calculate the overall average rating
      const overallAverage = (
        (parseFloat(row.q1) +
          parseFloat(row.q2) +
          parseFloat(row.q3) +
          parseFloat(row.q4) +
          parseFloat(row.q5) +
          parseFloat(row.q6) +
          parseFloat(row.q7)) /
        7
      ).toFixed(3);

      const csvRow = [
        row.f_empid1,
        row.facultyName,
        row.subjectName,
        ((parseFloat(row.q1) / 5) * 100).toFixed(3),
        ((parseFloat(row.q2) / 5) * 100).toFixed(3),
        ((parseFloat(row.q3) / 5) * 100).toFixed(3),
        ((parseFloat(row.q4) / 5) * 100).toFixed(3),
        ((parseFloat(row.q5) / 5) * 100).toFixed(3),
        ((parseFloat(row.q6) / 5) * 100).toFixed(3),
        ((parseFloat(row.q7) / 5) * 100).toFixed(3),
        ((overallAverage / 5) * 100).toFixed(3), // Ensure overall average percentage
      ];

      csvRows.push(csvRow.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "feedback_data.csv");
  };

  return (
    <>
      <ToastContainer />
      <Header />

      <Container>
        <Button onClick={() => navigate("/admin")}>Back to Admin Panel</Button>
        <Heading>Feedback Admin Panel</Heading>
        <Select onChange={(e) => setBranch(e.target.value)}>
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
        <Select onChange={(e) => setYear(e.target.value)}>
          <option value="">Select Year</option>
          <option value="FE">FE</option>
          <option value="SE">SE</option>
          <option value="TE">TE</option>
          <option value="BE">BE</option>
          <option value="ME">ME</option>
        </Select>

        <Button onClick={() => { fetchAllFeedback(); }}>Fetch Feedback</Button>
        <Button onClick={() => { downloadCSV(); }}>Download CSV</Button>
      </Container>

      <Footer />
    </>
  );
};

export default FeedbackAdmin;
