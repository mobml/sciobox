import React, { useState } from "react";
import { loginRequest, registerRequest } from "../services/api";


function AuthForm({ setToken }) {
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
        setToken(data.token);
    };

    // REGISTER
    const register = async () => {
        const data = await registerRequest(name, email, password);

        if(data.error) {
            alert(data.error);
        }

        alert("Usuario creado, ahora inicia sesión");
        setIsLogin(true);
    }    

    return (
        <div style={{ padding: 20 }}>
            <h2>{isLogin ? "Login" : "Register"}</h2>

            {!isLogin && (
            <>
                <input
                    placeholder="name"
                    onChange={e => setName(e.target.value)}
                />
                <br />
            </>
        )}

        <input
          placeholder="email"
          onChange={e => setEmail(e.target.value)}
        />
        <br />

        <input
          type="password"
          placeholder="password"
          onChange={e => setPassword(e.target.value)}
        />
        <br />

        {isLogin ? (
          <button onClick={login}>Login</button>
        ) : (
          <button onClick={register}>Register</button>
        )}

        <br /><br />

        <button onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Ir a Register" : "Ir a Login"}
        </button>
      </div>
    );
}

export default AuthForm;