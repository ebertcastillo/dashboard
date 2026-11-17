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
  DoughnutController,
  PieController,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Register only needed Chart.js components for optimal bundle size
Chart.register(DoughnutController, PieController, ArcElement, Tooltip, Legend);

export interface PieChartItem {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

@Component({
  selector: 'app-pie-doughnut-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col h-full justify-between">
      <!-- Title & Subtitle -->
      <div class="mb-4">
        <div class="flex items-center justify-between">
          <h4 class="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full" [style.backgroundColor]="accentColor"></span>
            {{ title }}
          </h4>
          <span class="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
            Gestión 2025
          </span>
        </div>
        <p class="text-xs text-slate-500 mt-0.5">{{ subtitle }}</p>
      </div>

      <!-- Chart Canvas Container -->
      <div class="relative flex items-center justify-center my-2" [style.height.px]="chartHeight">
        <canvas #chartCanvas></canvas>

        <!-- Center Total Text for Doughnut -->
        @if (isDoughnut && centerLabel) {
          <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total</span>
            <span class="text-sm font-extrabold text-slate-800 tracking-tight">{{ centerLabel }}</span>
          </div>
        }
      </div>

      <!-- Custom Structured Legend Table -->
      <div class="mt-4 pt-3 border-t border-slate-100 space-y-2">
        @for (item of items; track item.label) {
          <div class="flex items-center justify-between text-xs py-1 px-1.5 rounded-lg hover:bg-slate-50 transition-colors">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-md shrink-0 shadow-xs" [style.backgroundColor]="item.color"></span>
              <span class="font-medium text-slate-700">{{ item.label }}</span>
            </div>
            <div class="flex items-center gap-3 text-right">
              <span class="font-semibold text-slate-900">
                Bs. {{ formatMillions(item.value) }}
              </span>
              <span
                class="px-2 py-0.5 rounded-md font-bold text-[11px] min-w-[50px] text-right"
                [style.backgroundColor]="item.color + '18'"
                [style.color]="item.color"
              >
                {{ item.percentage.toFixed(2) }}%
              </span>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class PieDoughnutChartComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('chartCanvas') private canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() items: PieChartItem[] = [];
  @Input() isDoughnut: boolean = true;
  @Input() centerLabel: string = '';
  @Input() accentColor: string = '#0284c7';
  @Input() chartHeight: number = 210;

  private chartInstance: Chart | null = null;
  private readonly platformId = inject(PLATFORM_ID);

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initChart();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items'] && !changes['items'].isFirstChange()) {
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

    const labels = this.items.map(i => i.label);
    const data = this.items.map(i => i.value);
    const colors = this.items.map(i => i.color);

    this.chartInstance = new Chart(ctx, {
      type: this.isDoughnut ? 'doughnut' : 'pie',
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: colors,
            borderColor: '#ffffff',
            borderWidth: 2,
            hoverOffset: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: this.isDoughnut ? '68%' : '0%',
        animation: {
          duration: 750
        },
        plugins: {
          legend: {
            display: false // We use our superior corporate custom table legend below
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleFont: { size: 12, weight: 'bold' },
            bodyFont: { size: 12 },
            padding: 10,
            cornerRadius: 8,
            boxPadding: 4,
            callbacks: {
              label: (context) => {
                const item = this.items[context.dataIndex];
                const formatted = item.value.toLocaleString('es-BO');
                return ` ${item.label}: Bs. ${formatted} (${item.percentage.toFixed(2)}%)`;
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

    this.chartInstance.data.labels = this.items.map(i => i.label);
    this.chartInstance.data.datasets[0].data = this.items.map(i => i.value);
    this.chartInstance.data.datasets[0].backgroundColor = this.items.map(i => i.color);
    this.chartInstance.update();
  }

  formatMillions(val: number): string {
    if (!val) return '0';
    if (Math.abs(val) >= 1_000_000_000) {
      return (val / 1_000_000_000).toFixed(2) + ' M.M.';
    }
    if (Math.abs(val) >= 1_000_000) {
      return (val / 1_000_000).toFixed(2) + ' M';
    }
    return val.toLocaleString('es-BO');
  }
}
