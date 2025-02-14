import React, { useState, useEffect } from "react";
import styled from "styled-components";
import supabase from "../config/SupabaseClient";
import { Pie } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./Footer";
import Header from "./Header";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register necessary chart components
ChartJS.register(ArcElement, Tooltip, Legend);

// Styled components
const Button = styled.button`
  padding: 10px;
  margin: 5px;
  border-radius: 8px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s, color 0.3s;
  flex: 1;
  max-width: 100px;

  &:hover {
    background-color: #0056b3;
  }

  &:active {
    background-color: #004080;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 8px;
  }
`;

const Container = styled.div`
  width: 100%;
  margin: 10px auto;
  background-color: #f0f0f0;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1200px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between; // Align buttons to the left and right
  margin-bottom: 20px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Dropdown = styled.select`
  padding: 10px;
  border-radius: 8px;
  flex: 1;
  min-width: 150px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    width: 100%;
    padding: 8px;
  }
`;

const PercentageList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 20px;
  text-align: center;

  li {
    font-size: 18px;
    margin-bottom: 10px;
  }

  @media (max-width: 768px) {
    li {
      font-size: 16px;
    }
  }
`;

const Piediv = styled.div`
  width: 500px;
  height: 500px;

  @media (max-width: 1200px) {
    width: 400px;
    height: 400px;
  }

  @media (max-width: 768px) {
    width: 300px;
    height: 300px;
  }

  @media (max-width: 480px) {
    width: 250px;
    height: 250px;
  }
`;

const FacultyView = () => {
  const [facultySubjects, setFacultySubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [feedbackData, setFeedbackData] = useState({});
  const [feedbackPercentages, setFeedbackPercentages] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [isFaculty, setIsFaculty] = useState(false);
  const [empid, setEmpid] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkIfFaculty();
  }, []);

  const checkIfFaculty = async () => {
    const username = sessionStorage.getItem("userEmail");

    if (!username) {
      toast.error("Please log in as a faculty member.");
      navigate("/faculty-login");
      return;
    }

    const { data, error } = await supabase
      .from("faculty")
      .select()
      .eq("f_email", username);

    if (error || !data.length) {
      console.error("Error checking faculty status:", error);
      toast.error("Unauthorized access. Please log in.");
      navigate("/faculty-login");
    } else {
      setIsFaculty(true);
      fetchFacultySubjects(data[0].f_empid);
      setEmpid(data[0].f_empid);
    }
  };


  // const fetchFacultySubjects = async (f_empid) => {
  //   const { data, error } = await supabase
  //     .from("f_allocation")
  //     .select()
  //     .eq("f_empid", f_empid);

  //   if (error) {
  //     console.error("Error fetching assigned subjects:", error);
  //   } else {
  //     // Use a Set to filter unique subjects
  //     const uniqueSubjects = Array.from(
  //       new Set(data.map((subject) => subject.subject_name))
  //     ).map((subjectName) =>
  //       data.find((subject) => subject.subject_name === subjectName)
  //     );

  //     setFacultySubjects(uniqueSubjects || []);
  //   }
  // };

  const fetchFacultySubjects = async (f_empid) => {
    try {
      let allSubjects = [];
      let from = 0;
      const step = 1000; // Number of rows to fetch in each batch
  
      while (true) {
        const { data, error } = await supabase
          .from("f_allocation")
          .select()
          .eq("f_empid", f_empid)
          .range(from, from + step - 1); // Fetch data in batches of 1000
  
        if (error) {
          console.error("Error fetching assigned subjects:", error);
          break;
        }
  
        if (data.length === 0) {
          // Exit the loop if no more data is available
          break;
        }
  
        allSubjects = [...allSubjects, ...data];
        from += step; // Increment the range
      }
  
      // Use a Set to filter unique subjects
      const uniqueSubjects = Array.from(
        new Set(allSubjects.map((subject) => subject.subject_name))
      ).map((subjectName) =>
        allSubjects.find((subject) => subject.subject_name === subjectName)
      );
  
      setFacultySubjects(uniqueSubjects || []);
    } catch (error) {
      console.error("Unexpected error while fetching subjects:", error);
    }
  };
  

  const handleViewFeedback = async () => {
    if (!selectedSubject) {
      toast.error("Please select a subject.");
      return;
    }
  
    try {
      let allFeedback = [];
      let from = 0;
      const step = 1000; // Number of rows to fetch in each batch
  
      while (true) {
        const { data, error } = await supabase
          .from("feedback")
          .select("q1, q2, q3, q4, q5")
          .eq("f_empid1", empid)
          .eq("f_subject", selectedSubject)
          .range(from, from + step - 1); // Fetch data in batches of 1000
  
        if (error) {
          console.error("Error fetching feedback data:", error);
          toast.error("Failed to fetch feedback data.");
          return;
        }
  
        if (data.length === 0) {
          // Exit the loop if no more data is available
          break;
        }
  
        allFeedback = [...allFeedback, ...data];
        from += step; // Increment the range
      }
  
      if (allFeedback.length === 0) {
        toast.error("No feedback data available for the selected subject.");
        return;
      }
  
      // Calculate ratings
      const ratings = [0, 0, 0, 0, 0];
      const totalRatings = allFeedback.length * 5; // 5 questions per feedback
      let weightedSum = 0; // Sum for calculating average
  
      allFeedback.forEach((feedback) => {
        for (let i = 0; i < 5; i++) {
          const ratingValue = feedback[`q${i + 1}`]; // Accessing ratings dynamically
          if (ratingValue) {
            ratings[ratingValue - 1]++; // Increment the corresponding rating
            weightedSum += ratingValue; // Add to weighted sum for average calculation
          }
        }
      });
  
      // Calculate percentage for each rating
      const percentages = ratings.map((rating) =>
        ((rating / totalRatings) * 100).toFixed(2)
      );
  
      // Calculate average rating
      const average = (weightedSum / totalRatings).toFixed(2);
  
      // Prepare chart data
      setFeedbackData({
        labels: ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"],
        datasets: [
          {
            label: "Feedback Ratings",
            data: ratings,
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)",
              "rgba(255, 159, 64, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(54, 162, 235, 0.6)",
            ],
          },
        ],
      });
  
      // Set percentages and average rating for display
      setFeedbackPercentages(percentages);
      setAverageRating(average);
    } catch (error) {
      console.error("Unexpected error while handling feedback view:", error);
      toast.error("An unexpected error occurred.");
    }
  };
  

  // const handleViewFeedback = async () => {
  //   if (!selectedSubject) {
  //     toast.error("Please select a subject.");
  //     return;
  //   }

  //   const { data, error } = await supabase
  //     .from("feedback")
  //     .select("q1, q2, q3, q4, q5")
  //     .eq("f_empid1", empid)
  //     .eq("f_subject", selectedSubject);

  //   if (error) {
  //     console.error("Error fetching feedback data:", error);
  //     toast.error("Failed to fetch feedback data.");
  //   } else {
  //     const ratings = [0, 0, 0, 0, 0];
  //     const totalRatings = data.length * 5; // 5 questions per feedback
  //     let weightedSum = 0; // Sum for calculating average

  //     // Calculate ratings and weighted sum
  //     data.forEach((feedback) => {
  //       for (let i = 0; i < 5; i++) {
  //         const ratingValue = feedback[`q${i + 1}`]; // Accessing ratings dynamically
  //         if (ratingValue) {
  //           ratings[ratingValue - 1]++; // Increment the corresponding rating
  //           weightedSum += ratingValue; // Add to weighted sum for average calculation
  //         }
  //       }
  //     });

  //     // Calculate percentage for each rating
  //     const percentages = ratings.map((rating) =>
  //       ((rating / totalRatings) * 100).toFixed(2)
  //     );

  //     // Calculate average rating
  //     const average = (weightedSum / totalRatings).toFixed(2);

  //     // Prepare chart data
  //     setFeedbackData({
  //       labels: ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"],
  //       datasets: [
  //         {
  //           label: "Feedback Ratings",
  //           data: ratings,
  //           backgroundColor: [
  //             "rgba(255, 99, 132, 0.6)",
  //             "rgba(255, 159, 64, 0.6)",
  //             "rgba(255, 206, 86, 0.6)",
  //             "rgba(75, 192, 192, 0.6)",
  //             "rgba(54, 162, 235, 0.6)",
  //           ],
  //         },
  //       ],
  //     });

  //     // Set percentages and average rating for display
  //     setFeedbackPercentages(percentages);
  //     setAverageRating(average);
  //   }
  // };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/faculty-login");
  };

  const navBack = () => {
    navigate("/faculty");
  };

  return (
    <>
      <Header />
      {/* <div>
      <Button onClick={navBack}>Back</Button>
      <Button style={{ float: 'right' }} onClick={handleLogout}>Log Out</Button>
      </div> */}
      <Container>
        <ButtonContainer>
          <Button onClick={navBack}>Back</Button>
          <Button style={{ float: "right" }} onClick={handleLogout}>
            Log Out
          </Button>
        </ButtonContainer>
        <h2>View Feedback</h2>
        <InputContainer>
          <Dropdown
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="">Select Subject</option>
            {facultySubjects.map((subject) => (
              <option key={subject.id} value={subject.subject_name}>
                {subject.subject_name}
              </option>
            ))}
          </Dropdown>
        </InputContainer>
        <Button onClick={handleViewFeedback}>View</Button>

        {feedbackData.labels && (
          <>
            <h3>Feedback Ratings</h3>
            {/* Reduced size of the Pie chart */}
            <Piediv>
              <Pie data={feedbackData} width={150} height={150} />
            </Piediv>
            <PercentageList>
              {feedbackPercentages.map((percentage, index) => (
                <li key={index}>
                  {feedbackData.labels[index]}: {percentage}%
                </li>
              ))}
            </PercentageList>

            {/* Display Average Rating */}
            <h3>Average Rating: {averageRating} / 5</h3>
            <h3>Average Percentage: {(averageRating / 5) * 100}%</h3>
          </>
        )}
      </Container>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default FacultyView;
