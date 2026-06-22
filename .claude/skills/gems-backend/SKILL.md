---
name: gems-backend
description: Genera el checklist de cambios necesarios en el backend de GEMS Hub cuando el frontend toca la API. Úsalo cuando el usuario agregue o modifique una llamada a la API, cuando crees un componente que necesite datos nuevos, o cuando el usuario diga "qué hay que cambiar en el backend", "necesito un endpoint", "actualiza el backend". SIEMPRE usa este skill cuando un cambio de frontend implique datos que vienen o van al servidor — es fácil olvidar sincronizar ambos lados.
---

# GEMS Backend Sync Checklist

El backend está en: `C:\Users\Sebastian PulgarinCT\OneDrive\Documentos\GEMS-CRM-BACKEND`

> ⚠️ NO usar el backend en `Gems\GEMS-CRM-BACKEND` — tiene credenciales incorrectas de MongoDB.

## Proceso

### 1. Identifica qué cambió en el frontend

Lee el diff o el contexto de la conversación y extrae:
- ¿Qué endpoint llama? (URL + método HTTP)
- ¿Qué datos envía en el body?
- ¿Qué datos espera en la respuesta?

### 2. Localiza la ruta en el backend

Las rutas están en `GEMS-CRM-BACKEND/routes/`:
- `team.js` — CRUD de miembros del equipo
- `clients.js` — clientes
- `activities.js` — actividades
- `cases.js` — casos
- `tickets.js` — tickets de soporte
- `auth.js` — login, registro, tokens
- `reports.js` — reportes y métricas

### 3. Checklist de revisión del endpoint

Para el endpoint afectado, verifica:

**Modelo correcto**
- [ ] ¿Toca el modelo `User` (datos globales: nombre, email, password, avatar) o `Membership` (datos por org: role, department, departmentRole, supervisor)?
- [ ] Si cambia el `role`, hay que actualizar **ambos**: `User.role` y `Membership.role` — solo actualizar uno es el bug más común de este proyecto.

**Multi-tenancy**
- [ ] ¿El query filtra por `{ organization: req.organizationId }`?
- [ ] ¿El middleware `setOrganizationContext` está aplicado a la ruta?

**Autenticación**
- [ ] ¿La ruta tiene `authenticateToken` como middleware?
- [ ] ¿Verifica el rol antes de ejecutar? (admin/supervisor para operaciones destructivas)

**Password**
- [ ] Si actualiza contraseña: usar `bcrypt.hash()` explícito + `findByIdAndUpdate()`, no `user.save()` con el pre-save hook — el hook no siempre dispara con findByIdAndUpdate.

**Respuesta**
- [ ] ¿El formato de respuesta coincide con lo que espera el frontend? (`{ success: true, data: ... }`)
- [ ] ¿Los campos devueltos excluyen `password`? (usar `.select('-password')`)

### 4. Output final

Genera este resumen:

```
Endpoint afectado: METHOD /ruta
Archivo backend:   routes/archivo.js (línea aproximada)

Cambios necesarios:
1. [descripción concreta del cambio]
2. ...

Modelos tocados: User / Membership / ambos
¿organizationId aplicado? sí / no / verificar
¿Necesita nuevo endpoint? sí / no

Recordatorio: hacer commit + push del backend por separado
→ cd "C:\Users\Sebastian PulgarinCT\OneDrive\Documentos\GEMS-CRM-BACKEND"
→ git add -p  →  git commit  →  git push
```

Si el cambio es grande, ofrece escribir el código del endpoint directamente.
