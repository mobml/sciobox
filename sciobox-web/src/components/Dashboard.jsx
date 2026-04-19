import { useState, useEffect } from "react";
import ResourceList from "./ResourceList";
import {
  getResourcesRequest, 
  createResourceRequest, 
  updateResourceRequest,
  deleteResourceRequest
} from "../services/api";
const API = "http://localhost:3000/api/v1";

function Dashboard({ token, setToken }) {
    const [url, setUrl] = useState("");
    const [resources, setResources] = useState([]);
    
    const [editingResource, setEditingResource] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editUrl, setEditUrl] = useState("");


    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
    };

    const loadResources = async () => {
        if (!token) return;

        const data = await getResourcesRequest(token);
        console.log("data:", data);
        setResources(data);
    }

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

      <ResourceList resources={resources} openEdit={openEdit} deleteResource={deleteResource} />


      {
      // EDIT MODAL
      }
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

export default Dashboard;