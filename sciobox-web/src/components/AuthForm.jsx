import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest, registerRequest } from "../services/api";
import "./AuthForm.css";

function AuthForm({ setToken }) {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const login = async () => {
        const data = await loginRequest(email, password);

        if (!data.token) {
            alert("Error");
            return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("email", email);
        setToken(data.token);
        navigate("/dashboard");

    };

    const register = async () => {
        const data = await registerRequest(name, email, password);

        if (data.error) {
            alert(data.error);
        }

        alert("Usuario creado, ahora inicia sesión");
        setIsLogin(true);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                    {isLogin ? "Login" : "Register"}
                </h2>

                {!isLogin && (
                    <input
                        className="w-full p-3 mb-4 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Name"
                        onChange={(e) => setName(e.target.value)}
                    />
                )}

                <input
                    className="w-full p-3 mb-4 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    className="w-full p-3 mb-4 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                {isLogin ? (
                    <button
                        className="w-full p-3 mb-4 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                        onClick={login}
                    >
                        Login
                    </button>
                ) : (
                    <button
                        className="w-full p-3 mb-4 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                        onClick={register}
                    >
                        Register
                    </button>
                )}

                <button
                    className="w-full text-indigo-400 hover:text-indigo-500 text-sm underline"
                    onClick={() => setIsLogin(!isLogin)}
                >
                    {isLogin ? "Ir a Register" : "Ir a Login"}
                </button>
            </div>
        </div>
    );
}

export default AuthForm;