function EditResourceModal({ 
    editTitle,
    editDescription,
    editUrl,
    setEditTitle,
    setEditDescription,
    setEditUrl,
    setEditingResource,
    updateResource    

}) {
    return (
        <div className="fixed inset-0 flex justify-center items-center z-50">
            <div 
                className="absolute inset-0 bg-black/50"
                onClick={() => setEditingResource(null)}
                ></div>
            <div className="relative bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                <h3 className="text-xl font-bold text-white mb-4">Editar recurso</h3>

                <input
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    placeholder="Title"
                    className="w-full p-2 mb-4 rounded bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <input
                    value={editDescription}
                    onChange={e => setEditDescription(e.target.value)}
                    placeholder="Description"
                    className="w-full p-2 mb-4 rounded bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <input
                    value={editUrl}
                    onChange={e => setEditUrl(e.target.value)}
                    placeholder="URL"
                    className="w-full p-2 mb-4 rounded bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <div className="flex justify-end gap-4">
                    <button 
                        onClick={updateResource} 
                        className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                    >
                        Guardar
                    </button>
                    <button 
                        onClick={() => setEditingResource(null)} 
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditResourceModal;