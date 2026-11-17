import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiCardData } from '../../models/financial.model';

@Component({
  selector: 'app-executive-ribbon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      
      <!-- ROW 1: BALANCE Y ESTADO DE RESULTADOS (8 CARDS) -->
      <div>
        <div class="flex items-center justify-between mb-2.5">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <h3 class="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800">
              Indicadores Clave · Balance y Estado de Resultados (Dic. 2025 vs. Dic. 2024)
            </h3>
          </div>
          <span class="text-[11px] text-slate-500 font-medium">Cifras en Bs. Millones</span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          @for (item of balanceIncomeKpis; track item.title) {
            <div
              (click)="selectedExplanation.set(item)"
              class="relative bg-white rounded-xl border border-slate-200 p-3 hover:border-sky-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">
                  {{ item.subtitle || 'Métrica' }}
                </span>
                <h4 class="text-xs font-bold text-slate-800 truncate group-hover:text-blue-900 transition-colors" [title]="item.title">
                  {{ item.title }}
                </h4>
              </div>

              <div class="my-2">
                <span class="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  {{ formatNumber(item.value2025) }}
                </span>
                <span class="ml-1 text-[11px] font-semibold text-slate-500">{{ item.unit }}</span>
              </div>

              <div class="pt-1.5 border-t border-slate-100 flex items-center justify-between">
                <span
                  class="text-[10px] font-bold rounded px-1.5 py-0.2"
                  [ngClass]="{
                    'text-emerald-700 bg-emerald-50': item.isPositive,
                    'text-amber-700 bg-amber-50': !item.isPositive
                  }"
                >
                  {{ item.diffText }}
                </span>

                <span class="text-slate-300 group-hover:text-sky-600 transition-colors" title="Ver explicación clara">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- ROW 2: RENTABILIDAD, EFICIENCIA, LIQUIDEZ Y SOLVENCIA (8 CARDS) -->
      <div>
        <div class="flex items-center justify-between mb-2.5">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <h3 class="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800">
              Indicadores Clave · Rentabilidad, Eficiencia, Liquidez y Solvencia
            </h3>
          </div>
          <span class="text-[11px] text-slate-500 font-medium">Metas & Covenants</span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          @for (item of ratioKpis; track item.title) {
            <div
              (click)="selectedExplanation.set(item)"
              class="relative bg-white rounded-xl border border-slate-200 p-3 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">
                  {{ item.subtitle || 'Ratio' }}
                </span>
                <h4 class="text-xs font-bold text-slate-800 truncate group-hover:text-emerald-900 transition-colors" [title]="item.title">
                  {{ item.title }}
                </h4>
              </div>

              <div class="my-2">
                <span class="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  {{ formatNumber(item.value2025) }}
                </span>
                <span class="ml-0.5 text-xs font-semibold text-slate-500">{{ item.unit }}</span>
              </div>

              <div class="pt-1.5 border-t border-slate-100 flex items-center justify-between">
                <span
                  class="text-[10px] font-bold rounded px-1.5 py-0.2"
                  [ngClass]="{
                    'text-emerald-700 bg-emerald-50': item.isPositive,
                    'text-amber-700 bg-amber-50': !item.isPositive
                  }"
                >
                  {{ item.diffText }}
                </span>

                @if (item.covenant) {
                  <span class="text-[9px] font-bold text-slate-500 bg-slate-100 px-1 py-0.2 rounded" [title]="item.covenant">
                    {{ item.statusText || 'OK' }}
                  </span>
                }
              </div>
            </div>
          }
        </div>
      </div>

      <!-- MODAL / DRAWER CON EXPLICACIÓN CLARA DEL INDICADOR SELECCIONADO -->
      @if (selectedExplanation(); as exp) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div class="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div class="flex items-center gap-2">
                <span class="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <div>
                  <h3 class="text-base font-bold text-slate-900">{{ exp.title }}</h3>
                  <p class="text-xs text-slate-500">{{ exp.subtitle }}</p>
                </div>
              </div>
              <button
                type="button"
                (click)="selectedExplanation.set(null)"
                class="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div class="mt-4 space-y-4">
              <!-- Values comparison box -->
              <div class="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span class="text-[10px] font-bold text-slate-400 uppercase">Gestión 2025</span>
                  <p class="text-xl font-black text-slate-900">{{ formatNumber(exp.value2025) }} {{ exp.unit }}</p>
                </div>
                <div>
                  <span class="text-[10px] font-bold text-slate-400 uppercase">Gestión 2024</span>
                  <p class="text-xl font-bold text-slate-600">{{ formatNumber(exp.value2024) }} {{ exp.unit }}</p>
                </div>
              </div>

              <!-- Clear Explanation -->
              <div>
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-sky-600"></span>
                  Explicación Financiera Clara
                </h4>
                <p class="text-xs text-slate-600 leading-relaxed bg-sky-50/50 p-3 rounded-xl border border-sky-100">
                  {{ exp.explanation }}
                </p>
              </div>

              @if (exp.covenant) {
                <div class="flex items-center justify-between text-xs p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
                  <span class="font-semibold">Meta Contractual / Covenant:</span>
                  <span class="font-mono font-bold">{{ exp.covenant }}</span>
                </div>
              }
            </div>

            <div class="mt-6 flex justify-end">
              <button
                type="button"
                (click)="selectedExplanation.set(null)"
                class="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class ExecutiveRibbonComponent {
  @Input({ required: true }) balanceIncomeKpis: KpiCardData[] = [];
  @Input({ required: true }) ratioKpis: KpiCardData[] = [];

  readonly selectedExplanation = signal<KpiCardData | null>(null);

  formatNumber(val: number): string {
    if (val === undefined || val === null || isNaN(val)) return '0.00';
    return val.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}
