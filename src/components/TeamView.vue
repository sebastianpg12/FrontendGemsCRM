<template>
  <div class="p-6 space-y-6">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="page-title">Equipo y Accesos</h1>
        <p class="text-sm text-slate-500 mt-0.5">Gestiona los miembros de tu equipo y sus permisos</p>
      </div>
      <button
        v-if="activeTab === 'miembros'"
        @click="openCreateForm"
        class="btn btn-primary"
      >
        <i class="fas fa-plus text-xs"></i>
        Agregar Miembro
      </button>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
      <button
        @click="activeTab = 'miembros'"
        :class="['px-5 py-2 text-sm font-bold rounded-lg transition-all', activeTab === 'miembros' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700']"
      >
        <i class="fas fa-users mr-2"></i>Miembros
      </button>
      <button
        @click="activeTab = 'roles'"
        :class="['px-5 py-2 text-sm font-bold rounded-lg transition-all', activeTab === 'roles' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700']"
      >
        <i class="fas fa-id-badge mr-2"></i>Roles
      </button>
    </div>

    <!-- Miembros Tab -->
    <div v-if="activeTab === 'miembros'" class="space-y-4">

      <!-- Filters -->
      <div class="card p-3 flex flex-col sm:flex-row gap-2">
        <div class="flex-1 relative">
          <i class="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Buscar por nombre, rol o email..."
            class="input-base pl-9"
          >
        </div>
        <select v-model="roleFilter" class="select-base sm:w-48">
          <option value="">Todos los roles</option>
          <option v-for="role in allAvailableRoles" :key="role._id || role.name" :value="role.name">
            {{ role.name }}
          </option>
        </select>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-16">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>

      <!-- Empty -->
      <div v-else-if="filteredMembers.length === 0" class="card flex flex-col items-center justify-center py-16 text-center">
        <div class="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
          <i class="fas fa-users text-slate-400 text-xl"></i>
        </div>
        <p class="text-slate-500 font-medium">No se encontraron miembros</p>
      </div>

      <!-- Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="member in filteredMembers"
          :key="member._id"
          class="card-hover p-5 flex flex-col gap-4"
        >
          <!-- Avatar + info -->
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 bg-primary-50 ring-2 ring-primary-100 rounded-full flex items-center justify-center text-primary-600 font-black text-base shrink-0">
              {{ getInitials(member.name) }}
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-bold text-slate-800 text-sm truncate">{{ member.name }}</h3>
              <span class="inline-block px-2 py-0.5 bg-primary-50 text-primary-600 rounded-md text-[10px] font-black uppercase tracking-wider mt-0.5">{{ member.role }}</span>
            </div>
          </div>

          <!-- Details -->
          <div class="space-y-1.5">
            <div class="flex items-center gap-2 text-slate-500">
              <i class="fas fa-envelope w-3.5 text-slate-400 text-xs"></i>
              <span class="text-xs truncate">{{ member.email }}</span>
            </div>
            <div class="flex items-center gap-2 text-slate-500">
              <i class="fas fa-calendar w-3.5 text-slate-400 text-xs"></i>
              <span class="text-xs">Desde {{ formatDate(member.createdAt) }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-2 pt-3 border-t border-slate-100">
            <button @click="editMember(member)" class="btn btn-secondary btn-sm flex-1">
              <i class="fas fa-pen text-[10px]"></i>Editar
            </button>
            <button @click="confirmDelete(member)" class="btn btn-danger btn-sm flex-1">
              <i class="fas fa-trash text-[10px]"></i>Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Roles Tab -->
    <div v-else-if="activeTab === 'roles'">
      <RolesManager />
    </div>

    <!-- Team Form Modal -->
    <TeamForm 
      v-if="showTeamForm"
      :member="editingMember"
      @close="closeTeamForm"
      @memberSaved="handleTeamSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { teamService, type TeamMember } from '../services/teamService'
import TeamForm from './TeamForm.vue'
import RolesManager from './RolesManager.vue'
import { rolesService, type Role } from '../services/rolesService'
import { useNotifications } from '../composables/useNotifications'

// Composables
const { showSuccess, showError, confirmDelete: confirmDeleteNotification, showLoading, closeLoading } = useNotifications()

const activeTab = ref<'miembros' | 'roles'>('miembros')
const members = ref<TeamMember[]>([])
const roles = ref<Role[]>([])
const baseRolesNames = ['admin', 'supervisor', 'collaborator', 'support', 'viewer', 'client']

const allAvailableRoles = computed(() => {
  const combined = [...roles.value]
  baseRolesNames.forEach(name => {
    if (!combined.some(r => r.name.toLowerCase() === name.toLowerCase())) {
      combined.push({
        name: name,
        isSystem: true,
        permissions: {} as any
      })
    }
  })
  return combined
})

const loading = ref(false)
const searchTerm = ref('')
const roleFilter = ref('')

// Team Form Modal state
const showTeamForm = ref(false)
const editingMember = ref<TeamMember | null>(null)

// No emits needed - modal is handled internally

const filteredMembers = computed(() => {
  return members.value.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchesRole = !roleFilter.value || member.role === roleFilter.value
    return matchesSearch && matchesRole
  })
})

const loadMembers = async () => {
  try {
    loading.value = true
    members.value = await teamService.getAll()
  } catch (error) {
    console.error('Error loading team members:', error)
  } finally {
    loading.value = false
  }
}

const openCreateForm = () => {
  editingMember.value = null
  showTeamForm.value = true
}

const editMember = (member: TeamMember) => {
  editingMember.value = member
  showTeamForm.value = true
}

const closeTeamForm = () => {
  showTeamForm.value = false
  editingMember.value = null
}

const handleTeamSave = () => {
  closeTeamForm()
  loadMembers() // Reload the list
  showSuccess('¡Miembro guardado!', 'El miembro del equipo ha sido guardado exitosamente')
}

const confirmDelete = async (member: TeamMember) => {
  const result = await confirmDeleteNotification(member.nombre, 'miembro del equipo')
  
  if (result.isConfirmed) {
    await deleteMember(member)
  }
}

const deleteMember = async (member: TeamMember) => {
  try {
    showLoading('Eliminando miembro del equipo...')
    await teamService.delete(member._id!)
    members.value = members.value.filter(m => m._id !== member._id)
    closeLoading()
    showSuccess('¡Miembro eliminado!', 'El miembro del equipo ha sido eliminado exitosamente')
  } catch (error) {
    closeLoading()
    showError('Error al eliminar miembro', error instanceof Error ? error.message : 'Error desconocido')
  }
}

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(async () => {
  loadMembers()
  try {
    roles.value = await rolesService.getAll()
  } catch (error) {
    console.error('Error loading roles:', error)
  }
})

defineExpose({
  loadMembers
})
</script>
