import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiMetric } from '../../models/financial.model';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="relative overflow-hidden bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 p-5 flex flex-col justify-between group"
    >
      <!-- Top subtle color accent line -->
      <div
        class="absolute top-0 left-0 right-0 h-1"
        [ngClass]="{
          'bg-gradient-to-r from-emerald-500 to-teal-400': metric.badgeColor === 'emerald',
          'bg-gradient-to-r from-sky-500 to-blue-600': metric.badgeColor === 'cyan',
          'bg-gradient-to-r from-blue-600 to-indigo-600': metric.badgeColor === 'blue',
          'bg-gradient-to-r from-amber-500 to-yellow-400': metric.badgeColor === 'amber',
          'bg-gradient-to-r from-rose-500 to-pink-500': metric.badgeColor === 'rose'
        }"
      ></div>

      <!-- Header: Title & Icon -->
      <div class="flex items-start justify-between gap-3">
        <div>
          <span class="text-[11px] font-bold tracking-wider uppercase text-slate-400">
            {{ metric.subtitle }}
          </span>
          <h3 class="text-base font-bold text-slate-800 tracking-tight group-hover:text-blue-900 transition-colors">
            {{ metric.title }}
          </h3>
        </div>

        <div
          class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
          [ngClass]="{
            'bg-emerald-50 text-emerald-600': metric.badgeColor === 'emerald',
            'bg-sky-50 text-sky-600': metric.badgeColor === 'cyan',
            'bg-blue-50 text-blue-700': metric.badgeColor === 'blue',
            'bg-amber-50 text-amber-600': metric.badgeColor === 'amber',
            'bg-rose-50 text-rose-600': metric.badgeColor === 'rose'
          }"
        >
          <!-- Dynamic SVG Icons based on Metric ID -->
          @switch (metric.id) {
            @case ('roe') {
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
            @case ('roa') {
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            @case ('margenNeto') {
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            @default {
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            }
          }
        </div>
      </div>

      <!-- Main Value 2025 -->
      <div class="mt-4 flex items-baseline justify-between">
        <div>
          <span class="text-3xl font-extrabold text-slate-900 tracking-tight">
            {{ formatValue(metric.value2025) }}
          </span>
          <span class="ml-1 text-sm font-semibold text-slate-500">{{ metric.unit }}</span>
          <span class="ml-2 text-xs font-medium text-slate-400">Gestión 2025</span>
        </div>

        <!-- Comparative vs 2024 pill -->
        <div
          class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
          [ngClass]="{
            'bg-emerald-100 text-emerald-800': metric.covenantMet,
            'bg-amber-100 text-amber-800': !metric.covenantMet
          }"
        >
          <span>2024: {{ formatValue(metric.value2024) }}{{ metric.unit }}</span>
        </div>
      </div>

      <!-- Covenant & Status section -->
      <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div class="flex items-center gap-1.5 text-slate-600 font-medium">
          <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>{{ metric.covenant }}</span>
        </div>

        <span
          class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold"
          [ngClass]="{
            'bg-emerald-50 text-emerald-700 border border-emerald-200': metric.covenantMet,
            'bg-rose-50 text-rose-700 border border-rose-200': !metric.covenantMet
          }"
        >
          @if (metric.covenantMet) {
            <svg class="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          } @else {
            <svg class="w-3 h-3 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          }
          {{ metric.statusText }}
        </span>
      </div>
    </div>
  `
})
export class KpiCardComponent {
  @Input({ required: true }) metric!: KpiMetric;

  formatValue(val: number): string {
    if (val === undefined || val === null || isNaN(val)) return '0.00';
    return val.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}
