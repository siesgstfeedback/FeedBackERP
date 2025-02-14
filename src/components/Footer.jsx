import React from "react";
import styled from "styled-components";

const Div = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0; /* Adjusted margin for better spacing */
  padding: 10px; /* Added padding for better appearance */
  width: 100%; /* Ensure it takes the full width */
//   background-color: #f9f9f9; /* Optional: Add a background color */
//   border-top: 1px solid #ddd; /* Optional: Add a top border for separation */
//   box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1); /* Optional: Add a subtle shadow for depth */
  overflow: hidden; /* Prevent horizontal scrolling */
  text-align: center; /* Center the text */
  font-size: 14px; /* Font size for better readability */
`;

const Footer = () => {
  return (
    <Div>
      © 2025 SIES Graduate School Of Technology. All Rights Reserved.
    </Div>
  );
};

export default Footer;
