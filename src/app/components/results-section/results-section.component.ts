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

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

@Component({
  selector: 'app-results-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 md:p-6 transition-all">
      <!-- Section Header (as in Excel Image 2) -->
      <div class="border-b border-slate-200 pb-3 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 class="text-sm sm:text-base font-extrabold uppercase tracking-wide text-blue-950 flex items-center gap-2">
            <span class="w-3 h-3 rounded-sm bg-blue-900"></span>
            Resultados y Rentabilidad · cómo se genera y cuánto queda para el accionista
          </h3>
          <p class="text-xs text-slate-500 mt-0.5">
            Cascada de conversión de ingresos, márgenes de rentabilidad y destino de los fondos facturados
          </p>
        </div>

        <span class="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
          Hoja: ESTADOS FINANCIEROS
        </span>
      </div>

      <!-- Grid: Left Income-to-Net-Profit, Right: Profitability & Income Destination -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <!-- LEFT: DEL INGRESO A LA UTILIDAD NETA (BS. MILLONES) -->
        <div class="lg:col-span-6 bg-slate-50/60 rounded-xl p-4 border border-slate-200 flex flex-col justify-between h-full">
          <div>
            <div class="flex items-center justify-between mb-1">
              <h4 class="text-xs sm:text-sm font-bold text-slate-800">
                Del ingreso a la utilidad neta (Bs. millones)
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
              Evolución escalonada del Estado de Resultados (2025 vs. 2024)
            </p>
          </div>

          <div class="relative w-full" style="height: 270px;">
            <canvas #incomeNetCanvas></canvas>
          </div>
        </div>

        <!-- RIGHT TOP: RENTABILIDAD % (MARGEN, ROA, ROE) -->
        <div class="lg:col-span-6 space-y-5">
          <div class="bg-slate-50/60 rounded-xl p-4 border border-slate-200">
            <div class="flex items-center justify-between mb-1">
              <h4 class="text-xs sm:text-sm font-bold text-slate-800">
                Rentabilidad: Margen Neto, ROA y ROE (%)
              </h4>
              <div class="flex items-center gap-2 text-[11px]">
                <span class="flex items-center gap-1 font-semibold text-slate-500">
                  <span class="w-2.5 h-2.5 rounded-sm bg-slate-400"></span> 2024
                </span>
                <span class="flex items-center gap-1 font-bold text-emerald-800">
                  <span class="w-2.5 h-2.5 rounded-sm bg-emerald-600"></span> 2025
                </span>
              </div>
            </div>
            <p class="text-[11px] text-slate-500 mb-2">
              Retornos porcentuales generados para la empresa y los accionistas
            </p>

            <div class="relative w-full" style="height: 160px;">
              <canvas #rentabilityCanvas></canvas>
            </div>
          </div>

          <!-- RIGHT BOTTOM: ¿A DÓNDE VA CADA BS. DE INGRESO? (EXCEL IMAGE 2) -->
          <div class="bg-slate-50/60 rounded-xl p-4 border border-slate-200">
            <h4 class="text-xs sm:text-sm font-bold text-slate-800 mb-1">
              ¿A dónde va cada Bs. 100 de ingreso facturado? (% de ingresos)
            </h4>
            <p class="text-[11px] text-slate-500 mb-3">
              Desglose porcentual de costos, gastos operativos, cargas cambiarias y ganancia neta final
            </p>

            <div class="space-y-2">
              @for (item of incomeDistribution; track item.concept) {
                <div>
                  <div class="flex items-center justify-between text-xs mb-1">
                    <span class="font-medium text-slate-700 truncate pr-2">{{ item.concept }}</span>
                    <span class="font-mono font-bold text-slate-900 shrink-0">
                      {{ item.percentage.toFixed(2) }}% (Bs. {{ item.amount.toFixed(2) }} M)
                    </span>
                  </div>
                  <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      class="h-2 rounded-full transition-all duration-500"
                      [style.width.%]="item.percentage"
                      [style.backgroundColor]="item.color"
                    ></div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>

      </div>

      <!-- EXPLICACIÓN CLARA DE RESULTADOS -->
      <div class="mt-5 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-xs text-slate-700 flex items-start gap-3">
        <div class="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <strong class="font-bold text-slate-900">Explicación Clara de Resultados: </strong>
          Las ventas crecieron con gran fuerza (<span class="font-bold text-slate-900">+24.41%</span>, alcanzando Bs. 1.215,70M) y la utilidad operativa se disparó un <span class="font-bold text-emerald-800">+59.25%</span> (Bs. 265,25M). A pesar de que la diferencia de cambio absorbió Bs. 105,42M (8.67% de cada 100 Bs. vendidos), la rentabilidad final para los accionistas cerró en un <span class="font-bold text-emerald-800">ROE del 12.97%</span> y una Utilidad Neta récord de <span class="font-bold text-slate-900">Bs. 134,46 millones</span>.
        </div>
      </div>
    </div>
  `
})
export class ResultsSectionComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('incomeNetCanvas') private incomeNetRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('rentabilityCanvas') private rentabilityRef!: ElementRef<HTMLCanvasElement>;

  @Input() incomeItems: { label: string; v2024: number; v2025: number }[] = [
    { label: 'Ingresos Netos', v2024: 977.17, v2025: 1215.70 },
    { label: 'Margen Bruto', v2024: 295.51, v2025: 405.37 },
    { label: 'EBIT (Operativa)', v2024: 166.56, v2025: 265.25 },
    { label: 'Utilidad Antes Imp.', v2024: 163.70, v2025: 181.90 },
    { label: 'Utilidad Neta', v2024: 126.48, v2025: 134.46 }
  ];

  @Input() rentabilityItems: { label: string; v2024: number; v2025: number }[] = [
    { label: 'Margen Neto', v2024: 12.94, v2025: 11.06 },
    { label: 'ROA', v2024: 8.36, v2025: 7.80 },
    { label: 'ROE', v2024: 12.99, v2025: 12.97 }
  ];

  @Input() incomeDistribution: {
    concept: string;
    amount: number;
    percentage: number;
    color: string;
    explanation: string;
  }[] = [];

  private incomeChart: Chart | null = null;
  private rentChart: Chart | null = null;
  private readonly platformId = inject(PLATFORM_ID);

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initCharts();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['incomeItems'] || changes['rentabilityItems']) && this.incomeChart && this.rentChart) {
      this.updateCharts();
    }
  }

  ngOnDestroy(): void {
    if (this.incomeChart) this.incomeChart.destroy();
    if (this.rentChart) this.rentChart.destroy();
  }

  private initCharts(): void {
    // 1. Del Ingreso a Utilidad Neta (Bar Chart)
    if (this.incomeNetRef?.nativeElement) {
      const ctx1 = this.incomeNetRef.nativeElement.getContext('2d');
      if (ctx1) {
        this.incomeChart = new Chart(ctx1, {
          type: 'bar',
          data: {
            labels: this.incomeItems.map(i => i.label),
            datasets: [
              {
                label: '2024',
                data: this.incomeItems.map(i => i.v2024),
                backgroundColor: '#94a3b8',
                borderRadius: 5
              },
              {
                label: '2025',
                data: this.incomeItems.map(i => i.v2025),
                backgroundColor: '#0284c7',
                borderRadius: 5
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
                  label: (ctx) => ` ${ctx.dataset.label}: Bs. ${Number(ctx.raw).toFixed(2)} M`
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
                ticks: { callback: (v) => `${v} M` }
              }
            }
          }
        });
      }
    }

    // 2. Rentabilidad % (Bar Chart)
    if (this.rentabilityRef?.nativeElement) {
      const ctx2 = this.rentabilityRef.nativeElement.getContext('2d');
      if (ctx2) {
        this.rentChart = new Chart(ctx2, {
          type: 'bar',
          data: {
            labels: this.rentabilityItems.map(i => i.label),
            datasets: [
              {
                label: '2024',
                data: this.rentabilityItems.map(i => i.v2024),
                backgroundColor: '#94a3b8',
                borderRadius: 5
              },
              {
                label: '2025',
                data: this.rentabilityItems.map(i => i.v2025),
                backgroundColor: '#059669',
                borderRadius: 5
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
                  label: (ctx) => ` ${ctx.dataset.label}: ${Number(ctx.raw).toFixed(2)}%`
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
                ticks: { callback: (v) => `${v}%` }
              }
            }
          }
        });
      }
    }
  }

  private updateCharts(): void {
    if (this.incomeChart) {
      this.incomeChart.data.labels = this.incomeItems.map(i => i.label);
      this.incomeChart.data.datasets[0].data = this.incomeItems.map(i => i.v2024);
      this.incomeChart.data.datasets[1].data = this.incomeItems.map(i => i.v2025);
      this.incomeChart.update();
    }
    if (this.rentChart) {
      this.rentChart.data.labels = this.rentabilityItems.map(i => i.label);
      this.rentChart.data.datasets[0].data = this.rentabilityItems.map(i => i.v2024);
      this.rentChart.data.datasets[1].data = this.rentabilityItems.map(i => i.v2025);
      this.rentChart.update();
    }
  }
}
