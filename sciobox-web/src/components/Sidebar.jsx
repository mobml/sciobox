import { useState } from "react";

function Sidebar({ folders, setSelectedFolder, createFolder, isOpen, onClose }) {
    const [newFolder, setNewFolder] = useState("");
    const [activeFolder, setActiveFolder] = useState(null);

    const handleFolderClick = (folderId) => {
        setSelectedFolder(folderId);
        setActiveFolder(folderId);
        onClose(); // cierra en móvil al seleccionar
    };

    return (
        <>
            {/* Overlay oscuro en móvil */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed md:static inset-y-0 left-0 z-30
                w-60 bg-gray-900 border-r border-gray-800 flex flex-col
                transform transition-transform duration-300
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
                md:translate-x-0
            `}>
                <div className="p-4 border-b border-gray-800">
                    <h3 className="text-xl font-bold text-white">Sciobox</h3>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    <div
                        className={`cursor-pointer px-2 py-1 rounded hover:bg-gray-800 text-gray-300 flex items-center gap-2 ${activeFolder === null ? 'bg-gray-800' : ''}`}
                        onClick={() => handleFolderClick(null)}
                    >
                        <span className="material-symbols-outlined">home</span>
                        <span>Inicio</span>
                    </div>

                    {folders.map((f) => (
                        <div
                            key={f.ID}
                            onClick={() => handleFolderClick(f.ID)}
                            className={`cursor-pointer px-2 py-1 rounded hover:bg-gray-800 text-gray-300 mt-1 flex items-center gap-2 ${activeFolder === f.ID ? 'bg-gray-800' : ''}`}
                        >
                            <span className="material-symbols-outlined">folder</span>
                            <span>{f.Name}</span>
                        </div>
                    ))}

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
                            Crear carpeta
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Sidebar;