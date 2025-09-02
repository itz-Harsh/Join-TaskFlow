import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Profile from "./components/Profile";

function App() {
  const isAuthenticate = !!localStorage.getItem("token");

  return (
    <Router>
      <nav>
        <Link to={"/signup" && "/" }>Signup</Link>
        <Link to="/login">Login</Link>
        <Link to="/profile">Profile</Link>
      </nav>

      <Routes>
        {/* If not authenticated, show Signup/Login, else redirect to /profile */}
        <Route
          path={"/signup" && "/" }
          element={!isAuthenticate ? <Signup /> : <Navigate to="/profile" replace />}
        />
        <Route
          path="/login"
          element={!isAuthenticate ? <Login /> : <Navigate to="/profile" replace />}
        />

        {/* If authenticated, show Profile, else redirect to /login */}
        <Route
          path="/profile"
          element={isAuthenticate ? <Profile /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
