import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Pages
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Ideas from "./pages/Ideas";
import Tasks from "./pages/Tasks";
import PostIdea from "./pages/PostIdea";
import ProjectWorkspace from "./pages/ProjectWorkspace";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import SkillSwap from "./pages/SkillSwap";
import VideoCall from "./pages/VideoCall";
import NotFound from "./pages/NotFound";

// Components
import Jarvis from "./components/Jarvis";

// Protected Route
import { PrivateRoute } from "./routes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Welcome Page */}
        <Route
          path="/"
          element={<Welcome />}
        />

        {/* Public Routes */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/ideas"
          element={
            <PrivateRoute>
              <Ideas />
            </PrivateRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <PrivateRoute>
              <Tasks />
            </PrivateRoute>
          }
        />

        <Route
          path="/post-idea"
          element={
            <PrivateRoute>
              <PostIdea />
            </PrivateRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <PrivateRoute>
              <ProjectWorkspace />
            </PrivateRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />

        {/* Skill Swap Route */}
        <Route
          path="/skill-swap"
          element={
            <PrivateRoute>
              <SkillSwap />
            </PrivateRoute>
          }
        />

        {/* Video Meeting Route */}
        <Route
          path="/meeting/:roomId"
          element={
            <PrivateRoute>
              <VideoCall />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />

        {/* Redirect Old Route */}
        <Route
          path="/home"
          element={
            <Navigate to="/" />
          }
        />

        {/* 404 Page */}
        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>

      {/* Global JARVIS AI */}
      <Jarvis />
    </BrowserRouter>
  );
}

export default App;