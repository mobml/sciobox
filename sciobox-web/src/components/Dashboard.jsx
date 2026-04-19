import { useState, useEffect } from "react";
import ResourceList from "./ResourceList";
import EditResourceModal from "./EditResourceModal";
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
    

    //resource state for editing
    const [editingResource, setEditingResource] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editUrl, setEditUrl] = useState("");


    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
    };

    //---------Resource CRUD operations---------
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
    //---------End of Resource CRUD operations---------

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
            
            <ResourceList 
                resources={resources} 
                openEdit={openEdit} 
                deleteResource={deleteResource} 
            />


      {
      // EDIT MODAL
      }
      {editingResource && (
        <EditResourceModal
            setEditTitle={setEditTitle}
            setEditDescription={setEditDescription}
            setEditUrl={setEditUrl}
            setEditingResource={setEditingResource}
            updateResource={updateResource}
            editTitle={editTitle}
            editDescription={editDescription}
            editUrl={editUrl}
        />
      )}
    </div>

    );
}

export default Dashboard;