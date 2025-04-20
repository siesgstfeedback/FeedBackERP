import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import supabase from "../config/SupabaseClient";
import Header from "./Header";
import Footer from "./Footer";
import { toast, ToastContainer } from "react-toastify"; // Import Toast components
import "react-toastify/dist/ReactToastify.css"; // Import Toast CSS
import Backup from "./Backup";
import DeleteTable from "./DeleteTable";
import TimeTableCoord from "./TimeTableCoord";

// Improved Button styling with subtle shadows and hover effects
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
    box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  &:active {
    background-color: #004080;
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 10px 16px;
    margin: 8px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 8px 14px;
    margin: 6px;
  }
`;

const RedButton = styled.button`
  padding: 12px 20px;
  margin: 10px;
  border-radius: 12px;
  background-color: #dc3545;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #0056b3;
    box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  &:active {
    background-color: #004080;
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 10px 16px;
    margin: 8px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 8px 14px;
    margin: 6px;
  }
`;
const VerifyButton = styled.button`
  padding: 12px 20px;
  margin: 10px;
  border-radius: 12px;
  background-color: #ff8c00;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #0056b3;
    box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  &:active {
    background-color: #004080;
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 10px 16px;
    margin: 8px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 8px 14px;
    margin: 6px;
  }
`;

const PanelContainer = styled.div`
  display: flex;
  flex-wrap: wrap; /* Allows items to wrap to the next line */
  justify-content: center;
  @media (max-width: 480px) {
    flex-direction: column; /* Stack items vertically on smaller screens */
  }
`;

const ToggleButton = styled(Button)`
  background-color: ${(props) => (props.active ? "#28a745" : "#dc3545")};

  &:hover {
    background-color: ${(props) => (props.active ? "#218838" : "#c82333")};
  }

  &:active {
    background-color: ${(props) => (props.active ? "#1e7e34" : "#bd2130")};
  }
`;

const Card = styled.div`
  background-color: #fff;
  margin: 10px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  width: 260px;
  text-align: center;
  border: 1px solid white;

  h3 {
    margin-bottom: 20px;
    font-size: 22px;
    color: #333;
  }
`;

const Container = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 20px auto;
  background-color: #f9f9f9;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 20px;
  }

  @media (max-width: 480px) {
    padding: 15px;
  }
`;

const Heading = styled.h2`
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;

  @media (max-width: 768px) {
    font-size: 24px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const SubHeading = styled.h3`
  font-size: 22px;
  margin: 20px 0;
  color: #666;

  @media (max-width: 768px) {
    font-size: 20px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  border-radius: 8px;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;
const ToggleButtonContainer = styled.label`
  display: inline-block;
  position: relative;
  width: 60px;
  height: 34px;
  cursor: pointer;
`;

const ToggleButtonInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
  top: 0;
  left: 0;
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${(props) => (props.active ? "#28a745" : "#ccc")};
  transition: 0.4s;
  border-radius: 34px;

  &:before {
    content: "";
    position: absolute;
    left: ${(props) => (props.active ? "26px" : "4px")};
    bottom: 4px;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background-color: white;
    transition: 0.4s;
  }
`;

const AdminPanel = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [settings, setSettings] = useState({
    student_editing: false,
    student_feedback: false,
    display_facultyfeedback: false,
    feedback_header_text: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [newHeaderText, setNewHeaderText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    checkIfAdmin();
    fetchSettings();
  }, []);

  const checkIfAdmin = async () => {
    const email = sessionStorage.getItem("userEmail");

    if (!email) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/check-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      // console.log(result);

      if (result.isAdmin) {
        setIsAdmin(true);
        // fetchFacultyData();
        toast.success("Logged-In Successfully!");
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
  //     toast.success("Logged-In Successfully!");
  //   } else {
  //     toast.error("Unauthorized Access");
  //     navigate("/faculty-login");
  //   }
  // };

  // const fetchSettings = async () => {
  //   const { data, error } = await supabase
  //     .from("settings")
  //     .select("*")
  //     .eq("id", 1)
  //     .single();

  //   if (error) {
  //     console.error("Error fetching settings:", error);
  //   } else if (data) {
  //     setSettings({
  //       student_editing: data.student_editing,
  //       student_feedback: data.student_feedback,
  //       display_facultyfeedback: data.display_facultyfeedback,
  //       feedback_header_text: data.feedback_header_text,
  //     });
  //   }
  // };

  const fetchSettings = async () => {
    try {
      const response = await fetch("http://localhost:5000/get-settings", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok) {
        setSettings({
          student_editing: result.student_editing,
          student_feedback: result.student_feedback,
          display_facultyfeedback: result.display_facultyfeedback,
          feedback_header_text: result.feedback_header_text,
        });
      } else {
        console.error("Error fetching settings:", result.error);
      }
    } catch (error) {
      console.error("Network error fetching settings:", error);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/faculty-login");
  };

  // const toggleSetting = async (setting) => {
  //   const newValue = !settings[setting];
  //   const { error } = await supabase
  //     .from("settings")
  //     .update({ [setting]: newValue })
  //     .eq("id", 1);

  //   if (error) {
  //     console.error(`Error updating ${setting}:`, error);
  //   } else {
  //     setSettings((prev) => ({ ...prev, [setting]: newValue }));
  //     toast.success(`Successfully updated ${setting}.`);
  //   }
  // };

  const toggleSetting = async (setting) => {
    const newValue = !settings[setting];

    try {
      const response = await fetch("http://localhost:5000/update-setting", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ setting, value: newValue }),
      });

      const result = await response.json();

      if (response.ok) {
        setSettings((prev) => ({ ...prev, [setting]: newValue }));
        toast.success(`Successfully updated ${setting}.`);
      } else {
        console.error(`Error updating ${setting}:`, result.error);
        toast.error(`Failed to update ${setting}.`);
      }
    } catch (error) {
      console.error(`Network error updating ${setting}:`, error);
      toast.error("Network error. Please try again.");
    }
  };

  // const handleUpdateFeedbackHeader = async () => {
  //   const { error } = await supabase
  //     .from("settings")
  //     .update({ feedback_header_text: newHeaderText })
  //     .eq("id", 1);

  //   if (error) {
  //     console.error("Error updating feedback header:", error);
  //     toast.error("Error updating feedback header.");
  //   } else {
  //     setSettings((prev) => ({ ...prev, feedback_header_text: newHeaderText }));
  //     toast.success("Feedback header updated successfully!");
  //     fetchSettings(); // Refetch settings to update the header in Header component
  //     setShowModal(false);
  //     window.location.reload();
  //   }
  // };

  const handleUpdateFeedbackHeader = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/update-feedback-header",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ feedback_header_text: newHeaderText }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setSettings((prev) => ({
          ...prev,
          feedback_header_text: newHeaderText,
        }));
        toast.success("Feedback header updated successfully!");
        fetchSettings(); // Refresh settings in-app
        setShowModal(false);
        window.location.reload(); // Reload to update header component
      } else {
        console.error("Error updating header:", result.error);
        toast.error("Error updating feedback header.");
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Network error. Please try again.");
    }
  };

  if (!isAdmin) {
    return null;
  }

  const handleDelete = async (tableName) => {
    // Show confirmation dialog
    const isConfirmed = window.confirm(
      "Are you sure you want to delete the rows? This action cannot be undone."
    );

    // If user cancels, exit the function
    if (!isConfirmed) {
      console.log("Deletion canceled.");
      return;
    } else {
      DeleteTable(tableName);
      const str = "Deleted " + tableName + " Data";
      toast.success(str);
    }
  };

  const ToggleButton = ({ active, onClick }) => (
    <ToggleButtonContainer>
      <ToggleButtonInput type="checkbox" checked={active} onChange={onClick} />
      <ToggleSlider active={active} onClick={onClick} />
    </ToggleButtonContainer>
  );

  return (
    <>
      <ToastContainer /> {/* Toast Container */}
      <Header />
      <Container>
        <Heading>Admin Panel</Heading>
        <PanelContainer>
          <Card>
            <h3>Add Data</h3>
            <Button onClick={() => navigate("/add-faculty")}>
              Add Faculty
            </Button>
            <Button onClick={() => navigate("/add-subject")}>
              Add Subject
            </Button>
          </Card>
          <Card>
            <h3>View Feedback</h3>
            <Button onClick={() => navigate("/feedback-admin")}>
              View and Downlod Feedback
            </Button>
            <Button onClick={() => navigate("/not-filled-students")}>
              Pending Feedback
            </Button>
          </Card>
          <Card>
            <h3>Backup Data</h3>
            <Button onClick={() => Backup("feedback")}>Feedback Backup</Button>
            <Button onClick={() => Backup("faculty")}>
              Faculty List Backup
            </Button>
            <Button onClick={() => Backup("f_allocation")}>
              Faculty allocation Backup
            </Button>
            <Button onClick={() => Backup("student")}>
              Student List Backup
            </Button>
          </Card>
          <Card>
            <h3>Delete Data</h3>
            <RedButton onClick={() => handleDelete("f_allocation")}>
              Clear Faculty Allocations
            </RedButton>
            <RedButton onClick={() => handleDelete("feedback")}>
              Clear Feedback
            </RedButton>
            <RedButton onClick={() => handleDelete("student")}>
              Clear Student Data
            </RedButton>
          </Card>

          <Card>
            <h3>Verify Faculty Allocation</h3>
            <VerifyButton onClick={() => navigate("/tt-coord")}>
              Verify Allocation
            </VerifyButton>
          </Card>

          <Card>
            <h3>Settings</h3>
            <h4> Student Profile Editing</h4>
            <ToggleButton
              active={settings.student_editing}
              onClick={() => toggleSetting("student_editing")}
            />
            <h4> Student Feedback</h4>
            <ToggleButton
              active={settings.student_feedback}
              onClick={() => toggleSetting("student_feedback")}
            />
            <h4> Display Feedback to Faculty</h4>
            <ToggleButton
              active={settings.display_facultyfeedback}
              onClick={() => toggleSetting("display_facultyfeedback")}
            />

            {/* <ToggleButton
          active={settings.student_editing}
          onClick={() => toggleSetting("student_editing")}
        >
          {settings.student_editing ? "Disable Student Editing" : "Enable Student Editing"}
        </ToggleButton>
        <ToggleButton
          active={settings.student_feedback}
          onClick={() => toggleSetting("student_feedback")}
        >
          {settings.student_feedback ? "Disable Student Feedback" : "Enable Student Feedback"}
        </ToggleButton>
        <ToggleButton
          active={settings.display_facultyfeedback}
          onClick={() => toggleSetting("display_facultyfeedback")}
        >
          {settings.display_facultyfeedback ? "Disable Faculty Feedback Display" : "Enable Faculty Feedback Display"}
        </ToggleButton> */}
            <br />
            <br />
            <Button onClick={() => setShowModal(true)}>
              Update Feedback Header
            </Button>

            {showModal && (
              <>
                <Overlay onClick={() => setShowModal(false)} />
                <Modal>
                  <h4>Update Feedback Header</h4>
                  <input
                    type="text"
                    value={newHeaderText}
                    onChange={(e) => setNewHeaderText(e.target.value)}
                    placeholder="Enter new header text"
                  />
                  <Button onClick={handleUpdateFeedbackHeader}>Save</Button>
                  <Button onClick={() => setShowModal(false)}>Cancel</Button>
                </Modal>
              </>
            )}
          </Card>
        </PanelContainer>
        <Button onClick={handleLogout}>Log Out</Button>
      </Container>
      <Footer />
    </>
  );
};

export default AdminPanel;
