import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancialDataService } from '../../services/financial-data.service';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 md:p-6 transition-all">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-sky-100 text-sky-700">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
            <h2 class="text-lg font-bold text-slate-900 tracking-tight">Carga de Estados Financieros</h2>
            <span class="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
              Browser-Only (Sin Backend)
            </span>
          </div>
          <p class="text-xs text-slate-500 mt-1">
            Sube el archivo Excel (.xlsx) con las 4 pestañas: <span class="font-semibold text-slate-700">ESTADOS FINANCIEROS</span>, <span class="font-semibold text-slate-700">ANÁLISIS HORIZONTAL</span>, <span class="font-semibold text-slate-700">ANÁLISIS VERTICAL</span> y <span class="font-semibold text-slate-700">RATIOS Y DUPONT</span>.
          </p>
        </div>

        <!-- Action buttons -->
        <div class="flex flex-wrap items-center gap-2 self-start lg:self-center">
          @if (service.report() !== null) {
            <button
              type="button"
              (click)="clearAllData()"
              title="Limpiar todos los datos para subir un nuevo archivo"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors shadow-2xs"
            >
              <svg class="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Limpiar Datos / Nuevo Excel
            </button>
          }

          <button
            type="button"
            (click)="downloadTemplate()"
            title="Descargar archivo Excel con la plantilla exacta"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors"
          >
            <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Descargar Plantilla (.xlsx)
          </button>

          <button
            type="button"
            (click)="loadDemo()"
            title="Cargar los datos del modelo 2025 vs 2024"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-white bg-slate-800 hover:bg-slate-900 transition-colors"
          >
            <svg class="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Cargar Datos Modelo
          </button>
        </div>
      </div>

      <!-- Drag & Drop Zone -->
      <div
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
        (click)="fileInput.click()"
        [class.border-sky-500]="isDragging()"
        [class.bg-sky-50]="isDragging()"
        class="relative border-2 border-dashed border-slate-300 hover:border-sky-500 bg-slate-50/70 hover:bg-sky-50/40 rounded-xl p-7 text-center cursor-pointer transition-all duration-200 group"
      >
        <input
          #fileInput
          type="file"
          accept=".xlsx, .xls"
          (change)="onFileSelected($event)"
          class="hidden"
        />

        <div class="flex flex-col items-center justify-center space-y-2">
          <div class="w-14 h-14 rounded-2xl bg-sky-100/90 group-hover:bg-sky-200 group-hover:scale-105 flex items-center justify-center text-sky-700 transition-all duration-200 shadow-2xs">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <span class="text-base font-bold text-slate-800 group-hover:text-sky-700 transition-colors">
              Arrastra y suelta tu nuevo archivo Excel aquí
            </span>
            <span class="text-sm text-slate-500"> o </span>
            <span class="text-sm font-semibold text-sky-600 underline">haz clic para examinar</span>
          </div>
          <p class="text-xs text-slate-400">
            Formatos soportados: Microsoft Excel (.xlsx, .xls) — Procesamiento 100% en memoria en tu navegador
          </p>
        </div>
      </div>

      <!-- Current File Status Bar -->
      <div class="mt-3 flex flex-wrap items-center justify-between text-xs text-slate-500 bg-slate-100/70 rounded-lg px-3 py-2 border border-slate-200">
        @if (service.report() !== null && service.currentFileName()) {
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Archivo activo:</span>
            <span class="font-semibold text-slate-800">{{ service.currentFileName() }}</span>
            @if (service.hasUploadedFile()) {
              <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800">
                Archivo Cargado
              </span>
            } @else {
              <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                Demo
              </span>
            }
          </div>
          <div class="flex items-center gap-3">
            <span>Hojas requeridas: 4/4 detectadas</span>
            <span class="text-slate-400">•</span>
            <span>Moneda: {{ service.report()?.currency }}</span>
          </div>
        } @else {
          <div class="flex items-center gap-2 text-slate-600">
            <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span class="font-medium">Tablero en blanco — Esperando carga de un archivo Excel para procesar los datos</span>
          </div>
          <div class="text-slate-400">
            Formatos: .xlsx / .xls
          </div>
        }
      </div>

      <!-- Alerts -->
      @if (service.successMessage()) {
        <div class="mt-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>{{ service.successMessage() }}</span>
        </div>
      }

      @if (service.errorMessage()) {
        <div class="mt-3 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
          <svg class="w-4 h-4 text-rose-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ service.errorMessage() }}</span>
        </div>
      }
    </div>
  `
})
export class FileUploadComponent {
  protected readonly service = inject(FinancialDataService);
  protected readonly isDragging = signal<boolean>(false);

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.handleFile(file);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.handleFile(file);
    }
    // reset input value so re-uploading the same file works
    input.value = '';
  }

  private handleFile(file: File): void {
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      this.service.errorMessage.set('Por favor selecciona un archivo con extensión .xlsx o .xls');
      return;
    }
    this.service.processExcelFile(file);
  }

  clearAllData(): void {
    this.service.clearData();
  }

  downloadTemplate(): void {
    this.service.downloadSampleExcelTemplate();
  }

  loadDemo(): void {
    this.service.loadSampleData();
  }
}
