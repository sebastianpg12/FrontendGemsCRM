<template>
  <div class="flex gap-4 h-[calc(100vh-3.5rem)] min-h-0">
    <!-- Sidebar desktop -->
    <div class="hidden lg:block h-full">
      <WikiSidebar
        :tree="tree"
        :children-map="childrenMap"
        :root-nodes="rootNodes"
        :archived-pages="archivedPages"
        :current-id="currentId"
        :expanded-ids="expandedIds"
        :show-archived="showArchived"
        @select="navigateTo"
        @toggle="toggleExpand"
        @create-page="createPage"
        @rename="renamePage"
        @archive="askArchive"
        @restore="restorePage"
        @delete-permanent="askDeletePermanent"
        @move-up="movePage($event, -1)"
        @move-down="movePage($event, 1)"
        @move-into="moveInto"
        @move-to-root="moveToRoot"
        @toggle-archived="showArchived = !showArchived"
      />
    </div>

    <!-- Sidebar mobile (drawer) -->
    <div v-if="mobileSidebarOpen" class="lg:hidden fixed inset-0 z-[90]">
      <div class="absolute inset-0 bg-slate-900/50" @click="mobileSidebarOpen = false"></div>
      <div class="absolute inset-y-0 left-0 p-3 w-72 max-w-[85vw]">
        <WikiSidebar
          class="!w-full shadow-2xl"
          :tree="tree"
          :children-map="childrenMap"
          :root-nodes="rootNodes"
          :archived-pages="archivedPages"
          :current-id="currentId"
          :expanded-ids="expandedIds"
          :show-archived="showArchived"
          @select="(id: string) => { navigateTo(id); mobileSidebarOpen = false }"
          @toggle="toggleExpand"
          @create-page="createPage"
          @rename="renamePage"
          @archive="askArchive"
          @restore="restorePage"
          @delete-permanent="askDeletePermanent"
          @move-up="movePage($event, -1)"
          @move-down="movePage($event, 1)"
          @move-into="moveInto"
          @move-to-root="moveToRoot"
          @toggle-archived="showArchived = !showArchived"
        />
      </div>
    </div>

    <!-- Panel de contenido -->
    <section class="flex-1 min-w-0 h-full flex flex-col bg-white dark:bg-[#1e293b] rounded-xl overflow-hidden">
      <!-- Barra superior -->
      <header class="shrink-0 h-12 px-3 sm:px-4 flex items-center gap-2 border-b border-slate-100 dark:border-[#334155]">
        <button
          class="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#273449] transition-colors shrink-0"
          title="Páginas"
          @click="mobileSidebarOpen = true"
        >
          <i class="fas fa-bars text-[14px]"></i>
        </button>

        <WikiBreadcrumb :trail="breadcrumb" @navigate="onBreadcrumbNavigate" />

        <div class="flex-1"></div>

        <template v-if="currentPage && !editing">
          <span class="hidden sm:flex items-center gap-1.5 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mr-1" title="Vistas">
            <i class="fas fa-eye text-[12px]"></i>{{ currentPage.vistas || 0 }}
          </span>
          <button class="btn-secondary" @click="startEditing">
            <i class="fas fa-pen text-[12px]"></i><span class="hidden sm:inline">Editar</span>
          </button>
          <button
            class="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
            title="Archivar página"
            @click="askArchive(currentPage._id!)"
          >
            <i class="fas fa-box-archive text-[14px]"></i>
          </button>
        </template>

        <template v-else-if="editing">
          <button class="btn-secondary" @click="cancelEditing">Cancelar</button>
          <button class="btn-primary" :disabled="saving" @click="savePage">
            <i class="fas text-[12px]" :class="saving ? 'fa-circle-notch fa-spin' : 'fa-check'"></i>
            Guardar
          </button>
        </template>
      </header>

      <!-- Cuerpo -->
      <div class="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
        <!-- Cargando -->
        <div v-if="loadingPage || loadingTree" class="h-full flex items-center justify-center">
          <div class="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 dark:border-[#334155] border-t-primary-600"></div>
        </div>

        <!-- Estado vacío global -->
        <div v-else-if="tree.length === 0" class="h-full flex flex-col items-center justify-center px-6 text-center">
          <div class="w-20 h-20 bg-primary-50 dark:bg-primary-500/10 rounded-2xl flex items-center justify-center mb-5">
            <i class="fas fa-book-open text-2xl text-primary-500"></i>
          </div>
          <h3 class="text-[22px] font-black text-slate-800 dark:text-slate-100 tracking-tight mb-2">Tu base de conocimiento está vacía</h3>
          <p class="text-[13px] font-medium text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
            Documenta procesos, manuales y guías de tu equipo. Organiza todo en páginas y sub-páginas, como en Notion.
          </p>
          <button class="btn-primary" @click="createPage(null)">
            <i class="fas fa-plus text-[12px]"></i>Crear primera página
          </button>
        </div>

        <!-- Sin página seleccionada -->
        <div v-else-if="!currentPage" class="h-full flex flex-col items-center justify-center px-6 text-center">
          <div class="w-20 h-20 bg-slate-50 dark:bg-[#0f172a] rounded-2xl flex items-center justify-center mb-5">
            <i class="fas fa-hand-pointer text-2xl text-slate-300 dark:text-slate-600"></i>
          </div>
          <h3 class="text-[22px] font-black text-slate-800 dark:text-slate-100 tracking-tight mb-2">Selecciona una página</h3>
          <p class="text-[13px] font-medium text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
            Elige una página del panel izquierdo o crea una nueva para empezar.
          </p>
        </div>

        <!-- Página -->
        <div v-else class="max-w-3xl mx-auto px-6 sm:px-10 py-8">
          <!-- Modo edición -->
          <template v-if="editing">
            <input
              ref="titleInput"
              v-model="editTitle"
              type="text"
              placeholder="Sin título"
              class="w-full text-[22px] font-black text-slate-800 dark:text-slate-100 tracking-tight bg-transparent outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600 mb-4"
              @keydown.enter.prevent="focusEditor"
            />
            <WikiEditor v-model="editContent" />
          </template>

          <!-- Modo lectura -->
          <template v-else>
            <h1 class="text-[22px] font-black text-slate-800 dark:text-slate-100 tracking-tight mb-1.5">
              {{ currentPage.titulo }}
            </h1>
            <p class="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">
              Por {{ currentPage.autor?.name || 'Usuario' }} · Actualizado {{ formatDate(currentPage.updatedAt) }}
            </p>
            <div v-if="hasContent">
              <WikiContent :content="currentPage.contenido" />
            </div>
            <button
              v-else
              class="w-full py-10 rounded-xl border-2 border-dashed border-slate-200 dark:border-[#334155] text-slate-400 dark:text-slate-500 hover:text-primary-500 transition-colors text-[13px] font-bold"
              @click="startEditing"
            >
              <i class="fas fa-pen mr-2 text-[12px]"></i>Esta página está vacía — haz click para escribir
            </button>

            <!-- Sub-páginas -->
            <div v-if="currentChildren.length" class="mt-8 pt-6 border-t border-slate-100 dark:border-[#334155]">
              <p class="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Sub-páginas</p>
              <div class="space-y-1">
                <button
                  v-for="child in currentChildren"
                  :key="child._id"
                  class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#273449] transition-colors text-left"
                  @click="navigateTo(child._id)"
                >
                  <i class="fas fa-file-lines text-[12px] text-slate-400"></i>
                  <span class="text-[13px] font-bold">{{ child.titulo }}</span>
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </section>

    <!-- Modal de confirmación -->
    <Teleport to="body">
    <div v-if="confirmDialog" class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/50" @click.self="confirmDialog = null">
      <div class="bg-white dark:bg-[#1e293b] rounded-xl shadow-2xl w-full max-w-sm p-6">
        <div class="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
          :class="confirmDialog.danger ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-500' : 'bg-amber-50 dark:bg-amber-500/10 text-amber-500'">
          <i class="fas text-[16px]" :class="confirmDialog.danger ? 'fa-trash' : 'fa-box-archive'"></i>
        </div>
        <h3 class="text-[17px] font-black text-slate-800 dark:text-slate-100 tracking-tight mb-1.5">{{ confirmDialog.title }}</h3>
        <p class="text-[13px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed mb-6">{{ confirmDialog.message }}</p>
        <div class="flex justify-end gap-2">
          <button class="btn-secondary" @click="confirmDialog = null">Cancelar</button>
          <button
            class="inline-flex items-center gap-2 h-9 px-4 text-[13px] font-bold rounded-lg text-white transition-colors"
            :class="confirmDialog.danger ? 'bg-rose-600 hover:bg-rose-700' : 'bg-amber-500 hover:bg-amber-600'"
            @click="confirmDialog.onConfirm(); confirmDialog = null"
          >
            {{ confirmDialog.confirmLabel }}
          </button>
        </div>
      </div>
    </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { wikiService, type WikiArticle, type WikiTreeNode } from '@/services/wikiService'
import WikiContent from '@/components/wiki/WikiContent.vue'
import WikiEditor from '@/components/wiki/WikiEditor.vue'
import WikiSidebar from '@/components/wiki/WikiSidebar.vue'
import WikiBreadcrumb from '@/components/wiki/WikiBreadcrumb.vue'

const route = useRoute()
const router = useRouter()

const tree = ref<WikiTreeNode[]>([])
const archivedPages = ref<WikiTreeNode[]>([])
const currentPage = ref<WikiArticle | null>(null)
const loadingTree = ref(true)
const loadingPage = ref(false)
const saving = ref(false)

const expandedIds = ref<Set<string>>(new Set())
const showArchived = ref(false)
const mobileSidebarOpen = ref(false)

const editing = ref(false)
const editTitle = ref('')
const editContent = ref('')
const titleInput = ref<HTMLInputElement | null>(null)

const confirmDialog = ref<{
  title: string
  message: string
  confirmLabel: string
  danger: boolean
  onConfirm: () => void
} | null>(null)

const currentId = computed(() => (route.params.pageId as string) || null)

const childrenMap = computed(() => {
  const map: Record<string, WikiTreeNode[]> = {}
  for (const node of tree.value) {
    const key = node.parentId || '__root__'
    if (!map[key]) map[key] = []
    map[key].push(node)
  }
  for (const key of Object.keys(map)) {
    map[key].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  }
  return map
})

const rootNodes = computed(() => childrenMap.value['__root__'] || [])
const currentChildren = computed(() => currentId.value ? (childrenMap.value[currentId.value] || []) : [])

const breadcrumb = computed<WikiTreeNode[]>(() => {
  if (!currentId.value) return []
  const byId = new Map(tree.value.map(n => [n._id, n]))
  const trail: WikiTreeNode[] = []
  let node = byId.get(currentId.value)
  while (node) {
    trail.unshift(node)
    node = node.parentId ? byId.get(node.parentId) : undefined
  }
  return trail
})

const hasContent = computed(() => {
  const text = (currentPage.value?.contenido || '').replace(/<[^>]*>/g, '').trim()
  return text.length > 0
})

const formatDate = (d?: Date | string) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ── Navegación ───────────────────────────────────────────────────────────────

const navigateTo = (id: string) => {
  if (id === currentId.value) return
  router.push(`/wiki/${id}`)
}

const onBreadcrumbNavigate = (id: string | null) => {
  if (id) navigateTo(id)
  else if (rootNodes.value.length) navigateTo(rootNodes.value[0]._id)
}

const toggleExpand = (id: string) => {
  const next = new Set(expandedIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  expandedIds.value = next
}

const expandAncestorsOf = (id: string) => {
  const byId = new Map(tree.value.map(n => [n._id, n]))
  const next = new Set(expandedIds.value)
  let node = byId.get(id)
  while (node?.parentId) {
    next.add(node.parentId)
    node = byId.get(node.parentId)
  }
  expandedIds.value = next
}

// ── Carga de datos ───────────────────────────────────────────────────────────

const loadTree = async () => {
  loadingTree.value = true
  try {
    const [active, archived] = await Promise.all([
      wikiService.getTree(),
      wikiService.getArchived()
    ])
    tree.value = active
    archivedPages.value = archived
  } catch (err) {
    console.error('Error cargando árbol de wiki:', err)
  } finally {
    loadingTree.value = false
  }
}

const pendingEditId = ref<string | null>(null)

const loadPage = async (id: string) => {
  loadingPage.value = true
  editing.value = false
  try {
    currentPage.value = await wikiService.getById(id)
    expandAncestorsOf(id)
    if (pendingEditId.value === id) {
      pendingEditId.value = null
      startEditing()
    }
  } catch (err) {
    console.error('Error cargando página:', err)
    currentPage.value = null
  } finally {
    loadingPage.value = false
  }
}

watch(currentId, (id) => {
  if (id) loadPage(id)
  else currentPage.value = null
}, { immediate: false })

// ── Edición ──────────────────────────────────────────────────────────────────

const startEditing = async () => {
  if (!currentPage.value) return
  editTitle.value = currentPage.value.titulo
  editContent.value = currentPage.value.contenido || ''
  editing.value = true
  await nextTick()
  titleInput.value?.focus()
}

const cancelEditing = () => {
  editing.value = false
}

const focusEditor = () => {
  const pm = document.querySelector('.wiki-editor__content .ProseMirror') as HTMLElement | null
  pm?.focus()
}

const savePage = async () => {
  if (!currentPage.value?._id || saving.value) return
  const titulo = editTitle.value.trim() || 'Sin título'
  saving.value = true
  try {
    const updated = await wikiService.update(currentPage.value._id, {
      titulo,
      contenido: editContent.value
    })
    currentPage.value = { ...currentPage.value, ...updated }
    const node = tree.value.find(n => n._id === updated._id)
    if (node) node.titulo = updated.titulo
    editing.value = false
  } catch (err) {
    console.error('Error guardando página:', err)
  } finally {
    saving.value = false
  }
}

const onKeydown = (e: KeyboardEvent) => {
  if (editing.value && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
    e.preventDefault()
    savePage()
  }
}

// ── Operaciones del árbol ────────────────────────────────────────────────────

const createPage = async (parentId: string | null) => {
  try {
    const created = await wikiService.create({
      titulo: 'Sin título',
      contenido: '',
      categoria: 'otros',
      ...(parentId ? { parentId } : {})
    } as Partial<WikiArticle>)
    tree.value.push({
      _id: created._id!,
      titulo: created.titulo,
      parentId: created.parentId || null,
      order: created.order ?? 0
    })
    if (parentId) expandedIds.value = new Set([...expandedIds.value, parentId])
    mobileSidebarOpen.value = false
    pendingEditId.value = created._id!
    await router.push(`/wiki/${created._id}`)
  } catch (err) {
    console.error('Error creando página:', err)
  }
}

const renamePage = async (id: string, titulo: string) => {
  const node = tree.value.find(n => n._id === id)
  if (!node) return
  const prev = node.titulo
  node.titulo = titulo
  try {
    await wikiService.update(id, { titulo })
    if (currentPage.value?._id === id) currentPage.value.titulo = titulo
  } catch (err) {
    node.titulo = prev
    console.error('Error renombrando página:', err)
  }
}

const movePage = async (id: string, direction: -1 | 1) => {
  const node = tree.value.find(n => n._id === id)
  if (!node) return
  const siblings = childrenMap.value[node.parentId || '__root__'] || []
  const idx = siblings.findIndex(s => s._id === id)
  const swapWith = siblings[idx + direction]
  if (!swapWith) return
  const orderA = node.order ?? 0
  const orderB = swapWith.order ?? 0
  node.order = orderB
  swapWith.order = orderA
  try {
    await Promise.all([
      wikiService.move(id, { order: orderB }),
      wikiService.move(swapWith._id, { order: orderA })
    ])
  } catch (err) {
    node.order = orderA
    swapWith.order = orderB
    console.error('Error reordenando página:', err)
  }
}

const moveInto = async (id: string, parentId: string) => {
  if (id === parentId) return
  // No permitir mover dentro de un descendiente propio (el backend también lo valida)
  let cursor: string | null = parentId
  const byId = new Map(tree.value.map(n => [n._id, n]))
  while (cursor) {
    if (cursor === id) return
    cursor = byId.get(cursor)?.parentId || null
  }
  const node = tree.value.find(n => n._id === id)
  if (!node || node.parentId === parentId) return
  const prevParent = node.parentId
  const siblings = childrenMap.value[parentId] || []
  node.parentId = parentId
  node.order = siblings.length ? Math.max(...siblings.map(s => s.order ?? 0)) + 1 : 0
  expandedIds.value = new Set([...expandedIds.value, parentId])
  try {
    await wikiService.move(id, { parentId, order: node.order })
  } catch (err) {
    node.parentId = prevParent
    console.error('Error moviendo página:', err)
  }
}

const moveToRoot = async (id: string) => {
  const node = tree.value.find(n => n._id === id)
  if (!node || !node.parentId) return
  const prevParent = node.parentId
  node.parentId = null
  node.order = rootNodes.value.length ? Math.max(...rootNodes.value.map(s => s.order ?? 0)) + 1 : 0
  try {
    await wikiService.move(id, { parentId: null, order: node.order })
  } catch (err) {
    node.parentId = prevParent
    console.error('Error moviendo página:', err)
  }
}

// ── Archivar / restaurar / eliminar ──────────────────────────────────────────

const descendantsOf = (id: string): string[] => {
  const result: string[] = []
  const stack = [id]
  while (stack.length) {
    const current = stack.pop()!
    const children = childrenMap.value[current] || []
    for (const child of children) {
      result.push(child._id)
      stack.push(child._id)
    }
  }
  return result
}

const askArchive = (id: string) => {
  const node = tree.value.find(n => n._id === id)
  if (!node) return
  const childCount = descendantsOf(id).length
  confirmDialog.value = {
    title: 'Archivar página',
    message: childCount
      ? `«${node.titulo}» y sus ${childCount} sub-página${childCount === 1 ? '' : 's'} se moverán a Archivadas. Podrás restaurarlas cuando quieras.`
      : `«${node.titulo}» se moverá a Archivadas. Podrás restaurarla cuando quieras.`,
    confirmLabel: 'Archivar',
    danger: false,
    onConfirm: () => archivePage(id)
  }
}

const archivePage = async (id: string) => {
  try {
    await wikiService.archive(id)
    const removedIds = new Set([id, ...descendantsOf(id)])
    const removed = tree.value.filter(n => removedIds.has(n._id))
    tree.value = tree.value.filter(n => !removedIds.has(n._id))
    archivedPages.value = [...removed, ...archivedPages.value]
    if (currentId.value && removedIds.has(currentId.value)) {
      const fallback = rootNodes.value[0]
      router.push(fallback ? `/wiki/${fallback._id}` : '/wiki')
    }
  } catch (err) {
    console.error('Error archivando página:', err)
  }
}

const restorePage = async (id: string) => {
  try {
    const restored = await wikiService.restore(id)
    const node = archivedPages.value.find(n => n._id === id)
    archivedPages.value = archivedPages.value.filter(n => n._id !== id)
    tree.value.push({
      _id: id,
      titulo: node?.titulo || restored.titulo,
      parentId: restored.parentId || null,
      order: restored.order ?? 0
    })
  } catch (err) {
    console.error('Error restaurando página:', err)
  }
}

const askDeletePermanent = (id: string) => {
  const node = archivedPages.value.find(n => n._id === id)
  confirmDialog.value = {
    title: 'Eliminar permanentemente',
    message: `«${node?.titulo || 'Esta página'}» y sus sub-páginas se eliminarán para siempre. Esta acción no se puede deshacer.`,
    confirmLabel: 'Eliminar',
    danger: true,
    onConfirm: () => deletePermanent(id)
  }
}

const deletePermanent = async (id: string) => {
  try {
    await wikiService.delete(id, true)
    archivedPages.value = archivedPages.value.filter(n => n._id !== id && n.parentId !== id)
  } catch (err) {
    console.error('Error eliminando página:', err)
  }
}

// ── Init ─────────────────────────────────────────────────────────────────────

onMounted(async () => {
  window.addEventListener('keydown', onKeydown)
  await loadTree()
  if (currentId.value) {
    loadPage(currentId.value)
  } else if (rootNodes.value.length) {
    router.replace(`/wiki/${rootNodes.value[0]._id}`)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 16px;
  border-radius: 10px;
  background: var(--brand-accent, #4f46e5);
  color: white;
  font-size: 11px;
  font-weight: 700;
  transition: all 0.15s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}
.btn-primary:hover:not(:disabled) {
  filter: brightness(1.1);
}
.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 16px;
  border-radius: 10px;
  background: white;
  color: #475569;
  font-size: 11px;
  font-weight: 700;
  border: 1px solid #e2e8f0;
  transition: all 0.15s ease;
}
.btn-secondary:hover {
  background: #f8fafc;
  color: #0f172a;
}
.dark .btn-secondary {
  background: #1e293b;
  color: #cbd5e1;
  border-color: #334155;
}
.dark .btn-secondary:hover {
  background: #273449;
  color: #f1f5f9;
}

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
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
}
</style>
