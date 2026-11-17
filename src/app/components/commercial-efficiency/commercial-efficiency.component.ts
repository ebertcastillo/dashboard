import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  inject,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { WorkingCapitalCycleItem, BusinessLineItem } from '../../models/financial.model';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

@Component({
  selector: 'app-commercial-efficiency',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 md:p-6 transition-all mb-8">
      <!-- Section Header (as in Excel Image 3) -->
      <div class="border-b border-slate-200 pb-3 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 class="text-sm sm:text-base font-extrabold uppercase tracking-wide text-blue-950 flex items-center gap-2">
            <span class="w-3 h-3 rounded-sm bg-blue-900"></span>
            Eficiencia Operativa y Negocios · Ciclo de efectivo (días) y ventas por línea de negocio
          </h3>
          <p class="text-xs text-slate-500 mt-0.5">
            Gestión del capital de trabajo comercial (DIO, DSO, DPO, CCE) y diversificación de ingresos por unidades de negocio
          </p>
        </div>

        <span class="text-xs font-semibold px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 border border-sky-200 self-start sm:self-auto">
          Hoja: DATOS DASHBOARD / NOTA 15
        </span>
      </div>

      <!-- Two Column Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <!-- LEFT: CICLO DE CAPITAL DE TRABAJO (DÍAS) -->
        <div class="lg:col-span-5 bg-slate-50/60 rounded-xl p-4 border border-slate-200 flex flex-col justify-between h-full">
          <div>
            <div class="flex items-center justify-between mb-1">
              <h4 class="text-xs sm:text-sm font-bold text-slate-800">
                Ciclo de Capital de Trabajo: DIO, DSO, DPO y CCE (días)
              </h4>
              <div class="flex items-center gap-2 text-[11px]">
                <span class="flex items-center gap-1 font-semibold text-slate-500">
                  <span class="w-2.5 h-2.5 rounded-sm bg-slate-400"></span> 2024
                </span>
                <span class="flex items-center gap-1 font-bold text-sky-900">
                  <span class="w-2.5 h-2.5 rounded-sm bg-sky-700"></span> 2025
                </span>
              </div>
            </div>
            <p class="text-[11px] text-slate-500 mb-3">
              Fórmula: Ciclo de Conversión de Efectivo (CCE) = DIO + DSO - DPO
            </p>
          </div>

          <div class="relative w-full" style="height: 250px;">
            <canvas #workingCapitalCanvas></canvas>
          </div>

          <!-- Highlight Summary Card -->
          <div class="mt-3 p-3 bg-white rounded-lg border border-sky-200 text-xs">
            <div class="flex items-center justify-between mb-1">
              <span class="font-bold text-slate-900">CCE 2025: <strong class="text-emerald-700 font-mono text-sm">-9.66 días</strong></span>
              <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                ▲ Favorable (-7.02 d)
              </span>
            </div>
            <p class="text-[11px] text-slate-600 leading-relaxed">
              <strong>Eficiencia Comercial Óptima:</strong> La empresa cobra a clientes en <strong>31.92 días</strong> y rota inventarios en <strong>205.49 días</strong>, mientras paga a proveedores a los <strong>75.81 días</strong>. El ciclo negativo de -9.66 días significa que los proveedores financian íntegramente las operaciones.
            </p>
          </div>
        </div>

        <!-- RIGHT: VENTAS POR LÍNEA DE NEGOCIO (BS. MILLONES) -->
        <div class="lg:col-span-7 bg-slate-50/60 rounded-xl p-4 border border-slate-200 flex flex-col justify-between h-full">
          <div>
            <div class="flex items-center justify-between mb-1">
              <h4 class="text-xs sm:text-sm font-bold text-slate-800">
                Ingresos por Línea de Negocio (Bs. millones · Nota 15)
              </h4>
              <div class="flex items-center gap-2 text-[11px]">
                <span class="flex items-center gap-1 font-semibold text-slate-500">
                  <span class="w-2.5 h-2.5 rounded-sm bg-slate-400"></span> 2024
                </span>
                <span class="flex items-center gap-1 font-bold text-blue-900">
                  <span class="w-2.5 h-2.5 rounded-sm bg-blue-800"></span> 2025
                </span>
              </div>
            </div>
            <p class="text-[11px] text-slate-500 mb-3">
              Desglose de facturación por unidades comerciales y marcas de representación
            </p>
          </div>

          <div class="relative w-full" style="height: 310px;">
            <canvas #businessLinesCanvas></canvas>
          </div>
        </div>

      </div>

      <!-- EXPLICACIÓN CLARA -->
      <div class="mt-5 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-xs text-slate-700 flex items-start gap-3">
        <div class="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <strong class="font-bold text-slate-900">Explicación Clara de Negocios y Eficiencia: </strong>
          Las unidades comerciales con mayor aporte al crecimiento del <strong>24.41% en ingresos</strong> fueron <strong>Camiones (Bs. 414.62M, 34.11%)</strong>, <strong>Repuestos y Materiales (Bs. 289.24M, 23.79%)</strong> y <strong>Maquinaria Agrícola John Deere (Bs. 200.05M, 16.46%)</strong>. Simultáneamente, el periodo medio de cobro disminuyó drásticamente de 95.12 a <strong>31.92 días</strong> (-63.20 días) y la rotación de inventarios se aceleró en <strong>94.59 días</strong>, robusteciendo la generación de flujo operativo de caja.
        </div>
      </div>
    </div>
  `
})
export class CommercialEfficiencyComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('workingCapitalCanvas') private wcCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('businessLinesCanvas') private blCanvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() workingCapitalItems: WorkingCapitalCycleItem[] = [];
  @Input() businessLines: BusinessLineItem[] = [];

  private wcChart: Chart | null = null;
  private blChart: Chart | null = null;
  private readonly platformId = inject(PLATFORM_ID);

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initCharts();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['workingCapitalItems'] || changes['businessLines']) && this.wcChart && this.blChart) {
      this.updateCharts();
    }
  }

  ngOnDestroy(): void {
    if (this.wcChart) this.wcChart.destroy();
    if (this.blChart) this.blChart.destroy();
  }

  private initCharts(): void {
    // 1. Working capital cycle grouped vertical bar chart
    if (this.wcCanvasRef?.nativeElement && this.workingCapitalItems.length > 0) {
      const ctx1 = this.wcCanvasRef.nativeElement.getContext('2d');
      if (ctx1) {
        this.wcChart = new Chart(ctx1, {
          type: 'bar',
          data: {
            labels: this.workingCapitalItems.map(i => `${i.name} (${i.shortName})`),
            datasets: [
              {
                label: '2024',
                data: this.workingCapitalItems.map(i => i.val2024),
                backgroundColor: '#94a3b8',
                borderRadius: 4
              },
              {
                label: '2025',
                data: this.workingCapitalItems.map(i => i.val2025),
                backgroundColor: '#0284c7',
                borderRadius: 4
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (ctx) => ` ${ctx.dataset.label}: ${Number(ctx.raw).toFixed(2)} días`
                }
              }
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: { font: { size: 10, weight: 'bold' }, color: '#334155' }
              },
              y: {
                grid: { color: '#f1f5f9' },
                ticks: { font: { size: 10 }, color: '#64748b' }
              }
            }
          }
        });
      }
    }

    // 2. Business lines grouped horizontal bar chart
    if (this.blCanvasRef?.nativeElement && this.businessLines.length > 0) {
      const ctx2 = this.blCanvasRef.nativeElement.getContext('2d');
      if (ctx2) {
        this.blChart = new Chart(ctx2, {
          type: 'bar',
          data: {
            labels: this.businessLines.map(b => b.name),
            datasets: [
              {
                label: '2024',
                data: this.businessLines.map(b => b.val2024),
                backgroundColor: '#94a3b8',
                borderRadius: 4
              },
              {
                label: '2025',
                data: this.businessLines.map(b => b.val2025),
                backgroundColor: '#1e3a8a',
                borderRadius: 4
              }
            ]
          },
          options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (ctx) => ` ${ctx.dataset.label}: Bs. ${Number(ctx.raw).toFixed(2)} M`
                }
              }
            },
            scales: {
              x: {
                grid: { color: '#f1f5f9' },
                ticks: { font: { size: 10 }, color: '#64748b' }
              },
              y: {
                grid: { display: false },
                ticks: { font: { size: 10, weight: 'bold' }, color: '#334155' }
              }
            }
          }
        });
      }
    }
  }

  private updateCharts(): void {
    if (this.wcChart && this.workingCapitalItems.length > 0) {
      this.wcChart.data.labels = this.workingCapitalItems.map(i => `${i.name} (${i.shortName})`);
      this.wcChart.data.datasets[0].data = this.workingCapitalItems.map(i => i.val2024);
      this.wcChart.data.datasets[1].data = this.workingCapitalItems.map(i => i.val2025);
      this.wcChart.update();
    }

    if (this.blChart && this.businessLines.length > 0) {
      this.blChart.data.labels = this.businessLines.map(b => b.name);
      this.blChart.data.datasets[0].data = this.businessLines.map(b => b.val2024);
      this.blChart.data.datasets[1].data = this.businessLines.map(b => b.val2025);
      this.blChart.update();
    }
  }
}
