# 📚 Documentación de API: Sciobox v1
## 🔑 Autenticación y Seguridad
La API utiliza **JSON Web Tokens (JWT)** para proteger las rutas.
*   **Header requerido:** `Authorization: Bearer <token_jwt>`
*   **Base URL:** `http://<domain>/api/v1`
---
## 🔐 Módulo de Autenticación
Rutas públicas para gestión de acceso.
| Método | Endpoint | Descripción | Body (JSON) - Campos Requeridos |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Crea una cuenta nueva (Rol 'user' por defecto). | `name`, `email`, `password` |
| `POST` | `/auth/login` | Obtiene el token de acceso JWT. | `email`, `password` |
---
## 👤 Módulo de Perfil (Usuario Autenticado)
Permite gestionar la cuenta del usuario actual. El ID se extrae automáticamente del token JWT.
| Método | Endpoint | Descripción | Body (JSON) - Campos Opcionales/Requeridos |
| :--- | :--- | :--- | :--- |
| `GET` | `/profile` | Obtiene los datos del usuario logueado. | Ninguno |
| `PUT` | `/profile` | Actualiza nombre o contraseña. | `name` (opt), `password` (opt) |
| `DELETE`| `/profile` | Elimina permanentemente la cuenta del usuario. | Ninguno |
---
## 📁 Módulo de Carpetas (Folders)
Gestión de colecciones personalizadas para organizar recursos.
| Método | Endpoint | Descripción | Body (JSON) - Campos Requeridos |
| :--- | :--- | :--- | :--- |
| `POST` | `/folders` | Crea una carpeta nueva para el usuario autenticado. | `name` |
| `GET` | `/folders` | Lista todas las carpetas del usuario autenticado. | Ninguno |
| `PUT` | `/folders/:id` | Renombra una carpeta existente. El ID de la carpeta se pasa en la URL. | `name` |
| `DELETE`| `/folders/:id` | Elimina la carpeta. Los recursos dentro de ella se volverán "huérfanos" (sin carpeta asignada). | Ninguno |
---
## 🔗 Módulo de Recursos (Resources)
Gestión de links, artículos y otros recursos web. El servidor realiza scraping automático al crear un recurso nuevo para obtener metadatos.
| Método | Endpoint | Descripción | Parámetros / Body (Campos Requeridos) |
| :--- | :--- | :--- | :--- |
| `POST` | `/resources` | Guarda un nuevo recurso web. El servidor intentará extraer título, descripción e imagen de la URL proporcionada. | `url`, `folder_id` (opcional/null) |
| `GET` | `/resources` | Lista todos los recursos del usuario autenticado. | Ninguno |
| `GET` | `/resources/folder/:folderId` | Filtra y lista los recursos que pertenecen a una carpeta específica del usuario autenticado. El ID de la carpeta se pasa en la URL. | `:folderId` (UUID) |
| `PUT` | `/resources/:id` | Edita los detalles de un recurso existente (título, URL, descripción) o lo mueve a otra carpeta. El ID del recurso se pasa en la URL. | `title` (opt), `url` (opt), `description` (opt), `folder_id` (opt/null) |
| `DELETE`| `/resources/:id` | Elimina el recurso. El ID del recurso se pasa en la URL. | Ninguno |
> **Nota para Frontend:** Al crear un recurso (`POST /resources`), si el servidor no logra extraer automáticamente un título de la URL, el campo `title` en la respuesta podría ser `"..."`. Si no se encuentra una imagen representativa, `image_url` será un string vacío. Se recomienda manejar estos casos ocultando el contenedor de imagen si `image_url` está vacío o si el título es `"..."`.
---
## 🛡️ Módulo Administrativo
Rutas protegidas para administradores del sistema. Requieren `role: "admin"` en el token JWT.
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/admin/users` | Lista todos los usuarios registrados en el sistema. |
---
## ⚠️ Códigos de Respuesta Comunes
*   **`200 OK`**: Operación exitosa.
*   **`201 Created`**: Recurso creado exitosamente.
*   **`400 Bad Request`**: Datos de entrada inválidos (ej. JSON mal formado, formato incorrecto de ID, campos faltantes).
*   **`401 Unauthorized`**: Token JWT faltante, inválido o expirado.
*   **`403 Forbidden`**: El usuario autenticado no tiene permisos para realizar la acción (ej: intentar modificar una carpeta que no le pertenece, o acceder a `/admin` sin ser administrador).
*   **`404 Not Found`**: El recurso específico solicitado (ej. un recurso o carpeta por ID) no existe.
*   **`500 Internal Server Error`**: Ocurrió un error inesperado en el servidor.
---
