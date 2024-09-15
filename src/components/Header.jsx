import React from "react";
import logo from "../assets/sies_gst_logo.jpg";
import styled from "styled-components";

const Logo=styled.img`
    max-width:170px;
    text-align:center;
`

const TitleBar=styled.div`
    display:flex;
    justify-content:center;
    align-items:center;
`
const Title=styled.h1`
    font-weight:200;
    margin-left:50px;
    margin-top:20px;
`

const Header = () => {

    return(
        <>
        <TitleBar> 
            <Logo src={logo} alt="College logo"/>
            <Title><b>SIES Graduate School of Technology</b></Title>            
        </TitleBar>
        <center><Title>Feedback 2024</Title></center>
        </>
    )

}

export default Header;