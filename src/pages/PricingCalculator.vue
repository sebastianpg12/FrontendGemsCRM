<template>
  <div class="max-w-7xl mx-auto space-y-4">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-[22px] font-black text-slate-800 dark:text-slate-100 leading-tight">
          Calculadora de Precios
        </h1>
        <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium">
          Estima costos de infraestructura Oracle Cloud y precio sugerido por cliente
        </p>
      </div>
      <div class="flex items-center gap-2">
        <span class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 text-[10px] font-black uppercase tracking-widest text-orange-500">
          <i class="fas fa-cloud text-[9px]"></i> Oracle Cloud
        </span>
        <button
          @click="resetAll"
          class="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all"
        >
          <i class="fas fa-rotate-left mr-1.5 text-[9px]"></i>Reset
        </button>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 xl:grid-cols-5 gap-4">

      <!-- LEFT: Inputs -->
      <div class="xl:col-span-2 space-y-3">

        <!-- Client Profile -->
        <div class="bg-white dark:bg-[#1e293b] border border-slate-100 dark:border-[#334155] rounded-2xl p-4">
          <p class="text-[9px] font-black uppercase tracking-[0.2em] text-primary-400 mb-3">
            <i class="fas fa-building mr-1.5"></i>Perfil del Cliente
          </p>
          <div class="space-y-4">

            <!-- Users -->
            <div>
              <div class="flex justify-between items-center mb-1.5">
                <label class="text-[11px] font-black text-slate-600 dark:text-slate-300">
                  <i class="fas fa-users text-slate-300 dark:text-slate-600 mr-1.5"></i>Empleados usando el CRM
                </label>
                <span class="text-[13px] font-black text-primary-500 min-w-[2.5rem] text-right">{{ inputs.users }}</span>
              </div>
              <input type="range" v-model.number="inputs.users" min="1" max="200" step="1" class="slider w-full" />
              <div class="flex justify-between text-[8px] text-slate-300 dark:text-slate-600 mt-0.5">
                <span>1</span><span>50</span><span>100</span><span>200</span>
              </div>
            </div>

            <!-- Client Records -->
            <div>
              <div class="flex justify-between items-center mb-1.5">
                <label class="text-[11px] font-black text-slate-600 dark:text-slate-300">
                  <i class="fas fa-address-book text-slate-300 dark:text-slate-600 mr-1.5"></i>Registros de clientes
                </label>
                <span class="text-[13px] font-black text-primary-500 min-w-[3rem] text-right">{{ inputs.records.toLocaleString() }}</span>
              </div>
              <input type="range" v-model.number="inputs.records" min="0" max="20000" step="100" class="slider w-full" />
              <div class="flex justify-between text-[8px] text-slate-300 dark:text-slate-600 mt-0.5">
                <span>0</span><span>5K</span><span>10K</span><span>20K</span>
              </div>
            </div>

          </div>
        </div>

        <!-- Activity Volume -->
        <div class="bg-white dark:bg-[#1e293b] border border-slate-100 dark:border-[#334155] rounded-2xl p-4">
          <p class="text-[9px] font-black uppercase tracking-[0.2em] text-primary-400 mb-3">
            <i class="fas fa-chart-bar mr-1.5"></i>Volumen de Actividad / Mes
          </p>
          <div class="space-y-4">

            <div>
              <div class="flex justify-between items-center mb-1.5">
                <label class="text-[11px] font-black text-slate-600 dark:text-slate-300">
                  <i class="fas fa-list-check text-slate-300 dark:text-slate-600 mr-1.5"></i>Actividades / tareas
                </label>
                <span class="text-[13px] font-black text-primary-500 min-w-[3rem] text-right">{{ inputs.tasks.toLocaleString() }}</span>
              </div>
              <input type="range" v-model.number="inputs.tasks" min="0" max="30000" step="100" class="slider slider-violet w-full" />
              <div class="flex justify-between text-[8px] text-slate-300 dark:text-slate-600 mt-0.5">
                <span>0</span><span>10K</span><span>20K</span><span>30K</span>
              </div>
            </div>

            <div>
              <div class="flex justify-between items-center mb-1.5">
                <label class="text-[11px] font-black text-slate-600 dark:text-slate-300">
                  <i class="fas fa-headset text-slate-300 dark:text-slate-600 mr-1.5"></i>Tickets de soporte
                </label>
                <span class="text-[13px] font-black text-primary-500 min-w-[3rem] text-right">{{ inputs.tickets.toLocaleString() }}</span>
              </div>
              <input type="range" v-model.number="inputs.tickets" min="0" max="5000" step="10" class="slider slider-violet w-full" />
              <div class="flex justify-between text-[8px] text-slate-300 dark:text-slate-600 mt-0.5">
                <span>0</span><span>1K</span><span>2.5K</span><span>5K</span>
              </div>
            </div>

            <div>
              <div class="flex justify-between items-center mb-1.5">
                <label class="text-[11px] font-black text-slate-600 dark:text-slate-300">
                  <i class="fas fa-folder-tree text-slate-300 dark:text-slate-600 mr-1.5"></i>Casos activos
                </label>
                <span class="text-[13px] font-black text-primary-500 min-w-[3rem] text-right">{{ inputs.cases }}</span>
              </div>
              <input type="range" v-model.number="inputs.cases" min="0" max="1000" step="5" class="slider slider-violet w-full" />
              <div class="flex justify-between text-[8px] text-slate-300 dark:text-slate-600 mt-0.5">
                <span>0</span><span>250</span><span>500</span><span>1K</span>
              </div>
            </div>

          </div>
        </div>

        <!-- Tech & Storage -->
        <div class="bg-white dark:bg-[#1e293b] border border-slate-100 dark:border-[#334155] rounded-2xl p-4">
          <p class="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-3">
            <i class="fas fa-server mr-1.5"></i>Tecnología & Almacenamiento
          </p>
          <div class="space-y-4">

            <!-- AI Intensity -->
            <div>
              <label class="text-[11px] font-black text-slate-600 dark:text-slate-300 block mb-2">
                <i class="fas fa-wand-magic-sparkles text-slate-300 dark:text-slate-600 mr-1.5"></i>Intensidad de IA / Analytics
              </label>
              <div class="grid grid-cols-3 gap-1.5">
                <button
                  v-for="opt in aiOptions" :key="opt.value"
                  @click="inputs.aiIntensity = opt.value"
                  :class="[
                    'py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all',
                    inputs.aiIntensity === opt.value
                      ? 'bg-emerald-50 dark:bg-emerald-500/15 border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                      : 'bg-slate-50 dark:bg-[#0f172a] border-slate-100 dark:border-[#334155] text-slate-400 hover:border-slate-200'
                  ]"
                >
                  {{ opt.label }}
                </button>
              </div>
            </div>

            <!-- Storage -->
            <div>
              <div class="flex justify-between items-center mb-1.5">
                <label class="text-[11px] font-black text-slate-600 dark:text-slate-300">
                  <i class="fas fa-database text-slate-300 dark:text-slate-600 mr-1.5"></i>Almacenamiento archivos (GB)
                </label>
                <span class="text-[13px] font-black text-emerald-500 min-w-[3rem] text-right">{{ inputs.storageGB }} GB</span>
              </div>
              <input type="range" v-model.number="inputs.storageGB" min="0" max="500" step="5" class="slider slider-emerald w-full" />
              <div class="flex justify-between text-[8px] text-slate-300 dark:text-slate-600 mt-0.5">
                <span>0</span><span>125</span><span>250</span><span>500 GB</span>
              </div>
            </div>

          </div>
        </div>

        <!-- Clients on platform -->
        <div class="bg-white dark:bg-[#1e293b] border border-slate-100 dark:border-[#334155] rounded-2xl p-4">
          <p class="text-[9px] font-black uppercase tracking-[0.2em] text-amber-400 mb-3">
            <i class="fas fa-layer-group mr-1.5"></i>Escala de la Plataforma
          </p>
          <div>
            <div class="flex justify-between items-center mb-1.5">
              <label class="text-[11px] font-black text-slate-600 dark:text-slate-300">
                <i class="fas fa-sitemap text-slate-300 dark:text-slate-600 mr-1.5"></i>Clientes en la plataforma (total)
              </label>
              <span class="text-[13px] font-black text-amber-500 min-w-[2rem] text-right">{{ inputs.totalClients }}</span>
            </div>
            <input type="range" v-model.number="inputs.totalClients" min="1" max="100" step="1" class="slider slider-amber w-full" />
            <div class="flex justify-between text-[8px] text-slate-300 dark:text-slate-600 mt-0.5">
              <span>1</span><span>25</span><span>50</span><span>100</span>
            </div>
            <p class="text-[9px] text-slate-400 dark:text-slate-500 mt-2 italic">
              Cuántos clientes de este perfil tienen el CRM contratado simultáneamente
            </p>
          </div>
        </div>

      </div>

      <!-- RIGHT: Results -->
      <div class="xl:col-span-3 space-y-3">

        <!-- Tier Badge + Score -->
        <div
          class="rounded-2xl p-5 border relative overflow-hidden"
          :class="tierStyle.bg"
        >
          <div class="absolute inset-0 opacity-5" :class="tierStyle.pattern"></div>
          <div class="relative z-10 flex items-start justify-between">
            <div>
              <p class="text-[9px] font-black uppercase tracking-[0.25em] opacity-70 mb-1" :class="tierStyle.textMuted">Tier Recomendado</p>
              <h2 class="text-[28px] font-black leading-none" :class="tierStyle.text">{{ tier.name }}</h2>
              <p class="text-[11px] mt-1 font-medium opacity-75" :class="tierStyle.textMuted">{{ tier.description }}</p>
            </div>
            <div class="text-right">
              <p class="text-[9px] font-black uppercase tracking-[0.2em] opacity-70 mb-1" :class="tierStyle.textMuted">Peso estimado</p>
              <div class="flex items-end gap-1">
                <span class="text-[36px] font-black leading-none" :class="tierStyle.text">{{ score }}</span>
                <span class="text-[13px] font-black opacity-50 mb-1" :class="tierStyle.textMuted">/100+</span>
              </div>
            </div>
          </div>

          <!-- Score bar -->
          <div class="mt-4 bg-black/10 rounded-full h-1.5 overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="tierStyle.bar"
              :style="{ width: Math.min(score, 120) / 120 * 100 + '%' }"
            ></div>
          </div>
          <div class="flex justify-between text-[7px] font-black uppercase tracking-widest opacity-40 mt-1" :class="tierStyle.textMuted">
            <span>Starter</span><span>Growth</span><span>Pro</span><span>Enterprise</span>
          </div>
        </div>

        <!-- Cost Breakdown -->
        <div class="grid grid-cols-2 gap-3">

          <!-- Oracle Infrastructure -->
          <div class="bg-white dark:bg-[#1e293b] border border-slate-100 dark:border-[#334155] rounded-2xl p-4">
            <p class="text-[9px] font-black uppercase tracking-[0.2em] text-orange-400 mb-3">
              <i class="fas fa-cloud mr-1.5"></i>Oracle Cloud / mes
            </p>
            <div class="space-y-2">
              <div v-for="item in oracleCosts" :key="item.label" class="flex justify-between items-center">
                <div>
                  <p class="text-[10px] font-black text-slate-600 dark:text-slate-300">{{ item.label }}</p>
                  <p class="text-[8px] text-slate-300 dark:text-slate-600">{{ item.spec }}</p>
                </div>
                <span
                  class="text-[11px] font-black"
                  :class="item.cost === 0 ? 'text-emerald-500' : 'text-slate-700 dark:text-slate-200'"
                >
                  {{ item.cost === 0 ? 'Gratis' : '$' + item.cost.toFixed(2) }}
                </span>
              </div>
              <div class="border-t border-slate-100 dark:border-[#334155] pt-2 flex justify-between items-center">
                <span class="text-[10px] font-black text-slate-500 dark:text-slate-400">Total infra / mes</span>
                <span class="text-[14px] font-black text-orange-500">${{ totalOracleCost.toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <!-- Per-client cost -->
          <div class="bg-white dark:bg-[#1e293b] border border-slate-100 dark:border-[#334155] rounded-2xl p-4">
            <p class="text-[9px] font-black uppercase tracking-[0.2em] text-primary-400 mb-3">
              <i class="fas fa-user-tag mr-1.5"></i>Costo por cliente
            </p>
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <div>
                  <p class="text-[10px] font-black text-slate-600 dark:text-slate-300">Infra proporcional</p>
                  <p class="text-[8px] text-slate-300 dark:text-slate-600">{{ inputs.totalClients }} clientes compartiendo</p>
                </div>
                <span class="text-[11px] font-black text-slate-700 dark:text-slate-200">${{ perClientInfra.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <div>
                  <p class="text-[10px] font-black text-slate-600 dark:text-slate-300">IA / Analytics</p>
                  <p class="text-[8px] text-slate-300 dark:text-slate-600">OpenAI GPT-4o mini</p>
                </div>
                <span class="text-[11px] font-black text-slate-700 dark:text-slate-200">${{ aiCostPerClient.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <div>
                  <p class="text-[10px] font-black text-slate-600 dark:text-slate-300">Email notificaciones</p>
                  <p class="text-[8px] text-slate-300 dark:text-slate-600">SendGrid</p>
                </div>
                <span class="text-[11px] font-black text-slate-700 dark:text-slate-200">${{ emailCost.toFixed(2) }}</span>
              </div>
              <div class="border-t border-slate-100 dark:border-[#334155] pt-2 flex justify-between items-center">
                <span class="text-[10px] font-black text-slate-500 dark:text-slate-400">Costo total/cliente</span>
                <span class="text-[14px] font-black text-primary-500">${{ totalCostPerClient.toFixed(2) }}</span>
              </div>
            </div>
          </div>

        </div>

        <!-- Pricing Recommendation -->
        <div class="bg-white dark:bg-[#1e293b] border border-slate-100 dark:border-[#334155] rounded-2xl p-4">
          <p class="text-[9px] font-black uppercase tracking-[0.2em] text-primary-400 mb-3">
            <i class="fas fa-tag mr-1.5"></i>Precio Sugerido al Cliente
          </p>
          <div class="grid grid-cols-3 gap-2">
            <div
              v-for="plan in pricingPlans" :key="plan.label"
              :class="[
                'rounded-xl p-3 border text-center cursor-pointer transition-all',
                selectedPlan === plan.label
                  ? 'bg-primary-50 dark:bg-primary-500/15 border-primary-200 dark:border-primary-500/40 ring-1 ring-primary-300 dark:ring-primary-500/30'
                  : 'bg-slate-50 dark:bg-[#0f172a] border-slate-100 dark:border-[#334155] hover:border-slate-200 dark:hover:border-[#475569]'
              ]"
              @click="selectedPlan = plan.label"
            >
              <p class="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">{{ plan.label }}</p>
              <p class="text-[20px] font-black leading-none" :class="selectedPlan === plan.label ? 'text-primary-600 dark:text-primary-400' : 'text-slate-700 dark:text-slate-200'">${{ plan.price }}</p>
              <p class="text-[8px] text-slate-400 mt-0.5">/mes</p>
              <div class="mt-2 pt-2 border-t border-slate-100 dark:border-[#334155]">
                <p class="text-[8px] font-black" :class="plan.margin > 70 ? 'text-emerald-500' : plan.margin > 50 ? 'text-amber-500' : 'text-rose-500'">
                  {{ plan.margin }}% margen
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Break-even & Profitability -->
        <div class="bg-white dark:bg-[#1e293b] border border-slate-100 dark:border-[#334155] rounded-2xl p-4">
          <p class="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-3">
            <i class="fas fa-chart-line mr-1.5"></i>Análisis de Rentabilidad
          </p>

          <div class="grid grid-cols-4 gap-2 mb-4">
            <div class="text-center p-2.5 rounded-xl bg-slate-50 dark:bg-[#0f172a] border border-slate-100 dark:border-[#334155]">
              <p class="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Punto de equilibrio</p>
              <p class="text-[20px] font-black text-slate-800 dark:text-slate-100 leading-none">{{ breakEven }}</p>
              <p class="text-[8px] text-slate-400">clientes</p>
            </div>
            <div class="text-center p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
              <p class="text-[8px] font-black uppercase tracking-widest text-emerald-400 mb-1">Con {{ inputs.totalClients }} clientes</p>
              <p class="text-[20px] font-black text-emerald-600 dark:text-emerald-400 leading-none">${{ monthlyRevenue.toLocaleString() }}</p>
              <p class="text-[8px] text-emerald-400">ingresos/mes</p>
            </div>
            <div class="text-center p-2.5 rounded-xl bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20">
              <p class="text-[8px] font-black uppercase tracking-widest text-primary-400 mb-1">Margen bruto</p>
              <p class="text-[20px] font-black text-primary-600 dark:text-primary-400 leading-none">${{ monthlyProfit.toLocaleString() }}</p>
              <p class="text-[8px] text-primary-400">/mes</p>
            </div>
            <div class="text-center p-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20">
              <p class="text-[8px] font-black uppercase tracking-widest text-amber-400 mb-1">Año 1 proyectado</p>
              <p class="text-[20px] font-black text-amber-600 dark:text-amber-400 leading-none">${{ (monthlyProfit * 12).toLocaleString() }}</p>
              <p class="text-[8px] text-amber-400">utilidad</p>
            </div>
          </div>

          <!-- Profitability bars -->
          <div class="space-y-2">
            <div v-for="n in profitabilitySteps" :key="n.clients" class="flex items-center gap-2">
              <span class="text-[9px] font-black text-slate-400 dark:text-slate-500 w-20 shrink-0">{{ n.clients }} clientes</span>
              <div class="flex-1 bg-slate-100 dark:bg-[#0f172a] rounded-full h-1.5 overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-700"
                  :class="n.profit > 0 ? 'bg-emerald-400' : 'bg-rose-300 dark:bg-rose-500/50'"
                  :style="{ width: Math.min(Math.abs(n.profit) / (selectedPriceValue * 20) * 100, 100) + '%' }"
                ></div>
              </div>
              <span
                class="text-[9px] font-black w-20 text-right shrink-0"
                :class="n.profit > 0 ? 'text-emerald-500' : 'text-rose-400'"
              >
                {{ n.profit > 0 ? '+' : '' }}${{ n.profit.toLocaleString() }}/mes
              </span>
            </div>
          </div>
        </div>

        <!-- Oracle Free Tier Status -->
        <div
          class="rounded-2xl p-4 border"
          :class="onFreeTier ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20' : 'bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20'"
        >
          <div class="flex items-start gap-3">
            <div
              class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
              :class="onFreeTier ? 'bg-emerald-100 dark:bg-emerald-500/20' : 'bg-amber-100 dark:bg-amber-500/20'"
            >
              <i
                class="text-[13px]"
                :class="onFreeTier ? 'fas fa-circle-check text-emerald-500' : 'fas fa-triangle-exclamation text-amber-500'"
              ></i>
            </div>
            <div class="flex-1">
              <p class="text-[11px] font-black" :class="onFreeTier ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'">
                {{ onFreeTier ? '✓ Este perfil cabe en el Free Tier de Oracle' : '⚡ Requiere instancias de pago en Oracle Cloud' }}
              </p>
              <p class="text-[9px] mt-0.5" :class="onFreeTier ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'">
                {{ freeTierMessage }}
              </p>
            </div>
            <div class="text-right shrink-0">
              <p class="text-[9px] font-black uppercase tracking-widest" :class="onFreeTier ? 'text-emerald-400' : 'text-amber-400'">RAM estimada</p>
              <p class="text-[16px] font-black" :class="onFreeTier ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'">{{ estimatedRAM }} GB</p>
              <p class="text-[8px]" :class="onFreeTier ? 'text-emerald-400' : 'text-amber-400'">de 24 GB gratis</p>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Full Summary Card -->
    <div class="bg-white dark:bg-[#1e293b] border border-slate-100 dark:border-[#334155] rounded-2xl p-5">
      <p class="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
        <i class="fas fa-file-invoice-dollar mr-1.5"></i>Resumen Exportable — Para usar en propuestas comerciales
      </p>
      <div class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3">
        <div class="text-center">
          <p class="text-[8px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-600 mb-1">Tier</p>
          <p class="text-[13px] font-black" :class="tierStyle.text">{{ tier.name }}</p>
        </div>
        <div class="text-center">
          <p class="text-[8px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-600 mb-1">Usuarios</p>
          <p class="text-[13px] font-black text-slate-700 dark:text-slate-200">{{ inputs.users }}</p>
        </div>
        <div class="text-center">
          <p class="text-[8px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-600 mb-1">Registros</p>
          <p class="text-[13px] font-black text-slate-700 dark:text-slate-200">{{ inputs.records.toLocaleString() }}</p>
        </div>
        <div class="text-center">
          <p class="text-[8px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-600 mb-1">Costo Infra</p>
          <p class="text-[13px] font-black text-orange-500">${{ totalOracleCost.toFixed(0) }}/mes</p>
        </div>
        <div class="text-center">
          <p class="text-[8px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-600 mb-1">Costo/cliente</p>
          <p class="text-[13px] font-black text-primary-500">${{ totalCostPerClient.toFixed(2) }}/mes</p>
        </div>
        <div class="text-center">
          <p class="text-[8px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-600 mb-1">Precio sugerido</p>
          <p class="text-[13px] font-black text-primary-500">${{ selectedPriceValue }}/mes</p>
        </div>
        <div class="text-center">
          <p class="text-[8px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-600 mb-1">Margen</p>
          <p class="text-[13px] font-black" :class="selectedMargin > 70 ? 'text-emerald-500' : selectedMargin > 50 ? 'text-amber-500' : 'text-rose-500'">
            {{ selectedMargin }}%
          </p>
        </div>
      </div>
    </div>

    <!-- ══ COMPARATIVA CON OTROS CRM ══════════════════════════════════ -->
    <div class="space-y-3">

      <!-- Header comparativa -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-[16px] font-black text-slate-800 dark:text-slate-100">Comparativa de Mercado</h2>
          <p class="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
            Precio calculado para <span class="font-black text-primary-400">{{ inputs.users }} usuarios</span> con el perfil actual · Todos los precios en USD/mes
          </p>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span>
          <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">GEMS más barato</span>
          <span class="w-3 h-3 rounded-full bg-rose-400 inline-block ml-2"></span>
          <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Competidor más barato</span>
        </div>
      </div>

      <!-- Cards grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        <div
          v-for="crm in competitors" :key="crm.name"
          class="bg-white dark:bg-[#1e293b] border rounded-2xl overflow-hidden transition-all"
          :class="crm.isGems
            ? 'border-primary-200 dark:border-primary-500/40 ring-2 ring-primary-100 dark:ring-primary-500/20'
            : 'border-slate-100 dark:border-[#334155]'"
        >
          <!-- CRM header -->
          <div
            class="px-4 py-3 flex items-center justify-between"
            :class="crm.isGems ? 'bg-primary-50 dark:bg-primary-500/10' : 'bg-slate-50 dark:bg-[#0f172a]'"
          >
            <div class="flex items-center gap-2">
              <div
                class="w-7 h-7 rounded-lg flex items-center justify-center text-[11px]"
                :style="{ background: crm.color + '20', color: crm.color }"
              >
                <i :class="crm.icon"></i>
              </div>
              <div>
                <p class="text-[11px] font-black" :class="crm.isGems ? 'text-primary-700 dark:text-primary-300' : 'text-slate-700 dark:text-slate-200'">
                  {{ crm.name }}
                </p>
                <p class="text-[8px] text-slate-400">{{ crm.tagline }}</p>
              </div>
            </div>
            <span
              v-if="crm.isGems"
              class="text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400"
            >TÚ</span>
          </div>

          <!-- Pricing tiers -->
          <div class="p-4 space-y-2">
            <div
              v-for="plan in crm.plans" :key="plan.name"
              class="flex items-center justify-between py-1.5 border-b border-slate-50 dark:border-[#334155] last:border-0"
            >
              <div>
                <p class="text-[10px] font-black text-slate-600 dark:text-slate-300">{{ plan.name }}</p>
                <p class="text-[8px] text-slate-300 dark:text-slate-600">{{ plan.note }}</p>
              </div>
              <div class="text-right">
                <p
                  class="text-[13px] font-black"
                  :class="plan.highlighted
                    ? (crm.isGems ? 'text-primary-500' : 'text-slate-800 dark:text-slate-100')
                    : 'text-slate-500 dark:text-slate-400'"
                >
                  ${{ plan.price(inputs.users) }}
                </p>
                <p class="text-[7px] text-slate-300 dark:text-slate-600">/mes</p>
              </div>
            </div>
          </div>

          <!-- Savings badge -->
          <div
            v-if="!crm.isGems"
            class="px-4 pb-3"
          >
            <div
              class="rounded-xl p-2 text-center"
              :class="savingsVsGems(crm) > 0
                ? 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20'
                : 'bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20'"
            >
              <p
                class="text-[9px] font-black"
                :class="savingsVsGems(crm) > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'"
              >
                <template v-if="savingsVsGems(crm) > 0">
                  💰 GEMS ahorra ${{ savingsVsGems(crm) }}/mes
                </template>
                <template v-else>
                  ⚡ {{ crm.name }} es ${{ Math.abs(savingsVsGems(crm)) }} más barato
                </template>
              </p>
              <p class="text-[8px] text-slate-400 mt-0.5">vs plan equivalente de GEMS</p>
            </div>
          </div>

          <!-- Features -->
          <div class="px-4 pb-4 space-y-1">
            <p class="text-[8px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-600 mb-2">Incluye</p>
            <div v-for="feat in crm.features" :key="feat.label" class="flex items-center gap-2">
              <i
                class="text-[9px] w-3 text-center"
                :class="feat.included ? 'fas fa-check text-emerald-400' : 'fas fa-xmark text-slate-200 dark:text-slate-700'"
              ></i>
              <span
                class="text-[9px]"
                :class="feat.included ? 'text-slate-600 dark:text-slate-300' : 'text-slate-300 dark:text-slate-600'"
              >{{ feat.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Feature matrix table -->
      <div class="bg-white dark:bg-[#1e293b] border border-slate-100 dark:border-[#334155] rounded-2xl overflow-hidden">
        <div class="px-5 py-3 border-b border-slate-100 dark:border-[#334155] flex items-center justify-between">
          <p class="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
            <i class="fas fa-table-list mr-1.5"></i>Matriz de Características
          </p>
          <p class="text-[9px] text-slate-300 dark:text-slate-600">Plan equivalente · {{ inputs.users }} usuarios</p>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-[10px]">
            <thead>
              <tr class="bg-slate-50 dark:bg-[#0f172a]">
                <th class="text-left px-4 py-2.5 font-black text-slate-500 dark:text-slate-400 w-44">Característica</th>
                <th
                  v-for="crm in competitors" :key="crm.name"
                  class="px-3 py-2.5 font-black text-center"
                  :class="crm.isGems ? 'text-primary-500' : 'text-slate-500 dark:text-slate-400'"
                >
                  {{ crm.name }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(feat, i) in featureMatrix" :key="feat.label"
                :class="i % 2 === 0 ? 'bg-white dark:bg-[#1e293b]' : 'bg-slate-50/50 dark:bg-[#0f172a]/60'"
              >
                <td class="px-4 py-2 font-black text-slate-600 dark:text-slate-300">{{ feat.label }}</td>
                <td
                  v-for="crm in competitors" :key="crm.name"
                  class="px-3 py-2 text-center"
                >
                  <template v-if="typeof feat.values[crm.key] === 'boolean'">
                    <i
                      class="text-[11px]"
                      :class="feat.values[crm.key] ? 'fas fa-check text-emerald-400' : 'fas fa-xmark text-slate-200 dark:text-slate-700'"
                    ></i>
                  </template>
                  <template v-else>
                    <span
                      class="text-[9px] font-black"
                      :class="crm.isGems ? 'text-primary-500' : 'text-slate-500 dark:text-slate-400'"
                    >{{ feat.values[crm.key] }}</span>
                  </template>
                </td>
              </tr>
              <!-- Price row -->
              <tr class="bg-primary-50/50 dark:bg-primary-500/5 border-t-2 border-primary-100 dark:border-primary-500/20">
                <td class="px-4 py-3 font-black text-slate-700 dark:text-slate-200">Precio / mes ({{ inputs.users }} users)</td>
                <td
                  v-for="crm in competitors" :key="crm.name"
                  class="px-3 py-3 text-center"
                >
                  <span
                    class="text-[13px] font-black"
                    :class="crm.isGems ? 'text-primary-500' : 'text-slate-700 dark:text-slate-200'"
                  >
                    ${{ crm.plans.find(p => p.highlighted)?.price(inputs.users) ?? '—' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Bottom insight -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-3">
        <div class="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl p-4 flex items-start gap-3">
          <div class="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center shrink-0">
            <i class="fas fa-piggy-bank text-emerald-500 text-[13px]"></i>
          </div>
          <div>
            <p class="text-[11px] font-black text-emerald-700 dark:text-emerald-300">Ahorro vs HubSpot Professional</p>
            <p class="text-[22px] font-black text-emerald-600 dark:text-emerald-400 leading-tight">
              ${{ Math.max(0, competitors.find(c=>c.key==='hubspot')?.plans.find(p=>p.highlighted)?.price(inputs.users) ?? 0) - selectedPriceValue }}<span class="text-[11px]">/mes</span>
            </p>
            <p class="text-[9px] text-emerald-500 mt-0.5">= ${{ (Math.max(0, (competitors.find(c=>c.key==='hubspot')?.plans.find(p=>p.highlighted)?.price(inputs.users) ?? 0) - selectedPriceValue) * 12).toLocaleString() }} al año</p>
          </div>
        </div>
        <div class="bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20 rounded-2xl p-4 flex items-start gap-3">
          <div class="w-8 h-8 rounded-xl bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center shrink-0">
            <i class="fas fa-trophy text-primary-500 text-[13px]"></i>
          </div>
          <div>
            <p class="text-[11px] font-black text-primary-700 dark:text-primary-300">Ahorro vs Salesforce Professional</p>
            <p class="text-[22px] font-black text-primary-600 dark:text-primary-400 leading-tight">
              ${{ Math.max(0, competitors.find(c=>c.key==='salesforce')?.plans.find(p=>p.highlighted)?.price(inputs.users) ?? 0) - selectedPriceValue }}<span class="text-[11px]">/mes</span>
            </p>
            <p class="text-[9px] text-primary-500 mt-0.5">= ${{ (Math.max(0, (competitors.find(c=>c.key==='salesforce')?.plans.find(p=>p.highlighted)?.price(inputs.users) ?? 0) - selectedPriceValue) * 12).toLocaleString() }} al año</p>
          </div>
        </div>
        <div class="bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-2xl p-4 flex items-start gap-3">
          <div class="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center shrink-0">
            <i class="fas fa-fire text-amber-500 text-[13px]"></i>
          </div>
          <div>
            <p class="text-[11px] font-black text-amber-700 dark:text-amber-300">Posicionamiento de precio</p>
            <p class="text-[13px] font-black text-amber-600 dark:text-amber-400 leading-tight mt-1">
              {{ pricePositioning }}
            </p>
            <p class="text-[9px] text-amber-500 mt-0.5">vs {{ competitors.filter(c => !c.isGems).length }} competidores analizados</p>
          </div>
        </div>
      </div>

    </div>
    <!-- ══ FIN COMPARATIVA ══════════════════════════════════════════════ -->

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

// ── Inputs ──────────────────────────────────────────────────────────
const inputs = reactive({
  users: 10,
  records: 500,
  tasks: 1000,
  tickets: 50,
  cases: 20,
  aiIntensity: 2,
  storageGB: 10,
  totalClients: 5,
})

const aiOptions = [
  { label: 'Bajo', value: 1 },
  { label: 'Medio', value: 2 },
  { label: 'Alto', value: 3 },
]

const selectedPlan = ref('Growth')

const resetAll = () => {
  inputs.users = 10
  inputs.records = 500
  inputs.tasks = 1000
  inputs.tickets = 50
  inputs.cases = 20
  inputs.aiIntensity = 2
  inputs.storageGB = 10
  inputs.totalClients = 5
  selectedPlan.value = 'Growth'
}

// ── Score ────────────────────────────────────────────────────────────
const score = computed(() => {
  return Math.round(
    (inputs.users * 2.5) +
    (inputs.records / 80) +
    (inputs.tasks / 40) +
    (inputs.tickets / 15) +
    (inputs.cases / 8) +
    (inputs.aiIntensity * 7) +
    (inputs.storageGB * 1.5)
  )
})

// ── Tier ─────────────────────────────────────────────────────────────
const tier = computed(() => {
  const s = score.value
  if (s <= 25) return { name: 'Starter', description: 'Empresas pequeñas, equipos de 1-10 personas' }
  if (s <= 60) return { name: 'Growth', description: 'PYMEs en crecimiento, 10-30 usuarios activos' }
  if (s <= 120) return { name: 'Pro', description: 'Empresas medianas, uso intensivo de la plataforma' }
  return { name: 'Enterprise', description: 'Grandes equipos, volumen alto, SLA dedicado' }
})

const tierStyle = computed(() => {
  const t = tier.value.name
  if (t === 'Starter') return {
    bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20',
    text: 'text-emerald-600 dark:text-emerald-400',
    textMuted: 'text-emerald-700 dark:text-emerald-300',
    bar: 'bg-emerald-400',
    pattern: 'bg-emerald-200',
  }
  if (t === 'Growth') return {
    bg: 'bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20',
    text: 'text-blue-600 dark:text-blue-400',
    textMuted: 'text-blue-700 dark:text-blue-300',
    bar: 'bg-blue-400',
    pattern: 'bg-blue-200',
  }
  if (t === 'Pro') return {
    bg: 'bg-primary-50 dark:bg-primary-500/10 border-primary-100 dark:border-primary-500/20',
    text: 'text-primary-600 dark:text-primary-400',
    textMuted: 'text-primary-700 dark:text-primary-300',
    bar: 'bg-primary-400',
    pattern: 'bg-primary-200',
  }
  return {
    bg: 'bg-orange-50 dark:bg-orange-500/10 border-orange-100 dark:border-orange-500/20',
    text: 'text-orange-600 dark:text-orange-400',
    textMuted: 'text-orange-700 dark:text-orange-300',
    bar: 'bg-orange-400',
    pattern: 'bg-orange-200',
  }
})

// ── Oracle Cloud costs ──────────────────────────────────────────────
// Free tier: 4 OCPU ARM + 24GB RAM, 10TB egress, 10GB storage
// Beyond free: ARM $0.01/OCPU-hr, storage $0.0255/GB

const estimatedRAM = computed(() => {
  // ~150MB base + 50MB per user + 20MB per 1K records + 30MB per 1K tasks
  const mb = 200 + (inputs.users * 50) + (inputs.records / 1000 * 20) + (inputs.tasks / 1000 * 30) + (inputs.aiIntensity * 200)
  return Math.max(0.5, Math.round(mb / 1024 * 10) / 10)
})

const oracleCosts = computed(() => {
  const totalRAM = estimatedRAM.value * inputs.totalClients
  const needsExtraVM = totalRAM > 24

  // Storage cost: 10GB free, $0.0255/GB after
  const billableStorage = Math.max(0, inputs.storageGB * inputs.totalClients - 10)
  const storageCost = billableStorage * 0.0255

  // Compute: ARM free up to 24GB RAM / 4 OCPU
  // If exceed, need additional VMs at ~$0.01/OCPU-hr × 24hr × 30days per OCPU
  const extraRAM = Math.max(0, totalRAM - 24)
  const extraOCPUs = Math.ceil(extraRAM / 6) // ~6GB RAM per OCPU
  const computeCost = extraOCPUs > 0 ? extraOCPUs * 0.01 * 24 * 30 : 0

  // MongoDB Atlas: M0 free up to 512MB, M10 $57, M20 $185
  const totalRecords = inputs.records * inputs.totalClients
  const totalTasks = inputs.tasks * inputs.totalClients
  const dbMB = (totalRecords * 2 + totalTasks * 3) / 1000
  let atlasCost = 0
  let atlasSpec = 'M0 — 512MB gratis'
  if (dbMB > 20480) { atlasCost = 185; atlasSpec = 'M20 — 2GB RAM' }
  else if (dbMB > 512) { atlasCost = 57; atlasSpec = 'M10 — 2GB RAM' }

  // Egress: 10TB free, $0.0085/GB after — very unlikely to exceed
  const egressCost = 0

  return [
    {
      label: 'Compute (ARM A1)',
      spec: needsExtraVM ? `${estimatedRAM.value * inputs.totalClients}GB RAM total — extra VMs` : '4 OCPU / 24GB — free tier',
      cost: computeCost,
    },
    {
      label: 'MongoDB Atlas',
      spec: atlasSpec,
      cost: atlasCost,
    },
    {
      label: 'Object Storage',
      spec: `${Math.max(0, inputs.storageGB * inputs.totalClients - 10).toFixed(0)}GB billable`,
      cost: parseFloat(storageCost.toFixed(2)),
    },
    {
      label: 'Egress red',
      spec: '10TB/mes gratis',
      cost: egressCost,
    },
  ]
})

const totalOracleCost = computed(() => {
  return oracleCosts.value.reduce((sum, item) => sum + item.cost, 0)
})

const onFreeTier = computed(() => {
  return estimatedRAM.value * inputs.totalClients <= 24 &&
    oracleCosts.value.find(c => c.label === 'MongoDB Atlas')?.cost === 0
})

const freeTierMessage = computed(() => {
  if (onFreeTier.value) {
    return `${inputs.totalClients} clientes con este perfil caben en el ARM A1 gratuito (${(estimatedRAM.value * inputs.totalClients).toFixed(1)}GB de 24GB usados). Arrancarías con $0 de infraestructura.`
  }
  return `El volumen total supera los 24GB de RAM gratuitos (${(estimatedRAM.value * inputs.totalClients).toFixed(1)}GB estimados). Necesitarás instancias de pago.`
})

// ── AI & Email costs ─────────────────────────────────────────────────
const aiCostPerClient = computed(() => {
  // GPT-4o mini: ~$0.0005 per query, users × aiIntensity × 10 queries/day × 30
  const queriesPerMonth = inputs.users * inputs.aiIntensity * 10 * 30
  return parseFloat((queriesPerMonth * 0.0005).toFixed(2))
})

const emailCost = computed(() => {
  // SendGrid: 100/day free, $0.001 per email after
  const emailsPerMonth = inputs.users * 20 // ~20 notif emails/user/month
  const billable = Math.max(0, emailsPerMonth - 3000)
  return parseFloat((billable * 0.001).toFixed(2))
})

const perClientInfra = computed(() => {
  return parseFloat((totalOracleCost.value / inputs.totalClients).toFixed(2))
})

const totalCostPerClient = computed(() => {
  return parseFloat((perClientInfra.value + aiCostPerClient.value + emailCost.value).toFixed(2))
})

// ── Pricing plans ────────────────────────────────────────────────────
const pricingPlans = computed(() => {
  const cost = totalCostPerClient.value
  const base = Math.max(cost * 3, 20)

  const prices = [
    Math.max(Math.round(base * 1.5 / 5) * 5, 29),
    Math.max(Math.round(base * 2.5 / 5) * 5, 49),
    Math.max(Math.round(base * 4 / 5) * 5, 99),
  ]

  // Snap to standard SaaS prices
  const snap = (p: number) => {
    const standards = [29, 49, 79, 99, 149, 199, 299, 399, 499, 699, 899, 1200]
    return standards.reduce((prev, curr) => Math.abs(curr - p) < Math.abs(prev - p) ? curr : prev)
  }

  const labels = ['Conservador', 'Growth', 'Premium']
  return labels.map((label, i) => {
    const price = snap(prices[i])
    const margin = Math.round(((price - cost) / price) * 100)
    return { label, price, margin }
  })
})

const selectedPriceValue = computed(() => {
  return pricingPlans.value.find(p => p.label === selectedPlan.value)?.price ?? 99
})

const selectedMargin = computed(() => {
  return pricingPlans.value.find(p => p.label === selectedPlan.value)?.margin ?? 0
})

// ── Break-even & profitability ───────────────────────────────────────
const monthlyRevenue = computed(() => inputs.totalClients * selectedPriceValue.value)
const monthlyProfit = computed(() => monthlyRevenue.value - totalOracleCost.value - (aiCostPerClient.value + emailCost.value) * inputs.totalClients)

const breakEven = computed(() => {
  const fixedCosts = oracleCosts.value.find(c => c.label === 'MongoDB Atlas')?.cost ?? 0
  const varCost = perClientInfra.value + aiCostPerClient.value + emailCost.value
  const contribution = selectedPriceValue.value - varCost
  if (contribution <= 0) return '∞'
  return Math.ceil(fixedCosts / contribution)
})

const profitabilitySteps = computed(() => {
  const steps = [1, 3, 5, 10, 20, 50]
  const fixedCosts = oracleCosts.value.find(c => c.label === 'MongoDB Atlas')?.cost ?? 0
  const varCost = perClientInfra.value + aiCostPerClient.value + emailCost.value
  return steps.map(clients => ({
    clients,
    profit: Math.round(clients * selectedPriceValue.value - fixedCosts - clients * varCost),
  }))
})

// ── Competitors ──────────────────────────────────────────────────────
// Precios reales a mayo 2026 (USD/mes, facturación anual donde aplica)
const competitors = computed(() => [
  {
    key: 'gems',
    name: 'GEMS Hub',
    isGems: true,
    tagline: 'Tu plataforma · Oracle Cloud',
    color: '#6366f1',
    icon: 'fas fa-gem',
    plans: [
      { name: 'Starter',  note: 'hasta 5 users',        highlighted: false, price: (_u: number) => 49 },
      { name: 'Growth',   note: 'plan recomendado',      highlighted: true,  price: (_u: number) => selectedPriceValue.value },
      { name: 'Premium',  note: 'usuarios ilimitados',   highlighted: false, price: (_u: number) => pricingPlans.value[2]?.price ?? 299 },
    ],
    features: [
      { label: 'Precio fijo (no por usuario)', included: true },
      { label: 'IA nativa en dashboard',       included: true },
      { label: 'Tickets + Casos',              included: true },
      { label: 'Wiki / documentos',            included: true },
      { label: 'Personalización de marca',     included: true },
      { label: 'Modo oscuro',                  included: true },
    ],
  },
  {
    key: 'hubspot',
    name: 'HubSpot',
    isGems: false,
    tagline: 'Sales Hub · por usuario',
    color: '#ff7a59',
    icon: 'fas fa-h',
    plans: [
      { name: 'Free',         note: 'muy limitado',           highlighted: false, price: (_u: number) => 0 },
      { name: 'Starter',      note: '$15/user/mes (mín 2)',   highlighted: false, price: (u: number) => Math.max(u, 2) * 15 },
      { name: 'Professional', note: '$90/user/mes (mín 5)',   highlighted: true,  price: (u: number) => Math.max(u, 5) * 90 },
      { name: 'Enterprise',   note: '$150/user/mes (mín 10)', highlighted: false, price: (u: number) => Math.max(u, 10) * 150 },
    ],
    features: [
      { label: 'Precio fijo (no por usuario)', included: false },
      { label: 'IA nativa en dashboard',       included: true },
      { label: 'Tickets + Casos',              included: true },
      { label: 'Wiki / documentos',            included: false },
      { label: 'Personalización de marca',     included: true },
      { label: 'Modo oscuro',                  included: false },
    ],
  },
  {
    key: 'salesforce',
    name: 'Salesforce',
    isGems: false,
    tagline: 'Sales Cloud · por usuario',
    color: '#00a1e0',
    icon: 'fas fa-cloud',
    plans: [
      { name: 'Starter Suite', note: '$25/user/mes',  highlighted: false, price: (u: number) => u * 25 },
      { name: 'Professional',  note: '$80/user/mes',  highlighted: true,  price: (u: number) => u * 80 },
      { name: 'Enterprise',    note: '$165/user/mes', highlighted: false, price: (u: number) => u * 165 },
      { name: 'Unlimited',     note: '$330/user/mes', highlighted: false, price: (u: number) => u * 330 },
    ],
    features: [
      { label: 'Precio fijo (no por usuario)', included: false },
      { label: 'IA nativa en dashboard',       included: true },
      { label: 'Tickets + Casos',              included: true },
      { label: 'Wiki / documentos',            included: false },
      { label: 'Personalización de marca',     included: true },
      { label: 'Modo oscuro',                  included: false },
    ],
  },
  {
    key: 'zoho',
    name: 'Zoho CRM',
    isGems: false,
    tagline: 'Precio bajo · por usuario',
    color: '#e42527',
    icon: 'fas fa-z',
    plans: [
      { name: 'Free',         note: 'hasta 3 users',   highlighted: false, price: (_u: number) => 0 },
      { name: 'Standard',     note: '$14/user/mes',    highlighted: false, price: (u: number) => u * 14 },
      { name: 'Professional', note: '$23/user/mes',    highlighted: true,  price: (u: number) => u * 23 },
      { name: 'Enterprise',   note: '$40/user/mes',    highlighted: false, price: (u: number) => u * 40 },
    ],
    features: [
      { label: 'Precio fijo (no por usuario)', included: false },
      { label: 'IA nativa en dashboard',       included: true },
      { label: 'Tickets + Casos',              included: false },
      { label: 'Wiki / documentos',            included: false },
      { label: 'Personalización de marca',     included: true },
      { label: 'Modo oscuro',                  included: true },
    ],
  },
  {
    key: 'pipedrive',
    name: 'Pipedrive',
    isGems: false,
    tagline: 'Ventas simplificadas',
    color: '#1f9940',
    icon: 'fas fa-p',
    plans: [
      { name: 'Essential',     note: '$14/user/mes', highlighted: false, price: (u: number) => u * 14 },
      { name: 'Advanced',      note: '$34/user/mes', highlighted: false, price: (u: number) => u * 34 },
      { name: 'Professional',  note: '$49/user/mes', highlighted: true,  price: (u: number) => u * 49 },
      { name: 'Enterprise',    note: '$99/user/mes', highlighted: false, price: (u: number) => u * 99 },
    ],
    features: [
      { label: 'Precio fijo (no por usuario)', included: false },
      { label: 'IA nativa en dashboard',       included: true },
      { label: 'Tickets + Casos',              included: false },
      { label: 'Wiki / documentos',            included: false },
      { label: 'Personalización de marca',     included: false },
      { label: 'Modo oscuro',                  included: false },
    ],
  },
  {
    key: 'monday',
    name: 'Monday CRM',
    isGems: false,
    tagline: 'Work OS adaptado a ventas',
    color: '#f74a83',
    icon: 'fas fa-m',
    plans: [
      { name: 'Basic',      note: '$12/user/mes (mín 3)', highlighted: false, price: (u: number) => Math.max(u, 3) * 12 },
      { name: 'Standard',   note: '$17/user/mes',         highlighted: false, price: (u: number) => Math.max(u, 3) * 17 },
      { name: 'Pro',        note: '$28/user/mes',         highlighted: true,  price: (u: number) => Math.max(u, 3) * 28 },
      { name: 'Enterprise', note: 'precio custom',        highlighted: false, price: (_u: number) => 0 },
    ],
    features: [
      { label: 'Precio fijo (no por usuario)', included: false },
      { label: 'IA nativa en dashboard',       included: true },
      { label: 'Tickets + Casos',              included: false },
      { label: 'Wiki / documentos',            included: true },
      { label: 'Personalización de marca',     included: true },
      { label: 'Modo oscuro',                  included: false },
    ],
  },
  {
    key: 'freshsales',
    name: 'Freshsales',
    isGems: false,
    tagline: 'IA de Freddy · Freshworks',
    color: '#0a8643',
    icon: 'fas fa-f',
    plans: [
      { name: 'Free',       note: 'hasta 3 usuarios',  highlighted: false, price: (_u: number) => 0 },
      { name: 'Growth',     note: '$9/user/mes',       highlighted: false, price: (u: number) => u * 9 },
      { name: 'Pro',        note: '$39/user/mes',      highlighted: true,  price: (u: number) => u * 39 },
      { name: 'Enterprise', note: '$59/user/mes',      highlighted: false, price: (u: number) => u * 59 },
    ],
    features: [
      { label: 'Precio fijo (no por usuario)', included: false },
      { label: 'IA nativa en dashboard',       included: true },
      { label: 'Tickets + Casos',              included: false },
      { label: 'Wiki / documentos',            included: false },
      { label: 'Personalización de marca',     included: false },
      { label: 'Modo oscuro',                  included: false },
    ],
  },
  {
    key: 'bitrix',
    name: 'Bitrix24',
    isGems: false,
    tagline: 'Suite completa · flat pricing',
    color: '#d0242e',
    icon: 'fas fa-b',
    plans: [
      { name: 'Free',         note: 'ilimitados (muy básico)', highlighted: false, price: (_u: number) => 0 },
      { name: 'Basic',        note: '$49/mes hasta 5 users',   highlighted: false, price: (_u: number) => 49 },
      { name: 'Standard',     note: '$99/mes hasta 50 users',  highlighted: true,  price: (_u: number) => 99 },
      { name: 'Professional', note: '$199/mes hasta 100 users',highlighted: false, price: (_u: number) => 199 },
    ],
    features: [
      { label: 'Precio fijo (no por usuario)', included: true },
      { label: 'IA nativa en dashboard',       included: false },
      { label: 'Tickets + Casos',              included: true },
      { label: 'Wiki / documentos',            included: true },
      { label: 'Personalización de marca',     included: false },
      { label: 'Modo oscuro',                  included: false },
    ],
  },
])

// Feature matrix para la tabla comparativa
const featureMatrix = [
  {
    label: 'Precio flat (no /user)',
    values: { gems: true, hubspot: false, salesforce: false, zoho: false, pipedrive: false, monday: false, freshsales: false, bitrix: true },
  },
  {
    label: 'IA en dashboard',
    values: { gems: true, hubspot: true, salesforce: true, zoho: true, pipedrive: true, monday: true, freshsales: true, bitrix: false },
  },
  {
    label: 'Tickets de soporte',
    values: { gems: true, hubspot: true, salesforce: true, zoho: false, pipedrive: false, monday: false, freshsales: false, bitrix: true },
  },
  {
    label: 'Casos / expedientes',
    values: { gems: true, hubspot: true, salesforce: true, zoho: false, pipedrive: false, monday: false, freshsales: false, bitrix: false },
  },
  {
    label: 'Wiki / documentos',
    values: { gems: true, hubspot: false, salesforce: false, zoho: false, pipedrive: false, monday: true, freshsales: false, bitrix: true },
  },
  {
    label: 'White-label / marca',
    values: { gems: true, hubspot: true, salesforce: true, zoho: true, pipedrive: false, monday: true, freshsales: false, bitrix: false },
  },
  {
    label: 'Modo oscuro',
    values: { gems: true, hubspot: false, salesforce: false, zoho: true, pipedrive: false, monday: false, freshsales: false, bitrix: false },
  },
  {
    label: 'Soporte en español',
    values: { gems: true, hubspot: true, salesforce: true, zoho: true, pipedrive: true, monday: true, freshsales: false, bitrix: true },
  },
  {
    label: 'Setup rápido (<1 día)',
    values: { gems: true, hubspot: false, salesforce: false, zoho: true, pipedrive: true, monday: true, freshsales: true, bitrix: false },
  },
]

// Savings helper
const savingsVsGems = (crm: any) => {
  const competitorPrice = crm.plans.find((p: any) => p.highlighted)?.price(inputs.users) ?? 0
  return competitorPrice - selectedPriceValue.value
}

// Price positioning
const pricePositioning = computed(() => {
  const myPrice = selectedPriceValue.value
  const others = competitors.value
    .filter(c => !c.isGems)
    .map(c => c.plans.find((p: any) => p.highlighted)?.price(inputs.users) ?? 0)
    .filter(p => p > 0)
  const cheaper = others.filter(p => p < myPrice).length
  const total = others.length
  if (cheaper === 0) return 'Precio más competitivo del mercado'
  if (cheaper <= 2) return `Más económico que ${total - cheaper} de ${total} CRMs`
  if (cheaper <= Math.floor(total / 2)) return `En el rango económico del mercado`
  return `Precio mid-market competitivo`
})
</script>

<style scoped>
/* ── Range sliders ── */
.slider {
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  border-radius: 9999px;
  background: linear-gradient(to right, #6366f1 0%, #6366f1 var(--val, 50%), #e2e8f0 var(--val, 50%), #e2e8f0 100%);
  outline: none;
  cursor: pointer;
}
.dark .slider {
  background: linear-gradient(to right, #6366f1 0%, #6366f1 var(--val, 50%), #334155 var(--val, 50%), #334155 100%);
}
.slider-violet { background: linear-gradient(to right, var(--brand-accent) 0%, var(--brand-accent) var(--val, 50%), #e2e8f0 var(--val, 50%), #e2e8f0 100%); }
.dark .slider-violet { background: linear-gradient(to right, var(--brand-accent) 0%, var(--brand-accent) var(--val, 50%), #334155 var(--val, 50%), #334155 100%); }
.slider-emerald { background: linear-gradient(to right, #10b981 0%, #10b981 var(--val, 50%), #e2e8f0 var(--val, 50%), #e2e8f0 100%); }
.dark .slider-emerald { background: linear-gradient(to right, #10b981 0%, #10b981 var(--val, 50%), #334155 var(--val, 50%), #334155 100%); }
.slider-amber { background: linear-gradient(to right, #f59e0b 0%, #f59e0b var(--val, 50%), #e2e8f0 var(--val, 50%), #e2e8f0 100%); }
.dark .slider-amber { background: linear-gradient(to right, #f59e0b 0%, #f59e0b var(--val, 50%), #334155 var(--val, 50%), #334155 100%); }

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: white;
  border: 2px solid #6366f1;
  box-shadow: 0 1px 4px rgba(0,0,0,0.15);
  cursor: pointer;
  transition: transform 0.1s;
}
.slider::-webkit-slider-thumb:hover { transform: scale(1.2); }
.slider-violet::-webkit-slider-thumb { border-color: var(--brand-accent); }
.slider-emerald::-webkit-slider-thumb { border-color: #10b981; }
.slider-amber::-webkit-slider-thumb { border-color: #f59e0b; }

.slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: white;
  border: 2px solid #6366f1;
  cursor: pointer;
}
</style>
