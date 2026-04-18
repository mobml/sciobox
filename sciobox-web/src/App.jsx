import { useState, useEffect } from "react";
import { 
  loginRequest, 
  registerRequest, 
  getResourcesRequest, 
  createResourceRequest, 
  updateResourceRequest,
  deleteResourceRequest
} from "./services/api";

const API = "http://localhost:3000/api/v1";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isLogin, setIsLogin] = useState(true);

  // auth form fields states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [url, setUrl] = useState("");
  const [resources, setResources] = useState([]);


  const [editingResource, setEditingResource] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editUrl, setEditUrl] = useState("");

  // LOGIN
  const login = async () => {
    const data = await loginRequest(email, password);

    if (!data.token) {
      alert("Error");
      return;
    }

    localStorage.setItem("token", data.token);
    setToken(data.token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
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

  // GET RESOURCES
  const loadResources = async () => {
    if (!token) return;

    const data = await getResourcesRequest(token);
    console.log("data:", data);
    setResources(data);
  }

  // CREATE RESOURCE
  const createResource = async () => {
    await createResourceRequest(token, url);
    setUrl("");
    loadResources();
  }

  const updateResource = async () => {
    await updateResourceRequest(token, editingResource.ID, {
      title: editTitle,
      description: editDescription,
      url: editUrl
    });
    setEditingResource(null);
    loadResources();
  };

const deleteResource = async (id) => {
  await deleteResourceRequest(token, id);
  loadResources();
}


  // Runs loadResources when the component mounts and whenever the token changes
  useEffect(() => {
    loadResources();
  }, [token]);

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

  // MAIN VIEW
  return (
    <div style={{ padding: 20 }}>
      <button onClick={logout}>Cerrar sesión</button>
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
            <button onClick={() => deleteResource(r.ID)} style={{ marginLeft: 10, color: "red" }}>Eliminar</button>
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