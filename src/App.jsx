import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Browse from './pages/Browse';
import ParentQuestionnaire from './pages/ParentQuestionnaire';
import StudentQuestionnaire from './pages/StudentQuestionnaire';
import TutorSignup from './pages/TutorSignup';
import Booking from './pages/Booking';
import Dashboard from './pages/Dashboard';
import TutorDashboard from './pages/TutorDashboard';
import SignIn from './pages/SignIn';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen font-inter">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/questionnaire" element={<ParentQuestionnaire />} />
              <Route path="/student-questionnaire" element={<StudentQuestionnaire />} />
              <Route path="/tutor-signup" element={<TutorSignup />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tutor-dashboard" element={<TutorDashboard />} />
              <Route path="/signin" element={<SignIn />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
