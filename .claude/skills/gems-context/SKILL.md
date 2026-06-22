---
name: gems-context
description: Carga el contexto completo del proyecto GEMS Hub desde el vault de Obsidian. Úsalo al inicio de cada sesión nueva, cuando el usuario diga "carga el contexto", "lee el proyecto", "dame contexto de gems", o cuando vayas a trabajar en GEMS Hub sin haber leído los archivos del vault todavía. También úsalo si el usuario pregunta "¿qué es GEMS Hub?", "¿cuál es el stack?", o cualquier pregunta general sobre el proyecto. SIEMPRE usa este skill antes de hacer cambios importantes si no tienes el contexto cargado.
---

# GEMS Context Loader

Lee estos dos archivos del vault de Obsidian en orden:

1. `C:\Users\Sebastian PulgarinCT\OneDrive\Documentos\Baul\Claude\GEMS-Hub\contexto-proyecto.md`
2. `C:\Users\Sebastian PulgarinCT\OneDrive\Documentos\Baul\Claude\GEMS-Hub\arquitectura-general.md`

Si la tarea lo requiere, también lee estos según corresponda:
- `stores.md` — si vas a trabajar en estado global (Pinia)
- `router-y-permisos.md` — si vas a tocar rutas o permisos
- `servicios.md` — si vas a agregar/modificar llamadas API
- `tipos-typescript.md` — si vas a crear o modificar interfaces
- `componentes.md` — si vas a crear o modificar componentes
- `flujos-clave.md` — si necesitas entender cómo funciona un proceso completo

Todos están en: `C:\Users\Sebastian PulgarinCT\OneDrive\Documentos\Baul\Claude\GEMS-Hub\`

## Después de leer, resume en este formato

**Proyecto:** qué es GEMS Hub y para quién es  
**Stack:** frontend y backend (una línea cada uno)  
**Rutas clave:** frontend en `GemsCrm/`, backend en `GEMS-CRM-BACKEND/`  
**Reglas de diseño:** las 4-5 más importantes (rounded-xl, shadow-sm, etc.)  
**Roles:** lista de roles y qué puede hacer cada uno  
**Pendientes conocidos:** si el contexto menciona algo en progreso o con deuda técnica  

Sé conciso. El objetivo es que en 10 segundos el usuario sepa que tienes el contexto completo y puedes trabajar.
