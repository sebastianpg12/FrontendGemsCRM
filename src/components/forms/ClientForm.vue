<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Información básica -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="label-base">
          Nombre Completo *
        </label>
        <input
          v-model="form.name"
          type="text"
          required
          class="input-base"
          placeholder="Ej: Juan Pérez"
        />
      </div>

      <div>
        <label class="label-base">
          Email *
        </label>
        <input
          v-model="form.email"
          type="email"
          required
          class="input-base"
          placeholder="Ej: juan@empresa.com"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="label-base">
          Teléfono
        </label>
        <input
          v-model="form.phone"
          type="tel"
          class="input-base"
          placeholder="Ej: +1 234 567 8900"
        />
      </div>

      <div>
        <label class="label-base">
          Empresa
        </label>
        <input
          v-model="form.company"
          type="text"
          class="input-base"
          placeholder="Ej: ABC Corp"
        />
      </div>
    </div>

    <!-- Estado -->
    <div>
      <label class="block text-sm font-medium text-gray-300 mb-2">
        Estado
      </label>
      <select
        v-model="form.status"
        class="select-base"
      >
        <option value="prospect">Prospecto</option>
        <option value="active">Activo</option>
        <option value="inactive">Inactivo</option>
      </select>
    </div>

    <!-- Dirección -->
    <div>
      <label class="block text-sm font-medium text-gray-300 mb-2">
        Dirección
      </label>
      <textarea
        v-model="form.address"
        rows="3"
        class="input-base resize-none"
        placeholder="Dirección completa del cliente"
      ></textarea>
    </div>

    <!-- Error message -->
    <div v-if="error" class="p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
      <p class="text-red-400 text-sm">{{ error }}</p>
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
      <button type="button" @click="$emit('cancel')" class="btn btn-ghost">
        Cancelar
      </button>
      <button type="submit" :disabled="loading" class="btn btn-primary">
        <i v-if="loading" class="fas fa-spinner fa-spin"></i>
        {{ loading ? 'Guardando...' : (mode === 'create' ? 'Crear Cliente' : 'Actualizar') }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { clientService, type ClientData } from '../../services/clientService'

// Props
const props = defineProps<{
  item?: ClientData | null
  mode: 'create' | 'edit'
}>()

// Emits
const emit = defineEmits(['save', 'cancel'])

// Reactive data
const loading = ref(false)
const error = ref('')

const form = reactive<Partial<ClientData>>({
  name: '',
  email: '',
  phone: '',
  company: '',
  status: 'prospect',
  address: ''
})

// Methods
const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    if (props.mode === 'create') {
      await clientService.create({
        name: form.name!,
        email: form.email!,
        phone: form.phone,
        company: form.company,
        status: form.status || 'prospect',
        address: form.address
      })
    } else if (props.item?._id) {
      await clientService.update(props.item._id, form)
    }

    emit('save')
  } catch (err: any) {
    error.value = err.message || 'Error al guardar el cliente'
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  Object.assign(form, {
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'prospect',
    address: ''
  })
}

const loadForm = () => {
  if (props.item && props.mode === 'edit') {
    Object.assign(form, {
      name: props.item.name || '',
      email: props.item.email || '',
      phone: props.item.phone || '',
      company: props.item.company || '',
      status: props.item.status || 'prospect',
      address: props.item.address || ''
    })
  } else {
    resetForm()
  }
}

// Load form data on mount
onMounted(() => {
  loadForm()
})

// Watch for changes in props
watch(() => props.item, () => {
  loadForm()
})

watch(() => props.mode, () => {
  loadForm()
})
</script>
