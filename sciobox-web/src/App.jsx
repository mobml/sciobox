import { useState, useEffect } from "react";

const API = "http://localhost:3000/api/v1";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [url, setUrl] = useState("");
  const [resources, setResources] = useState([]);


  const [editingResource, setEditingResource] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editUrl, setEditUrl] = useState("");

  // 🔐 LOGIN
  const login = async () => {
    const res = await fetch(API + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Error en login");
      return;
    }

    localStorage.setItem("token", data.token);
    setToken(data.token);
  };

  // 📝 REGISTER
  const register = async () => {
    const res = await fetch(API + "/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Error en registro");
      return;
    }

    alert("Usuario creado, ahora inicia sesión");
    setIsLogin(true);
  };

  // 📚 GET RESOURCES
  const loadResources = async () => {
    if (!token) return;

    const res = await fetch(API + "/resources", {
      headers: {
        Authorization: "Bearer " + token
      }
    });

    const data = await res.json();
    console.log(data);
    setResources(data);
  };

  // ➕ CREATE RESOURCE
  const createResource = async () => {
    await fetch(API + "/resources", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ url })
    });

    setUrl("");
    loadResources();
  };

  useEffect(() => {
    loadResources();
  }, [token]);

  //function to update the resource
  const updateResource = async () => {
  await fetch(API + "/resources/" + editingResource.ID, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({
      title: editTitle,
      description: editDescription,
      url: editUrl
    })
  });

  setEditingResource(null);
  loadResources();
};


  //function to open the modal

  const openEdit = (r) => {
  setEditingResource(r);
  setEditTitle(r.Title || "");
  setEditDescription(r.Description || "");
  setEditUrl(r.URL || "");
};

  // 🔐 AUTH VIEW
  if (!token) {
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

  // 📚 MAIN VIEW
  return (
    <div style={{ padding: 20 }}>
      <h2>Resources</h2>

      <input
        placeholder="URL"
        value={url}
        onChange={e => setUrl(e.target.value)}
      />
      <button onClick={createResource}>Guardar</button>

      <ul>
        {resources.map(r => (
          <li key={r.id}>
            <strong>{r.Title}</strong>
            <br />
            <p>{r.Description}</p>
            <br />
            {r.ImageURL && <img src={r.ImageURL} width="100" />}
            <br />
            <a href={r.URL} target="_blank" rel="noreferrer">
              {r.URL}
            </a>
            <button onClick={() => openEdit(r)}>Editar</button>
            <hr />
          </li>
        ))}
      </ul>
      {editingResource && (
  <div style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }}>
    <div style={{ background: "white", padding: 20 }}>
      <h3>Editar recurso</h3>

      <input
        value={editTitle}
        onChange={e => setEditTitle(e.target.value)}
        placeholder="Title"
      />
      <br />

      <input
        value={editDescription}
        onChange={e => setEditDescription(e.target.value)}
        placeholder="Description"
      />
      <br />

      <input
        value={editUrl}
        onChange={e => setEditUrl(e.target.value)}
        placeholder="URL"
      />
      <br /><br />

      <button onClick={updateResource}>Guardar</button>
      <button onClick={() => setEditingResource(null)}>Cancelar</button>
    </div>
  </div>
)}
    </div>
  );
}

export default App;