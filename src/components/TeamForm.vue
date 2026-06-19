<template>
  <Teleport to="body">
  <div class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/50" @click.self="closeForm">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm animate-scale-up">

      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-slate-50">
        <div>
          <div class="flex items-center gap-2 mb-0.5">
            <i class="fas fa-gem text-primary-400 text-[8px]"></i>
            <span class="text-[9px] font-black uppercase tracking-[0.2em] text-primary-400">GEMS Hub</span>
          </div>
          <h3 class="text-[15px] font-black text-slate-900 leading-tight">
            {{ isEditing ? 'Editar Miembro' : 'Nuevo Miembro' }}
          </h3>
        </div>
        <button @click="closeForm"
          class="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all">
          <i class="fas fa-times text-[12px]"></i>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-5 space-y-3.5">
        <!-- Nombre -->
        <div>
          <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Nombre Completo *</label>
          <input v-model="form.name" type="text" required placeholder="Ej: Juan Pérez"
            class="w-full h-8 bg-slate-50 border border-slate-100 rounded-lg px-3 text-[12px] font-medium text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-400/30 focus:border-primary-400 transition-all" />
        </div>

        <!-- Rol -->
        <div>
          <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Rol *</label>
          <CustomSelect v-model="form.role" :options="roleOptions" placeholder="Selecciona un rol" size="sm" />
        </div>

        <!-- Email -->
        <div>
          <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Email *</label>
          <input v-model="form.email" type="email" required placeholder="correo@empresa.com"
            class="w-full h-8 bg-slate-50 border border-slate-100 rounded-lg px-3 text-[12px] font-medium text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-400/30 focus:border-primary-400 transition-all" />
        </div>

        <!-- Departamento -->
        <div>
          <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Departamento *</label>
          <CustomSelect v-model="form.department" :options="departmentOptions" placeholder="Selecciona un departamento" size="sm" />
        </div>

        <!-- Actions -->
        <div class="flex gap-2 pt-2 border-t border-slate-50">
          <button type="button" @click="closeForm"
            class="flex-1 h-8 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-all">
            Cancelar
          </button>
          <button type="submit" :disabled="loading || !isFormValid"
            class="flex-1 h-8 rounded-lg bg-primary-600 text-white text-[11px] font-bold hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5">
            <i v-if="loading" class="fas fa-circle-notch fa-spin text-[10px]"></i>
            {{ loading ? (isEditing ? 'Actualizando...' : 'Creando...') : (isEditing ? 'Actualizar' : 'Crear') }}
          </button>
        </div>
      </form>

    </div>
  </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { teamService, type TeamMember } from '../services/teamService'
import { useNotifications } from '../composables/useNotifications'
import CustomSelect from './ui/CustomSelect.vue'

const SYSTEM_ROLES = [
  { name: 'Administrador' },
  { name: 'Supervisor' },
  { name: 'Colaborador' },
  { name: 'Soporte' },
  { name: 'Consultor' },
  { name: 'Cliente' },
]

const roleOptions = SYSTEM_ROLES.map(r => ({ value: r.name, label: r.name }))
const departmentOptions = [
  { value: 'TI', label: 'TI' },
  { value: 'MARKETING', label: 'Marketing' },
  { value: 'VENTAS', label: 'Ventas' },
  { value: 'SOPORTE', label: 'Soporte' },
]

interface Props {
  member?: TeamMember | null
}

const { showError } = useNotifications()
const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  memberSaved: [member: TeamMember]
}>()

const loading = ref(false)
const form = ref({
  name: '',
  role: '',
  email: '',
  department: ''
})

const isEditing = computed(() => !!props.member)

const isFormValid = computed(() => {
  return form.value.name.trim() !== '' &&
         form.value.role.trim() !== '' &&
         form.value.email.trim() !== '' &&
         form.value.department.trim() !== ''
})

const resetForm = () => {
  form.value = { name: '', role: '', email: '', department: '' }
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

const closeForm = () => emit('close')

const handleSubmit = async () => {
  if (!isFormValid.value) return
  try {
    loading.value = true
    const payload = {
      name: form.value.name.trim(),
      role: form.value.role,
      email: form.value.email.trim(),
      department: form.value.department
    }
    const savedMember = isEditing.value && props.member?._id
      ? await teamService.update(props.member._id, payload)
      : await teamService.create(payload)
    emit('memberSaved', savedMember)
    closeForm()
  } catch (error) {
    console.error('Error saving team member:', error)
    showError('Error al guardar el miembro del equipo.')
  } finally {
    loading.value = false
  }
}

onMounted(() => loadMemberData())

watch(() => props.member, () => {
  nextTick(() => loadMemberData())
}, { immediate: true })
</script>
