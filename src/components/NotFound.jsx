import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/student-profile'); // Redirect to StudentLoginPage after 5 seconds
    }, 1000);

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [navigate]);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>404</h1>
      <p style={styles.text}>Oops! The page you are looking for does not exist.</p>
      <p style={styles.text}>Redirecting you to the login page...</p>
      <Link to="/student-login" style={styles.link}>
        Go back to Login now
      </Link>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '50px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    fontSize: '72px',
    marginBottom: '20px',
    color: '#ff6b6b',
  },
  text: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#333',
  },
  link: {
    fontSize: '18px',
    color: '#007bff',
    textDecoration: 'none',
  },
};

export default NotFound;
