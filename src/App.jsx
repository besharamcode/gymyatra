import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import Footer from "./components/ui/Footer";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import FeaturesPage from "./pages/FeaturesPage";
import PricingPage from "./pages/PricingPage";
import UserDashboard from "./pages/user/Dashboard";
import UserProfile from "./pages/user/Profile";
import AdminDashboard from "./pages/admin/Dashboard";
import UserWorkoutPlan from "./pages/user/WorkoutPlan";
import UserProgressTracker from "./pages/user/ProgressTracker";
import AdminUsers from "./pages/admin/Users";
import AdminExercises from "./pages/admin/Exercises";
import AdminDietPlans from "./pages/admin/DietPlans";
import AdminWorkoutPlans from "./pages/admin/WorkoutPlans";
import PrivateRoute from "./components/PrivateRoute";
import NotFound from "./pages/NotFound";

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/pricing" element={<PricingPage />} />

            {/* User Routes */}
            <Route
              path="/user/dashboard"
              element={
                <PrivateRoute>
                  <UserDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/user/profile"
              element={
                <PrivateRoute>
                  <UserProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/user/workout-plan"
              element={
                <PrivateRoute>
                  <UserWorkoutPlan />
                </PrivateRoute>
              }
            />
            <Route
              path="/user/progress"
              element={
                <PrivateRoute>
                  <UserProgressTracker />
                </PrivateRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute isAdmin={true}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <PrivateRoute isAdmin={true}>
                  <AdminUsers />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/exercises"
              element={
                <PrivateRoute isAdmin={true}>
                  <AdminExercises />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/diet-plans"
              element={
                <PrivateRoute isAdmin={true}>
                  <AdminDietPlans />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/workout-plans"
              element={
                <PrivateRoute isAdmin={true}>
                  <AdminWorkoutPlans />
                </PrivateRoute>
              }
            />

            {/* Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
