import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Jarvis from "./components/Jarvis";
import Loader from "./components/Loader";
import { PrivateRoute } from "./routes";

const Welcome = lazy(() => import("./pages/Welcome"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Ideas = lazy(() => import("./pages/Ideas"));
const Tasks = lazy(() => import("./pages/Tasks"));
const PostIdea = lazy(() => import("./pages/PostIdea"));
const ProjectWorkspace = lazy(() => import("./pages/ProjectWorkspace"));
const Chat = lazy(() => import("./pages/Chat"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const SkillSwap = lazy(() => import("./pages/SkillSwap"));
const VideoCall = lazy(() => import("./pages/VideoCall"));
const CollaborationRequests = lazy(() =>
  import("./pages/CollaborationRequests")
);
const NotFound = lazy(() => import("./pages/NotFound"));

function ProtectedPage({ children }) {
  return <PrivateRoute>{children}</PrivateRoute>;
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedPage>
                <Dashboard />
              </ProtectedPage>
            }
          />
          <Route
            path="/ideas"
            element={
              <ProtectedPage>
                <Ideas />
              </ProtectedPage>
            }
          />
          <Route
            path="/post-idea"
            element={
              <ProtectedPage>
                <PostIdea />
              </ProtectedPage>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedPage>
                <ProjectWorkspace />
              </ProtectedPage>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedPage>
                <Tasks />
              </ProtectedPage>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedPage>
                <Chat />
              </ProtectedPage>
            }
          />
          <Route
            path="/skill-swap"
            element={
              <ProtectedPage>
                <SkillSwap />
              </ProtectedPage>
            }
          />
          <Route
            path="/meeting/:roomId"
            element={
              <ProtectedPage>
                <VideoCall />
              </ProtectedPage>
            }
          />
          <Route
            path="/collaboration-requests"
            element={
              <ProtectedPage>
                <CollaborationRequests />
              </ProtectedPage>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedPage>
                <Profile />
              </ProtectedPage>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedPage>
                <Settings />
              </ProtectedPage>
            }
          />

          <Route path="/home" element={<Navigate to="/" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <Jarvis />
    </BrowserRouter>
  );
}

export default App;
