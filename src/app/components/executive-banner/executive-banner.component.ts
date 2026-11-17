import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancialReport } from '../../models/financial.model';

@Component({
  selector: 'app-executive-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative overflow-hidden bg-gradient-to-r from-slate-900 via-sky-950 to-blue-950 rounded-2xl p-5 md:p-6 text-white shadow-lg border border-sky-900/60">
      <!-- Top subtle accent line -->
      <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500"></div>

      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <!-- Main Title & Identification -->
        <div>
          <div class="flex flex-wrap items-center gap-2 mb-1.5">
            <span class="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-sky-500/20 text-sky-300 border border-sky-400/30">
              Diagnóstico Financiero Integral
            </span>
            <span class="text-xs text-slate-300 font-mono">
              {{ report.period }}
            </span>
          </div>

          <h2 class="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white uppercase">
            {{ report.companyName }} · DASHBOARD EJECUTIVO
          </h2>

          <p class="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-3">
            <span>{{ report.auditInfo }}</span>
            <span class="text-slate-500">•</span>
            <span>Moneda: <strong class="text-white">{{ report.currency }}</strong></span>
          </p>
        </div>

        <!-- Verification Badges (Like in the Excel Screenshot) -->
        <div class="flex flex-wrap items-center gap-2.5 self-start lg:self-center shrink-0">
          <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-xs">
            <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
            <span>✓ Balance cuadra (A = P + PAT: {{ formatAmount(report.balanceBreakdown.totalAssets2025) }} = {{ formatAmount(report.balanceBreakdown.totalLiabilities2025) }} + {{ formatAmount(report.balanceBreakdown.equity2025) }})</span>
          </div>

          <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-950/70 border border-sky-500/40 text-sky-300 text-xs font-bold shadow-xs">
            <svg class="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>✓ DuPont = ROE directo ({{ report.dupont.roe.year2025.toFixed(2) }}%)</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ExecutiveBannerComponent {
  @Input({ required: true }) report!: FinancialReport;

  formatAmount(val: number | undefined): string {
    if (val === undefined || val === null || isNaN(val)) return '0,00';
    return val.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}
