import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './components/SignUp';
import StudentLoginPage from './components/StudentLoginPage';
import FacultyLogin from './components/FacultyLogin';
import StudentProfile from './components/StudentProfile';
import AddFaculty from './components/AddFaculty';
import AddSubject from './components/AddSubject';
import AdminPanel from './components/AdminPanel';
import FacultyPanel from './components/FacultyPanel';
import FeedBackForm from './components/FeedBackForm';
import FeedbackAdmin from './components/FeedbackAdmin';
import supabase from './config/SupabaseClient'; // Import supabase for fetching settings
import { useEffect, useState } from 'react';
import FacultyView from './components/FacultyView';
import NotFilledStudents from './components/NotFilledStudents';
import TimeTableCoord from './components/TimeTableCoord';
import AdminAllocation from './components/AdminAllocation'

function App() {
  const [settings, setSettings] = useState({ feedback: false, displayFacultyFeedback: false });

  // Function to fetch settings
  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('student_feedback, display_facultyfeedback')
        .eq('id', 1) // Adjust the id as necessary
        .single();

      if (error) throw new Error(error.message);
      setSettings({ feedback: data.student_feedback, displayFacultyFeedback: data.display_facultyfeedback });
    } catch (error) {
      console.error("Error fetching settings:", error.message);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/student-login" element={<StudentLoginPage />} />
        <Route path="/faculty-login" element={<FacultyLogin />} />
        <Route path="/student-profile" element={<StudentProfile />} />
        <Route path="/add-faculty" element={<AddFaculty />} />
        <Route path="/add-subject" element={<AddSubject />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/faculty" element={<FacultyPanel />} />
        <Route path="/feedback-admin" element={<FeedbackAdmin />} />
        <Route path="/not-filled-students" element={<NotFilledStudents />} />
        <Route path="/tt-coord" element={<TimeTableCoord />} />
        <Route path="/ttcoordpanel" element={<AdminAllocation />} />
        {settings.feedback && <Route path="/feedback" element={<FeedBackForm />} />}
        {settings.displayFacultyFeedback && <Route path="/faculty-view" element={<FacultyView />} />}
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;