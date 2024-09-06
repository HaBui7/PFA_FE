import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import AppLayout from "./AppLayout";
import Budgeting from "@/layouts/Budgeting";
import Chatbot from "@/layouts/Chatbot";
import Dashboard from "@/layouts/Dashboard";
import Goals from "@/layouts/Goals";
import Profile from "@/layouts/Profile";
import Transaction from "@/layouts/Transaction";
import Login from "@/layouts/Authentication/Login";
import Signup from "@/layouts/Authentication/Signup";
import HomePage from "@/layouts/Homepage";

const isAuthenticated = () => {
  // Simulate authentication status (temporary)
  return localStorage.getItem("auth");
};

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};
const PublicRoute = ({ children }: { children: JSX.Element }) => {
  return children;
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          element={
            <PublicRoute>
              <AppLayout />
            </PublicRoute>
          }
        >
          <Route
            path="/"
            element={
              <PublicRoute>
                <HomePage />
              </PublicRoute>
            }
          />
        </Route>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/dashboard"
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
            path="/chatbot/:conversationId"
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
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;