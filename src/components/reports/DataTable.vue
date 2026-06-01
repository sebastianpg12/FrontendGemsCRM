<template>
  <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
    <div class="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
      <div>
        <h3 class="text-sm font-black text-slate-900 dark:text-white">{{ title }}</h3>
        <p v-if="subtitle" class="text-[11px] text-slate-400 font-medium mt-0.5">{{ subtitle }}</p>
      </div>
      <button
        v-if="rows.length"
        @click="exportCsv"
        class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        title="Exportar CSV"
      >
        <i class="fas fa-file-csv text-[11px]"></i>
        CSV
      </button>
    </div>
    <div class="overflow-x-auto">
      <table v-if="rows.length" class="w-full text-left text-xs">
        <thead class="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">
          <tr>
            <th v-for="c in columns" :key="c.key" class="px-5 py-2.5 font-bold" :class="c.align === 'right' ? 'text-right' : ''">
              {{ c.label }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
          <tr v-for="(row, i) in rows" :key="i" class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
            <td v-for="c in columns" :key="c.key" class="px-5 py-2.5 text-slate-700 dark:text-slate-200" :class="c.align === 'right' ? 'text-right tabular-nums' : ''">
              <slot :name="c.key" :row="row" :value="row[c.key]">
                {{ row[c.key] ?? '—' }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="px-5 py-10 text-center text-slate-400 text-xs">
        <i class="fas fa-inbox text-2xl mb-2 opacity-40"></i>
        <p>Sin registros para los filtros seleccionados.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Column { key: string; label: string; align?: 'left' | 'right' }
const props = defineProps<{ title: string; subtitle?: string; columns: Column[]; rows: Record<string, any>[] }>()

function exportCsv() {
  const header = props.columns.map(c => `"${c.label}"`).join(',')
  const lines = props.rows.map(r =>
    props.columns.map(c => {
      let v = r[c.key]
      if (v === null || v === undefined) v = ''
      else if (typeof v === 'object') v = JSON.stringify(v)
      const escaped = String(v).replace(/"/g, '""')
      return `"${escaped}"`
    }).join(',')
  )
  const csv = [header, ...lines].join('\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${props.title.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
</script>
