import { useState, useEffect } from "react";
import ResourceList from "./ResourceList";
import EditResourceModal from "./EditResourceModal";
import MoveResourceDrawer from "./MoveResourceDrawer";
import Sidebar from "./Sidebar";
import {
  getResourcesRequest, 
  createResourceRequest, 
  updateResourceRequest,
  deleteResourceRequest,
  createFolderRequest
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

    //folder state
    const [folders, setFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState(null);

    const [movingResource, setMovingResource] = useState(null);


    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
    };

    //---------Resource CRUD operations---------
    /*const loadResources = async () => {
        if (!token) return;

        const data = await getResourcesRequest(token);
        console.log("data:", data);
        setResources(data);
    }*/

    const loadResources = async () => {
        if (!token) return;

        let data;

        if (selectedFolder) {
            const res = await fetch(API + "/resources/folder/" + selectedFolder, {
                headers: { Authorization: "Bearer " + token }
            });
            data = await res.json();
        } else {
            data = await getResourcesRequest(token);
        }

        setResources(data);
    };

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

    const moveResource = async (folderId) => {
        if (!movingResource) return;

        await updateResourceRequest(token, movingResource.ID, {
            folder_id: folderId
        });

        setMovingResource(null);
        loadResources();
    };

    const deleteResource = async (id) => {
        await deleteResourceRequest(token, id);
        loadResources();
    }
    //---------End of Resource CRUD operations---------

    //---------Folder CRUD operations---------
    
    const loadFolders = async () => {
        const res = await fetch(API + "/folders", {
            headers: {
                Authorization: "Bearer " + token
            }
        });

        const data = await res.json();
        setFolders(data);
    };

    const createFolder = async (name) => {
        await createFolderRequest(token, name);
        loadFolders();
    }
    //---------End of Folder CRUD operations---------


    useEffect(() => {
        if (token) {
            loadFolders();
        }
    }, [token]);

    useEffect(() => {
        loadResources();
    }, [selectedFolder, token]);

    //function to open the modal
    const openEdit = (r) => {
        setEditingResource(r);
        setEditTitle(r.Title || "");
        setEditDescription(r.Description || "");
        setEditUrl(r.URL || "");
    };


    return (
        <div style={{ display: "flex" }}>

            <Sidebar 
                folders={folders} 
                setSelectedFolder={setSelectedFolder} 
                createFolder={createFolder}
            />
            <div style={{ flex: 1, padding: 20 }}>
                <p>{localStorage.getItem("email")}</p>
                <button onClick={logout}>Cerrar sesión</button>
                <br />
                <br />
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
                    onMove={(r) => setMovingResource(r)}
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
                {movingResource && (
                    <MoveResourceDrawer
                        folders={folders}
                        onMove={moveResource}
                        onClose={() => setMovingResource(null)}
                    />
                )}
            </div>
        </div>    
    );
}

export default Dashboard;