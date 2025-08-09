import { BrowserRouter } from "react-router-dom";
import Register from "./components/Register";
import { useEffect, useState } from "react";
import Chat from "./components/Chat";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return <BrowserRouter>{isLoggedIn ? <Chat /> : <Register />}</BrowserRouter>;
}

export default App;
