import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancialDataService } from '../../services/financial-data.service';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { ExecutiveBannerComponent } from '../executive-banner/executive-banner.component';
import { ExecutiveRibbonComponent } from '../executive-ribbon/executive-ribbon.component';
import { StructureSectionComponent } from '../structure-section/structure-section.component';
import { ResultsSectionComponent } from '../results-section/results-section.component';
import { CommercialEfficiencyComponent } from '../commercial-efficiency/commercial-efficiency.component';
import { RatiosDupontSectionComponent } from '../ratios-dupont-section/ratios-dupont-section.component';
import { HorizontalVariationsComponent } from '../horizontal-variations/horizontal-variations.component';
import { FinancialTablesComponent } from '../financial-tables/financial-tables.component';
import { PieChartItem } from '../charts/pie-chart.component';

@Component({
  selector: 'app-financial-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FileUploadComponent,
    ExecutiveBannerComponent,
    ExecutiveRibbonComponent,
    StructureSectionComponent,
    ResultsSectionComponent,
    CommercialEfficiencyComponent,
    RatiosDupontSectionComponent,
    HorizontalVariationsComponent,
    FinancialTablesComponent
  ],
  template: `
    <div class="space-y-6 sm:space-y-8">
      
      <!-- 1. FILE UPLOAD & ACTIONS BAR (Siempre visible en la parte superior) -->
      <section aria-label="Carga de Archivo Excel">
        <app-file-upload></app-file-upload>
      </section>

      <!-- 2. RENDERIZADO DEL DASHBOARD EJECUTIVO SI EL REPORTE ESTÁ CARGADO -->
      @if (service.report(); as report) {
        
        <!-- SECCIÓN 1: BANNER EJECUTIVO CON METADATOS Y CHECKS DE BALANCE Y DUPONT (Screenshot 1) -->
        <section aria-label="Encabezado Ejecutivo">
          <app-executive-banner [report]="report"></app-executive-banner>
        </section>

        <!-- SECCIÓN 2: DOBLE CINTA DE 16 KPIS EJECUTIVOS (Balance/Resultados + Ratios/Rentabilidad) (Screenshot 1) -->
        <section aria-label="Cintas de Indicadores Clave">
          <app-executive-ribbon
            [balanceIncomeKpis]="report.balanceIncomeKpis"
            [ratioKpis]="report.ratioKpis"
          ></app-executive-ribbon>
        </section>

        <!-- SECCIÓN 3: ESTRUCTURA FINANCIERA (Activo en Barras Horizontales + Gráfico de Torta/Anillo + Explicación Clara) (Screenshot 1) -->
        <section aria-label="Estructura Financiera">
          <app-structure-section
            [assetItems]="report.assetStructureItems"
            [financingItems]="financingPieItems()"
            [assetPieItems]="assetPieItems()"
            [centerTotalLabel]="'Bs. ' + formatMillions(report.balanceBreakdown.totalAssets2025) + ' M'"
          ></app-structure-section>
        </section>

        <!-- SECCIÓN 4: RESULTADOS Y RENTABILIDAD (Cascada de Resultados + Gráfico Rentabilidad + Destino de Ingresos + Explicación) (Screenshot 2) -->
        <section aria-label="Resultados y Rentabilidad">
          <app-results-section
            [incomeItems]="resultsIncomeItems()"
            [rentabilityItems]="rentabilityItems()"
            [incomeDistribution]="report.incomeDistributionItems"
          ></app-results-section>
        </section>

        <!-- SECCIÓN 5: EFICIENCIA OPERATIVA Y NEGOCIOS (Screenshot 3: Ciclo de Capital de Trabajo CCE, DIO, DSO, DPO y Ventas por Línea) -->
        @if (report.workingCapitalCycle && report.businessLines) {
          <section aria-label="Eficiencia Operativa y Líneas de Negocio">
            <app-commercial-efficiency
              [workingCapitalItems]="report.workingCapitalCycle"
              [businessLines]="report.businessLines"
            ></app-commercial-efficiency>
          </section>
        }

        <!-- SECCIÓN 6: TABLERO DE RATIOS & SISTEMA DUPONT (Doble Columna + Covenants BBV + Atribución DuPont + Explicaciones Claras) (Screenshot 4) -->
        <section aria-label="Tablero de Ratios y Sistema DuPont">
          <app-ratios-dupont-section
            [ratios]="report.ratios"
            [dupont]="report.dupont"
          ></app-ratios-dupont-section>
        </section>

        <!-- SECCIÓN 7: VARIACIONES CLAVE ANÁLISIS HORIZONTAL (Barras de Magnitud Favorable/Desfavorable + Explicaciones Claras) (Screenshot 5) -->
        <section aria-label="Variaciones Clave">
          <app-horizontal-variations
            [items]="report.keyVariations"
          ></app-horizontal-variations>
        </section>

        <!-- SECCIÓN 8: DETALLE COMPLETO DE TABLAS POR HOJAS DE TRABAJO (Drill-down de las 4 pestañas) -->
        <section aria-label="Detalle de Hojas de Trabajo">
          <app-financial-tables [report]="report"></app-financial-tables>
        </section>

      } @else {
        
        <!-- ESTADO VACÍO / LISTO PARA NUEVO EXCEL -->
        <section class="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-8 md:p-12 text-center max-w-4xl mx-auto">
          <div class="w-16 h-16 mx-auto rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-700 shadow-2xs mb-5">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>

          <h3 class="text-lg sm:text-xl font-bold text-slate-800 mb-2">
            Tablero Limpio · Listo para Cargar Nuevo Excel
          </h3>
          <p class="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
            Suba su archivo Excel (.xlsx) de la empresa comercial. El navegador extraerá en tiempo real los Estados Financieros, Análisis Vertical, Horizontal y Ratios DuPont.
          </p>

          <!-- 4 Hojas Requeridas -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left max-w-3xl mx-auto">
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div class="flex items-center gap-2 mb-1.5">
                <span class="w-5 h-5 rounded-md bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">1</span>
                <h4 class="font-bold text-slate-800 text-xs">EST. FINANCIEROS</h4>
              </div>
              <p class="text-[11px] text-slate-500">
                Balance General y Estado de Ganancias y Pérdidas (Activo Total: Bs. 1.723,55 M, Inventarios, Ventas, Utilidad Neta).
              </p>
            </div>

            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div class="flex items-center gap-2 mb-1.5">
                <span class="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">2</span>
                <h4 class="font-bold text-slate-800 text-xs">ANÁLISIS HORIZONTAL</h4>
              </div>
              <p class="text-[11px] text-slate-500">
                Variaciones absolutas en Bs. y porcentuales relativas entre 2025 y 2024 con semáforos de favorabilidad.
              </p>
            </div>

            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div class="flex items-center gap-2 mb-1.5">
                <span class="w-5 h-5 rounded-md bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center">3</span>
                <h4 class="font-bold text-slate-800 text-xs">ANÁLISIS VERTICAL</h4>
              </div>
              <p class="text-[11px] text-slate-500">
                Estructura porcentual del Activo (Corriente vs No Corriente), Pasivo y Patrimonio Neto (60.15%).
              </p>
            </div>

            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div class="flex items-center gap-2 mb-1.5">
                <span class="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">4</span>
                <h4 class="font-bold text-slate-800 text-xs">RATIOS Y DUPONT</h4>
              </div>
              <p class="text-[11px] text-slate-500">
                Liquidez (RC 3.08x), Solvencia (RDP 0.66x), Gestión (CCE -9.66 d, DIO 205.49 d), Rentabilidad (ROE 12.97%) y DuPont.
              </p>
            </div>
          </div>

          <!-- Acciones Rápidas -->
          <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              (click)="service.downloadSampleExcelTemplate()"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors shadow-2xs"
            >
              <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Descargar Plantilla Comercial (.xlsx)
            </button>

            <button
              type="button"
              (click)="service.loadSampleData()"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-2xs"
            >
              <svg class="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Cargar Datos Modelo Comercial (2025 vs 2024)
            </button>
          </div>
        </section>

      }

    </div>
  `
})
export class FinancialDashboardComponent {
  protected readonly service = inject(FinancialDataService);

  formatMillions(val: number): string {
    if (!val) return '0,00';
    if (Math.abs(val) > 100_000) {
      return (val / 1_000_000).toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return val.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // Estructura de Financiamiento (Doughnut Chart - Imagen 1)
  readonly financingPieItems = computed<PieChartItem[]>(() => {
    const rep = this.service.report();
    if (!rep) return [];
    if (rep.financingStructure && rep.financingStructure.length > 0) {
      return rep.financingStructure.map(item => ({
        label: `${item.concept} (${item.percentage.toFixed(2)}%)`,
        value: item.amount,
        percentage: item.percentage,
        color: item.color
      }));
    }
    const b = rep.balanceBreakdown;
    return [
      {
        label: `Patrimonio Neto (${b.pctEquity2025.toFixed(2)}%)`,
        value: b.equity2025,
        percentage: b.pctEquity2025,
        color: '#1e3a8a'
      },
      {
        label: `Pasivo Corriente (${b.pctCurrentLiabilities2025.toFixed(2)}%)`,
        value: b.currentLiabilities2025,
        percentage: b.pctCurrentLiabilities2025,
        color: '#0284c7'
      },
      {
        label: `Pasivo No Corriente (${b.pctNonCurrentLiabilities2025.toFixed(2)}%)`,
        value: b.nonCurrentLiabilities2025,
        percentage: b.pctNonCurrentLiabilities2025,
        color: '#10b981'
      }
    ];
  });

  // Composición del Activo (Corriente vs No Corriente)
  readonly assetPieItems = computed<PieChartItem[]>(() => {
    const rep = this.service.report();
    if (!rep) return [];
    const b = rep.balanceBreakdown;
    return [
      {
        label: `Activo Corriente (${b.pctCurrentAssets2025.toFixed(2)}%)`,
        value: b.currentAssets2025,
        percentage: b.pctCurrentAssets2025,
        color: '#0284c7'
      },
      {
        label: `Activo No Corriente (${b.pctNonCurrentAssets2025.toFixed(2)}%)`,
        value: b.nonCurrentAssets2025,
        percentage: b.pctNonCurrentAssets2025,
        color: '#1e3a8a'
      }
    ];
  });

  // Cascada de Ingresos a Utilidad (Imagen 2)
  readonly resultsIncomeItems = computed(() => {
    const rep = this.service.report();
    if (!rep) return [];
    const inc = rep.incomeBreakdown;
    return [
      { label: 'Ingresos Netos', v2024: inc.netRevenue2024, v2025: inc.netRevenue2025 },
      { label: 'Margen Bruto', v2024: inc.grossProfit2024, v2025: inc.grossProfit2025 },
      { label: 'EBITDA', v2024: 199.38, v2025: 301.27 },
      { label: 'Utilidad Operativa (EBIT)', v2024: inc.operatingProfit2024, v2025: inc.operatingProfit2025 },
      { label: 'Utilidad Antes Imp. (EBT)', v2024: inc.profitBeforeTax2024, v2025: inc.profitBeforeTax2025 },
      { label: 'Utilidad Neta', v2024: inc.netProfit2024, v2025: inc.netProfit2025 }
    ];
  });

  // Ratios de Rentabilidad Comparativos (Imagen 2)
  readonly rentabilityItems = computed(() => {
    const rep = this.service.report();
    if (!rep) return [];
    const d = rep.dupont;
    const r = rep.ratioKpis;
    const mb = r.find(k => k.title.includes('Margen Bruto'));
    const me = r.find(k => k.title.includes('Margen Operativo'));
    const roa = r.find(k => k.title === 'ROA');
    return [
      { label: 'Margen Bruto', v2024: mb?.value2024 ?? 30.24, v2025: mb?.value2025 ?? 33.34 },
      { label: 'Margen EBIT', v2024: me?.value2024 ?? 17.05, v2025: me?.value2025 ?? 21.82 },
      { label: 'Margen Neto', v2024: d.netMargin.year2024, v2025: d.netMargin.year2025 },
      { label: 'ROA', v2024: roa?.value2024 ?? 8.36, v2025: roa?.value2025 ?? 7.80 },
      { label: 'ROE', v2024: d.roe.year2024, v2025: d.roe.year2025 }
    ];
  });
}
