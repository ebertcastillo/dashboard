import { Component, Input, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { HorizontalKeyVariation } from '../../models/financial.model';

@Component({
  selector: 'app-horizontal-variations',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  template: `
    <section class="mb-8">
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        
        <!-- Header Banner (Estilo Corporativo Bancario) -->
        <div class="bg-gradient-to-r from-[#0f2b5c] to-[#1e4488] text-white px-5 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div class="flex items-center gap-2">
              <span class="inline-flex p-1.5 rounded-lg bg-white/10 text-sky-300">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/>
                </svg>
              </span>
              <h3 class="text-sm md:text-base font-bold tracking-wide uppercase">
                Variaciones Clave 2024 → 2025
              </h3>
            </div>
            <p class="text-xs text-sky-200 mt-0.5">
              Vinculado a ANÁLISIS HORIZONTAL · Importes en Bs. Millones y Variación Porcentual
            </p>
          </div>

          <!-- Leyenda de colores -->
          <div class="flex items-center gap-3 bg-black/20 px-3 py-1.5 rounded-lg text-xs">
            <span class="flex items-center gap-1.5 text-sky-200">
              <span class="w-2.5 h-2.5 rounded-full bg-sky-400"></span> Patrimonial
            </span>
            <span class="flex items-center gap-1.5 text-emerald-300">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Favorable
            </span>
            <span class="flex items-center gap-1.5 text-rose-300">
              <span class="w-2.5 h-2.5 rounded-full bg-rose-400"></span> Desfavorable
            </span>
          </div>
        </div>

        <!-- Barra de filtro de categorías -->
        <div class="bg-slate-50 px-5 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
          <div class="flex items-center gap-2">
            <span class="font-semibold text-slate-700">Sección:</span>
            <div class="inline-flex rounded-md shadow-2xs">
              <button
                (click)="activeTab.set('TODAS')"
                [class.bg-sky-900]="activeTab() === 'TODAS'"
                [class.text-white]="activeTab() === 'TODAS'"
                [class.bg-white]="activeTab() !== 'TODAS'"
                class="px-3 py-1 text-xs font-medium rounded-l-md border border-slate-300 hover:bg-slate-100 transition-colors">
                Todo el Estado
              </button>
              <button
                (click)="activeTab.set('SITUACIÓN PATRIMONIAL')"
                [class.bg-sky-900]="activeTab() === 'SITUACIÓN PATRIMONIAL'"
                [class.text-white]="activeTab() === 'SITUACIÓN PATRIMONIAL'"
                [class.bg-white]="activeTab() !== 'SITUACIÓN PATRIMONIAL'"
                class="px-3 py-1 text-xs font-medium border-t border-b border-r border-slate-300 hover:bg-slate-100 transition-colors">
                Balance General
              </button>
              <button
                (click)="activeTab.set('ESTADO DE RESULTADOS')"
                [class.bg-sky-900]="activeTab() === 'ESTADO DE RESULTADOS'"
                [class.text-white]="activeTab() === 'ESTADO DE RESULTADOS'"
                [class.bg-white]="activeTab() !== 'ESTADO DE RESULTADOS'"
                class="px-3 py-1 text-xs font-medium rounded-r-md border-t border-b border-r border-slate-300 hover:bg-slate-100 transition-colors">
                Estado de Resultados
              </button>
            </div>
          </div>

          <div class="text-[11px] text-slate-500">
            Haga clic en una fila para consultar su <strong>explicación financiera ejecutiva</strong>
          </div>
        </div>

        <!-- Tabla interactiva -->
        <div class="overflow-x-auto">
          <table class="w-full text-xs text-left">
            <thead class="bg-slate-100 text-slate-700 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th scope="col" class="py-3 px-4 w-72">Concepto</th>
                <th scope="col" class="py-3 px-3 text-right">Dic. 2024</th>
                <th scope="col" class="py-3 px-3 text-right">Dic. 2025</th>
                <th scope="col" class="py-3 px-3 text-right">Variación Absoluta</th>
                <th scope="col" class="py-3 px-3 text-right">Var. %</th>
                <th scope="col" class="py-3 px-4 min-w-[200px]">Magnitud de la variación (Escala visual)</th>
                <th scope="col" class="py-3 px-2 text-center w-12">Explicación</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (cat of getCategories(); track cat) {
                <!-- Encabezado de Categoría -->
                <tr class="bg-slate-100/90 font-bold text-slate-800 text-[11px]">
                  <td colspan="7" class="py-2.5 px-4 tracking-wide uppercase flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="w-1.5 h-3.5 rounded-full inline-block"
                            [class.bg-sky-600]="cat === 'SITUACIÓN PATRIMONIAL'"
                            [class.bg-emerald-600]="cat === 'ESTADO DE RESULTADOS'"></span>
                      <span>{{ cat }}</span>
                      @if (cat === 'ESTADO DE RESULTADOS') {
                        <span class="text-[10px] lowercase font-normal text-slate-500 ml-2">
                          (verde = favorable · rojo = desfavorable)
                        </span>
                      }
                    </div>
                  </td>
                </tr>

                <!-- Filas de esta categoría -->
                @for (item of getItemsByCategory(cat); track item.concept) {
                  <tr 
                    (click)="selectItem(item)"
                    class="hover:bg-sky-50/60 cursor-pointer transition-colors group">
                    <!-- Concepto -->
                    <td class="py-3 px-4 font-medium text-slate-900 group-hover:text-sky-900">
                      {{ item.concept }}
                    </td>

                    <!-- 2024 -->
                    <td class="py-3 px-3 text-right font-mono text-slate-600">
                      {{ item.val2024 | number:'1.2-2' }}
                    </td>

                    <!-- 2025 -->
                    <td class="py-3 px-3 text-right font-mono font-bold text-slate-900">
                      {{ item.val2025 | number:'1.2-2' }}
                    </td>

                    <!-- Variación Absoluta -->
                    <td class="py-3 px-3 text-right font-mono font-semibold"
                        [class.text-emerald-600]="item.absDiff > 0"
                        [class.text-rose-600]="item.absDiff < 0"
                        [class.text-slate-600]="item.absDiff === 0">
                      {{ (item.absDiff > 0 ? '+' : '') + (item.absDiff | number:'1.2-2') }}
                    </td>

                    <!-- Var % -->
                    <td class="py-3 px-3 text-right font-mono font-bold"
                        [class.text-emerald-600]="item.relDiff > 0"
                        [class.text-rose-600]="item.relDiff < 0"
                        [class.text-slate-600]="item.relDiff === 0">
                      {{ (item.relDiff > 0 ? '+' : '') + (item.relDiff | number:'1.2-2') }}%
                    </td>

                    <!-- Barra de magnitud -->
                    <td class="py-3 px-4">
                      <div class="flex items-center gap-2">
                        <div class="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                          <div 
                            [style.width.%]="item.barMagnitude"
                            [class.bg-sky-600]="item.category === 'SITUACIÓN PATRIMONIAL'"
                            [class.bg-emerald-500]="item.category === 'ESTADO DE RESULTADOS' && item.isFavorable"
                            [class.bg-rose-500]="item.category === 'ESTADO DE RESULTADOS' && !item.isFavorable"
                            class="h-full rounded-full transition-all duration-500 shadow-xs">
                          </div>
                        </div>
                        <span class="text-[10px] font-mono text-slate-500 w-8 text-right">
                          {{ item.barMagnitude }}%
                        </span>
                      </div>
                    </td>

                    <!-- Botón de detalle -->
                    <td class="py-3 px-2 text-center">
                      <button 
                        type="button"
                        class="p-1 rounded text-sky-600 hover:text-sky-800 hover:bg-sky-100 transition-colors"
                        title="Ver explicación financiera detallada">
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

        <!-- Banner Inferior de Síntesis Ejecutiva -->
        <div class="bg-gradient-to-r from-sky-50 via-slate-50 to-emerald-50 p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div class="flex items-center gap-2 text-slate-800">
            <span class="p-1.5 rounded-lg bg-sky-100 text-sky-800">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </span>
            <div>
              <span class="font-bold text-[#0f2b5c]">Conclusión del Análisis Horizontal:</span>
              <span class="text-slate-600 ml-1">
                La empresa expandió sus activos en +13.98% y sus ventas en +24.41%, logrando una utilidad neta de Bs. 134.5M (+6.30%) aún tras absorber un shock cambiario de Bs. -105.4M.
              </span>
            </div>
          </div>
        </div>

      </div>

      <!-- ========================================== -->
      <!-- MODAL DE EXPLICACIÓN FINANCIERA CLARA -->
      <!-- ========================================== -->
      @if (selectedItem()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden transform transition-all">
            <!-- Modal Header -->
            <div class="bg-gradient-to-r from-[#0f2b5c] to-[#1e4488] text-white p-5 flex items-start justify-between">
              <div>
                <span class="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/20 text-sky-200 mb-1.5">
                  {{ selectedItem()?.category }}
                </span>
                <h4 class="text-lg font-bold">
                  {{ selectedItem()?.concept }}
                </h4>
                <p class="text-xs text-sky-200 mt-0.5">
                  Análisis Horizontal Comparativo (2025 vs 2024)
                </p>
              </div>
              <button 
                (click)="selectedItem.set(null)"
                class="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <!-- Modal Body -->
            <div class="p-6 space-y-4 text-xs">
              <!-- Grid de valores -->
              <div class="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <div>
                  <span class="text-slate-500 block text-[11px]">Dic. 2024</span>
                  <span class="font-bold text-slate-600 text-base font-mono">
                    {{ selectedItem()?.val2024 | number:'1.2-2' }}
                  </span>
                  <span class="text-[10px] text-slate-400">Bs. Millones</span>
                </div>
                <div>
                  <span class="text-slate-500 block text-[11px]">Dic. 2025</span>
                  <span class="font-bold text-slate-900 text-base font-mono">
                    {{ selectedItem()?.val2025 | number:'1.2-2' }}
                  </span>
                  <span class="text-[10px] text-slate-400">Bs. Millones</span>
                </div>
                <div>
                  <span class="text-slate-500 block text-[11px]">Variación</span>
                  <span class="font-bold text-base font-mono"
                        [class.text-emerald-600]="(selectedItem()?.relDiff || 0) > 0"
                        [class.text-rose-600]="(selectedItem()?.relDiff || 0) < 0"
                        [class.text-slate-600]="(selectedItem()?.relDiff || 0) === 0">
                    {{ ((selectedItem()?.relDiff || 0) > 0 ? '+' : '') + (selectedItem()?.relDiff | number:'1.2-2') }}%
                  </span>
                  <span class="text-[10px] block font-mono text-slate-500">
                    {{ ((selectedItem()?.absDiff || 0) > 0 ? '+' : '') + (selectedItem()?.absDiff | number:'1.2-2') }} Bs. M
                  </span>
                </div>
              </div>

              <!-- Explicación Clara -->
              <div class="p-4 bg-sky-50/60 rounded-xl border border-sky-100 text-slate-800 space-y-2">
                <div class="flex items-center gap-1.5 font-bold text-sky-950 text-xs">
                  <svg class="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Explicación Financiera Clara:
                </div>
                <p class="leading-relaxed">
                  {{ selectedItem()?.explanation }}
                </p>
              </div>

              <!-- Diagnóstico Estratégico -->
              <div class="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700">
                <span class="font-semibold text-slate-900 block mb-1">Evaluación de Impacto:</span>
                @if (selectedItem()?.isFavorable) {
                  <span class="text-emerald-700 font-medium">✓ Impacto Favorable:</span> Contribuye a fortalecer la liquidez, rentabilidad o patrimonio neto de la entidad.
                } @else {
                  <span class="text-rose-700 font-medium">⚠ Alerta / Detracción:</span> Representa un costo adicional, salida de fondos o factor de riesgo a monitorear.
                }
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
              <button 
                (click)="selectedItem.set(null)"
                class="px-4 py-2 bg-[#0f2b5c] text-white rounded-lg font-medium hover:bg-sky-900 transition-colors text-xs">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      }
    </section>
  `
})
export class HorizontalVariationsComponent {
  @Input() items: HorizontalKeyVariation[] = [];

  activeTab = signal<'TODAS' | 'SITUACIÓN PATRIMONIAL' | 'ESTADO DE RESULTADOS'>('TODAS');
  selectedItem = signal<HorizontalKeyVariation | null>(null);

  getCategories(): ('SITUACIÓN PATRIMONIAL' | 'ESTADO DE RESULTADOS')[] {
    if (this.activeTab() === 'SITUACIÓN PATRIMONIAL') {
      return ['SITUACIÓN PATRIMONIAL'];
    }
    if (this.activeTab() === 'ESTADO DE RESULTADOS') {
      return ['ESTADO DE RESULTADOS'];
    }
    return ['SITUACIÓN PATRIMONIAL', 'ESTADO DE RESULTADOS'];
  }

  getItemsByCategory(category: 'SITUACIÓN PATRIMONIAL' | 'ESTADO DE RESULTADOS'): HorizontalKeyVariation[] {
    return (this.items || []).filter(item => item.category === category);
  }

  selectItem(item: HorizontalKeyVariation): void {
    this.selectedItem.set(item);
  }
}
