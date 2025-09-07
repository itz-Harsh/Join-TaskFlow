import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Signup from "./auth/Signup";
import Login from "./auth/Login";
import Profile from "./auth/Profile";
import Home from "./pages/Home";
import Forget from "./auth/Forget";
import { useAuth } from "./contexts/authContext";
import API from "./api";
import { useEffect } from "react";
import OAuthSuccess from "./pages/OAuthSuccess";
// import { checkGoogleRedirectResult } from "./firebase/auth";

function App() {
  const { currentUser } = useAuth();

  // When Firebase currentUser becomes available, obtain an ID token and inform backend
  useEffect(() => {
    if (!currentUser) return;

    const syncGoogleUser = async () => {
      
  console.log(currentUser);
  const backendToken = currentUser.accessToken;
  if (backendToken) {
          localStorage.setItem("token", backendToken);
        }
      try {

        await API.post("/google-signin", {
          email: currentUser.email,
          firstname:
            (currentUser.displayName || "").split(" ")[0] ||
            `guest${Math.floor(Math.random() * 5000)}`,
          lastname: (currentUser.displayName || "").split(" ")[1] || "",
        });
        
      } catch (err) {
        console.log(
          "Not able to register in DB"
        );
      }
    };

    syncGoogleUser();
  }, [currentUser]);

  // Boolean for authentication
  const isAuthenticate = !!localStorage.getItem("token");


  return (
    <Router>
      <Routes>
        <Route path={"/signup"} element={!isAuthenticate ? <Signup /> : <Navigate to="/" />} />
        <Route path="/login" element={!isAuthenticate ? <Login /> : <Navigate to="/" />} />
        <Route path="/forget" element={!isAuthenticate ? <Forget /> : <Navigate to="/" />} />
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={isAuthenticate ? <Profile /> : <Navigate to="/" />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />

      </Routes>
    </Router>
  );
}

export default App;
