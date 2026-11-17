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
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export interface BarChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderRadius?: number;
  }[];
}

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col h-full justify-between">
      <!-- Header -->
      <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h4 class="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
            Evolución de Resultados: Gestión 2025 vs 2024
          </h4>
          <p class="text-xs text-slate-500 mt-0.5">
            Comparativa de Ingresos Netos, Costos Operativos, Margen Bruto y Utilidades (EST. FINANCIEROS)
          </p>
        </div>

        <!-- Custom Legend Pills -->
        <div class="flex items-center gap-3 text-xs">
          <div class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded bg-slate-400"></span>
            <span class="text-slate-600 font-medium">Gestión 2024</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded bg-sky-600"></span>
            <span class="text-slate-800 font-bold">Gestión 2025</span>
          </div>
        </div>
      </div>

      <!-- Chart Canvas Container -->
      <div class="relative w-full" [style.height.px]="chartHeight">
        <canvas #barCanvas></canvas>
      </div>

      <!-- Financial Takeaway Pills -->
      <div class="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-2">
        <div class="p-2 rounded-lg bg-sky-50/70 border border-sky-100 text-center">
          <span class="text-[10px] font-bold uppercase tracking-wider text-sky-700">Crecimiento Ventas</span>
          <p class="text-xs font-bold text-sky-950 mt-0.5">+24.41%</p>
          <span class="text-[10px] text-sky-700">+Bs. 238.5 M</span>
        </div>

        <div class="p-2 rounded-lg bg-indigo-50/70 border border-indigo-100 text-center">
          <span class="text-[10px] font-bold uppercase tracking-wider text-indigo-700">Margen Bruto</span>
          <p class="text-xs font-bold text-indigo-950 mt-0.5">+37.18%</p>
          <span class="text-[10px] text-indigo-700">Bs. 405.3 M</span>
        </div>

        <div class="p-2 rounded-lg bg-emerald-50/70 border border-emerald-100 text-center">
          <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Utilidad Operativa</span>
          <p class="text-xs font-bold text-emerald-950 mt-0.5">+59.25%</p>
          <span class="text-[10px] text-emerald-700">Bs. 265.2 M</span>
        </div>

        <div class="p-2 rounded-lg bg-teal-50/70 border border-teal-100 text-center">
          <span class="text-[10px] font-bold uppercase tracking-wider text-teal-700">Utilidad Neta</span>
          <p class="text-xs font-bold text-teal-950 mt-0.5">+6.30%</p>
          <span class="text-[10px] text-teal-700">Bs. 134.4 M</span>
        </div>
      </div>
    </div>
  `
})
export class BarChartComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('barCanvas') private canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() data: BarChartData = { labels: [], datasets: [] };
  @Input() chartHeight: number = 280;

  private chartInstance: Chart | null = null;
  private readonly platformId = inject(PLATFORM_ID);

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initChart();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].isFirstChange()) {
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

    this.chartInstance = new Chart(ctx, {
      type: 'bar',
      data: this.data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 750
        },
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleFont: { size: 12, weight: 'bold' },
            bodyFont: { size: 12 },
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || '';
                const val = (context.raw as number) || 0;
                return ` ${label}: Bs. ${val.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: { size: 11, weight: 'bold' },
              color: '#475569'
            }
          },
          y: {
            grid: {
              color: '#f1f5f9'
            },
            ticks: {
              color: '#64748b',
              font: { size: 11 },
              callback: (value) => {
                const num = Number(value);
                if (Math.abs(num) >= 1_000_000) {
                  return (num / 1_000_000).toFixed(2) + ' M';
                }
                return num.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
              }
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
    this.chartInstance.data = this.data;
    this.chartInstance.update();
  }
}
