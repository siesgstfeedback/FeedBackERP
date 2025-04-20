import React, { useState, useEffect } from "react";
import styled from "styled-components";
import supabase from "../config/SupabaseClient";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import { toast, ToastContainer } from "react-toastify";

// Styled components

const Button = styled.button`
  padding: 10px;
  margin: 10px;
  border-radius: 8px;
  background-color: #007bff; /* Original blue color */
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease,
    transform 0.3s ease;

  &:hover {
    background-color: #e0f7fa; /* Light cyan on hover */
    color: #007bff; /* Change text color to blue */
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); /* Subtle shadow */
    transform: translateY(-2px); /* Slight lift effect */
  }

  &:active {
    background-color: #0056b3; /* Darker blue for active state */
    box-shadow: none;
  }

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 14px;
  }
`;

const Container = styled.div`
  width: 100%;
  margin: 20px auto;
  background-color: #f0f0f0;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 15px;
    margin: 10px;
  }
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  flex-wrap: nowrap;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const Input = styled.input`
  padding: 8px;
  margin: 10px;
  border-radius: 6px;
  border: 1px solid #007bff;
  font-size: 16px;
  width: 22%;
  box-sizing: border-box;
  transition: border-color 0.3s;

  &:focus {
    border-color: #0056b3;
    outline: none;
  }

  @media (max-width: 768px) {
    width: 80%;
  }
`;

const Select = styled.select`
  padding: 8px;
  margin: 10px;
  border-radius: 6px;
  border: 1px solid #007bff;
  font-size: 16px;
  width: 22%;
  box-sizing: border-box;
  transition: border-color 0.3s;

  &:focus {
    border-color: #0056b3;
    outline: none;
  }

  @media (max-width: 768px) {
    width: 80%;
  }
`;

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto; /* Allow horizontal scrolling for the table */
  margin-top: 20px;
  box-sizing: border-box;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px; /* Set a minimum width for the table to avoid content compression */

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const TableHeader = styled.th`
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: 1px solid #ddd;

  @media (max-width: 768px) {
    padding: 8px;
  }
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const TableCell = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;

  @media (max-width: 768px) {
    padding: 8px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between; // Align buttons at both ends
  width: 100%;
`;

const AddSubject = () => {
  const [newSubject, setNewSubject] = useState({
    subject_name: "",
    subject_type: "",
    subject_branch: "",
    subject_semester: "",
  });

  const [subjectList, setSubjectList] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
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
        fetchSubjectData();
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
  //     setLoading(false);
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
  //     fetchSubjectData();
  //   } else {
  //     console.log("User is not an admin.");
  //   }
  //   setLoading(false);
  // };

  // const fetchSubjectData = async () => {
  //   const { data, error } = await supabase.from("subject").select();
  //   if (error) {
  //     console.error("Error fetching subject data:", error);
  //   } else {
  //     setSubjectList(data || []);
  //   }
  // };



  const fetchSubjectData = async () => {
    const batchSize = 1000;
    let allData = [];
    let page = 1;
  
    try {
      while (true) {
        const response = await fetch(
          `http://localhost:5000/subjects?page=${page}&batchSize=${batchSize}`
        );
        const result = await response.json();
        const data = result.data;
  
        if (data && data.length > 0) {
          allData = [...allData, ...data];
  
          if (data.length < batchSize) break; // Last batch
          page++;
        } else {
          break;
        }
      }
  
      setSubjectList(allData); // React state
    } catch (error) {
      console.error("Error fetching all subject data:", error);
    }
  };
  
  // const fetchSubjectData = async () => {
  //   const batchSize = 1000; // Number of records to fetch per batch
  //   let allData = [];
  //   let from = 0; // Start index for the current batch
  //   let to = batchSize - 1; // End index for the current batch

  //   try {
  //     while (true) {
  //       const { data, error, count } = await supabase
  //         .from("subject")
  //         .select("*", { count: "exact" }) // Fetch exact count along with data
  //         .range(from, to);

  //       if (error) {
  //         console.error("Error fetching subject data:", error);
  //         break;
  //       }

  //       if (data && data.length > 0) {
  //         allData = [...allData, ...data]; // Append fetched data to the result array

  //         // Break the loop if fewer records are returned than the batch size
  //         if (data.length < batchSize) {
  //           break;
  //         }
  //       } else {
  //         break; // Break if no data is returned
  //       }

  //       // Update range for the next batch
  //       from += batchSize;
  //       to += batchSize;
  //     }

  //     setSubjectList(allData); // Set the complete data to the state
  //   } catch (error) {
  //     console.error("Error fetching all subject data:", error);
  //   }
  // };

  const handleInputChange = ({ target: { name, value } }) => {
    setNewSubject((prev) => ({ ...prev, [name]: value }));
  };


  const handleAddSubject = async () => {
    if (
      newSubject.subject_name &&
      newSubject.subject_type &&
      newSubject.subject_branch &&
      newSubject.subject_semester
    ) {
      try {
        const response = await fetch("http://localhost:5000/add-subject", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newSubject),
        });
  
        const result = await response.json();
  
        if (!response.ok) {
          toast.error(result.error || "Failed to add subject.");
          return;
        }
  
        setSubjectList((prev) => [...prev]); // Optional: might be removed
        setNewSubject({
          subject_name: "",
          subject_type: "",
          subject_branch: "",
          subject_semester: "",
        });
        toast.success("Subject Added Successfully.");
        fetchSubjectData(); // Refresh the list
      } catch (error) {
        console.error("Error adding subject:", error);
        toast.error("Error adding subject.");
      }
    }
  };
  

  // const handleAddSubject = async () => {
  //   if (
  //     newSubject.subject_name &&
  //     newSubject.subject_type &&
  //     newSubject.subject_branch &&
  //     newSubject.subject_semester
  //   ) {
  //     const { error } = await supabase.from("subject").insert([newSubject]);
  //     if (error) {
  //       console.error("Error adding subject:", error);
  //       toast.error("Error adding subject:", error);
  //     } else {
  //       setSubjectList((prev) => [...prev]);
  //       setNewSubject({
  //         subject_name: "",
  //         subject_type: "",
  //         subject_branch: "",
  //         subject_semester: "",
  //       });
  //       toast.success("Subject Added Successfully.");
  //       fetchSubjectData();
  //     }
  //   }
  // };


  const handleDeleteSubject = async (id) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      try {
        const response = await fetch(`http://localhost:5000/delete-subject/${id}`, {
          method: "DELETE",
        });
  
        const result = await response.json();
  
        if (!response.ok) {
          toast.error(result.error || "Failed to delete subject.");
          return;
        }
  
        toast.success("Subject deleted successfully.");
        setSubjectList((prev) => prev.filter((subject) => subject.id !== id));
      } catch (error) {
        console.error("Error deleting subject:", error);
        toast.error("Error deleting subject.");
      }
    }
  };
  

  // const handleDeleteSubject = async (id) => {
  //   if (window.confirm("Are you sure you want to delete this subject?")) {
  //     const { error } = await supabase.from("subject").delete().eq("id", id);
  //     if (error) {
  //       console.error("Error deleting subject:", error);
  //       toast.error("Error deleting subject:", error);
  //     } else {
  //       setSubjectList((prev) => prev.filter((subject) => subject.id !== id));
  //     }
  //   }
  // };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/faculty-login");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    toast.error("Unauthorized Access");
    navigate("/faculty-login");
    return null;
  }

  return (
    <>
      <ToastContainer />
      <Header />
      <Container>
        {/* <ButtonContainer>
          <Button onClick={() => navigate("/admin")}>Back to Admin Panel</Button>
          <Button onClick={handleLogout}>Log Out</Button>
        </ButtonContainer> */}
        <ButtonContainer>
          <Button onClick={() => navigate("/admin")}>
            Back to Admin Panel
          </Button>
          <Button onClick={handleLogout}>Log Out</Button>
        </ButtonContainer>

        <h2>Add Subject</h2>
        <InputContainer>
          <Input
            type="text"
            name="subject_name"
            placeholder="Subject Name"
            value={newSubject.subject_name}
            onChange={handleInputChange}
          />
          <Select
            name="subject_type"
            value={newSubject.subject_type}
            onChange={handleInputChange}
          >
            <option value="">Select Type</option>
            <option value="Theory">Theory</option>
            <option value="Lab">Lab</option>
            <option value="DLO 1">DLO 1</option>
            <option value="DLO 2">DLO 2</option>
            <option value="ILO">ILO</option>
            <option value="DLO 1 Lab">DLO 1 Lab</option>
            <option value="DLO 2 Lab">DLO 2 Lab</option>
          </Select>
          <Select
            name="subject_branch"
            value={newSubject.subject_branch}
            onChange={handleInputChange}
          >
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
          <Select
            name="subject_semester"
            value={newSubject.subject_semester}
            onChange={handleInputChange}
          >
            <option value="">Select Semester</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
            <option value="3">Semester 3</option>
            <option value="4">Semester 4</option>
            <option value="5">Semester 5</option>
            <option value="6">Semester 6</option>
            <option value="7">Semester 7</option>
            <option value="8">Semester 8</option>
            <option value="ME1">ME Sem 1</option>
            <option value="ME2">ME Sem 2</option>
          </Select>
          <Button onClick={handleAddSubject}>Add Subject</Button>
        </InputContainer>

        <TableContainer>
          {subjectList.length > 0 && (
            <Table>
              <thead>
                <tr>
                  <TableHeader>Subject Name</TableHeader>
                  <TableHeader>Type</TableHeader>
                  <TableHeader>Branch</TableHeader>
                  <TableHeader>Semester</TableHeader>
                  <TableHeader>Action</TableHeader>
                </tr>
              </thead>
              <tbody>
                {subjectList.map((subject) => (
                  <TableRow key={subject.id}>
                    <TableCell>{subject.subject_name}</TableCell>
                    <TableCell>{subject.subject_type}</TableCell>
                    <TableCell>{subject.subject_branch}</TableCell>
                    <TableCell>{subject.subject_semester}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleDeleteSubject(subject.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          )}
        </TableContainer>
      </Container>
      <Footer />
    </>
  );
};

export default AddSubject;
