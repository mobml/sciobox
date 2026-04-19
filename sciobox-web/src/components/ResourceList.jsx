function ResourceList({ resources, openEdit, deleteResource }) {
  return (
    <ul>
        {resources.map(r => (
          <li key={r.ID}>
            <strong>{r.Title}</strong>
            <br />
            <p>{r.Description}</p>
            <br />
            {r.ImageURL && <img src={r.ImageURL} width="100" />}
            <br />
            <a href={r.URL} target="_blank" rel="noreferrer">
              {r.URL}
            </a>
            <button onClick={() => openEdit(r)}>Editar</button>
            <button onClick={() => deleteResource(r.ID)} style={{ marginLeft: 10, color: "red" }}>Eliminar</button>
            <hr />
          </li>
        ))}
      </ul>
  );
}

export default ResourceList;