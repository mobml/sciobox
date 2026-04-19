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
        <div className="flex h-screen bg-gray-900 text-white">
            <Sidebar 
                folders={folders} 
                setSelectedFolder={setSelectedFolder} 
                createFolder={createFolder}
            />
            <div className="flex-1 flex flex-col">
                <div className="bg-gray-900 p-6 border-b border-gray-800 sticky top-0 z-10">
                    <div className="flex justify-end items-center gap-4 mb-4">
                        <p className="text-sm text-gray-400">{localStorage.getItem("email")}</p>
                        <button
                            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-sm rounded"
                            onClick={logout}
                        >
                            Cerrar sesión
                        </button>
                    </div>

                    <h2 className="text-2xl font-bold mb-4">Resources</h2>

                    <div className="flex items-center gap-2">
                        <input
                            placeholder="URL"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="flex-1 px-3 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded"
                            onClick={createResource}
                        >
                            Guardar
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <ResourceList 
                        resources={resources} 
                        openEdit={openEdit} 
                        deleteResource={deleteResource}
                        onMove={(r) => setMovingResource(r)}
                    />

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
        </div>
    );
}

export default Dashboard;