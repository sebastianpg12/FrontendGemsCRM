<template>
  <div class="min-h-screen flex" style="background:#f4f5f7">

    <!-- ══════════════════ SIDEBAR ══════════════════ -->
    <aside
      class="fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-200"
      :style="isSidebarCollapsed ? 'width:56px' : 'width:216px'"
      style="background:#fff; border-right:1px solid #e8eaed;"
    >
      <!-- Toggle -->
      <button
        @click="isSidebarCollapsed = !isSidebarCollapsed"
        class="absolute z-[100] flex items-center justify-center rounded-full transition-colors"
        style="width:20px;height:20px;background:#fff;border:1px solid #d1d5db;top:20px;right:-10px;color:#9ca3af;"
        :style="isSidebarCollapsed ? 'transform:rotate(180deg)' : ''"
      >
        <i class="fas fa-chevron-left" style="font-size:7px"></i>
      </button>

      <!-- Logo -->
      <div class="flex items-center flex-shrink-0 overflow-hidden" style="height:52px;padding:0 14px;border-bottom:1px solid #e8eaed;">
        <img :src="logoSrc" alt="GEMS Hub" style="height:28px;width:auto;object-fit:contain;flex-shrink:0" @error="logoSrc='/gems-logo.png'" />
        <span v-show="!isSidebarCollapsed" style="margin-left:10px;font-size:13px;font-weight:700;color:#111827;white-space:nowrap;letter-spacing:-0.01em">GEMS Hub</span>
      </div>

      <!-- Nav -->
      <nav class="flex-1 overflow-y-auto" style="padding:8px 6px">
        <router-link
          v-for="item in navigation"
          :key="item.name"
          :to="item.path"
          :title="isSidebarCollapsed ? localeStore.t(item.id) : ''"
          class="flex items-center outline-none group"
          style="height:36px;border-radius:6px;margin-bottom:1px;text-decoration:none;transition:background 0.15s, color 0.15s;position:relative;"
          :style="[
            $route.path === item.path
              ? 'background:#ede9fe;color:#6d28d9;'
              : 'color:#6b7280;',
            isSidebarCollapsed ? 'justify-content:center;padding:0' : 'padding:0 10px'
          ]"
          @mouseenter="e => { if($route.path !== item.path) (e.currentTarget as HTMLElement).style.background='#f9fafb'; (e.currentTarget as HTMLElement).style.color='#374151' }"
          @mouseleave="e => { if($route.path !== item.path) { (e.currentTarget as HTMLElement).style.background=''; (e.currentTarget as HTMLElement).style.color='#6b7280' } }"
        >
          <!-- Acento activo -->
          <span v-if="$route.path === item.path" style="position:absolute;left:0;top:50%;transform:translateY(-50%);width:3px;height:16px;background:#7c3aed;border-radius:0 2px 2px 0"></span>

          <span style="flex-shrink:0;width:16px;height:16px;display:flex;align-items:center;justify-content:center">
            <i v-if="item.icon === 'logo'" class="fas fa-th-large" style="font-size:13px"></i>
            <component v-else :is="item.icon" style="width:15px;height:15px;stroke-width:1.5" />
          </span>
          <span v-show="!isSidebarCollapsed" style="margin-left:9px;font-size:12.5px;font-weight:500;white-space:nowrap;overflow:hidden">
            {{ localeStore.t(item.id) }}
          </span>
        </router-link>
      </nav>

      <!-- User -->
      <div style="border-top:1px solid #e8eaed;padding:10px 8px">
        <div class="flex items-center" :style="isSidebarCollapsed ? 'justify-content:center' : 'gap:9px'">
          <div style="width:28px;height:28px;border-radius:50%;overflow:hidden;flex-shrink:0;background:#e5e7eb;border:1px solid #d1d5db;display:flex;align-items:center;justify-content:center">
            <img v-if="user?.photo" :src="resolveImageUrl(user.photo)" style="width:100%;height:100%;object-fit:cover" @error="onAvatarError" />
            <img v-else-if="user?.avatar && getAvatarById(user.avatar)" :src="getAvatarById(user.avatar)?.path" style="width:100%;height:100%;object-fit:cover" />
            <span v-else style="font-size:9px;font-weight:700;color:#6b7280">{{ getUserInitials() }}</span>
          </div>
          <div v-show="!isSidebarCollapsed" style="min-width:0;flex:1">
            <p style="font-size:12px;font-weight:600;color:#111827;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:1.3">{{ user?.name || 'Usuario' }}</p>
            <p style="font-size:10px;color:#9ca3af;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:1.3">{{ getRoleDisplayName() }}</p>
          </div>
          <div v-show="!isSidebarCollapsed" style="display:flex;gap:4px;flex-shrink:0">
            <router-link to="/profile" title="Perfil" style="width:24px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:4px;color:#9ca3af;transition:background 0.15s,color 0.15s" class="hover:bg-slate-100 hover:text-primary-600">
              <i class="fas fa-cog" style="font-size:11px"></i>
            </router-link>
            <button @click="$emit('logout')" title="Salir" style="width:24px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:4px;color:#9ca3af;transition:background 0.15s,color 0.15s;cursor:pointer;background:transparent;border:none" class="hover:bg-red-50 hover:text-rose-500">
              <i class="fas fa-sign-out-alt" style="font-size:11px"></i>
            </button>
          </div>
        </div>
      </div>
    </aside>

    <!-- ══════════════════ MAIN ══════════════════ -->
    <div class="flex-1 flex flex-col transition-all duration-200" :style="isSidebarCollapsed ? 'margin-left:56px' : 'margin-left:216px'">

      <!-- Header -->
      <header class="sticky top-0 z-30 flex items-center justify-between flex-shrink-0" style="height:52px;background:#fff;border-bottom:1px solid #e8eaed;padding:0 24px">
        <div class="flex items-center gap-3 min-w-0">
          <button class="lg:hidden" style="color:#6b7280" @click="$emit('toggleSidebar')">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width:20px;height:20px">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            </svg>
          </button>
          <div>
            <h1 style="font-size:14px;font-weight:600;color:#111827;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.3">{{ pageTitle }}</h1>
            <p style="font-size:11px;color:#9ca3af;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.3">{{ pageDescription }}</p>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <OnlineUsersPopover />
          <router-link to="/chat" style="position:relative;display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:6px;color:#9ca3af;transition:background 0.15s" class="hover:bg-slate-50 hover:text-primary-600">
            <ChatBubbleLeftRightIcon style="width:18px;height:18px;stroke-width:1.5" />
            <span v-if="chatUnread > 0" style="position:absolute;top:2px;right:2px;width:14px;height:14px;background:#ef4444;color:#fff;font-size:8px;font-weight:700;border-radius:50%;display:flex;align-items:center;justify-content:center">
              {{ chatUnread > 9 ? '9+' : chatUnread }}
            </span>
          </router-link>
        </div>
      </header>

      <!-- Content -->
      <main :style="route.path.startsWith('/support') ? 'flex:1;background:#f4f5f7;overflow:hidden;height:calc(100vh - 52px)' : 'flex:1;padding:24px;background:#f4f5f7;min-height:calc(100vh - 52px)'">
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

const COLLABORATOR_HIDDEN = ['prospects', 'team', 'reports']

const navigation = computed(() => {
  const isCollaborator = authStore.user?.role === 'collaborator'
  const all = [
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
  return isCollaborator ? all.filter(i => !COLLABORATOR_HIDDEN.includes(i.id)) : all
})

const pageTitle = computed(() => {
  const current = navigation.value.find(item => item.path === route.path)
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
