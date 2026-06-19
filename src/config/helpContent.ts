export interface HelpStep {
  icon: string
  title: string
  desc: string
}

export interface PageHelp {
  title: string
  subtitle: string
  steps: HelpStep[]
}

export const helpContent: Record<string, PageHelp> = {
  '/': {
    title: 'Dashboard',
    subtitle: 'Tu centro de control diario',
    steps: [
      { icon: 'fa-chart-bar', title: 'Resumen de métricas', desc: 'Las tarjetas superiores muestran clientes, actividades, casos, tickets y equipo activos en tiempo real.' },
      { icon: 'fa-bolt', title: 'Acciones rápidas', desc: 'El botón "Acciones" despliega un menú flotante para crear clientes, actividades, casos y más sin navegar.' },
      { icon: 'fa-robot', title: 'IA · GEMS', desc: 'El widget de IA analiza tu CRM y entrega lecturas, acciones recomendadas y riesgos actualizados automáticamente.' },
      { icon: 'fa-fire', title: 'Ritmo del día', desc: 'El indicador de foco muestra tus actividades vencidas, de hoy y de alta prioridad para que priorices tu jornada.' },
      { icon: 'fa-chart-line', title: 'Tendencia semanal', desc: 'El gráfico inferior compara actividades creadas vs completadas en los últimos 7 días.' },
    ]
  },
  '/clients': {
    title: 'Clientes',
    subtitle: 'Gestiona tu base de contactos',
    steps: [
      { icon: 'fa-user-plus', title: 'Añadir cliente', desc: 'Usa el botón "+ Añadir Cliente" en la esquina superior derecha para crear un nuevo contacto.' },
      { icon: 'fa-search', title: 'Buscar y filtrar', desc: 'Busca por nombre, email o empresa. Usa "Ordenar por" para cambiar el criterio de visualización.' },
      { icon: 'fa-eye', title: 'Ver detalle', desc: 'Haz clic en cualquier cliente para abrir su perfil completo con historial, actividades y compromisos.' },
      { icon: 'fa-file-alt', title: 'Módulos del cliente', desc: 'Dentro del detalle encontrarás pestañas de Información, Actividades, Casos, Compromisos y Documentos.' },
    ]
  },
  '/prospects': {
    title: 'Prospectos IA',
    subtitle: 'Descubre oportunidades de negocio',
    steps: [
      { icon: 'fa-brain', title: 'Análisis IA', desc: 'GEMS analiza tu base de clientes e identifica prospectos con mayor probabilidad de conversión.' },
      { icon: 'fa-star', title: 'Score de prospecto', desc: 'Cada prospecto tiene una puntuación basada en interacciones, antigüedad y comportamiento.' },
      { icon: 'fa-arrow-right', title: 'Convertir a cliente', desc: 'Cuando un prospecto esté listo, usa "Convertir" para agregarlo como cliente formal al CRM.' },
    ]
  },
  '/activities': {
    title: 'Actividades',
    subtitle: 'Gestiona tareas y seguimientos',
    steps: [
      { icon: 'fa-columns', title: 'Vista Kanban', desc: 'Arrastra las actividades entre columnas (Pendiente, En proceso, Completada, Vencida) para cambiar su estado.' },
      { icon: 'fa-list', title: 'Vista Lista', desc: 'Cambia a lista para ver todas las actividades en forma tabular con filtros avanzados.' },
      { icon: 'fa-filter', title: 'Filtros', desc: 'Filtra por cliente, departamento, miembro del equipo, estado y rango de fechas.' },
      { icon: 'fa-plus', title: 'Nueva actividad', desc: 'Usa "+ Nueva" para crear una actividad. Asígnala a un cliente y un responsable del equipo.' },
      { icon: 'fa-bolt', title: 'Tarea rápida', desc: 'La barra superior "Tarea rápida" permite crear actividades simples escribiendo directamente.' },
      { icon: 'fa-users', title: 'Mis tareas', desc: 'El filtro "Mis tareas" muestra solo las actividades asignadas a tu usuario.' },
    ]
  },
  '/reports': {
    title: 'Reportes',
    subtitle: 'Analiza el rendimiento del equipo',
    steps: [
      { icon: 'fa-chart-pie', title: 'KPIs generales', desc: 'Los indicadores resumen actividades completadas, pendientes y el tiempo promedio de cierre.' },
      { icon: 'fa-calendar-alt', title: 'Rango de fechas', desc: 'Selecciona el período a analizar desde el selector de fechas superior.' },
      { icon: 'fa-download', title: 'Exportar', desc: 'Descarga los reportes en PDF o Excel usando el botón "Exportar" disponible en cada sección.' },
    ]
  },
  '/tickets': {
    title: 'Tickets',
    subtitle: 'Sistema de soporte interno',
    steps: [
      { icon: 'fa-ticket-alt', title: 'Crear ticket', desc: 'Usa "+ Nuevo Ticket" para reportar un problema, solicitud o incidencia interna.' },
      { icon: 'fa-tag', title: 'Categorías y prioridad', desc: 'Clasifica cada ticket por categoría (bug, mejora, consulta) y prioridad (baja, media, alta, crítica).' },
      { icon: 'fa-comments', title: 'Seguimiento', desc: 'Dentro de cada ticket puedes agregar comentarios, cambiar el estado y asignar a un responsable.' },
    ]
  },
  '/cases': {
    title: 'Casos',
    subtitle: 'Gestión de incidencias de clientes',
    steps: [
      { icon: 'fa-folder-plus', title: 'Nuevo caso', desc: 'Crea un caso cuando un cliente reporta un problema que requiere seguimiento extendido.' },
      { icon: 'fa-paperclip', title: 'Adjuntos', desc: 'Adjunta documentos, capturas o archivos relevantes directamente en el detalle del caso.' },
      { icon: 'fa-history', title: 'Timeline', desc: 'Cada caso tiene un historial cronológico de todos los cambios y comentarios realizados.' },
      { icon: 'fa-check-circle', title: 'Resolver', desc: 'Cambia el estado a "Resuelto" cuando el caso esté cerrado para mantener el historial ordenado.' },
    ]
  },
  '/wiki': {
    title: 'Wiki',
    subtitle: 'Base de conocimiento del equipo',
    steps: [
      { icon: 'fa-book', title: 'Artículos', desc: 'Crea artículos con información relevante para el equipo: procedimientos, políticas, guías.' },
      { icon: 'fa-folder', title: 'Categorías', desc: 'Organiza los artículos en categorías para facilitar la búsqueda.' },
      { icon: 'fa-edit', title: 'Editor', desc: 'El editor soporta formato enriquecido: negritas, listas, encabezados e imágenes.' },
    ]
  },
  '/team': {
    title: 'Equipo',
    subtitle: 'Gestiona los miembros de tu organización',
    steps: [
      { icon: 'fa-user-plus', title: 'Agregar miembro', desc: 'Usa "+ Nuevo Miembro" para invitar a un colaborador. Define su rol y departamento.' },
      { icon: 'fa-shield-alt', title: 'Roles', desc: 'Los roles controlan los permisos: Administrador, Supervisor, Colaborador, Soporte, Consultor, Cliente.' },
      { icon: 'fa-pencil-alt', title: 'Editar miembro', desc: 'Haz clic en el ícono de edición de cualquier miembro para modificar su información o rol.' },
    ]
  },
  '/personalization': {
    title: 'Personalización',
    subtitle: 'Ajusta la apariencia del sistema',
    steps: [
      { icon: 'fa-palette', title: 'Colores', desc: 'Cambia el color principal de la marca para adaptar GEMS a tu identidad corporativa.' },
      { icon: 'fa-image', title: 'Logo', desc: 'Sube el logo de tu empresa para que aparezca en el sidebar y reportes.' },
      { icon: 'fa-moon', title: 'Modo oscuro', desc: 'Activa el modo oscuro desde el toggle de tema para una experiencia más cómoda.' },
    ]
  },
  '/organizations': {
    title: 'Organizaciones',
    subtitle: 'Gestión multi-tenant',
    steps: [
      { icon: 'fa-building', title: 'Organizaciones', desc: 'Cada organización es un espacio aislado con sus propios usuarios, clientes y datos.' },
      { icon: 'fa-exchange-alt', title: 'Cambiar org', desc: 'Si tienes acceso a múltiples organizaciones, puedes cambiar entre ellas sin cerrar sesión.' },
    ]
  },
  '/calculator': {
    title: 'Calculadora',
    subtitle: 'Herramienta de cálculo rápido',
    steps: [
      { icon: 'fa-calculator', title: 'Operaciones', desc: 'Realiza cálculos rápidos sin salir del sistema. El historial se mantiene durante la sesión.' },
    ]
  },
  '/profile': {
    title: 'Mi perfil',
    subtitle: 'Configura tu cuenta personal',
    steps: [
      { icon: 'fa-camera', title: 'Foto de perfil', desc: 'Sube una foto o elige un avatar para que el equipo te identifique fácilmente.' },
      { icon: 'fa-lock', title: 'Contraseña', desc: 'Cambia tu contraseña desde la pestaña de Seguridad.' },
      { icon: 'fa-bell', title: 'Notificaciones', desc: 'Configura qué tipo de notificaciones quieres recibir.' },
    ]
  },
}
