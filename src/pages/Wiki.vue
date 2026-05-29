<template>
  <div class="space-y-6">
    <!-- Header & Search -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-black text-slate-800 tracking-tight">Base de Conocimiento (Wiki)</h2>
        <p class="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">
          Documentación, manuales y guías de procesos
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button 
          @click="openCreateModal"
          class="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-600/20 transition-all hover:-translate-y-0.5"
        >
          <i class="fas fa-plus"></i>
          <span>Nuevo Artículo</span>
        </button>
      </div>
    </div>

    <!-- Filtros y Búsqueda -->
    <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center">
      <!-- Tabs de Categoría -->
      <div class="flex gap-2 p-1 bg-slate-50 rounded-xl">
        <button 
          v-for="cat in categorias" 
          :key="cat.id"
          @click="selectedCategory = cat.id"
          class="px-4 py-2 text-sm font-bold rounded-lg transition-all"
          :class="selectedCategory === cat.id ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
        >
          <i :class="cat.icon" class="mr-2"></i>{{ cat.label }}
        </button>
      </div>

      <!-- Buscador -->
      <div class="relative w-full md:w-80">
        <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="Buscar artículos..."
          class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-medium text-sm"
          @keyup.enter="fetchArticles"
        />
      </div>
    </div>

    <!-- Estado de Carga -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-primary-600"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredArticles.length === 0" class="bg-white rounded-3xl border border-slate-100 p-12 text-center">
      <div class="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <i class="fas fa-book-open text-3xl text-primary-500"></i>
      </div>
      <h3 class="text-xl font-bold text-slate-800 mb-2">No se encontraron artículos</h3>
      <p class="text-slate-500 font-medium max-w-md mx-auto">
        No hay documentos que coincidan con tu búsqueda en esta categoría. Puedes crear uno nuevo para empezar a documentar.
      </p>
    </div>

    <!-- Lista de Artículos -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="article in filteredArticles" 
        :key="article._id"
        class="bg-white rounded-2xl border border-slate-200 hover:border-primary-300 shadow-sm hover:shadow-xl hover:shadow-primary-600/5 transition-all p-6 cursor-pointer group flex flex-col"
        @click="openViewModal(article)"
      >
        <div class="flex justify-between items-start mb-4">
          <div 
            class="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1.5"
            :class="getCategoryStyle(article.categoria)"
          >
            <i :class="getCategoryIcon(article.categoria)"></i>
            {{ getCategoryLabel(article.categoria) }}
          </div>
          <div class="text-xs font-bold text-slate-400 flex items-center gap-1" title="Vistas">
            <i class="fas fa-eye"></i> {{ article.vistas || 0 }}
          </div>
        </div>
        
        <h3 class="text-lg font-black text-slate-800 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
          {{ article.titulo }}
        </h3>
        
        <p class="text-sm font-medium text-slate-500 line-clamp-3 mb-4 flex-1">
          {{ article.descripcion || 'Sin descripción detallada.' }}
        </p>

        <div class="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-500">
              {{ (article.autor?.name || 'U').substring(0,2).toUpperCase() }}
            </div>
            <span class="text-xs font-bold text-slate-600">{{ article.autor?.name || 'Usuario' }}</span>
          </div>
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {{ new Date(article.updatedAt || new Date()).toLocaleDateString() }}
          </span>
        </div>
      </div>
    </div>

    <!-- Modal Visor / Editor -->
    <div v-if="isModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <!-- Header Modal -->
        <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary-500 border border-slate-200">
              <i class="fas" :class="isEditing ? 'fa-edit' : 'fa-book-open'"></i>
            </div>
            <div>
              <h3 class="text-lg font-black text-slate-800 tracking-tight">
                {{ isEditing ? (currentArticle._id ? 'Editar Artículo' : 'Nuevo Artículo') : currentArticle.titulo }}
              </h3>
              <p v-if="!isEditing" class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                Por {{ currentArticle.autor?.name }} · {{ new Date(currentArticle.updatedAt || new Date()).toLocaleDateString() }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button 
              v-if="!isEditing" 
              @click="isEditing = true"
              class="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-primary-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-200"
              title="Editar"
            >
              <i class="fas fa-pen"></i>
            </button>
            <button 
              v-if="!isEditing && currentArticle._id" 
              @click="confirmDelete"
              class="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-rose-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-200"
              title="Eliminar"
            >
              <i class="fas fa-trash"></i>
            </button>
            <div class="w-px h-6 bg-slate-300 mx-1"></div>
            <button 
              @click="closeModal"
              class="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-200"
            >
              <i class="fas fa-times text-lg"></i>
            </button>
          </div>
        </div>

        <!-- Contenido Modal -->
        <div class="p-6 overflow-y-auto flex-1 custom-scrollbar bg-white">
          <template v-if="isEditing">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="md:col-span-2 space-y-4">
                <div>
                  <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Título</label>
                  <input v-model="editForm.titulo" type="text" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 font-bold text-slate-800" placeholder="Ej: Guía de inducción" />
                </div>
                <div>
                  <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Descripción Corta</label>
                  <textarea v-model="editForm.descripcion" rows="2" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 font-medium text-sm text-slate-700" placeholder="Breve resumen del contenido..."></textarea>
                </div>
                <div>
                  <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Contenido</label>
                  <WikiEditor v-model="editForm.contenido" />
                </div>
              </div>
              <div class="space-y-4">
                <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <h4 class="text-xs font-black text-slate-800 uppercase tracking-widest mb-3">Configuración</h4>
                  <div class="space-y-4">
                    <div>
                      <label class="block text-xs font-bold text-slate-500 mb-1.5">Categoría</label>
                      <select v-model="editForm.categoria" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary-500">
                        <option value="proceso">Procesos</option>
                        <option value="manual">Manuales</option>
                        <option value="codigo">Código</option>
                        <option value="otros">Otros</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          
          <template v-else>
            <WikiContent :content="currentArticle.contenido" />
          </template>
        </div>

        <!-- Footer Modal -->
        <div v-if="isEditing" class="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button @click="isEditing = false; if(!currentArticle._id) closeModal()" class="px-5 py-2.5 bg-white text-slate-600 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all">
            Cancelar
          </button>
          <button @click="saveArticle" class="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-600/20 transition-all">
            <i class="fas fa-save mr-2"></i> Guardar
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { wikiService, type WikiArticle } from '@/services/wikiService'
import WikiContent from '@/components/wiki/WikiContent.vue'
import WikiEditor from '@/components/wiki/WikiEditor.vue'

const categorias = [
  { id: '', label: 'Todos', icon: 'fas fa-layer-group' },
  { id: 'proceso', label: 'Procesos', icon: 'fas fa-project-diagram' },
  { id: 'manual', label: 'Manuales', icon: 'fas fa-book' },
  { id: 'codigo', label: 'Código', icon: 'fas fa-code' },
  { id: 'otros', label: 'Otros', icon: 'fas fa-folder-open' }
]

const articles = ref<WikiArticle[]>([])
const loading = ref(true)
const selectedCategory = ref('')
const searchQuery = ref('')

const isModalOpen = ref(false)
const isEditing = ref(false)
const currentArticle = ref<Partial<WikiArticle>>({})
const editForm = ref<Partial<WikiArticle>>({
  titulo: '',
  descripcion: '',
  categoria: 'proceso',
  contenido: ''
})

const filteredArticles = computed(() => {
  let result = articles.value
  if (selectedCategory.value) {
    result = result.filter(a => a.categoria === selectedCategory.value)
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(a => 
      a.titulo.toLowerCase().includes(q) || 
      a.descripcion?.toLowerCase().includes(q)
    )
  }
  return result
})

const fetchArticles = async () => {
  loading.value = true
  try {
    articles.value = await wikiService.getAll()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const getCategoryLabel = (cat: string) => {
  return categorias.find(c => c.id === cat)?.label || 'Otros'
}

const getCategoryIcon = (cat: string) => {
  return categorias.find(c => c.id === cat)?.icon || 'fas fa-folder'
}

const getCategoryStyle = (cat: string) => {
  const styles: Record<string, string> = {
    'proceso': 'bg-blue-50 text-blue-600',
    'manual': 'bg-emerald-50 text-emerald-600',
    'codigo': 'bg-purple-50 text-purple-600',
    'otros': 'bg-slate-100 text-slate-600'
  }
  return styles[cat] || styles['otros']
}

const openViewModal = async (article: WikiArticle) => {
  isEditing.value = false
  // Incrementar contador localmente o refetch
  currentArticle.value = { ...article }
  isModalOpen.value = true
  try {
    // Al pedirlo por ID, el backend suma 1 vista
    const fullArticle = await wikiService.getById(article._id!)
    currentArticle.value = fullArticle
    const index = articles.value.findIndex(a => a._id === article._id)
    if(index !== -1) articles.value[index] = fullArticle
  } catch (err) {
    console.error(err)
  }
}

const openCreateModal = () => {
  currentArticle.value = {}
  editForm.value = {
    titulo: '',
    descripcion: '',
    categoria: 'proceso',
    contenido: ''
  }
  isEditing.value = true
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  currentArticle.value = {}
}

const saveArticle = async () => {
  if(!editForm.value.titulo || !editForm.value.contenido) {
    alert("El título y el contenido son requeridos")
    return
  }
  try {
    if(currentArticle.value._id) {
      const updated = await wikiService.update(currentArticle.value._id, editForm.value)
      const index = articles.value.findIndex(a => a._id === updated._id)
      if(index !== -1) articles.value[index] = updated
      currentArticle.value = updated
    } else {
      const created = await wikiService.create(editForm.value)
      articles.value.unshift(created)
      currentArticle.value = created
    }
    isEditing.value = false
  } catch (err) {
    console.error(err)
    alert("Error al guardar")
  }
}

const confirmDelete = async () => {
  if(!currentArticle.value._id) return
  if(confirm("¿Estás seguro de eliminar este artículo? Esta acción no se puede deshacer.")) {
    try {
      await wikiService.delete(currentArticle.value._id)
      articles.value = articles.value.filter(a => a._id !== currentArticle.value._id)
      closeModal()
    } catch (err) {
      console.error(err)
      alert("Error al eliminar")
    }
  }
}

// Escuchar cambios de edición para autocompletar editForm
watch(() => isEditing.value, (val) => {
  if (val && currentArticle.value._id) {
    editForm.value = {
      titulo: currentArticle.value.titulo,
      descripcion: currentArticle.value.descripcion,
      categoria: currentArticle.value.categoria,
      contenido: currentArticle.value.contenido
    }
  }
})

watch(() => selectedCategory.value, () => {
  // Ya filtrado por computed
})

onMounted(() => {
  fetchArticles()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
