import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './components/SignUp';
import StudentLoginPage from './components/StudentLoginPage'; // Add your login component imports
import FacultyLogin from './components/FacultyLogin';
import StudentProfile from './components/StudentProfile';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/student-login" element={<StudentLoginPage />} />
        <Route path="/faculty-login" element={<FacultyLogin />} />
        <Route path="/student-profile" element={<StudentProfile />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
