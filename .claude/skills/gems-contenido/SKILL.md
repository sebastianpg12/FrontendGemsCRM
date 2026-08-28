---
name: gems-contenido
description: Crea piezas de contenido de marketing para GEMS Hub — anuncios verticales (Instagram/story), cards de la serie mantis, y otras piezas visuales. Úsalo cuando el usuario diga "crea un anuncio", "nueva pieza de marketing", "card para redes", "imagen para Instagram", "contenido para publicar", o cualquier variación. SIEMPRE usa este skill para contenido de marketing de GEMS Hub.
---

# GEMS Hub — Content Creator

El usuario quiere crear una pieza de contenido visual de marketing para GEMS Hub.

## Identidad de marca GEMS Hub

**Paleta de colores reales (verificada contra la landing):**
- Fondo: `#0d0e1a` (navy oscuro)
- Primario: `#7c3aed` (purple/violeta)
- Acento claro: `#a78bfa`
- Texto: `#ffffff`
- Subtexto: `rgba(255,255,255,0.4)`

**Lo que NO es GEMS Hub:**
- NO es un CRM — es una **plataforma de gestión empresarial**
- NO usa colores dorados/amber en la interfaz principal (el dorado está solo en la TrialExpired page)
- NO prometemos uso móvil aún — siempre mostrar mockup de PC/laptop

**Taglines validadas:**
- "El sistema operativo de tu equipo"
- "Tu equipo. Un solo sistema."
- "Deja de gestionar tu equipo desde WhatsApp"

## El concepto Mantis

El logo de GEMS Hub es una mantis religiosa (low-poly geométrica). Las partes del cuerpo mapean a funciones:

| Parte | Concepto | Features |
|-------|---------|---------|
| 👁 Ojos | La Visión | Reportes, Dashboard, Analytics |
| 🧠 Cabeza/Antenas | La Mente | IA, Prospectos, Insights |
| 💪 Brazos/Garras | La Acción | Tableros, Tareas, Equipo |
| ❤️ Corazón | Las Relaciones | Clientes, Seguimiento |
| 👄 Boca | La Comunicación | Chat, Tickets, Casos |

**Imágenes generadas disponibles en el proyecto:**
- `/mantis-ojos.png` — zoom compound eyes (purple low-poly)
- `/mantis-cabeza.png` — zoom head + antennae (purple low-poly)
- `/mantis-brazos.png` — zoom raptorial claws (purple low-poly)

**Prompt base para generar nuevas imágenes de mantis (Midjourney/Gemini):**
```
Low-poly geometric praying mantis, macro zoom on [PART], clearly recognizable as mantis [PART] up close,
very dark navy blue background, color palette ONLY: purple violet #7c3aed, medium purple #a78bfa,
white highlights, dark navy, low-poly triangular facets, dramatic lighting, no text --ar 1:1 --v 6
```

## Formatos disponibles

### 1. Anuncio vertical — Instagram Post (1080×1350)
**Archivo base:** `gems-anuncio.html`

Estructura:
- Topbar: logo GEMS HUB + badge "Empieza gratis"
- Hero: overline (plataforma) + título grande (2-3 palabras impacto) + body copy
- Mockup: laptop con dashboard simulado
- Proof bar: avatares + "Empresas ya usan GEMS Hub" + ★★★★★
- Pills: features (Prospectos IA · Tableros · Reportes · Equipo · Wiki · Tickets)
- CTA: botón amber → `mailto:info@gemsinnovations.com`
- Footer: `gemsinnovations.com`

### 2. Card serie Mantis — Instagram Post (1080×1080)
**Archivo base:** `gems-mantis-ads.html`

Estructura por card:
- Imagen mantis full-bleed (imagen importada de /mantis-[parte].png)
- Gradient oscuro en zona inferior (38%→100%)
- Barra superior purple sutil
- Número de serie (01/03)
- Tag de parte: `· OJOS` con punto purple
- Título grande: `La [Concepto].` (en purple)
- Descripción: 2 líneas max
- Footer: logo GEMS HUB + pills de features

## Proceso al recibir la tarea

1. **Identificar formato** — ¿anuncio vertical, card mantis, u otro?
2. **Confirmar mensaje** — ¿cuál es el hook psicológico principal? (dolor, aspiración, social proof)
3. **Si necesita imagen nueva de mantis** — dar prompt al usuario para Gemini/Midjourney, esperar imagen
4. **Crear el HTML** en la raíz del proyecto (no en src/)
5. **Abrir en preview** para verificar
6. **Dar instrucciones de captura:**
   - Abrir en `http://localhost:5200/[archivo].html`
   - F12 → device toggle → dimensiones exactas
   - Ctrl+Shift+P → "Capture screenshot"

## Principios de marketing a aplicar siempre

- **Headline**: problema o dream outcome — nunca features como primera línea
- **Sin nombre propio del dueño** (no "Sebas") hasta decisión explícita
- **Sin "14 días"** — usar "Empieza gratis" sin límite de tiempo
- **Social proof** siempre presente (avatares + estrellas)
- **CTA**: mailto:info@gemsinnovations.com con subject pre-llenado
- **Remover** cualquier texto de ayuda/captura antes de exportar

## Reglas técnicas

- HTML standalone en raíz del proyecto (no depende del build de Vue)
- Imágenes de mantis: rutas absolutas `/mantis-[parte].png`
- Logo: `/gems-logo.png`
- Font: Inter via Google Fonts
- Sin frameworks externos — CSS puro
- Verificar con JS que `content.scrollHeight === ad.offsetHeight` (sin overflow)
