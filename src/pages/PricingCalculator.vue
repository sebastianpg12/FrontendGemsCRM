<template>
  <div class="p-4 lg:p-8 min-h-screen bg-slate-50 dark:bg-slate-950">
    <div class="max-w-7xl mx-auto">

      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <i class="fas fa-crown text-amber-500 text-xs"></i>
            <span class="text-[12px] font-black uppercase tracking-[0.25em] text-primary-600">Super-admin · Interno</span>
          </div>
          <h1 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Calculadora de costos y precios</h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
            Análisis de rentabilidad por escenario: costos plataforma, planes vendidos, margen, break-even.
          </p>
          <p class="text-[12px] text-amber-600 dark:text-amber-400 font-bold mt-1.5">
            <i class="fas fa-circle-info mr-1"></i>
            Backend desplegado en <strong>Oracle Cloud</strong> — Always Free tier cubre casi todo (Ampere A1 24GB / 4 OCPU + 10TB egress).
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button @click="exportJson" class="px-3 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 transition-colors">
            <i class="fas fa-download mr-1.5 text-[12px]"></i>Exportar escenario
          </button>
          <button @click="resetAll" class="px-3 py-2 rounded-lg text-xs font-bold text-slate-500 hover:text-rose-600 bg-white dark:bg-slate-900 transition-colors">
            <i class="fas fa-rotate-left mr-1.5 text-[12px]"></i>Reset defaults
          </button>
        </div>
      </div>

      <!-- ══ RESULTADOS RESUMIDOS (sticky-feel top) ══ -->
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <div class="bg-white dark:bg-slate-900 rounded-xl p-4">
          <div class="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
            <i class="fas fa-sack-dollar text-sm"></i>
            <span class="text-[12px] font-bold uppercase tracking-widest">Ingresos / mes</span>
          </div>
          <p class="text-2xl font-black text-emerald-600 tabular-nums">${{ revenue.toLocaleString('en-US', { maximumFractionDigits: 0 }) }}</p>
          <p class="text-[12px] text-slate-400 mt-1">{{ totalTenants }} tenants pagos</p>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-xl p-4">
          <div class="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
            <i class="fas fa-server text-sm"></i>
            <span class="text-[12px] font-bold uppercase tracking-widest">Costos / mes</span>
          </div>
          <p class="text-2xl font-black text-rose-600 tabular-nums">${{ totalCost.toLocaleString('en-US', { maximumFractionDigits: 0 }) }}</p>
          <p class="text-[12px] text-slate-400 mt-1">Fijos + variables</p>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-xl p-4">
          <div class="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
            <i class="fas fa-chart-line text-sm"></i>
            <span class="text-[12px] font-bold uppercase tracking-widest">Utilidad / mes</span>
          </div>
          <p class="text-2xl font-black tabular-nums" :class="profit >= 0 ? 'text-slate-900 dark:text-white' : 'text-rose-600'">
            ${{ profit.toLocaleString('en-US', { maximumFractionDigits: 0 }) }}
          </p>
          <p class="text-[12px] mt-1" :class="margin >= 30 ? 'text-emerald-600' : margin >= 0 ? 'text-amber-600' : 'text-rose-600'">
            Margen {{ margin.toFixed(1) }}%
          </p>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-xl p-4">
          <div class="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
            <i class="fas fa-balance-scale text-sm"></i>
            <span class="text-[12px] font-bold uppercase tracking-widest">Break-even</span>
          </div>
          <p class="text-2xl font-black text-slate-900 dark:text-white tabular-nums">{{ breakEvenTenants }}</p>
          <p class="text-[12px] text-slate-400 mt-1">tenants {{ breakEvenPlan }} para cubrir fijos</p>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-xl p-4">
          <div class="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
            <i class="fas fa-arrow-trend-up text-sm"></i>
            <span class="text-[12px] font-bold uppercase tracking-widest">Anualizado</span>
          </div>
          <p class="text-2xl font-black text-primary-600 tabular-nums">${{ (profit * 12).toLocaleString('en-US', { maximumFractionDigits: 0 }) }}</p>
          <p class="text-[12px] text-slate-400 mt-1">Utilidad × 12</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <!-- ══ COL 1: COSTOS FIJOS PLATAFORMA ══ -->
        <div class="bg-white dark:bg-slate-900 rounded-xl p-5">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-sm font-black text-slate-900 dark:text-white">Costos fijos plataforma</h3>
              <p class="text-[12px] text-slate-400 mt-0.5">Lo que pagamos sin importar # de tenants</p>
            </div>
            <span class="text-sm font-black text-rose-600 tabular-nums">${{ totalFixed.toFixed(0) }}/mes</span>
          </div>

          <div class="space-y-3">
            <div v-for="(item, key) in fixedCosts" :key="key" class="flex items-center gap-2">
              <label class="text-[13px] font-bold text-slate-600 dark:text-slate-300 flex-1 truncate">
                <i :class="['fas', item.icon, 'text-slate-400 mr-1.5 text-[12px]']"></i>
                {{ item.label }}
              </label>
              <span class="text-[12px] text-slate-400">$</span>
              <input
                type="number" v-model.number="item.value" min="0" step="1"
                class="input-money"
                :title="item.hint"
              />
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button @click="addFixedCost" class="w-full text-[12px] font-bold text-primary-600 hover:text-primary-700 py-1.5 transition-colors">
              <i class="fas fa-plus mr-1"></i> Agregar otro costo fijo
            </button>
          </div>
        </div>

        <!-- ══ COL 2: COSTO VARIABLE POR TENANT ══ -->
        <div class="bg-white dark:bg-slate-900 rounded-xl p-5">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-sm font-black text-slate-900 dark:text-white">Costo variable por tenant</h3>
              <p class="text-[12px] text-slate-400 mt-0.5">Lo que añade cada cliente nuevo</p>
            </div>
            <span class="text-sm font-black text-amber-600 tabular-nums">${{ variablePerTenant.toFixed(2) }}/tenant</span>
          </div>

          <div class="space-y-3">
            <div v-for="(item, key) in variableCosts" :key="key" class="flex items-center gap-2">
              <label class="text-[13px] font-bold text-slate-600 dark:text-slate-300 flex-1 truncate" :title="item.hint">
                <i :class="['fas', item.icon, 'text-slate-400 mr-1.5 text-[12px]']"></i>
                {{ item.label }}
              </label>
              <span class="text-[12px] text-slate-400">$</span>
              <input
                type="number" v-model.number="item.value" min="0" step="0.01"
                class="input-money"
              />
            </div>
          </div>

          <div class="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed">
            <i class="fas fa-info-circle mr-1"></i>
            Total variable: <strong class="text-slate-700 dark:text-slate-200">${{ (variablePerTenant * totalTenants).toFixed(0) }}/mes</strong> ({{ totalTenants }} tenants).
          </div>
        </div>

        <!-- ══ COL 3: PLANES Y PRECIOS ══ -->
        <div class="bg-white dark:bg-slate-900 rounded-xl p-5">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-sm font-black text-slate-900 dark:text-white">Planes &amp; precios</h3>
              <p class="text-[12px] text-slate-400 mt-0.5">Lo que cobramos a cada tipo de cliente</p>
            </div>
            <span class="text-sm font-black text-emerald-600 tabular-nums">${{ revenue.toFixed(0) }}/mes</span>
          </div>

          <div class="space-y-3">
            <div v-for="plan in plans" :key="plan.key" class="rounded-lg p-3">
              <div class="flex items-center justify-between mb-2">
                <div>
                  <p class="text-xs font-black text-slate-800 dark:text-white">{{ plan.label }}</p>
                  <p class="text-[12px] text-slate-400">{{ plan.description }}</p>
                </div>
                <div class="text-right">
                  <p class="text-lg font-black text-primary-600 tabular-nums">${{ plan.price }}</p>
                  <p class="text-[11px] text-slate-400">/ mes</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <label class="text-[12px] font-bold text-slate-500 flex-1">Tenants en este plan</label>
                <input
                  type="number" v-model.number="plan.tenants" min="0" max="9999" step="1"
                  class="input-count"
                />
              </div>
              <div class="mt-2 flex items-center justify-between text-[12px]">
                <span class="text-slate-400">Aporta</span>
                <span class="font-black text-slate-700 dark:text-slate-200 tabular-nums">
                  ${{ (plan.price * plan.tenants).toLocaleString('en-US', { maximumFractionDigits: 0 }) }}/mes
                </span>
              </div>
              <div class="flex items-center justify-between text-[12px]">
                <span class="text-slate-400">Precio sugerido (config)</span>
                <input
                  type="number" v-model.number="plan.price" min="0" step="1"
                  class="input-money !w-20"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ══ TABLA DE ESCENARIO + SIMULADOR ══ -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">

        <!-- Tabla escenario actual -->
        <div class="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl overflow-hidden">
          <div class="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">
            <h3 class="text-sm font-black text-slate-900 dark:text-white">Desglose por plan</h3>
            <p class="text-[12px] text-slate-400 mt-0.5">P&amp;L por tipo de tenant</p>
          </div>
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[12px] uppercase tracking-wider">
              <tr>
                <th class="px-5 py-2.5 font-bold">Plan</th>
                <th class="px-5 py-2.5 font-bold text-right">Tenants</th>
                <th class="px-5 py-2.5 font-bold text-right">Ingreso</th>
                <th class="px-5 py-2.5 font-bold text-right">Costo var.</th>
                <th class="px-5 py-2.5 font-bold text-right">Margen unit.</th>
                <th class="px-5 py-2.5 font-bold text-right">Total margen</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr v-for="plan in plans" :key="plan.key">
                <td class="px-5 py-2.5 font-bold text-slate-800 dark:text-white">{{ plan.label }}</td>
                <td class="px-5 py-2.5 text-right tabular-nums">{{ plan.tenants }}</td>
                <td class="px-5 py-2.5 text-right tabular-nums text-emerald-600">${{ (plan.price * plan.tenants).toFixed(0) }}</td>
                <td class="px-5 py-2.5 text-right tabular-nums text-rose-600">${{ (variablePerTenant * plan.tenants).toFixed(0) }}</td>
                <td class="px-5 py-2.5 text-right tabular-nums" :class="planUnitMargin(plan) >= 0 ? 'text-slate-700 dark:text-slate-200' : 'text-rose-600'">
                  ${{ planUnitMargin(plan).toFixed(2) }}
                </td>
                <td class="px-5 py-2.5 text-right tabular-nums font-bold" :class="planTotalMargin(plan) >= 0 ? 'text-slate-800 dark:text-white' : 'text-rose-600'">
                  ${{ planTotalMargin(plan).toFixed(0) }}
                </td>
              </tr>
              <tr class="bg-slate-50 dark:bg-slate-800/50 font-bold">
                <td class="px-5 py-2.5 text-slate-900 dark:text-white">Totales</td>
                <td class="px-5 py-2.5 text-right tabular-nums">{{ totalTenants }}</td>
                <td class="px-5 py-2.5 text-right tabular-nums text-emerald-600">${{ revenue.toFixed(0) }}</td>
                <td class="px-5 py-2.5 text-right tabular-nums text-rose-600">${{ (variablePerTenant * totalTenants).toFixed(0) }}</td>
                <td class="px-5 py-2.5 text-right tabular-nums text-slate-500">—</td>
                <td class="px-5 py-2.5 text-right tabular-nums text-slate-900 dark:text-white">${{ totalContribution.toFixed(0) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Simulador "qué pasa si..." -->
        <div class="bg-white dark:bg-slate-900 rounded-xl p-5">
          <h3 class="text-sm font-black text-slate-900 dark:text-white mb-1">Simulador "Qué pasaría si…"</h3>
          <p class="text-[12px] text-slate-400 mb-4">Compara contra escenario actual</p>

          <div class="space-y-3">
            <div v-for="plan in plans" :key="plan.key">
              <div class="flex items-center justify-between mb-1">
                <span class="text-[13px] font-bold text-slate-600 dark:text-slate-300">{{ plan.label }}</span>
                <span class="text-[13px] tabular-nums text-slate-500">
                  {{ plan.tenants }} → <strong class="text-primary-600">{{ sim[plan.key] }}</strong>
                </span>
              </div>
              <input type="range" v-model.number="sim[plan.key]" min="0" max="50" step="1" class="w-full slider-flat" />
            </div>
          </div>

          <div class="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div class="flex justify-between text-[13px]">
              <span class="text-slate-500">Ingresos simulados</span>
              <span class="font-bold tabular-nums text-emerald-600">${{ simRevenue.toFixed(0) }}</span>
            </div>
            <div class="flex justify-between text-[13px]">
              <span class="text-slate-500">Utilidad simulada</span>
              <span class="font-bold tabular-nums" :class="simProfit >= 0 ? 'text-slate-800 dark:text-white' : 'text-rose-600'">${{ simProfit.toFixed(0) }}</span>
            </div>
            <div class="flex justify-between text-[13px]">
              <span class="text-slate-500">Δ vs actual</span>
              <span class="font-black tabular-nums" :class="(simProfit - profit) >= 0 ? 'text-emerald-600' : 'text-rose-600'">
                {{ (simProfit - profit) >= 0 ? '+' : '' }}${{ (simProfit - profit).toFixed(0) }}
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue'

const STORAGE_KEY = 'gems-pricing-calculator-v2'

interface CostLine { key: string; label: string; icon: string; value: number; hint?: string }
interface Plan { key: string; label: string; description: string; price: number; tenants: number }

const DEFAULTS = {
  fixedCosts: [
    { key: 'oracle',    label: 'Oracle Cloud Compute',   icon: 'fa-server',         value: 0,  hint: 'VM Ampere A1 Always Free (24GB RAM / 4 OCPU). Solo se cobra si excedes el tier gratuito.' },
    { key: 'oracle-net',label: 'Oracle Networking + LB', icon: 'fa-network-wired',  value: 0,  hint: '10TB egress/mes incluido en Always Free. Load Balancer básico también free.' },
    { key: 'mongo',     label: 'MongoDB Atlas',          icon: 'fa-database',       value: 0,  hint: 'M0 free tier (512MB) sirve para arrancar. Subir a M10 ($57) cuando se llene.' },
    { key: 'domain',    label: 'Dominio + DNS',          icon: 'fa-globe',          value: 2,  hint: 'gemsinnovations.com prorrateado (~$15/año + DNS Cloudflare free)' },
    { key: 'email',     label: 'Email transaccional',    icon: 'fa-envelope',       value: 0,  hint: 'Gmail SMTP free. Migrar a SendGrid/Resend ~$15-20 cuando escale.' },
    { key: 'misc',      label: 'Monitoring + logs',      icon: 'fa-chart-area',     value: 0,  hint: 'Oracle Cloud incluye monitoring básico. Si agregas Sentry: ~$26' }
  ] as CostLine[],
  variableCosts: [
    { key: 'storage',   label: 'Storage promedio (5GB)', icon: 'fa-hard-drive',  value: 0.10, hint: 'Oracle Block Volume: ~$0.0255/GB. Mongo: $0.10/GB después del free tier.' },
    { key: 'egress',    label: 'Egress + bandwidth',     icon: 'fa-arrow-up',    value: 0,    hint: 'Oracle: 10TB/mes gratis (extra $0.0085/GB). En la práctica $0 para SaaS típico.' },
    { key: 'gemini',    label: 'Gemini API (IA)',        icon: 'fa-microchip',   value: 1.5,  hint: 'Asumiendo ~500 prompts/mes promedio por tenant (Gemini Flash es muy barato).' },
    { key: 'attach',    label: 'Adjuntos extra',         icon: 'fa-paperclip',   value: 0.2,  hint: 'Object Storage Oracle: $0.0255/GB. Tickets + casos con archivos.' }
  ] as CostLine[],
  plans: [
    { key: 'free',       label: 'Free trial',  description: '14 días',                  price: 0,    tenants: 2 },
    { key: 'starter',    label: 'Starter',     description: 'Hasta 5 usuarios',         price: 29,   tenants: 3 },
    { key: 'pro',        label: 'Pro',         description: 'Hasta 25 usuarios',        price: 79,   tenants: 5 },
    { key: 'enterprise', label: 'Enterprise',  description: 'Ilimitado + soporte',      price: 199,  tenants: 1 }
  ] as Plan[]
}

const fixedCosts = reactive<CostLine[]>(JSON.parse(JSON.stringify(DEFAULTS.fixedCosts)))
const variableCosts = reactive<CostLine[]>(JSON.parse(JSON.stringify(DEFAULTS.variableCosts)))
const plans = reactive<Plan[]>(JSON.parse(JSON.stringify(DEFAULTS.plans)))

const sim = reactive<Record<string, number>>({
  free: 2, starter: 3, pro: 5, enterprise: 1
})

// Cargar estado guardado
try {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    const s = JSON.parse(saved)
    if (s.fixedCosts) fixedCosts.splice(0, fixedCosts.length, ...s.fixedCosts)
    if (s.variableCosts) variableCosts.splice(0, variableCosts.length, ...s.variableCosts)
    if (s.plans) plans.splice(0, plans.length, ...s.plans)
  }
} catch {}

watch([fixedCosts, variableCosts, plans], () => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ fixedCosts, variableCosts, plans })) } catch {}
}, { deep: true })

// ───────── Computed ─────────

const totalFixed = computed(() => fixedCosts.reduce((s, c) => s + (c.value || 0), 0))
const variablePerTenant = computed(() => variableCosts.reduce((s, c) => s + (c.value || 0), 0))
const totalTenants = computed(() => plans.reduce((s, p) => s + (p.tenants || 0), 0))
const revenue = computed(() => plans.reduce((s, p) => s + (p.price * p.tenants), 0))
const variableTotal = computed(() => variablePerTenant.value * totalTenants.value)
const totalCost = computed(() => totalFixed.value + variableTotal.value)
const profit = computed(() => revenue.value - totalCost.value)
const margin = computed(() => revenue.value > 0 ? (profit.value / revenue.value) * 100 : 0)

// Contribution margin (margen agregado)
const totalContribution = computed(() => plans.reduce((s, p) => s + planTotalMargin(p), 0))

const planUnitMargin = (p: Plan) => p.price - variablePerTenant.value
const planTotalMargin = (p: Plan) => planUnitMargin(p) * p.tenants

// Break-even: cuántos tenants del plan más popular (con > tenants actuales) cubren fijos
const breakEvenPlan = computed(() => {
  const paid = plans.filter(p => p.price > 0)
  if (!paid.length) return 'Pro'
  const ref = paid.reduce((a, b) => a.tenants > b.tenants ? a : b, paid[0])
  return ref.label
})

const breakEvenTenants = computed(() => {
  const paid = plans.filter(p => p.price > 0)
  if (!paid.length) return '—'
  const ref = paid.reduce((a, b) => a.tenants > b.tenants ? a : b, paid[0])
  const contributionPerTenant = ref.price - variablePerTenant.value
  if (contributionPerTenant <= 0) return '∞'
  return Math.ceil(totalFixed.value / contributionPerTenant)
})

// Simulador
const simRevenue = computed(() => plans.reduce((s, p) => s + p.price * (sim[p.key] ?? 0), 0))
const simVariable = computed(() => {
  const totalSim = plans.reduce((s, p) => s + (sim[p.key] ?? 0), 0)
  return variablePerTenant.value * totalSim
})
const simProfit = computed(() => simRevenue.value - totalFixed.value - simVariable.value)

// ───────── Acciones ─────────

function resetAll() {
  if (!confirm('¿Restaurar valores por defecto? Se pierde tu escenario actual.')) return
  fixedCosts.splice(0, fixedCosts.length, ...JSON.parse(JSON.stringify(DEFAULTS.fixedCosts)))
  variableCosts.splice(0, variableCosts.length, ...JSON.parse(JSON.stringify(DEFAULTS.variableCosts)))
  plans.splice(0, plans.length, ...JSON.parse(JSON.stringify(DEFAULTS.plans)))
  Object.keys(sim).forEach(k => sim[k] = plans.find(p => p.key === k)?.tenants || 0)
}

function addFixedCost() {
  const label = prompt('Nombre del costo (ej. "Sentry Pro"):')
  if (!label) return
  fixedCosts.push({
    key: 'custom-' + Date.now(),
    label,
    icon: 'fa-circle-dot',
    value: 0
  })
}

function exportJson() {
  const data = {
    generatedAt: new Date().toISOString(),
    fixedCosts, variableCosts, plans,
    summary: {
      revenue: revenue.value, totalCost: totalCost.value, profit: profit.value, margin: margin.value,
      breakEvenTenants: breakEvenTenants.value, breakEvenPlan: breakEvenPlan.value,
      annualProfit: profit.value * 12
    }
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `gems-pricing-scenario-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.input-money, .input-count {
  width: 5rem;
  padding: 0.375rem 0.625rem;
  border-radius: 0.5rem;
  background: rgb(248 250 252);
  border: 1px solid rgb(226 232 240);
  color: rgb(30 41 59);
  font-size: 0.75rem;
  font-weight: 700;
  text-align: right;
  outline: none;
  font-variant-numeric: tabular-nums;
}
.input-count { width: 3.5rem; }
.input-money:focus, .input-count:focus { border-color: rgb(99 102 241); }
:global(.dark) .input-money,
:global(.dark) .input-count {
  background: rgb(15 23 42);
  border-color: rgb(51 65 85);
  color: white;
}

.slider-flat {
  appearance: none;
  -webkit-appearance: none;
  height: 4px;
  background: rgb(226 232 240);
  border-radius: 9999px;
  outline: none;
  cursor: pointer;
}
:global(.dark) .slider-flat { background: rgb(51 65 85); }
.slider-flat::-webkit-slider-thumb {
  appearance: none;
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: rgb(99 102 241);
  border-radius: 9999px;
  cursor: pointer;
  transition: transform 0.1s;
}
.slider-flat::-webkit-slider-thumb:hover { transform: scale(1.15); }
.slider-flat::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: rgb(99 102 241);
  border-radius: 9999px;
  cursor: pointer;
  border: none;
}
</style>
