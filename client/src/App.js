import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { PrivateRoute, PublicOnlyRoute } from "./routes";
import Loader from "./components/Loader";
import Jarvis from "./components/Jarvis";

const Welcome = lazy(() => import("./pages/Welcome"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Ideas = lazy(() => import("./pages/Ideas"));
const PostIdea = lazy(() => import("./pages/PostIdea"));
const ProjectWorkspace = lazy(() => import("./pages/ProjectWorkspace"));
const Tasks = lazy(() => import("./pages/Tasks"));
const SkillSwap = lazy(() => import("./pages/SkillSwap"));
const CollaborationRequests = lazy(() => import("./pages/CollaborationRequests"));
const Chat = lazy(() => import("./pages/Chat"));
const VideoCall = lazy(() => import("./pages/VideoCall"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* Public Landing */}
            <Route path="/" element={<Welcome />} />

            {/* Public Auth */}
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <Login />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicOnlyRoute>
                  <Register />
                </PublicOnlyRoute>
              }
            />

            {/* Authenticated Application Modules */}
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
              path="/tasks"
              element={
                <PrivateRoute>
                  <Tasks />
                </PrivateRoute>
              }
            />
            <Route
              path="/skill-swap"
              element={
                <PrivateRoute>
                  <SkillSwap />
                </PrivateRoute>
              }
            />
            <Route
              path="/collaboration-requests"
              element={
                <PrivateRoute>
                  <CollaborationRequests />
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

            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>

        {/* Global Floating AI Assistant */}
        <Jarvis />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
