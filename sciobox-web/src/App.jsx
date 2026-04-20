import { useState, useEffect } from "react";
import AuthForm from "./components/AuthForm";
import Dashboard from "./components/Dashboard";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={!token ? <AuthForm setToken={setToken} /> : <Navigate to="/dashboard" replace/>} />
        <Route path="/dashboard" element={token ? <Dashboard token={token} setToken={setToken} /> : <Navigate to="/auth" replace/>} />
        <Route path="*" element={<Navigate to={token ? "/dashboard" : "/auth"} replace />} />
      </Routes>

    </BrowserRouter>
  )
  // AUTH VIEW
  if (!token) {
    return <AuthForm setToken={setToken} />
  }

  return <Dashboard token={token} setToken={setToken} />;
}

export default App;