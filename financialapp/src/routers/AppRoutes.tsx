import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import Budgeting from "@/layouts/Budgeting";
import Chatbot from "@/layouts/Chatbot";
import Dashboard from "@/layouts/Dashboard";
import Goals from "@/layouts/Goals";
import Profile from "@/layouts/Profile";
import Transaction from "@/layouts/Transaction";
import Login from "@/layouts/Authentication/Login";
import Signup from "@/layouts/Authentication/Signup";

const isAuthenticated = () => {
  // Simulate authentication status (temporary)
  return localStorage.getItem("auth") === "true";
};

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/budgeting"
          element={
            <ProtectedRoute>
              <Budgeting />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chatbot"
          element={
            <ProtectedRoute>
              <Chatbot />
            </ProtectedRoute>
          }
        />
        <Route
          path="/goals"
          element={
            <ProtectedRoute>
              <Goals />
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
        <Route
          path="/transaction"
          element={
            <ProtectedRoute>
              <Transaction />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
