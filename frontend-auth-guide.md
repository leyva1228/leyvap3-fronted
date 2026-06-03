# Frontend Auth Guide — leyvap3-backend

## Endpoints

| Acción | Método | URL | Body |
|--------|--------|-----|------|
| Login | POST | `http://localhost:8000/api/token/` | `{"username": "...", "password": "..."}` |
| Refresh token | POST | `http://localhost:8000/api/token/refresh/` | `{"refresh": "..."}` |
| APIs protegidas | GET/POST/etc | `http://localhost:8000/api/equipos/`, `api/tipos/` | Header: `Authorization: Bearer <access>` |

## Login

Tu frontend envía:

```javascript
const response = await axios.post('http://localhost:8000/api/token/', {
  username: 'john',
  password: '12345678'
})
```

Respuesta exitosa:

```json
{
  "access": "eyJhbGciOiJIUzI1NiIs...",
  "refresh": "eyJhbGciOiJIUzI1NiIs..."
}
```

Guarda ambos tokens:

```javascript
localStorage.setItem('access_token', data.access)
localStorage.setItem('refresh_token', data.refresh)
```

## Consumir APIs protegidas

Cada petición lleva el token en el header:

```javascript
const token = localStorage.getItem('access_token')
const response = await axios.get('http://localhost:8000/api/equipos/', {
  headers: { Authorization: `Bearer ${token}` }
})
```

Si da `401 Unauthorized` → el token expiró (default: 5 min). Usa el refresh token para obtener uno nuevo sin pedir login otra vez:

```javascript
const refresh = localStorage.getItem('refresh_token')
const res = await axios.post('http://localhost:8000/api/token/refresh/', {
  refresh: refresh
})
localStorage.setItem('access_token', res.data.access)
// Reintentar la petición original con el nuevo access token
```

## Crear usuarios (solo backend, 1 vez)

```bash
python manage.py createsuperuser
```

Usuarios para el examen:

```
1. Usuario: john       Contraseña: 12345678
2. Usuario: profesor   Contraseña: profesor123
```

## Logout (frontend-only)

Solo borra los tokens del localStorage:

```javascript
localStorage.removeItem('access_token')
localStorage.removeItem('refresh_token')
// Redirigir a /login
```

## Resumen para el examen

- **Sin registro de usuarios** — solo crearlos por `createsuperuser`
- **Sin validación de email** — no necesaria
- **Sin recuperación de contraseña** — no necesaria
- **JWT** — token en cada request (Bearer auth)
- **Token expira en 5 min** — usar refresh token para renovar

