import { useState } from "react";

function Sidebar({ folders, onSelectFolder, createFolder }) {
    const [newFolder, setNewFolder] = useState("");
    return (
        <div style={{
            width: 200,
            background: "#111",
            color: "white",
            height: "100vh",
            padding: 10
        }}>
        <h3>Sciobox</h3>

        <div
            style={{ cursor: "pointer", marginBottom: 10 }}
            onClick={() => onSelectFolder(null)}
        >
        🏠 Inicio
        </div>

        <hr />

        {/* FOLDERS */}
        {folders.map(f => (
            <div
                key={f.ID}
                style={{ cursor: "pointer", marginTop: 10 }}
                onClick={() => onSelectFolder(f.ID)}
            >
                📁 {f.Name}
            </div>
            ))}

        <hr />
        
        {/* CREATE FOLDER */}
        <input
            placeholder="Nueva carpeta"
            value={newFolder}
            onChange={e => setNewFolder(e.target.value)}
        />
        <button onClick={() => {
            createFolder(newFolder);
            setNewFolder("");
        }}>
         + 
        </button>

        </div>
        
    );
}

export default Sidebar;