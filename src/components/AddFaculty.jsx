import React, { useState, useEffect } from "react";
import styled from "styled-components";
import supabase from "../config/SupabaseClient";

// Styled components
const Button = styled.button`
  padding: 10px;
  margin: 10px;
  border-radius: 8px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #0056b3;
  }

  &:active {
    background-color: #004080;
  }
`;

const Container = styled.div`
  width: 100%;
  margin: 20px;
  background-color: #f0f0f0;
  border-radius: 16px;
  padding: 20px;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Input = styled.input`
  padding: 8px;
  margin: 10px;
  border-radius: 6px;
  border: 1px solid #007bff;
  font-size: 16px;
  width: 30%;
  transition: border-color 0.3s;

  &:focus {
    border-color: #0056b3;
    outline: none;
  }
`;

const Table = styled.table`
  margin-top: 20px;
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: 1px solid #ddd;
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
`;

const AddFacultyComponent = () => {
  const [newFaculty, setNewFaculty] = useState({
    f_empid: "",
    f_name: "",
    f_email: "",
  });

  const [facultyList, setFacultyList] = useState([]);

  useEffect(() => {
    fetchFacultyData();
  }, []);

  const fetchFacultyData = async () => {
    const { data, error } = await supabase.from("AddFaculty").select();
    if (error) {
      console.error("Error fetching faculty data:", error);
    } else {
      setFacultyList(data || []);
    }
  };

  const handleInputChange = ({ target: { name, value } }) => {
    setNewFaculty((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddFaculty = async () => {
    if (newFaculty.f_empid && newFaculty.f_name && newFaculty.f_email) {
      const { data, error } = await supabase.from("AddFaculty").insert([newFaculty]);
      if (error) {
        console.error("Error adding faculty member:", error);
      } else {
        window.location.reload();
      }
    }
  };

  const handleDeleteFaculty = async (id) => {
    const { error } = await supabase.from("AddFaculty").delete().eq("id", id);
    if (error) {
      console.error("Error deleting faculty member:", error);
    } else {
      setFacultyList((prev) => prev.filter((faculty) => faculty.id !== id));
    }
  };

  return (
    <Container>
      <h2>Add Faculty</h2>
      <InputContainer>
        <Input
          type="text"
          name="f_empid"
          placeholder="Faculty ID"
          value={newFaculty.f_empid}
          onChange={handleInputChange}
        />
        <Input
          type="text"
          name="f_name"
          placeholder="Faculty Name"
          value={newFaculty.f_name}
          onChange={handleInputChange}
        />
        <Input
          type="email"
          name="f_email"
          placeholder="Faculty Email"
          value={newFaculty.f_email}
          onChange={handleInputChange}
        />
      </InputContainer>
      <Button onClick={handleAddFaculty}>Add Faculty</Button>

      {facultyList.length > 0 && (
        <Table>
          <thead>
            <tr>
              <TableHeader>Faculty ID</TableHeader>
              <TableHeader>Name</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>Action</TableHeader>
            </tr>
          </thead>
          <tbody>
            {facultyList.map((faculty) => (
              <TableRow key={faculty.id}>
                <TableCell>{faculty.f_empid}</TableCell>
                <TableCell>{faculty.f_name}</TableCell>
                <TableCell>{faculty.f_email}</TableCell>
                <TableCell>
                  <Button onClick={() => handleDeleteFaculty(faculty.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AddFacultyComponent;
