import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import ExploreIdeas from "./pages/ExploreIdeas";
import SubmitIdea from "./pages/SubmitIdea";
import Teams from "./pages/Teams";
import Notifications from "./pages/Notifications";
import IdeaDetails from "./pages/IdeaDetails";
import MyIdeas from "./pages/MyIdeas";
import EditIdea from "./pages/EditIdea";
import ProtectedRoute from "./components/ProtectedRoute";
import Collaborations from "./pages/Collaborations";
import MentorDashboard from "./pages/MentorDashboard";
import MentorProfile from "./pages/MentorProfile";
import ProjectDashboard from "./pages/ProjectDashboard";
import ProjectDetails from "./pages/ProjectDetails";
import AdminDashboard from "./pages/AdminDashboard";
import CreateTeam from "./pages/CreateTeam";
import TeamDetails from "./pages/TeamDetails";
import JoinRequests from "./pages/JoinRequests";
import Reviews from "./pages/Reviews";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public pages */}

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/explore-ideas"
          element={<ExploreIdeas />}
        />

        <Route
          path="/ideas/:id"
          element={<IdeaDetails />}
        />

        {/* Protected pages */}

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

        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/submit-idea"
          element={
            <ProtectedRoute>
              <SubmitIdea />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teams"
          element={
            <ProtectedRoute>
              <Teams />
            </ProtectedRoute>
          }
        />

        <Route
          path="/collaborations"
          element={
            <ProtectedRoute>
              <Collaborations />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-ideas"
          element={
            <ProtectedRoute>
              <MyIdeas />
            </ProtectedRoute>
          }
        />


        <Route path="/projects" element={<ProtectedRoute><ProjectDashboard /></ProtectedRoute>} />
        <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
        <Route path="/mentor-dashboard" element={<ProtectedRoute><MentorDashboard /></ProtectedRoute>} />
        <Route path="/mentor-profile" element={<ProtectedRoute><MentorProfile /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/teams/create" element={<ProtectedRoute><CreateTeam /></ProtectedRoute>} />
        <Route path="/teams/requests" element={<ProtectedRoute><JoinRequests /></ProtectedRoute>} />
        <Route path="/teams/:id" element={<ProtectedRoute><TeamDetails /></ProtectedRoute>} />
        <Route path="/ideas/:id/reviews" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />

        <Route
          path="/edit-idea/:id"
          element={
            <ProtectedRoute>
              <EditIdea />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;