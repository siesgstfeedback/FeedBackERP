import React from "react";
import styled from "styled-components";
import FacultyLoginPage from "./components/FacultyLogin";
import SignUp from "./components/SignUp";
import StudentProfile from "./components/StudentProfile";
import StudentLoginPage from "./components/StudentLoginPage";

const Main = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%; /* Ensures the main container takes full width */
    padding: 20px; /* Adds padding to prevent content from touching the edges */
    box-sizing: border-box; /* Includes padding in width calculations */
    overflow-x: hidden; /* Prevents horizontal scrolling */
`;

const MainBody = () => {
    return (
        <Main>
            {/* <SignUp/> */} {/* checking purpose */}
            {/* <FacultyLoginPage/> */} {/* checking purpose */}
            <StudentLoginPage />
            {/* <StudentProfile/> */} {/* checking purpose */}
        </Main>
    );
};

export default MainBody;
