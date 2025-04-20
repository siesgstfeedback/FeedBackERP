import React, { useState, useEffect } from "react";
import styled from "styled-components";
import supabase from "../config/SupabaseClient";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "./Header";
import Footer from "./Footer";

// Styled components with responsive adjustments
const Button = styled.button`
  padding: 10px;
  margin: 10px;
  border-radius: 8px;
  background-color: #007bff; /* Original blue color */
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;

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
    font-size: 14px;
    padding: 8px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 6px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between; // Align buttons at both ends
  width: 100%;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1200px; // Restrict the max width to avoid too wide layouts
  margin: 20px auto;
  background-color: #f0f0f0;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden; // Prevent any horizontal overflow

  @media (max-width: 768px) {
    margin: 10px auto;
    padding: 15px;
  }

  @media (max-width: 480px) {
    margin: 5px auto;
    padding: 10px;
  }
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
  }
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

  @media (max-width: 768px) {
    width: 80%;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    width: 100%;
    font-size: 12px;
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
// const Table = styled.table`
//   margin-top: 20px;
//   width: 100%;
//   border-collapse: collapse;

//   @media (max-width: 768px) {
//     margin-top: 15px;
//   }

//   @media (max-width: 480px) {
//     font-size: 12px;
//   }
// `;

const TableHeader = styled.th`
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: 1px solid #ddd;

  @media (max-width: 768px) {
    padding: 8px;
  }

  @media (max-width: 480px) {
    padding: 6px;
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

  @media (max-width: 480px) {
    padding: 6px;
  }
`;

const AddFaculty = () => {
  const [newFaculty, setNewFaculty] = useState({
    f_empid: "",
    f_name: "",
    f_email: "",
  });

  const [facultyList, setFacultyList] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state for async operations
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
        fetchFacultyData();
      } else {
        console.log("User is not an admin.");
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  
    setLoading(false);
  };
  


  // const checkIfAdmin = async () => {
  //   const username = sessionStorage.getItem('userEmail');
    
  //   if (!username) {
  //     setLoading(false);
  //     return;
  //   }

  //   const { data, error } = await supabase
  //     .from('admin')
  //     .select()
  //     .eq('a_email', username);

  //   if (error) {
  //     console.error("Error checking admin status:", error);
  //   } else if (data && data.length > 0) {
  //     setIsAdmin(true);
  //     fetchFacultyData(); // Fetch faculty data only if the user is admin
  //   } else {
  //     console.log("User is not an admin.");
  //   }
  //   setLoading(false); // End loading
  // };



  const fetchFacultyData = async () => {
    try {
        const response = await fetch('http://localhost:5000/faculty-data', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();
        console.log(result);

        if (response.ok) {
            setFacultyList(result.data);  // Assuming the backend returns faculty data in `data` field
        } else {
            console.error("Error fetching faculty data:", result.error);
        }
    } catch (error) {
        console.error("Failed to fetch faculty data:", error);
    }
};


  // const fetchFacultyData = async () => {
  //   const { data, error } = await supabase.from("faculty").select();
  //   if (error) {
  //     console.error("Error fetching faculty data:", error);
  //   } else {
  //     setFacultyList(data || []);
  //   }
  // };

  const handleInputChange = ({ target: { name, value } }) => {
    setNewFaculty((prev) => ({ ...prev, [name]: value }));
  };




  const handleAddFaculty = async () => {
    if (newFaculty.f_empid && newFaculty.f_name && newFaculty.f_email) {
      try {
        const response = await fetch('http://localhost:5000/add-faculty', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newFaculty),
        });
  
        const result = await response.json();
  
        if (response.ok) {
          console.log("Successfully added faculty");
          toast.success("Successfully added faculty");
          setFacultyList((prev) => [...prev, newFaculty]);
          setNewFaculty({
            f_empid: "",
            f_name: "",
            f_email: "",
          });
        } else {
          console.error("Error adding faculty member:", result.error);
          toast.error("Error adding faculty member");
        }
      } catch (error) {
        console.error("Error adding faculty:", error);
        toast.error("Error adding faculty member");
      }
    }
  };
  

  // const handleAddFaculty = async () => {
  //   if (newFaculty.f_empid && newFaculty.f_name && newFaculty.f_email) {
  //     const { error } = await supabase.from("faculty").insert([newFaculty]);

  //     if (error) {
  //       console.error("Error adding faculty member:", error.message);
  //       toast.error("Error adding faculty member");
  //     } else {
  //       console.log("Successfully added faculty");

  //       setFacultyList((prev) => [...prev]);
  //       toast.success("Successfully added faculty");
  //       setNewFaculty({
  //         f_empid: "",
  //         f_name: "",
  //         f_email: "",
  //       });
  //       fetchFacultyData();
  //     }
  //   }
  // };




  const handleDeleteFaculty = async (id) => {
    if (window.confirm("Are you sure you want to delete this faculty member?")) {
      try {
        const response = await fetch(`http://localhost:5000/delete-faculty/${id}`, {
          method: 'DELETE',
        });
  
        const result = await response.json();
  
        if (response.ok) {
          toast.success("Successfully deleted faculty");
          setFacultyList((prev) => prev.filter((faculty) => faculty.id !== id));
        } else {
          console.error("Error deleting faculty member:", result.error);
          toast.error("Error deleting faculty member");
        }
      } catch (error) {
        console.error("Error deleting faculty:", error);
        toast.error("Error deleting faculty member");
      }
    }
  };
  

  // const handleDeleteFaculty = async (id) => {
  //   if (window.confirm("Are you sure you want to delete this faculty member?")) {
  //     const { error } = await supabase.from("faculty").delete().eq("id", id);
  //     if (error) {
  //       console.error("Error deleting faculty member:", error);
  //       toast.error("Error deleting faculty member");
  //     } else {
  //       toast.success("Successfully deleted faculty");
  //       setFacultyList((prev) => prev.filter((faculty) => faculty.id !== id));
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
    navigate("/faculty-login");
    return null;
  }

  
  return (
    <>
      <ToastContainer />
      <Header />
      <Container>
        <ButtonContainer>
          <Button onClick={() => navigate("/admin")}>Back to Admin Panel</Button>
          <Button onClick={handleLogout}>Log Out</Button>
        </ButtonContainer>
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
          <TableContainer>
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
                    <Button onClick={() => handleDeleteFaculty(faculty.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
          </TableContainer>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default AddFaculty;
