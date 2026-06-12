<template>
  <div class="flex flex-col gap-3 relative">
    <!-- Eyebrow GEMS -->
    <div class="flex items-center gap-2">
      <i class="fas fa-gem text-primary-400 text-[9px] animate-pulse-slow"></i>
      <span class="text-[9px] font-black uppercase tracking-[0.22em] text-primary-400">GEMS Hub</span>
      <span class="w-1 h-1 rounded-full bg-primary-200 inline-block"></span>
      <h1 class="text-[22px] font-black text-slate-900 tracking-tight leading-none gems-title">Actividades</h1>
    </div>

    <!-- Activities View -->
    <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div class="overflow-y-auto custom-scrollbar">
        <div class="p-4">
          <ActivitiesView
            ref="activitiesViewRef"
            v-model:searchTerm="searchTerm"
            @create="openCreateModal"
            @edit="openEditModal"
            class="h-full flex flex-col"
          />
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-scale-up">
        <!-- Modal header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-slate-50">
          <div>
            <div class="flex items-center gap-2 mb-0.5">
              <i class="fas fa-gem text-primary-400 text-[8px]"></i>
              <span class="text-[9px] font-black uppercase tracking-[0.2em] text-primary-400">GEMS Hub</span>
            </div>
            <h3 class="text-[16px] font-black text-slate-900 leading-tight">
              {{ editingActivity ? 'Editar Actividad' : 'Nueva Actividad' }}
            </h3>
          </div>
          <button @click="closeModal"
            class="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all">
            <i class="fas fa-times text-[12px]"></i>
          </button>
        </div>
        <div class="p-5">
          <ActivityForm
            :activity="editingActivity"
            @save="handleSave"
            @cancel="closeModal"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ActivitiesView from '../components/modules/ActivitiesView.vue'
import ActivityForm from '../components/forms/ActivityForm.vue'
// import TaskReportSettingsModal from '../components/modals/TaskReportSettingsModal.vue' // REMOVED
import type { ActivityData } from '../services/activityService'

// Reactive state
const searchTerm = ref('')
const showModal = ref(false)
// const showNotificationSettings = ref(false) // REMOVED
const editingActivity = ref<ActivityData | null>(null)
const activitiesViewRef = ref()

// Methods
const openCreateModal = () => {
  editingActivity.value = null
  showModal.value = true
}

const openEditModal = (activity: ActivityData) => {
  editingActivity.value = activity
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingActivity.value = null
}

const handleSave = () => {
  closeModal()
  if (activitiesViewRef.value?.loadActivities) {
    activitiesViewRef.value.loadActivities()
  }
}
</script>

<style scoped>
.gems-title {
  background: linear-gradient(90deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
