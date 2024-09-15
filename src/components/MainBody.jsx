import React from "react";
import styled from "styled-components";
import FacultyLoginPage from "./components/FacultyLogin";
import SignUp from "./components/SignUp";
import StudentProfile from "./components/StudentProfile";
import StudentLoginPage from "./components/StudentLoginPage";

const Main=styled.div`
    display:flex;
    justify-content:center;
    align-items:center;
    `

const MainBody = () => {

    return(
        <Main>
            {/* <SignUp/> */}
            {/* <FacultyLoginPage/> */}
            <StudentLoginPage/>
            {/* <StudentProfile/> */}
        </Main>
    )

}

export default MainBody;
