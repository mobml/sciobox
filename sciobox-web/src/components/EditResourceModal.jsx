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
    );
}

export default EditResourceModal;