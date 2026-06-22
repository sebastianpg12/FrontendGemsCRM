---
name: gems-review
description: Hace un code review enfocado en GEMS Hub — revisa el diff actual buscando problemas específicos del proyecto: permisos por rol, multi-tenancy, reactividad Vue, design system. Úsalo cuando el usuario diga "revisa el código", "review", "revísame esto", "está bien lo que hice?", o antes de hacer un commit importante. También úsalo proactivamente si ves cambios en auth, permisos, o rutas del backend. SIEMPRE usa este skill en lugar de hacer un review genérico cuando estés en el proyecto GEMS Hub.
---

# GEMS Hub Code Review

Revisa el diff actual con `git diff HEAD` (o el rango que indique el usuario) buscando problemas específicos de GEMS Hub.

## Checklist de revisión

### Vue 3 / Reactividad
- [ ] ¿Los `computed` dentro de `<script setup>` acceden con `.value` cuando están en el script (no en el template)?
- [ ] ¿Los `watch` tienen las dependencias correctas?
- [ ] ¿Se está mutando estado del store directamente en vez de usar actions?
- [ ] ¿Los `v-for` tienen `:key` único y estable?

### Pinia Stores
- [ ] ¿Se usa `storeToRefs()` para desestructurar estado reactivo?
- [ ] ¿Se accede a `authStore.user?.role` con optional chaining?
- [ ] ¿Las acciones del store manejan errores con try/catch?

### Permisos y roles
- [ ] ¿Los guards de rol usan los valores en inglés? (`'admin'`, `'supervisor'`, `'collaborator'`, `'support'`, `'viewer'`, `'client'`)
- [ ] ¿Se usa `authStore.canView*` / `authStore.canCreate*` en vez de comparar el rol directamente en el template?
- [ ] ¿Las rutas nuevas tienen `meta.requiredRoles` o `meta.requiredPermissions` en el router?
- [ ] ¿El sidebar/nav usa `getAvailableModules` del auth store (no arrays hardcodeados)?

### Multi-tenancy
- [ ] ¿Las llamadas al backend incluyen el `organizationId` donde corresponde?
- [ ] ¿El backend aplica `.find({ organization: req.organizationId })` en todas las queries de colecciones que son por organización?
- [ ] ¿Se distingue entre el modelo `User` (global) y `Membership` (por organización)?

### Design System
- [ ] `rounded-xl` en contenedores principales — no `rounded-2xl` ni `rounded-3xl`
- [ ] Cards con `shadow-sm` — sin `border` como separador principal
- [ ] Escala de texto correcta: 9/11/15/22px
- [ ] Botones con `h-9`
- [ ] Dark mode cubierto con clases `dark:`

### TypeScript
- [ ] ¿Las props tienen tipos explícitos con `defineProps<T>()`?
- [ ] ¿Se evita `any` innecesario?
- [ ] ¿Los tipos de la API están en `src/types/` o definidos como interfaces locales?

### Seguridad
- [ ] ¿No hay tokens o secrets hardcodeados?
- [ ] ¿Las rutas del backend validan que el usuario tenga permiso antes de devolver datos?

## Formato de salida

Para cada problema encontrado:

```
[NIVEL] Archivo:línea
Problema: descripción breve
Por qué importa: contexto específico de GEMS Hub
Sugerencia: código o acción concreta
```

Niveles: `[ERROR]` rompe funcionalidad · `[WARN]` riesgo latente · `[STYLE]` incumple design system · `[OK]` si todo está bien en esa categoría

Al final: resumen de 2 líneas — ¿está listo para commit o hay algo que resolver primero?
