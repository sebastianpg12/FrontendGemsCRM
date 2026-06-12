<template>
  <div class="min-h-screen bg-slate-50 dark:bg-[#04050f] text-slate-800">
    <!-- Sidebar -->
    <div
      class="fixed inset-y-0 left-0 z-50 bg-white dark:bg-[#0a0b14] border-r border-slate-200 dark:border-[#1a1d2e] transition-all duration-300 ease-in-out flex flex-col"
      :class="isSidebarCollapsed ? 'w-20' : 'w-64'"
    >
      <!-- Glow superior sutil (solo dark) -->
      <div class="pointer-events-none absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-primary-600/10 to-transparent dark:from-primary-500/8 rounded-t-sm z-0"></div>

      <!-- Collapse Toggle Button -->
      <button
        @click="isSidebarCollapsed = !isSidebarCollapsed"
        class="absolute -right-3.5 top-7 w-7 h-7 bg-white dark:bg-[#131520] text-slate-400 dark:text-slate-500 rounded-full flex items-center justify-center z-[100] transition-all hover:text-primary-500 border border-slate-200 dark:border-[#252836] shadow-sm hover:border-primary-300 dark:hover:border-primary-500/40"
        :class="isSidebarCollapsed ? 'rotate-180' : ''"
      >
        <i class="fas fa-chevron-left text-[10px]"></i>
      </button>

      <!-- Logo -->
      <div class="relative z-10 flex items-center justify-center h-20 transition-all duration-300 overflow-hidden flex-shrink-0">
        <img
          :src="logoSrc"
          alt="GEMS Hub"
          class="h-24 w-auto transition-all object-contain"
          :class="isSidebarCollapsed ? 'scale-75' : ''"
          @error="logoSrc = '/gems-logo.png'"
        />
      </div>

      <!-- Navigation -->
      <nav class="relative z-10 flex-1 px-3 py-4 flex flex-col justify-between h-[calc(100vh-160px)] overflow-y-auto">
        <div class="space-y-0.5">
          <router-link
            v-for="item in navigation"
            :key="item.name"
            :to="item.path"
            class="flex items-center rounded-xl text-sm font-medium transition-all group outline-none h-11 relative"
            :class="[
              $route.path === item.path
                ? 'bg-primary-500/10 dark:bg-primary-500/[0.08] text-primary-600 dark:text-primary-400 border border-primary-500/20 dark:border-primary-500/20 shadow-sm'
                : 'text-slate-500 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-white/[0.04] hover:text-slate-800 dark:hover:text-slate-300 border border-transparent',
              isSidebarCollapsed ? 'justify-center px-0' : 'px-3.5'
            ]"
            :title="isSidebarCollapsed ? localeStore.t(item.id) : ''"
          >
            <!-- Acento izquierdo en activo -->
            <span
              v-if="$route.path === item.path && !isSidebarCollapsed"
              class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary-500 rounded-r-full"
            ></span>
            <div class="flex-shrink-0 w-5 h-5 flex items-center justify-center">
              <i v-if="item.icon === 'logo'" class="fas fa-th-large text-base"></i>
              <component v-else :is="item.icon" class="w-[18px] h-[18px] transition-transform group-hover:scale-110" />
            </div>
            <span
              v-show="!isSidebarCollapsed"
              class="ml-3 transition-opacity duration-300 whitespace-nowrap overflow-hidden font-bold text-[13px]"
            >
              {{ localeStore.t(item.id) }}
            </span>
          </router-link>
        </div>

        <!-- Motivational Quote -->
        <div v-if="!isSidebarCollapsed" class="px-4 py-6 mt-4 border-t border-slate-100 dark:border-[#1a1d2e]">
          <div class="relative">
            <i class="fas fa-quote-left text-primary-200 dark:text-primary-900 text-xl absolute -top-4 -left-2 opacity-50"></i>
            <p class="text-[10px] font-bold text-slate-400 dark:text-slate-600 italic leading-relaxed text-center relative z-10">
              "El éxito es la suma de pequeños esfuerzos repetidos día tras día."
            </p>
            <p class="text-[8px] font-black text-primary-400 dark:text-primary-600 uppercase tracking-widest text-center mt-2">
              — Robert Collier
            </p>
          </div>
        </div>

        <!-- Logout / User Profile Section -->
        <div class="border-t border-slate-100 dark:border-[#1a1d2e] pt-4 mt-auto">
          <div
            class="flex items-center group transition-all"
            :class="isSidebarCollapsed ? 'justify-center' : 'px-1'"
          >
            <div class="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-slate-100 dark:bg-[#13152a] border border-slate-200 dark:border-[#252836] group-hover:border-primary-300 dark:group-hover:border-primary-500/40 transition-all flex-shrink-0 shadow-sm">
              <img
                v-if="user?.photo"
                :src="resolveImageUrl(user.photo)"
                alt="Foto"
                class="w-full h-full object-cover transition-transform group-hover:scale-110"
                @error="onAvatarError"
              />
              <img
                v-else-if="user?.avatar && getAvatarById(user.avatar)"
                :src="getAvatarById(user.avatar)?.path"
                class="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
              <span v-else class="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase">{{ getUserInitials() }}</span>
            </div>
            <div
              v-show="!isSidebarCollapsed"
              class="ml-3 min-w-0 transition-opacity duration-300"
            >
              <p class="text-xs font-black text-slate-800 dark:text-slate-200 truncate">{{ user?.name || 'Usuario' }}</p>
              <p class="text-[9px] font-black text-primary-500 dark:text-primary-500 uppercase tracking-widest truncate">{{ getRoleDisplayName() }}</p>
            </div>
          </div>

          <div
            class="mt-3 flex gap-2"
            :class="isSidebarCollapsed ? 'flex-col items-center' : 'flex-row'"
          >
            <router-link
              to="/profile"
              class="flex items-center justify-center bg-slate-50 dark:bg-white/[0.03] hover:bg-primary-50 dark:hover:bg-primary-500/[0.08] text-slate-500 dark:text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 rounded-xl transition-all border border-slate-100 dark:border-[#1e2130] hover:border-primary-200 dark:hover:border-primary-500/30 group"
              :class="isSidebarCollapsed ? 'w-10 h-10' : 'flex-1 h-10'"
              title="Ajustes"
            >
              <i class="fas fa-cog text-sm group-hover:rotate-90 transition-all duration-300"></i>
              <span v-show="!isSidebarCollapsed" class="ml-2 text-[10px] font-black uppercase tracking-widest">Perfil</span>
            </router-link>

            <button
              @click="$emit('logout')"
              class="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-white/[0.03] hover:bg-rose-50 dark:hover:bg-rose-500/[0.08] text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 rounded-xl transition-all border border-slate-100 dark:border-[#1e2130] hover:border-rose-200 dark:hover:border-rose-500/30"
              title="Salir"
            >
              <i class="fas fa-sign-out-alt text-sm"></i>
            </button>
          </div>
        </div>
      </nav>
    </div>

    <!-- Main Content -->
    <div
      class="transition-all duration-300 ease-in-out"
      :class="isSidebarCollapsed ? 'ml-20' : 'ml-64'"
    >
      <!-- Header -->
      <header class="min-h-[64px] bg-white dark:bg-[#0a0b14] border-b border-slate-200 dark:border-[#1a1d2e] flex flex-wrap items-center px-4 sm:px-8 justify-between sticky top-0 z-30">
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
      <main class="p-4 sm:p-8 min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-[#04050f]">
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
