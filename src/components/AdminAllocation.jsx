import React, { useState, useEffect } from "react";
import styled from "styled-components";
import supabase from "../config/SupabaseClient";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./Footer";
import Header from "./Header";
import ReactSelect from "react-select";

// Styled components (same as in FacultyPanel)
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

const AdminAllocation = () => {
  const navigate = useNavigate();

  // State for admin selection of a faculty
  const [faculties, setFaculties] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");

  // State for allocated subjects for the selected faculty
  const [facultySubjects, setFacultySubjects] = useState([]);

  // States for criteria selection (similar to FacultyPanel)
  const [branches] = useState(["EXTC", "ECS", "AIDS", "AIML", "IOT", "CE", "IT", "MECH"]);
  const [semesters] = useState([1, 2, 3, 4, 5, 6, 7, 8, "ME1", "ME2"]);
  const [divisions] = useState(["A", "B", "B ECS", "B IOT", "B AIDS", "B AIML", "C", "D", "E", "F", "G", "H", "I", "J"]);
  const [subjectTypes] = useState(["Theory", "Lab", "ILO", "DLO 1", "DLO 2", "ILO Lab", "DLO 1 Lab", "DLO 2 Lab"]);
  const [batches] = useState([1, 2, 3]);

  // Form states
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedBatch, setSelectedBatch] = useState([]); // Array for multiple batches
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  
  useEffect(() => {
    checkIfttcoord();
    fetchFaculties();
  }, []);

  const checkIfttcoord = async () => {
    const username = sessionStorage.getItem("userEmail");
    const designation = sessionStorage.getItem("userdesignation");

    if (!username||!designation) {
      toast.error("You must be logged in to access the admin panel.");
      navigate("/faculty-login");
      return;
    }
    if(username==='ttcordfe@sies.edu.in'||username==='ttcordce@sies.edu.in'||username==='ttcordit@sies.edu.in'||username==='ttcordaids@sies.edu.in'||username==='ttcordaiml@sies.edu.in'||username==='ttcordecs@sies.edu.in'||username==='ttcordextc@sies.edu.in'||username==='ttcordiot@sies.edu.in'||username==='ttcordmech@sies.edu.in'){
      toast.success("Logged-In Successfully!");
    }

    
  };


  // Fetch subjects when branch, semester, and type are selected
  useEffect(() => {
    if (selectedBranch && selectedSemester && selectedType) {
      fetchSubjects();
    }
  }, [selectedBranch, selectedSemester, selectedType]);

  // Reset subject and batch when type changes
  useEffect(() => {
    setSelectedSubject("");
    setSelectedBatch([]);
  }, [selectedType]);

  // When a faculty is selected, fetch its allocation
  useEffect(() => {
    if (selectedFaculty) {
      fetchFacultySubjects(selectedFaculty);
    } else {
      setFacultySubjects([]);
    }
  }, [selectedFaculty]);

  // Fetch the list of faculties for the dropdown

  const fetchFaculties = async () => {
    try {
      const response = await fetch("http://localhost:5000/faculty-list");
      const result = await response.json();
  
      if (!response.ok) {
        toast.error(result.error || "Failed to fetch faculties");
        return;
      }
  
      setFaculties(result.data || []);
    } catch (error) {
      console.error("Error fetching faculties:", error);
      toast.error("Error fetching faculties");
    }
  };
  
  // const fetchFaculties = async () => {
  //   const { data, error } = await supabase.from("faculty").select("f_empid, f_name");
  //   if (error) {
  //     console.error("Error fetching faculties:", error);
  //     toast.error("Failed to fetch faculties");
  //   } else {
  //     setFaculties(data || []);
  //   }
  // };

  // Fetch allocation for the selected faculty

  const fetchFacultySubjects = async (f_empid) => {
    try {
      const response = await fetch(`http://localhost:5000/faculty-subjects/${f_empid}`);
      const result = await response.json();
  
      if (!response.ok) {
        console.error("Error fetching faculty subjects:", result.error);
        return;
      }
  
      setFacultySubjects(result.data || []);
    } catch (error) {
      console.error("Error fetching allocated subjects:", error);
    }
  };
  
  // const fetchFacultySubjects = async (f_empid) => {
  //   const { data, error } = await supabase
  //     .from("f_allocation")
  //     .select()
  //     .eq("f_empid", f_empid);
  //   if (error) {
  //     console.error("Error fetching allocated subjects:", error);
  //   } else {
  //     setFacultySubjects(data || []);
  //   }
  // };

  // Fetch subjects based on selected branch, semester, and type

  const fetchSubjects = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/subjects?branch=${selectedBranch}&semester=${selectedSemester}&type=${selectedType}`);
      
      if (response.ok) {
        const data = await response.json();
        setSubjectOptions(data || []);
      } else {
        console.error("Error fetching subjects");
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };
  
  // const fetchSubjects = async () => {
  //   const { data, error } = await supabase
  //     .from("subject")
  //     .select()
  //     .eq("subject_branch", selectedBranch)
  //     .eq("subject_semester", selectedSemester)
  //     .eq("subject_type", selectedType);
  //   if (error) {
  //     console.error("Error fetching subjects:", error);
  //   } else {
  //     setSubjectOptions(data || []);
  //   }
  // };

  // const handleAssignSubject = async () => {
  //   if (!selectedFaculty || !selectedSubject || !selectedBranch || !selectedSemester || !selectedDivision) {
  //     toast.error("Please fill all the required fields.");
  //     return;
  //   }

  //   // For Lab and related types, ensure at least one batch is selected
  //   if (
  //     (selectedType === "Lab" ||
  //       selectedType === "DLO 1 Lab" ||
  //       selectedType === "DLO 2 Lab" ||
  //       selectedType === "ILO Lab") &&
  //     selectedBatch.length === 0
  //   ) {
  //     toast.error("Please select at least one batch.");
  //     return;
  //   }

  //   // Insert a row for each selected batch if applicable
  //   if (selectedBatch.length > 0) {
  //     for (const batch of selectedBatch) {
  //       const { error } = await supabase.from("f_allocation").insert({
  //         f_empid: selectedFaculty,
  //         subject_name: selectedSubject,
  //         subject_type: selectedType,
  //         subject_branch: selectedBranch,
  //         subject_semester: selectedSemester,
  //         division: selectedDivision,
  //         batch: batch,
  //       });

  //       if (error) {
  //         console.error("Error assigning subject:", error);
  //         toast.error("Failed to assign subject");
  //         return;
  //       }
  //     }
  //   } else {
  //     // Insert a single row if no batches are selected
  //     const { error } = await supabase.from("f_allocation").insert({
  //       f_empid: selectedFaculty,
  //       subject_name: selectedSubject,
  //       subject_type: selectedType,
  //       subject_branch: selectedBranch,
  //       subject_semester: selectedSemester,
  //       division: selectedDivision,
  //       batch: null,
  //     });

  //     if (error) {
  //       console.error("Error assigning subject:", error);
  //       toast.error("Failed to assign subject");
  //       return;
  //     }
  //   }

  //   toast.success("Subject assigned successfully!");
  //   // Reset form fields
  //   setSelectedBranch("");
  //   setSelectedSemester("");
  //   setSelectedDivision("");
  //   setSelectedType("");
  //   setSelectedBatch([]);
  //   setSelectedSubject("");
  //   fetchFacultySubjects(selectedFaculty);
  // };

  const handleAssignSubject = async () => {
    if (!selectedFaculty || !selectedSubject || !selectedBranch || !selectedSemester || !selectedDivision) {
      toast.error("Please fill all the required fields.");
      return;
    }
  
    // For Lab and related types, ensure at least one batch is selected
    if (
      (selectedType === "Lab" ||
        selectedType === "DLO 1 Lab" ||
        selectedType === "DLO 2 Lab" ||
        selectedType === "ILO Lab") &&
      selectedBatch.length === 0
    ) {
      toast.error("Please select at least one batch.");
      return;
    }
  
    const dataToSend = {
      faculty: selectedFaculty,
      subject: selectedSubject,
      type: selectedType,
      branch: selectedBranch,
      semester: selectedSemester,
      division: selectedDivision,
      batch: selectedBatch.length > 0 ? selectedBatch : null
    };
  
    try {
      const response = await fetch("http://localhost:5000/api/assign-subject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataToSend)
      });
  
      const result = await response.json();
  
      if (response.ok) {
        toast.success("Subject assigned successfully!");
        setSelectedBranch("");
        setSelectedSemester("");
        setSelectedDivision("");
        setSelectedType("");
        setSelectedBatch([]);
        setSelectedSubject("");
        fetchFacultySubjects(selectedFaculty); // Update the faculty subjects list
      } else {
        toast.error(result.error || "Failed to assign subject.");
      }
    } catch (error) {
      console.error("Error assigning subject:", error);
      toast.error("Error assigning subject.");
    }
  };
  

  const handleDeleteSubject = async (subjectId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/delete-subject/${subjectId}`, {
        method: "DELETE",
      });
  
      const result = await response.json();
  
      if (response.ok) {
        toast.success("Subject deleted successfully!");
        fetchFacultySubjects(selectedFaculty); // Fetch updated faculty subjects
      } else {
        toast.error(result.error || "Failed to delete subject.");
      }
    } catch (error) {
      console.error("Error deleting subject:", error);
      toast.error("Error deleting subject.");
    }
  };
  

  // const handleDeleteSubject = async (subjectId) => {
  //   const { error } = await supabase
  //     .from("f_allocation")
  //     .delete()
  //     .eq("id", subjectId);

  //   if (error) {
  //     console.error("Error deleting subject:", error);
  //     toast.error("Failed to delete subject");
  //   } else {
  //     toast.success("Subject deleted successfully!");
  //     fetchFacultySubjects(selectedFaculty);
  //   }
  // };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/faculty-login");
  };

  const handleBackToLogin = () => {
    navigate("/faculty-login");
  };

  const facultyOptions = faculties.map((faculty) => ({
    value: faculty.f_empid,
    label: `${faculty.f_name} (${faculty.f_empid})`,
  }));

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
        <h2>Admin Allocation Panel</h2>
        <InputContainer>
          {/* Dropdown to select faculty */}
          <Dropdown
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
          >
            <option value="">Select Faculty</option>
            {faculties.map((faculty) => (
              <option key={faculty.f_empid} value={faculty.f_empid}>
                {faculty.f_name} ({faculty.f_empid})
              </option>
            ))}
          </Dropdown>
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

          {/* Show batch checkboxes if the type requires it */}
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

        {/* Display selected faculty info and allocated subjects */}
        {selectedFaculty && (
          <>
            <h2>
              Faculty:{" "}
              {
                faculties.find(
                  (faculty) => faculty.f_empid === selectedFaculty
                )?.f_name
              }{" "}
              (ID: {selectedFaculty})
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
                      <TableCell colSpan="7">
                        No subjects assigned yet.
                      </TableCell>
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
                            onClick={() =>
                              handleDeleteSubject(subject.id)
                            }
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
          </>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default AdminAllocation;
