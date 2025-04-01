import React, { useState, useEffect } from "react";
import styled from "styled-components";
import supabase from "../config/SupabaseClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const FormContainer = styled.div`
  margin: 20px 0;
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Button = styled.button`
  padding: 10px 15px;
  border: none;
  border-radius: 8px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
  max-width: 200px;

  &:hover {
    background-color: #0056b3;
  }
`;

const StarRating = styled.span`
  font-size: 24px;
  cursor: pointer;
  color: ${(props) => (props.selected ? "#FFD700" : "#ccc")};
`;

const FeedbackForm = () => {
  const [allocations, setAllocations] = useState([]);
  const [facultyNames, setFacultyNames] = useState({});
  const [feedback, setFeedback] = useState({});
  const [filledFeedbacks, setFilledFeedbacks] = useState([]);
  const [student, setStudent] = useState(null);
  const [currentFacultyIndex, setCurrentFacultyIndex] = useState(0);
  const studentPrn = sessionStorage.getItem("userPRN");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (studentPrn) {
      fetchStudentDetails();
    } else {
      console.error("Student PRN is not available.");
      navigate("/student-login");
      toast.error("Student PRN is not available.");
    }
  }, [studentPrn]);

  const fetchStudentDetails = async () => {
    const { data, error } = await supabase
      .from("student")
      .select("*")
      .eq("s_prn", studentPrn)
      .single();

    if (error) {
      toast.error("Error fetching student details.");
    } else {
      setStudent(data);
      fetchAllocations(data);
      fetchFilledFeedbacks(data);
    }
  };

  // const fetchAllocations = async (studentData) => {
  //   const { data, error } = await supabase
  //     .from("f_allocation")
  //     .select("*")
  //     .eq("subject_branch", studentData.s_branch)
  //     .eq("subject_semester", studentData.s_semester)
  //     .eq("division", studentData.s_division)
  //     .or(`batch.eq.${studentData.s_batch},batch.is.null`);

  //   if (error) {
  //     toast.error("Error fetching allocations.");
  //   } else {
  //     setAllocations(data);
  //     fetchFacultyNames(data);
  //   }
  // };

  const fetchAllocations = async (studentData) => {
    try {
      let combinedData = [];

      // Fetch theory subjects
      const { data: theoryData, error: theoryError } = await supabase
        .from("f_allocation")
        .select("*")
        .eq("subject_type", "Theory")
        .eq("subject_branch", studentData.s_branch)
        .eq("subject_semester", studentData.s_semester)
        .eq("division", studentData.s_division);

      if (theoryError) {
        console.error("Error fetching theory subjects:", theoryError.message);
      } else {
        combinedData = [...combinedData, ...theoryData];
      }

      // Fetch lab subjects
      const { data: labData, error: labError } = await supabase
        .from("f_allocation")
        .select("*")
        .eq("subject_type", "Lab")
        .eq("subject_branch", studentData.s_branch)
        .eq("subject_semester", studentData.s_semester)
        .eq("division", studentData.s_division)
        .or(`batch.eq.${studentData.s_batch},batch.is.null`);

      if (labError) {
        console.error("Error fetching lab subjects:", labError.message);
      } else {
        combinedData = [...combinedData, ...labData];
      }

      // Fetch ILO subjects
      if (studentData.s_ilo) {
        const { data: iloData, error: iloError } = await supabase
          .from("f_allocation")
          .select("*")
          .eq("subject_name", studentData.s_ilo)
          .eq("subject_branch", studentData.s_branch)
          .eq("subject_semester", studentData.s_semester)
          .eq("division", studentData.s_division);

        if (iloError) {
          console.error("Error fetching ILO subjects:", iloError.message);
        } else {
          combinedData = [...combinedData, ...iloData];
        }
      }

      // Fetch DLO1 subjects
      if (studentData.s_dlo1) {
        const { data: dlo1Data, error: dlo1Error } = await supabase
          .from("f_allocation")
          .select("*")
          .eq("subject_name", studentData.s_dlo1)
          .eq("subject_branch", studentData.s_branch)
          .eq("subject_semester", studentData.s_semester)
          .eq("division", studentData.s_division);

        if (dlo1Error) {
          console.error("Error fetching DLO1 subjects:", dlo1Error.message);
        } else {
          combinedData = [...combinedData, ...dlo1Data];
        }
      }

      // Fetch DLO1 lab
      if (studentData.s_dlo1_lab) {
        const { data: dlo1_labData, error: dlo1_labError } = await supabase
          .from("f_allocation")
          .select("*")
          .eq("subject_name", studentData.s_dlo1_lab)
          .eq("subject_branch", studentData.s_branch)
          .eq("subject_semester", studentData.s_semester)
          .eq("division", studentData.s_division)
          .or(`batch.eq.${studentData.s_batch},batch.is.null`);

        if (dlo1_labError) {
          console.error("Error fetching DLO1 Lab:", dlo1_labError.message);
        } else {
          combinedData = [...combinedData, ...dlo1_labData];
        }
      }

      // Fetch DLO2 subjects
      if (studentData.s_dlo2) {
        const { data: dlo2Data, error: dlo2Error } = await supabase
          .from("f_allocation")
          .select("*")
          .eq("subject_name", studentData.s_dlo2)
          .eq("subject_branch", studentData.s_branch)
          .eq("subject_semester", studentData.s_semester)
          .eq("division", studentData.s_division);

        if (dlo2Error) {
          console.error("Error fetching DLO2 subjects:", dlo2Error.message);
        } else {
          combinedData = [...combinedData, ...dlo2Data];
        }
      }

      // Fetch DLO2 lab
      if (studentData.s_dlo2_lab) {
        const { data: dlo2_labData, error: dlo2_labError } = await supabase
          .from("f_allocation")
          .select("*")
          .eq("subject_name", studentData.s_dlo2_lab)
          .eq("subject_branch", studentData.s_branch)
          .eq("subject_semester", studentData.s_semester)
          .eq("division", studentData.s_division)
          .or(`batch.eq.${studentData.s_batch},batch.is.null`);

        if (dlo2_labError) {
          console.error("Error fetching DLO2 Lab:", dlo2_labError.message);
        } else {
          combinedData = [...combinedData, ...dlo2_labData];
        }
      }
      combinedData.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
      console.log(combinedData);
      // Update state and fetch faculty names
      setAllocations(combinedData);
      fetchFacultyNames(combinedData);
    } catch (err) {
      console.error("Unexpected Error in fetchAllocations:", err);
      toast.error("Unexpected error occurred while fetching allocations.");
    }
  };

  const fetchFacultyNames = async (allocationsData) => {
    const facultyEmpIds = allocationsData.map((alloc) => alloc.f_empid);
    const { data: facultyData, error } = await supabase
      .from("faculty")
      .select("f_empid, f_name")
      .in("f_empid", facultyEmpIds);

    if (error) {
      toast.error("Error fetching faculty names.");
    } else {
      const facultyMap = {};
      facultyData.forEach((faculty) => {
        facultyMap[faculty.f_empid] = faculty.f_name;
      });
      setFacultyNames(facultyMap);
    }
  };

  const fetchFilledFeedbacks = async (studentData) => {
    const { data, error } = await supabase
      .from("feedback")
      .select("*")
      .eq("s_prn", studentData.s_prn);

    if (error) {
      toast.error("Error fetching filled feedbacks.");
    } else {
      setFilledFeedbacks(data);
      setCurrentFacultyIndex(data.length); // Update the current index based on filled feedbacks
    }
  };

  const handleStarClick = (questionKey, rating) => {
    setFeedback((prevFeedback) => ({
      ...prevFeedback,
      [questionKey]: rating,
    }));
  };

  const handleSubmit = async (e, allocation) => {
    e.preventDefault();
    setIsSubmitting(true);

    const requiredQuestions = ["q1", "q2", "q3", "q4", "q5", "q6", "q7"];
    const unansweredQuestions = requiredQuestions.filter(
      (question) => !feedback[question]
    );

    if (unansweredQuestions.length > 0) {
      toast.error("Please provide feedback for all questions.");
      setIsSubmitting(false);
      return;
    }

    const feedbackData = {
      ...feedback,
      s_prn: studentPrn,
      f_empid1: allocation.f_empid,
      f_subject: allocation.subject_name,

      f_year: student.s_year,
      f_branch: student.s_branch,
    };

    const { error } = await supabase.from("feedback").insert([feedbackData]);

    if (error) {
      toast.error("Error submitting feedback.");
      setIsSubmitting(false);
    } else {
      toast.success("Feedback submitted successfully!");
      setFilledFeedbacks((prev) => [...prev, feedbackData]);
      setFeedback({}); // Reset feedback after submission

      // Move to the next faculty feedback form or show completion message
      if (currentFacultyIndex + 1 < allocations.length) {
        setCurrentFacultyIndex(currentFacultyIndex + 1);
      } else {
        toast.success("Feedback for all subjects has been submitted.");
        setCurrentFacultyIndex(allocations.length); // All feedbacks filled
      }
      setIsSubmitting(false);
    }
  };

  const isFeedbackGiven = (facultyId, subjectName) => {
    return filledFeedbacks.some(
      (feedback) =>
        feedback.f_empid1 === facultyId && feedback.f_subject === subjectName
    );
  };

  const handleLogout = () => {
    sessionStorage.removeItem("userPRN");
    navigate("/student-login");
  };

  const handleProfileRedirect = () => {
    navigate("/student-profile");
  };

  return (
    <Container>
      <Header />
      <FormContainer>
        <h2>Name: {student ? student.s_name : "Loading..."}</h2>
        <br />
        <h2>PRN: {studentPrn}</h2>
        <p>
          Feedback filled: {filledFeedbacks.length} out of {allocations.length}
        </p>

        {allocations.length > 0 && currentFacultyIndex < allocations.length ? (
          <form
            onSubmit={(e) => handleSubmit(e, allocations[currentFacultyIndex])}
          >
            <h3>
              Faculty:{" "}
              {facultyNames[allocations[currentFacultyIndex].f_empid] ||
                "Loading..."}{" "}
              <br />
              Subject: {allocations[currentFacultyIndex].subject_name}
              <br />
              Type: {allocations[currentFacultyIndex].subject_type}
            </h3>
            <table>
              <tbody>
                {[
                  "Teachers Subject Knowledge",
                  "Communication skills of the teacher",
                  "Ability to bring conceptual clarity and promotion of thinking ability",
                  "Teacher illustrates the concept through examples and applications",
                  "Use of ICT (Information Communication Technology) tools",
                  "Ability to engage students during lectures",
                  "Fairness in internal evaluation",
                ].map((question, qIndex) => (
                  <>
                    <tr key={qIndex} style={{ padding: "10px 0" }}>
                      {" "}
                      {/* Add padding here */}
                      <td style={{ paddingRight: "20px" }}>
                        {qIndex + 1}. {question}
                      </td>{" "}
                      {/* Add padding between question and stars */}
                      <td>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarRating
                            key={`${allocations[currentFacultyIndex].subject_name}-${qIndex}-${star}`}
                            onClick={() =>
                              handleStarClick(`q${qIndex + 1}`, star)
                            }
                            selected={feedback[`q${qIndex + 1}`] >= star}
                          >
                            ★
                          </StarRating>
                        ))}
                      </td>
                    </tr>

                    <tr key={`blank-${qIndex}`}>
                      <td colSpan={2}>&nbsp;</td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
            <br />
            <br />
          </form>
        ) : (
          <p>
            <h2>
              <i>Feedback for all subjects has been provided.</i>
            </h2>
          </p>
        )}
        <br />
        <br />
        <br />
        <br />

        <Button onClick={handleLogout}>Logout</Button>
        <br /><br />
        <Button onClick={handleProfileRedirect}>Back to Profile</Button>
      </FormContainer>
      <Footer />
      <ToastContainer />
    </Container>
  );
};

export default FeedbackForm;
