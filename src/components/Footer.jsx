import React from "react";
import styled from "styled-components";

const Div=styled.footer`
    display:flex;
    justify-content:center;
    align-items:center;
    margin:50px;
`

const Footer = () => {

    return(
        <Div>
            © 2024 SIES Graduate School Of Technology. All Rights Reserved.
        </Div>
    )

}

export default Footer;