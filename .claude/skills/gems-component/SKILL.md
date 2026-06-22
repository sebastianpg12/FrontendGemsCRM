---
name: gems-component
description: Crea un scaffold de componente Vue 3 para GEMS Hub siguiendo el design system del proyecto. Úsalo cuando el usuario diga "crea un componente", "nuevo componente", "hazme el componente X", "scaffold de X", o cuando vayas a crear cualquier archivo .vue nuevo en el proyecto. SIEMPRE usa este skill para nuevos componentes Vue en GEMS Hub — garantiza que el resultado siga las reglas de diseño sin tener que recordarlas manualmente.
---

# GEMS Component Generator

El usuario quiere crear un componente Vue 3 para GEMS Hub. El argumento es el nombre del componente (ej: `UserCard`, `ActivityList`, `StatWidget`).

## Reglas obligatorias del design system

- `rounded-xl` en contenedores principales (nunca `rounded-2xl` ni `rounded-3xl`)
- `shadow-sm` para separar del fondo — sin `border` en cards
- Escala de texto: `text-[9px]` labels/badges · `text-[11px]` cuerpo · `text-[15px]` valores · `text-[22px]` títulos grandes
- Botones: `h-9` de altura, `rounded-xl`
- Sin comentarios salvo WHY no obvio
- TypeScript con tipos explícitos en props e emits
- Solo Tailwind — sin CSS scoped salvo casos muy específicos
- Dark mode: usar `dark:bg-[#1e293b]` para cards, `dark:text-slate-100` para texto principal
- Fotos/avatares: rutas siempre con barras `/`

## Estructura del scaffold

Genera el archivo en la ubicación correcta dentro de `src/` según el tipo:
- Página completa → `src/pages/NombreView.vue`
- Componente reutilizable → `src/components/NombreComponente.vue`
- Componente de módulo → `src/components/modulo/NombreComponente.vue`

## Template base

```vue
<template>
  <div class="bg-white dark:bg-[#1e293b] shadow-sm rounded-xl ...">
    <!-- contenido -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
// imports de stores solo si son necesarios

interface Props {
  // props tipadas
}

const props = defineProps<Props>()
// const emit = defineEmits<{ ... }>()
</script>
```

## Proceso

1. Pregunta al usuario (si no está claro en el argumento):
   - ¿Es una página o un componente reutilizable?
   - ¿Qué datos recibe (props)?
   - ¿Necesita algún store de Pinia? (auth, clients, activities, issues, team)
   - ¿Tiene acciones que emite hacia el padre?

2. Genera el componente completo y funcional — no solo el esqueleto. Si el usuario dio suficiente info, rellena con lógica real.

3. Indica dónde guardarlo y si necesita ser importado en algún otro archivo.

4. Si el componente hace llamadas API, recuerda al usuario que puede necesitar un cambio en el backend también (`/gems-backend` para el checklist).
