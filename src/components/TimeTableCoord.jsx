import React, { useState, useEffect } from "react";
import styled from "styled-components";
import supabase from "../config/SupabaseClient";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { toast, ToastContainer } from "react-toastify";

// Styled components using the same styling as AddSubject component
const Button = styled.button`
  padding: 10px;
  margin: 10px;
  border-radius: 8px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: #e0f7fa;
    color: #007bff;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }

  &:active {
    background-color: #0056b3;
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

const Select = styled.select`
  padding: 8px;
  margin: 10px;
  border-radius: 6px;
  border: 1px solid #007bff;
  font-size: 16px;
  width: 30%;
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
  overflow-x: auto;
  margin-top: 20px;
  box-sizing: border-box;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
  
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

const ButtonContainer = styled.div`
display: flex;
justify-content: space-between; // Align buttons at both ends
width: 100%;
`;

const TableCell = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;

  @media (max-width: 768px) {
    padding: 8px;
  }
`;

const TimeTableCoord = () => {
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [division, setDivision] = useState("");
  const [facultyAllocation, setFacultyAllocation] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkIfAdmin();
  }, []);

  const checkIfAdmin = async () => {
    const username = sessionStorage.getItem("userEmail");
    if (!username) return;

    const { data, error } = await supabase
      .from("admin")
      .select()
      .eq("a_email", username);

    if (error || data.length === 0) {
      alert("Unauthorized Access");
      navigate("/login");
    }
  };

  const handleFetchAllocation = async () => {
    if (!branch || !semester || !division) {
      toast.error("Please select branch, semester, and division");
      return;
    }

    setLoading(true);
    
    // Fetch allocations from `f_allocation` table including batch information
    const { data: allocationData, error: allocationError } = await supabase
      .from("f_allocation")
      .select("subject_name, f_empid, batch")
      .eq("subject_branch", branch)
      .eq("subject_semester", semester)
      .eq("division", division);

    if (allocationError) {
      console.error("Error fetching allocation:", allocationError);
      toast.error("Error fetching data");
      setLoading(false);
      return;
    }

    // Fetch faculty names for each `f_empid` and include batch
    const facultyNames = await Promise.all(
      allocationData.map(async (allocation) => {
        const { data: facultyData, error: facultyError } = await supabase
          .from("faculty")
          .select("f_name")
          .eq("f_empid", allocation.f_empid)
          .single();
        
        if (facultyError) {
          console.error("Error fetching faculty name:", facultyError);
          return { ...allocation, facultyName: "Unknown" };
        }
        
        return { ...allocation, facultyName: facultyData.f_name };
      })
    );

    setFacultyAllocation(facultyNames);
    setLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/faculty-login");
  };

  return (
    <>
      <ToastContainer />
      <Header />
      <Container>
      <ButtonContainer>
          <Button onClick={() => navigate("/admin")}>Back to Admin Panel</Button>
          <Button onClick={handleLogout}>Log Out</Button>
        </ButtonContainer>
        <h2>Time Table Coordinator</h2>
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
        <Select onChange={(e) => setSemester(e.target.value)} value={semester}>
          <option value="">Select Semester</option>
          <option value="1">Semester 1</option>
          <option value="2">Semester 2</option>
          <option value="3">Semester 3</option>
          <option value="4">Semester 4</option>
          <option value="5">Semester 5</option>
          <option value="6">Semester 6</option>
          <option value="7">Semester 7</option>
          <option value="8">Semester 8</option>
        </Select>
        <Select onChange={(e) => setDivision(e.target.value)} value={division}>
          <option value="">Select Division</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
          <option value="E">E</option>
          <option value="F">F</option>
          <option value="G">G</option>
          <option value="H">H</option>
          <option value="I">I</option>
          <option value="J">J</option>
        </Select>
        <Button onClick={handleFetchAllocation}>Fetch Allocation</Button>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <TableContainer>
            {facultyAllocation.length > 0 ? (
              <Table>
                <thead>
                  <tr>
                    <TableHeader>Faculty Name</TableHeader>
                    <TableHeader>Subject</TableHeader>
                    <TableHeader>Batch</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {facultyAllocation.map((alloc, index) => (
                    <tr key={`${alloc.subject_name}-${index}`}>
                      <TableCell>{alloc.facultyName}</TableCell>
                      <TableCell>{alloc.subject_name}</TableCell>
                      <TableCell>{alloc.batch}</TableCell>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p>No allocations found.</p>
            )}
          </TableContainer>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default TimeTableCoord;