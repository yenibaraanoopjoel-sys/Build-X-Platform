import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

//
// PAGES
//
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Ideas from "./pages/Ideas";
import Tasks from "./pages/Tasks";
import PostIdea from "./pages/PostIdea";
import Projects from "./pages/Projects";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import SkillSwap from "./pages/SkillSwap";
import VideoCall from "./pages/VideoCall";
import CollaborationRequests from "./pages/CollaborationRequests";
import NotFound from "./pages/NotFound";

//
// COMPONENTS
//
import Jarvis from "./components/Jarvis";

//
// PROTECTED ROUTE
//
import { PrivateRoute } from "./routes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* WELCOME */}
        <Route
          path="/"
          element={<Welcome />}
        />

        {/* PUBLIC ROUTES */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* IDEAS */}
        <Route
          path="/ideas"
          element={
            <PrivateRoute>
              <Ideas />
            </PrivateRoute>
          }
        />

        {/* POST IDEA */}
        <Route
          path="/post-idea"
          element={
            <PrivateRoute>
              <PostIdea />
            </PrivateRoute>
          }
        />

        {/* PROJECTS */}
        <Route
          path="/projects"
          element={
            <PrivateRoute>
              <Projects />
            </PrivateRoute>
          }
        />

        {/* TASKS */}
        <Route
          path="/tasks"
          element={
            <PrivateRoute>
              <Tasks />
            </PrivateRoute>
          }
        />

        {/* CHAT */}
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />

        {/* SKILL SWAP */}
        <Route
          path="/skill-swap"
          element={
            <PrivateRoute>
              <SkillSwap />
            </PrivateRoute>
          }
        />

        {/* VIDEO CALL */}
        <Route
          path="/meeting/:roomId"
          element={
            <PrivateRoute>
              <VideoCall />
            </PrivateRoute>
          }
        />

        {/* REQUESTS */}
        <Route
          path="/collaboration-requests"
          element={
            <PrivateRoute>
              <CollaborationRequests />
            </PrivateRoute>
          }
        />

        {/* PROFILE */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* SETTINGS */}
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />

        {/* REDIRECT */}
        <Route
          path="/home"
          element={
            <Navigate to="/" />
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>

      {/* GLOBAL AI */}
      <Jarvis />
    </BrowserRouter>
  );
}

export default App;