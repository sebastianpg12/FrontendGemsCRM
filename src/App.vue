<template>
  <div id="app">
    <!-- Rutas standalone (sin sidebar): login y selector de organización -->
    <router-view v-if="!authStore.isAuthenticated || $route.path === '/login' || $route.path === '/select-org'" />
    
    <!-- Show main app if authenticated -->
  <div v-else class="min-h-screen bg-slate-50 dark:bg-[#0f172a]">
      <!-- Navigation Sidebar -->
      <div
        class="fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-[#0f1117] border-r border-slate-100 dark:border-white/[0.07] transition-all duration-200 ease-in-out lg:translate-x-0"
        :class="[
          !sidebarOpen && !isDesktop ? '-translate-x-full' : 'translate-x-0',
          isSidebarMini ? 'w-[56px]' : 'w-[210px]'
        ]"
      >
        <!-- Toggle Button -->
        <button
          @click="isSidebarMini = !isSidebarMini"
          class="hidden lg:flex absolute -right-[11px] top-5 w-[22px] h-[22px] bg-white dark:bg-[#1a1d27] text-slate-400 rounded-full items-center justify-center border border-slate-200 dark:border-white/10 z-[60] transition-colors hover:text-primary-500 hover:border-primary-300 dark:hover:border-primary-500/40"
          :class="isSidebarMini ? 'rotate-180' : ''"
        >
          <i class="fas fa-chevron-left" style="font-size:7px"></i>
        </button>

        <!-- Logo + Brand -->
        <div
          class="flex items-center shrink-0 overflow-hidden"
          :class="isSidebarMini ? 'justify-center h-[52px]' : 'h-[52px] px-4 gap-2.5'"
        >
          <img
            :src="themeStore.config.logo || '/gems-logo.png'"
            alt="GEMS Hub"
            class="object-contain flex-shrink-0 transition-all duration-200"
            :class="isSidebarMini ? 'h-7 w-7' : 'h-7 w-auto'"
          />
          <span
            v-if="!isSidebarMini"
            class="text-[13px] font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap tracking-tight"
          >
            {{ themeStore.config.brandName }}
          </span>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-2 py-2 overflow-y-auto custom-scrollbar space-y-px">
          <router-link
            v-for="module in availableModules"
            :key="module.id"
            :to="module.path"
            :class="[
              'flex items-center h-9 rounded-md transition-colors duration-150 group relative outline-none',
              isModuleActive(module.path)
                ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400'
                : 'text-slate-500 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-white/[0.05] hover:text-slate-800 dark:hover:text-slate-200',
              isSidebarMini ? 'justify-center px-0' : 'px-3'
            ]"
            @mouseenter="isSidebarMini && showNavTooltip($event, localeStore.t(module.id))"
            @mouseleave="hideNavTooltip"
          >
            <!-- Active left accent -->
            <span
              v-if="isModuleActive(module.path)"
              class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-primary-500 rounded-r-sm"
            ></span>
            <i :class="[
              module.icon,
              'shrink-0',
              !isSidebarMini ? 'mr-2.5' : '',
              isModuleActive(module.path) ? 'text-primary-500 dark:text-primary-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
            ]" style="font-size:13px"></i>
            <span
              v-if="!isSidebarMini"
              class="text-[12.5px] font-medium truncate whitespace-nowrap"
            >{{ localeStore.t(module.id) }}</span>
          </router-link>
        </nav>

        <!-- User + Logout -->
        <div
          class="shrink-0"
          :class="isSidebarMini ? 'flex flex-col items-center gap-2 py-3' : 'px-3 py-3'"
        >
          <div v-if="!isSidebarMini" class="flex items-center gap-2 mb-2">
            <UserAvatar
              :name="authStore.user?.name || 'Usuario'"
              :avatar="authStore.user?.avatar"
              :photo="authStore.user?.photo"
              size="sm"
              :clickable="true"
              @click="router.push('/profile')"
              class="border border-slate-100 dark:border-white/10 flex-shrink-0"
            />
            <div class="min-w-0 flex-1">
              <p class="text-[12px] font-semibold text-slate-800 dark:text-slate-200 truncate leading-tight">{{ authStore.user?.name }}</p>
              <p class="text-[10px] text-slate-400 dark:text-slate-500 truncate">{{ getRoleDisplayName(authStore.user?.role) }}</p>
            </div>
          </div>
          <UserAvatar
            v-else
            :name="authStore.user?.name || 'Usuario'"
            :avatar="authStore.user?.avatar"
            :photo="authStore.user?.photo"
            size="sm"
            :clickable="true"
            @click="router.push('/profile')"
            class="border border-slate-100 dark:border-white/10"
          />
          <button
            @click="handleLogout"
            :class="[
              'flex items-center gap-2 rounded-md text-slate-400 dark:text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors',
              isSidebarMini ? 'w-8 h-8 justify-center' : 'w-full px-2 py-1.5'
            ]"
          >
            <i class="fas fa-power-off" style="font-size:11px;flex-shrink:0"></i>
            <span v-if="!isSidebarMini" class="text-[12px] font-medium">Salir</span>
          </button>
        </div>
      </div>

      <!-- Mobile menu button -->
      <div class="lg:hidden fixed top-3 left-4 z-50">
        <button
          @click="sidebarOpen = !sidebarOpen"
          class="p-2 rounded-xl bg-white dark:bg-[#1e293b] shadow-md text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#334155]"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      <!-- Main Content -->
      <div 
        class="flex flex-col h-screen transition-all duration-200 ease-in-out"
        :class="isSidebarMini ? 'lg:ml-[56px]' : 'lg:ml-[210px]'"
      >
        <!-- Main Content Area -->
        <main class="p-4 pb-24 lg:pb-8 flex-1 min-h-0 overflow-y-auto custom-scrollbar dark:bg-[#0f172a]">
          <router-view />
        </main>
      </div>

      <!-- Bottom navigation (solo mobile) -->
      <nav class="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#1e293b]/95 backdrop-blur-sm border-t border-slate-100 dark:border-[#334155] flex items-stretch px-1 pb-[env(safe-area-inset-bottom)]">
        <router-link
          v-for="item in bottomNavItems"
          :key="item.path"
          :to="item.path"
          class="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition-colors"
          :class="isModuleActive(item.path) ? 'text-primary-600 dark:text-primary-300' : 'text-slate-400 dark:text-slate-500'"
        >
          <i :class="[item.icon, 'text-[15px]']"></i>
          <span class="text-[9px] font-black tracking-tight truncate max-w-full px-0.5">{{ localeStore.t(item.id) }}</span>
        </router-link>
        <button
          class="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition-colors"
          :class="sidebarOpen ? 'text-primary-600 dark:text-primary-300' : 'text-slate-400 dark:text-slate-500'"
          @click="sidebarOpen = true"
        >
          <i class="fas fa-ellipsis text-[15px]"></i>
          <span class="text-[9px] font-black tracking-tight">{{ localeStore.t('nav.more') }}</span>
        </button>
      </nav>

  <!-- Mobile backdrop -->
  <div v-if="sidebarOpen && !isDesktop" class="lg:hidden fixed inset-0 z-40 bg-black/50" @click="sidebarOpen = false"></div>

  <!-- Sidebar nav tooltip (Teleport para evitar clipping del overflow-y-auto) -->
  <Teleport to="body">
    <div
      v-if="navTooltip.visible"
      class="nav-tooltip-wrap fixed z-[9999] pointer-events-none"
      :style="{ top: navTooltip.y + 'px', left: navTooltip.x + 'px', transform: 'translateY(-50%)' }"
    >
      <span class="nav-tooltip block px-2.5 py-1.5 text-white text-[11px] font-black rounded-lg whitespace-nowrap tracking-wide">
        {{ navTooltip.label }}
      </span>
    </div>
  </Teleport>

  <!-- Global toast for nuevos mensajes (Hidden by user request) -->
  <!-- <NewMessageToast /> -->

  <!-- Notification Bell flotante (inferior derecha) -->
  <NotificationBell />

  <!-- Modal global "Refinar Tarea" — se abre al clickear notificaciones, etc. -->
  <ActivityFormModal
    v-if="activityModalStore.isOpen"
    :activity="activityModalStore.editingActivity"
    :clients="activityModalStore.clients"
    :team-members="activityModalStore.teamMembers"
    @close="activityModalStore.close"
    @saved="activityModalStore.close"
  />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useChatStore } from './stores/chatStore'
import UserAvatar from './components/ui/UserAvatar.vue'
import NewMessageToast from './components/NewMessageToast.vue'
import NotificationBell from './components/NotificationBell.vue'
import ActivityFormModal from './components/forms/ActivityFormModal.vue'
import { useActivityModalStore } from './stores/activityModal'
import { useThemeStore } from './stores/theme'
import { useLocaleStore } from './stores/localeStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const chatStore = useChatStore()
const activityModalStore = useActivityModalStore()
const themeStore = useThemeStore()
const localeStore = useLocaleStore()

// Reactive data
const sidebarOpen = ref(true)
const isSidebarMini = ref(false)
const showUserMenu = ref(false)
const isDesktop = ref(true)

// Nav tooltip (fixed position para evitar clipping del overflow)
const navTooltip = reactive({ visible: false, label: '', x: 0, y: 0 })
const showNavTooltip = (e: MouseEvent, label: string) => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  navTooltip.label = label
  navTooltip.x = rect.right + 10
  navTooltip.y = rect.top + rect.height / 2
  navTooltip.visible = true
}
const hideNavTooltip = () => { navTooltip.visible = false }
// Removed navbar mini-popup; use NewMessageToast instead

// Computed properties
const availableModules = computed(() => authStore.getAvailableModules)

// Activo también en sub-rutas (ej. /wiki/:pageId mantiene iluminado "Wiki")
const isModuleActive = (path: string) =>
  route.path === path || (path !== '/' && route.path.startsWith(path + '/'))

// Bottom bar móvil: primeros 4 módulos disponibles (Dashboard, Clientes, Actividades…) + botón "Más"
const bottomNavItems = computed(() => availableModules.value.slice(0, 4))

const currentModule = computed(() => {
  const current = availableModules.value.find(m => m.path === route.path)
  return current?.id || 'dashboard'
})

// Methods
const getCurrentModuleName = () => {
  return availableModules.value.find(m => m.path === route.path)?.name || 'Dashboard'
}

const getCurrentModuleDescription = () => {
  const descriptions: Record<string, string> = {
    dashboard: 'Resumen general del CRM',
    clients: 'Gestión de clientes y contactos',
    activities: 'Actividades y tareas del equipo',
    reports: 'Análisis de rendimiento y métricas de productividad',
    accounting: 'Transacciones, pagos y gastos fijos',
    tickets: 'Gestión de incidencias y soporte técnico',
    cases: 'Documentos, incidencias y seguimientos',
    team: 'Gestión de usuarios y equipo',
    profile: 'Configuración de perfil de usuario'
  }
  return descriptions[currentModule.value] || 'Panel de control principal'
}

const getRoleDisplayName = (role?: string) => {
  const roleNames: Record<string, string> = {
    admin: 'Administrador',
    supervisor: 'Supervisor',
    collaborator: 'Colaborador',
    support: 'Soporte',
    viewer: 'Consultor',
    client: 'Cliente',
  }
  return roleNames[role || ''] || role
}

const navigateToProfile = () => {
  showUserMenu.value = false
  router.push('/profile')
}

const handleLogout = async () => {
  showUserMenu.value = false
  await authStore.logout()
}

// Handle responsive sidebar
const handleResize = () => {
  isDesktop.value = window.innerWidth >= 1024
  if (isDesktop.value) {
    sidebarOpen.value = true
  } else {
    sidebarOpen.value = false
  }
}

// Close user menu when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (showUserMenu.value && !(event.target as Element).closest('.relative')) {
    showUserMenu.value = false
  }
}

onMounted(async () => {
  await authStore.checkAuth()

  const savedLang = (authStore.user as any)?.preferences?.language
  if (savedLang === 'es' || savedLang === 'en') localeStore.setLocale(savedLang)

  themeStore.load()
  handleResize()
  window.addEventListener('resize', handleResize)
  document.addEventListener('click', handleClickOutside)

  // Initialize chat in background for unread badge (Disabled by user request)
  /* if (authStore.isAuthenticated) {
    try { await chatStore.initializeChat() } catch {}
  } */
})

// Removed navbar popup listener; NewMessageToast handles notifications globally
</script>

<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ── Tooltip: entrada suave + brillo metálico tenue ─────────────── */
@keyframes tooltip-enter {
  from { opacity: 0; transform: translateX(-3px); }
  to   { opacity: 1; transform: translateX(0); }
}

@keyframes tooltip-shine {
  0%   { background-position: -200% center; }
  100% { background-position: 300% center; }
}

.nav-tooltip-wrap {
  animation: tooltip-enter 0.38s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.nav-tooltip {
  background: linear-gradient(
    110deg,
    #1e293b 0%,
    #263447 42%,
    rgba(255, 255, 255, 0.045) 52%,
    #263447 62%,
    #1e293b 100%
  );
  background-size: 300% auto;
  animation: tooltip-shine 2.8s ease-out forwards;
  border: 1px solid rgba(148, 163, 184, 0.12);
  box-shadow:
    0 4px 14px rgba(0, 0, 0, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.dark .nav-tooltip {
  background: linear-gradient(
    110deg,
    #0f172a 0%,
    #1a2540 42%,
    rgba(139, 92, 246, 0.065) 52%,
    #1a2540 62%,
    #0f172a 100%
  );
  background-size: 300% auto;
  border: 1px solid rgba(139, 92, 246, 0.15);
  box-shadow:
    0 4px 18px rgba(0, 0, 0, 0.38),
    inset 0 1px 0 rgba(139, 92, 246, 0.05);
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

/* Los estilos de scrollbar globales se gestionan en style.css para mayor consistencia */
</style>
