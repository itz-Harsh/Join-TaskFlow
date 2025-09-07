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
import { checkGoogleRedirectResult } from "./firebase/auth";

function App() {
  const { currentUser, setCurrentUser } = useAuth(); // make sure your context exposes setCurrentUser


  useEffect(() => {
    
    const handleRedirect = async () => {
      const user = await checkGoogleRedirectResult();
      if (user) {
        setCurrentUser(user);
        console.log(currentUser)
        // sync with backend
        try {
          const backendToken = await user.getIdToken();
          await API.post("/google-signin", {
            email: user.email,
            firstname: (user.displayName || "").split(" ")[0] || `guest${Math.floor(Math.random() * 5000)}`,
            lastname: (user.displayName || "").split(" ")[1] || "",
          });
          localStorage.setItem("token", backendToken);
        } catch (err) {
          console.log("Not able to register in DB");
        }
      }
    };
    handleRedirect();
  }, [currentUser , setCurrentUser]);

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
