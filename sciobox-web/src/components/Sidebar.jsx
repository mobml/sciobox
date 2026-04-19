import { useState } from "react";

function Sidebar({ folders, setSelectedFolder, createFolder }) {
    const [newFolder, setNewFolder] = useState("");
    const [activeFolder, setActiveFolder] = useState(null);

    const handleFolderClick = (folderId) => {
        setSelectedFolder(folderId);
        setActiveFolder(folderId);
    };

    return (
        <div className="w-60 bg-gray-900 border-r border-gray-800 flex flex-col">
            <div className="p-4 border-b border-gray-800">
                <h3 className="text-xl font-bold text-white">Sciobox</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <div
                    className={`cursor-pointer px-2 py-1 rounded hover:bg-gray-800 text-gray-300 ${activeFolder === null ? 'bg-gray-800' : ''}`}
                    onClick={() => handleFolderClick(null)}
                >
                    🏠 Inicio
                </div>

                {/* FOLDERS */}
                {folders.map((f) => (
                    <div
                        key={f.ID}
                        onClick={() => handleFolderClick(f.ID)}
                        className={`cursor-pointer px-2 py-1 rounded hover:bg-gray-800 text-gray-300 mt-1 ${activeFolder === f.ID ? 'bg-gray-800' : ''}`}
                    >
                        📁 {f.Name}
                    </div>
                ))}

                {/* CREATE FOLDER */}
                <div className="mt-4">
                    <input
                        className="w-full p-2 rounded bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Nueva carpeta"
                        value={newFolder}
                        onChange={(e) => setNewFolder(e.target.value)}
                    />
                    <button
                        className="w-full mt-2 p-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                        onClick={() => {
                            createFolder(newFolder);
                            setNewFolder("");
                        }}
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;