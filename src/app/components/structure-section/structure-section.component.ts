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
  PLATFORM_ID,
  signal
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { PieDoughnutChartComponent, PieChartItem } from '../charts/pie-chart.component';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

@Component({
  selector: 'app-structure-section',
  standalone: true,
  imports: [CommonModule, PieDoughnutChartComponent],
  template: `
    <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 md:p-6 transition-all">
      <!-- Section Title Header (as in Excel Image 1) -->
      <div class="border-b border-slate-200 pb-3 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 class="text-sm sm:text-base font-extrabold uppercase tracking-wide text-blue-950 flex items-center gap-2">
            <span class="w-3 h-3 rounded-sm bg-blue-900"></span>
            Estructura Financiera · de qué está hecho el activo y cómo se financia
          </h3>
          <p class="text-xs text-slate-500 mt-0.5">
            Distribución operativa de los recursos económicos y composición de las fuentes de financiamiento
          </p>
        </div>

        <span class="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 self-start sm:self-auto">
          Hoja: ANÁLISIS VERTICAL
        </span>
      </div>

      <!-- Two-column Grid: Left Asset Horizontal Bars, Right Financing Doughnut -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <!-- LEFT: ESTRUCTURA DEL ACTIVO (HORIZONTAL BARS) -->
        <div class="lg:col-span-7 flex flex-col justify-between h-full">
          <div>
            <div class="flex items-center justify-between mb-2">
              <h4 class="text-xs sm:text-sm font-bold text-slate-800">
                Estructura del activo (Bs. millones)
              </h4>
              <div class="flex items-center gap-3 text-[11px]">
                <span class="flex items-center gap-1 font-semibold text-slate-600">
                  <span class="w-2.5 h-2.5 rounded-sm bg-slate-400"></span> 2024
                </span>
                <span class="flex items-center gap-1 font-bold text-sky-900">
                  <span class="w-2.5 h-2.5 rounded-sm bg-sky-700"></span> 2025
                </span>
              </div>
            </div>
            <p class="text-[11px] text-slate-500 mb-3">
              Comparativa de las principales cuentas de activo (Gestión 2025 vs 2024)
            </p>
          </div>

          <div class="relative w-full" style="height: 300px;">
            <canvas #horizontalAssetCanvas></canvas>
          </div>
        </div>

        <!-- RIGHT: ESTRUCTURA DE FINANCIAMIENTO / COMPOSICIÓN DE ACTIVOS (DOUGHNUT) -->
        <div class="lg:col-span-5 bg-slate-50/60 rounded-xl p-4 border border-slate-200 flex flex-col justify-between h-full">
          <!-- Toggle entre Pasivo vs Patrimonio y Activo Corriente vs No Corriente -->
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Gráfico de Torta / Anillo
            </span>
            <div class="inline-flex rounded-lg bg-slate-200/80 p-0.5 text-[11px] font-semibold">
              <button 
                type="button"
                (click)="activeDonut.set('financing')"
                [class.bg-white]="activeDonut() === 'financing'"
                [class.text-blue-900]="activeDonut() === 'financing'"
                [class.shadow-2xs]="activeDonut() === 'financing'"
                [class.text-slate-600]="activeDonut() !== 'financing'"
                class="px-2.5 py-1 rounded-md transition-all">
                Pasivo y Patrimonio
              </button>
              <button 
                type="button"
                (click)="activeDonut.set('asset')"
                [class.bg-white]="activeDonut() === 'asset'"
                [class.text-blue-900]="activeDonut() === 'asset'"
                [class.shadow-2xs]="activeDonut() === 'asset'"
                [class.text-slate-600]="activeDonut() !== 'asset'"
                class="px-2.5 py-1 rounded-md transition-all">
                Activo Corriente / No C.
              </button>
            </div>
          </div>

          @if (activeDonut() === 'financing') {
            <app-pie-doughnut-chart
              title="Estructura de financiamiento · Dic. 2025"
              subtitle="% del total de activos financiado por terceros vs socios"
              [items]="financingItems"
              [isDoughnut]="true"
              [centerLabel]="centerTotalLabel"
              accentColor="#059669"
              [chartHeight]="210"
            ></app-pie-doughnut-chart>
          } @else {
            <app-pie-doughnut-chart
              title="Composición del Activo · Dic. 2025"
              subtitle="Activo Corriente vs Activo No Corriente"
              [items]="assetPieItems"
              [isDoughnut]="true"
              [centerLabel]="centerTotalLabel"
              accentColor="#0284c7"
              [chartHeight]="210"
            ></app-pie-doughnut-chart>
          }
        </div>

      </div>

      <!-- EXPLICACIÓN CLARA AL PIE DE LA ESTRUCTURA FINANCIERA -->
      <div class="mt-5 p-4 rounded-xl bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 text-xs text-slate-700 flex items-start gap-3">
        <div class="w-6 h-6 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0 mt-0.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <strong class="font-bold text-slate-900">Explicación Clara de la Estructura: </strong>
          El activo total creció <span class="font-semibold text-sky-900">+13.98%</span>, apoyado por una fuerte inyección de liquidez en inversiones temporarias (Bs. 538.34M, 31.23% del total) y una rápida rotación de inventarios. En cuanto al financiamiento, la empresa mantiene un perfil altamente conservador y solvente: el <span class="font-bold text-emerald-800">60.15% del negocio se financia con patrimonio propio</span>, mientras que los pasivos totales solo representan el 39.85%, minimizando riesgos de liquidez o endeudamiento ante contingencias del mercado.
        </div>
      </div>
    </div>
  `
})
export class StructureSectionComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('horizontalAssetCanvas') private canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() assetItems: { name: string; val2025: number; val2024: number; pct2025: number }[] = [];
  @Input() financingItems: PieChartItem[] = [];
  @Input() assetPieItems: PieChartItem[] = [];
  @Input() centerTotalLabel: string = 'Bs. 1.723,55 M';

  readonly activeDonut = signal<'financing' | 'asset'>('financing');

  private chartInstance: Chart | null = null;
  private readonly platformId = inject(PLATFORM_ID);

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initChart();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['assetItems'] && !changes['assetItems'].isFirstChange()) {
      this.updateChart();
    }
  }

  ngOnDestroy(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }
  }

  private initChart(): void {
    if (!this.canvasRef?.nativeElement) return;
    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const labels = this.assetItems.map(i => i.name);
    const data2024 = this.assetItems.map(i => i.val2024);
    const data2025 = this.assetItems.map(i => i.val2025);

    this.chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: '2024',
            data: data2024,
            backgroundColor: '#94a3b8',
            borderRadius: 4,
            barPercentage: 0.7,
            categoryPercentage: 0.8
          },
          {
            label: '2025',
            data: data2025,
            backgroundColor: '#0369a1',
            borderRadius: 4,
            barPercentage: 0.7,
            categoryPercentage: 0.8
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 400 },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                const val = Number(context.raw) || 0;
                return ` ${context.dataset.label}: Bs. ${val.toFixed(2)} M`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: '#f1f5f9' },
            ticks: {
              color: '#64748b',
              font: { size: 10 },
              callback: (value) => `${value}`
            }
          },
          y: {
            grid: { display: false },
            ticks: {
              color: '#1e293b',
              font: { size: 10, weight: 600 }
            }
          }
        }
      }
    });
  }

  private updateChart(): void {
    if (!this.chartInstance) {
      this.initChart();
      return;
    }
    this.chartInstance.data.labels = this.assetItems.map(i => i.name);
    this.chartInstance.data.datasets[0].data = this.assetItems.map(i => i.val2024);
    this.chartInstance.data.datasets[1].data = this.assetItems.map(i => i.val2025);
    this.chartInstance.update();
  }
}
