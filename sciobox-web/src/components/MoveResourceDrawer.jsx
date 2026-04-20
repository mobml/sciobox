function MoveResourceDrawer({ folders, onMove, onClose }) {
  return (
    <>
    <div
        className="fixed inset-0 bg-black/50 z-30"
        onClick={onClose}
      />
    <div className="fixed top-0 right-0 h-full w-80 bg-gray-800 shadow-lg p-4 z-40 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-white">Mover a carpeta</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-200 focus:outline-none"
        >
          ✕
        </button>
      </div>

      <hr className="border-gray-700 mb-4" />

      <div
        className="cursor-pointer px-3 py-2 rounded hover:bg-gray-700 text-gray-300 flex items-center gap-2"
        onClick={() => onMove(null)}
      >
        <span className="material-symbols-outlined">folder</span>
        <span>Sin carpeta</span>
      </div>

      {folders.map((f) => (
        <div
          key={f.ID}
          className="cursor-pointer px-3 py-2 rounded hover:bg-gray-700 text-gray-300 mt-2 flex items-center gap-2"
          onClick={() => onMove(f.ID)}
        >
          <span className="material-symbols-outlined">folder</span>
          <span>{f.Name}</span>
        </div>
      ))}
    </div>
    </>
  );
}

export default MoveResourceDrawer;