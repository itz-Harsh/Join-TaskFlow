import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Home from "./components/Home";
import Forget from "./components/Forget";

function App() {
  const isAuthenticate = !!localStorage.getItem("token");

  return (
    <Router>
      {/* <nav>
        <Link to="/signup">Signup</Link>
        <Link to="/login">Login</Link>
        <Link to="/profile">Profile</Link>
      </nav> */}

      <Routes>
        <Route
          path={"/signup" }
          element={!isAuthenticate ? <Signup /> : <Navigate to="/" />}
        />


        <Route
          path="/login"
          element={!isAuthenticate ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/forget"
          element={!isAuthenticate ? <Forget /> : <Navigate to="/" />}
        />
        <Route path="/"
          element={<Home />}
          />

        <Route
          path="/profile"
          element={isAuthenticate ? <Profile /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
