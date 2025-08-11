import { Route, Routes, useNavigate } from "react-router-dom";
import Register from "./components/Register";
import { useEffect, useState } from "react";
import Chat from "./components/Chat";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    }
  }, [token]);

  const logoutHandler = () => {
    setIsLoggedIn(false);
    navigate("/");
    localStorage.removeItem("chatMessages");
  };

  return (
    <Routes>
      <Route path="/" element={isLoggedIn && <Register />} />
      <Route
        path="/chat"
        element={isLoggedIn && <Chat onLogout={logoutHandler} />}
      />
    </Routes>
  );
}

export default App;
