<template>
  <div class="bg-white dark:bg-[#1e293b] shadow-sm rounded-xl overflow-hidden flex flex-col h-full">

    <!-- Header -->
    <div class="flex items-center justify-between gap-2 px-3 py-2 shrink-0">
      <div class="flex items-center gap-1.5 min-w-0">
        <i class="fas fa-brain text-primary-500 text-[9px]"></i>
        <span class="text-[8px] font-black text-primary-500 uppercase tracking-widest">IA · {{ userName }}</span>
      </div>
      <div class="flex items-center gap-1 shrink-0">
        <button
          @click="expanded = !expanded"
          class="px-2 py-1 rounded-lg text-[9px] font-bold text-slate-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors"
        >{{ expanded ? 'Menos' : 'Más' }}</button>
        <button
          @click="generateInsights(false)"
          :disabled="loading"
          class="w-6 h-6 flex items-center justify-center rounded-lg text-slate-400 hover:text-primary-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-40"
        >
          <i :class="loading ? 'fas fa-spinner fa-spin' : 'fas fa-sync-alt'" class="text-[9px]"></i>
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex-1 flex items-center justify-center gap-2 py-6">
      <i class="fas fa-brain text-primary-400 text-sm animate-pulse"></i>
      <p class="text-slate-400 text-[10px]">Analizando...</p>
    </div>

    <!-- Content -->
    <div v-else-if="insights" class="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-700 flex-1 min-h-0 overflow-y-auto custom-scrollbar">

      <!-- LECTURA -->
      <div class="px-3 py-2">
        <div class="flex items-center gap-1 mb-1">
          <i class="fas fa-lightbulb text-amber-500 text-[8px]"></i>
          <span class="text-[7px] font-black text-amber-500 uppercase tracking-widest">Lectura</span>
        </div>
        <p class="text-[9px] text-slate-500 dark:text-slate-400 leading-relaxed" :class="!expanded && 'line-clamp-5'">
          {{ insights.lectura }}
        </p>
      </div>

      <!-- ACCIONES -->
      <div class="px-3 py-2">
        <div class="flex items-center gap-1 mb-1">
          <i class="fas fa-bullseye text-emerald-500 text-[8px]"></i>
          <span class="text-[7px] font-black text-emerald-500 uppercase tracking-widest">Acciones</span>
        </div>
        <ul class="space-y-1">
          <li v-for="(accion, i) in (expanded ? insights.acciones : insights.acciones.slice(0, 3))" :key="i"
            class="flex items-start gap-1.5 text-[9px] text-slate-500 dark:text-slate-400 leading-snug">
            <span class="w-1 h-1 rounded-full bg-emerald-400 mt-1 shrink-0"></span>
            <span :class="!expanded && 'line-clamp-2'">{{ accion }}</span>
          </li>
        </ul>
      </div>

      <!-- RIESGOS -->
      <div class="px-3 py-2">
        <div class="flex items-center gap-1 mb-1">
          <i class="fas fa-chart-line text-primary-500 text-[8px]"></i>
          <span class="text-[7px] font-black text-primary-500 uppercase tracking-widest">Riesgos</span>
        </div>
        <ul class="space-y-1">
          <li v-for="(riesgo, i) in (expanded ? insights.riesgos : insights.riesgos.slice(0, 3))" :key="i"
            class="flex items-start gap-1.5 text-[9px] text-slate-500 dark:text-slate-400 leading-snug">
            <span class="w-1 h-1 rounded-full bg-primary-400 mt-1 shrink-0"></span>
            <span :class="!expanded && 'line-clamp-2'">{{ riesgo }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex-1 flex flex-col items-center justify-center gap-2 py-6 px-4">
      <i class="fas fa-exclamation-triangle text-red-400"></i>
      <p class="text-red-500 text-[10px] text-center">{{ error }}</p>
      <button @click="generateInsights(false)"
        class="px-3 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-300 transition-colors">
        Reintentar
      </button>
    </div>

    <!-- Empty -->
    <div v-else class="flex-1 flex flex-col items-center justify-center gap-2 py-6 px-4">
      <i class="fas fa-brain text-slate-200 dark:text-slate-600"></i>
      <p class="text-slate-400 text-[10px]">Sin análisis disponible</p>
      <button @click="generateInsights(false)"
        class="px-3 py-1 bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/30 rounded-lg text-[10px] font-bold text-primary-600 dark:text-primary-400 transition-colors">
        Generar análisis
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useClientsStore, useActivitiesStore, useIssuesStore, useTeamStore } from '../stores'
import { API_CONFIG } from '@/config/api'
import { apiFetch } from '@/services/authHeaders'

interface InsightsData { lectura: string; acciones: string[]; riesgos: string[] }

const authStore = useAuthStore()
const clientsStore = useClientsStore()
const activitiesStore = useActivitiesStore()
const issuesStore = useIssuesStore()
const teamStore = useTeamStore()

const loading = ref(false)
const insights = ref<InsightsData | null>(null)
const error = ref('')
const expanded = ref(false)

const userName = computed(() => authStore.user?.name?.split(' ')[0] || 'ti')
const CACHE_KEY = computed(() => `crm_ai_insights_v4_${authStore.user?.name}_${authStore.user?.role}`)
const CACHE_DURATION = 30 * 60 * 1000

const getCached = (): InsightsData | null => {
  try {
    const c = localStorage.getItem(CACHE_KEY.value)
    if (c) { const p = JSON.parse(c); if (Date.now() - p.timestamp < CACHE_DURATION) return p.data; localStorage.removeItem(CACHE_KEY.value) }
  } catch {}; return null
}
const setCache = (d: InsightsData) => { try { localStorage.setItem(CACHE_KEY.value, JSON.stringify({ data: d, timestamp: Date.now() })) } catch {} }

const generateInsights = async (background = false) => {
  if (!background) loading.value = true
  error.value = ''
  if (background) { const c = getCached(); if (c) { insights.value = c; return } }
  if (!background) insights.value = null
  try {
    const firstName = authStore.user?.name?.split(' ')[0] || 'Usuario'
    const userRole = (authStore.user?.role || 'collaborator') as string
    const todayDate = new Date(); const tm = new Date(todayDate); tm.setHours(0,0,0,0)
    const clientMap = new Map(clientsStore.clients.map((c: any) => [c._id, c.name]))
    const overdueActs = activitiesStore.activities.filter((a: any) => { if (a.status==='completed'||a.status==='cancelled') return false; const d=new Date(a.dueDate||a.date);d.setHours(0,0,0,0);return d<tm }).slice(0,6)
    const todayActs = activitiesStore.activities.filter((a: any) => { if (a.status==='completed'||a.status==='cancelled') return false; const d=new Date(a.dueDate||a.date);d.setHours(0,0,0,0);return d.getTime()===tm.getTime() }).slice(0,5)
    const inProgressActs = activitiesStore.activities.filter((a: any) => a.status==='in-progress').slice(0,4)
    const highPriorityActs = activitiesStore.activities.filter((a: any) => (a.priority==='high'||a.priority==='urgent')&&a.status!=='completed'&&a.status!=='cancelled').slice(0,3)
    const fmt = (a: any) => { const cn=clientMap.get(a.clientId); const d=new Date(a.dueDate||a.date);d.setHours(0,0,0,0); const diff=Math.floor((tm.getTime()-d.getTime())/86400000); return `"${a.title}"${cn?` (${cn})`:''}${diff>0?` [${diff}d vencida]`:''}` }
    const roleCtx: Record<string,string> = { admin:'gestión estratégica y supervisión de KPIs', manager:'supervisión del equipo y cumplimiento de objetivos', employee:'ejecución de actividades y seguimiento de clientes', support:'resolución de tickets y satisfacción del cliente', development:'entregas técnicas y resolución de bugs', fullstack:'cobertura técnica y operativa', viewer:'monitoreo y reportes', client:'seguimiento de proyectos activos' }
    const todayStr = todayDate.toLocaleDateString('es', {weekday:'long',day:'numeric',month:'long',year:'numeric'})
    const prompt = `Eres un asistente estratégico de CRM. Responde ÚNICAMENTE en el formato indicado. No menciones el nombre del sistema.
PERFIL: ${firstName} | Rol: ${userRole} | Responsabilidad: ${roleCtx[userRole]||'gestión operativa'} | Fecha: ${todayStr}
VENCIDAS (${overdueActs.length}): ${overdueActs.length>0?overdueActs.map(fmt).map(s=>`· ${s}`).join(' | '):'Ninguna'}
HOY (${todayActs.length}): ${todayActs.length>0?todayActs.map(fmt).map(s=>`· ${s}`).join(' | '):'Ninguna'}
EN PROGRESO (${inProgressActs.length}): ${inProgressActs.length>0?inProgressActs.map(fmt).map(s=>`· ${s}`).join(' | '):'Ninguna'}
ALTA PRIORIDAD (${highPriorityActs.length}): ${highPriorityActs.length>0?highPriorityActs.map(fmt).map(s=>`· ${s}`).join(' | '):'Ninguna'}
MÉTRICAS: Clientes:${clientsStore.clients.length} | Activ:${activitiesStore.activities.length}(comp:${activitiesStore.activities.filter((a:any)=>a.status==='completed').length}) | Casos abiertos:${issuesStore.issues.filter((i:any)=>i.status==='open').length} | Equipo:${teamStore.members.length}
RESPONDE EXACTAMENTE (6 líneas, sin texto extra):
Lectura: [evaluación concreta de ${firstName} con datos específicos]
Accion1: [acción inmediata para HOY]
Accion2: [segunda acción prioritaria]
Accion3: [tercera acción táctica]
Riesgo1: [riesgo específico con consecuencia]
Riesgo2: [segundo riesgo diferente]`
    const response = await apiFetch(`${API_CONFIG.BASE_URL}/ai/gemini-generate`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({prompt}) })
    if (!response.ok) { const e=await response.json().catch(()=>({})); throw new Error(e.error||`Error ${response.status}`) }
    const result = await response.json(); const aiText: string = result.text||''; if (!aiText) throw new Error('Sin contenido')
    const lines = aiText.split('\n').map((l:string)=>l.trim()).filter(Boolean)
    const lectura = lines.find((l:string)=>l.startsWith('Lectura:'))?.replace('Lectura:','').trim()||''
    const acciones = lines.filter((l:string)=>/^Accion\d+:/i.test(l)).map((l:string)=>l.substring(l.indexOf(':')+1).trim()).filter((l:string)=>l.length>5)
    const riesgos = lines.filter((l:string)=>/^Riesgo\d+:/i.test(l)).map((l:string)=>l.substring(l.indexOf(':')+1).trim()).filter((l:string)=>l.length>5)
    const final: InsightsData = { lectura:lectura||'Análisis completado.', acciones:acciones.length>0?acciones:['Revisa las actividades vencidas'], riesgos:riesgos.length>0?riesgos:['Actividades sin atender afectan la percepción del cliente'] }
    insights.value = final; setCache(final)
  } catch(err:any) { error.value='No se pudo conectar con la IA'; console.error('AI Error:',err) } finally { if (!background) loading.value=false }
}

onMounted(() => { const c=getCached(); if(c) insights.value=c; generateInsights(true) })
</script>

