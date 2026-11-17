import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancialReport, FinancialRatio } from '../../models/financial.model';

@Component({
  selector: 'app-financial-tables',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 md:p-6 transition-all">
      <!-- Section Navigation Tabs -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-5">
        <div>
          <h3 class="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span class="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-sky-100 text-sky-800">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            Detalle Analítico por Hojas de Trabajo
          </h3>
          <p class="text-xs text-slate-500 mt-0.5">
            Explora las 4 hojas extraídas directamente desde el archivo Excel
          </p>
        </div>

        <div class="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            (click)="activeSheetTab.set('ratios')"
            [class.bg-white]="activeSheetTab() === 'ratios'"
            [class.text-sky-900]="activeSheetTab() === 'ratios'"
            [class.shadow-xs]="activeSheetTab() === 'ratios'"
            [class.text-slate-600]="activeSheetTab() !== 'ratios'"
            class="px-3 py-1.5 rounded-lg transition-all"
          >
            Ratios & Covenants
          </button>
          <button
            type="button"
            (click)="activeSheetTab.set('vertical')"
            [class.bg-white]="activeSheetTab() === 'vertical'"
            [class.text-sky-900]="activeSheetTab() === 'vertical'"
            [class.shadow-xs]="activeSheetTab() === 'vertical'"
            [class.text-slate-600]="activeSheetTab() !== 'vertical'"
            class="px-3 py-1.5 rounded-lg transition-all"
          >
            Análisis Vertical
          </button>
          <button
            type="button"
            (click)="activeSheetTab.set('horizontal')"
            [class.bg-white]="activeSheetTab() === 'horizontal'"
            [class.text-sky-900]="activeSheetTab() === 'horizontal'"
            [class.shadow-xs]="activeSheetTab() === 'horizontal'"
            [class.text-slate-600]="activeSheetTab() !== 'horizontal'"
            class="px-3 py-1.5 rounded-lg transition-all"
          >
            Análisis Horizontal
          </button>
          <button
            type="button"
            (click)="activeSheetTab.set('statements')"
            [class.bg-white]="activeSheetTab() === 'statements'"
            [class.text-sky-900]="activeSheetTab() === 'statements'"
            [class.shadow-xs]="activeSheetTab() === 'statements'"
            [class.text-slate-600]="activeSheetTab() !== 'statements'"
            class="px-3 py-1.5 rounded-lg transition-all"
          >
            Estados Financieros
          </button>
        </div>
      </div>

      <!-- TAB 1: RATIOS & COVENANTS -->
      @if (activeSheetTab() === 'ratios') {
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 text-slate-700 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200">
              <tr>
                <th class="py-3 px-4">Categoría</th>
                <th class="py-3 px-4">Ratio Financiero</th>
                <th class="py-3 px-4">Fórmula Conceptual</th>
                <th class="py-3 px-4 text-right">Gestión 2025</th>
                <th class="py-3 px-4 text-right">Gestión 2024</th>
                <th class="py-3 px-4 text-center">Meta / Covenant</th>
                <th class="py-3 px-4">Interpretación Ejecutiva</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (ratio of report.ratios; track ratio.id) {
                <tr class="hover:bg-slate-50/80 transition-colors">
                  <td class="py-3 px-4">
                    <span
                      class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                      [ngClass]="{
                        'bg-sky-100 text-sky-800': ratio.category === 'LIQUIDEZ',
                        'bg-indigo-100 text-indigo-800': ratio.category === 'GESTIÓN',
                        'bg-amber-100 text-amber-800': ratio.category === 'SOLVENCIA',
                        'bg-emerald-100 text-emerald-800': ratio.category === 'RENTABILIDAD'
                      }"
                    >
                      {{ ratio.category }}
                    </span>
                  </td>
                  <td class="py-3 px-4 font-bold text-slate-800">
                    {{ ratio.name }}
                  </td>
                  <td class="py-3 px-4 text-slate-500 font-mono text-[11px]">
                    {{ ratio.formula }}
                  </td>
                  <td class="py-3 px-4 text-right font-extrabold text-slate-900">
                    {{ formatNumber(ratio.year2025) }} {{ ratio.unit }}
                  </td>
                  <td class="py-3 px-4 text-right text-slate-600 font-medium">
                    {{ formatNumber(ratio.year2024) }} {{ ratio.unit }}
                  </td>
                  <td class="py-3 px-4 text-center">
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <svg class="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {{ ratio.covenant || 'Referencial' }}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-slate-600 text-[11px] max-w-xs">
                    {{ ratio.interpretation }}
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      <!-- TAB 2: ANÁLISIS VERTICAL -->
      @if (activeSheetTab() === 'vertical') {
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 text-slate-700 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200">
              <tr>
                <th class="py-3 px-4">Estructura Patrimonial (Cuenta)</th>
                <th class="py-3 px-4 text-right">Dic. 2025 (Bs.)</th>
                <th class="py-3 px-4 text-right">% 2025</th>
                <th class="py-3 px-4 text-right">Dic. 2024 (Bs.)</th>
                <th class="py-3 px-4 text-right">% 2024</th>
                <th class="py-3 px-4 text-center">Estructura Gráfica</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (row of report.verticalAnalysisRows; track row.concept) {
                <tr
                  class="transition-colors"
                  [ngClass]="{
                    'bg-slate-100 font-extrabold text-slate-900': row.isTotal,
                    'bg-slate-50/60 font-bold text-slate-800': row.isSubtotal,
                    'text-slate-700 hover:bg-slate-50': !row.isTotal && !row.isSubtotal
                  }"
                >
                  <td class="py-2.5 px-4" [class.pl-8]="!row.isTotal && !row.isSubtotal">
                    {{ row.concept }}
                  </td>
                  <td class="py-2.5 px-4 text-right font-mono">
                    {{ formatNumber(row.year2025) }}
                  </td>
                  <td class="py-2.5 px-4 text-right font-bold text-sky-800">
                    {{ row.pct2025 ? row.pct2025.toFixed(2) + '%' : '-' }}
                  </td>
                  <td class="py-2.5 px-4 text-right font-mono text-slate-500">
                    {{ formatNumber(row.year2024) }}
                  </td>
                  <td class="py-2.5 px-4 text-right font-medium text-slate-600">
                    {{ row.pct2024 ? row.pct2024.toFixed(2) + '%' : '-' }}
                  </td>
                  <td class="py-2.5 px-4">
                    @if (row.pct2025) {
                      <div class="w-24 bg-slate-200 h-2 rounded-full overflow-hidden mx-auto">
                        <div class="bg-sky-600 h-2 rounded-full" [style.width.%]="row.pct2025"></div>
                      </div>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      <!-- TAB 3: ANÁLISIS HORIZONTAL -->
      @if (activeSheetTab() === 'horizontal') {
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 text-slate-700 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200">
              <tr>
                <th class="py-3 px-4">Descripción de Partida</th>
                <th class="py-3 px-4 text-right">Dic. 2025 (Bs.)</th>
                <th class="py-3 px-4 text-right">Dic. 2024 (Bs.)</th>
                <th class="py-3 px-4 text-right">Variación Absoluta (Bs.)</th>
                <th class="py-3 px-4 text-right">Variación Relativa (%)</th>
                <th class="py-3 px-4 text-center">Tendencia</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (row of report.horizontalAnalysisRows; track row.concept) {
                <tr
                  class="transition-colors"
                  [ngClass]="{
                    'bg-slate-100 font-extrabold text-slate-900': row.isTotal,
                    'bg-slate-50/60 font-bold text-slate-800': row.isSubtotal,
                    'text-slate-700 hover:bg-slate-50': !row.isTotal && !row.isSubtotal
                  }"
                >
                  <td class="py-2.5 px-4" [class.pl-8]="!row.isTotal && !row.isSubtotal">
                    {{ row.concept }}
                  </td>
                  <td class="py-2.5 px-4 text-right font-mono">
                    {{ formatNumber(row.year2025) }}
                  </td>
                  <td class="py-2.5 px-4 text-right font-mono text-slate-500">
                    {{ formatNumber(row.year2024) }}
                  </td>
                  <td class="py-2.5 px-4 text-right font-mono" [ngClass]="{
                    'text-emerald-700 font-bold': (row.absDiff || 0) > 0,
                    'text-rose-700 font-bold': (row.absDiff || 0) < 0
                  }">
                    {{ row.absDiff !== undefined ? (row.absDiff > 0 ? '+' : '') + formatNumber(row.absDiff) : '-' }}
                  </td>
                  <td class="py-2.5 px-4 text-right">
                    @if (row.relDiff !== undefined) {
                      <span
                        class="inline-block px-2 py-0.5 rounded font-bold text-[11px]"
                        [ngClass]="{
                          'bg-emerald-50 text-emerald-800': row.relDiff > 0,
                          'bg-rose-50 text-rose-800': row.relDiff < 0,
                          'bg-slate-100 text-slate-700': row.relDiff === 0
                        }"
                      >
                        {{ row.relDiff > 0 ? '+' : '' }}{{ row.relDiff.toFixed(2) }}%
                      </span>
                    } @else {
                      -
                    }
                  </td>
                  <td class="py-2.5 px-4 text-center">
                    @if ((row.relDiff || 0) > 0) {
                      <span class="text-emerald-600 font-bold">▲ Crecimiento</span>
                    } @else if ((row.relDiff || 0) < 0) {
                      <span class="text-rose-600 font-bold">▼ Contracción</span>
                    } @else {
                      <span class="text-slate-400 font-bold">▬ Estable</span>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      <!-- TAB 4: ESTADOS FINANCIEROS (BALANCE Y RESULTADOS) -->
      @if (activeSheetTab() === 'statements') {
        <div class="space-y-6">
          <!-- Balance General -->
          <div>
            <h4 class="text-sm font-bold text-slate-800 border-b border-slate-200 pb-2 mb-3 flex items-center justify-between">
              <span>Balance General (Estado de Situación Financiera)</span>
              <span class="text-xs font-normal text-slate-500">Expresado en Bolivianos (Bs.)</span>
            </h4>
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-50 text-slate-700 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200">
                  <tr>
                    <th class="py-2.5 px-4">Descripción de Cuenta</th>
                    <th class="py-2.5 px-4 text-right">Dic. 2025 (Bs.)</th>
                    <th class="py-2.5 px-4 text-right">Dic. 2024 (Bs.)</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  @for (row of report.balanceSheetRows; track row.concept) {
                    <tr
                      [ngClass]="{
                        'bg-sky-900 text-white font-black': row.isTotal,
                        'bg-slate-100 font-bold text-slate-900': row.isSubtotal,
                        'bg-slate-50 font-bold text-sky-950 uppercase': row.isHeader,
                        'text-slate-700 hover:bg-slate-50': !row.isTotal && !row.isSubtotal && !row.isHeader
                      }"
                    >
                      <td class="py-2 px-4" [style.paddingLeft.rem]="row.level ? row.level * 1.25 : 1">
                        {{ row.concept }}
                      </td>
                      <td class="py-2 px-4 text-right font-mono">
                        {{ row.year2025 ? formatNumber(row.year2025) : '' }}
                      </td>
                      <td class="py-2 px-4 text-right font-mono" [class.text-slate-300]="row.isTotal" [class.text-slate-500]="!row.isTotal">
                        {{ row.year2024 ? formatNumber(row.year2024) : '' }}
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>

          <!-- Estado de Resultados -->
          <div>
            <h4 class="text-sm font-bold text-slate-800 border-b border-slate-200 pb-2 mb-3 flex items-center justify-between">
              <span>Estado de Resultados (Pérdidas y Ganancias)</span>
              <span class="text-xs font-normal text-slate-500">Expresado en Bolivianos (Bs.)</span>
            </h4>
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-50 text-slate-700 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200">
                  <tr>
                    <th class="py-2.5 px-4">Partida de Resultados</th>
                    <th class="py-2.5 px-4 text-right">Dic. 2025 (Bs.)</th>
                    <th class="py-2.5 px-4 text-right">Dic. 2024 (Bs.)</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  @for (row of report.incomeStatementRows; track row.concept) {
                    <tr
                      [ngClass]="{
                        'bg-emerald-900 text-white font-black': row.isTotal,
                        'bg-slate-100 font-bold text-slate-900': row.isSubtotal,
                        'text-slate-700 hover:bg-slate-50': !row.isTotal && !row.isSubtotal
                      }"
                    >
                      <td class="py-2 px-4" [style.paddingLeft.rem]="row.level ? row.level * 1.25 : 1">
                        {{ row.concept }}
                      </td>
                      <td class="py-2 px-4 text-right font-mono">
                        {{ row.year2025 ? formatNumber(row.year2025) : '' }}
                      </td>
                      <td class="py-2 px-4 text-right font-mono" [class.text-emerald-200]="row.isTotal" [class.text-slate-500]="!row.isTotal">
                        {{ row.year2024 ? formatNumber(row.year2024) : '' }}
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class FinancialTablesComponent {
  @Input({ required: true }) report!: FinancialReport;

  protected readonly activeSheetTab = signal<'ratios' | 'vertical' | 'horizontal' | 'statements'>('ratios');

  formatNumber(val: number): string {
    if (val === undefined || val === null || isNaN(val)) return '0.00';
    return val.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}
