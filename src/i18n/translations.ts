export type Locale = 'es' | 'en'

const es: Record<string, string> = {
  // Módulos de navegación
  dashboard: 'Dashboard',
  clients: 'Clientes',
  prospects: 'Prospectos IA',
  activities: 'Actividades',
  reports: 'Reportes',
  tickets: 'Tickets',
  cases: 'Casos',
  wiki: 'Wiki',
  team: 'Equipo',
  'theme-settings': 'Personalización',
  'admin-orgs': 'Organizaciones',
  'pricing-calculator': 'Calculadora',
  'tickets-public': 'Soporte',
  accounting: 'Contabilidad',
  'daily-scrum': 'Daily Scrum',
  'team-activities': 'Actividades por Equipo',
  chat: 'Chat Interno',

  // Barra de navegación
  'nav.more': 'Más',
  'nav.profile': 'Mi perfil',
  'nav.logout': 'Cerrar sesión',

  // Acciones comunes
  save: 'Guardar',
  cancel: 'Cancelar',
  create: 'Crear',
  edit: 'Editar',
  delete: 'Eliminar',
  search: 'Buscar',
  loading: 'Cargando...',
  retry: 'Reintentar',
  close: 'Cerrar',
  back: 'Volver',
  new: 'Nuevo',

  // Perfil
  'profile.title': 'Mi Perfil',
  'profile.preferences': 'Preferencias',
  'profile.language': 'Idioma de la interfaz',
  'profile.push': 'Notificaciones push',
  'profile.timezone': 'Zona horaria',
  'profile.darkmode': 'Modo oscuro',

  // Estados comunes
  active: 'Activo',
  inactive: 'Inactivo',
  open: 'Abierto',
  closed: 'Cerrado',
  pending: 'Pendiente',
  completed: 'Completado',
  in_progress: 'En progreso',
}

const en: Record<string, string> = {
  // Navigation modules
  dashboard: 'Dashboard',
  clients: 'Clients',
  prospects: 'AI Prospects',
  activities: 'Activities',
  reports: 'Reports',
  tickets: 'Tickets',
  cases: 'Cases',
  wiki: 'Wiki',
  team: 'Team',
  'theme-settings': 'Customize',
  'admin-orgs': 'Organizations',
  'pricing-calculator': 'Calculator',
  'tickets-public': 'Support',
  accounting: 'Accounting',
  'daily-scrum': 'Daily Scrum',
  'team-activities': 'Team Activities',
  chat: 'Internal Chat',

  // Navigation bar
  'nav.more': 'More',
  'nav.profile': 'My profile',
  'nav.logout': 'Log out',

  // Common actions
  save: 'Save',
  cancel: 'Cancel',
  create: 'Create',
  edit: 'Edit',
  delete: 'Delete',
  search: 'Search',
  loading: 'Loading...',
  retry: 'Retry',
  close: 'Close',
  back: 'Back',
  new: 'New',

  // Profile
  'profile.title': 'My Profile',
  'profile.preferences': 'Preferences',
  'profile.language': 'Interface language',
  'profile.push': 'Push notifications',
  'profile.timezone': 'Time zone',
  'profile.darkmode': 'Dark mode',

  // Common statuses
  active: 'Active',
  inactive: 'Inactive',
  open: 'Open',
  closed: 'Closed',
  pending: 'Pending',
  completed: 'Completed',
  in_progress: 'In progress',
}

export const translations: Record<Locale, Record<string, string>> = { es, en }
