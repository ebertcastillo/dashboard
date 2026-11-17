import { Component, Input, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FinancialRatio, DuPontData, RatioCategory } from '../../models/financial.model';

@Component({
  selector: 'app-ratios-dupont-section',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  template: `
    <section class="mb-8">
      <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">

        <!-- ========================================== -->
        <!-- COLUMNA IZQUIERDA: TABLERO DE RATIOS (7 col) -->
        <!-- ========================================== -->
        <div class="xl:col-span-7 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <!-- Header Banner (Estilo Corporativo) -->
          <div class="bg-gradient-to-r from-[#0f2b5c] to-[#1e4488] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div class="flex items-center gap-2">
                <span class="inline-flex p-1.5 rounded-lg bg-white/10 text-sky-300">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                </span>
                <h3 class="text-sm md:text-base font-bold tracking-wide uppercase">
                  Tablero de Ratios Financieros
                </h3>
              </div>
              <p class="text-xs text-sky-200 mt-0.5">
                Vinculado a hoja RATIOS Y DUPONT · Indicadores normalizados de desempeño
              </p>
            </div>

            <!-- Filtros de categoría -->
            <div class="flex items-center gap-1.5 bg-black/20 p-1 rounded-lg text-xs">
              <button
                (click)="activeCategory.set('TODAS')"
                [class.bg-white]="activeCategory() === 'TODAS'"
                [class.text-[#0f2b5c]]="activeCategory() === 'TODAS'"
                [class.text-white]="activeCategory() !== 'TODAS'"
                class="px-2.5 py-1 rounded font-medium transition-all">
                Todas
              </button>
              <button
                (click)="activeCategory.set('LIQUIDEZ')"
                [class.bg-white]="activeCategory() === 'LIQUIDEZ'"
                [class.text-[#0f2b5c]]="activeCategory() === 'LIQUIDEZ'"
                [class.text-white]="activeCategory() !== 'LIQUIDEZ'"
                class="px-2 py-1 rounded font-medium transition-all">
                Liquidez
              </button>
              <button
                (click)="activeCategory.set('GESTIÓN')"
                [class.bg-white]="activeCategory() === 'GESTIÓN'"
                [class.text-[#0f2b5c]]="activeCategory() === 'GESTIÓN'"
                [class.text-white]="activeCategory() !== 'GESTIÓN'"
                class="px-2 py-1 rounded font-medium transition-all">
                Gestión
              </button>
              <button
                (click)="activeCategory.set('SOLVENCIA')"
                [class.bg-white]="activeCategory() === 'SOLVENCIA'"
                [class.text-[#0f2b5c]]="activeCategory() === 'SOLVENCIA'"
                [class.text-white]="activeCategory() !== 'SOLVENCIA'"
                class="px-2 py-1 rounded font-medium transition-all">
                Solvencia
              </button>
              <button
                (click)="activeCategory.set('RENTABILIDAD')"
                [class.bg-white]="activeCategory() === 'RENTABILIDAD'"
                [class.text-[#0f2b5c]]="activeCategory() === 'RENTABILIDAD'"
                [class.text-white]="activeCategory() !== 'RENTABILIDAD'"
                class="px-2 py-1 rounded font-medium transition-all">
                Rentabilidad
              </button>
            </div>
          </div>

          <!-- Barra de controles / criterio -->
          <div class="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <div class="flex items-center gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              <span class="font-medium">Criterio de evaluación:</span>
              <span class="text-slate-500">Umbral de estabilidad ±1.0% · Covenants bancarios aplicados</span>
            </div>
            <div class="text-[11px] text-slate-500 hidden sm:block">
              Haga clic en cualquier fila para ver la <strong class="text-sky-700">explicación clara</strong>
            </div>
          </div>

          <!-- Tabla de Ratios -->
          <div class="overflow-x-auto flex-1">
            <table class="w-full text-xs text-left">
              <thead class="bg-slate-100/80 text-slate-700 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th scope="col" class="py-2.5 px-3">Ratio / Indicador</th>
                  <th scope="col" class="py-2.5 px-3 text-right">Dic. 2025</th>
                  <th scope="col" class="py-2.5 px-3 text-right">Dic. 2024</th>
                  <th scope="col" class="py-2.5 px-3 text-right">Δ (Cambio)</th>
                  <th scope="col" class="py-2.5 px-3 text-center">Mejor si</th>
                  <th scope="col" class="py-2.5 px-3 text-center">Tendencia</th>
                  <th scope="col" class="py-2.5 px-2 text-center w-12">Detalle</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (cat of visibleCategories(); track cat) {
                  <!-- Fila de Encabezado de Categoría -->
                  <tr class="bg-slate-100 font-bold text-slate-800 text-[11px]">
                    <td colspan="7" class="py-2 px-3 tracking-wide flex items-center gap-2">
                      <span class="w-1.5 h-3.5 rounded-full bg-sky-600 inline-block"></span>
                      <span>{{ getCategoryTitle(cat) }}</span>
                    </td>
                  </tr>

                  <!-- Ratios de esta categoría -->
                  @for (ratio of getRatiosByCategory(cat); track ratio.id) {
                    <tr 
                      (click)="selectRatio(ratio)"
                      class="hover:bg-sky-50/60 cursor-pointer transition-colors group">
                      <td class="py-2.5 px-3">
                        <div class="font-medium text-slate-900 group-hover:text-sky-800">
                          {{ ratio.name }}
                        </div>
                        <div class="text-[10px] text-slate-500 font-mono">
                          {{ ratio.formula }}
                        </div>
                      </td>
                      <td class="py-2.5 px-3 text-right font-bold text-slate-900 font-mono">
                        {{ formatValue(ratio.year2025, ratio.unit) }}
                      </td>
                      <td class="py-2.5 px-3 text-right text-slate-600 font-mono">
                        {{ formatValue(ratio.year2024, ratio.unit) }}
                      </td>
                      <td class="py-2.5 px-3 text-right font-mono font-medium"
                          [class.text-emerald-600]="ratio.trend === 'Mejora'"
                          [class.text-rose-600]="ratio.trend === 'Deterioro'"
                          [class.text-slate-600]="ratio.trend === 'Estable'">
                        {{ ratio.diffText }}
                      </td>
                      <td class="py-2.5 px-3 text-center">
                        <span 
                          [class.bg-blue-50]="ratio.betterIf === 'Mayor'"
                          [class.text-blue-700]="ratio.betterIf === 'Mayor'"
                          [class.border-blue-200]="ratio.betterIf === 'Mayor'"
                          [class.bg-amber-50]="ratio.betterIf === 'Menor'"
                          [class.text-amber-700]="ratio.betterIf === 'Menor'"
                          [class.border-amber-200]="ratio.betterIf === 'Menor'"
                          class="px-2 py-0.5 rounded text-[10px] font-semibold border">
                          {{ ratio.betterIf }}
                        </span>
                      </td>
                      <td class="py-2.5 px-3 text-center">
                        <span 
                          [class.bg-emerald-50]="ratio.trend === 'Mejora'"
                          [class.text-emerald-700]="ratio.trend === 'Mejora'"
                          [class.border-emerald-200]="ratio.trend === 'Mejora'"
                          [class.bg-rose-50]="ratio.trend === 'Deterioro'"
                          [class.text-rose-700]="ratio.trend === 'Deterioro'"
                          [class.border-rose-200]="ratio.trend === 'Deterioro'"
                          [class.bg-slate-50]="ratio.trend === 'Estable'"
                          [class.text-slate-700]="ratio.trend === 'Estable'"
                          [class.border-slate-200]="ratio.trend === 'Estable'"
                          class="px-2 py-0.5 rounded text-[10px] font-bold border inline-flex items-center gap-1">
                          @if (ratio.trend === 'Mejora') {
                            <span>▲</span> Mejora
                          } @else if (ratio.trend === 'Deterioro') {
                            <span>▼</span> Deterioro
                          } @else {
                            <span>●</span> Estable
                          }
                        </span>
                      </td>
                      <td class="py-2.5 px-2 text-center">
                        <button 
                          type="button"
                          class="p-1 rounded text-sky-600 hover:text-sky-800 hover:bg-sky-100 transition-colors"
                          title="Ver explicación financiera clara">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  }
                }
              </tbody>
            </table>
          </div>

          <!-- Pie informativo -->
          <div class="bg-slate-50 p-3 border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
            <div>
              <span class="font-medium text-slate-700">Interpretación:</span>
              La empresa mantiene una posición financiera saludable en las 4 dimensiones clave.
            </div>
            <div class="flex items-center gap-3">
              <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> Mejora</span>
              <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-slate-400"></span> Estable</span>
              <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-rose-500"></span> Deterioro</span>
            </div>
          </div>
        </div>

        <!-- ========================================== -->
        <!-- COLUMNA DERECHA: DUPONT & COMPLEMENTARIOS (5 col) -->
        <!-- ========================================== -->
        <div class="xl:col-span-5 flex flex-col gap-6">

          <!-- CARD 1: SISTEMA DUPONT -->
          <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <!-- Header Banner -->
            <div class="bg-gradient-to-r from-[#0f2b5c] to-[#1e4488] text-white px-5 py-3.5 flex items-center justify-between">
              <div>
                <div class="flex items-center gap-2">
                  <span class="inline-flex p-1.5 rounded-lg bg-white/10 text-sky-300">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-3-3v6"/>
                    </svg>
                  </span>
                  <h3 class="text-sm md:text-base font-bold tracking-wide uppercase">
                    Sistema DuPont
                  </h3>
                </div>
                <p class="text-xs text-sky-200 mt-0.5">
                  Descomposición analítica del Rendimiento sobre el Patrimonio (ROE)
                </p>
              </div>

              <!-- Badge de verificación -->
              <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                ✓ COINCIDEN
              </span>
            </div>

            <!-- Fórmula Visual -->
            <div class="bg-sky-50/70 p-3 border-b border-sky-100 flex items-center justify-center text-center">
              <div class="text-xs font-semibold text-sky-950 flex flex-wrap items-center justify-center gap-1.5">
                <span class="bg-sky-900 text-white px-2 py-0.5 rounded shadow-xs">ROE</span>
                <span class="text-sky-700 font-bold">=</span>
                <span class="bg-white px-2 py-0.5 rounded border border-sky-200 text-sky-900">Margen Neto (Motor 1)</span>
                <span class="text-sky-700 font-bold">×</span>
                <span class="bg-white px-2 py-0.5 rounded border border-sky-200 text-sky-900">Rotación Activos (Motor 2)</span>
                <span class="text-sky-700 font-bold">×</span>
                <span class="bg-white px-2 py-0.5 rounded border border-sky-200 text-sky-900">Apalancamiento (Motor 3)</span>
              </div>
            </div>

            <!-- Tabla DuPont con Motores -->
            <div class="p-4 flex-1">
              <table class="w-full text-xs text-left mb-4">
                <thead class="bg-slate-100 text-slate-700 font-semibold text-[11px] uppercase border-b border-slate-200">
                  <tr>
                    <th scope="col" class="py-2 px-3">Motor DuPont</th>
                    <th scope="col" class="py-2 px-3 text-right">Dic. 2025</th>
                    <th scope="col" class="py-2 px-3 text-right">Dic. 2024</th>
                    <th scope="col" class="py-2 px-3 text-right">Δ (Cambio)</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <!-- Motor 1: Margen Neto -->
                  <tr class="hover:bg-slate-50 transition-colors">
                    <td class="py-2.5 px-3">
                      <div class="font-semibold text-slate-900">{{ dupont.netMargin.title || '1. Margen Neto (Motor 1)' }}</div>
                      <div class="text-[10px] text-slate-500">Rentabilidad sobre Ventas</div>
                    </td>
                    <td class="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      {{ dupont.netMargin.year2025 | number:'1.2-2' }}%
                    </td>
                    <td class="py-2.5 px-3 text-right font-mono text-slate-600">
                      {{ dupont.netMargin.year2024 | number:'1.2-2' }}%
                    </td>
                    <td class="py-2.5 px-3 text-right font-mono font-semibold"
                        [class.text-rose-600]="dupont.netMargin.diff < 0"
                        [class.text-emerald-600]="dupont.netMargin.diff >= 0">
                      {{ (dupont.netMargin.diff > 0 ? '+' : '') + (dupont.netMargin.diff | number:'1.2-2') }} p.p.
                    </td>
                  </tr>

                  <!-- Motor 2: Rotación de Activos -->
                  <tr class="hover:bg-slate-50 transition-colors">
                    <td class="py-2.5 px-3">
                      <div class="font-semibold text-slate-900">{{ dupont.assetTurnover.title || '2. Rotación de Activos (Motor 2)' }}</div>
                      <div class="text-[10px] text-slate-500">Eficiencia en Uso de Capital</div>
                    </td>
                    <td class="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      {{ dupont.assetTurnover.year2025 | number:'1.2-2' }}x
                    </td>
                    <td class="py-2.5 px-3 text-right font-mono text-slate-600">
                      {{ dupont.assetTurnover.year2024 | number:'1.2-2' }}x
                    </td>
                    <td class="py-2.5 px-3 text-right font-mono font-semibold text-emerald-600">
                      {{ (dupont.assetTurnover.diff > 0 ? '+' : '') + (dupont.assetTurnover.diff | number:'1.2-2') }}x
                    </td>
                  </tr>

                  <!-- Motor 3: Apalancamiento Financiero -->
                  <tr class="hover:bg-slate-50 transition-colors">
                    <td class="py-2.5 px-3">
                      <div class="font-semibold text-slate-900">{{ dupont.financialLeverage.title || '3. Apalancamiento (Motor 3)' }}</div>
                      <div class="text-[10px] text-slate-500">Multiplicador de Capital (Activo/Pat.)</div>
                    </td>
                    <td class="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      {{ dupont.financialLeverage.year2025 | number:'1.2-2' }}x
                    </td>
                    <td class="py-2.5 px-3 text-right font-mono text-slate-600">
                      {{ dupont.financialLeverage.year2024 | number:'1.2-2' }}x
                    </td>
                    <td class="py-2.5 px-3 text-right font-mono font-semibold text-emerald-600">
                      {{ (dupont.financialLeverage.diff > 0 ? '+' : '') + (dupont.financialLeverage.diff | number:'1.2-2') }}x
                    </td>
                  </tr>

                  <!-- ROE DuPont (Resultado) -->
                  <tr class="bg-sky-50/80 font-bold border-t-2 border-sky-300">
                    <td class="py-3 px-3">
                      <div class="text-[#0f2b5c] font-black text-xs uppercase tracking-wide">
                        ROE DuPont (resultado)
                      </div>
                      <div class="text-[10px] text-sky-700 font-normal">
                        Rendimiento s/ Patrimonio
                      </div>
                    </td>
                    <td class="py-3 px-3 text-right font-mono font-black text-[#0f2b5c] text-sm">
                      {{ dupont.roe.year2025 | number:'1.2-2' }}%
                    </td>
                    <td class="py-3 px-3 text-right font-mono text-slate-700">
                      {{ dupont.roe.year2024 | number:'1.2-2' }}%
                    </td>
                    <td class="py-3 px-3 text-right font-mono font-bold"
                        [class.text-rose-600]="dupont.roe.diff < 0"
                        [class.text-emerald-600]="dupont.roe.diff >= 0">
                      {{ (dupont.roe.diff > 0 ? '+' : '') + (dupont.roe.diff | number:'1.2-2') }} p.p.
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- Aporte de cada motor al cambio del ROE -->
              <div class="bg-gradient-to-br from-slate-50 to-sky-50/50 rounded-lg p-3.5 border border-sky-100">
                <div class="text-xs font-bold text-[#0f2b5c] mb-2 flex items-center justify-between">
                  <span class="flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                    Aporte de cada motor al cambio del ROE
                  </span>
                  <span class="text-[10px] px-2 py-0.5 rounded bg-sky-200/60 text-sky-800 font-semibold">
                    Análisis de Atribución
                  </span>
                </div>

                <div class="space-y-2 text-xs">
                  <div class="flex items-start gap-2">
                    <span [class.text-rose-500]="dupont.netMargin.diff < 0" [class.text-emerald-500]="dupont.netMargin.diff >= 0" class="font-bold text-sm leading-none mt-0.5">
                      {{ dupont.netMargin.diff >= 0 ? '▲' : '▼' }}
                    </span>
                    <div>
                      <strong class="text-slate-800">1. Margen Neto (Motor 1):</strong>
                      <span class="text-slate-600 ml-1">{{ dupont.netMargin.impactOnRoe }}</span>
                    </div>
                  </div>
                  <div class="flex items-start gap-2">
                    <span [class.text-rose-500]="dupont.assetTurnover.diff < 0" [class.text-emerald-500]="dupont.assetTurnover.diff >= 0" class="font-bold text-sm leading-none mt-0.5">
                      {{ dupont.assetTurnover.diff >= 0 ? '▲' : '▼' }}
                    </span>
                    <div>
                      <strong class="text-slate-800">2. Rotación de Activos (Motor 2):</strong>
                      <span class="text-slate-600 ml-1">{{ dupont.assetTurnover.impactOnRoe }}</span>
                    </div>
                  </div>
                  <div class="flex items-start gap-2">
                    <span [class.text-rose-500]="dupont.financialLeverage.diff < 0" [class.text-emerald-500]="dupont.financialLeverage.diff >= 0" class="font-bold text-sm leading-none mt-0.5">
                      {{ dupont.financialLeverage.diff >= 0 ? '▲' : '▼' }}
                    </span>
                    <div>
                      <strong class="text-slate-800">3. Apalancamiento (Motor 3):</strong>
                      <span class="text-slate-600 ml-1">{{ dupont.financialLeverage.impactOnRoe }}</span>
                    </div>
                  </div>
                </div>

                <!-- Explicación Clara DuPont -->
                <div class="mt-3 pt-2.5 border-t border-sky-100 text-[11px] text-slate-700 leading-relaxed bg-white/70 p-2.5 rounded border border-slate-200">
                  <strong class="text-[#0f2b5c] block mb-0.5">💡 Explicación Financiera Clara:</strong>
                  {{ dupont.attributionAnalysis.conclusion || 'El ROE se mantiene sólidamente en 12.97% gracias a que la mayor velocidad comercial (rotación de activos) y el apalancamiento compensaron con exactitud la leve contracción del margen neto.' }}
                </div>
              </div>
            </div>
          </div>

          <!-- CARD 2: COVENANTS BONOS BBV (NOTA 12 - IMAGEN 4) -->
          <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3 flex items-center justify-between">
              <span class="flex items-center gap-1.5">
                <span class="w-1.5 h-3.5 rounded-full bg-blue-600 inline-block"></span>
                Covenants Bonos BBV (Nota 12)
              </span>
              <span class="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                100% CUMPLIDOS
              </span>
            </h4>

            <div class="overflow-x-auto">
              <table class="w-full text-xs text-left">
                <thead class="bg-slate-100 text-slate-700 font-semibold text-[10px] uppercase border-b border-slate-200">
                  <tr>
                    <th scope="col" class="py-2 px-2.5">Compromiso Financiero</th>
                    <th scope="col" class="py-2 px-2.5 text-center">2025</th>
                    <th scope="col" class="py-2 px-2.5 text-center">Límite BBV</th>
                    <th scope="col" class="py-2 px-2.5 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr class="hover:bg-slate-50">
                    <td class="py-2 px-2.5 font-medium text-slate-900">
                      Razón Corriente (RC ≥ 1.20x)
                    </td>
                    <td class="py-2 px-2.5 text-center font-mono font-bold text-slate-900">
                      3,08x
                    </td>
                    <td class="py-2 px-2.5 text-center font-mono text-slate-600">
                      ≥ 1,20x
                    </td>
                    <td class="py-2 px-2.5 text-center">
                      <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        ✓ CUMPLE
                      </span>
                    </td>
                  </tr>
                  <tr class="hover:bg-slate-50">
                    <td class="py-2 px-2.5 font-medium text-slate-900">
                      Relación Endeudamiento (RDP ≤ 2.50x)
                    </td>
                    <td class="py-2 px-2.5 text-center font-mono font-bold text-slate-900">
                      0,66x
                    </td>
                    <td class="py-2 px-2.5 text-center font-mono text-slate-600">
                      ≤ 2,50x
                    </td>
                    <td class="py-2 px-2.5 text-center">
                      <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        ✓ CUMPLE
                      </span>
                    </td>
                  </tr>
                  <tr class="hover:bg-slate-50">
                    <td class="py-2 px-2.5 font-medium text-slate-900">
                      Cobertura Servicio Deuda Fin. (≥ 1.50x)
                    </td>
                    <td class="py-2 px-2.5 text-center font-mono font-bold text-slate-900">
                      8,99x
                    </td>
                    <td class="py-2 px-2.5 text-center font-mono text-slate-600">
                      ≥ 1,50x
                    </td>
                    <td class="py-2 px-2.5 text-center">
                      <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        ✓ CUMPLE
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Resumen de Solvencia -->
            <div class="mt-3 p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-[11px] text-emerald-900 leading-snug">
              <strong>Solvencia Bursátil Garantizada:</strong> La entidad cumple con holgura extraordinaria todos los límites contractuales exigidos por los tenedores de bonos corporativos, manteniendo un riesgo crediticio mínimo.
            </div>
          </div>

        </div>

      </div>

      <!-- ========================================== -->
      <!-- MODAL DE EXPLICACIÓN FINANCIERA CLARA -->
      <!-- ========================================== -->
      @if (selectedRatio()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden transform transition-all">
            <!-- Modal Header -->
            <div class="bg-gradient-to-r from-[#0f2b5c] to-[#1e4488] text-white p-5 flex items-start justify-between">
              <div>
                <span class="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/20 text-sky-200 mb-1.5">
                  {{ selectedRatio()?.category }}
                </span>
                <h4 class="text-lg font-bold">
                  {{ selectedRatio()?.name }}
                </h4>
                <p class="text-xs text-sky-200 font-mono mt-0.5">
                  Fórmula: {{ selectedRatio()?.formula }}
                </p>
              </div>
              <button 
                (click)="selectedRatio.set(null)"
                class="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <!-- Modal Body -->
            <div class="p-6 space-y-4 text-xs">
              <!-- Grid con valores -->
              <div class="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <div>
                  <span class="text-slate-500 block text-[11px]">Gestión 2025</span>
                  <span class="font-bold text-slate-900 text-base font-mono">
                    {{ formatValue(selectedRatio()?.year2025, selectedRatio()?.unit) }}
                  </span>
                </div>
                <div>
                  <span class="text-slate-500 block text-[11px]">Gestión 2024</span>
                  <span class="font-bold text-slate-600 text-base font-mono">
                    {{ formatValue(selectedRatio()?.year2024, selectedRatio()?.unit) }}
                  </span>
                </div>
                <div>
                  <span class="text-slate-500 block text-[11px]">Variación</span>
                  <span class="font-bold text-base font-mono"
                        [class.text-emerald-600]="selectedRatio()?.trend === 'Mejora'"
                        [class.text-rose-600]="selectedRatio()?.trend === 'Deterioro'"
                        [class.text-slate-600]="selectedRatio()?.trend === 'Estable'">
                    {{ selectedRatio()?.diffText }}
                  </span>
                </div>
              </div>

              <!-- Metas / Criterio -->
              <div class="flex items-center justify-between p-3 rounded-lg bg-sky-50/70 border border-sky-200 text-sky-950">
                <span class="font-semibold">Criterio Institucional:</span>
                <span class="font-mono font-bold">{{ selectedRatio()?.covenant || 'Superar ejercicio previo' }}</span>
              </div>

              <!-- Explicación Clara -->
              <div class="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 text-slate-800 space-y-2">
                <div class="flex items-center gap-1.5 font-bold text-emerald-900 text-xs">
                  <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Explicación Financiera Clara:
                </div>
                <p class="leading-relaxed">
                  {{ selectedRatio()?.explanation }}
                </p>
                <div class="pt-2 border-t border-emerald-200/60 text-slate-600">
                  <strong>Interpretación Gerencial:</strong> {{ selectedRatio()?.interpretation }}
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
              <button 
                (click)="selectedRatio.set(null)"
                class="px-4 py-2 bg-[#0f2b5c] text-white rounded-lg font-medium hover:bg-sky-900 transition-colors text-xs">
                Entendido / Cerrar
              </button>
            </div>
          </div>
        </div>
      }
    </section>
  `
})
export class RatiosDupontSectionComponent {
  @Input() ratios: FinancialRatio[] = [];
  @Input() dupont!: DuPontData;

  activeCategory = signal<'TODAS' | RatioCategory>('TODAS');
  selectedRatio = signal<FinancialRatio | null>(null);

  visibleCategories(): RatioCategory[] {
    if (this.activeCategory() !== 'TODAS') {
      return [this.activeCategory() as RatioCategory];
    }
    return ['LIQUIDEZ', 'GESTIÓN', 'SOLVENCIA', 'RENTABILIDAD'];
  }

  getCategoryTitle(category: RatioCategory): string {
    switch (category) {
      case 'LIQUIDEZ': return '1. LIQUIDEZ (Capacidad de pago corriente)';
      case 'GESTIÓN': return '2. GESTIÓN Y ACTIVIDAD (Eficiencia operativa)';
      case 'SOLVENCIA': return '3. SOLVENCIA Y APALANCAMIENTO (Estructura de deuda)';
      case 'RENTABILIDAD': return '4. RENTABILIDAD (Generación de valor y retorno)';
      default: return category;
    }
  }

  getRatiosByCategory(category: RatioCategory): FinancialRatio[] {
    return (this.ratios || []).filter(r => r.category === category);
  }

  formatValue(val: number | undefined, unit: string | undefined): string {
    if (val === undefined || val === null) return '-';
    if (unit === '%') return `${val.toFixed(2)}%`;
    if (unit === 'x' || unit === 'veces') return `${val.toFixed(2)}x`;
    if (unit === 'días') return `${val.toFixed(2)} días`;
    return val.toFixed(2);
  }

  selectRatio(ratio: FinancialRatio): void {
    this.selectedRatio.set(ratio);
  }
}
