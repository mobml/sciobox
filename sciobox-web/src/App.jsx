import { useState, useEffect } from "react";
import AuthForm from "./components/AuthForm";
import Dashboard from "./components/Dashboard";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // AUTH VIEW
  if (!token) {
    return <AuthForm setToken={setToken} />
  }

  return <Dashboard token={token} setToken={setToken} />;
}

export default App;