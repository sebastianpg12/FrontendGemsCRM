<template>
  <div class="min-h-screen bg-slate-50 dark:bg-[#0f1117] text-slate-800">
    <!-- Sidebar -->
    <div
      class="fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-[#0b0d12] border-r border-slate-100 dark:border-white/[0.06] transition-all duration-200 ease-in-out"
      :class="isSidebarCollapsed ? 'w-[60px]' : 'w-[220px]'"
    >
      <!-- Collapse Toggle -->
      <button
        @click="isSidebarCollapsed = !isSidebarCollapsed"
        class="absolute -right-3 top-6 w-6 h-6 bg-white dark:bg-[#161820] border border-slate-200 dark:border-white/10 rounded-full flex items-center justify-center z-[100] text-slate-400 hover:text-primary-500 transition-colors shadow-sm"
        :class="isSidebarCollapsed ? 'rotate-180' : ''"
      >
        <i class="fas fa-chevron-left" style="font-size:8px"></i>
      </button>

      <!-- Logo -->
      <div class="flex items-center h-[56px] flex-shrink-0 overflow-hidden"
           :class="isSidebarCollapsed ? 'justify-center px-0' : 'px-4'">
        <img
          :src="logoSrc"
          alt="GEMS Hub"
          class="h-8 w-auto object-contain transition-all"
          @error="logoSrc = '/gems-logo.png'"
        />
        <span v-show="!isSidebarCollapsed" class="ml-2.5 text-[13px] font-black text-slate-800 dark:text-white tracking-tight whitespace-nowrap">GEMS Hub</span>
      </div>

      <!-- Divider -->
      <div class="h-px bg-slate-100 dark:bg-white/[0.06] mx-3 flex-shrink-0"></div>

      <!-- Navigation -->
      <nav class="flex-1 py-3 px-2 flex flex-col gap-px overflow-y-auto">
        <router-link
          v-for="item in navigation"
          :key="item.name"
          :to="item.path"
          class="flex items-center h-9 rounded-md text-[13px] font-medium transition-colors outline-none group relative"
          :class="[
            $route.path === item.path
              ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400'
              : 'text-slate-500 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-white/[0.04] hover:text-slate-700 dark:hover:text-slate-300',
            isSidebarCollapsed ? 'justify-center px-0' : 'px-2.5'
          ]"
          :title="isSidebarCollapsed ? localeStore.t(item.id) : ''"
        >
          <!-- Acento izquierdo activo -->
          <span
            v-if="$route.path === item.path"
            class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-primary-500 rounded-r-sm"
          ></span>

          <div class="flex-shrink-0 w-4 h-4 flex items-center justify-center">
            <i v-if="item.icon === 'logo'" class="fas fa-th-large" style="font-size:14px"></i>
            <component v-else :is="item.icon" class="w-4 h-4 stroke-[1.5]" />
          </div>
          <span v-show="!isSidebarCollapsed" class="ml-2.5 whitespace-nowrap overflow-hidden">
            {{ localeStore.t(item.id) }}
          </span>
        </router-link>
      </nav>

      <!-- Divider -->
      <div class="h-px bg-slate-100 dark:bg-white/[0.06] mx-3 flex-shrink-0"></div>

      <!-- User Section -->
      <div class="p-2 flex-shrink-0">
        <div
          class="flex items-center h-10 rounded-md px-2 gap-2.5 cursor-default"
          :class="isSidebarCollapsed ? 'justify-center px-0' : ''"
        >
          <div class="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center bg-slate-100 dark:bg-white/[0.08] border border-slate-200 dark:border-white/10 flex-shrink-0">
            <img v-if="user?.photo" :src="resolveImageUrl(user.photo)" alt="Foto" class="w-full h-full object-cover" @error="onAvatarError" />
            <img v-else-if="user?.avatar && getAvatarById(user.avatar)" :src="getAvatarById(user.avatar)?.path" class="w-full h-full object-cover" />
            <span v-else class="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase">{{ getUserInitials() }}</span>
          </div>
          <div v-show="!isSidebarCollapsed" class="min-w-0 flex-1">
            <p class="text-[12px] font-semibold text-slate-700 dark:text-slate-200 truncate leading-tight">{{ user?.name || 'Usuario' }}</p>
            <p class="text-[10px] text-slate-400 dark:text-slate-500 truncate leading-tight">{{ getRoleDisplayName() }}</p>
          </div>
          <div v-show="!isSidebarCollapsed" class="flex items-center gap-1 flex-shrink-0">
            <router-link to="/profile" title="Perfil" class="w-6 h-6 flex items-center justify-center rounded text-slate-400 hover:text-primary-500 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors">
              <i class="fas fa-cog" style="font-size:11px"></i>
            </router-link>
            <button @click="$emit('logout')" title="Salir" class="w-6 h-6 flex items-center justify-center rounded text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
              <i class="fas fa-sign-out-alt" style="font-size:11px"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div
      class="transition-all duration-200 ease-in-out"
      :class="isSidebarCollapsed ? 'ml-[60px]' : 'ml-[220px]'"
    >
      <!-- Header -->
      <header class="h-[56px] bg-white dark:bg-[#0b0d12] border-b border-slate-100 dark:border-white/[0.06] flex items-center px-6 justify-between sticky top-0 z-30">
        <div class="flex items-center flex-1 min-w-0">
          <!-- Menu Button (hamburger icon for mobile) -->
          <button
            class="flex-shrink-0 mr-2 sm:mr-4 p-2 rounded-lg text-slate-500 hover:bg-slate-100 focus:outline-none z-30 lg:hidden"
            @click="$emit('toggleSidebar')"
            aria-label="Abrir menú"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-slate-600">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <!-- Título y descripción -->
          <div class="flex flex-col justify-center min-w-0">
            <h1 class="text-lg font-black text-slate-800 dark:text-slate-100 whitespace-nowrap truncate tracking-tight">{{ pageTitle }}</h1>
            <p v-show="!isSidebarCollapsed" class="text-slate-400 dark:text-slate-600 text-[10px] font-bold uppercase tracking-wider truncate">{{ pageDescription }}</p>
          </div>
        </div>
        <!-- Notifications -->
        <div class="flex items-center space-x-2 sm:space-x-4 flex-shrink-0 mt-2 sm:mt-0">
          <OnlineUsersPopover />

          <!-- Chat Unread Badge -->
          <router-link to="/chat" class="relative p-2 text-slate-400 dark:text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.04]">
            <ChatBubbleLeftRightIcon class="w-5 h-5" />
            <span v-if="chatUnread > 0" class="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
              {{ chatUnread > 99 ? '99+' : chatUnread }}
            </span>
          </router-link>
        </div>
      </header>
      
      <!-- Page Content -->
      <main class="p-6 min-h-[calc(100vh-56px)] bg-slate-50 dark:bg-[#0f1117]">
        <router-view />
      </main>
    </div>
    
  <!-- Chat Widget -->
  <ChatWidget />
  <NewMessageToast />

  <!-- Notification Bell flotante (inferior derecha, junto al chat) -->
  <NotificationBell />
    
    <!-- Notifications Panel - REMOVED for Azure-style task system -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useChatStore } from '../stores/chatStore'
import { useLocaleStore } from '../stores/localeStore'
import ChatWidget from './ChatWidget.vue'
import OnlineUsersPopover from './OnlineUsersPopover.vue'
import NewMessageToast from './NewMessageToast.vue'
import NotificationBell from './NotificationBell.vue'
import { getAvatarById } from '@/utils/avatarConfig'
import { API_CONFIG } from '@/config/api'
import { useThemeStore } from '@/stores/theme'
import {
  UserGroupIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  UsersIcon,
  FolderIcon,
  ChatBubbleLeftRightIcon,
  Squares2X2Icon,
  TicketIcon,
  PresentationChartLineIcon,
  SparklesIcon,
  SwatchIcon,
  BookOpenIcon,
} from '@heroicons/vue/24/outline'

const route = useRoute()
const chatStore = useChatStore()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const localeStore = useLocaleStore()

const avatarError = ref(false)
const isSidebarCollapsed = ref(false)
// Logo con fallback — si la URL del tenant da 404 el @error lo resetea a /gems-logo.png
const logoSrc = ref<string>(themeStore?.config?.logo || '/gems-logo.png')
watch(() => themeStore?.config?.logo, (val) => { logoSrc.value = val || '/gems-logo.png' })

// Acceso al usuario actual
const user = computed(() => authStore.user)

const navigation = [
  { id: 'dashboard', name: 'Dashboard', path: '/', icon: 'logo' },
  { id: 'clients', name: 'Clientes', path: '/clients', icon: UserGroupIcon },
  { id: 'tickets', name: 'Tickets', path: '/tickets', icon: TicketIcon },
  { id: 'activities', name: 'Actividades', path: '/activities', icon: ClipboardDocumentListIcon },
  { id: 'boards', name: 'Tableros', path: '/boards', icon: Squares2X2Icon },
  { id: 'daily-scrum', name: 'Daily Scrum', path: '/daily-scrum', icon: PresentationChartLineIcon },
  { id: 'team-activities', name: 'Actividades por Equipo', path: '/team-activities', icon: UsersIcon },
  { id: 'accounting', name: 'Contabilidad', path: '/accounting', icon: CurrencyDollarIcon },
  { id: 'cases', name: 'Gestión de Casos', path: '/cases', icon: FolderIcon },
  { id: 'team', name: 'Equipo', path: '/team', icon: DocumentTextIcon },
  { id: 'wiki', name: 'Wiki', path: '/wiki', icon: BookOpenIcon },
  { id: 'chat', name: 'Chat Interno', path: '/chat', icon: ChatBubbleLeftRightIcon },
  { id: 'prospects', name: 'Prospectos IA', path: '/prospectos', icon: SparklesIcon },
  { id: 'theme-settings', name: 'Personalización', path: '/settings/theme', icon: SwatchIcon },
]

const pageTitle = computed(() => {
  const current = navigation.find(item => item.path === route.path)
  if (current) return localeStore.t(current.id)
  const sub: Record<string, string> = {
    '/profile': localeStore.t('profile.title'),
    '/reports': localeStore.t('reports'),
    '/tasks': 'Tareas',
    '/daily-scrum': localeStore.t('daily-scrum'),
    '/pricing-calculator': localeStore.t('pricing-calculator'),
  }
  return sub[route.path] ?? 'GEMS Hub'
})

const pageDescription = computed(() => {
  const descriptions: Record<string, string> = {
    '/': 'Panel de control principal',
    '/boards': 'Tableros Kanban y Scrum',
    '/clients': 'Gestión de clientes',
    '/activities': 'Gestión de actividades y tareas',
    '/team-activities': 'Actividades asignadas por miembro del equipo',
    '/accounting': 'Gestión financiera unificada',
    '/cases': 'Gestión estratégica y documentación wiki',
    '/team': 'Gestión del equipo de trabajo',
    '/chat': 'Chat interno del equipo',
    '/tickets': 'Gestión de incidencias y soporte técnico',
    '/wiki': 'Base de conocimiento y documentación',
    '/prospectos': 'Pipeline de ventas con coach IA',
    '/settings/theme': 'Logo, color de acento y modo oscuro',
  }
  return descriptions[route.path] || ''
})

// Unread chat messages (from Pinia getter)
const chatUnread = computed(() => chatStore.getUnreadCount)

// Resolver URL de imágenes
const resolveImageUrl = (url: string | null) => {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  const origin = String(API_CONFIG.BASE_URL).replace(/\/?api\/?$/i, '')
  return `${origin.replace(/\/$/, '')}/${url.replace(/^\//, '')}`
}

// Obtener iniciales del usuario
const getUserInitials = () => {
  const name = user.value?.name || ''
  if (!name) return 'U'
  return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().substring(0, 2)
}

// Manejar error al cargar avatar
const onAvatarError = () => {
  avatarError.value = true
}

// Mostrar nombre del rol en español
const getRoleDisplayName = () => {
  const roles: Record<string, string> = {
    'admin': 'Administrador',
    'supervisor': 'Supervisor',
    'collaborator': 'Colaborador',
    'support': 'Soporte',
    'viewer': 'Consultor',
    'client': 'Cliente'
  }
  return roles[user.value?.role || ''] || user.value?.role || 'Usuario'
}

onMounted(async () => {
  chatStore.initializeChat()
  chatStore.loadChatRooms()
  avatarError.value = false
  // Load brand theme from DB so accent color & logo apply on startup
  await themeStore.load()
})
</script>
