import React, { useState, useEffect } from "react";
import styled from "styled-components";
import supabase from "../config/SupabaseClient";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./Footer";
import Header from "./Header";

// Styled components (unchanged)
const Button = styled.button`
  padding: 12px 16px;
  margin: 5px;
  border-radius: 8px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s, color 0.3s;
  flex: 1;

  &:hover {
    background-color: #0056b3;
  }

  &:active {
    background-color: #004080;
  }

  @media (max-width: 768px) {
    padding: 10px 14px;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 12px;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #ff4d4d;

  &:hover {
    background-color: #cc0000;
  }

  &:active {
    background-color: #800000;
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
  overflow-x: hidden;
`;

const InputContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
  margin-bottom: 20px;
`;

const Dropdown = styled.select`
  padding: 10px;
  border-radius: 8px;
  flex: 1;
  min-width: 150px;
  box-sizing: border-box;
`;

const Table = styled.table`
  margin-top: 20px;
  width: 100%;
  border-collapse: collapse;
  overflow-x: auto;
`;

const TableHeader = styled.th`
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: 1px solid #ddd;
  text-align: left;
`;
const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  margin-top: 20px;
  box-sizing: border-box;
`;
const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const TableCell = styled.td`
  padding: 12px;
  border: 1px solid #ddd;
  text-align: center;
  word-wrap: break-word;
`;

const FacultyPanel = () => {
  const [facultySubjects, setFacultySubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFaculty, setIsFaculty] = useState(false);
  const [displayFeedback, setDisplayFeedback] = useState(false);
  const [branches] = useState(["EXTC", "ECS", "AIDS", "AIML", "IOT", "CE", "IT", "MECH"]);
  const [semesters] = useState([1, 2, 3, 4, 5, 6, 7, 8]);
  const [divisions] = useState(["A", "B","B ECS","B IOT","B AIDS","B AIML", "C", "D", "E", "F", "G", "H", "I", "J"]);
  const [subjectTypes] = useState(["Theory", "Lab", "ILO", "DLO 1", "DLO 2", "ILO Lab", "DLO 1 Lab", "DLO 2 Lab"]);
  const [batches] = useState([1, 2, 3]);

  // Form states
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedBatch, setSelectedBatch] = useState([]); // Changed to array for multiple batches
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");

  // New state for faculty name and ID
  const [facultyName, setFacultyName] = useState("");
  const [facultyId, setFacultyId] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    checkIfFaculty();
    fetchFeedbackSettings();
  }, []);

  useEffect(() => {
    if (selectedBranch && selectedSemester && selectedType) {
      fetchSubjects();
    }
  }, [selectedBranch, selectedSemester, selectedType]);

  useEffect(() => {
    // Reset subject and batch if type changes
    setSelectedSubject("");
    setSelectedBatch([]);
  }, [selectedType]);

  const fetchFeedbackSettings = async () => {
    const { data, error } = await supabase
      .from("settings")
      .select("display_facultyfeedback")
      .single();

    if (error) {
      console.error("Error fetching settings:", error);
    } else {
      setDisplayFeedback(data.display_facultyfeedback);
    }
  };

  const checkIfFaculty = async () => {
    const username = sessionStorage.getItem("userEmail");

    if (!username) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("faculty")
      .select("f_empid, f_name")
      .eq("f_email", username);

    if (error) {
      console.error("Error checking faculty status:", error);
    } else if (data && data.length > 0) {
      setIsFaculty(true);
      setFacultyId(data[0].f_empid);
      setFacultyName(data[0].f_name);
      fetchFacultySubjects(data[0].f_empid);
      toast.success("Logged-in Successfully!");
    } else {
      console.log("User is not a faculty.");
    }
    setLoading(false);
  };

  const fetchFacultySubjects = async (f_empid) => {
    const { data, error } = await supabase
      .from("f_allocation")
      .select()
      .eq("f_empid", f_empid);

    if (error) {
      console.error("Error fetching assigned subjects:", error);
    } else {
      setFacultySubjects(data || []);
    }
  };

  const fetchSubjects = async () => {
    const { data, error } = await supabase
      .from("subject")
      .select()
      .eq("subject_branch", selectedBranch)
      .eq("subject_semester", selectedSemester)
      .eq("subject_type", selectedType);

    if (error) {
      console.error("Error fetching subjects:", error);
    } else {
      setSubjectOptions(data || []);
    }
  };

  const handleAssignSubject = async () => {
    const f_empid = sessionStorage.getItem("f_empid");
    if (!f_empid || !selectedSubject) {
      toast.error("Please fill all the required fields.");
      return;
    }
    if (!selectedDivision){
      toast.error("Please fill the division");
      return;
    }
    if (
      (selectedType === "Lab" ||
        selectedType === "DLO 1 Lab" ||
        selectedType === "DLO 2 Lab") &&
      selectedBatch.length === 0
    ) {
      toast.error("Please select at least one batch.");
      return;
    }

    // Insert a separate row for each selected batch
    if (selectedBatch.length > 0) {
      for (const batch of selectedBatch) {
        const { error } = await supabase.from("f_allocation").insert({
          f_empid: f_empid,
          subject_name: selectedSubject,
          subject_type: selectedType,
          subject_branch: selectedBranch,
          subject_semester: selectedSemester,
          division: selectedDivision,
          batch: batch,
        });

        if (error) {
          console.error("Error assigning subject:", error);
          toast.error("Failed to assign subject");
          return;
        }
      }
    } else {
      // Insert a single row if no batches are selected
      const { error } = await supabase.from("f_allocation").insert({
        f_empid: f_empid,
        subject_name: selectedSubject,
        subject_type: selectedType,
        subject_branch: selectedBranch,
        subject_semester: selectedSemester,
        division: selectedDivision,
        batch: null,
      });

      if (error) {
        console.error("Error assigning subject:", error);
        toast.error("Failed to assign subject");
        return;
      }
    }

    toast.success("Subject assigned successfully!");
    setSelectedBranch("");
    setSelectedSemester("");
    setSelectedDivision("");
    setSelectedType("");
    setSelectedBatch([]);
    setSelectedSubject("");
    fetchFacultySubjects(f_empid);
  };

  const handleDeleteSubject = async (subjectId) => {
    const { error } = await supabase
      .from("f_allocation")
      .delete()
      .eq("id", subjectId);

    if (error) {
      console.error("Error deleting subject:", error);
      toast.error("Failed to delete subject");
    } else {
      toast.success("Subject deleted successfully!");
      const f_empid = sessionStorage.getItem("f_empid");
      fetchFacultySubjects(f_empid);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/faculty-login");
  };

  const handleBackToLogin = () => {
    navigate("/faculty-login");
  };

  const navigateFacultyView = () => {
    navigate("/faculty-view");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isFaculty) {
    toast.error("Unauthorized Access");
    navigate("/faculty-login");
    return null;
  }

  return (
    <>
      <ToastContainer />
      <Header />
      <div>
        <Button onClick={handleBackToLogin}>Back to Login</Button>
        <Button style={{ float: "right" }} onClick={handleLogout}>
          Log Out
        </Button>
      </div>
      <Container>
        <InputContainer>
          <Dropdown
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
          >
            <option value="">Select Branch</option>
            {branches.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </Dropdown>

          <Dropdown
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
          >
            <option value="">Select Semester</option>
            {semesters.map((semester) => (
              <option key={semester} value={semester}>
                {semester}
              </option>
            ))}
          </Dropdown>

          <Dropdown
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
          >
            <option value="">Select Division</option>
            {divisions.map((division) => (
              <option key={division} value={division}>
                {division}
              </option>
            ))}
          </Dropdown>

          <Dropdown
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">Select Type</option>
            {subjectTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Dropdown>

          {(selectedType === "Lab" ||
            selectedType === "DLO 1 Lab" ||
            selectedType === "DLO 2 Lab" ||
            selectedType === "ILO Lab") && (
            <div>
              {batches.map((batch) => (
                <label key={batch}>
                  <input
                    type="checkbox"
                    value={batch}
                    checked={selectedBatch.includes(batch)}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      setSelectedBatch((prev) =>
                        e.target.checked
                          ? [...prev, value]
                          : prev.filter((b) => b !== value)
                      );
                    }}
                  />
                  Batch {batch}
                </label>
              ))}
            </div>
          )}

          <Dropdown
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="">Select Subject</option>
            {subjectOptions.map((subject) => (
              <option key={subject.subject_code} value={subject.subject_name}>
                {subject.subject_name}
              </option>
            ))}
          </Dropdown>

          <Button onClick={handleAssignSubject}>Assign Subject</Button>
        </InputContainer>

        <h2>
          Faculty Name: {facultyName} <br />
          Faculty id: {facultyId}
        </h2>
        <h2>Assigned Subjects</h2>
        <TableContainer>
        <Table>
          <thead>
            <tr>
              <TableHeader>Subject Name</TableHeader>
              <TableHeader>Type</TableHeader>
              <TableHeader>Branch</TableHeader>
              <TableHeader>Semester</TableHeader>
              <TableHeader>Division</TableHeader>
              <TableHeader>Batch</TableHeader>
              <TableHeader>Action</TableHeader>
            </tr>
          </thead>
          <tbody>
            {facultySubjects.length === 0 ? (
              <tr>
                <TableCell colSpan="7">No subjects assigned yet.</TableCell>
              </tr>
            ) : (
              facultySubjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell>{subject.subject_name}</TableCell>
                  <TableCell>{subject.subject_type}</TableCell>
                  <TableCell>{subject.subject_branch}</TableCell>
                  <TableCell>{subject.subject_semester}</TableCell>
                  <TableCell>{subject.division}</TableCell>
                  <TableCell>{subject.batch || "-"}</TableCell>
                  <TableCell>
                    <DeleteButton
                      onClick={() => handleDeleteSubject(subject.id)}
                    >
                      Delete
                    </DeleteButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </tbody>
        </Table>
        </TableContainer>

        {displayFeedback && (
          <Button onClick={navigateFacultyView}>View Feedback</Button>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default FacultyPanel;