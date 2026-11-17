import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancialDataService } from '../../services/financial-data.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white shadow-md border-b border-sky-900/40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 sm:h-20">
          
          <!-- Logo & Brand Title -->
          <div class="flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-400 p-0.5 shadow-md shadow-sky-900/30 flex items-center justify-center">
              <div class="w-full h-full bg-slate-900/60 rounded-[10px] flex items-center justify-center">
                <svg class="w-5 h-5 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h1 class="text-lg sm:text-xl font-black tracking-tight text-white">
                  FINANCIAL INTELLIGENCE
                </h1>
                <span class="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-sky-900/80 text-sky-300 border border-sky-700/60 uppercase">
                  v2.5 PRO
                </span>
              </div>
              <p class="text-xs text-slate-300 font-medium tracking-tight">
                Tablero de Control Financiero & Análisis DuPont
              </p>
            </div>
          </div>

          <!-- Right: Team Members Modal trigger & Quick Actions -->
          <div class="flex items-center gap-2.5">
            <!-- Team button -->
            <button
              type="button"
              (click)="showTeamModal.set(true)"
              title="Ver integrantes del grupo"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 border border-sky-400/30 transition-colors shadow-2xs"
            >
              <svg class="w-4 h-4 text-sky-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span class="hidden md:inline">Integrantes</span>
              <span class="w-5 h-5 rounded-full bg-sky-600 text-white text-[10px] font-bold flex items-center justify-center">4</span>
            </button>

            @if (service.report(); as rep) {
              <div class="hidden lg:flex flex-col text-right">
                <span class="text-xs font-bold text-white tracking-wide">
                  {{ rep.companyName }}
                </span>
                <span class="text-[11px] text-slate-300 font-medium">
                  {{ rep.period }}
                </span>
              </div>

              <button
                type="button"
                (click)="service.clearData()"
                title="Limpiar datos y preparar el tablero para un nuevo Excel"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-400/30 transition-colors"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span class="hidden sm:inline">Limpiar</span>
              </button>

              <button
                type="button"
                (click)="printDashboard()"
                title="Imprimir o Guardar como PDF"
                class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-xs transition-colors"
              >
                <svg class="w-4 h-4 text-sky-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span>Imprimir / PDF</span>
              </button>
            }
          </div>

        </div>
      </div>
    </header>

    <!-- Modal Integrantes del Grupo -->
    @if (showTeamModal()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <div class="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
          <div class="flex items-center justify-between pb-4 border-b border-slate-100">
            <div class="flex items-center gap-2.5">
              <span class="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </span>
              <div>
                <h3 class="text-base font-bold text-slate-900">Integrantes del Grupo</h3>
                <p class="text-xs text-slate-500">Proyecto: Dashboard Financiero Interactivo</p>
              </div>
            </div>
            <button
              type="button"
              (click)="showTeamModal.set(false)"
              class="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- List of members -->
          <div class="mt-4 space-y-2.5">
            @for (m of teamMembers; track m.id) {
              <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-slate-800 text-white font-bold text-xs flex items-center justify-center">
                    {{ m.id }}
                  </div>
                  <div>
                    <h4 class="text-xs font-bold text-slate-900">{{ m.name }}</h4>
                    <p class="text-[11px] text-slate-500">Integrante del equipo</p>
                  </div>
                </div>
                <span class="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-white border border-slate-200 text-slate-700">
                  C.I. {{ m.ci }}
                </span>
              </div>
            }
          </div>

          <div class="mt-6 flex justify-end">
            <button
              type="button"
              (click)="showTeamModal.set(false)"
              class="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class NavbarComponent {
  protected readonly service = inject(FinancialDataService);
  readonly showTeamModal = signal<boolean>(false);

  readonly teamMembers = [
    { id: 1, name: 'Ebert Castillo Cortez', ci: '5959351 LP' },
    { id: 2, name: 'Liz Yesenia Camacho Chamizo', ci: '6874190 LP' },
    { id: 3, name: 'Luis Edwin Mamani Saisa', ci: '4923188 LP' },
    { id: 4, name: 'Samuel Jonathan Pasquier Rios', ci: '12764087 LP' }
  ];

  printDashboard(): void {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }
}
