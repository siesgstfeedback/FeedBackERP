import React, { useEffect, useState } from "react";
import logo from "../assets/sies_gst_logo.png";
import styled from "styled-components";
import supabase from "../config/SupabaseClient";

const Logo = styled.img`
  max-width: 170px;
  height: auto;
  @media (max-width: 768px) {
    max-width: 150px; /* Adjust size for smaller screens */
  }
  @media (max-width: 480px) {
    max-width: 100px; /* Adjust size for smaller screens */
  }
`;

const TitleBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  padding: 10px;
  max-width: 700px;
`;

const HeaderTitle = styled.h1`
  font-size: 2rem;
  margin-top: 20px;
  color: #333;
  @media (max-width: 768px) {
    font-size: 1.5rem; /* Adjust font size for smaller screens */
  }

  @media (max-width: 480px) {
    font-size: 1rem; /* Adjust font size for smaller screens */
  }
`;

const Title = styled.h1`
  font-weight: 200;
  margin-left: 20px; /* Adjusted margin for smaller screens */
  margin-top: 20px;
  font-size: 2rem; /* Increased font size */
  text-align: center; /* Center the title */
  flex: 1; /* Allow title to grow in flex container */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* Added text shadow */
  @media (max-width: 768px) {
    font-size: 1.5rem; /* Adjust font size for smaller screens */
  }
  @media (max-width: 590px) {
    font-size: 1rem; /* Adjust font size for smaller screens */
  }
  @media (max-width: 420px) {
    font-size: 1rem; /* Adjust font size for smaller screens */
  }
`;

const Header = () => {
  const [headerText, setHeaderText] = useState("Feedback 2024");

  useEffect(() => {
    fetchHeaderText();
  }, []);

  const fetchHeaderText = async () => {
    const { data, error } = await supabase
      .from("settings")
      .select("feedback_header_text")
      .eq("id", 1)
      .single();

    if (error) {
      console.error("Error fetching header text:", error);
    } else if (data) {
      setHeaderText(data.feedback_header_text || "Feedback 2024");
    }
  };

  return (
    <>
      <center>
        <TitleBar>
          <Logo src={logo} alt="College logo" />
          <Title>
            <b>SIES Graduate School of Technology</b>
          </Title>
        </TitleBar>
        <HeaderTitle>{headerText}</HeaderTitle>
      </center>
    </>
  );
};

export default Header;
