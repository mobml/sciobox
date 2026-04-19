function ResourceList({ resources, openEdit, deleteResource, onMove }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {resources.map(r => (
          <div 
          key={r.ID}
          className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-slate-600 transition"
          >
            <h3 className="font-semibold text-sm leading-tight">{r.Title}</h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {r.Description}
            </p>
            {r.ImageURL && <img src={r.ImageURL} className="mt-3 rounded-lg w-full h-32 object-cover" />}
            <a href={r.URL} target="_blank" rel="noreferrer" className="text-xs text-indigo-400 block mt-2 truncate">
              {r.URL}
            </a>
            <div className="flex justify-between mt-3 text-sm text-slate-400">
                <button onClick={() => openEdit(r)}>✏️</button>
                <button onClick={() => deleteResource(r.ID)}>🗑️</button>
                <button onClick={() => onMove(r)}>📁</button>
            </div>
          </div>
        ))}
      </div>
  );
}

export default ResourceList;