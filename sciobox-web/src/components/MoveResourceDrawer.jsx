function MoveResourceDrawer({ folders, onMove, onClose }) {
  return (
    <div style={{
      position: "fixed",
      top: 0,
      right: 0,
      width: 300,
      height: "100%",
      background: "white",
      boxShadow: "-2px 0 10px rgba(0,0,0,0.2)",
      padding: 20
    }}>
      <h3>Mover a carpeta</h3>

      <button onClick={onClose}>Cerrar</button>

      <hr />

      <div
        style={{ cursor: "pointer", marginTop: 10 }}
        onClick={() => onMove(null)}
      >
        📂 Sin carpeta
      </div>

      {folders.map(f => (
        <div
          key={f.id}
          style={{ cursor: "pointer", marginTop: 10 }}
          onClick={() => onMove(f.ID)}
        >
          📁 {f.Name}
        </div>
      ))}
    </div>
  );
}

export default MoveResourceDrawer;