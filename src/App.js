import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import { AuthProvider, useAuth } from "./context/AuthContext.js";

// Components
import NavigationBar from "./components/Layout/Navbar.js";
import Footer from "./components/Layout/Footer.js";

// Pages
import Home from "./pages/Home.js";
import Login from "./pages/Auth/Login.js";
import Register from "./pages/Auth/Register.js";
import EmailVerification from "./components/EmailVerification.js";
import CourseList from "./pages/Courses/CourseList.js";
import CourseDetail from "./pages/Courses/CourseDetail.js";
import Dashboard from "./pages/Dashboard/Dashboard.js";
import CreateCourseForm from "./components/Course/CreateCourseForm.js";
import EditCourseForm from "./components/Course/EditCourseForm.js";
import CourseStudents from "./components/Course/CourseStudents.js";
import ForgotPassword from "./pages/Auth/ForgotPassword.js";
import AIChatAssistant from "./components/AI/AIChatAssistant.js";
import Profile from "./pages/Profile/Profile.js";
import AboutUs from "./pages/AboutUs/AboutUs.js";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>;
  }
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>;
  }
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

function AppContent() {
  return (
    <div className="App">
      <NavigationBar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route
            path="/create-course"
            element={
              <ProtectedRoute>
                <CreateCourseForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-course/:id"
            element={
              <ProtectedRoute>
                <EditCourseForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/course-students/:id"
            element={
              <ProtectedRoute>
                <CourseStudents />
              </ProtectedRoute>
            }
          />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/ai-assistant" element={<AIChatAssistant />} />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
