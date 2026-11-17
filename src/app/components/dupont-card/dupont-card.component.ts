import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DuPontData } from '../../models/financial.model';

@Component({
  selector: 'app-dupont-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 md:p-6 transition-all">
      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </span>
            <h3 class="text-base font-bold text-slate-900 tracking-tight">
              Desglose y Descomposición del Sistema DuPont (ROE)
            </h3>
          </div>
          <p class="text-xs text-slate-500 mt-1">
            Análisis de los 3 inductores de valor: Margen Operativo × Rotación de Activos × Multiplicador de Capital
          </p>
        </div>

        <!-- Year Toggle Pills -->
        <div class="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            (click)="selectedYear.set(2025)"
            [class.bg-white]="selectedYear() === 2025"
            [class.shadow-xs]="selectedYear() === 2025"
            [class.text-blue-900]="selectedYear() === 2025"
            [class.text-slate-500]="selectedYear() !== 2025"
            class="px-3 py-1 rounded-lg transition-all"
          >
            Gestión 2025
          </button>
          <button
            type="button"
            (click)="selectedYear.set(2024)"
            [class.bg-white]="selectedYear() === 2024"
            [class.shadow-xs]="selectedYear() === 2024"
            [class.text-blue-900]="selectedYear() === 2024"
            [class.text-slate-500]="selectedYear() !== 2024"
            class="px-3 py-1 rounded-lg transition-all"
          >
            Gestión 2024
          </button>
        </div>
      </div>

      <!-- DuPont Mathematical Formula Flow -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        <!-- Component 1: Margen Neto -->
        <div class="md:col-span-3 bg-gradient-to-br from-sky-50 to-blue-50/60 rounded-xl p-4 border border-sky-100 flex flex-col justify-between h-full">
          <div>
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold uppercase tracking-wider text-sky-800">
                1. Rentabilidad
              </span>
              <span class="text-[10px] font-semibold text-slate-400">Eficiencia Margen</span>
            </div>
            <h4 class="text-sm font-bold text-slate-800 mt-1">Margen Neto</h4>
            <div class="mt-2 text-2xl font-extrabold text-sky-950">
              {{ currentMargin() }}%
            </div>
            <div class="mt-1 text-[11px] font-medium text-slate-500 font-mono">
              Utilidad Neta / Ventas
            </div>
          </div>
          <div class="mt-3 pt-2 border-t border-sky-100/80 text-[11px] text-slate-600">
            @if (selectedYear() === 2025) {
              <span>Vs 2024 (12.94%): <strong class="text-amber-700">-1.88 p.p.</strong></span>
            } @else {
              <span>Referencia base del ejercicio anterior</span>
            }
          </div>
        </div>

        <!-- Operator 1: Multiply -->
        <div class="hidden md:flex md:col-span-1 justify-center items-center">
          <div class="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600 shadow-xs">
            ×
          </div>
        </div>

        <!-- Component 2: Rotación de Activos -->
        <div class="md:col-span-3 bg-gradient-to-br from-indigo-50 to-violet-50/60 rounded-xl p-4 border border-indigo-100 flex flex-col justify-between h-full">
          <div>
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold uppercase tracking-wider text-indigo-800">
                2. Eficiencia Activa
              </span>
              <span class="text-[10px] font-semibold text-slate-400">Rotación</span>
            </div>
            <h4 class="text-sm font-bold text-slate-800 mt-1">Rotación de Activos</h4>
            <div class="mt-2 text-2xl font-extrabold text-indigo-950">
              {{ currentTurnover() }}x
            </div>
            <div class="mt-1 text-[11px] font-medium text-slate-500 font-mono">
              Ventas / Activos Totales
            </div>
          </div>
          <div class="mt-3 pt-2 border-t border-indigo-100/80 text-[11px] text-slate-600">
            @if (selectedYear() === 2025) {
              <span>Vs 2024 (0.65x): <strong class="text-emerald-700">+9.23% (Mejora)</strong></span>
            } @else {
              <span>Referencia base del ejercicio anterior</span>
            }
          </div>
        </div>

        <!-- Operator 2: Multiply -->
        <div class="hidden md:flex md:col-span-1 justify-center items-center">
          <div class="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600 shadow-xs">
            ×
          </div>
        </div>

        <!-- Component 3: Apalancamiento Financiero -->
        <div class="md:col-span-3 bg-gradient-to-br from-amber-50 to-orange-50/60 rounded-xl p-4 border border-amber-100 flex flex-col justify-between h-full">
          <div>
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                3. Apalancamiento
              </span>
              <span class="text-[10px] font-semibold text-slate-400">Multiplicador</span>
            </div>
            <h4 class="text-sm font-bold text-slate-800 mt-1">Multiplicador de Capital</h4>
            <div class="mt-2 text-2xl font-extrabold text-amber-950">
              {{ currentLeverage() }}x
            </div>
            <div class="mt-1 text-[11px] font-medium text-slate-500 font-mono">
              Activo Total / Patrimonio
            </div>
          </div>
          <div class="mt-3 pt-2 border-t border-amber-100/80 text-[11px] text-slate-600">
            @if (selectedYear() === 2025) {
              <span>Vs 2024 (1.55x): <strong class="text-sky-700">+7.10%</strong></span>
            } @else {
              <span>Referencia base del ejercicio anterior</span>
            }
          </div>
        </div>

        <!-- Equals sign & Resulting ROE -->
        <div class="md:col-span-1 hidden md:flex justify-center items-center">
          <div class="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center font-bold text-emerald-800 shadow-xs">
            =
          </div>
        </div>
      </div>

      <!-- Result Banner Card -->
      <div class="mt-4 p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs uppercase tracking-wider font-semibold text-emerald-400">
                ROE Resultante DuPont ({{ selectedYear() }})
              </span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                Covenant Cumplido (≥ 12.0%)
              </span>
            </div>
            <p class="text-xs text-slate-300 mt-0.5">
              Cálculo: {{ currentMargin() }}% × {{ currentTurnover() }} × {{ currentLeverage() }} =
              <strong class="text-white">{{ currentRoe() }}%</strong>
            </p>
          </div>
        </div>

        <div class="text-right sm:border-l sm:border-slate-800 sm:pl-6">
          <div class="text-3xl font-black text-emerald-400 tracking-tight">
            {{ currentRoe() }}%
          </div>
          <span class="text-xs text-slate-400">Rentabilidad sobre Patrimonio Neto</span>
        </div>
      </div>

      <!-- Strategic Takeaway for Credit / Executive Board -->
      <div class="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
        <svg class="w-4 h-4 text-sky-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <strong class="font-semibold text-slate-800">Conclusión de Descomposición DuPont: </strong>
          Durante la gestión 2025, el ROE se mantuvo sólido y prácticamente constante en <span class="font-bold text-slate-900">12.97%</span> (frente a 12.99% en 2024). A pesar de una disminución de margen debida a diferencias de cambio, este efecto fue contrarrestado de manera virtuosa por un incremento en la <span class="font-bold text-slate-900">Rotación de Activos (de 0.65x a 0.71x)</span> y un apalancamiento financiero controlado y seguro de <span class="font-bold text-slate-900">1.66x</span>.
        </div>
      </div>
    </div>
  `
})
export class DupontCardComponent {
  @Input({ required: true }) dupont!: DuPontData;

  protected readonly selectedYear = signal<2025 | 2024>(2025);

  currentMargin(): string {
    const val = this.selectedYear() === 2025 ? this.dupont.netMargin.year2025 : this.dupont.netMargin.year2024;
    return val !== undefined && val !== null ? val.toFixed(2) : '0.00';
  }

  currentTurnover(): string {
    const val = this.selectedYear() === 2025 ? this.dupont.assetTurnover.year2025 : this.dupont.assetTurnover.year2024;
    return val !== undefined && val !== null ? val.toFixed(2) : '0.00';
  }

  currentLeverage(): string {
    const val = this.selectedYear() === 2025 ? this.dupont.financialLeverage.year2025 : this.dupont.financialLeverage.year2024;
    return val !== undefined && val !== null ? val.toFixed(2) : '0.00';
  }

  currentRoe(): string {
    const val = this.selectedYear() === 2025 ? this.dupont.roe.year2025 : this.dupont.roe.year2024;
    return val !== undefined && val !== null ? val.toFixed(2) : '0.00';
  }
}
