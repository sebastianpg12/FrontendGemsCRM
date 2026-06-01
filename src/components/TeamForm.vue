<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-slate-100">
      <div class="flex justify-between items-center px-6 py-4 border-b border-slate-100">
        <h2 class="text-base font-black text-slate-800">
          {{ isEditing ? 'Editar Miembro' : 'Nuevo Miembro' }}
        </h2>
        <button @click="closeForm" class="btn-icon text-sm">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="p-6">

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Nombre -->
        <div>
          <label for="name" class="label-base">
            Nombre Completo *
          </label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            class="input-base"
            placeholder="Ej: Juan Pérez"
          >
        </div>

        <!-- Rol -->
        <div>
          <label for="role" class="label-base">
            Rol *
          </label>
          <select
            id="role"
            v-model="form.role"
            required
            class="select-base"
          >
            <option value="" class="bg-gray-700">Selecciona un rol</option>
            <option v-for="role in roles" :key="role._id" :value="role.name" class="bg-gray-700">
              {{ role.name }}
            </option>
          </select>
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="label-base">
            Email *
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="input-base"
            placeholder="ejemplo@empresa.com"
          >
        </div>

        <!-- Departamento -->
        <div>
          <label for="department" class="label-base">
            Departamento *
          </label>
          <select
            id="department"
            v-model="form.department"
            required
            class="select-base"
          >
            <option value="" class="bg-gray-700">Selecciona un departamento</option>
            <option value="TI" class="bg-gray-700">TI</option>
            <option value="MARKETING" class="bg-gray-700">Marketing</option>
            <option value="VENTAS" class="bg-gray-700">Ventas</option>
            <option value="SOPORTE" class="bg-gray-700">Soporte</option>
          </select>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 pt-4 border-t border-slate-100">
          <button type="button" @click="closeForm" class="btn btn-secondary flex-1">Cancelar</button>
          <button type="submit" :disabled="loading || !isFormValid" class="btn btn-primary flex-1">
            <i v-if="loading" class="fas fa-spinner fa-spin"></i>
            {{ loading ? (isEditing ? 'Actualizando...' : 'Creando...') : (isEditing ? 'Actualizar' : 'Crear') }}
          </button>
        </div>
      </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { teamService, type TeamMember } from '../services/teamService'
import { rolesService, type Role } from '../services/rolesService'
import { useNotifications } from '../composables/useNotifications'

// Props
interface Props {
  member?: TeamMember | null
}

const { showError } = useNotifications()
const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  close: []
  memberSaved: [member: TeamMember]
}>()

// Reactive state
const loading = ref(false)
const roles = ref<Role[]>([])
const form = ref({
  name: '',
  role: '',
  email: '',
  department: ''
})

// Computed
const isEditing = computed(() => !!props.member)

const isFormValid = computed(() => {
  return form.value.name.trim() !== '' && 
         form.value.role.trim() !== '' && 
         form.value.email.trim() !== '' &&
         form.value.department.trim() !== ''
})

// Methods
const resetForm = () => {
  form.value = {
    name: '',
    role: '',
    email: '',
    department: ''
  }
}

const loadMemberData = () => {
  if (props.member) {
    form.value = {
      name: props.member.name || '',
      role: props.member.role || '',
      email: props.member.email || '',
      department: props.member.department || ''
    }
  } else {
    resetForm()
  }
}

const closeForm = () => {
  emit('close')
}

const handleSubmit = async () => {
  if (!isFormValid.value) return

  try {
    loading.value = true

    let savedMember: TeamMember

    const payload = {
      name: form.value.name.trim(),
      role: form.value.role,
      email: form.value.email.trim(),
      department: form.value.department
    }

    if (isEditing.value && props.member?._id) {
      // Update existing member
      savedMember = await teamService.update(props.member._id, payload)
    } else {
      // Create new member
      savedMember = await teamService.create(payload)
    }

    // Emit success event
    emit('memberSaved', savedMember)
    
    // Close the form
    closeForm()
    
  } catch (error) {
    console.error('Error saving team member:', error)
    showError('Error al guardar el miembro del equipo.')
  } finally {
    loading.value = false
  }
}

// Hooks
onMounted(async () => {
  try {
    roles.value = await rolesService.getAll()
  } catch (error) {
    console.error('Error loading roles:', error)
  }
})

// Watchers
watch(() => props.member, () => {
  nextTick(() => {
    loadMemberData()
  })
}, { immediate: true })
</script>
