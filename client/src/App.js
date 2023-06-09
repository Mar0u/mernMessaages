import { Routes, Route, Navigate } from "react-router-dom";
import Main from "./components/Main";
import Signup from "./components/Signup";
import Login from "./components/Login";
import UserMessages from "./components/UserMessages";

function App() {
  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return token ? true : false;
  };

  return (
    <Routes>
      <Route
        path="/signup"
        element={isAuthenticated() ? <Navigate to="/" replace /> : <Signup />}
      />
      <Route
        path="/login"
        element={isAuthenticated() ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/"
        element={isAuthenticated() ? <Main /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/messages/user/:userId"
        element={isAuthenticated() ? <UserMessages /> : <Navigate to="/login" replace />}
      />
      <Route path="/*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
