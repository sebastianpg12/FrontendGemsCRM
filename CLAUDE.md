# GEMS Hub — Instrucciones para Claude

## Contexto del proyecto

Lee estos archivos del vault de Obsidian al inicio de cada sesión:

1. `C:\Users\USUARIO\Documents\Boveda\Claude\GEMS-Hub\contexto-proyecto.md`
   — Quién es el usuario, qué es el proyecto, reglas de trabajo, módulos.

2. `C:\Users\USUARIO\Documents\Boveda\Claude\GEMS-Hub\arquitectura-general.md`
   — Stack, estructura de carpetas, auth, design system, scripts.

Los demás archivos del vault cárgalos solo si la tarea los requiere:
- `stores.md` — si vas a trabajar en estado global (Pinia)
- `router-y-permisos.md` — si vas a tocar rutas o permisos
- `servicios.md` — si vas a agregar/modificar llamadas API
- `tipos-typescript.md` — si vas a crear o modificar interfaces
- `componentes.md` — si vas a crear o modificar componentes
- `flujos-clave.md` — si necesitas entender cómo funciona un proceso completo
- `backend.md` — si necesitas detalle de modelos/rutas del backend (repo separado)

## Reglas obligatorias

- **Siempre hacer commit + push** al terminar cualquier cambio, sin esperar que lo pida
- **Actualizar el archivo correspondiente del vault (`GEMS-Hub/`) en el mismo cambio** si tocaste arquitectura, stores, rutas/permisos, servicios, tipos compartidos, componentes o un flujo clave — ver `_Indice.md` del vault
- Sin bordes en cards — solo `shadow-sm` para separar del fondo
- `rounded-xl` en contenedores (NO `rounded-2xl` ni `rounded-3xl`)
- Sin comentarios salvo WHY no obvio
- Fotos de perfil: siempre activadas, rutas con barras `/`
- Respuestas cortas y directas

## Stack rápido

Vue 3 + TypeScript + Vite + Pinia + Tailwind CSS + Vue Router  
Backend: Node.js + Express + MongoDB (separado)  
Dev: `npm run dev` → localhost:5173
